"""MSP organization hierarchy and delegated-access API.

API Gateway routes:
  GET  /orgs/{parentOrgId}/clients
  POST /orgs/{parentOrgId}/clients
  POST /orgs/{orgId}/invitations
  POST /invitations/accept

Required environment:
  ORG_DIRECTORY_TABLE
Optional:
  INVITATION_FROM_EMAIL, APP_BASE_URL, RETURN_INVITE_TOKEN

OrgDirectory keys:
  ORG#{orgId} / META
  ORG#{orgId} / MEMBER#{userSub}
  USER#{userSub} / ORG#{orgId}
  ORG#{parentOrgId} / CLIENT#{clientOrgId}
  INVITE#{sha256(token)} / META
  ORG#{orgId} / INVITE#{sha256(token)}
"""

import hashlib
import json
import os
import re
import secrets
import time
import uuid
from typing import Any

import boto3
from botocore.exceptions import ClientError

DDB = boto3.client("dynamodb")
SES = boto3.client("ses")
TABLE = os.environ["ORG_DIRECTORY_TABLE"]
APP_BASE_URL = os.environ.get("APP_BASE_URL", "https://app.cualleecyber.com")
FROM_EMAIL = os.environ.get("INVITATION_FROM_EMAIL", "")
RETURN_TOKEN = os.environ.get("RETURN_INVITE_TOKEN", "false").lower() == "true"

MSP_ADMIN_ROLES = {"MSP_OWNER", "MSP_ADMIN", "Tenant_Admin", "Application_Administrator"}
INVITABLE_ROLES = {
    "CLIENT_EXECUTIVE",
    "CLIENT_ADMIN",
    "CLIENT_COMPLIANCE_LEAD",
    "CLIENT_CONTROL_OWNER",
    "CLIENT_EVIDENCE_CONTRIBUTOR",
    "CLIENT_READ_ONLY",
    "AUDITOR",
}


def response(status: int, body: dict) -> dict:
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://app.cualleecyber.com",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        },
        "body": json.dumps(body),
    }


def claims(event: dict) -> dict:
    return (
        event.get("requestContext", {})
        .get("authorizer", {})
        .get("claims", {})
    ) or (
        event.get("requestContext", {})
        .get("authorizer", {})
        .get("jwt", {})
        .get("claims", {})
    )


def body(event: dict) -> dict:
    raw = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
        import base64
        raw = base64.b64decode(raw).decode("utf-8")
    return json.loads(raw) if isinstance(raw, str) else raw


def route(event: dict) -> tuple[str, str]:
    method = (
        event.get("requestContext", {}).get("http", {}).get("method")
        or event.get("httpMethod")
        or ""
    ).upper()
    path = (
        event.get("rawPath")
        or event.get("path")
        or ""
    )
    return method, path.rstrip("/") or "/"


def get_s(item: dict, key: str, default: str = "") -> str:
    return item.get(key, {}).get("S", default)


def get_org(org_id: str) -> dict | None:
    result = DDB.get_item(
        TableName=TABLE,
        Key={"PK": {"S": f"ORG#{org_id}"}, "SK": {"S": "META"}},
        ConsistentRead=True,
    )
    return result.get("Item")


def require_membership(org_id: str, user_sub: str, allowed_roles: set[str]) -> dict:
    result = DDB.get_item(
        TableName=TABLE,
        Key={"PK": {"S": f"ORG#{org_id}"}, "SK": {"S": f"MEMBER#{user_sub}"}},
        ConsistentRead=True,
    )
    item = result.get("Item")
    if not item or get_s(item, "status", "ACTIVE") != "ACTIVE":
        raise PermissionError("You do not have access to this organization.")
    if get_s(item, "role") not in allowed_roles:
        raise PermissionError("Your role cannot perform this organization action.")
    return item


def validate_domain(value: str) -> str:
    domain = value.strip().lower()
    if not re.fullmatch(r"[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+", domain):
        raise ValueError("A valid client domain is required.")
    return domain


def create_client(event: dict, parent_org_id: str, actor: dict) -> dict:
    actor_sub = actor.get("sub", "")
    if not actor_sub:
        raise PermissionError("Authenticated user identity is missing.")

    require_membership(parent_org_id, actor_sub, MSP_ADMIN_ROLES)
    parent = get_org(parent_org_id)
    if not parent:
        return response(404, {"error": "MSP parent organization not found."})
    if get_s(parent, "tenantType") != "MSP" and get_s(parent, "planCode") != "msp":
        return response(409, {"error": "Managed clients can only be created under an MSP organization."})

    data = body(event)
    name = str(data.get("name") or "").strip()
    domain = validate_domain(str(data.get("domain") or ""))
    industry = str(data.get("industry") or "Defense Industrial Base").strip()
    if len(name) < 2 or len(name) > 160:
        raise ValueError("Client name must contain 2 to 160 characters.")

    client_id = f"org_{uuid.uuid4().hex[:12]}"
    now = str(int(time.time()))
    client_meta = {
        "PK": {"S": f"ORG#{client_id}"},
        "SK": {"S": "META"},
        "entityType": {"S": "ORGANIZATION"},
        "orgId": {"S": client_id},
        "orgName": {"S": name},
        "domain": {"S": domain},
        "industry": {"S": industry},
        "tenantType": {"S": "ENTERPRISE"},
        "edition": {"S": "ENTERPRISE"},
        "relationshipType": {"S": "MANAGED_CLIENT"},
        "parentOrgId": {"S": parent_org_id},
        "billingOwnerOrgId": {"S": parent_org_id},
        "status": {"S": "ACTIVE"},
        "createdAt": {"N": now},
        "createdBy": {"S": actor_sub},
    }
    client_link = {
        "PK": {"S": f"ORG#{parent_org_id}"},
        "SK": {"S": f"CLIENT#{client_id}"},
        "entityType": {"S": "MANAGED_CLIENT_LINK"},
        "orgId": {"S": client_id},
        "orgName": {"S": name},
        "domain": {"S": domain},
        "industry": {"S": industry},
        "parentOrgId": {"S": parent_org_id},
        "relationshipType": {"S": "MANAGED_CLIENT"},
        "status": {"S": "ACTIVE"},
        "createdAt": {"N": now},
    }
    member = {
        "PK": {"S": f"ORG#{client_id}"},
        "SK": {"S": f"MEMBER#{actor_sub}"},
        "entityType": {"S": "MEMBERSHIP"},
        "orgId": {"S": client_id},
        "userSub": {"S": actor_sub},
        "role": {"S": "MSP_ADMIN"},
        "sourceOrgId": {"S": parent_org_id},
        "status": {"S": "ACTIVE"},
        "createdAt": {"N": now},
    }
    reverse_member = {
        "PK": {"S": f"USER#{actor_sub}"},
        "SK": {"S": f"ORG#{client_id}"},
        "entityType": {"S": "USER_ORG_MEMBERSHIP"},
        "orgId": {"S": client_id},
        "orgName": {"S": name},
        "role": {"S": "MSP_ADMIN"},
        "parentOrgId": {"S": parent_org_id},
        "relationshipType": {"S": "MANAGED_CLIENT"},
        "status": {"S": "ACTIVE"},
        "createdAt": {"N": now},
    }

    DDB.transact_write_items(TransactItems=[
        {"Put": {"TableName": TABLE, "Item": client_meta, "ConditionExpression": "attribute_not_exists(PK)"}},
        {"Put": {"TableName": TABLE, "Item": client_link, "ConditionExpression": "attribute_not_exists(PK)"}},
        {"Put": {"TableName": TABLE, "Item": member, "ConditionExpression": "attribute_not_exists(PK)"}},
        {"Put": {"TableName": TABLE, "Item": reverse_member, "ConditionExpression": "attribute_not_exists(PK)"}},
    ])
    return response(201, {
        "orgId": client_id,
        "name": name,
        "domain": domain,
        "industry": industry,
        "tenantType": "ENTERPRISE",
        "edition": "ENTERPRISE",
        "parentOrgId": parent_org_id,
        "relationshipType": "MANAGED_CLIENT",
        "isParent": False,
    })


def list_clients(parent_org_id: str, actor: dict) -> dict:
    actor_sub = actor.get("sub", "")
    require_membership(parent_org_id, actor_sub, MSP_ADMIN_ROLES)
    result = DDB.query(
        TableName=TABLE,
        KeyConditionExpression="PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues={
            ":pk": {"S": f"ORG#{parent_org_id}"},
            ":sk": {"S": "CLIENT#"},
        },
        ConsistentRead=True,
    )
    items = [{
        "orgId": get_s(item, "orgId"),
        "name": get_s(item, "orgName"),
        "domain": get_s(item, "domain"),
        "industry": get_s(item, "industry"),
        "tenantType": "ENTERPRISE",
        "edition": "ENTERPRISE",
        "parentOrgId": parent_org_id,
        "relationshipType": "MANAGED_CLIENT",
        "isParent": False,
        "status": get_s(item, "status"),
    } for item in result.get("Items", [])]
    return response(200, {"items": items})


def create_invitation(event: dict, org_id: str, actor: dict) -> dict:
    actor_sub = actor.get("sub", "")
    require_membership(org_id, actor_sub, MSP_ADMIN_ROLES | {"CLIENT_ADMIN"})
    organization = get_org(org_id)
    if not organization:
        return response(404, {"error": "Organization not found."})

    data = body(event)
    email = str(data.get("email") or "").strip().lower()
    role_name = str(data.get("role") or "CLIENT_EVIDENCE_CONTRIBUTOR").strip()
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        raise ValueError("A valid invitation email is required.")
    if role_name not in INVITABLE_ROLES:
        raise ValueError("The requested client role is not allowed.")

    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    now = int(time.time())
    expires = now + (7 * 24 * 60 * 60)
    common = {
        "entityType": {"S": "ORG_INVITATION"},
        "inviteHash": {"S": token_hash},
        "orgId": {"S": org_id},
        "orgName": {"S": get_s(organization, "orgName")},
        "email": {"S": email},
        "role": {"S": role_name},
        "status": {"S": "PENDING"},
        "invitedBy": {"S": actor_sub},
        "createdAt": {"N": str(now)},
        "expiresAt": {"N": str(expires)},
        "ttl": {"N": str(expires)},
    }
    lookup = {"PK": {"S": f"INVITE#{token_hash}"}, "SK": {"S": "META"}, **common}
    org_copy = {"PK": {"S": f"ORG#{org_id}"}, "SK": {"S": f"INVITE#{token_hash}"}, **common}
    DDB.transact_write_items(TransactItems=[
        {"Put": {"TableName": TABLE, "Item": lookup, "ConditionExpression": "attribute_not_exists(PK)"}},
        {"Put": {"TableName": TABLE, "Item": org_copy, "ConditionExpression": "attribute_not_exists(PK)"}},
    ])

    invite_url = f"{APP_BASE_URL}/invite?token={token}"
    if FROM_EMAIL:
        SES.send_email(
            Source=FROM_EMAIL,
            Destination={"ToAddresses": [email]},
            Message={
                "Subject": {"Data": f"Invitation to {get_s(organization, 'orgName')} in Cuallee Cyber"},
                "Body": {"Text": {"Data": f"You were invited to Cuallee Cyber as {role_name}. Accept: {invite_url}\nThis invitation expires in 7 days."}},
            },
        )

    result = {
        "invitationId": token_hash[:12],
        "email": email,
        "role": role_name,
        "status": "PENDING",
        "expiresAt": expires,
        "emailSent": bool(FROM_EMAIL),
    }
    if RETURN_TOKEN:
        result["developmentInviteUrl"] = invite_url
    return response(201, result)


def accept_invitation(event: dict, actor: dict) -> dict:
    actor_sub = actor.get("sub", "")
    actor_email = str(actor.get("email") or "").strip().lower()
    data = body(event)
    token = str(data.get("token") or "")
    if not actor_sub or not actor_email or not token:
        raise PermissionError("Sign in with the invited email address to accept this invitation.")

    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    lookup_key = {"PK": {"S": f"INVITE#{token_hash}"}, "SK": {"S": "META"}}
    result = DDB.get_item(TableName=TABLE, Key=lookup_key, ConsistentRead=True)
    invite = result.get("Item")
    if not invite or get_s(invite, "status") != "PENDING":
        return response(404, {"error": "Invitation is invalid or no longer pending."})
    if int(invite.get("expiresAt", {}).get("N", "0")) <= int(time.time()):
        return response(410, {"error": "Invitation has expired."})
    if get_s(invite, "email") != actor_email:
        raise PermissionError("Sign in with the email address that received the invitation.")

    org_id = get_s(invite, "orgId")
    org_name = get_s(invite, "orgName")
    role_name = get_s(invite, "role")
    now = str(int(time.time()))
    membership = {
        "PK": {"S": f"ORG#{org_id}"},
        "SK": {"S": f"MEMBER#{actor_sub}"},
        "entityType": {"S": "MEMBERSHIP"},
        "orgId": {"S": org_id},
        "userSub": {"S": actor_sub},
        "email": {"S": actor_email},
        "role": {"S": role_name},
        "status": {"S": "ACTIVE"},
        "createdAt": {"N": now},
    }
    reverse = {
        "PK": {"S": f"USER#{actor_sub}"},
        "SK": {"S": f"ORG#{org_id}"},
        "entityType": {"S": "USER_ORG_MEMBERSHIP"},
        "orgId": {"S": org_id},
        "orgName": {"S": org_name},
        "role": {"S": role_name},
        "status": {"S": "ACTIVE"},
        "createdAt": {"N": now},
    }
    org_invite_key = {"PK": {"S": f"ORG#{org_id}"}, "SK": {"S": f"INVITE#{token_hash}"}}
    DDB.transact_write_items(TransactItems=[
        {"Put": {"TableName": TABLE, "Item": membership}},
        {"Put": {"TableName": TABLE, "Item": reverse}},
        {"Delete": {"TableName": TABLE, "Key": lookup_key}},
        {"Delete": {"TableName": TABLE, "Key": org_invite_key}},
    ])
    return response(200, {"orgId": org_id, "name": org_name, "role": role_name, "status": "ACTIVE"})


def lambda_handler(event: dict, context: Any) -> dict:
    try:
        method, path = route(event)
        if method == "OPTIONS":
            return response(204, {})

        actor = claims(event)
        parent_match = re.fullmatch(r"/orgs/([^/]+)/clients", path)
        invite_match = re.fullmatch(r"/orgs/([^/]+)/invitations", path)

        if parent_match and method == "GET":
            return list_clients(parent_match.group(1), actor)
        if parent_match and method == "POST":
            return create_client(event, parent_match.group(1), actor)
        if invite_match and method == "POST":
            return create_invitation(event, invite_match.group(1), actor)
        if path == "/invitations/accept" and method == "POST":
            return accept_invitation(event, actor)
        return response(404, {"error": "Route not found."})

    except PermissionError as error:
        return response(403, {"error": str(error)})
    except (ValueError, json.JSONDecodeError) as error:
        return response(400, {"error": str(error)})
    except ClientError as error:
        code = error.response.get("Error", {}).get("Code", "AWS_ERROR")
        print(json.dumps({"error": code, "requestId": getattr(context, "aws_request_id", None)}))
        if code == "TransactionCanceledException":
            return response(409, {"error": "The requested organization change conflicts with existing data."})
        return response(500, {"error": "Organization operation failed.", "requestId": getattr(context, "aws_request_id", None)})
    except Exception as error:
        print(repr(error))
        return response(500, {"error": "Internal error.", "requestId": getattr(context, "aws_request_id", None)})
