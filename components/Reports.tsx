
import React, { useState, useEffect } from 'react';
import { Requirement, PoamEntry, Artifact, SspMetadata, Risk } from '../types';
import { Printer, BarChart3, AlertOctagon, CheckSquare, Presentation, ShieldCheck, XCircle, Edit2, Save, X, FileText, Lock, Shield, Info, Building, Globe, Map, User, Key, ClipboardList, Calendar, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ReportsProps {
  requirements: Requirement[];
  risks?: Risk[];
  artifacts?: Artifact[];
  activeFrameworkId: string;
  onUpdateRequirement?: (req: Requirement) => void;
  sspMetadata?: SspMetadata;
  defaultTab?: 'EXECUTIVE' | 'POAM' | 'MATRIX' | 'QBR' | 'SSP';
}

type ReportType = 'EXECUTIVE' | 'POAM' | 'MATRIX' | 'QBR' | 'SSP';

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

  const openRisks = risks.filter(r => r.status === 'Open');

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

  const getReportHeader = () => {
    switch(activeReport) {
        case 'SSP': return { title: 'System Security Plan (SSP)', citation: 'NIST 800-18 Rev 1 ALIGNED', confidential: true };
        case 'POAM': return { title: 'Plan of Action & Milestones (POA&M)', citation: 'Remediation Roadmap', confidential: true };
        case 'EXECUTIVE': return { title: 'Executive Compliance Summary', citation: 'Cybersecurity Posture Overview', confidential: false };
        case 'MATRIX': return { title: 'Compliance Traceability Matrix', citation: 'Detailed Control Mapping', confidential: false };
        default: return { title: 'Compliance Report', citation: 'Standard Audit Document', confidential: false };
    }
  };

  const headerMeta = getReportHeader();

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-100 overflow-hidden">
      <div className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0 no-print">
        <h2 className="text-lg font-bold text-slate-800 mb-4 px-2 uppercase tracking-widest text-[10px]">Reporting</h2>
        <button onClick={() => setActiveReport('EXECUTIVE')} className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all ${activeReport === 'EXECUTIVE' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>Executive Summary</button>
        <button onClick={() => setActiveReport('SSP')} className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all ${activeReport === 'SSP' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>SSP Document</button>
        <button onClick={() => setActiveReport('POAM')} className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all ${activeReport === 'POAM' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>POA&M Tracker</button>
        <button onClick={() => setActiveReport('MATRIX')} className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all ${activeReport === 'MATRIX' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>Traceability Matrix</button>
        
        <div className="mt-auto pt-4 border-t border-slate-100">
          <button onClick={handlePrint} className="w-full bg-slate-900 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors font-bold text-xs uppercase tracking-widest">
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
        <div className="max-w-4xl mx-auto bg-white shadow-xl p-10 min-h-[800px] print:shadow-none print:min-h-0 border border-slate-200 print:border-0 rounded-2xl">
          <div className="border-b-4 border-slate-900 pb-4 mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                    {headerMeta.title}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{activeFrameworkId}</span>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Generated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <div className="text-right">
                {headerMeta.confidential && <div className="font-black text-slate-900 text-xs uppercase tracking-widest">Confidential</div>}
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{headerMeta.citation}</div>
            </div>
          </div>

          {activeReport === 'SSP' && (
            <div className="space-y-8 text-sm">
               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">System Identification</h4>
                  <p className="font-bold text-slate-900">{sspMetadata?.systemName || 'Not Defined'}</p>
                  <p className="text-slate-500 mt-1">{sspMetadata?.generalDescription || 'No description provided.'}</p>
               </div>
               <div className="space-y-6">
                  {activeFamilies.map(familyId => (
                    <div key={familyId} className="border-b border-slate-100 pb-4">
                      <h3 className="font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                        <Shield size={16} className="text-blue-600"/> {familyId} FAMILY
                      </h3>
                      {filteredRequirements.filter(r => r.family === familyId).map(req => (
                        <div key={req.id} className="mb-4 pl-4 border-l-2 border-slate-100">
                          <div className="flex justify-between font-bold text-xs mb-1">
                            <span className="text-slate-700">{req.id}: {req.title}</span>
                            <span className={getReqStatus(req) === 'met' ? 'text-green-600' : 'text-red-600'}>
                              {getReqStatus(req).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed italic text-[11px] mb-2">{req.description}</p>
                          <div className="bg-slate-50/50 p-2 rounded text-[11px] text-slate-800">
                            {req.response || 'Pending implementation statement.'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeReport === 'EXECUTIVE' && (
            <div className="space-y-10">
                <div className="grid grid-cols-2 gap-8">
                     <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center shadow-sm">
                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Posture Score</div>
                        <div className="text-6xl font-black text-blue-600">
                            {Math.round((filteredRequirements.filter(r => getReqStatus(r) === 'met').length / (filteredRequirements.length || 1)) * 100)}%
                        </div>
                     </div>
                     <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center shadow-sm">
                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Total Gaps</div>
                        <div className="text-6xl font-black text-red-600">{unmetRequirements.length}</div>
                     </div>
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight border-b-2 border-slate-900 pb-2">Compliance by Domain</h3>
                    <div className="space-y-4">
                        {activeFamilies.map((familyId) => {
                            const reqs = filteredRequirements.filter(r => r.family === familyId);
                            const met = reqs.filter(r => getReqStatus(r) === 'met').length;
                            const score = Math.round((met / (reqs.length || 1)) * 100);
                            return (
                                <div key={familyId} className="flex items-center gap-4">
                                    <div className="w-16 font-mono font-black text-slate-400 text-xs">{familyId}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-[10px] mb-1 font-black uppercase text-slate-500">
                                            <span>{familyId} Domain</span>
                                            <span>{score}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-900" style={{ width: `${score}%` }}></div>
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
                     <p className="text-slate-600 text-sm">Unified remediation roadmap for controls currently marked as Gaps or Pending.</p>
                     {onUpdateRequirement && (
                       <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${isEditing ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                         {isEditing ? <><Save size={14} /> Finish Editing</> : <><Edit2 size={14} /> Update Dates</>}
                       </button>
                     )}
                 </div>
                 <table className="w-full text-[10px] text-left border-collapse border border-slate-200">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="border border-slate-700 p-2 w-20 uppercase font-black">ID</th>
                        <th className="border border-slate-700 p-2 uppercase font-black">Weakness / Requirement</th>
                        <th className="border border-slate-700 p-2 w-24 uppercase font-black">Completion</th>
                        <th className="border border-slate-700 p-2 uppercase font-black">Milestones</th>
                        <th className="border border-slate-700 p-2 w-24 uppercase font-black">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                        {unmetRequirements.length === 0 && openRisks.length === 0 && (
                          <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">Zero control gaps identified.</td></tr>
                        )}
                        {unmetRequirements.map(req => (
                            <tr key={req.id} className="even:bg-slate-50">
                                <td className="border border-slate-200 p-2 font-mono font-bold align-top">{req.id}</td>
                                <td className="border border-slate-200 p-2 align-top font-medium">{req.title}</td>
                                <td className="border border-slate-200 p-2 align-top">
                                  {isEditing ? (
                                    <input type="date" className="w-full bg-white border border-slate-300 rounded p-1" value={req.poam?.scheduledCompletionDate || ''} onChange={(e) => handlePoamChange(req, 'scheduledCompletionDate', e.target.value)}/>
                                  ) : (req.poam?.scheduledCompletionDate || 'TBD')}
                                </td>
                                <td className="border border-slate-200 p-2 align-top">
                                  {isEditing ? (
                                    <textarea className="w-full bg-white border border-slate-300 rounded p-1 h-10" value={req.poam?.milestones || ''} onChange={(e) => handlePoamChange(req, 'milestones', e.target.value)}/>
                                  ) : (req.poam?.milestones || '-')}
                                </td>
                                <td className="border border-slate-200 p-2 align-top font-bold uppercase text-[9px] text-red-600">
                                  {req.poam?.status || 'PLANNED'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
          )}

          <div className="mt-20 border-t-2 border-slate-100 pt-6 text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] flex justify-between">
            <span>Quallee Cyber Assurance Platform</span>
            <span>Ref: {activeFrameworkId}-REV-2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};
