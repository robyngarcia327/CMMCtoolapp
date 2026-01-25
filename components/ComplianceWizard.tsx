import React, { useState } from 'react';
import { Requirement, Artifact, WizardProgress, Asset, CmmcAssetCategory } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, AlertTriangle, PlayCircle, FileCheck, Check, Info, Monitor, Network, ListChecks, Target, Lock, Zap, Box, Cloud, Users, FileSearch } from 'lucide-react';
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
  onUpdateLevel: (level: 1 | 2 | 3) => void;
  targetLevel: 1 | 2 | 3;
  activeFrameworkId: string;
  onComplete: () => void;
}

const STEPS = [
    { id: 'INTRO', label: 'Welcome' },
    { id: 'LEVEL_SELECT', label: 'Target Level' },
    { id: 'SCOPING', label: 'Environment Scoping' },
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
  onUpdateLevel,
  targetLevel,
  activeFrameworkId,
  onComplete
}) => {
  
  const [scopingAnswers, setScopingAnswers] = useState<Record<string, boolean>>({});

  const activeReqs = requirements.filter(r => 
    r.framework === activeFrameworkId && r.cmmcLevel <= targetLevel
  );
  
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
      goToStep('SCOPING');
    }
  };

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

  const completedCount = activeReqs.filter(r => r.objectives.every(o => o.status === 'met')).length;
  const gapsCount = activeReqs.filter(r => r.objectives.some(o => o.status === 'not_met')).length;
  const pendingCount = activeReqs.length - completedCount - gapsCount;

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
                          isCompleted ? 'bg-green-50 border-green-500 text-white' :
                          isCurrent ? 'bg-blue-600 border-blue-600 text-white' :
                          'bg-white border-slate-300 text-slate-400'
                      }`}>
                          {isCompleted ? <Check size={16} /> : idx + 1}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-blue-700' : 'text-slate-400'} hidden md:block`}>
                          {step.label}
                      </span>
                  </div>
              );
          })}
      </div>
  );

  if (wizardProgress.currentStep === 'INTRO') {
    return (
      <div className="max-w-3xl mx-auto p-12 mt-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-200 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3">
          <PlayCircle size={40} className="text-blue-600 ml-1" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">Assessment Setup</h1>
        <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto font-medium">
          Welcome to your guided compliance journey. We will follow the official 2024 Scoping Guides to ensure your boundary is correctly defined.
        </p>
        
        <button 
          onClick={() => goToStep('LEVEL_SELECT')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-12 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all hover:scale-105 uppercase tracking-widest text-sm"
        >
          Initialize Scope
        </button>
      </div>
    );
  }

  if (wizardProgress.currentStep === 'LEVEL_SELECT') {
    return (
        <div className="max-w-5xl mx-auto p-6 flex flex-col h-full">
            {renderStepper()}
            <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="text-center max-w-2xl">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Identify Your Target Posture</h2>
                    <p className="text-slate-500 font-medium">Your CMMC level is defined by your contract. Level 1 covers FCI, Level 2 covers CUI, and Level 3 adds protection for APTs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {[
                        { lvl: 1, title: 'Level 1: Foundational', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Organizations that handle Federal Contract Information (FCI). Requires self-assessment of 17 practices.', tag: 'FCI DATA' },
                        { lvl: 2, title: 'Level 2: Advanced', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Organizations that handle Controlled Unclassified Information (CUI). Requires 3PAO audit of 110 practices.', tag: 'CUI DATA' },
                        { lvl: 3, title: 'Level 3: Expert', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'High-value assets and APT protection. Requires Gov-led assessment of 110+ practices.', tag: 'APT PROTECTION' },
                    ].map((card) => (
                        <button 
                            key={card.lvl}
                            onClick={() => onUpdateLevel(card.lvl as 1 | 2 | 3)}
                            className={`p-8 rounded-[2.5rem] border-2 transition-all text-left flex flex-col h-full relative group ${
                                targetLevel === card.lvl ? 'border-blue-600 bg-white shadow-2xl ring-4 ring-blue-50' : 'border-slate-100 bg-white hover:border-slate-300'
                            }`}
                        >
                            {targetLevel === card.lvl && (
                                <div className="absolute -top-3 -right-3 bg-blue-600 text-white p-1.5 rounded-full shadow-lg ring-4 ring-white">
                                    <Check size={18} />
                                </div>
                            )}
                            <div className={`p-4 ${card.bg} ${card.color} rounded-2xl w-fit mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                                <card.icon size={24} />
                            </div>
                            <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg mb-2">{card.title}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-1">{card.desc}</p>
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border w-fit ${
                                targetLevel === card.lvl ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                                {card.tag}
                            </span>
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => goToStep('SCOPING')}
                    className="bg-slate-900 hover:bg-black text-white font-black py-4 px-12 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs flex items-center gap-3"
                >
                    Lock Scope & Continue <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
  }

  const ScopingQuestion = ({ id, label, description, icon: Icon }: any) => (
      <div 
        onClick={() => setScopingAnswers(prev => ({ ...prev, [id]: !prev[id] }))}
        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 ${scopingAnswers[id] ? 'bg-blue-50 border-blue-600 shadow-md' : 'bg-white border-slate-100 hover:border-slate-200'}`}
      >
          <div className={`p-3 rounded-xl ${scopingAnswers[id] ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <Icon size={20} />
          </div>
          <div className="flex-1">
              <div className="flex justify-between items-center">
                  <h4 className={`text-sm font-black uppercase tracking-tight ${scopingAnswers[id] ? 'text-blue-900' : 'text-slate-800'}`}>{label}</h4>
                  {scopingAnswers[id] && <CheckCircle2 size={18} className="text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">{description}</p>
          </div>
      </div>
  );

  if (wizardProgress.currentStep === 'SCOPING') {
      return (
          <div className="max-w-5xl mx-auto p-6 flex flex-col h-full">
              {renderStepper()}
              <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                       <div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Environmental Scoping</h2>
                            <p className="text-xs text-slate-500 font-medium">Identify key components of your assessment boundary per CMMC guides.</p>
                       </div>
                       <div className="bg-white border border-slate-200 px-4 py-1 rounded-full text-[10px] font-black uppercase text-blue-600 tracking-widest">Guide v2.13 Aligned</div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 space-y-4">
                      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3 mb-6">
                          <Info className="text-indigo-600 shrink-0" size={20} />
                          <p className="text-xs text-indigo-800 leading-relaxed">
                              Select all that apply to your environment. This will help auto-categorize your asset inventory in the next step.
                          </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ScopingQuestion 
                            id="esp" 
                            label="External Service Providers (ESP)" 
                            description="Do you use consultants or MSPs for IT/Cybersecurity?" 
                            icon={Users} 
                          />
                          <ScopingQuestion 
                            id="csp" 
                            label="Cloud Service Providers (CSP)" 
                            description="Do you host CUI or security data in M365, AWS, Azure, etc?" 
                            icon={Cloud} 
                          />
                          <ScopingQuestion 
                            id="iot" 
                            label="Specialized Assets (IoT/OT)" 
                            description="Do you have manufacturing equipment, cameras, or test equipment?" 
                            icon={Box} 
                          />
                          <ScopingQuestion 
                            id="gfe" 
                            label="Gov Furnished Equipment (GFE)" 
                            description="Does the Government own or lease any equipment on your network?" 
                            icon={Shield} 
                          />
                          <ScopingQuestion 
                            id="enclave" 
                            label="Secure Enclave" 
                            description="Do you isolate CUI into a specific network segment (VLAN/VDI)?" 
                            icon={Lock} 
                          />
                          <ScopingQuestion 
                            id="rma" 
                            label="Risk Managed Assets (CRMA)" 
                            description="Assets that *can* but are not *intended* to process CUI (Level 2 only)." 
                            icon={AlertTriangle} 
                          />
                      </div>
                  </div>

                  <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <button onClick={() => goToStep('LEVEL_SELECT')} className="text-[10px] font-black uppercase text-slate-400">Back</button>
                    <button 
                        onClick={() => goToStep('INVENTORY')}
                        className="bg-blue-600 text-white px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-700"
                    >
                        Map Inventory <ArrowRight size={16} className="inline ml-2" />
                    </button>
                  </div>
              </div>
          </div>
      );
  }

  const WizardWrapper = ({ children, nextLabel, onNext, onPrev }: any) => (
      <div className="max-w-5xl mx-auto p-6 h-full flex flex-col">
          {renderStepper()}
          <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
               <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {STEPS.find(s => s.id === wizardProgress.currentStep)?.label}
                    </h2>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-full">
                        Scope: CMMC Level {targetLevel}
                    </span>
               </div>
               <div className="flex-1 overflow-y-auto">
                   {children}
               </div>
               <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <button 
                        onClick={onPrev}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                    >
                        <ArrowLeft size={16} /> Previous
                    </button>
                    <button 
                        onClick={onNext}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                    >
                        {nextLabel} <ArrowRight size={16} />
                    </button>
               </div>
          </div>
      </div>
  );

  if (wizardProgress.currentStep === 'INVENTORY') {
      return (
          <WizardWrapper 
            nextLabel="Proceed to Boundary Analysis" 
            onNext={() => goToStep('NETWORK')}
            onPrev={() => goToStep('SCOPING')}
          >
              <div className="p-6 space-y-6">
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-amber-600 h-fit"><Box size={24}/></div>
                    <div>
                        <h4 className="text-sm font-black uppercase text-amber-900">Categorization Notice</h4>
                        <p className="text-xs text-amber-800 leading-relaxed mt-1">
                            Per Table 1 of the Scoping Guide, categorize your assets as **CUI Assets**, **SPAs**, **CRMAs**, or **Specialized Assets**. 
                            {targetLevel === 3 && " Note: For Level 3, all CRMAs from Level 2 are treated as CUI Assets."}
                        </p>
                    </div>
                </div>
                <Inventory 
                    assets={assets} 
                    onAddAsset={onAddAsset!} 
                    onDeleteAsset={onDeleteAsset!} 
                    variant="wizard"
                />
              </div>
          </WizardWrapper>
      );
  }

  if (wizardProgress.currentStep === 'NETWORK') {
      return (
           <WizardWrapper 
            nextLabel="Start Audit" 
            onNext={() => goToStep('ASSESSMENT')}
            onPrev={() => goToStep('INVENTORY')}
          >
             <div className="p-6">
                <div className="mb-6 bg-blue-900 rounded-3xl p-6 text-white flex items-center gap-6 shadow-xl">
                    <Network size={40} className="text-blue-400" />
                    <div>
                        <h4 className="font-black uppercase tracking-tight">Boundary Verification</h4>
                        <p className="text-xs text-blue-200 font-medium leading-relaxed">
                            Upload your network diagram. Our AI will analyze it for "Logical" vs "Physical" separation, 
                            consistent with 32 CFR § 170.19 guidelines.
                        </p>
                    </div>
                </div>
                <NetworkAnalyzer variant="wizard" />
             </div>
          </WizardWrapper>
      );
  }

  if (wizardProgress.currentStep === 'ASSESSMENT') {
      const progress = Math.round(((wizardProgress.currentQuestionIndex) / (activeReqs.length || 1)) * 100);
      const isMet = currentReq?.objectives.every(o => o.status === 'met');
      const isNotMet = currentReq?.objectives.some(o => o.status === 'not_met');

      return (
          <WizardWrapper 
            nextLabel={wizardProgress.currentQuestionIndex === activeReqs.length - 1 ? "Final Review" : "Next Control"}
            onNext={handleAssessmentNext}
            onPrev={handleAssessmentPrev}
          >
             <div className="flex flex-col h-full">
                <div className="px-10 pt-8">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        <span>Control {wizardProgress.currentQuestionIndex + 1} of {activeReqs.length}</span>
                        <span>{progress}% Mastery</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="p-10 space-y-10">
                    {currentReq ? (
                        <>
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <span className="font-mono text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-widest">{currentReq.id}</span>
                                <div className="flex gap-2">
                                    {isMet && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-green-200 shadow-sm"><Check size={12}/> Met</span>}
                                    {isNotMet && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-red-200 shadow-sm"><AlertTriangle size={12}/> Gap</span>}
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">{currentReq.interviewQuestion || currentReq.title}</h2>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{currentReq.description}</p>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Implementation Evidence</label>
                            <textarea 
                                className="w-full h-40 p-5 border border-slate-200 bg-slate-50 rounded-[2rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none text-slate-700 font-medium"
                                placeholder="Describe the technical solution or administrative procedure in place..."
                                value={currentReq.response || ''}
                                onChange={(e) => handleResponseChange(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <button 
                                    onClick={toggleNotMet}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                                        isNotMet 
                                        ? 'bg-red-50 text-red-700 border-red-600' 
                                        : 'bg-white text-slate-400 border-slate-100 hover:border-red-600 hover:text-red-600'
                                    }`}
                                >
                                    <AlertTriangle size={16} /> {isNotMet ? 'Confirmed Gap' : 'Mark as Gap'}
                                </button>

                                <button 
                                    onClick={toggleMet}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                                        isMet 
                                        ? 'bg-green-50 text-green-700 border-green-600' 
                                        : 'bg-white text-slate-400 border-slate-100 hover:border-green-600 hover:text-green-600'
                                    }`}
                                >
                                    <CheckCircle2 size={16} /> {isMet ? 'Verified Met' : 'Mark as Met'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200 shadow-inner">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <FileCheck size={18} className="text-blue-500" /> Technical Proof Repository
                            </h3>
                            <ArtifactUploader 
                                requirementId={currentReq.id}
                                artifacts={artifacts.filter(a => a.requirementId === currentReq.id)}
                                onAddArtifact={onAddArtifact}
                                onRemoveArtifact={onRemoveArtifact}
                            />
                        </div>
                        </>
                    ) : (
                        <div className="p-20 text-center text-slate-300">
                            <CheckCircle2 size={64} className="mx-auto mb-4 opacity-10" />
                            <p className="font-black uppercase tracking-widest text-sm">Audit Complete for Level {targetLevel}</p>
                        </div>
                    )}
                </div>
             </div>
          </WizardWrapper>
      );
  }

  if (wizardProgress.currentStep === 'VALIDATION') {
      return (
        <div className="max-w-5xl mx-auto p-6 h-full flex flex-col">
            {renderStepper()}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col">
                <div className="bg-slate-900 p-12 text-center text-white relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
                    <CheckCircle2 size={64} className="mx-auto mb-6 text-green-400 drop-shadow-lg" />
                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-3">Post-Audit Scorecard</h2>
                    <p className="text-blue-300 text-sm font-bold uppercase tracking-[0.2em]">Preliminary Scoping Review Summary</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
                    <div className="p-12 text-center group transition-colors hover:bg-green-50/30">
                        <div className="text-5xl font-black text-green-600 mb-2">{completedCount}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scoped Controls Met</div>
                    </div>
                     <div className="p-12 text-center group transition-colors hover:bg-red-50/30">
                        <div className="text-5xl font-black text-red-600 mb-2">{gapsCount}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identified Risks</div>
                    </div>
                     <div className="p-12 text-center group transition-colors hover:bg-amber-50/30">
                        <div className="text-5xl font-black text-amber-500 mb-2">{pendingCount}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Pending Review</div>
                    </div>
                </div>

                <div className="p-12 bg-slate-50 flex flex-col items-center">
                    <button 
                        onClick={onComplete}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-4"
                    >
                        Commit Findings & Exit Wizard <ArrowRight size={20} />
                    </button>
                    <p className="mt-8 text-xs text-slate-400 font-medium italic">You can return to the 'Level {targetLevel}' assessment at any time via the Control Audit tab.</p>
                </div>
            </div>
        </div>
      );
  }

  return null;
};