import React, { useEffect } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  
  // Auto-redirect to Cognito Hosted UI if no error is present
  useEffect(() => {
    if (!error && !isLoading) {
      // Small delay to ensure render happens and prevent race conditions
      const timer = setTimeout(() => {
        onLogin();
      }, 800); 
      return () => clearTimeout(timer);
    }
  }, [error, isLoading, onLogin]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center animate-in fade-in zoom-in duration-300">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                 <AlertTriangle size={32} />
             </div>
             <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Error</h2>
             <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-6 text-left">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Error Details</p>
                 <p className="text-sm text-slate-700 font-mono break-all leading-relaxed">{error.message}</p>
             </div>
             
             <div className="flex flex-col gap-3">
                 <button 
                    onClick={() => onLogin()} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                 >
                     <RefreshCw size={18} /> Retry Login
                 </button>
                 <button 
                    onClick={() => {
                        // Hard reset to clear any stale state
                        window.location.href = window.location.origin;
                    }}
                    className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                 >
                     <LogOut size={18} /> Reset Session
                 </button>
             </div>
         </div>
         <div className="mt-8 text-center text-slate-400 text-xs">
             <p>Cuallee Cyber Secure Gateway</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/50 mb-8">
             <Shield size={40} className="text-white" />
        </div>
        <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-white tracking-tight">Redirecting to Secure Login...</h2>
        <p className="text-slate-400 mt-2 text-sm">Handing off to AWS Cognito</p>
      </div>
    </div>
  );
};