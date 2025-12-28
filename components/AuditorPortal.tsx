
import React, { useState } from 'react';
import { Requirement, Artifact, Client, Risk } from '../types';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertOctagon, 
  Search, 
  Lock, 
  ExternalLink, 
  Briefcase, 
  UserPlus, 
  Mail, 
  X, 
  Check, 
  ShieldAlert,
  Clock
} from 'lucide-react';

interface AuditorPortalProps {
  client: Client;
  requirements: Requirement[];
  artifacts: Artifact[];
  risks: Risk[];
}

export const AuditorPortal: React.FC<AuditorPortalProps> = ({ client, requirements, artifacts, risks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [auditorEmail, setAuditorEmail] = useState('');
  const [activeAuditors, setActiveAuditors] = useState<{email: string, date: string}[]>([
      { email: 'c3pao-reviewer@assessor.gov', date: '2024-05-10' }
  ]);

  // --- Metrics ---
  const totalReqs = requirements.length;
  const metReqs = requirements.filter(r => r.objectives.every(o => o.status === 'met' || o.status === 'na')).length;
  const implementationScore = totalReqs > 0 ? Math.round((metReqs / totalReqs) * 100) : 0;
  
  const evidenceCount = artifacts.length;
  const openPoamItems = requirements.filter(r => r.objectives.some(o => o.status === 'not_met')).length;

  // --- Filtering ---
  const filteredReqs = requirements.filter(r => 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteAuditor = (e: React.FormEvent) => {
      e.preventDefault();
      if (!auditorEmail) return;
      setActiveAuditors([...activeAuditors, { email: auditorEmail, date: new Date().toISOString().split('T')[0] }]);
      setAuditorEmail('');
      setShowInviteModal(false);
      alert(`Access granted to ${auditorEmail}. They will receive an automated secure login link.`);
  };

  const handleExportPackage = () => {
      alert("Generating C3PAO Audit Package (SSP + Evidence Matrix + Artifacts)... \n\n(This would download a ZIP file in production)");
  };

  const removeAuditor = (email: string) => {
      if (confirm(`Revoke access for ${email}?`)) {
          setActiveAuditors(activeAuditors.filter(a => a.email !== email));
      }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 overflow-y-auto h-full">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
          <div className="relative z-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <div className="bg-blue-600 p-2 rounded-lg"><ShieldCheck size={24} /></div>
                  <h1 className="text-3xl font-bold">Auditor Review Portal</h1>
              </div>
              <p className="text-slate-400 max-w-xl">
                  Welcome to the {client.name} assessment environment. 
                  This portal aggregates all controls, evidence, and system plans for specialized review.
              </p>
          </div>
          <div className="relative z-10 flex flex-col items-center md:items-end gap-3 mt-6 md:mt-0">
              <div className="text-center md:text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment Target</div>
                  <div className="font-bold text-xl">{client.primaryFramework}</div>
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all"
                  >
                      <UserPlus size={18} /> Grant Auditor Access
                  </button>
                  <button 
                    onClick={handleExportPackage}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-900/50"
                  >
                      <Download size={18} /> Download Audit Package
                  </button>
              </div>
          </div>
          <Briefcase className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 rotate-12 hidden lg:block" />
      </div>

      {/* Active Auditor Access Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Lock size={18} className="text-blue-600"/> Active Auditor Sessions</h3>
                  <div className="space-y-4">
                      {activeAuditors.map(auditor => (
                          <div key={auditor.email} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                              <div>
                                  <div className="text-sm font-bold text-slate-900 truncate max-w-[180px]">{auditor.email}</div>
                                  <div className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={10}/> Granted: {auditor.date}</div>
                              </div>
                              <button onClick={() => removeAuditor(auditor.email)} className="text-slate-400 hover:text-red-500 p-1"><X size={16}/></button>
                          </div>
                      ))}
                      {activeAuditors.length === 0 && <p className="text-center text-slate-400 text-sm italic py-4">No active auditor sessions.</p>}
                  </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
                  <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><ShieldAlert size={18}/> Reviewer Guidance</h4>
                  <ul className="text-xs text-indigo-800 space-y-3 leading-relaxed">
                      <li className="flex gap-2"><span>•</span> <strong>Read-Only:</strong> Auditor logins are strictly read-only and cannot modify your data.</li>
                      <li className="flex gap-2"><span>•</span> <strong>Log Retention:</strong> Every click and file download by an auditor is logged for your internal audit trail.</li>
                      <li className="flex gap-2"><span>•</span> <strong>CUI Redaction:</strong> Artifacts marked as "Contains CUI" require an additional MFA challenge for reviewers.</li>
                  </ul>
              </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
              {/* Readiness Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Implementation</h3>
                      <div className="text-4xl font-bold text-slate-900 mb-1">{implementationScore}%</div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${implementationScore}%` }}></div>
                      </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Evidence Coverage</h3>
                      <div className="text-4xl font-bold text-slate-900 mb-1">{Math.round((evidenceCount/totalReqs)*100) || 0}%</div>
                      <div className="text-xs text-slate-400">{evidenceCount} total artifacts</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Gaps to Mitigate</h3>
                      <div className="text-4xl font-bold text-red-600 mb-1">{openPoamItems}</div>
                      <div className="text-xs text-slate-400">Items currently on POA&M</div>
                  </div>
              </div>

              {/* Core Audit Items */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-slate-50 gap-4">
                      <h3 className="font-bold text-slate-800 text-lg">Detailed Control Implementation</h3>
                      <div className="relative w-full md:w-64">
                          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                          <input 
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Search controls..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                  </div>
                  
                  <div className="overflow-x-auto max-h-[600px]">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-white text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
                              <tr>
                                  <th className="p-4 w-24">ID</th>
                                  <th className="p-4 w-1/2">Implementation Narrative</th>
                                  <th className="p-4">Evidence</th>
                                  <th className="p-4 text-right">Status</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {filteredReqs.map(req => {
                                  const reqArtifacts = artifacts.filter(a => a.requirementId === req.id);
                                  const isMet = req.objectives.every(o => o.status === 'met' || o.status === 'na');
                                  
                                  return (
                                      <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                                          <td className="p-4 font-mono font-bold text-slate-700 align-top">{req.id}</td>
                                          <td className="p-4 align-top">
                                              <div className="font-bold text-slate-900 mb-1">{req.title}</div>
                                              <div className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 p-2 rounded italic">
                                                  {req.response || "No implementation statement provided."}
                                              </div>
                                          </td>
                                          <td className="p-4 align-top">
                                              {reqArtifacts.length > 0 ? (
                                                  <div className="space-y-1.5">
                                                      {reqArtifacts.map(art => (
                                                          <button key={art.id} className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded w-full text-left">
                                                              <FileText size={12} />
                                                              <span className="truncate max-w-[120px]">{art.name}</span>
                                                              {art.containsCui && <Lock size={10} className="text-red-500 ml-auto shrink-0" />}
                                                          </button>
                                                      ))}
                                                  </div>
                                              ) : (
                                                  <span className="text-slate-400 italic text-xs">Missing Evidence</span>
                                              )}
                                          </td>
                                          <td className="p-4 text-right align-top">
                                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                  isMet ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                              }`}>
                                                  {isMet ? <CheckCircle2 size={10} /> : <AlertOctagon size={10} />}
                                                  {isMet ? 'Pass' : 'Gap'}
                                              </span>
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </div>

      {/* Invite Auditor Modal */}
      {showInviteModal && (
          <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                      <h3 className="font-bold flex items-center gap-2"><UserPlus size={20} /> Grant Access</h3>
                      <button onClick={() => setShowInviteModal(false)} className="text-white/70 hover:text-white"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleInviteAuditor} className="p-6 space-y-4">
                      <p className="text-sm text-slate-500">Provide an auditor's official email address to grant them secure, read-only access to this portal.</p>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Auditor Email</label>
                          <div className="relative">
                              <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                              <input 
                                type="email" 
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="name@auditor-agency.gov"
                                value={auditorEmail}
                                onChange={e => setAuditorEmail(e.target.value)}
                                required
                              />
                          </div>
                      </div>
                      <div className="pt-4 flex gap-3">
                          <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                          <button type="submit" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">Send Secure Invite</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};
