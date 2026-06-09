
import React, { useState } from 'react';
import { Workflow, WorkflowStep, ClientData } from '../types';
import { 
  GitBranch, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Save, 
  X, 
  Users, 
  Shield, 
  ArrowRightLeft,
  Layout,
  MoreVertical,
  Network,
  List,
  Link2,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  UserPlus,
  UserMinus,
  Eye,
  Laptop,
  Trash,
  AlertCircle,
  Tag,
  Truck,
  FileEdit,
  Zap,
  ClipboardCheck,
  Activity,
  ListChecks,
  ShieldAlert,
  BookOpen,
  Database,
  FileX,
  GraduationCap,
  DollarSign
} from 'lucide-react';
import { WorkflowDiagram } from './WorkflowDiagram';

interface WorkflowManagerProps {
  workflows: Workflow[];
  onUpdate: (updates: Partial<ClientData>) => void;
}

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({ workflows, onUpdate }) => {
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(workflows[0]?.id || null);
  const [isAddingWorkflow, setIsAddingWorkflow] = useState(false);
  const [newWorkflowTitle, setNewWorkflowTitle] = useState('');
  const [newWorkflowType, setNewWorkflowType] = useState<Workflow['type']>('CUSTOM');
  const [viewMode, setViewMode] = useState<'list' | 'diagram'>('diagram');

  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId);

  const handleUpdateWorkflow = (updated: Workflow) => {
    const nextWorkflows = workflows.map(w => w.id === updated.id ? updated : w);
    onUpdate({ workflows: nextWorkflows });
  };

  const handleAddWorkflow = () => {
    if (!newWorkflowTitle.trim()) return;
    const newWf: Workflow = {
      id: `wf-${Date.now()}`,
      title: newWorkflowTitle,
      type: newWorkflowType,
      description: 'Custom organizational workflow.',
      steps: [],
      lastUpdated: Date.now()
    };
    onUpdate({ workflows: [...workflows, newWf] });
    setActiveWorkflowId(newWf.id);
    setIsAddingWorkflow(false);
    setNewWorkflowTitle('');
  };

  const handleDeleteWorkflow = (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    const nextWorkflows = workflows.filter(w => w.id !== id);
    onUpdate({ workflows: nextWorkflows });
    if (activeWorkflowId === id) {
      setActiveWorkflowId(nextWorkflows[0]?.id || null);
    }
  };

  const handleAddStep = () => {
    if (!activeWorkflow) return;
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      title: 'New Step',
      description: 'Describe the action or requirement for this step.',
      status: 'Pending'
    };
    handleUpdateWorkflow({
      ...activeWorkflow,
      steps: [...activeWorkflow.steps, newStep],
      lastUpdated: Date.now()
    });
  };

  const handleUpdateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    if (!activeWorkflow) return;
    const nextSteps = activeWorkflow.steps.map(s => s.id === stepId ? { ...s, ...updates } : s);
    handleUpdateWorkflow({
      ...activeWorkflow,
      steps: nextSteps,
      lastUpdated: Date.now()
    });
  };

  const handleDeleteStep = (stepId: string) => {
    if (!activeWorkflow) return;
    const nextSteps = activeWorkflow.steps.filter(s => s.id !== stepId);
    handleUpdateWorkflow({
      ...activeWorkflow,
      steps: nextSteps,
      lastUpdated: Date.now()
    });
  };

  const getWorkflowTypeName = (type: Workflow['type']) => {
    switch (type) {
      case 'CUI_FLOW_IN': return 'CUI Data Flow – In';
      case 'CUI_FLOW_OUT': return 'CUI Data Flow – Out';
      case 'VENDOR_REVIEW': return 'Vendor Review';
      case 'USER_ONBOARDING': return 'User Onboarding';
      case 'USER_OFFBOARDING': return 'User Offboarding';
      case 'ACCESS_REVIEW': return 'Access Review';
      case 'ASSET_PROVISIONING': return 'Asset Provisioning';
      case 'ASSET_DECOMMISSION': return 'Asset Decommission';
      case 'SECURITY_INCIDENT_RESPONSE': return 'Security Incident Response';
      case 'CUI_LABELING': return 'CUI Labeling';
      case 'SHIPPING': return 'Shipping';
      case 'CHANGE_REQUEST': return 'Change Request';
      case 'FIREWALL_CHANGE': return 'Firewall Change';
      case 'CONTROL_EVIDENCE_COLLECTION': return 'Control Evidence Collection';
      case 'RISK_ASSESSMENT': return 'Risk Assessment';
      case 'POAM_TRACKING': return 'POA&M Tracking';
      case 'VENDOR_RISK_ASSESSMENT': return 'Vendor Risk Assessment';
      case 'POLICY_REVIEW': return 'Policy Review';
      case 'BACKUP_VERIFICATION': return 'Backup Verification';
      case 'CUI_DATA_DESTRUCTION': return 'CUI Data Destruction';
      case 'SECURITY_AWARENESS_TRAINING': return 'Security Awareness Training';
      case 'HR': return 'HR';
      case 'ACCOUNTS_PAYABLE_RECEIVABLE': return 'Accounts Payable/Receivable';
      default: return type.replace(/_/g, ' ');
    }
  };

  const getWorkflowIcon = (type: Workflow['type']) => {
    switch (type) {
      case 'CUI_FLOW': return <ArrowRightLeft size={18} />;
      case 'CUI_FLOW_IN': return <ArrowDownLeft size={18} />;
      case 'CUI_FLOW_OUT': return <ArrowUpRight size={18} />;
      case 'VENDOR_REVIEW': return <Building2 size={18} />;
      case 'USER_ONBOARDING': return <UserPlus size={18} />;
      case 'USER_OFFBOARDING': return <UserMinus size={18} />;
      case 'ACCESS_REVIEW': return <Eye size={18} />;
      case 'ASSET_PROVISIONING': return <Laptop size={18} />;
      case 'ASSET_DECOMMISSION': return <Trash size={18} />;
      case 'SECURITY_INCIDENT_RESPONSE': return <AlertCircle size={18} />;
      case 'CUI_LABELING': return <Tag size={18} />;
      case 'SHIPPING': return <Truck size={18} />;
      case 'CHANGE_REQUEST': return <FileEdit size={18} />;
      case 'FIREWALL_CHANGE': return <Zap size={18} />;
      case 'CONTROL_EVIDENCE_COLLECTION': return <ClipboardCheck size={18} />;
      case 'RISK_ASSESSMENT': return <Activity size={18} />;
      case 'POAM_TRACKING': return <ListChecks size={18} />;
      case 'VENDOR_RISK_ASSESSMENT': return <ShieldAlert size={18} />;
      case 'POLICY_REVIEW': return <BookOpen size={18} />;
      case 'BACKUP_VERIFICATION': return <Database size={18} />;
      case 'CUI_DATA_DESTRUCTION': return <FileX size={18} />;
      case 'SECURITY_AWARENESS_TRAINING': return <GraduationCap size={18} />;
      case 'HR': return <Users size={18} />;
      case 'ACCOUNTS_PAYABLE_RECEIVABLE': return <DollarSign size={18} />;
      case 'ONBOARDING': return <Users size={18} />;
      case 'OFFBOARDING': return <Users size={18} />;
      case 'ACCESS_CRITERIA': return <Shield size={18} />;
      default: return <Layout size={18} />;
    }
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Organizational Workflows</h2>
          <button 
            onClick={() => setIsAddingWorkflow(true)}
            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isAddingWorkflow && (
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-4 animate-in fade-in slide-in-from-top-2">
              <input 
                autoFocus
                className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-sm font-bold outline-none mb-2"
                placeholder="Workflow Title"
                value={newWorkflowTitle}
                onChange={e => setNewWorkflowTitle(e.target.value)}
              />
              <select 
                className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-bold outline-none mb-3"
                value={newWorkflowType}
                onChange={e => setNewWorkflowType(e.target.value as any)}
              >
                <option value="CUSTOM">Custom Type</option>
                <option value="CUI_FLOW_IN">CUI Data Flow – In</option>
                <option value="CUI_FLOW_OUT">CUI Data Flow – Out</option>
                <option value="VENDOR_REVIEW">Vendor Review</option>
                <option value="USER_ONBOARDING">User Onboarding</option>
                <option value="USER_OFFBOARDING">User Offboarding</option>
                <option value="ACCESS_REVIEW">Access Review</option>
                <option value="ASSET_PROVISIONING">Asset Provisioning</option>
                <option value="ASSET_DECOMMISSION">Asset Decommission</option>
                <option value="SECURITY_INCIDENT_RESPONSE">Security Incident Response</option>
                <option value="CUI_LABELING">CUI Labeling</option>
                <option value="SHIPPING">Shipping</option>
                <option value="CHANGE_REQUEST">Change Request</option>
                <option value="FIREWALL_CHANGE">Firewall Change</option>
                <option value="CONTROL_EVIDENCE_COLLECTION">Control Evidence Collection</option>
                <option value="RISK_ASSESSMENT">Risk Assessment</option>
                <option value="POAM_TRACKING">POA&M Tracking</option>
                <option value="VENDOR_RISK_ASSESSMENT">Vendor Risk Assessment</option>
                <option value="POLICY_REVIEW">Policy Review</option>
                <option value="BACKUP_VERIFICATION">Backup Verification</option>
                <option value="CUI_DATA_DESTRUCTION">CUI Data Destruction</option>
                <option value="SECURITY_AWARENESS_TRAINING">Security Awareness Training</option>
                <option value="HR">HR</option>
                <option value="ACCOUNTS_PAYABLE_RECEIVABLE">Accounts Payable/Receivable</option>
                <option value="CUI_FLOW">CUI Data Flow (Legacy)</option>
                <option value="ONBOARDING">Onboarding (Legacy)</option>
                <option value="OFFBOARDING">Offboarding (Legacy)</option>
                <option value="ACCESS_CRITERIA">Access Criteria (Legacy)</option>
              </select>
              <div className="flex gap-2">
                <button 
                  onClick={handleAddWorkflow}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Create
                </button>
                <button 
                  onClick={() => setIsAddingWorkflow(false)}
                  className="flex-1 bg-white text-slate-400 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {workflows.map(wf => (
            <button
              key={wf.id}
              onClick={() => setActiveWorkflowId(wf.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group ${
                activeWorkflowId === wf.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className={`${activeWorkflowId === wf.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-500'}`}>
                {getWorkflowIcon(wf.type)}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-black uppercase tracking-tight truncate">{wf.title}</div>
                <div className={`text-[9px] font-bold uppercase ${activeWorkflowId === wf.id ? 'text-slate-400' : 'text-slate-400'}`}>
                  {wf.steps.length} Steps • {getWorkflowTypeName(wf.type)}
                </div>
              </div>
              <ChevronRight size={14} className={activeWorkflowId === wf.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-10">
        {activeWorkflow ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-blue-200">
                    {getWorkflowTypeName(activeWorkflow.type)}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Last Updated: {new Date(activeWorkflow.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">
                  {activeWorkflow.title}
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-2xl">
                  {activeWorkflow.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button 
                    onClick={() => setViewMode('diagram')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      viewMode === 'diagram' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Network size={14} /> Diagram
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <List size={14} /> List
                  </button>
                </div>
                <button 
                  onClick={() => handleDeleteWorkflow(activeWorkflow.id)}
                  className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {viewMode === 'diagram' ? (
              <WorkflowDiagram 
                workflow={activeWorkflow} 
                onUpdate={(updated) => handleUpdateWorkflow(updated)} 
              />
            ) : (
              <div className="space-y-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-200 -z-10" />

                {activeWorkflow.steps.map((step, index) => (
                  <div key={step.id} className="flex gap-8 group animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 border-4 border-slate-50 transition-all ${
                      step.status === 'Completed' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white text-slate-400 border-slate-100 shadow-sm'
                    }`}>
                      {step.status === 'Completed' ? <CheckCircle2 size={24} /> : <div className="text-xs font-black">{index + 1}</div>}
                    </div>

                    <div className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <select 
                              className="text-[9px] font-black uppercase tracking-widest bg-slate-50 border border-slate-100 rounded px-2 py-0.5 outline-none"
                              value={step.type || 'process'}
                              onChange={e => handleUpdateStep(step.id, { type: e.target.value as any })}
                            >
                              <option value="start">Start</option>
                              <option value="process">Process</option>
                              <option value="decision">Decision</option>
                              <option value="end">End</option>
                            </select>
                          </div>
                          <input 
                            className="text-xl font-black text-slate-900 uppercase tracking-tight outline-none w-full bg-transparent border-b border-transparent focus:border-blue-500 mb-1"
                            value={step.title}
                            onChange={e => handleUpdateStep(step.id, { title: e.target.value })}
                          />
                          <textarea 
                            className="text-slate-500 font-medium text-sm w-full bg-transparent outline-none resize-none h-12"
                            value={step.description}
                            onChange={e => handleUpdateStep(step.id, { description: e.target.value })}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <select 
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all ${
                              step.status === 'Completed' 
                                ? 'bg-green-50 text-green-700 border-green-100' 
                                : step.status === 'In Progress'
                                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                                  : 'bg-slate-50 text-slate-500 border-slate-100'
                            }`}
                            value={step.status}
                            onChange={e => handleUpdateStep(step.id, { status: e.target.value as any })}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <button 
                            onClick={() => handleDeleteStep(step.id)}
                            className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Role:</span>
                            <input 
                              className="text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg outline-none border border-transparent focus:border-blue-200"
                              placeholder="e.g. Security Officer"
                              value={step.assignedRole || ''}
                              onChange={e => handleUpdateStep(step.id, { assignedRole: e.target.value })}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Link2 size={12} className="text-slate-400" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Steps (IDs):</span>
                          <input 
                            className="text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg outline-none border border-transparent focus:border-blue-200 w-32"
                            placeholder="step1, step2"
                            value={step.nextStepIds?.join(', ') || ''}
                            onChange={e => handleUpdateStep(step.id, { nextStepIds: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-[8px] font-mono text-slate-300">ID: {step.id}</div>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={handleAddStep}
                  className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest"
                >
                  <Plus size={18} /> Add Workflow Step
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-300">
              <GitBranch size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">No Workflows Selected</h2>
            <p className="text-slate-500 font-medium max-w-sm">
              Select a workflow from the sidebar or create a new one to start tracking organizational processes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
