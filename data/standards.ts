
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

// Helper to generate objectives
const createObjs = (ids: string[]) => ids.map(id => ({ id, description: `Assessment objective [${id}] for this control.`, status: 'pending' as const }));

// --- ACCESS CONTROL (AC) - 22 Controls ---
const AC_CONTROLS: Requirement[] = [
  { id: 'AC.L2-3.1.1', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Authorized Access Control [CUI Data]', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', discussion: 'Control who can use organizational computers and the data within them.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c', 'd', 'e', 'f']), mappings: { nist800_53: ['AC-2'] } },
  { id: 'AC.L2-3.1.2', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Transaction & Function Control', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', discussion: 'Determine which users can perform specific operations (e.g., read, write, delete).', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-6'] } },
  { id: 'AC.L2-3.1.3', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Control CUI Flow', description: 'Control the flow of CUI in accordance with approved authorizations.', discussion: 'Information flow control regulates where CUI can travel.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-4'] } },
  { id: 'AC.L2-3.1.4', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Separation of Duties', description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', discussion: 'Ensure no single person has control over all aspects of a critical transaction.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-5'] } },
  { id: 'AC.L2-3.1.5', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Least Privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', discussion: 'Users only have access required for their roles.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['AC-6'] } },
  { id: 'AC.L2-3.1.6', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Non-Privileged Account Use', description: 'Use non-privileged accounts or roles when accessing non-security functions, and any other functions that do not require privileged access.', discussion: 'Admins use standard accounts for email/web browsing.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-6'] } },
  { id: 'AC.L2-3.1.7', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Privileged Functions', description: 'Prevent non-privileged users from executing privileged functions and audit the execution of such functions.', discussion: 'System admins are the only ones performing admin tasks.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-6'] } },
  { id: 'AC.L2-3.1.8', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Unsuccessful Logon Attempts', description: 'Limit unsuccessful logon attempts.', discussion: 'Account lockout policies.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-7'] } },
  { id: 'AC.L2-3.1.9', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Privacy & Security Notices', description: 'Provide privacy and security notices consistent with applicable CUI-related requirements.', discussion: 'Logon banners.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-8'] } },
  { id: 'AC.L2-3.1.10', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Session Lock', description: 'Use session lock with pattern-hiding display after a defined period of inactivity.', discussion: 'Automatic screensavers.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-11'] } },
  { id: 'AC.L2-3.1.11', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Session Termination', description: 'Terminate (automatically disconnect) a user session after a defined condition.', discussion: 'Time-based logouts.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-12'] } },
  { id: 'AC.L2-3.1.12', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Control Remote Access', description: 'Monitor and control remote access sessions.', discussion: 'VPN and RDP security.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-17'] } },
  { id: 'AC.L2-3.1.13', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Remote Access Confidentiality', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', discussion: 'Encryption for VPNs.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-17'] } },
  { id: 'AC.L2-3.1.14', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Remote Access Routing', description: 'Route remote access via managed access control points.', discussion: 'Force traffic through a central gateway.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AC-17'] } },
  { id: 'AC.L2-3.1.15', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Privileged Remote Access', description: 'Authorize remote execution of privileged commands and remote access to security-relevant information.', discussion: 'Secure remote admin.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-17'] } },
  { id: 'AC.L2-3.1.16', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Wireless Access Authorization', description: 'Authorize wireless access prior to allowing such connections.', discussion: 'Control who uses Wi-Fi.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-18'] } },
  { id: 'AC.L2-3.1.17', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Wireless Access Protection', description: 'Protect wireless access using authentication and encryption.', discussion: 'WPA3 usage.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-18'] } },
  { id: 'AC.L2-3.1.18', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Mobile Device Connection', description: 'Control connection of mobile devices.', discussion: 'MDM or registration requirements.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-19'] } },
  { id: 'AC.L2-3.1.19', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Encrypt CUI on Mobile', description: 'Encrypt CUI on mobile devices and mobile computing platforms.', discussion: 'FIPS encryption for laptops/phones.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-19'] } },
  { id: 'AC.L2-3.1.20', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'External Connections [CUI Data]', description: 'Verify and control connections to and use of external systems.', discussion: 'Control third-party access.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-20'] } },
  { id: 'AC.L2-3.1.21', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Portable Storage Use', description: 'Limit use of organizational portable storage devices on external systems.', discussion: 'USB usage policies.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-20'] } },
  { id: 'AC.L2-3.1.22', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Control Public Information [CUI Data]', description: 'Control information posted or processed on publicly accessible systems.', discussion: 'Reviewing website content for CUI.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['AC-22'] } }
];

// --- AWARENESS AND TRAINING (AT) - 3 Controls ---
const AT_CONTROLS: Requirement[] = [
  { id: 'AT.L2-3.2.1', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Role-Based Risk Awareness', description: 'Ensure that managers, systems administrators, and users are made aware of security risks associated with their activities.', discussion: 'Targeted training.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['AT-2'] } },
  { id: 'AT.L2-3.2.2', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 1, title: 'Role-Based Training', description: 'Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities.', discussion: 'Specific technical training.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AT-3'] } },
  { id: 'AT.L2-3.2.3', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Insider Threat Awareness', description: 'Provide awareness training on recognizing and reporting potential indicators of insider threat.', discussion: 'Behavioral training.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AT-2'] } }
];

// --- AUDIT AND ACCOUNTABILITY (AU) - 9 Controls ---
const AU_CONTROLS: Requirement[] = [
  { id: 'AU.L2-3.3.1', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'System Auditing', description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.', discussion: 'Generate logs.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AU-2'] } },
  { id: 'AU.L2-3.3.2', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'User Accountability', description: 'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.', discussion: 'Unique IDs linked to logs.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-3'] } },
  { id: 'AU.L2-3.3.3', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Event Review', description: 'Review and update logged events.', discussion: 'Periodic log checks.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-6'] } },
  { id: 'AU.L2-3.3.4', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Audit Failure Alerting', description: 'Alert in the event of an audit logging process failure.', discussion: 'Know if logging stops.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AU-5'] } },
  { id: 'AU.L2-3.3.5', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Audit Correlation', description: 'Correlate audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity.', discussion: 'Cross-reference logs.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-6'] } },
  { id: 'AU.L2-3.3.6', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Reduction & Reporting', description: 'Provide a system capability that compares and collates audit records from multiple sources.', discussion: 'SIEM aggregation.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AU-6'] } },
  { id: 'AU.L2-3.3.7', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Authoritative Time Source', description: 'Provide a system capability that allows for the synchronization of system clocks using an authoritative source.', discussion: 'NTP sync.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-8'] } },
  { id: 'AU.L2-3.3.8', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Audit Protection', description: 'Protect audit information and audit logging tools from unauthorized access, modification, and deletion.', discussion: 'Log integrity.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-9'] } },
  { id: 'AU.L2-3.3.9', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Audit Management', description: 'Limit management of audit logging functionality to a subset of privileged users.', discussion: 'Who can change log settings.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AU-9'] } }
];

// --- CONFIGURATION MANAGEMENT (CM) - 9 Controls ---
const CM_CONTROLS: Requirement[] = [
  { id: 'CM.L2-3.4.1', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'System Baselining', description: 'Establish and maintain baseline configurations and inventories of organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['CM-2'] }, discussion: 'Standard builds.' },
  { id: 'CM.L2-3.4.2', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Security Configuration Enforcement', description: 'Establish and enforce security configuration settings for information technology products.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-6'] }, discussion: 'GPOs.' },
  { id: 'CM.L2-3.4.3', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'System Change Management', description: 'Track, review, approve, and audit changes to organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['CM-3'] }, discussion: 'Formal CM process.' },
  { id: 'CM.L2-3.4.4', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Security Impact Analysis', description: 'Analyze the security impact of changes prior to implementation.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['CM-4'] }, discussion: 'Will it break security?' },
  { id: 'CM.L2-3.4.5', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Access Restrictions for Change', description: 'Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-5'] }, discussion: 'Who can change code/configs.' },
  { id: 'CM.L2-3.4.6', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Least Functionality', description: 'Employ the principle of least functionality by configuring organizational systems to provide only essential capabilities.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-7'] }, discussion: 'Disable unnecessary services.' },
  { id: 'CM.L2-3.4.7', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 1, title: 'Nonessential Functionality', description: 'Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-7'] }, discussion: 'Hardening.' },
  { id: 'CM.L2-3.4.8', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Application Execution Policy', description: 'Apply deny-by-default (whitelisting) or allow-by-exception (blacklisting) policies for application execution.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-7'] }, discussion: 'App control.' },
  { id: 'CM.L2-3.4.9', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'User-Installed Software', description: 'Control and monitor user-installed software.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-11'] }, discussion: 'Restrict user installs.' }
];

// --- IDENTIFICATION AND AUTHENTICATION (IA) - 11 Controls ---
const IA_CONTROLS: Requirement[] = [
  { id: 'IA.L2-3.5.1', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Identification [CUI Data]', description: 'Identify system users, processes acting on behalf of users, and devices.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Account IDs.' },
  { id: 'IA.L2-3.5.2', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Authentication [CUI Data]', description: 'Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational systems.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Passwords.' },
  { id: 'IA.L2-3.5.3', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Multifactor Authentication', description: 'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Duo/Azure MFA.' },
  { id: 'IA.L2-3.5.4', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Replay-Resistant Authentication', description: 'Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Modern auth.' },
  { id: 'IA.L2-3.5.5', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Identifier Reuse', description: 'Prevent identifiers from being reused for a defined period.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-4'] }, discussion: 'Username recycling.' },
  { id: 'IA.L2-3.5.6', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Identifier Handling', description: 'Disable identifiers after a defined period of inactivity.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-4'] }, discussion: 'Cleanup stale accounts.' },
  { id: 'IA.L2-3.5.7', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Password Complexity', description: 'Enforce a minimum password complexity and change of characters when new passwords are created.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['IA-5'] }, discussion: 'Complexity rules.' },
  { id: 'IA.L2-3.5.8', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Password Reuse', description: 'Prohibit password reuse for a defined number of generations.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-5'] }, discussion: 'History.' },
  { id: 'IA.L2-3.5.9', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Temporary Passwords', description: 'Allow temporary password use for system logons with an immediate change to a permanent password.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-5'] }, discussion: 'Must change at next login.' },
  { id: 'IA.L2-3.5.10', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Cryptographically-Protected Passwords', description: 'Store and transmit only cryptographically-protected passwords.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['IA-5'] }, discussion: 'Hashing.' },
  { id: 'IA.L2-3.5.11', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Obscure Feedback', description: 'Obscure feedback of authentication information.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-6'] }, discussion: 'Asterisks for passwords.' }
];

// --- INCIDENT RESPONSE (IR) - 3 Controls ---
const IR_CONTROLS: Requirement[] = [
  { id: 'IR.L2-3.6.1', framework: 'NIST-CMMC', family: 'IR', cmmcLevel: 2, title: 'Incident Handling', description: 'Establish an operational incident-handling capability.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c', 'd', 'e', 'f']), mappings: { nist800_53: ['IR-4'] }, discussion: 'Process for attacks.' },
  { id: 'IR.L2-3.6.2', framework: 'NIST-CMMC', family: 'IR', cmmcLevel: 2, title: 'Incident Reporting', description: 'Track, document, and report incidents to designated officials.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['IR-6'] }, discussion: 'DIBNet reports.' },
  { id: 'IR.L2-3.6.3', framework: 'NIST-CMMC', family: 'IR', cmmcLevel: 2, title: 'Incident Response Testing', description: 'Test the organizational incident response capability.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IR-3'] }, discussion: 'Tabletop exercises.' }
];

// --- MAINTENANCE (MA) - 6 Controls ---
const MA_CONTROLS: Requirement[] = [
  { id: 'MA.L2-3.7.1', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Perform Maintenance', description: 'Perform periodic and timely maintenance on organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['MA-2'] }, discussion: 'Routine upkeep.' },
  { id: 'MA.L2-3.7.2', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'System Maintenance Control', description: 'Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['MA-3'] }, discussion: 'Trusted tools.' },
  { id: 'MA.L2-3.7.3', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Equipment Sanitization', description: 'Ensure equipment removed for off-site maintenance is sanitized of any CUI.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MA-2'] }, discussion: 'Wipe drives.' },
  { id: 'MA.L2-3.7.4', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Media Inspection', description: 'Check media containing system software before use.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MA-3'] }, discussion: 'Scan for malware.' },
  { id: 'MA.L2-3.7.5', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Nonlocal Maintenance', description: 'Require multifactor authentication to establish nonlocal maintenance sessions via external networks and terminate such sessions when nonlocal maintenance is completed.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['MA-4'] }, discussion: 'Remote support MFA.' },
  { id: 'MA.L2-3.7.6', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Maintenance Personnel', description: 'Supervise and monitor the activities of maintenance personnel without required access authorization.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['MA-5'] }, discussion: 'Escorts.' }
];

// --- MEDIA PROTECTION (MP) - 9 Controls ---
const MP_CONTROLS: Requirement[] = [
  { id: 'MP.L2-3.8.1', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Media Protection', description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['MP-2'] }, discussion: 'Locked safes.' },
  { id: 'MP.L2-3.8.2', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Media Access', description: 'Limit access to CUI on system media to authorized users.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-3'] }, discussion: 'Role-based media.' },
  { id: 'MP.L2-3.8.3', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 1, title: 'Media Disposal [CUI Data]', description: 'Sanitize or destroy system media containing CUI before disposal or release for reuse.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['MP-6'] }, discussion: 'Shredding.' },
  { id: 'MP.L2-3.8.4', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Media Markings', description: 'Mark media with necessary CUI markings.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-3'] }, discussion: 'CUI labels.' },
  { id: 'MP.L2-3.8.5', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Media Accountability', description: 'Control and monitor system media containing CUI.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['MP-4'] }, discussion: 'Inventory logs.' },
  { id: 'MP.L2-3.8.6', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Portable Storage Encryption', description: 'Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport unless maintained within controlled areas.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-5'] }, discussion: 'Encrypted USBs.' },
  { id: 'MP.L2-3.8.7', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Removeable Media', description: 'Control the use of removable media on system components.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-7'] }, discussion: 'Disabled ports.' },
  { id: 'MP.L2-3.8.8', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Shared Media', description: 'Prohibit the use of portable storage devices when such devices have no identifiable owner.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-7'] }, discussion: 'No mystery USBs.' },
  { id: 'MP.L2-3.8.9', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Protect Backups', description: 'Protect the confidentiality of backup information at storage locations.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-4'] }, discussion: 'Encrypted backups.' }
];

// --- PERSONNEL SECURITY (PS) - 2 Controls ---
const PS_CONTROLS: Requirement[] = [
  { id: 'PS.L2-3.9.1', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Screen Individuals', description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['PS-3'] }, discussion: 'Background checks.' },
  { id: 'PS.L2-3.9.2', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Personnel Actions', description: 'Ensure that organizational systems containing CUI are protected during and after personnel actions such as terminations and transfers.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['PS-4'] }, discussion: 'Offboarding.' }
];

// --- PHYSICAL PROTECTION (PE) - 6 Controls ---
const PE_CONTROLS: Requirement[] = [
  { id: 'PE.L2-3.10.1', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Limit Physical Access [CUI Data]', description: 'Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['PE-2'] }, discussion: 'Locks/Badges.' },
  { id: 'PE.L2-3.10.2', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 2, title: 'Monitor Facility', description: 'Protect and monitor the physical facility and support infrastructure for organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['PE-6'] }, discussion: 'CCTV.' },
  { id: 'PE.L2-3.10.3', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Escort Visitors [CUI Data]', description: 'Escort visitors and monitor visitor activity.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['PE-3'] }, discussion: 'Visitor policy.' },
  { id: 'PE.L2-3.10.4', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Physical Access Logs [CUI Data]', description: 'Maintain audit logs of physical access.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['PE-3'] }, discussion: 'Sign-in sheets.' },
  { id: 'PE.L2-3.10.5', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Manage Physical Access [CUI Data]', description: 'Control and manage physical access devices.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['PE-3'] }, discussion: 'Key management.' },
  { id: 'PE.L2-3.10.6', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 2, title: 'Alternative Work Sites', description: 'Enforce safeguarding measures at alternate work sites.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['PE-17'] }, discussion: 'Home office security.' }
];

// --- RISK ASSESSMENT (RA) - 3 Controls ---
const RA_CONTROLS: Requirement[] = [
  { id: 'RA.L2-3.11.1', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Risk Assessments', description: 'Periodically assess the risk to organizational operations, assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['RA-3'] }, discussion: 'Annual RA.' },
  { id: 'RA.L2-3.11.2', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Vulnerability Scan', description: 'Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c', 'd', 'e']), mappings: { nist800_53: ['RA-5'] }, discussion: 'Nessus/Rapid7.' },
  { id: 'RA.L2-3.11.3', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Vulnerability Remediation', description: 'Remediate vulnerabilities in accordance with risk assessments.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['RA-5'] }, discussion: 'Patch management.' }
];

// --- SECURITY ASSESSMENT (CA) - 4 Controls ---
const CA_CONTROLS: Requirement[] = [
  { id: 'CA.L2-3.12.1', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'Security Control Assessment', description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CA-2'] }, discussion: 'Self-assessments.' },
  { id: 'CA.L2-3.12.2', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'operational Plan of Action', description: 'Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational systems.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CA-5'] }, discussion: 'POA&M maintenance.' },
  { id: 'CA.L2-3.12.3', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'Security Control Monitoring', description: 'Monitor security controls on an ongoing basis to ensure the continued effectiveness of the controls.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CA-7'] }, discussion: 'Continuous monitoring.' },
  { id: 'CA.L2-3.12.4', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'System Security Plan', description: 'Develop, document, and periodically update system security plans that describe system boundaries, system environments of operation, the strategy for the management of security requirements, and the connections to other systems.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c', 'd', 'e']), mappings: { nist800_53: ['PL-2'] }, discussion: 'SSP maintenance.' }
];

// --- SYSTEM AND COMMUNICATIONS PROTECTION (SC) - 16 Controls ---
const SC_CONTROLS: Requirement[] = [
  { id: 'SC.L2-3.13.1', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Boundary Protection [CUI Data]', description: 'Monitor, control, and protect organizational communications at external and internal boundaries.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SC-7'] }, discussion: 'Firewalls.' },
  { id: 'SC.L2-3.13.2', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Security Engineering', description: 'Employ architectural designs, software development techniques, and systems engineering principles that promote effective information security within organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SA-8'] }, discussion: 'Secure design.' },
  { id: 'SC.L2-3.13.3', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Role Separation', description: 'Separate user functionality from system management functionality.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-2'] }, discussion: 'Management interfaces.' },
  { id: 'SC.L2-3.13.4', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Shared Resource Control', description: 'Prevent unauthorized and unintended information transfer via shared system resources.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-4'] }, discussion: 'Memory/Cache clearing.' },
  { id: 'SC.L2-3.13.5', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Public-Access System Separation [CUI Data]', description: 'Deny network communications with external systems that allow at-will interfaces.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-7'] }, discussion: 'Isolate web servers.' },
  { id: 'SC.L2-3.13.6', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Network Communication by Exception', description: 'Restrict access to the system by denying network communications traffic by default and allowing network communications traffic by exception (i.e., deny all, permit by exception).', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-7'] }, discussion: 'Strict ACLs.' },
  { id: 'SC.L2-3.13.7', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Split Tunneling', description: 'Prevent remote devices from simultaneously establishing non-remote connections with organizational systems and connecting via some other connection to external networks.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-7'] }, discussion: 'No split-tunnel VPN.' },
  { id: 'SC.L2-3.13.8', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Data in Transit', description: 'Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-8'] }, discussion: 'TLS/HTTPS.' },
  { id: 'SC.L2-3.13.9', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Connections Termination', description: 'Terminate network connections associated with communications sessions at the end of the sessions or after a defined period of inactivity.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-10'] }, discussion: 'Force idle disconnect.' },
  { id: 'SC.L2-3.13.10', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Key Management', description: 'Establish and manage cryptographic keys for required cryptography employed within organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SC-12'] }, discussion: 'Key lifecycle.' },
  { id: 'SC.L2-3.13.11', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'CUI Encryption', description: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-13'] }, discussion: 'FIPS 140-2/3.' },
  { id: 'SC.L2-3.13.12', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Collaborative Device Control', description: 'Prohibit remote activation of collaborative computing devices and provide indication of devices in use to users physically present at the devices.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-15'] }, discussion: 'Camera/Mic privacy.' },
  { id: 'SC.L2-3.13.13', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Mobile Code', description: 'Control and monitor the use of mobile code.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-18'] }, discussion: 'JS/ActiveX control.' },
  { id: 'SC.L2-3.13.14', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Voice over Internet Protocol', description: 'Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-19'] }, discussion: 'Secure VoIP.' },
  { id: 'SC.L2-3.13.15', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Communications Authenticity', description: 'Protect the authenticity of communications sessions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-23'] }, discussion: 'Session tokens.' },
  { id: 'SC.L2-3.13.16', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Data at Rest', description: 'Protect the confidentiality of CUI at rest.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-28'] }, discussion: 'BitLocker/FileVault.' }
];

// --- SYSTEM AND INFORMATION INTEGRITY (SI) - 7 Controls ---
const SI_CONTROLS: Requirement[] = [
  { id: 'SI.L2-3.14.1', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Flaw Remediation [CUI Data]', description: 'Identify, report, and correct system flaws in a timely manner.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['SI-2'] }, discussion: 'Patching.' },
  { id: 'SI.L2-3.14.2', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Malicious Code Protection [CUI Data]', description: 'Provide protection from malicious code at appropriate locations within organizational systems.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SI-3'] }, discussion: 'Antivirus/EDR.' },
  { id: 'SI.L2-3.14.3', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 2, title: 'Security Alerts & Advisories', description: 'Monitor system security alerts and advisories and take appropriate actions in response.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['SI-5'] }, discussion: 'CISA alerts.' },
  { id: 'SI.L2-3.14.4', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Update Malicious Code Protection [CUI Data]', description: 'Update malicious code protection mechanisms when new releases are available.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a']), mappings: { nist800_53: ['SI-3'] }, discussion: 'Signature updates.' },
  { id: 'SI.L2-3.14.5', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'System & File Scanning [CUI Data]', description: 'Perform periodic scans of organizational systems and real-time scans of files from external sources as files are downloaded, opened, or executed.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SI-3'] }, discussion: 'Full scans.' },
  { id: 'SI.L2-3.14.6', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 2, title: 'Monitor Communications for Attacks', description: 'Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SI-4'] }, discussion: 'IDS/IPS.' },
  { id: 'SI.L2-3.14.7', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 2, title: 'Identify Unauthorized Use', description: 'Identify unauthorized use of organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SI-4'] }, discussion: 'User behavior monitoring.' }
];

// --- SOC 2 TYPE II CONTROLS ---
const SOC2_CONTROLS: Requirement[] = [
  {
    id: 'SOC2-CC1.1', framework: 'SOC2', family: 'CC', title: 'Commitment to Integrity and Ethics',
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
    id: 'HIPAA-164.308(a)(1)(i)', framework: 'HIPAA', family: 'ADMIN', title: 'Security Management Process',
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
