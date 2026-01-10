import React, { useState, useMemo } from 'react';
import { Requirement, Artifact, Client, Risk, Asset, Framework } from '../types';
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
  Book,
  ExternalLink,
  // Added FileCheck to resolve 'Cannot find name FileCheck' error
  FileCheck
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
      
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-3">
                  <ClipboardCheck size={40} className="text-blue-500" />
              </div>
              <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Assessor Gateway</h1>
                  <p className="text-slate-500 font-medium mt-1">Verified Audit Environment: <span className="font-bold text-slate-700">{client.name}</span></p>
              </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button onClick={() => setActiveTab('EVIDENCE')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'EVIDENCE' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Evidence Review</button>
            <button onClick={() => setActiveTab('POLICIES')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'POLICIES' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Policy Review</button>
          </div>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
              <Search className="text-slate-400" size={20} />
              <input className="flex-1 bg-transparent border-none outline-none font-bold text-slate-900 placeholder:text-slate-400 text-sm" placeholder="Filter audit trail by Control ID or Keyword..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          </div>

          <div className="flex-1 overflow-y-auto">
              {activeTab === 'EVIDENCE' ? (
                  <div className="divide-y divide-slate-100">
                      {filteredReqs.map(req => {
                          const reqArtifacts = artifacts.filter(a => a.requirementId === req.id);
                          const isExpanded = expandedReqId === req.id;
                          return (
                              <div key={req.id} className="group">
                                  <div onClick={() => setExpandedReqId(isExpanded ? null : req.id)} className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors">
                                      <div className="flex items-center gap-6">
                                          <div className="w-16 font-mono text-[11px] font-black text-slate-400 group-hover:text-blue-600 transition-colors">{req.id}</div>
                                          <div className="font-bold text-slate-900 text-sm uppercase tracking-tight">{req.title}</div>
                                      </div>
                                      <div className="flex items-center gap-6">
                                          {reqArtifacts.length > 0 ? (
                                              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-green-100">
                                                  <FileCheck size={12}/> {reqArtifacts.length} Artifacts
                                              </span>
                                          ) : (
                                              <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">No Evidence</span>
                                          )}
                                          <ChevronRight size={20} className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-blue-600' : ''}`} />
                                      </div>
                                  </div>
                                  {isExpanded && (
                                      <div className="bg-slate-50/50 px-12 pb-10 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                              <div className="space-y-6">
                                                  <div>
                                                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><BookOpen size={14}/> Assessment Narrative</h4>
                                                      <p className="text-xs text-slate-500 leading-relaxed mb-4 italic">"{req.description}"</p>
                                                      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-sm font-medium leading-relaxed text-slate-700 shadow-sm">
                                                          {req.response || 'No organizational narrative provided for this control.'}
                                                      </div>
                                                  </div>
                                              </div>
                                              
                                              <div>
                                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Eye size={14}/> Technical Verification Links</h4>
                                                  {reqArtifacts.length === 0 ? (
                                                      <div className="p-12 text-center text-slate-400 text-xs italic border-2 border-dashed rounded-3xl border-slate-200 bg-white">Awaiting evidence collection from security team...</div>
                                                  ) : (
                                                      <div className="space-y-3">
                                                          {reqArtifacts.map(art => (
                                                              <div key={art.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between group/art hover:border-blue-400 transition-all shadow-sm">
                                                                  <div className="flex items-center gap-4">
                                                                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Link2 size={18}/></div>
                                                                      <div>
                                                                          <div className="text-sm font-black text-slate-900 leading-tight">{art.name}</div>
                                                                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-black uppercase mt-1">
                                                                              <Clock size={10}/> Collected: {new Date(art.timestamp).toLocaleString()}
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                                                  <a 
                                                                    href={art.url || '#'} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all opacity-0 group-hover/art:opacity-100 shadow-lg"
                                                                  >
                                                                      <ExternalLink size={16}/>
                                                                  </a>
                                                              </div>
                                                          ))}
                                                      </div>
                                                  )}
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
                          <Book size={48} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Policy Alignment Review</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mt-3">Compare organization policy documents against technical control statements. Assessor mode allows for tagging specific document sections as 'Corrective', 'Administrative', or 'Technical' safeguards.</p>
                      </div>
                      <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center gap-3 mx-auto">
                          <Download size={18} className="text-blue-500" /> Review Master Policy Set
                      </button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};