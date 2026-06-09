# Fix for `create_org` Lambda
#
# The function `create_org_with_owner()` in utils.py returns:
#   {"orgId": org_id, "createdAt": created_at, "storagePrefix": storage_prefix}
#
# But the create_org handler accesses `created["orgID"]` (capital I, capital D).
# This causes a KeyError at runtime every time someone creates an org.
#
# FIND AND REPLACE in the AWS Lambda Console for `create_org`:
#
#   BEFORE:
#     "orgID": created["orgID"],
#
#   AFTER:
#     "orgId": created["orgId"],
#
# The corrected return block should look like:

from common.utils import response, parse_json_body, get_user_sub, create_org_with_owner, create_org_placeholder_object
import traceback

def lambda_handler(event, context):
    try:
        user_sub = get_user_sub(event)
        body = parse_json_body(event)
        name = (body.get("name") or "").strip()

        created = create_org_with_owner(user_sub, name)

        create_org_placeholder_object(created["storagePrefix"])

        return response(201, {
            "orgId": created["orgId"],          # ← FIXED: was created["orgID"]
            "name": name,
            "storagePrefix": created["storagePrefix"],
            "createdAt": created["createdAt"]
        })

    except Exception as e:
        print("ERROR:", repr(e))
        print(traceback.format_exc())
        return response(500, {
            "error": "Internal error",
            "requestId": getattr(context, "aws_request_id", None)
        })
