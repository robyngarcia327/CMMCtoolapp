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
  Sparkles,
  FileText,
  MessageCircle,
  Briefcase,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  // Added missing ShieldCheck import
  ShieldCheck
} from 'lucide-react';
import { RMF_TASKS } from '../data/standards';

interface RmfStep {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  interviewees: { role: string; focus: string; questions: string[] }[];
}

const RMF_STEPS: RmfStep[] = [
  {
    id: 'P',
    name: 'Prepare',
    icon: <Users size={24} />,
    description: 'Carry out essential activities at the organization, process, and system levels to help manage security and privacy risks.',
    interviewees: [
      { 
        role: 'Authorizing Official', 
        focus: 'Mission Alignment & Risk Acceptance',
        questions: [
          "How is the organization's risk tolerance communicated to system owners?",
          "How do you determine if the risk of operating this system is acceptable?",
          "How are security requirements integrated into the budgeting process?"
        ]
      },
      { 
        role: 'Risk Executive (Function)', 
        focus: 'Strategic Governance',
        questions: [
          "What methodology is used to aggregate system-level risks into an organizational profile?",
          "How are common controls identified and allocated for inheritance?",
          "How is the organization-wide continuous monitoring strategy enforced?"
        ]
      }
    ]
  },
  {
    id: 'C',
    name: 'Categorize',
    icon: <Target size={24} />,
    description: 'Determine the adverse impact from the loss of confidentiality, integrity, and availability of information.',
    interviewees: [
      { 
        role: 'Information Owner/Steward', 
        focus: 'Data Sensitivity & Impact',
        questions: [
          "What types of information does this system process (e.g., PII, CUI, Financial)?",
          "What would be the impact to the mission if this data were made public?",
          "How was the 'high-water mark' determined for this system?"
        ]
      }
    ]
  },
  {
    id: 'S',
    name: 'Select',
    icon: <ListChecks size={24} />,
    description: 'Select, tailor, and document the controls necessary to protect the system and organization.',
    interviewees: [
      { 
        role: 'Security/Privacy Architect', 
        focus: 'Control Strategy',
        questions: [
          "What control baseline was selected and why (e.g., NIST 800-53 Low/Mod/High)?",
          "What tailoring actions were taken to align with the operating environment?",
          "Which controls are designated as hybrid or common?"
        ]
      }
    ]
  },
  {
    id: 'I',
    name: 'Implement',
    icon: <Hammer size={24} />,
    description: 'Implement the controls in the security and privacy plans and document implementation details.',
    interviewees: [
      { 
        role: 'System Owner / DevOps', 
        focus: 'Technical Execution',
        questions: [
          "Are the controls implemented as described in the System Security Plan (SSP)?",
          "How is configuration management used to maintain a secure baseline?",
          "Are systems security engineering principles applied during implementation?"
        ]
      }
    ]
  },
  {
    id: 'A',
    name: 'Assess',
    icon: <Eye size={24} />,
    description: 'Determine if the controls are implemented correctly, operating as intended, and producing the desired outcomes.',
    interviewees: [
      { 
        role: 'Control Assessor', 
        focus: 'Effectiveness Testing',
        questions: [
          "What was the level of independence for this assessment?",
          "Describe the methodology used (Examine, Interview, Test).",
          "Were any significant deficiencies discovered that represent unacceptable risk?"
        ]
      }
    ]
  },
  {
    id: 'R',
    name: 'Authorize',
    icon: <CheckCircle2 size={24} />,
    description: 'A senior management official determines if the security and privacy risk is acceptable for system operation.',
    interviewees: [
      { 
        role: 'Authorizing Official', 
        focus: 'Accountability',
        questions: [
          "Have all POA&M items been reviewed and assigned resources?",
          "Does the authorization package contain all necessary artifacts (SSP, SAR, POAM)?",
          "Is this an Initial, Ongoing, or Re-authorization decision?"
        ]
      }
    ]
  },
  {
    id: 'M',
    name: 'Monitor',
    icon: <Activity size={24} />,
    description: 'Maintain an ongoing situational awareness about the security and privacy posture of the system.',
    interviewees: [
      { 
        role: 'System Security Officer', 
        focus: 'Continuous Monitoring',
        questions: [
          "How are unauthorized changes to the system detected and responded to?",
          "How often is the security posture reported to the Authorizing Official?",
          "What automated tools are used for continuous control assessment?"
        ]
      }
    ]
  }
];

export const RmfLifecycle: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState('P');
  const activeStep = RMF_STEPS.find(s => s.id === activeStepId)!;
  const stepTasks = RMF_TASKS.filter(t => t.step === activeStepId);

  return (
    <div className="max-w-7xl mx-auto p-8 h-full flex flex-col space-y-8 overflow-y-auto bg-slate-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
         <div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                <Shield size={14}/> NIST Risk Management Framework Workbook
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">RMF Operations Center</h1>
            <p className="text-slate-500 font-medium mt-3 max-w-xl">
                Execute the full NIST SP 800-37 Rev 2 lifecycle. Manage preparation, categorization, and authorization for any information system.
            </p>
         </div>
         <div className="flex gap-4 mt-6 md:mt-0">
             <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4">
                 <Clock size={20} className="text-blue-400" />
                 <div className="text-left">
                     <div className="text-[9px] font-black uppercase text-blue-400 tracking-widest">Active Step</div>
                     <div className="text-lg font-black uppercase tracking-tight">{activeStep.name} Phase</div>
                 </div>
             </div>
         </div>
      </div>

      {/* 7-Step Stepper - Framework Agnostic */}
      <div className="grid grid-cols-7 gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative">
          <div className="absolute top-[4.25rem] left-16 right-16 h-1.5 bg-slate-100 -z-10"></div>
          {RMF_STEPS.map((step, idx) => {
              const isActive = activeStepId === step.id;
              return (
                  <button 
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    className="flex flex-col items-center group relative"
                  >
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 border-4 ${
                          isActive 
                            ? 'bg-blue-600 text-white border-blue-100 shadow-2xl scale-110 rotate-3' 
                            : 'bg-white text-slate-400 border-white hover:border-blue-200 hover:text-blue-500'
                      }`}>
                          {step.icon}
                      </div>
                      <div className={`mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-center transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          Step {idx + 1}
                      </div>
                      <div className={`mt-1 text-[9px] font-bold uppercase transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.name}
                      </div>
                  </button>
              );
          })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          {/* STEP TASKS WORKBOOK */}
          <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                       <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200">
                                {activeStep.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Lifecycle Task List</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Formal NIST 800-37 Tasks</p>
                            </div>
                       </div>
                       <button className="bg-slate-900 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg">
                           Download Step Guide
                       </button>
                  </div>

                  <div className="p-10 space-y-8 flex-1">
                       <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Info size={14}/> Step Objective
                            </h3>
                            <p className="text-slate-700 font-bold leading-relaxed italic">
                                "{activeStep.description}"
                            </p>
                       </div>

                       <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Detailed Tasks</h4>
                            <div className="grid gap-3">
                                {stepTasks.map(task => (
                                    <div key={task.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-blue-400 transition-all flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="font-mono text-sm font-black text-blue-600 w-12">{task.id}</div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{task.name}</div>
                                                <div className="text-[10px] text-slate-500 font-medium">{task.description}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Role</div>
                                            <div className="text-[10px] font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{task.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                       </div>
                  </div>
              </div>
          </div>

          {/* SIDEBAR: INTERVIEW PREP & ROLE FOCUS */}
          <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                      <MessageCircle size={24} className="text-blue-400" /> Assessor Interview Suite
                  </h3>
                  
                  <div className="space-y-10">
                      {activeStep.interviewees.map((person, pIdx) => (
                          <div key={pIdx} className="space-y-6">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 border border-white/10">
                                      <Users size={20} />
                                  </div>
                                  <div>
                                      <h4 className="text-sm font-black uppercase tracking-widest">{person.role}</h4>
                                      <p className="text-[9px] text-blue-300 font-bold uppercase tracking-[0.2em]">{person.focus}</p>
                                  </div>
                              </div>

                              <div className="space-y-3">
                                  {person.questions.map((q, qIdx) => (
                                      <div key={qIdx} className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-all group cursor-help">
                                          <div className="flex gap-4">
                                              <div className="text-blue-500 font-black text-xs">Q.</div>
                                              <p className="text-xs font-medium leading-relaxed opacity-90 group-hover:opacity-100">{q}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="mt-10 pt-10 border-t border-white/10">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3">
                          <Sparkles size={16}/> Simulate Leadership Review
                      </button>
                  </div>
              </div>

              {/* RMF Deliverables Checklist */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <FileText size={16}/> Step Artifact Requirements
                   </h4>
                   <div className="space-y-4">
                       {[
                         { name: 'System Security Plan (SSP)', citation: 'NIST 800-18' },
                         { name: 'Security Assessment Report (SAR)', citation: 'NIST 800-53A' },
                         { name: 'Plan of Action & Milestones (POAM)', citation: 'OMB M-02-01' },
                         { name: 'Risk Assessment Report (RAR)', citation: 'NIST 800-30' }
                       ].map((doc, dIdx) => (
                           <div key={dIdx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                               <div className="flex items-center gap-3">
                                   <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors"></div>
                                   <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{doc.name}</span>
                               </div>
                               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{doc.citation}</span>
                           </div>
                       ))}
                   </div>
                   
                   <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-[10px] text-indigo-700 font-bold leading-relaxed flex items-start gap-2">
                            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                            Note: The Authorize step depends on the development of credible security and privacy evidence generated for the authorization package.
                        </p>
                   </div>
              </div>
          </div>
      </div>

      <div className="flex justify-center pb-12">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
              <ShieldCheck size={14} className="text-blue-500" /> Verified Standard: NIST SP 800-37 R2 // System Agnostic
          </div>
      </div>
    </div>
  );
};