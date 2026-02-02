import React, { useState } from 'react';
import { 
  Shield, 
  Target, 
  ListChecks, 
  Hammer, 
  Eye, 
  CheckCircle2, 
  Activity,
  ArrowRight,
  ChevronRight,
  Info,
  Users,
  ShieldAlert,
  Clock,
  // Added missing Sparkles and FileText icons to lucide-react imports
  Sparkles,
  FileText
} from 'lucide-react';

interface RmfStep {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  tasks: string[];
  interviewees: string[];
}

const RMF_STEPS: RmfStep[] = [
  {
    id: 'P',
    name: 'Prepare',
    icon: <Users size={24} />,
    description: 'Essential activities at organization, process, and system levels to manage security and privacy risk.',
    tasks: ['P-1 Roles', 'P-2 Strategy', 'P-3 Org Risk Assessment', 'P-4 Control Baselines', 'P-11 Boundary'],
    interviewees: ['AO (Authorizing Official)', 'SAORM (Senior Accountable Official)', 'CIO']
  },
  {
    id: 'C',
    name: 'Categorize',
    icon: <Target size={24} />,
    description: 'Informing risk management tasks by determining adverse impacts from loss of CIA.',
    tasks: ['C-1 System Description', 'C-2 Security Categorization', 'C-3 Review & Approval'],
    interviewees: ['System Owner', 'Information Owner']
  },
  {
    id: 'S',
    name: 'Select',
    icon: <ListChecks size={24} />,
    description: 'Selecting, tailoring, and documenting controls to protect the system.',
    tasks: ['S-1 Control Selection', 'S-2 Tailoring', 'S-3 Allocation', 'S-4 SSP Update'],
    interviewees: ['System Security Officer', 'Security Architect']
  },
  {
    id: 'I',
    name: 'Implement',
    icon: <Hammer size={24} />,
    description: 'Implementation of controls in the SSP and updating implementation details.',
    tasks: ['I-1 Control Implementation', 'I-2 Update Info'],
    interviewees: ['System Administrator', 'DevOps Team']
  },
  {
    id: 'A',
    name: 'Assess',
    icon: <Eye size={24} />,
    description: 'Determining if controls are implemented correctly and operating as intended.',
    tasks: ['A-1 Assessor Selection', 'A-2 Plan', 'A-3 Assessment', 'A-4 Report', 'A-6 POA&M'],
    interviewees: ['Control Assessor', 'Independent Auditor']
  },
  {
    id: 'R',
    name: 'Authorize',
    icon: <CheckCircle2 size={24} />,
    description: 'Accountability decision by a senior official to accept risk based on operation.',
    tasks: ['R-1 Auth Package', 'R-2 Risk Analysis', 'R-3 Risk Response', 'R-4 Decision'],
    interviewees: ['Authorizing Official', 'Senior Agency Info Sec Officer']
  },
  {
    id: 'M',
    name: 'Monitor',
    icon: <Activity size={24} />,
    description: 'Maintaining ongoing situational awareness about security and privacy posture.',
    tasks: ['M-1 Changes', 'M-2 Assessments', 'M-3 Response', 'M-6 Ongoing Auth'],
    interviewees: ['System Security Officer', 'Continuous Monitoring Team']
  }
];

export const RmfLifecycle: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState('P');
  const activeStep = RMF_STEPS.find(s => s.id === activeStepId)!;

  return (
    <div className="max-w-7xl mx-auto p-8 h-full flex flex-col space-y-8 overflow-y-auto">
      <div className="flex justify-between items-end bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
         <div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <Shield size={14}/> NIST SP 800-37 Revision 2
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">RMF Lifecycle Center</h1>
            <p className="text-slate-500 font-medium mt-1">Operationalize the Risk Management Framework for your organization.</p>
         </div>
         <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl">
             <Clock size={20} className="text-blue-400" />
             <div className="text-left">
                 <div className="text-[9px] font-black uppercase text-blue-400">Current Phase</div>
                 <div className="text-sm font-black uppercase tracking-tight">System Initialization</div>
             </div>
         </div>
      </div>

      {/* 7-Step Stepper */}
      <div className="grid grid-cols-7 gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative">
          <div className="absolute top-[3.75rem] left-12 right-12 h-1 bg-slate-100 -z-10"></div>
          {RMF_STEPS.map((step) => {
              const isActive = activeStepId === step.id;
              return (
                  <button 
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    className="flex flex-col items-center group relative"
                  >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                          isActive 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-110' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-blue-300 hover:text-blue-500'
                      }`}>
                          {step.icon}
                      </div>
                      <div className={`mt-3 text-[10px] font-black uppercase tracking-widest text-center transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          {step.name}
                      </div>
                  </button>
              );
          })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Detailed Content Card */}
          <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                       <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-900/20">
                                {activeStep.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Step {RMF_STEPS.indexOf(activeStep) + 1}: {activeStep.name}</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Lifecycle Methodology Phase</p>
                            </div>
                       </div>
                       <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                           Generate Audit Plan
                       </button>
                  </div>

                  <div className="p-10 space-y-10">
                       <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Purpose & Description</h3>
                            <p className="text-slate-700 font-medium leading-relaxed bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50 italic">
                                "{activeStep.description}"
                            </p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Defined Tasks</h4>
                                <div className="space-y-2">
                                    {activeStep.tasks.map(task => (
                                        <div key={task} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-all">
                                            <span className="text-xs font-bold text-slate-700">{task}</span>
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Key Stakeholders</h4>
                                <div className="space-y-2">
                                    {activeStep.interviewees.map(person => (
                                        <div key={person} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <Users size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-800">{person}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                       </div>
                  </div>
              </div>
          </div>

          {/* Interview Guide Sidebar */}
          <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                      <MessageCircle size={20} className="text-blue-400" /> Assessor Interview Guide
                  </h3>
                  <div className="space-y-6">
                      <div className="space-y-4">
                          <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-1">Phase: {activeStep.name}</div>
                          <div className="space-y-3">
                              {/* These are synthesized from 800-37 content based on the step */}
                              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-help">
                                  <p className="text-xs font-medium leading-relaxed opacity-90">"How does the organization maintain situational awareness of security posture changes in real-time?"</p>
                              </div>
                              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-help">
                                  <p className="text-xs font-medium leading-relaxed opacity-90">"Describe the process for accepting residual risk when controls are inherited from cloud providers."</p>
                              </div>
                          </div>
                      </div>
                      
                      <div className="pt-6 border-t border-white/10">
                          <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2">
                              <Sparkles size={14}/> Generate AI Prep Questions
                          </button>
                      </div>
                  </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Required Deliverables</h4>
                   <div className="space-y-3">
                       <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                           <FileText size={16} className="text-slate-400" /> System Security Plan (SSP)
                       </div>
                       <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                           <FileText size={16} className="text-slate-400" /> Security Assessment Report
                       </div>
                       <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                           <FileText size={16} className="text-slate-400" /> Plan of Action & Milestones
                       </div>
                   </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const MessageCircle = ({ size, className }: { size: number, className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
);