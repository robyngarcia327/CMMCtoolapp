
import React, { useState } from 'react';
import { Risk, RiskProfileVersion } from '../types';
import { AlertTriangle, Plus, Save, Clock, Trash2, History, ChevronRight, DollarSign, Calculator, Hammer, HardDrive, UserCheck } from 'lucide-react';

interface RiskRegisterProps {
  risks: Risk[];
  onAddRisk: (risk: Risk) => void;
  onUpdateRisk: (risk: Risk) => void;
  onDeleteRisk: (id: string) => void;
}

export const RiskRegister: React.FC<RiskRegisterProps> = ({ risks, onAddRisk, onUpdateRisk, onDeleteRisk }) => {
  const [view, setView] = useState<'current' | 'history'>('current');
  const [versions, setVersions] = useState<RiskProfileVersion[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
      likelihood: 3,
      impact: 3,
      status: 'Open',
      category: 'Technical',
      assessmentType: 'Quantitative',
      threatEventFrequency: 1,
      vulnerability: 0.5,
      lossMagnitude: 10000,
      laborHours: 0,
      hourlyRate: 150,
      equipmentCost: 0,
      assessorFee: 0
  });

  const totalExposure = risks.reduce((sum, r) => (r.status === 'Open' ? sum + (r.riskScore || 0) : sum), 0);
  
  const totalRemediationCost = risks.reduce((sum, r) => {
      const labor = (r.laborHours || 0) * (r.hourlyRate || 0);
      const equip = r.equipmentCost || 0;
      const assessor = r.assessorFee || 0;
      return sum + labor + equip + assessor;
  }, 0);

  const calculateAle = (tef: number, vuln: number, loss: number) => tef * vuln * loss;

  const handleCreateRisk = () => {
      if (!newRisk.description || !newRisk.owner) return;
      
      let calculatedScore = 0;
      if (newRisk.assessmentType === 'Quantitative') {
          calculatedScore = calculateAle(
              newRisk.threatEventFrequency || 0,
              newRisk.vulnerability || 0,
              newRisk.lossMagnitude || 0
          );
      } else {
          calculatedScore = (newRisk.likelihood || 1) * (newRisk.impact || 1);
      }

      const risk: Risk = {
          id: `R-${Math.floor(1000 + Math.random() * 9000)}`,
          description: newRisk.description,
          category: newRisk.category as any,
          remediation: newRisk.remediation || '',
          owner: newRisk.owner,
          status: newRisk.status as any,
          dateIdentified: Date.now(),
          assessmentType: newRisk.assessmentType as any,
          threatEventFrequency: newRisk.threatEventFrequency,
          vulnerability: newRisk.vulnerability,
          lossMagnitude: newRisk.lossMagnitude,
          likelihood: newRisk.likelihood as any,
          impact: newRisk.impact as any,
          riskScore: calculatedScore,
          laborHours: newRisk.laborHours,
          hourlyRate: newRisk.hourlyRate,
          equipmentCost: newRisk.equipmentCost,
          assessorFee: newRisk.assessorFee
      };
      onAddRisk(risk);
      setIsAdding(false);
      setNewRisk({ 
        likelihood: 3, impact: 3, status: 'Open', category: 'Technical', description: '', owner: '', remediation: '',
        assessmentType: 'Quantitative', threatEventFrequency: 1, vulnerability: 0.5, lossMagnitude: 10000,
        laborHours: 0, hourlyRate: 150, equipmentCost: 0, assessorFee: 0
      });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" /> Risk Management
            </h2>
            <p className="text-slate-600">FAIR Analysis & Cost-to-Compliance Forecasting.</p>
        </div>
        <div className="flex gap-2">
             <button onClick={() => setView('history')} className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-slate-600 border border-slate-300 flex items-center gap-2">
                <History size={16} /> History
            </button>
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                <Plus size={16} /> Add Entry
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Annual Exposure</div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExposure)}</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Est. Compliance Cost</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalRemediationCost)}</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Labor Commitment</div>
                <div className="text-2xl font-bold text-slate-900">{risks.reduce((sum,r)=>sum+(r.laborHours||0),0)} hrs</div>
            </div>
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Open Gaps</div>
                <div className="text-2xl font-bold text-amber-600">{risks.filter(r => r.status === 'Open').length}</div>
            </div>
      </div>

      {isAdding && (
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4">
              <h3 className="font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3">
                  <Calculator size={24} className="text-blue-600"/> Assessment & Budgeting
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                      <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Requirement / Risk Context</label>
                            <input className="w-full border-2 border-slate-100 p-3 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold" placeholder="e.g. FIPS 140-3 Cryptography implementation gap" value={newRisk.description} onChange={e => setNewRisk({...newRisk, description: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Owner</label>
                                <input className="w-full border-2 border-slate-100 p-3 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all" value={newRisk.owner} onChange={e => setNewRisk({...newRisk, owner: e.target.value})} />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                                <select className="w-full border-2 border-slate-100 p-3 rounded-xl outline-none" value={newRisk.category} onChange={e => setNewRisk({...newRisk, category: e.target.value as any})}>
                                    <option>Technical</option>
                                    <option>Administrative</option>
                                    <option>Physical</option>
                                </select>
                              </div>
                          </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><DollarSign size={14} className="text-green-600"/> Compliance Cost Forecast</h4>
                          <div className="grid grid-cols-2 gap-4">
                               <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Labor (Hours)</label>
                                    <div className="relative">
                                        <Hammer size={14} className="absolute left-3 top-3.5 text-slate-400"/>
                                        <input type="number" className="w-full border p-3 pl-10 rounded-xl" value={newRisk.laborHours} onChange={e=>setNewRisk({...newRisk, laborHours: parseFloat(e.target.value)})} />
                                    </div>
                               </div>
                               <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Rate ($/hr)</label>
                                    <input type="number" className="w-full border p-3 rounded-xl" value={newRisk.hourlyRate} onChange={e=>setNewRisk({...newRisk, hourlyRate: parseFloat(e.target.value)})} />
                               </div>
                               <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Equipment Cost</label>
                                    <div className="relative">
                                        <HardDrive size={14} className="absolute left-3 top-3.5 text-slate-400"/>
                                        <input type="number" className="w-full border p-3 pl-10 rounded-xl" value={newRisk.equipmentCost} onChange={e=>setNewRisk({...newRisk, equipmentCost: parseFloat(e.target.value)})} />
                                    </div>
                               </div>
                               <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Assessor Fee</label>
                                    <div className="relative">
                                        <UserCheck size={14} className="absolute left-3 top-3.5 text-slate-400"/>
                                        <input type="number" className="w-full border p-3 pl-10 rounded-xl" value={newRisk.assessorFee} onChange={e=>setNewRisk({...newRisk, assessorFee: parseFloat(e.target.value)})} />
                                    </div>
                               </div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="bg-indigo-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                          <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-4">FAIR Exposure Analysis</h4>
                          <div className="space-y-4">
                               <div>
                                   <div className="flex justify-between text-[10px] font-bold mb-1"><span>Threat Event Frequency</span><span>{newRisk.threatEventFrequency} /yr</span></div>
                                   <input type="range" min="0" max="100" step="1" className="w-full accent-blue-500" value={newRisk.threatEventFrequency} onChange={e=>setNewRisk({...newRisk, threatEventFrequency: parseFloat(e.target.value)})} />
                               </div>
                               <div>
                                   <div className="flex justify-between text-[10px] font-bold mb-1"><span>Vulnerability (%)</span><span>{Math.round((newRisk.vulnerability||0)*100)}%</span></div>
                                   <input type="range" min="0" max="1" step="0.01" className="w-full accent-blue-500" value={newRisk.vulnerability} onChange={e=>setNewRisk({...newRisk, vulnerability: parseFloat(e.target.value)})} />
                               </div>
                               <div>
                                   <label className="block text-[10px] font-bold mb-1">Primary Loss Magnitude ($)</label>
                                   <input type="number" className="w-full bg-white/10 border border-white/20 p-2 rounded-lg text-white" value={newRisk.lossMagnitude} onChange={e=>setNewRisk({...newRisk, lossMagnitude: parseFloat(e.target.value)})} />
                               </div>
                          </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Remediation Plan</label>
                        <textarea className="w-full border-2 border-slate-100 p-4 rounded-2xl h-32 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none" value={newRisk.remediation} onChange={e => setNewRisk({...newRisk, remediation: e.target.value})} />
                      </div>
                  </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
                  <button onClick={() => setIsAdding(false)} className="px-6 py-3 text-slate-500 font-bold uppercase text-xs tracking-widest">Discard</button>
                  <button onClick={handleCreateRisk} className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">Commit Entry</button>
              </div>
          </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                      <th className="p-5 font-black uppercase text-[10px] tracking-widest">Description</th>
                      <th className="p-5 font-black uppercase text-[10px] tracking-widest">Compliance Cost</th>
                      <th className="p-5 font-black uppercase text-[10px] tracking-widest">Exposure (ALE)</th>
                      <th className="p-5 font-black uppercase text-[10px] tracking-widest">Status</th>
                      <th className="p-5 text-right"></th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {risks.map(risk => {
                      const cost = ((risk.laborHours || 0) * (risk.hourlyRate || 0)) + (risk.equipmentCost || 0) + (risk.assessorFee || 0);
                      return (
                          <tr key={risk.id} className="hover:bg-slate-50">
                              <td className="p-5">
                                  <div className="font-bold text-slate-900">{risk.description}</div>
                                  <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tight">Owner: {risk.owner}</div>
                              </td>
                              <td className="p-5">
                                  <div className="font-black text-slate-700">{formatCurrency(cost)}</div>
                                  <div className="text-[9px] text-slate-400 uppercase font-black">{risk.laborHours} hrs labor</div>
                              </td>
                              <td className="p-5">
                                  <div className="font-black text-red-600">{formatCurrency(risk.riskScore)}</div>
                                  <div className="text-[9px] text-slate-400 uppercase font-black">Annualized Loss</div>
                              </td>
                              <td className="p-5">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${risk.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{risk.status}</span>
                              </td>
                              <td className="p-5 text-right">
                                  <button onClick={() => onDeleteRisk(risk.id)} className="text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                              </td>
                          </tr>
                      );
                  })}
              </tbody>
          </table>
      </div>
    </div>
  );
};
