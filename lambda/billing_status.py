from datetime import datetime,timezone
from common.utils import *
def iso(v): return datetime.fromtimestamp(int(v),timezone.utc).isoformat() if v else None
def lambda_handler(event,context):
 try:
  oid=((event.get('queryStringParameters') or {}).get('orgId') or '').strip(); member(oid,user_sub(event)); t=tenant_for_org(oid)
  if not t:return response(404,{'error':'No subscription found for this organization'})
  limit=int(t.get('storageLimitBytes',0))
  return response(200,{'orgId':oid,'status':t.get('status','inactive'),'planCode':t.get('planCode','readiness'),'renewalDate':iso(t.get('currentPeriodEnd')),'cancelAtPeriodEnd':bool(t.get('cancelAtPeriodEnd')),'storageUsedBytes':int(t.get('storageUsedBytes',0)),'storageLimitBytes':limit,'storageUnlimited':limit<0,'includedUserLimit':int(t.get('includedUserLimit',0)),'includedAssessorLimit':int(t.get('includedAssessorLimit',0)),'guidanceHoursMonthly':int(t.get('guidanceHoursMonthly',0))})
 except PermissionError as e:return response(403,{'error':str(e)})
 except Exception as e: print('billing_status',repr(e)); return response(500,{'error':'Internal error'})
