from common.utils import *
def lambda_handler(event,context):
 try:
  oid=((event.get('queryStringParameters') or {}).get('orgId') or '').strip(); member(oid,user_sub(event)); t=tenant_for_org(oid)
  if not t:return response(404,{'error':'Organization entitlement not found'})
  used=int(t.get('storageUsedBytes',0)); reserved=int(t.get('storageReservedBytes',0)); limit=int(t.get('storageLimitBytes',0))
  unlimited=limit<0
  return response(200,{'orgId':oid,'usedBytes':used,'reservedBytes':reserved,'limitBytes':limit,'unlimited':unlimited,'remainingBytes':None if unlimited else max(0,limit-used-reserved)})
 except PermissionError as e:return response(403,{'error':str(e)})
 except Exception as e: print('billing_usage',repr(e)); return response(500,{'error':'Internal error'})
