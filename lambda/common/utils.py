import base64, json, os, re, uuid
from datetime import datetime, timezone
import boto3
from boto3.dynamodb.conditions import Key

ddb=boto3.resource('dynamodb'); ddbc=boto3.client('dynamodb'); s3=boto3.client('s3')
ORG_TABLE=os.getenv('ORG_TABLE','OrgDirectory'); TENANT_TABLE=os.getenv('TENANT_TABLE','Tenants')
EVIDENCE_TABLE=os.getenv('EVIDENCE_TABLE','Evidence'); EVENT_TABLE=os.getenv('STRIPE_EVENT_TABLE','StripeWebhookEvents')
orgs=ddb.Table(ORG_TABLE); tenants=ddb.Table(TENANT_TABLE); evidence=ddb.Table(EVIDENCE_TABLE); events=ddb.Table(EVENT_TABLE)
BUCKET=os.getenv('EVIDENCE_BUCKET',''); PREFIX=os.getenv('EVIDENCE_PREFIX','orgs')
ORG_INDEX=os.getenv('TENANT_ORG_INDEX','OrgIdIndex'); SUB_INDEX=os.getenv('TENANT_SUBSCRIPTION_INDEX','StripeSubscriptionIndex')
SUB_INDEX_KEY=os.getenv('TENANT_SUBSCRIPTION_KEY','stripeSubscriptionID')

def now_iso(): return datetime.now(timezone.utc).isoformat().replace('+00:00','Z')
def response(code,body):
 return {'statusCode':code,'headers':{'content-type':'application/json','access-control-allow-origin':os.getenv('CORS_ORIGIN','*')},'body':json.dumps(body,default=str)}
def body(event):
 raw=event.get('body') or '{}'; raw=base64.b64decode(raw) if event.get('isBase64Encoded') else raw
 try: return json.loads(raw)
 except Exception: raise ValueError('Request body must be valid JSON')
def claims(event):
 a=(event.get('requestContext') or {}).get('authorizer') or {}
 return a.get('claims') or (a.get('jwt') or {}).get('claims') or {}
def user_sub(event):
 sub=claims(event).get('sub')
 if not sub: raise PermissionError('Authentication required')
 return sub
def path(event,key):
 params=event.get('pathParameters') or {}
 legacy=key[:-2]+'ID' if key.endswith('Id') else key
 return (params.get(key) or params.get(legacy) or '').strip()
def member(org_id,sub,roles=None):
 item=orgs.get_item(Key={'PK':f'ORG#{org_id}','SK':f'USER#{sub}'},ConsistentRead=True).get('Item')
 if not item or item.get('memberStatus','active')!='active': raise PermissionError('Organization membership required')
 role=(item.get('role') or '').lower()
 if roles and role not in roles: raise PermissionError('Owner or administrator role required')
 return item
def tenant_for_org(org_id):
 meta=orgs.get_item(Key={'PK':f'ORG#{org_id}','SK':'META'},ConsistentRead=True).get('Item')
 if meta and meta.get('tenantId'):
  direct=tenants.get_item(Key={'tenantId':meta['tenantId']},ConsistentRead=True).get('Item')
  if direct:return direct
 xs=tenants.query(IndexName=ORG_INDEX,KeyConditionExpression=Key('orgId').eq(org_id),Limit=1).get('Items',[])
 return xs[0] if xs else None
def tenant_for_sub(sub_id):
 xs=tenants.query(IndexName=SUB_INDEX,KeyConditionExpression=Key(SUB_INDEX_KEY).eq(sub_id),Limit=1).get('Items',[])
 return xs[0] if xs else None
def entitlement(org_id,action='read'):
 t=tenant_for_org(org_id)
 if not t: raise PermissionError('No organization entitlement exists')
 status=t.get('status','inactive'); allowed=status in {'readiness','active','trialing','canceling','past_due'}
 if not allowed or (action=='write' and status=='past_due' and int(t.get('graceUntil',0)) < int(datetime.now(timezone.utc).timestamp())): raise PermissionError('Subscription does not permit this action')
 return t

def quota_is_unlimited(tenant):
 return int(tenant.get('storageLimitBytes',0)) < 0
def safe_filename(name):
 name=re.sub(r'[^A-Za-z0-9._ -]','_',str(name)).strip(' .')[:180]
 if not name: raise ValueError('filename is required')
 return name
def org_transaction(sub,name,domain=''):
 if not name.strip(): raise ValueError('name is required')
 oid='org_'+uuid.uuid4().hex[:16]; tid='tenant_'+uuid.uuid4().hex[:16]; ts=now_iso()
 from boto3.dynamodb.types import TypeSerializer
 ser=TypeSerializer(); av=lambda d:{k:ser.serialize(v) for k,v in d.items()}
 items=[
  (ORG_TABLE,{'PK':f'ORG#{oid}','SK':'META','orgId':oid,'tenantId':tid,'orgName':name.strip(),'domain':domain.strip().lower(),'ownerSub':sub,'createdAt':ts}),
  (ORG_TABLE,{'PK':f'ORG#{oid}','SK':f'USER#{sub}','orgId':oid,'userSub':sub,'role':'owner','memberStatus':'active','createdAt':ts}),
  (ORG_TABLE,{'PK':f'USER#{sub}','SK':f'ORG#{oid}','orgId':oid,'orgName':name.strip(),'role':'owner','memberStatus':'active','createdAt':ts}),
  (TENANT_TABLE,{'tenantId':tid,'orgId':oid,'orgName':name.strip(),'ownerSub':sub,'tenantType':'ENTERPRISE','planCode':'readiness','status':'readiness','storageUsedBytes':0,'storageReservedBytes':0,'storageCommittedBytes':0,'storageLimitBytes':int(os.getenv('READINESS_STORAGE_BYTES','1073741824')),'includedUserLimit':2,'includedAssessorLimit':0,'createdAt':ts,'updatedAt':ts})]
 ddbc.transact_write_items(TransactItems=[{'Put':{'TableName':t,'Item':av(i),'ConditionExpression':'attribute_not_exists('+('PK' if 'PK' in i else 'tenantId')+')'}} for t,i in items])
 return {'orgId':oid,'tenantId':tid,'orgName':name.strip(),'createdAt':ts,'storagePrefix':f'{PREFIX}/{oid}/'}
