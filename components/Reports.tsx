import React, { useState } from 'react';
import { Requirement, PoamEntry } from '../types';
import { NIST_FAMILIES } from '../data/standards';
import { Printer, BarChart3, AlertOctagon, CheckSquare, Presentation, ShieldCheck, XCircle, Edit2, Save, X } from 'lucide-react';

interface ReportsProps {
  requirements: Requirement[];
  onUpdateRequirement?: (req: Requirement) => void; // Optional prop for editing
}

type ReportType = 'EXECUTIVE' | 'POAM' | 'MATRIX' | 'QBR';

export const Reports: React.FC<ReportsProps> = ({ requirements, onUpdateRequirement }) => {
  const [activeReport, setActiveReport] = useState<ReportType>('EXECUTIVE');
  const [isEditing, setIsEditing] = useState(false);

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
        
        <button onClick={() => setActiveReport('EXECUTIVE')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'EXECUTIVE' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
          <BarChart3 size={18} /> Executive Summary
        </button>
        <button onClick={() => setActiveReport('QBR')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'QBR' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Presentation size={18} /> Audit Readiness (QBR)
        </button>
        <button onClick={() => setActiveReport('POAM')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'POAM' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
          <AlertOctagon size={18} /> POA&M
        </button>
        <button onClick={() => setActiveReport('MATRIX')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'MATRIX' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
          <CheckSquare size={18} /> Compliance Matrix
        </button>

        <div className="mt-auto pt-4 border-t border-slate-100">
            <button onClick={handlePrint} className="w-full bg-slate-900 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800">
                <Printer size={16} /> Print / PDF
            </button>
        </div>
      </div>

      {/* Report Preview Area */}
      <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
        <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 min-h-[800px] print:shadow-none print:min-h-0">
          
          <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">
                    {activeReport === 'EXECUTIVE' && 'Executive Compliance Summary'}
                    {activeReport === 'QBR' && 'Audit Readiness Scorecard'}
                    {activeReport === 'POAM' && 'Plan of Action & Milestones (POA&M)'}
                    {activeReport === 'MATRIX' && 'Compliance Traceability Matrix'}
                </h1>
                <p className="text-slate-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
                <div className="font-bold text-slate-900">Confidential</div>
                <div className="text-sm text-slate-500">CUI / INTERNAL USE ONLY</div>
            </div>
          </div>

          {activeReport === 'EXECUTIVE' && (
            <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                     <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                        <div className="text-sm text-slate-500 uppercase font-semibold mb-2">Overall Compliance</div>
                        <div className="text-5xl font-bold text-blue-600">
                            {Math.round((requirements.filter(r => getReqStatus(r) === 'met').length / requirements.length) * 100) || 0}%
                        </div>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                        <div className="text-sm text-slate-500 uppercase font-semibold mb-2">Open Action Items</div>
                        <div className="text-5xl font-bold text-amber-600">{unmetRequirements.length}</div>
                     </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Compliance by Control Family</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {NIST_FAMILIES.map((family: any) => {
                            const score = getFamilyScore(family.id);
                            const hasReqs = requirements.some(r => r.family === family.id);
                            if (!hasReqs) return null;
                            return (
                                <div key={family.id} className="flex items-center gap-4">
                                    <div className="w-12 font-mono font-bold text-slate-500">{family.id}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-slate-700">{family.name}</span>
                                            <span className="font-bold text-slate-900">{score}%</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden print:border print:border-slate-200">
                                            <div className="h-full bg-slate-800 print:bg-black" style={{ width: `${score}%` }}></div>
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
                     <p className="text-slate-600">
                        This document identifies information system security weaknesses and the specific tasks required to remediate them.
                     </p>
                     {onUpdateRequirement && (
                         <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${isEditing ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                         >
                             {isEditing ? <><Save size={16} /> Done Editing</> : <><Edit2 size={16} /> Edit POA&M</>}
                         </button>
                     )}
                 </div>

                 <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th className="border p-2 w-24">Control ID</th>
                            <th className="border p-2 w-1/3">Weakness Description</th>
                            <th className="border p-2">Scheduled Completion</th>
                            <th className="border p-2">Milestones</th>
                            <th className="border p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unmetRequirements.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">No open POA&M items. Good job!</td></tr>
                        )}
                        {unmetRequirements.map(req => (
                            <tr key={req.id}>
                                <td className="border p-2 font-mono font-bold align-top">{req.id}</td>
                                <td className="border p-2 align-top">
                                    {isEditing ? (
                                        <textarea 
                                            className="w-full border rounded p-1 text-xs"
                                            value={req.poam?.weaknessName || req.title}
                                            onChange={(e) => handlePoamChange(req, 'weaknessName', e.target.value)}
                                        />
                                    ) : (
                                        <div className="font-semibold mb-1">{req.poam?.weaknessName || req.title}</div>
                                    )}
                                    {!isEditing && <div className="text-xs text-slate-600">{req.description}</div>}
                                </td>
                                <td className="border p-2 align-top text-slate-600">
                                    {isEditing ? (
                                        <input 
                                            type="date"
                                            className="w-full border rounded p-1 text-xs"
                                            value={req.poam?.scheduledCompletionDate || ''}
                                            onChange={(e) => handlePoamChange(req, 'scheduledCompletionDate', e.target.value)}
                                        />
                                    ) : (
                                        req.poam?.scheduledCompletionDate || 'TBD'
                                    )}
                                </td>
                                <td className="border p-2 align-top text-slate-600">
                                    {isEditing ? (
                                        <textarea 
                                            className="w-full border rounded p-1 text-xs"
                                            placeholder="Define milestones..."
                                            value={req.poam?.milestones || ''}
                                            onChange={(e) => handlePoamChange(req, 'milestones', e.target.value)}
                                        />
                                    ) : (
                                        req.poam?.milestones || 'Define milestones...'
                                    )}
                                </td>
                                <td className="border p-2 align-top font-bold text-xs">
                                    {isEditing ? (
                                        <select 
                                            className="w-full border rounded p-1"
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

          {/* Other report types remain unchanged... omitting for brevity but included in full file context if updated */}
           {activeReport === 'QBR' && (
              <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {NIST_FAMILIES.map((family: any) => {
                          const score = getFamilyScore(family.id);
                          const hasReqs = requirements.some(r => r.family === family.id);
                          if (!hasReqs) return null;
                          let statusColor = score === 100 ? 'bg-green-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500';
                          return (
                              <div key={family.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex shadow-sm">
                                  <div className={`w-16 flex items-center justify-center ${statusColor}`}>
                                      {score === 100 ? <ShieldCheck className="text-white" size={24} /> : <AlertOctagon className="text-white" size={24} />}
                                  </div>
                                  <div className="p-4 flex-1">
                                      <div className="flex justify-between items-start mb-1">
                                          <h4 className="font-bold text-slate-900">{family.name}</h4>
                                          <span className="font-bold text-slate-700">{score}%</span>
                                      </div>
                                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
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
                 <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th className="border p-2 w-20">ID</th>
                            <th className="border p-2">Requirement Title</th>
                            <th className="border p-2 w-24">Family</th>
                            <th className="border p-2 w-24">Status</th>
                            <th className="border p-2 w-32">NIST CSF</th>
                            <th className="border p-2 w-32">NIST 53</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requirements.map(req => {
                            const status = getReqStatus(req);
                            return (
                                <tr key={req.id} className={status === 'met' ? 'bg-white' : 'bg-slate-50'}>
                                    <td className="border p-2 font-mono font-bold">{req.id}</td>
                                    <td className="border p-2">{req.title}</td>
                                    <td className="border p-2 text-xs">{req.family}</td>
                                    <td className="border p-2 font-bold text-xs uppercase">
                                        <span className={status === 'met' ? 'text-green-600' : 'text-red-600'}>{status.replace('_', ' ')}</span>
                                    </td>
                                    <td className="border p-2 text-xs">{req.mappings.nist_csf?.join(', ') || ''}</td>
                                    <td className="border p-2 text-xs">{req.mappings.nist800_53?.join(', ') || ''}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                 </table>
            </div>
          )}

          <div className="mt-12 border-t border-slate-200 pt-4 text-xs text-slate-400 flex justify-between">
            <span>Cuallee Cyber Report</span>
            <span>Page 1 of 1</span>
          </div>

        </div>
      </div>
    </div>
  );
};