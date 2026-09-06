import os,stripe
from common.utils import *
from common.stripe_utils import *
def lambda_handler(event,context):
 try:
  oid=(body(event).get('orgId') or '').strip(); member(oid,user_sub(event),{'owner','admin'}); t=tenant_for_org(oid)
  if not t or not t.get('stripeCustomerId'):return response(404,{'error':'No Stripe customer is linked to this organization'})
  s=client().v1.billing_portal.sessions.create(params={'customer':t['stripeCustomerId'],'return_url':os.environ['APP_SUCCESS_URL']})
  return response(200,{'url':s.url})
 except PermissionError as e:return response(403,{'error':str(e)})
 except stripe.StripeError as e:return response(502,{'error':stripe_error(e)})
 except Exception as e: print('billing_portal',repr(e)); return response(500,{'error':'Internal error'})

