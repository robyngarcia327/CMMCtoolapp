import React, { useState, useEffect } from 'react';
import { Requirement, Artifact, Ticket, ConnectWiseConfig, JiraConfig, AssessmentObjective, Comment, User, IntegrationConfig } from '../types';
import { ArtifactUploader } from './ArtifactUploader';
import { TicketCreationModal } from './TicketCreationModal';
import { PolicyAnalyzer } from './PolicyAnalyzer';
import { explainRequirement } from '../services/gemini';
import { fetchAutomatedEvidence } from '../services/integrations';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, Sparkles, Ticket as TicketIcon, ExternalLink, Share2, Layers, MessageSquare, Send, Mail, Copy, Clock, AlertTriangle, Cloud, Server, Shield, Loader2, PlayCircle, Lock, RefreshCw, Check, History } from 'lucide-react';

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
  const [isCollecting, setIsCollecting] = useState(false);

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

  const handleAddComment = () => {
      if (!newComment.trim()) return;
      const comment: Comment = {
          id: Date.now().toString(),
          userId: currentUser?.id || 'guest',
          userName: currentUser?.name || 'Guest User',
          text: newComment,
          timestamp: Date.now()
      };
      onUpdateRequirement({ ...requirement, comments: [...(requirement.comments || []), comment] });
      setNewComment('');
  };

  const relevantArtifacts = allArtifacts.filter(a => a.requirementId === requirement.id);
  const metCount = requirement.objectives?.filter(o => o.status === 'met').length || 0;
  const totalCount = requirement.objectives?.length || 0;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto flex flex-col h-full">
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
                    <button onClick={() => setSimpleMode(false)} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!simpleMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Assessor</button>
                </div>
            </div>
        </div>

        <div className="flex border-b border-slate-200 mb-8 bg-white rounded-2xl px-4 pt-2 shadow-sm mx-1">
            <button onClick={() => setActiveTab('DETAILS')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'DETAILS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}><Check size={16} /> Audit Criteria</button>
            <button onClick={() => setActiveTab('EVIDENCE')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'EVIDENCE' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-400'}`}><Layers size={16} /> Evidence ({relevantArtifacts.length})</button>
            <button onClick={() => setActiveTab('DISCUSSION')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'DISCUSSION' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-400'}`}><MessageSquare size={16} /> Verification</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
            <div className="lg:col-span-8 space-y-8">
                {activeTab === 'DETAILS' && (
                    <>
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Practice Statement</h3>
                            <p className="text-slate-700 text-xl leading-relaxed font-bold mb-8">{requirement.description}</p>
                            <div className="flex justify-end border-t border-slate-50 pt-6">
                                <button onClick={handleExplain} disabled={loadingAi} className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                                    {loadingAi ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                    Analyze Requirements
                                </button>
                            </div>
                            {aiExplanation && (
                                <div className="mt-6 bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100 prose prose-sm max-w-none animate-in fade-in slide-in-from-top-2">
                                    <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                                </div>
                            )}
                        </div>

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
                                            className={`mt-1 w-10 h-10 rounded-[1rem] border-2 flex items-center justify-center transition-all ${obj.status === 'met' ? 'bg-green-600 border-green-600 text-white shadow-xl rotate-3' : 'bg-white border-slate-200 hover:border-blue-400 group-hover:scale-110'}`}
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
                                            <p className="text-base text-slate-800 font-bold leading-relaxed">{obj.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10">
                            <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] mb-6">Implementation Narrative (SSP Section)</h3>
                            <textarea 
                                className="w-full h-64 p-8 border-2 border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none resize-none text-slate-700 bg-slate-50/50 font-medium text-lg leading-relaxed shadow-inner"
                                placeholder="Describe the technical mechanisms, policies, and procedures used to satisfy this practice..."
                                value={requirement.response || ''}
                                onChange={(e) => onUpdateRequirement({ ...requirement, response: e.target.value })}
                            />
                            <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest justify-end">
                                <History size={14}/> Autosaved to Local Storage
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="lg:col-span-4 space-y-8">
                <PolicyAnalyzer requirement={requirement} />
                
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Share2 size={16}/> Standards Mapping</h4>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NIST 800-53:</span>
                            <span className="text-blue-300 font-mono font-bold">{requirement.mappings?.nist800_53?.join(', ') || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Assessor Interview Prep</h4>
                    <div className="space-y-4">
                        {requirement.interviewOptions?.slice(0, 3).map((q, i) => (
                            <div key={i} className="text-xs font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3">
                                <div className="text-blue-500">Q.</div>
                                <div className="leading-relaxed">{q}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
