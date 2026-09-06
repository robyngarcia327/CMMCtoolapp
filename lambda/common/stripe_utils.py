import json, os, random, string
import boto3, stripe
from .utils import tenants, tenant_for_org, now_iso

sm=boto3.client('secretsmanager'); _cache={}
def secret(env,key=None):
 arn=os.environ[env]
 if arn not in _cache: _cache[arn]=sm.get_secret_value(SecretId=arn).get('SecretString','')
 val=_cache[arn]
 if key:
  try: return json.loads(val)[key]
  except Exception: pass
 return val
def client(): return stripe.StripeClient(secret('STRIPE_API_KEY_SECRET_ARN','api_key'))
def catalog():
 try: return json.loads(os.environ['PLAN_CATALOG_JSON'])
 except Exception: raise RuntimeError('PLAN_CATALOG_JSON is missing or invalid')
def plan(code):
 p=catalog().get(code)
 if not p: raise ValueError('Unknown planCode')
 return p
def plan_from_prices(ids):
 wanted=set(ids)
 for code,p in catalog().items():
  known=set((p.get('prices') or {}).values())|set((p.get('basePrices') or {}).values())|set((p.get('clientPrices') or {}).values())
  if wanted & known: return code,p
 return 'unknown',{}
def integration_id(): return 'cuallee_web_'+''.join(random.choice(string.ascii_lowercase) for _ in range(8))
def stripe_error(e): return getattr(e,'user_message',None) or 'Stripe request failed'
def periods(sub):
 xs=((sub.get('items') or {}).get('data') or [])
 starts=[int(x.get('current_period_start') or 0) for x in xs if x.get('current_period_start')]
 ends=[int(x.get('current_period_end') or 0) for x in xs if x.get('current_period_end')]
 return (min(starts) if starts else 0,max(ends) if ends else 0)

