import { Requirement, Framework, ClientData, TrainingModule, SimulationModule } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST-CMMC', name: 'CMMC 2.0 / NIST 800-171', description: 'Comprehensive DoD Compliance Portfolio (Levels 1-2)' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria 2017' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Administrative, Physical, and Technical Safeguards' }
];

export const NIST_CMMC_FAMILIES = [
  { id: 'AC', name: 'Access Control' },
  { id: 'AT', name: 'Awareness and Training' },
  { id: 'AU', name: 'Audit and Accountability' },
  { id: 'CM', name: 'Configuration Management' },
  { id: 'IA', name: 'Identification and Authentication' },
  { id: 'IR', name: 'Incident Response' },
  { id: 'MA', name: 'Maintenance' },
  { id: 'MP', name: 'Media Protection' },
  { id: 'PS', name: 'Personnel Security' },
  { id: 'PE', name: 'Physical Protection' },
  { id: 'RA', name: 'Risk Assessment' },
  { id: 'CA', name: 'Security Assessment' },
  { id: 'SC', name: 'System and Communications Protection' },
  { id: 'SI', name: 'System and Information Integrity' }
];

export const ACADEMY_PHASES = [
  { id: 'PH1', name: 'The Foundation', icon: 'BookOpen' },
  { id: 'PH2', name: 'Scoping & Strategy', icon: 'Target' },
  { id: 'PH3', name: 'The 14 Domains (Technical)', icon: 'Shield' },
  { id: 'PH4', name: 'Documentation & Narrative', icon: 'FileText' },
  { id: 'PH5', name: 'The CAP Process (v2.0)', icon: 'ShieldCheck' },
  { id: 'PH6', name: 'Tabletop Simulations (TTX)', icon: 'Dices' },
  { id: 'PH7', name: 'Risk Management Framework (RMF)', icon: 'ShieldAlert' }
];

export const REQUIREMENTS_DATA: Requirement[] = [
    // 3.1 ACCESS CONTROL (AC)
    { id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'authorized users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of authorized users are identified;', status: 'pending' },
        { id: 'c', description: 'devices (and other systems) authorized to connect to the system are identified;', status: 'pending' },
        { id: 'd', description: 'system access is limited to authorized users;', status: 'pending' },
        { id: 'e', description: 'system access is limited to processes acting on behalf of authorized users; and', status: 'pending' },
        { id: 'f', description: 'system access is limited to authorized devices (including other systems).', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-2', 'AC-3'] }
    },
    { id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Transaction & Function Control', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the types of transactions and functions that authorized users are permitted to execute are defined; and', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined types of transactions and functions for authorized users.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-3'] }
    },

    // 3.2 AWARENESS AND TRAINING (AT)
    { id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Role-Based Risk Awareness', description: 'Ensure that managers, systems administrators, and users are made aware of the security risks.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'security risks associated with organizational activities involving CUI are identified;', status: 'pending' },
        { id: 'b', description: 'policies, standards, and procedures related to the security of the system are identified;', status: 'pending' },
        { id: 'c', description: 'managers, systems administrators, and users of the system are made aware of the security risks associated with their activities; and', status: 'pending' },
        { id: 'd', description: 'managers, systems administrators, and users are aware of applicable policies and procedures.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-2'] }
    },

    // 3.3 AUDIT AND ACCOUNTABILITY (AU)
    { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'System Auditing', description: 'Create and retain system audit logs and records.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit logs needed (i.e., event types to be logged) are specified;', status: 'pending' },
        { id: 'b', description: 'the content of audit records needed to support monitoring is defined;', status: 'pending' },
        { id: 'c', description: 'audit records are created (generated);', status: 'pending' },
        { id: 'd', description: 'audit records contain the defined content;', status: 'pending' },
        { id: 'e', description: 'retention requirements for audit records are defined; and', status: 'pending' },
        { id: 'f', description: 'audit records are retained as defined.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2'] }
    },

    // 3.7 MAINTENANCE (MA)
    { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'Perform Maintenance', description: 'Perform maintenance on organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system maintenance is performed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] }
    },
    { id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', title: 'System Maintenance Control', description: 'Provide controls on tools, techniques, and personnel.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'tools used to conduct system maintenance are controlled;', status: 'pending' },
        { id: 'b', description: 'techniques used to conduct system maintenance are controlled;', status: 'pending' },
        { id: 'c', description: 'mechanisms used to conduct system maintenance are controlled; and', status: 'pending' },
        { id: 'd', description: 'personnel used to conduct system maintenance are controlled.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-3'] }
    },

    // 3.8 MEDIA PROTECTION (MP)
    { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Media Protection', description: 'Protect system media containing CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'paper media containing CUI is physically controlled;', status: 'pending' },
        { id: 'b', description: 'digital media containing CUI is physically controlled;', status: 'pending' },
        { id: 'c', description: 'paper media containing CUI is securely stored; and', status: 'pending' },
        { id: 'd', description: 'digital media containing CUI is securely stored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-2'] }
    },

    // 3.11 RISK ASSESSMENT (RA)
    { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Risk Assessments', description: 'Periodically assess risk.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency to assess risk to organizational operations is defined; and', status: 'pending' },
        { id: 'b', description: 'risk resulted from the operation of a system that processes CUI is assessed with the defined frequency.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-3'] }
    },

    // 3.13 SYSTEM AND COMMUNICATIONS PROTECTION (SC)
    { id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Boundary Protection', description: 'Monitor and protect communications at boundaries.', cmmcLevel: 1, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the external system boundary is defined;', status: 'pending' },
        { id: 'b', description: 'key internal system boundaries are defined;', status: 'pending' },
        { id: 'c', description: 'communications are monitored at the external system boundary;', status: 'pending' },
        { id: 'd', description: 'communications are monitored at key internal boundaries;', status: 'pending' },
        { id: 'e', description: 'communications are controlled at the external system boundary;', status: 'pending' },
        { id: 'f', description: 'communications are controlled at key internal boundaries;', status: 'pending' },
        { id: 'g', description: 'communications are protected at the external system boundary; and', status: 'pending' },
        { id: 'h', description: 'communications are protected at key internal boundaries.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] }
    },

    // 3.14 SYSTEM AND INFORMATION INTEGRITY (SI)
    { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Flaw Remediation', description: 'Identify, report, and correct system flaws.', cmmcLevel: 1, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the time within which to identify system flaws is specified;', status: 'pending' },
        { id: 'b', description: 'system flaws are identified within the specified time frame;', status: 'pending' },
        { id: 'c', description: 'the time within which to report system flaws is specified;', status: 'pending' },
        { id: 'd', description: 'system flaws are reported within the specified time frame;', status: 'pending' },
        { id: 'e', description: 'the time within which to correct system flaws is specified; and', status: 'pending' },
        { id: 'f', description: 'system flaws are corrected within the specified time frame.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-2'] }
    }
];

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  { id: 'intro-1', familyId: 'PH1', title: 'CMMC 2.0 Framework Architecture', description: 'Overview of transition from NIST 800-171 to CMMC 2.0.', content: '# CMMC 2.0 Structural Overview\n\nCMMC 2.0 streamlines requirements into three levels.', durationMinutes: 20, difficulty: 'Beginner' }
];

export const RMF_TASKS = [
  { id: 'P-1', step: 'P', name: 'Risk Management Role Assignment', description: 'Assign key risk management roles.', role: 'Organization Lead' }
];

export const createInitialClientData = (isParent: boolean): ClientData => ({
  targetCmmcLevel: 2, 
  requirements: JSON.parse(JSON.stringify(REQUIREMENTS_DATA)),
  assets: [],
  users: [],
  artifacts: [],
  risks: [],
  vendors: [],
  tickets: [],
  tasks: [],
  budgetItems: [],
  wizardProgress: { currentStep: 'INTRO', currentQuestionIndex: 0 },
  // Fixed typo in assignmentOfSecurityResponsibility property name by removing erroneous space
  sspMetadata: { systemName: '', systemIdentifier: '', categorization: 'LOW', systemOwner: '', authorizingOfficial: '', otherDesignatedContacts: '', assignmentOfSecurityResponsibility: '', operationalStatus: 'Operational', systemType: 'General Support System', generalDescription: '', systemEnvironment: '', interconnections: '', lawsAndPolicies: '', completionDate: '', approvalDate: '' },
  financials: { annualRevenue: 5000000, employeeCount: 25, avgHourlyLaborRate: 125, brandValueEstimate: 1000000, legalRetentionAnnual: 50000 },
  m365Config: { enabled: false },
  intuneConfig: { enabled: false },
  adConfig: { enabled: false },
  cwConfig: { companyId: '', publicKey: '', privateKey: '', siteUrl: '', serviceBoard: '', enabled: false },
  jiraConfig: { baseUrl: '', email: '', apiToken: '', projectKey: '', issueType: 'Task', enabled: false },
  confluenceConfig: { baseUrl: '', spaceKey: '', enabled: false },
  auvikConfig: { apiKey: '', tenantId: '', region: 'US', enabled: false },
  awsConfig: { enabled: false },
  googleConfig: { enabled: false },
  siemConfig: { enabled: false },
  defenderConfig: { enabled: false },
  s1Config: { enabled: false }
});