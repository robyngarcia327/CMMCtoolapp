
import React, { useState } from 'react';
import { Requirement, PoamEntry } from '../types';
import { Printer, BarChart3, AlertOctagon, CheckSquare, Presentation, ShieldCheck, XCircle, Edit2, Save, X } from 'lucide-react';

interface ReportsProps {
  requirements: Requirement[];
  onUpdateRequirement?: (req: Requirement) => void;
}

type ReportType = 'EXECUTIVE' | 'POAM' | 'MATRIX' | 'QBR';

export const Reports: React.FC<ReportsProps> = ({ requirements, onUpdateRequirement }) => {
  const [activeReport, setActiveReport] = useState<ReportType>('EXECUTIVE');
  const [isEditing, setIsEditing] = useState(false);

  // Identify the active framework from the current requirements set (assuming single active framework context)
  // We determine this by finding the most common framework in the provided list
  const activeFrameworkId = requirements.length > 0 ? requirements[0].framework : 'UNKNOWN';

  // --- Calculation Helpers ---
  const getReqStatus = (req: Requirement) => {
    const statuses = req.objectives.map(o => o.status);
    if (statuses.some(s => s === 'not_met')) return 'not_met';
    if (statuses.every(s => s === 'met' || s === 'na')) return 'met';
    return 'pending';
  };

  const unmetRequirements = requirements.filter(r => {
      const s = getReqStatus(r);
      return s === 'not_met' || s === 'pending';
  });

  const getFamilyScore = (familyId: string) => {
     const reqs = requirements.filter(r => r.family === familyId);
     if (!reqs.length) return 0;
     const met = reqs.filter(r => getReqStatus(r) === 'met').length;
     return Math.round((met / reqs.length) * 100);
  };

  // Derive active families purely from current requirement set
  // Explicitly type as string[] to avoid 'unknown' issues in mapping
  const activeFamilies: string[] = Array.from(new Set(requirements.map(r => r.family))).sort();

  const handlePrint = () => {
    window.print();
  };

  const handlePoamChange = (req: Requirement, field: keyof PoamEntry, value: string) => {
      if (onUpdateRequirement) {
          const updatedPoam = { ...req.poam, [field]: value };
          onUpdateRequirement({ ...req, poam: updatedPoam });
      }
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-100 overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0 no-print">
        <h2 className="text-lg font-bold text-slate-800 mb-4 px-2">Instant Reports</h2>
        
        <button onClick={() => setActiveReport('EXECUTIVE')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'EXECUTIVE' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
          <BarChart3 size={18} /> Executive Summary
        </button>
        <button onClick={() => setActiveReport('QBR')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'QBR' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Presentation size={18} /> Audit Readiness (QBR)
        </button>
        <button onClick={() => setActiveReport('POAM')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'POAM' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
          <AlertOctagon size={18} /> POA&M
        </button>
        <button onClick={() => setActiveReport('MATRIX')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'MATRIX' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
          <CheckSquare size={18} /> Compliance Matrix
        </button>

        <div className="mt-auto pt-4 border-t border-slate-100">
            <button onClick={handlePrint} className="w-full bg-slate-900 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors font-bold text-sm">
                <Printer size={16} /> Print / PDF
            </button>
        </div>
      </div>

      {/* Report Preview Area */}
      <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
        <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 min-h-[800px] print:shadow-none print:min-h-0 border border-slate-200 print:border-0">
          
          <div className="border-b-4 border-slate-900 pb-4 mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                    {activeReport === 'EXECUTIVE' && 'Executive Compliance Summary'}
                    {activeReport === 'QBR' && 'Audit Readiness Scorecard'}
                    {activeReport === 'POAM' && 'Plan of Action & Milestones (POA&M)'}
                    {activeReport === 'MATRIX' && 'Compliance Traceability Matrix'}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{activeFrameworkId}</span>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Generated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="font-black text-slate-900 text-xs uppercase tracking-widest">Confidential</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">CUI / INTERNAL USE ONLY</div>
            </div>
          </div>

          {activeReport === 'EXECUTIVE' && (
            <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center shadow-sm">
                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Overall Compliance</div>
                        <div className="text-5xl font-black text-blue-600">
                            {Math.round((requirements.filter(r => getReqStatus(r) === 'met').length / requirements.length) * 100) || 0}%
                        </div>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center shadow-sm">
                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Open Action Items</div>
                        <div className="text-5xl font-black text-amber-600">{unmetRequirements.length}</div>
                     </div>
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-800 mb-4 border-b-2 border-slate-100 pb-2">Status by Domain</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {activeFamilies.map((familyId) => {
                            // Cast familyId to string to satisfy function signature
                            const score = getFamilyScore(familyId as string);
                            return (
                                <div key={familyId as string} className="flex items-center gap-4">
                                    <div className="w-16 font-mono font-black text-slate-400 text-xs">{familyId as string}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1 font-bold uppercase tracking-wide">
                                            <span className="text-slate-700">{familyId as string} Family</span>
                                            <span className="text-slate-900">{score}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden print:border print:border-slate-200">
                                            <div className="h-full bg-slate-900 print:bg-black transition-all duration-1000" style={{ width: `${score}%` }}></div>
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
            <div>
                 <div className="flex justify-between items-start mb-6 no-print">
                     <p className="text-slate-600 text-sm">
                        This document identifies information system security weaknesses and the specific tasks required to remediate them.
                     </p>
                     {onUpdateRequirement && (
                         <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${isEditing ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                         >
                             {isEditing ? <><Save size={14} /> Save Entries</> : <><Edit2 size={14} /> Edit Table</>}
                         </button>
                     )}
                 </div>

                 <table className="w-full text-[11px] text-left border-collapse border border-slate-300">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="border border-slate-400 p-2 w-20 uppercase tracking-widest font-black">ID</th>
                            <th className="border border-slate-400 p-2 w-1/3 uppercase tracking-widest font-black">Weakness / Requirement</th>
                            <th className="border border-slate-400 p-2 uppercase tracking-widest font-black">Scheduled Date</th>
                            <th className="border border-slate-400 p-2 uppercase tracking-widest font-black">Milestones</th>
                            <th className="border border-slate-400 p-2 uppercase tracking-widest font-black">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unmetRequirements.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic font-medium">No open POA&M items. Good job!</td></tr>
                        )}
                        {unmetRequirements.map(req => (
                            <tr key={req.id} className="even:bg-slate-50">
                                <td className="border border-slate-300 p-2 font-mono font-bold align-top text-slate-900">{req.id}</td>
                                <td className="border border-slate-300 p-2 align-top">
                                    {isEditing ? (
                                        <textarea 
                                            className="w-full border rounded p-1 text-[10px] font-sans"
                                            value={req.poam?.weaknessName || req.title}
                                            onChange={(e) => handlePoamChange(req, 'weaknessName', e.target.value)}
                                        />
                                    ) : (
                                        <div className="font-bold mb-1 text-slate-800">{req.poam?.weaknessName || req.title}</div>
                                    )}
                                    {!isEditing && <div className="text-[10px] text-slate-500 leading-tight">{req.description}</div>}
                                </td>
                                <td className="border border-slate-300 p-2 align-top text-slate-600 font-bold">
                                    {isEditing ? (
                                        <input 
                                            type="date"
                                            className="w-full border rounded p-1 text-[10px]"
                                            value={req.poam?.scheduledCompletionDate || ''}
                                            onChange={(e) => handlePoamChange(req, 'scheduledCompletionDate', e.target.value)}
                                        />
                                    ) : (
                                        req.poam?.scheduledCompletionDate || 'TBD'
                                    )}
                                </td>
                                <td className="border border-slate-300 p-2 align-top text-slate-600">
                                    {isEditing ? (
                                        <textarea 
                                            className="w-full border rounded p-1 text-[10px]"
                                            placeholder="Define milestones..."
                                            value={req.poam?.milestones || ''}
                                            onChange={(e) => handlePoamChange(req, 'milestones', e.target.value)}
                                        />
                                    ) : (
                                        req.poam?.milestones || '-'
                                    )}
                                </td>
                                <td className="border border-slate-300 p-2 align-top font-black text-[10px]">
                                    {isEditing ? (
                                        <select 
                                            className="w-full border rounded p-1 text-[10px]"
                                            value={req.poam?.status || 'Planned'}
                                            onChange={(e) => handlePoamChange(req, 'status', e.target.value)}
                                        >
                                            <option>Planned</option>
                                            <option>Ongoing</option>
                                            <option>Delayed</option>
                                            <option>Risk Accepted</option>
                                        </select>
                                    ) : (
                                        <span className={
                                            req.poam?.status === 'Ongoing' ? 'text-blue-600' :
                                            req.poam?.status === 'Delayed' ? 'text-red-600' :
                                            'text-slate-600'
                                        }>
                                            {req.poam?.status?.toUpperCase() || 'PLANNED'}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
          )}

           {activeReport === 'QBR' && (
              <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeFamilies.map((familyId) => {
                          // Cast familyId to string to satisfy function signature
                          const score = getFamilyScore(familyId as string);
                          let statusColor = score === 100 ? 'bg-green-600' : score >= 70 ? 'bg-amber-500' : 'bg-red-600';
                          return (
                              <div key={familyId as string} className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden flex shadow-sm">
                                  <div className={`w-14 flex items-center justify-center ${statusColor}`}>
                                      {score === 100 ? <ShieldCheck className="text-white" size={24} /> : <AlertOctagon className="text-white" size={24} />}
                                  </div>
                                  <div className="p-4 flex-1">
                                      <div className="flex justify-between items-start mb-1">
                                          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">{familyId as string} Domain</h4>
                                          <span className="font-black text-slate-900 text-xs">{score}%</span>
                                      </div>
                                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2 border border-slate-200">
                                          <div className={`${statusColor} h-full`} style={{ width: `${score}%` }}></div>
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          )}
          
          {activeReport === 'MATRIX' && (
             <div className="overflow-x-auto">
                 <table className="w-full text-[10px] text-left border-collapse border border-slate-300">
                    <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th className="border border-slate-300 p-2 w-16 font-black uppercase">ID</th>
                            <th className="border border-slate-300 p-2 font-black uppercase">Title</th>
                            <th className="border border-slate-300 p-2 w-16 font-black uppercase">Family</th>
                            <th className="border border-slate-300 p-2 w-20 font-black uppercase">Status</th>
                            <th className="border border-slate-300 p-2 font-black uppercase">Mappings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requirements.map(req => {
                            const status = getReqStatus(req);
                            return (
                                <tr key={req.id} className={status === 'met' ? 'bg-white' : 'bg-slate-50'}>
                                    <td className="border border-slate-300 p-2 font-mono font-bold text-slate-900">{req.id}</td>
                                    <td className="border border-slate-300 p-2 font-bold text-slate-800">{req.title}</td>
                                    <td className="border border-slate-300 p-2 font-black text-slate-400">{req.family}</td>
                                    <td className="border border-slate-300 p-2 font-black uppercase">
                                        <span className={status === 'met' ? 'text-green-600' : 'text-red-600'}>{status.replace('_', ' ')}</span>
                                    </td>
                                    <td className="border border-slate-300 p-2 text-slate-500">
                                        {req.mappings.nist800_53 && <span className="mr-2">NIST53: {req.mappings.nist800_53.join(', ')}</span>}
                                        {req.mappings.iso27001 && <span>ISO: {req.mappings.iso27001.join(', ')}</span>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                 </table>
            </div>
          )}

          <div className="mt-12 border-t-2 border-slate-100 pt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex justify-between">
            <span>&copy; {new Date().getFullYear()} Cuallee Cyber Compliance Report</span>
            <span>Document Integrity Verified</span>
          </div>

        </div>
      </div>
    </div>
  );
};
