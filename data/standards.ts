
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
  { id: 'PI', name: 'Processing Integrity' },
  { id: 'C', name: 'Confidentiality' },
  { id: 'P', name: 'Privacy' }
];

export const HIPAA_FAMILIES = [
  { id: 'ADMIN', name: 'Administrative Safeguards' },
  { id: 'PHYS', name: 'Physical Safeguards' },
  { id: 'TECH', name: 'Technical Safeguards' },
  { id: 'ORG', name: 'Organizational Requirements' },
  { id: 'DOC', name: 'Documentation' }
];

// --- NIST 800-171 CONTROLS ---
const NIST_CONTROLS: Requirement[] = [
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
      { id: 'f', description: 'System access is limited to authorized devices (including other systems).', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2'] }
  },
  {
    id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Multi-Factor Authentication',
    description: 'Use multi-factor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.',
    discussion: 'MFA provides significantly more security than passwords alone.',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'MFA is used for local access to privileged accounts.', status: 'pending' },
      { id: 'b', description: 'MFA is used for network access to privileged accounts.', status: 'pending' },
      { id: 'c', description: 'MFA is used for network access to non-privileged accounts.', status: 'pending' }
    ],
    mappings: { nist800_53: ['IA-2'] }
  },
  {
      id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'System Security Plan',
      description: 'Develop and maintain a system security plan (SSP) that describes system boundaries, system environments of operation, the strategy for the management of security requirements, and the connections to other systems.',
      discussion: 'The primary document for an audit.',
      level: 'Level 2', sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'System boundaries are described in the SSP.', status: 'pending' },
        { id: 'b', description: 'Operational environment is described in the SSP.', status: 'pending' },
        { id: 'c', description: 'Management strategy for security requirements is described.', status: 'pending' },
        { id: 'd', description: 'System connections are described.', status: 'pending' },
        { id: 'e', description: 'The SSP is developed and maintained.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PL-2'] }
    }
];

// --- SOC 2 TYPE II CONTROLS ---
const SOC2_CONTROLS: Requirement[] = [
  {
    id: 'CC1.1', framework: 'SOC2', family: 'CC', title: 'Commitment to Integrity and Ethics',
    description: 'The entity demonstrates a commitment to integrity and ethical values.',
    discussion: 'Points of focus: Setting the tone at the top, establishing standards of conduct, and evaluating adherence.',
    level: 'Common Criteria',
    objectives: [
      { id: '1', description: 'Board of directors and management sets the tone at the top.', status: 'pending' },
      { id: '2', description: 'Standards of conduct are established.', status: 'pending' },
      { id: '3', description: 'Adherence to standards of conduct is evaluated.', status: 'pending' }
    ],
    mappings: { nist_csf: ['ID.GV-1'] }
  },
  {
    id: 'CC6.1', framework: 'SOC2', family: 'CC', title: 'Logical Access Security',
    description: 'The entity implements logical access security software, infrastructure, and architectures over objects to protect them from unauthorized access.',
    discussion: 'Points of focus: Managing credentials, protecting data at rest, and securing endpoints.',
    level: 'Common Criteria',
    objectives: [
      { id: '1', description: 'Registration and termination of users are managed.', status: 'pending' },
      { id: '2', description: 'Access is authorized and modified based on job responsibilities.', status: 'pending' },
      { id: '3', description: 'Credentials are authenticated (e.g., via passwords or MFA).', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2', 'IA-2'] }
  },
  {
    id: 'A1.2', framework: 'SOC2', family: 'A', title: 'Availability Monitoring and Evaluation',
    description: 'The entity monitors and evaluates the availability of its system components.',
    discussion: 'Focus on capacity management and environmental protections.',
    level: 'Availability',
    objectives: [
      { id: '1', description: 'System capacity is monitored and adjusted to meet requirements.', status: 'pending' },
      { id: '2', description: 'Environmental protections (power, cooling) are in place and tested.', status: 'pending' }
    ],
    mappings: { nist_csf: ['PR.DS-4'] }
  }
];

// --- HIPAA SECURITY RULE CONTROLS ---
const HIPAA_CONTROLS: Requirement[] = [
  {
    id: '164.308(a)(1)(i)', framework: 'HIPAA', family: 'ADMIN', title: 'Security Management Process',
    description: 'Implement policies and procedures to prevent, detect, contain, and correct security violations.',
    discussion: 'Standard for Administrative Safeguards involving risk analysis and management.',
    level: 'Required',
    objectives: [
      { id: 'a', description: 'Risk Analysis: Conduct accurate assessment of potential risks to ePHI.', status: 'pending' },
      { id: 'b', description: 'Risk Management: Implement security measures to reduce risk to a reasonable level.', status: 'pending' },
      { id: 'c', description: 'Sanction Policy: Apply appropriate sanctions against workforce members who fail to comply.', status: 'pending' },
      { id: 'd', description: 'Information System Activity Review: Implement procedures to regularly review records of system activity.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-3', 'SI-4'] }
  },
  {
    id: '164.312(a)(1)', framework: 'HIPAA', family: 'TECH', title: 'Access Control',
    description: 'Implement technical policies and procedures for electronic information systems that maintain ePHI to allow access only to those persons or software programs that have been granted access rights.',
    discussion: 'Standard for Technical Safeguards.',
    level: 'Required',
    objectives: [
      { id: 'a', description: 'Unique User Identification: Assign a unique name/number for tracking user identity.', status: 'pending' },
      { id: 'b', description: 'Emergency Access Procedure: Establish procedures for obtaining ePHI during an emergency.', status: 'pending' },
      { id: 'c', description: 'Automatic Logoff: Implement procedures that terminate an electronic session after a period of inactivity.', status: 'pending' },
      { id: 'd', description: 'Encryption/Decryption: Implement a mechanism to encrypt and decrypt ePHI.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2', 'SC-28'] }
  },
  {
    id: '164.310(a)(1)', framework: 'HIPAA', family: 'PHYS', title: 'Facility Access Controls',
    description: 'Implement policies and procedures to limit physical access to its electronic information systems and the facility or facilities in which they are housed.',
    discussion: 'Standard for Physical Safeguards.',
    level: 'Required',
    objectives: [
      { id: 'a', description: 'Contingency Operations: Establish procedures for physical access in case of an emergency.', status: 'pending' },
      { id: 'b', description: 'Facility Security Plan: Implement policies to safeguard the facility from unauthorized physical access.', status: 'pending' },
      { id: 'c', description: 'Access Control and Validation Procedures: Implement procedures to control and validate a person\'s access to facilities.', status: 'pending' },
      { id: 'd', description: 'Maintenance Records: Implement policies to document modifications to physical components of a facility.', status: 'pending' }
    ],
    mappings: { nist800_53: ['PE-2', 'PE-3'] }
  }
];

export const REQUIREMENTS_DATA: Requirement[] = [
  ...NIST_CONTROLS,
  ...SOC2_CONTROLS,
  ...HIPAA_CONTROLS
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'tm-1', familyId: 'AC', title: 'Foundations of Access Control',
    description: 'Learn the core principles of limiting system access to authorized users.',
    content: '# Access Control Basics\n\nAccess control is a security technique used to regulate who can view or use resources.',
    durationMinutes: 15, difficulty: 'Beginner'
  },
  {
    id: 'tm-soc2-1', familyId: 'CC', title: 'SOC 2 Core Principles',
    description: 'Introduction to Trust Services Criteria and the Common Criteria.',
    content: '# SOC 2 Trust Services Criteria\n\nSOC 2 is based on five Trust Services Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy.',
    durationMinutes: 20, difficulty: 'Beginner'
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
