# Cuallee Cyber AWS infrastructure

This CDK application deploys the new MSP Lambda functions and adds new child routes to the existing Cuallee Cyber REST API. It imports rather than recreates the existing DynamoDB tables and API.

## Automated by this stack

- Organization create/list Lambda packages, with outputs for the existing `/orgs` integrations
- Managed-client hierarchy and invitation Lambda
- Responsibility-matrix Lambda
- Existing-subscription MSP upgrade Lambda
- MSP webhook synchronization candidate Lambda
- New API resources and Cognito-protected methods
- Lambda execution roles, DynamoDB/SES permissions, logs, and X-Ray tracing

## Required inputs

Copy `parameters.example.json` and replace every placeholder. Existing API resource IDs are available with `aws apigateway get-resources --rest-api-id <id>`.

The Secrets Manager value must be JSON:

```json
{"secretKey":"sk_test_or_live_value","webhookSecret":"whsec_value"}
```

## Commands

```bash
npm ci
npm run build
npm test -- --runInBand
npx cdk synth
npx cdk deploy --parameters ExistingRestApiId=... --parameters ExistingOrgIdResourceId=... --parameters ExistingBillingResourceId=... --parameters ExistingCognitoAuthorizerId=... --parameters OrgDirectoryTableName=... --parameters TenantsTableName=... --parameters StripeSecretArn=... --parameters StripePythonLayerArn=... --parameters StripeMspBasePriceId=... --parameters StripeMspClientPriceId=... --parameters StripeStarterPriceId=... --parameters StripeProfessionalPriceId=... --parameters StripeGuidedPriceId=... --parameters InvitationFromEmail=...
```

After deployment, update the existing `GET /orgs` and `POST /orgs` integrations using the stack outputs, merge the MSP webhook candidate logic into the existing Stripe webhook, and deploy the existing API stage. Follow `../docs/MSP_UPGRADE_RUNBOOK.md`.
