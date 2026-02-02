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
    // 3.1 ACCESS CONTROL
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
    { id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Limit access to types of transactions', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the types of transactions and functions that authorized users are permitted to execute are defined; and', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined types of transactions and functions for authorized users.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-3'] }
    },
    { id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control CUI Flow', description: 'Control the flow of CUI in accordance with approved authorizations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'information flow control policies are defined;', status: 'pending' },
        { id: 'b', description: 'methods and enforcement mechanisms for controlling the flow of CUI are defined;', status: 'pending' },
        { id: 'c', description: 'designated sources and destinations (e.g., networks, individuals, and devices) for CUI within the system and between interconnected systems are identified;', status: 'pending' },
        { id: 'd', description: 'authorizations for controlling the flow of CUI are defined; and', status: 'pending' },
        { id: 'e', description: 'approved authorizations for controlling the flow of CUI are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-4'] }
    },
    { id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separation of duties', description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the duties of individuals requiring separation are defined;', status: 'pending' },
        { id: 'b', description: 'responsibilities for duties that require separation are assigned to separate individuals; and', status: 'pending' },
        { id: 'c', description: 'access privileges that enable individuals to exercise the duties that require separation are granted to separate individuals.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-5'] }
    },
    { id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', title: 'Least Privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'privileged accounts are identified;', status: 'pending' },
        { id: 'b', description: 'access to privileged accounts is authorized in accordance with the principle of least privilege;', status: 'pending' },
        { id: 'c', description: 'security functions are identified; and', status: 'pending' },
        { id: 'd', description: 'access to security functions is authorized in accordance with the principle of least privilege.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6'] }
    },

    // 3.2 AWARENESS AND TRAINING
    { id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Role-Based Risk Awareness', description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'security risks associated with organizational activities involving CUI are identified;', status: 'pending' },
        { id: 'b', description: 'policies, standards, and procedures related to the security of the system are identified;', status: 'pending' },
        { id: 'c', description: 'managers, systems administrators, and users of the system are made aware of the security risks associated with their activities; and', status: 'pending' },
        { id: 'd', description: 'managers, systems administrators, and users of the system are made aware of the applicable policies, standards, and procedures related to the security of the system.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-2'] }
    },

    // 3.3 AUDIT AND ACCOUNTABILITY
    { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'System Auditing', description: 'Create and retain system audit logs and records.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit logs needed (i.e., event types to be logged) to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity are specified;', status: 'pending' },
        { id: 'b', description: 'the content of audit records needed to support monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity is defined;', status: 'pending' },
        { id: 'c', description: 'audit records are created (generated);', status: 'pending' },
        { id: 'd', description: 'audit records, once created, contain the defined content;', status: 'pending' },
        { id: 'e', description: 'retention requirements for audit records are defined; and', status: 'pending' },
        { id: 'f', description: 'audit records are retained as defined.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2'] }
    },

    // 3.4 CONFIGURATION MANAGEMENT
    { id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'System Baselining', description: 'Establish and maintain baseline configurations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a baseline configuration is established;', status: 'pending' },
        { id: 'b', description: 'the baseline configuration includes hardware, software, firmware, and documentation;', status: 'pending' },
        { id: 'c', description: 'the baseline configuration is maintained (reviewed and updated) throughout the system development life cycle;', status: 'pending' },
        { id: 'd', description: 'a system inventory is established;', status: 'pending' },
        { id: 'e', description: 'the system inventory includes hardware, software, firmware, and documentation; and', status: 'pending' },
        { id: 'f', description: 'the inventory is maintained (reviewed and updated) throughout the system development life cycle.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-2'] }
    },

    // 3.5 IDENTIFICATION AND AUTHENTICATION
    { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identification', description: 'Identify system users, processes acting on behalf of users, and devices.', cmmcLevel: 1, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of users are identified; and', status: 'pending' },
        { id: 'c', description: 'devices accessing the system are identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] }
    },

    // 3.6 INCIDENT RESPONSE
    { id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Handling', description: 'Establish an operational incident-handling capability.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'an operational incident-handling capability is established;', status: 'pending' },
        { id: 'b', description: 'the operational incident-handling capability includes preparation;', status: 'pending' },
        { id: 'c', description: 'the operational incident-handling capability includes detection;', status: 'pending' },
        { id: 'd', description: 'the operational incident-handling capability includes analysis;', status: 'pending' },
        { id: 'e', description: 'the operational incident-handling capability includes containment;', status: 'pending' },
        { id: 'f', description: 'the operational incident-handling capability includes recovery; and', status: 'pending' },
        { id: 'g', description: 'the operational incident-handling capability includes user response activities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-4'] }
    },

    // 3.7 MAINTENANCE
    { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'Perform Maintenance', description: 'Perform maintenance on organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system maintenance is performed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] }
    },
    { id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', title: 'System Maintenance Control', description: 'Provide controls on the tools and personnel used to conduct maintenance.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'tools used to conduct system maintenance are controlled;', status: 'pending' },
        { id: 'b', description: 'techniques used to conduct system maintenance are controlled;', status: 'pending' },
        { id: 'c', description: 'mechanisms used to conduct system maintenance are controlled; and', status: 'pending' },
        { id: 'd', description: 'personnel used to conduct system maintenance are controlled.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-3'] }
    },

    // 3.8 MEDIA PROTECTION
    { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Media Protection', description: 'Protect system media containing CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'paper media containing CUI is physically controlled;', status: 'pending' },
        { id: 'b', description: 'digital media containing CUI is physically controlled;', status: 'pending' },
        { id: 'c', description: 'paper media containing CUI is securely stored; and', status: 'pending' },
        { id: 'd', description: 'digital media containing CUI is securely stored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-2'] }
    },

    // 3.9 PERSONNEL SECURITY
    { id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', title: 'Screen Individuals', description: 'Screen individuals prior to authorizing access.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'individuals are screened prior to authorizing access to organizational systems containing CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-3'] }
    },

    // 3.10 PHYSICAL PROTECTION
    { id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit Physical Access', description: 'Limit physical access to organizational systems.', cmmcLevel: 1, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'authorized individuals allowed physical access are identified;', status: 'pending' },
        { id: 'b', description: 'physical access to organizational systems is limited to authorized individuals;', status: 'pending' },
        { id: 'c', description: 'physical access to equipment is limited to authorized individuals; and', status: 'pending' },
        { id: 'd', description: 'physical access to operating environments is limited to authorized individuals.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-2'] }
    },

    // 3.11 RISK ASSESSMENT
    { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Risk assessments', description: 'Periodically assess risk.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency to assess risk to organizational operations, organizational assets, and individuals is defined; and', status: 'pending' },
        { id: 'b', description: 'risk to organizational operations, organizational assets, and individuals resulting from the operation of an organizational system that processes, stores, or transmits CUI is assessed with the defined frequency.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-3'] }
    },

    // 3.12 SECURITY ASSESSMENT
    { id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Security control assessment', description: 'Periodically assess security controls.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency of security control assessments is defined; and', status: 'pending' },
        { id: 'b', securityControls: 'security controls are assessed with the defined frequency to determine if the controls are effective in their application.', status: 'pending' }
      ] as any, // Typed as any temporarily to match OCR schema precisely
      mappings: { nist800_53: ['CA-2'] }
    },

    // 3.13 SYSTEM AND COMMUNICATIONS PROTECTION
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

    // 3.14 SYSTEM AND INFORMATION INTEGRITY
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
    },
    { id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', title: 'Malicious Code Protection', description: 'Provide protection from malicious code.', cmmcLevel: 1, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'designated locations for malicious code protection are identified; and', status: 'pending' },
        { id: 'b', description: 'protection from malicious code at designated locations is provided.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-3'] }
    }
];

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  { id: 'intro-1', familyId: 'PH1', title: 'CMMC 2.0 Framework Architecture', description: 'Overview of the transition from NIST 800-171 to CMMC 2.0.', content: '# CMMC 2.0 Structural Overview\n\nCMMC 2.0 streamlines the requirements into three distinct levels:\n\n1. **Level 1 (Foundational)**: 17 Practices.\n2. **Level 2 (Advanced)**: 110 Practices.\n3. **Level 3 (Expert)**: 110+ Practices.', durationMinutes: 20, difficulty: 'Beginner' },
  { id: 'sim-1', familyId: 'PH6', title: 'Executive Ransomware Response', description: 'High-stakes tabletop exercise for leadership decision-making.', content: 'Simulator content loading...', durationMinutes: 60, difficulty: 'Advanced', isSimulation: true, executiveFocus: 'Crisis Communication & Disclosure', injects: [ { id: 'inj1', title: 'The Discovery', scenario: 'The IT Manager reports that files on the CUI server are encrypted.', regulatoryHint: 'Reference IR 3.6.1: Are your handling procedures operational?' }, { id: 'inj2', title: 'The Ransom Note', scenario: 'A note demands 50 BTC for the decryption key.', regulatoryHint: 'Reference IR 3.6.2: Who are the external authorities to notify?' } ] }
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