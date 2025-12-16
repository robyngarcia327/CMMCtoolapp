import React from 'react';
import { Shield, Lock, ArrowRight, Loader2, Globe } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
         <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/50">
             <Shield size={32} className="text-white" />
         </div>
         <h1 className="text-3xl font-bold text-white tracking-tight">Cuallee Cyber</h1>
         <p className="text-slate-400 mt-2">Enterprise Security & Compliance Platform</p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-500">
         <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
         <div className="p-8">
             <div className="text-center mb-8">
                 <h2 className="text-xl font-bold text-slate-800">Secure Sign In</h2>
                 <p className="text-sm text-slate-500 mt-1">This system is restricted to authorized personnel.</p>
             </div>

             {error && (
                 <div className="mb-6 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2 text-left">
                     <div className="min-w-[16px]"><Lock size={16} /></div>
                     <div>{error.message}</div>
                 </div>
             )}

             <button 
                onClick={onLogin}
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
             >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" /> Connecting...
                    </>
                ) : (
                    <>
                        <Globe size={20} className="text-blue-400" /> 
                        Sign In with SSO
                        <ArrowRight size={18} className="opacity-50" />
                    </>
                )}
             </button>

             <div className="mt-6 flex justify-center">
                 <p className="text-xs text-slate-400 flex items-center gap-1">
                     <Lock size={10} /> Powered by AWS Cognito
                 </p>
             </div>
         </div>
         
         <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col gap-2 items-center text-center">
             <span className="text-xs text-slate-500 font-medium">Protected by Cuallee Cyber SSO</span>
         </div>
      </div>
    </div>
  );
};