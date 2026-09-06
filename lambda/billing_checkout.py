import os, stripe
from common.utils import *
from common.stripe_utils import *
def lambda_handler(event,context):
 try:
  b=body(event); oid=(b.get('orgId') or '').strip()
  if not oid: raise ValueError('orgId is required; create the organization before checkout')
  sub=user_sub(event); member(oid,sub,{'owner','admin'}); t=tenant_for_org(oid)
  code=(b.get('planCode') or '').lower(); interval=(b.get('interval') or 'month').lower()
  if code not in {'starter','professional','guided','msp'}: raise ValueError('planCode is not available for self-service checkout')
  if interval not in {'month','year'}: raise ValueError('interval must be month or year')
  if code=='msp' and interval!='month': raise ValueError('MSP is available monthly only')
  p=plan(code)
  lines=[]
  if p.get('basePrices'):
   lines.append({'price':p['basePrices'][interval],'quantity':1}); qty=int(b.get('managedClientCount') or 1)
   if qty<1: raise ValueError('managedClientCount must be at least 1')
   lines.append({'price':p['clientPrices'][interval],'quantity':qty})
  else: lines=[{'price':p['prices'][interval],'quantity':1}]
  params={'mode':'subscription','line_items':lines,'success_url':os.environ['APP_SUCCESS_URL']+'?session_id={CHECKOUT_SESSION_ID}','cancel_url':os.environ['APP_CANCEL_URL'],'client_reference_id':oid,'integration_identifier':integration_id(),'metadata':{'orgId':oid,'planCode':code,'userSub':sub},'subscription_data':{'metadata':{'orgId':oid,'planCode':code}}}
  if t and t.get('stripeCustomerId'): params['customer']=t['stripeCustomerId']
  else: params['customer_email']=claims(event).get('email') or b.get('email')
  sess=client().v1.checkout.sessions.create(params=params,options={'idempotency_key':f'checkout:{oid}:{code}:{interval}'})
  return response(200,{'url':sess.url,'sessionId':sess.id})
 except (ValueError,KeyError) as e:return response(400,{'error':str(e)})
 except PermissionError as e:return response(403,{'error':str(e)})
 except stripe.StripeError as e: print('stripe',repr(e)); return response(502,{'error':stripe_error(e)})
 except Exception as e: print('billing_checkout',repr(e)); return response(500,{'error':'Internal error'})
