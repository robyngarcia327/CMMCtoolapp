
import React, { useState, useMemo, useEffect } from 'react';
import { Risk, FairFactors, OrganizationFinancials } from '../types';
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
  ArrowDownCircle,
  BarChart3,
  DollarSign,
  Briefcase,
  History,
  Calculator,
  RefreshCw,
  LayoutGrid,
  // Added missing Save import
  Save
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface FairRiskAnalyzerProps {
  risks: Risk[];
  financials: OrganizationFinancials;
  onUpdateRisk: (risk: Risk) => void;
}

export const FairRiskAnalyzer: React.FC<FairRiskAnalyzerProps> = ({ risks, financials, onUpdateRisk }) => {
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Modeling Exercise State
  const [modelingTef, setModelingTef] = useState<number>(1);
  const [modelingVuln, setModelingVuln] = useState<number>(0.5);
  const [modelingPrimary, setModelingPrimary] = useState<number>(10000);
  const [modelingSecondary, setModelingSecondary] = useState<number>(50000);

  const selectedRisk = risks.find(r => r.id === selectedRiskId);

  useEffect(() => {
    if (selectedRisk && selectedRisk.fairData) {
        setModelingTef(selectedRisk.fairData.tef);
        setModelingVuln(selectedRisk.fairData.vulnerability);
        setModelingPrimary(selectedRisk.fairData.primaryLossPerEvent);
        setModelingSecondary(selectedRisk.fairData.secondaryLossPerEvent);
    }
  }, [selectedRiskId]);

  const calculatedAle = useMemo(() => {
    // ALE = (TEF * V) * (Primary Loss + Secondary Loss)
    return Math.round((modelingTef * modelingVuln) * (modelingPrimary + modelingSecondary));
  }, [modelingTef, modelingVuln, modelingPrimary, modelingSecondary]);

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

  const handleCommitModel = () => {
    if (!selectedRisk) return;
    const updatedRisk: Risk = {
        ...selectedRisk,
        fairData: {
            tef: modelingTef,
            vulnerability: modelingVuln,
            primaryLossPerEvent: modelingPrimary,
            secondaryLossPerEvent: modelingSecondary,
            ale: calculatedAle
        }
    };
    onUpdateRisk(updatedRisk);
    alert("Modeling exercise committed to Risk Register.");
  };

  const FactorInput = ({ label, value, min, max, step, onChange, desc, icon: Icon }: any) => (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm"><Icon size={16} className="text-blue-500" /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</h4>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
                {step < 1 ? `${(value * 100).toFixed(0)}%` : value.toLocaleString()}
            </div>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{desc}</p>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={e => onChange(Number(e.target.value))}
            className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
        />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-8 h-full flex flex-col space-y-8 overflow-y-auto bg-slate-50/50">
      {/* Header */}
      <div className="flex justify-between items-end bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
         <div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                <ShieldAlert size={14}/> Quantitative Risk Modeling
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">FAIR Analyzer</h1>
            <p className="text-slate-500 font-medium mt-3 max-w-xl leading-relaxed">
                Decompose subjective risk into monetary variables. Use your organization's financial baseline to prioritize investments.
            </p>
         </div>
         <select 
            className="bg-slate-900 text-white rounded-2xl px-8 py-4 font-black text-xs uppercase tracking-widest shadow-2xl focus:ring-4 focus:ring-blue-500/20 outline-none border-none"
            value={selectedRiskId || ''}
            onChange={e => setSelectedRiskId(e.target.value)}
          >
            <option value="">Select Risk Scenario...</option>
            {risks.map(r => <option key={r.id} value={r.id}>{r.riskNumber}: {r.riskTitle}</option>)}
          </select>
      </div>

      {!selectedRisk ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-20 border-4 border-dashed border-slate-200 rounded-[3.5rem] bg-white/50">
              <div className="p-8 bg-white rounded-full shadow-lg mb-8"><Target size={80} className="opacity-10" /></div>
              <p className="text-2xl font-black uppercase tracking-tighter text-slate-400">Identify a Scenario to Model</p>
              <p className="mt-2 font-medium">Quantify your risk registry in dollar values.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* LEFT: Modeling Workbench */}
              <div className="lg:col-span-8 space-y-8">
                  <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-12">
                      <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-8">
                           <div className="flex items-center gap-6">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl"><Calculator size={28}/></div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{selectedRisk.riskTitle}</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Quantitative Modeling Exercise</p>
                                </div>
                           </div>
                           <div className="text-right">
                               <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Projected ALE</div>
                               <div className="text-4xl font-black text-blue-600 font-mono tracking-tighter">${calculatedAle.toLocaleString()}</div>
                           </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <FactorInput 
                            label="Threat Event Frequency (TEF)" 
                            value={modelingTef} 
                            min={0} max={365} step={1}
                            onChange={setModelingTef}
                            icon={Activity}
                            desc="How many times per year do you expect this threat agent to attempt to cause harm?"
                          />
                          <FactorInput 
                            label="Vulnerability (V)" 
                            value={modelingVuln} 
                            min={0} max={1} step={0.05}
                            onChange={setModelingVuln}
                            icon={ShieldAlert}
                            desc="Probability that the threat event results in a successful loss event (Control Effectiveness)."
                          />
                          <FactorInput 
                            label="Primary Loss Magnitude" 
                            value={modelingPrimary} 
                            min={0} max={financials.annualRevenue * 0.1} step={1000}
                            onChange={setModelingPrimary}
                            icon={DollarSign}
                            desc="Immediate operational cost: Outage time x Labor rate x Impacted staff."
                          />
                          <FactorInput 
                            label="Secondary Loss Magnitude" 
                            value={modelingSecondary} 
                            min={0} max={financials.brandValueEstimate} step={5000}
                            onChange={setModelingSecondary}
                            icon={TrendingUp}
                            desc="Long-term costs: Legal fines, reputational damage, and customer churn."
                          />
                      </div>

                      <div className="mt-12 flex gap-4">
                          <button 
                            onClick={handleCommitModel}
                            className="flex-1 bg-slate-900 hover:bg-black text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3"
                          >
                              <Save size={18}/> Commit Model to Register
                          </button>
                          <button 
                            onClick={() => setAiAnalysis(null)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all"
                          >
                              Reset Exercise
                          </button>
                      </div>
                  </div>
              </div>

              {/* RIGHT: AI Context & Insights */}
              <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                      <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tight uppercase">
                        <Sparkles size={24} className="text-blue-500" /> AI Modeler
                      </h3>
                      {!aiAnalysis ? (
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
                                "Our AI can estimate these values based on industry benchmarks and your unique financial profile."
                            </div>
                            <button 
                                onClick={handleAiAnalyze}
                                disabled={isAnalyzing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} />}
                                {isAnalyzing ? 'Analyzing Risk Profile...' : 'Get AI Estimates'}
                            </button>
                        </div>
                      ) : (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="prose prose-sm max-w-none prose-p:text-slate-600 prose-headings:text-slate-900 prose-headings:font-black border-t border-slate-50 pt-6">
                                <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                            </div>
                            <button 
                                onClick={() => setAiAnalysis(null)}
                                className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest"
                            >
                                Clear Analysis <RefreshCw size={14} />
                            </button>
                        </div>
                      )}
                  </div>

                  <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6">Financial Strategy Tip</h4>
                      <p className="text-sm font-medium leading-relaxed mb-8 opacity-80 italic">
                        "Investing in controls that reduce Vulnerability (V) is often more cost-effective than attempting to change external Threat Event Frequency (TEF)."
                      </p>
                      <div className="flex items-center gap-3 text-xs font-black uppercase bg-white/5 border border-white/10 p-4 rounded-2xl">
                        <CheckCircle2 size={18} className="text-green-400" /> ALE Goal: Below 1% of Revenue
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
