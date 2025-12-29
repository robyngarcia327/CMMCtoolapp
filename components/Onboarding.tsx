
import React, { useState, useEffect } from 'react';
import { Building2, ArrowRight, Loader2, RefreshCw, AlertCircle, RotateCcw, Info, Bug, Copy, Network, ShieldCheck, Check } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface OnboardingProps {
  user: User;
  onCreateOrganization: (name: string, domain: string) => void;
  onRefresh?: () => void;
  creationStatus?: 'idle' | 'creating' | 'verifying' | 'failed_verification';
  onRetryVerification?: (name: string) => void;
  errorMessage?: string | null;
  debugTokens?: {
      accessToken?: string;
      idToken?: string;
  };
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onCreateOrganization, onRefresh, creationStatus = 'idle', onRetryVerification, errorMessage, debugTokens }) => {
  const [orgName, setOrgName] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [isRunningDiag, setIsRunningDiag] = useState(false);
  
  // Domain Discovery State
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
          alert("Failed to join organization. Please contact your IT administrator.");
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

  const handleRetry = () => {
      if (onRetryVerification) {
          onRetryVerification(orgName);
      }
  };

  const handleHardReload = () => {
      window.location.reload();
  };

  const copyToClipboard = (text: string | undefined) => {
      if (text) {
          navigator.clipboard.writeText(text);
          alert("Token copied to clipboard");
      }
  };

  const runDiagnostics = async () => {
      if (!debugTokens?.idToken) return;
      setIsRunningDiag(true);
      setDiagnosticResult("Querying GET /orgs...");
      try {
          // Bypass the app's abstraction and fetch raw
          const raw = await api.getOrgs(debugTokens.idToken);
          setDiagnosticResult(JSON.stringify(raw, null, 2));
      } catch (e: any) {
          setDiagnosticResult(`API Failed: ${e.message}`);
      } finally {
          setIsRunningDiag(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500 my-8">
        
        <div className="p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Building2 size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Identity & Organization</h1>
            <p className="text-slate-600 mb-8 text-center text-sm leading-relaxed">
                Welcome, <strong>{user.email || 'User'}</strong>.<br/>
                We detected your domain: <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-blue-700 font-bold">{userDomain}</span>
            </p>
            
            {/* Suggested Organizations (Discovery) */}
            {suggestedOrgs.length > 0 && (
                <div className="mb-8 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        <ShieldCheck size={12} className="text-green-500" /> Existing Domain Assets Found
                    </div>
                    <div className="space-y-3">
                        {suggestedOrgs.map(org => (
                            <div key={org.orgId} className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex justify-between items-center group hover:border-blue-400 transition-all">
                                <div>
                                    <div className="font-black text-blue-900 text-sm">{org.name}</div>
                                    <div className="text-[10px] text-blue-600 font-bold uppercase">Managed Environment</div>
                                </div>
                                <button 
                                    onClick={() => handleJoin(org.orgId)}
                                    disabled={!!isJoining}
                                    className="bg-white border border-blue-300 text-blue-700 px-4 py-1.5 rounded-lg text-xs font-black shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center gap-2"
                                >
                                    {isJoining === org.orgId ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                    Join
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-px bg-slate-100 flex-1"></div>
                        <span className="text-[10px] font-bold text-slate-300 uppercase">Or create new</span>
                        <div className="h-px bg-slate-100 flex-1"></div>
                    </div>
                </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-800 text-sm mb-4 flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <div>
                        <p className="font-bold">Error</p>
                        <p className="text-xs opacity-90">{errorMessage}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">New Organization Name</label>
                    <input 
                        className="w-full border border-slate-300 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 font-medium"
                        placeholder="e.g. Acme Defense Solutions"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        autoFocus={suggestedOrgs.length === 0}
                        disabled={isSubmitting}
                    />
                </div>
                
                {creationStatus === 'failed_verification' ? (
                    <div className="space-y-3">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                            <div className="flex justify-center mb-2 text-amber-500">
                                <AlertCircle size={24} />
                            </div>
                            <p className="text-sm text-amber-800 font-medium mb-1">
                                Verification timed out.
                            </p>
                            <button 
                                type="button"
                                onClick={handleRetry}
                                className="w-full bg-amber-100 text-amber-800 font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-200 transition-colors mb-2 text-sm"
                            >
                                <RefreshCw size={14} /> Retry Verification
                            </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        type="submit"
                        disabled={!orgName.trim() || isSubmitting}
                        className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:translate-y-[-2px] shadow-xl disabled:opacity-50 disabled:translate-y-0 uppercase tracking-widest text-xs"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {creationStatus === 'verifying' ? 'Verifying Scope...' : 'Provisioning...'}
                            </>
                        ) : (
                            <>
                                <ArrowRight size={20} /> Create Workspace
                            </>
                        )}
                    </button>
                )}
            </form>

            {onRefresh && creationStatus !== 'failed_verification' && !isSubmitting && (
                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Already have access?</p>
                    <button 
                        onClick={onRefresh}
                        className="text-xs text-blue-600 font-black uppercase tracking-widest hover:text-blue-800 flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshCw size={14} /> Refresh Environment
                    </button>
                </div>
            )}

            {/* DEBUG TOGGLE */}
            <div className="mt-8 text-center">
                <button 
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mx-auto hover:text-slate-600 font-bold uppercase tracking-widest"
                >
                    <Bug size={10} /> {showDebug ? 'Hide Logs' : 'System Logs'}
                </button>
                {showDebug && (
                    <div className="mt-4 text-left bg-slate-900 text-green-400 p-4 rounded-xl text-[10px] font-mono overflow-auto max-h-96 break-all shadow-inner border border-slate-800">
                        <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                            <span className="font-bold text-white uppercase tracking-widest">Onboarding Diagnostics</span>
                            <button onClick={runDiagnostics} className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1">
                                {isRunningDiag ? <Loader2 className="animate-spin" size={10}/> : <Network size={10}/>}
                                Test API
                            </button>
                        </div>

                        {diagnosticResult && (
                            <div className="mb-4 p-2 bg-black/30 rounded border border-slate-700">
                                <div className="text-xs text-slate-400 mb-1 font-bold">Response Stream:</div>
                                <pre className="whitespace-pre-wrap">{diagnosticResult}</pre>
                            </div>
                        )}

                        <p><strong>Identity Domain:</strong> {userDomain}</p>
                        <p><strong>Public Domain:</strong> {isPublicDomain ? 'YES' : 'NO'}</p>
                        
                        <div className="mt-2 border-t border-slate-700 pt-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-500">ID Token:</span>
                                <button onClick={() => copyToClipboard(debugTokens?.idToken)} className="text-blue-400 hover:text-white"><Copy size={10}/></button>
                            </div>
                            <p className="opacity-70 truncate">{debugTokens?.idToken || 'None'}</p>
                        </div>

                        {errorMessage && <p className="text-red-400 mt-2 border-t border-red-900 pt-2"><strong>Last Exception:</strong> {errorMessage}</p>}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};
