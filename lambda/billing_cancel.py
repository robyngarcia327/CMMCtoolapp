"""
billing_cancel.py
=================
Sets cancel_at_period_end = True on the Stripe subscription so the
subscriber retains access until the end of the current billing cycle,
then the subscription is automatically cancelled.

Route:  POST /billing/cancel
Auth:   Cognito
Body:   { "orgId": "..." }

Environment Variables Required:
  STRIPE_SECRET_KEY — Stripe secret key
  TENANT_TABLE      — DynamoDB table name (default: Tenants)
"""
import os
import traceback
import stripe
from boto3.dynamodb.conditions import Attr

from common.utils import response, get_user_sub, parse_json_body, now_iso, tenant_table

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]


def _find_tenant(org_id: str) -> dict | None:
    resp = tenant_table.scan(
        FilterExpression=Attr("orgId").eq(org_id)
    )
    items = resp.get("Items", [])
    return items[0] if items else None


def lambda_handler(event, context):
    try:
        get_user_sub(event)

        body   = parse_json_body(event)
        org_id = (body.get("orgId") or "").strip()
        if not org_id:
            return response(400, {"error": "orgId is required"})

        tenant = _find_tenant(org_id)
        if not tenant:
            return response(404, {"error": "No subscription found for this organization"})

        subscription_id = tenant.get("stripeSubscriptionId")
        if not subscription_id:
            return response(400, {"error": "No Stripe subscription linked to this organization"})

        # Tell Stripe to cancel at the end of the current period (not immediately)
        stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True,
        )

        # Optimistically update DynamoDB status to "canceling"
        tenant_table.update_item(
            Key={"tenantId": tenant["tenantId"]},
            UpdateExpression="SET #s = :s, cancelAtPeriodEnd = :cap, updatedAt = :ts",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={
                ":s":   "canceling",
                ":cap": True,
                ":ts":  now_iso(),
            },
        )

        return response(200, {
            "status":            "canceling",
            "cancelAtPeriodEnd": True,
        })

    except stripe.error.StripeError as e:
        print("Stripe error:", str(e))
        return response(502, {"error": f"Stripe error: {e.user_message or str(e)}"})
    except ValueError as e:
        return response(400, {"error": str(e)})
    except Exception as e:
        print("billing_cancel ERROR:", str(e))
        print(traceback.format_exc())
        return response(500, {"error": "Internal error"})
