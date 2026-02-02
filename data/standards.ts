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
    // Foundation Domains (AC, AU, AT, CM, IA, IR, MA, MP included for completeness)
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

    // --- PERSONNEL SECURITY (PS) ---
    { id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', title: 'Screen Individuals', description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'individuals are screened prior to authorizing access to organizational systems containing CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-3'] }
    },
    { id: '3.9.2', framework: 'NIST-CMMC', family: 'PS', title: 'Personnel Actions', description: 'Ensure that organizational systems containing CUI are protected during and after personnel actions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a policy and/or process for terminating system access and any credentials coincident with personnel actions is established;', status: 'pending' },
        { id: 'b', description: 'system access and credentials are terminated consistent with personnel actions such as termination or transfer; and', status: 'pending' },
        { id: 'c', description: 'the system is protected during and after personnel transfer actions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-4', 'PS-5'] }
    },

    // --- PHYSICAL PROTECTION (PE) ---
    { id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit Physical Access', description: 'Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.', cmmcLevel: 1, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'authorized individuals allowed physical access are identified;', status: 'pending' },
        { id: 'b', description: 'physical access to organizational systems is limited to authorized individuals;', status: 'pending' },
        { id: 'c', description: 'physical access to equipment is limited to authorized individuals; and', status: 'pending' },
        { id: 'd', description: 'physical access to operating environments is limited to authorized individuals.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-2'] }
    },
    { id: '3.10.2', framework: 'NIST-CMMC', family: 'PE', title: 'Monitor Facility', description: 'Protect and monitor the physical facility and support infrastructure for organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the physical facility where organizational systems reside is protected;', status: 'pending' },
        { id: 'b', description: 'the support infrastructure for organizational systems is protected;', status: 'pending' },
        { id: 'c', description: 'the physical facility where organizational systems reside is monitored; and', status: 'pending' },
        { id: 'd', description: 'the support infrastructure for organizational systems is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-3', 'PE-6'] }
    },

    // --- RISK ASSESSMENT (RA) ---
    { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Risk Assessments', description: 'Periodically assess risk to organizational operations resulting from the operation of organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency to assess risk to organizational operations, organizational assets, and individuals is defined; and', status: 'pending' },
        { id: 'b', description: 'risk to organizational operations resulting from the operation of an organizational system that processes CUI is assessed with the defined frequency.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-3'] }
    },
    { id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', title: 'Vulnerability Scan', description: 'Scan for vulnerabilities in organizational systems and applications periodically.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency to scan for vulnerabilities in organizational systems and applications is defined;', status: 'pending' },
        { id: 'b', description: 'vulnerability scans are performed on organizational systems with the defined frequency;', status: 'pending' },
        { id: 'c', description: 'vulnerability scans are performed on applications with the defined frequency;', status: 'pending' },
        { id: 'd', description: 'vulnerability scans are performed on organizational systems when new vulnerabilities are identified; and', status: 'pending' },
        { id: 'e', description: 'vulnerability scans are performed on applications when new vulnerabilities are identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-5'] }
    },

    // --- SECURITY ASSESSMENT (CA) ---
    { id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Security Control Assessment', description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency of security control assessments is defined; and', status: 'pending' },
        { id: 'b', description: 'security controls are assessed with the defined frequency to determine if the controls are effective in their application.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CA-2'] }
    },
    { id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', title: 'System Security Plan', description: 'Develop, document, and periodically update system security plans.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a system security plan is developed;', status: 'pending' },
        { id: 'b', description: 'the system boundary is described and documented in the system security plan;', status: 'pending' },
        { id: 'c', description: 'the system environment of operation is described and documented in the system security plan;', status: 'pending' },
        { id: 'd', description: 'the security requirements identified as non-applicable are identified;', status: 'pending' },
        { id: 'e', description: 'the method of security requirement implementation is described and documented;', status: 'pending' },
        { id: 'f', description: 'the relationship with other systems is described and documented;', status: 'pending' },
        { id: 'g', description: 'the frequency to update the system security plan is defined; and', status: 'pending' },
        { id: 'h', description: 'system security plan is updated with the defined frequency.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PL-2'] }
    },

    // --- SYSTEM AND COMMUNICATIONS PROTECTION (SC) ---
    { id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Boundary Protection', description: 'Monitor, control, and protect communications at the external boundaries and key internal boundaries.', cmmcLevel: 1, sprsWeight: 3,
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

    // --- SYSTEM AND INFORMATION INTEGRITY (SI) ---
    { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Flaw Remediation', description: 'Identify, report, and correct system flaws in a timely manner.', cmmcLevel: 1, sprsWeight: 3,
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
