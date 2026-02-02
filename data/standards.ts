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
    // --- ACCESS CONTROL (AC) ---
    { id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'authorized users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of authorized users are identified;', status: 'pending' },
        { id: 'c', description: 'devices authorized to connect to the system are identified;', status: 'pending' },
        { id: 'd', description: 'system access is limited to authorized users;', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-2', 'AC-3'] }
    },
    { id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Limit access to types of transactions', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the types of transactions and functions that authorized users are permitted to execute are defined;', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined types of transactions and functions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-3'] }
    },

    // --- AWARENESS AND TRAINING (AT) ---
    { id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Role-Based Risk Awareness', description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'security risks associated with organizational activities involving CUI are identified;', status: 'pending' },
        { id: 'b', description: 'personnel are made aware of the security risks associated with their activities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-2'] }
    },

    // --- AUDIT AND ACCOUNTABILITY (AU) ---
    { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'System Auditing', description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit logs needed to enable monitoring and analysis are specified;', status: 'pending' },
        { id: 'b', description: 'audit records are created and retained as specified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2'] }
    },

    // --- CONFIGURATION MANAGEMENT (CM) ---
    { id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'Baseline Configuration', description: 'Establish and maintain baseline configurations and inventories of organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a baseline configuration is established;', status: 'pending' },
        { id: 'b', description: 'the baseline configuration is maintained throughout the system lifecycle.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-2'] }
    },

    // --- IDENTIFICATION AND AUTHENTICATION (IA) ---
    { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identifier Management', description: 'Identify system users, processes acting on behalf of users, and devices.', cmmcLevel: 1, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system users are identified;', status: 'pending' },
        { id: 'b', description: 'devices accessing the system are identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] }
    },

    // --- INCIDENT RESPONSE (IR) ---
    { id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Handling Capability', description: 'Establish an operational incident-handling capability for organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'an operational incident-handling capability is established;', status: 'pending' },
        { id: 'b', description: 'the capability includes preparation, detection, analysis, containment, and recovery.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-4'] }
    },

    // --- MAINTENANCE (MA) ---
    { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'Perform System Maintenance', description: 'Perform maintenance on organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system maintenance is performed according to defined schedules.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] }
    },

    // --- MEDIA PROTECTION (MP) ---
    { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Media Storage Protection', description: 'Protect (i.e., physically control and securely store) system media containing CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system media containing CUI is physically controlled;', status: 'pending' },
        { id: 'b', description: 'system media containing CUI is securely stored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-2'] }
    },

    // --- PERSONNEL SECURITY (PS) ---
    { id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', title: 'Screen Individuals', description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'individuals are screened prior to authorizing access to systems containing CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-3'] }
    },

    // --- PHYSICAL PROTECTION (PE) ---
    { id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit Physical Access', description: 'Limit physical access to organizational systems, equipment, and operating environments to authorized individuals.', cmmcLevel: 1, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'authorized individuals allowed physical access are identified;', status: 'pending' },
        { id: 'b', description: 'physical access is limited to authorized individuals.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-2'] }
    },

    // --- RISK ASSESSMENT (RA) ---
    { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Periodically Assess Risk', description: 'Periodically assess the risk to organizational operations resulting from the operation of systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency to assess risk is defined;', status: 'pending' },
        { id: 'b', description: 'risk is assessed with the defined frequency.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-3'] }
    },

    // --- SECURITY ASSESSMENT (CA) ---
    { id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Security Control Assessment', description: 'Periodically assess the security controls in organizational systems to determine effectiveness.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency of assessments is defined;', status: 'pending' },
        { id: 'b', description: 'security controls are assessed to determine effectiveness.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CA-2'] }
    },

    // --- SYSTEM AND COMMUNICATIONS PROTECTION (SC) ---
    { id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Boundary Protection', description: 'Monitor, control, and protect communications at the external boundaries and key internal boundaries.', cmmcLevel: 1, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the external system boundary is defined;', status: 'pending' },
        { id: 'b', description: 'key internal system boundaries are defined;', status: 'pending' },
        { id: 'c', description: 'communications are monitored and controlled at boundaries.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] }
    },

    // --- SYSTEM AND INFORMATION INTEGRITY (SI) ---
    { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Flaw Remediation', description: 'Identify, report, and correct system flaws in a timely manner.', cmmcLevel: 1, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the time within which to identify system flaws is specified;', status: 'pending' },
        { id: 'b', description: 'system flaws are identified, reported, and corrected within specified time frames.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-2'] }
    }
];

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  { id: 'intro-1', familyId: 'PH1', title: 'CMMC 2.0 Framework Architecture', description: 'Overview of the transition from NIST 800-171 to CMMC 2.0.', content: '# CMMC 2.0 Structural Overview\n\nCMMC 2.0 streamlines requirements into three levels.', durationMinutes: 20, difficulty: 'Beginner' }
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