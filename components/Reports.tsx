
import React, { useState } from 'react';
import { Requirement, PoamEntry, Artifact, SspMetadata } from '../types';
import { Printer, BarChart3, AlertOctagon, CheckSquare, Presentation, ShieldCheck, XCircle, Edit2, Save, X, FileText, Lock, Shield, Info, Building, Globe } from 'lucide-react';

interface ReportsProps {
  requirements: Requirement[];
  artifacts?: Artifact[];
  activeFrameworkId: string;
  onUpdateRequirement?: (req: Requirement) => void;
  sspMetadata?: SspMetadata;
}

type ReportType = 'EXECUTIVE' | 'POAM' | 'MATRIX' | 'QBR' | 'SSP';

export const Reports: React.FC<ReportsProps> = ({ requirements, artifacts = [], activeFrameworkId, onUpdateRequirement, sspMetadata }) => {
  const [activeReport, setActiveReport] = useState<ReportType>('EXECUTIVE');
  const [isEditing, setIsEditing] = useState(false);

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

  const getFamilyScore = (familyId: string) => {
     const reqs = filteredRequirements.filter(r => r.family === familyId);
     if (!reqs.length) return 0;
     const met = reqs.filter(r => getReqStatus(r) === 'met').length;
     return Math.round((met / reqs.length) * 100);
  };

  const activeFamilies: string[] = (Array.from(new Set(filteredRequirements.map(r => r.family))) as string[]).sort();

  const handlePrint = () => window.print();

  const handlePoamChange = (req: Requirement, field: keyof PoamEntry, value: string) => {
      if (onUpdateRequirement) {
          const updatedPoam = { ...req.poam, [field]: value };
          onUpdateRequirement({ ...req, poam: updatedPoam });
      }
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-100 overflow-hidden">
      <div className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0 no-print">
        <h2 className="text-lg font-bold text-slate-800 mb-4 px-2">Compliance Reports</h2>
        <button onClick={() => setActiveReport('EXECUTIVE')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'EXECUTIVE' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><BarChart3 size={18} /> Executive Summary</button>
        <button onClick={() => setActiveReport('SSP')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'SSP' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Shield size={18} /> System Security Plan</button>
        <button onClick={() => setActiveReport('QBR')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'QBR' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Presentation size={18} /> Audit Readiness (QBR)</button>
        <button onClick={() => setActiveReport('POAM')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'POAM' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><AlertOctagon size={18} /> POA&M</button>
        <button onClick={() => setActiveReport('MATRIX')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeReport === 'MATRIX' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><CheckSquare size={18} /> Compliance Matrix</button>
        <div className="mt-auto pt-4 border-t border-slate-100"><button onClick={handlePrint} className="w-full bg-slate-900 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors font-bold text-sm"><Printer size={16} /> Print / PDF</button></div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
        <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 min-h-[800px] print:shadow-none print:min-h-0 border border-slate-200 print:border-0">
          <div className="border-b-4 border-slate-900 pb-4 mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                    {activeReport === 'EXECUTIVE' && 'Executive Compliance Summary'}
                    {activeReport === 'QBR' && 'Audit Readiness Scorecard'}
                    {activeReport === 'POAM' && 'Plan of Action & Milestones (POA&M)'}
                    {activeReport === 'MATRIX' && 'Compliance Traceability Matrix'}
                    {activeReport === 'SSP' && 'System Security Plan (SSP)'}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{activeFrameworkId}</span>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Generated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="font-black text-slate-900 text-xs uppercase tracking-widest">Confidential</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">NIST 800-18 Rev 1 ALIGNED</div>
            </div>
          </div>

          {activeReport === 'SSP' && (
            <div className="space-y-12">
               {/* NIST 800-18 Identification Blocks */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-5 bg-slate-50 border rounded-xl">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2"><Info size={12}/> System Information</h4>
                      <div className="space-y-3">
                          <div>
                              <div className="text-[11px] text-slate-500 font-bold uppercase">System Name / ID</div>
                              <div className="text-sm font-black text-slate-900">{sspMetadata?.systemName || 'Not Set'} ({sspMetadata?.systemIdentifier || 'ID-XXX'})</div>
                          </div>
                          <div>
                              <div className="text-[11px] text-slate-500 font-bold uppercase">System Type</div>
                              <div className="text-sm font-bold text-slate-800">{sspMetadata?.systemType || 'General Support System'}</div>
                          </div>
                          <div>
                              <div className="text-[11px] text-slate-500 font-bold uppercase">Operational Status</div>
                              <div className="text-sm font-bold text-slate-800">{sspMetadata?.operationalStatus || 'Operational'}</div>
                          </div>
                      </div>
                  </div>
                  <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl">
                      <h4 className="text-[10px] font-black text-blue-400 uppercase mb-3 flex items-center gap-2"><Shield size={12}/> FIPS 199 Categorization</h4>
                      <div className="flex items-center gap-4 mb-4">
                          {['LOW', 'MODERATE', 'HIGH'].map(lvl => (
                              <div key={lvl} className={`px-3 py-1 rounded font-black text-xs border-2 ${sspMetadata?.categorization === lvl ? 'bg-blue-600 text-white border-blue-700 shadow-md' : 'bg-white text-slate-300 border-slate-200'}`}>
                                  {lvl}
                              </div>
                          ))}
                      </div>
                      <p className="text-[10px] text-slate-500 italic">Determined by the "High Watermark" of Confidentiality, Integrity, and Availability impact levels.</p>
                  </div>
               </div>

               <div className="p-5 bg-slate-900 text-white rounded-xl mb-8">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase mb-2 flex items-center gap-2"><Globe size={12}/> System Environment & Boundaries</h4>
                  <p className="text-sm text-slate-300 leading-relaxed italic">{sspMetadata?.systemEnvironment || 'No environment description provided. Describe hardware, software, and physical boundaries here.'}</p>
               </div>

               {/* Control Groups */}
               {activeFamilies.map(familyId => {
                  const familyReqs = filteredRequirements.filter(r => r.family === familyId);
                  return (
                    <div key={familyId} className="space-y-6">
                      <h2 className="text-xl font-black text-slate-900 border-b-2 border-slate-900 pb-2 uppercase tracking-tight flex items-center gap-2">
                        <Lock size={20} className="text-blue-600"/> {familyId} - {familyReqs[0]?.family || "Domain"}
                      </h2>
                      <div className="space-y-8">
                        {familyReqs.map(req => {
                          const reqMet = getReqStatus(req) === 'met';
                          const reqArtifacts = artifacts.filter(a => a.requirementId === req.id);
                          return (
                            <div key={req.id} className="page-break-inside-avoid">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs font-black bg-slate-900 text-white px-2 py-0.5 rounded">{req.id}</span>
                                  <h3 className="font-bold text-slate-800">{req.title}</h3>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${reqMet ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                  {reqMet ? 'Implemented' : 'Not Implemented'}
                                </span>
                              </div>
                              <div className="bg-white border-l-4 border-slate-200 pl-4 py-1 space-y-4">
                                <div><h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Requirement Statement</h4><p className="text-xs text-slate-600 italic">{req.description}</p></div>
                                <div><h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Implementation Statement</h4><div className="text-sm text-slate-800 font-medium leading-relaxed">{req.response || <span className="text-red-500 font-bold italic">REMEDIATION REQUIRED: No implementation statement provided.</span>}</div></div>
                                {reqArtifacts.length > 0 && (
                                  <div>
                                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Verification Artifacts</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-0.5">{reqArtifacts.map(art => (<li key={art.id} className="flex items-center gap-1"><FileText size={10} className="text-blue-500" /> {art.name} ({new Date(art.timestamp).toLocaleDateString()})</li>))}</ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
               })}
            </div>
          )}

          {activeReport === 'POAM' && (
            <div>
                 <div className="flex justify-between items-start mb-6 no-print">
                     <p className="text-slate-600 text-sm">Identifies information system security weaknesses and remediation tasks.</p>
                     {onUpdateRequirement && (<button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${isEditing ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-50'}`}>{isEditing ? <><Save size={14} /> Save Entries</> : <><Edit2 size={14} /> Edit Table</>}</button>)}
                 </div>
                 <table className="w-full text-[11px] text-left border-collapse border border-slate-300">
                    <thead className="bg-slate-900 text-white"><tr><th className="border border-slate-400 p-2 w-20 uppercase font-black">ID</th><th className="border border-slate-400 p-2 w-1/3 uppercase font-black">Weakness</th><th className="border border-slate-400 p-2 uppercase font-black">Scheduled Date</th><th className="border border-slate-400 p-2 uppercase font-black">Milestones</th><th className="border border-slate-400 p-2 uppercase font-black">Status</th></tr></thead>
                    <tbody>
                        {unmetRequirements.length === 0 && (<tr><td colSpan={5} className="p-8 text-center text-slate-500 italic font-medium">No open POA&M items.</td></tr>)}
                        {unmetRequirements.map(req => (
                            <tr key={req.id} className="even:bg-slate-50">
                                <td className="border border-slate-300 p-2 font-mono font-bold align-top text-slate-900">{req.id}</td>
                                <td className="border border-slate-300 p-2 align-top">{isEditing ? (<textarea className="w-full border rounded p-1 text-[10px] font-sans" value={req.poam?.weaknessName || req.title} onChange={(e) => handlePoamChange(req, 'weaknessName', e.target.value)}/>) : (<div className="font-bold mb-1 text-slate-800">{req.poam?.weaknessName || req.title}</div>)}{!isEditing && <div className="text-[10px] text-slate-500 leading-tight">{req.description}</div>}</td>
                                <td className="border border-slate-300 p-2 align-top text-slate-600 font-bold">{isEditing ? (<input type="date" className="w-full border rounded p-1 text-[10px]" value={req.poam?.scheduledCompletionDate || ''} onChange={(e) => handlePoamChange(req, 'scheduledCompletionDate', e.target.value)}/>) : (req.poam?.scheduledCompletionDate || 'TBD')}</td>
                                <td className="border border-slate-300 p-2 align-top text-slate-600">{isEditing ? (<textarea className="w-full border rounded p-1 text-[10px]" placeholder="Milestones..." value={req.poam?.milestones || ''} onChange={(e) => handlePoamChange(req, 'milestones', e.target.value)}/>) : (req.poam?.milestones || '-')}</td>
                                <td className="border border-slate-300 p-2 align-top font-black text-[10px]">{isEditing ? (<select className="w-full border rounded p-1 text-[10px]" value={req.poam?.status || 'Planned'} onChange={(e) => handlePoamChange(req, 'status', e.target.value)}><option>Planned</option><option>Ongoing</option><option>Delayed</option><option>Risk Accepted</option></select>) : (<span className={req.poam?.status === 'Ongoing' ? 'text-blue-600' : req.poam?.status === 'Delayed' ? 'text-red-600' : 'text-slate-600'}>{req.poam?.status?.toUpperCase() || 'PLANNED'}</span>)}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
          )}

          <div className="mt-12 border-t-2 border-slate-100 pt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex justify-between">
            <span>&copy; {new Date().getFullYear()} Cuallee Cyber Compliance Report</span>
            <span>Document Integrity Verified // Ref: NIST 800-18 Rev 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
