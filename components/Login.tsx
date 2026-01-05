
import React, { useState, useEffect } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw, Lock, ArrowRight, Trash2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const err = params.get('error');

    if (code) {
      setIsProcessing(true);
    }
    if (err) {
      setUrlError(params.get('error_description') || err);
    }
  }, []);

  const handleRetry = () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    window.location.reload();
  };

  const handleNuclearReset = () => {
      // Clear EVERYTHING that could be causing a state mismatch
      localStorage.clear();
      sessionStorage.clear();
      handleRetry();
  };

  const handleManualLogin = () => {
    setIsProcessing(true);
    onLogin();
  };

  // Loading / Processing State
  if (isLoading || (isProcessing && !urlError && !error)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
           <div className="relative">
              <Shield size={64} className="text-blue-500/20 mx-auto" />
              <Loader2 size={32} className="animate-spin text-blue-500 absolute inset-0 m-auto" />
           </div>
           <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
             Verifying Credentials...
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        </div>

        <div className="max-w-md w-full flex flex-col items-center relative z-10">
            <div className="mb-12 text-center group">
                <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center justify-center shadow-2xl mb-6 transition-transform group-hover:rotate-3 duration-500">
                    <Shield size={48} className="text-blue-500" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Cuallee Cyber</h1>
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em]">Compliance Gateway</p>
            </div>

            {(error || urlError) ? (
                <div className="w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Login Error</h2>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6">
                        <p className="text-slate-500 text-xs font-mono break-all leading-relaxed">
                            {urlError || error?.message || "OIDC Context Error"}
                        </p>
                    </div>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={handleRetry}
                            className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs shadow-xl"
                        >
                            <RefreshCw size={18} /> Retry Sign In
                        </button>
                        <button 
                            onClick={handleNuclearReset}
                            className="w-full bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[10px]"
                        >
                            <Trash2 size={14} /> Clear Stale Data
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <button 
                        onClick={handleManualLogin}
                        className="w-full bg-white hover:bg-blue-50 text-slate-950 font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-900/20 group uppercase tracking-widest text-sm"
                    >
                        <Lock size={18} className="text-blue-600" />
                        Secure Sign In
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        NIST 800-171 // CMMC 2.0 // FedRAMP
                    </p>
                </div>
            )}
            
            <div className="mt-24 text-slate-700 text-[9px] font-black uppercase tracking-[0.5em] flex items-center gap-3">
                <span>&copy; {new Date().getFullYear()}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                <span>Encrypted Session</span>
            </div>
        </div>
    </div>
  );
};
