import React, { useState, useEffect } from 'react';
import { Requirement, Artifact, Ticket, ConnectWiseConfig, JiraConfig, AssessmentObjective, Comment, User, IntegrationConfig } from '../types';
import { ArtifactUploader } from './ArtifactUploader';
import { TicketCreationModal } from './TicketCreationModal';
import { PolicyAnalyzer } from './PolicyAnalyzer';
import { explainRequirement } from '../services/gemini';
import { fetchAutomatedEvidence } from '../services/integrations';
import ReactMarkdown from 'react-markdown';
// Added missing Eye icon import
import { CheckCircle, Sparkles, Ticket as TicketIcon, ExternalLink, Share2, Layers, MessageSquare, Send, Mail, Copy, Clock, AlertTriangle, Cloud, Server, Shield, Loader2, PlayCircle, Lock, RefreshCw, Check, History, Eye } from 'lucide-react';

interface RequirementDetailProps {
  requirement: Requirement;
  onUpdateRequirement: (req: Requirement) => void;
  allArtifacts: Artifact[];
  onAddArtifact: (a: Artifact) => void;
  onRemoveArtifact: (id: string) => void;
  tickets: Ticket[];
  onAddTicket: (t: Ticket) => void;
  cwConfig: ConnectWiseConfig;
  jiraConfig: JiraConfig;
  currentUser?: User;
  m365Config?: IntegrationConfig;
  awsConfig?: IntegrationConfig;
  siemConfig?: IntegrationConfig;
  activeClientId?: string;
}

export const RequirementDetail: React.FC<RequirementDetailProps> = ({
  requirement,
  onUpdateRequirement,
  allArtifacts,
  onAddArtifact,
  onRemoveArtifact,
  tickets,
  onAddTicket,
  cwConfig,
  jiraConfig,
  currentUser,
  m365Config,
  awsConfig,
  siemConfig,
  activeClientId
}) => {
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'DISCUSSION' | 'EVIDENCE'>('DETAILS');
  const [simpleMode, setSimpleMode] = useState(true);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  if (!requirement) return null;

  useEffect(() => {
    setAiExplanation(null);
    setActiveTab('DETAILS');
  }, [requirement.id]);

  const handleExplain = async () => {
    if (loadingAi) return;
    setLoadingAi(true);
    try {
        const text = await explainRequirement(requirement);
        setAiExplanation(text);
    } catch (e) {
        setAiExplanation("AI service error.");
    } finally {
        setLoadingAi(false);
    }
  };

  const handleStatusChange = (objectiveId: string, newStatus: AssessmentObjective['status']) => {
    const updatedObjectives = requirement.objectives.map(obj => 
        obj.id === objectiveId ? { ...obj, status: newStatus } : obj
    );
    onUpdateRequirement({ ...requirement, objectives: updatedObjectives });
  };

  const relevantArtifacts = allArtifacts.filter(a => a.requirementId === requirement.id);
  const metCount = requirement.objectives?.filter(o => o.status === 'met').length || 0;
  const totalCount = requirement.objectives?.length || 0;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto flex flex-col h-full pb-20">
        <div className="flex justify-between items-start mb-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-black text-blue-700 bg-blue-100 px-2 py-1 rounded border border-blue-200">{requirement.id}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DOMAIN: {requirement.family}</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">{requirement.title}</h1>
            </div>
            <div className="flex gap-3">
                <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                    <button onClick={() => setSimpleMode(true)} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${simpleMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Summary</button>
                    <button onClick={() => setSimpleMode(false)} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!simpleMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Audit View</button>
                </div>
            </div>
        </div>

        <div className="flex border-b border-slate-200 mb-8 bg-white rounded-2xl px-4 pt-2 shadow-sm mx-1">
            <button onClick={() => setActiveTab('DETAILS')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'DETAILS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}><Check size={16} /> Audit Criteria</button>
            <button onClick={() => setActiveTab('EVIDENCE')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'EVIDENCE' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-400'}`}><Layers size={16} /> Evidence ({relevantArtifacts.length})</button>
            <button onClick={() => setActiveTab('DISCUSSION')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'DISCUSSION' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-400'}`}><MessageSquare size={16} /> Discussions</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
            <div className="lg:col-span-8 space-y-8">
                {activeTab === 'DETAILS' && (
                    <>
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Official Control Text</h3>
                            <p className="text-slate-700 text-xl leading-relaxed font-bold mb-8">{requirement.description}</p>
                            <div className="flex justify-end border-t border-slate-50 pt-6">
                                <button onClick={handleExplain} disabled={loadingAi} className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                                    {loadingAi ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                    AI Compliance Insight
                                </button>
                            </div>
                            {aiExplanation && (
                                <div className="mt-6 bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 prose prose-sm max-w-none animate-in fade-in slide-in-from-top-2">
                                    <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {/* Assessment Objectives Workbench - REFINED FOR CLARITY */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-900 px-10 py-6 border-b border-slate-800 flex justify-between items-center text-white">
                                <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Assessment Objectives (800-171A)</h3>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(metCount / (totalCount || 1)) * 100}%` }} />
                                    </div>
                                    <span className="text-[9px] font-black text-blue-400 uppercase">{metCount} / {totalCount}</span>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {requirement.objectives?.map(obj => (
                                    <div key={obj.id} className={`p-8 flex items-start gap-8 hover:bg-slate-50 transition-all group ${obj.status === 'met' ? 'bg-green-50/20' : ''}`}>
                                        <button 
                                            onClick={() => handleStatusChange(obj.id, obj.status === 'met' ? 'pending' : 'met')} 
                                            className={`mt-1 w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${obj.status === 'met' ? 'bg-green-600 border-green-600 text-white shadow-xl rotate-3' : 'bg-white border-slate-200 hover:border-blue-400 group-hover:scale-110'}`}
                                        >
                                            {obj.status === 'met' ? <Check size={20} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-slate-100" />}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${obj.status === 'met' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                    Objective [{obj.id.toUpperCase()}]
                                                </span>
                                                {obj.status === 'met' && <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1"><Check size={12}/> Verified</span>}
                                            </div>
                                            {/* REMOVED PLACEHOLDER - SHOWING ACTUAL OBJECTIVE DESCRIPTION AS THE TITLE */}
                                            <p className="text-base text-slate-800 font-bold leading-relaxed">{obj.description}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!requirement.objectives || requirement.objectives.length === 0) && (
                                    <div className="p-12 text-center text-slate-400 italic font-medium">
                                        No specific assessment objectives mapped for this practice.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-6">Implementation Narrative (SSP)</h3>
                            <textarea 
                                className="w-full h-64 p-8 border-2 border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none resize-none text-slate-700 bg-slate-50/50 font-medium text-lg leading-relaxed shadow-inner"
                                placeholder="Detail the technical and administrative controls used to satisfy this requirement for the System Security Plan..."
                                value={requirement.response || ''}
                                onChange={(e) => onUpdateRequirement({ ...requirement, response: e.target.value })}
                            />
                            <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest justify-end">
                                <History size={14}/> Auto-saved to Secure Vault
                            </div>
                        </div>
                    </>
                )}
                {activeTab === 'EVIDENCE' && (
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Technical Evidence Repository</h3>
                        <ArtifactUploader 
                            requirementId={requirement.id} 
                            artifacts={relevantArtifacts} 
                            onAddArtifact={onAddArtifact} 
                            onRemoveArtifact={onRemoveArtifact} 
                            activeClientId={activeClientId}
                        />
                    </div>
                )}
            </div>

            <div className="lg:col-span-4 space-y-8">
                <PolicyAnalyzer requirement={requirement} />
                
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Share2 size={16}/> Cross-Walk Mappings</h4>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NIST 800-53:</span>
                            <span className="text-blue-300 font-mono font-bold">{requirement.mappings?.nist800_53?.join(', ') || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ISO 27001:</span>
                            <span className="text-purple-300 font-mono font-bold">{requirement.mappings?.iso27001?.join(', ') || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Methods</h4>
                    <div className="space-y-4">
                        <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             {/* Fixed missing Eye icon from lucide-react */}
                             <div className="p-2 bg-white rounded-lg shadow-sm h-fit"><Eye size={16} className="text-blue-500"/></div>
                             <div>
                                <span className="text-[9px] font-black uppercase text-slate-400">Examine</span>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed mt-1">Review policies, system configs, and access logs.</p>
                             </div>
                        </div>
                        <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="p-2 bg-white rounded-lg shadow-sm h-fit"><MessageSquare size={16} className="text-amber-500"/></div>
                             <div>
                                <span className="text-[9px] font-black uppercase text-slate-400">Interview</span>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed mt-1">Personnel responsible for control execution.</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};