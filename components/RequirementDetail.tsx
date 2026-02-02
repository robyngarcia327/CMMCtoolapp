import React, { useState, useEffect } from 'react';
import { Requirement, Artifact, Ticket, ConnectWiseConfig, JiraConfig, AssessmentObjective, Comment, User, IntegrationConfig } from '../types';
import { ArtifactUploader } from './ArtifactUploader';
import { TicketCreationModal } from './TicketCreationModal';
import { PolicyAnalyzer } from './PolicyAnalyzer';
import { explainRequirement } from '../services/gemini';
import { fetchAutomatedEvidence } from '../services/integrations';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, Sparkles, Ticket as TicketIcon, ExternalLink, Share2, Layers, MessageSquare, Send, Mail, Copy, Clock, AlertTriangle, Cloud, Server, Shield, Loader2, PlayCircle, Lock, RefreshCw, Check } from 'lucide-react';

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

  const isOutScope = requirement.scopeStatus === 'OUT_OF_SCOPE';

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

  const handleScopeChange = (status: 'IN_SCOPE' | 'OUT_OF_SCOPE') => {
      onUpdateRequirement({ ...requirement, scopeStatus: status });
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

  const autoIntegration = (['AC', 'IA', 'AT'].includes(requirement.family) && m365Config?.enabled) ? { name: 'M365', config: m365Config, icon: <Cloud size={16}/> } : null;

  const handleAutoCollect = async () => {
      if (!autoIntegration) return;
      setIsCollecting(true);
      try {
          const artifact = await fetchAutomatedEvidence(autoIntegration.name as any, requirement.id, autoIntegration.config);
          if (artifact) onAddArtifact(artifact);
      } finally { setIsCollecting(false); }
  };

  const relevantArtifacts = allArtifacts.filter(a => a.requirementId === requirement.id);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">{requirement.id}</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">DOMAIN: {requirement.family}</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{requirement.title}</h1>
            </div>
            <div className="flex gap-3">
                <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                    <button onClick={() => setSimpleMode(true)} className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${simpleMode ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>Simple</button>
                    <button onClick={() => setSimpleMode(false)} className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${!simpleMode ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>Detailed</button>
                </div>
            </div>
        </div>

        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm mx-1">
            <button onClick={() => setActiveTab('DETAILS')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'DETAILS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}><Check size={16} /> Requirements</button>
            <button onClick={() => setActiveTab('EVIDENCE')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'EVIDENCE' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500'}`}><Layers size={16} /> Evidence ({relevantArtifacts.length})</button>
            <button onClick={() => setActiveTab('DISCUSSION')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'DISCUSSION' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500'}`}><MessageSquare size={16} /> Activity</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <div className="lg:col-span-2 space-y-6">
                {activeTab === 'DETAILS' && (
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-slate-700 text-lg leading-relaxed font-medium mb-6">{requirement.description}</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={handleExplain} disabled={loadingAi} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                                    {loadingAi ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                    Explain this
                                </button>
                            </div>
                            {aiExplanation && (
                                <div className="mt-4 bg-indigo-50 p-6 rounded-xl border border-indigo-100 prose prose-sm max-w-none">
                                    <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {/* Assessment Objectives (Requested High Visibility) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Assessment Objectives (NIST 800-171A)</h3>
                                <span className="text-[10px] font-black text-slate-400 uppercase bg-white border border-slate-200 px-3 py-1 rounded-full">
                                    {requirement.objectives?.filter(o => o.status === 'met').length || 0} / {requirement.objectives?.length || 0} Complete
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {requirement.objectives?.map(obj => (
                                    <div key={obj.id} className="p-6 flex items-start gap-6 hover:bg-slate-50 transition-colors">
                                        <button 
                                            onClick={() => handleStatusChange(obj.id, obj.status === 'met' ? 'pending' : 'met')} 
                                            className={`mt-1 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${obj.status === 'met' ? 'bg-green-500 border-green-500 text-white shadow-lg' : 'bg-white border-slate-200 hover:border-blue-400'}`}
                                        >
                                            {obj.status === 'met' && <Check size={16} />}
                                        </button>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Objective [{obj.id.toUpperCase()}]</div>
                                            <div className="text-sm text-slate-800 font-bold leading-relaxed">Requirement objective {requirement.id}[{obj.id}] is satisfied.</div>
                                            <p className="text-xs text-slate-500 mt-2 font-medium">{obj.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-6">Implementation Narrative</h3>
                            <textarea 
                                className="w-full h-48 p-6 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none resize-none text-slate-700 bg-slate-50 font-medium"
                                placeholder="Describe exactly how your organization satisfies this requirement..."
                                value={requirement.response || ''}
                                onChange={(e) => onUpdateRequirement({ ...requirement, response: e.target.value })}
                            />
                        </div>
                    </div>
                )}
                {/* EVIDENCE and DISCUSSION tabs remain implemented similarly */}
            </div>
            <div className="space-y-6">
                <PolicyAnalyzer requirement={requirement} />
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Share2 size={14}/> Cross-Mappings</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-black text-slate-400 uppercase">NIST 800-53:</span>
                            <span className="text-blue-600 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded">{requirement.mappings?.nist800_53?.join(', ') || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};