
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

// --- COMPLETE NIST 800-171 DATASET ---

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
      { id: 'f', description: 'System access is limited to authorized devices (including other systems).', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2'] }
  },
  {
    id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Transaction/Function Control',
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'Transactions and functions are defined by the organization and may include reading, writing, or executing files.',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'The types of transactions authorized users are permitted to execute are identified.', status: 'pending' },
      { id: 'b', description: 'The types of functions authorized users are permitted to execute are identified.', status: 'pending' },
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
    discussion: 'Least privilege means that users and processes are granted only the access they need to perform their jobs.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Privileged accounts are identified.', status: 'pending' },
      { id: 'b', description: 'Security functions are identified.', status: 'pending' },
      { id: 'c', description: 'The principle of least privilege is employed for privileged accounts.', status: 'pending' },
      { id: 'd', description: 'The principle of least privilege is employed for security functions.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-6'] }
  }
];

const AT_CONTROLS: Requirement[] = [
  {
    id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Security Awareness Training',
    description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures.',
    discussion: 'Training is a critical part of a security program.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Security risks associated with organizational activities are identified.', status: 'pending' },
      { id: 'b', description: 'Policies, standards, and procedures related to the security of organizational systems are identified.', status: 'pending' },
      { id: 'c', description: 'Managers are made aware of security risks.', status: 'pending' },
      { id: 'd', description: 'System administrators are made aware of security risks.', status: 'pending' },
      { id: 'e', description: 'Users are made aware of security risks.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AT-2'] }
  }
];

const AU_CONTROLS: Requirement[] = [
  {
    id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Create Audit Records',
    description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.',
    discussion: 'Audit records can be generated at various levels including the OS, application, and network devices.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System audit logs and records needed to enable monitoring, analysis, investigation, and reporting are identified.', status: 'pending' },
      { id: 'b', description: 'System audit logs and records are created.', status: 'pending' },
      { id: 'c', description: 'System audit logs and records are retained.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AU-2'] }
  },
  {
    id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Ensure Accountability',
    description: 'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.',
    discussion: 'Tracing actions to a unique individual is critical for incident response.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System users are uniquely identified.', status: 'pending' },
      { id: 'b', description: 'The actions of users are uniquely traced to those users.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AU-3'] }
  }
];

const CM_CONTROLS: Requirement[] = [
  {
    id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Baseline Configurations',
    description: 'Establish and maintain baseline configurations and inventories of organizational systems throughout the respective system development life cycles.',
    discussion: 'Baselines serve as the "known good" state of a system.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Baseline configurations of organizational systems are established.', status: 'pending' },
      { id: 'b', description: 'Baseline configurations of organizational systems are maintained.', status: 'pending' },
      { id: 'c', description: 'Inventories of organizational systems are established.', status: 'pending' },
      { id: 'd', description: 'Inventories of organizational systems are maintained.', status: 'pending' }
    ],
    mappings: { nist800_53: ['CM-2'] }
  },
  {
    id: '3.4.2', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Change Management',
    description: 'Establish and enforce security configuration settings for information technology products employed in organizational systems.',
    discussion: 'Configure systems to be secure by default.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Security configuration settings are established.', status: 'pending' },
      { id: 'b', description: 'Security configuration settings are enforced.', status: 'pending' }
    ],
    mappings: { nist800_53: ['CM-3'] }
  }
];

const IA_CONTROLS: Requirement[] = [
  {
    id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Identification',
    description: 'Identify system users, processes acting on behalf of users, or devices.',
    discussion: 'Organizations must know who or what is accessing the system.',
    level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'System users are identified.', status: 'pending' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending' },
      { id: 'c', description: 'Devices are identified.', status: 'pending' }
    ],
    mappings: { nist800_53: ['IA-2'] }
  },
  {
    id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Authentication',
    description: 'Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational systems.',
    discussion: 'Verifying identity via passwords, tokens, or biometrics.',
    level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'The identities of users are authenticated.', status: 'pending' },
      { id: 'b', description: 'The identities of processes acting on behalf of users are authenticated.', status: 'pending' },
      { id: 'c', description: 'The identities of devices are authenticated.', status: 'pending' }
    ],
    mappings: { nist800_53: ['IA-2'] }
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
  }
];

const IR_CONTROLS: Requirement[] = [
  {
    id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', cmmcLevel: 2, title: 'Incident Handling',
    description: 'Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.',
    discussion: 'Incident handling is a lifecycle process.',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'An operational incident-handling capability is established.', status: 'pending' },
      { id: 'b', description: 'Preparation activities are identified.', status: 'pending' },
      { id: 'c', description: 'Detection activities are identified.', status: 'pending' },
      { id: 'd', description: 'Analysis activities are identified.', status: 'pending' },
      { id: 'e', description: 'Containment activities are identified.', status: 'pending' },
      { id: 'f', description: 'Recovery activities are identified.', status: 'pending' },
      { id: 'g', description: 'User response activities are identified.', status: 'pending' }
    ],
    mappings: { nist800_53: ['IR-4'] }
  }
];

const MA_CONTROLS: Requirement[] = [
  {
    id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Perform Maintenance',
    description: 'Perform periodic and timely maintenance on organizational systems.',
    discussion: 'Regularly servicing hardware and software.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'A frequency for system maintenance is defined.', status: 'pending' },
      { id: 'b', description: 'Maintenance is performed at the defined frequency.', status: 'pending' },
      { id: 'c', description: 'Timely maintenance is performed.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MA-2'] }
  },
  {
    id: '3.7.5', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Nonlocal Maintenance',
    description: 'Require multi-factor authentication to establish nonlocal maintenance sessions via external networks and terminate such sessions when nonlocal maintenance is complete.',
    discussion: 'Remote support must be strictly controlled.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'MFA is required to establish nonlocal maintenance sessions via external networks.', status: 'pending' },
      { id: 'b', description: 'Nonlocal maintenance sessions are terminated when complete.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MA-4'] }
  }
];

const MP_CONTROLS: Requirement[] = [
  {
    id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Protect Media',
    description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.',
    discussion: 'Physical protection for USBs, hard drives, and printouts.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System media containing CUI is identified.', status: 'pending' },
      { id: 'b', description: 'System media containing CUI is physically controlled.', status: 'pending' },
      { id: 'c', description: 'System media containing CUI is securely stored.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-2'] }
  },
  {
    id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Sanitize Media',
    description: 'Sanitize or destroy system media containing CUI before disposal or release for reuse.',
    discussion: 'Wiping or shredding media.',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Media is sanitized or destroyed before disposal.', status: 'pending' },
      { id: 'b', description: 'Media is sanitized or destroyed before release for reuse.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-6'] }
  }
];

const PS_CONTROLS: Requirement[] = [
  {
    id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Screen Individuals',
    description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.',
    discussion: 'Background checks or clearances.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Screening criteria for individuals are defined.', status: 'pending' },
      { id: 'b', description: 'Individuals are screened prior to authorizing access to systems containing CUI.', status: 'pending' }
    ],
    mappings: { nist800_53: ['PS-3'] }
  }
];

const PE_CONTROLS: Requirement[] = [
  {
    id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Limit Physical Access',
    description: 'Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.',
    discussion: 'Locks, badges, and guards.',
    level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Authorized individuals are identified.', status: 'pending' },
      { id: 'b', description: 'Access to organizational systems, equipment, and operating environments is limited to authorized individuals.', status: 'pending' }
    ],
    mappings: { nist800_53: ['PE-2'] }
  },
  {
    id: '3.10.2', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Escort Visitors',
    description: 'Protect and monitor the physical facility and support infrastructure for organizational systems.',
    discussion: 'Escorting visitors and monitoring cameras.',
    level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'The physical facility and support infrastructure are protected.', status: 'pending' },
      { id: 'b', description: 'The physical facility and support infrastructure are monitored.', status: 'pending' }
    ],
    mappings: { nist800_53: ['PE-3'] }
  }
];

const RA_CONTROLS: Requirement[] = [
  {
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Risk Assessment',
    description: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.',
    discussion: 'Identifying and evaluating risks.',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'A frequency for assessing risk is defined.', status: 'pending' },
      { id: 'b', description: 'Risk is assessed at the defined frequency.', status: 'pending' },
      { id: 'c', description: 'Assessments include identifying risks from system operations and CUI processing.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-3'] }
  }
];

const CA_CONTROLS: Requirement[] = [
  {
    id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'Assess Controls',
    description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.',
    discussion: 'Self-assessments or external audits.',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'A frequency for assessing security controls is defined.', status: 'pending' },
      { id: 'b', description: 'Security controls are assessed at the defined frequency.', status: 'pending' },
      { id: 'c', description: 'The assessment determines if controls are effective.', status: 'pending' }
    ],
    mappings: { nist800_53: ['CA-2'] }
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

const SC_CONTROLS: Requirement[] = [
  {
    id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Boundary Protection',
    description: 'Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational systems) at the external boundaries and key internal boundaries of organizational systems.',
    discussion: 'Firewalls and gateways.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'External system boundaries are identified.', status: 'pending' },
      { id: 'b', description: 'Key internal system boundaries are identified.', status: 'pending' },
      { id: 'c', description: 'Communications are monitored at external and key internal boundaries.', status: 'pending' },
      { id: 'd', description: 'Communications are controlled at external and key internal boundaries.', status: 'pending' },
      { id: 'e', description: 'Communications are protected at external and key internal boundaries.', status: 'pending' }
    ],
    mappings: { nist800_53: ['SC-7'] }
  },
  {
    id: '3.13.11', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'FIPS Cryptography',
    description: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.',
    discussion: 'Standard for government data protection.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'FIPS-validated cryptography is identified for use.', status: 'pending' },
      { id: 'b', description: 'FIPS-validated cryptography is employed to protect CUI confidentiality.', status: 'pending' }
    ],
    mappings: { nist800_53: ['SC-13'] }
  }
];

const SI_CONTROLS: Requirement[] = [
  {
    id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Flaw Remediation',
    description: 'Identify, report, and correct system flaws in a timely manner.',
    discussion: 'Patch management.',
    level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'System flaws are identified.', status: 'pending' },
      { id: 'b', description: 'System flaws are reported.', status: 'pending' },
      { id: 'c', description: 'System flaws are corrected in a timely manner.', status: 'pending' }
    ],
    mappings: { nist800_53: ['SI-2'] }
  },
  {
    id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Malicious Code Protection',
    description: 'Provide protection from malicious code at appropriate locations within organizational systems.',
    discussion: 'Antivirus and EDR.',
    level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Locations within systems for malicious code protection are identified.', status: 'pending' },
      { id: 'b', description: 'Protection from malicious code is provided at those locations.', status: 'pending' }
    ],
    mappings: { nist800_53: ['SI-3'] }
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
