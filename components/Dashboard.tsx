
import React, { useState } from 'react';
import { Requirement, Artifact, Framework } from '../types';
import { NIST_FAMILIES, NIST_CSF_FUNCTIONS } from '../data/standards';
import { PieChart, ShieldCheck, AlertTriangle, FileText, TrendingUp, Layers, Map, Sparkles, Loader2 } from 'lucide-react';
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
  const totalReqs = activeReqs.length;
  
  const getReqStatus = (req: Requirement) => {
    const statuses = req.objectives.map(o => o.status);
    if (statuses.some(s => s === 'not_met')) return 'not_met';
    if (statuses.every(s => s === 'met' || s === 'na')) return 'met';
    return 'pending';
  };

  const metReqs = activeReqs.filter(r => getReqStatus(r) === 'met').length;
  const notMetReqs = activeReqs.filter(r => getReqStatus(r) === 'not_met').length;
  const complianceScore = totalReqs > 0 ? Math.round((metReqs / totalReqs) * 100) : 0;

  const handleGenerateRoadmap = async () => {
      setIsGeneratingRoadmap(true);
      const res = await outlineRequirementsRoadmap(activeReqs);
      setRoadmap(res);
      setIsGeneratingRoadmap(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 overflow-y-auto h-full">
        {/* Header */}
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Compliance Posture</h1>
                <p className="text-slate-600">Overview for {activeFramework.name}</p>
            </div>
            <button 
                onClick={handleGenerateRoadmap}
                disabled={isGeneratingRoadmap}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all"
            >
                {isGeneratingRoadmap ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                Outline My Roadmap
            </button>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 font-medium text-sm uppercase mb-4">Score</h3>
                <div className="text-4xl font-black text-slate-900">{complianceScore}%</div>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${complianceScore}%` }}></div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 font-medium text-sm uppercase mb-4">Met</h3>
                <div className="text-4xl font-black text-green-600">{metReqs}</div>
                <p className="text-xs text-slate-400 mt-2">Verified controls</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 font-medium text-sm uppercase mb-4">Gaps</h3>
                <div className="text-4xl font-black text-red-600">{notMetReqs}</div>
                <p className="text-xs text-slate-400 mt-2">Action required</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 font-medium text-sm uppercase mb-4">Evidence</h3>
                <div className="text-4xl font-black text-blue-600">{artifacts.length}</div>
                <p className="text-xs text-slate-400 mt-2">Uploaded artifacts</p>
            </div>
        </div>

        {/* AI Roadmap Section */}
        {roadmap && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-8 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white"><Map size={24} /></div>
                    <h2 className="text-2xl font-bold text-indigo-900">Requirement Roadmap</h2>
                </div>
                <div className="prose prose-indigo max-w-none prose-p:text-indigo-800 prose-headings:text-indigo-900 prose-li:text-indigo-800">
                    <ReactMarkdown>{roadmap}</ReactMarkdown>
                </div>
            </div>
        )}

        {/* Breakdown by Domain */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" /> Progress by Family
            </h3>
            <div className="space-y-6">
                {NIST_FAMILIES.filter(f => activeReqs.some(r => r.family === f.id)).map(f => {
                    const familyReqs = activeReqs.filter(r => r.family === f.id);
                    const met = familyReqs.filter(r => getReqStatus(r) === 'met').length;
                    const percent = Math.round((met / familyReqs.length) * 100);
                    return (
                        <div key={f.id} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-slate-700 flex items-center gap-2">
                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">{f.id}</span>
                                    {f.name}
                                </span>
                                <span className="text-sm font-bold text-slate-900">{met} / {familyReqs.length} ({percent}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${percent === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};
