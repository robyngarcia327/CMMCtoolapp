import React, { useState, useEffect } from 'react';
import { Requirement, Artifact, Ticket, ConnectWiseConfig, JiraConfig, AssessmentObjective, Comment, User, IntegrationConfig, PolicyDocument } from '../types';
import { ArtifactUploader } from './ArtifactUploader';
import { TicketCreationModal } from './TicketCreationModal';
import { PolicyAnalyzer } from './PolicyAnalyzer';
import { explainRequirement } from '../services/gemini';
import { fetchAutomatedEvidence } from '../services/integrations';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, Sparkles, Ticket as TicketIcon, ExternalLink, Share2, Layers, MessageSquare, Send, Mail, Copy, Clock, AlertTriangle, Cloud, Server, Shield, Loader2, PlayCircle, Lock, RefreshCw, Check, History, Eye, FileText, ClipboardList, Trash2, X, Image as ImageIcon } from 'lucide-react';

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
  policies?: PolicyDocument[];
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
  activeClientId,
  policies = []
}) => {
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'DISCUSSION' | 'EVIDENCE'>('DETAILS');
  const [triggerSnip, setTriggerSnip] = useState(false);
  const [simpleMode, setSimpleMode] = useState(true);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isPoamModalOpen, setIsPoamModalOpen] = useState(false);
  const [poamForm, setPoamForm] = useState({
    weaknessName: '',
    scheduledCompletionDate: '',
    milestones: '',
    status: 'Open'
  });
  const [newComment, setNewComment] = useState('');

  if (!requirement) return null;

  useEffect(() => {
    setAiExplanation(null);
    setActiveTab('DETAILS');
    if (requirement.poam) {
        setPoamForm({
            weaknessName: requirement.poam.weaknessName,
            scheduledCompletionDate: requirement.poam.scheduledCompletionDate,
            milestones: requirement.poam.milestones,
            status: requirement.poam.status
        });
    } else {
        setPoamForm({
            weaknessName: '',
            scheduledCompletionDate: '',
            milestones: '',
            status: 'Open'
        });
    }
  }, [requirement.id, requirement.poam]);

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

  const handleSavePoam = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRequirement({
        ...requirement,
        poam: { ...poamForm }
    });
    setIsPoamModalOpen(false);
  };

  const handleRemovePoam = () => {
    if (confirm('Are you sure you want to remove this control from the POA&M?')) {
        onUpdateRequirement({
            ...requirement,
            poam: undefined
        });
    }
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
                <button 
                    onClick={() => setIsPoamModalOpen(true)}
                    className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm ${requirement.poam ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                    <ClipboardList size={16} />
                    {requirement.poam ? 'Edit POA&M' : 'Add to POA&M'}
                </button>
                <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('EVIDENCE')}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${activeTab === 'EVIDENCE' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-600 hover:bg-purple-50'}`}
                    >
                        <Layers size={14} /> Evidence
                    </button>
                    <button 
                        onClick={() => {
                            setActiveTab('EVIDENCE');
                            // We'll use a small timeout to let the tab switch before we try to trigger the snipper
                            // Or better, we just pass a prop to ArtifactUploader
                            setTriggerSnip(true);
                        }}
                        className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                    >
                        <ImageIcon size={14} /> Snip
                    </button>
                    <div className="w-px h-4 bg-slate-200 self-center mx-1" />
                    <button onClick={() => setSimpleMode(true)} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${simpleMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Summary</button>
                    <button onClick={() => setSimpleMode(false)} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!simpleMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Audit View</button>
                </div>
            </div>
        </div>

        <div className="flex border-b border-slate-200 mb-8 bg-white rounded-2xl px-4 pt-2 shadow-sm mx-1">
            <button onClick={() => setActiveTab('DETAILS')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'DETAILS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}><Check size={16} /> Discovery & Criteria</button>
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

                        {requirement.poam && (
                             <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-10 relative overflow-hidden group">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                 <div className="flex justify-between items-start mb-6">
                                     <h3 className="text-[10px] font-black text-amber-700 uppercase tracking-[0.3em] flex items-center gap-2">
                                         <AlertTriangle size={18} /> Active POA&M Entry
                                     </h3>
                                     <button onClick={handleRemovePoam} className="text-amber-400 hover:text-red-500 transition-colors">
                                         <Trash2 size={18} />
                                     </button>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     <div>
                                         <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-1">Weakness Description</label>
                                         <p className="text-sm font-bold text-slate-800">{requirement.poam.weaknessName}</p>
                                     </div>
                                     <div>
                                         <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-1">Scheduled Completion</label>
                                         <p className="text-sm font-bold text-slate-800">{requirement.poam.scheduledCompletionDate}</p>
                                     </div>
                                     <div className="md:col-span-2">
                                         <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-1">Milestones & Remediation Plan</label>
                                         <p className="text-sm font-bold text-slate-800 leading-relaxed">{requirement.poam.milestones}</p>
                                     </div>
                                 </div>
                             </div>
                         )}

                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-900 px-10 py-6 border-b border-slate-800 flex justify-between items-center text-white">
                                <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Practitioner Verification Objectives</h3>
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
                                                {obj.status === 'met' && <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1"><Check size={12}/> Gathered</span>}
                                            </div>
                                            <p className="text-base text-slate-800 font-bold leading-relaxed">{obj.description}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!requirement.objectives || requirement.objectives.length === 0) && (
                                    <div className="p-12 text-center text-slate-400 italic font-medium">
                                        No specific discovery objectives mapped for this practice.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <h3 className="font-black text-slate-900 uppercase tracking-[0.3em] text-[10px] whitespace-nowrap">Policy Alignment</h3>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Linked Policy:</span>
                                        <select 
                                            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[200px]"
                                            value={requirement.policyMapping?.policyId || ''}
                                            onChange={(e) => {
                                                const policyId = e.target.value;
                                                onUpdateRequirement({
                                                    ...requirement,
                                                    policyMapping: policyId ? { policyId, sectionId: '' } : undefined
                                                });
                                            }}
                                        >
                                            <option value="">No Policy Linked</option>
                                            {policies.map(p => (
                                                <option key={p.id} value={p.id}>{p.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {requirement.policyMapping?.policyId && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Section:</span>
                                            <select 
                                                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[150px]"
                                                value={requirement.policyMapping?.sectionId || ''}
                                                onChange={(e) => {
                                                    onUpdateRequirement({
                                                        ...requirement,
                                                        policyMapping: {
                                                            ...requirement.policyMapping!,
                                                            sectionId: e.target.value
                                                        }
                                                    });
                                                }}
                                            >
                                                <option value="">Select Section</option>
                                                {policies.find(p => p.id === requirement.policyMapping?.policyId)?.sections.map(s => (
                                                    <option key={s.id} value={s.id}>{s.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {requirement.policyMapping?.policyId && requirement.policyMapping?.sectionId ? (
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText size={14} className="text-blue-600" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Policy Content</span>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                        "{policies.find(p => p.id === requirement.policyMapping?.policyId)?.sections.find(s => s.id === requirement.policyMapping?.sectionId)?.content.substring(0, 300)}..."
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a policy and section to link this control</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-6">Client Implementation Narrative (SSP)</h3>
                            <textarea 
                                className="w-full h-64 p-8 border-2 border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none resize-none text-slate-700 bg-slate-50/50 font-medium text-lg leading-relaxed shadow-inner"
                                placeholder="Detail the client's technical and administrative controls used to satisfy this requirement..."
                                value={requirement.response || ''}
                                onChange={(e) => onUpdateRequirement({ ...requirement, response: e.target.value })}
                            />
                            <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest justify-end">
                                <History size={14}/> Autosave Enabled
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'EVIDENCE' && (
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                                <Layers size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Evidence Repository</h3>
                                <p className="text-slate-500 text-xs font-medium">Upload files or use the snipping tool to capture evidence for this control.</p>
                            </div>
                        </div>
                        
                        <ArtifactUploader 
                            requirementId={requirement.id} 
                            artifacts={relevantArtifacts} 
                            onAddArtifact={onAddArtifact} 
                            onRemoveArtifact={onRemoveArtifact}
                            activeClientId={activeClientId}
                            autoOpenSnipper={triggerSnip}
                            onSnipperHandled={() => setTriggerSnip(false)}
                        />
                    </div>
                )}

                {activeTab === 'DISCUSSION' && (
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col h-[600px]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Control Discussion</h3>
                                <p className="text-slate-500 text-xs font-medium">Collaborate with your team on this specific requirement.</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                            {(requirement.comments || []).length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                    <MessageSquare size={48} className="opacity-10 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No comments yet</p>
                                </div>
                            ) : (
                                requirement.comments?.map((comment) => (
                                    <div key={comment.id} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xs shrink-0 uppercase">
                                            {comment.userName.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{comment.userName}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(comment.timestamp).toLocaleString()}</span>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 text-sm text-slate-700 font-medium">
                                                {comment.text}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="relative">
                            <textarea 
                                className="w-full p-5 pr-16 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 resize-none h-24"
                                placeholder="Type your message..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button 
                                onClick={() => {
                                    if (!newComment.trim()) return;
                                    const comment: Comment = {
                                        id: `c-${Date.now()}`,
                                        userId: currentUser?.id || 'User',
                                        userName: currentUser?.name || 'User',
                                        text: newComment,
                                        timestamp: Date.now()
                                    };
                                    onUpdateRequirement({
                                        ...requirement,
                                        comments: [...(requirement.comments || []), comment]
                                    });
                                    setNewComment('');
                                }}
                                className="absolute bottom-4 right-4 p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:col-span-4 space-y-8">
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare size={16}/> Practitioner Prep Guide
                    </h3>
                    <div className="space-y-4">
                        {requirement.interviewOptions?.map((q, i) => (
                            <div key={i} className="flex gap-3 bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
                                <div className="text-indigo-600 font-black text-sm">Q.</div>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">{q}</p>
                            </div>
                        ))}
                    </div>
                </div>

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
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Discovery Methods</h4>
                    <div className="space-y-4">
                        <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="p-2 bg-white rounded-lg shadow-sm h-fit"><Eye size={16} className="text-blue-500"/></div>
                             <div>
                                <span className="text-[9px] font-black uppercase text-slate-400">Examine</span>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed mt-1">Review policies, system configs, and access logs with client.</p>
                             </div>
                        </div>
                        <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="p-2 bg-white rounded-lg shadow-sm h-fit"><MessageSquare size={16} className="text-amber-500"/></div>
                             <div>
                                <span className="text-[9px] font-black uppercase text-slate-400">Collaborate</span>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed mt-1">Discovery sessions with personnel responsible for control execution.</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* POA&M Modal */}
      {isPoamModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-6 backdrop-blur-sm">
              <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border-t-[12px] border-amber-500">
                  <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
                      <h3 className="font-black uppercase tracking-[0.2em] text-lg flex items-center gap-3">
                          <ClipboardList size={24} className="text-amber-400" /> POA&M Management
                      </h3>
                      <button onClick={() => setIsPoamModalOpen(false)} className="text-white/50 hover:text-white transition-colors"><X size={28} /></button>
                  </div>
                  <form onSubmit={handleSavePoam} className="p-10 space-y-8">
                      <div className="space-y-2">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Weakness Name / Description</label>
                          <textarea 
                            required
                            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-900 h-24 resize-none" 
                            placeholder="Describe the identified compliance gap..."
                            value={poamForm.weaknessName}
                            onChange={e => setPoamForm({...poamForm, weaknessName: e.target.value})}
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Scheduled Completion</label>
                              <input 
                                type="date"
                                required
                                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-900" 
                                value={poamForm.scheduledCompletionDate}
                                onChange={e => setPoamForm({...poamForm, scheduledCompletionDate: e.target.value})}
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Status</label>
                              <select 
                                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-900" 
                                value={poamForm.status}
                                onChange={e => setPoamForm({...poamForm, status: e.target.value})}
                              >
                                  <option value="Open">Open</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Risk Accepted">Risk Accepted</option>
                              </select>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Milestones & Remediation Plan</label>
                          <textarea 
                            required
                            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-900 h-32 resize-none" 
                            placeholder="Outline the steps required to remediate this weakness..."
                            value={poamForm.milestones}
                            onChange={e => setPoamForm({...poamForm, milestones: e.target.value})}
                          />
                      </div>

                      <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setIsPoamModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-200 transition-all">Cancel</button>
                          <button type="submit" className="flex-[2] py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-amber-200 transition-all">Save POA&M Entry</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};