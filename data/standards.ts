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

export const ACADEMY_PHASES = [
  { id: 'PH1', name: 'The Foundation', icon: 'BookOpen' },
  { id: 'PH2', name: 'Scoping & Strategy', icon: 'Target' },
  { id: 'PH3', name: 'The 14 Domains (Technical)', icon: 'Shield' },
  { id: 'PH4', name: 'Documentation & Narrative', icon: 'FileText' },
  { id: 'PH5', name: 'The CAP Process (v2.0)', icon: 'ShieldCheck' },
  { id: 'PH6', name: 'Tabletop Simulations (TTX)', icon: 'Dices' }
];

const createObjs = (ids: string[]) => ids.map(id => ({ id, description: `Verify assessment objective [${id}] for this control requirement per NIST 800-171A methodology.`, status: 'pending' as const }));

const NIST_800_171_CONTROLS: Requirement[] = [
  { id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b','c','d','e','f']), mappings: { nist800_53: ['AC-2'] } },
  { id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Limit access to transactions/functions', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-6'] } },
  { id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control the flow of CUI', description: 'Control the flow of CUI in accordance with approved authorizations.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-4'] } },
  { id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separate duties of individuals', description: 'Separate duties of individuals to reduce the risk of malevolent activity without collusion.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-5'] } },
  { id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', title: 'Employ least privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-6'] } },
  { id: '3.1.6', framework: 'NIST-CMMC', family: 'AC', title: 'Use non-privileged accounts for general functions', description: 'Use non-privileged accounts or roles when accessing non-security functions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-6(2)'] } },
  { id: '3.1.7', framework: 'NIST-CMMC', family: 'AC', title: 'Prevent non-privileged users from executing privileged functions', description: 'Prevent non-privileged users from executing privileged functions and audit use of privileged functions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-6(5)'] } },
  { id: '3.1.8', framework: 'NIST-CMMC', family: 'AC', title: 'Limit unsuccessful logon attempts', description: 'Limit unsuccessful logon attempts.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-7'] } },
  { id: '3.1.9', framework: 'NIST-CMMC', family: 'AC', title: 'Provide privacy/security notices', description: 'Provide privacy and security notices consistent with applicable CUI rules.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-8'] } },
  { id: '3.1.10', framework: 'NIST-CMMC', family: 'AC', title: 'Use session lock with pattern hiding', description: 'Use session lock with pattern hiding to prevent access and viewing of data after period of inactivity.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-11'] } },
  { id: '3.1.11', framework: 'NIST-CMMC', family: 'AC', title: 'Terminate sessions after conditions', description: 'Terminate (automatically) a user session after a defined condition.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-12'] } },
  { id: '3.1.12', framework: 'NIST-CMMC', family: 'AC', title: 'Monitor and control remote access', description: 'Monitor and control remote access sessions.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AC-17'] } },
  { id: '3.1.13', framework: 'NIST-CMMC', family: 'AC', title: 'Use cryptographic mechanisms for remote sessions', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-17(2)'] } },
  { id: '3.1.14', framework: 'NIST-CMMC', family: 'AC', title: 'Route remote access via managed points', description: 'Route remote access via managed access control points.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['AC-17(3)'] } },
  { id: '3.1.15', framework: 'NIST-CMMC', family: 'AC', title: 'Authorize remote access for privileged commands', description: 'Authorize remote access for privileged commands and security-relevant information.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-17(4)'] } },
  { id: '3.1.16', framework: 'NIST-CMMC', family: 'AC', title: 'Authorize wireless access', description: 'Authorize wireless access prior to allowing such connections.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-18'] } },
  { id: '3.1.17', framework: 'NIST-CMMC', family: 'AC', title: 'Protect wireless access with auth/encryption', description: 'Protect wireless access using authentication and encryption.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-18(1)'] } },
  { id: '3.1.18', framework: 'NIST-CMMC', family: 'AC', title: 'Control mobile device connections', description: 'Control connection of mobile devices.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-19'] } },
  { id: '3.1.19', framework: 'NIST-CMMC', family: 'AC', title: 'Encrypt CUI on mobile devices', description: 'Encrypt CUI on mobile devices and mobile computing platforms.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-19(5)'] } },
  { id: '3.1.20', framework: 'NIST-CMMC', family: 'AC', title: 'Verify and control use of external systems', description: 'Verify and control use of external organizational systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c','d']), mappings: { nist800_53: ['AC-20'] } },
  { id: '3.1.21', framework: 'NIST-CMMC', family: 'AC', title: 'Limit use of portable storage on external systems', description: 'Limit use of organizational portable storage devices on external systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AC-20(2)'] } },
  { id: '3.1.22', framework: 'NIST-CMMC', family: 'AC', title: 'Control public information posting', description: 'Control information posted or processed on publicly accessible systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c','d']), mappings: { nist800_53: ['AC-22'] } },
  { id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Role-based security awareness', description: 'Ensure that managers, systems administrators, and users are made aware of the security risks.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AT-2'] } },
  { id: '3.2.2', framework: 'NIST-CMMC', family: 'AT', title: 'Adequate security training', description: 'Ensure that personnel are adequately trained to carry out their assigned duties.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AT-3'] } },
  { id: '3.2.3', framework: 'NIST-CMMC', family: 'AT', title: 'Provide insider threat awareness', description: 'Provide awareness training on recognizing and reporting potential indicators of insider threat.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['AT-2(2)'] } },
  { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'Create and retain audit logs', description: 'Create and retain system audit logs and records.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AU-2'] } },
  { id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'Trace individual user actions', description: 'Ensure that the actions of individual system users can be uniquely traced.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['AU-3'] } },
  { id: '3.3.3', framework: 'NIST-CMMC', family: 'AU', title: 'Review and update audit logs', description: 'Review and update audited events.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-2(3)'] } },
  { id: '3.3.4', framework: 'NIST-CMMC', family: 'AU', title: 'Alert in event of audit failure', description: 'Alert designated personnel in the event of an audit logging process failure.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-5'] } },
  { id: '3.3.5', framework: 'NIST-CMMC', family: 'AU', title: 'Correlate audit record review', description: 'Use automated mechanisms to integrate and correlate audit and reporting functions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['AU-6'] } },
  { id: '3.3.6', framework: 'NIST-CMMC', family: 'AU', title: 'Review audit records for indications', description: 'Review audit records for indications of inappropriate activity.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['AU-6(1)'] } },
  { id: '3.3.7', framework: 'NIST-CMMC', family: 'AU', title: 'Sync system clocks', description: 'Provide a system-wide time source used to synchronize internal system clocks.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-8'] } },
  { id: '3.3.8', framework: 'NIST-CMMC', family: 'AU', title: 'Protect audit information', description: 'Protect audit information and audit logging tools.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-9'] } },
  { id: '3.3.9', framework: 'NIST-CMMC', family: 'AU', title: 'Limit management of audit logging', description: 'Limit management of audit logging functionality to a subset of privileged users.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['AU-9(4)'] } },
  { id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'Establish baseline configurations', description: 'Establish and maintain baseline configurations and inventories.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['CM-2'] } },
  { id: '3.4.2', framework: 'NIST-CMMC', family: 'CM', title: 'Enforce security configuration settings', description: 'Establish and enforce security configuration settings for IT products.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-6'] } },
  { id: '3.4.3', framework: 'NIST-CMMC', family: 'CM', title: 'Track and approve changes', description: 'Track, review, approve, and audit changes to organizational systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c','d','e']), mappings: { nist800_53: ['CM-3'] } },
  { id: '3.4.4', framework: 'NIST-CMMC', family: 'CM', title: 'Analyze security impact of changes', description: 'Analyze the security impact of changes prior to implementation.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['CM-4'] } },
  { id: '3.4.5', framework: 'NIST-CMMC', family: 'CM', title: 'Restrict access to change management', description: 'Define, document, and approve any deviations from the baseline.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-5'] } },
  { id: '3.4.6', framework: 'NIST-CMMC', family: 'CM', title: 'Employ least functionality', description: 'Configure systems to provide only essential capabilities.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['CM-7'] } },
  { id: '3.4.7', framework: 'NIST-CMMC', family: 'CM', title: 'Restrict non-essential software', description: 'Restrict, disable, or prevent the use of non-essential programs/services.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-7(1)'] } },
  { id: '3.4.8', framework: 'NIST-CMMC', family: 'CM', title: 'Apply deny-by-exception for software', description: 'Apply deny-by-exception (blacklisting) or allow-by-exception (whitelisting).', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-7(2)'] } },
  { id: '3.4.9', framework: 'NIST-CMMC', family: 'CM', title: 'Control user-installed software', description: 'Control and monitor user-installed software.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CM-11'] } },
  { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identify system users/devices', description: 'Identify system users, processes acting on behalf of users, or devices.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-2'] } },
  { id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', title: 'Authenticate users/devices', description: 'Authenticate the identities of users, processes, or devices.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-2'] } },
  { id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Multi-Factor Authentication (MFA)', description: 'Use multi-factor authentication for local and network access.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c','d']), mappings: { nist800_53: ['IA-2(1)'] } },
  { id: '3.5.4', framework: 'NIST-CMMC', family: 'IA', title: 'Employ replay-resistant authentication', description: 'Employ replay-resistant authentication mechanisms for network access.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-2(8)'] } },
  { id: '3.5.5', framework: 'NIST-CMMC', family: 'IA', title: 'Prevent password reuse', description: 'Prevent reuse of identifiers for a defined period.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-4'] } },
  { id: '3.5.6', framework: 'NIST-CMMC', family: 'IA', title: 'Disable identifiers after inactivity', description: 'Disable identifiers after a defined period of inactivity.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-4'] } },
  { id: '3.5.7', framework: 'NIST-CMMC', family: 'IA', title: 'Enforce password complexity', description: 'Enforce minimum password complexity and change of characters.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c','d','e']), mappings: { nist800_53: ['IA-5(1)'] } },
  { id: '3.5.8', framework: 'NIST-CMMC', family: 'IA', title: 'Prohibit password discovery', description: 'Prohibit password discovery and ensure password encryption.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-5(1)'] } },
  { id: '3.5.9', framework: 'NIST-CMMC', family: 'IA', title: 'Allow temporary passwords', description: 'Allow temporary password use that is replaced after first use.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-5(1)'] } },
  { id: '3.5.10', framework: 'NIST-CMMC', family: 'IA', title: 'Store/transmit only encrypted passwords', description: 'Store and transmit only cryptographically-protected passwords.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['IA-5(1)'] } },
  { id: '3.5.11', framework: 'NIST-CMMC', family: 'IA', title: 'Obscure feedback during authentication', description: 'Obscure feedback during authentication process.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['IA-6'] } },
  { id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', title: 'Establish incident handling capability', description: 'Establish an operational incident-handling capability.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['IR-4'] } },
  { id: '3.6.2', framework: 'NIST-CMMC', family: 'IR', title: 'Track and report incidents', description: 'Track, document, and report incidents to designated authorities.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c','d']), mappings: { nist800_53: ['IR-5','IR-6'] } },
  { id: '3.6.3', framework: 'NIST-CMMC', family: 'IR', title: 'Test incident response capability', description: 'Test the organizational incident response capability.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['IR-3'] } },
  { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'Perform periodic system maintenance', description: 'Perform periodic and timely maintenance on organizational systems.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MA-2'] } },
  { id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', title: 'Provide controls on maintenance tools', description: 'Provide controls on the tools, techniques, and mechanisms used.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c','d']), mappings: { nist800_53: ['MA-3'] } },
  { id: '3.7.3', framework: 'NIST-CMMC', family: 'MA', title: 'Sanitize equipment for maintenance', description: 'Ensure that equipment is sanitized to remove all CUI before being taken off-site.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MA-2'] } },
  { id: '3.7.4', framework: 'NIST-CMMC', family: 'MA', title: 'Require non-local maintenance auth', description: 'Check media containing diagnostic test programs for malicious code.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MA-4'] } },
  { id: '3.7.5', framework: 'NIST-CMMC', family: 'MA', title: 'Multi-factor auth for remote maintenance', description: 'Require multi-factor authentication to establish non-local maintenance sessions.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MA-4'] } },
  { id: '3.7.6', framework: 'NIST-CMMC', family: 'MA', title: 'Supervise maintenance personnel', description: 'Supervise the maintenance activities of personnel without required access auth.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MA-5'] } },
  { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Protect system media', description: 'Protect system media containing CUI, both paper and digital.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-2'] } },
  { id: '3.8.2', framework: 'NIST-CMMC', family: 'MP', title: 'Limit access to CUI on media', description: 'Limit access to CUI on organizational system media to authorized users.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-3'] } },
  { id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', title: 'Sanitize media for reuse', description: 'Sanitize or destroy system media containing CUI before disposal.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-6'] } },
  { id: '3.8.4', framework: 'NIST-CMMC', family: 'MP', title: 'Mark media with CUI', description: 'Mark system media with necessary CUI markings.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-3'] } },
  { id: '3.8.5', framework: 'NIST-CMMC', family: 'MP', title: 'Control inventory of media', description: 'Control and inventory storage media.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-4'] } },
  { id: '3.8.6', framework: 'NIST-CMMC', family: 'MP', title: 'Limit use of external portable storage', description: 'Limit use of organizational portable storage devices on external systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-7'] } },
  { id: '3.8.7', framework: 'NIST-CMMC', family: 'MP', title: 'Control CUI transport', description: 'Control access to system media containing CUI during transport.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-5'] } },
  { id: '3.8.8', framework: 'NIST-CMMC', family: 'MP', title: 'Maintain accountability of CUI transport', description: 'Maintain accountability for system media containing CUI during transport.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['MP-5'] } },
  { id: '3.8.9', framework: 'NIST-CMMC', family: 'MP', title: 'Protect CUI in secondary storage', description: 'Protect the confidentiality of backup CUI at storage locations.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['MP-4'] } },
  { id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', title: 'Screen individuals for CUI access', description: 'Screen individuals prior to authorizing access to systems containing CUI.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['PS-3'] } },
  { id: '3.9.2', framework: 'NIST-CMMC', family: 'PS', title: 'Revoke access upon termination', description: 'Ensure that systems containing CUI are protected during personnel actions (transfers/terminations).', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c','d']), mappings: { nist800_53: ['PS-4','PS-5'] } },
  { id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit physical access', description: 'Limit physical access to organizational systems and equipment to authorized individuals.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['PE-2'] } },
  { id: '3.10.2', framework: 'NIST-CMMC', family: 'PE', title: 'Escort visitors', description: 'Escort visitors and monitor visitor activity.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PE-3'] } },
  { id: '3.10.3', framework: 'NIST-CMMC', family: 'PE', title: 'Maintain visitor logs', description: 'Maintain audit logs of physical access.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PE-3'] } },
  { id: '3.10.4', framework: 'NIST-CMMC', family: 'PE', title: 'Control physical access devices', description: 'Control physical access devices (keys, badges, locks).', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PE-3'] } },
  { id: '3.10.5', framework: 'NIST-CMMC', family: 'PE', title: 'Monitor physical facility', description: 'Monitor the physical facility and support infrastructure.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['PE-6'] } },
  { id: '3.10.6', framework: 'NIST-CMMC', family: 'PE', title: 'Enforce physical access to CUI output', description: 'Enforce physical access controls for publicly accessible CUI output devices.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['PE-5'] } },
  { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Periodically assess risk', description: 'Periodically assess the risk to organizational operations resulting from system operation.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c','d','e']), mappings: { nist800_53: ['RA-3'] } },
  { id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', title: 'Scan for system vulnerabilities', description: 'Scan for vulnerabilities in systems and applications periodically.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['RA-5'] } },
  { id: '3.11.3', framework: 'NIST-CMMC', family: 'RA', title: 'Remediate vulnerabilities', description: 'Remediate vulnerabilities in accordance with risk assessments.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['RA-5'] } },
  { id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Periodically assess security controls', description: 'Periodically assess the security controls in organizational systems.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CA-2'] } },
  { id: '3.12.2', framework: 'NIST-CMMC', family: 'CA', title: 'Develop and update POA&M', description: 'Develop and implement plans of action designed to correct deficiencies.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['CA-5'] } },
  { id: '3.12.3', framework: 'NIST-CMMC', family: 'CA', title: 'Monitor security controls', description: 'Monitor organizational system security controls on an ongoing basis.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['CA-7'] } },
  { id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', title: 'Develop and update SSP', description: 'Develop, document, and periodically update system security plans (SSP).', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b','c','d','e']), mappings: { nist800_53: ['PL-2'] } },
  { id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Separate system architecture', description: 'Monitor, control, and protect organizational communications at external/internal boundaries.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SC-7'] } },
  { id: '3.13.2', framework: 'NIST-CMMC', family: 'SC', title: 'Employ architectural separation', description: 'Employ architectural designs, software development techniques, and systems engineering.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-2'] } },
  { id: '3.13.3', framework: 'NIST-CMMC', family: 'SC', title: 'Isolate security functions', description: 'Isolate security functions from non-security functions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SC-3'] } },
  { id: '3.13.4', framework: 'NIST-CMMC', family: 'SC', title: 'Prevent shared resource info leakage', description: 'Prevent inadvertent and unauthorized disclosure of CUI via shared system resources.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-4'] } },
  { id: '3.13.5', framework: 'NIST-CMMC', family: 'SC', title: 'Deny network traffic by default', description: 'Deny network communications traffic by default and allow traffic by exception.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-7(5)'] } },
  { id: '3.13.6', framework: 'NIST-CMMC', family: 'SC', title: 'Prevent split-tunneling for remote access', description: 'Prevent remote devices from simultaneously establishing non-remote and remote connections.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-7(7)'] } },
  { id: '3.13.7', framework: 'NIST-CMMC', family: 'SC', title: 'Prevent unauthorized info transfer', description: 'Prevent unauthorized and unintended information transfer via shared system resources.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-8'] } },
  { id: '3.13.8', framework: 'NIST-CMMC', family: 'SC', title: 'Employ cryptopgrahic mechanisms', description: 'Employ cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission.', sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SC-8(1)'] } },
  { id: '3.13.9', framework: 'NIST-CMMC', family: 'SC', title: 'Terminate network connections', description: 'Terminate network connections associated with communications sessions.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SC-10'] } },
  { id: '3.13.10', framework: 'NIST-CMMC', family: 'SC', title: 'Establish trusted paths for authentication', description: 'Establish and manage cryptographic keys for required cryptography.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SC-12'] } },
  { id: '3.13.11', framework: 'NIST-CMMC', family: 'SC', title: 'Employ FIPS-validated cryptography', description: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SC-13'] } },
  { id: '3.13.12', framework: 'NIST-CMMC', family: 'SC', title: 'Prohibit remote activation of collab devices', description: 'Prohibit remote activation of collaborative computing devices.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SC-15'] } },
  { id: '3.13.13', framework: 'NIST-CMMC', family: 'SC', title: 'Control mobile code use', description: 'Control and monitor the use of mobile code.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['SC-18'] } },
  { id: '3.13.14', framework: 'NIST-CMMC', family: 'SC', title: 'Control VOIP technologies', description: 'Control and monitor the use of VOIP technologies.', sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['SC-19'] } },
  { id: '3.13.15', framework: 'NIST-CMMC', family: 'SC', title: 'Protect authenticity of communications', description: 'Protect the authenticity of communications sessions.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-23'] } },
  { id: '3.13.16', framework: 'NIST-CMMC', family: 'SC', title: 'Protect data at rest', description: 'Protect the confidentiality of CUI at rest.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['SC-28'] } },
  { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Identify and correct system flaws', description: 'Identify, report, and correct system flaws in a timely manner.', sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['SI-2'] } },
  { id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', title: 'Provide malware protection', description: 'Provide protection from malicious code at appropriate locations.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b','c']), mappings: { nist800_53: ['SI-3'] } },
  { id: '3.14.3', framework: 'NIST-CMMC', family: 'SI', title: 'Monitor for indicators of attack', description: 'Monitor system security alerts and advisories.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SI-4'] } },
  { id: '3.14.4', framework: 'NIST-CMMC', family: 'SI', title: 'Update malware protection', description: 'Update malicious code protection mechanisms when new releases are available.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a']), mappings: { nist800_53: ['SI-3'] } },
  { id: '3.14.5', framework: 'NIST-CMMC', family: 'SI', title: 'Perform periodic system scans', description: 'Perform periodic scans of organizational systems and real-time scans of files from external sources.', sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a','b']), mappings: { nist800_53: ['SI-3'] } },
  { id: '3.14.6', framework: 'NIST-CMMC', family: 'SI', title: 'Monitor system for unauthorized use', description: 'Monitor organizational systems, including inbound and outbound communications traffic.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a','b','c','d','e']), mappings: { nist800_53: ['SI-4'] } },
  { id: '3.14.7', framework: 'NIST-CMMC', family: 'SI', title: 'Identify unauthorized use', description: 'Identify unauthorized use of organizational systems.', sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']), mappings: { nist800_53: ['SI-4'] } }
];

export const REQUIREMENTS_DATA: Requirement[] = [
  ...NIST_800_171_CONTROLS
];

export interface SimulationInject {
    id: string;
    title: string;
    scenario: string;
    question: string;
    regulatoryHint: string;
}

export interface SimulationModule extends TrainingModule {
    isSimulation: boolean;
    injects: SimulationInject[];
    executiveFocus: string;
}

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  {
    id: 'fnd-1', familyId: 'PH1', title: 'CMMC v2.0 Architecture',
    description: 'Understand the transition from v1.0 to v2.0 and the 3-tier model.',
    content: `# Module 1: The CMMC 2.0 Ecosystem...`,
    durationMinutes: 20, difficulty: 'Beginner'
  },
  {
    id: 'cap-1', familyId: 'PH5', title: 'Phase 1: Pre-Assessment Preparation',
    description: 'Master the prerequisites for a C3PAO engagement, including SSP review and scoping validation.',
    content: `# The CMMC Assessment Process (CAP) v2.0 - Phase 1
    
Before a formal audit begins, the C3PAO and the Lead CCA must perform critical pre-assessment activities to verify your readiness.

## Key Deliverables for Phase 1:
- **System Security Plan (SSP)**: Must be complete, accurate, and consistent.
- **Scope Confirmation**: Verify all CUI, SPA, CRMA, and Specialized Assets are documented.
- **Evidence Availability**: You must prove to the Assessor that evidence is accessible for all 110 controls.

## What the Implementer must know:
The Lead CCA will make a **Readiness Determination**. If you are not ready, the assessment may be suspended or postponed. Do not enter Phase 1 until your SSP is fully mature.`,
    durationMinutes: 25, difficulty: 'Intermediate'
  },
  {
    id: 'cap-2', familyId: 'PH5', title: 'Phase 2: The Assessment Engagement',
    description: 'Expectations for the In-Brief meeting, focused sampling, and the assessment methodology (Examine, Interview, Test).',
    content: `# The CMMC Assessment Process (CAP) v2.0 - Phase 2
    
Phase 2 is the actual "audit" where the CCA evaluates conformity to NIST SP 800-171A.

## The In-Brief Meeting:
- Set assessment objectives and schedule.
- Introduce key OSC personnel and Assessor team.
- Confirm Assessment Scope.

## Scoring Methodology (32 CFR §170.24):
- **MET**: Finding satisfies all objectives.
- **NOT MET**: Any objective is unmet.
- **N/A**: Scope exclusions confirmed.

## Assessment Methods:
Assessors will use a nonstatistical sampling approach focused on depth and coverage. You must be prepared for:
1. **Examine**: Reviewing logs, configs, and policies.
2. **Interview**: CCAs will talk to your staff (SysAdmins, HR, Managers).
3. **Test**: Direct verification of security settings.`,
    durationMinutes: 30, difficulty: 'Advanced'
  },
  {
    id: 'cap-3', familyId: 'PH5', title: 'Phase 3 & 4: Reporting & Certification',
    description: 'The Out-Brief process, eMASS upload requirements, and issuing the Certificate of CMMC Status.',
    content: `# The CMMC Assessment Process (CAP) v2.0 - Final Phases
    
After the fieldwork is done, the results are processed through quality assurance.

## Phase 3: Reporting
- **Out-Brief Meeting**: CCA presents the final findings.
- **eMASS Upload**: The C3PAO uploads your hashed artifacts and results into the DoD's system of record.
- **Quality Assurance**: An independent QA individual at the C3PAO reviews the file before finalizing.

## Phase 4: Certification
- **Final Certificate**: Issued if all requirements are MET.
- **Conditional Certificate**: Issued if a valid POA&M exists for allowed controls.
- **Close-Out**: You have a limited window to close POA&M items to reach "Final" status.`,
    durationMinutes: 15, difficulty: 'Intermediate'
  },
  {
    id: 'ttx-1', 
    familyId: 'PH6', 
    title: 'Sim: The 72-Hour Clock',
    description: 'Test your DC3/DIBNet reporting response.',
    isSimulation: true,
    executiveFocus: 'Incident Response',
    injects: [
        { id: 'inj-1', title: 'Discovery', scenario: 'Large exfiltration event detected.', question: 'Who is notified?', regulatoryHint: 'DFARS 252.204-7012' }
    ],
    content: `# Tabletop Exercise...`,
    durationMinutes: 45, difficulty: 'Advanced'
  }
];

export const createInitialClientData = (isParent: boolean): ClientData => ({
  targetCmmcLevel: 2, 
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