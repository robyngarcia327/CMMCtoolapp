# MSP hierarchy deployment

This change separates an MSP parent from each managed client and authorizes access through explicit organization memberships. Client data must continue to use the selected client `orgId` as its partition boundary.

## API routes

| Method | Route | Lambda |
|---|---|---|
| `GET` | `/orgs` | `lambda/list_orgs.py` |
| `POST` | `/orgs` | `lambda/create_org.py` |
| `GET`, `POST` | `/orgs/{parentOrgId}/clients` | `lambda/org_hierarchy.py` |
| `POST` | `/orgs/{orgId}/invitations` | `lambda/org_hierarchy.py` |
| `POST` | `/invitations/accept` | `lambda/org_hierarchy.py` |

Attach the existing Cognito authorizer to every route. Do not accept an organization ID as authorization by itself; the handlers verify an active membership and permitted role.

## Runtime configuration

- `ORG_DIRECTORY_TABLE` (required): DynamoDB table with string partition key `PK` and sort key `SK`.
- `APP_BASE_URL`: invitation link origin; defaults to `https://app.cualleecyber.com`.
- `INVITATION_FROM_EMAIL`: verified SES sender. If omitted, invitation records are created but email is not sent.
- `RETURN_INVITE_TOKEN`: development-only. Leave `false` in production.
- Enable DynamoDB TTL on the `ttl` attribute for invitation cleanup.

Grant `dynamodb:GetItem`, `Query`, `BatchGetItem`, and `TransactWriteItems` on the directory table. Grant `ses:SendEmail` only to the hierarchy function and only when invitation email is configured.

## Data contract

| PK | SK | Purpose |
|---|---|---|
| `ORG#{orgId}` | `META` | Organization metadata and parent relationship |
| `ORG#{orgId}` | `MEMBER#{sub}` | Authoritative organization membership |
| `USER#{sub}` | `ORG#{orgId}` | User-to-organization discovery index |
| `ORG#{mspOrgId}` | `CLIENT#{clientOrgId}` | MSP portfolio link |
| `INVITE#{sha256(token)}` | `META` | Hashed invitation lookup |

Before replacing legacy organization handlers, migrate existing organizations and memberships into this key structure. Validate in a non-production environment with Enterprise and MSP accounts, including a client administrator who can access only their client organization.
