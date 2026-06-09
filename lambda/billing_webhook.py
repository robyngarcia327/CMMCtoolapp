"""
billing_webhook.py
==================
Receives and processes Stripe webhook events.

Route:  POST /billing/webhook
Auth:   *** NONE — must be excluded from Cognito authorizer in API Gateway ***
        Authentication is done via Stripe-Signature header verification.

Key Events Handled:
  checkout.session.completed     → Create org + tenant in DynamoDB
  customer.subscription.updated  → Sync subscription status/dates
  customer.subscription.deleted  → Mark tenant inactive

Environment Variables Required:
  STRIPE_SECRET_KEY       — Stripe secret key
  STRIPE_WEBHOOK_SECRET   — whsec_... from Stripe Dashboard → Webhooks → Signing secret
  TENANT_TABLE            — DynamoDB table name (default: Tenants)
  ORG_TABLE               — DynamoDB table name (default: OrgDirectory)

IMPORTANT — API Gateway Configuration:
  1. This route must use "No Authorizer" (not Cognito).
  2. In API Gateway integration, set Content Handling = "Passthrough" so
     the raw body reaches Lambda for correct signature verification.
  3. If using a Lambda Proxy integration, the body arrives as a string —
     this handler encodes it to bytes for Stripe signature verification.
"""
import os
import base64
import traceback
import uuid
import stripe

from common.utils import (
    response,
    now_iso,
    now_epoch,
    create_org_with_owner,
    tenant_table,
    org_table,
)
from boto3.dynamodb.conditions import Attr

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
WEBHOOK_SECRET = os.environ["STRIPE_WEBHOOK_SECRET"]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _raw_body(event: dict) -> bytes:
    """Return the raw HTTP body as bytes (handles base64 encoding from API GW)."""
    body = event.get("body") or ""
    if event.get("isBase64Encoded"):
        return base64.b64decode(body)
    if isinstance(body, str):
        return body.encode("utf-8")
    return body


def _find_tenant_by_subscription_id(subscription_id: str) -> dict | None:
    """Scan Tenants for a matching stripeSubscriptionId.
    Replace with a GSI query once you add StripeSubIndex to the table."""
    resp = tenant_table.scan(
        FilterExpression=Attr("stripeSubscriptionId").eq(subscription_id)
    )
    items = resp.get("Items", [])
    return items[0] if items else None


def _handle_checkout_completed(session: dict) -> None:
    """
    Payment succeeded. Create the org + member records, then write the
    Tenant record so the entitlement check will pass.
    """
    metadata    = session.get("metadata") or {}
    user_sub    = metadata.get("userSub")
    org_name    = metadata.get("orgName")
    tenant_type = metadata.get("tenantType", "ENTERPRISE")
    email       = metadata.get("email", "")

    if not user_sub or not org_name:
        print("WARN: Missing userSub or orgName in session metadata — skipping org creation")
        return

    # Retrieve the subscription to get billing period dates
    subscription_id = session.get("subscription")
    sub = stripe.Subscription.retrieve(subscription_id)

    period_start = int(sub["current_period_start"])
    period_end   = int(sub["current_period_end"])
    price_id     = sub["items"]["data"][0]["price"]["id"] if sub["items"]["data"] else ""

    # Atomically create org + owner membership in OrgDirectory
    created = create_org_with_owner(user_sub, org_name)
    org_id  = created["orgId"]

    # Write the Tenant record
    tenant_id = str(uuid.uuid4())
    tenant_table.put_item(
        Item={
            "tenantId":              tenant_id,
            "orgId":                 org_id,
            "orgName":               org_name,
            "tenantType":            tenant_type,
            "ownerSub":              user_sub,
            "ownerEmail":            email,
            "status":                "active",
            "stripeCustomerId":      session.get("customer", ""),
            "stripeSubscriptionId":  subscription_id,
            "stripePriceId":         price_id,
            "currentPeriodStart":    period_start,   # Unix epoch int
            "currentPeriodEnd":      period_end,     # Unix epoch int
            "cancelAtPeriodEnd":     False,
            "createdAt":             now_iso(),
            "updatedAt":             now_iso(),
        }
    )
    print(f"[Webhook] Tenant {tenant_id} created for org {org_id} ({org_name})")


def _handle_subscription_updated(subscription: dict) -> None:
    """Sync subscription status and billing period back to DynamoDB."""
    raw_status = subscription.get("status", "")
    cancel_at_end = bool(subscription.get("cancel_at_period_end", False))

    # Map Stripe statuses → our internal statuses
    status_map = {
        "active":        "active",
        "past_due":      "inactive",
        "unpaid":        "inactive",
        "canceled":      "inactive",
        "incomplete":    "inactive",
        "paused":        "inactive",
        "trialing":      "active",
    }
    internal_status = status_map.get(raw_status, "inactive")

    # Override: if canceling but within the paid period
    if cancel_at_end and raw_status == "active":
        internal_status = "canceling"

    period_start = int(subscription.get("current_period_start") or 0)
    period_end   = int(subscription.get("current_period_end") or 0)
    price_id     = ""
    items_data   = (subscription.get("items") or {}).get("data") or []
    if items_data:
        price_id = (items_data[0].get("price") or {}).get("id", "")

    tenant = _find_tenant_by_subscription_id(subscription["id"])
    if not tenant:
        print(f"WARN: No tenant found for subscription {subscription['id']} — cannot update")
        return

    tenant_table.update_item(
        Key={"tenantId": tenant["tenantId"]},
        UpdateExpression=(
            "SET #s = :s, cancelAtPeriodEnd = :cap, "
            "currentPeriodStart = :ps, currentPeriodEnd = :pe, "
            "stripePriceId = :pid, updatedAt = :ts"
        ),
        ExpressionAttributeNames={"#s": "status"},
        ExpressionAttributeValues={
            ":s":   internal_status,
            ":cap": cancel_at_end,
            ":ps":  period_start,
            ":pe":  period_end,
            ":pid": price_id,
            ":ts":  now_iso(),
        },
    )
    print(f"[Webhook] Tenant {tenant['tenantId']} updated → status={internal_status}")


def _handle_subscription_deleted(subscription: dict) -> None:
    """Hard cancellation — immediately mark tenant as inactive."""
    tenant = _find_tenant_by_subscription_id(subscription["id"])
    if not tenant:
        print(f"WARN: No tenant found for deleted subscription {subscription['id']}")
        return

    tenant_table.update_item(
        Key={"tenantId": tenant["tenantId"]},
        UpdateExpression="SET #s = :s, updatedAt = :ts",
        ExpressionAttributeNames={"#s": "status"},
        ExpressionAttributeValues={
            ":s":  "inactive",
            ":ts": now_iso(),
        },
    )
    print(f"[Webhook] Tenant {tenant['tenantId']} marked inactive (subscription deleted)")


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------

def lambda_handler(event, context):
    sig_header = (event.get("headers") or {}).get("stripe-signature") or \
                 (event.get("headers") or {}).get("Stripe-Signature")

    if not sig_header:
        return response(400, {"error": "Missing Stripe-Signature header"})

    raw = _raw_body(event)

    try:
        stripe_event = stripe.Webhook.construct_event(raw, sig_header, WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError as e:
        print("Webhook signature verification failed:", str(e))
        return response(400, {"error": "Invalid signature"})
    except Exception as e:
        print("Webhook event construction failed:", str(e))
        return response(400, {"error": "Bad webhook payload"})

    event_type = stripe_event["type"]
    data_obj   = stripe_event["data"]["object"]

    print(f"[Webhook] Received event: {event_type} ({stripe_event['id']})")

    try:
        if event_type == "checkout.session.completed":
            _handle_checkout_completed(data_obj)
        elif event_type in ("customer.subscription.updated",):
            _handle_subscription_updated(data_obj)
        elif event_type in ("customer.subscription.deleted",):
            _handle_subscription_deleted(data_obj)
        else:
            print(f"[Webhook] Unhandled event type: {event_type} — ignoring")

    except Exception as e:
        # Log but return 200 so Stripe doesn't retry indefinitely for non-transient errors
        print(f"[Webhook] Processing error for {event_type}:", str(e))
        print(traceback.format_exc())
        # For transient errors (e.g. DynamoDB throttle), return 500 to trigger Stripe retry
        return response(500, {"error": "Processing failed — will retry"})

    return response(200, {"received": True})
