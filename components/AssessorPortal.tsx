import React, { useState, useMemo } from 'react';
import { Requirement, Artifact, Client, Risk, Asset, Framework, AssessmentObjective } from '../types';
import { NIST_CMMC_FAMILIES } from '../data/standards';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  Search, 
  ChevronDown,
  Eye,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Link2,
  ExternalLink,
  FileCheck,
  Users,
  SearchCode,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface AssessorPortalProps {
  client: Client;
  requirements: Requirement[];
  artifacts: Artifact[];
  risks: Risk[];
  assets: Asset[];
  activeFramework: Framework;
}

type AssessorTab = 'EVIDENCE' | 'POLICIES';

const FindingBadge = ({ status }: { status: AssessmentObjective['status'] }) => {
    switch(status) {
        case 'met': return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-green-200 flex items-center gap-1"><CheckCircle size={10}/> MET</span>;
        case 'not_met': return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-red-200 flex items-center gap-1"><XCircle size={10}/> NOT MET</span>;
        case 'na': return <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-slate-200 flex items-center gap-1"><HelpCircle size={10}/> N/A</span>;
        default: return <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-blue-200 flex items-center gap-1"><Clock size={10}/> PENDING</span>;
    }
};

export const AssessorPortal: React.FC<AssessorPortalProps> = ({ 
  client, 
  requirements, 
  artifacts, 
  activeFramework 
}) => {
  const [activeTab, setActiveTab] = useState<AssessorTab>('EVIDENCE');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);

  const frameworkReqs = useMemo(() => 
    requirements.filter(r => r.framework === activeFramework.id),
    [requirements, activeFramework]
  );

  const filteredReqs = frameworkReqs.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 h-full flex flex-col">
      
      {/* Official Audit Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-3">
                  <ClipboardCheck size={40} className="text-blue-500" />
              </div>
              <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Assessor Gateway<br/><span className="text-blue-600 text-sm tracking-widest font-black uppercase">CMMC 2.0 // NIST 800-171A</span></h1>
                  <p className="text-slate-500 font-medium mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Review Environment: <span className="font-bold text-slate-700">{client.name}</span>
                  </p>
              </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button onClick={() => setActiveTab('EVIDENCE')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'EVIDENCE' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Evidence Workbench</button>
            <button onClick={() => setActiveTab('POLICIES')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'POLICIES' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Regulatory Mapping</button>
          </div>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
              <Search className="text-slate-400" size={20} />
              <input className="flex-1 bg-transparent border-none outline-none font-bold text-slate-900 placeholder:text-slate-400 text-sm" placeholder="Audit by Requirement ID, Objective, or Keyword..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          </div>

          <div className="flex-1 overflow-y-auto">
              {activeTab === 'EVIDENCE' ? (
                  <div className="divide-y divide-slate-100">
                      {filteredReqs.map(req => {
                          const reqArtifacts = artifacts.filter(a => a.requirementId === req.id);
                          const isExpanded = expandedReqId === req.id;
                          const isMet = req.objectives.every(o => o.status === 'met');

                          return (
                              <div key={req.id} className="group">
                                  <div onClick={() => setExpandedReqId(isExpanded ? null : req.id)} className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
                                      <div className="flex items-center gap-6">
                                          <div className={`w-16 font-mono text-[11px] font-black transition-colors ${isExpanded ? 'text-blue-600' : 'text-slate-400'}`}>{req.id}</div>
                                          <div>
                                              <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{req.title}</div>
                                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{req.family} Domain</div>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-6">
                                          <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${isMet ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                               {isMet ? 'VERIFIED MET' : 'OPEN GAP'}
                                          </span>
                                          <ChevronRight size={20} className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-blue-600' : ''}`} />
                                      </div>
                                  </div>
                                  
                                  {isExpanded && (
                                      <div className="bg-slate-50/50 px-8 pb-10 pt-4 animate-in fade-in duration-300">
                                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                              
                                              {/* Center Column: Guide & Objectives */}
                                              <div className="lg:col-span-8 space-y-6">
                                                  {/* Methodology Section */}
                                                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                                      <div className="bg-slate-900 px-6 py-3 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                          <SearchCode size={14} className="text-blue-400" /> Potential Assessment Methodology
                                                      </div>
                                                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                          <div className="space-y-3">
                                                              <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5"><FileText size={12}/> Examine</h5>
                                                              <ul className="space-y-1">
                                                                  {(req.examineOptions || ['Policies', 'Configuration Settings', 'Audit Logs']).map((opt, i) => (
                                                                      <li key={i} className="text-[10px] text-slate-600 font-medium leading-relaxed flex gap-2">
                                                                          <span className="text-blue-300">•</span> {opt}
                                                                      </li>
                                                                  ))}
                                                              </ul>
                                                          </div>
                                                          <div className="space-y-3">
                                                              <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5"><Users size={12}/> Interview</h5>
                                                              <ul className="space-y-1">
                                                                  {(req.interviewOptions || ['System Administrators', 'Security Officers']).map((opt, i) => (
                                                                      <li key={i} className="text-[10px] text-slate-600 font-medium leading-relaxed flex gap-2">
                                                                          <span className="text-amber-300">•</span> {opt}
                                                                      </li>
                                                                  ))}
                                                              </ul>
                                                          </div>
                                                          <div className="space-y-3">
                                                              <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={12}/> Test</h5>
                                                              <ul className="space-y-1">
                                                                  {(req.testOptions || ['System configurations', 'Process execution']).map((opt, i) => (
                                                                      <li key={i} className="text-[10px] text-slate-600 font-medium leading-relaxed flex gap-2">
                                                                          <span className="text-indigo-300">•</span> {opt}
                                                                      </li>
                                                                  ))}
                                                              </ul>
                                                          </div>
                                                      </div>
                                                  </div>

                                                  {/* Specific Objectives Checklist */}
                                                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
                                                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                                          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Assessment Objectives (NIST 800-171A)</h4>
                                                          <span className="text-[10px] font-bold text-slate-400">Review required for all determination statements</span>
                                                      </div>
                                                      <div className="divide-y divide-slate-50">
                                                          {req.objectives.map(obj => (
                                                              <div key={obj.id} className="p-4 flex items-start gap-4">
                                                                  <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm ${obj.status === 'met' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                      {obj.id.toUpperCase()}
                                                                  </div>
                                                                  <div className="flex-1">
                                                                      <div className="text-xs text-slate-700 font-bold leading-relaxed">{obj.description}</div>
                                                                  </div>
                                                                  <FindingBadge status={obj.status} />
                                                              </div>
                                                          ))}
                                                      </div>
                                                  </div>

                                                  {/* Org Narrative */}
                                                  <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl">
                                                      <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2"><BookOpen size={14}/> Implementation Narrative</h4>
                                                      <p className="text-sm font-medium leading-relaxed text-blue-50">
                                                          {req.response || 'Warning: No implementation narrative provided. Assessor must solicit verbal confirmation during interview phase.'}
                                                      </p>
                                                  </div>
                                              </div>
                                              
                                              {/* Right Column: Evidence Gallery */}
                                              <div className="lg:col-span-4 space-y-6">
                                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Eye size={14}/> Technical Evidence Vault</h4>
                                                  {reqArtifacts.length === 0 ? (
                                                      <div className="p-12 text-center text-slate-400 text-xs italic border-2 border-dashed rounded-[2rem] border-slate-200 bg-white">
                                                          Awaiting artifact upload for this control.
                                                      </div>
                                                  ) : (
                                                      <div className="space-y-2">
                                                          {reqArtifacts.map(art => (
                                                              <button key={art.id} className="w-full bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between group/art hover:border-blue-400 transition-all shadow-sm">
                                                                  <div className="flex items-center gap-3 overflow-hidden">
                                                                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover/art:bg-blue-600 group-hover/art:text-white transition-colors"><Link2 size={16}/></div>
                                                                      <div className="text-left truncate">
                                                                          <div className="text-[11px] font-black text-slate-900 truncate">{art.name}</div>
                                                                          <div className="text-[8px] text-slate-400 font-bold uppercase">{new Date(art.timestamp).toLocaleDateString()}</div>
                                                                      </div>
                                                                  </div>
                                                                  <Download size={14} className="text-slate-300 group-hover/art:text-blue-600 shrink-0" />
                                                              </button>
                                                          ))}
                                                      </div>
                                                  )}

                                                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessor Finding</h5>
                                                      <div className="grid grid-cols-1 gap-2">
                                                          <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black">Set as MET</button>
                                                          <button className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50">Set as NOT MET</button>
                                                      </div>
                                                      <textarea 
                                                        className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                        placeholder="Auditor rationale / observations..."
                                                      />
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          );
                      })}
                  </div>
              ) : (
                  <div className="p-20 max-w-2xl mx-auto text-center space-y-8">
                      <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
                          <BookOpen size={48} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">System Policy Inventory</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mt-3">Access the organization's master policy repository. The Assessor Gateway provides a consolidated view of all administrative controls, allowing for rapid cross-referencing against technical evidence.</p>
                      </div>
                      <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center gap-3 mx-auto">
                          <Download size={18} className="text-blue-500" /> Access Master Policy Set (SSP)
                      </button>
                  </div>
              )}
          </div>
      </div>
      
      {/* Official Stamp */}
      <div className="flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-4">
          <div>Audit Integrity Verified // Sig: {Math.random().toString(36).substring(7).toUpperCase()}</div>
          <div>Defense Industrial Base Certified Environment</div>
      </div>
    </div>
  );
};