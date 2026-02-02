import React, { useState } from 'react';
import { Requirement, Artifact, WizardProgress, Asset, AssessmentObjective } from '../types';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Shield, AlertTriangle, 
  PlayCircle, FileCheck, Check, Info, Monitor, Network, 
  ListChecks, Target, Lock, Zap, Box, Cloud, Users, 
  FileSearch, ClipboardList, MessageSquare, Download, Upload, 
  FileSpreadsheet, Loader2 
} from 'lucide-react';
import { ArtifactUploader } from './ArtifactUploader';
import { Inventory } from './Inventory';
import { NetworkAnalyzer } from './NetworkAnalyzer';

interface ComplianceWizardProps {
  requirements: Requirement[];
  artifacts: Artifact[];
  assets?: Asset[];
  wizardProgress: WizardProgress;
  onUpdateRequirement: (req: Requirement) => void;
  onBatchUpdate?: (reqs: Requirement[]) => void;
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
  onBatchUpdate,
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
  const [isImporting, setIsImporting] = useState(false);

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

  const handleDownloadTemplate = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Control ID,Title,Domain,Auditor Interview Guide,Implementation Narrative,Status (met/not_met/pending)\n";

    activeReqs.forEach(req => {
      const interviewQuestions = `"${(req.interviewOptions || []).join(' | ').replace(/"/g, '""')}"`;
      const narrative = `"${(req.response || '').replace(/"/g, '""')}"`;
      const status = req.objectives.every(o => o.status === 'met') ? 'met' : 
                     req.objectives.some(o => o.status === 'not_met') ? 'not_met' : 'pending';
      
      const row = [
        req.id,
        `"${req.title.replace(/"/g, '""')}"`,
        req.family,
        interviewQuestions,
        narrative,
        status
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CMMC_Level_${targetLevel}_Audit_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onBatchUpdate) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/);
        const updatedBatch: Requirement[] = [];

        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (parts.length < 6) continue;

            const [id, title, domain, questions, narrative, status] = parts.map(p => p.replace(/^"|"$/g, '').trim());
            const existing = requirements.find(r => r.id === id);
            
            if (existing) {
                const cleanStatus = status.toLowerCase() as AssessmentObjective['status'];
                const validStatuses: AssessmentObjective['status'][] = ['met', 'not_met', 'pending', 'na'];
                const finalStatus = validStatuses.includes(cleanStatus) ? cleanStatus : 'pending';

                updatedBatch.push({
                    ...existing,
                    response: narrative,
                    objectives: existing.objectives.map(obj => ({ ...obj, status: finalStatus }))
                });
            }
        }

        if (updatedBatch.length > 0) {
            onBatchUpdate(updatedBatch);
            alert(`Sync complete: Updated ${updatedBatch.length} requirements.`);
        }
        setIsImporting(false);
    };
    reader.readAsText(file);
    e.target.value = '';
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
      <div className="max-w-4xl mx-auto p-12 mt-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3">
            <PlayCircle size={40} className="text-blue-600 ml-1" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">Assessment Journey</h1>
            <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto font-medium">
            Welcome to your guided compliance lifecycle. We will step through scoping, discovery, and audit verification.
            </p>
            
            <button 
            onClick={() => goToStep('LEVEL_SELECT')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-12 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all hover:scale-105 uppercase tracking-widest text-sm"
            >
            Initialize Guided Scope
            </button>
        </div>

        {/* Bulk Operations Sidebar/Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-4">
                        <Download size={24} className="text-indigo-400" /> Bulk Workbench
                    </h3>
                    <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-8 opacity-80">
                        Prefer to work offline? Download the official audit template, fill in your narratives, and upload it back to the system.
                    </p>
                </div>
                <button 
                    onClick={handleDownloadTemplate}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                >
                    <FileSpreadsheet size={16} /> Download CSV Template
                </button>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-4">
                        <Upload size={24} className="text-blue-600" /> Restore Progress
                    </h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">
                        Upload your completed spreadsheet to synchronize implementations and objective statuses instantly.
                    </p>
                </div>
                <label className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 cursor-pointer border-2 border-dashed ${isImporting ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'}`}>
                    {isImporting ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                    {isImporting ? 'Parsing Batch...' : 'Upload Completed CSV'}
                    <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} disabled={isImporting} />
                </label>
            </div>
        </div>
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

  const WizardWrapper = ({ children, nextLabel, onNext, onPrev }: any) => (
      <div className="max-w-7xl mx-auto p-6 h-full flex flex-col">
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
             <div className="flex h-full min-h-0">
                <div className="flex-1 flex flex-col h-full overflow-y-auto">
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
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-mono text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-widest">{currentReq.id}</span>
                                    <div className="flex gap-2">
                                        {isMet && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-green-200 shadow-sm"><Check size={12}/> Met</span>}
                                        {isNotMet && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-red-200 shadow-sm"><AlertTriangle size={12}/> Gap</span>}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase leading-tight">
                                    {currentReq.title}
                                </h2>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                    {currentReq.description}
                                </p>
                            </div>

                            {/* AUDITOR INTERVIEW SECTION */}
                            <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 space-y-6">
                                <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare size={16}/> Auditor Interview Guide
                                </h3>
                                <p className="text-xs text-indigo-800 font-medium">To satisfy this control, provide clear answers to these specific audit questions:</p>
                                <div className="space-y-4">
                                    {currentReq.interviewOptions?.map((q, i) => (
                                        <div key={i} className="flex gap-3 bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
                                            <div className="text-indigo-600 font-black text-sm">Q.</div>
                                            <p className="text-sm font-bold text-slate-700 leading-relaxed">{q}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Implementation Response (SSP Narrative)</label>
                                <textarea 
                                    className="w-full h-48 p-5 border border-slate-200 bg-white rounded-[2rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all shadow-inner resize-none text-slate-700 font-medium"
                                    placeholder="Based on the questions above, describe your organization's implementation..."
                                    value={currentReq.response || ''}
                                    onChange={(e) => handleResponseChange(e.target.value)}
                                />
                                <div className="flex gap-4">
                                    <button onClick={toggleNotMet} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${isNotMet ? 'bg-red-50 text-red-700 border-red-600' : 'bg-white text-slate-400 border-slate-100 hover:border-red-600 hover:text-red-600'}`}><AlertTriangle size={16} /> {isNotMet ? 'Confirmed Gap' : 'Mark as Gap'}</button>
                                    <button onClick={toggleMet} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${isMet ? 'bg-green-50 text-green-700 border-green-600' : 'bg-white text-slate-400 border-slate-100 hover:border-green-600 hover:text-green-600'}`}><CheckCircle2 size={16} /> {isMet ? 'Verified Met' : 'Mark as Met'}</button>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200 shadow-inner">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><FileCheck size={18} className="text-blue-500" /> Evidence Upload</h3>
                                <ArtifactUploader requirementId={currentReq.id} artifacts={artifacts.filter(a => a.requirementId === currentReq.id)} onAddArtifact={onAddArtifact} onRemoveArtifact={onRemoveArtifact} />
                            </div>
                            </>
                        ) : null}
                    </div>
                </div>
             </div>
          </WizardWrapper>
      );
  }

  // Handle other steps similarly to the existing file but ensuring onBatchUpdate is available
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ScopingQuestion id="esp" label="External Service Providers (ESP)" description="Do you use consultants or MSPs for IT/Cybersecurity?" icon={Users} scopingAnswers={scopingAnswers} setScopingAnswers={setScopingAnswers} />
                          <ScopingQuestion id="csp" label="Cloud Service Providers (CSP)" description="Do you host CUI or security data in M365, AWS, Azure, etc?" icon={Cloud} scopingAnswers={scopingAnswers} setScopingAnswers={setScopingAnswers} />
                          <ScopingQuestion id="iot" label="Specialized Assets (IoT/OT)" description="Do you have manufacturing equipment, cameras, or test equipment?" icon={Box} scopingAnswers={scopingAnswers} setScopingAnswers={setScopingAnswers} />
                          <ScopingQuestion id="gfe" label="Gov Furnished Equipment (GFE)" description="Does the Government own or lease any equipment on your network?" icon={Shield} scopingAnswers={scopingAnswers} setScopingAnswers={setScopingAnswers} />
                          <ScopingQuestion id="enclave" label="Secure Enclave" description="Do you isolate CUI into a specific network segment (VLAN/VDI)?" icon={Lock} scopingAnswers={scopingAnswers} setScopingAnswers={setScopingAnswers} />
                          <ScopingQuestion id="rma" label="Risk Managed Assets (CRMA)" description="Assets that *can* but are not *intended* to process CUI (Level 2 only)." icon={AlertTriangle} scopingAnswers={scopingAnswers} setScopingAnswers={setScopingAnswers} />
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

  if (wizardProgress.currentStep === 'INVENTORY') {
      return (
          <WizardWrapper nextLabel="Proceed to Boundary Analysis" onNext={() => goToStep('NETWORK')} onPrev={() => goToStep('SCOPING')}>
              <div className="p-6 space-y-6">
                <Inventory assets={assets} onAddAsset={onAddAsset!} onDeleteAsset={onDeleteAsset!} variant="wizard" />
              </div>
          </WizardWrapper>
      );
  }

  if (wizardProgress.currentStep === 'NETWORK') {
      return (
           <WizardWrapper nextLabel="Start Audit" onNext={() => goToStep('ASSESSMENT')} onPrev={() => goToStep('INVENTORY')}>
             <div className="p-6">
                <NetworkAnalyzer variant="wizard" />
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
                    <CheckCircle2 size={64} className="mx-auto mb-6 text-green-400 drop-shadow-lg" />
                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-3">Assessment Scorecard</h2>
                    <p className="text-blue-300 text-sm font-bold uppercase tracking-[0.2em]">Preliminary Readiness Result</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
                    <div className="p-12 text-center"><div className="text-5xl font-black text-green-600 mb-2">{completedCount}</div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Controls Met</div></div>
                    <div className="p-12 text-center"><div className="text-5xl font-black text-red-600 mb-2">{gapsCount}</div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gaps Found</div></div>
                    <div className="p-12 text-center"><div className="text-5xl font-black text-amber-500 mb-2">{pendingCount}</div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining</div></div>
                </div>
                <div className="p-12 bg-slate-50 flex flex-col items-center">
                    <button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl transition-all hover:scale-105 flex items-center gap-4">Commit Assessment <ArrowRight size={20} /></button>
                </div>
            </div>
        </div>
      );
  }

  return null;
};

const ScopingQuestion = ({ id, label, description, icon: Icon, scopingAnswers, setScopingAnswers }: any) => (
    <div 
      onClick={() => setScopingAnswers((prev: any) => ({ ...prev, [id]: !prev[id] }))}
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