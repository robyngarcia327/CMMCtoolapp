import { Requirement, Framework, ClientData, TrainingModule } from '../types';

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

// NIST SP 800-37 Revision 2 Full Task Registry
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

// NIST SP 800-171A Granular Determination Statements with Guided Wizard Content
export const REQUIREMENTS_DATA: Requirement[] = [
  // --- 3.1 ACCESS CONTROL (AC) ---
  { 
    id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', 
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', 
    interviewQuestion: 'How do you define an "authorized user" and where is that enforced?',
    examineOptions: ['List of authorized user groups', 'Device management policies'],
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
    id: '3.1.12', framework: 'NIST-CMMC', family: 'AC', title: 'Monitor and control remote access', 
    description: 'Monitor and control remote access sessions.', 
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'remote access sessions are monitored;', status: 'pending' },
        { id: 'b', description: 'remote access sessions are controlled.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-17'] } 
  },

  // --- 3.2 AWARENESS AND TRAINING (AT) ---
  { 
    id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Security awareness training', 
    description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities.', 
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'security risks associated with activities are identified;', status: 'pending' },
        { id: 'b', description: 'users are made aware of those risks through training.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AT-2'] } 
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'intro-1', familyId: 'PH1', title: 'Compliance Fundamentals',
    description: 'Overview of the CMMC 2.0 framework and NIST 800-171 standards.',
    content: '# CMMC 2.0 Basics\nWelcome to your journey towards compliance.',
    durationMinutes: 15, difficulty: 'Beginner'
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