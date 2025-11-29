
import React, { useState } from 'react';
import { Risk, RiskProfileVersion } from '../types';
import { AlertTriangle, Plus, Save, Clock, Trash2, History, ChevronRight, DollarSign, Calculator } from 'lucide-react';

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
  
  // New Risk Form State
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
      likelihood: 3,
      impact: 3,
      status: 'Open',
      category: 'Technical',
      assessmentType: 'Quantitative', // Default to FAIR
      threatEventFrequency: 1,
      vulnerability: 0.5,
      lossMagnitude: 10000
  });

  const totalExposure = risks.reduce((sum, r) => {
      if (r.assessmentType === 'Quantitative' && r.status === 'Open') {
          return sum + (r.riskScore || 0);
      }
      return sum;
  }, 0);

  const calculateAle = (tef: number, vuln: number, loss: number) => {
      // ALE = TEF * (Vuln%) * Loss
      return tef * vuln * loss;
  };

  const getRiskColor = (risk: Risk) => {
      if (risk.assessmentType === 'Quantitative') {
          const ale = risk.riskScore;
          if (ale >= 100000) return 'bg-red-100 text-red-800 border-red-200';
          if (ale >= 50000) return 'bg-orange-100 text-orange-800 border-orange-200';
          if (ale >= 10000) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          return 'bg-green-100 text-green-800 border-green-200';
      } else {
          // Fallback to simple qualitative
          const score = risk.riskScore;
          if (score >= 20) return 'bg-red-100 text-red-800 border-red-200';
          if (score >= 12) return 'bg-orange-100 text-orange-800 border-orange-200';
          if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          return 'bg-green-100 text-green-800 border-green-200';
      }
  };

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
          // Quantitative
          threatEventFrequency: newRisk.threatEventFrequency,
          vulnerability: newRisk.vulnerability,
          lossMagnitude: newRisk.lossMagnitude,
          // Qualitative
          likelihood: newRisk.likelihood as any,
          impact: newRisk.impact as any,
          riskScore: calculatedScore
      };
      onAddRisk(risk);
      setIsAdding(false);
      // Reset form
      setNewRisk({ 
        likelihood: 3, 
        impact: 3, 
        status: 'Open', 
        category: 'Technical', 
        description: '', 
        owner: '', 
        remediation: '',
        assessmentType: 'Quantitative',
        threatEventFrequency: 1,
        vulnerability: 0.5,
        lossMagnitude: 10000
      });
  };

  const handleSaveVersion = () => {
      const ver: RiskProfileVersion = {
          id: Date.now().toString(),
          versionNumber: `v1.${versions.length}`,
          timestamp: Date.now(),
          createdBy: 'Current User',
          risks: JSON.parse(JSON.stringify(risks)) // Deep copy
      };
      setVersions([ver, ...versions]);
      alert('Risk Register Snapshot Saved!');
  };

  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" /> Risk Management
            </h2>
            <p className="text-slate-600">Analyze risks using FAIR (Factor Analysis of Information Risk) methodology.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setView('current')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'current' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}
            >
                Current Register
            </button>
             <button 
                onClick={() => setView('history')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${view === 'history' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}
            >
                <History size={16} /> Version History
            </button>
        </div>
      </div>

      {view === 'current' ? (
        <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                         <DollarSign size={24} />
                     </div>
                     <div>
                         <div className="text-sm text-slate-500 font-medium uppercase">Total Annualized Exposure</div>
                         <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalExposure)}</div>
                     </div>
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                         <AlertTriangle size={24} />
                     </div>
                     <div>
                         <div className="text-sm text-slate-500 font-medium uppercase">Open Risks</div>
                         <div className="text-2xl font-bold text-slate-900">{risks.filter(r => r.status === 'Open').length}</div>
                     </div>
                 </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                         <Clock size={24} />
                     </div>
                     <div>
                         <div className="text-sm text-slate-500 font-medium uppercase">Mitigated Risks</div>
                         <div className="text-2xl font-bold text-slate-900">{risks.filter(r => r.status === 'Mitigated').length}</div>
                     </div>
                 </div>
            </div>

            <div className="flex justify-end gap-3 mb-4">
                 <button onClick={handleSaveVersion} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                    <Save size={16} /> Snapshot Version
                </button>
                <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    <Plus size={16} /> Add Risk
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-6 animate-in fade-in slide-in-from-top-4 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl"></div>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calculator size={18} className="text-blue-600"/> New Risk Assessment
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Common Fields */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Risk Description</label>
                                <input 
                                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                    placeholder="e.g., Unpatched server leading to exploit"
                                    value={newRisk.description}
                                    onChange={e => setNewRisk({...newRisk, description: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select 
                                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newRisk.category}
                                    onChange={e => setNewRisk({...newRisk, category: e.target.value as any})}
                                >
                                    <option>Technical</option>
                                    <option>Administrative</option>
                                    <option>Physical</option>
                                    <option>External</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Risk Owner</label>
                                <input 
                                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="e.g., CTO"
                                    value={newRisk.owner}
                                    onChange={e => setNewRisk({...newRisk, owner: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Assessment Method Toggle */}
                        <div className="md:col-span-2 bg-slate-50 p-1 rounded-lg flex border border-slate-200">
                            <button 
                                onClick={() => setNewRisk({...newRisk, assessmentType: 'Quantitative'})}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${newRisk.assessmentType === 'Quantitative' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Quantitative (FAIR - Recommended)
                            </button>
                            <button 
                                onClick={() => setNewRisk({...newRisk, assessmentType: 'Qualitative'})}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${newRisk.assessmentType === 'Qualitative' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Qualitative (Simple 1-5)
                            </button>
                        </div>

                        {newRisk.assessmentType === 'Quantitative' ? (
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Threat Event Frequency (TEF)</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" step="0.1"
                                            className="w-full border border-slate-300 p-2 rounded-lg"
                                            value={newRisk.threatEventFrequency}
                                            onChange={e => setNewRisk({...newRisk, threatEventFrequency: parseFloat(e.target.value)})}
                                        />
                                        <span className="text-xs text-slate-500 whitespace-nowrap">times / yr</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400">Estimated attempts per year.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Vulnerability (Vuln %)</label>
                                     <div className="flex items-center gap-2">
                                        <input 
                                            type="number" step="0.01" min="0" max="1"
                                            className="w-full border border-slate-300 p-2 rounded-lg"
                                            value={newRisk.vulnerability}
                                            onChange={e => setNewRisk({...newRisk, vulnerability: parseFloat(e.target.value)})}
                                        />
                                         <span className="text-xs text-slate-500">% Prob.</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400">Probability of success (0.0 - 1.0).</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Loss Magnitude (PLM)</label>
                                    <div className="relative">
                                        <DollarSign size={14} className="absolute left-3 top-3 text-slate-400" />
                                        <input 
                                            type="number"
                                            className="w-full border border-slate-300 p-2 pl-8 rounded-lg"
                                            value={newRisk.lossMagnitude}
                                            onChange={e => setNewRisk({...newRisk, lossMagnitude: parseFloat(e.target.value)})}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400">Total financial impact per event.</p>
                                </div>
                                <div className="md:col-span-3 mt-2 bg-white p-3 rounded-lg border border-indigo-100 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-slate-700">Annualized Loss Expectancy (ALE):</span>
                                    <span className="text-lg font-bold text-indigo-700">
                                        {formatCurrency(calculateAle(newRisk.threatEventFrequency || 0, newRisk.vulnerability || 0, newRisk.lossMagnitude || 0))} / yr
                                    </span>
                                </div>
                            </div>
                        ) : (
                            // Qualitative Fields
                             <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Likelihood (1-5)</label>
                                    <input 
                                        type="range" min="1" max="5" 
                                        className="w-full accent-blue-600"
                                        value={newRisk.likelihood}
                                        onChange={e => setNewRisk({...newRisk, likelihood: parseInt(e.target.value) as any})}
                                    />
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Rare</span><span>Certain</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Impact (1-5)</label>
                                    <input 
                                        type="range" min="1" max="5" 
                                        className="w-full accent-red-600"
                                        value={newRisk.impact}
                                        onChange={e => setNewRisk({...newRisk, impact: parseInt(e.target.value) as any})}
                                    />
                                     <div className="flex justify-between text-xs text-slate-500">
                                        <span>Low</span><span>Critical</span>
                                    </div>
                                </div>
                             </div>
                        )}

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Remediation Plan</label>
                            <textarea 
                                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                placeholder="Action plan to mitigate this risk..."
                                value={newRisk.remediation}
                                onChange={e => setNewRisk({...newRisk, remediation: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6 border-t border-slate-100 pt-4">
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button onClick={handleCreateRisk} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium">Save Risk Assessment</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Description</th>
                            <th className="p-4 font-semibold">Methodology</th>
                            <th className="p-4 font-semibold">Risk Score (ALE)</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {risks.map(risk => {
                            const colorClass = getRiskColor(risk);
                            
                            return (
                                <tr key={risk.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-mono text-xs text-slate-500 align-top">{risk.id}</td>
                                    <td className="p-4 align-top">
                                        <div className="font-medium text-slate-900">{risk.description}</div>
                                        <div className="text-xs text-slate-500 mt-1">Owner: {risk.owner}</div>
                                        <div className="text-xs text-slate-400 mt-1 italic max-w-md">{risk.remediation}</div>
                                    </td>
                                    <td className="p-4 align-top">
                                        {risk.assessmentType === 'Quantitative' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                                                FAIR
                                            </span>
                                        ) : (
                                             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                                                Qualitative
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className={`inline-flex flex-col items-center justify-center px-3 py-1 rounded-lg border ${colorClass}`}>
                                            <span className="font-bold text-sm">
                                                {risk.assessmentType === 'Quantitative' ? formatCurrency(risk.riskScore) : risk.riskScore}
                                            </span>
                                            {risk.assessmentType === 'Quantitative' && <span className="text-[10px] opacity-75">per year</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            risk.status === 'Open' ? 'bg-red-100 text-red-700' :
                                            risk.status === 'Mitigated' ? 'bg-green-100 text-green-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {risk.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right align-top">
                                        <button 
                                            onClick={() => onDeleteRisk(risk.id)}
                                            className="text-slate-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {risks.length === 0 && (
                     <div className="p-8 text-center text-slate-400 text-sm">No risks identified yet. Add a new risk to begin tracking.</div>
                )}
            </div>
        </>
      ) : (
        <div className="space-y-4">
            {versions.length === 0 && (
                <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                    <History size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No snapshots saved yet. Go to current register and click "Snapshot Version".</p>
                </div>
            )}
            {versions.map(ver => (
                <div key={ver.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                             <h3 className="font-bold text-slate-800">{ver.versionNumber}</h3>
                             <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock size={12} /> {new Date(ver.timestamp).toLocaleString()}
                             </p>
                        </div>
                        <div className="text-sm font-medium text-slate-600">
                            Risks Tracked: {ver.risks.length}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs text-slate-600">
                         {ver.risks.slice(0,3).map(r => (
                             <div key={r.id} className="flex justify-between py-1 border-b border-slate-200 last:border-0">
                                 <span className="truncate max-w-[300px]">{r.description}</span>
                                 <span className="font-mono">{r.assessmentType === 'Quantitative' ? formatCurrency(r.riskScore) : r.riskScore}</span>
                             </div>
                         ))}
                         {ver.risks.length > 3 && <div className="pt-1 italic text-slate-400">...and {ver.risks.length - 3} more</div>}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
