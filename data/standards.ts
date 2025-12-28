
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

// Added missing SOC2 and HIPAA family definitions
export const SOC2_FAMILIES = [
  { id: 'CC', name: 'Common Criteria' },
  { id: 'A', name: 'Availability' },
  { id: 'C', name: 'Confidentiality' },
  { id: 'P', name: 'Processing Integrity' },
  { id: 'S', name: 'Privacy' }
];

export const HIPAA_FAMILIES = [
  { id: 'ADMIN', name: 'Administrative Safeguards' },
  { id: 'PHYS', name: 'Physical Safeguards' },
  { id: 'TECH', name: 'Technical Safeguards' }
];

// --- NIST 800-171 FULL CONTROL SET (Sampled for scale, but covering all families) ---

const AC_CONTROLS: Requirement[] = [
  {
    id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Authorized Access Control',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).',
    discussion: 'Control who can use organizational computers and the data within them.',
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
    discussion: 'Transactions and functions are defined by the organization (e.g., read, write, delete).',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Types of transactions authorized users are permitted to execute are identified.', status: 'pending' },
      { id: 'b', description: 'Types of functions authorized users are permitted to execute are identified.', status: 'pending' },
      { id: 'c', description: 'System access is limited to the defined transactions and functions.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-6'] }
  },
  {
    id: '3.1.18', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Mobile Device Control',
    description: 'Control connection of mobile devices.',
    discussion: 'Manage which mobile devices can connect to the internal network.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Mobile devices are identified.', status: 'pending' },
      { id: 'b', description: 'Connection of mobile devices is controlled.', status: 'pending' },
      { id: 'c', description: 'Usage of mobile devices is monitored.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-19'] }
  }
];

const AT_CONTROLS: Requirement[] = [
  {
    id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Security Awareness Training',
    description: 'Ensure that managers, systems administrators, and users are made aware of security risks.',
    discussion: 'Mandatory training for all personnel with system access.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Security risks associated with organizational activities are identified.', status: 'pending' },
      { id: 'b', description: 'Managers are made aware of security risks.', status: 'pending' },
      { id: 'c', description: 'Systems administrators are made aware of security risks.', status: 'pending' },
      { id: 'd', description: 'Users are made aware of security risks.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AT-2'] }
  }
];

const AU_CONTROLS: Requirement[] = [
  {
    id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Create Audit Records',
    description: 'Create and retain system audit logs and records.',
    discussion: 'Retain logs to enable investigation of unauthorized activity.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Audit records needed for investigation are identified.', status: 'pending' },
      { id: 'b', description: 'Audit records are created.', status: 'pending' },
      { id: 'c', description: 'Audit records are retained.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AU-2'] }
  }
];

const CM_CONTROLS: Requirement[] = [
  {
    id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Baseline Configurations',
    description: 'Establish and maintain baseline configurations and inventories.',
    discussion: 'Documented "known-good" states for all systems.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Baseline configurations are established.', status: 'pending' },
      { id: 'b', description: 'Baseline configurations are maintained.', status: 'pending' },
      { id: 'c', description: 'Inventories of organizational systems are established.', status: 'pending' },
      { id: 'd', description: 'Inventories of organizational systems are maintained.', status: 'pending' }
    ],
    mappings: { nist800_53: ['CM-2'] }
  }
];

const IA_CONTROLS: Requirement[] = [
  {
    id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Multi-Factor Authentication',
    description: 'Use MFA for local and network access to privileged and non-privileged accounts.',
    discussion: 'Duo, Azure MFA, or physical keys.',
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
    description: 'Establish an operational incident-handling capability.',
    discussion: 'Preparation, detection, analysis, containment, and recovery.',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Operational incident-handling capability is established.', status: 'pending' },
      { id: 'b', description: 'Preparation activities are identified.', status: 'pending' },
      { id: 'c', description: 'Detection activities are identified.', status: 'pending' },
      { id: 'd', description: 'Analysis activities are identified.', status: 'pending' },
      { id: 'e', description: 'Containment activities are identified.', status: 'pending' },
      { id: 'f', description: 'Recovery activities are identified.', status: 'pending' }
    ],
    mappings: { nist800_53: ['IR-4'] }
  }
];

const MA_CONTROLS: Requirement[] = [
  {
    id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Perform Maintenance',
    description: 'Perform periodic and timely maintenance on organizational systems.',
    discussion: 'Keep hardware and software in good working order.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'A frequency for maintenance is defined.', status: 'pending' },
      { id: 'b', description: 'Maintenance is performed at the defined frequency.', status: 'pending' },
      { id: 'c', description: 'Timely maintenance is performed.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MA-2'] }
  }
];

const MP_CONTROLS: Requirement[] = [
  {
    id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Protect Media',
    description: 'Protect (i.e., physically control and securely store) system media containing CUI.',
    discussion: 'Physical security for disks, drives, and tapes.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System media containing CUI is identified.', status: 'pending' },
      { id: 'b', description: 'System media containing CUI is physically controlled.', status: 'pending' },
      { id: 'c', description: 'System media containing CUI is securely stored.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-2'] }
  }
];

const PS_CONTROLS: Requirement[] = [
  {
    id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Screen Individuals',
    description: 'Screen individuals prior to authorizing access to systems containing CUI.',
    discussion: 'Background checks for CUI users.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Screening criteria are defined.', status: 'pending' },
      { id: 'b', description: 'Individuals are screened prior to access.', status: 'pending' }
    ],
    mappings: { nist800_53: ['PS-3'] }
  }
];

const PE_CONTROLS: Requirement[] = [
  {
    id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Limit Physical Access',
    description: 'Limit physical access to systems, equipment, and operating environments.',
    discussion: 'Locks, badges, and server room security.',
    level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Authorized individuals are identified.', status: 'pending' },
      { id: 'b', description: 'Physical access is limited to authorized individuals.', status: 'pending' }
    ],
    mappings: { nist800_53: ['PE-2'] }
  }
];

const RA_CONTROLS: Requirement[] = [
  {
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Risk Assessment',
    description: 'Periodically assess the risk to organizational operations.',
    discussion: 'Formal risk assessment process.',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Frequency for assessing risk is defined.', status: 'pending' },
      { id: 'b', description: 'Risk is assessed at the defined frequency.', status: 'pending' },
      { id: 'c', description: 'Assessments include identifying risks from system operations.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-3'] }
  }
];

const CA_CONTROLS: Requirement[] = [
  {
    id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'System Security Plan',
    description: 'Develop and maintain a system security plan (SSP).',
    discussion: 'The roadmap for compliance.',
    level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'System boundaries are described in the SSP.', status: 'pending' },
      { id: 'b', description: 'Operational environment is described in the SSP.', status: 'pending' },
      { id: 'c', description: 'Management strategy for requirements is described.', status: 'pending' },
      { id: 'd', description: 'System connections are described.', status: 'pending' },
      { id: 'e', description: 'SSP is developed and maintained.', status: 'pending' }
    ],
    mappings: { nist800_53: ['PL-2'] }
  }
];

const SC_CONTROLS: Requirement[] = [
  {
    id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Boundary Protection',
    description: 'Monitor, control, and protect organizational communications at external and internal boundaries.',
    discussion: 'Firewalls and proxies.',
    level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'External system boundaries are identified.', status: 'pending' },
      { id: 'b', description: 'Key internal system boundaries are identified.', status: 'pending' },
      { id: 'c', description: 'Communications are monitored at boundaries.', status: 'pending' },
      { id: 'd', description: 'Communications are controlled at boundaries.', status: 'pending' }
    ],
    mappings: { nist800_53: ['SC-7'] }
  }
];

const SI_CONTROLS: Requirement[] = [
  {
    id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Flaw Remediation',
    description: 'Identify, report, and correct system flaws in a timely manner.',
    discussion: 'Patching and software updates.',
    level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'System flaws are identified.', status: 'pending' },
      { id: 'b', description: 'System flaws are reported.', status: 'pending' },
      { id: 'c', description: 'System flaws are corrected in a timely manner.', status: 'pending' }
    ],
    mappings: { nist800_53: ['SI-2'] }
  }
];

// --- SOC 2 TYPE II CONTROLS ---
const SOC2_CONTROLS: Requirement[] = [
  {
    id: 'CC1.1', framework: 'SOC2', family: 'CC', title: 'Commitment to Integrity and Ethics',
    description: 'The entity demonstrates a commitment to integrity and ethical values.',
    discussion: 'Setting the tone at the top and standards of conduct.',
    level: 'Common Criteria',
    objectives: [
      { id: '1', description: 'Board of directors and management sets the tone at the top.', status: 'pending' },
      { id: '2', description: 'Standards of conduct are established.', status: 'pending' },
      { id: '3', description: 'Adherence to standards of conduct is evaluated.', status: 'pending' }
    ],
    mappings: { nist_csf: ['ID.GV-1'] }
  }
];

// --- HIPAA SECURITY RULE CONTROLS ---
const HIPAA_CONTROLS: Requirement[] = [
  {
    id: '164.308(a)(1)(i)', framework: 'HIPAA', family: 'ADMIN', title: 'Security Management Process',
    description: 'Implement policies and procedures to prevent, detect, contain, and correct security violations.',
    discussion: 'Standard for Administrative Safeguards involving risk analysis.',
    level: 'Required',
    objectives: [
      { id: 'a', description: 'Risk Analysis: Conduct accurate assessment of potential risks to ePHI.', status: 'pending' },
      { id: 'b', description: 'Risk Management: Implement security measures to reduce risk.', status: 'pending' }
    ],
    mappings: { nist800_53: ['RA-3', 'SI-4'] }
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
