import React, { useState } from 'react';
import { Shield, AlertTriangle, RefreshCw, LogOut, Copy, CheckCircle2, Lock } from 'lucide-react';
import { authConfig } from '../authConfig';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
      navigator.clipboard.writeText(authConfig.redirect_uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
         <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100">
                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                     <AlertTriangle size={24} />
                 </div>
                 <div>
                     <h2 className="text-xl font-bold text-red-900">Sign In Error</h2>
                     <p className="text-red-700 text-sm">We couldn't log you in.</p>
                 </div>
             </div>
             
             <div className="p-8">
                 <div className="mb-6">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">Technical Details</p>
                     <div className="bg-slate-50 border border-slate-200 rounded p-3 font-mono text-xs text-slate-700 break-all">
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
                         <RefreshCw size={18} /> Reload Application
                     </button>
                 </div>
             </div>
         </div>
      </div>
    );
  }

  // STANDARD LOGIN SCREEN (No Auto-Redirect to prevent loops)
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50 mx-auto mb-6">
                    <Shield size={40} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Cuallee Cyber</h1>
                <p className="text-slate-400 text-sm">Secure Compliance Gateway</p>
            </div>

            <button 
                onClick={onLogin}
                className="w-full bg-white text-slate-900 hover:bg-blue-50 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] mb-8"
            >
                <Lock size={20} className="text-blue-600" />
                Sign In with AWS Cognito
            </button>

            {/* Debug Info for Config Mismatch */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                    <AlertTriangle size={12} /> Config Debugger
                </h3>
                <p className="text-[10px] text-slate-400 mb-2">
                    If you see a <strong>redirect_mismatch</strong> error after clicking Sign In, ensure this URL is in your AWS User Pool Allowed Callback URLs:
                </p>
                <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/50 px-2 py-2 rounded text-[10px] font-mono text-blue-200 break-all border border-white/10">
                        {authConfig.redirect_uri}
                    </code>
                    <button 
                        onClick={handleCopy}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <CheckCircle2 size={14} className="text-green-400"/> : <Copy size={14}/>}
                    </button>
                </div>
            </div>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-slate-600 text-xs">
                &copy; {new Date().getFullYear()} Cuallee Cyber. Secure Infrastructure.
            </p>
        </div>
    </div>
  );
};