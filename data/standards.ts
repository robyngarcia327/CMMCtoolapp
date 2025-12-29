
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
const createObjs = (ids: string[]) => ids.map(id => ({ id, description: `Verify objective [${id}] for this control requirement per NIST 800-171A.`, status: 'pending' as const }));

// --- NIST 800-171 COMPLETE 110 CONTROL DATASET ---

const AC_CONTROLS: Requirement[] = [
  { id: 'AC.L2-3.1.1', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Authorized Access Control', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', discussion: 'Access control is the process of granting or denying specific requests for obtaining and using information and services.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c', 'd', 'e', 'f']), mappings: { nist800_53: ['AC-2'] } },
  { id: 'AC.L2-3.1.2', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Transaction & Function Control', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-6'] }, discussion: 'Restrict user capabilities based on roles.' },
  { id: 'AC.L2-3.1.3', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Control CUI Flow', description: 'Control the flow of CUI in accordance with approved authorizations.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-4'] }, discussion: 'Regulate information flow.' },
  { id: 'AC.L2-3.1.4', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Separation of Duties', description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-5'] }, discussion: 'No single person can compromise a critical process.' },
  { id: 'AC.L2-3.1.5', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Least Privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['AC-6'] }, discussion: 'Limit access to the minimum necessary.' },
  { id: 'AC.L2-3.1.6', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Non-Privileged Account Use', description: 'Use non-privileged accounts or roles when accessing non-security functions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-6'] }, discussion: 'Admins should use standard accounts for email/web.' },
  { id: 'AC.L2-3.1.7', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Privileged Functions', description: 'Prevent non-privileged users from executing privileged functions and audit the execution of such functions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-6'] }, discussion: 'Control administrative tools.' },
  { id: 'AC.L2-3.1.8', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Unsuccessful Logon Attempts', description: 'Limit unsuccessful logon attempts.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-7'] }, discussion: 'Lockout policies.' },
  { id: 'AC.L2-3.1.9', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Privacy & Security Notices', description: 'Provide privacy and security notices consistent with applicable CUI-related requirements.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-8'] }, discussion: 'Logon banners.' },
  { id: 'AC.L2-3.1.10', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Session Lock', description: 'Use session lock with pattern-hiding display after a defined period of inactivity.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-11'] }, discussion: 'Screen locks.' },
  { id: 'AC.L2-3.1.11', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Session Termination', description: 'Terminate (automatically disconnect) a user session after a defined condition.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-12'] }, discussion: 'Time-based logouts.' },
  { id: 'AC.L2-3.1.12', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Control Remote Access', description: 'Monitor and control remote access sessions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-17'] }, discussion: 'VPN security.' },
  { id: 'AC.L2-3.1.13', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Remote Access Confidentiality', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-17'] }, discussion: 'VPN encryption.' },
  { id: 'AC.L2-3.1.14', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Remote Access Routing', description: 'Route remote access via managed access control points.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AC-17'] }, discussion: 'Centralized RDP/VPN.' },
  { id: 'AC.L2-3.1.15', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Privileged Remote Access', description: 'Authorize remote execution of privileged commands.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-17'] }, discussion: 'Secure admin remoting.' },
  { id: 'AC.L2-3.1.16', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Wireless Access Authorization', description: 'Authorize wireless access prior to allowing such connections.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-18'] }, discussion: 'WPA3 Enterprise.' },
  { id: 'AC.L2-3.1.17', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Wireless Access Protection', description: 'Protect wireless access using authentication and encryption.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-18'] }, discussion: 'AES for Wi-Fi.' },
  { id: 'AC.L2-3.1.18', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Mobile Device Connection', description: 'Control connection of mobile devices.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-19'] }, discussion: 'MDM or registration.' },
  { id: 'AC.L2-3.1.19', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Encrypt CUI on Mobile', description: 'Encrypt CUI on mobile devices and mobile computing platforms.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-19'] }, discussion: 'BitLocker/FileVault.' },
  { id: 'AC.L2-3.1.20', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'External Connections', description: 'Verify and control connections to and use of external systems.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AC-20'] }, discussion: 'Verify 3rd party connections.' },
  { id: 'AC.L2-3.1.21', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 2, title: 'Portable Storage Use', description: 'Limit use of organizational portable storage devices on external systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AC-20'] }, discussion: 'USB usage rules.' },
  { id: 'AC.L2-3.1.22', framework: 'NIST-CMMC', family: 'AC', cmmcLevel: 1, title: 'Control Public Information', description: 'Control information posted or processed on publicly accessible systems.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['AC-22'] }, discussion: 'Pre-posting review.' }
];

const AT_CONTROLS: Requirement[] = [
  { id: 'AT.L2-3.2.1', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Role-Based Risk Awareness', description: 'Ensure that managers, systems administrators, and users are made aware of security risks associated with their activities.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['AT-2'] }, discussion: 'Training for specific roles.' },
  { id: 'AT.L2-3.2.2', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 1, title: 'Role-Based Training', description: 'Ensure that personnel are trained to carry out their assigned information security-related duties.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AT-3'] }, discussion: 'Technical job training.' },
  { id: 'AT.L2-3.2.3', framework: 'NIST-CMMC', family: 'AT', cmmcLevel: 2, title: 'Insider Threat Awareness', description: 'Provide awareness training on recognizing and reporting potential indicators of insider threat.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AT-2'] }, discussion: 'Detecting internal risk.' }
];

const AU_CONTROLS: Requirement[] = [
  { id: 'AU.L2-3.3.1', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'System Auditing', description: 'Create and retain system audit logs and records.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['AU-2'] }, discussion: 'Log generation.' },
  { id: 'AU.L2-3.3.2', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'User Accountability', description: 'Ensure that the actions of individual system users can be uniquely traced.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-3'] }, discussion: 'Log binding.' },
  { id: 'AU.L2-3.3.3', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Event Review', description: 'Review and update logged events.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-6'] }, discussion: 'Continuous log monitoring.' },
  { id: 'AU.L2-3.3.4', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Audit Failure Alerting', description: 'Alert in the event of an audit logging process failure.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AU-5'] }, discussion: 'Alerting on SIEM stop.' },
  { id: 'AU.L2-3.3.5', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Audit Correlation', description: 'Correlate audit record review, analysis, and reporting processes.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-6'] }, discussion: 'Aggregating logs.' },
  { id: 'AU.L2-3.3.6', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Reduction & Reporting', description: 'Provide a system capability that compares and collates audit records.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AU-6'] }, discussion: 'SIEM dashboards.' },
  { id: 'AU.L2-3.3.7', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Authoritative Time Source', description: 'Provide synchronization of system clocks using an authoritative source.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-8'] }, discussion: 'NTP sync.' },
  { id: 'AU.L2-3.3.8', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Audit Protection', description: 'Protect audit information and audit logging tools.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['AU-9'] }, discussion: 'Log integrity.' },
  { id: 'AU.L2-3.3.9', framework: 'NIST-CMMC', family: 'AU', cmmcLevel: 2, title: 'Audit Management', description: 'Limit management of audit logging functionality to privileged users.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['AU-9'] }, discussion: 'Admin access to logs.' }
];

const CM_CONTROLS: Requirement[] = [
  { id: 'CM.L2-3.4.1', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'System Baselining', description: 'Establish and maintain baseline configurations and inventories.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['CM-2'] }, discussion: 'Standard builds.' },
  { id: 'CM.L2-3.4.2', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Security Configuration Enforcement', description: 'Establish and enforce security configuration settings for IT products.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-6'] }, discussion: 'Hardening via GPO.' },
  { id: 'CM.L2-3.4.3', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'System Change Management', description: 'Track, review, approve, and audit changes to organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['CM-3'] }, discussion: 'Change control board.' },
  { id: 'CM.L2-3.4.4', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Security Impact Analysis', description: 'Analyze the security impact of changes prior to implementation.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['CM-4'] }, discussion: 'Testing changes.' },
  { id: 'CM.L2-3.4.5', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Access Restrictions for Change', description: 'Define and enforce restrictions associated with changes.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-5'] }, discussion: 'Who can change code.' },
  { id: 'CM.L2-3.4.6', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Least Functionality', description: 'Configure systems to provide only essential capabilities.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-7'] }, discussion: 'Disable extra services.' },
  { id: 'CM.L2-3.4.7', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 1, title: 'Nonessential Functionality', description: 'Restrict nonessential programs, ports, and protocols.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-7'] }, discussion: 'Hardening.' },
  { id: 'CM.L2-3.4.8', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'Application Execution Policy', description: 'Apply deny-by-default or allow-by-exception policies.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-7'] }, discussion: 'App whitelisting.' },
  { id: 'CM.L2-3.4.9', framework: 'NIST-CMMC', family: 'CM', cmmcLevel: 2, title: 'User-Installed Software', description: 'Control and monitor user-installed software.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CM-11'] }, discussion: 'Restrict user installs.' }
];

const IA_CONTROLS: Requirement[] = [
  { id: 'IA.L2-3.5.1', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Identification', description: 'Identify system users, processes acting on behalf of users, and devices.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Unique IDs.' },
  { id: 'IA.L2-3.5.2', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 1, title: 'Authentication', description: 'Authenticate the identities of users, processes, or devices.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Passwords/Auth.' },
  { id: 'IA.L2-3.5.3', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Multifactor Authentication', description: 'Use MFA for local and network access to privileged and non-privileged accounts.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Duo, Azure MFA.' },
  { id: 'IA.L2-3.5.4', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Replay-Resistant Authentication', description: 'Employ replay-resistant authentication mechanisms.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-2'] }, discussion: 'Kerberos/PKI.' },
  { id: 'IA.L2-3.5.5', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Identifier Reuse', description: 'Prevent identifiers from being reused for a defined period.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-4'] }, discussion: 'No re-using usernames.' },
  { id: 'IA.L2-3.5.6', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Identifier Handling', description: 'Disable identifiers after a defined period of inactivity.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-4'] }, discussion: 'Account cleanup.' },
  { id: 'IA.L2-3.5.7', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Password Complexity', description: 'Enforce minimum password complexity.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['IA-5'] }, discussion: 'Complexity rules.' },
  { id: 'IA.L2-3.5.8', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Password Reuse', description: 'Prohibit password reuse for a defined number of generations.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-5'] }, discussion: 'Password history.' },
  { id: 'IA.L2-3.5.9', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Temporary Passwords', description: 'Allow temporary password use with an immediate change.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-5'] }, discussion: 'Force change at next login.' },
  { id: 'IA.L2-3.5.10', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Protected Passwords', description: 'Store and transmit only cryptographically-protected passwords.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['IA-5'] }, discussion: 'Hashing.' },
  { id: 'IA.L2-3.5.11', framework: 'NIST-CMMC', family: 'IA', cmmcLevel: 2, title: 'Obscure Feedback', description: 'Obscure feedback of authentication information.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-6'] }, discussion: 'Asterisks for passwords.' }
];

const IR_CONTROLS: Requirement[] = [
  { id: 'IR.L2-3.6.1', framework: 'NIST-CMMC', family: 'IR', cmmcLevel: 2, title: 'Incident Handling', description: 'Establish an operational incident-handling capability.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c', 'd', 'e', 'f']), mappings: { nist800_53: ['IR-4'] }, discussion: 'Plan for breaches.' },
  { id: 'IR.L2-3.6.2', framework: 'NIST-CMMC', family: 'IR', cmmcLevel: 2, title: 'Incident Reporting', description: 'Track, document, and report incidents.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['IR-6'] }, discussion: 'Reporting to DoD.' },
  { id: 'IR.L2-3.6.3', framework: 'NIST-CMMC', family: 'IR', cmmcLevel: 2, title: 'Incident Response Testing', description: 'Test the incident response capability.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['IR-3'] }, discussion: 'Tabletop exercises.' }
];

const MA_CONTROLS: Requirement[] = [
  { id: 'MA.L2-3.7.1', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Perform Maintenance', description: 'Perform periodic and timely maintenance on organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['MA-2'] }, discussion: 'Routine service.' },
  { id: 'MA.L2-3.7.2', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'System Maintenance Control', description: 'Control tools and personnel used for maintenance.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['MA-3'] }, discussion: 'Approved tools.' },
  { id: 'MA.L2-3.7.3', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Equipment Sanitization', description: 'Ensure equipment for off-site maintenance is sanitized.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MA-2'] }, discussion: 'Wipe before repair.' },
  { id: 'MA.L2-3.7.4', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Media Inspection', description: 'Check media containing system software before use.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MA-3'] }, discussion: 'Scan for malware.' },
  { id: 'MA.L2-3.7.5', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Nonlocal Maintenance', description: 'Require MFA for nonlocal maintenance sessions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['MA-4'] }, discussion: 'Remote support security.' },
  { id: 'MA.L2-3.7.6', framework: 'NIST-CMMC', family: 'MA', cmmcLevel: 2, title: 'Maintenance Personnel', description: 'Supervise maintenance personnel without required authorization.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['MA-5'] }, discussion: 'Escorts.' }
];

const MP_CONTROLS: Requirement[] = [
  { id: 'MP.L2-3.8.1', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Media Protection', description: 'Protect system media containing CUI.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['MP-2'] }, discussion: 'Secure storage.' },
  { id: 'MP.L2-3.8.2', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Media Access', description: 'Limit access to CUI on system media.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-3'] }, discussion: 'Access logs for media.' },
  { id: 'MP.L2-3.8.3', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 1, title: 'Media Disposal', description: 'Sanitize or destroy system media before disposal.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['MP-6'] }, discussion: 'Shredding.' },
  { id: 'MP.L2-3.8.4', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Media Markings', description: 'Mark media with necessary CUI markings.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-3'] }, discussion: 'CUI labels.' },
  { id: 'MP.L2-3.8.5', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Media Accountability', description: 'Control and monitor system media containing CUI.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['MP-4'] }, discussion: 'Inventory logs.' },
  { id: 'MP.L2-3.8.6', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Portable Storage Encryption', description: 'Protect confidentiality of CUI during transport.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-5'] }, discussion: 'Encrypted USBs.' },
  { id: 'MP.L2-3.8.7', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Removable Media Use', description: 'Control the use of removable media.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-7'] }, discussion: 'Disable USB ports.' },
  { id: 'MP.L2-3.8.8', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Media Owner Verification', description: 'Prohibit use of portable storage without owner.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-7'] }, discussion: 'No mystery drives.' },
  { id: 'MP.L2-3.8.9', framework: 'NIST-CMMC', family: 'MP', cmmcLevel: 2, title: 'Protect Backups', description: 'Protect the confidentiality of backup information.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-4'] }, discussion: 'Encrypted backups.' }
];

const PS_CONTROLS: Requirement[] = [
  { id: 'PS.L2-3.9.1', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Screen Individuals', description: 'Screen individuals prior to authorizing access.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['PS-3'] }, discussion: 'Background checks.' },
  { id: 'PS.L2-3.9.2', framework: 'NIST-CMMC', family: 'PS', cmmcLevel: 2, title: 'Personnel Actions', description: 'Protect systems during and after personnel actions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['PS-4'] }, discussion: 'Offboarding.' }
];

const PE_CONTROLS: Requirement[] = [
  { id: 'PE.L2-3.10.1', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Limit Physical Access', description: 'Limit physical access to organizational systems and equipment.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['PE-2'] }, discussion: 'Locks and badges.' },
  { id: 'PE.L2-3.10.2', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 2, title: 'Monitor Facility', description: 'Protect and monitor the physical facility.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['PE-6'] }, discussion: 'Cameras and alarms.' },
  { id: 'PE.L2-3.10.3', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Escort Visitors', description: 'Escort visitors and monitor activity.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['PE-3'] }, discussion: 'Visitor policy.' },
  { id: 'PE.L2-3.10.4', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Physical Access Logs', description: 'Maintain audit logs of physical access.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['PE-3'] }, discussion: 'Sign-in sheets.' },
  { id: 'PE.L2-3.10.5', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 1, title: 'Manage Physical Access', description: 'Control and manage physical access devices.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['PE-3'] }, discussion: 'Key management.' },
  { id: 'PE.L2-3.10.6', framework: 'NIST-CMMC', family: 'PE', cmmcLevel: 2, title: 'Alternate Work Sites', description: 'Enforce measures at alternate work sites.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['PE-17'] }, discussion: 'Work-from-home rules.' }
];

const RA_CONTROLS: Requirement[] = [
  { id: 'RA.L2-3.11.1', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Risk Assessments', description: 'Periodically assess the risk to organizational operations.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['RA-3'] }, discussion: 'Formal Risk Mgmt.' },
  { id: 'RA.L2-3.11.2', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Vulnerability Scan', description: 'Scan for vulnerabilities periodically.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c', 'd', 'e']), mappings: { nist800_53: ['RA-5'] }, discussion: 'Nessus/Rapid7.' },
  { id: 'RA.L2-3.11.3', framework: 'NIST-CMMC', family: 'RA', cmmcLevel: 2, title: 'Vulnerability Remediation', description: 'Remediate vulnerabilities in accordance with assessments.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['RA-5'] }, discussion: 'Patch management.' }
];

const CA_CONTROLS: Requirement[] = [
  { id: 'CA.L2-3.12.1', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'Security Control Assessment', description: 'Periodically assess security controls.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CA-2'] }, discussion: 'Self-auditing.' },
  { id: 'CA.L2-3.12.2', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'Plan of Action', description: 'Develop plans of action for deficiencies.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CA-5'] }, discussion: 'POA&M.' },
  { id: 'CA.L2-3.12.3', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'Security Control Monitoring', description: 'Monitor security controls on an ongoing basis.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['CA-7'] }, discussion: 'Continuous monitoring.' },
  { id: 'CA.L2-3.12.4', framework: 'NIST-CMMC', family: 'CA', cmmcLevel: 2, title: 'System Security Plan', description: 'Develop and update system security plans.', level: 'Level 2', sprsWeight: 5, objectives: createObjs(['a', 'b', 'c', 'd', 'e']), mappings: { nist800_53: ['PL-2'] }, discussion: 'SSP maintenance.' }
];

const SC_CONTROLS: Requirement[] = [
  { id: 'SC.L2-3.13.1', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Boundary Protection', description: 'Monitor and protect communications at boundaries.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SC-7'] }, discussion: 'Firewalls.' },
  { id: 'SC.L2-3.13.2', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Security Engineering', description: 'Employ designs and principles that promote security.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SA-8'] }, discussion: 'Secure architecture.' },
  { id: 'SC.L2-3.13.3', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Role Separation', description: 'Separate user and management functionality.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-2'] }, discussion: 'Admin vs User.' },
  { id: 'SC.L2-3.13.4', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Shared Resource Control', description: 'Prevent unintended transfer via shared resources.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-4'] }, discussion: 'Memory clearing.' },
  { id: 'SC.L2-3.13.5', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Public System Separation', description: 'Deny network communications with external systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-7'] }, discussion: 'DMZ.' },
  { id: 'SC.L2-3.13.6', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Deny by Exception', description: 'Deny traffic by default and allow by exception.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-7'] }, discussion: 'Allow-listing.' },
  { id: 'SC.L2-3.13.7', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Split Tunneling', description: 'Prevent simultaneous non-remote and external connections.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-7'] }, discussion: 'VPN routing.' },
  { id: 'SC.L2-3.13.8', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Data in Transit', description: 'Protect confidentiality of CUI during transmission.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-8'] }, discussion: 'TLS/HTTPS.' },
  { id: 'SC.L2-3.13.9', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Connection Termination', description: 'Terminate connections at end of sessions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-10'] }, discussion: 'Idle timeouts.' },
  { id: 'SC.L2-3.13.10', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Key Management', description: 'Establish and manage cryptographic keys.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SC-12'] }, discussion: 'Key lifecycle.' },
  { id: 'SC.L2-3.13.11', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'FIPS Cryptography', description: 'Employ FIPS-validated cryptography for CUI.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-13'] }, discussion: 'FIPS 140-2.' },
  { id: 'SC.L2-3.13.12', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Collaborative Device Control', description: 'Prohibit remote activation of devices.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-15'] }, discussion: 'Camera/Mic privacy.' },
  { id: 'SC.L2-3.13.13', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Mobile Code', description: 'Control and monitor the use of mobile code.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-18'] }, discussion: 'JS/ActiveX.' },
  { id: 'SC.L2-3.13.14', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'VoIP Control', description: 'Control and monitor the use of VoIP technologies.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b']), mappings: { nist800_53: ['SC-19'] }, discussion: 'Voice security.' },
  { id: 'SC.L2-3.13.15', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Session Authenticity', description: 'Protect the authenticity of communications sessions.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-23'] }, discussion: 'MFA for sessions.' },
  { id: 'SC.L2-3.13.16', framework: 'NIST-CMMC', family: 'SC', cmmcLevel: 2, title: 'Data at Rest', description: 'Protect the confidentiality of CUI at rest.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-28'] }, discussion: 'BitLocker.' }
];

const SI_CONTROLS: Requirement[] = [
  { id: 'SI.L2-3.14.1', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Flaw Remediation', description: 'Identify and correct system flaws in a timely manner.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['SI-2'] }, discussion: 'Security patching.' },
  { id: 'SI.L2-3.14.2', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Malicious Code Protection', description: 'Provide protection from malicious code.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SI-3'] }, discussion: 'Antivirus.' },
  { id: 'SI.L2-3.14.3', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 2, title: 'Alerts & Advisories', description: 'Monitor security alerts and advisories.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c']), mappings: { nist800_53: ['SI-5'] }, discussion: 'CISA advisories.' },
  { id: 'SI.L2-3.14.4', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'Signature Updates', description: 'Update malicious code protection mechanisms.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a']), mappings: { nist800_53: ['SI-3'] }, discussion: 'AV updates.' },
  { id: 'SI.L2-3.14.5', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 1, title: 'System Scanning', description: 'Perform periodic scans of organizational systems.', level: 'Level 1', sprsWeight: 1, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SI-3'] }, discussion: 'Full scans.' },
  { id: 'SI.L2-3.14.6', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 2, title: 'Monitor Communications', description: 'Monitor systems to detect attacks.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a', 'b', 'c', 'd']), mappings: { nist800_53: ['SI-4'] }, discussion: 'IDS/IPS.' },
  { id: 'SI.L2-3.14.7', framework: 'NIST-CMMC', family: 'SI', cmmcLevel: 2, title: 'Unauthorized Use Detection', description: 'Identify unauthorized use of organizational systems.', level: 'Level 2', sprsWeight: 3, objectives: createObjs(['a']), mappings: { nist800_53: ['SI-4'] }, discussion: 'Log analysis.' }
];

// Combine all 110 Controls
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
