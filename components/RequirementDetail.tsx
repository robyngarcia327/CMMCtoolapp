import React, { useState, useEffect } from 'react';
import { Requirement, Artifact, Ticket, ConnectWiseConfig, JiraConfig, AssessmentObjective, Comment, User, IntegrationConfig } from '../types';
import { ArtifactUploader } from './ArtifactUploader';
import { TicketCreationModal } from './TicketCreationModal';
import { PolicyAnalyzer } from './PolicyAnalyzer';
import { explainRequirement } from '../services/gemini';
import { fetchAutomatedEvidence } from '../services/integrations';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, Sparkles, Ticket as TicketIcon, ExternalLink, Share2, Layers, MessageSquare, Send, Mail, Copy, Clock, AlertTriangle, Cloud, Server, Shield, Loader2, PlayCircle, Lock, RefreshCw } from 'lucide-react';

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

  // Safety guard for requirement prop
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
        setAiExplanation("AI service error. Please check your network or API key.");
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

  const copyAiToImplementation = () => {
      if (aiExplanation) {
          onUpdateRequirement({ ...requirement, response: aiExplanation });
          alert("AI Guidance copied to Implementation Narrative.");
      }
  };

  // --- Automation Logic ---
  const getRelevantIntegration = () => {
      if (['AC', 'IA', 'AT'].includes(requirement.family) && m365Config?.enabled) return { name: 'M365', config: m365Config, icon: <Cloud size={16}/> };
      if (['SC', 'CP', 'RA'].includes(requirement.family) && awsConfig?.enabled) return { name: 'AWS', config: awsConfig, icon: <Server size={16}/> };
      if (['AU', 'IR', 'SI'].includes(requirement.family) && siemConfig?.enabled) return { name: 'SIEM', config: siemConfig, icon: <Shield size={16}/> };
      return null;
  };

  const autoIntegration = getRelevantIntegration();

  const handleAutoCollect = async () => {
      if (!autoIntegration) return;
      setIsCollecting(true);
      try {
          const artifact = await fetchAutomatedEvidence(autoIntegration.name as any, requirement.id, autoIntegration.config);
          if (artifact) {
              onAddArtifact(artifact);
              alert("Evidence collected successfully from " + autoIntegration.name);
          }
      } catch (e) {
          alert("Failed to collect evidence.");
      } finally {
          setIsCollecting(false);
      }
  };

  const relevantArtifacts = allArtifacts.filter(a => a.requirementId === requirement.id);
  const relevantTickets = tickets.filter(t => t.requirementId === requirement.id);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">{requirement.id}</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Domain: {requirement.family}</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{requirement.title}</h1>
            </div>
            <div className="flex gap-3">
                <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                    <button onClick={() => setSimpleMode(true)} className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${simpleMode ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>Simple</button>
                    <button onClick={() => setSimpleMode(false)} className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${!simpleMode ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>Detailed</button>
                </div>
                <div className="flex bg-slate-200 rounded-lg p-1">
                     <button onClick={() => handleScopeChange('IN_SCOPE')} className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${!isOutScope ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`}>In Scope</button>
                    <button onClick={() => handleScopeChange('OUT_OF_SCOPE')} className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${isOutScope ? 'bg-white shadow text-slate-700' : 'text-slate-500'}`}>N/A</button>
                </div>
            </div>
        </div>

        {/* Tab Nav */}
        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm mx-1">
            <button onClick={() => setActiveTab('DETAILS')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'DETAILS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}><CheckCircle size={16} /> Requirements</button>
            <button onClick={() => setActiveTab('EVIDENCE')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'EVIDENCE' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500'}`}><Layers size={16} /> Evidence ({relevantArtifacts.length})</button>
            <button onClick={() => setActiveTab('DISCUSSION')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'DISCUSSION' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500'}`}><MessageSquare size={16} /> Activity</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <div className="lg:col-span-2 space-y-6">
                {activeTab === 'DETAILS' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <p className="text-slate-700 text-lg leading-relaxed mb-4 font-medium">{requirement.description}</p>
                            {!simpleMode && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600 mb-4">
                                    <h4 className="font-bold text-slate-800 mb-1 uppercase text-xs tracking-wider">NIST Discussion</h4>
                                    {requirement.discussion}
                                </div>
                            )}
                            <div className="flex justify-end gap-3">
                                {aiExplanation && (
                                    <button onClick={copyAiToImplementation} className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1">
                                        <Copy size={14} /> Copy to Narrative
                                    </button>
                                )}
                                <button onClick={handleExplain} disabled={loadingAi} className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1">
                                    {loadingAi ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                    {loadingAi ? 'Synthesizing...' : 'Explain this'}
                                </button>
                            </div>
                            {aiExplanation && (
                                <div className="mt-4 bg-indigo-50 p-6 rounded-xl border border-indigo-100 prose prose-sm max-w-none animate-in fade-in zoom-in-95 duration-200">
                                    <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {/* Assessment Objectives */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">Assessment Objectives (NIST 800-171A)</h3>
                                <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">
                                    {requirement.objectives?.filter(o => o.status === 'met').length || 0} / {requirement.objectives?.length || 0} Complete
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {requirement.objectives && requirement.objectives.length > 0 ? requirement.objectives.map(obj => (
                                    <div key={obj.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                                        <button 
                                            onClick={() => handleStatusChange(obj.id, obj.status === 'met' ? 'pending' : 'met')} 
                                            className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${obj.status === 'met' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}
                                        >
                                            {obj.status === 'met' && <CheckCircle size={14} />}
                                        </button>
                                        <div className="flex-1">
                                            <div className="text-xs font-black text-slate-400 uppercase mb-0.5">Objective [{obj.id}]</div>
                                            <div className="text-sm text-slate-800">{obj.description}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-slate-400 italic">No detailed objectives for this control.</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Implementation Narrative</h3>
                            <textarea 
                                className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-700 bg-slate-50"
                                placeholder="Describe exactly how your organization satisfies this requirement..."
                                value={requirement.response || ''}
                                onChange={(e) => onUpdateRequirement({ ...requirement, response: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'EVIDENCE' && (
                    <div className="space-y-6">
                        {autoIntegration && (
                            <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-xl p-6 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="font-bold flex items-center gap-2 mb-1">
                                        {autoIntegration.icon} Automated Collection
                                    </h3>
                                    <p className="text-blue-200 text-sm">
                                        Fetch evidence directly from {autoIntegration.name}.
                                    </p>
                                </div>
                                <button 
                                    onClick={handleAutoCollect}
                                    disabled={isCollecting}
                                    className="relative z-10 bg-white text-indigo-900 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                                >
                                    {isCollecting ? <Loader2 className="animate-spin" size={16}/> : <PlayCircle size={16}/>}
                                    {isCollecting ? 'Fetching...' : 'Auto-Collect'}
                                </button>
                            </div>
                        )}

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4">Secure Evidence Upload</h3>
                            <ArtifactUploader 
                                requirementId={requirement.id} 
                                artifacts={relevantArtifacts} 
                                onAddArtifact={onAddArtifact} 
                                onRemoveArtifact={onRemoveArtifact}
                                activeClientId={activeClientId}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'DISCUSSION' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {(requirement.comments || []).length === 0 ? <div className="text-center text-slate-400 py-10 italic">No activity recorded for this requirement.</div> : requirement.comments?.map(c => (
                                <div key={c.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="font-bold text-sm text-slate-900">{c.userName}</div>
                                        <div className="text-[10px] text-slate-400">{new Date(c.timestamp).toLocaleString()}</div>
                                    </div>
                                    <div className="text-sm text-slate-700">{c.text}</div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t bg-slate-50 flex gap-2">
                            <input className="flex-1 border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Post a comment or update..." value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddComment()}/>
                            <button onClick={handleAddComment} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors"><Send size={18}/></button>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <PolicyAnalyzer requirement={requirement} />
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Share2 size={14}/> Mappings</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-400">NIST 800-53:</span>
                            <span className="text-slate-700 font-mono">{requirement.mappings?.nist800_53?.join(', ') || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-400">ISO 27001:</span>
                            <span className="text-slate-700 font-mono">{requirement.mappings?.iso27001?.join(', ') || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <TicketCreationModal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} cwConfig={cwConfig} jiraConfig={jiraConfig} requirementId={requirement.id} requirementTitle={requirement.title} onTicketCreated={onAddTicket} />
    </div>
  );
};