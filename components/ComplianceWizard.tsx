
import React, { useState } from 'react';
import { Requirement, Artifact, WizardProgress, Asset, AssessmentObjective, ClientData } from '../types';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Shield, AlertTriangle, 
  PlayCircle, FileCheck, Check, Info, Monitor, Network, 
  ListChecks, Target, Lock, Zap, Box, Cloud, Users, 
  FileSearch, ClipboardList, MessageSquare, Download, Upload, 
  FileSpreadsheet, Loader2, ShieldCheck, Sparkles, RefreshCw, BookOpen,
  Search
} from 'lucide-react';
import { ArtifactUploader } from './ArtifactUploader';
import { Inventory } from './Inventory';
import { NetworkAnalyzer } from './NetworkAnalyzer';
import { NIST_CMMC_FAMILIES } from '../data/standards';
import { auditPolicyAgainstFramework } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface ComplianceWizardProps {
  requirements: Requirement[];
  artifacts: Artifact[];
  assets?: Asset[];
  wizardProgress: WizardProgress;
  activeClientData: ClientData;
  onUpdateRequirement: (req: Requirement) => void;
  onBatchUpdate?: (reqs: Requirement[]) => void;
  onAddArtifact: (artifact: Artifact) => void;
  onRemoveArtifact: (id: string) => void;
  onAddAsset?: (asset: Asset) => void;
  onDeleteAsset?: (id: string) => void;
  onUpdateProgress: (progress: WizardProgress) => void;
  onUpdateLevel: (level: 1 | 2 | 3) => void;
  onUpdateClientData: (updates: Partial<ClientData>) => void;
  targetLevel: 1 | 2 | 3;
  activeFrameworkId: string;
  activeClientId?: string;
  onComplete: () => void;
}

const STEPS = [
    { id: 'INTRO', label: 'Welcome' },
    { id: 'LEVEL_SELECT', label: 'Target Level' },
    { id: 'SCOPING', label: 'Environment Scoping' },
    { id: 'INVENTORY', label: 'Asset Inventory' },
    { id: 'NETWORK', label: 'Network Scope' },
    { id: 'POLICIES', label: 'Policy Intake' },
    { id: 'ASSESSMENT', label: 'Discovery & Narrative' },
    { id: 'VALIDATION', label: 'Review' }
] as const;

export const ComplianceWizard: React.FC<ComplianceWizardProps> = ({
  requirements,
  artifacts,
  assets = [],
  wizardProgress,
  activeClientData,
  onUpdateRequirement,
  onBatchUpdate,
  onAddArtifact,
  onRemoveArtifact,
  onAddAsset,
  onDeleteAsset,
  onUpdateProgress,
  onUpdateLevel,
  onUpdateClientData,
  targetLevel,
  activeFrameworkId,
  activeClientId,
  onComplete
}) => {
  
  const [scopingAnswers, setScopingAnswers] = useState<Record<string, boolean>>({});
  const [isImporting, setIsImporting] = useState(false);

  // Policy Step State
  const [isAuditing, setIsAuditing] = useState(false);

  const activeReqs = requirements.filter(r => 
    r.framework === activeFrameworkId && r.cmmcLevel <= targetLevel
  );
  
  const goToStep = (step: WizardProgress['currentStep']) => {
      onUpdateProgress({ ...wizardProgress, currentStep: step });
  };

  const handleNext = () => {
    const currentIndex = STEPS.findIndex(s => s.id === wizardProgress.currentStep);
    if (wizardProgress.currentStep === 'ASSESSMENT') {
        if (wizardProgress.currentQuestionIndex < activeReqs.length - 1) {
            onUpdateProgress({ ...wizardProgress, currentQuestionIndex: wizardProgress.currentQuestionIndex + 1 });
        } else {
            goToStep('VALIDATION');
        }
    } else if (currentIndex < STEPS.length - 1) {
        goToStep(STEPS[currentIndex + 1].id as WizardProgress['currentStep']);
    } else {
        onComplete();
    }
  };

  const handlePrev = () => {
    const currentIndex = STEPS.findIndex(s => s.id === wizardProgress.currentStep);
    if (wizardProgress.currentStep === 'ASSESSMENT') {
        if (wizardProgress.currentQuestionIndex > 0) {
            onUpdateProgress({ ...wizardProgress, currentQuestionIndex: wizardProgress.currentQuestionIndex - 1 });
        } else {
            goToStep('POLICIES');
        }
    } else if (currentIndex > 0) {
        goToStep(STEPS[currentIndex - 1].id as WizardProgress['currentStep']);
    }
  };

  const handleAudit = async () => {
    if (!activeClientData.policyText?.trim()) return;
    setIsAuditing(true);
    
    // Clear previous analysis
    onUpdateClientData({ policyAnalysisResult: undefined });
    
    try {
      // Audit against framework requirements
      const result = await auditPolicyAgainstFramework(
        "Standard Onboarding Review",
        activeClientData.policyText,
        activeReqs
      );
      onUpdateClientData({ policyAnalysisResult: result });
    } catch (e) {
      alert("AI Audit engine encountered an error.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handlePolicyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
          onUpdateClientData({ policyText: ev.target?.result as string });
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadTemplate = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Control ID,Title,Domain,Practitioner Discovery Questions,Implementation Narrative,Status (met/not_met/pending)\n";

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
    link.setAttribute("download", `CMMC_Level_${targetLevel}_Discovery_Template.csv`);
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
            alert(`Sync complete: Updated ${updatedBatch.length} requirements based on CSV.`);
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

  const toggleObjective = (objId: string) => {
    if (!currentReq) return;
    const updatedObjectives = currentReq.objectives.map(o => {
        if (o.id === objId) {
            return { ...o, status: o.status === 'met' ? 'pending' : 'met' as any };
        }
        return o;
    });
    onUpdateRequirement({ ...currentReq, objectives: updatedObjectives });
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

  if (wizardProgress.currentStep === 'INTRO') {
    return (
      <div className="max-w-4xl mx-auto p-12 mt-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3">
            <PlayCircle size={40} className="text-blue-600 ml-1" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">Practitioner Discovery</h1>
            <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto font-medium">
            Guide your client through scoping, information gathering, and implementation narrative drafting.
            </p>
            
            <button 
            onClick={() => goToStep('LEVEL_SELECT')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-12 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all hover:scale-105 uppercase tracking-widest text-sm"
            >
            Initialize Discovery
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-4">
                        <Download size={24} className="text-indigo-400" /> Bulk Workbench
                    </h3>
                    <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-8 opacity-80">
                        Work offline. Download the practitioner discovery template, fill in client narratives, and sync back.
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
                        <Upload size={24} className="text-blue-600" /> Import Narratives
                    </h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">
                        Upload your completed discovery spreadsheet to synchronize client implementations instantly.
                    </p>
                </div>
                <label className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 cursor-pointer border-2 border-dashed ${isImporting ? 'bg-slate-50 border-slate-200 text-slate-400 pointer-events-none' : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'}`}>
                    {isImporting ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                    {isImporting ? 'Parsing Batch...' : 'Upload Completed CSV'}
                    <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} disabled={isImporting} />
                </label>
            </div>
        </div>
      </div>
    );
  }

  return (
    <WizardWrapper 
        nextLabel={wizardProgress.currentStep === 'ASSESSMENT' ? (wizardProgress.currentQuestionIndex === activeReqs.length - 1 ? "Final Review" : "Next Practice") : "Next Step"} 
        onNext={handleNext} 
        onPrev={handlePrev} 
        targetLevel={targetLevel} 
        wizardProgress={wizardProgress}
    >
        {wizardProgress.currentStep === 'LEVEL_SELECT' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-10 p-10">
                <div className="text-center max-w-2xl">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Target Posture</h2>
                    <p className="text-slate-500 font-medium">The CMMC level required for your organization is specified by your DoD contract requirements.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {[
                        { lvl: 1, title: 'Level 1', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', desc: '17 basic security practices required for handling Federal Contract Information (FCI).' },
                        { lvl: 2, title: 'Level 2', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: '110 security practices required for handling Controlled Unclassified Information (CUI).' },
                        { lvl: 3, title: 'Level 3', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Advanced security requirements for organizations handling high-priority CUI.' },
                    ].map((card) => (
                        <button 
                            key={card.lvl}
                            onClick={() => onUpdateLevel(card.lvl as 1 | 2 | 3)}
                            className={`p-8 rounded-[2.5rem] border-2 transition-all text-left flex flex-col h-full relative group ${
                                targetLevel === card.lvl ? 'border-blue-600 bg-white shadow-2xl ring-4 ring-blue-50' : 'border-slate-100 bg-white hover:border-slate-300'
                            }`}
                        >
                            <div className={`p-4 ${card.bg} ${card.color} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
                                <card.icon size={24} />
                            </div>
                            <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg mb-2">{card.title}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-1">{card.desc}</p>
                            {targetLevel === card.lvl && <Check className="text-blue-600 absolute bottom-8 right-8" />}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {wizardProgress.currentStep === 'SCOPING' && (
            <div className="p-10 space-y-8 overflow-y-auto h-full">
                <div className="max-w-2xl">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Boundary Definition</h3>
                    <p className="text-slate-500 text-sm font-medium">Identify the systems and locations where CUI or FCI is processed, stored, or transmitted.</p>
                </div>
                <div className="grid gap-4">
                    {[
                        { id: 'cloud', label: 'Does your organization use Cloud Services (SaaS, IaaS, PaaS)?', icon: Cloud },
                        { id: 'mobile', label: 'Do employees use mobile devices to access company data?', icon: Monitor },
                        { id: 'external', label: 'Are there external systems or partners connected to your network?', icon: Network },
                        { id: 'onprem', label: 'Do you maintain physical servers or workstations on-site?', icon: Box },
                    ].map(q => (
                        <button 
                            key={q.id}
                            onClick={() => setScopingAnswers({...scopingAnswers, [q.id]: !scopingAnswers[q.id]})}
                            className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${scopingAnswers[q.id] ? 'border-blue-500 bg-blue-50/30' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${scopingAnswers[q.id] ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <q.icon size={20} />
                                </div>
                                <span className="text-sm font-bold text-slate-700">{q.label}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scopingAnswers[q.id] ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>
                                {scopingAnswers[q.id] && <Check size={14} />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {wizardProgress.currentStep === 'INVENTORY' && (
            <Inventory assets={assets} onAddAsset={onAddAsset!} onDeleteAsset={onDeleteAsset!} variant="wizard" />
        )}

        {wizardProgress.currentStep === 'NETWORK' && (
            <div className="p-10 h-full overflow-y-auto">
                <NetworkAnalyzer 
                  variant="wizard" 
                  activeClientId={activeClientId}
                  existingAnalysis={activeClientData.networkAnalysisResult}
                  existingDiagramId={activeClientData.networkDiagramArtifactId}
                  artifacts={artifacts}
                  onUpdateAnalysis={(res) => onUpdateClientData({ networkAnalysisResult: res })}
                  onUpdateDiagramId={(id) => onUpdateClientData({ networkDiagramArtifactId: id })}
                  onAddArtifact={onAddArtifact}
                />
            </div>
        )}

        {wizardProgress.currentStep === 'POLICIES' && (
            <div className="p-10 h-full overflow-y-auto flex flex-col space-y-8 animate-in fade-in duration-500">
                <div className="max-w-2xl">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Policy Intake & Audit</h3>
                    <p className="text-slate-500 text-sm font-medium">Upload your existing security policies for an immediate AI gap analysis against standard domains.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 flex flex-col space-y-4">
                        <div className="flex justify-between items-center mb-2">
                             <div className="flex items-center gap-2">
                                <BookOpen size={18} className="text-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Policy Document Workspace</span>
                             </div>
                             <div className="bg-slate-100 text-[9px] font-black uppercase rounded-lg px-3 py-1 outline-none">
                                Full Framework Audit
                             </div>
                        </div>
                        <textarea 
                           className="flex-1 min-h-[250px] w-full border border-slate-100 bg-slate-50/50 rounded-2xl p-6 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-medium text-slate-700 resize-none"
                           placeholder="Paste policy text here or use upload..."
                           value={activeClientData.policyText || ''}
                           onChange={e => onUpdateClientData({ policyText: e.target.value })}
                        />
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-all shadow-sm">
                                <Upload size={14}/> Upload .txt/.md
                                <input type="file" className="hidden" accept=".txt,.md" onChange={handlePolicyFileUpload} />
                            </label>
                            <button 
                                onClick={handleAudit}
                                disabled={isAuditing || !activeClientData.policyText?.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200 transition-all flex items-center gap-3 disabled:opacity-30"
                            >
                                {isAuditing ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>}
                                {isAuditing ? 'Auditing...' : 'AI Audit'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] p-8 flex flex-col overflow-hidden relative min-h-[300px]">
                        {!activeClientData.policyAnalysisResult && !isAuditing ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-center">
                                <div className="p-4 bg-white/5 rounded-2xl mb-4"><Search size={32}/></div>
                                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Analysis</p>
                            </div>
                        ) : isAuditing ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <RefreshCw className="animate-spin text-blue-400 mb-4" size={48} />
                                <h3 className="text-white font-black uppercase tracking-widest text-sm">Reviewing Alignment...</h3>
                                <p className="text-blue-300/50 text-[10px] mt-2 max-w-xs">Mapping content to {activeFrameworkId} requirements.</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-sm max-w-none prose-p:text-blue-100/80 prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-li:text-blue-100/70">
                                <ReactMarkdown>{activeClientData.policyAnalysisResult || ''}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {wizardProgress.currentStep === 'ASSESSMENT' && currentReq && (
            <div className="flex flex-col h-full overflow-y-auto p-10 space-y-10 custom-scrollbar">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-widest">{currentReq.id}</span>
                        <div className="flex gap-2">
                            {currentReq.objectives.every(o => o.status === 'met') && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-green-200 shadow-sm"><Check size={12}/> Met</span>}
                            {currentReq.objectives.some(o => o.status === 'not_met') && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-red-200 shadow-sm"><AlertTriangle size={12}/> Gap</span>}
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase leading-tight">{currentReq.title}</h2>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-100">{currentReq.description}</p>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-900 px-8 py-4 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldCheck size={16} className="text-blue-400" /> Practitioner Objective Checklist
                    </div>
                    <div className="divide-y divide-slate-100">
                        {currentReq.objectives.map(obj => (
                            <div key={obj.id} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                                <button onClick={() => toggleObjective(obj.id)} className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${obj.status === 'met' ? 'bg-green-50 border-green-500 text-green-600' : 'bg-white border-slate-200'}`}>
                                    {obj.status === 'met' && <Check size={14} />}
                                </button>
                                <div className="flex-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Assessment Criterion [{obj.id}]</div>
                                    <p className="text-xs text-slate-800 font-bold leading-relaxed">{obj.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare size={16}/> Practitioner Prep Guide (Ask the Client)
                    </h3>
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
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Implementation Narrative (SSP Content)</label>
                    <textarea 
                        className="w-full h-48 p-5 border border-slate-200 bg-white rounded-[2rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all shadow-inner resize-none text-slate-700 font-medium"
                        placeholder="Document the client's implementation details here..."
                        value={currentReq.response || ''}
                        onChange={(e) => handleResponseChange(e.target.value)}
                    />
                    <div className="flex gap-4">
                        <button onClick={toggleNotMet} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${currentReq.objectives.some(o => o.status === 'not_met') ? 'bg-red-50 text-red-700 border-red-600' : 'bg-white text-slate-400 border-slate-100 hover:border-red-600 hover:text-red-600'}`}><AlertTriangle size={16} /> Mark as Gap</button>
                        <button onClick={toggleMet} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${currentReq.objectives.every(o => o.status === 'met') ? 'bg-green-50 text-green-700 border-green-600' : 'bg-white text-slate-400 border-slate-100 hover:border-green-600 hover:text-green-600'}`}><CheckCircle2 size={16} /> Mark as Met</button>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200 shadow-inner">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><FileCheck size={18} className="text-blue-500" /> Evidence Upload</h3>
                    <ArtifactUploader requirementId={currentReq.id} artifacts={artifacts.filter(a => a.requirementId === currentReq.id)} onAddArtifact={onAddArtifact} onRemoveArtifact={onRemoveArtifact} />
                </div>
            </div>
        )}

        {wizardProgress.currentStep === 'VALIDATION' && (
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-8 h-full">
                <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-green-600 shadow-lg ring-4 ring-green-50">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Discovery Complete</h2>
                <p className="text-slate-500 max-w-lg font-medium leading-relaxed">
                    You have finished the core discovery phase for Level {targetLevel}. Your implementation narratives are now ready to be synthesized into the draft System Security Plan.
                </p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items Gathered</div>
                        <div className="text-2xl font-black text-slate-900">{activeReqs.filter(r => r.objectives.every(o => o.status === 'met')).length}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gaps Identified</div>
                        <div className="text-2xl font-black text-red-600">{activeReqs.filter(r => r.objectives.some(o => o.status === 'not_met')).length}</div>
                    </div>
                </div>
            </div>
        )}
    </WizardWrapper>
  );
};

const WizardWrapper = ({ children, nextLabel, onNext, onPrev, targetLevel, wizardProgress }: any) => (
      <div className="max-w-7xl mx-auto p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8 px-4 relative shrink-0">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
                {STEPS.map((step, idx) => {
                    const currentIdx = STEPS.findIndex(s => s.id === wizardProgress.currentStep);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-50 px-2 rounded">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                                isCompleted ? 'bg-green-50 border-green-500 text-green-600' :
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
          <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
               <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {STEPS.find(s => s.id === wizardProgress.currentStep)?.label}
                    </h2>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-full">
                        Level {targetLevel} Preparation
                    </span>
               </div>
               <div className="flex-1 overflow-hidden">
                   {children}
               </div>
               <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <button 
                        onClick={onPrev}
                        disabled={wizardProgress.currentStep === 'INTRO'}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all disabled:opacity-0"
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
