import React, { useState } from 'react';
import { Building2, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { User, Client } from '../types';

interface OnboardingProps {
  user: User;
  onCreateOrganization: (name: string, industry: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onCreateOrganization }) => {
  const [step, setStep] = useState<'WELCOME' | 'CREATE'>('WELCOME');
  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orgName) {
        onCreateOrganization(orgName, industry);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500">
        
        {step === 'WELCOME' && (
            <div className="p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome, {user.name}!</h1>
                <p className="text-lg text-slate-600 mb-8">
                    Your account has been verified. However, you are not linked to any organization yet.
                </p>
                <div className="space-y-4">
                    <button 
                        onClick={() => setStep('CREATE')}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-lg"
                    >
                        <Building2 size={20} /> Create New Organization
                    </button>
                    <p className="text-sm text-slate-400 pt-4">
                        Joining an existing team? Ask your administrator to invite: <br/>
                        <span className="font-mono text-slate-600 font-medium">{user.email}</span>
                    </p>
                </div>
            </div>
        )}

        {step === 'CREATE' && (
            <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/3 bg-slate-900 p-8 text-white flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <ShieldCheck size={20} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Setup Tenant</h3>
                        <p className="text-slate-400 text-sm">Create a secure workspace for your compliance data. This will be your primary billing entity.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Secure Environment
                        </div>
                    </div>
                </div>
                <div className="md:w-2/3 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Organization Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                            <input 
                                autoFocus
                                required
                                value={orgName}
                                onChange={e => setOrgName(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                placeholder="e.g. Acme Defense Corp"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Industry Sector</label>
                            <select 
                                value={industry}
                                onChange={e => setIndustry(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="">Select Industry...</option>
                                <option value="Defense Industrial Base">Defense Industrial Base (DIB)</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Finance">Finance</option>
                                <option value="Technology">Technology / MSP</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div className="pt-4">
                            <button 
                                type="submit"
                                disabled={!orgName}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                Complete Setup <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};