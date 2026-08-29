"""Convert an existing paid subscription to the MSP base + managed-client model.

The organization is not promoted here. Stripe's signed subscription webhook is
the source of truth and performs the OrgDirectory promotion after confirmation.
"""

import json
import os

import boto3
import stripe
from boto3.dynamodb.types import TypeDeserializer
from botocore.exceptions import ClientError

DDB = boto3.client("dynamodb")
TENANTS_TABLE = os.environ["TENANTS_TABLE"]
ORG_TABLE = os.environ["ORG_DIRECTORY_TABLE"]
MSP_BASE_PRICE = os.environ.get("STRIPE_PRICE_ID_MSP_BASE") or os.environ["STRIPE_PRICE_ID_MSP"]
MSP_CLIENT_PRICE = os.environ["STRIPE_PRICE_ID_MSP_CLIENT"]
stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
DESERIALIZE = TypeDeserializer().deserialize
ADMIN_ROLES = {"MSP_OWNER", "MSP_ADMIN", "Tenant_Admin", "Application_Administrator"}


def reply(status, payload):
    return {"statusCode": status, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "https://app.cualleecyber.com", "Access-Control-Allow-Headers": "Content-Type,Authorization"}, "body": json.dumps(payload)}


def claims(event):
    auth = event.get("requestContext", {}).get("authorizer", {})
    return auth.get("claims", {}) or auth.get("jwt", {}).get("claims", {})


def decode(item):
    return {key: DESERIALIZE(value) for key, value in item.items()}


def require_admin(org_id, user_sub):
    result = DDB.get_item(TableName=ORG_TABLE, Key={"PK": {"S": f"ORG#{org_id}"}, "SK": {"S": f"MEMBER#{user_sub}"}}, ConsistentRead=True)
    item = result.get("Item")
    if not item or item.get("status", {}).get("S", "ACTIVE") != "ACTIVE" or item.get("role", {}).get("S") not in ADMIN_ROLES:
        raise PermissionError("Only an organization administrator can upgrade this account.")


def get_tenant(org_id):
    result = DDB.query(TableName=TENANTS_TABLE, IndexName="OrgIdIndex", KeyConditionExpression="orgId = :org", ExpressionAttributeValues={":org": {"S": org_id}}, Limit=2)
    items = result.get("Items", [])
    if len(items) != 1:
        raise ValueError("Exactly one billing tenant must exist for this organization.")
    return decode(items[0])


def lambda_handler(event, context):
    try:
        actor = claims(event)
        data = json.loads(event.get("body") or "{}")
        org_id = str(data.get("orgId") or "")
        if data.get("planCode") != "msp" or data.get("interval", "month") != "month":
            return reply(400, {"error": "This endpoint supports monthly MSP upgrades only."})
        quantity = int(data.get("managedClientCount") or 1)
        if not org_id or quantity < 1 or quantity > 999:
            return reply(400, {"error": "orgId and 1-999 managed clients are required."})
        require_admin(org_id, actor.get("sub", ""))
        tenant = get_tenant(org_id)
        subscription_id = tenant.get("stripeSubscriptionId")
        if not subscription_id:
            return reply(409, {"error": "This organization does not have an upgradeable Stripe subscription."})

        subscription = stripe.Subscription.retrieve(subscription_id)
        if subscription.status not in {"active", "trialing"}:
            return reply(409, {"error": f"Subscription status {subscription.status} cannot be upgraded."})
        known_base_prices = {value for key, value in os.environ.items() if key.startswith("STRIPE_PRICE_ID_") and key != "STRIPE_PRICE_ID_MSP_CLIENT"}
        changes = []
        found_base = found_client = False
        for item in subscription["items"]["data"]:
            price_id = item["price"]["id"]
            if price_id == MSP_CLIENT_PRICE:
                changes.append({"id": item["id"], "quantity": quantity}); found_client = True
            elif price_id == MSP_BASE_PRICE:
                changes.append({"id": item["id"], "quantity": 1}); found_base = True
            elif price_id in known_base_prices or price_id == tenant.get("stripePriceId"):
                changes.append({"id": item["id"], "deleted": True})
        if not found_base: changes.append({"price": MSP_BASE_PRICE, "quantity": 1})
        if not found_client: changes.append({"price": MSP_CLIENT_PRICE, "quantity": quantity})

        updated = stripe.Subscription.modify(
            subscription_id,
            items=changes,
            proration_behavior="always_invoice",
            metadata={**dict(subscription.get("metadata") or {}), "orgId": org_id, "planCode": "msp", "managedClientCount": str(quantity)},
            idempotency_key=f"msp-upgrade-{org_id}-{quantity}",
        )
        return reply(202, {"changeType": "pending_webhook_confirmation", "subscriptionId": updated.id, "managedClientCount": quantity})
    except PermissionError as error: return reply(403, {"error": str(error)})
    except (ValueError, json.JSONDecodeError) as error: return reply(400, {"error": str(error)})
    except stripe.error.StripeError as error:
        print(json.dumps({"stripeError": str(error), "requestId": getattr(context, "aws_request_id", None)}))
        return reply(502, {"error": "Stripe could not complete the MSP upgrade."})
    except ClientError as error:
        print(json.dumps({"awsError": error.response.get("Error", {}).get("Code"), "requestId": getattr(context, "aws_request_id", None)}))
        return reply(500, {"error": "MSP upgrade validation failed."})

