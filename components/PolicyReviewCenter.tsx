
import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Shield, 
  Info,
  ChevronRight,
  ClipboardList,
  Save,
  Trash2,
  RefreshCw,
  Zap,
  BookOpen
} from 'lucide-react';
import { Requirement, ClientData } from '../types';
import { NIST_CMMC_FAMILIES } from '../data/standards';
import { auditPolicyAgainstFramework } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface PolicyReviewCenterProps {
  requirements: Requirement[];
  activeFrameworkId: string;
  policyText?: string;
  auditResult?: string;
  onUpdate: (updates: Partial<ClientData>) => void;
}

export const PolicyReviewCenter: React.FC<PolicyReviewCenterProps> = ({ 
    requirements, 
    activeFrameworkId,
    policyText = '',
    auditResult = null,
    onUpdate
}) => {
  const [isAuditing, setIsAuditing] = useState(false);

  // Filter requirements for the active framework to use as the audit baseline
  const activeReqs = requirements.filter(r => r.framework === activeFrameworkId);

  const handleAudit = async () => {
    if (!policyText.trim()) return;
    setIsAuditing(true);
    
    // Clear previous result while auditing
    onUpdate({ policyAnalysisResult: undefined });
    
    try {
      // Audit against all requirements in scope since the domain dropdown was removed
      const result = await auditPolicyAgainstFramework(
        "Full Organization Framework",
        policyText,
        activeReqs
      );
      onUpdate({ policyAnalysisResult: result });
    } catch (e) {
      alert("AI Audit engine encountered an error.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
          const text = ev.target?.result as string;
          onUpdate({ policyText: text });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 h-full flex flex-col space-y-8 bg-slate-50/50 overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
         <div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                <Sparkles size={14}/> Artifact Validation Lab
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Policy Auditor</h1>
            <p className="text-slate-500 font-medium mt-3 max-w-xl">
                Upload organizational policies for a deep-dive AI gap analysis against the complete {activeFrameworkId} framework.
            </p>
         </div>
         <div className="flex items-center gap-3">
             <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                <Shield size={14} className="text-blue-400" /> Framework: {activeFrameworkId}
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
          
          {/* Editor Area */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200"><BookOpen size={18} className="text-blue-600"/></div>
                          <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Policy Workspace</h3>
                      </div>
                      <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-all shadow-sm">
                          <Upload size={14}/> Upload Document
                          <input type="file" className="hidden" accept=".txt,.md" onChange={handleFileUpload} />
                      </label>
                  </div>
                  <textarea 
                    className="flex-1 p-10 outline-none resize-none text-slate-700 font-medium leading-relaxed bg-transparent scrollbar-hide text-lg"
                    placeholder="Paste your organization's policy here for automated review..."
                    value={policyText}
                    onChange={e => onUpdate({ policyText: e.target.value })}
                  />
                  <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Word Count: {policyText.split(/\s+/).filter(Boolean).length}
                      </div>
                      <button 
                        onClick={handleAudit}
                        disabled={isAuditing || !policyText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 transition-all flex items-center gap-3 disabled:opacity-30"
                      >
                        {isAuditing ? <Loader2 className="animate-spin" size={18}/> : <Zap size={18} className="text-blue-200"/>}
                        {isAuditing ? 'Auditing Artifact...' : 'Start Audit Analysis'}
                      </button>
                  </div>
              </div>
          </div>

          {/* Analysis Area */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden relative">
                  {!auditResult && !isAuditing ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-slate-300">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner"><Search size={48} className="opacity-10" /></div>
                        <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">Awaiting Input</h3>
                        <p className="max-w-xs mt-3 text-sm font-medium leading-relaxed">Provide policy text in the workspace to begin the automated compliance review.</p>
                    </div>
                  ) : isAuditing ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="relative">
                            <div className="w-32 h-32 border-4 border-blue-50 rounded-full animate-ping absolute inset-0"></div>
                            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl relative z-10">
                                <Sparkles size={48} className="text-white animate-pulse" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mt-12 mb-4">AI Analyzing Artifact...</h3>
                        <div className="space-y-3 w-full max-w-xs">
                             <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600 animate-loading-bar" />
                             </div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Mapping to Framework Requirements</p>
                        </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-6 duration-700">
                        <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><CheckCircle2 size={24}/></div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Audit Findings</h3>
                                    <p className="text-blue-300 text-[9px] font-black uppercase tracking-widest">Full Framework Analysis Complete</p>
                                </div>
                            </div>
                            <button onClick={() => onUpdate({ policyAnalysisResult: undefined })} className="p-2 hover:bg-white/10 rounded-full transition-colors"><RefreshCw size={18} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                            <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-10 prose-h2:border-b-2 prose-h2:pb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-table:border prose-table:rounded-xl prose-th:bg-slate-50 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2 prose-li:text-slate-600">
                                <ReactMarkdown>{auditResult || ''}</ReactMarkdown>
                            </div>
                        </div>
                        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
                            <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                                <ClipboardList size={14}/> Sync to POAM
                            </button>
                            <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2">
                                <Save size={14}/> Save Analysis Report
                            </button>
                        </div>
                    </div>
                  )}
              </div>
          </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-center pb-8 shrink-0">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/50 border border-slate-800">
                <Shield size={14} className="text-blue-500" /> Professional Grade Auditor // {activeFrameworkId} ALIGNED
           </div>
      </div>
    </div>
  );
};
