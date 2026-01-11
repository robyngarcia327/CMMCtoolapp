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

export const SOC2_FAMILIES = [
  { id: 'CC', name: 'Common Criteria / Security' },
  { id: 'A', name: 'Availability' },
  { id: 'PI', name: 'Processing Integrity' },
  { id: 'C', name: 'Confidentiality' },
  { id: 'P', name: 'Privacy' }
];

export const HIPAA_FAMILIES = [
  { id: 'AS', name: 'Administrative Safeguards' },
  { id: 'PS', name: 'Physical Safeguards' },
  { id: 'TS', name: 'Technical Safeguards' },
  { id: 'OR', name: 'Organizational Requirements' },
  { id: 'PD', name: 'Policies and Documentation' }
];

export const ACADEMY_PHASES = [
  { id: 'PH1', name: 'The Foundation', icon: 'BookOpen' },
  { id: 'PH2', name: 'Scoping & Strategy', icon: 'Target' },
  { id: 'PH3', name: 'The 14 Domains (Technical)', icon: 'Shield' },
  { id: 'PH4', name: 'Assessment Process (CAP)', icon: 'ClipboardCheck' },
  { id: 'PH5', name: 'CCP Professional Practice', icon: 'Award' }
];

const createObjs = (ids: string[]) => ids.map(id => ({ id, description: `Verify assessment objective [${id}] for this control requirement.`, status: 'pending' as const }));

const NIST_800_171_CONTROLS: Requirement[] = [
  // 3.1 Access Control (22)
  { 
    id: '3.1.1', 
    framework: 'NIST-CMMC', 
    family: 'AC', 
    title: 'Limit system access to authorized users', 
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', 
    discussion: 'Access control is the process of granting or denying specific requests for obtaining and using information and services.', 
    sprsWeight: 1, 
    cmmcLevel: 1, // Foundational
    objectives: [
        { id: 'a', description: 'authorized users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of authorized users are identified;', status: 'pending' },
        { id: 'c', description: 'devices (and other systems) authorized to connect to the system are identified;', status: 'pending' },
        { id: 'd', description: 'system access is limited to authorized users;', status: 'pending' },
        { id: 'e', description: 'system access is limited to processes acting on behalf of authorized users; and', status: 'pending' },
        { id: 'f', description: 'system access is limited to authorized devices (including other systems).', status: 'pending' }
    ],
    examineOptions: [
        'Access control policy',
        'Procedures addressing account management',
        'System Security Plan (SSP)',
        'System design documentation',
        'List of active system accounts',
        'Notifications of recently terminated employees',
        'List of recently disabled system accounts',
        'Access authorization records'
    ],
    interviewOptions: [
        'Personnel with account management responsibilities',
        'System or network administrators',
        'Personnel with information security responsibilities'
    ],
    testOptions: [
        'Organizational processes for managing system accounts',
        'Mechanisms for implementing account management'
    ],
    mappings: { nist800_53: ['AC-2'] } 
  },
  { 
    id: '3.1.2', 
    framework: 'NIST-CMMC', 
    family: 'AC', 
    title: 'Limit system access to transactions/functions', 
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', 
    discussion: 'Restrict user capabilities based on roles.', 
    sprsWeight: 5, 
    cmmcLevel: 1, // Foundational
    objectives: [
        { id: 'a', description: 'the types of transactions and functions that authorized users are permitted to execute are defined; and', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined types of transactions and functions for authorized users.', status: 'pending' }
    ],
    examineOptions: [
        'Access control policy',
        'Procedures addressing access enforcement',
        'List of approved authorizations',
        'Remote access authorizations',
        'System audit logs and records'
    ],
    interviewOptions: [
        'Personnel with access enforcement responsibilities',
        'System or network administrators',
        'System developers'
    ],
    testOptions: [
        'Mechanisms implementing access control policy'
    ],
    mappings: { nist800_53: ['AC-6'] } 
  },
  { id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control the flow of CUI', description: 'Control the flow of CUI in accordance with approved authorizations.', discussion: 'Regulate information flow.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-4'] } },
  { id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separate duties of individuals', description: 'Separate duties of individuals to reduce the risk of malevolent activity without collusion.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-5'] } },
  { id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', title: 'Employ least privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-6'] } },
  { id: '3.1.6', framework: 'NIST-CMMC', family: 'AC', title: 'Use non-privileged accounts for non-security functions', description: 'Use non-privileged accounts or roles when accessing non-security functions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-6'] } },
  { id: '3.1.7', framework: 'NIST-CMMC', family: 'AC', title: 'Prevent non-privileged users from executing privileged functions', description: 'Prevent non-privileged users from executing privileged functions and audit the execution of such functions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-6'] } },
  { id: '3.1.8', framework: 'NIST-CMMC', family: 'AC', title: 'Limit unsuccessful logon attempts', description: 'Limit unsuccessful logon attempts.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-7'] } },
  { id: '3.1.9', framework: 'NIST-CMMC', family: 'AC', title: 'Provide privacy and security notices', description: 'Provide privacy and security notices consistent with applicable requirements.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-8'] } },
  { id: '3.1.10', framework: 'NIST-CMMC', family: 'AC', title: 'Use session lock with pattern hiding', description: 'Use session lock with PATTERN HIDING to prevent access and viewing of data after a period of inactivity.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-11'] } },
  { id: '3.1.11', framework: 'NIST-CMMC', family: 'AC', title: 'Terminate network sessions', description: 'Terminate network sessions based on specified conditions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-12'] } },
  { id: '3.1.12', framework: 'NIST-CMMC', family: 'AC', title: 'Monitor and control remote access sessions', description: 'Monitor and control remote access sessions.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-17'] } },
  { id: '3.1.13', framework: 'NIST-CMMC', family: 'AC', title: 'Employ cryptographic mechanisms for remote access', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-17(2)'] } },
  { id: '3.1.14', framework: 'NIST-CMMC', family: 'AC', title: 'Route remote access through managed access control points', description: 'Route remote access through managed access control points.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-17(3)'] } },
  { id: '3.1.15', framework: 'NIST-CMMC', family: 'AC', title: 'Authorize remote execution of privileged commands', description: 'Authorize remote execution of privileged commands and remote access to security-relevant information.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-17(4)'] } },
  { id: '3.1.16', framework: 'NIST-CMMC', family: 'AC', title: 'Authorize wireless access', description: 'Authorize wireless access prior to allowing such connections.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-18'] } },
  { id: '3.1.17', framework: 'NIST-CMMC', family: 'AC', title: 'Protect wireless access using authentication/encryption', description: 'Protect wireless access using authentication and encryption.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-18(1)'] } },
  { id: '3.1.18', framework: 'NIST-CMMC', family: 'AC', title: 'Control connection of mobile devices', description: 'Control connection of mobile devices.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-19'] } },
  { id: '3.1.19', framework: 'NIST-CMMC', family: 'AC', title: 'Encrypt CUI on mobile devices', description: 'Encrypt CUI on mobile devices and mobile computing platforms.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-19(5)'] } },
  { id: '3.1.20', framework: 'NIST-CMMC', family: 'AC', title: 'Verify and control use of external systems', description: 'Verify and control use of external systems.', sprsWeight: 3, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-20'] } },
  { id: '3.1.21', framework: 'NIST-CMMC', family: 'AC', title: 'Limit use of organizational portable storage', description: 'Limit use of organizational portable storage devices on external systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-20(2)'] } },
  { id: '3.1.22', framework: 'NIST-CMMC', family: 'AC', title: 'Control CUI posted on publicly accessible systems', description: 'Control CUI posted or processed on publicly accessible systems.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-22'] } },

  // 3.3 Audit and Accountability (9)
  { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'Create and retain audit logs', description: 'Create and retain system audit logs and records to enable monitoring and analysis.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AU-2'] } },
  { id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'Audit individual user actions', description: 'Ensure that the actions of individual system users can be uniquely traced to those users.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['AU-3'] } },

  // 3.5 Identification and Authentication (11)
  { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identify system users/devices', description: 'Identify system users, processes acting on behalf of users, or devices.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-2'] } },
  { id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', title: 'Authenticate identities', description: 'Authenticate (or verify) the identities of users, processes, or devices.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-2'] } },
  { id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Use Multi-Factor Authentication (MFA)', description: 'Use multi-factor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c','d']), mappings: { nist800_53: ['IA-2(1)'] } },

  // 3.11 Risk Assessment (3)
  { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Periodically assess risk', description: 'Periodically assess the risk to organizational operations resulting from the operation of organizational systems.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c','d','e']), mappings: { nist800_53: ['RA-3'] } },

  // 3.14 System and Information Integrity (7)
  { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Identify/remediate system flaws', description: 'Identify, report, and correct system flaws in a timely manner.', sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['SI-2'] } }
];

export const REQUIREMENTS_DATA: Requirement[] = [
  ...NIST_800_171_CONTROLS
];

export const TRAINING_MODULES: TrainingModule[] = [
  // --- PHASE 1: THE FOUNDATION ---
  {
    id: 'fnd-1', familyId: 'PH1', title: 'CMMC v2.0 Architecture',
    description: 'Understand the transition from v1.0 to v2.0 and the 3-tier model.',
    content: `
# Module 1: The CMMC 2.0 Ecosystem

CMMC 2.0 streamlines requirements to align with NIST standards and reduce costs for small businesses.

### The 3-Level Model:
1. **Level 1 (Foundational):** 17 Practices. Focuses on protecting Federal Contract Information (FCI). Requires annual self-assessment.
2. **Level 2 (Advanced):** 110 Practices (Direct alignment with NIST SP 800-171). Focuses on Controlled Unclassified Information (CUI). Requires triennial 3PAO assessments for prioritized contracts.
3. **Level 3 (Expert):** 110+ Practices. Focuses on Advanced Persistent Threats (APTs). Government-led assessments.

### Key Governance Sources:
- **32 CFR Part 170:** The official CMMC program rule.
- **DFARS 252.204-7012:** The primary contract clause for CUI protection.
- **NARA CUI Registry:** The authoritative source for what constitutes CUI.
    `,
    durationMinutes: 20, difficulty: 'Beginner'
  },
  {
    id: 'fnd-2', familyId: 'PH1', title: 'FCI vs. CUI: Data Mastery',
    description: 'Learn to distinguish between the two primary data types handled by defense contractors.',
    content: `
# Module 2: Data Classification

If you cannot identify the data, you cannot secure the scope.

### Federal Contract Information (FCI)
Information provided by or generated for the Government under contract that is not intended for public release. 
*Example: A contract document or delivery schedule.*

### Controlled Unclassified Information (CUI)
Unclassified information that requires safeguarding or dissemination controls pursuant to and consistent with law, regulations, and Government-wide policies.
*Example: Technical drawings, export-controlled data (ITAR), or sensitive financial records.*

**The "Flow-Down" Rule:** Safeguarding requirements apply to subcontractors who receive or generate this data.
    `,
    durationMinutes: 15, difficulty: 'Beginner'
  },

  // --- PHASE 2: SCOPING & STRATEGY ---
  {
    id: 'scp-1', familyId: 'PH2', title: 'Scoping the Assessment Boundary',
    description: 'Master the categorization of CUI Assets, SPA, CRMA, and Out-of-Scope assets.',
    content: `
# Module 3: Scoping Methodology

Scoping is the most critical phase of preparation. An incorrect scope leads to a failed audit.

### Asset Categories:
1. **CUI Assets:** Process, store, or transmit CUI. High scrutiny.
2. **Security Protection Assets (SPA):** Provide security for CUI assets (e.g., Firewalls, SIEM, MFA). Full compliance required.
3. **Contractor Risk Managed Assets (CRMA):** Can reach the CUI environment but don't process CUI. Focus on segmentation.
4. **Specialized Assets:** OT, IoT, Govt property. Documentation required, technical controls may vary.
5. **Out-of-Scope Assets:** Physically or logically separated.

**Assessor Tip:** "Flat networks" (no segmentation) make your entire company "In Scope," dramatically increasing cost.
    `,
    durationMinutes: 45, difficulty: 'Advanced'
  },

  // --- PHASE 3: THE 14 DOMAINS ---
  {
    id: 'dom-1', familyId: 'PH3', title: 'Access Control (AC) Deep-Dive',
    description: 'Deep dive into the 22 practices of the AC family.',
    content: `
# The AC Domain: Access Control

Access control is about the principle of **Least Privilege**.

### Key Practices:
- **3.1.1 (L1):** Limit access to authorized users. *Proof: Active Directory logs, termination checklists.*
- **3.1.3 (L2):** Control flow of CUI. *Proof: Network diagrams showing data paths.*
- **3.1.12 (L2):** Remote access session control. *Proof: VPN configuration and MFA enforcement.*

### Assessor Question:
"Show me how you ensure that a terminated employee cannot access CUI within 24 hours."
    `,
    durationMinutes: 60, difficulty: 'Intermediate'
  },

  // --- PHASE 4: ASSESSMENT PROCESS (CAP) ---
  {
    id: 'cap-1', familyId: 'PH4', title: 'The CMMC Assessment Process (CAP)',
    description: 'Walking through the four phases of a certified assessment.',
    content: `
# The CAP Guide

The official methodology used by CCA (Certified CMMC Assessors).

1. **Phase 1: Preparation.** OSC shares the SSP. Assessor reviews for readiness.
2. **Phase 2: Execution.** The "on-site" phase. Methods: Examine, Interview, Test.
3. **Phase 3: Reporting.** Final findings and scores sent to the C3PAO.
4. **Phase 4: Closeout.** Addressing any qualifying POA&M items within 180 days.

**Rule of Three:** For every control, an assessor ideally looks for two pieces of evidence from different methods (e.g., a policy [Examine] and a demo [Test]).
    `,
    durationMinutes: 35, difficulty: 'Advanced'
  },

  // --- PHASE 5: CCP PROFESSIONAL PRACTICE ---
  {
    id: 'ccp-1', familyId: 'PH5', title: 'Ethics & Professional Conduct',
    description: 'The mandatory Code of Professional Conduct (CoPC) for ecosystem members.',
    content: `
# Module 6: The CoPC

As a CCP (Certified CMMC Professional), you are bound by the Cyber-AB ethics code.

### Core Values:
- **Objectivity:** You must report what is true, not what the client wants to hear.
- **Confidentiality:** OSC data is highly sensitive.
- **Conflict of Interest:** You cannot audit a network you designed (Consult-to-Audit gap).
- **Integrity:** Evidence must never be forged or misrepresented.

Violation of the CoPC can result in permanent decertification.
    `,
    durationMinutes: 30, difficulty: 'Intermediate'
  }
];

export const createInitialClientData = (isParent: boolean): ClientData => ({
  targetCmmcLevel: 2, // Default to Advanced
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