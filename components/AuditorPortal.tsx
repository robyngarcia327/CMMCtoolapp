
import React, { useState } from 'react';
import { Requirement, Artifact, Client, Risk, AssessmentObjective } from '../types';
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
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Activity
} from 'lucide-react';

interface AuditorPortalProps {
  client: Client;
  requirements: Requirement[];
  artifacts: Artifact[];
  risks: Risk[];
}

export const AuditorPortal: React.FC<AuditorPortalProps> = ({ client, requirements, artifacts, risks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(2);
  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);
  
  // Fixed: Added missing state variables and handler for the auditor invitation modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [auditorEmail, setAuditorEmail] = useState('');

  const handleInviteAuditor = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invitation sent to ${auditorEmail}`);
    setShowInviteModal(false);
    setAuditorEmail('');
  };

  // --- Filtering ---
  const levelReqs = requirements.filter(r => r.framework === 'NIST-CMMC' && r.cmmcLevel === selectedLevel);
  const filteredReqs = levelReqs.filter(r => 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Metrics ---
  const metReqs = levelReqs.filter(r => r.objectives.every(o => o.status === 'met' || o.status === 'na')).length;
  const score = levelReqs.length > 0 ? Math.round((metReqs / levelReqs.length) * 100) : 0;

  const handleExportPackage = () => {
      alert(`Generating Official Level ${selectedLevel} Assessment Package...`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 overflow-y-auto h-full">
      
      {/* CMMC Branded Header */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center border-b-4 border-blue-600 relative overflow-hidden">
          <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-600 p-2 rounded-lg shadow-lg"><ShieldCheck size={28} /></div>
                  <div>
                      <h1 className="text-3xl font-black tracking-tight">ASSESSOR HUB</h1>
                      <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Cybersecurity Maturity Model Certification</div>
                  </div>
              </div>
              <p className="text-slate-400 max-w-xl mt-4 text-sm leading-relaxed">
                  Third-party review environment for <strong>{client.name}</strong>. 
                  Evaluating compliance against CMMC 2.0 / NIST SP 800-171A standards.
              </p>
          </div>
          
          <div className="relative z-10 flex flex-col items-end gap-4 mt-6 md:mt-0">
               <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                  {[1, 2, 3].map(lvl => (
                      <button 
                        key={lvl}
                        onClick={() => setSelectedLevel(lvl as any)}
                        className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${selectedLevel === lvl ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                          LEVEL {lvl}
                      </button>
                  ))}
               </div>
               <div className="flex gap-3">
                   {/* Fixed: Added button to open invite modal as it was missing a trigger */}
                   <button 
                        onClick={() => setShowInviteModal(true)}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm shadow-xl hover:bg-blue-700 transition-colors"
                    >
                        <UserPlus size={18} /> Invite Auditor
                    </button>
                   <button 
                        onClick={handleExportPackage}
                        className="bg-white text-slate-900 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm shadow-xl hover:bg-slate-100 transition-colors"
                    >
                        <Download size={18} /> Official Certification Bundle
                    </button>
               </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Stats Bar */}
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Level {selectedLevel} Progress</div>
                  <div className={`text-6xl font-black mb-2 ${score === 100 ? 'text-green-600' : 'text-blue-600'}`}>{score}%</div>
                  <div className="text-xs text-slate-500 font-bold">{metReqs} of {levelReqs.length} Controls Met</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-6">
                      <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${score}%` }}></div>
                  </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-sm text-blue-400 uppercase tracking-wider">
                      <Activity size={16} /> Audit Guidelines
                  </h3>
                  <div className="space-y-4">
                      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                          <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Methodology</div>
                          <p className="text-xs leading-relaxed text-slate-300">Satisfy all objectives ([a], [b], etc.) via <strong>Examine</strong>, <strong>Interview</strong>, or <strong>Test</strong>.</p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                          <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Level {selectedLevel} Focus</div>
                          <p className="text-xs leading-relaxed text-slate-300">
                              {selectedLevel === 1 && "FCI basic protection via self-assessment."}
                              {selectedLevel === 2 && "CUI comprehensive protection via C3PAO review."}
                              {selectedLevel === 3 && "APT protection via DIBCAC enhanced review."}
                          </p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Main Review Area */}
          <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
                      <div className="relative flex-1">
                          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                          <input 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Filter controls by ID or Keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                      {filteredReqs.map(req => {
                          const isExpanded = expandedReqId === req.id;
                          const reqMet = req.objectives.every(o => o.status === 'met' || o.status === 'na');
                          const reqArtifacts = artifacts.filter(a => a.requirementId === req.id);

                          return (
                              <div key={req.id} className={`transition-all ${isExpanded ? 'bg-blue-50/30' : ''}`}>
                                  {/* Row Header */}
                                  <div 
                                    onClick={() => setExpandedReqId(isExpanded ? null : req.id)}
                                    className="p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                  >
                                      <div className={`mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown size={20} className="text-slate-400" /></div>
                                      <div className="font-mono font-black text-sm text-slate-400 w-24 shrink-0">{req.id}</div>
                                      <div className="flex-1">
                                          <h4 className="font-bold text-slate-900 leading-snug">{req.title}</h4>
                                          <div className="flex gap-2 mt-1.5">
                                              {reqArtifacts.length > 0 && (
                                                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase border border-indigo-100 flex items-center gap-1">
                                                      <FileText size={10}/> {reqArtifacts.length} Artifacts
                                                  </span>
                                              )}
                                              {req.cmmcLevel === 3 && (
                                                  <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase border border-amber-100">Enhanced</span>
                                              )}
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-3 shrink-0">
                                          <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border-2 ${
                                              reqMet ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                          }`}>
                                              {reqMet ? 'MET' : 'GAP'}
                                          </span>
                                      </div>
                                  </div>

                                  {/* Expanded Objective Detail */}
                                  {isExpanded && (
                                      <div className="px-14 pb-8 pt-2 animate-in fade-in slide-in-from-top-2">
                                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                                              <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                                                  <h5 className="text-xs font-black uppercase tracking-widest">Assessment Objectives</h5>
                                                  <div className="text-[10px] text-slate-400">DOD GUIDE REF: NIST SP 800-171A</div>
                                              </div>
                                              <div className="divide-y divide-slate-100">
                                                  {req.objectives.map(obj => (
                                                      <div key={obj.id} className="p-4 flex items-start gap-4">
                                                          <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] border-2 ${
                                                              obj.status === 'met' ? 'bg-green-500 border-green-500 text-white' : 'bg-slate-100 border-slate-200 text-slate-400'
                                                          }`}>
                                                              {obj.id.toUpperCase()}
                                                          </div>
                                                          <div className="flex-1 text-sm text-slate-700 font-medium">{obj.description}</div>
                                                          {obj.method && (
                                                              <div className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 uppercase border border-slate-200">
                                                                  {obj.method}
                                                              </div>
                                                          )}
                                                      </div>
                                                  ))}
                                              </div>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                              <div>
                                                  <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                      <Lock size={14}/> Implementation Narrative
                                                  </h5>
                                                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 italic leading-relaxed min-h-[100px]">
                                                      {req.response || "No narrative provided by the organization."}
                                                  </div>
                                              </div>
                                              <div>
                                                  <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                      <FileText size={14}/> Evidence Artifacts
                                                  </h5>
                                                  <div className="space-y-2">
                                                      {reqArtifacts.map(art => (
                                                          <button key={art.id} className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-sm group">
                                                              <div className="flex items-center gap-3">
                                                                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Eye size={16}/></div>
                                                                  <span className="font-bold text-slate-800">{art.name}</span>
                                                              </div>
                                                              <Download size={16} className="text-slate-400 group-hover:text-blue-600" />
                                                          </button>
                                                      ))}
                                                      {reqArtifacts.length === 0 && <div className="text-center py-6 text-slate-400 italic text-sm bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">No evidence uploaded for this control.</div>}
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          );
                      })}
                      {filteredReqs.length === 0 && <div className="p-12 text-center text-slate-400 italic">No matching requirements found in Level {selectedLevel}.</div>}
                  </div>
              </div>
          </div>
      </div>

      {/* Invite Modal (Legacy logic) */}
      {showInviteModal && (
          <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border-t-8 border-blue-600">
                  <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                      <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                          <UserPlus size={18} /> Grant Secure Access
                      </h3>
                      <button onClick={() => setShowInviteModal(false)} className="text-white/70 hover:text-white"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleInviteAuditor} className="p-8 space-y-6">
                      <p className="text-sm text-slate-500 leading-relaxed">
                          Provide the official <strong>.gov</strong> or authorized agency email address to initiate a cryptographically secure session invitation.
                      </p>
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Official Auditor Email</label>
                          <div className="relative">
                              <Mail className="absolute left-4 top-3 text-slate-400" size={18} />
                              <input 
                                type="email" 
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                                placeholder="assessor@dcma.mil"
                                value={auditorEmail}
                                onChange={e => setAuditorEmail(e.target.value)}
                                required
                              />
                          </div>
                      </div>
                      <div className="flex gap-4 pt-2">
                          <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                          <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg">Send Invite</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};
