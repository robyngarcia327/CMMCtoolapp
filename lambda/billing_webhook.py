import base64,time,traceback,stripe
from common.utils import *
from common.stripe_utils import *
def plain(obj):
 return obj.to_dict() if hasattr(obj,'to_dict') else obj
def raw(event):
 b=event.get('body') or ''; return base64.b64decode(b) if event.get('isBase64Encoded') else b.encode()
def sub_id(obj):
 v=obj.get('subscription');
 if isinstance(v,dict): return v.get('id')
 if v:return v
 return ((((obj.get('parent') or {}).get('subscription_details') or {}).get('subscription')) or '')
def sync(sub,event_created):
 sub=plain(sub)
 sid=sub['id']; t=tenant_for_sub(sid)
 if not t:
  oid=(sub.get('metadata') or {}).get('orgId')
  t=tenant_for_org(oid) if oid else None
 if not t: raise RuntimeError('No tenant matches Stripe subscription')
 xs=((sub.get('items') or {}).get('data') or []); prices=[((x.get('price') or {}).get('id')) for x in xs]; code,p=plan_from_prices(prices); ps,pe=periods(sub)
 raw_status=sub.get('status',''); grace=int(time.time())+int(os.getenv('PAYMENT_GRACE_SECONDS','604800')) if raw_status=='past_due' else 0
 status={'trialing':'trialing','active':'canceling' if sub.get('cancel_at_period_end') else 'active','past_due':'past_due','unpaid':'inactive','canceled':'inactive','incomplete':'inactive','incomplete_expired':'inactive','paused':'inactive'}.get(raw_status,'inactive')
 values={':s':status,':sid':sid,':p':code,':cap':bool(sub.get('cancel_at_period_end')),':ps':ps,':pe':pe,':g':grace,':e':int(event_created),':u':now_iso(),':lim':int(p.get('storageBytes',t.get('storageLimitBytes',0))),':users':int(p.get('includedUsers',t.get('includedUserLimit',0))),':assessors':int(p.get('includedAssessors',t.get('includedAssessorLimit',0))),':hours':int(p.get('guidanceHoursMonthly',0))}
 tenants.update_item(Key={'tenantId':t['tenantId']},UpdateExpression='SET #s=:s,stripeSubscriptionId=:sid,stripeSubscriptionID=:sid,planCode=:p,cancelAtPeriodEnd=:cap,currentPeriodStart=:ps,currentPeriodEnd=:pe,graceUntil=:g,lastStripeEventCreated=:e,updatedAt=:u,storageLimitBytes=:lim,includedUserLimit=:users,includedAssessorLimit=:assessors,guidanceHoursMonthly=:hours',ConditionExpression='attribute_not_exists(lastStripeEventCreated) OR lastStripeEventCreated <= :e',ExpressionAttributeNames={'#s':'status'},ExpressionAttributeValues=values)
def process(evt):
 typ=evt['type']; obj=evt['data']['object']; created=int(evt.get('created') or 0)
 if typ=='checkout.session.completed':
  oid=(obj.get('metadata') or {}).get('orgId') or obj.get('client_reference_id'); t=tenant_for_org(oid)
  if not t: raise RuntimeError('Checkout references an unknown orgId')
  tenants.update_item(Key={'tenantId':t['tenantId']},UpdateExpression='SET stripeCustomerId=:c,updatedAt=:u',ExpressionAttributeValues={':c':obj.get('customer') or '',':u':now_iso()})
  sid=sub_id(obj)
  if sid: sync(client().v1.subscriptions.retrieve(sid),created)
 elif typ in {'customer.subscription.created','customer.subscription.updated','customer.subscription.deleted'}: sync(obj,created)
 elif typ in {'invoice.paid','invoice.payment_failed'}:
  sid=sub_id(obj)
  if sid: sync(client().v1.subscriptions.retrieve(sid),created)
def lambda_handler(event,context):
 sig=next((v for k,v in (event.get('headers') or {}).items() if k.lower()=='stripe-signature'),None)
 if not sig:return response(400,{'error':'Missing Stripe-Signature header'})
 try:
  evt=stripe.Webhook.construct_event(raw(event),sig,secret('STRIPE_WEBHOOK_SECRET_ARN','webhook_secret'))
  evt=plain(evt)
 except (ValueError,stripe.SignatureVerificationError):return response(400,{'error':'Invalid webhook signature'})
 eid=evt['id']; now=int(time.time())
 try: events.put_item(Item={'eventId':eid,'eventType':evt['type'],'eventCreated':int(evt.get('created') or 0),'status':'processing','leaseUntil':now+300,'receivedAt':now_iso()},ConditionExpression='attribute_not_exists(eventId)')
 except Exception as e:
  if 'ConditionalCheckFailed' in repr(e):
   old=events.get_item(Key={'eventId':eid},ConsistentRead=True).get('Item',{})
   if old.get('status')=='complete':return response(200,{'received':True,'duplicate':True})
   try: events.update_item(Key={'eventId':eid},UpdateExpression='SET #s=:p,leaseUntil=:l',ConditionExpression='leaseUntil < :n OR #s=:f',ExpressionAttributeNames={'#s':'status'},ExpressionAttributeValues={':p':'processing',':l':now+300,':n':now,':f':'failed'})
   except Exception:return response(409,{'error':'Event is already processing'})
  else: raise
 try:
  process(evt); events.update_item(Key={'eventId':eid},UpdateExpression='SET #s=:c,completedAt=:u REMOVE leaseUntil',ExpressionAttributeNames={'#s':'status'},ExpressionAttributeValues={':c':'complete',':u':now_iso()}); return response(200,{'received':True})
 except Exception as e:
  print('webhook',repr(e),traceback.format_exc()); events.update_item(Key={'eventId':eid},UpdateExpression='SET #s=:f,lastError=:e,failedAt=:u',ExpressionAttributeNames={'#s':'status'},ExpressionAttributeValues={':f':'failed',':e':str(e)[:500],':u':now_iso()}); return response(500,{'error':'Webhook processing failed'})
