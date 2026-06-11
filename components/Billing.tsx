import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Zap, ArrowRight, Loader2, CheckCircle2, AlertCircle, ExternalLink, Clock, Info } from 'lucide-react';
import { api } from '../services/api';
import { BillingStatus } from '../types';

interface BillingProps {
  accessToken: string;
  orgId: string;
  orgName: string;
}

export const Billing: React.FC<BillingProps> = ({ accessToken, orgId, orgName }) => {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingStatus();
  }, [orgId]);

  const fetchBillingStatus = async () => {
    setIsLoading(true);
    try {
      const data = await api.getBillingStatus(accessToken, orgId);
      setStatus(data);
    } catch (e: any) {
      console.error("Failed to fetch billing status", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePortalSession = async () => {
    setIsActionLoading(true);
    try {
      const { url } = await api.createPortalSession(accessToken, orgId);
      window.location.href = url;
    } catch (e: any) {
      alert("Failed to open billing portal: " + e.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription? You will retain access until the end of your current billing period.")) return;
    
    setIsActionLoading(true);
    try {
      await api.cancelSubscription(accessToken, orgId);
      await fetchBillingStatus();
    } catch (e: any) {
      alert("Failed to cancel subscription: " + e.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-coral-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Billing & Subscription</h1>
          <p className="text-slate-500 font-medium">Manage your plan and payment methods for {orgName}.</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck size={14} className="text-coral-400" />
          Enterprise Secure
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-coral-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-coral-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Zap size={24} />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Plan</div>
                <div className="text-2xl font-black text-slate-900 uppercase tracking-tight">CMMC Preparation Platform</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                <div className="flex items-center gap-2">
                  {status?.status === 'active' ? (
                    <span className="flex items-center gap-1.5 text-green-600 font-black text-sm uppercase tracking-widest">
                      <CheckCircle2 size={14} /> Active
                    </span>
                  ) : status?.status === 'canceling' ? (
                    <span className="flex items-center gap-1.5 text-amber-600 font-black text-sm uppercase tracking-widest">
                      <Clock size={14} /> Canceling
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-red-600 font-black text-sm uppercase tracking-widest">
                      <AlertCircle size={14} /> Inactive
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Renewal Date</div>
                <div className="text-slate-900 font-bold">
                  {status?.renewalDate ? new Date(status.renewalDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handlePortalSession}
                disabled={isActionLoading}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
              >
                {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <ExternalLink size={16} />}
                Manage in Stripe
              </button>
              
              {status?.status === 'active' && !status.cancelAtPeriodEnd && (
                <button 
                  onClick={handleCancel}
                  disabled={isActionLoading}
                  className="bg-white border-2 border-slate-100 text-slate-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-red-500 hover:border-red-100 transition-all disabled:opacity-50"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats / Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-coral-500/10 rounded-full blur-2xl -mb-16 -mr-16"></div>
            <h3 className="text-[10px] font-black text-coral-400 uppercase tracking-widest mb-4">Enterprise Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
              Need to add more seats or custom compliance frameworks?
            </p>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Contact Sales
            </button>
          </div>

          <div className="bg-coral-50 border border-coral-100 rounded-[2rem] p-8">
            <div className="flex items-center gap-2 text-coral-600 font-black text-[10px] uppercase tracking-widest mb-2">
              <Info size={14} /> Billing Policy
            </div>
            <p className="text-[10px] text-coral-900/60 leading-relaxed font-medium">
              Subscriptions are billed annually. Cancellations take effect at the end of the current billing cycle. No partial refunds are provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
