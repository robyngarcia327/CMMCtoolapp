
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

const AT_CONTROLS: Requirement[] = [
  {
    id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Security Awareness Training',
    description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities.',
    discussion: 'Basic security training for all users.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Security risks are identified.', status: 'pending' }, { id: 'b', description: 'Personnel are made aware of risks.', status: 'pending' }],
    mappings: { nist800_53: ['AT-2'] }
  },
  {
    id: '3.2.2', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Role-Based Training',
    description: 'Ensure that organizational personnel are adequately trained to carry out their assigned information security-related duties and responsibilities.',
    discussion: 'Specialized training for IT admins and security staff.', level: 'Level 2', sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Security duties are identified.', status: 'pending' }, { id: 'b', description: 'Personnel are trained for duties.', status: 'pending' }],
    mappings: { nist800_53: ['AT-3'] }
  }
];

const PS_CONTROLS: Requirement[] = [
  {
    id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Screen Individuals',
    description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.',
    discussion: 'Perform background checks or security clearances.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Personnel screening criteria are defined.', status: 'pending' },
      { id: 'b', description: 'Individuals are screened prior to system access.', status: 'pending' }
    ],
    mappings: { nist800_53: ['PS-3'] }
  },
  {
    id: '3.9.2', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Terminate Access',
    description: 'Ensure that organizational systems containing CUI are protected during and after personnel actions such as terminations and transfers.',
    discussion: 'Disable accounts immediately when someone leaves.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System access is disabled for terminated users.', status: 'pending' },
      { id: 'b', description: 'System access is adjusted for transferred users.', status: 'pending' }
    ],
    mappings: { nist800_53: ['PS-4', 'PS-5'] }
  }
];

const PE_CONTROLS: Requirement[] = [
  {
    id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Limit Physical Access',
    description: 'Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.',
    discussion: 'Badges, locks, and security guards.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Physical access is limited.', status: 'pending' }],
    mappings: { nist800_53: ['PE-2'] }
  },
  {
    id: '3.10.2', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Escort Visitors',
    description: 'Protect and monitor the physical facility and support infrastructure for organizational systems.',
    discussion: 'Monitor cameras and utilities.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Facility is protected/monitored.', status: 'pending' }],
    mappings: { nist800_53: ['PE-3'] }
  }
];

const IA_CONTROLS: Requirement[] = [
  {
    id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Identify System Users',
    description: 'Identify system users, processes acting on behalf of users, or devices.',
    discussion: 'Unique IDs for everyone.', level: 'Level 1', sprsWeight: 1,
    objectives: [{ id: 'a', description: 'Users/Devices are identified.', status: 'pending' }],
    mappings: { nist800_53: ['IA-2'] }
  },
  {
    id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Multi-Factor Authentication',
    description: 'Use multi-factor authentication (MFA) for local and network access to privileged accounts and for network access to non-privileged accounts.',
    discussion: 'Duo, Azure MFA, or physical keys.', level: 'Level 2', sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'MFA used for local privileged access.', status: 'pending' },
      { id: 'b', description: 'MFA used for network privileged access.', status: 'pending' },
      { id: 'c', description: 'MFA used for non-privileged network access.', status: 'pending' }
    ],
    mappings: { nist800_53: ['IA-2'] }
  }
];

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
  }
];

const MP_CONTROLS: Requirement[] = [
  {
    id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Protect System Media',
    description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.',
    discussion: 'Physical security for disks, drives, and printouts.', level: 'Level 2', sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System media containing CUI is identified.', status: 'pending' },
      { id: 'b', description: 'System media is physically controlled.', status: 'pending' }
    ],
    mappings: { nist800_53: ['MP-2'] }
  }
];

const RA_CONTROLS: Requirement[] = [
  {
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Periodically Assess Risk',
    description: 'Periodically assess the risk to organizational operations, assets, and individuals resulting from the operation of organizational systems.',
    discussion: 'Conduct an annual formal Risk Assessment.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Risks are identified.', status: 'pending' }],
    mappings: { nist800_53: ['RA-3'] }
  }
];

const CA_CONTROLS: Requirement[] = [
  {
    id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'Assess Security Controls',
    description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.',
    discussion: 'Annual self-assessment or internal audit.', level: 'Level 2', sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Security controls are assessed.', status: 'pending' }],
    mappings: { nist800_53: ['CA-2'] }
  }
];

export const REQUIREMENTS_DATA: Requirement[] = [
  ...IA_CONTROLS,
  ...AT_CONTROLS,
  ...MA_CONTROLS,
  ...MP_CONTROLS,
  ...PS_CONTROLS,
  ...PE_CONTROLS,
  ...RA_CONTROLS,
  ...CA_CONTROLS,
  {
    id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Authorized Access Control',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices.',
    discussion: 'Control who can use organizational computers.', level: 'Level 1', sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending' },
      { id: 'c', description: 'Devices are identified.', status: 'pending' }
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
