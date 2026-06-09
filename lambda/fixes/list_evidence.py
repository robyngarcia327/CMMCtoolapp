import traceback
from boto3.dynamodb.conditions import Key
from common.utils import (
    response,
    get_user_sub,
    require_membership,
    require_entitlement,          # ← FIXED: was missing from original
    evid_table,
)


def lambda_handler(event, context):
    """
    Lists all evidence items for an org, paginated.

    Route: GET /orgs/{orgId}/evidence
    Auth:  Cognito (owner | admin | member | auditor)
    """
    try:
        user_sub = get_user_sub(event)
        org_id = (event.get("pathParameters") or {}).get("orgId")
        if not org_id:
            return response(400, {"error": "orgId is required"})

        require_membership(org_id, user_sub, {"owner", "admin", "member", "auditor"})
        require_entitlement(org_id, "read")

        qs = event.get("queryStringParameters") or {}
        limit = min(int(qs.get("limit", "25")), 100)

        start_key = None
        if "nextPk" in qs and "nextSk" in qs:
            start_key = {"PK": qs["nextPk"], "SK": qs["nextSk"]}

        query_kwargs = {
            "KeyConditionExpression": (
                Key("PK").eq(f"ORG#{org_id}") & Key("SK").begins_with("EVID#")
            ),
            "Limit": limit,
            "ScanIndexForward": False,
        }
        if start_key:
            query_kwargs["ExclusiveStartKey"] = start_key

        resp = evid_table.query(**query_kwargs)
        items = resp.get("Items", [])

        evidence = [
            {
                "evidenceId": it.get("evidenceId"),
                "filename": it.get("filenameOriginal"),
                "contentType": it.get("contentType"),
                "sizeBytes": it.get("sizeBytes"),
                "uploadedBy": it.get("uploadedBy"),
                "uploadedAt": it.get("uploadedAt"),
                "status": it.get("status"),
            }
            for it in items
        ]

        out = {"evidence": evidence}
        lek = resp.get("LastEvaluatedKey")
        if lek:
            out["next"] = {"nextPk": lek["PK"], "nextSk": lek["SK"]}

        return response(200, out)

    except PermissionError as e:
        return response(403, {"error": str(e)})
    except Exception as e:
        print("list_evidence ERROR:", str(e))
        print(traceback.format_exc())
        return response(500, {"error": "Internal error"})
