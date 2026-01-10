
import React, { useState, useMemo } from 'react';
import { Requirement, Artifact, Client, Risk, Asset, Framework } from '../types';
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
  FileSearch,
  Book
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
    <div className="max-w-7xl mx-auto p-8 space-y-8 h-full flex flex-col bg-slate-50/50">
      
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-3">
                  <ClipboardCheck size={40} className="text-blue-500" />
              </div>
              <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Assessor Gateway</h1>
                  <p className="text-slate-500 font-medium mt-1">Verified Audit Environment: {client.name}</p>
              </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button onClick={() => setActiveTab('EVIDENCE')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'EVIDENCE' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Evidence Review</button>
            <button onClick={() => setActiveTab('POLICIES')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'POLICIES' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Policy Review</button>
          </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
              <Search className="text-slate-400" size={20} />
              <input className="flex-1 bg-transparent border-none outline-none font-bold text-slate-900 placeholder:text-slate-400" placeholder="Filter audit trail by Control ID or Title..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          </div>

          <div className="flex-1 overflow-y-auto">
              {activeTab === 'EVIDENCE' ? (
                  <div className="divide-y divide-slate-100">
                      {filteredReqs.map(req => {
                          const reqArtifacts = artifacts.filter(a => a.requirementId === req.id);
                          const isExpanded = expandedReqId === req.id;
                          return (
                              <div key={req.id} className="group">
                                  <div onClick={() => setExpandedReqId(isExpanded ? null : req.id)} className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
                                      <div className="flex items-center gap-6">
                                          <div className="w-16 font-mono text-[10px] font-black text-slate-400 group-hover:text-blue-600">{req.id}</div>
                                          <div className="font-bold text-slate-900 text-sm">{req.title}</div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{reqArtifacts.length} Artifacts</span>
                                          <ChevronRight size={18} className={`text-slate-300 transition-transform ${isExpanded ? 'rotate-90 text-blue-600' : ''}`} />
                                      </div>
                                  </div>
                                  {isExpanded && (
                                      <div className="bg-slate-50/50 px-10 pb-8 pt-4 animate-in fade-in slide-in-from-top-2">
                                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                              <div className="space-y-4">
                                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BookOpen size={14}/> Assessment Narrative</div>
                                                  <p className="text-xs text-slate-600 leading-relaxed italic">{req.description}</p>
                                                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm font-medium leading-relaxed">{req.response || 'No narrative provided.'}</div>
                                              </div>
                                              <div className="space-y-4">
                                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Eye size={14}/> Verification Links</div>
                                                  {reqArtifacts.length === 0 ? (
                                                      <div className="p-8 text-center text-slate-400 text-xs italic border-2 border-dashed rounded-2xl">Awaiting evidence collection...</div>
                                                  ) : (
                                                      <div className="space-y-2">
                                                          {reqArtifacts.map(art => (
                                                              <div key={art.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between group/art hover:border-blue-300 transition-all">
                                                                  <div className="flex items-center gap-3">
                                                                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Link2 size={16}/></div>
                                                                      <div>
                                                                          <div className="text-xs font-black text-slate-900">{art.name}</div>
                                                                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                                                                              <Clock size={10}/> Collected: {new Date(art.timestamp).toLocaleString()}
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                                                  <button className="p-2 text-slate-400 hover:text-blue-600"><Download size={16}/></button>
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
                  <div className="p-12 max-w-2xl mx-auto text-center space-y-6">
                      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
                          <Book size={40} />
                      </div>
                      <h2 className="text-xl font-black text-slate-900 uppercase">Policy Alignment Review</h2>
                      <p className="text-slate-500 text-sm leading-relaxed">Assessor mode for comparing institutional policy documents against technical control responses. Link specific pages or sections of uploaded policies to justify control implementation.</p>
                      <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">Upload Master Policy Set</button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
