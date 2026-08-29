"""Create a standalone Enterprise or MSP parent organization."""

import json
import os
import re
import time
import uuid

import boto3
from botocore.exceptions import ClientError

DDB = boto3.client("dynamodb")
TABLE = os.environ["ORG_DIRECTORY_TABLE"]
ALLOWED_PLANS = {"starter", "professional", "guided", "msp"}


def reply(status, payload):
    return {"statusCode": status, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "https://app.cualleecyber.com"}, "body": json.dumps(payload)}


def get_claims(event):
    auth = event.get("requestContext", {}).get("authorizer", {})
    return auth.get("claims", {}) or auth.get("jwt", {}).get("claims", {})


def lambda_handler(event, context):
    try:
        actor = get_claims(event)
        user_sub = actor.get("sub")
        if not user_sub:
            return reply(403, {"error": "Authenticated user identity is missing."})
        data = json.loads(event.get("body") or "{}")
        name = str(data.get("name") or "").strip()
        domain = str(data.get("domain") or "").strip().lower()
        plan = str(data.get("planCode") or "").strip().lower()
        if len(name) < 2 or len(name) > 160:
            return reply(400, {"error": "Organization name must contain 2 to 160 characters."})
        if plan not in ALLOWED_PLANS:
            return reply(400, {"error": "A valid subscription plan is required."})
        if domain and not re.fullmatch(r"[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+", domain):
            return reply(400, {"error": "A valid organization domain is required."})

        org_id = f"org_{uuid.uuid4().hex[:12]}"
        now = str(int(time.time()))
        is_msp = plan == "msp"
        tenant_type = "MSP" if is_msp else "ENTERPRISE"
        relationship = "PARENT" if is_msp else "STANDALONE"
        meta = {
            "PK": {"S": f"ORG#{org_id}"}, "SK": {"S": "META"},
            "entityType": {"S": "ORGANIZATION"}, "orgId": {"S": org_id}, "orgName": {"S": name},
            "domain": {"S": domain}, "planCode": {"S": plan}, "tenantType": {"S": tenant_type},
            "edition": {"S": tenant_type}, "relationshipType": {"S": relationship},
            "isParent": {"BOOL": is_msp}, "status": {"S": "ACTIVE"}, "createdAt": {"N": now}, "createdBy": {"S": user_sub},
        }
        member = {
            "PK": {"S": f"ORG#{org_id}"}, "SK": {"S": f"MEMBER#{user_sub}"},
            "entityType": {"S": "MEMBERSHIP"}, "orgId": {"S": org_id}, "userSub": {"S": user_sub},
            "role": {"S": "MSP_OWNER" if is_msp else "Tenant_Admin"}, "status": {"S": "ACTIVE"}, "createdAt": {"N": now},
        }
        reverse = {
            "PK": {"S": f"USER#{user_sub}"}, "SK": {"S": f"ORG#{org_id}"},
            "entityType": {"S": "USER_ORG_MEMBERSHIP"}, "orgId": {"S": org_id}, "orgName": {"S": name},
            "role": member["role"], "tenantType": {"S": tenant_type}, "edition": {"S": tenant_type},
            "planCode": {"S": plan}, "relationshipType": {"S": relationship}, "isParent": {"BOOL": is_msp},
            "status": {"S": "ACTIVE"}, "createdAt": {"N": now},
        }
        DDB.transact_write_items(TransactItems=[
            {"Put": {"TableName": TABLE, "Item": meta, "ConditionExpression": "attribute_not_exists(PK)"}},
            {"Put": {"TableName": TABLE, "Item": member, "ConditionExpression": "attribute_not_exists(PK)"}},
            {"Put": {"TableName": TABLE, "Item": reverse, "ConditionExpression": "attribute_not_exists(PK)"}},
        ])
        return reply(201, {"orgId": org_id, "name": name, "planCode": plan, "tenantType": tenant_type, "edition": tenant_type, "relationshipType": relationship, "isParent": is_msp})
    except (ValueError, json.JSONDecodeError):
        return reply(400, {"error": "Request body must be valid JSON."})
    except ClientError as error:
        print(json.dumps({"code": error.response.get("Error", {}).get("Code"), "requestId": getattr(context, "aws_request_id", None)}))
        return reply(500, {"error": "Organization creation failed.", "requestId": getattr(context, "aws_request_id", None)})

