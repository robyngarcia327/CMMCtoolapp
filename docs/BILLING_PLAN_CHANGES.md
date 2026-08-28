# Safe paid-plan changes

## Current safety rule

Stripe Checkout is only for an organization's first paid subscription. Once a tenant has a `stripeSubscriptionId`, the application must never create another Checkout subscription for that organization.

Until the plan-change API is deployed, active subscribers see their current plan and a contact-billing action. Self-service cancellation is intentionally not exposed.

## Next development phase

Add `POST /billing/change-plan` behind the existing Cognito authorizer.

Request:

```json
{
  "orgId": "organization-id",
  "planCode": "professional",
  "interval": "month"
}
```

Required behavior:

1. Require organization owner or administrator membership.
2. Load exactly one tenant using `OrgIdIndex`.
3. Require its existing `stripeCustomerId` and `stripeSubscriptionId`.
4. Reject MSP conversions as sales-assisted.
5. Resolve the target Price only from server-side `PLAN_CATALOG_JSON`; never accept a Price ID from the browser.
6. Retrieve the existing Stripe subscription and update that subscription. Never create a second subscription.
7. Apply upgrades immediately with prorated invoicing.
8. Schedule downgrades and billing-interval changes for the next renewal using a Stripe Subscription Schedule.
9. Use an idempotency key containing organization, subscription, target plan, interval, and current billing period.
10. Return the effective plan, requested plan, effective date, and whether the change is immediate or scheduled.
11. Let `customer.subscription.updated` synchronize plan code, entitlement limits, price, renewal date, and cancellation state into DynamoDB.
12. Record the Stripe event ID so duplicate webhook deliveries are idempotent.

## API Gateway deployment

- Add Cognito-protected `POST /billing/change-plan`.
- Add unauthenticated `OPTIONS`.
- Allow origin `https://app.cualleecyber.com`.
- Allow `Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token`.
- Deploy to `CualleeCyberEvidence`.

## Frontend enablement

After the endpoint is deployed:

- Add `api.changePlan(...)`.
- Current plan remains disabled.
- Starter, Professional, and Guided use the change-plan API for active subscribers.
- MSP remains contact-sales.
- Show the proration or next-renewal effective date before confirmation.
- Refresh billing status after the Stripe webhook completes.

## Acceptance tests

- Readiness to Starter creates one subscription.
- Starter to Professional keeps the same subscription ID and creates a prorated invoice.
- Professional to Starter keeps the same subscription ID and schedules the downgrade.
- Repeating a request does not create a duplicate invoice or schedule.
- MSP conversion is rejected.
- Unauthorized organization members receive 403.
- All billing OPTIONS responses allow the custom application origin.
- Relevant Stripe webhook deliveries return 200.
