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

// Helper to generate objectives
const genObjs = (id: string, count: number) => 
    Array.from({ length: count }, (_, i) => ({ 
        id: String.fromCharCode(97 + i), 
        description: `Requirement objective ${id}[${String.fromCharCode(97 + i)}] is satisfied.`, 
        status: 'pending' as const 
    }));

/** 
 * FULL 110 NIST 800-171 PRACTICES WITH INTERVIEW INTEGRATION
 */
export const REQUIREMENTS_DATA: Requirement[] = [
    // 3.1 ACCESS CONTROL (AC)
    { id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', cmmcLevel: 1, sprsWeight: 1, objectives: genObjs('3.1.1', 2), interviewOptions: ['Who is allowed to access systems that store, process, or transmit CUI?', 'How are users approved before being given access?', 'Who approves access requests?', 'How is access removed when someone leaves or changes roles?'], mappings: { nist800_53: ['AC-2'] } },
    { id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Limit access to types of transactions', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', cmmcLevel: 1, sprsWeight: 1, objectives: genObjs('3.1.2', 2), interviewOptions: ['What actions can a normal user perform on CUI systems?', 'Are there actions that only administrators can perform?', 'How do you prevent users from performing unauthorized actions?'], mappings: { nist800_53: ['AC-3'] } },
    { id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control CUI Flow', description: 'Control the flow of CUI in accordance with approved authorizations.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.3', 2), interviewOptions: ['How is CUI allowed to move between systems?', 'Are there restrictions on emailing, downloading, or sharing CUI?', 'Can CUI be sent to external email addresses? If yes, how is it protected?', 'What tools enforce these restrictions?'], mappings: { nist800_53: ['AC-4'] } },
    { id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separate duties', description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.4', 2), interviewOptions: ['How do you ensure users only have access they need to do their job?', 'How often is user access reviewed?', 'What happens if excessive permissions are found?'], mappings: { nist800_53: ['AC-5'] } },
    { id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', title: 'Least privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.5', 4), interviewOptions: ['Who has administrative access to systems that handle CUI?', 'How are admin accounts different from normal user accounts?', 'Is MFA required for administrators?', 'Are shared admin accounts used? If yes, why?'], mappings: { nist800_53: ['AC-6'] } },
    { id: '3.1.6', framework: 'NIST-CMMC', family: 'AC', title: 'Non-privileged accounts', description: 'Use non-privileged accounts or roles when accessing non-security functions.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.6', 2), interviewOptions: ['Are users prevented from installing software?', 'Can users modify system configurations?', 'How are restrictions enforced?'], mappings: { nist800_53: ['AC-6(2)'] } },
    { id: '3.1.12', framework: 'NIST-CMMC', family: 'AC', title: 'Control remote access', description: 'Monitor and control remote access sessions.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.12', 5), interviewOptions: ['How do users remotely access systems containing CUI?', 'What security controls are required for remote access?', 'Is remote access logged and monitored?'], mappings: { nist800_53: ['AC-17'] } },
    { id: '3.1.16', framework: 'NIST-CMMC', family: 'AC', title: 'Wireless access', description: 'Authorize wireless access prior to allowing such connections.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.16', 2), interviewOptions: ['Is wireless networking used?', 'Can wireless devices access CUI?', 'How is wireless access secured?'], mappings: { nist800_53: ['AC-18'] } },
    { id: '3.1.20', framework: 'NIST-CMMC', family: 'AC', title: 'External system connections', description: 'Verify and control/limit connections to and use of external systems.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.20', 2), interviewOptions: ['Are external systems allowed to connect to your environment?', 'How are external connections approved and documented?', 'How are external connections monitored?'], mappings: { nist800_53: ['AC-20'] } },
    
    // 3.3 AUDIT AND ACCOUNTABILITY (AU)
    { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'Audit logs', description: 'Create and retain system audit logs and records to enable monitoring.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.3.1', 2), interviewOptions: ['What events are logged (logins, access, changes)?', 'Are failed login attempts logged?', 'Are admin actions logged?'], mappings: { nist800_53: ['AU-2'] } },
    { id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'Audit content', description: 'Ensure that the actions of individual system users can be uniquely traced.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.3.2', 2), interviewOptions: ['Do logs record User, Time, System, and Action taken?'], mappings: { nist800_53: ['AU-3'] } },
    { id: '3.3.3', framework: 'NIST-CMMC', family: 'AU', title: 'Audit review', description: 'Review and update logged events.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.3.3', 2), interviewOptions: ['Who reviews audit logs?', 'How often are logs reviewed?', 'What happens if suspicious activity is found?'], mappings: { nist800_53: ['AU-6'] } },

    // 3.4 CONFIGURATION MANAGEMENT (CM)
    { id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'Baseline configuration', description: 'Establish and maintain baseline configurations and inventories of systems.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.4.1', 2), interviewOptions: ['Do you have documented baseline configurations?', 'How are new systems configured?', 'Who approves configuration changes?'], mappings: { nist800_53: ['CM-2'] } },
    { id: '3.4.2', framework: 'NIST-CMMC', family: 'CM', title: 'Change control', description: 'Establish and enforce security configuration settings.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.4.2', 2), interviewOptions: ['How are system changes requested?', 'How are changes approved?', 'Are emergency changes documented?'], mappings: { nist800_53: ['CM-3'] } },

    // 3.5 IDENTIFICATION AND AUTHENTICATION (IA)
    { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identify system users', description: 'Identify system users, processes acting on behalf of users, or devices.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.5.1', 2), interviewOptions: ['How are users uniquely identified?', 'Are shared user accounts allowed?', 'How are service accounts documented?'], mappings: { nist800_53: ['IA-2'] } },
    { id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', title: 'Authenticate users', description: 'Authenticate identities of those users, processes, or devices.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.5.2', 2), interviewOptions: ['What authentication methods are used (password, MFA, smart card)?', 'Is MFA required for all users accessing CUI?', 'Are there any MFA exceptions?'], mappings: { nist800_53: ['IA-2'] } },
    { id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Password policy', description: 'Use multi-factor authentication for local and network access to privileged accounts.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.5.3', 2), interviewOptions: ['What are your password complexity requirements?', 'How often are passwords changed?', 'Are password reuse restrictions enforced?'], mappings: { nist800_53: ['IA-5(1)'] } },

    // 3.6 INCIDENT RESPONSE (IR)
    { id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', title: 'Incident handling', description: 'Establish an operational incident-handling capability.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.6.1', 2), interviewOptions: ['How do you define a security incident?', 'How are incidents reported?', 'Who responds to incidents?'], mappings: { nist800_53: ['IR-4'] } },
    { id: '3.6.2', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Response Plan', description: 'Track, document, and report incidents.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.6.2', 2), interviewOptions: ['Do you have a documented IR plan?', 'When was it last tested?', 'How are lessons learned captured?'], mappings: { nist800_53: ['IR-5'] } },

    // 3.7 MAINTENANCE (MA)
    { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'System maintenance', description: 'Perform maintenance on organizational systems.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.7.1', 2), interviewOptions: ['How is system maintenance performed?', 'Who performs maintenance?'], mappings: { nist800_53: ['MA-2'] } },

    // 3.8 MEDIA PROTECTION (MP)
    { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Protect media', description: 'Protect system media containing CUI.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.8.1', 2), interviewOptions: ['What types of media store CUI?', 'How is media protected?'], mappings: { nist800_53: ['MP-2'] } },

    // 3.10 PHYSICAL PROTECTION (PE)
    { id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Physical access', description: 'Limit physical access to systems and equipment.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.10.1', 2), interviewOptions: ['Who can physically access systems storing CUI?', 'How is access controlled?'], mappings: { nist800_53: ['PE-2'] } },

    // 3.11 RISK ASSESSMENT (RA)
    { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Risk assessment', description: 'Periodically assess risk.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.11.1', 2), interviewOptions: ['When was your last risk assessment?', 'What risks were identified?', 'How are risks tracked?'], mappings: { nist800_53: ['RA-3'] } },

    // 3.12 SECURITY ASSESSMENT (CA)
    { id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'System Security Plan', description: 'Develop and periodically update system security plans.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.12.1', 2), interviewOptions: ['Do you have a System Security Plan?', 'Does it reflect your current environment?'], mappings: { nist800_53: ['PL-2'] } },
    { id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', title: 'POA&M', description: 'Develop and implement plans of action.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.12.4', 2), interviewOptions: ['How do you track security gaps?', 'Who owns remediation?'], mappings: { nist800_53: ['CA-5'] } },

    // 3.13 SYSTEM AND COMMUNICATIONS PROTECTION (SC)
    { id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Boundary protection', description: 'Monitor, control, and protect communications.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.13.1', 2), interviewOptions: ['How is your network perimeter protected?', 'What firewall(s) are used?'], mappings: { nist800_53: ['SC-7'] } },
    { id: '3.13.8', framework: 'NIST-CMMC', family: 'SC', title: 'Data in transit', description: 'Implement cryptographic mechanisms.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.13.8', 2), interviewOptions: ['Is CUI encrypted in transit?', 'What encryption methods are used?'], mappings: { nist800_53: ['SC-8'] } },

    // 3.14 SYSTEM AND INFORMATION INTEGRITY (SI)
    { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Identify flaws', description: 'Identify, report, and correct system flaws.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.14.1', 2), interviewOptions: ['How are vulnerabilities identified?', 'How quickly are patches applied?'], mappings: { nist800_53: ['SI-2'] } },
    { id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', title: 'Malware protection', description: 'Provide protection from malicious code.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.14.2', 3), interviewOptions: ['What malware protection is in place?', 'How are alerts handled?'], mappings: { nist800_53: ['SI-3'] } }
];

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  {
    id: 'intro-1', familyId: 'PH1', title: 'CMMC 2.0 Framework Architecture',
    description: 'Overview of the transition from NIST 800-171 to CMMC 2.0.',
    content: '# CMMC 2.0 Structural Overview\n\nCMMC 2.0 streamlines the requirements into three distinct levels:\n\n1. **Level 1 (Foundational)**: 17 Practices.\n2. **Level 2 (Advanced)**: 110 Practices.\n3. **Level 3 (Expert)**: 110+ Practices.',
    durationMinutes: 20, difficulty: 'Beginner'
  },
  {
    id: 'tech-ac-1', familyId: 'PH3', title: 'Domain Deep Dive: Access Control (AC)',
    description: 'Implementing least privilege and transaction-level monitoring for CUI.',
    content: '# Access Control (AC) Domain\n\nAccess Control is the largest domain in NIST 800-171. It focuses on ensuring only the right people have access to the right data.',
    durationMinutes: 45, difficulty: 'Advanced'
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

// Added missing RMF_TASKS for RMF Lifecycle component
export const RMF_TASKS = [
  { id: 'P-1', step: 'P', name: 'Risk Management Role Assignment', description: 'Assign key risk management roles.', role: 'Organization Lead' },
  { id: 'P-2', step: 'P', name: 'Risk Management Strategy', description: 'Establish organization-wide risk management strategy.', role: 'Risk Executive' },
  { id: 'C-1', step: 'C', name: 'System Description', description: 'Describe the system boundary and functions.', role: 'System Owner' },
  { id: 'C-2', step: 'C', name: 'Security Categorization', description: 'Categorize system and information.', role: 'System Owner' },
  { id: 'S-1', step: 'S', name: 'Control Selection', description: 'Select and tailor controls from NIST 800-53.', role: 'Security Architect' },
  { id: 'S-2', step: 'S', name: 'SSP Development', description: 'Develop the System Security Plan.', role: 'System Owner' },
  { id: 'I-1', step: 'I', name: 'Control Implementation', description: 'Implement controls and document details.', role: 'System Owner' },
  { id: 'A-1', step: 'A', name: 'Assessment Plan', description: 'Develop the Security Assessment Plan.', role: 'Assessor' },
  { id: 'A-2', step: 'A', name: 'Control Assessment', description: 'Assess control effectiveness.', role: 'Assessor' },
  { id: 'R-1', step: 'R', name: 'SAR Development', description: 'Prepare the Security Assessment Report.', role: 'Assessor' },
  { id: 'R-2', step: 'R', name: 'Risk Authorization', description: 'Authorize system operation.', role: 'Authorizing Official' },
  { id: 'M-1', step: 'M', name: 'System and Environment Changes', description: 'Monitor changes to system and environment.', role: 'System Owner' },
  { id: 'M-2', step: 'M', name: 'Ongoing Assessments', description: 'Perform periodic control assessments.', role: 'Assessor' }
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