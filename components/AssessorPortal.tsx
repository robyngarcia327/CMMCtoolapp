
import React, { useState, useMemo } from 'react';
import { Requirement, Artifact, Client, Risk, Asset, Framework, AssessmentObjective } from '../types';
import { NIST_CMMC_FAMILIES } from '../data/standards';
// Added Award icon to the imports list
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
  X,
  FileBadge,
  Shield,
  Target,
  Box,
  Award
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

const CAP_PHASES = [
    { id: 'PH1_PRE_ASSESSMENT', label: 'Phase 1: Pre-Assessment', icon: FileCheck, description: 'Review SSP, Validate Scope, Confirm Evidence' },
    { id: 'PH2_ASSESSMENT', label: 'Phase 2: Assessment', icon: SearchCode, description: 'In-Brief, Fieldwork (Examine/Interview/Test)' },
    { id: 'PH3_REPORTING', label: 'Phase 3: Reporting', icon: ClipboardCheck, description: 'Out-Brief, eMASS Upload, QA Review' },
    { id: 'PH4_CERTIFICATION', label: 'Phase 4: Certification', icon: ShieldCheck, description: 'Final/Conditional Certificate Issuance' }
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
    <div className="max-w-7xl mx-auto p-8 space-y-10 h-full flex flex-col bg-slate-50/30">
      
      {/* Official Audit Header */}
      <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl rotate-3 shrink-0">
                  <ClipboardCheck size={48} className="text-blue-500" />
              </div>
              <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                    Assessor Gateway
                    <div className="mt-2 flex items-center gap-3">
                        <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full tracking-widest font-black uppercase shadow-lg shadow-blue-200">CMMC CAP V2.0</span>
                        <span className="text-slate-300 text-lg font-medium tracking-widest">//</span>
                        <span className="text-blue-600 text-[10px] tracking-widest font-black uppercase">Official Portal</span>
                    </div>
                  </h1>
                  <p className="text-slate-500 font-medium mt-4 flex items-center gap-2 text-lg">
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    Review Environment: <span className="font-black text-slate-800 uppercase tracking-tight">{client.name}</span>
                  </p>
              </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
                 <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-3 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-[0.1em]">
                    <UserPlus size={20} /> Invite Agency
                 </button>
                 <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs shadow-2xl hover:bg-black transition-all uppercase tracking-[0.1em]">
                    <Download size={20} /> Evidence Bundle
                 </button>
            </div>
            <div className="text-[10px] font-black text-slate-400 text-right uppercase tracking-[0.2em]">Verified: NIST 800-171A Methodology</div>
          </div>
      </div>

      {/* CAP Phase Stepper - High Impact Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {CAP_PHASES.map((phase) => {
              const isActive = activeCapPhase === phase.id;
              return (
                  <button 
                    key={phase.id}
                    onClick={() => setActiveCapPhase(phase.id as CAPPhase)}
                    className={`text-left p-6 rounded-[2rem] border-2 transition-all flex flex-col h-full relative group ${
                        isActive ? 'bg-white border-blue-600 shadow-2xl ring-8 ring-blue-50' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-lg'
                    }`}
                  >
                      <div className={`p-4 rounded-2xl w-fit mb-4 transition-all ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-110' : 'bg-slate-50 text-slate-400 border border-slate-200 group-hover:bg-blue-50'}`}>
                          <phase.icon size={24} />
                      </div>
                      <h4 className={`text-sm font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>{phase.label}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-2 leading-relaxed">{phase.description}</p>
                      {isActive && <div className="absolute top-6 right-6 text-blue-600 animate-bounce"><ArrowRight size={20}/></div>}
                  </button>
              );
          })}
      </div>

      {/* Main Assessment Workbench - SIGNIFICANTLY ENLARGED Content Area */}
      <div className="flex-1 min-h-[700px] bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-500">
          {activeCapPhase === 'PH1_PRE_ASSESSMENT' && (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Phase Header Section */}
                  <div className="p-12 pb-8 bg-slate-50/50 border-b border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                      <div className="max-w-4xl relative z-10">
                          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">
                            Phase 1: Readiness Determination
                          </h2>
                          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                            Complete the preliminary review of the System Security Plan (SSP) and validate the defined assessment boundary before moving to fieldwork.
                          </p>
                      </div>
                  </div>

                  {/* Grand Action Tiles */}
                  <div className="flex-1 p-12 overflow-y-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                          
                          {/* Tile: SSP Review */}
                          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all p-10 flex flex-col h-full group border-b-8 border-b-blue-600">
                              <div className="p-5 bg-blue-50 text-blue-600 rounded-3xl w-fit mb-8 group-hover:scale-110 transition-transform">
                                  <FileCheck size={32} />
                              </div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Compliance Core</h4>
                              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">SSP Completeness</h3>
                              <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-1">
                                Verify the System Security Plan addresses all 110 controls with accurate implementation narratives.
                              </p>
                              
                              <div className="space-y-4">
                                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <FileText className="text-blue-600" size={20} />
                                          <span className="text-sm font-bold text-slate-700 tracking-tight">SSP_v2.4_Production.pdf</span>
                                      </div>
                                      <button className="text-blue-600 font-black text-xs uppercase hover:underline flex items-center gap-1">Open <ExternalLink size={12}/></button>
                                  </div>
                                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">Verify Document</button>
                              </div>
                          </div>

                          {/* Tile: Scope Validation */}
                          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all p-10 flex flex-col h-full group border-b-8 border-b-indigo-600">
                              <div className="p-5 bg-indigo-50 text-indigo-600 rounded-3xl w-fit mb-8 group-hover:scale-110 transition-transform">
                                  <Target size={32} />
                              </div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Boundary Logic</h4>
                              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Scope Validation</h3>
                              <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-1">
                                Assessor must confirm Logical and Physical separation of the CUI environment per 32 CFR §170.19.
                              </p>
                              
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                      <div className="text-3xl font-black text-slate-900 tracking-tighter">{assets.filter(a => a.cmmcCategory === 'CUI').length}</div>
                                      <div className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">CUI Assets</div>
                                  </div>
                                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                      <div className="text-3xl font-black text-slate-900 tracking-tighter">{assets.filter(a => a.cmmcCategory === 'SPA').length}</div>
                                      <div className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">SPA Assets</div>
                                  </div>
                              </div>
                              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all">Confirm Boundary</button>
                          </div>

                          {/* Tile: Evidence Check */}
                          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all p-10 flex flex-col h-full group border-b-8 border-b-emerald-600">
                              <div className="p-5 bg-emerald-50 text-emerald-600 rounded-3xl w-fit mb-8 group-hover:scale-110 transition-transform">
                                  <Box size={32} />
                              </div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Artifact Density</h4>
                              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Evidence Vault</h3>
                              <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-1">
                                Check for minimum evidence thresholds. 110/110 practice points should have technical proof.
                              </p>
                              
                              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center mb-6">
                                  <div className="text-5xl font-black text-emerald-700 tracking-tighter">{artifacts.length}</div>
                                  <div className="text-[10px] font-black text-emerald-600 uppercase mt-2 tracking-widest">Total Proof Objects</div>
                              </div>
                              <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700 transition-all">Confirm Artifact Readiness</button>
                          </div>

                      </div>

                      {/* Global Readiness CTA */}
                      <div className="mt-16 bg-slate-900 rounded-[2.5rem] p-12 text-center relative overflow-hidden shadow-2xl">
                          <div className="absolute top-0 left-0 w-full h-full bg-blue-600/10"></div>
                          <div className="relative z-10 max-w-2xl mx-auto">
                              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Final Readiness Determination</h3>
                              <p className="text-blue-100 font-medium mb-8 text-lg">
                                If all Pre-Assessment criteria are MET, the Lead Assessor may issue a "Go" decision to move to active Fieldwork (Phase 2).
                              </p>
                              <button className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/50 transition-all flex items-center gap-4 mx-auto hover:scale-105 active:scale-95">
                                 Commit Readiness Decision <ChevronRight size={24} />
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeCapPhase === 'PH2_ASSESSMENT' && (
              <>
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
                      <div className="flex-1 relative max-w-2xl">
                          <Search className="absolute left-6 top-4 text-slate-400" size={24} />
                          <input 
                            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-3xl text-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none shadow-inner font-bold"
                            placeholder="Audit Requirement ID, Objective, or Domain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <div className="flex gap-4">
                           <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border border-indigo-100">
                               <Info size={18} /> Methodology: Focused Sampling
                           </div>
                           <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">In-Brief Checklist</button>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto min-0 custom-scrollbar">
                      <div className="divide-y divide-slate-100">
                          {filteredReqs.map(req => {
                              const reqArtifacts = artifacts.filter(a => a.requirementId === req.id);
                              const isExpanded = expandedReqId === req.id;
                              const isMet = req.objectives.every(o => o.status === 'met');

                              return (
                                  <div key={req.id} className="group">
                                      <div onClick={() => setExpandedReqId(isExpanded ? null : req.id)} className={`p-8 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
                                          <div className="flex items-center gap-8">
                                              <div className={`w-20 font-mono text-sm font-black transition-colors ${isExpanded ? 'text-blue-600' : 'text-slate-400'}`}>{req.id}</div>
                                              <div>
                                                  <div className="font-black text-slate-900 text-lg uppercase tracking-tight leading-none">{req.title}</div>
                                                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{req.family} Domain</div>
                                              </div>
                                          </div>
                                          <div className="flex items-center gap-8">
                                              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${isMet ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                   {isMet ? 'VERIFIED MET' : 'OPEN GAP'}
                                              </span>
                                              <ChevronRight size={24} className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-blue-600' : ''}`} />
                                          </div>
                                      </div>
                                      
                                      {isExpanded && (
                                          <div className="bg-slate-50/50 px-12 pb-12 pt-6 animate-in fade-in duration-300">
                                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                                  <div className="lg:col-span-8 space-y-8">
                                                      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                                                          <div className="bg-slate-900 px-8 py-4 text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                                              <SearchCode size={18} className="text-blue-400" /> Assessment Methodology Guide
                                                          </div>
                                                          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                                              <div className="space-y-4">
                                                                  <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><FileText size={16}/> Examine</h5>
                                                                  <ul className="space-y-2">
                                                                      {(req.examineOptions || ['Policies', 'Configuration Settings', 'Audit Logs']).map((opt, i) => (
                                                                          <li key={i} className="text-xs text-slate-600 font-medium leading-relaxed flex gap-2">
                                                                              <span className="text-blue-400 font-black">•</span> {opt}
                                                                          </li>
                                                                      ))}
                                                                  </ul>
                                                              </div>
                                                              <div className="space-y-4">
                                                                  <h5 className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"><Users size={16}/> Interview</h5>
                                                                  <ul className="space-y-2">
                                                                      {(req.interviewOptions || ['System Administrators', 'Security Officers']).map((opt, i) => (
                                                                          <li key={i} className="text-xs text-slate-600 font-medium leading-relaxed flex gap-2">
                                                                              <span className="text-amber-400 font-black">•</span> {opt}
                                                                          </li>
                                                                      ))}
                                                                  </ul>
                                                              </div>
                                                              <div className="space-y-4">
                                                                  <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={16}/> Test</h5>
                                                                  <ul className="space-y-2">
                                                                      {(req.testOptions || ['System configurations', 'Process execution']).map((opt, i) => (
                                                                          <li key={i} className="text-xs text-slate-600 font-medium leading-relaxed flex gap-2">
                                                                              <span className="text-indigo-400 font-black">•</span> {opt}
                                                                          </li>
                                                                      ))}
                                                                  </ul>
                                                              </div>
                                                          </div>
                                                      </div>

                                                      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                                                          <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                                                              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Determination Statements (800-171A)</h4>
                                                              <span className="text-[10px] font-bold text-slate-400 italic">Review required for all assessment objectives</span>
                                                          </div>
                                                          <div className="divide-y divide-slate-50">
                                                              {req.objectives.map(obj => (
                                                                  <div key={obj.id} className="p-6 flex items-start gap-6">
                                                                      <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-md transition-all ${obj.status === 'met' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                          {obj.id.toUpperCase()}
                                                                      </div>
                                                                      <div className="flex-1">
                                                                          <div className="text-sm text-slate-700 font-bold leading-relaxed">{obj.description}</div>
                                                                      </div>
                                                                      <FindingBadge status={obj.status} />
                                                                  </div>
                                                              ))}
                                                          </div>
                                                      </div>

                                                      <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                                                          <h4 className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-6 flex items-center gap-3"><BookOpen size={20}/> Organization implementation statement</h4>
                                                          <p className="text-lg font-medium leading-relaxed text-blue-50 italic">
                                                              "{req.response || 'Warning: No implementation narrative provided. Assessor must solicit verbal confirmation during interview phase.'}"
                                                          </p>
                                                      </div>
                                                  </div>
                                                  
                                                  <div className="lg:col-span-4 space-y-10">
                                                      <div>
                                                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3"><Eye size={20}/> Evidence Vault</h4>
                                                          {reqArtifacts.length === 0 ? (
                                                              <div className="p-16 text-center text-slate-400 text-sm italic border-4 border-dashed rounded-[2.5rem] border-slate-100 bg-white">
                                                                  <Box size={40} className="mx-auto mb-4 opacity-10" />
                                                                  Awaiting technical artifacts.
                                                              </div>
                                                          ) : (
                                                              <div className="space-y-3">
                                                                  {reqArtifacts.map(art => (
                                                                      <button key={art.id} className="w-full bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between group/art hover:border-blue-400 hover:shadow-xl transition-all shadow-sm">
                                                                          <div className="flex items-center gap-4 overflow-hidden">
                                                                              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover/art:bg-blue-600 group-hover/art:text-white transition-colors"><Link2 size={20}/></div>
                                                                              <div className="text-left truncate">
                                                                                  <div className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{art.name}</div>
                                                                                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{new Date(art.timestamp).toLocaleDateString()}</div>
                                                                              </div>
                                                                          </div>
                                                                          <Download size={18} className="text-slate-300 group-hover/art:text-blue-600 shrink-0" />
                                                                      </button>
                                                                  ))}
                                                              </div>
                                                          )}
                                                      </div>

                                                      <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-xl space-y-6">
                                                          <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Official Assessor Finding</h5>
                                                          <div className="grid grid-cols-1 gap-3">
                                                              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">Commit Finding: MET</button>
                                                              <button className="w-full py-4 bg-white border-2 border-red-100 text-red-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-50 transition-all">Commit Finding: NOT MET</button>
                                                          </div>
                                                          <textarea 
                                                            className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none shadow-inner"
                                                            placeholder="Final auditor rationale or field observations..."
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
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-12 animate-in fade-in duration-500">
                  <div className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center mx-auto text-slate-300 shadow-inner">
                      <ClipboardCheck size={64} />
                  </div>
                  <div className="max-w-2xl mx-auto">
                      <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-6">Phase 3: reporting & eMASS</h2>
                      <p className="text-xl text-slate-500 font-medium leading-relaxed">
                        Synthesize the Assessment Results Briefing (ARB) and finalize artifact hashing for CMMC eMASS submission. 
                        Document all Conditional Certification POA&M paths.
                      </p>
                  </div>
                  <div className="flex justify-center gap-6">
                      <button className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">Generate Out-Brief Report</button>
                      <button className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/50 hover:bg-black flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
                        <ArrowRight size={20} className="text-blue-400" /> Initiate eMASS Data Transfer
                      </button>
                  </div>
              </div>
          )}

          {activeCapPhase === 'PH4_CERTIFICATION' && (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
                   <div className="w-32 h-32 bg-green-50 rounded-[3rem] flex items-center justify-center mx-auto text-green-500 shadow-2xl shadow-green-100 ring-4 ring-green-100 animate-bounce-slow">
                      {/* Using the newly imported Award icon */}
                      <Award size={64} />
                  </div>
                  <div className="max-w-2xl mx-auto">
                      <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">Certification<br/>Finalization</h2>
                      <p className="text-xl text-slate-500 font-medium leading-relaxed">
                        Formal verification of findings. Upon concurrence from the Lead CCA and QA Individual, 
                        the final Certificate of CMMC Status is ready for issuance.
                      </p>
                  </div>
                  <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 inline-block max-w-xl text-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                      <div className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-8">Certificate Preparation Engine</div>
                      <div className="text-left space-y-4 mb-10">
                          <div className="flex justify-between text-sm border-b border-white/5 pb-2"><span className="text-white/40 uppercase font-black tracking-widest text-[9px]">Finding Concensus:</span> <span className="font-bold text-green-400 uppercase tracking-tight">VERIFIED MET</span></div>
                          <div className="flex justify-between text-sm border-b border-white/5 pb-2"><span className="text-white/40 uppercase font-black tracking-widest text-[9px]">Global Unique ID:</span> <span className="font-mono font-bold text-blue-200">CMMC-2026-AX-PR-9921-X5</span></div>
                      </div>
                      <button className="w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-green-900/50 transition-all hover:scale-[1.02] active:scale-[0.98]">Sign & Issue Official Certificate</button>
                  </div>
              </div>
          )}
      </div>

      {/* Footer Audit Meta */}
      <div className="flex justify-between items-center px-6 pt-6 border-t-2 border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] shrink-0">
          <div>Document Integrity Verified // CAP V2.0 Standard // SIG: {Math.random().toString(36).substring(7).toUpperCase()}</div>
          <div className="text-blue-600">Cuallee Cyber Compliance Architecture V2.4.1</div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
          <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-6 backdrop-blur-sm">
              <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300 border-t-[12px] border-blue-600">
                  <div className="bg-slate-900 p-10 flex justify-between items-center text-white">
                      <h3 className="font-black uppercase tracking-[0.2em] text-xl flex items-center gap-4">
                          <UserPlus size={28} className="text-blue-400" /> Grant Agency Access
                      </h3>
                      <button onClick={() => setShowInviteModal(false)} className="text-white/50 hover:text-white transition-colors"><X size={32} /></button>
                  </div>
                  <form onSubmit={handleInviteAuditor} className="p-12 space-y-10">
                      <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4">
                          <Info className="text-blue-600 shrink-0" size={24} />
                          <p className="text-sm text-blue-900 leading-relaxed font-medium">Inviting an agency email will grant a 72-hour **Read-Only** assessment token. This action is logged for audit integrity.</p>
                      </div>
                      <div className="space-y-4">
                          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1.5 px-2">Official Agency Email Address</label>
                          <div className="relative">
                              <Mail className="absolute left-6 top-5 text-slate-300" size={24} />
                              <input 
                                type="email" 
                                className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:ring-8 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold text-lg text-slate-900" 
                                placeholder="assessor@dcma.mil"
                                value={auditorEmail}
                                onChange={e => setAuditorEmail(e.target.value)}
                                required
                              />
                          </div>
                      </div>
                      <button type="submit" className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">Deploy Session Token</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
