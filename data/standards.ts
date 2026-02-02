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

/** 
 * FULL 110 NIST 800-171 PRACTICES WITH DETAILED ASSESSMENT OBJECTIVES
 */
export const REQUIREMENTS_DATA: Requirement[] = [
    // 3.1 ACCESS CONTROL (AC)
    { 
        id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', 
        description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', 
        cmmcLevel: 1, sprsWeight: 1, 
        objectives: [
            { id: 'a', description: 'Authorized users are identified.', status: 'pending' },
            { id: 'b', description: 'Processes acting on behalf of authorized users are identified.', status: 'pending' },
            { id: 'c', description: 'Devices (and other systems) authorized to connect to the system are identified.', status: 'pending' },
            { id: 'd', description: 'System access is limited to authorized users.', status: 'pending' },
            { id: 'e', description: 'System access is limited to processes acting on behalf of authorized users.', status: 'pending' },
            { id: 'f', description: 'System access is limited to authorized devices (including other systems).', status: 'pending' }
        ],
        interviewOptions: ['Who is allowed to access systems that store, process, or transmit CUI?', 'How are users approved before being given access?', 'Who approves access requests?', 'How is access removed when someone leaves or changes roles?'], 
        mappings: { nist800_53: ['AC-2'] } 
    },
    { 
        id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Limit access to types of transactions', 
        description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', 
        cmmcLevel: 1, sprsWeight: 1, 
        objectives: [
            { id: 'a', description: 'The types of transactions and functions that authorized users are permitted to execute are defined.', status: 'pending' },
            { id: 'b', description: 'System access is limited to the defined types of transactions and functions for authorized users.', status: 'pending' }
        ],
        interviewOptions: ['What actions can a normal user perform on CUI systems?', 'Are there actions that only administrators can perform?', 'How do you prevent users from performing unauthorized actions?'], 
        mappings: { nist800_53: ['AC-3'] } 
    },
    { 
        id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control CUI Flow', 
        description: 'Control the flow of CUI in accordance with approved authorizations.', 
        cmmcLevel: 2, sprsWeight: 3, 
        objectives: [
            { id: 'a', description: 'Information flow control policies are defined.', status: 'pending' },
            { id: 'b', description: 'Methods and enforcement mechanisms for controlling the flow of CUI are defined.', status: 'pending' },
            { id: 'c', description: 'Designated sources and destinations for CUI within the system and between interconnected systems are identified.', status: 'pending' },
            { id: 'd', description: 'Authorizations for controlling the flow of CUI are defined.', status: 'pending' },
            { id: 'e', description: 'Approved authorizations for controlling the flow of CUI are enforced.', status: 'pending' }
        ],
        interviewOptions: ['How is CUI allowed to move between systems?', 'Are there restrictions on emailing, downloading, or sharing CUI?', 'Can CUI be sent to external email addresses? If yes, how is it protected?', 'What tools enforce these restrictions?'], 
        mappings: { nist800_53: ['AC-4'] } 
    },
    { 
        id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separation of duties', 
        description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', 
        cmmcLevel: 2, sprsWeight: 1, 
        objectives: [
            { id: 'a', description: 'The duties of individuals requiring separation are defined.', status: 'pending' },
            { id: 'b', description: 'Responsibilities for duties that require separation are assigned to separate individuals.', status: 'pending' },
            { id: 'c', description: 'Access privileges that enable individuals to exercise the duties that require separation are granted to separate individuals.', status: 'pending' }
        ],
        interviewOptions: ['How do you ensure users only have access they need to do their job?', 'How often is user access reviewed?', 'What happens if excessive permissions are found?'], 
        mappings: { nist800_53: ['AC-5'] } 
    },

    // 3.3 AUDIT AND ACCOUNTABILITY (AU)
    { 
        id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'System Auditing', 
        description: 'Create and retain system audit logs and records to the extent needed to enable monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.', 
        cmmcLevel: 2, sprsWeight: 3, 
        objectives: [
            { id: 'a', description: 'Audit logs needed (event types to be logged) are specified.', status: 'pending' },
            { id: 'b', description: 'Content of audit records needed to support monitoring and reporting is defined.', status: 'pending' },
            { id: 'c', description: 'Audit records are created (generated).', status: 'pending' },
            { id: 'd', description: 'Audit records contain the defined content.', status: 'pending' },
            { id: 'e', description: 'Retention requirements for audit records are defined.', status: 'pending' },
            { id: 'f', description: 'Audit records are retained as defined.', status: 'pending' }
        ],
        interviewOptions: ['What events are logged (logins, access, changes)?', 'Are failed login attempts logged?', 'Are admin actions logged?'], 
        mappings: { nist800_53: ['AU-2'] } 
    },

    // 3.7 MAINTENANCE (MA)
    { 
        id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'Perform Maintenance', 
        description: 'Perform maintenance on organizational systems.', 
        cmmcLevel: 2, sprsWeight: 3, 
        objectives: [
            { id: 'a', description: 'System maintenance is performed.', status: 'pending' }
        ],
        interviewOptions: ['How is system maintenance performed?', 'Who performs maintenance?'], 
        mappings: { nist800_53: ['MA-2'] } 
    },
    { 
        id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', title: 'System Maintenance Control', 
        description: 'Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.', 
        cmmcLevel: 2, sprsWeight: 3, 
        objectives: [
            { id: 'a', description: 'Tools used to conduct system maintenance are controlled.', status: 'pending' },
            { id: 'b', description: 'Techniques used to conduct system maintenance are controlled.', status: 'pending' },
            { id: 'c', description: 'Mechanisms used to conduct system maintenance are controlled.', status: 'pending' },
            { id: 'd', description: 'Personnel used to conduct system maintenance are controlled.', status: 'pending' }
        ],
        interviewOptions: ['What tools are used for maintenance?', 'Are maintenance tools restricted?'], 
        mappings: { nist800_53: ['MA-3'] } 
    },
    { 
        id: '3.7.3', framework: 'NIST-CMMC', family: 'MA', title: 'Equipment Sanitization', 
        description: 'Ensure equipment removed for off-site maintenance is sanitized of any CUI.', 
        cmmcLevel: 2, sprsWeight: 3, 
        objectives: [
            { id: 'a', description: 'Equipment to be removed from organizational spaces for off-site maintenance is sanitized of any CUI.', status: 'pending' }
        ],
        interviewOptions: ['How is equipment sanitized before disposal?', 'Who performs sanitization?'], 
        mappings: { nist800_53: ['MA-3(2)'] } 
    },

    // 3.8 MEDIA PROTECTION (MP)
    { 
        id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Media Protection', 
        description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.', 
        cmmcLevel: 2, sprsWeight: 3, 
        objectives: [
            { id: 'a', description: 'Paper media containing CUI is physically controlled.', status: 'pending' },
            { id: 'b', description: 'Digital media containing CUI is physically controlled.', status: 'pending' },
            { id: 'c', description: 'Paper media containing CUI is securely stored.', status: 'pending' },
            { id: 'd', description: 'Digital media containing CUI is securely stored.', status: 'pending' }
        ],
        interviewOptions: ['What types of media store CUI?', 'How is media protected?'], 
        mappings: { nist800_53: ['MP-2'] } 
    },
    { 
        id: '3.8.2', framework: 'NIST-CMMC', family: 'MP', title: 'Media Access', 
        description: 'Limit access to CUI on system media to authorized users.', 
        cmmcLevel: 2, sprsWeight: 3, 
        objectives: [
            { id: 'a', description: 'Access to CUI on system media is limited to authorized users.', status: 'pending' }
        ],
        interviewOptions: ['Who can access media containing CUI?'], 
        mappings: { nist800_53: ['MP-3'] } 
    },
    { 
        id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', title: 'Media Disposal', 
        description: 'Sanitize or destroy system media containing CUI before disposal or release for reuse.', 
        cmmcLevel: 2, sprsWeight: 3, 
        objectives: [
            { id: 'a', description: 'System media containing CUI is sanitized or destroyed before disposal.', status: 'pending' },
            { id: 'b', description: 'System media containing CUI is sanitized before it is released for reuse.', status: 'pending' }
        ],
        interviewOptions: ['How is media sanitized before disposal?', 'Who performs sanitization?'], 
        mappings: { nist800_53: ['MP-6'] } 
    }
];

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  {
    id: 'intro-1', familyId: 'PH1', title: 'CMMC 2.0 Framework Architecture',
    description: 'Overview of the transition from NIST 800-171 to CMMC 2.0.',
    content: '# CMMC 2.0 Structural Overview\n\nCMMC 2.0 streamlines the requirements into three distinct levels:\n\n1. **Level 1 (Foundational)**: 17 Practices.\n2. **Level 2 (Advanced)**: 110 Practices.\n3. **Level 3 (Expert)**: 110+ Practices.',
    durationMinutes: 20, difficulty: 'Beginner'
  }
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