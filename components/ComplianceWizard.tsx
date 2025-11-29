

import React from 'react';
import { Requirement, Artifact, WizardProgress, Asset } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, AlertTriangle, PlayCircle, FileCheck, Check, Info, Monitor, Network, ListChecks, LogOut, Save } from 'lucide-react';
import { ArtifactUploader } from './ArtifactUploader';
import { Inventory } from './Inventory';
import { NetworkAnalyzer } from './NetworkAnalyzer';

interface ComplianceWizardProps {
  requirements: Requirement[];
  artifacts: Artifact[];
  assets?: Asset[];
  wizardProgress: WizardProgress;
  onUpdateRequirement: (req: Requirement) => void;
  onAddArtifact: (artifact: Artifact) => void;
  onRemoveArtifact: (id: string) => void;
  onAddAsset?: (asset: Asset) => void;
  onDeleteAsset?: (id: string) => void;
  onUpdateProgress: (progress: WizardProgress) => void;
  activeFrameworkId: string;
  onComplete: () => void;
}

const STEPS = [
    { id: 'INTRO', label: 'Welcome' },
    { id: 'INVENTORY', label: 'Asset Inventory' },
    { id: 'NETWORK', label: 'Network Scope' },
    { id: 'ASSESSMENT', label: 'Compliance Audit' },
    { id: 'VALIDATION', label: 'Review' }
] as const;

export const ComplianceWizard: React.FC<ComplianceWizardProps> = ({
  requirements,
  artifacts,
  assets = [],
  wizardProgress,
  onUpdateRequirement,
  onAddArtifact,
  onRemoveArtifact,
  onAddAsset,
  onDeleteAsset,
  onUpdateProgress,
  activeFrameworkId,
  onComplete
}) => {
  
  // Filter requirements for the current framework
  const activeReqs = requirements.filter(r => r.framework === activeFrameworkId);
  
  // Handlers for Navigation
  const goToStep = (step: WizardProgress['currentStep']) => {
      onUpdateProgress({ ...wizardProgress, currentStep: step });
  };

  const handleAssessmentNext = () => {
    if (wizardProgress.currentQuestionIndex < activeReqs.length - 1) {
      onUpdateProgress({ ...wizardProgress, currentQuestionIndex: wizardProgress.currentQuestionIndex + 1 });
    } else {
      goToStep('VALIDATION');
    }
  };

  const handleAssessmentPrev = () => {
    if (wizardProgress.currentQuestionIndex > 0) {
      onUpdateProgress({ ...wizardProgress, currentQuestionIndex: wizardProgress.currentQuestionIndex - 1 });
    } else {
      goToStep('NETWORK');
    }
  };

  const saveAndExit = () => {
      // Progress is already saved in state via onUpdateProgress calls.
      // Just confirm and exit.
      alert("Progress saved. You can resume from the Wizard tab at any time.");
      onComplete(); // Go to dashboard
  };

  // Assessment Logic Helpers
  const currentReq = activeReqs[wizardProgress.currentQuestionIndex];
  
  const handleResponseChange = (text: string) => {
    if (currentReq) {
        onUpdateRequirement({ ...currentReq, response: text });
    }
  };

  const toggleNotMet = () => {
    if (!currentReq) return;
    const isNotMet = currentReq.objectives.some(o => o.status === 'not_met');
    const newStatus = isNotMet ? 'pending' : 'not_met';
    const updatedObjectives = currentReq.objectives.map(o => ({ ...o, status: newStatus as any }));
    onUpdateRequirement({ ...currentReq, objectives: updatedObjectives });
  };
  
  const toggleMet = () => {
    if (!currentReq) return;
    const isMet = currentReq.objectives.every(o => o.status === 'met');
    const newStatus = isMet ? 'pending' : 'met';
    const updatedObjectives = currentReq.objectives.map(o => ({ ...o, status: newStatus as any }));
    onUpdateRequirement({ ...currentReq, objectives: updatedObjectives });
  };

  // Validation Metrics
  const completedCount = activeReqs.filter(r => r.objectives.every(o => o.status === 'met')).length;
  const gapsCount = activeReqs.filter(r => r.objectives.some(o => o.status === 'not_met')).length;
  const pendingCount = activeReqs.length - completedCount - gapsCount;

  // Render Logic
  const renderStepper = () => (
      <div className="flex justify-between items-center mb-8 px-4 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
          {STEPS.map((step, idx) => {
              const currentIdx = STEPS.findIndex(s => s.id === wizardProgress.currentStep);
              const isCompleted = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                  <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-50 px-2 rounded">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                          isCompleted ? 'bg-green-500 border-green-500 text-white' :
                          isCurrent ? 'bg-blue-600 border-blue-600 text-white' :
                          'bg-white border-slate-300 text-slate-400'
                      }`}>
                          {isCompleted ? <Check size={16} /> : idx + 1}
                      </div>
                      <span className={`text-xs font-medium ${isCurrent ? 'text-blue-700' : 'text-slate-500'} hidden md:block`}>
                          {step.label}
                      </span>
                  </div>
              );
          })}
      </div>
  );

  const renderHeader = () => (
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               {wizardProgress.currentStep === 'INVENTORY' && <Monitor size={24} className="text-blue-600" />}
               {wizardProgress.currentStep === 'NETWORK' && <Network size={24} className="text-indigo-600" />}
               {wizardProgress.currentStep === 'ASSESSMENT' && <ListChecks size={24} className="text-purple-600" />}
               {STEPS.find(s => s.id === wizardProgress.currentStep)?.label}
          </h2>
          <button 
            onClick={saveAndExit}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded hover:bg-slate-100 transition-colors"
          >
              <Save size={16} /> Save & Exit
          </button>
      </div>
  );

  // --- STEP CONTENT ---

  if (wizardProgress.currentStep === 'INTRO') {
    return (
      <div className="max-w-3xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-xl border border-slate-200 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <PlayCircle size={40} className="text-blue-600 ml-1" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Begin Your Compliance Journey</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
          Welcome! This wizard is designed for beginners. We'll guide you step-by-step through building your inventory, mapping your network, and assessing your security controls for <strong>{activeFrameworkId}</strong>.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
             <div className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Monitor size={18} className="text-blue-500"/> 1. Inventory</div>
             <p className="text-sm text-slate-500">List your critical hardware and software.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
             <div className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Network size={18} className="text-indigo-500"/> 2. Scope</div>
             <p className="text-sm text-slate-500">Map your network boundaries with AI.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
             <div className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Shield size={18} className="text-purple-500"/> 3. Audit</div>
             <p className="text-sm text-slate-500">Answer plain-English questions.</p>
          </div>
        </div>

        <button 
          onClick={() => goToStep('INVENTORY')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          Start Assessment
        </button>
        <div className="mt-4">
             <button onClick={onComplete} className="text-sm text-slate-400 hover:text-slate-600 underline">Skip to Dashboard</button>
        </div>
      </div>
    );
  }

  // Common Wrapper for intermediate steps
  const WizardWrapper = ({ children, nextLabel, onNext, onPrev }: any) => (
      <div className="max-w-5xl mx-auto p-6 h-full flex flex-col">
          {renderStepper()}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    {renderHeader()}
               </div>
               <div className="flex-1 overflow-y-auto">
                   {children}
               </div>
               <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <button 
                        onClick={onPrev}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-white hover:shadow-sm transition-all"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button 
                        onClick={onNext}
                        className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all"
                    >
                        {nextLabel} <ArrowRight size={18} />
                    </button>
               </div>
          </div>
      </div>
  );

  if (wizardProgress.currentStep === 'INVENTORY') {
      return (
          <WizardWrapper 
            nextLabel="Continue to Network" 
            onNext={() => goToStep('NETWORK')}
            onPrev={() => goToStep('INTRO')}
          >
              <Inventory 
                assets={assets} 
                onAddAsset={onAddAsset!} 
                onDeleteAsset={onDeleteAsset!} 
                variant="wizard"
              />
          </WizardWrapper>
      );
  }

  if (wizardProgress.currentStep === 'NETWORK') {
      return (
           <WizardWrapper 
            nextLabel="Start Questions" 
            onNext={() => goToStep('ASSESSMENT')}
            onPrev={() => goToStep('INVENTORY')}
          >
             <NetworkAnalyzer variant="wizard" />
          </WizardWrapper>
      );
  }

  if (wizardProgress.currentStep === 'ASSESSMENT') {
      if (!currentReq) {
        return (
            <WizardWrapper 
                nextLabel="Finish" 
                onNext={onComplete}
                onPrev={() => goToStep('NETWORK')}
            >
                <div className="flex flex-col items-center justify-center h-full p-10 text-center text-slate-500">
                    <Shield size={48} className="mb-4 text-slate-300" />
                    <h2 className="text-xl font-bold text-slate-700">No Requirements Found</h2>
                    <p>There are no assessment questions configured for this framework ({activeFrameworkId}) yet.</p>
                </div>
            </WizardWrapper>
        );
      }

      const progress = Math.round(((wizardProgress.currentQuestionIndex) / activeReqs.length) * 100);
      const isMet = currentReq.objectives.every(o => o.status === 'met');
      const isNotMet = currentReq.objectives.some(o => o.status === 'not_met');

      return (
          <WizardWrapper 
            nextLabel={wizardProgress.currentQuestionIndex === activeReqs.length - 1 ? "Finish & Review" : "Next Question"}
            onNext={handleAssessmentNext}
            onPrev={handleAssessmentPrev}
          >
             <div className="flex flex-col h-full">
                {/* Progress Bar inside Assessment */}
                <div className="px-6 pt-6">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <span>Control {wizardProgress.currentQuestionIndex + 1} of {activeReqs.length}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                     {/* Question Card */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{currentReq.id}</span>
                            <div className="flex gap-2">
                                {isMet && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Check size={12}/> Met</span>}
                                {isNotMet && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertTriangle size={12}/> Gap</span>}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{currentReq.interviewQuestion || currentReq.title}</h2>
                        {!currentReq.interviewQuestion && (
                            <p className="text-slate-500">{currentReq.description}</p>
                        )}
                    </div>

                    {/* Answer Area */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">Your Answer / Policy Statement</label>
                        <textarea 
                            className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-slate-700 shadow-sm"
                            placeholder="e.g. We enforce a 15-minute lockout policy configured via Group Policy..."
                            value={currentReq.response || ''}
                            onChange={(e) => handleResponseChange(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={toggleNotMet}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border shadow-sm ${
                                    isNotMet 
                                    ? 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-400' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
                                }`}
                            >
                                <AlertTriangle size={16} />
                                {isNotMet ? 'Marked as Gap' : 'We don\'t have this (Gap)'}
                            </button>

                             <button 
                                onClick={toggleMet}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border shadow-sm ${
                                    isMet 
                                    ? 'bg-green-50 text-green-700 border-green-200 ring-1 ring-green-400' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-600 hover:bg-green-50'
                                }`}
                            >
                                <CheckCircle2 size={16} />
                                {isMet ? 'Marked as Compliant' : 'We meet this control'}
                            </button>
                        </div>
                    </div>

                    {/* Evidence Area */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FileCheck size={20} className="text-indigo-600" /> Evidence Collection
                        </h3>
                         <p className="text-sm text-slate-500 mb-4">
                            Upload screenshots, policy documents, or logs that prove your answer above.
                        </p>
                        <ArtifactUploader 
                            requirementId={currentReq.id}
                            artifacts={artifacts.filter(a => a.requirementId === currentReq.id)}
                            onAddArtifact={onAddArtifact}
                            onRemoveArtifact={onRemoveArtifact}
                        />
                    </div>
                </div>
             </div>
          </WizardWrapper>
      );
  }

  if (wizardProgress.currentStep === 'VALIDATION') {
      return (
        <div className="max-w-5xl mx-auto p-6">
            {renderStepper()}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-900 p-8 text-center text-white">
                    <CheckCircle2 size={48} className="mx-auto mb-4 text-green-400" />
                    <h2 className="text-3xl font-bold mb-2">Assessment Complete</h2>
                    <p className="text-slate-400">You've finished the initial walkthrough. Here is your scorecard.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-b border-slate-200">
                    <div className="p-8 text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">{completedCount}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Controls Met</div>
                    </div>
                     <div className="p-8 text-center">
                        <div className="text-4xl font-bold text-red-600 mb-2">{gapsCount}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Gaps Identified</div>
                    </div>
                     <div className="p-8 text-center">
                        <div className="text-4xl font-bold text-amber-500 mb-2">{pendingCount}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Review</div>
                    </div>
                </div>

                <div className="p-8">
                    {gapsCount > 0 ? (
                        <div className="mb-8">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-red-500" /> Priority Gaps to Address
                            </h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {activeReqs.filter(r => r.objectives.some(o => o.status === 'not_met')).map(r => (
                                    <div key={r.id} className="bg-red-50 border border-red-100 p-4 rounded-lg flex justify-between items-center group hover:border-red-200 transition-colors">
                                        <div>
                                            <div className="font-mono text-xs font-bold text-red-700 mb-1">{r.id}</div>
                                            <div className="font-medium text-slate-900">{r.title}</div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const idx = activeReqs.findIndex(ar => ar.id === r.id);
                                                onUpdateProgress({ currentStep: 'ASSESSMENT', currentQuestionIndex: idx });
                                            }}
                                            className="text-sm text-red-600 hover:text-red-800 underline font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Review
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                         <div className="text-center p-8 bg-green-50 rounded-xl border border-green-100 mb-8">
                             <h3 className="text-xl font-bold text-green-800">Excellent Start!</h3>
                             <p className="text-green-700">You have no marked gaps. Proceed to the dashboard to generate your SSP.</p>
                         </div>
                    )}

                    <div className="flex justify-center pt-4 border-t border-slate-100">
                        <button 
                            onClick={onComplete}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg text-lg flex items-center gap-2 transition-transform hover:scale-105"
                        >
                            Go to Executive Dashboard <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return null;
};