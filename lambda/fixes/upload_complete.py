import traceback
from common.utils import response, get_user_sub, require_membership, evid_table


def lambda_handler(event, context):
    """
    Marks an evidence upload as complete in DynamoDB.

    Called after the client has finished a direct S3 PUT to the presigned URL.
    Updates the 'status' field from 'upload_pending' to 'upload_complete'.

    Route: POST /orgs/{orgId}/evidence/{evidenceId}/upload-complete
    Auth:  Cognito (owner | admin | member)
    """
    try:
        user_sub = get_user_sub(event)
        path = event.get("pathParameters") or {}
        org_id = path.get("orgId")
        evidence_id = path.get("evidenceId")

        if not org_id or not evidence_id:
            return response(400, {"error": "orgId and evidenceId are required"})

        # Verify the caller is a member of this org
        require_membership(org_id, user_sub, {"owner", "admin", "member"})

        # Update status — ConditionExpression ensures the item must already exist
        evid_table.update_item(
            Key={
                "PK": f"ORG#{org_id}",
                "SK": f"EVID#{evidence_id}",
            },
            UpdateExpression="SET #s = :s, updatedAt = :ts",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={
                ":s": "upload_complete",
                ":ts": __import__("datetime").datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            },
            ConditionExpression="attribute_exists(PK)",
        )

        return response(200, {
            "status": "upload_complete",
            "evidenceId": evidence_id,
        })

    except evid_table.meta.client.exceptions.ConditionalCheckFailedException:
        return response(404, {"error": "Evidence record not found"})
    except PermissionError as e:
        return response(403, {"error": str(e)})
    except Exception as e:
        print("upload_complete ERROR:", str(e))
        print(traceback.format_exc())
        return response(500, {"error": "Internal error"})
