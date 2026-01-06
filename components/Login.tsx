
import React, { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { Shield, Loader2, Lock, ArrowRight, RefreshCcw, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error: propError }) => {
  const auth = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showForceButton, setShowForceButton] = useState(false);

  // If loading takes too long (3.5s), show the force button to handle hang cases
  useEffect(() => {
    let timer: any;
    if (auth.isLoading) {
      timer = setTimeout(() => setShowForceButton(true), 3500);
    } else {
      setShowForceButton(false);
    }
    return () => clearTimeout(timer);
  }, [auth.isLoading]);

  const handleSignIn = async () => {
    setLocalError(null);
    try {
      // Clear any stale state before attempting fresh redirect
      sessionStorage.clear();
      await onLogin();
    } catch (e: any) {
      console.error("Login redirect failed:", e);
      setLocalError(e.message || "Could not reach the identity provider.");
    }
  };

  const handleClearEverything = () => {
    sessionStorage.clear();
    localStorage.clear();
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    window.location.reload();
  };

  const activeError = propError?.message || localError;

  // If the AuthProvider is busy and NOT showing the force button yet
  if (auth.isLoading && !showForceButton) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
          Verifying Identity...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
      
      <div className="text-center space-y-10 relative z-10 max-w-sm w-full">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-2xl mx-auto ring-1 ring-blue-500/20">
            <Shield size={52} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">Cuallee Cyber</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
              Compliance Management Suite
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleSignIn}
            className="w-full bg-white hover:bg-blue-50 text-slate-950 font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-900/20 group uppercase tracking-widest text-sm"
          >
            <Lock size={18} className="text-blue-600" />
            {auth.isLoading ? 'Force Sign In' : 'Secure Sign In'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          {activeError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 justify-center mb-1">
                <AlertCircle size={14} className="text-red-400" />
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">
                  Authentication Failed
                </p>
              </div>
              <p className="text-slate-400 text-[10px] italic break-words">
                {activeError}
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 space-y-3">
          <button 
            onClick={handleClearEverything}
            className="text-slate-600 hover:text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCcw size={12} /> Troubleshoot / Reset Session
          </button>
          {auth.isLoading && (
            <p className="text-slate-600 text-[8px] italic max-w-[200px] mx-auto">
              Initialization is taking longer than expected. Use the button above to manually trigger the identity gateway.
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">
        NIST 800-171 & CMMC 2.0 // Enterprise Standard
      </div>
    </div>
  );
};
