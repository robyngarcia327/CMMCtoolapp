import React, { useEffect, useState } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw, Copy, CheckCircle2, PauseCircle, PlayCircle, Info } from 'lucide-react';
import { authConfig } from '../authConfig';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  // Default to 1.5s delay to allow user to interrupt if config is broken, 
  // but fast enough to feel "hosted".
  const [countdown, setCountdown] = useState(1.5); 
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (error || isLoading || isPaused) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => Math.max(0, c - 0.5)), 500);
      return () => clearTimeout(timer);
    } else {
      onLogin();
    }
  }, [countdown, isPaused, error, isLoading, onLogin]);

  const handleCopy = () => {
    navigator.clipboard.writeText(authConfig.redirect_uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ERROR STATE: User returned from Cognito with an error (e.g. access_denied)
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100">
                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                     <AlertTriangle size={24} />
                 </div>
                 <div>
                     <h2 className="text-xl font-bold text-red-900">Sign In Error</h2>
                     <p className="text-red-700 text-sm">Authentication failed.</p>
                 </div>
             </div>
             
             <div className="p-8">
                 <div className="mb-6">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">Error Details</p>
                     <div className="bg-slate-50 border border-slate-200 rounded p-3 font-mono text-xs text-slate-700 break-all">
                        {error.message || "Unknown Authorization Error"}
                     </div>
                 </div>

                 <button 
                    onClick={() => {
                        // Clear URL params to reset state
                        window.history.replaceState({}, document.title, window.location.pathname);
                        window.location.reload();
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                 >
                     <RefreshCw size={18} /> Retry Login
                 </button>
             </div>
         </div>
      </div>
    );
  }

  // AUTO-REDIRECT STATE
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-md w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 relative z-10">
            
            <div className="relative mb-8">
                 <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
                     {isPaused ? <PauseCircle size={48} className="text-amber-500"/> : <Shield size={48} className="text-blue-500" />}
                 </div>
                 {/* Pulse Effect */}
                 {!isPaused && (
                    <div className="absolute inset-0 bg-blue-500 rounded-3xl animate-ping opacity-20"></div>
                 )}
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
                {isPaused ? 'Redirect Paused' : 'Connecting to Secure Gateway...'}
            </h2>
            
            {!isPaused && (
                <p className="text-slate-400 text-sm mb-8 h-5">
                    Redirecting in {Math.ceil(countdown)}s
                </p>
            )}

            {isPaused ? (
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-full text-left mb-6 shadow-2xl">
                    <h3 className="text-amber-500 font-bold text-sm mb-3 flex items-center gap-2">
                        <AlertTriangle size={16}/> Configuration Check
                    </h3>
                    
                    <div className="text-slate-400 text-xs mb-4 space-y-2">
                        <p>If you see a <strong>redirect_mismatch</strong> error on the Amazon page, your AWS settings likely have a trailing slash mismatch.</p>
                        <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded text-amber-200 flex items-start gap-2">
                            <Info size={14} className="shrink-0 mt-0.5" />
                            <span>Ensure the URL in AWS has <strong>NO trailing slash</strong> (/) at the end.</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 bg-black/50 p-2 rounded border border-slate-600">
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Required Callback URL</div>
                            <code className="text-xs font-mono text-blue-300 break-all block">
                                {authConfig.redirect_uri}
                            </code>
                        </div>
                        <button 
                            onClick={handleCopy}
                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors shrink-0"
                            title="Copy to clipboard"
                        >
                            {copied ? <CheckCircle2 size={18} className="text-green-400"/> : <Copy size={18}/>}
                        </button>
                    </div>

                    <button 
                        onClick={() => { setIsPaused(false); onLogin(); }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <PlayCircle size={18} /> Continue to Login
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-xs space-y-4">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-500 ease-linear"
                            style={{ width: `${((1.5 - countdown) / 1.5) * 100}%` }}
                        ></div>
                    </div>
                    <button 
                        onClick={() => setIsPaused(true)}
                        className="text-xs text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 w-full py-2"
                    >
                        <PauseCircle size={14} /> Wait, I have connection issues
                    </button>
                </div>
            )}
            
            <div className="mt-12 text-slate-600 text-xs">
                &copy; {new Date().getFullYear()} Cuallee Cyber
            </div>
        </div>
    </div>
  );
};