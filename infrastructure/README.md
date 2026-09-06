# Cuallee Cyber AWS infrastructure

This CDK application deploys the MSP Lambda functions and adds child routes to the existing Cuallee Cyber REST API. It imports rather than recreates the existing DynamoDB tables and API.

## Environment-specific configuration

Use the generic `parameters.example.json` as the schema reference. The environment templates deliberately keep AWS resource identifiers and secret ARNs as placeholders:

- `parameters.sandbox.example.json` contains the verified Stripe test Price IDs.
- `parameters.production.example.json` contains the verified Stripe live Price IDs.

Never deploy a sandbox Stripe secret with production Price IDs, or a live Stripe secret with sandbox Price IDs. Stripe objects are mode-specific.

The Secrets Manager value must be JSON:

```json
{"secretKey":"rk_test_or_live_value","webhookSecret":"whsec_value"}
```

Prefer a least-privilege Stripe restricted key (`rk_...`). Never commit the key, webhook signing secret, a populated secret file, or CloudFormation output containing those values.

## AI and GovCloud staging

AI defaults to `disabled`. The Bedrock parameters reserve the deployment contract while the GovCloud account and approved model list are pending. This stack does **not** deploy a Bedrock workload or grant model invocation permissions yet.

Keep `AiProvider=disabled` until all of the following are true:

1. The GovCloud account and target region are active.
2. The selected foundation and embedding models are approved for the required authorization boundary.
3. Tenant authorization is derived server-side from the authenticated membership.
4. Customer storage, retrieval indexes, encryption keys, and model requests use the selected isolation model.
5. Gemini and all other external AI fallbacks are disabled for customer evidence and CUI.

`TenantIsolationMode=siloed` is the production default. A pooled deployment must not be enabled without documented authorization tests proving that one tenant cannot address another tenant's records, objects, retrieval index, prompts, or responses.

## Commands

```bash
npm ci
npm run build
npm test -- --runInBand
npx cdk synth
```

Pass the selected environment file's values as CDK parameters. The Price parameters are explicitly split by billing interval:

```text
StripeMspBaseMonthlyPriceId
StripeMspClientMonthlyPriceId
StripeStarterMonthlyPriceId
StripeStarterAnnualPriceId
StripeProfessionalMonthlyPriceId
StripeProfessionalAnnualPriceId
StripeGuidedMonthlyPriceId
StripeGuidedAnnualPriceId
```

After deployment, update the existing `GET /orgs` and `POST /orgs` integrations using the stack outputs, merge the MSP webhook candidate logic into the existing Stripe webhook, and deploy the existing API stage. Follow `../docs/MSP_UPGRADE_RUNBOOK.md`.
