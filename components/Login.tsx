import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, Loader2, Globe, AlertCircle } from 'lucide-react';
import { authConfig } from '../authConfig';

interface LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const currentRedirectUri = window.location.origin;

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
                 <div className="mb-6 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                     <Lock size={16} /> {error.message}
                 </div>
             )}

             <button 
                onClick={onLogin}
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
             >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" /> Connecting to Identity Provider...
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
             
             {/* Configuration Debugger: Helps user fix AWS Console settings */}
             <div className="w-full bg-slate-200/50 p-2 rounded border border-slate-200 text-[10px] text-slate-500 font-mono text-left break-all">
                <div className="flex items-center gap-1 mb-1 font-bold text-slate-600">
                    <AlertCircle size={10} /> AWS Config Check
                </div>
                <div className="mb-1">Pool ID: {authConfig.authority?.split('/').pop()}</div>
                <div className="p-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded">
                    <strong>1. Go to App Integration &gt; App clients &gt; [Your Client]</strong><br/>
                    <strong>2. Look for "Login pages" tab &gt; "Managed login pages configuration"</strong><br/>
                    <strong>3. Ensure this URL is in "Allowed callback URLs":</strong><br/>
                    <span className="bg-white px-1 font-bold text-blue-700 block mt-1 select-all">{currentRedirectUri}</span>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};