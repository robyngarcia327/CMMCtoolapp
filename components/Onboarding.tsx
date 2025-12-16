import React, { useState } from 'react';
import { Building2, ArrowRight, ShieldCheck, CheckCircle, Lock } from 'lucide-react';
import { User } from '../types';

interface OnboardingProps {
  user: User;
  onCreateOrganization: (name: string, industry: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onCreateOrganization }) => {
  
  // Logic simplified: If user reaches here, it means they are authenticated
  // but GET /orgs returned 0. 
  // This implies the Post-Confirmation trigger failed OR they need to be added manually.

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500">
        
        <div className="p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
                <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">No Organization Access</h1>
            <p className="text-slate-600 mb-6 text-sm">
                Welcome, <strong>{user.email || 'User'}</strong>. <br/>
                It seems you are not linked to any active organization yet.
            </p>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left mb-6">
                <h3 className="font-bold text-slate-800 text-sm mb-1">Troubleshooting</h3>
                <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
                    <li>If you just signed up, please wait a moment and refresh. Your account provisioning might be in progress.</li>
                    <li>If you were invited, check with your administrator to ensure you have been added to the correct group.</li>
                </ul>
            </div>

            <button 
                onClick={() => window.location.reload()}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg"
            >
                Refresh Access
            </button>
        </div>

      </div>
    </div>
  );
};