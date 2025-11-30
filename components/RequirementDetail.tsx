
import React, { useState, useEffect } from 'react';
import { Requirement, Artifact, Ticket, ConnectWiseConfig, JiraConfig, AssessmentObjective } from '../types';
import { ArtifactUploader } from './ArtifactUploader';
import { TicketCreationModal } from './TicketCreationModal';
import { PolicyAnalyzer } from './PolicyAnalyzer';
import { explainRequirement } from '../services/gemini';
import { NIST_CSF_FUNCTIONS } from '../data/standards';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, Sparkles, ChevronDown, ChevronUp, Ticket as TicketIcon, ExternalLink, Share2, Layers, Monitor, Link, EyeOff, BookOpen } from 'lucide-react';

interface RequirementDetailProps {
  requirement: Requirement;
  onUpdateRequirement: (req: Requirement) => void;
  allArtifacts: Artifact[];
  onAddArtifact: (a: Artifact) => void;
  onRemoveArtifact: (id: string) => void;
  // Ticket Props
  tickets: Ticket[];
  onAddTicket: (t: Ticket) => void;
  cwConfig: ConnectWiseConfig;
  jiraConfig: JiraConfig;
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
}) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showObjectives, setShowObjectives] = useState(true);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Default scope to IN_SCOPE if undefined
  const isOutScope = requirement.scopeStatus === 'OUT_OF_SCOPE';

  // Reset AI explanation when req changes
  useEffect(() => {
    setAiExplanation(null);
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
      onUpdateRequirement({
          ...requirement,
          scopeStatus: status
      });
  };

  const handleJustificationChange = (text: string) => {
      onUpdateRequirement({
          ...requirement,
          scopeJustification: text
      });
  };

  const relevantArtifacts = allArtifacts.filter(a => a.requirementId === requirement.id);
  const relevantTickets = tickets.filter(t => t.requirementId === requirement.id);
  
  const canCreateTicket = cwConfig.enabled || jiraConfig.enabled;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Header Section */}
            <div className={`bg-white p-6 rounded-xl shadow-sm border ${isOutScope ? 'border-slate-300 opacity-90' : 'border-slate-200'}`}>
            
            {/* Scoping Toggle */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applicability:</span>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => handleScopeChange('IN_SCOPE')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${!isOutScope ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            In Scope
                        </button>
                        <button
                            onClick={() => handleScopeChange('OUT_OF_SCOPE')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${isOutScope ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Out of Scope / N/A
                        </button>
                    </div>
                </div>
                {isOutScope && <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded flex items-center gap-1"><EyeOff size={12}/> Controls Disabled</span>}
            </div>

            <div className="flex justify-between items-start mb-4">
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
                <button
                    onClick={handleExplain}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow hover:shadow-md transition-all text-sm font-medium"
                >
                    <Sparkles size={16} />
                    {loadingAi ? 'Analyzing...' : 'AI Clarification'}
                </button>
            </div>
            
            <p className="text-slate-700 text-lg mb-4 leading-relaxed">{requirement.description}</p>

            {/* AI Expansion Area */}
            {aiExplanation && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 prose prose-sm max-w-none text-slate-800 mb-4">
                    <h4 className="flex items-center gap-2 text-indigo-800 font-semibold mb-2">
                        <Sparkles size={16} /> Consultant's Note
                    </h4>
                    <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Discussion</h4>
                <p className="text-sm text-slate-600">{requirement.discussion}</p>
            </div>
            </div>
            
            {/* Out of Scope Justification */}
            {isOutScope && (
                <div className="bg-slate-100 p-6 rounded-xl border border-slate-300">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <EyeOff size={18} /> Non-Applicability Justification
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                        Auditors require a valid reason for excluding a control. E.g., "This facility does not have wireless capabilities."
                    </p>
                    <textarea 
                        className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                        placeholder="Enter justification here..."
                        rows={3}
                        value={requirement.scopeJustification || ''}
                        onChange={(e) => handleJustificationChange(e.target.value)}
                    />
                </div>
            )}

            {!isOutScope && (
                <>
                    {/* Assessment Objectives */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <button 
                            onClick={() => setShowObjectives(!showObjectives)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200"
                        >
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-600"/> Assessment Objectives
                            </h3>
                            {showObjectives ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
                        </button>
                        
                        {showObjectives && (
                            <div className="divide-y divide-slate-100">
                                {requirement.objectives.map(obj => (
                                    <div key={obj.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded text-xs">{obj.id.toUpperCase()}</div>
                                            <div className="text-slate-700 text-sm">{obj.description}</div>
                                        </div>
                                        <div className="w-full sm:w-32">
                                            <select 
                                                value={obj.status}
                                                onChange={(e) => handleStatusChange(obj.id, e.target.value as any)}
                                                className={`w-full text-xs border rounded p-1.5 font-medium outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    obj.status === 'met' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    obj.status === 'not_met' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    obj.status === 'na' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                                                    'bg-white text-slate-600 border-slate-300'
                                                }`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="met">Met</option>
                                                <option value="not_met">Not Met</option>
                                                <option value="na">N/A</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* NEW: Policy Analyzer */}
                    <PolicyAnalyzer requirement={requirement} />

                    {/* Remediation & Tickets Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            <TicketIcon size={20} className="text-indigo-600"/> Remediation Tickets
                        </h3>
                        {canCreateTicket ? (
                            <button
                                onClick={() => setIsTicketModalOpen(true)}
                                className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-medium border border-indigo-200 transition-colors"
                            >
                                + Create Ticket
                            </button>
                        ) : (
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Enable Ticketing in Settings</span>
                        )}
                        </div>

                        <div className="space-y-2">
                        {relevantTickets.length === 0 && (
                            <p className="text-sm text-slate-400 italic">No tickets linked to this requirement.</p>
                        )}
                        {relevantTickets.map(ticket => (
                            <div key={ticket.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${ticket.source === 'Jira' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                        {ticket.source === 'Jira' ? <Layers size={10} /> : <Monitor size={10} />}
                                        {ticket.ticketNumber}
                                    </span>
                                    <span className="text-sm font-medium text-slate-800">{ticket.summary}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span>Status: {ticket.status}</span>
                                    <span>Priority: {ticket.priority}</span>
                                    <span>Target: {ticket.board}</span>
                                </div>
                            </div>
                            {ticket.url && (
                                    <a href={ticket.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800">
                                        <ExternalLink size={16} />
                                    </a>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Artifacts Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-semibold text-slate-800 mb-4 text-lg">Evidence & Artifacts</h3>
                        <ArtifactUploader 
                            requirementId={requirement.id}
                            artifacts={relevantArtifacts}
                            onAddArtifact={onAddArtifact}
                            onRemoveArtifact={onRemoveArtifact}
                        />
                    </div>
                </>
            )}
        </div>

        {/* RIGHT COLUMN (References & Training) */}
        <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                 <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-600"/> Technician Resources
                 </h4>
                 
                 <div className="space-y-4">
                     {/* Training Module Link (Mock) */}
                     <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                         <div className="text-xs font-bold text-blue-700 uppercase mb-1">Recommended Training</div>
                         <div className="font-semibold text-slate-800 text-sm mb-2">
                             {requirement.family} Family - Implementation Basics
                         </div>
                         <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 w-full font-medium">
                             Start Training Module
                         </button>
                     </div>

                     <div className="space-y-2">
                         <div className="text-xs font-bold text-slate-500 uppercase">External References</div>
                         {requirement.references && requirement.references.length > 0 ? (
                             requirement.references.map((ref, i) => (
                                 <a key={i} href={ref.url} target="_blank" rel="noreferrer" className="block p-2 rounded hover:bg-slate-50 text-sm group border border-transparent hover:border-slate-200 transition-all">
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
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                 <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Share2 size={16} className="text-indigo-600"/> Framework Maps
                 </h4>
                 <div className="space-y-3">
                     {/* NIST 800-53 */}
                     <div className="flex flex-col gap-1">
                         <span className="text-xs font-bold text-slate-500">NIST 800-53 (Federal)</span>
                         <div className="flex flex-wrap gap-1.5">
                            {requirement.mappings.nist800_53?.map(m => (
                                <span key={m} className="px-2 py-0.5 bg-white text-slate-700 rounded text-xs font-mono border border-slate-200 shadow-sm">{m}</span>
                            )) || <span className="text-xs text-slate-400">None</span>}
                         </div>
                     </div>

                     {/* NIST CSF */}
                     {requirement.mappings.nist_csf && requirement.mappings.nist_csf.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-500">NIST CSF (Core)</span>
                            <div className="flex flex-wrap gap-1.5">
                                {requirement.mappings.nist_csf.map(m => {
                                    const func = m.split('.')[0];
                                    const styleInfo = NIST_CSF_FUNCTIONS.find(f => f.id === func);
                                    const colorClass = styleInfo ? `${styleInfo.color} text-white` : 'bg-slate-500 text-white';
                                    
                                    return (
                                        <span key={m} className={`px-2 py-0.5 rounded text-xs font-mono font-medium shadow-sm flex items-center gap-1 ${colorClass}`}>
                                            {m}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                     )}
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
