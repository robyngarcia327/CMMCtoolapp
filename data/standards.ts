import { Requirement, Framework, ClientData, TrainingModule } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST-CMMC', name: 'CMMC 2.0 / NIST 800-171', description: 'Comprehensive DoD Compliance Portfolio (Levels 1-2)' },
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
  { id: 'CC', name: 'Common Criteria / Security' },
  { id: 'A', name: 'Availability' },
  { id: 'PI', name: 'Processing Integrity' },
  { id: 'C', name: 'Confidentiality' },
  { id: 'P', name: 'Privacy' }
];

export const HIPAA_FAMILIES = [
  { id: 'AS', name: 'Administrative Safeguards' },
  { id: 'PS', name: 'Physical Safeguards' },
  { id: 'TS', name: 'Technical Safeguards' },
  { id: 'OR', name: 'Organizational Requirements' },
  { id: 'PD', name: 'Policies and Documentation' }
];

export const CCP_BLUEPRINT_DOMAINS = [
  { id: 'CCP-D1', name: 'CMMC Ecosystem' },
  { id: 'CCP-D2', name: 'Code of Professional Conduct' },
  { id: 'CCP-D3', name: 'Governance & Source Docs' },
  { id: 'CCP-D4', name: 'Model Construct' },
  { id: 'CCP-D5', name: 'Assessment Process (CAP)' },
  { id: 'CCP-D6', name: 'Scoping Methodology' }
];

const createObjs = (ids: string[]) => ids.map(id => ({ id, description: `Verify assessment objective [${id}] for this control requirement.`, status: 'pending' as const }));

const NIST_800_171_CONTROLS: Requirement[] = [
  // 3.1 Access Control (22)
  { 
    id: '3.1.1', 
    framework: 'NIST-CMMC', 
    family: 'AC', 
    title: 'Limit system access to authorized users', 
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', 
    discussion: 'Access control is the process of granting or denying specific requests for obtaining and using information and services.', 
    sprsWeight: 1, 
    cmmcLevel: 1, // Foundational
    objectives: [
        { id: 'a', description: 'authorized users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of authorized users are identified;', status: 'pending' },
        { id: 'c', description: 'devices (and other systems) authorized to connect to the system are identified;', status: 'pending' },
        { id: 'd', description: 'system access is limited to authorized users;', status: 'pending' },
        { id: 'e', description: 'system access is limited to processes acting on behalf of authorized users; and', status: 'pending' },
        { id: 'f', description: 'system access is limited to authorized devices (including other systems).', status: 'pending' }
    ],
    examineOptions: [
        'Access control policy',
        'Procedures addressing account management',
        'System Security Plan (SSP)',
        'System design documentation',
        'List of active system accounts',
        'Notifications of recently terminated employees',
        'List of recently disabled system accounts',
        'Access authorization records'
    ],
    interviewOptions: [
        'Personnel with account management responsibilities',
        'System or network administrators',
        'Personnel with information security responsibilities'
    ],
    testOptions: [
        'Organizational processes for managing system accounts',
        'Mechanisms for implementing account management'
    ],
    mappings: { nist800_53: ['AC-2'] } 
  },
  { 
    id: '3.1.2', 
    framework: 'NIST-CMMC', 
    family: 'AC', 
    title: 'Limit system access to transactions/functions', 
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', 
    discussion: 'Restrict user capabilities based on roles.', 
    sprsWeight: 5, 
    cmmcLevel: 1, // Foundational
    objectives: [
        { id: 'a', description: 'the types of transactions and functions that authorized users are permitted to execute are defined; and', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined types of transactions and functions for authorized users.', status: 'pending' }
    ],
    examineOptions: [
        'Access control policy',
        'Procedures addressing access enforcement',
        'List of approved authorizations',
        'Remote access authorizations',
        'System audit logs and records'
    ],
    interviewOptions: [
        'Personnel with access enforcement responsibilities',
        'System or network administrators',
        'System developers'
    ],
    testOptions: [
        'Mechanisms implementing access control policy'
    ],
    mappings: { nist800_53: ['AC-6'] } 
  },
  { id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control the flow of CUI', description: 'Control the flow of CUI in accordance with approved authorizations.', discussion: 'Regulate information flow.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-4'] } },
  { id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separate duties of individuals', description: 'Separate duties of individuals to reduce the risk of malevolent activity without collusion.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-5'] } },
  { id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', title: 'Employ least privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-6'] } },
  { id: '3.1.6', framework: 'NIST-CMMC', family: 'AC', title: 'Use non-privileged accounts for non-security functions', description: 'Use non-privileged accounts or roles when accessing non-security functions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-6'] } },
  { id: '3.1.7', framework: 'NIST-CMMC', family: 'AC', title: 'Prevent non-privileged users from executing privileged functions', description: 'Prevent non-privileged users from executing privileged functions and audit the execution of such functions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-6'] } },
  { id: '3.1.8', framework: 'NIST-CMMC', family: 'AC', title: 'Limit unsuccessful logon attempts', description: 'Limit unsuccessful logon attempts.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-7'] } },
  { id: '3.1.9', framework: 'NIST-CMMC', family: 'AC', title: 'Provide privacy and security notices', description: 'Provide privacy and security notices consistent with applicable requirements.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-8'] } },
  { id: '3.1.10', framework: 'NIST-CMMC', family: 'AC', title: 'Use session lock with pattern hiding', description: 'Use session lock with PATTERN HIDING to prevent access and viewing of data after a period of inactivity.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-11'] } },
  { id: '3.1.11', framework: 'NIST-CMMC', family: 'AC', title: 'Terminate network sessions', description: 'Terminate network sessions based on specified conditions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-12'] } },
  { id: '3.1.12', framework: 'NIST-CMMC', family: 'AC', title: 'Monitor and control remote access sessions', description: 'Monitor and control remote access sessions.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-17'] } },
  { id: '3.1.13', framework: 'NIST-CMMC', family: 'AC', title: 'Employ cryptographic mechanisms for remote access', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-17(2)'] } },
  { id: '3.1.14', framework: 'NIST-CMMC', family: 'AC', title: 'Route remote access through managed access control points', description: 'Route remote access through managed access control points.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-17(3)'] } },
  { id: '3.1.15', framework: 'NIST-CMMC', family: 'AC', title: 'Authorize remote execution of privileged commands', description: 'Authorize remote execution of privileged commands and remote access to security-relevant information.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-17(4)'] } },
  { id: '3.1.16', framework: 'NIST-CMMC', family: 'AC', title: 'Authorize wireless access', description: 'Authorize wireless access prior to allowing such connections.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-18'] } },
  { id: '3.1.17', framework: 'NIST-CMMC', family: 'AC', title: 'Protect wireless access using authentication/encryption', description: 'Protect wireless access using authentication and encryption.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-18(1)'] } },
  { id: '3.1.18', framework: 'NIST-CMMC', family: 'AC', title: 'Control connection of mobile devices', description: 'Control connection of mobile devices.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-19'] } },
  { id: '3.1.19', framework: 'NIST-CMMC', family: 'AC', title: 'Encrypt CUI on mobile devices', description: 'Encrypt CUI on mobile devices and mobile computing platforms.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-19(5)'] } },
  { id: '3.1.20', framework: 'NIST-CMMC', family: 'AC', title: 'Verify and control use of external systems', description: 'Verify and control use of external systems.', sprsWeight: 3, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-20'] } },
  { id: '3.1.21', framework: 'NIST-CMMC', family: 'AC', title: 'Limit use of organizational portable storage', description: 'Limit use of organizational portable storage devices on external systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-20(2)'] } },
  { id: '3.1.22', framework: 'NIST-CMMC', family: 'AC', title: 'Control CUI posted on publicly accessible systems', description: 'Control CUI posted or processed on publicly accessible systems.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-22'] } },

  // 3.2 Awareness and Training (3)
  { id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Security awareness training', description: 'Ensure that managers, systems administrators, and users are made aware of security risks.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AT-2'] } },
  { id: '3.2.2', framework: 'NIST-CMMC', family: 'AT', title: 'Training on insider threats', description: 'Ensure that personnel are trained to carry out their assigned information security-related duties.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AT-3'] } },
  { id: '3.2.3', framework: 'NIST-CMMC', family: 'AT', title: 'Insider threat training', description: 'Provide insider threat awareness training.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AT-2(2)'] } },

  // 3.3 Audit and Accountability (9)
  { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'Create and retain audit logs', description: 'Create and retain system audit logs and records to enable monitoring and analysis.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AU-2'] } },
  { id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'Audit individual user actions', description: 'Ensure that the actions of individual system users can be uniquely traced to those users.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['AU-3'] } },
  { id: '3.3.3', framework: 'NIST-CMMC', family: 'AU', title: 'Review and update logged events', description: 'Review and update logged events.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-2(3)'] } },
  { id: '3.3.4', framework: 'NIST-CMMC', family: 'AU', title: 'Alert in the event of audit process failure', description: 'Alert in the event of an audit logging process failure.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-5'] } },
  { id: '3.3.5', framework: 'NIST-CMMC', family: 'AU', title: 'Correlate audit record review', description: 'Correlate audit record review, analysis, and reporting processes.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-6'] } },
  { id: '3.3.6', framework: 'NIST-CMMC', family: 'AU', title: 'Provide audit record reduction/report generation', description: 'Provide audit record reduction and report generation.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-7'] } },
  { id: '3.3.7', framework: 'NIST-CMMC', family: 'AU', title: 'Provide a system-wide time source', description: 'Provide a system-wide time source for use in generating timestamps for audit records.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-8'] } },
  { id: '3.3.8', framework: 'NIST-CMMC', family: 'AU', title: 'Protect audit information and tools', description: 'Protect audit information and audit tools from unauthorized access, modification, and deletion.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AU-9'] } },
  { id: '3.3.9', framework: 'NIST-CMMC', family: 'AU', title: 'Limit management of audit functions', description: 'Limit management of audit logging functionality to a subset of privileged users.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-9(4)'] } },

  // 3.4 Configuration Management (9)
  { id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'Establish baseline configurations', description: 'Establish and maintain baseline configurations and inventories of organizational systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c','d']), mappings: { nist800_53: ['CM-2'] } },
  { id: '3.4.2', framework: 'NIST-CMMC', family: 'CM', title: 'Review/update configurations based on changes', description: 'Establish and enforce security configuration settings for information technology products.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-6'] } },
  { id: '3.4.3', framework: 'NIST-CMMC', family: 'CM', title: 'Track and review configuration changes', description: 'Track, review, approve, and audit changes to organizational systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c','d','e']), mappings: { nist800_53: ['CM-3'] } },
  { id: '3.4.4', framework: 'NIST-CMMC', family: 'CM', title: 'Analyze security impact of changes', description: 'Analyze the security impact of changes prior to implementation.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-4'] } },
  { id: '3.4.5', framework: 'NIST-CMMC', family: 'CM', title: 'Define physical/logical access for changes', description: 'Define, document, approve, and enforce physical and logical access restrictions associated with changes.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['CM-5'] } },
  { id: '3.4.6', framework: 'NIST-CMMC', family: 'CM', title: 'Employ least functionality principle', description: 'Employ the principle of least functionality by configuring organizational systems to provide only essential capabilities.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-7'] } },
  { id: '3.4.7', framework: 'NIST-CMMC', family: 'CM', title: 'Restrict use of unauthorized software', description: 'Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-7(1)'] } },
  { id: '3.4.8', framework: 'NIST-CMMC', family: 'CM', title: 'Apply deny-by-exception/allow-all policy', description: 'Apply deny-by-exception (blacklisting) policy to prevent the use of unauthorized software.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-7(2)'] } },
  { id: '3.4.9', framework: 'NIST-CMMC', family: 'CM', title: 'Control user-installed software', description: 'Control and monitor user-installed software.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-11'] } },

  // 3.5 Identification and Authentication (11)
  { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identify system users/devices', description: 'Identify system users, processes acting on behalf of users, or devices.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-2'] } },
  { id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', title: 'Authenticate identities', description: 'Authenticate (or verify) the identities of users, processes, or devices.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-2'] } },
  { id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Use Multi-Factor Authentication (MFA)', description: 'Use multi-factor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c','d']), mappings: { nist800_53: ['IA-2(1)'] } },
  { id: '3.5.4', framework: 'NIST-CMMC', family: 'IA', title: 'Employ replay-resistant authentication', description: 'Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-2(8)'] } },
  { id: '3.5.5', framework: 'NIST-CMMC', family: 'IA', title: 'Prevent use of identifiers', description: 'Prevent reuse of identifiers for a defined period.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-4'] } },
  { id: '3.5.6', framework: 'NIST-CMMC', family: 'IA', title: 'Disable identifiers after inactivity', description: 'Disable identifiers after a defined period of inactivity.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-4'] } },
  { id: '3.5.7', framework: 'NIST-CMMC', family: 'IA', title: 'Enforce minimum password complexity', description: 'Enforce a minimum password complexity and change of characters when new passwords are created.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['IA-5(1)'] } },
  { id: '3.5.8', framework: 'NIST-CMMC', family: 'IA', title: 'Prohibit password reuse', description: 'Prohibit password reuse for a specified number of generations.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-5(1)'] } },
  { id: '3.5.9', framework: 'NIST-CMMC', family: 'IA', title: 'Allow temporary password for logon only', description: 'Allow temporary password use for system logon with an immediate change to a permanent password.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-5(1)'] } },
  { id: '3.5.10', framework: 'NIST-CMMC', family: 'IA', title: 'Store/transmit only cryptographically-protected passwords', description: 'Store and transmit only cryptographically-protected passwords.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-5(1)'] } },
  { id: '3.5.11', framework: 'NIST-CMMC', family: 'IA', title: 'Obscure feedback of authentication information', description: 'Obscure feedback of authentication information.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-6'] } },

  // 3.6 Incident Response (3)
  { id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', title: 'Establish incident handling capability', description: 'Establish an operational incident-handling capability for organizational systems.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c','d','e']), mappings: { nist800_53: ['IR-4'] } },
  { id: '3.6.2', framework: 'NIST-CMMC', family: 'IR', title: 'Track and document incidents', description: 'Track, document, and report incidents to designated officials.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['IR-6'] } },
  { id: '3.6.3', framework: 'NIST-CMMC', family: 'IR', title: 'Test incident response capability', description: 'Test the organizational incident response capability.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IR-3'] } },

  // 3.7 Maintenance (6)
  { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'Perform system maintenance', description: 'Perform periodic and timely maintenance on organizational systems.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MA-2'] } },
  { id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', title: 'Provide controls on maintenance tools', description: 'Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['MA-3'] } },
  { id: '3.7.3', framework: 'NIST-CMMC', family: 'MA', title: 'Ensure equipment is sanitized of CUI', description: 'Ensure equipment, including organizational systems, is sanitized of CUI before removal.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MA-4'] } },
  { id: '3.7.4', framework: 'NIST-CMMC', family: 'MA', title: 'Check media for malicious code', description: 'Check media containing system software or documentation for malicious code before it is installed.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MA-3(1)'] } },
  { id: '3.7.5', framework: 'NIST-CMMC', family: 'MA', title: 'Require multi-factor authentication for remote maintenance', description: 'Require multi-factor authentication to establish nonlocal maintenance sessions.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['MA-4(2)'] } },
  { id: '3.7.6', framework: 'NIST-CMMC', family: 'MA', title: 'Supervise maintenance personnel', description: 'Supervise the maintenance activities of personnel without required access authorization.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MA-5'] } },

  // 3.8 Media Protection (9)
  { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Protect system media', description: 'Protect system media, both paper and digital, containing CUI.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-2'] } },
  { id: '3.8.2', framework: 'NIST-CMMC', family: 'MP', title: 'Limit access to CUI on media', description: 'Limit access to CUI on system media to authorized users.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-3'] } },
  { id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', title: 'Sanitize media before reuse/disposal', description: 'Sanitize or destroy system media containing CUI before disposal or release for reuse.', sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-6'] } },
  { id: '3.8.4', framework: 'NIST-CMMC', family: 'MP', title: 'Mark media with CUI markings', description: 'Mark system media containing CUI.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-3'] } },
  { id: '3.8.5', framework: 'NIST-CMMC', family: 'MP', title: 'Control access to media', description: 'Control access to system media and maintain accountability for media during transport outside of controlled areas.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['MP-4'] } },
  { id: '3.8.6', framework: 'NIST-CMMC', family: 'MP', title: 'Implement cryptographic mechanisms for CUI at rest', description: 'Implement cryptographic mechanisms to protect the confidentiality of CUI at rest.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-5'] } },
  { id: '3.8.7', framework: 'NIST-CMMC', family: 'MP', title: 'Control use of removable media', description: 'Control the use of removable media on organizational systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-7'] } },
  { id: '3.8.8', framework: 'NIST-CMMC', family: 'MP', title: 'Prohibit use of portable storage devices', description: 'Prohibit the use of portable storage devices when such devices have no identifiable owner.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-7(1)'] } },
  { id: '3.8.9', framework: 'NIST-CMMC', family: 'MP', title: 'Protect CUI on media during transport', description: 'Protect CUI on system media during transport outside of controlled areas.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-5(4)'] } },

  // 3.9 Personnel Security (2)
  { id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', title: 'Screen individuals prior to access', description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PS-3'] } },
  { id: '3.9.2', framework: 'NIST-CMMC', family: 'PS', title: 'Terminate access upon departure', description: 'Ensure that organizational systems containing CUI are protected during and after personnel actions such as terminations and transfers.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PS-4'] } },
  
  // 3.10 Physical Protection (6)
  { id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit physical access to systems', description: 'Limit physical access to organizational systems, equipment, and the respective operating environments.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['PE-2'] } },
  { id: '3.10.2', framework: 'NIST-CMMC', family: 'PE', title: 'Escort visitors and monitor visitor activity', description: 'Escort visitors and monitor visitor activity.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PE-3'] } },
  { id: '3.10.3', framework: 'NIST-CMMC', family: 'PE', title: 'Maintain audit logs of physical access', description: 'Maintain audit logs of physical access.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PE-3'] } },
  { id: '3.10.4', framework: 'NIST-CMMC', family: 'PE', title: 'Control and manage physical access devices', description: 'Control and manage physical access devices.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PE-4'] } },
  { id: '3.10.5', framework: 'NIST-CMMC', family: 'PE', title: 'Protect and monitor physical facility', description: 'Protect and monitor the physical facility and support infrastructure.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PE-5'] } },
  { id: '3.10.6', framework: 'NIST-CMMC', family: 'PE', title: 'Enforce safeguarding measures for CUI', description: 'Enforce safeguarding measures for CUI at alternate work sites.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PE-17'] } },

  // 3.11 Risk Assessment (3)
  { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Periodically assess risk', description: 'Periodically assess the risk to organizational operations resulting from the operation of organizational systems.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c','d','e']), mappings: { nist800_53: ['RA-3'] } },
  { id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', title: 'Scan for vulnerabilities', description: 'Scan for vulnerabilities in organizational systems and applications periodically.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c','d','e','f']), mappings: { nist800_53: ['RA-5'] } },
  { id: '3.11.3', framework: 'NIST-CMMC', family: 'RA', title: 'Remediate vulnerabilities', description: 'Remediate vulnerabilities in accordance with risk assessments.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['RA-5'] } },

  // 3.12 Security Assessment (4)
  { id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Periodically assess security controls', description: 'Periodically assess the security controls in organizational systems.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CA-2'] } },
  { id: '3.12.2', framework: 'NIST-CMMC', family: 'CA', title: 'Develop and implement plans of action', description: 'Develop and implement plans of action designed to correct deficiencies.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['CA-5'] } },
  { id: '3.12.3', framework: 'NIST-CMMC', family: 'CA', title: 'Monitor security controls on an ongoing basis', description: 'Monitor security controls on an ongoing basis to ensure continued effectiveness.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['CA-7'] } },
  { id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', title: 'Develop, document, and update system security plans', description: 'Develop, document, and periodically update system security plans.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['PL-2'] } },

  // 3.13 System and Communications Protection (27+)
  { id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Monitor and control communications at boundaries', description: 'Monitor, control, and protect communications at the external boundaries and key internal boundaries.', sprsWeight: 3, cmmcLevel: 1, objectives: createObjs(['a','b','c','d','e']), mappings: { nist800_53: ['SC-7'] } },
  { id: '3.13.5', framework: 'NIST-CMMC', family: 'SC', title: 'Public Access separation', description: 'Separate public access from internal network.', sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SC-7'] } },

  // 3.14 System and Information Integrity (7)
  { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Identify/remediate system flaws', description: 'Identify, report, and correct system flaws in a timely manner.', sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['SI-2'] } },
  { id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', title: 'Malicious code protection', description: 'Provide protection from malicious code at appropriate locations.', sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SI-3'] } },
  { id: '3.14.4', framework: 'NIST-CMMC', family: 'SI', title: 'Update malicious code protection', description: 'Update malicious code protection when new releases are available.', sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a']), mappings: { nist800_53: ['SI-3'] } },
  { id: '3.14.5', framework: 'NIST-CMMC', family: 'SI', title: 'System and file scanning', description: 'Scan for malicious code.', sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['SI-3'] } }
];

export const REQUIREMENTS_DATA: Requirement[] = [
  ...NIST_800_171_CONTROLS
];

export const TRAINING_MODULES: TrainingModule[] = [
  // --- CCP BLUEPRINT DOMAIN 1: THE ECOSYSTEM ---
  {
    id: 'ccp-1', familyId: 'CCP-D1', title: 'The CMMC Ecosystem',
    description: 'Understand roles, responsibilities, and the authority of the OUSD and CMMC-AB.',
    content: `
# Domain 1: CMMC Ecosystem (5% Exam Weight)

### 1. The OUSD(A&S) Authority
The Office of the Undersecretary of Defense for Acquisition and Sustainment (OUSD) is the authoritative source for CMMC documentation. They manage:
- Cybersecurity standards mapping across Levels 1-3.
- Regulation **DFARS 252.204-7012** which mandates verification.

### 2. Organizational Entities
- **OSC (Organization Seeking Certification):** The defense contractor being assessed.
- **C3PAO (Third-Party Assessment Organizations):** Authorized to conduct assessments.
- **RPO (Registered Provider Organizations):** Consultants who provide advice but *cannot* conduct certified assessments.
- **CAICO (Assessors & Instructors Certification Organization):** Manages individual credentials.

### 3. Individual Credentials
- **RP (Registered Practitioner):** Implementers and consultants.
- **CCP (Certified CMMC Professional):** You. Active team members in assessments.
- **CCA (Certified CMMC Assessor):** Lead assessors for Level 1-2.
- **CCI (Certified CMMC Instructor):** Licensed trainers.
    `,
    durationMinutes: 30, difficulty: 'Beginner'
  },

  // --- CCP BLUEPRINT DOMAIN 2: ETHICS ---
  {
    id: 'ccp-2', familyId: 'CCP-D2', title: 'Code of Professional Conduct (CoPC)',
    description: 'Master the Guiding Principles of Ethics, Objectivity, and Confidentiality.',
    content: `
# Domain 2: Code of Professional Conduct (5% Exam Weight)

The CMMC-AB Code of Professional Conduct (CoPC) defines the standard of practice for all ecosystem members.

### Key Ethics Pillars:
1. **Professionalism:** Maintaining technical competence and honoring agreements.
2. **Objectivity:** Independence in judgment. Avoid "Consult-to-Audit" conflicts of interest.
3. **Confidentiality:** Protecting OSC data and non-public assessment results.
4. **Information Integrity:** Ensuring audit logs and evidence are never altered or misrepresented.
5. **Contractual Integrity:** Adherence to NDAs and Lawful practices.

**Exam Tip:** Be prepared for scenarios where an assessor is offered a gift or asked to overlook a "minor" gap.
    `,
    durationMinutes: 20, difficulty: 'Intermediate'
  },

  // --- CCP BLUEPRINT DOMAIN 3: GOVERNANCE ---
  {
    id: 'ccp-3', familyId: 'CCP-D3', title: 'Governance & Regulatory Sources',
    description: 'FCI vs. CUI, DFARS clauses, and the CMMC v2.0 Model architecture.',
    content: `
# Domain 3: Governance (15% Exam Weight)

### 1. Data Classification
- **FCI (Federal Contract Information):** Information not intended for public release provided by or generated for the Government under contract.
- **CUI (Controlled Unclassified Information):** Sensitive information that requires safeguarding but isn't classified. (NARA CUI Registry).

### 2. Regulations
- **DFARS 252.204-7012:** Requirement to protect CUI and report cyber incidents.
- **32 CFR Part 170:** The actual CMMC Rulemaking.
- **False Claims Act:** Legal consequences for misrepresenting compliance posture.

### 3. CMMC v2.0 Levels
- **Level 1 (Foundational):** 17 Practices (FAR 52.204-21). Annual Self-Assessment.
- **Level 2 (Advanced):** 110 Practices (NIST SP 800-171). Triennial Third-Party or Self-Assessment.
- **Level 3 (Expert):** 110+ Practices (NIST SP 800-172). Government-led assessments.
    `,
    durationMinutes: 45, difficulty: 'Intermediate'
  },

  // --- CCP BLUEPRINT DOMAIN 4 / CONTROL FAMILY DEEP-DIVES ---
  {
    id: 'master-ac', familyId: 'AC', title: 'Access Control (Family Deep-Dive)',
    description: 'In-depth training on 22 practices (3.1.1 to 3.1.22) including Logical and Physical boundaries.',
    content: `
# CMMC Domain: Access Control (AC)
This is the largest domain in the CMMC model, focusing on the principle of Least Privilege.

### Key Practices Overview:
- **3.1.1/3.1.2 (L1):** Limit access to authorized users and transactions. *Evidence: HR Onboarding logs, AD Group assignments.*
- **3.1.3 (L2):** Control the flow of CUI. *Evidence: Data flow diagrams, Firewall ACLs.*
- **3.1.12 (L2):** Monitor and control remote access sessions. *Evidence: VPN logs, MFA enforcement.*
- **3.1.18 (L2):** Mobile device management. *Evidence: MDM policy, encrypted work profiles.*

### Assessment Methodology:
- **Examine:** System logs and AD configurations.
- **Interview:** System Admins on how they handle user termination.
- **Test:** Verify that a disabled account cannot log in.
    `,
    durationMinutes: 60, difficulty: 'Advanced'
  },

  {
    id: 'master-si', familyId: 'SI', title: 'System & Info Integrity (Deep-Dive)',
    description: 'Training on 7 practices (3.14.1 to 3.14.7) including Malicious Code protection and Flaw remediation.',
    content: `
# CMMC Domain: System & Information Integrity (SI)
Focuses on monitoring, maintenance, and the detection of unauthorized changes.

### Key Practices:
- **3.14.1 (L1):** Flaw remediation (Patching). *Evidence: WSUS/SCCM reports showing critical patches < 30 days old.*
- **3.14.2 (L1):** Malicious code protection (Antivirus). *Evidence: Centralized AV dashboard.*
- **3.14.3 (L2):** Monitor security alerts. *Evidence: Subscription to CISA/Vendor mailing lists.*

### CCP Task 4.1:
Given a scenario (e.g., an unpatched server), you must identify which SI control is missing and determine if the compensating control (e.g., air-gapping) is sufficient evidence for compliance.
    `,
    durationMinutes: 40, difficulty: 'Advanced'
  },

  // --- CCP BLUEPRINT DOMAIN 5: ASSESSMENT PROCESS ---
  {
    id: 'ccp-5', familyId: 'CCP-D5', title: 'CMMC Assessment Process (CAP)',
    description: 'Master Phase 1 (Plan), Phase 2 (Conduct), and Phase 3 (Report).',
    content: `
# Domain 5: CMMC Assessment Process (25% Exam Weight)

### Phase 1: Plan and Prepare
- Reviewing the System Security Plan (SSP).
- Defining the Assessment Plan.
- Conducting the Readiness Review.

### Phase 2: Conduct Assessment
- **Methods:** Examine, Interview, Test.
- **Evidence Quality:** Accuracy, Completeness, Timeliness.
- **Scoring:** Met, Not Met, Not Applicable.

### Phase 3: Report Results
- Draft Findings vs. Final Findings.
- Submission to the C3PAO and eventually the eMASS/CMMC Database.

### Phase 4: POA&M Evaluation
- Understanding qualifying POA&M items.
- Minimum assessment score (80% rule) for interim certification.
    `,
    durationMinutes: 50, difficulty: 'Advanced'
  },

  // --- CCP BLUEPRINT DOMAIN 6: SCOPING ---
  {
    id: 'ccp-6', familyId: 'CCP-D6', title: 'High-Level Scoping Methodology',
    description: 'Categorizing assets: CUI Assets, SPA, CRMA, and Specialized Assets.',
    content: `
# Domain 6: Scoping (15% Exam Weight)

Scoping is the foundation of any assessment. If scoping is wrong, the audit is invalid.

### Asset Categories:
1. **CUI Assets:** Process, store, or transmit CUI. Full NIST 800-171 applies.
2. **Security Protection Assets (SPA):** Assets providing security to CUI (e.g., Firewall, SIEM). NIST 800-171 applies to their management.
3. **Contractor Risk Managed Assets (CRMA):** Do not process CUI but are on the same network. Focus on segmentation.
4. **Specialized Assets:** OT, IoT, Government Property. Usually handled via documentation/policy.
5. **Out-of-Scope Assets:** Physically or logically separated from the CUI environment.

**Task:** analyze a network diagram to identify the Assessment Boundary.
    `,
    durationMinutes: 40, difficulty: 'Advanced'
  }
];

export const createInitialClientData = (isParent: boolean): ClientData => ({
  targetCmmcLevel: 2, // Default to Advanced
  requirements: JSON.parse(JSON.stringify(REQUIREMENTS_DATA)),
  assets: [],
  users: [],
  artifacts: [],
  risks: [],
  vendors: [],
  tickets: [],
  tasks: [],
  budgetItems: [],
  wizardProgress: { currentStep: 'INTRO', currentQuestionIndex: 0 },
  sspMetadata: {
    systemName: '', systemIdentifier: '', categorization: 'LOW', systemOwner: '', authorizingOfficial: '',
    otherDesignatedContacts: '', assignmentOfSecurityResponsibility: '', operationalStatus: 'Operational',
    systemType: 'General Support System', generalDescription: '', systemEnvironment: '', interconnections: '',
    lawsAndPolicies: '', completionDate: '', approvalDate: ''
  },
  m365Config: { enabled: false },
  intuneConfig: { enabled: false },
  adConfig: { enabled: false },
  cwConfig: { companyId: '', publicKey: '', privateKey: '', siteUrl: '', serviceBoard: '', enabled: false },
  jiraConfig: { baseUrl: '', email: '', apiToken: '', projectKey: '', issueType: 'Task', enabled: false },
  confluenceConfig: { baseUrl: '', spaceKey: '', enabled: false },
  auvikConfig: { apiKey: '', tenantId: '', region: 'US', enabled: false },
  awsConfig: { enabled: false },
  googleConfig: { enabled: false },
  siemConfig: { enabled: false },
  defenderConfig: { enabled: false },
  s1Config: { enabled: false }
});