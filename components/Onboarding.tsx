import React, { useState, useEffect } from 'react';
import { Building2, ArrowRight, Loader2, RefreshCw, ShieldCheck, Check, DollarSign, Users, Wallet, Briefcase, Info, ArrowLeft } from 'lucide-react';
import { User, OrganizationFinancials } from '../types';
import { api } from '../services/api';

interface OnboardingProps {
  user: User;
  onCreateOrganization: (name: string, domain: string, financials: OrganizationFinancials) => void;
  onRefresh?: () => void;
  creationStatus?: 'idle' | 'creating' | 'verifying' | 'failed_verification';
  debugTokens?: {
      accessToken?: string;
  };
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onCreateOrganization, onRefresh, creationStatus = 'idle', debugTokens }) => {
  const [step, setStep] = useState<'DISCOVERY' | 'PROFILE' | 'FINANCIALS'>('DISCOVERY');
  const [orgName, setOrgName] = useState('');
  const [suggestedOrgs, setSuggestedOrgs] = useState<any[]>([]);
  const [isSearchingOrgs, setIsSearchingOrgs] = useState(false);
  const [isJoining, setIsJoining] = useState<string | null>(null);

  // Financial Data State
  const [financials, setFinancials] = useState<OrganizationFinancials>({
    annualRevenue: 5000000,
    employeeCount: 25,
    avgHourlyLaborRate: 125,
    brandValueEstimate: 1000000,
    legalRetentionAnnual: 50000
  });

  const userDomain = user.email.split('@')[1];
  const isPublicDomain = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com'].includes(userDomain.toLowerCase());

  useEffect(() => {
      if (userDomain && !isPublicDomain && debugTokens?.accessToken) {
          discoverOrgs();
      } else {
          setStep('PROFILE'); // Skip discovery for public domains
      }
  }, [userDomain, isPublicDomain, debugTokens?.accessToken]);

  const discoverOrgs = async () => {
      if (!debugTokens?.accessToken) return;
      setIsSearchingOrgs(true);
      try {
          const matched = await api.getSuggestedOrgs(debugTokens.accessToken, userDomain);
          setSuggestedOrgs(matched);
      } catch (e) {
          console.error("Discovery failed", e);
      } finally {
          setIsSearchingOrgs(false);
      }
  };

  const handleJoin = async (orgId: string) => {
      if (!debugTokens?.accessToken) return;
      setIsJoining(orgId);
      try {
          await api.joinOrg(debugTokens.accessToken, orgId);
          if (onRefresh) onRefresh();
      } catch (e: any) {
          alert("Failed to join organization: " + e.message);
      } finally {
          setIsJoining(null);
      }
  };

  const isSubmitting = creationStatus === 'creating' || creationStatus === 'verifying';

  const handleSubmitFinal = () => {
    onCreateOrganization(orgName, userDomain, financials);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
      
      <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl border border-slate-800/20 overflow-hidden animate-in fade-in zoom-in duration-500 my-8 relative z-10">
        
        {/* Progress Tracker */}
        <div className="bg-slate-900 px-10 py-6 border-b border-white/5 flex justify-between items-center">
            <div className="flex gap-4">
                {[1, 2, 3].map(num => (
                    <div key={num} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                        (num === 1 && step === 'DISCOVERY') || 
                        (num === 2 && step === 'PROFILE') || 
                        (num === 3 && step === 'FINANCIALS') 
                        ? 'bg-blue-500 scale-125' : 'bg-white/20'
                    }`} />
                ))}
            </div>
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Setup Step {step === 'DISCOVERY' ? 1 : step === 'PROFILE' ? 2 : 3} of 3</div>
        </div>

        <div className="p-10">
            {step === 'DISCOVERY' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-white shadow-xl rotate-3">
                        <Building2 size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 text-center tracking-tighter uppercase">Tenant Discovery</h1>
                    <p className="text-slate-500 mb-10 text-center text-sm leading-relaxed font-medium">
                        Identified domain: <span className="bg-blue-50 px-2 py-0.5 rounded font-mono text-blue-600 font-bold border border-blue-100">@{userDomain}</span>
                    </p>

                    {isSearchingOrgs ? (
                        <div className="flex flex-col items-center py-12">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Searching for your team...</p>
                        </div>
                    ) : suggestedOrgs.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">
                                <ShieldCheck size={12} className="text-green-500" /> Existing Organizations Found
                            </div>
                            {suggestedOrgs.map(org => (
                                <div key={org.orgId} className="bg-slate-50 border border-slate-200 p-6 rounded-3xl flex justify-between items-center group hover:border-blue-400 transition-all hover:bg-white hover:shadow-lg">
                                    <div>
                                        <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{org.name}</div>
                                        <div className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-1">Found via @{org.domain}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleJoin(org.orgId)}
                                        disabled={!!isJoining}
                                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 uppercase tracking-widest"
                                    >
                                        {isJoining === org.orgId ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        Join Team
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={() => setStep('PROFILE')}
                                className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors mt-6"
                            >
                                My organization isn't listed
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 mb-8">
                                <p className="text-sm text-slate-600 font-medium">No existing organization found for <strong>{userDomain}</strong>.</p>
                                <p className="text-xs text-slate-400 mt-2">You will be the first administrator for this domain.</p>
                            </div>
                            <button 
                                onClick={() => setStep('PROFILE')}
                                className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all uppercase tracking-widest text-xs"
                            >
                                Register New Organization <ArrowRight size={18} className="text-blue-500" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {step === 'PROFILE' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button onClick={() => setStep('DISCOVERY')} className="mb-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                        <ArrowLeft size={14}/> Discovery
                    </button>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase leading-none">Register Organization</h2>
                    <p className="text-slate-500 mb-10 text-sm font-medium">Define your legal entity to begin the compliance lifecycle.</p>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Legal Company Name</label>
                            <input 
                                className="w-full border-2 border-slate-100 bg-slate-50 rounded-[1.5rem] p-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900 text-lg"
                                placeholder="e.g. ArcLight Information Technology"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                            />
                        </div>
                        
                        <div className="bg-blue-50 p-6 rounded-[1.5rem] border border-blue-100 flex gap-4">
                            <Info size={24} className="text-blue-600 shrink-0" />
                            <p className="text-xs text-blue-900 leading-relaxed font-medium">
                                Organization names are used for System Security Plan (SSP) generation and official compliance attestation documents.
                            </p>
                        </div>

                        <button 
                            onClick={() => setStep('FINANCIALS')}
                            disabled={!orgName.trim()}
                            className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all uppercase tracking-widest text-xs disabled:opacity-30"
                        >
                            Configure Risk Benchmarks <ArrowRight size={18} className="text-blue-500" />
                        </button>
                    </div>
                </div>
            )}

            {step === 'FINANCIALS' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button onClick={() => setStep('PROFILE')} className="mb-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                        <ArrowLeft size={14}/> Entity Profile
                    </button>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase leading-none">Risk Benchmarking</h2>
                    <p className="text-slate-500 mb-8 text-sm font-medium">Enter financial baseline data for the <strong>FAIR Quantitative Risk Model</strong>.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1 flex items-center gap-1"><DollarSign size={10}/> Annual Revenue ($)</label>
                                <input 
                                    type="number"
                                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-3 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                                    value={financials.annualRevenue}
                                    onChange={e => setFinancials({...financials, annualRevenue: Number(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1 flex items-center gap-1"><Users size={10}/> Total Employee Count</label>
                                <input 
                                    type="number"
                                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-3 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                                    value={financials.employeeCount}
                                    onChange={e => setFinancials({...financials, employeeCount: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1 flex items-center gap-1"><Briefcase size={10}/> Avg Labor Rate ($/hr)</label>
                                <input 
                                    type="number"
                                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-3 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                                    value={financials.avgHourlyLaborRate}
                                    onChange={e => setFinancials({...financials, avgHourlyLaborRate: Number(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1 flex items-center gap-1"><Wallet size={10}/> Brand Value Est. ($)</label>
                                <input 
                                    type="number"
                                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-3 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                                    value={financials.brandValueEstimate}
                                    onChange={e => setFinancials({...financials, brandValueEstimate: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden mb-10 text-white">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="flex gap-4 items-center mb-4">
                            <Zap size={24} className="text-blue-400" />
                            <h4 className="font-black uppercase tracking-widest text-xs">Why this matters?</h4>
                        </div>
                        <p className="text-xs text-blue-200 leading-relaxed font-medium">
                            FAIR modeling uses your actual labor rates and revenue to forecast "Annualized Loss Expectancy" (ALE) for cyber incidents. This allows the system to tell you exactly which risk costs the most dollars per year.
                        </p>
                    </div>

                    <button 
                        onClick={handleSubmitFinal}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/40 hover:bg-blue-700 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Creating Secured Vault...
                            </>
                        ) : (
                            <>
                                Finalize & Launch Dashboard <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
      </div>
      
      <div className="absolute bottom-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] z-10">
          Secure Identity: {user.email}
      </div>
    </div>
  );
};

const Zap = ({ size, className }: { size: number, className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.7l10-10.7v6h6l-10 10.7v-6H4z"/></svg>
);
