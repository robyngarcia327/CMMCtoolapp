
import React, { useState, useRef, useMemo } from 'react';
import { Risk, OrganizationFinancials } from '../types';
import { 
    AlertTriangle, Plus, Trash2, Save, Download, Filter, Search, 
    ChevronDown, CheckCircle2, ShieldAlert, FileSpreadsheet, Upload, 
    Zap, Activity, Info, BarChart3, DollarSign, Wallet, ArrowUpRight,
    // Added missing Briefcase import
    Briefcase
} from 'lucide-react';
import { integrationService } from '../services/integrations';

interface RiskRegisterProps {
  risks: Risk[];
  financials: OrganizationFinancials;
  onAddRisk: (risk: Risk) => void;
  onUpdateRisk: (risk: Risk) => void;
  onDeleteRisk: (id: string) => void;
  onUpdateFinancials: (fin: OrganizationFinancials) => void;
}

const LIKELIHOOD_OPTIONS = ["Select ...", "1 - Remote", "2 - Unlikely", "3 - Possible", "4 - Probable", "5 - Almost Certain"];
const IMPACT_OPTIONS = ["Select ...", "1 - Low", "2 - Medium", "3 - High", "4 - Very High", "5 - Extreme"];
const RISK_RATING_OPTIONS = ["Select ...", "1 - Low", "2 - Medium", "3 - High", "4 - Critical"];

export const RiskRegister: React.FC<RiskRegisterProps> = ({ 
    risks, financials, onAddRisk, onUpdateRisk, onDeleteRisk, onUpdateFinancials 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showFinProfile, setShowFinProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'ALE' | 'RATING'>('RATING');
  
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    riskTier: 'Operational',
    riskCategory: 'Process',
    domainGrouping: '',
    riskNumber: '',
    riskTitle: '',
    riskOwner: 'CIO',
    deficiencyDescription: '',
    probableScenarios: 'N/A',
    likelihood: 'Select ...',
    impact: 'Select ...',
    inherentRiskRating: 'Select ...',
    businessDecision: 'Select ...',
    targetResidualRiskRating: 'Select ...',
    comments: '',
    status: 'Open'
  });

  const handleCreateRisk = () => {
    if (!newRisk.riskTitle) return;
    const risk: Risk = {
      ...newRisk as Risk,
      id: `R-${Date.now()}`,
      dateIdentified: Date.now(),
      status: 'Open',
      fairData: { tef: 1, vulnerability: 0.5, primaryLossPerEvent: 10000, secondaryLossPerEvent: 50000, ale: 30000 }
    };
    onAddRisk(risk);
    setIsAdding(false);
  };

  const sortedRisks = useMemo(() => {
    const list = [...risks].filter(r => 
        r.riskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.domainGrouping.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortBy === 'ALE') {
        return list.sort((a, b) => (b.fairData?.ale || 0) - (a.fairData?.ale || 0));
    }
    return list;
  }, [risks, searchTerm, sortBy]);

  const topRiskMonetary = useMemo(() => {
    return risks.reduce((prev, current) => ((prev.fairData?.ale || 0) > (current.fairData?.ale || 0)) ? prev : current, risks[0]);
  }, [risks]);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Financial Mission Bar */}
      <div className="bg-slate-900 px-8 py-4 flex justify-between items-center text-white shrink-0 shadow-xl z-30">
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Org Revenue</span>
                  <span className="font-mono font-bold text-sm text-white">${financials.annualRevenue.toLocaleString()}</span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aggregated ALE Risk</span>
                  <span className="font-mono font-bold text-sm text-emerald-400">${risks.reduce((sum, r) => sum + (r.fairData?.ale || 0), 0).toLocaleString()} / yr</span>
              </div>
          </div>
          <button 
            onClick={() => setShowFinProfile(!showFinProfile)}
            className="flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
          >
              <Settings2 size={12}/> {showFinProfile ? 'Close Profile' : 'Financial Profile'}
          </button>
      </div>

      {/* Financial Profile Editor (Slide down) */}
      {showFinProfile && (
          <div className="bg-white border-b border-slate-200 p-8 shadow-inner animate-in slide-in-from-top-4 duration-300 z-20">
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><DollarSign size={14}/> Revenue & Scale</h4>
                      <div className="space-y-3">
                          <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase">Annual Revenue ($)</label>
                              <input type="number" className="w-full border p-2 rounded-lg text-sm font-bold" value={financials.annualRevenue} onChange={e => onUpdateFinancials({...financials, annualRevenue: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase">Employee Count</label>
                              <input type="number" className="w-full border p-2 rounded-lg text-sm font-bold" value={financials.employeeCount} onChange={e => onUpdateFinancials({...financials, employeeCount: Number(e.target.value)})} />
                          </div>
                      </div>
                  </div>
                  <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Briefcase size={14}/> Operations Cost</h4>
                      <div className="space-y-3">
                          <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase">Avg Labor Rate ($/hr)</label>
                              <input type="number" className="w-full border p-2 rounded-lg text-sm font-bold" value={financials.avgHourlyLaborRate} onChange={e => onUpdateFinancials({...financials, avgHourlyLaborRate: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase">Brand Value Estimate ($)</label>
                              <input type="number" className="w-full border p-2 rounded-lg text-sm font-bold" value={financials.brandValueEstimate} onChange={e => onUpdateFinancials({...financials, brandValueEstimate: Number(e.target.value)})} />
                          </div>
                      </div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-center">
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Modeling Context</div>
                      <p className="text-xs text-blue-900 leading-relaxed font-medium">
                          These values are used as baselines during <strong>FAIR modeling exercises</strong> to calculate primary and secondary loss magnitude.
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* Main Controls */}
      <div className="p-8 shrink-0 bg-white border-b border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Global Risk Register</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">NIST 800-30 Taxonomy // Quantified by FAIR</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-64 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
               <button onClick={() => setSortBy('RATING')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'RATING' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Rating</button>
               <button onClick={() => setSortBy('ALE')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'ALE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Monetary Impact (ALE)</button>
          </div>

          <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">
             <Plus size={16} /> New Entry
          </button>
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500 border-b">
                <tr>
                    <th className="p-4 w-12 text-center">#</th>
                    <th className="p-4 w-48">Risk Statement</th>
                    <th className="p-4 text-center">Impact (CIA)</th>
                    <th className="p-4 text-right">Primary Loss (PL)</th>
                    <th className="p-4 text-right">Secondary Loss (SL)</th>
                    <th className="p-4 text-right bg-blue-50/50 text-blue-600">ALE (Annualized)</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 w-12"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {sortedRisks.map((risk, idx) => (
                    <tr key={risk.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 text-center font-black text-slate-300">{idx + 1}</td>
                        <td className="p-4">
                            <div className="font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{risk.riskTitle}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{risk.domainGrouping}</div>
                        </td>
                        <td className="p-4 text-center">
                            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-black border border-red-100 uppercase tracking-widest text-[9px]">{risk.impact}</span>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-slate-600">${risk.fairData?.primaryLossPerEvent.toLocaleString() || '0'}</td>
                        <td className="p-4 text-right font-mono font-bold text-slate-600">${risk.fairData?.secondaryLossPerEvent.toLocaleString() || '0'}</td>
                        <td className="p-4 text-right font-mono font-black text-blue-700 bg-blue-50/20 shadow-inner">
                            <div className="flex items-center justify-end gap-2">
                                <ArrowUpRight size={12} className={(risk.fairData?.ale || 0) > 100000 ? 'text-red-500' : 'text-blue-500'} />
                                ${risk.fairData?.ale.toLocaleString() || '0'}
                            </div>
                        </td>
                        <td className="p-4 text-center">
                             <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${risk.status === 'Open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                 {risk.status}
                             </span>
                        </td>
                        <td className="p-4 text-right">
                             <button onClick={() => onDeleteRisk(risk.id)} className="text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Monetary Risk Highlight (Focus) */}
      {topRiskMonetary && (
          <div className="px-8 pb-8 shrink-0">
              <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  <div className="flex gap-8 items-center relative z-10">
                      <div className="p-4 bg-red-600 rounded-2xl shadow-xl animate-pulse"><ShieldAlert size={32}/></div>
                      <div>
                          <div className="text-[10px] font-black text-blue-300 uppercase tracking-[0.4em] mb-2">Priority Monetary Target</div>
                          <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{topRiskMonetary.riskTitle}</h2>
                          <p className="text-blue-100 text-sm mt-2 opacity-80 max-w-xl">This risk represents the largest projected financial drain on the organization. Immediate remediation is suggested based on quantitative loss forecasting.</p>
                      </div>
                  </div>
                  <div className="text-right relative z-10">
                       <div className="text-[10px] font-black uppercase text-blue-300 tracking-widest mb-1">Estimated Annual Loss</div>
                       <div className="text-5xl font-black tracking-tighter">${topRiskMonetary.fairData?.ale.toLocaleString()}</div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const Settings2 = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
);
