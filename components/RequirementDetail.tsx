
import React, { useState, useEffect } from 'react';
import { Requirement, Artifact, Ticket, ConnectWiseConfig, JiraConfig, AssessmentObjective, Comment, User } from '../types';
import { ArtifactUploader } from './ArtifactUploader';
import { TicketCreationModal } from './TicketCreationModal';
import { PolicyAnalyzer } from './PolicyAnalyzer';
import { explainRequirement } from '../services/gemini';
import { NIST_CSF_FUNCTIONS } from '../data/standards';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, Sparkles, ChevronDown, ChevronUp, Ticket as TicketIcon, ExternalLink, Share2, Layers, Monitor, EyeOff, BookOpen, MessageSquare, Send, Mail, Copy, Clock, AlertTriangle, UserCircle, RefreshCw } from 'lucide-react';

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
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'DISCUSSION' | 'EVIDENCE'>('DETAILS');
  const [simpleMode, setSimpleMode] = useState(true); // Default to simple mode for SMB/Non-techs
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const isOutScope = requirement.scopeStatus === 'OUT_OF_SCOPE';
  const evidenceEmail = requirement.evidenceEmail || `upload+${requirement.id.replace(/\./g,'-')}@audit-iq.demo`;

  // Reset state when req changes
  useEffect(() => {
    setAiExplanation(null);
    setActiveTab('DETAILS');
  }, [requirement.id]);

  const handleExplain = async () => {
    setLoadingAi(true);
    const text = await explainRequirement(requirement);
    setAiExplanation(text);
    setLoadingAi(false);
  };

  const handleStatusChange = (objectiveId: string, newStatus: AssessmentObjective['status']) => {
    const updatedObjectives = requirement.objectives.map(obj => 
        obj.id === objectiveId ? { ...obj, status: newStatus } : obj
    );
    onUpdateRequirement({
        ...requirement,
        objectives: updatedObjectives
    });
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
      const updatedComments = [...(requirement.comments || []), comment];
      onUpdateRequirement({ ...requirement, comments: updatedComments });
      setNewComment('');
  };

  const relevantArtifacts = allArtifacts.filter(a => a.requirementId === requirement.id);
  const relevantTickets = tickets.filter(t => t.requirementId === requirement.id);
  const canCreateTicket = cwConfig.enabled || jiraConfig.enabled;

  const copyEmailToClipboard = () => {
      navigator.clipboard.writeText(evidenceEmail);
      alert("Email copied! Forward evidence to this address to automatically attach it.");
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        
        {/* Top Header Bar */}
        <div className="flex justify-between items-start mb-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                    {requirement.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Family: {requirement.family}
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{requirement.title}</h1>
            </div>
            
            <div className="flex gap-3">
                <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                    <button 
                        onClick={() => setSimpleMode(true)}
                        className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${simpleMode ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Simple
                    </button>
                    <button 
                        onClick={() => setSimpleMode(false)}
                        className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${!simpleMode ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Detailed
                    </button>
                </div>
                <div className="flex bg-slate-200 rounded-lg p-1">
                     <button
                        onClick={() => handleScopeChange('IN_SCOPE')}
                        className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${!isOutScope ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`}
                    >
                        In Scope
                    </button>
                    <button
                        onClick={() => handleScopeChange('OUT_OF_SCOPE')}
                        className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${isOutScope ? 'bg-white shadow text-slate-700' : 'text-slate-500'}`}
                    >
                        N/A
                    </button>
                </div>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm mx-1">
            <button 
                onClick={() => setActiveTab('DETAILS')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'DETAILS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <CheckCircle size={16} /> Requirements
            </button>
            <button 
                onClick={() => setActiveTab('EVIDENCE')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'EVIDENCE' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <Layers size={16} /> Evidence ({relevantArtifacts.length})
            </button>
            <button 
                onClick={() => setActiveTab('DISCUSSION')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'DISCUSSION' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <MessageSquare size={16} /> Activity
                {(requirement.comments?.length || 0) > 0 && (
                    <span className="bg-green-100 text-green-700 px-1.5 rounded-full text-[10px]">{requirement.comments?.length}</span>
                )}
            </button>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* DETAILS TAB */}
                {activeTab === 'DETAILS' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                        {/* Requirement Text */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <p className="text-slate-700 text-lg leading-relaxed mb-4 font-medium">{requirement.description}</p>
                            
                            {/* Simple Mode vs Detailed Mode Toggle */}
                            {!simpleMode && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600 mb-4 prose prose-sm max-w-none">
                                    <h4 className="font-bold text-slate-800 mb-1 uppercase text-xs tracking-wider">NIST Discussion</h4>
                                    {requirement.discussion}
                                </div>
                            )}

                            {/* AI Helper */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleExplain}
                                    className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1"
                                >
                                    <Sparkles size={14} /> {loadingAi ? 'Thinking...' : 'Explain this to me like I\'m 5'}
                                </button>
                            </div>
                            {aiExplanation && (
                                <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100 prose prose-sm max-w-none text-slate-800">
                                    <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {/* Objectives / Action Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">Action Checklist</h3>
                                <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">
                                    {requirement.objectives.filter(o => o.status === 'met').length} / {requirement.objectives.length} Complete
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {requirement.objectives.map(obj => (
                                    <div key={obj.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors group">
                                        <div className="pt-1">
                                            <button 
                                                onClick={() => handleStatusChange(obj.id, obj.status === 'met' ? 'pending' : 'met')}
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                    obj.status === 'met' ? 'bg-green-500 border-green-500 text-white' : 
                                                    obj.status === 'not_met' ? 'bg-red-100 border-red-300 text-red-500' :
                                                    'border-slate-300 text-transparent hover:border-blue-400'
                                                }`}
                                            >
                                                {obj.status === 'met' && <CheckCircle size={14} />}
                                                {obj.status === 'not_met' && <AlertTriangle size={12} />}
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-sm ${obj.status === 'met' ? 'text-slate-400 line-through' : 'text-slate-800 font-medium'}`}>
                                                {obj.description}
                                            </div>
                                            {/* Quick Actions per objective could go here */}
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <select 
                                                value={obj.status}
                                                onChange={(e) => handleStatusChange(obj.id, e.target.value as any)}
                                                className="text-xs border rounded p-1 bg-white"
                                            >
                                                <option value="pending">To Do</option>
                                                <option value="met">Done</option>
                                                <option value="not_met">Gap</option>
                                                <option value="na">N/A</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tickets Section */}
                        {canCreateTicket && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <TicketIcon size={18} className="text-indigo-600"/> Linked Tickets
                                </h3>
                                <button
                                    onClick={() => setIsTicketModalOpen(true)}
                                    className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-medium border border-indigo-200 transition-colors"
                                >
                                    + Create Ticket
                                </button>
                                </div>
                                <div className="space-y-2">
                                    {relevantTickets.map(ticket => (
                                        <div key={ticket.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${ticket.source === 'Jira' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                    {ticket.ticketNumber}
                                                </span>
                                                <span className="text-sm text-slate-700 font-medium">{ticket.summary}</span>
                                            </div>
                                            <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border">{ticket.status}</span>
                                        </div>
                                    ))}
                                    {relevantTickets.length === 0 && <p className="text-sm text-slate-400 italic">No active tickets.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* EVIDENCE TAB */}
                {activeTab === 'EVIDENCE' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Email Ingestion Box */}
                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold flex items-center gap-2 mb-2">
                                    <Mail size={18} className="text-blue-400"/> Email to Evidence
                                </h3>
                                <p className="text-slate-300 text-sm mb-4 max-w-lg">
                                    Forward invoices, policy docs, or screenshots directly to this control. They will automatically appear as artifacts below.
                                </p>
                                <div className="flex gap-2">
                                    <code className="bg-black/30 px-3 py-2 rounded text-sm font-mono text-blue-200 border border-white/10 flex-1 truncate">
                                        {evidenceEmail}
                                    </code>
                                    <button 
                                        onClick={copyEmailToClipboard}
                                        className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded text-white transition-colors"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                            <Mail className="absolute -right-6 -bottom-6 text-white/5 w-48 h-48" />
                        </div>

                        {/* Upload & List */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="mb-6">
                                <h3 className="font-bold text-slate-800 mb-4">Manual Upload</h3>
                                <ArtifactUploader 
                                    requirementId={requirement.id}
                                    artifacts={relevantArtifacts}
                                    onAddArtifact={onAddArtifact}
                                    onRemoveArtifact={onRemoveArtifact}
                                />
                            </div>
                        </div>

                        {/* Evidence Aging / Freshness */}
                        {relevantArtifacts.length > 0 && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Clock size={18} className="text-amber-500" /> Evidence Freshness
                                </h3>
                                <div className="space-y-3">
                                    {relevantArtifacts.map(art => {
                                        const ageDays = Math.floor((Date.now() - art.timestamp) / (1000 * 60 * 60 * 24));
                                        const isStale = ageDays > 365;
                                        const isWarning = ageDays > 330;

                                        return (
                                            <div key={art.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${isStale ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-800">{art.name}</div>
                                                        <div className="text-xs text-slate-500">{new Date(art.timestamp).toLocaleDateString()} ({ageDays} days old)</div>
                                                    </div>
                                                </div>
                                                {isStale && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">EXPIRED</span>}
                                                {isWarning && !isStale && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">RENEW SOON</span>}
                                                {!isWarning && !isStale && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">VALID</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* DISCUSSION TAB */}
                {activeTab === 'DISCUSSION' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {(requirement.comments || []).length === 0 ? (
                                <div className="text-center text-slate-400 py-10">
                                    <MessageSquare size={48} className="mx-auto mb-2 opacity-20" />
                                    <p>No comments yet. Start a discussion!</p>
                                </div>
                            ) : (
                                requirement.comments?.map(comment => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                                            {comment.userName.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="font-bold text-sm text-slate-800">{comment.userName}</span>
                                                <span className="text-xs text-slate-400">{new Date(comment.timestamp).toLocaleString()}</span>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 border border-slate-100">
                                                {comment.text}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Type a message or @mention..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                />
                                <button 
                                    onClick={handleAddComment}
                                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column (Info Sidebar) - Hidden in simple mode unless expanded? No, keep pertinent info */}
            <div className="space-y-6">
                
                {/* Policy Analysis Widget */}
                <PolicyAnalyzer requirement={requirement} />

                {/* References */}
                {!simpleMode && (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <BookOpen size={14} className="text-blue-600"/> References
                        </h4>
                        <div className="space-y-2">
                            {requirement.references && requirement.references.length > 0 ? (
                                requirement.references.map((ref, i) => (
                                    <a key={i} href={ref.url} target="_blank" rel="noreferrer" className="block p-2 rounded hover:bg-white text-sm group border border-transparent hover:border-slate-200 transition-all">
                                        <div className="font-medium text-blue-600 flex items-center gap-1">
                                            {ref.title} <ExternalLink size={10} />
                                        </div>
                                        <div className="text-xs text-slate-500">{ref.type}</div>
                                    </a>
                                ))
                            ) : (
                                <div className="text-sm text-slate-400 italic">No external links available.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Mappings */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Share2 size={14} className="text-indigo-600"/> Framework Maps
                    </h4>
                    <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-400">NIST 800-53</span>
                            <div className="flex flex-wrap gap-1.5">
                            {requirement.mappings.nist800_53?.map(m => (
                                <span key={m} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-mono">{m}</span>
                            )) || <span className="text-xs text-slate-400">None</span>}
                            </div>
                        </div>
                        {requirement.mappings.nist_csf && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-400">NIST CSF</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {requirement.mappings.nist_csf.map(m => (
                                        <span key={m} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-mono">{m}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>

      <TicketCreationModal 
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        cwConfig={cwConfig}
        jiraConfig={jiraConfig}
        requirementId={requirement.id}
        requirementTitle={requirement.title}
        onTicketCreated={onAddTicket}
      />
    </div>
  );
};
