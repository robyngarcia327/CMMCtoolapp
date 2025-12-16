import React, { useEffect } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { authConfig } from '../authConfig';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  
  // Auto-redirect to Cognito Hosted UI
  // We use useEffect to trigger this immediately on mount
  useEffect(() => {
    if (!error && !isLoading) {
        onLogin();
    }
  }, [error, isLoading, onLogin]);

  // ERROR STATE: User returned from Cognito with an error, or config failed
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
         <div className="max-w-md w-full bg-white rounded-lg shadow-xl border border-red-100 overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100">
                 <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                     <AlertTriangle size={20} />
                 </div>
                 <div>
                     <h2 className="text-lg font-bold text-red-900">Login Error</h2>
                     <p className="text-red-700 text-xs">Authentication could not be completed.</p>
                 </div>
             </div>
             
             <div className="p-6">
                 <div className="mb-4">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">Details</p>
                     <div className="bg-slate-100 border border-slate-200 rounded p-3 font-mono text-xs text-slate-700 break-all">
                        {error.message || "Unknown Authorization Error"}
                     </div>
                 </div>

                 <p className="text-sm text-slate-600 mb-6">
                    If you are seeing a <strong>redirect_mismatch</strong> error, ensure your AWS User Pool "Allowed Callback URLs" includes exactly:
                    <br/>
                    <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-bold break-all mt-1 block">{authConfig.redirect_uri}</code>
                 </p>

                 <button 
                    onClick={() => {
                        window.history.replaceState({}, document.title, window.location.pathname);
                        window.location.reload();
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                 >
                     <RefreshCw size={16} /> Try Again
                 </button>
             </div>
         </div>
      </div>
    );
  }

  // LOADING STATE (Transient - User barely sees this)
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
      <p className="text-slate-500 text-sm font-medium">Redirecting to Secure Login...</p>
    </div>
  );
};