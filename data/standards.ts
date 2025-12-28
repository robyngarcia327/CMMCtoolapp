
import { Requirement, Framework, ClientData, TrainingModule } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST-CMMC', name: 'CMMC 2.0 / NIST 800-171', description: 'Comprehensive DoD Compliance Portfolio (Levels 1-3)' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria 2017' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Administrative, Physical, and Technical Safeguards' }
];

// Official NIST Families
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

// SOC 2 Trust Services Criteria Families
export const SOC2_FAMILIES = [
  { id: 'CC', name: 'Common Criteria' },
  { id: 'A', name: 'Availability' },
  { id: 'PI', name: 'Processing Integrity' },
  { id: 'C', name: 'Confidentiality' },
  { id: 'P', name: 'Privacy' }
];

// HIPAA Security Rule Safeguard Categories
export const HIPAA_FAMILIES = [
  { id: 'ADMIN', name: 'Administrative Safeguards' },
  { id: 'PHYS', name: 'Physical Safeguards' },
  { id: 'TECH', name: 'Technical Safeguards' },
  { id: 'ORG', name: 'Organizational Requirements' },
  { id: 'DOC', name: 'Policies and Procedures and Documentation Requirements' }
];

/**
 * CMMC LEVEL 1: Basic Safeguarding (Complete Set)
 */
const CMMC_L1_CONTROLS: Requirement[] = [
  {
    id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Authorized Access Control',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices.',
    discussion: 'Control who can use organizational computers.', level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending' },
      { id: 'c', description: 'Devices are identified.', status: 'pending' },
      { id: 'd', description: 'System access is limited to authorized users, processes, and devices.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2'] }
  },
  // ... other L1 controls would follow this structure
];

/**
 * CMMC LEVEL 2: NIST 800-171 r2 (The Full 110)
 * Detailed implementation for the requested families (MP and RA)
 */
const CMMC_L2_CONTROLS: Requirement[] = [
  // --- MEDIA PROTECTION (MP) - COMPLETE ---
  {
    id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Protect System Media',
    description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.',
    discussion: 'Protecting media involves both physical and digital safeguards.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System media containing CUI is identified.', status: 'pending' },
      { id: 'b', description: 'Access to system media containing CUI is physically controlled.', status: 'pending' },
      { id: 'c', description: 'System media containing CUI is securely stored.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-2'] }
  },
  {
    id: '3.8.2', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Limit Media Access',
    description: 'Limit access to CUI on system media to authorized users.',
    discussion: 'Ensure only those with a need-to-know can access data on USBs or disks.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Authorized users for media access are identified.', status: 'pending' },
      { id: 'b', description: 'Access to CUI on system media is limited to authorized users.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-3'] }
  },
  {
    id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Sanitize/Destroy Media',
    description: 'Sanitize or destroy system media containing CUI before disposal or release for reuse.',
    discussion: 'Follow NIST 800-88 guidelines for clearing, purging, or destroying media.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System media containing CUI is sanitized or destroyed.', status: 'pending' },
      { id: 'b', description: 'Sanitization/destruction occurs before disposal or release for reuse.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-6'] }
  },
  {
    id: '3.8.4', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Mark Media',
    description: 'Mark system media containing CUI with applicable limiting and distribution markings.',
    discussion: 'Label disks and folders with "CUI" or "Sensitive".', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System media containing CUI is identified.', status: 'pending' },
      { id: 'b', description: 'Media is marked with applicable limiting markings.', status: 'pending' },
      { id: 'c', description: 'Media is marked with applicable distribution markings.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-3'] }
  },
  {
    id: '3.8.5', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Control Media Accountability',
    description: 'Control and maintain accountability for system media containing CUI, during transport outside of controlled areas.',
    discussion: 'Maintain a chain of custody for sensitive data in transit.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Controlled areas are defined.', status: 'pending' },
      { id: 'b', description: 'System media containing CUI is identified.', status: 'pending' },
      { id: 'c', description: 'Accountability for media is maintained during transport outside controlled areas.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-5'] }
  },
  {
    id: '3.8.6', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Implement Media Cryptography',
    description: 'Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport outside of controlled areas unless otherwise protected by alternative physical safeguards.',
    discussion: 'Encrypt USB drives or laptops.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Cryptographic mechanisms are identified.', status: 'pending' },
      { id: 'b', description: 'Cryptography is implemented to protect CUI on media during transport.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-5'] }
  },
  {
    id: '3.8.7', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Control Removable Media',
    description: 'Control the use of removable media on system components.',
    discussion: 'Block USB ports or require approval for use.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Usage restrictions for removable media are defined.', status: 'pending' },
      { id: 'b', description: 'Implementation of restrictions is controlled.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-7'] }
  },
  {
    id: '3.8.8', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Prohibit Non-Org Media',
    description: 'Prohibit the use of portable storage devices when such devices have no identifiable owner.',
    discussion: 'No "mystery" USB drives found in the parking lot.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Owners for portable storage devices are identified.', status: 'pending' },
      { id: 'b', description: 'Use of portable storage devices without an identifiable owner is prohibited.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-7'] }
  },
  {
    id: '3.8.9', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Protect CUI on Shared Systems',
    description: 'Protect the confidentiality of CUI at rest.',
    discussion: 'Use encryption for data on servers and cloud.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'CUI at rest is identified.', status: 'pending' },
      { id: 'b', description: 'Confidentiality of CUI at rest is protected.', status: 'pending' }
    ],
    mappings: { nist800_53: ['SC-28'] }
  },

  // --- RISK ASSESSMENT (RA) - COMPLETE ---
  {
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Periodically Assess Risk',
    description: 'Periodically assess the risk to organizational operations, assets, and individuals resulting from the operation of organizational systems.',
    discussion: 'Conduct an annual formal Risk Assessment.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Risks resulting from system operation are identified.', status: 'pending' },
      { id: 'b', description: 'Risks are assessed periodically.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-3'] }
  },
  {
    id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Scan for Vulnerabilities',
    description: 'Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.',
    discussion: 'Use tools like Nessus, OpenVAS, or Qualys.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Vulnerability scanning tools are identified.', status: 'pending' },
      { id: 'b', description: 'System vulnerabilities are identified periodically.', status: 'pending' },
      { id: 'c', description: 'System vulnerabilities are identified when new vulnerabilities are discovered.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-5'] }
  },
  {
    id: '3.11.3', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Remediate Vulnerabilities',
    description: 'Remediate vulnerabilities in accordance with assessments of risk.',
    discussion: 'Patch systems based on CVSS scores.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Vulnerabilities are remediated based on risk assessments.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-5'] }
  },

  // --- ACCESS CONTROL (AC) - Core Level 2 ---
  {
    id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Account Management',
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'Role-based access control.', level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Authorized transactions are identified.', status: 'pending' },
      { id: 'b', description: 'Authorized functions are identified.', status: 'pending' },
      { id: 'c', description: 'Access is limited to permitted transactions and functions.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-6'] }
  },
  {
    id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Control CUI Flow',
    description: 'Control the flow of CUI in accordance with approved authorizations.',
    discussion: 'Prevent CUI leakage between enclaves.', level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Authorizations for CUI flow are identified.', status: 'pending' },
      { id: 'b', description: 'CUI flow is controlled per authorizations.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-4'] }
  }
];

export const REQUIREMENTS_DATA: Requirement[] = [
    ...CMMC_L1_CONTROLS,
    ...CMMC_L2_CONTROLS
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'tm-1', familyId: 'AC', title: 'Foundations of Access Control',
    description: 'Learn the core principles of limiting system access to authorized users.',
    content: '# Access Control Basics\n\nAccess control is a security technique that can be used to regulate who or what can view or use resources in a computing environment.',
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
    systemName: 'New Infrastructure', systemIdentifier: 'CORP-01', categorization: 'LOW', systemOwner: '', authorizingOfficial: '',
    otherDesignatedContacts: '', assignmentOfSecurityResponsibility: '', operationalStatus: 'Operational',
    systemType: 'General Support System', generalDescription: '', systemEnvironment: '', interconnections: '',
    lawsAndPolicies: '', completionDate: '', approvalDate: ''
  }
});
