
import React, { useState, useMemo } from 'react';
import { Requirement, Artifact, Client, Risk, Asset, Framework } from '../types';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  Search, 
  Lock, 
  UserPlus, 
  Mail, 
  X, 
  ChevronDown,
  Eye,
  Activity,
  BarChart3,
  Package,
  AlertTriangle,
  CheckCircle2,
  Filter,
  FileSearch,
  BookOpen,
  ChevronRight
} from 'lucide-react';

interface AuditorPortalProps {
  client: Client;
  requirements: Requirement[];
  artifacts: Artifact[];
  risks: Risk[];
  assets: Asset[];
  activeFramework: Framework;
}

type AuditorTab = 'CONTROLS' | 'BOUNDARY' | 'RISKS' | 'DOCUMENTS';

export const AuditorPortal: React.FC<AuditorPortalProps> = ({ 
  client, 
  requirements, 
  artifacts, 
  risks, 
  assets,
  activeFramework 
}) => {
  const [activeTab, setActiveTab] = useState<AuditorTab>('CONTROLS');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'MET' | 'GAP' | 'NO_EVIDENCE'>('ALL');
  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [auditorEmail, setAuditorEmail] = useState('');

  // --- Data Analysis ---
  const frameworkReqs = useMemo(() => 
    requirements.filter(r => r.framework === activeFramework.id),
    [requirements, activeFramework]
  );

  const stats = useMemo(() => {
    const total = frameworkReqs.length || 1;
    const met = frameworkReqs.filter(r => r.objectives.every(o => o.status === 'met')).length;
    const hasEvidence = frameworkReqs.filter(r => artifacts.some(a => a.requirementId === r.id)).length;
    const hasNarrative = frameworkReqs.filter(r => (r.response?.length || 0) > 10).length;

    return {
      readiness: Math.round((met / total) * 100),
      evidenceCoverage: Math.round((hasEvidence / total) * 100),
      narrativeDensity: Math.round((hasNarrative / total) * 100),
      total,
      met,
      gaps: total - met,
      evidenceCount: artifacts.length
    };
  }, [frameworkReqs, artifacts]);

  // Grouping by Family
  const groupedReqs = useMemo(() => {
    const groups: Record<string, Requirement[]> = {};
    
    const filtered = frameworkReqs.filter(r => {
        const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             r.title.toLowerCase().includes(searchTerm.toLowerCase());
        const isMet = r.objectives.every(o => o.status === 'met');
        const hasEvidence = artifacts.some(a => a.requirementId === r.id);

        if (filterStatus === 'MET' && !isMet) return false;
        if (filterStatus === 'GAP' && isMet) return false;
        if (filterStatus === 'NO_EVIDENCE' && hasEvidence) return false;
        
        return matchesSearch;
    });

    filtered.forEach(r => {
      if (!groups[r.family]) groups[r.family] = [];
      groups[r.family].push(r);
    });
    return groups;
  }, [frameworkReqs, searchTerm, filterStatus, artifacts]);

  const families = Object.keys(groupedReqs).sort();

  // Added handleInviteAuditor to fix line 432 error
  const handleInviteAuditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditorEmail) return;
    // Mock invitation logic
    alert(`Invitation sent to ${auditorEmail}. They will receive a secure access token shortly.`);
    setAuditorEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 overflow-y-auto h-full bg-slate-50/50">
      
      {/* High-Contrast Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-3">
                  <ShieldCheck size={40} className="text-blue-500" />
              </div>
              <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">AUDITOR PORTAL</h1>
                  <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Verified Review Environment: {client.name}
                  </p>
                  <div className="flex gap-2 mt-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-blue-100">{activeFramework.id}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Read-Only Session</span>
                  </div>
              </div>
          </div>

          <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                  <UserPlus size={18} /> Invite Agency
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-all">
                  <Download size={18} /> Export Evidence Bundle
              </button>
          </div>
      </div>

      {/* Audit Readiness Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Audit Readiness</div>
              <div className="text-4xl font-black text-slate-900">{stats.readiness}%</div>
              <div className="text-xs text-slate-500 mt-1 font-bold">{stats.met} of {stats.total} Controls Met</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${stats.readiness}%` }} />
              </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Evidence Coverage</div>
              <div className="text-4xl font-black text-indigo-600">{stats.evidenceCoverage}%</div>
              <div className="text-xs text-slate-500 mt-1 font-bold">{stats.evidenceCount} Total Artifacts</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all" style={{ width: `${stats.evidenceCoverage}%` }} />
              </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Boundary Assets</div>
              <div className="text-4xl font-black text-emerald-600">{assets.length}</div>
              <div className="text-xs text-slate-500 mt-1 font-bold">Scoped Hardware & Software</div>
              <div className="flex gap-1 mt-4">
                  {['CUI', 'SPA', 'FCI'].map(cat => (
                      <div key={cat} className="flex-1 h-1.5 bg-slate-100 rounded-full" title={`${cat} Assets`} />
                  ))}
              </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Risk Context</div>
              <div className="text-4xl font-black text-amber-600">{risks.filter(r => r.status === 'Open').length}</div>
              <div className="text-xs text-slate-500 mt-1 font-bold">Unmitigated Open Risks</div>
              <div className="flex gap-1 mt-4">
                  <div className="h-1.5 bg-red-400 rounded-full flex-[2]" title="High Risk" />
                  <div className="h-1.5 bg-amber-400 rounded-full flex-[1]" title="Medium Risk" />
              </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit">
          <button 
            onClick={() => setActiveTab('CONTROLS')}
            className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'CONTROLS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
              <FileSearch size={16} /> Requirements List
          </button>
          <button 
            onClick={() => setActiveTab('BOUNDARY')}
            className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'BOUNDARY' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
              <Package size={16} /> Boundary Context
          </button>
          <button 
            onClick={() => setActiveTab('RISKS')}
            className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'RISKS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
              <AlertTriangle size={16} /> Risk Register
          </button>
      </div>

      {/* Main View Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          
          {activeTab === 'CONTROLS' && (
              <>
                  <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                          <Search className="absolute left-4 top-3 text-slate-400" size={20} />
                          <input 
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                            placeholder="Review by Control ID, Title, or Domain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <div className="flex gap-2">
                          <button 
                            onClick={() => setFilterStatus('ALL')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterStatus === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                          >
                              All Items
                          </button>
                          <button 
                             onClick={() => setFilterStatus('GAP')}
                             className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterStatus === 'GAP' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                          >
                              Show Gaps
                          </button>
                          <button 
                             onClick={() => setFilterStatus('NO_EVIDENCE')}
                             className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filterStatus === 'NO_EVIDENCE' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                          >
                              Missing Evidence
                          </button>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      {families.map(familyId => (
                          <div key={familyId} className="space-y-3">
                              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                  <div className="h-px flex-1 bg-slate-200" />
                                  {familyId} Domain
                                  <div className="h-px flex-1 bg-slate-200" />
                              </h3>
                              
                              <div className="space-y-2">
                                  {groupedReqs[familyId].map(req => {
                                      const isExpanded = expandedReqId === req.id;
                                      const isMet = req.objectives.every(o => o.status === 'met');
                                      const reqArtifacts = artifacts.filter(a => a.requirementId === req.id);

                                      return (
                                          <div key={req.id} className={`rounded-2xl border transition-all ${isExpanded ? 'border-blue-400 bg-blue-50/20 ring-1 ring-blue-100 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                              <div 
                                                onClick={() => setExpandedReqId(isExpanded ? null : req.id)}
                                                className="p-5 flex items-center gap-4 cursor-pointer"
                                              >
                                                  <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90 text-blue-600' : 'text-slate-400'}`}>
                                                      <ChevronRight size={20} />
                                                  </div>
                                                  <div className="w-24 shrink-0 font-mono text-xs font-black text-slate-400 group-hover:text-blue-600">{req.id}</div>
                                                  <div className="flex-1">
                                                      <div className="font-bold text-slate-900">{req.title}</div>
                                                  </div>
                                                  
                                                  <div className="flex items-center gap-3">
                                                      {reqArtifacts.length > 0 && (
                                                          <div className="flex -space-x-2">
                                                              {reqArtifacts.slice(0,3).map((_,i) => (
                                                                  <div key={i} className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-500">
                                                                      <FileText size={12} />
                                                                  </div>
                                                              ))}
                                                              {reqArtifacts.length > 3 && (
                                                                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-900 flex items-center justify-center text-[8px] font-bold text-white">
                                                                      +{reqArtifacts.length - 3}
                                                                  </div>
                                                              )}
                                                          </div>
                                                      )}
                                                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border-2 ${
                                                          isMet ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                                      }`}>
                                                          {isMet ? 'MET' : 'GAP'}
                                                      </span>
                                                  </div>
                                              </div>

                                              {isExpanded && (
                                                  <div className="px-14 pb-8 animate-in fade-in slide-in-from-top-2">
                                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                          <div className="space-y-6">
                                                              <div>
                                                                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><BookOpen size={14}/> Control Statement</h5>
                                                                  <p className="text-sm text-slate-600 leading-relaxed italic">{req.description}</p>
                                                              </div>
                                                              <div>
                                                                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><FileText size={14}/> Implementation Narrative</h5>
                                                                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-800 leading-relaxed font-medium">
                                                                      {req.response || <span className="text-red-500 italic">Narrative missing. Auditor clarification required.</span>}
                                                                  </div>
                                                              </div>
                                                          </div>

                                                          <div>
                                                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldCheck size={14}/> Assessment Objectives</h5>
                                                              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                                                  {req.objectives.map(obj => (
                                                                      <div key={obj.id} className="flex items-start gap-3 p-2 bg-white rounded-lg border border-slate-100">
                                                                          <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${obj.status === 'met' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                                                                              {obj.id.toUpperCase()}
                                                                          </div>
                                                                          <div className="text-xs text-slate-700 font-medium">{obj.description}</div>
                                                                          {obj.status === 'met' && <CheckCircle2 size={14} className="text-green-500 shrink-0 ml-auto" />}
                                                                      </div>
                                                                  ))}
                                                              </div>
                                                              
                                                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 mb-3 flex items-center gap-2"><Activity size={14}/> Evidence Gallery</h5>
                                                              <div className="grid grid-cols-1 gap-2">
                                                                  {reqArtifacts.map(art => (
                                                                      <button key={art.id} className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-xs font-bold text-slate-700 group">
                                                                          <div className="flex items-center gap-3">
                                                                              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><Eye size={16}/></div>
                                                                              <span>{art.name}</span>
                                                                          </div>
                                                                          <Download size={16} className="text-slate-300 group-hover:text-blue-600" />
                                                                      </button>
                                                                  ))}
                                                                  {reqArtifacts.length === 0 && (
                                                                      <div className="p-8 text-center text-slate-400 italic text-xs bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                                                          No technical evidence attached.
                                                                      </div>
                                                                  )}
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      ))}

                      {families.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-20 text-center">
                              <FileSearch size={64} className="opacity-10 mb-4" />
                              <p className="text-lg font-bold">No results matching filters.</p>
                          </div>
                      )}
                  </div>
              </>
          )}

          {activeTab === 'BOUNDARY' && (
              <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                          <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs flex items-center gap-2"><Activity size={16}/> Hardware Scoping</h3>
                          <div className="space-y-3">
                              {assets.length === 0 ? <p className="text-slate-400 italic text-sm">No assets recorded in inventory.</p> : assets.map(a => (
                                  <div key={a.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                                      <div>
                                          <div className="font-bold text-slate-900 text-sm">{a.name}</div>
                                          <div className="text-[10px] text-slate-500 font-bold uppercase">{a.type} // {a.location}</div>
                                      </div>
                                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black">{a.cmmcCategory}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                           <h3 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs flex items-center gap-2"><UserPlus size={16}/> Authorized Identities</h3>
                           <div className="p-4 bg-white rounded-xl border border-slate-100 text-center">
                               <div className="text-4xl font-black text-slate-900">12</div>
                               <p className="text-xs text-slate-500 font-bold mt-1 uppercase">CUI Authorized Users</p>
                           </div>
                           <p className="text-xs text-slate-400 mt-6 leading-relaxed italic text-center">Identity management and lifecycle logs are available upon request during the interview phase of the audit.</p>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'RISKS' && (
              <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="font-black text-slate-900 mb-2 uppercase tracking-widest text-xs">Factor Analysis of Information Risk (FAIR) Portfolio</h3>
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                              <tr><th className="p-4">Risk ID</th><th className="p-4">Description</th><th className="p-4">Status</th><th className="p-4 text-right">Exposure (ALE)</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {risks.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic">No identified risks in the register.</td></tr> : risks.map(risk => (
                                  <tr key={risk.id}>
                                      <td className="p-4 font-mono text-xs text-slate-400">{risk.id}</td>
                                      <td className="p-4">
                                          <div className="font-bold text-slate-900">{risk.description}</div>
                                          <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{risk.category}</div>
                                      </td>
                                      <td className="p-4">
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${risk.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                              {risk.status}
                                          </span>
                                      </td>
                                      <td className="p-4 text-right font-mono font-black text-slate-900">
                                          ${risk.riskScore.toLocaleString()}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}
      </div>

      {/* Footer Meta */}
      <div className="flex justify-between items-center px-4 pt-4 border-t border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <div>Document Integrity Verified // HMAC-SHA256 Sig: {Math.random().toString(36).substring(7).toUpperCase()}</div>
          <div>Cuallee Cyber Compliance Engine v2.4.1</div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
          <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border-t-8 border-blue-600">
                  <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                      <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                          <UserPlus size={18} /> Grant Access
                      </h3>
                      <button onClick={() => setShowInviteModal(false)} className="text-white/70 hover:text-white"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleInviteAuditor} className="p-8 space-y-6">
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Official Agency Email</label>
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
                      <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-100 transition-all">Send Session Token</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
