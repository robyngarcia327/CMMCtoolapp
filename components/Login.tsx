
import React, { useEffect, useState } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw, Copy, CheckCircle2, PauseCircle, PlayCircle, Info, ExternalLink } from 'lucide-react';
import { authConfig } from '../authConfig';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
         <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="bg-red-50 p-8 flex items-center gap-5 border-b border-red-100">
                 <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                     <AlertTriangle size={32} />
                 </div>
                 <div>
                     <h2 className="text-2xl font-black text-red-900 uppercase tracking-tight">Access Denied</h2>
                     <p className="text-red-700 text-sm font-medium">Authentication failed or timed out.</p>
                 </div>
             </div>
             
             <div className="p-8 space-y-6">
                 <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Technical Error Code</p>
                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-700 break-all leading-relaxed">
                        {error.message || "Cognito returned an invalid response. This is usually due to a Redirect URI Mismatch."}
                     </div>
                 </div>

                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                    <h4 className="text-blue-900 font-bold text-xs flex items-center gap-2 mb-2">
                        <Info size={14} /> Recommended Action:
                    </h4>
                    <p className="text-blue-800 text-xs leading-relaxed">
                        Verify that <strong>{authConfig.redirect_uri}</strong> is exactly matched in your AWS Console. If you have a trailing slash in AWS but not in the app, it will fail.
                    </p>
                 </div>

                 <button 
                    onClick={() => {
                        window.history.replaceState({}, document.title, window.location.pathname);
                        window.location.reload();
                    }}
                    className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl uppercase tracking-widest text-xs"
                 >
                     <RefreshCw size={18} /> Restart Session
                 </button>
             </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-md w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 relative z-10">
            
            <div className="relative mb-10">
                 <div className="w-28 h-28 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 rotate-3">
                     {isPaused ? <PauseCircle size={56} className="text-amber-500"/> : <Shield size={56} className="text-blue-500" />}
                 </div>
                 {!isPaused && (
                    <div className="absolute inset-0 bg-blue-500 rounded-[2.5rem] animate-ping opacity-20"></div>
                 )}
            </div>

            <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">
                {isPaused ? 'Diagnostic Mode' : 'Securing Session...'}
            </h2>
            
            {!isPaused && (
                <p className="text-slate-400 text-sm mb-10 h-5 font-medium">
                    Redirecting to AWS Identity Provider in {Math.ceil(countdown)}s
                </p>
            )}

            {isPaused ? (
                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 w-full text-left mb-6 shadow-2xl animate-in slide-in-from-bottom-4">
                    <h3 className="text-slate-900 font-black text-sm mb-4 flex items-center gap-2 uppercase tracking-widest">
                        <AlertTriangle size={18} className="text-amber-500"/> Connection Diagnostics
                    </h3>
                    
                    <div className="text-slate-600 text-xs mb-6 space-y-3 font-medium">
                        <p>If Cognito returns a <strong>redirect_mismatch</strong> error, verify your AWS User Pool App Client settings.</p>
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 flex items-start gap-3">
                            <Info size={16} className="shrink-0 mt-0.5" />
                            <span><strong>Rule:</strong> The URL in AWS must match the one below <strong>exactly</strong>.</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 px-1">Required Callback URL</div>
                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 group">
                            <div className="flex-1 min-w-0">
                                <code className="text-[11px] font-mono text-blue-600 break-all block font-bold">
                                    {authConfig.redirect_uri}
                                </code>
                            </div>
                            <button 
                                onClick={handleCopy}
                                className="p-2.5 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-xl text-slate-400 transition-all shrink-0 shadow-sm"
                                title="Copy to clipboard"
                            >
                                {copied ? <CheckCircle2 size={18} className="text-green-500"/> : <Copy size={18}/>}
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setIsPaused(false); onLogin(); }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest text-xs"
                    >
                        <PlayCircle size={18} /> Continue to Login
                    </button>
                    
                    <p className="mt-4 text-center">
                        <a href="https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-idp-settings.html" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1">
                            Cognito Documentation <ExternalLink size={10} />
                        </a>
                    </p>
                </div>
            ) : (
                <div className="w-full max-w-xs space-y-6">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-500 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            style={{ width: `${((1.5 - countdown) / 1.5) * 100}%` }}
                        ></div>
                    </div>
                    <button 
                        onClick={() => setIsPaused(true)}
                        className="text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 w-full py-2"
                    >
                        <PauseCircle size={14} /> Troubleshoot Connection
                    </button>
                </div>
            )}
            
            <div className="mt-16 text-slate-700 text-[10px] font-black uppercase tracking-[0.3em]">
                &copy; {new Date().getFullYear()} Cuallee Cyber Security Framework
            </div>
        </div>
    </div>
  );
};
