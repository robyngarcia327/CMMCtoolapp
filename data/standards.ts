import { Requirement, Framework, ClientData, TrainingModule, SimulationModule } from '../types';

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
  { id: 'PH6', name: 'Tabletop Simulations (TTX)', icon: 'Dices' },
  { id: 'PH7', name: 'Risk Management Framework (RMF)', icon: 'ShieldAlert' }
];

// NIST SP 800-37 Revision 2 Task Registry
export const RMF_TASKS = [
    { id: 'P-1', step: 'P', name: 'Risk Management Roles', description: 'Identify and assign individuals to specific roles for security and privacy risk management.', role: 'Head of Agency / CIO' },
    { id: 'P-2', step: 'P', name: 'Risk Management Strategy', description: 'Establish a risk management strategy for the organization including a determination of risk tolerance.', role: 'Head of Agency' },
    { id: 'P-3', step: 'P', name: 'Risk Assessment - Organization', description: 'Assess organization-wide security and privacy risk and update on an ongoing basis.', role: 'Risk Executive' },
    { id: 'P-11', step: 'P', name: 'Authorization Boundary', description: 'Determine the authorization boundary of the system.', role: 'Authorizing Official' },
    { id: 'C-1', step: 'C', name: 'System Description', description: 'Document the characteristics of the system.', role: 'System Owner' },
    { id: 'C-2', step: 'C', name: 'Security Categorization', description: 'Categorize the system and document the results based on CIA impact.', role: 'System Owner' },
    { id: 'S-1', step: 'S', name: 'Control Selection', description: 'Select the controls for the system and the environment of operation.', role: 'System Owner' },
    { id: 'I-1', step: 'I', name: 'Control Implementation', description: 'Implement the controls in the security and privacy plans.', role: 'System Owner' },
    { id: 'A-2', step: 'A', name: 'Assessment Plan', description: 'Develop, review, and approve plans to assess implemented controls.', role: 'Authorizing Official' },
    { id: 'R-2', step: 'R', name: 'Risk Analysis and Determination', description: 'Analyze and determine the risk from the operation or use of the system.', role: 'Authorizing Official' },
    { id: 'M-1', step: 'M', name: 'System and Environment Changes', description: 'Monitor the system and its environment for changes impacting posture.', role: 'System Owner' }
];

// Helper to generate objectives
const genObjs = (id: string, count: number) => 
    Array.from({ length: count }, (_, i) => ({ 
        id: String.fromCharCode(97 + i), 
        description: `Requirement objective ${id}[${String.fromCharCode(97 + i)}] is satisfied.`, 
        status: 'pending' as const 
    }));

/** 
 * FULL 110 NIST 800-171 PRACTICES 
 * Every item required for Level 2 CMMC is listed here.
 */
export const REQUIREMENTS_DATA: Requirement[] = [
    // 3.1 ACCESS CONTROL (AC) - 22 Controls
    { id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', cmmcLevel: 1, sprsWeight: 1, objectives: genObjs('3.1.1', 2), mappings: { nist800_53: ['AC-2'] } },
    { id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Limit access to types of transactions', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', cmmcLevel: 1, sprsWeight: 1, objectives: genObjs('3.1.2', 2), mappings: { nist800_53: ['AC-3'] } },
    { id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control CUI Flow', description: 'Control the flow of CUI in accordance with approved authorizations.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.3', 2), mappings: { nist800_53: ['AC-4'] } },
    { id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separate duties', description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.4', 2), mappings: { nist800_53: ['AC-5'] } },
    { id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', title: 'Least privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.5', 4), mappings: { nist800_53: ['AC-6'] } },
    { id: '3.1.6', framework: 'NIST-CMMC', family: 'AC', title: 'Non-privileged accounts for general use', description: 'Use non-privileged accounts or roles when accessing non-security functions.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.6', 2), mappings: { nist800_53: ['AC-6(2)'] } },
    { id: '3.1.7', framework: 'NIST-CMMC', family: 'AC', title: 'Privileged account audits', description: 'Prevent non-privileged users from executing privileged functions and audit the execution of such functions.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.7', 2), mappings: { nist800_53: ['AC-6(5)'] } },
    { id: '3.1.8', framework: 'NIST-CMMC', family: 'AC', title: 'Limit logon attempts', description: 'Limit unsuccessful logon attempts.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.8', 2), mappings: { nist800_53: ['AC-7'] } },
    { id: '3.1.9', framework: 'NIST-CMMC', family: 'AC', title: 'Logon notifications', description: 'Provide privacy and security notices consistent with applicable policies and standards.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.9', 2), mappings: { nist800_53: ['AC-8'] } },
    { id: '3.1.10', framework: 'NIST-CMMC', family: 'AC', title: 'Session lock', description: 'Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.10', 3), mappings: { nist800_53: ['AC-11'] } },
    { id: '3.1.11', framework: 'NIST-CMMC', family: 'AC', title: 'Terminate sessions', description: 'Terminate (automatically) a user session after a defined condition.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.11', 2), mappings: { nist800_53: ['AC-12'] } },
    { id: '3.1.12', framework: 'NIST-CMMC', family: 'AC', title: 'Control remote access', description: 'Monitor and control remote access sessions.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.12', 5), mappings: { nist800_53: ['AC-17'] } },
    { id: '3.1.13', framework: 'NIST-CMMC', family: 'AC', title: 'Remote access encryption', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.13', 2), mappings: { nist800_53: ['AC-17(2)'] } },
    { id: '3.1.14', framework: 'NIST-CMMC', family: 'AC', title: 'Remote access routing', description: 'Route remote access via managed access control points.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.14', 1), mappings: { nist800_53: ['AC-17(3)'] } },
    { id: '3.1.15', framework: 'NIST-CMMC', family: 'AC', title: 'Privileged remote access', description: 'Authorize remote execution of privileged commands and remote access to security-relevant information.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.1.15', 2), mappings: { nist800_53: ['AC-17(4)'] } },
    { id: '3.1.16', framework: 'NIST-CMMC', family: 'AC', title: 'Wireless access', description: 'Authorize wireless access prior to allowing such connections.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.16', 2), mappings: { nist800_53: ['AC-18'] } },
    { id: '3.1.17', framework: 'NIST-CMMC', family: 'AC', title: 'Wireless encryption', description: 'Protect wireless access using authentication and encryption.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.17', 2), mappings: { nist800_53: ['AC-18(1)'] } },
    { id: '3.1.18', framework: 'NIST-CMMC', family: 'AC', title: 'Mobile device access', description: 'Control connection of mobile devices.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.18', 2), mappings: { nist800_53: ['AC-19'] } },
    { id: '3.1.19', framework: 'NIST-CMMC', family: 'AC', title: 'Mobile device encryption', description: 'Encrypt CUI on mobile devices and mobile computing platforms.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.19', 2), mappings: { nist800_53: ['AC-19(5)'] } },
    { id: '3.1.20', framework: 'NIST-CMMC', family: 'AC', title: 'External system connections', description: 'Verify and control/limit connections to and use of external systems.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.20', 2), mappings: { nist800_53: ['AC-20'] } },
    { id: '3.1.21', framework: 'NIST-CMMC', family: 'AC', title: 'Public posting of CUI', description: 'Limit use of organizational portable storage devices on external systems.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.21', 2), mappings: { nist800_53: ['AC-20(2)'] } },
    { id: '3.1.22', framework: 'NIST-CMMC', family: 'AC', title: 'Information posting', description: 'Control information posted or processed on publicly accessible systems.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.1.22', 4), mappings: { nist800_53: ['AC-22'] } },

    // 3.2 AWARENESS AND TRAINING (AT) - 3 Controls
    { id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Security awareness training', description: 'Ensure that managers, system administrators, and users are made aware of the security risks.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.2.1', 2), mappings: { nist800_53: ['AT-2'] } },
    { id: '3.2.2', framework: 'NIST-CMMC', family: 'AT', title: 'Insider threat training', description: 'Ensure that personnel are trained to carry out their assigned information security-related duties.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.2.2', 2), mappings: { nist800_53: ['AT-3'] } },
    { id: '3.2.3', framework: 'NIST-CMMC', family: 'AT', title: 'Role-based training', description: 'Provide security awareness training on recognizing and reporting potential indicators of insider threat.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.2.3', 1), mappings: { nist800_53: ['PM-12'] } },

    // 3.3 AUDIT AND ACCOUNTABILITY (AU) - 9 Controls
    { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'Audit logs', description: 'Create and retain system audit logs and records to enable monitoring.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.3.1', 2), mappings: { nist800_53: ['AU-2'] } },
    { id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'User accountability', description: 'Ensure that the actions of individual system users can be uniquely traced.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.3.2', 2), mappings: { nist800_53: ['AU-3'] } },
    { id: '3.3.3', framework: 'NIST-CMMC', family: 'AU', title: 'Audit review', description: 'Review and update logged events.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.3.3', 2), mappings: { nist800_53: ['AU-6'] } },
    { id: '3.3.4', framework: 'NIST-CMMC', family: 'AU', title: 'Audit reporting', description: 'Alert in the event of an audit logging process failure.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.3.4', 1), mappings: { nist800_53: ['AU-5'] } },
    { id: '3.3.5', framework: 'NIST-CMMC', family: 'AU', title: 'Audit analysis', description: 'Correlate audit record review, analysis, and reporting processes.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.3.5', 2), mappings: { nist800_53: ['AU-6(3)'] } },
    { id: '3.3.6', framework: 'NIST-CMMC', family: 'AU', title: 'Audit clock sync', description: 'Provide audit record reduction and report generation.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.3.6', 2), mappings: { nist800_53: ['AU-7'] } },
    { id: '3.3.7', framework: 'NIST-CMMC', family: 'AU', title: 'Audit protection', description: 'Provide a system-wide time source used to generate time stamps for audit records.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.3.7', 2), mappings: { nist800_53: ['AU-8'] } },
    { id: '3.3.8', framework: 'NIST-CMMC', family: 'AU', title: 'Audit retention', description: 'Protect audit information and audit tools from unauthorized access, modification, and deletion.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.3.8', 2), mappings: { nist800_53: ['AU-9'] } },
    { id: '3.3.9', framework: 'NIST-CMMC', family: 'AU', title: 'Centralized logging', description: 'Limit management of audit logging to a subset of privileged users.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.3.9', 1), mappings: { nist800_53: ['AU-9(4)'] } },

    // 3.4 CONFIGURATION MANAGEMENT (CM) - 9 Controls
    { id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'Baseline configuration', description: 'Establish and maintain baseline configurations and inventories of systems.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.4.1', 2), mappings: { nist800_53: ['CM-2'] } },
    { id: '3.4.2', framework: 'NIST-CMMC', family: 'CM', title: 'Security settings', description: 'Establish and enforce security configuration settings.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.4.2', 2), mappings: { nist800_53: ['CM-6'] } },
    { id: '3.4.3', framework: 'NIST-CMMC', family: 'CM', title: 'Change tracking', description: 'Track, review, approve, and audit changes to systems.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.4.3', 2), mappings: { nist800_53: ['CM-3'] } },
    { id: '3.4.4', framework: 'NIST-CMMC', family: 'CM', title: 'Least functionality', description: 'Analyze the security impact of changes prior to implementation.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.4.4', 1), mappings: { nist800_53: ['CM-4'] } },
    { id: '3.4.5', framework: 'NIST-CMMC', family: 'CM', title: 'Privileged access for changes', description: 'Define, document, approve, and enforce physical and logical access restrictions for change.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.4.5', 2), mappings: { nist800_53: ['CM-5'] } },
    { id: '3.4.6', framework: 'NIST-CMMC', family: 'CM', title: 'Software inventory', description: 'Employ the principle of least functionality by configuring systems to provide only essential capabilities.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.4.6', 4), mappings: { nist800_53: ['CM-7'] } },
    { id: '3.4.7', framework: 'NIST-CMMC', family: 'CM', title: 'Unused ports/protocols', description: 'Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.4.7', 2), mappings: { nist800_53: ['CM-7(1)'] } },
    { id: '3.4.8', framework: 'NIST-CMMC', family: 'CM', title: 'Software allow-lists', description: 'Apply deny-by-exception (blacklisting) policy to prevent the use of unauthorized software.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.4.8', 2), mappings: { nist800_53: ['CM-7(2)'] } },
    { id: '3.4.9', framework: 'NIST-CMMC', family: 'CM', title: 'User-installed software', description: 'Control and monitor user-installed software.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.4.9', 2), mappings: { nist800_53: ['CM-11'] } },

    // 3.5 IDENTIFICATION AND AUTHENTICATION (IA) - 11 Controls
    { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identify system users', description: 'Identify system users, processes acting on behalf of users, or devices.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.5.1', 2), mappings: { nist800_53: ['IA-2'] } },
    { id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', title: 'Authenticate users', description: 'Authenticate (or verify) the identities of those users, processes, or devices.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.5.2', 2), mappings: { nist800_53: ['IA-2'] } },
    { id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Use MFA', description: 'Use multi-factor authentication for local and network access to privileged accounts.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.5.3', 2), mappings: { nist800_53: ['IA-2(1)'] } },
    { id: '3.5.4', framework: 'NIST-CMMC', family: 'IA', title: 'Replay protection', description: 'Employ identifier management.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.5.4', 2), mappings: { nist800_53: ['IA-4'] } },
    { id: '3.5.5', framework: 'NIST-CMMC', family: 'IA', title: 'Identifier management', description: 'Prevent reuse of identifiers for a defined period.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.5.5', 3), mappings: { nist800_53: ['IA-4'] } },
    { id: '3.5.6', framework: 'NIST-CMMC', family: 'IA', title: 'Disable identifiers', description: 'Disable identifiers after a defined period of inactivity.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.5.6', 1), mappings: { nist800_53: ['IA-4'] } },
    { id: '3.5.7', framework: 'NIST-CMMC', family: 'IA', title: 'Password complexity', description: 'Enforce a minimum password complexity and change of characters when new passwords are created.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.5.7', 4), mappings: { nist800_53: ['IA-5(1)'] } },
    { id: '3.5.8', framework: 'NIST-CMMC', family: 'IA', title: 'Password reuse', description: 'Prohibit password reuse for a defined number of generations.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.5.8', 1), mappings: { nist800_53: ['IA-5(1)'] } },
    { id: '3.5.9', framework: 'NIST-CMMC', family: 'IA', title: 'Temporary passwords', description: 'Allow temporary password use for system logons with an immediate change to a permanent password.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.5.9', 1), mappings: { nist800_53: ['IA-5(1)'] } },
    { id: '3.5.10', framework: 'NIST-CMMC', family: 'IA', title: 'Cryptographic protection', description: 'Store and transmit only encrypted representation of passwords.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.5.10', 2), mappings: { nist800_53: ['IA-5(1)'] } },
    { id: '3.5.11', framework: 'NIST-CMMC', family: 'IA', title: 'Obscure feedback', description: 'Obscure feedback of authentication information.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.5.11', 1), mappings: { nist800_53: ['IA-6'] } },

    // 3.6 INCIDENT RESPONSE (IR) - 3 Controls
    { id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', title: 'Incident handling', description: 'Establish an operational incident-handling capability.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.6.1', 2), mappings: { nist800_53: ['IR-4'] } },
    { id: '3.6.2', framework: 'NIST-CMMC', family: 'IR', title: 'Incident tracking', description: 'Track, document, and report incidents to designated officials.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.6.2', 2), mappings: { nist800_53: ['IR-5'] } },
    { id: '3.6.3', framework: 'NIST-CMMC', family: 'IR', title: 'Incident testing', description: 'Test the organizational incident response capability.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.6.3', 1), mappings: { nist800_53: ['IR-3'] } },

    // 3.7 MAINTENANCE (MA) - 6 Controls
    { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'System maintenance', description: 'Perform maintenance on organizational systems.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.7.1', 2), mappings: { nist800_53: ['MA-2'] } },
    { id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', title: 'Maintenance controls', description: 'Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.7.2', 4), mappings: { nist800_53: ['MA-3'] } },
    { id: '3.7.3', framework: 'NIST-CMMC', family: 'MA', title: 'Media sanitization for maintenance', description: 'Ensure equipment, including organizational portable storage devices, is free of CUI.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.7.3', 2), mappings: { nist800_53: ['MA-3(2)'] } },
    { id: '3.7.4', framework: 'NIST-CMMC', family: 'MA', title: 'Non-local maintenance', description: 'Approve and monitor nonlocal maintenance sessions via remote access.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.7.4', 2), mappings: { nist800_53: ['MA-4'] } },
    { id: '3.7.5', framework: 'NIST-CMMC', family: 'MA', title: 'Maintenance authentication', description: 'Require multi-factor authentication to establish nonlocal maintenance sessions.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.7.5', 1), mappings: { nist800_53: ['MA-4(2)'] } },
    { id: '3.7.6', framework: 'NIST-CMMC', family: 'MA', title: 'Maintenance personnel', description: 'Supervise the maintenance activities of personnel without required access authorization.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.7.6', 2), mappings: { nist800_53: ['MA-5'] } },

    // 3.8 MEDIA PROTECTION (MP) - 9 Controls
    { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Protect system media', description: 'Protect system media containing CUI, both paper and digital.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.8.1', 2), mappings: { nist800_53: ['MP-2'] } },
    { id: '3.8.2', framework: 'NIST-CMMC', family: 'MP', title: 'Limit media access', description: 'Limit access to CUI on system media to authorized users.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.8.2', 1), mappings: { nist800_53: ['MP-3'] } },
    { id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', title: 'Sanitize media', description: 'Sanitize or destroy system media containing CUI before disposal or release for reuse.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.8.3', 2), mappings: { nist800_53: ['MP-6'] } },
    { id: '3.8.4', framework: 'NIST-CMMC', family: 'MP', title: 'Mark media', description: 'Mark system media containing CUI in accordance with applicable laws.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.8.4', 1), mappings: { nist800_53: ['MP-3'] } },
    { id: '3.8.5', framework: 'NIST-CMMC', family: 'MP', title: 'Inventory media', description: 'Control access to system media.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.8.5', 2), mappings: { nist800_53: ['MP-4'] } },
    { id: '3.8.6', framework: 'NIST-CMMC', family: 'MP', title: 'Track media', description: 'Implement cryptographic mechanisms to protect CUI at rest.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.8.6', 1), mappings: { nist800_53: ['MP-5'] } },
    { id: '3.8.7', framework: 'NIST-CMMC', family: 'MP', title: 'Control removable media', description: 'Control the use of removable media on system components.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.8.7', 2), mappings: { nist800_53: ['MP-7'] } },
    { id: '3.8.8', framework: 'NIST-CMMC', family: 'MP', title: 'Restrict media use', description: 'Prohibit the use of portable storage devices when such devices have no identifiable owner.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.8.8', 1), mappings: { nist800_53: ['MP-7(1)'] } },
    { id: '3.8.9', framework: 'NIST-CMMC', family: 'MP', title: 'Protect media during transport', description: 'Protect CUI during transport.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.8.9', 3), mappings: { nist800_53: ['MP-5'] } },

    // 3.9 PERSONNEL SECURITY (PS) - 2 Controls
    { id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', title: 'Screen individuals', description: 'Screen individuals prior to authorizing access to systems containing CUI.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.9.1', 2), mappings: { nist800_53: ['PS-3'] } },
    { id: '3.9.2', framework: 'NIST-CMMC', family: 'PS', title: 'Personnel termination', description: 'Protect systems containing CUI during and after personnel actions such as terminations and transfers.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.9.2', 3), mappings: { nist800_53: ['PS-4'] } },

    // 3.10 PHYSICAL PROTECTION (PE) - 6 Controls
    { id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit physical access', description: 'Limit physical access to systems, equipment, and the respective operating environments to authorized individuals.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.10.1', 2), mappings: { nist800_53: ['PE-2'] } },
    { id: '3.10.2', framework: 'NIST-CMMC', family: 'PE', title: 'Escort visitors', description: 'Escort visitors and monitor visitor activity.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.10.2', 2), mappings: { nist800_53: ['PE-3'] } },
    { id: '3.10.3', framework: 'NIST-CMMC', family: 'PE', title: 'Visitor logs', description: 'Maintain audit logs of physical access.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.10.3', 2), mappings: { nist800_53: ['PE-3'] } },
    { id: '3.10.4', framework: 'NIST-CMMC', family: 'PE', title: 'Physical access points', description: 'Control and manage physical access devices.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.10.4', 2), mappings: { nist800_53: ['PE-3'] } },
    { id: '3.10.5', framework: 'NIST-CMMC', family: 'PE', title: 'Protect service lines', description: 'Protect and monitor the physical facility and support infrastructure for systems.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.10.5', 2), mappings: { nist800_53: ['PE-5'] } },
    { id: '3.10.6', framework: 'NIST-CMMC', family: 'PE', title: 'Alternate work sites', description: 'Enforce safeguarding measures for CUI at alternate work sites.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.10.6', 1), mappings: { nist800_53: ['PE-17'] } },

    // 3.11 RISK ASSESSMENT (RA) - 3 Controls
    { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Periodically assess risk', description: 'Periodically assess the risk to organizational operations resulting from the operation of systems.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.11.1', 2), mappings: { nist800_53: ['RA-3'] } },
    { id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', title: 'Vulnerability scans', description: 'Scan for vulnerabilities in systems and applications.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.11.2', 3), mappings: { nist800_53: ['RA-5'] } },
    { id: '3.11.3', framework: 'NIST-CMMC', family: 'RA', title: 'Remediate vulnerabilities', description: 'Remediate vulnerabilities in accordance with risk assessments.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.11.3', 1), mappings: { nist800_53: ['RA-5'] } },

    // 3.12 SECURITY ASSESSMENT (CA) - 4 Controls
    { id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Periodically assess controls', description: 'Periodically assess the security controls in systems to determine if the controls are effective.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.12.1', 2), mappings: { nist800_53: ['CA-2'] } },
    { id: '3.12.2', framework: 'NIST-CMMC', family: 'CA', title: 'Plan of action', description: 'Develop and implement plans of action to correct deficiencies.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.12.2', 2), mappings: { nist800_53: ['CA-5'] } },
    { id: '3.12.3', framework: 'NIST-CMMC', family: 'CA', title: 'Monitor security controls', description: 'Monitor security controls on an ongoing basis to ensure effectiveness.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.12.3', 2), mappings: { nist800_53: ['CA-7'] } },
    { id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', title: 'System security plan', description: 'Develop, document, and periodically update system security plans.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.12.4', 2), mappings: { nist800_53: ['PL-2'] } },

    // 3.13 SYSTEM AND COMMUNICATIONS PROTECTION (SC) - 16 Controls
    { id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Boundary protection', description: 'Monitor, control, and protect communications at the external and key internal boundaries.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.13.1', 2), mappings: { nist800_53: ['SC-7'] } },
    { id: '3.13.2', framework: 'NIST-CMMC', family: 'SC', title: 'Security engineering', description: 'Employ architectural designs, software development techniques, and systems security engineering principles.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.2', 1), mappings: { nist800_53: ['SA-8'] } },
    { id: '3.13.3', framework: 'NIST-CMMC', family: 'SC', title: 'Role separation', description: 'Separate user functionality from system management functionality.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.3', 2), mappings: { nist800_53: ['SC-2'] } },
    { id: '3.13.4', framework: 'NIST-CMMC', family: 'SC', title: 'Shared resources', description: 'Prevent unintended and unauthorized disclosure of CUI via shared system resources.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.4', 1), mappings: { nist800_53: ['SC-4'] } },
    { id: '3.13.5', framework: 'NIST-CMMC', family: 'SC', title: 'Network communication', description: 'Implement sub-networks for public access system components.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.5', 1), mappings: { nist800_53: ['SC-7'] } },
    { id: '3.13.6', framework: 'NIST-CMMC', family: 'SC', title: 'Deny by default', description: 'Deny network communications traffic by default and allow network communications traffic by exception.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.6', 2), mappings: { nist800_53: ['SC-7(5)'] } },
    { id: '3.13.7', framework: 'NIST-CMMC', family: 'SC', title: 'Split tunneling', description: 'Prevent remote devices from simultaneously establishing non-remote connections with systems.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.7', 1), mappings: { nist800_53: ['SC-7(7)'] } },
    { id: '3.13.8', framework: 'NIST-CMMC', family: 'SC', title: 'Data in transit encryption', description: 'Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.13.8', 2), mappings: { nist800_53: ['SC-8'] } },
    { id: '3.13.9', framework: 'NIST-CMMC', family: 'SC', title: 'Termination of connections', description: 'Terminate network connections associated with communications sessions at the end of the sessions.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.9', 1), mappings: { nist800_53: ['SC-10'] } },
    { id: '3.13.10', framework: 'NIST-CMMC', family: 'SC', title: 'Cryptographic key management', description: 'Establish and manage cryptographic keys.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.10', 2), mappings: { nist800_53: ['SC-12'] } },
    { id: '3.13.11', framework: 'NIST-CMMC', family: 'SC', title: 'FIPS validation', description: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.13.11', 1), mappings: { nist800_53: ['SC-13'] } },
    { id: '3.13.12', framework: 'NIST-CMMC', family: 'SC', title: 'Collaborative device control', description: 'Prohibit remote activation of collaborative computing devices.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.12', 2), mappings: { nist800_53: ['SC-15'] } },
    { id: '3.13.13', framework: 'NIST-CMMC', family: 'SC', title: 'Mobile code control', description: 'Control and monitor the use of mobile code.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.13', 3), mappings: { nist800_53: ['SC-18'] } },
    { id: '3.13.14', framework: 'NIST-CMMC', family: 'SC', title: 'VOIP control', description: 'Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.14', 3), mappings: { nist800_53: ['SC-19'] } },
    { id: '3.13.15', framework: 'NIST-CMMC', family: 'SC', title: 'External session control', description: 'Protect the authenticity of communications sessions.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.13.15', 1), mappings: { nist800_53: ['SC-23'] } },
    { id: '3.13.16', framework: 'NIST-CMMC', family: 'SC', title: 'Data at rest protection', description: 'Protect the confidentiality of CUI at rest.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.13.16', 1), mappings: { nist800_53: ['SC-28'] } },

    // 3.14 SYSTEM AND INFORMATION INTEGRITY (SI) - 7 Controls
    { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Identify flaws', description: 'Identify, report, and correct system flaws in a timely manner.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.14.1', 2), mappings: { nist800_53: ['SI-2'] } },
    { id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', title: 'Malicious code protection', description: 'Provide protection from malicious code at appropriate locations within systems.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.14.2', 3), mappings: { nist800_53: ['SI-3'] } },
    { id: '3.14.3', framework: 'NIST-CMMC', family: 'SI', title: 'Malicious code updates', description: 'Monitor system security alerts and advisories and take appropriate actions.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.14.3', 1), mappings: { nist800_53: ['SI-3'] } },
    { id: '3.14.4', framework: 'NIST-CMMC', family: 'SI', title: 'System monitoring', description: 'Update malicious code protection mechanisms when new releases are available.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.14.4', 1), mappings: { nist800_53: ['SI-3'] } },
    { id: '3.14.5', framework: 'NIST-CMMC', family: 'SI', title: 'Security alerts', description: 'Perform periodic scans of the system and real-time scans of files from external sources.', cmmcLevel: 1, sprsWeight: 3, objectives: genObjs('3.14.5', 1), mappings: { nist800_53: ['SI-3'] } },
    { id: '3.14.6', framework: 'NIST-CMMC', family: 'SI', title: 'Boundary monitoring', description: 'Monitor the system to detect attacks and indicators of potential attacks.', cmmcLevel: 2, sprsWeight: 3, objectives: genObjs('3.14.6', 3), mappings: { nist800_53: ['SI-4'] } },
    { id: '3.14.7', framework: 'NIST-CMMC', family: 'SI', title: 'Email protection', description: 'Identify unauthorized use of systems.', cmmcLevel: 2, sprsWeight: 1, objectives: genObjs('3.14.7', 1), mappings: { nist800_53: ['SI-4'] } }
];

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  {
    id: 'intro-1', familyId: 'PH1', title: 'CMMC 2.0 Framework Architecture',
    description: 'Overview of the transition from NIST 800-171 to CMMC 2.0.',
    content: '# CMMC 2.0 Structural Overview\n\nCMMC 2.0 streamlines the requirements into three distinct levels:\n\n1. **Level 1 (Foundational)**: 17 Practices.\n2. **Level 2 (Advanced)**: 110 Practices.\n3. **Level 3 (Expert)**: 110+ Practices.',
    durationMinutes: 20, difficulty: 'Beginner'
  },
  {
    id: 'tech-ac-1', familyId: 'PH3', title: 'Domain Deep Dive: Access Control (AC)',
    description: 'Implementing least privilege and transaction-level monitoring for CUI.',
    content: '# Access Control (AC) Domain\n\nAccess Control is the largest domain in NIST 800-171. It focuses on ensuring only the right people have access to the right data.',
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
  financials: {
      annualRevenue: 5000000,
      employeeCount: 25,
      avgHourlyLaborRate: 125,
      brandValueEstimate: 1000000,
      legalRetentionAnnual: 50000
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