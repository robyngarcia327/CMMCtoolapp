
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

const AC_CONTROLS: Requirement[] = [
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
  {
    id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Transaction/Function Control',
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'Enforce principle of least privilege.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Permitted transactions are identified.', status: 'pending' }, { id: 'b', description: 'Access is limited.', status: 'pending' }],
    mappings: { nist800_53: ['AC-6'] }
  }
];

const AT_CONTROLS: Requirement[] = [
  {
    id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Security Awareness Training',
    description: 'Ensure that managers, systems administrators, and users are made aware of security risks.',
    discussion: 'Basic security training for all users.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Security risks are identified.', status: 'pending' }, { id: 'b', description: 'Personnel are trained.', status: 'pending' }],
    mappings: { nist800_53: ['AT-2'] }
  },
  {
    id: '3.2.2', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Role-Based Training',
    description: 'Ensure personnel are trained to carry out security-related duties.',
    discussion: 'Technical training for IT/Security staff.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Security duties are identified.', status: 'pending' }],
    mappings: { nist800_53: ['AT-3'] }
  }
];

const AU_CONTROLS: Requirement[] = [
  {
    id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Create Audit Records',
    description: 'Create and retain system audit logs and records.',
    discussion: 'Enable logging on all systems.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Audit records are created.', status: 'pending' }],
    mappings: { nist800_53: ['AU-2'] }
  },
  {
    id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Ensure Accountability',
    description: 'Ensure that the actions of individual system users can be uniquely traced.',
    discussion: 'No shared accounts for admin tasks.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'User actions are uniquely traceable.', status: 'pending' }],
    mappings: { nist800_53: ['AU-3'] }
  }
];

const CM_CONTROLS: Requirement[] = [
  {
    id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Baseline Configurations',
    description: 'Establish and maintain baseline configurations and inventories.',
    discussion: 'Document your standard server and workstation configs.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Baseline configs are established.', status: 'pending' }],
    mappings: { nist800_53: ['CM-2'] }
  },
  {
    id: '3.4.2', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Change Management',
    description: 'Track, review, approve, and log changes to organizational systems.',
    discussion: 'Formal change control process.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'System changes are tracked.', status: 'pending' }],
    mappings: { nist800_53: ['CM-3'] }
  }
];

const IA_CONTROLS: Requirement[] = [
  {
    id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Identification',
    description: 'Identify system users, processes acting on behalf of users, or devices.',
    discussion: 'Unique usernames for everyone.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'System users are identified.', status: 'pending' }],
    mappings: { nist800_53: ['IA-2'] }
  },
  {
    id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Authentication',
    description: 'Authenticate the identities of users, processes, or devices.',
    discussion: 'Passwords, tokens, or biometrics.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Identities are authenticated.', status: 'pending' }],
    mappings: { nist800_53: ['IA-2'] }
  },
  {
    id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Multi-Factor Authentication',
    description: 'Use MFA for local and network access to privileged and non-privileged accounts.',
    discussion: 'Duo, Azure MFA, etc.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'MFA is used for privileged access.', status: 'pending' }, { id: 'b', description: 'MFA is used for non-privileged network access.', status: 'pending' }],
    mappings: { nist800_53: ['IA-2'] }
  }
];

const IR_CONTROLS: Requirement[] = [
  {
    id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', cmmcLevel: 2, title: 'Incident Handling Capability',
    description: 'Establish an operational incident-handling capability.',
    discussion: 'IR team and tools must be ready.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Incident handling capability is established.', status: 'pending' }],
    mappings: { nist800_53: ['IR-4'] }
  },
  {
    id: '3.6.2', framework: 'NIST-CMMC', family: 'IR', cmmcLevel: 2, title: 'Incident Reporting',
    description: 'Track, document, and report incidents to designated authorities.',
    discussion: 'Report to DoD within 72 hours.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Incidents are tracked.', status: 'pending' }],
    mappings: { nist800_53: ['IR-6'] }
  }
];

const MA_CONTROLS: Requirement[] = [
  {
    id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Perform System Maintenance',
    description: 'Perform periodic and timely maintenance on organizational systems.',
    discussion: 'Regular hardware/software maintenance.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Periodic maintenance is scheduled.', status: 'pending' }, { id: 'b', description: 'Timely maintenance is performed.', status: 'pending' }],
    mappings: { nist800_53: ['MA-2'] }
  },
  {
    id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Maintenance Controls',
    description: 'Provide controls on the tools and personnel used to conduct system maintenance.',
    discussion: 'Approve maintenance tools.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Maintenance tools are controlled.', status: 'pending' }],
    mappings: { nist800_53: ['MA-3'] }
  },
  {
    id: '3.7.5', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Nonlocal Maintenance',
    description: 'Require MFA to establish nonlocal maintenance sessions.',
    discussion: 'Remote support must use MFA.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Nonlocal maintenance sessions require MFA.', status: 'pending' }],
    mappings: { nist800_53: ['MA-4'] }
  }
];

const MP_CONTROLS: Requirement[] = [
  {
    id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Protect System Media',
    description: 'Protect system media containing CUI, both paper and digital.',
    discussion: 'Locks and encryption for disks/folders.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'System media is protected.', status: 'pending' }],
    mappings: { nist800_53: ['MP-2'] }
  },
  {
    id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Sanitize/Destroy Media',
    description: 'Sanitize or destroy system media containing CUI before disposal.',
    discussion: 'Shred paper and wipe drives.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Media is sanitized before disposal.', status: 'pending' }],
    mappings: { nist800_53: ['MP-6'] }
  }
];

const PS_CONTROLS: Requirement[] = [
  {
    id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Screen Individuals',
    description: 'Screen individuals prior to authorizing access to systems containing CUI.',
    discussion: 'Background checks for CUI users.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Personnel screening is defined.', status: 'pending' }, { id: 'b', description: 'Individuals are screened.', status: 'pending' }],
    mappings: { nist800_53: ['PS-3'] }
  },
  {
    id: '3.9.2', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Terminate Access',
    description: 'Ensure systems are protected during and after personnel actions (terminations).',
    discussion: 'Disable accounts immediately.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Access is disabled upon termination.', status: 'pending' }],
    mappings: { nist800_53: ['PS-4'] }
  }
];

const PE_CONTROLS: Requirement[] = [
  {
    id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Limit Physical Access',
    description: 'Limit physical access to systems and equipment to authorized individuals.',
    discussion: 'Badges, locks, and logs.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Physical access is limited.', status: 'pending' }],
    mappings: { nist800_53: ['PE-2'] }
  },
  {
    id: '3.10.2', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Escort Visitors',
    description: 'Protect and monitor the physical facility.',
    discussion: 'Visitors must be escorted.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Facility is protected.', status: 'pending' }],
    mappings: { nist800_53: ['PE-3'] }
  }
];

const RA_CONTROLS: Requirement[] = [
  {
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Risk Assessments',
    description: 'Periodically assess the risk to organizational operations.',
    discussion: 'Formal annual risk assessment.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Risks are identified.', status: 'pending' }, { id: 'b', description: 'Risks are assessed.', status: 'pending' }],
    mappings: { nist800_53: ['RA-3'] }
  },
  {
    id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Vulnerability Scanning',
    description: 'Scan for vulnerabilities in systems and applications.',
    discussion: 'Nessus, Qualys, etc.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Vulnerability scans are performed.', status: 'pending' }],
    mappings: { nist800_53: ['RA-5'] }
  }
];

const CA_CONTROLS: Requirement[] = [
  {
    id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'Security Control Assessment',
    description: 'Periodically assess the security controls in systems.',
    discussion: 'Self-assessment or audit.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Controls are assessed.', status: 'pending' }],
    mappings: { nist800_53: ['CA-2'] }
  },
  {
    id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'System Security Plan',
    description: 'Develop and maintain a system security plan (SSP).',
    discussion: 'This app helps generate this.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'SSP is developed.', status: 'pending' }],
    mappings: { nist800_53: ['PL-2'] }
  }
];

const SC_CONTROLS: Requirement[] = [
  {
    id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Boundary Protection',
    description: 'Monitor, control, and protect organizational communications.',
    discussion: 'Firewalls and gateways.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Communication boundaries are protected.', status: 'pending' }],
    mappings: { nist800_53: ['SC-7'] }
  },
  {
    id: '3.13.11', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'FIPS Cryptography',
    description: 'Employ FIPS-validated cryptography when used to protect CUI.',
    discussion: 'AES-256 (FIPS-140-2).', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'FIPS-validated crypto is used.', status: 'pending' }],
    mappings: { nist800_53: ['SC-13'] }
  }
];

const SI_CONTROLS: Requirement[] = [
  {
    id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Flaw Remediation',
    description: 'Identify, report, and correct system flaws in a timely manner.',
    discussion: 'Patch management.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'System flaws are identified.', status: 'pending' }],
    mappings: { nist800_53: ['SI-2'] }
  },
  {
    id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Malicious Code Protection',
    description: 'Provide protection from malicious code at appropriate locations.',
    discussion: 'Antivirus / EDR.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Malicious code protection is provided.', status: 'pending' }],
    mappings: { nist800_53: ['SI-3'] }
  },
  {
    id: '3.14.3', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Security Alerts',
    description: 'Monitor system security alerts and advisories.',
    discussion: 'Monitor CISA alerts.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Security alerts are monitored.', status: 'pending' }],
    mappings: { nist800_53: ['SI-5'] }
  }
];

export const REQUIREMENTS_DATA: Requirement[] = [
  ...AC_CONTROLS,
  ...AT_CONTROLS,
  ...AU_CONTROLS,
  ...CM_CONTROLS,
  ...IA_CONTROLS,
  ...IR_CONTROLS,
  ...MA_CONTROLS,
  ...MP_CONTROLS,
  ...PS_CONTROLS,
  ...PE_CONTROLS,
  ...RA_CONTROLS,
  ...CA_CONTROLS,
  ...SC_CONTROLS,
  ...SI_CONTROLS
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
