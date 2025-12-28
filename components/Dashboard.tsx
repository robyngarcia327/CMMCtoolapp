
import React, { useState } from 'react';
import { Requirement, Artifact, Framework } from '../types';
import { ShieldCheck, AlertTriangle, Map, Sparkles, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { outlineRequirementsRoadmap } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface DashboardProps {
  requirements: Requirement[];
  artifacts: Artifact[];
  activeFramework: Framework;
}

export const Dashboard: React.FC<DashboardProps> = ({ requirements, artifacts, activeFramework }) => {
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  // Stats Logic
  const activeReqs = requirements.filter(r => r.framework === activeFramework.id);
  const totalReqs = activeReqs.length || 1;
  
  const getReqStatus = (req: Requirement) => {
    const statuses = req.objectives.map(o => o.status);
    if (statuses.some(s => s === 'not_met')) return 'not_met';
    if (statuses.every(s => s === 'met' || s === 'na')) return 'met';
    return 'pending';
  };

  const metReqs = activeReqs.filter(r => getReqStatus(r) === 'met').length;
  const gapsReqs = activeReqs.filter(r => getReqStatus(r) === 'not_met').length;
  const pendingReqs = activeReqs.filter(r => getReqStatus(r) === 'pending').length;
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
        {/* Simple Clean Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mission Control</h1>
                <p className="text-slate-500 mt-1 font-medium">{activeFramework.name} Portfolio</p>
            </div>
            
            <button 
                onClick={handleGenerateRoadmap}
                disabled={isGeneratingRoadmap}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
                {isGeneratingRoadmap ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                Generate AI Roadmap
            </button>
        </div>

        {/* High-Level KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Posture Score</h3>
                <div className="text-5xl font-black text-slate-900">{complianceScore}%</div>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${complianceScore}%` }}></div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Met Controls</h3>
                <div className="text-4xl font-black text-green-600">{metReqs}</div>
                <p className="text-xs text-slate-500 mt-2">Validated & Secured</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Open Gaps</h3>
                <div className="text-4xl font-black text-red-600">{gapsReqs}</div>
                <p className="text-xs text-slate-500 mt-2">Remediation Needed</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Evidence Repository</h3>
                <div className="text-4xl font-black text-blue-600">{artifacts.length}</div>
                <p className="text-xs text-slate-500 mt-2">Secure Artifacts</p>
            </div>
        </div>

        {/* AI Roadmap (Expands when generated) */}
        {roadmap && (
            <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 animate-in fade-in slide-in-from-top-4 duration-500 relative">
                <button onClick={() => setRoadmap(null)} className="absolute top-4 right-6 text-slate-300 hover:text-slate-500 font-bold text-xs uppercase tracking-widest">Dismiss</button>
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

        {/* Action Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between h-56 group cursor-pointer hover:bg-slate-800 transition-colors">
                <div>
                    <h3 className="text-xl font-black mb-2 flex items-center gap-2">Assessment Hub <ChevronRight className="text-blue-500 group-hover:translate-x-1 transition-transform" /></h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        You have <span className="text-white font-bold">{pendingReqs} controls</span> currently awaiting implementation or review.
                    </p>
                </div>
                <div className="text-xs font-bold text-blue-400 tracking-widest uppercase">Start Remediation →</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between h-56 shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Evidence Health</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Validation coverage: <span className="font-bold text-slate-900">{metReqs} / {totalReqs}</span> controls successfully linked to evidence artifacts.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-50 px-4 py-2 rounded-xl text-center flex-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase">Satisfied</div>
                        <div className="text-xl font-black text-slate-900">{metReqs}</div>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl text-center flex-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase">Coverage</div>
                        <div className="text-xl font-black text-slate-900">{complianceScore}%</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Guidance Footer */}
        <div className="pt-8 border-t border-slate-100 flex justify-center">
            <p className="text-slate-400 text-xs font-medium flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" /> Need help outlining requirements? Use the <span className="text-slate-900 font-bold">Requirement Detail</span> view or the <span className="text-blue-600 font-bold underline cursor-pointer">AI Assistant</span>.
            </p>
        </div>
    </div>
  );
};
