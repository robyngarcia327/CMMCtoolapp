
import React, { useState } from 'react';
import { Risk } from '../types';
import { AlertTriangle, Plus, Trash2, DollarSign, Calculator, Hammer, HardDrive, UserCheck, Clock, TrendingUp } from 'lucide-react';

interface RiskRegisterProps {
  risks: Risk[];
  onAddRisk: (risk: Risk) => void;
  onUpdateRisk: (risk: Risk) => void;
  onDeleteRisk: (id: string) => void;
}

export const RiskRegister: React.FC<RiskRegisterProps> = ({ risks, onAddRisk, onDeleteRisk }) => {
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
      manHours: 0,
      laborRate: 150,
      equipmentCost: 0,
      assessorPrice: 0
  });

  const totalAle = risks.reduce((sum, r) => (r.status === 'Open' ? sum + (r.riskScore || 0) : sum), 0);
  
  const totalRemediationCost = risks.reduce((sum, r) => {
      const labor = (r.manHours || 0) * (r.laborRate || 0);
      const equip = r.equipmentCost || 0;
      const assessor = r.assessorPrice || 0;
      return sum + labor + equip + assessor;
  }, 0);

  const handleCreateRisk = () => {
      if (!newRisk.description || !newRisk.owner) return;
      
      const calculatedScore = (newRisk.threatEventFrequency || 0) * (newRisk.vulnerability || 0) * (newRisk.lossMagnitude || 0);

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
          manHours: newRisk.manHours,
          laborRate: newRisk.laborRate,
          equipmentCost: newRisk.equipmentCost,
          assessorPrice: newRisk.assessorPrice
      };
      onAddRisk(risk);
      setIsAdding(false);
      setNewRisk({ 
        likelihood: 3, impact: 3, status: 'Open', category: 'Technical', description: '', owner: '', remediation: '',
        assessmentType: 'Quantitative', threatEventFrequency: 1, vulnerability: 0.5, lossMagnitude: 10000,
        manHours: 0, laborRate: 150, equipmentCost: 0, assessorPrice: 0
      });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 overflow-y-auto h-full bg-slate-50/50">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
                Risk Management
            </h2>
            <p className="text-slate-500 font-medium">Financial Impact Modeling & Cost-to-Compliant Analysis.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95">
            <Plus size={18} /> New Risk Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Annual Risk Exposure (ALE)</div>
                <div className="text-4xl font-black text-red-600">{formatCurrency(totalAle)}</div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm bg-gradient-to-br from-white to-blue-50">
                <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2">Cost to Compliant</div>
                <div className="text-4xl font-black text-blue-600">{formatCurrency(totalRemediationCost)}</div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Remediation Velocity</div>
                <div className="text-4xl font-black text-slate-900">{risks.reduce((sum,r)=>sum+(r.manHours||0),0)} <span className="text-lg text-slate-400">HRS</span></div>
            </div>
      </div>

      {isAdding && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4">
              <h3 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-sm flex items-center gap-3">
                  <Calculator size={24} className="text-blue-600"/> Assessment & Budgeting
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                      <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description / Requirement Gap</label>
                            <input className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold" placeholder="e.g. FIPS 140-3 Cryptography implementation gap" value={newRisk.description} onChange={e => setNewRisk({...newRisk, description: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Risk Owner</label>
                                <input className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all" value={newRisk.owner} onChange={e => setNewRisk({...newRisk, owner: e.target.value})} />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                <select className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none" value={newRisk.category} onChange={e => setNewRisk({...newRisk, category: e.target.value as any})}>
                                    <option>Technical</option>
                                    <option>Administrative</option>
                                    <option>Physical</option>
                                </select>
                              </div>
                          </div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
                          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                             <DollarSign size={14} className="text-green-600"/> Remediation Cost Model
                          </h4>
                          <div className="grid grid-cols-2 gap-6">
                               <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Labor Required (Hours)</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-4 top-4 text-slate-400"/>
                                        <input type="number" className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl font-bold" value={newRisk.manHours} onChange={e=>setNewRisk({...newRisk, manHours: parseFloat(e.target.value)})} />
                                    </div>
                               </div>
                               <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Labor Rate ($/hr)</label>
                                    <input type="number" className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-bold" value={newRisk.laborRate} onChange={e=>setNewRisk({...newRisk, laborRate: parseFloat(e.target.value)})} />
                               </div>
                               <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Equipment Cost ($)</label>
                                    <div className="relative">
                                        <HardDrive size={16} className="absolute left-4 top-4 text-slate-400"/>
                                        <input type="number" className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl font-bold" value={newRisk.equipmentCost} onChange={e=>setNewRisk({...newRisk, equipmentCost: parseFloat(e.target.value)})} />
                                    </div>
                               </div>
                               <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Assessor Price ($)</label>
                                    <div className="relative">
                                        <UserCheck size={16} className="absolute left-4 top-4 text-slate-400"/>
                                        <input type="number" className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl font-bold" value={newRisk.assessorPrice} onChange={e=>setNewRisk({...newRisk, assessorPrice: parseFloat(e.target.value)})} />
                                    </div>
                               </div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-8">
                      <div className="bg-indigo-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                          <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><TrendingUp size={16}/> Exposure Analysis</h4>
                          <div className="space-y-6">
                               <div>
                                   <div className="flex justify-between text-[10px] font-bold mb-2"><span>THREAT EVENT FREQUENCY</span><span>{newRisk.threatEventFrequency} /yr</span></div>
                                   <input type="range" min="0" max="100" step="1" className="w-full accent-blue-400 h-1 bg-white/20 rounded-full appearance-none" value={newRisk.threatEventFrequency} onChange={e=>setNewRisk({...newRisk, threatEventFrequency: parseFloat(e.target.value)})} />
                               </div>
                               <div>
                                   <div className="flex justify-between text-[10px] font-bold mb-2"><span>VULNERABILITY LEVEL</span><span>{Math.round((newRisk.vulnerability||0)*100)}%</span></div>
                                   <input type="range" min="0" max="1" step="0.01" className="w-full accent-blue-400 h-1 bg-white/20 rounded-full appearance-none" value={newRisk.vulnerability} onChange={e=>setNewRisk({...newRisk, vulnerability: parseFloat(e.target.value)})} />
                               </div>
                               <div>
                                   <label className="block text-[10px] font-bold mb-2">SINGLE LOSS EXPECTANCY ($)</label>
                                   <input type="number" className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl text-white font-black" value={newRisk.lossMagnitude} onChange={e=>setNewRisk({...newRisk, lossMagnitude: parseFloat(e.target.value)})} />
                               </div>
                          </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Project Remediation Plan</label>
                        <textarea className="w-full border-2 border-slate-100 p-4 rounded-2xl h-40 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium" value={newRisk.remediation} onChange={e => setNewRisk({...newRisk, remediation: e.target.value})} />
                      </div>
                  </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-12 pt-8 border-t border-slate-100">
                  <button onClick={() => setIsAdding(false)} className="px-8 py-3 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
                  <button onClick={handleCreateRisk} className="px-12 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-black transition-all">Commit Risk Profile</button>
              </div>
          </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
              <thead className="bg-slate-900 text-white border-b border-slate-800">
                  <tr>
                      <th className="p-6 font-black uppercase text-[10px] tracking-widest">Description</th>
                      <th className="p-6 font-black uppercase text-[10px] tracking-widest text-center">Implementation Cost</th>
                      <th className="p-6 font-black uppercase text-[10px] tracking-widest text-center">Risk Exposure</th>
                      <th className="p-6 font-black uppercase text-[10px] tracking-widest">Status</th>
                      <th className="p-6 text-right"></th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {risks.length === 0 && (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic">No risk profiles established.</td></tr>
                  )}
                  {risks.map(risk => {
                      const cost = ((risk.manHours || 0) * (risk.laborRate || 0)) + (risk.equipmentCost || 0) + (risk.assessorPrice || 0);
                      return (
                          <tr key={risk.id} className="hover:bg-slate-50 group">
                              <td className="p-6">
                                  <div className="font-bold text-slate-900 text-base">{risk.description}</div>
                                  <div className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">ID: {risk.id} // Owner: {risk.owner}</div>
                              </td>
                              <td className="p-6 text-center">
                                  <div className="font-black text-blue-600 text-lg">{formatCurrency(cost)}</div>
                                  <div className="text-[9px] text-slate-400 uppercase font-black">{risk.manHours} hours remediation</div>
                              </td>
                              <td className="p-6 text-center">
                                  <div className="font-black text-red-600 text-lg">{formatCurrency(risk.riskScore)}</div>
                                  <div className="text-[9px] text-slate-400 uppercase font-black">Annualized Loss</div>
                              </td>
                              <td className="p-6">
                                  <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${risk.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{risk.status}</span>
                              </td>
                              <td className="p-6 text-right">
                                  <button onClick={() => onDeleteRisk(risk.id)} className="text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
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
