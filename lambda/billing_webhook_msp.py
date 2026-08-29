"""Stripe webhook that atomically synchronizes billing and MSP organization state."""

import json
import os
import time

import boto3
import stripe
from boto3.dynamodb.types import TypeDeserializer
from botocore.exceptions import ClientError

DDB = boto3.client("dynamodb")
TENANTS_TABLE = os.environ["TENANTS_TABLE"]
ORG_TABLE = os.environ["ORG_DIRECTORY_TABLE"]
WEBHOOK_SECRET = os.environ["STRIPE_WEBHOOK_SECRET"]
MSP_BASE_PRICE = os.environ.get("STRIPE_PRICE_ID_MSP_BASE") or os.environ["STRIPE_PRICE_ID_MSP"]
DESERIALIZE = TypeDeserializer().deserialize


def reply(status, payload):
    return {"statusCode": status, "headers": {"Content-Type": "application/json"}, "body": json.dumps(payload)}


def decode(item):
    return {key: DESERIALIZE(value) for key, value in item.items()}


def tenant_for_subscription(subscription_id):
    result = DDB.query(TableName=TENANTS_TABLE, IndexName="StripeSubscriptionIndex", KeyConditionExpression="stripeSubscriptionId = :sid", ExpressionAttributeValues={":sid": {"S": subscription_id}}, Limit=2)
    items = result.get("Items", [])
    if len(items) != 1: raise ValueError("Webhook could not resolve exactly one billing tenant.")
    return decode(items[0])


def value(subscription, name, default=None):
    result = getattr(subscription, name, None)
    return default if result is None else result


def sync_subscription(event_id, subscription):
    tenant = tenant_for_subscription(subscription.id)
    org_id, tenant_id = tenant["orgId"], tenant["tenantId"]
    org_result = DDB.get_item(TableName=ORG_TABLE, Key={"PK": {"S": f"ORG#{org_id}"}, "SK": {"S": "META"}}, ConsistentRead=True)
    if "Item" not in org_result:
        raise ValueError("Organization must be migrated before billing synchronization.")
    prices = {item.price.id for item in subscription.items.data}
    is_msp = MSP_BASE_PRICE in prices and subscription.status in {"active", "trialing"}
    status = "active" if subscription.status in {"active", "trialing"} else "inactive"
    now = str(int(time.time()))
    transaction = [
        {"Put": {"TableName": ORG_TABLE, "Item": {"PK": {"S": f"EVENT#{event_id}"}, "SK": {"S": "STRIPE"}, "entityType": {"S": "WEBHOOK_EVENT"}, "ttl": {"N": str(int(time.time()) + 2592000)}}, "ConditionExpression": "attribute_not_exists(PK)"}},
        {"Update": {"TableName": TENANTS_TABLE, "Key": {"tenantId": {"S": tenant_id}}, "UpdateExpression": "SET #s=:s, planCode=:plan, tenantType=:type, stripePriceId=:price, cancelAtPeriodEnd=:cancel, updatedAt=:updated", "ExpressionAttributeNames": {"#s": "status"}, "ExpressionAttributeValues": {":s": {"S": status}, ":plan": {"S": "msp" if is_msp else tenant.get("planCode", "unknown")}, ":type": {"S": "MSP" if is_msp else tenant.get("tenantType", "ENTERPRISE")}, ":price": {"S": MSP_BASE_PRICE if is_msp else next(iter(prices), "")}, ":cancel": {"BOOL": bool(subscription.cancel_at_period_end)}, ":updated": {"S": str(int(time.time()))}}}},
    ]
    if is_msp:
        transaction.append({"Update": {"TableName": ORG_TABLE, "Key": {"PK": {"S": f"ORG#{org_id}"}, "SK": {"S": "META"}}, "UpdateExpression": "SET planCode=:plan, tenantType=:type, edition=:edition, relationshipType=:rel, isParent=:parent, billingSyncStatus=:sync, billingSyncedAt=:now", "ConditionExpression": "attribute_exists(PK)", "ExpressionAttributeValues": {":plan": {"S": "msp"}, ":type": {"S": "MSP"}, ":edition": {"S": "MSP"}, ":rel": {"S": "PARENT"}, ":parent": {"BOOL": True}, ":sync": {"S": "CONFIRMED"}, ":now": {"N": now}}}})
        owner = tenant.get("ownerSub")
        if owner:
            transaction.extend([
                {"Update": {"TableName": ORG_TABLE, "Key": {"PK": {"S": f"ORG#{org_id}"}, "SK": {"S": f"MEMBER#{owner}"}}, "UpdateExpression": "SET #r=:role", "ExpressionAttributeNames": {"#r": "role"}, "ExpressionAttributeValues": {":role": {"S": "MSP_OWNER"}}}},
                {"Update": {"TableName": ORG_TABLE, "Key": {"PK": {"S": f"USER#{owner}"}, "SK": {"S": f"ORG#{org_id}"}}, "UpdateExpression": "SET #r=:role, planCode=:plan, tenantType=:type, edition=:edition, relationshipType=:rel, isParent=:parent", "ExpressionAttributeNames": {"#r": "role"}, "ExpressionAttributeValues": {":role": {"S": "MSP_OWNER"}, ":plan": {"S": "msp"}, ":type": {"S": "MSP"}, ":edition": {"S": "MSP"}, ":rel": {"S": "PARENT"}, ":parent": {"BOOL": True}}}},
            ])
    DDB.transact_write_items(TransactItems=transaction)


def lambda_handler(event, context):
    try:
        signature = (event.get("headers") or {}).get("stripe-signature") or (event.get("headers") or {}).get("Stripe-Signature")
        payload = event.get("body") or ""
        if event.get("isBase64Encoded"):
            import base64
            payload = base64.b64decode(payload)
        stripe_event = stripe.Webhook.construct_event(payload, signature, WEBHOOK_SECRET)
        if stripe_event.type in {"customer.subscription.updated", "customer.subscription.deleted"}:
            sync_subscription(stripe_event.id, stripe_event.data.object)
        return reply(200, {"received": True})
    except stripe.error.SignatureVerificationError: return reply(400, {"error": "Invalid webhook signature."})
    except ClientError as error:
        if error.response.get("Error", {}).get("Code") == "TransactionCanceledException":
            return reply(200, {"received": True, "duplicate": True})
        print(json.dumps({"awsError": error.response.get("Error", {}).get("Code"), "requestId": getattr(context, "aws_request_id", None)}))
        return reply(500, {"error": "Webhook synchronization failed."})
    except Exception as error:
        print(json.dumps({"error": str(error), "requestId": getattr(context, "aws_request_id", None)}))
        return reply(500, {"error": "Webhook processing failed."})
