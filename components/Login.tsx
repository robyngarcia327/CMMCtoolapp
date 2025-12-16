import React, { useEffect, useState } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw, LogOut, Copy, CheckCircle2 } from 'lucide-react';
import { authConfig } from '../authConfig';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [copied, setCopied] = useState(false);
  
  // Auto-redirect logic:
  // If there is no error and we aren't loading, immediately trigger the login flow.
  // This effectively "replaces" this screen with the Cognito Hosted UI.
  useEffect(() => {
    if (!error && !isLoading) {
      const timer = setTimeout(() => {
        onLogin();
      }, 500); // Short delay to allow React to mount
      return () => clearTimeout(timer);
    }
  }, [error, isLoading, onLogin]);

  const handleCopy = () => {
      navigator.clipboard.writeText(authConfig.redirect_uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  // ERROR STATE: Shows if Cognito redirects back with an error or fails to connect
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

                 <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                     <h3 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                        <Shield size={14}/> Configuration Check
                     </h3>
                     <p className="text-sm text-amber-800 mb-3">
                         If you are seeing a <strong>redirect_mismatch</strong>, you must add this EXACT URL to your AWS Cognito "Allowed callback URLs":
                     </p>
                     <div className="flex items-center gap-2">
                         <code className="flex-1 bg-white border border-amber-200 px-3 py-2 rounded text-xs font-mono text-amber-900 break-all">
                             {authConfig.redirect_uri}
                         </code>
                         <button 
                            onClick={handleCopy}
                            className="p-2 bg-white border border-amber-200 rounded hover:bg-amber-100 text-amber-700 transition-colors"
                            title="Copy to clipboard"
                         >
                             {copied ? <CheckCircle2 size={16}/> : <Copy size={16}/>}
                         </button>
                     </div>
                 </div>

                 <div className="flex flex-col gap-3">
                     <button 
                        onClick={() => onLogin()} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                     >
                         <RefreshCw size={18} /> Retry Connection
                     </button>
                     <button 
                        onClick={() => {
                            // Clear query params to remove stale error codes
                            window.history.replaceState({}, document.title, window.location.pathname);
                            window.location.reload();
                        }}
                        className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                     >
                         <LogOut size={18} /> Reset & Reload
                     </button>
                 </div>
             </div>
         </div>
      </div>
    );
  }

  // LOADING / REDIRECTING STATE
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center text-center">
        <div className="relative mb-8">
             <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
             <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
                 <Shield size={48} className="text-blue-500" />
             </div>
        </div>
        
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Cuallee Cyber Gateway</h2>
            <div className="flex items-center justify-center gap-3 text-blue-400 bg-blue-400/10 px-4 py-2 rounded-full">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm font-medium">Connecting to Identity Provider...</span>
            </div>
            <p className="text-slate-500 text-xs max-w-xs mx-auto pt-4">
                You will be redirected to AWS Cognito for secure authentication.
            </p>
        </div>
      </div>
    </div>
  );
};