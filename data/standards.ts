
import { Requirement, Framework, ClientData, TrainingModule } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST-CMMC', name: 'CMMC 2.0 / NIST 800-171', description: 'Comprehensive DoD Compliance Portfolio (Levels 1-3)' },
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
  { id: 'CC', name: 'Common Criteria' },
  { id: 'A', name: 'Availability' },
  { id: 'C', name: 'Confidentiality' },
  { id: 'PI', name: 'Processing Integrity' },
  { id: 'P', name: 'Privacy' }
];

export const HIPAA_FAMILIES = [
  { id: 'ADMIN', name: 'Administrative Safeguards' },
  { id: 'PHYS', name: 'Physical Safeguards' },
  { id: 'TECH', name: 'Technical Safeguards' }
];

// --- NIST 800-171 FULL OBJECTIVE DATASET ---

const AC_CONTROLS: Requirement[] = [
  {
    id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Authorized Access Control',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).',
    discussion: 'Access control is the process of granting or denying specific requests for obtaining and using information and services.',
    level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending' },
      { id: 'b', description: 'Processes acting on behalf of authorized users are identified.', status: 'pending' },
      { id: 'c', description: 'Devices (including other systems) authorized to access the system are identified.', status: 'pending' },
      { id: 'd', description: 'System access is limited to authorized users.', status: 'pending' },
      { id: 'e', description: 'System access is limited to processes acting on behalf of authorized users.', status: 'pending' },
      { id: 'f', description: 'System access is limited to authorized devices.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2'] }
  },
  {
    id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Transaction/Function Control',
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'Determine which users can perform specific operations (e.g., read, write, delete).',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Types of transactions authorized users are permitted to execute are identified.', status: 'pending' },
      { id: 'b', description: 'Types of functions authorized users are permitted to execute are identified.', status: 'pending' },
      { id: 'c', description: 'System access is limited to the defined transactions and functions.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-6'] }
  },
  {
    id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Control CUI Flow',
    description: 'Control the flow of CUI in accordance with approved authorizations.',
    discussion: 'Information flow control regulates where CUI can travel within a system and between systems.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Authorizations for controlling the flow of CUI are defined.', status: 'pending' },
      { id: 'b', description: 'The flow of CUI is controlled in accordance with approved authorizations.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-4'] }
  },
  {
    id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Least Privilege',
    description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.',
    discussion: 'Limit access rights for users to only those strictly required to do their jobs.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Privileged accounts are identified.', status: 'pending' },
      { id: 'b', description: 'Security functions are identified.', status: 'pending' },
      { id: 'c', description: 'Least privilege is employed for privileged accounts.', status: 'pending' },
      { id: 'd', description: 'Least privilege is employed for security functions.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-6'] }
  },
  {
    id: '3.1.18', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Mobile Device Control',
    description: 'Control connection of mobile devices.',
    discussion: 'Manage and restrict the connection of mobile devices to internal networks.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Usage restrictions for mobile devices are established.', status: 'pending' },
      { id: 'b', description: 'Implementation requirements for mobile devices are established.', status: 'pending' },
      { id: 'c', description: 'Connection of mobile devices is controlled.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-19'] }
  }
];

const AU_CONTROLS: Requirement[] = [
  {
    id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Create Audit Records',
    description: 'Create and retain system audit logs and records to enable investigation of unauthorized activity.',
    discussion: 'Audit records provide chronological evidence of system activities.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Audit records needed for monitoring and investigation are identified.', status: 'pending' },
      { id: 'b', description: 'Audit records are created.', status: 'pending' },
      { id: 'c', description: 'Audit records are retained.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AU-2'] }
  },
  {
    id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Ensure Accountability',
    description: 'Ensure that the actions of individual system users can be uniquely traced to those users.',
    discussion: 'Accountability requires identifying users and logging their specific actions.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System users are uniquely identified.', status: 'pending' },
      { id: 'b', description: 'Actions of users are uniquely traced to those users.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AU-3'] }
  }
];

const IA_CONTROLS: Requirement[] = [
  {
    id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Multi-Factor Authentication',
    description: 'Use multi-factor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.',
    discussion: 'MFA provides higher assurance than single-factor authentication (e.g., passwords).',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'MFA is used for local access to privileged accounts.', status: 'pending' },
      { id: 'b', description: 'MFA is used for network access to privileged accounts.', status: 'pending' },
      { id: 'c', description: 'MFA is used for network access to non-privileged accounts.', status: 'pending' }
    ],
    mappings: { nist800_53: ['IA-2'] }
  }
];

const SC_CONTROLS: Requirement[] = [
  {
    id: '3.13.11', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'FIPS Cryptography',
    description: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.',
    discussion: 'Ensures that cryptographic modules meet federal standards for data protection.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'FIPS-validated cryptography is identified for use to protect CUI.', status: 'pending' },
      { id: 'b', description: 'FIPS-validated cryptography is employed to protect CUI.', status: 'pending' }
    ],
    mappings: { nist800_53: ['SC-13'] }
  }
];

const SI_CONTROLS: Requirement[] = [
  {
    id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Flaw Remediation',
    description: 'Identify, report, and correct system flaws in a timely manner.',
    discussion: 'Maintain system integrity by applying security patches and updates.',
    level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'System flaws are identified.', status: 'pending' },
      { id: 'b', description: 'System flaws are reported.', status: 'pending' },
      { id: 'c', description: 'System flaws are corrected in a timely manner.', status: 'pending' }
    ],
    mappings: { nist800_53: ['SI-2'] }
  }
];

// --- SOC 2 DATASET ---

const SOC2_CONTROLS: Requirement[] = [
  {
    id: 'CC6.1', framework: 'SOC2', family: 'CC', title: 'Logical Access Security',
    description: 'The entity implements logical access security software, infrastructure, and architectures over objects to protect them from unauthorized access.',
    discussion: 'Focuses on user registration, authentication, and authorization.',
    level: 'Common Criteria',
    objectives: [
      { id: '1', description: 'Access is restricted based on job responsibilities.', status: 'pending' },
      { id: '2', description: 'Unauthorized access attempts are identified and investigated.', status: 'pending' },
      { id: '3', description: 'Credentials are managed for lifecycle (onboarding/offboarding).', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2', 'IA-2'] }
  },
  {
    id: 'A1.2', framework: 'SOC2', family: 'A', title: 'Environmental Protection',
    description: 'The entity maintains environmental protections against natural disasters and power failures.',
    discussion: 'Covers physical data centers, cooling, and power backup.',
    level: 'Availability',
    objectives: [
      { id: '1', description: 'UPS and generators are tested periodically.', status: 'pending' },
      { id: '2', description: 'Fire detection and suppression is in place.', status: 'pending' }
    ],
    mappings: { nist800_53: ['PE-11', 'PE-13'] }
  }
];

// --- HIPAA DATASET ---

const HIPAA_CONTROLS: Requirement[] = [
  {
    id: '164.308(a)(1)', framework: 'HIPAA', family: 'ADMIN', title: 'Security Management Process',
    description: 'Implement policies and procedures to prevent, detect, contain, and correct security violations.',
    discussion: 'Requires risk analysis and risk management.',
    level: 'Administrative',
    objectives: [
      { id: 'a', description: 'Risk Analysis: Conduct accurate and thorough assessment.', status: 'pending' },
      { id: 'b', description: 'Risk Management: Implement security measures to reduce risks.', status: 'pending' },
      { id: 'c', description: 'Sanction Policy: Apply appropriate sanctions against workforce.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-3', 'PS-8'] }
  },
  {
    id: '164.312(a)(1)', framework: 'HIPAA', family: 'TECH', title: 'Technical Access Control',
    description: 'Allow access only to those persons or software programs that have been granted access rights.',
    discussion: 'Covers unique user IDs and emergency access.',
    level: 'Technical',
    objectives: [
      { id: 'a', description: 'Unique User Identification assigned.', status: 'pending' },
      { id: 'b', description: 'Emergency Access Procedure established.', status: 'pending' },
      { id: 'c', description: 'Automatic Logoff enabled.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2', 'AC-11'] }
  }
];

export const REQUIREMENTS_DATA: Requirement[] = [
  ...AC_CONTROLS,
  ...AU_CONTROLS,
  ...IA_CONTROLS,
  ...SC_CONTROLS,
  ...SI_CONTROLS,
  ...SOC2_CONTROLS,
  ...HIPAA_CONTROLS
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'tm-1', familyId: 'AC', title: 'Foundations of Access Control',
    description: 'Learn the core principles of limiting system access to authorized users.',
    content: '# Access Control Basics\n\nAccess control is a security technique used to regulate who can view or use resources.',
    durationMinutes: 15, difficulty: 'Beginner'
  }
];

export const createInitialClientData = (isParent: boolean): ClientData => ({
  requirements: JSON.parse(JSON.stringify(REQUIREMENTS_DATA)),
  risks: [],
  assets: [],
  vendors: [],
  users: [],
  artifacts: [],
  tickets: [],
  tasks: [],
  budgetItems: [],
  cwConfig: { companyId: '', publicKey: '', privateKey: '', siteUrl: '', serviceBoard: '', enabled: false },
  jiraConfig: { baseUrl: '', email: '', apiToken: '', projectKey: '', issueType: 'Task', enabled: false },
  confluenceConfig: { baseUrl: '', email: '', apiToken: '', spaceKey: '', enabled: false },
  auvikConfig: { apiKey: '', tenantId: '', region: 'US', enabled: false },
  m365Config: { enabled: false },
  awsConfig: { enabled: false },
  googleConfig: { enabled: false },
  siemConfig: { enabled: false },
  wizardProgress: { currentStep: 'INTRO', currentQuestionIndex: 0 },
  sspMetadata: {
    systemName: '', systemIdentifier: '', categorization: 'LOW', systemOwner: '', authorizingOfficial: '',
    otherDesignatedContacts: '', assignmentOfSecurityResponsibility: '', operationalStatus: 'Operational',
    systemType: 'General Support System', generalDescription: '', systemEnvironment: '', interconnections: '',
    lawsAndPolicies: '', completionDate: '', approvalDate: ''
  }
});
