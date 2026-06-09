"""
billing_portal.py
=================
Creates a Stripe Customer Portal session so a subscriber can manage their
payment methods, view invoices, and update or cancel their subscription.

Route:  POST /billing/portal-session
Auth:   Cognito
Body:   { "orgId": "..." }

Environment Variables Required:
  STRIPE_SECRET_KEY  — Stripe secret key
  APP_SUCCESS_URL    — Return URL after the customer exits the portal
  TENANT_TABLE       — DynamoDB table name (default: Tenants)
"""
import os
import traceback
import stripe
from boto3.dynamodb.conditions import Attr

from common.utils import response, get_user_sub, parse_json_body, tenant_table

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
RETURN_URL = os.environ.get("APP_SUCCESS_URL", "")


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

        customer_id = tenant.get("stripeCustomerId")
        if not customer_id:
            return response(400, {"error": "No Stripe customer linked to this organization"})

        portal_session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=RETURN_URL,
        )

        return response(200, {"url": portal_session.url})

    except stripe.error.StripeError as e:
        print("Stripe error:", str(e))
        return response(502, {"error": f"Stripe error: {e.user_message or str(e)}"})
    except ValueError as e:
        return response(400, {"error": str(e)})
    except Exception as e:
        print("billing_portal ERROR:", str(e))
        print(traceback.format_exc())
        return response(500, {"error": "Internal error"})
