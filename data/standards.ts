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

export const REQUIREMENTS_DATA: Requirement[] = [
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
  { 
    id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separate duties of individuals', 
    description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', 
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'duties are separated;', status: 'pending' },
        { id: 'b', description: 'risks are mitigated without collusion.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-5'] } 
  },
  { 
    id: '3.1.8', framework: 'NIST-CMMC', family: 'AC', title: 'Limit unsuccessful logon attempts', 
    description: 'Limit unsuccessful logon attempts.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the number of consecutive invalid logon attempts is defined;', status: 'pending' },
        { id: 'b', description: 'system access is locked after the defined number of attempts.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-7'] } 
  },
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
  { 
    id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Use multi-factor authentication (MFA)', 
    description: 'Use multi-factor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'MFA is used for privileged accounts;', status: 'pending' },
        { id: 'b', description: 'MFA is used for network access.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['IA-2(1)'] } 
  }
];

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  {
    id: 'intro-1', familyId: 'PH1', title: 'CMMC 2.0 Framework Architecture',
    description: 'Deep dive into the transition from NIST 800-171 Rev 2 to CMMC 2.0 Levels 1-3.',
    content: '# CMMC 2.0 Structural Overview\n\nCMMC 2.0 streamlines the requirements into three distinct levels:\n\n1. **Level 1 (Foundational)**: 17 Practices (Identical to FAR 52.204-21)\n2. **Level 2 (Advanced)**: 110 Practices (Direct alignment with NIST SP 800-171)\n3. **Level 3 (Expert)**: 110+ Practices (Based on NIST SP 800-172)\n\n## Key Assessment Changes\nAssessments are now bifurcated between **Self-Assessments** for Level 1 and some Level 2 (non-prioritized CUI), and **Third-Party Assessments** for Level 2 (prioritized CUI) and Level 3.',
    durationMinutes: 20, difficulty: 'Beginner'
  },
  {
    id: 'scope-1', familyId: 'PH2', title: 'Scoping the Assessment Boundary',
    description: 'Identify the five asset categories required for a valid CMMC assessment.',
    content: '# Defining the Boundary\n\nPer the CMMC Scoping Guide v2.11, assets must be classified into:\n\n- **CUI Assets**: Process, store, or transmit CUI.\n- **Security Protection Assets (SPA)**: Provide security functions (e.g., Firewalls, SIEM).\n- **Contractor Risk Managed Assets (CRMA)**: Can but do not intended to process CUI.\n- **Specialized Assets**: IoT, OT, GFE.\n- **Out-of-Scope Assets**: No access to CUI.\n\n> *Crucial*: All CUI Assets and SPAs are subject to full assessment.',
    durationMinutes: 25, difficulty: 'Intermediate'
  },
  {
    id: 'tech-ac-1', familyId: 'PH3', title: 'Domain Deep Dive: Access Control (AC)',
    description: 'Implementing least privilege and transaction-level monitoring for CUI.',
    content: '# Access Control (AC) Domain\n\nAccess Control is the largest domain in NIST 800-171. It focuses on ensuring only the right people have access to the right data.\n\n## Key Requirements\n- **3.1.1**: Use of authorized users/devices.\n- **3.1.3**: Controlling CUI flow.\n- **3.1.12**: Remote access encryption and monitoring.',
    durationMinutes: 45, difficulty: 'Advanced'
  },
  {
    id: 'tech-ia-1', familyId: 'PH3', title: 'Identity & Authentication Mastery',
    description: 'MFA implementation and password lifecycle management for federal data.',
    content: '# Identification and Authentication (IA)\n\nNIST 800-171 requires robust identity verification.\n\n## Multi-Factor Authentication (3.5.3)\nMFA is mandated for all local and network access to privileged accounts and all network access to non-privileged accounts. \n\n*Assessor Tip*: Auditors look for "something you have" (TOTP, Hardware Key) + "something you know" (Password).',
    durationMinutes: 30, difficulty: 'Intermediate'
  },
  {
    id: 'sim-inc-1', familyId: 'PH6', title: 'Sim: Ransomware Incident Response',
    description: 'Live tabletop exercise for executive leadership during a CUI data breach.',
    isSimulation: true,
    executiveFocus: 'Leadership Decision-making & Disclosure Obligations',
    injects: [
        { id: 'ij1', title: 'The Initial Alert', scenario: 'The IT Director reports that the main CUI file server is unresponsive. A text file on the root drive demands 10 BTC.', regulatoryHint: 'Reference IR 3.6.1: Is your IR capability operational right now?' },
        { id: 'ij2', title: 'Scope Verification', scenario: 'The CISO confirms CUI was exfiltrated. Legal reminds the team of the 72-hour DoD reporting requirement via DIBNet.', regulatoryHint: 'Reference IR 3.6.2: Have you tracked the incident according to your plan?' }
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