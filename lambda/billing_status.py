"""
billing_status.py
=================
Returns the current subscription status for an org.

Route:  GET /billing/status?orgId={orgId}
Auth:   Cognito

NOTE: This endpoint intentionally does NOT call require_entitlement()
      because we want inactive/cancelled users to be able to see their
      status so they can resubscribe.

Environment Variables Required:
  TENANT_TABLE — DynamoDB table name (default: Tenants)
"""
import traceback
from datetime import datetime, timezone
from boto3.dynamodb.conditions import Attr

from common.utils import response, get_user_sub, tenant_table


def _find_tenant(org_id: str) -> dict | None:
    """
    Find tenant by orgId.
    OPTIMIZATION NOTE: Add a GSI named 'OrgIdIndex' with PK=orgId to the
    Tenants table in DynamoDB, then replace this scan with a query:

        resp = tenant_table.query(
            IndexName="OrgIdIndex",
            KeyConditionExpression=Key("orgId").eq(org_id),
            Limit=1,
        )
    """
    resp = tenant_table.scan(
        FilterExpression=Attr("orgId").eq(org_id)
    )
    items = resp.get("Items", [])
    return items[0] if items else None


def lambda_handler(event, context):
    try:
        # Validate the caller is authenticated (even though we don't check entitlement)
        get_user_sub(event)

        qs = event.get("queryStringParameters") or {}
        org_id = qs.get("orgId", "").strip()
        if not org_id:
            return response(400, {"error": "orgId query parameter is required"})

        tenant = _find_tenant(org_id)
        if not tenant:
            # No tenant = no subscription yet (common for new users pre-payment)
            return response(404, {"error": "No subscription found for this organization"})

        period_end = tenant.get("currentPeriodEnd")
        renewal_date = None
        if period_end:
            try:
                renewal_date = datetime.fromtimestamp(
                    int(period_end), tz=timezone.utc
                ).isoformat()
            except (ValueError, TypeError):
                renewal_date = str(period_end)

        return response(200, {
            "status":            tenant.get("status", "inactive"),
            "renewalDate":       renewal_date,
            "cancelAtPeriodEnd": tenant.get("cancelAtPeriodEnd", False),
            "currentPriceId":    tenant.get("stripePriceId"),
            "orgId":             org_id,
        })

    except ValueError as e:
        return response(400, {"error": str(e)})
    except Exception as e:
        print("billing_status ERROR:", str(e))
        print(traceback.format_exc())
        return response(500, {"error": "Internal error"})
