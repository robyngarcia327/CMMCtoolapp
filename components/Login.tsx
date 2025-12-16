import React, { useEffect, useState, useRef } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw, LogOut, Copy, CheckCircle2, Wrench, PauseCircle } from 'lucide-react';
import { authConfig } from '../authConfig';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [copied, setCopied] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-redirect logic with cancellation capability
  useEffect(() => {
    if (!error && !isLoading && isRedirecting) {
      if (countdown > 0) {
          timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
          onLogin();
      }
    }
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [error, isLoading, isRedirecting, countdown, onLogin]);

  const handleCopy = () => {
      navigator.clipboard.writeText(authConfig.redirect_uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const cancelRedirect = () => {
      setIsRedirecting(false);
      if (timerRef.current) clearTimeout(timerRef.current);
  };

  // ERROR STATE (From App wrapper)
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
         <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100">
                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                     <AlertTriangle size={24} />
                 </div>
                 <div>
                     <h2 className="text-xl font-bold text-red-900">Authentication Failed</h2>
                     <p className="text-red-700 text-sm">The security gateway rejected the connection.</p>
                 </div>
             </div>
             
             <div className="p-8">
                 <div className="mb-6">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">Error Message</p>
                     <div className="bg-slate-50 border border-slate-200 rounded p-3 font-mono text-sm text-slate-700 break-all">
                        {error.message || "Unknown Error"}
                     </div>
                 </div>

                 <div className="flex flex-col gap-3">
                     <button 
                        onClick={() => {
                            window.history.replaceState({}, document.title, window.location.pathname);
                            window.location.reload();
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                     >
                         <RefreshCw size={18} /> Retry Login
                     </button>
                 </div>
             </div>
         </div>
      </div>
    );
  }

  // MANUAL DEBUG / PAUSED STATE
  if (!isRedirecting) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-amber-50 p-6 border-b border-amber-100">
                    <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                        <Wrench size={24} /> Configuration Helper
                    </h2>
                    <p className="text-amber-700 text-sm mt-1">
                        If you are seeing a <strong>redirect_mismatch</strong> error on the AWS/Cognito page, it means the URL below is missing from your configuration.
                    </p>
                </div>
                
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Required Callback URL</label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-slate-100 border border-slate-300 px-3 py-3 rounded-lg text-sm font-mono text-slate-800 break-all select-all">
                                {authConfig.redirect_uri}
                            </code>
                            <button 
                                onClick={handleCopy}
                                className="p-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                                title="Copy to clipboard"
                            >
                                {copied ? <CheckCircle2 size={20} className="text-green-600"/> : <Copy size={20}/>}
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            <strong>Action:</strong> Copy this URL exactly. Go to AWS Cognito Console &rarr; App Client Settings &rarr; Allowed callback URLs. Paste it there.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex gap-3">
                        <button 
                            onClick={onLogin} 
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <RefreshCw size={18} /> Try Connecting Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // LOADING / COUNTDOWN STATE
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center text-center max-w-sm">
        <div className="relative mb-8">
             <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
             <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
                 <Shield size={48} className="text-blue-500" />
             </div>
        </div>
        
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Securing Connection</h2>
                <p className="text-slate-400 text-sm mt-1">Redirecting to Identity Provider in {countdown}s...</p>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                ></div>
            </div>
            
            <button 
                onClick={cancelRedirect}
                className="text-xs text-slate-500 hover:text-white flex items-center justify-center gap-2 mx-auto px-4 py-2 hover:bg-white/5 rounded-full transition-colors"
            >
                <PauseCircle size={14} /> 
                Wait! I have connection issues
            </button>
        </div>
      </div>
    </div>
  );
};