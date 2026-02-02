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
const NIST_800_171_CONTROLS: Requirement[] = [
  // --- 3.1 ACCESS CONTROL (AC) ---
  { 
    id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', 
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', 
    interviewQuestion: 'How do you define an "authorized user" and where is that enforced (groups/roles/policies)?',
    examineOptions: ['List of authorized user groups/roles', 'List of authorized device types + enforcement method (MDM/CA/NAC)', 'List of service accounts/service principals that touch CUI'],
    interviewOptions: ['Authoritative identity sources (Entra ID/AD/Cognito)', 'Restriction methods for processes/service principals', 'Device class access rules (Corp vs BYOD)'],
    testOptions: ['Attempt access from unknown/unmanaged device', 'Verify conditional access enforcement'],
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'authorized users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of authorized users are identified;', status: 'pending' },
        { id: 'c', description: 'devices (and other systems) authorized to connect to the system are identified;', status: 'pending' },
        { id: 'd', description: 'system access is limited to authorized users;', status: 'pending' },
        { id: 'e', description: 'system access is limited to processes acting on behalf of authorized users; and', status: 'pending' },
        { id: 'f', description: 'system access is limited to authorized devices (including other systems).', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-2'] } 
  },

  // --- 3.11 RISK ASSESSMENT (RA) ---
  { 
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Risk Assessments', 
    description: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.', 
    interviewQuestion: 'How does your organization establish risk tolerance and conduct organization-wide risk assessments?',
    roleQuestions: {
        authorizingOfficial: [
            "How do you determine if the risk of operating the system is acceptable to the organization?",
            "How does the risk management strategy influence your authorization decisions?",
            "What criteria do you use to prioritize resources for risk mitigation?"
        ],
        systemOwner: [
            "What criteria do you use to prioritize assets for protection?",
            "How do you communicate identified risks to the Authorizing Official?",
            "How are security requirements integrated into the system development life cycle?"
        ],
        riskExecutive: [
            "How is risk assessed across the different levels of the organization (Organization, Business Process, System)?",
            "What methodology is used to aggregate system-level risks into an organizational risk profile?",
            "How is the organization's risk tolerance expressed and communicated?"
        ]
    },
    examineOptions: ['Risk assessment report', 'Defined assessment frequency', 'Risk register', 'Risk Management Strategy document'],
    interviewOptions: ['Business processes handling CUI', 'Rating methodology for documented risks', 'Risk Executive Function involvement'],
    sprsWeight: 5, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the frequency to assess risk to organizational operations, organizational assets, and individuals is defined; and', status: 'pending' },
        { id: 'b', description: 'risk to organizational operations, organizational assets, and individuals resulting from the operation of an organizational system that processes, stores, or transmits CUI is assessed with the defined frequency.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['RA-3'] } 
  }
];

export const REQUIREMENTS_DATA: Requirement[] = [
  ...NIST_800_171_CONTROLS
];

export interface SimulationInject {
    id: string;
    title: string;
    scenario: string;
    question: string;
    regulatoryHint: string;
}

export interface SimulationModule extends TrainingModule {
    isSimulation: boolean;
    injects: SimulationInject[];
    executiveFocus: string;
}

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  {
    id: 'rmf-mastery-1', familyId: 'PH7', title: 'The RMF Lifecycle: A Holistic View',
    description: 'Understand the three levels of risk management: Organization, Mission/Business Process, and Information System.',
    content: `
# NIST SP 800-37 Revision 2 Mastery

The Risk Management Framework (RMF) is purposefully designed to be **technology neutral**. It can be applied to any system—cloud, IoT, industrial control, or mobile.

### The Three Levels of Risk
1. **Level 1 (Organization)**: Strategic risk management led by senior leadership.
2. **Level 2 (Mission/Business Process)**: Mid-level leaders managing projects and workflows.
3. **Level 3 (Information System)**: Individuals developing and operating the systems.

### Key Concept: Acceptance of Risk
Only an **Authorizing Official (AO)** can accept security and privacy risk for the organization. This responsibility cannot be delegated.

### Tips for Success
- **Align with SDLC**: RMF tasks should be indistinguishable from routine development activities.
- **Use Automation**: Maximize the speed of assessments through continuous monitoring.
    `,
    durationMinutes: 40, difficulty: 'Intermediate'
  },
  {
    id: 'rmf-step-0', familyId: 'PH7', title: 'Deep Dive: The Prepare Step',
    description: 'Learn why the PREPARE step is the most critical addition to RMF Revision 2.',
    content: `
# RMF Step 0: PREPARE

The goal of preparation is to ensure the organization is ready to manage security and privacy risks effectively.

### Primary Objectives:
- **Facilitate Communication**: Bridge the gap between the C-suite and system operators.
- **Identify Common Controls**: Reduce workload by identifying controls that can be inherited by multiple systems.
- **Determine Boundaries**: Clearly define what is in scope to avoid unnecessary complexity and cost.

### Interview Scenario:
When interviewing a **System Owner**, ask: *"How did you determine the authorization boundary, and are there enabling systems outside that boundary that provide shared services?"*
    `,
    durationMinutes: 30, difficulty: 'Advanced'
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