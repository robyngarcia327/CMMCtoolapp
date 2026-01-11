import React, { useState } from 'react';
import { Requirement, Artifact, Framework, AppView } from '../types';
import { ShieldCheck, AlertTriangle, Map, Sparkles, Loader2, CheckCircle2, ChevronRight, Target, Shield, Info } from 'lucide-react';
import { outlineRequirementsRoadmap } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface DashboardProps {
  requirements: Requirement[];
  artifacts: Artifact[];
  activeFramework: Framework;
  targetLevel: 1 | 2 | 3;
  onUpdateLevel: (level: 1 | 2 | 3) => void;
  onNavigate: (view: AppView) => void;
  onToggleChat: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  requirements, 
  artifacts, 
  activeFramework, 
  targetLevel,
  onUpdateLevel,
  onNavigate,
  onToggleChat
}) => {
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  // Stats Logic - Filtered by Level
  const activeReqs = requirements.filter(r => 
    r.framework === activeFramework.id && r.cmmcLevel <= targetLevel
  );
  
  const totalReqs = activeReqs.length || 1;
  
  const getReqStatus = (req: Requirement) => {
    const statuses = req.objectives.map(o => o.status);
    if (statuses.some(s => s === 'not_met')) return 'not_met';
    if (statuses.every(s => s === 'met' || s === 'na')) return 'met';
    return 'pending';
  };

  const metReqs = activeReqs.filter(r => getReqStatus(r) === 'met').length;
  const gapsReqs = activeReqs.filter(r => getReqStatus(r) === 'not_met').length;
  const pendingReqs = activeReqs.length - metReqs - gapsReqs;
  const complianceScore = Math.round((metReqs / totalReqs) * 100);

  const handleGenerateRoadmap = async () => {
      setIsGeneratingRoadmap(true);
      try {
        const res = await outlineRequirementsRoadmap(activeReqs);
        setRoadmap(res);
      } finally {
        setIsGeneratingRoadmap(false);
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto h-full">
        
        {/* Scoping Quick-Switch Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group hover:rotate-0 transition-transform">
                    <Target size={32} className="text-blue-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Mission Control</h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                        Scoped Level: <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-blue-200">CMMC Level {targetLevel}</span>
                    </p>
                </div>
             </div>

             <div className="flex flex-col gap-2 relative z-10 w-full md:w-auto">
                 <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                    {[1, 2, 3].map((lvl) => (
                        <button 
                            key={lvl}
                            onClick={() => onUpdateLevel(lvl as 1 | 2 | 3)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                targetLevel === lvl ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Level {lvl}
                        </button>
                    ))}
                 </div>
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center px-4">
                     {targetLevel === 1 ? '17 PRACTICES // FCI DATA' : targetLevel === 2 ? '110 PRACTICES // CUI DATA' : '110+ PRACTICES // EXPERT'}
                 </div>
             </div>
        </div>

        {/* High-Level KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <button 
              onClick={() => onNavigate(AppView.REPORT_EXECUTIVE)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left relative overflow-hidden group hover:border-blue-300 transition-all"
            >
                <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Posture Score</h3>
                <div className="text-5xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{complianceScore}%</div>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${complianceScore}%` }}></div>
                </div>
            </button>

            <button 
              onClick={() => onNavigate(AppView.CONTROLS)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left hover:border-green-300 transition-all group"
            >
                <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Met Controls</h3>
                <div className="text-4xl font-black text-green-600">{metReqs}</div>
                <p className="text-xs text-slate-500 mt-2">Validated & Secured</p>
            </button>

            <button 
              onClick={() => onNavigate(AppView.CONTROLS)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left hover:border-red-300 transition-all group"
            >
                <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Open Gaps</h3>
                <div className="text-4xl font-black text-red-600">{gapsReqs}</div>
                <p className="text-xs text-slate-500 mt-2">Remediation Needed</p>
            </button>

            <button 
              onClick={() => onNavigate(AppView.ASSETS)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left hover:border-indigo-300 transition-all group"
            >
                <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Evidence Repository</h3>
                <div className="text-4xl font-black text-blue-600">{artifacts.length}</div>
                <p className="text-xs text-slate-500 mt-2">Secure Artifacts</p>
            </button>
        </div>

        {/* AI Roadmap (Expands when generated) */}
        {roadmap && (
            <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 animate-in fade-in slide-in-from-top-4 duration-500 relative shadow-xl">
                <button onClick={() => setRoadmap(null)} className="absolute top-4 right-6 text-slate-300 hover:text-slate-500 font-bold text-xs uppercase tracking-widest transition-colors">Dismiss</button>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200"><Map size={24} /></div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 leading-tight">Remediation Roadmap</h2>
                        <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">AI Strategic Priority Outline</p>
                    </div>
                </div>
                <div className="prose prose-slate prose-sm max-w-none prose-p:text-slate-600 prose-headings:text-slate-800 prose-strong:text-slate-900 border-t border-slate-50 pt-6">
                    <ReactMarkdown>{roadmap}</ReactMarkdown>
                </div>
            </div>
        )}

        <div className="flex justify-center">
             <button 
                onClick={handleGenerateRoadmap}
                disabled={isGeneratingRoadmap}
                className="bg-slate-900 hover:bg-black text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl transition-all hover:scale-105 disabled:opacity-50"
            >
                {isGeneratingRoadmap ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <Sparkles size={18} className="text-blue-500" />}
                Generate Level {targetLevel} Remediation Roadmap
            </button>
        </div>

        {/* Action Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <button 
              onClick={() => onNavigate(AppView.CONTROLS)}
              className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between h-56 text-left group transition-all hover:scale-[1.02] shadow-xl hover:bg-slate-800"
            >
                <div>
                    <h3 className="text-xl font-black mb-2 flex items-center gap-2">Assessment Hub <ChevronRight className="text-blue-500 group-hover:translate-x-1 transition-transform" /></h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                        You have <span className="text-white font-bold">{pendingReqs + gapsReqs} controls</span> currently awaiting review for Level {targetLevel}.
                    </p>
                </div>
                <div className="text-xs font-bold text-blue-400 tracking-widest uppercase flex items-center gap-2">
                    Start Remediation <ChevronRight size={14} />
                </div>
            </button>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col justify-between h-56 shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Control Health</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Level {targetLevel} coverage: <span className="font-bold text-slate-900">{metReqs} / {totalReqs}</span> requirements verified with technical evidence.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl text-center flex-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Satisfied</div>
                        <div className="text-xl font-black text-slate-900">{metReqs}</div>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl text-center flex-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                        <div className="text-xl font-black text-slate-900">{complianceScore}%</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};