import React, { useState } from 'react';
import { Building2, ArrowRight, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface OnboardingProps {
  user: User;
  onCreateOrganization: (name: string) => void;
  onRefresh?: () => void;
  creationStatus?: 'idle' | 'creating' | 'verifying' | 'failed_verification';
  onRetryVerification?: (name: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onCreateOrganization, onRefresh, creationStatus = 'idle', onRetryVerification }) => {
  const [orgName, setOrgName] = useState('');
  
  const isSubmitting = creationStatus === 'creating' || creationStatus === 'verifying';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    onCreateOrganization(orgName);
  };

  const handleRetry = () => {
      if (onRetryVerification) {
          onRetryVerification(orgName);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500">
        
        <div className="p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Building2 size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Create your organization</h1>
            <p className="text-slate-600 mb-8 text-center text-sm">
                Welcome, <strong>{user.email || 'User'}</strong>.<br/>
                To get started, please set up your organization workspace.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                    <input 
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                        placeholder="e.g. Acme Corp"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        autoFocus
                        disabled={isSubmitting}
                    />
                </div>
                
                {creationStatus === 'failed_verification' ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                        <div className="flex justify-center mb-2 text-amber-500">
                            <AlertCircle size={24} />
                        </div>
                        <p className="text-sm text-amber-800 font-medium mb-3">
                            Creation initiated, but verification is taking longer than expected.
                        </p>
                        <button 
                            type="button"
                            onClick={handleRetry}
                            className="w-full bg-amber-100 text-amber-800 font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-200 transition-colors"
                        >
                            <RefreshCw size={16} /> Check Status Again
                        </button>
                    </div>
                ) : (
                    <button 
                        type="submit"
                        disabled={!orgName.trim() || isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {creationStatus === 'verifying' ? 'Verifying...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <ArrowRight size={20} /> Create Organization
                            </>
                        )}
                    </button>
                )}
            </form>

            {onRefresh && creationStatus !== 'failed_verification' && !isSubmitting && (
                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 mb-2">Already created an organization?</p>
                    <button 
                        onClick={onRefresh}
                        className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshCw size={14} /> Refresh Data
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};