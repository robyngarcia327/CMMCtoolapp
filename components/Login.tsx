
import React, { useEffect, useState } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw, PlayCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [countdown, setCountdown] = useState(2); 
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    // Detect OIDC errors from Cognito in the URL query string
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
        setUrlError(params.get('error_description') || params.get('error'));
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
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
  };

  if (error || urlError) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
         <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-10 text-center animate-in fade-in zoom-in duration-300">
             <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                 <AlertTriangle size={32} />
             </div>
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Authentication Error</h2>
             <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                We couldn't verify your identity with AWS. Please check your network connection or AWS Console configuration.
             </p>
             <button 
                onClick={handleRetry}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs"
             >
                 <RefreshCw size={18} /> Retry Connection
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
