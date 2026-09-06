import stripe
from common.utils import *
from common.stripe_utils import *
def lambda_handler(event,context):
 try:
  oid=(body(event).get('orgId') or '').strip(); member(oid,user_sub(event),{'owner','admin'}); t=tenant_for_org(oid)
  if not t or not t.get('stripeSubscriptionId'):return response(404,{'error':'No Stripe subscription is linked to this organization'})
  client().v1.subscriptions.update(t['stripeSubscriptionId'],params={'cancel_at_period_end':True},options={'idempotency_key':'cancel:'+t['stripeSubscriptionId']})
  tenants.update_item(Key={'tenantId':t['tenantId']},UpdateExpression='SET #s=:s,cancelAtPeriodEnd=:b,updatedAt=:u',ExpressionAttributeNames={'#s':'status'},ExpressionAttributeValues={':s':'canceling',':b':True,':u':now_iso()})
  return response(200,{'status':'canceling','cancelAtPeriodEnd':True})
 except PermissionError as e:return response(403,{'error':str(e)})
 except stripe.StripeError as e:return response(502,{'error':stripe_error(e)})
 except Exception as e: print('billing_cancel',repr(e)); return response(500,{'error':'Internal error'})

