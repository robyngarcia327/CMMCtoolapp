
import React, { useEffect, useState } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw, Copy, CheckCircle2, PauseCircle, PlayCircle, Info, ExternalLink, ShieldAlert, Trash2, Terminal } from 'lucide-react';
import { authConfig } from '../authConfig';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [countdown, setCountdown] = useState(3); 
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    // Detect OIDC errors from Cognito in the URL query string
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    const desc = params.get('error_description');
    if (err) {
        setUrlError(`${err}: ${desc || 'Access denied by Identity Provider'}`);
        setIsPaused(true);
        return;
    }

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

  const clearUrlAndRestart = () => {
      sessionStorage.clear();
      Object.keys(localStorage).forEach(key => {
          if (key.startsWith('oidc.')) localStorage.removeItem(key);
      });
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
  };

  const isErrorState = error || urlError;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[160px]"></div>
        </div>

        <div className="max-w-xl w-full flex flex-col items-center relative z-10">
            {/* Header Area */}
            <div className="text-center mb-10">
                <div className="inline-flex p-4 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl mb-6 transform hover:rotate-6 transition-transform">
                    {isErrorState ? <ShieldAlert size={48} className="text-red-500" /> : <Shield size={48} className="text-blue-500" />}
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Cuallee Cyber</h1>
                <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-xs">Security Compliance Interface</p>
            </div>

            {/* Error or Auto-Redirect Card */}
            <div className="w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500">
                {isErrorState ? (
                    <div className="p-10">
                         <div className="flex items-center gap-4 mb-8 bg-red-50 p-4 rounded-2xl border border-red-100">
                            <div className="p-2 bg-red-100 rounded-xl text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-red-900 uppercase text-sm tracking-widest">Authentication Blocked</h3>
                                <p className="text-red-700 text-xs font-medium">The Identity Provider rejected the request.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Technical Error Payload</label>
                                <div className="bg-slate-900 rounded-2xl p-5 font-mono text-[11px] text-red-400 break-all leading-relaxed shadow-inner">
                                    {urlError || error?.message || "OIDC context failure. State mismatch or invalid client configuration."}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                                <h4 className="text-blue-900 font-bold text-xs flex items-center gap-2 mb-3 uppercase tracking-widest">
                                    <Terminal size={14} className="text-blue-500" /> Diagnostic Check
                                </h4>
                                <p className="text-blue-800 text-xs leading-relaxed mb-4">
                                    Ensure your <strong>AWS App Client</strong> "Callback URLs" include this exact value (case-sensitive, no trailing slash):
                                </p>
                                <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-blue-200">
                                    <code className="flex-1 text-[11px] font-black text-blue-600 truncate">{authConfig.redirect_uri}</code>
                                    <button onClick={handleCopy} className="text-blue-400 hover:text-blue-600 p-1">
                                        {copied ? <CheckCircle2 size={16}/> : <Copy size={16}/>}
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={clearUrlAndRestart} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[10px]">
                                    <Trash2 size={16} /> Purge Cache
                                </button>
                                <button onClick={() => window.location.reload()} className="flex-1 bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl uppercase tracking-widest text-[10px]">
                                    <RefreshCw size={16} /> Re-Attempt
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="mb-10 space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                {isPaused ? 'Diagnostic Mode' : 'Authenticating...'}
                            </h2>
                            {!isPaused && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-xs mx-auto border border-slate-200 shadow-inner">
                                        <div 
                                            className="h-full bg-blue-600 transition-all duration-500 ease-linear shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                                            style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        Redirecting in {Math.ceil(countdown)} seconds
                                    </p>
                                </div>
                            )}
                        </div>

                        {isPaused ? (
                            <div className="text-left animate-in slide-in-from-bottom-4 duration-300">
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Required OIDC Values</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-[9px] font-bold text-slate-400 mb-1">Redirect URI (Sent to Cognito)</div>
                                            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                                                <code className="text-xs font-mono font-bold text-blue-600 truncate flex-1">{authConfig.redirect_uri}</code>
                                                <button onClick={handleCopy} className="text-slate-300 hover:text-blue-500">{copied ? <CheckCircle2 size={16}/> : <Copy size={16}/>}</button>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-bold text-slate-400 mb-1">Current Browser URL</div>
                                            <div className="bg-white p-3 rounded-xl border border-slate-200 truncate font-mono text-[10px] text-slate-500 italic">
                                                {window.location.href}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => { setIsPaused(false); onLogin(); }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs"
                                >
                                    <PlayCircle size={18} /> Continue to Cognito
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsPaused(true)}
                                className="text-[10px] font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest flex items-center gap-2 mx-auto"
                            >
                                <PauseCircle size={14} /> Troubleshoot URI Configuration
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                <span>&copy; {new Date().getFullYear()}</span>
                <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                <span>FedRAMP Aligned Platform</span>
            </div>
        </div>
    </div>
  );
};
