"""Persist shared-responsibility matrices and their draft findings by organization."""

import json
import os
import re
import time

import boto3
from botocore.exceptions import ClientError

DDB = boto3.client("dynamodb")
TABLE = os.environ["ORG_DIRECTORY_TABLE"]
WRITE_ROLES = {"MSP_OWNER", "MSP_ADMIN", "Tenant_Admin", "CLIENT_ADMIN", "CLIENT_COMPLIANCE_LEAD", "Application_Administrator"}


def reply(status, payload):
    return {"statusCode": status, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "https://app.cualleecyber.com", "Access-Control-Allow-Headers": "Content-Type,Authorization", "Access-Control-Allow-Methods": "GET,POST,OPTIONS"}, "body": json.dumps(payload)}


def claims(event):
    auth = event.get("requestContext", {}).get("authorizer", {})
    return auth.get("claims", {}) or auth.get("jwt", {}).get("claims", {})


def route(event):
    method = (event.get("requestContext", {}).get("http", {}).get("method") or event.get("httpMethod") or "").upper()
    path = (event.get("rawPath") or event.get("path") or "").rstrip("/")
    return method, re.fullmatch(r"/orgs/([^/]+)/responsibility-matrices", path)


def membership(org_id, user_sub):
    result = DDB.get_item(TableName=TABLE, Key={"PK": {"S": f"ORG#{org_id}"}, "SK": {"S": f"MEMBER#{user_sub}"}}, ConsistentRead=True)
    item = result.get("Item")
    if not item or item.get("status", {}).get("S", "ACTIVE") != "ACTIVE":
        raise PermissionError("You do not have access to this organization.")
    return item.get("role", {}).get("S", "")


def list_matrices(org_id):
    result = DDB.query(TableName=TABLE, KeyConditionExpression="PK = :pk AND begins_with(SK, :sk)", ExpressionAttributeValues={":pk": {"S": f"ORG#{org_id}"}, ":sk": {"S": "CRM#"}}, ConsistentRead=True)
    matrices, gaps = [], []
    for item in result.get("Items", []):
        matrices.append(json.loads(item["matrixJson"]["S"]))
        gaps.extend(json.loads(item.get("gapsJson", {"S": "[]"})["S"]))
    return reply(200, {"matrices": matrices, "gaps": gaps})


def save_matrix(event, org_id, user_sub):
    data = json.loads(event.get("body") or "{}")
    matrix, gaps = data.get("matrix"), data.get("gaps", [])
    if not isinstance(matrix, dict) or not isinstance(gaps, list):
        raise ValueError("A responsibility matrix and gap list are required.")
    if matrix.get("clientOrgId") != org_id or not re.fullmatch(r"CRM-[A-Za-z0-9_-]+", str(matrix.get("id") or "")):
        raise ValueError("Matrix identity does not match the organization route.")
    assignments = matrix.get("assignments", [])
    if not isinstance(assignments, list) or not assignments or len(assignments) > 2000:
        raise ValueError("A matrix must contain between 1 and 2,000 assignments.")
    if len(gaps) > 1000 or any(gap.get("clientOrgId") != org_id or gap.get("matrixId") != matrix["id"] or gap.get("requiresHumanApproval") is not True for gap in gaps):
        raise ValueError("Gap records must belong to this matrix and require human approval.")
    matrix_json, gaps_json = json.dumps(matrix, separators=(",", ":")), json.dumps(gaps, separators=(",", ":"))
    if len(matrix_json.encode()) + len(gaps_json.encode()) > 350000:
        raise ValueError("The parsed matrix is too large. Split the CRM by provider service.")
    now = str(int(time.time()))
    DDB.put_item(TableName=TABLE, Item={
        "PK": {"S": f"ORG#{org_id}"}, "SK": {"S": f"CRM#{matrix['id']}"}, "entityType": {"S": "RESPONSIBILITY_MATRIX"},
        "matrixId": {"S": matrix["id"]}, "providerType": {"S": str(matrix.get("providerType", ""))},
        "matrixJson": {"S": matrix_json}, "gapsJson": {"S": gaps_json}, "updatedAt": {"N": now}, "updatedBy": {"S": user_sub},
    })
    return reply(201, {"matrixId": matrix["id"], "gapCount": len(gaps)})


def lambda_handler(event, context):
    try:
        method, match = route(event)
        if method == "OPTIONS": return reply(204, {})
        if not match: return reply(404, {"error": "Route not found."})
        org_id, user_sub = match.group(1), claims(event).get("sub", "")
        if not user_sub: raise PermissionError("Authenticated user identity is missing.")
        role = membership(org_id, user_sub)
        if method == "GET": return list_matrices(org_id)
        if method == "POST":
            if role not in WRITE_ROLES: raise PermissionError("Your role cannot import responsibility matrices.")
            return save_matrix(event, org_id, user_sub)
        return reply(405, {"error": "Method not allowed."})
    except PermissionError as error: return reply(403, {"error": str(error)})
    except (ValueError, json.JSONDecodeError) as error: return reply(400, {"error": str(error)})
    except ClientError as error:
        print(json.dumps({"code": error.response.get("Error", {}).get("Code"), "requestId": getattr(context, "aws_request_id", None)}))
        return reply(500, {"error": "Responsibility matrix operation failed.", "requestId": getattr(context, "aws_request_id", None)})

