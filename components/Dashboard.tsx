
import React, { useState } from 'react';
import { Requirement, Artifact, Framework } from '../types';
import { NIST_FAMILIES } from '../data/standards';
import { ShieldCheck, AlertTriangle, TrendingUp, Map, Sparkles, Loader2, FileText, CheckCircle2 } from 'lucide-react';
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

  // Filter requirements for current framework
  const activeReqs = requirements.filter(r => r.framework === activeFramework.id);
  const totalReqs = activeReqs.length;
  
  const getReqStatus = (req: Requirement) => {
    const statuses = req.objectives.map(o => o.status);
    if (statuses.some(s => s === 'not_met')) return 'not_met';
    if (statuses.every(s => s === 'met' || s === 'na')) return 'met';
    return 'pending';
  };

  const metReqs = activeReqs.filter(r => getReqStatus(r) === 'met').length;
  const gapsReqs = activeReqs.filter(r => getReqStatus(r) === 'not_met').length;
  const pendingReqs = activeReqs.filter(r => getReqStatus(r) === 'pending').length;
  
  const complianceScore = totalReqs > 0 ? Math.round((metReqs / totalReqs) * 100) : 0;

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
    <div className="p-8 max-w-7xl mx-auto space-y-10 overflow-y-auto h-full">
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mission Control</h1>
                <p className="text-slate-500 mt-2 font-medium">Compliance Posture: {activeFramework.name}</p>
            </div>
            
            <div className="flex gap-3">
                 <button 
                    onClick={handleGenerateRoadmap}
                    disabled={isGeneratingRoadmap}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                    {isGeneratingRoadmap ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {roadmap ? 'Update Roadmap' : 'Generate AI Roadmap'}
                </button>
            </div>
        </div>

        {/* Major KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldCheck size={80} />
                </div>
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Overall Score</h3>
                <div className="text-5xl font-black text-slate-900">{complianceScore}%</div>
                <div className="w-full bg-slate-100 h-2.5 mt-6 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out ${complianceScore > 80 ? 'bg-green-500' : complianceScore > 40 ? 'bg-blue-500' : 'bg-red-500'}`} 
                        style={{ width: `${complianceScore}%` }}
                    ></div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Met Controls</h3>
                    <div className="text-4xl font-black text-green-600">{metReqs}</div>
                </div>
                <p className="text-sm text-slate-500 font-medium">Verified implementation</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Open Gaps</h3>
                    <div className="text-4xl font-black text-red-600">{gapsReqs}</div>
                </div>
                <p className="text-sm text-slate-500 font-medium">Require remediation</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Evidence Files</h3>
                    <div className="text-4xl font-black text-indigo-600">{artifacts.length}</div>
                </div>
                <p className="text-sm text-slate-500 font-medium">Secured in repository</p>
            </div>
        </div>

        {/* Roadmap Feature (Expansion) */}
        {roadmap && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-[2.5rem] p-10 animate-in fade-in slide-in-from-top-4 duration-500 relative">
                <button 
                  onClick={() => setRoadmap(null)}
                  className="absolute top-6 right-8 text-indigo-400 hover:text-indigo-600 text-sm font-bold"
                >
                  Clear
                </button>
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200"><Map size={28} /></div>
                    <div>
                        <h2 className="text-2xl font-black text-indigo-900">Your Remediation Roadmap</h2>
                        <p className="text-indigo-700 font-medium opacity-75">AI-prioritized steps to achieve 100% compliance.</p>
                    </div>
                </div>
                <div className="prose prose-indigo max-w-none prose-p:text-indigo-800 prose-headings:text-indigo-900 prose-li:text-indigo-800 font-medium">
                    <ReactMarkdown>{roadmap}</ReactMarkdown>
                </div>
            </div>
        )}

        {/* Simple Progress Overview (Instead of exhausting family list) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-[2rem] p-10 text-white flex flex-col justify-between h-64">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                        <AlertTriangle className="text-amber-400" /> Assessment Status
                    </h3>
                    <p className="text-slate-400 text-sm">
                        You have <span className="text-white font-bold">{pendingReqs}</span> controls currently in review or waiting for input.
                    </p>
                </div>
                <button 
                  onClick={() => {}} // Could trigger navigation to Requirements
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl font-bold transition-all text-sm"
                >
                    Continue Assessment
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 flex flex-col justify-between h-64 shadow-sm">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-slate-800">
                        <CheckCircle2 className="text-green-500" /> Evidence Health
                    </h3>
                    <p className="text-slate-500 text-sm">
                        Total coverage: <span className="text-slate-900 font-bold">{metReqs} out of {totalReqs}</span> controls have been successfully satisfied with evidence.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 bg-slate-100 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Satisfied</div>
                        <div className="text-2xl font-black text-slate-900">{metReqs}</div>
                    </div>
                    <div className="flex-1 bg-slate-100 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Coverage</div>
                        <div className="text-2xl font-black text-slate-900">{complianceScore}%</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer help */}
        <div className="text-center pt-10 border-t border-slate-100">
            <p className="text-slate-400 text-sm font-medium">
                Need help outlining requirements? Use the <span className="text-indigo-600">Outline Requirements</span> tool or ask the <span className="text-indigo-600">AI Assistant</span>.
            </p>
        </div>
    </div>
  );
};
