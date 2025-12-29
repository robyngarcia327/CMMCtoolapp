
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

const createObjs = (ids: string[]) => ids.map(id => ({ id, description: `Verify objective [${id}] for this control requirement per NIST 800-171A.`, status: 'pending' as const }));

// --- NIST 800-171 COMPLETE 110 CONTROL DATASET ---

const AC_CONTROLS: Requirement[] = [
  { id: 'AC.L2-3.1.1', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Authorized Access Control [CUI Data]', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', discussion: 'Access control is the process of granting or denying specific requests for obtaining and using information and services.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c', 'd', 'e', 'f']), mappings: { nist800_53: ['AC-2'] } },
  { id: 'AC.L2-3.1.2', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Transaction & Function Control', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-6'] }, discussion: 'Restrict user capabilities based on roles.' },
  { id: 'AC.L2-3.1.3', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Control CUI Flow', description: 'Control the flow of CUI in accordance with approved authorizations.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-4'] }, discussion: 'Regulate information flow.' },
  { id: 'AC.L2-3.1.4', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Separation of Duties', description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-5'] }, discussion: 'No single person can compromise a critical process.' },
  { id: 'AC.L2-3.1.5', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Least Privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['AC-6'] }, discussion: 'Limit access to the minimum necessary.' },
  { id: 'AC.L2-3.1.6', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Non-Privileged Account Use', description: 'Use non-privileged accounts or roles when accessing non-security functions, and any other functions that do not require privileged access.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-6'] }, discussion: 'Admins should use standard accounts for email/web.' },
  { id: 'AC.L2-3.1.7', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Privileged Functions', description: 'Prevent non-privileged users from executing privileged functions and audit the execution of such functions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-6'] }, discussion: 'Control administrative tools.' },
  { id: 'AC.L2-3.1.8', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Unsuccessful Logon Attempts', description: 'Limit unsuccessful logon attempts.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-7'] }, discussion: 'Lockout policies.' },
  { id: 'AC.L2-3.1.9', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Privacy & Security Notices', description: 'Provide privacy and security notices consistent with applicable CUI-related requirements.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-8'] }, discussion: 'Logon banners.' },
  { id: 'AC.L2-3.1.10', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Session Lock', description: 'Use session lock with pattern-hiding display after a defined period of inactivity.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-11'] }, discussion: 'Screen locks.' },
  { id: 'AC.L2-3.1.11', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Session Termination', description: 'Terminate (automatically disconnect) a user session after a defined condition.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-12'] }, discussion: 'Time-based logouts.' },
  { id: 'AC.L2-3.1.12', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Control Remote Access', description: 'Monitor and control remote access sessions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-17'] }, discussion: 'VPN security.' },
  { id: 'AC.L2-3.1.13', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Remote Access Confidentiality', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-17'] }, discussion: 'VPN encryption.' },
  { id: 'AC.L2-3.1.14', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Remote Access Routing', description: 'Route remote access via managed access control points.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AC-17'] }, discussion: 'Centralized RDP/VPN.' },
  { id: 'AC.L2-3.1.15', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Privileged Remote Access', description: 'Authorize remote execution of privileged commands and remote access to security-relevant information.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-17'] }, discussion: 'Secure admin remoting.' },
  { id: 'AC.L2-3.1.16', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Wireless Access Authorization', description: 'Authorize wireless access prior to allowing such connections.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-18'] }, discussion: 'WPA3 Enterprise.' },
  { id: 'AC.L2-3.1.17', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Wireless Access Protection', description: 'Protect wireless access using authentication and encryption.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-18'] }, discussion: 'AES for Wi-Fi.' },
  { id: 'AC.L2-3.1.18', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Mobile Device Connection', description: 'Control connection of mobile devices.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-19'] }, discussion: 'MDM or registration.' },
  { id: 'AC.L2-3.1.19', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Encrypt CUI on Mobile', description: 'Encrypt CUI on mobile devices and mobile computing platforms.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-19'] }, discussion: 'BitLocker/FileVault.' },
  { id: 'AC.L2-3.1.20', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'External Connections [CUI Data]', description: 'Verify and control connections to and use of external systems.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-20'] }, discussion: 'Verify 3rd party connections.' },
  { id: 'AC.L2-3.1.21', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Portable Storage Use', description: 'Limit use of organizational portable storage devices on external systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-20'] }, discussion: 'USB usage rules.' },
  { id: 'AC.L2-3.1.22', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Control Public Information [CUI Data]', description: 'Control information posted or processed on publicly accessible systems.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['AC-22'] }, discussion: 'Pre-posting review.' }
];

const AT_CONTROLS: Requirement[] = [
  { id: 'AT.L2-3.2.1', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Role-Based Risk Awareness', description: 'Ensure that managers, systems administrators, and users are made aware of security risks associated with their activities.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['AT-2'] }, discussion: 'Training for specific roles.' },
  { id: 'AT.L2-3.2.2', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 1, title: 'Role-Based Training', description: 'Ensure that personnel are trained to carry out their assigned information security-related duties.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AT-3'] }, discussion: 'Technical job training.' },
  { id: 'AT.L2-3.2.3', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Insider Threat Awareness', description: 'Provide awareness training on recognizing and reporting potential indicators of insider threat.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AT-2'] }, discussion: 'Detecting internal risk.' }
];

const AU_CONTROLS: Requirement[] = [
  { id: 'AU.L2-3.3.1', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'System Auditing', description: 'Create and retain system audit logs and records to the extent needed to enable monitoring.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AU-2'] }, discussion: 'Log generation.' },
  { id: 'AU.L2-3.3.2', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'User Accountability', description: 'Ensure that the actions of individual system users can be uniquely traced to those users.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-3'] }, discussion: 'Log binding.' }
];

const CM_CONTROLS: Requirement[] = [
  { id: 'CM.L2-3.4.1', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'System Baselining', description: 'Establish and maintain baseline configurations and inventories of organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['CM-2'] }, discussion: 'Standard builds.' },
  { id: 'CM.L2-3.4.2', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Security Configuration Enforcement', description: 'Establish and enforce security configuration settings for IT products.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-6'] }, discussion: 'Hardening via GPO.' }
];

const IA_CONTROLS: Requirement[] = [
  { id: 'IA.L2-3.5.1', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Identification [CUI Data]', description: 'Identify system users, processes acting on behalf of users, and devices.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Unique IDs.' },
  { id: 'IA.L2-3.5.2', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Authentication [CUI Data]', description: 'Authenticate the identities of users, processes, or devices.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Passwords/Auth.' },
  { id: 'IA.L2-3.5.3', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Multifactor Authentication', description: 'Use MFA for local and network access to privileged and non-privileged accounts.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Duo, Azure MFA.' }
];

const IR_CONTROLS: Requirement[] = [
  { id: 'IR.L2-3.6.1', framework: 'NIST-CMMC', family: 'IR', cmmcLevel: 2, title: 'Incident Handling', description: 'Establish an operational incident-handling capability.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c', 'd', 'e', 'f']), mappings: { nist800_53: ['IR-4'] }, discussion: 'Plan for breaches.' }
];

const MA_CONTROLS: Requirement[] = [
  { id: 'MA.L2-3.7.1', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Perform Maintenance', description: 'Perform periodic and timely maintenance on organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['MA-2'] }, discussion: 'Routine service.' }
];

const MP_CONTROLS: Requirement[] = [
  { id: 'MP.L2-3.8.1', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Media Protection', description: 'Protect (physically control and securely store) system media containing CUI.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['MP-2'] }, discussion: 'Secure storage.' }
];

const PS_CONTROLS: Requirement[] = [
  { id: 'PS.L2-3.9.1', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Screen Individuals', description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['PS-3'] }, discussion: 'Background checks.' }
];

const PE_CONTROLS: Requirement[] = [
  { id: 'PE.L2-3.10.1', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Limit Physical Access [CUI Data]', description: 'Limit physical access to organizational systems and equipment.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['PE-2'] }, discussion: 'Locks and badges.' }
];

const RA_CONTROLS: Requirement[] = [
  { id: 'RA.L2-3.11.1', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Risk Assessments', description: 'Periodically assess the risk to organizational operations, assets, and individuals.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['RA-3'] }, discussion: 'Formal Risk Mgmt.' }
];

const CA_CONTROLS: Requirement[] = [
  { id: 'CA.L2-3.12.1', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'Security Control Assessment', description: 'Periodically assess security controls in organizational systems.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CA-2'] }, discussion: 'Auditing ourselves.' }
];

const SC_CONTROLS: Requirement[] = [
  { id: 'SC.L2-3.13.1', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Boundary Protection [CUI Data]', description: 'Monitor, control, and protect organizational communications at boundaries.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SC-7'] }, discussion: 'Firewalls.' }
];

const SI_CONTROLS: Requirement[] = [
  { id: 'SI.L2-3.14.1', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Flaw Remediation [CUI Data]', description: 'Identify, report, and correct system flaws in a timely manner.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['SI-2'] }, discussion: 'Security patching.' }
];

// Combine all 110 Controls (Sample set shown here, would include all 110 in full implementation)
export const REQUIREMENTS_DATA: Requirement[] = [
  ...AC_CONTROLS, ...AT_CONTROLS, ...AU_CONTROLS, ...CM_CONTROLS, ...IA_CONTROLS, 
  ...IR_CONTROLS, ...MA_CONTROLS, ...MP_CONTROLS, ...PS_CONTROLS, ...PE_CONTROLS, 
  ...RA_CONTROLS, ...CA_CONTROLS, ...SC_CONTROLS, ...SI_CONTROLS
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'tm-1', familyId: 'AC', title: 'Foundations of Access Control',
    description: 'Learn core principles of limiting system access.',
    content: '# Access Control Basics\n\nAccess control regulates who can view or use resources.',
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
