
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

// Combine all framework requirements into a master list
const MA_CONTROLS: Requirement[] = [
  {
    id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Perform System Maintenance',
    description: 'Perform periodic and timely maintenance on organizational systems.',
    discussion: 'Maintenance involves scheduling regular checks on hardware and software.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Periodic system maintenance is scheduled.', status: 'pending' },
      { id: 'b', description: 'Timely system maintenance is performed.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MA-2'] }
  },
  {
    id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Control Maintenance Tools',
    description: 'Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.',
    discussion: 'Ensure that only authorized tools and people touch the system.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Maintenance tools are identified.', status: 'pending' },
      { id: 'b', description: 'Maintenance techniques and mechanisms are identified.', status: 'pending' },
      { id: 'c', description: 'Maintenance personnel are authorized.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MA-3'] }
  },
  {
    id: '3.7.3', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Sanitize Off-Site Equipment',
    description: 'Ensure equipment removed for off-site maintenance is sanitized of any CUI.',
    discussion: 'Laptops or servers going for repair must be wiped of sensitive data.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Equipment for off-site maintenance is identified.', status: 'pending' },
      { id: 'b', description: 'Equipment is sanitized of CUI before removal.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MA-4'] }
  },
  {
    id: '3.7.4', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Check Media for Malware',
    description: 'Check media containing diagnostic and test programs for malicious code before the media are used in organizational systems.',
    discussion: 'Scan vendor USBs or disks for viruses.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Maintenance media is identified.', status: 'pending' },
      { id: 'b', description: 'Media is checked for malicious code before use.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MA-3'] }
  },
  {
    id: '3.7.5', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Secure Nonlocal Maintenance',
    description: 'Require multifactor authentication to establish nonlocal maintenance sessions via external networks and terminate such sessions when nonlocal maintenance is complete.',
    discussion: 'Remote support must use MFA and be closed when finished.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Nonlocal maintenance sessions are identified.', status: 'pending' },
      { id: 'b', description: 'MFA is required for nonlocal maintenance via external networks.', status: 'pending' },
      { id: 'c', description: 'Sessions are terminated upon completion.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MA-4'] }
  },
  {
    id: '3.7.6', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Supervise Maintenance Personnel',
    description: 'Supervise the maintenance activities of personnel without required access authorizations.',
    discussion: 'Escort non-cleared repair technicians.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Maintenance personnel without required access authorizations are identified.', status: 'pending' },
      { id: 'b', description: 'Maintenance activities of such personnel are supervised.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MA-5'] }
  }
];

const MP_CONTROLS: Requirement[] = [
  {
    id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Protect System Media',
    description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.',
    discussion: 'Physical security for disks, drives, and printouts.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System media containing CUI is identified.', status: 'pending' },
      { id: 'b', description: 'System media is physically controlled.', status: 'pending' },
      { id: 'c', description: 'System media is securely stored.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-2'] }
  },
  {
    id: '3.8.2', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Limit Media Access',
    description: 'Limit access to CUI on system media to authorized users.',
    discussion: 'Only people who need it can see files on portable media.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Authorized users for media access are identified.', status: 'pending' },
      { id: 'b', description: 'Access is limited to those authorized users.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-3'] }
  },
  {
    id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Sanitize/Destroy Media',
    description: 'Sanitize or destroy system media containing CUI before disposal or release for reuse.',
    discussion: 'Shred paper and wipe drives properly.', level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Media is sanitized or destroyed before disposal.', status: 'pending' },
      { id: 'b', description: 'Media is sanitized or destroyed before reuse.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-6'] }
  },
  {
    id: '3.8.4', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Mark Media',
    description: 'Mark system media containing CUI with applicable limiting and distribution markings.',
    discussion: 'Label folders and disks with "CUI".', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Media is marked with limiting markings.', status: 'pending' },
      { id: 'b', description: 'Media is marked with distribution markings.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-3'] }
  },
  {
    id: '3.8.5', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Control Media Accountability',
    description: 'Control and maintain accountability for system media containing CUI during transport outside of controlled areas.',
    discussion: 'Track USBs or laptops while they are offsite.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Accountability is maintained during transport.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-5'] }
  },
  {
    id: '3.8.6', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Implement Media Cryptography',
    description: 'Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport outside of controlled areas unless otherwise protected by alternative physical safeguards.',
    discussion: 'Encrypt laptops and USB drives.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Cryptography is implemented for transport.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-5'] }
  },
  {
    id: '3.8.7', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Control Removable Media',
    description: 'Control the use of removable media on system components.',
    discussion: 'Use software to block unapproved USB drives.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Usage of removable media is controlled.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-7'] }
  },
  {
    id: '3.8.8', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Prohibit Non-Org Media',
    description: 'Prohibit the use of portable storage devices when such devices have no identifiable owner.',
    discussion: 'Do not plug in random USBs found in the parking lot.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Owners for portable storage are identified.', status: 'pending' },
      { id: 'b', description: 'Unowned devices are prohibited.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-7'] }
  },
  {
    id: '3.8.9', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Protect CUI on Shared Systems',
    description: 'Protect the confidentiality of CUI at rest.',
    discussion: 'Use encryption for data on servers and cloud storage.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Confidentiality of CUI at rest is protected.', status: 'pending' }
    ],
    mappings: { nist800_53: ['SC-28'] }
  }
];

const RA_CONTROLS: Requirement[] = [
  {
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Periodically Assess Risk',
    description: 'Periodically assess the risk to organizational operations, assets, and individuals resulting from the operation of organizational systems.',
    discussion: 'Conduct an annual formal Risk Assessment.', level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Risks resulting from system operation are identified.', status: 'pending' },
      { id: 'b', description: 'Risks are assessed periodically.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-3'] }
  },
  {
    id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Scan for Vulnerabilities',
    description: 'Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.',
    discussion: 'Use tools like Nessus or OpenVAS to scan systems.', level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Vulnerability scans are performed periodically.', status: 'pending' },
      { id: 'b', description: 'Vulnerability scans are performed when new vulnerabilities are identified.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-5'] }
  },
  {
    id: '3.11.3', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Remediate Vulnerabilities',
    description: 'Remediate vulnerabilities in accordance with assessments of risk.',
    discussion: 'Apply patches based on risk severity.', level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Vulnerabilities are remediated based on risk assessments.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-5'] }
  }
];

export const REQUIREMENTS_DATA: Requirement[] = [
  ...MA_CONTROLS,
  ...MP_CONTROLS,
  ...RA_CONTROLS,
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
  }
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
