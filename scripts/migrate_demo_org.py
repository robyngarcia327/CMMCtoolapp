#!/usr/bin/env python3
"""Dry-run-first migration of one legacy billing tenant into OrgDirectory.

Run in AWS CloudShell with the same region as the application. Nothing is
written unless --apply is supplied.
"""

import argparse
import json
import time

import boto3
from boto3.dynamodb.types import TypeSerializer

SERIALIZE = TypeSerializer().serialize


def av(item):
    return {key: SERIALIZE(value) for key, value in item.items() if value is not None}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant-table", required=True)
    parser.add_argument("--org-table", required=True)
    parser.add_argument("--tenant-id", required=True)
    parser.add_argument("--region", default="us-east-1")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    ddb = boto3.client("dynamodb", region_name=args.region)
    tenant_result = ddb.get_item(TableName=args.tenant_table, Key={"tenantId": {"S": args.tenant_id}}, ConsistentRead=True)
    if "Item" not in tenant_result: raise SystemExit("Tenant record not found; no changes made.")
    from boto3.dynamodb.types import TypeDeserializer
    decoder = TypeDeserializer()
    tenant = {key: decoder.deserialize(value) for key, value in tenant_result["Item"].items()}
    required = [key for key in ("orgId", "orgName", "ownerSub") if not tenant.get(key)]
    if required: raise SystemExit(f"Tenant is missing {', '.join(required)}; no changes made.")
    org_id, owner, name = tenant["orgId"], tenant["ownerSub"], tenant["orgName"]
    plan = tenant.get("planCode", "starter")
    is_msp = plan == "msp" or tenant.get("tenantType") == "MSP"
    now = int(time.time())
    items = [
        {"PK": f"ORG#{org_id}", "SK": "META", "entityType": "ORGANIZATION", "orgId": org_id, "orgName": name, "domain": tenant.get("domain", ""), "planCode": "msp" if is_msp else plan, "tenantType": "MSP" if is_msp else "ENTERPRISE", "edition": "MSP" if is_msp else "ENTERPRISE", "relationshipType": "PARENT" if is_msp else "STANDALONE", "isParent": is_msp, "status": "ACTIVE", "createdAt": now, "createdBy": owner},
        {"PK": f"ORG#{org_id}", "SK": f"MEMBER#{owner}", "entityType": "MEMBERSHIP", "orgId": org_id, "userSub": owner, "role": "MSP_OWNER" if is_msp else "Tenant_Admin", "status": "ACTIVE", "createdAt": now},
        {"PK": f"USER#{owner}", "SK": f"ORG#{org_id}", "entityType": "USER_ORG_MEMBERSHIP", "orgId": org_id, "orgName": name, "role": "MSP_OWNER" if is_msp else "Tenant_Admin", "planCode": "msp" if is_msp else plan, "tenantType": "MSP" if is_msp else "ENTERPRISE", "edition": "MSP" if is_msp else "ENTERPRISE", "relationshipType": "PARENT" if is_msp else "STANDALONE", "isParent": is_msp, "status": "ACTIVE", "createdAt": now},
    ]
    print(json.dumps({"mode": "APPLY" if args.apply else "DRY_RUN", "tenant": args.tenant_id, "organization": org_id, "writes": items}, indent=2))
    if not args.apply:
        print("Dry run only. Re-run with --apply after reviewing the resolved IDs and attributes.")
        return
    ddb.transact_write_items(TransactItems=[{"Put": {"TableName": args.org_table, "Item": av(item)}} for item in items])
    print("Migration committed. Sign out and back in, then verify GET /orgs before changing billing.")


if __name__ == "__main__":
    main()

