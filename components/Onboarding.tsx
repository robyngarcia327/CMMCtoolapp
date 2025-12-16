import React, { useState } from 'react';
import { Building2, ArrowRight, Loader2, RefreshCw, AlertCircle, RotateCcw, Info, Bug, Copy, Network } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface OnboardingProps {
  user: User;
  onCreateOrganization: (name: string) => void;
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
  
  const isSubmitting = creationStatus === 'creating' || creationStatus === 'verifying';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    onCreateOrganization(orgName);
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Create your organization</h1>
            <p className="text-slate-600 mb-8 text-center text-sm">
                Welcome, <strong>{user.email || 'User'}</strong>.<br/>
                To get started, please set up your organization workspace.
            </p>
            
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                    <input 
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                        placeholder="e.g. Acme Corp"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        autoFocus
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
                            <p className="text-xs text-amber-600 mb-3">
                                The organization may have been created but is not yet visible to the application due to synchronization delays.
                            </p>
                            <button 
                                type="button"
                                onClick={handleRetry}
                                className="w-full bg-amber-100 text-amber-800 font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-200 transition-colors mb-2 text-sm"
                            >
                                <RefreshCw size={14} /> Retry Verification
                            </button>
                        </div>
                        
                        <div className="text-center pt-2">
                            <p className="text-xs text-slate-400 mb-2">If you are certain it was created:</p>
                            <button 
                                type="button"
                                onClick={handleHardReload}
                                className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                            >
                                <RotateCcw size={16} /> Force Reload Application
                            </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        type="submit"
                        disabled={!orgName.trim() || isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {creationStatus === 'verifying' ? 'Verifying...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <ArrowRight size={20} /> Create Organization
                            </>
                        )}
                    </button>
                )}
            </form>

            {onRefresh && creationStatus !== 'failed_verification' && !isSubmitting && (
                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 mb-2">Already created an organization?</p>
                    <button 
                        onClick={onRefresh}
                        className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshCw size={14} /> Refresh Data
                    </button>
                </div>
            )}

            {/* DEBUG TOGGLE */}
            <div className="mt-8 text-center">
                <button 
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mx-auto hover:text-slate-600"
                >
                    <Bug size={10} /> {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                </button>
                {showDebug && (
                    <div className="mt-2 text-left bg-slate-900 text-green-400 p-3 rounded text-[10px] font-mono overflow-auto max-h-96 break-all shadow-inner border border-slate-800">
                        <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                            <span className="font-bold text-white">Diagnostics</span>
                            <button onClick={runDiagnostics} className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1">
                                {isRunningDiag ? <Loader2 className="animate-spin" size={10}/> : <Network size={10}/>}
                                Test Connectivity
                            </button>
                        </div>

                        {diagnosticResult && (
                            <div className="mb-4 p-2 bg-black/30 rounded border border-slate-700">
                                <div className="text-xs text-slate-400 mb-1 font-bold">GET /orgs Response:</div>
                                <pre className="whitespace-pre-wrap">{diagnosticResult}</pre>
                            </div>
                        )}

                        <p><strong>Auth Sub:</strong> {user.id}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>App Version:</strong> 1.0.3 (Diag Mode)</p>
                        
                        <div className="mt-2 border-t border-slate-700 pt-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-500">Access Token:</span>
                                <button onClick={() => copyToClipboard(debugTokens?.accessToken)} className="text-blue-400 hover:text-white"><Copy size={10}/></button>
                            </div>
                            <p className="opacity-70">{debugTokens?.accessToken ? debugTokens.accessToken.substring(0, 50) + '...' : 'None'}</p>
                        </div>

                        <div className="mt-2 border-t border-slate-700 pt-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-500">ID Token (Used for API):</span>
                                <button onClick={() => copyToClipboard(debugTokens?.idToken)} className="text-blue-400 hover:text-white"><Copy size={10}/></button>
                            </div>
                            <p className="opacity-70">{debugTokens?.idToken ? debugTokens.idToken.substring(0, 50) + '...' : 'None'}</p>
                        </div>

                        {errorMessage && <p className="text-red-400 mt-2 border-t border-red-900 pt-2"><strong>Last Error:</strong> {errorMessage}</p>}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};