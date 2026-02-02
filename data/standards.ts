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
  { 
    id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Limit access to transactions/functions', 
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', 
    interviewQuestion: 'What transactions/functions (view/edit/share) are allowed per role and where is this enforced?',
    examineOptions: ['Role-to-Action matrix or checklist', 'Screenshots/exports of app role permissions', 'SharePoint/OneDrive permission configurations'],
    interviewOptions: ['Applications processing/transmitting CUI', 'Governance of "break-glass" privileged roles', 'Enforcement mechanisms (RBAC/SaaS permissions)'],
    sprsWeight: 5, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'the types of transactions and functions that authorized users are permitted to execute are defined; and', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined types of transactions and functions for authorized users.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-6'] } 
  },
  { 
    id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control the flow of CUI', 
    description: 'Control the flow of CUI in accordance with approved authorizations.', 
    interviewQuestion: 'What are your approved CUI communication domains and how do you prevent flow to unauthorized paths?',
    examineOptions: ['Authorized external domains table', 'DLP configuration (Policy list + actions)', 'CUI Location inventory (SharePoint/Teams/S3)', 'Approved transfer methods list (Encrypted email/SFTP)'],
    interviewOptions: ['Information flow policies (Approved vs Prohibited paths)', 'Prevention of external sharing to non-approved domains', 'Blocking copy/paste or download to unmanaged devices'],
    testOptions: ['Attempt to share CUI to personal cloud (Dropbox/iCloud)', 'Verify block on non-approved domain email transfer'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'information flow control policies are defined;', status: 'pending' },
        { id: 'b', description: 'methods and enforcement mechanisms for controlling the flow of CUI are defined;', status: 'pending' },
        { id: 'c', description: 'designated sources and destinations (e.g., networks, individuals, and devices) for CUI within the system and between interconnected systems are identified;', status: 'pending' },
        { id: 'd', description: 'authorizations for controlling the flow of CUI are defined; and', status: 'pending' },
        { id: 'e', description: 'approved authorizations for controlling the flow of CUI are enforced.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-4'] } 
  },

  // --- 3.10 PHYSICAL PROTECTION (PE) ---
  { 
    id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit physical access [CUI DATA]', 
    description: 'Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.', 
    interviewQuestion: 'Where are CUI systems physically located (Offices/DCs/Home) and how are authorized individuals restricted (Badges/Keys)?',
    examineOptions: ['List of facilities with CUI access', 'Authorized personnel list', 'Photos or diagrams of access controls', 'Physical access policy'],
    interviewOptions: ['Identification process for authorized physical access', 'Role-based access right reviews', 'Equipment storing CUI (Endpoints, Servers, Backups)'],
    testOptions: ['Attempt unauthorized access to server room/data center'],
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'authorized individuals allowed physical access are identified;', status: 'pending' },
        { id: 'b', description: 'physical access to organizational systems is limited to authorized individuals;', status: 'pending' },
        { id: 'c', description: 'physical access to equipment is limited to authorized individuals; and', status: 'pending' },
        { id: 'd', description: 'physical access to operating environments is limited to authorized individuals.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['PE-2'] } 
  },

  // --- 3.11 RISK ASSESSMENT (RA) ---
  { 
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Risk Assessments', 
    description: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.', 
    interviewQuestion: 'How does your organization establish risk tolerance and conduct organization-wide risk assessments?',
    roleQuestions: {
        authorizingOfficial: [
            "How do you determine if the risk of operating the system is acceptable to the organization?",
            "How does the risk management strategy influence your authorization decisions?"
        ],
        systemOwner: [
            "What criteria do you use to prioritize assets for protection?",
            "How do you communicate identified risks to the Authorizing Official?"
        ],
        riskExecutive: [
            "How is risk assessed across the different levels of the organization (Organization, Business Process, System)?",
            "What methodology is used to aggregate system-level risks into an organizational risk profile?"
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
  },
  { 
    id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', title: 'Vulnerability Scan', 
    description: 'Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.', 
    interviewQuestion: 'What tools perform vulnerability scanning and what is the scan frequency for systems and apps?',
    examineOptions: ['Scanner configuration', 'Scan reports', 'Scan schedule'],
    interviewOptions: ['Scanning after new vulnerabilities are announced', 'Scope of application scanning'],
    sprsWeight: 5, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the frequency to scan for vulnerabilities in organizational systems and applications is defined;', status: 'pending' },
        { id: 'b', description: 'vulnerability scans are performed on organizational systems with the defined frequency;', status: 'pending' },
        { id: 'c', description: 'vulnerability scans are performed on applications with the defined frequency;', status: 'pending' },
        { id: 'd', description: 'vulnerability scans are performed on organizational systems when new vulnerabilities are identified; and', status: 'pending' },
        { id: 'e', description: 'vulnerability scans are performed on applications when new vulnerabilities are identified.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['RA-5'] } 
  },

  // --- 3.12 SECURITY ASSESSMENT (CA) ---
  { 
    id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Security Control Assessment', 
    description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.', 
    interviewQuestion: 'How often are controls assessed and are these assessments internal, external, or both?',
    examineOptions: ['Assessment schedule', 'Prior assessment results'],
    interviewOptions: ['Methodology for documenting results', 'Frequency of control effectiveness reviews'],
    sprsWeight: 5, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the frequency of security control assessments is defined; and', status: 'pending' },
        { id: 'b', description: 'security controls are assessed with the defined frequency to determine if the controls are effective in their application.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['CA-2'] } 
  },
  { 
    id: '3.12.2', framework: 'NIST-CMMC', family: 'CA', title: 'Operational Plan of Action', 
    description: 'Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational systems.', 
    interviewQuestion: 'Are deficiencies formally tracked in a POA&M and does each item include owner, risk, and target date?',
    examineOptions: ['POA&M document', 'Evidence of remediation progress'],
    interviewOptions: ['Mitigation steps for open findings', 'Process for updating remediation status'],
    sprsWeight: 5, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'deficiencies and vulnerabilities to be addressed by the plan of action are identified;', status: 'pending' },
        { id: 'b', description: 'a plan of action is developed to correct identified deficiencies and reduce or eliminate identified vulnerabilities; and', status: 'pending' },
        { id: 'c', description: 'the plan of action is implemented to correct identified deficiencies and reduce or eliminate identified vulnerabilities.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['CA-5'] } 
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
    id: 'rmf-1', familyId: 'PH7', title: 'RMF Step 0: The Prepare Step',
    description: 'Master the prerequisites of the Risk Management Framework (NIST 800-37 Rev 2).',
    content: `
# RMF Step 0: PREPARE

The **Prepare** step was added in Revision 2 to institutionalize risk management activities at all levels. It consists of organization-level and system-level tasks.

### Key Organizational Tasks:
1. **P-1 Risk Management Roles**: Identify and assign roles (AO, CIO, ISO, etc.).
2. **P-2 Risk Management Strategy**: Establish risk tolerance and mitigation strategies.
3. **P-3 Risk Assessment**: Conduct organization-wide assessments.

### Key System Tasks:
1. **P-11 Authorization Boundary**: Delineate exactly what is in scope for assessment.
2. **P-14 Risk Assessment (System)**: Identify threats, vulnerabilities, and impacts specific to the system.

### Interview Questions for the Prepare Step:
- **To the AO**: "How is risk tolerance communicated to system owners?"
- **To the System Owner**: "How did you define the boundaries of this system to include all components processing CUI?"
    `,
    durationMinutes: 30, difficulty: 'Intermediate'
  },
  {
    id: 'rmf-2', familyId: 'PH7', title: 'RMF Steps 1-3: Lifecycle Strategy',
    description: 'Deep dive into Categorization, Selection, and Tailoring of controls.',
    content: `
# Steps 1-3: Architecture & Selection

### 1. Categorize (C-Tasks)
Based on [FIPS 199], determine the impact (Low, Moderate, High) of losing confidentiality, integrity, and availability.

### 2. Select (S-Tasks)
Select the control baseline from [NIST 800-53B] and tailor it to meet organization-specific needs.

### 3. Implement (I-Tasks)
Execute the implementation of technical, physical, and administrative controls.

### Assessor Interview Tips:
- Verify that the **Security Categorization** was approved by the **Senior Agency Official for Privacy** if the system handles PII.
- Review the **System Security Plan (SSP)** for alignment with the selected baseline.
    `,
    durationMinutes: 45, difficulty: 'Advanced'
  },
  {
    id: 'cap-1', familyId: 'PH5', title: 'Phase 1: Pre-Assessment Preparation',
    description: 'Master the prerequisites for a C3PAO engagement.',
    content: `# Phase 1 Prep...`,
    durationMinutes: 25, difficulty: 'Intermediate'
  },
  {
    id: 'ttx-1', 
    familyId: 'PH6', 
    title: 'Sim: The 72-Hour Clock',
    description: 'Test your DC3/DIBNet reporting response.',
    isSimulation: true,
    executiveFocus: 'Incident Response',
    injects: [
        { id: 'inj-1', title: 'Discovery', scenario: 'Large exfiltration event detected.', question: 'Who is notified?', regulatoryHint: 'DFARS 252.204-7012' }
    ],
    content: `# Tabletop Exercise...`,
    durationMinutes: 45, difficulty: 'Advanced'
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