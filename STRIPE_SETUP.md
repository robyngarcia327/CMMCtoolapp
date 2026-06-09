# Stripe Lambda Layer Setup & API Gateway Configuration

## Step 1 — Add `stripe` to the Lambda Layer

Your existing layer contains `utils.py`. You need to also include the `stripe` Python package.

**Build the layer locally (or in CloudShell):**
```bash
# On your machine or in AWS CloudShell
mkdir -p stripe_layer/python
pip install stripe -t stripe_layer/python/
cd stripe_layer
zip -r ../stripe_layer.zip .
```

Then in **AWS Lambda Console → Layers → Create layer**:
- Name: `billing-dependencies` (or add to your existing layer)
- Upload the `stripe_layer.zip`
- Compatible runtimes: Python 3.11 (or whatever your Lambdas use)

Attach this layer to all 5 billing Lambda functions.

---

## Step 2 — Create the 5 Billing Lambda Functions

For each file in `lambda/billing_*.py`, create a new Lambda function:

| File | Function Name | Description |
|------|--------------|-------------|
| `billing_checkout.py` | `billing_checkout` | Create Stripe Checkout Session |
| `billing_webhook.py`  | `billing_webhook`  | Handle Stripe webhook events |
| `billing_status.py`   | `billing_status`   | Get subscription status |
| `billing_portal.py`   | `billing_portal`   | Open Stripe Customer Portal |
| `billing_cancel.py`   | `billing_cancel`   | Cancel subscription |

**For each:**
1. AWS Lambda Console → Create function → Author from scratch
2. Runtime: Python 3.11
3. Paste the code from the file
4. Add the layer (including `stripe` package + your `utils.py` layer)
5. Set environment variables (see below)

---

## Step 3 — Set Environment Variables on All Billing Lambdas

| Key | Value | Where to Get |
|-----|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_PRICE_ID_YEARLY` | `price_...` | Stripe Dashboard → Products → your product → Price ID |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe Dashboard → Developers → Webhooks → your endpoint → Signing secret |
| `APP_SUCCESS_URL` | `https://your-app.amplifyapp.com/?checkout=success&session_id={CHECKOUT_SESSION_ID}` | Your Amplify domain |
| `APP_CANCEL_URL` | `https://your-app.amplifyapp.com/?checkout=cancel` | Your Amplify domain |
| `TENANT_TABLE` | `Tenants` | Your DynamoDB table name |
| `ORG_TABLE` | `OrgDirectory` | Your DynamoDB table name |

---

## Step 4 — Wire Lambdas to API Gateway

Add these routes to your existing API Gateway:

| Method | Path | Lambda | Cognito Authorizer |
|--------|------|--------|--------------------|
| POST | `/billing/checkout-session` | `billing_checkout` | ✅ Yes |
| POST | `/billing/webhook` | `billing_webhook` | ❌ **NO — None** |
| GET  | `/billing/status` | `billing_status` | ✅ Yes |
| POST | `/billing/portal-session` | `billing_portal` | ✅ Yes |
| POST | `/billing/cancel` | `billing_cancel` | ✅ Yes |

> ⚠️ **CRITICAL:** The `/billing/webhook` route MUST have **No Authorizer**.
> Stripe doesn't send Cognito tokens — it authenticates via the `Stripe-Signature` header.

---

## Step 5 — Register the Webhook URL in Stripe

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://YOUR-API-GATEWAY-ID.execute-api.us-east-1.amazonaws.com/prod/billing/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing secret** (`whsec_...`) and set it as `STRIPE_WEBHOOK_SECRET` in all billing Lambdas

---

## Step 6 — Configure Amplify Rewrite Rule

In **AWS Amplify Console → your app → Rewrites and redirects → Add rule**:

| Source address | Target address | Type |
|----------------|----------------|------|
| `/api/<*>` | `https://YOUR-API-GW-ID.execute-api.us-east-1.amazonaws.com/prod/<*>` | Proxy - 200 |

This allows the frontend to call relative `/api/*` URLs in production, which Amplify silently forwards to API Gateway.

---

## Step 7 — Add GSI to DynamoDB Tenants Table (Recommended)

The billing Lambdas currently use a DynamoDB **Scan** to find tenants by `orgId`. This works but is slow at scale.

**Add a Global Secondary Index:**
1. AWS DynamoDB Console → Tables → `Tenants` → Indexes → Create index
2. Partition key: `orgId` (String)
3. Index name: `OrgIdIndex`

Once created, update `billing_status.py`, `billing_portal.py`, and `billing_cancel.py` to use the query commented in each file.

---

## Step 8 — Test with Stripe CLI

```bash
# Install Stripe CLI from https://stripe.com/docs/stripe-cli
stripe login

# Forward Stripe events to your local dev server (for testing)
stripe listen --forward-to https://YOUR-API-GW-URL/billing/webhook

# Trigger a test checkout completion
stripe trigger checkout.session.completed
```

---

## Lambda IAM Permissions Required

Each billing Lambda's execution role needs:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem", 
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/Tenants",
        "arn:aws:dynamodb:us-east-1:*:table/Tenants/index/*",
        "arn:aws:dynamodb:us-east-1:*:table/OrgDirectory",
        "arn:aws:dynamodb:us-east-1:*:table/OrgDirectory/index/*"
      ]
    }
  ]
}
```
