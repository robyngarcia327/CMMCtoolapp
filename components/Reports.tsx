
import React, { useState, useEffect } from 'react';
import { Requirement, PoamEntry, Artifact, SspMetadata, Risk } from '../types';
import { Printer, BarChart3, ShieldCheck, FileText, Shield, Info, ClipboardList, CheckCircle2, AlertTriangle, Search, Save, Edit2 } from 'lucide-react';

interface ReportsProps {
  requirements: Requirement[];
  risks?: Risk[];
  artifacts?: Artifact[];
  activeFrameworkId: string;
  onUpdateRequirement?: (req: Requirement) => void;
  sspMetadata?: SspMetadata;
  defaultTab?: 'EXECUTIVE' | 'POAM' | 'MATRIX' | 'SSP';
}

type ReportType = 'EXECUTIVE' | 'POAM' | 'MATRIX' | 'SSP';

export const Reports: React.FC<ReportsProps> = ({ 
  requirements, 
  risks = [], 
  artifacts = [], 
  activeFrameworkId, 
  onUpdateRequirement, 
  sspMetadata,
  defaultTab 
}) => {
  const [activeReport, setActiveReport] = useState<ReportType>(defaultTab || 'EXECUTIVE');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (defaultTab) setActiveReport(defaultTab);
  }, [defaultTab]);

  const filteredRequirements = requirements.filter(r => r.framework === activeFrameworkId);

  const getReqStatus = (req: Requirement) => {
    const statuses = req.objectives.map(o => o.status);
    if (statuses.some(s => s === 'not_met')) return 'not_met';
    if (statuses.every(s => s === 'met' || s === 'na')) return 'met';
    return 'pending';
  };

  const unmetRequirements = filteredRequirements.filter(r => {
      const s = getReqStatus(r);
      return s === 'not_met' || s === 'pending';
  });

  const activeFamilies: string[] = (Array.from(new Set(filteredRequirements.map(r => r.family))) as string[]).sort();

  const handlePrint = () => window.print();

  const handlePoamChange = (req: Requirement, field: keyof PoamEntry, value: string) => {
      if (onUpdateRequirement) {
          const updatedPoam: PoamEntry = { 
              weaknessName: req.poam?.weaknessName || req.title,
              scheduledCompletionDate: req.poam?.scheduledCompletionDate || '',
              milestones: req.poam?.milestones || '',
              status: req.poam?.status || 'Planned',
              ...req.poam, 
              [field]: value 
          };
          onUpdateRequirement({ ...req, poam: updatedPoam });
      }
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      <div className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2 shrink-0 no-print">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Report Selection</h2>
        <button onClick={() => setActiveReport('EXECUTIVE')} className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeReport === 'EXECUTIVE' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>Executive Summary</button>
        <button onClick={() => setActiveReport('SSP')} className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeReport === 'SSP' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>SSP Generation</button>
        <button onClick={() => setActiveReport('POAM')} className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeReport === 'POAM' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>POA&M Roadmap</button>
        <button onClick={() => setActiveReport('MATRIX')} className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeReport === 'MATRIX' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>Traceability Matrix</button>
        
        <div className="mt-auto pt-6 border-t border-slate-100">
          <button onClick={handlePrint} className="w-full bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors font-black text-[10px] uppercase tracking-widest">
            <Printer size={16} /> Export as PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl p-12 min-h-[1100px] print:shadow-none print:min-h-0 border border-slate-200 print:border-0 rounded-3xl">
          <div className="border-b-4 border-slate-900 pb-6 mb-10 flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
                    {activeReport === 'SSP' ? 'System Security Plan' : 
                     activeReport === 'POAM' ? 'Plan of Action & Milestones' :
                     activeReport === 'MATRIX' ? 'Compliance Matrix' : 'Executive Posture Report'}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{activeFrameworkId} ALIGNED</span>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Verified: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Confidential // CUI</div>
            </div>
          </div>

          {activeReport === 'SSP' && (
            <div className="space-y-10">
               <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Boundary Summary</h4>
                  <p className="font-black text-xl text-slate-900">{sspMetadata?.systemName || 'Undefined Environment'}</p>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed">{sspMetadata?.generalDescription || 'No description provided.'}</p>
               </div>
               
               <div className="space-y-8">
                  {activeFamilies.map(familyId => (
                    <div key={familyId} className="border-b border-slate-100 pb-8 last:border-0">
                      <h3 className="font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                        <Shield size={20} className="text-blue-600"/> {familyId} Security Family
                      </h3>
                      <div className="space-y-6">
                        {filteredRequirements.filter(r => r.family === familyId).map(req => (
                            <div key={req.id} className="pl-6 border-l-4 border-slate-100">
                                <div className="flex justify-between font-black text-xs mb-2">
                                    <span className="text-slate-800 uppercase tracking-tight">{req.id}: {req.title}</span>
                                    <span className={getReqStatus(req) === 'met' ? 'text-green-600' : 'text-red-600'}>
                                    {getReqStatus(req).toUpperCase()}
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 leading-relaxed font-medium">
                                    {req.response || 'Pending implementation statement synthesis.'}
                                </div>
                            </div>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeReport === 'EXECUTIVE' && (
            <div className="space-y-12">
                <div className="grid grid-cols-2 gap-8">
                     <div className="p-10 bg-slate-900 rounded-[2rem] text-center shadow-xl">
                        <div className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-3">Overall Readiness Score</div>
                        <div className="text-7xl font-black text-white">
                            {Math.round((filteredRequirements.filter(r => getReqStatus(r) === 'met').length / (filteredRequirements.length || 1)) * 100)}%
                        </div>
                     </div>
                     <div className="p-10 bg-slate-50 rounded-[2rem] border-2 border-slate-100 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Critical Control Gaps</div>
                        <div className="text-7xl font-black text-red-600">{unmetRequirements.length}</div>
                     </div>
                </div>
                
                <div>
                    <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight border-b-2 border-slate-900 pb-3">Remediation Status by Domain</h3>
                    <div className="space-y-6">
                        {activeFamilies.map((familyId) => {
                            const reqs = filteredRequirements.filter(r => r.family === familyId);
                            const met = reqs.filter(r => getReqStatus(r) === 'met').length;
                            const score = Math.round((met / (reqs.length || 1)) * 100);
                            return (
                                <div key={familyId} className="flex items-center gap-6">
                                    <div className="w-12 font-mono font-black text-slate-400 text-xs text-center">{familyId}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest text-slate-500">
                                            <span>{familyId} Domain</span>
                                            <span>{score}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${score}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
          )}

          {activeReport === 'POAM' && (
            <div className="space-y-8">
                 <div className="flex justify-between items-center no-print">
                     <p className="text-slate-500 text-sm font-medium">Auto-populated roadmap for requirements currently marked as Gaps.</p>
                     {onUpdateRequirement && (
                       <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isEditing ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                         {isEditing ? <><Save size={14} /> Commit Changes</> : <><Edit2 size={14} /> Edit Dates</>}
                       </button>
                     )}
                 </div>
                 
                 <div className="border border-slate-200 rounded-2xl overflow-hidden">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900 text-white">
                          <tr>
                            <th className="p-4 w-24 text-[10px] font-black uppercase tracking-widest">Req ID</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest">Identified Weakness</th>
                            <th className="p-4 w-32 text-[10px] font-black uppercase tracking-widest">ETA</th>
                            <th className="p-4 w-32 text-[10px] font-black uppercase tracking-widest">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {unmetRequirements.length === 0 && (
                              <tr><td colSpan={4} className="p-12 text-center text-slate-400 italic font-medium">All organizational requirements are currently met. No POAM items required.</td></tr>
                            )}
                            {unmetRequirements.map(req => (
                                <tr key={req.id} className="hover:bg-slate-50/50">
                                    <td className="p-4 font-mono font-bold text-slate-900 text-xs">{req.id}</td>
                                    <td className="p-4 text-xs font-medium text-slate-700 leading-relaxed">{req.title}</td>
                                    <td className="p-4">
                                      {isEditing ? (
                                        <input type="date" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" value={req.poam?.scheduledCompletionDate || ''} onChange={(e) => handlePoamChange(req, 'scheduledCompletionDate', e.target.value)}/>
                                      ) : (<span className="font-mono text-xs font-bold text-slate-900">{req.poam?.scheduledCompletionDate || 'TBD'}</span>)}
                                    </td>
                                    <td className="p-4">
                                      <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">
                                        {req.poam?.status || 'GAP'}
                                      </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                 </div>
            </div>
          )}

          <div className="mt-20 border-t-2 border-slate-100 pt-8 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            <span>Cuallee Cyber Compliance Architecture</span>
            <span>Ref: {activeFrameworkId}-SSP-2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};
