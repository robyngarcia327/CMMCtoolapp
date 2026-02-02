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

export const RMF_TASKS = [
    { id: 'P-1', step: 'P', name: 'Risk Management Roles', description: 'Identify and assign individuals to specific roles for security and privacy risk management.', role: 'Head of Agency / CIO' },
    { id: 'P-2', step: 'P', name: 'Risk Management Strategy', description: 'Establish a risk management strategy for the organization including a determination of risk tolerance.', role: 'Head of Agency' },
    { id: 'P-3', step: 'P', name: 'Risk Assessment - Organization', description: 'Assess organization-wide security and privacy risk and update on an ongoing basis.', role: 'Risk Executive' },
    { id: 'P-11', step: 'P', name: 'Authorization Boundary', description: 'Determine the authorization boundary of the system.', role: 'Authorizing Official' },
    { id: 'C-1', step: 'C', name: 'System Description', description: 'Document the characteristics of the system.', role: 'System Owner' },
    { id: 'C-2', step: 'C', name: 'Security Categorization', description: 'Categorize the system and document the results based on CIA impact.', role: 'System Owner' },
    { id: 'S-1', step: 'S', name: 'Control Selection', description: 'Select the controls for the system and the environment of operation.', role: 'System Owner' },
    { id: 'I-1', step: 'I', name: 'Control Implementation', description: 'Implement the controls in the security and privacy plans.', role: 'System Owner' },
    { id: 'A-2', step: 'A', name: 'Assessment Plan', description: 'Develop, review, and approve plans to assess implemented controls.', role: 'Authorizing Official' },
    { id: 'R-2', step: 'R', name: 'Risk Analysis and Determination', description: 'Analyze and determine the risk from the operation or use of the system.', role: 'Authorizing Official' },
    { id: 'M-1', step: 'M', name: 'System and Environment Changes', description: 'Monitor the system and its environment for changes impacting posture.', role: 'System Owner' }
];

// --- COMPREHENSIVE NIST 800-171 / CMMC 2.0 DATA ---
export const REQUIREMENTS_DATA: Requirement[] = [
  // 3.1 ACCESS CONTROL
  { 
    id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', 
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', 
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'authorized users are identified;', status: 'pending' },
        { id: 'b', description: 'system access is limited to authorized users;', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-2'] } 
  },
  { 
    id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to types of transactions', 
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', 
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'permitted types of transactions and functions are identified;', status: 'pending' },
        { id: 'b', description: 'system access is limited to those types of transactions and functions.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-3'] } 
  },
  { 
    id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control CUI Flow', 
    description: 'Control the flow of CUI in accordance with approved authorizations.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'approved authorizations for controlling the flow of CUI are defined;', status: 'pending' },
        { id: 'b', description: 'the flow of CUI is controlled in accordance with approved authorizations.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-4'] } 
  },
  
  // 3.2 AWARENESS AND TRAINING
  { 
    id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Security awareness training', 
    description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities.', 
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'security risks associated with activities are identified;', status: 'pending' },
        { id: 'b', description: 'users are made aware of those risks through training.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AT-2'] } 
  },

  // 3.3 AUDIT AND ACCOUNTABILITY
  { 
    id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'Create and retain audit logs', 
    description: 'Create and retain system audit logs and records to the extent needed to enable monitoring.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'audit logs are created;', status: 'pending' },
        { id: 'b', description: 'audit logs are retained.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AU-2'] } 
  },

  // 3.4 CONFIGURATION MANAGEMENT
  { 
    id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'Establish Baseline Configurations', 
    description: 'Establish and maintain baseline configurations and inventories of systems.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'baseline configurations are established;', status: 'pending' },
        { id: 'b', description: 'inventories are maintained.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['CM-2'] } 
  },

  // 3.5 IDENTIFICATION AND AUTHENTICATION
  { 
    id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Multi-factor Authentication (MFA)', 
    description: 'Use multi-factor authentication for local and network access to privileged accounts.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'MFA is used for privileged accounts;', status: 'pending' },
        { id: 'b', description: 'MFA is used for network access.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['IA-2(1)'] } 
  },

  // 3.6 INCIDENT RESPONSE
  { 
    id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Response Capability', 
    description: 'Establish an operational incident-handling capability including preparation, detection, and analysis.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'incident handling capability is established;', status: 'pending' },
        { id: 'b', description: 'preparation and detection activities are included.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['IR-4'] } 
  },

  // 3.7 MAINTENANCE
  { 
    id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'Perform system maintenance', 
    description: 'Perform maintenance on organizational systems.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'maintenance is performed;', status: 'pending' },
        { id: 'b', description: 'maintenance is documented.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['MA-2'] } 
  },

  // 3.8 MEDIA PROTECTION
  { 
    id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Protect system media', 
    description: 'Protect (i.e., physically control and securely store) system media containing CUI.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'digital media is protected;', status: 'pending' },
        { id: 'b', description: 'paper media is protected.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['MP-2'] } 
  },

  // 3.9 PERSONNEL SECURITY
  { 
    id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', title: 'Screen individuals', 
    description: 'Screen individuals prior to authorizing access to systems containing CUI.', 
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'individuals are screened;', status: 'pending' },
        { id: 'b', description: 'screening is performed prior to access.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['PS-3'] } 
  },

  // 3.10 PHYSICAL PROTECTION
  { 
    id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit physical access', 
    description: 'Limit physical access to organizational systems and equipment to authorized individuals.', 
    sprsWeight: 3, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'physical access is limited;', status: 'pending' },
        { id: 'b', description: 'operating environments are protected.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['PE-2'] } 
  },

  // 3.11 RISK ASSESSMENT
  { 
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Periodically assess risk', 
    description: 'Periodically assess the risk to organizational operations resulting from the operation of systems.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'risks are assessed periodically;', status: 'pending' },
        { id: 'b', description: 'assessment includes CUI impact.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['RA-3'] } 
  },

  // 3.12 SECURITY ASSESSMENT
  { 
    id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Periodically assess security controls', 
    description: 'Periodically assess the security controls in systems to determine if controls are effective.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'security controls are assessed;', status: 'pending' },
        { id: 'b', description: 'effectiveness is determined.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['CA-2'] } 
  },

  // 3.13 SYSTEM AND COMMUNICATIONS PROTECTION
  { 
    id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Monitor and protect communications', 
    description: 'Monitor, control, and protect communications at the external and key internal boundaries.', 
    sprsWeight: 3, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'external boundaries are monitored;', status: 'pending' },
        { id: 'b', description: 'communications are protected.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['SC-7'] } 
  },

  // 3.14 SYSTEM AND INFORMATION INTEGRITY
  { 
    id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Identify and report flaws', 
    description: 'Identify, report, and correct system flaws in a timely manner.', 
    sprsWeight: 3, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'system flaws are identified;', status: 'pending' },
        { id: 'b', description: 'flaws are corrected in a timely manner.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['SI-2'] } 
  }
];

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  {
    id: 'intro-1', familyId: 'PH1', title: 'CMMC 2.0 Framework Architecture',
    description: 'Deep dive into the transition from NIST 800-171 Rev 2 to CMMC 2.0 Levels 1-3.',
    content: '# CMMC 2.0 Structural Overview\n\nCMMC 2.0 streamlines the requirements into three distinct levels:\n\n1. **Level 1 (Foundational)**: 17 Practices (Identical to FAR 52.204-21)\n2. **Level 2 (Advanced)**: 110 Practices (Direct alignment with NIST SP 800-171)\n3. **Level 3 (Expert)**: 110+ Practices (Based on NIST SP 800-172)',
    durationMinutes: 20, difficulty: 'Beginner'
  },
  {
    id: 'scope-1', familyId: 'PH2', title: 'Scoping the Assessment Boundary',
    description: 'Identify the five asset categories required for a valid CMMC assessment.',
    content: '# Defining the Boundary\n\nPer the CMMC Scoping Guide v2.11, assets must be classified into:\n\n- **CUI Assets**: Process, store, or transmit CUI.\n- **Security Protection Assets (SPA)**: Provide security functions (e.g., Firewalls, SIEM).',
    durationMinutes: 25, difficulty: 'Intermediate'
  },
  {
    id: 'sim-inc-1', familyId: 'PH6', title: 'Sim: Ransomware Incident Response',
    description: 'Live tabletop exercise for executive leadership during a CUI data breach.',
    isSimulation: true,
    executiveFocus: 'Leadership Decision-making & Disclosure Obligations',
    injects: [
        { id: 'ij1', title: 'The Initial Alert', scenario: 'The IT Director reports that the main CUI file server is unresponsive.', regulatoryHint: 'Reference IR 3.6.1: Is your IR capability operational right now?' },
        { id: 'ij2', title: 'Scope Verification', scenario: 'The CISO confirms CUI was exfiltrated.', regulatoryHint: 'Reference IR 3.6.2: Have you tracked the incident according to your plan?' }
    ],
    content: 'Interactive Tabletop Simulation Engine Initialized.',
    durationMinutes: 60, difficulty: 'Advanced'
  }
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
  sspMetadata: {
    systemName: '', systemIdentifier: '', categorization: 'LOW', systemOwner: '', authorizingOfficial: '',
    otherDesignatedContacts: '', assignmentOfSecurityResponsibility: '', operationalStatus: 'Operational',
    systemType: 'General Support System', generalDescription: '', systemEnvironment: '', interconnections: '',
    lawsAndPolicies: '', completionDate: '', approvalDate: ''
  },
  financials: {
      annualRevenue: 5000000,
      employeeCount: 25,
      avgHourlyLaborRate: 125,
      brandValueEstimate: 1000000,
      legalRetentionAnnual: 50000
  },
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