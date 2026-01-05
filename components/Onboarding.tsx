
import React, { useState, useEffect } from 'react';
import { Building2, ArrowRight, Loader2, RefreshCw, ShieldCheck, Check } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface OnboardingProps {
  user: User;
  onCreateOrganization: (name: string, domain: string) => void;
  onRefresh?: () => void;
  creationStatus?: 'idle' | 'creating' | 'verifying' | 'failed_verification';
  debugTokens?: {
      idToken?: string;
  };
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onCreateOrganization, onRefresh, creationStatus = 'idle', debugTokens }) => {
  const [orgName, setOrgName] = useState('');
  const [suggestedOrgs, setSuggestedOrgs] = useState<any[]>([]);
  const [isSearchingOrgs, setIsSearchingOrgs] = useState(false);
  const [isJoining, setIsJoining] = useState<string | null>(null);

  const userDomain = user.email.split('@')[1];
  const isPublicDomain = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com'].includes(userDomain.toLowerCase());

  useEffect(() => {
      if (userDomain && !isPublicDomain && debugTokens?.idToken) {
          discoverOrgs();
      }
  }, [userDomain, isPublicDomain, debugTokens?.idToken]);

  const discoverOrgs = async () => {
      if (!debugTokens?.idToken) return;
      setIsSearchingOrgs(true);
      try {
          const matched = await api.getSuggestedOrgs(debugTokens.idToken, userDomain);
          setSuggestedOrgs(matched);
      } catch (e) {
          console.error("Discovery failed", e);
      } finally {
          setIsSearchingOrgs(false);
      }
  };

  const handleJoin = async (orgId: string) => {
      if (!debugTokens?.idToken) return;
      setIsJoining(orgId);
      try {
          await api.joinOrg(debugTokens.idToken, orgId);
          if (onRefresh) onRefresh();
      } catch (e) {
          alert("Failed to join organization.");
      } finally {
          setIsJoining(null);
      }
  };

  const isSubmitting = creationStatus === 'creating' || creationStatus === 'verifying';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    onCreateOrganization(orgName, userDomain);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500 my-8 relative z-10">
        <div className="p-10">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-white shadow-xl rotate-3">
                <Building2 size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 text-center tracking-tight">Access Control</h1>
            <p className="text-slate-500 mb-10 text-center text-sm leading-relaxed font-medium">
                Identity: <strong>{user.email}</strong><br/>
                Domain Detected: <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-blue-600 font-bold">@{userDomain}</span>
            </p>
            
            {suggestedOrgs.length > 0 ? (
                <div className="mb-10 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        <ShieldCheck size={12} className="text-green-500" /> Matches Found for {userDomain}
                    </div>
                    <div className="space-y-4">
                        {suggestedOrgs.map(org => (
                            <div key={org.orgId} className="bg-slate-50 border border-slate-200 p-5 rounded-3xl flex justify-between items-center group hover:border-blue-400 transition-all hover:bg-white hover:shadow-lg">
                                <div>
                                    <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{org.name}</div>
                                    <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Tenant Group Member</div>
                                </div>
                                <button 
                                    onClick={() => handleJoin(org.orgId)}
                                    disabled={!!isJoining}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                                >
                                    {isJoining === org.orgId ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                    Join
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                         <p className="text-xs text-slate-500 italic leading-relaxed">
                            Users with matching email domains are automatically grouped. Contact your Global Admin if you need to create a unique sub-tenant.
                         </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Organization / Tenant Name</label>
                        <input 
                            className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white outline-none transition-all disabled:text-slate-500 font-bold text-slate-900"
                            placeholder="e.g. Acme Defense Solutions"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={!orgName.trim() || isSubmitting}
                        className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] shadow-2xl disabled:opacity-50 disabled:translate-y-0 uppercase tracking-[0.2em] text-xs"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Provisioning Tenant...
                            </>
                        ) : (
                            <>
                                <ArrowRight size={20} className="text-blue-500" /> Start Registration
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};
