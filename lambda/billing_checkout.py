"""
billing_checkout.py
====================
Creates a Stripe Checkout Session and redirects the user to Stripe to pay.

Route:  POST /billing/checkout-session
Auth:   Cognito (any authenticated user)
Body:   { "orgName": "Acme Corp" }

Environment Variables Required:
  STRIPE_SECRET_KEY       — from Stripe Dashboard → Developers → API Keys
  STRIPE_PRICE_ID_YEARLY  — the Price ID from Stripe Dashboard → Products
  APP_SUCCESS_URL         — e.g. https://your-app.amplifyapp.com/?checkout=success&session_id={CHECKOUT_SESSION_ID}
  APP_CANCEL_URL          — e.g. https://your-app.amplifyapp.com/?checkout=cancel
"""
import os
import traceback
import stripe

from common.utils import response, get_user_sub, parse_json_body

# Initialize Stripe once at module level (reused across warm Lambda invocations)
stripe.api_key = os.environ["STRIPE_SECRET_KEY"]

PRICE_ID_MSP      = os.environ["STRIPE_PRICE_ID_MSP"]
PRICE_ID_ENTERPRISE = os.environ["STRIPE_PRICE_ID_ENTERPRISE"]
SUCCESS_URL   = os.environ["APP_SUCCESS_URL"]
CANCEL_URL    = os.environ["APP_CANCEL_URL"]


def lambda_handler(event, context):
    try:
        user_sub = get_user_sub(event)

        # Pull the caller's email from the Cognito authorizer claims
        claims = (
            event.get("requestContext", {})
            .get("authorizer", {})
            .get("claims", {})
        )
        email = claims.get("email", "")

        body = parse_json_body(event)
        org_name = (body.get("orgName") or "").strip()
        tenant_type = body.get("tenantType", "ENTERPRISE")
        if not org_name:
            return response(400, {"error": "orgName is required"})

        # Select price based on tenantType
        selected_price = PRICE_ID_MSP if tenant_type == "MSP" else PRICE_ID_ENTERPRISE
        if not selected_price:
             return response(500, {"error": f"Price ID missing for tenant type {tenant_type}"})

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price": selected_price,
                    "quantity": 1,
                }
            ],
            mode="subscription",
            # Stripe replaces {CHECKOUT_SESSION_ID} automatically in the success URL
            success_url=SUCCESS_URL,
            cancel_url=CANCEL_URL,
            customer_email=email or None,
            metadata={
                "userSub": user_sub,
                "orgName": org_name,
                "email": email,
                "tenantType": tenant_type,
            },
        )

        return response(200, {"url": session.url})

    except stripe.error.StripeError as e:
        print("Stripe error:", str(e))
        return response(502, {"error": f"Stripe error: {e.user_message or str(e)}"})
    except ValueError as e:
        return response(400, {"error": str(e)})
    except Exception as e:
        print("billing_checkout ERROR:", str(e))
        print(traceback.format_exc())
        return response(500, {"error": "Internal error"})
