import React, { useState } from 'react';
import { Risk, FairFactors } from '../types';
import { analyzeRiskWithFair } from '../services/gemini';
import { 
  ShieldAlert, 
  ChevronDown, 
  TrendingUp, 
  Target, 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Loader2,
  Sparkles,
  ArrowDownCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface FairRiskAnalyzerProps {
  risks: Risk[];
  onUpdateRisk: (risk: Risk) => void;
}

export const FairRiskAnalyzer: React.FC<FairRiskAnalyzerProps> = ({ risks, onUpdateRisk }) => {
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedRisk = risks.find(r => r.id === selectedRiskId);

  const handleAiAnalyze = async () => {
    if (!selectedRisk) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeRiskWithFair(selectedRisk);
      setAiAnalysis(result);
    } catch (e) {
      alert("AI analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const FactorCard = ({ title, value, icon: Icon, colorClass, children }: any) => (
    <div className={`bg-white rounded-2xl border-2 p-6 transition-all shadow-sm ${colorClass} group`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 group-hover:scale-110 transition-transform">
            <Icon size={18} />
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h4>
        </div>
        <div className="text-xs font-black text-slate-900">{value}</div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-8 h-full flex flex-col space-y-8 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-end bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
         <div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <ShieldAlert size={14}/> Quantitative Intelligence
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">FAIR Model Analysis</h1>
            <p className="text-slate-500 font-medium mt-1">Decompose risk into measurable factors for accurate decision-making.</p>
         </div>
         <select 
            className="bg-slate-900 text-white rounded-xl px-6 py-3 font-bold text-sm shadow-xl focus:ring-4 focus:ring-blue-500/20 outline-none border-none"
            value={selectedRiskId || ''}
            onChange={e => setSelectedRiskId(e.target.value)}
          >
            <option value="">Select Risk Scenario...</option>
            {risks.map(r => <option key={r.id} value={r.id}>{r.riskNumber}: {r.riskTitle}</option>)}
          </select>
      </div>

      {!selectedRisk ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-20 border-4 border-dashed border-slate-200 rounded-[3rem]">
              <Target size={64} className="mb-6 opacity-10" />
              <p className="text-xl font-black uppercase tracking-widest text-slate-400">Select a scenario to begin FAIR modeling</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Risk Hierarchy Dashboard */}
              <div className="lg:col-span-8 space-y-8">
                  
                  {/* Top Level: RISK */}
                  <div className="flex justify-center relative">
                      <div className="absolute top-full left-1/2 w-0.5 h-8 bg-slate-200 -z-10"></div>
                      <div className="bg-slate-900 text-white p-8 rounded-[2rem] w-full max-w-sm text-center shadow-2xl">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-blue-400">Primary Risk</h3>
                          <div className="text-2xl font-black uppercase tracking-tight">{selectedRisk.riskTitle}</div>
                          <div className="mt-4 flex items-center justify-center gap-2">
                              <span className="bg-red-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">ALE: ${selectedRisk.fairData?.ale.toLocaleString() || 'TBD'}</span>
                          </div>
                      </div>
                  </div>

                  {/* Level 2: Frequency & Magnitude */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative pt-8">
                      <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-200 -z-10"></div>
                      <div className="absolute top-0 left-1/4 w-0.5 h-8 bg-slate-200 -z-10"></div>
                      <div className="absolute top-0 right-1/4 w-0.5 h-8 bg-slate-200 -z-10"></div>
                      
                      <FactorCard title="Loss Event Frequency" value="Probable" icon={TrendingUp} colorClass="border-blue-100 hover:border-blue-400">
                          <p className="text-xs text-slate-500 mb-4">How often losses occur from this threat agent.</p>
                          <div className="space-y-3">
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Threat Event Freq</span>
                                  <span className="text-xs font-black text-blue-600">Daily</span>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vulnerability</span>
                                  <span className="text-xs font-black text-red-600">85%</span>
                              </div>
                          </div>
                      </FactorCard>

                      <FactorCard title="Loss Magnitude" value="Critical" icon={Activity} colorClass="border-indigo-100 hover:border-indigo-400">
                          <p className="text-xs text-slate-500 mb-4">The probable financial loss when an event occurs.</p>
                          <div className="space-y-3">
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Loss</span>
                                  <span className="text-xs font-black text-slate-900">$25k</span>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secondary Loss</span>
                                  <span className="text-xs font-black text-red-600">$150k</span>
                              </div>
                          </div>
                      </FactorCard>
                  </div>

                  {/* Level 3: Deep Factors */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Contact Freq', value: 'High', icon: Zap },
                        { label: 'Prob of Action', value: '75%', icon: AlertTriangle },
                        { label: 'Threat Capability', value: 'Adv', icon: ShieldAlert },
                        { label: 'Resistance Str', value: 'Low', icon: Target },
                      ].map((factor, i) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
                            <factor.icon size={16} className="text-slate-400 mb-2" />
                            <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">{factor.label}</div>
                            <div className="text-xs font-black text-slate-900">{factor.value}</div>
                        </div>
                      ))}
                  </div>
              </div>

              {/* Sidebar: AI Analysis & Controls */}
              <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
                        <Sparkles size={20} className="text-blue-500" /> FAIR Intelligence
                      </h3>
                      {!aiAnalysis ? (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                Analyze this scenario against your current CMMC posture to identify "Resistance Strength" gaps.
                            </p>
                            <button 
                                onClick={handleAiAnalyze}
                                disabled={isAnalyzing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
                            >
                                {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} />}
                                {isAnalyzing ? 'Modeling Loss Factors...' : 'Run Quantitative Analysis'}
                            </button>
                        </div>
                      ) : (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-li:text-slate-600">
                                <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                            </div>
                            <button 
                                onClick={() => setAiAnalysis(null)}
                                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest"
                            >
                                Re-analyze Scenario <ChevronRight size={14} />
                            </button>
                        </div>
                      )}
                  </div>

                  <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-4">Loss Mitigation Tip</h4>
                      <p className="text-sm font-medium leading-relaxed mb-6 opacity-80">
                        Focusing on <strong>Resistance Strength</strong> (technical controls) reduces the "Loss Event Frequency" without requiring external changes to the threat landscape.
                      </p>
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-white bg-white/10 p-3 rounded-xl border border-white/10">
                        <CheckCircle2 size={14} className="text-blue-400" /> Scoped Level {selectedRisk.inherentRiskRating}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};