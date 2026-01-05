
import React, { useEffect, useState } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [countdown, setCountdown] = useState(2); 
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const err = params.get('error');

    // If there is a code or error in the URL, the OIDC library is busy processing it.
    // We should show a loader and NOT trigger another signinRedirect.
    if (code || err) {
      setIsProcessingCallback(true);
      if (err) setUrlError(params.get('error_description') || err);
      return;
    }

    if (error || isLoading || urlError) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => Math.max(0, c - 0.5)), 500);
      return () => clearTimeout(timer);
    } else {
      onLogin();
    }
  }, [countdown, error, isLoading, onLogin, urlError]);

  const handleRetry = () => {
    // Clear URL parameters and local storage to start fresh
    sessionStorage.clear();
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    window.location.reload();
  };

  // Show a standard loading state if we are likely in the middle of a redirect or processing
  if (isLoading || isProcessingCallback && !urlError) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
           <Loader2 size={48} className="animate-spin text-blue-500 mx-auto" />
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Finalizing Secure Session...</p>
        </div>
      </div>
    );
  }

  if (error || urlError) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
         <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-10 text-center animate-in fade-in zoom-in duration-300">
             <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                 <AlertTriangle size={32} />
             </div>
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Access Denied</h2>
             <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg mb-6">
                <p className="text-slate-500 text-xs leading-relaxed font-mono break-all">
                  {urlError || error?.message || "Internal Auth Error"}
                </p>
             </div>
             <button 
                onClick={handleRetry}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs"
             >
                 <RefreshCw size={18} /> Reset & Retry
             </button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-md w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 relative z-10">
            <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center shadow-2xl mb-8">
                 <Shield size={48} className="text-blue-500" />
            </div>

            <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Cuallee Cyber</h2>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-10">Securing Compliance</p>
            
            <div className="w-full max-w-xs space-y-6">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-500 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        style={{ width: `${((2 - countdown) / 2) * 100}%` }}
                    ></div>
                </div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                    Connecting to Secure Gateway...
                </p>
            </div>

            <button 
                onClick={() => onLogin()}
                className="mt-12 text-slate-500 hover:text-white transition-all uppercase tracking-widest text-[10px] font-black border-b border-transparent hover:border-blue-500 pb-1"
            >
                Bypass Delay
            </button>
        </div>
    </div>
  );
};
