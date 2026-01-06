
import React, { useEffect, useState } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [showManualButton, setShowManualButton] = useState(false);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    // If we are coming back from Cognito, don't trigger another redirect
    if (code || state) {
      setIsProcessingCallback(true);
      return;
    }

    // Try automatic login after a short delay to ensure library is ready
    const timer = setTimeout(() => {
      if (!isLoading && !error) {
        try {
          onLogin();
        } catch (e) {
          console.error("Auto-redirect failed", e);
          setShowManualButton(true);
        }
      }
    }, 1000);

    // If it hasn't moved after 3 seconds, show the manual button
    const fallbackTimer = setTimeout(() => setShowManualButton(true), 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [onLogin, isLoading, error]);

  const handleClearAndRetry = () => {
    sessionStorage.clear();
    localStorage.clear();
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    window.location.reload();
  };

  // If there's an active error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Auth Exception</h2>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6">
            <p className="text-slate-500 text-xs font-mono break-all leading-relaxed">
              {error.message}
            </p>
          </div>
          <button 
            onClick={handleClearAndRetry}
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs"
          >
            <RefreshCw size={18} /> Reset Session
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
          {(isLoading || isProcessingCallback) && !showManualButton && (
            <div className="absolute -bottom-2 -right-2">
               <Loader2 size={32} className="animate-spin text-blue-500 bg-slate-950 rounded-full" />
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">Cuallee Cyber</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
            {isProcessingCallback ? 'Validating Token...' : 'Compliance Gateway'}
          </p>
        </div>

        {showManualButton ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
             <button 
                onClick={() => onLogin()}
                className="w-full bg-white hover:bg-blue-50 text-slate-950 font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-900/20 group uppercase tracking-widest text-sm"
              >
                <Lock size={18} className="text-blue-600" />
                Secure Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleClearAndRetry}
                className="text-slate-600 hover:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
              >
                Clear Stale State
              </button>
          </div>
        ) : (
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
            Establishing Secure Link...
          </p>
        )}
      </div>
    </div>
  );
};
