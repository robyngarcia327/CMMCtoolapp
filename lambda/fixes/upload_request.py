import traceback
import uuid
from common.utils import (
    response,
    parse_json_body,
    get_user_sub,
    require_membership,
    require_entitlement,          # ← FIXED: was missing from original
    sanitize_filename,
    validate_file,
    enforce_upload_limits,
    now_iso,
    evid_table,
    s3,
    EVID_BUCKET,
    EVID_PREFIX_ROOT,
    UPLOAD_URL_TTL_SECONDS,
)


def lambda_handler(event, context):
    """
    Creates a presigned S3 PUT URL for evidence upload and writes a
    pending DynamoDB record.

    Route: POST /orgs/{orgId}/evidence/upload-request
    Auth:  Cognito (owner | admin | member)
    """
    try:
        user_sub = get_user_sub(event)
        org_id = (event.get("pathParameters") or {}).get("orgId")  # ← NOTE: use orgId (lowercase d, consistent with other Lambdas)
        if not org_id:
            return response(400, {"error": "orgId is required"})

        require_membership(org_id, user_sub, {"owner", "admin", "member"})
        require_entitlement(org_id, "write")

        body = parse_json_body(event)
        filename = sanitize_filename(body.get("filename") or "")
        content_type = (body.get("contentType") or "application/octet-stream").strip()
        size_bytes = int(body.get("sizeBytes") or 0)

        if not filename:
            return response(400, {"error": "filename is required"})

        validate_file(filename, content_type)
        enforce_upload_limits(size_bytes)

        evidence_id = str(uuid.uuid4())
        uploaded_at = now_iso()
        s3_key = f"{EVID_PREFIX_ROOT}/{org_id}/evidence/{evidence_id}/{filename}"

        evid_table.put_item(
            Item={
                "PK": f"ORG#{org_id}",
                "SK": f"EVID#{evidence_id}",
                "orgId": org_id,
                "evidenceId": evidence_id,
                "s3Key": s3_key,
                "filenameOriginal": filename,
                "contentType": content_type,
                "sizeBytes": size_bytes,
                "uploadedBy": user_sub,
                "uploadedAt": uploaded_at,
                "status": "upload_pending",
            }
        )

        upload_url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": EVID_BUCKET,
                "Key": s3_key,
                "ContentType": content_type,
            },
            ExpiresIn=UPLOAD_URL_TTL_SECONDS,
        )

        return response(200, {
            "orgId": org_id,
            "evidenceId": evidence_id,
            "s3Key": s3_key,
            "uploadUrl": upload_url,
            "expiresIn": UPLOAD_URL_TTL_SECONDS,
            "requiredHeaders": {"Content-Type": content_type},
        })

    except ValueError as e:
        return response(400, {"error": str(e)})
    except PermissionError as e:
        return response(403, {"error": str(e)})
    except Exception as e:
        print("upload_request ERROR:", str(e))
        print(traceback.format_exc())
        return response(500, {"error": "Internal error"})
