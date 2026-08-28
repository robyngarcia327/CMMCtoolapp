import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  ExternalLink,
  Loader2,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import { api } from '../services/api';

interface BillingProps {
  accessToken: string;
  orgId: string;
  orgName: string;
}

interface BillingStatus {
  status: string;
  planCode: string;
  renewalDate?: string | null;
  cancelAtPeriodEnd?: boolean;
  storageUsedBytes?: number;
  storageLimitBytes?: number;
  storageUnlimited?: boolean;
  includedUserLimit?: number;
  includedAssessorLimit?: number;
  guidanceHoursMonthly?: number;
}

interface Usage {
  usedBytes: number;
  reservedBytes: number;
  limitBytes: number;
  unlimited: boolean;
  remainingBytes?: number | null;
}

type PaidPlan = 'starter' | 'professional' | 'guided' | 'msp';
type Interval = 'month' | 'year';

const PLANS: Array<{
  code: PaidPlan;
  name: string;
  monthly: string;
  annual?: string;
  description: string;
  features: string[];
}> = [
  {
    code: 'starter',
    name: 'Starter',
    monthly: '$299/month',
    annual: '$3,200/year',
    description: 'A focused workspace for organizations beginning their CMMC program.',
    features: ['50 GB evidence storage', '5 users', '1 assessor']
  },
  {
    code: 'professional',
    name: 'Professional',
    monthly: '$599/month',
    annual: '$7,000/year',
    description: 'More capacity for established compliance teams and assessors.',
    features: ['100 GB evidence storage', '10 users', '3 assessors']
  },
  {
    code: 'guided',
    name: 'Guided',
    monthly: '$1,499/month',
    annual: '$17,000/year',
    description: 'Hands-on help using Cuallee Cyber throughout your program.',
    features: ['Unlimited storage and users', '5 assessors', 'Up to 5 guidance hours/month']
  },
  {
    code: 'msp',
    name: 'MSP',
    monthly: '$499 + $100/client/month',
    description: 'A multi-client subscription for managed service providers.',
    features: ['Unlimited storage and users', '5 assessors', 'Base plus managed-client pricing']
  }
];

const formatBytes = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unit = -1;
  do {
    value /= 1024;
    unit += 1;
  } while (value >= 1024 && unit < units.length - 1);
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`;
};

const titleCase = (value?: string) =>
  (value || 'readiness').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

export const Billing: React.FC<BillingProps> = ({ accessToken, orgId, orgName }) => {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [interval, setInterval] = useState<Interval>('month');
  const [managedClientCount, setManagedClientCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [action, setAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkoutReturned = new URLSearchParams(window.location.search).has('session_id');
  const planChangesEnabled = import.meta.env.VITE_ENABLE_PLAN_CHANGES === 'true';
  const hasSubscription = Boolean(status && !['readiness', 'inactive'].includes(status.status));
  const storagePercent = useMemo(() => {
    if (!usage || usage.unlimited || usage.limitBytes <= 0) return 0;
    return Math.min(100, Math.round(((usage.usedBytes + usage.reservedBytes) / usage.limitBytes) * 100));
  }, [usage]);

  const loadBilling = useCallback(async () => {
    if (!orgId || !accessToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const [billingStatus, billingUsage] = await Promise.all([
        api.getBillingStatus(accessToken, orgId),
        api.getBillingUsage(accessToken, orgId)
      ]);
      setStatus(billingStatus);
      setUsage(billingUsage);
    } catch (e: any) {
      setError(e.message || 'Unable to load billing information.');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, orgId]);

  useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  const beginCheckout = async (planCode: PaidPlan) => {
    setAction(`checkout-${planCode}`);
    setError(null);
    try {
      const checkoutInterval: Interval = planCode === 'msp' ? 'month' : interval;
      const { url } = await api.createCheckoutSession(
        accessToken,
        orgId,
        planCode,
        checkoutInterval,
        planCode === 'msp' ? managedClientCount : undefined
      );
      window.location.assign(url);
    } catch (e: any) {
      setError(e.message || 'Checkout could not be started.');
      setAction(null);
    }
  };

  const changePlan = async (planCode: PaidPlan) => {
    if (planCode === 'msp' || !planChangesEnabled) return;
    const timing = status?.planCode === 'starter' && planCode !== 'starter' && interval === 'month'
      ? 'The upgrade will be applied immediately and Stripe will invoice the prorated difference.'
      : 'The change will take effect at the next renewal.';
    if (!window.confirm(`Change to ${titleCase(planCode)}? ${timing}`)) return;
    setAction(`change-${planCode}`);
    setError(null);
    try {
      const result = await api.changePlan(accessToken, orgId, planCode, interval);
      window.alert(result.changeType === 'immediate_upgrade'
        ? 'Upgrade submitted. Billing will refresh after Stripe confirms it.'
        : 'Plan change scheduled for the next renewal.');
      await loadBilling();
    } catch (e: any) {
      setError(e.message || 'The plan could not be changed.');
    } finally {
      setAction(null);
    }
  };

  const openPortal = async () => {
    setAction('portal');
    setError(null);
    try {
      const { url } = await api.createPortalSession(accessToken, orgId);
      window.location.assign(url);
    } catch (e: any) {
      setError(e.message || 'The billing portal could not be opened.');
      setAction(null);
    }
  };

  const cancelSubscription = async () => {
    if (!window.confirm('Cancel at the end of the current billing period? Your access remains active until then.')) return;
    setAction('cancel');
    try {
      await api.cancelSubscription(accessToken, orgId);
      await loadBilling();
    } catch (e: any) {
      setError(e.message || 'The subscription could not be canceled.');
    } finally {
      setAction(null);
    }
  };

  const resumeSubscription = async () => {
    setAction('resume');
    try {
      await api.resumeSubscription(accessToken, orgId);
      await loadBilling();
    } catch (e: any) {
      setError(e.message || 'The subscription could not be resumed.');
    } finally {
      setAction(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-coral-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-coral-600 mb-2">Account administration</div>
          <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter">Billing & Subscription</h1>
          <p className="text-slate-500 font-medium mt-2">Manage the plan, capacity, and payment settings for {orgName}.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 text-white rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck size={16} className="text-coral-400" />
          Secure Stripe Billing
        </div>
      </div>

      {checkoutReturned && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <CheckCircle2 className="text-emerald-600 shrink-0" />
          <div className="flex-1">
            <div className="font-black text-emerald-950 uppercase tracking-tight">Checkout completed</div>
            <p className="text-sm text-emerald-800">Stripe is confirming the subscription. Refresh if the updated plan is not visible yet.</p>
          </div>
          <button onClick={loadBilling} className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black uppercase text-emerald-700">
            <RefreshCcw size={14} /> Refresh
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 text-red-800">
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-7 md:p-9 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current plan</div>
              <div className="text-3xl font-black text-slate-950 uppercase tracking-tight mt-1">{titleCase(status?.planCode)}</div>
            </div>
            <span className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
              status?.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
              status?.status === 'canceling' ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-600'
            }`}>
              {status?.status || 'Readiness'}
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 rounded-2xl p-5">
              <Database size={18} className="text-coral-600 mb-3" />
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Storage</div>
              <div className="font-black text-slate-900 mt-1">{usage?.unlimited ? 'Unlimited' : formatBytes(usage?.limitBytes)}</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5">
              <Users size={18} className="text-coral-600 mb-3" />
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Included users</div>
              <div className="font-black text-slate-900 mt-1">{status?.includedUserLimit === -1 ? 'Unlimited' : status?.includedUserLimit ?? 0}</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5">
              <Clock size={18} className="text-coral-600 mb-3" />
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Renews / ends</div>
              <div className="font-black text-slate-900 mt-1">{status?.renewalDate ? new Date(status.renewalDate).toLocaleDateString() : 'Not scheduled'}</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
              <span>{formatBytes((usage?.usedBytes || 0) + (usage?.reservedBytes || 0))} used</span>
              <span>{usage?.unlimited ? 'Unlimited capacity' : `${storagePercent}%`}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-coral-600 rounded-full transition-all" style={{ width: `${usage?.unlimited ? 4 : storagePercent}%` }} />
            </div>
          </div>

          {hasSubscription && (
            <div className="flex flex-wrap gap-3">
              <button onClick={openPortal} disabled={!!action} className="bg-slate-950 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                {action === 'portal' ? <Loader2 size={15} className="animate-spin" /> : <ExternalLink size={15} />}
                Manage payment details
              </button>
              <a href="mailto:billing@cualleecyber.com?subject=Subscription%20assistance" className="border-2 border-slate-100 text-slate-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:border-coral-100 hover:text-coral-600">
                Contact billing
              </a>
            </div>
          )}
        </section>

        <aside className="bg-slate-950 rounded-[2rem] p-8 text-white relative overflow-hidden">
          <Sparkles className="text-coral-400 mb-6" size={28} />
          <h2 className="text-xl font-black uppercase tracking-tight">Need a tailored plan?</h2>
          <p className="text-sm text-slate-400 leading-relaxed mt-3">Enterprise subscriptions are sales-assisted so we can match complex environments, storage, and support requirements.</p>
          <a href="mailto:sales@cualleecyber.com?subject=Cuallee%20Cyber%20Enterprise" className="mt-8 inline-flex items-center gap-2 bg-white text-slate-950 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest">
            Contact sales <ArrowRight size={14} />
          </a>
        </aside>
      </div>

      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">{hasSubscription ? 'Available plans' : 'Choose a paid plan'}</h2>
            <p className="text-sm text-slate-500 mt-1">{hasSubscription ? (planChangesEnabled ? 'Upgrades are prorated immediately; downgrades and interval changes begin at renewal.' : 'Contact billing to change an active subscription. This prevents duplicate subscriptions and unexpected charges.') : 'Checkout is securely hosted by Stripe.'}</p>
          </div>
          <div className="bg-white border border-slate-200 p-1 rounded-xl flex">
            {(['month', 'year'] as Interval[]).map(value => (
              <button key={value} onClick={() => setInterval(value)} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${interval === value ? 'bg-slate-950 text-white' : 'text-slate-500'}`}>
                {value === 'month' ? 'Monthly' : 'Annual'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANS.map(plan => {
            const isMspAnnual = plan.code === 'msp' && interval === 'year';
            const isCurrent = status?.planCode === plan.code;
            return (
              <article key={plan.code} className={`bg-white border rounded-[1.75rem] p-6 flex flex-col ${isCurrent ? 'border-coral-500 ring-2 ring-coral-100' : 'border-slate-200'}`}>
                <div className="flex justify-between gap-3">
                  <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">{plan.name}</h3>
                  {isCurrent && <span className="text-[9px] font-black uppercase text-coral-600">Current</span>}
                </div>
                <div className="text-coral-600 font-black mt-2">{interval === 'year' && plan.annual ? plan.annual : plan.monthly}</div>
                <p className="text-xs text-slate-500 leading-relaxed mt-4">{plan.description}</p>
                <ul className="space-y-2 mt-5 mb-6">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex gap-2 text-xs font-medium text-slate-700"><Check size={14} className="text-emerald-500 shrink-0" />{feature}</li>
                  ))}
                </ul>
                {plan.code === 'msp' && interval === 'month' && (
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-5">
                    Managed clients
                    <input type="number" min={1} max={999} value={managedClientCount} onChange={e => setManagedClientCount(Math.max(1, Number(e.target.value) || 1))} className="mt-2 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900" />
                  </label>
                )}
                <button
                  onClick={() => hasSubscription ? changePlan(plan.code) : beginCheckout(plan.code)}
                  disabled={!!action || isMspAnnual || isCurrent || (hasSubscription && (!planChangesEnabled || plan.code === 'msp'))}
                  className="mt-auto w-full bg-slate-950 text-white rounded-xl py-3 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {action === `checkout-${plan.code}` || action === `change-${plan.code}` ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                  {isCurrent ? 'Current plan' : hasSubscription ? (planChangesEnabled && plan.code !== 'msp' ? 'Change plan' : 'Contact billing to change') : isMspAnnual ? 'Monthly only' : 'Continue to checkout'}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <p className="text-[10px] text-slate-400 leading-relaxed">
        Prices shown exclude applicable taxes. Stripe Tax is not enabled until the required tax registrations are confirmed.
      </p>
    </div>
  );
};
