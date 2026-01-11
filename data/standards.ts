
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

// Fix: Add missing SOC2_FAMILIES constant used in RequirementsList.tsx
export const SOC2_FAMILIES = [
  { id: 'CC', name: 'Common Criteria' },
  { id: 'A', name: 'Availability' },
  { id: 'C', name: 'Confidentiality' },
  { id: 'PI', name: 'Processing Integrity' },
  { id: 'P', name: 'Privacy' }
];

// Fix: Add missing HIPAA_FAMILIES constant used in RequirementsList.tsx
export const HIPAA_FAMILIES = [
  { id: 'ADMIN', name: 'Administrative Safeguards' },
  { id: 'PHYS', name: 'Physical Safeguards' },
  { id: 'TECH', name: 'Technical Safeguards' }
];

export const ACADEMY_PHASES = [
  { id: 'PH1', name: 'The Foundation', icon: 'BookOpen' },
  { id: 'PH2', name: 'Scoping & Strategy', icon: 'Target' },
  { id: 'PH3', name: 'The 14 Domains (Technical)', icon: 'Shield' },
  { id: 'PH4', name: 'Documentation & Narrative', icon: 'FileText' },
  { id: 'PH5', name: 'Assessment Readiness (CAP)', icon: 'Award' },
  { id: 'PH6', name: 'Tabletop Simulations (TTX)', icon: 'Dices' }
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
    `,
    durationMinutes: 20, difficulty: 'Beginner'
  },

  // --- PHASE 6: TABLETOP SIMULATIONS (TTX) ---
  {
    id: 'ttx-1', familyId: 'PH6', title: 'Sim: The 72-Hour Clock (Breach Reporting)',
    description: 'Leadership Exercise: A ransomware attack is detected on a CUI server. Test your DC3 reporting speed.',
    content: `
# Simulation: Federal Breach Reporting

**Objective:** Successfully report a CUI breach to the DoD within the mandated timeframe.

### SITUATION INJECT:
At 02:00 AM on a Saturday, your lead sysadmin receives a notification that the "Project Blue-Beam" file server (which processes ITAR-controlled technical drawings) has been encrypted. A ransom note is present.

### DECISION POINTS:
1. **Reporting Threshold:** Does this incident require notification via the DIBNet portal? (Ref: DFARS 252.204-7012).
2. **The Timer:** You have exactly 72 hours from the *moment of discovery* to file the medium-to-high impact report.
3. **Information Requirements:** Do you have your Medium Assurance Certificate ready to log into the reporting portal?

**Executive Challenge:** Balancing the need for "perfect information" with the legal mandate for "rapid reporting."
    `,
    durationMinutes: 45, difficulty: 'Advanced'
  },
  {
    id: 'ttx-2', familyId: 'PH6', title: 'Sim: Insider Threat & CUI Handling',
    description: 'Leadership Exercise: Managing an executive who accidentally BCC’d their personal email with sensitive technical data.',
    content: `
# Simulation: Unauthorized Disclosure

**Objective:** Handle an accidental disclosure by a Key Management Personnel (KMP) without compromising the CMMC assessment boundary.

### SITUATION INJECT:
Your VP of Sales, working from home on a personal laptop, accidentally BCC'd their Gmail account with a Technical Proposal containing CUI/CDI. The file is now residing in Google's cloud infrastructure, which is *Out of Scope* and not FedRAMP Moderate authorized.

### DECISION POINTS:
1. **Cleanup:** How do you verify the destruction of the data on a personal, unmanaged device?
2. **CMMC Impact:** Does this "spill" require a full re-scoping of the VP's home office?
3. **Disciplinary Governance:** How does your Personnel Security (PS) policy handle "accidental" vs "malicious" intent for CMMC purposes?

**Leadership Takeaway:** Technical controls (DLP) are the primary defense, but Leadership "Culture of Security" is the secondary fail-safe.
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
