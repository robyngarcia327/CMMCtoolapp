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
  HelpCircle,
  ArrowRight,
  Info,
  Layers,
  Activity,
  UserPlus,
  Mail,
  X
} from 'lucide-react';

interface AssessorPortalProps {
  client: Client;
  requirements: Requirement[];
  artifacts: Artifact[];
  risks: Risk[];
  assets: Asset[];
  activeFramework: Framework;
}

type CAPPhase = 'PH1_PRE_ASSESSMENT' | 'PH2_ASSESSMENT' | 'PH3_REPORTING' | 'PH4_CERTIFICATION';

// FIX: Moved Award component declaration before its usage in CAP_PHASES to avoid 'used before its declaration' error
const Award = ({ size, className }: any) => <ShieldCheck size={size} className={className} />;

const CAP_PHASES = [
    { id: 'PH1_PRE_ASSESSMENT', label: 'Phase 1: Pre-Assessment', icon: FileCheck, description: 'Review SSP, Validate Scope, Confirm Evidence' },
    { id: 'PH2_ASSESSMENT', label: 'Phase 2: Assessment', icon: SearchCode, description: 'In-Brief, Fieldwork (Examine/Interview/Test)' },
    { id: 'PH3_REPORTING', label: 'Phase 3: Reporting', icon: ClipboardCheck, description: 'Out-Brief, eMASS Upload, QA Review' },
    { id: 'PH4_CERTIFICATION', label: 'Phase 4: Certification', icon: Award, description: 'Final/Conditional Certificate Issuance' }
];

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
  activeFramework,
  risks,
  assets
}) => {
  const [activeCapPhase, setActiveCapPhase] = useState<CAPPhase>('PH1_PRE_ASSESSMENT');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [auditorEmail, setAuditorEmail] = useState('');

  const frameworkReqs = useMemo(() => 
    requirements.filter(r => r.framework === activeFramework.id),
    [requirements, activeFramework]
  );

  const filteredReqs = frameworkReqs.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => {
    const total = frameworkReqs.length || 1;
    const met = frameworkReqs.filter(r => r.objectives.every(o => o.status === 'met')).length;
    return {
      readiness: Math.round((met / total) * 100),
      total,
      met
    };
  }, [frameworkReqs]);

  const handleInviteAuditor = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Agency invitation sent to ${auditorEmail}. Assessment token generated.`);
    setShowInviteModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 h-full flex flex-col">
      
      {/* Official Audit Header - CAP v2.0 Redesign */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-3">
                  <ClipboardCheck size={40} className="text-blue-500" />
              </div>
              <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Assessor Gateway<br/><span className="text-blue-600 text-sm tracking-widest font-black uppercase">CMMC CAP v2.0 // Official Portal</span></h1>
                  <p className="text-slate-500 font-medium mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Review Environment: <span className="font-bold text-slate-700">{client.name}</span>
                  </p>
              </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                 <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest">
                    <UserPlus size={16} /> Invite Agency
                 </button>
                 <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-black transition-all uppercase tracking-widest">
                    <Download size={16} /> Evidence Bundle
                 </button>
            </div>
            <div className="text-[9px] font-black text-slate-400 text-right uppercase tracking-[0.2em]">Verified: NIST 800-171A Methodology</div>
          </div>
      </div>

      {/* CAP Phase Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {CAP_PHASES.map((phase) => {
              const isActive = activeCapPhase === phase.id;
              return (
                  <button 
                    key={phase.id}
                    onClick={() => setActiveCapPhase(phase.id as CAPPhase)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all flex flex-col h-full relative group ${
                        isActive ? 'bg-white border-blue-600 shadow-xl ring-4 ring-blue-50' : 'bg-slate-50 border-transparent hover:border-slate-200'
                    }`}
                  >
                      <div className={`p-3 rounded-xl w-fit mb-3 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 border border-slate-200'}`}>
                          <phase.icon size={20} />
                      </div>
                      <h4 className={`text-xs font-black uppercase tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{phase.label}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-1 leading-tight">{phase.description}</p>
                      {isActive && <div className="absolute top-4 right-4 text-blue-600 animate-pulse"><ArrowRight size={16}/></div>}
                  </button>
              );
          })}
      </div>

      {/* Main Assessment Workbench */}
      <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          {activeCapPhase === 'PH1_PRE_ASSESSMENT' && (
              <div className="p-8 space-y-10 overflow-y-auto">
                  <div className="max-w-3xl">
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Phase 1: Readiness Determination</h2>
                      <p className="text-slate-500 font-medium">Verify the System Security Plan (SSP) completeness and Boundary Scope validation before proceeding to fieldwork.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileCheck size={16}/> SSP Completeness</h4>
                          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700">SSP v2.4</span>
                              <button className="text-blue-600 font-black text-[10px] uppercase hover:underline flex items-center gap-1">Review <ExternalLink size={10}/></button>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed italic">Assessor must examine document for accuracy, consistency, and addressing all 110 controls.</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Layers size={16}/> Scope Validation</h4>
                          <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white p-2 text-center rounded-lg border border-slate-100">
                                  <div className="text-lg font-black text-slate-900">{assets.filter(a => a.cmmcCategory === 'CUI').length}</div>
                                  <div className="text-[8px] font-black text-slate-400 uppercase">CUI Assets</div>
                              </div>
                              <div className="bg-white p-2 text-center rounded-lg border border-slate-100">
                                  <div className="text-lg font-black text-slate-900">{assets.filter(a => a.cmmcCategory === 'SPA').length}</div>
                                  <div className="text-[8px] font-black text-slate-400 uppercase">SPA Assets</div>
                              </div>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">Validation of Logical and Physical separation required per 32 CFR §170.19(c).</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><HelpCircle size={16}/> Evidence Confirmation</h4>
                          <div className="p-4 bg-white rounded-xl border border-slate-100 text-center">
                              <div className="text-4xl font-black text-blue-600">{artifacts.length}</div>
                              <div className="text-[10px] font-black text-slate-400 uppercase mt-1">Total Artifacts Uploaded</div>
                          </div>
                          <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Confirm Readiness</button>
                      </div>
                  </div>
              </div>
          )}

          {activeCapPhase === 'PH2_ASSESSMENT' && (
              <>
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                      <div className="flex-1 relative max-w-xl">
                          <Search className="absolute left-4 top-3 text-slate-400" size={20} />
                          <input 
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-inner font-bold"
                            placeholder="Audit Requirement ID, Objective, or Domain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <div className="flex gap-2">
                           <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-indigo-100">
                               <Info size={14} /> Methodology: Focused Sampling
                           </div>
                           <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">In-Brief Checklist</button>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto min-h-0">
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
                                                  <div className="lg:col-span-8 space-y-6">
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

                                                      <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl">
                                                          <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2"><BookOpen size={14}/> Implementation Narrative</h4>
                                                          <p className="text-sm font-medium leading-relaxed text-blue-50">
                                                              {req.response || 'Warning: No implementation narrative provided. Assessor must solicit verbal confirmation during interview phase.'}
                                                          </p>
                                                      </div>
                                                  </div>
                                                  
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
                  </div>
              </>
          )}

          {activeCapPhase === 'PH3_REPORTING' && (
              <div className="p-20 text-center space-y-10">
                  <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-300">
                      <ClipboardCheck size={48} />
                  </div>
                  <div className="max-w-xl mx-auto">
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Phase 3: reporting & eMASS</h2>
                      <p className="text-slate-500 font-medium leading-relaxed mt-4">Generate the Assessment Results Briefing and upload hashed artifacts to CMMC eMASS. Ensure all POA&M statuses are clearly documented for Conditional Certification paths.</p>
                  </div>
                  <div className="flex justify-center gap-4">
                      <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700">Generate Out-Brief Report</button>
                      <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black flex items-center gap-2">
                        <ArrowRight size={18} className="text-blue-50" /> Initiate eMASS Upload
                      </button>
                  </div>
              </div>
          )}

          {activeCapPhase === 'PH4_CERTIFICATION' && (
              <div className="p-20 text-center space-y-8 animate-in fade-in duration-700">
                   <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-green-500 shadow-xl shadow-green-100 ring-1 ring-green-200">
                      <Award size={48} />
                  </div>
                  <div className="max-w-xl mx-auto">
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Phase 4: Certification Issuance</h2>
                      <p className="text-slate-500 font-medium leading-relaxed mt-4">The final step of the CAP process. If the Lead CCA and QA Individual concur on MET findings, a Certificate of CMMC Status is generated.</p>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 inline-block max-w-lg">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Draft Certificate Confirmation</div>
                      <div className="text-left space-y-2">
                          <div className="flex justify-between text-sm"><span className="text-slate-500">Status:</span> <span className="font-bold text-green-600 uppercase">Final Recommendation</span></div>
                          <div className="flex justify-between text-sm"><span className="text-slate-500">UID:</span> <span className="font-mono font-bold text-slate-900">CMMC-2025-AX-9921</span></div>
                      </div>
                      <button className="w-full mt-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-green-100 transition-all hover:scale-[1.02]">Sign & Issue Certificate</button>
                  </div>
              </div>
          )}
      </div>

      {/* Footer Audit Meta */}
      <div className="flex justify-between items-center px-4 pt-4 border-t border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          <div>Document Integrity Verified // CAP v2.0 Standard // Sig: {Math.random().toString(36).substring(7).toUpperCase()}</div>
          <div>Cuallee Cyber Compliance Architecture v2.4.1</div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
          <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border-t-8 border-blue-600">
                  <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                      <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                          <UserPlus size={18} /> Grant Agency Access
                      </h3>
                      <button onClick={() => setShowInviteModal(false)} className="text-white/70 hover:text-white"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleInviteAuditor} className="p-8 space-y-6">
                      <p className="text-xs text-slate-500 leading-relaxed">Inviting an agency email will grant 72-hour read-only access to this assessment environment following the CAP v2.0 confidentiality guidelines.</p>
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Official Agency Email</label>
                          <div className="relative">
                              <Mail className="absolute left-4 top-3 text-slate-400" size={18} />
                              <input 
                                type="email" 
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" 
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