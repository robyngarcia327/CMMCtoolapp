# Existing-account MSP upgrade runbook

Use this sequence for the demo account before enabling MSP upgrades generally.

## 1. Deploy and migrate

1. Deploy `create_org.py`, `list_orgs.py`, `org_hierarchy.py`, and `responsibility_matrices.py` with the routes documented in `MSP_HIERARCHY_DEPLOYMENT.md`.
2. Run `scripts/migrate_demo_org.py` without `--apply`. Confirm the tenant, organization, and owner identifiers.
3. Re-run with `--apply` and confirm `GET /orgs` returns the demo organization as `STANDALONE` before its upgrade.
4. Back up both DynamoDB records or enable point-in-time recovery before proceeding.

## 2. Deploy billing conversion

Route `POST /billing/change-plan` to `billing_upgrade_msp.py` or merge its MSP branch into the existing plan-change Lambda. Attach the Cognito authorizer.

Deploy `billing_webhook_msp.py` on the existing unauthenticated Stripe webhook route. API Gateway must pass the unmodified request body. Stripe signature validation replaces Cognito authentication for this route.

Required environment variables:

- `TENANTS_TABLE`
- `ORG_DIRECTORY_TABLE`
- `STRIPE_SECRET_KEY` (upgrade function only)
- `STRIPE_WEBHOOK_SECRET` (webhook only)
- `STRIPE_PRICE_ID_MSP_BASE` or existing `STRIPE_PRICE_ID_MSP`
- `STRIPE_PRICE_ID_MSP_CLIENT`
- All existing `STRIPE_PRICE_ID_*` plan values on the upgrade Lambda, so it can identify the old base item safely

The Lambdas require DynamoDB query/get permissions. The webhook additionally requires `dynamodb:TransactWriteItems` on both tables. Enable DynamoDB TTL on `ttl` for idempotency event records.

## 3. Controlled frontend activation

Set these Amplify variables only after the APIs are deployed and tested:

```text
VITE_ENABLE_PLAN_CHANGES=true
VITE_ENABLE_MSP_UPGRADES=true
```

Redeploy Amplify. Keep `VITE_ENABLE_MSP_UPGRADES` unset or `false` in production until the demo test passes.

## 4. Demo test

1. Open Billing as the demo organization's tenant administrator.
2. Select the number of managed-client seats and choose **Upgrade to MSP**.
3. Confirm Stripe modifies the existing subscription rather than creating a second subscription.
4. Confirm the webhook returns HTTP 200 and writes a Stripe event idempotency record.
5. Confirm the tenant record reports `planCode=msp`, `tenantType=MSP`, and `status=active`.
6. Confirm the organization metadata reports `edition=MSP`, `relationshipType=PARENT`, `isParent=true`, and `billingSyncStatus=CONFIRMED`.
7. Sign out and back in. The MSP Command Center and customer-helping notice should appear.
8. Create two managed clients. Invite a client administrator to one.
9. Verify the client administrator can access only that client—not the MSP parent or the second client.
10. Upload a test CRM and verify approved gaps reach Risk and POA&M for the selected client only.

## Rollback

Before creating managed clients, rollback is a Stripe subscription item change plus restoration of the backed-up tenant and organization records. After client creation, do not automatically demote the parent: preserve the hierarchy and suspend MSP capabilities while ownership and billing are reviewed.
