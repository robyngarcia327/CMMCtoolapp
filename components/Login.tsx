
import React, { useEffect, useState } from 'react';
import { useAuth } from "react-oidc-context";
import { Shield, Loader2, AlertTriangle, RefreshCw, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const auth = useAuth();
  const [attemptedAuto, setAttemptedAuto] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    // 1. Detect if we are already in the middle of a redirect or processing a callback
    const params = new URLSearchParams(window.location.search);
    const hasCallbackParams = params.has('code') || params.has('state');
    
    // If the library is busy, or we are handling a callback, do nothing and show loading
    if (auth.activeNavigator === "signinSilent" || auth.activeNavigator === "signinRedirect" || hasCallbackParams) {
      return;
    }

    // 2. Automated Redirect Attempt
    if (!auth.isAuthenticated && !auth.isLoading && !error && !attemptedAuto) {
      setAttemptedAuto(true);
      const timer = setTimeout(() => {
        try {
          onLogin();
        } catch (e) {
          console.error("Auto-login failed:", e);
          setManualMode(true);
        }
      }, 500); // Small delay to let AuthProvider initialize

      return () => clearTimeout(timer);
    }
    
    // 3. Fallback: If after 4 seconds we haven't moved, show manual button
    const fallback = setTimeout(() => setManualMode(true), 4000);
    return () => clearTimeout(fallback);

  }, [auth.isAuthenticated, auth.isLoading, auth.activeNavigator, onLogin, error, attemptedAuto]);

  const handleResetAndRetry = () => {
    sessionStorage.clear();
    localStorage.clear();
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    window.location.reload();
  };

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Login Blocked</h2>
          <p className="text-slate-500 text-xs mb-6 font-medium leading-relaxed">
            {error.message.includes("Redirect URI") 
              ? "The URL you are visiting isn't whitelisted in Cognito. Please ensure you are using the correct domain."
              : error.message}
          </p>
          <button 
            onClick={handleResetAndRetry}
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs"
          >
            <RefreshCw size={18} /> Reset Gateway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
      
      <div className="text-center space-y-8 relative z-10 max-w-sm w-full">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center justify-center shadow-2xl mb-2">
            <Shield size={52} className="text-blue-500" />
          </div>
          {!manualMode && (
            <div className="absolute -bottom-2 -right-2">
               <Loader2 size={32} className="animate-spin text-blue-500 bg-slate-950 rounded-full" />
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">Cuallee Cyber</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
            Compliance Infrastructure
          </p>
        </div>

        {manualMode ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
             <button 
                onClick={() => onLogin()}
                className="w-full bg-white hover:bg-blue-50 text-slate-950 font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-900/20 group uppercase tracking-widest text-sm"
              >
                <Lock size={18} className="text-blue-600" />
                Open Secure Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-slate-600 text-[10px] font-medium max-w-[200px] mx-auto leading-relaxed">
                Automatic redirect failed. Click above to open the secure identity gateway.
              </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Establishing Encrypted Handshake...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
