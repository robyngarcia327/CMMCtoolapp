import os
import boto3
import uuid
import datetime
import json

# Initialize DynamoDB resources
dynamodb = boto3.resource("dynamodb")
tenant_table = dynamodb.Table(os.environ.get("TENANT_TABLE", "Tenants"))
org_table = dynamodb.Table(os.environ.get("ORG_TABLE", "OrgDirectory"))

def response(status_code: int, body: dict) -> dict:
    """Standard API Gateway JSON response formatter."""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(body)
    }

def now_iso() -> str:
    """Returns current time in ISO format."""
    return datetime.datetime.utcnow().isoformat() + "Z"

def now_epoch() -> int:
    """Returns current Unix epoch time."""
    return int(datetime.datetime.utcnow().timestamp())

def create_org_with_owner(user_sub: str, org_name: str) -> dict:
    """
    Creates a new organization and assigns the user as the owner in the OrgDirectory table.
    """
    org_id = f"org_{uuid.uuid4().hex[:9]}"
    
    # Store org and owner info
    org_table.put_item(
        Item={
            "orgId": org_id,
            "orgName": org_name,
            "ownerSub": user_sub,
            "createdAt": now_iso()
        }
    )
    
    return {"orgId": org_id, "orgName": org_name}
