import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/standards';
import { Shield, Lock, Fingerprint, ArrowRight, CheckCircle2, Loader2, Mail, KeyRound } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

type AuthStep = 'IDENTIFIER' | 'PASSWORD' | 'MFA_TOTP' | 'PASSKEY_PROMPT' | 'SUCCESS';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('IDENTIFIER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill demo credentials
  useEffect(() => {
    const timer = setTimeout(() => {
      // For demo convenience only
      setEmail('alice@msp.com'); 
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API Lookup
    setTimeout(() => {
        const user = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user) {
            setFoundUser(user);
            setIsLoading(false);

            // Determine next step based on user security settings
            if (user.hasPasskey) {
                setStep('PASSKEY_PROMPT');
            } else {
                setStep('PASSWORD');
            }
        } else {
            setIsLoading(false);
            setError('User not found in directory.');
        }
    }, 800);
  };

  const handlePasskeyAuth = () => {
      setIsLoading(true);
      // Simulate WebAuthn Prompt
      setTimeout(() => {
          setIsLoading(false);
          // 80% chance of success for demo
          setStep('SUCCESS');
          setTimeout(() => onLogin(foundUser!), 1000);
      }, 2000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      // Demo password check - allow anything non-empty
      setTimeout(() => {
          setIsLoading(false);
          if (foundUser?.mfaEnabled) {
              setStep('MFA_TOTP');
          } else {
              setStep('SUCCESS');
              setTimeout(() => onLogin(foundUser!), 1000);
          }
      }, 800);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      // Demo MFA check
      setTimeout(() => {
          setIsLoading(false);
          setStep('SUCCESS');
          setTimeout(() => onLogin(foundUser!), 1000);
      }, 800);
  };

  const handleMagicLink = () => {
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          alert(`Magic link sent to ${email} (Demo)`);
      }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
         <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/50">
             <Shield size={32} className="text-white" />
         </div>
         <h1 className="text-3xl font-bold text-white tracking-tight">AuditIQ</h1>
         <p className="text-slate-400 mt-2">Enterprise Security & Compliance Platform</p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-500">
         <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
         
         <div className="p-8">
             {step === 'IDENTIFIER' && (
                 <form onSubmit={handleIdentifierSubmit} className="space-y-6">
                     <div className="text-center mb-6">
                         <h2 className="text-xl font-bold text-slate-800">Sign In</h2>
                         <p className="text-sm text-slate-500">Enter your email to continue</p>
                     </div>
                     
                     <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                         <div className="relative">
                             <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                             <input 
                                type="email" 
                                autoFocus
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                placeholder="name@company.com"
                             />
                         </div>
                     </div>

                     {error && (
                         <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                             <Lock size={16} /> {error}
                         </div>
                     )}

                     <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                     >
                        {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={18} /></>}
                     </button>
                 </form>
             )}

             {step === 'PASSKEY_PROMPT' && (
                 <div className="text-center space-y-6">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                          <Fingerprint size={40} className="text-blue-600" />
                      </div>
                      <div>
                          <h2 className="text-xl font-bold text-slate-800">Verify Identity</h2>
                          <p className="text-sm text-slate-500 mt-1">Use your device passkey (FaceID / TouchID)</p>
                      </div>
                      
                      <button 
                        onClick={handlePasskeyAuth}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                     >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Fingerprint size={20} />}
                        Authenticate with Passkey
                     </button>

                     <button onClick={() => setStep('PASSWORD')} className="text-sm text-slate-500 hover:text-blue-600 underline">
                         Use password instead
                     </button>
                 </div>
             )}

             {step === 'PASSWORD' && (
                 <form onSubmit={handlePasswordSubmit} className="space-y-6">
                     <div className="text-center mb-6">
                         <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                             <KeyRound size={20} className="text-slate-600" />
                         </div>
                         <h2 className="text-lg font-bold text-slate-800">Welcome, {foundUser?.name.split(' ')[0]}</h2>
                         <p className="text-sm text-slate-500">{foundUser?.email}</p>
                     </div>

                     <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                         <input 
                            type="password" 
                            autoFocus
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            placeholder="••••••••"
                         />
                     </div>

                     <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                     >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                     </button>

                     <div className="relative py-2">
                         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                         <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-slate-400 uppercase">Or</span></div>
                     </div>

                     <button type="button" onClick={handleMagicLink} className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                         Email me a Magic Link
                     </button>
                 </form>
             )}

             {step === 'MFA_TOTP' && (
                 <form onSubmit={handleMfaSubmit} className="space-y-6 text-center">
                     <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                         <Lock size={32} className="text-indigo-600" />
                     </div>
                     <div>
                         <h2 className="text-xl font-bold text-slate-800">Two-Factor Authentication</h2>
                         <p className="text-sm text-slate-500 mt-1">Enter the 6-digit code from your authenticator app.</p>
                     </div>

                     <input 
                        type="text" 
                        maxLength={6}
                        autoFocus
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center text-3xl font-mono tracking-widest py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="000 000"
                     />

                     <button 
                        type="submit" 
                        disabled={isLoading || mfaCode.length < 6}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                     >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Verify Code'}
                     </button>
                 </form>
             )}

             {step === 'SUCCESS' && (
                 <div className="text-center py-8 space-y-4 animate-in zoom-in duration-300">
                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                         <CheckCircle2 size={48} className="text-green-600" />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-800">Authenticated</h2>
                     <p className="text-slate-500">Redirecting to secure dashboard...</p>
                 </div>
             )}
         </div>
         
         <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
             Protected by AuditIQ SSO • CMMC Level 2 Compliant
         </div>
      </div>
      
      <div className="mt-8 text-slate-500 text-sm flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Security Center</a>
          <a href="#" className="hover:text-white transition-colors">Contact Support</a>
      </div>
    </div>
  );
};