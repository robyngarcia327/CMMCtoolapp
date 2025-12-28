
import { Requirement, Framework, ClientData, TrainingModule } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST-CMMC', name: 'CMMC 2.0 / NIST 800-171', description: 'Comprehensive DoD Compliance Portfolio (Levels 1-3)' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria 2017' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Administrative, Physical, and Technical Safeguards' }
];

// NIST CMMC Families for categorization and filtering
export const NIST_CMMC_FAMILIES = [
  { id: 'AC', name: 'Access Control' },
  { id: 'AU', name: 'Audit and Accountability' },
  { id: 'AT', name: 'Awareness and Training' },
  { id: 'CM', name: 'Configuration Management' },
  { id: 'CP', name: 'Contingency Planning' },
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

// SOC2 Families based on Trust Services Criteria
export const SOC2_FAMILIES = [
  { id: 'CC', name: 'Common Criteria' },
  { id: 'A', name: 'Availability' },
  { id: 'P', name: 'Privacy' },
  { id: 'PI', name: 'Processing Integrity' },
  { id: 'C', name: 'Confidentiality' }
];

// HIPAA Security Rule Safeguards
export const HIPAA_FAMILIES = [
  { id: 'ADMIN', name: 'Administrative Safeguards' },
  { id: 'PHYS', name: 'Physical Safeguards' },
  { id: 'TECH', name: 'Technical Safeguards' },
  { id: 'ORG', name: 'Organizational Requirements' },
  { id: 'POL', name: 'Policies and Procedures' }
];

/**
 * CMMC LEVEL 1: Basic Safeguarding (15 Requirements Complete)
 * Source: 48 CFR 52.204-21 / CMMC 2.0 Level 1
 */
const CMMC_L1_CONTROLS: Requirement[] = [
  {
    id: 'AC.L1-3.1.1', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Authorized Access Control',
    description: 'Limit information system access to authorized users, processes acting on behalf of authorized users, or devices.',
    discussion: 'Control who can use organizational computers and what they can do.', level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending' },
      { id: 'c', description: 'Devices are identified.', status: 'pending' },
      { id: 'd', description: 'System access is limited to authorized users, processes, and devices.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2'] }
  },
  {
    id: 'AC.L1-3.1.2', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Transaction Control',
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'Ensure users only perform actions required for their role.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'System access is limited to permitted transactions.', status: 'pending' }],
    mappings: { nist800_53: ['AC-6'] }
  },
  {
    id: 'AC.L1-3.1.20', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'External Connections',
    description: 'Verify and control/limit connections to and use of external systems.',
    discussion: 'Limit use of external systems like public cloud storage.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'External connections are verified and controlled.', status: 'pending' }],
    mappings: { nist800_53: ['AC-20'] }
  },
  {
    id: 'AC.L1-3.1.22', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Public Information',
    description: 'Control information posted or processed on publicly accessible systems.',
    discussion: 'Prevent sensitive info from being published on public websites.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Posting of non-public info is prevented.', status: 'pending' }],
    mappings: { nist800_53: ['AC-22'] }
  },
  {
    id: 'IA.L1-3.5.1', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Identification',
    description: 'Identify system users, processes acting on behalf of users, or devices.',
    discussion: 'Unique identifiers (e.g., user names) for everyone.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Users, processes, and devices are identified.', status: 'pending' }],
    mappings: { nist800_53: ['IA-2'] }
  },
  {
    id: 'IA.L1-3.5.2', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Authentication',
    description: 'Authenticate (or verify) the identities of those users, processes, or devices.',
    discussion: 'Passwords, PINs, or biometrics must be used.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Identities are verified before allowing access.', status: 'pending' }],
    mappings: { nist800_53: ['IA-2'] }
  },
  {
    id: 'MP.L1-3.8.3', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 1, title: 'Media Sanitization',
    description: 'Sanitize or destroy system media containing Federal Contract Information before disposal.',
    discussion: 'Wipe hard drives or shred papers before throwing them away.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'System media are sanitized or destroyed.', status: 'pending' }],
    mappings: { nist800_53: ['MP-6'] }
  },
  {
    id: 'PE.L1-3.10.1', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Physical Access',
    description: 'Limit physical access to organizational information systems, equipment, and respective environments.',
    discussion: 'Keep server rooms and offices locked.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Physical access is limited to authorized individuals.', status: 'pending' }],
    mappings: { nist800_53: ['PE-2'] }
  },
  {
    id: 'PE.L1-3.10.3', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Escort Visitors',
    description: 'Escort visitors and monitor visitor activity.',
    discussion: 'Visitors should be supervised in secure areas.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Visitors are escorted and monitored.', status: 'pending' }],
    mappings: { nist800_53: ['PE-3'] }
  },
  {
    id: 'PE.L1-3.10.4', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Visitor Logs',
    description: 'Maintain audit logs of physical access.',
    discussion: 'Sign-in sheets for visitors.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Audit logs of physical access are maintained.', status: 'pending' }],
    mappings: { nist800_53: ['PE-3'] }
  },
  {
    id: 'PE.L1-3.10.5', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Access Devices',
    description: 'Control and manage physical access devices.',
    discussion: 'Keys, badges, and fobs must be tracked.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Physical access devices are controlled and managed.', status: 'pending' }],
    mappings: { nist800_53: ['PE-3'] }
  },
  {
    id: 'SC.L1-3.13.1', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 1, title: 'Boundary Protection',
    description: 'Monitor, control, and protect organizational communications at external boundaries.',
    discussion: 'Firewalls and routers must protect the perimeter.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Communications at external boundaries are monitored.', status: 'pending' }],
    mappings: { nist800_53: ['SC-7'] }
  },
  {
    id: 'SC.L1-3.13.5', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 1, title: 'Public Subnetworks',
    description: 'Implement subnetworks for publicly accessible system components physically separated from internal networks.',
    discussion: 'Separate public-facing systems (e.g., web servers) from internal networks.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Subnetworks for public components are implemented.', status: 'pending' }],
    mappings: { nist800_53: ['SC-7'] }
  },
  {
    id: 'SI.L1-3.14.1', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Flaw Remediation',
    description: 'Identify, report, and correct system flaws in a timely manner.',
    discussion: 'Install software updates and security patches.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'System flaws are identified and corrected.', status: 'pending' }],
    mappings: { nist800_53: ['SI-2'] }
  },
  {
    id: 'SI.L1-3.14.2', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Malicious Code',
    description: 'Provide protection from malicious code at appropriate locations within organizational systems.',
    discussion: 'Anti-virus and anti-malware software.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Malicious code protection is provided.', status: 'pending' }],
    mappings: { nist800_53: ['SI-3'] }
  }
];

// Combine all framework requirements into a master list
export const REQUIREMENTS_DATA: Requirement[] = [
  ...CMMC_L1_CONTROLS,
  {
    id: 'AC.L2-3.1.3', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Separate Duties',
    description: 'Control the flow of information in accordance with approved authorizations.',
    discussion: 'Ensure duties are separated to prevent fraud.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Duties are separated.', status: 'pending' }],
    mappings: { nist800_53: ['AC-5'] }
  },
  {
    id: 'IA.L2-3.5.3', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Multi-Factor Authentication',
    description: 'Use multi-factor authentication for local and network access to privileged accounts.',
    discussion: 'MFA is required for admins.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'MFA is used for privileged accounts.', status: 'pending' }],
    mappings: { nist800_53: ['IA-2'] }
  }
];

// Master list of training modules
export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'tm-1', familyId: 'AC', title: 'Foundations of Access Control',
    description: 'Learn the core principles of limiting system access to authorized users.',
    content: '# Access Control Basics\n\nAccess control is a security technique that can be used to regulate who or what can view or use resources in a computing environment.',
    durationMinutes: 15, difficulty: 'Beginner'
  },
  {
    id: 'tm-2', familyId: 'IA', title: 'MFA Implementation Guide',
    description: 'Technical deep dive into implementing Multi-Factor Authentication.',
    content: '# MFA Implementation\n\nMulti-factor authentication (MFA) is a security system that requires more than one method of authentication from independent categories of credentials to verify the user\'s identity.',
    durationMinutes: 20, difficulty: 'Intermediate'
  }
];

/**
 * Creates an initial ClientData object with default settings and full requirement library.
 */
export const createInitialClientData = (isParent: boolean): ClientData => ({
  requirements: [...REQUIREMENTS_DATA],
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
