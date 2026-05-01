
import React from 'react';
import { useAuth } from "react-oidc-context";
import { Shield, Loader2, ArrowRight, RefreshCcw, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const auth = useAuth();

  const handleSignIn = () => {
    // Ensuring a clean state for the new request
    sessionStorage.clear();
    auth.signinPopup().catch(err => {
      console.error("Popup login failed, falling back to redirect:", err);
      auth.signinRedirect();
    });
  };

  const handleDemoLogin = () => {
    localStorage.setItem('cuallee_mock_auth', JSON.stringify({
      id: 'demo-user-id',
      name: 'Demo Admin',
      email: 'admin@demo.com',
      sub: 'demo-user-sub',
      profile: {
        name: 'Demo Admin',
        email: 'admin@demo.com',
        sub: 'demo-user-sub'
      }
    }));
    window.location.reload();
  };

  const handleReset = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = window.location.origin;
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <Loader2 size={48} className="animate-spin text-coral-500 mb-6" />
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
          Connecting to Secure Gateway...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-coral-600/5 pointer-events-none"></div>
      
      <div className="text-center space-y-10 relative z-10 max-w-sm w-full">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-2xl mx-auto ring-1 ring-coral-500/20">
            <Shield size={52} className="text-coral-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">Cuallee Cyber</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
              Compliance Management Suite
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleSignIn}
            className="w-full bg-white hover:bg-coral-50 text-slate-950 font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-coral-900/20 group uppercase tracking-widest text-sm"
          >
            <Shield size={18} className="text-coral-600" />
            Sign In with Identity Provider
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={handleDemoLogin}
            className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all group uppercase tracking-widest text-[10px]"
          >
            Quick Access (Demo Environment)
          </button>
          
          <div className="text-center py-2">
            <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest">
              Enterprise Identity Gateway // {window.location.origin}
            </p>
          </div>
          
          {auth.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2 text-left">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={14} className="text-red-400" />
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">
                  Authentication Mismatch
                </p>
              </div>
              <p className="text-slate-400 text-[10px] italic leading-relaxed">
                {auth.error.message}
                {window.location.search.includes('error_description') && (
                  <div className="mt-1 text-red-300/80">
                    Details: {new URLSearchParams(window.location.search).get('error_description')}
                  </div>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button 
            onClick={handleReset}
            className="text-slate-600 hover:text-coral-400 text-[9px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCcw size={12} /> Clear Browser Cache & Retry
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">
        NIST 800-171 & CMMC 2.0 // Enterprise Standard
      </div>
    </div>
  );
};
