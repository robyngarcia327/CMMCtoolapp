"""List only organizations reachable through the authenticated user's memberships."""

import json
import os

import boto3
from boto3.dynamodb.types import TypeDeserializer
from botocore.exceptions import ClientError

DDB = boto3.client("dynamodb")
TABLE = os.environ["ORG_DIRECTORY_TABLE"]
DESERIALIZE = TypeDeserializer().deserialize


def reply(status, payload):
    return {"statusCode": status, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "https://app.cualleecyber.com"}, "body": json.dumps(payload)}


def claims(event):
    auth = event.get("requestContext", {}).get("authorizer", {})
    return auth.get("claims", {}) or auth.get("jwt", {}).get("claims", {})


def decode(item):
    return {key: DESERIALIZE(value) for key, value in item.items()}


def lambda_handler(event, context):
    try:
        user_sub = claims(event).get("sub")
        if not user_sub:
            return reply(403, {"error": "Authenticated user identity is missing."})
        result = DDB.query(
            TableName=TABLE,
            KeyConditionExpression="PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues={":pk": {"S": f"USER#{user_sub}"}, ":sk": {"S": "ORG#"}},
            ConsistentRead=True,
        )
        memberships = [decode(item) for item in result.get("Items", []) if decode(item).get("status", "ACTIVE") == "ACTIVE"]
        keys = [{"PK": {"S": f"ORG#{item['orgId']}"}, "SK": {"S": "META"}} for item in memberships if item.get("orgId")]
        metadata = {}
        while keys:
            batch, keys = keys[:100], keys[100:]
            fetched = DDB.batch_get_item(RequestItems={TABLE: {"Keys": batch, "ConsistentRead": True}})
            for raw in fetched.get("Responses", {}).get(TABLE, []):
                item = decode(raw)
                metadata[item.get("orgId")] = item
            keys.extend(fetched.get("UnprocessedKeys", {}).get(TABLE, {}).get("Keys", []))

        organizations = []
        for membership in memberships:
            meta = metadata.get(membership.get("orgId"))
            if not meta or meta.get("status", "ACTIVE") != "ACTIVE":
                continue
            organizations.append({
                "orgId": meta["orgId"], "name": meta.get("orgName", membership.get("orgName")),
                "domain": meta.get("domain", ""), "industry": meta.get("industry", "Defense Industrial Base"),
                "role": membership.get("role"), "memberStatus": membership.get("status"),
                "planCode": meta.get("planCode"), "tenantType": meta.get("tenantType"), "edition": meta.get("edition"),
                "parentOrgId": meta.get("parentOrgId"), "relationshipType": meta.get("relationshipType"),
                "isParent": bool(meta.get("isParent", False)),
            })
        return reply(200, {"organizations": organizations})
    except ClientError as error:
        print(json.dumps({"code": error.response.get("Error", {}).get("Code"), "requestId": getattr(context, "aws_request_id", None)}))
        return reply(500, {"error": "Organization discovery failed.", "requestId": getattr(context, "aws_request_id", None)})

