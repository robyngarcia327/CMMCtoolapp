
import React, { useEffect, useState } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const err = params.get('error');
    const errDesc = params.get('error_description');

    // Case 1: We just arrived back from Cognito with a code
    if (code || state) {
      setIsProcessing(true);
      return;
    }

    // Case 2: Cognito sent us back with an error (e.g., redirect mismatch)
    if (err) {
      setInitError(errDesc || err);
      return;
    }

    // Case 3: We are just sitting at the login screen, trigger redirect
    if (!isLoading && !error && !initError) {
      onLogin();
    }
  }, [onLogin, isLoading, error, initError]);

  const handleClearAndRetry = () => {
    // Completely wipe all auth-related storage
    sessionStorage.clear();
    localStorage.clear();
    // Strip URL parameters
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    // Reload to start fresh
    window.location.reload();
  };

  // If there's an error (from URL or from the OIDC library)
  if (error || initError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Authentication Error</h2>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6">
            <p className="text-slate-500 text-xs font-mono break-all leading-relaxed">
              {initError || error?.message || "OIDC State Exception"}
            </p>
          </div>
          
          <button 
            onClick={handleClearAndRetry}
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs"
          >
            <RefreshCw size={18} /> Wipe Session & Retry
          </button>
          
          <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Note: This clears stale login data from your browser to resolve redirect loops.
          </p>
        </div>
      </div>
    );
  }

  // Standard loading/processing state
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <Shield size={64} className="text-blue-500/20 mx-auto" />
          <Loader2 size={32} className="animate-spin text-blue-500 absolute inset-0 m-auto" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Cuallee Cyber</h1>
          <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
            Establishing Secure Gateway
          </p>
        </div>
      </div>
    </div>
  );
};
