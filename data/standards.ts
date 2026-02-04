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

export const REQUIREMENTS_DATA: Requirement[] = [
    // --- ACCESS CONTROL (AC) ---
    { id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Authorized Access Control', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'authorized users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of authorized users are identified;', status: 'pending' },
        { id: 'c', description: 'devices (and other systems) authorized to connect to the system are identified;', status: 'pending' },
        { id: 'd', description: 'system access is limited to authorized users;', status: 'pending' },
        { id: 'e', description: 'system access is limited to processes acting on behalf of authorized users; and', status: 'pending' },
        { id: 'f', description: 'system access is limited to authorized devices (including other systems).', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-2', 'AC-3'] }
    },
    { id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Transaction & Function Control', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the types of transactions and functions that authorized users are permitted to execute are defined; and', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined types of transactions and functions for authorized users.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-3'] }
    },
    { id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control CUI Flow', description: 'Control the flow of CUI in accordance with approved authorizations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'information flow control policies are defined;', status: 'pending' },
        { id: 'b', description: 'methods and enforcement mechanisms for controlling the flow of CUI are defined;', status: 'pending' },
        { id: 'c', description: 'designated sources and destinations for CUI are identified;', status: 'pending' },
        { id: 'd', description: 'authorizations for controlling the flow of CUI are defined; and', status: 'pending' },
        { id: 'e', description: 'approved authorizations for controlling the flow of CUI are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-4'] }
    },
    { id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separation of Duties', description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the duties of individuals requiring separation are defined;', status: 'pending' },
        { id: 'b', description: 'responsibilities for duties that require separation are assigned to separate individuals; and', status: 'pending' },
        { id: 'c', description: 'access privileges that enable individuals to exercise the duties that require separation are granted to separate individuals.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-5'] }
    },
    { id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', title: 'Least Privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'privileged accounts are identified;', status: 'pending' },
        { id: 'b', description: 'access to privileged accounts is authorized in accordance with the principle of least privilege;', status: 'pending' },
        { id: 'c', description: 'security functions are identified; and', status: 'pending' },
        { id: 'd', description: 'access to security functions is authorized in accordance with the principle of least privilege.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6'] }
    },
    { id: '3.1.6', framework: 'NIST-CMMC', family: 'AC', title: 'Non-Privileged Account Use', description: 'Use non-privileged accounts or roles when accessing nonsecurity functions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'nonsecurity functions are identified; and', status: 'pending' },
        { id: 'b', description: 'non-privileged accounts or roles are used when accessing nonsecurity functions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6'] }
    },
    { id: '3.1.7', framework: 'NIST-CMMC', family: 'AC', title: 'Privileged Functions', description: 'Prevent non-privileged users from executing privileged functions and capture the execution of such functions in audit logs.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'privileged functions are defined;', status: 'pending' },
        { id: 'b', description: 'non-privileged users are defined;', status: 'pending' },
        { id: 'c', description: 'non-privileged users are prevented from executing privileged functions; and', status: 'pending' },
        { id: 'd', description: 'the execution of privileged functions is captured in audit logs.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6', 'AU-2'] }
    },
    { id: '3.1.8', framework: 'NIST-CMMC', family: 'AC', title: 'Unsuccessful Logon Attempts', description: 'Limit unsuccessful logon attempts.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the means of limiting unsuccessful logon attempts is defined; and', status: 'pending' },
        { id: 'b', description: 'the defined means of limiting unsuccessful logon attempts is implemented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-7'] }
    },
    { id: '3.1.9', framework: 'NIST-CMMC', family: 'AC', title: 'Privacy & Security Notices', description: 'Provide privacy and security notices consistent with applicable CUI rules.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'privacy and security notices required by CUI-specified rules are identified; and', status: 'pending' },
        { id: 'b', description: 'privacy and security notices are displayed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-8'] }
    },
    { id: '3.1.10', framework: 'NIST-CMMC', family: 'AC', title: 'Session Lock', description: 'Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the period of inactivity after which the system initiates a session lock is defined;', status: 'pending' },
        { id: 'b', description: 'access to the system and viewing of data is prevented by initiating a session lock after the defined period of inactivity; and', status: 'pending' },
        { id: 'c', description: 'previously visible information is concealed via a pattern-hiding display after the defined period of inactivity.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-11'] }
    },
    { id: '3.1.11', framework: 'NIST-CMMC', family: 'AC', title: 'Session Termination', description: 'Terminate (automatically) a user session after a defined condition.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'conditions requiring a user session to terminate are defined; and', status: 'pending' },
        { id: 'b', description: 'a user session is automatically terminated after any of the defined conditions occur.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-12'] }
    },
    { id: '3.1.12', framework: 'NIST-CMMC', family: 'AC', title: 'Control Remote Access', description: 'Monitor and control remote access sessions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'remote access sessions are permitted;', status: 'pending' },
        { id: 'b', description: 'the types of permitted remote access are identified;', status: 'pending' },
        { id: 'c', description: 'remote access sessions are controlled; and', status: 'pending' },
        { id: 'd', description: 'remote access sessions are monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-17'] }
    },
    { id: '3.1.13', framework: 'NIST-CMMC', family: 'AC', title: 'Remote Access Confidentiality', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'cryptographic mechanisms to protect the confidentiality of remote access sessions are identified; and', status: 'pending' },
        { id: 'b', description: 'cryptographic mechanisms to protect the confidentiality of remote access sessions are implemented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-17'] }
    },
    { id: '3.1.14', framework: 'NIST-CMMC', family: 'AC', title: 'Remote Access Routing', description: 'Route remote access via managed access control points.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'managed access control points are identified and implemented; and', status: 'pending' },
        { id: 'b', description: 'remote access is routed through managed network access control points.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-17'] }
    },
    { id: '3.1.15', framework: 'NIST-CMMC', family: 'AC', title: 'Privileged Remote Access', description: 'Authorize remote execution of privileged commands and remote access to security-relevant information.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'privileged commands authorized for remote execution are identified;', status: 'pending' },
        { id: 'b', description: 'security-relevant information authorized to be accessed remotely is identified;', status: 'pending' },
        { id: 'c', description: 'the execution of the identified privileged commands via remote access is authorized; and', status: 'pending' },
        { id: 'd', description: 'access to the identified security-relevant information via remote access is authorized.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-17'] }
    },
    { id: '3.1.16', framework: 'NIST-CMMC', family: 'AC', title: 'Wireless Access Authorization', description: 'Authorize wireless access prior to allowing such connections.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'wireless access points are identified; and', status: 'pending' },
        { id: 'b', description: 'wireless access is authorized prior to allowing such connections.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-18'] }
    },
    { id: '3.1.17', framework: 'NIST-CMMC', family: 'AC', title: 'Wireless Access Protection', description: 'Protect wireless access using authentication and encryption.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'wireless access to the system is protected using authentication; and', status: 'pending' },
        { id: 'b', description: 'wireless access to the system is protected using encryption.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-18'] }
    },
    { id: '3.1.18', framework: 'NIST-CMMC', family: 'AC', title: 'Mobile Device Connection', description: 'Control connection of mobile devices.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'mobile devices that process, store, or transmit CUI are identified;', status: 'pending' },
        { id: 'b', description: 'mobile device connections are authorized; and', status: 'pending' },
        { id: 'c', description: 'mobile device connections are monitored and logged.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-19'] }
    },
    { id: '3.1.19', framework: 'NIST-CMMC', family: 'AC', title: 'Encrypt CUI on Mobile', description: 'Encrypt CUI on mobile devices and mobile computing platforms.', cmmcLevel: 2, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'mobile devices and mobile computing platforms that process, store, or transmit CUI are identified; and', status: 'pending' },
        { id: 'b', description: 'encryption is employed to protect CUI on identified mobile devices and mobile computing platforms.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-19'] }
    },
    { id: '3.1.20', framework: 'NIST-CMMC', family: 'AC', title: 'External Connections [CUI DATA]', description: 'Verify and control/limit connections to and use of external systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'connections to external systems are identified;', status: 'pending' },
        { id: 'b', description: 'the use of external systems is identified;', status: 'pending' },
        { id: 'c', description: 'connections to external systems are verified;', status: 'pending' },
        { id: 'd', description: 'the use of external systems is verified;', status: 'pending' },
        { id: 'e', description: 'connections to external systems are controlled/limited; and', status: 'pending' },
        { id: 'f', description: 'the use of external systems is controlled/limited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-20'] }
    },
    { id: '3.1.21', framework: 'NIST-CMMC', family: 'AC', title: 'Portable Storage Use', description: 'Limit use of portable storage devices on external systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the use of portable storage devices containing CUI on external systems is identified and documented;', status: 'pending' },
        { id: 'b', description: 'limits on the use of portable storage devices containing CUI on external systems are defined; and', status: 'pending' },
        { id: 'c', description: 'the use of portable storage devices containing CUI on external systems is limited as defined.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-20'] }
    },
    { id: '3.1.22', framework: 'NIST-CMMC', family: 'AC', title: 'Control Public Information', description: 'Control CUI posted or processed on publicly accessible systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'individuals authorized to post or process information on publicly accessible systems are identified;', status: 'pending' },
        { id: 'b', description: 'procedures to ensure CUI is not posted or processed on publicly accessible systems are identified;', status: 'pending' },
        { id: 'c', description: 'a review process is in place prior to posting of any content to publicly accessible systems;', status: 'pending' },
        { id: 'd', description: 'content on publicly accessible systems is reviewed to ensure that it does not include CUI; and', status: 'pending' },
        { id: 'e', description: 'mechanisms are in place to remove and address improper posting of CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-22'] }
    },

    // --- AWARENESS AND TRAINING (AT) ---
    { id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Role-Based Risk Awareness', description: 'Ensure that managers, systems administrators, and users are made aware of security risks.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'security risks associated with organizational activities involving CUI are identified;', status: 'pending' },
        { id: 'b', description: 'policies, standards, and procedures related to the security of the system are identified;', status: 'pending' },
        { id: 'c', description: 'managers, systems administrators, and users of the system are made aware of the security risks associated with their activities; and', status: 'pending' },
        { id: 'd', description: 'managers, systems administrators, and users of the system are made aware of the applicable policies, standards, and procedures related to the security of the system.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-2'] }
    },
    { id: '3.2.2', framework: 'NIST-CMMC', family: 'AT', title: 'Role-Based Training', description: 'Ensure that personnel are trained to carry out their assigned duties.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'information security-related duties, roles, and responsibilities are defined;', status: 'pending' },
        { id: 'b', description: 'information security-related duties, roles, and responsibilities are assigned to designated personnel; and', status: 'pending' },
        { id: 'c', description: 'personnel are adequately trained to carry out their assigned information security related duties, roles, and responsibilities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-3'] }
    },
    { id: '3.2.3', framework: 'NIST-CMMC', family: 'AT', title: 'Insider Threat Awareness', description: 'Provide security awareness training on recognizing potential indicators of insider threat.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'potential indicators associated with insider threats are identified; and', status: 'pending' },
        { id: 'b', description: 'security awareness training on recognizing and reporting potential indicators of insider threat is provided to managers and employees.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-2'] }
    },

    // --- AUDIT AND ACCOUNTABILITY (AU) ---
    { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'System Auditing', description: 'Create and retain system audit logs and records to the extent needed.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit logs needed (i.e., event types to be logged) to enable monitoring and analysis are specified;', status: 'pending' },
        { id: 'b', description: 'the content of audit records needed to support monitoring and analysis is defined;', status: 'pending' },
        { id: 'c', description: 'audit records are created (generated);', status: 'pending' },
        { id: 'd', description: 'audit records, once created, contain the defined content;', status: 'pending' },
        { id: 'e', description: 'retention requirements for audit records are defined; and', status: 'pending' },
        { id: 'f', description: 'audit records are retained as defined.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2', 'AU-3', 'AU-11', 'AU-12'] }
    },
    { id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'User Accountability', description: 'Ensure that the actions of individual system users can be uniquely traced.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the content of the audit records needed to support the ability to uniquely trace users to their actions is defined; and', status: 'pending' },
        { id: 'b', description: 'audit records, once created, contain the defined content.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2'] }
    },
    { id: '3.3.3', framework: 'NIST-CMMC', family: 'AU', title: 'Event Review', description: 'Review and update logged events.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a process for determining when to review logged events is defined;', status: 'pending' },
        { id: 'b', description: 'event types being logged are reviewed in accordance with the defined review process; and', status: 'pending' },
        { id: 'c', description: 'event types being logged are updated based on the review.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-6'] }
    },
    { id: '3.3.4', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Failure Alerting', description: 'Alert in the event of an audit logging process failure.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'personnel or roles to be alerted in the event of an audit logging process failure are identified;', status: 'pending' },
        { id: 'b', description: 'types of audit logging process failures for which alert will be generated are defined; and', status: 'pending' },
        { id: 'c', description: 'identified personnel or roles are alerted in the event of an audit logging process failure.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-5'] }
    },
    { id: '3.3.5', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Correlation', description: 'Correlate audit record review, analysis, and reporting processes.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit record review, analysis, and reporting processes for investigation and response are defined; and', status: 'pending' },
        { id: 'b', description: 'defined audit record review, analysis, and reporting processes are correlated.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-6'] }
    },
    { id: '3.3.6', framework: 'NIST-CMMC', family: 'AU', title: 'Reduction & Reporting', description: 'Provide audit record reduction and report generation.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'an audit record reduction capability that supports on-demand analysis is provided; and', status: 'pending' },
        { id: 'b', description: 'a report generation capability that supports on-demand reporting is provided.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-7'] }
    },
    { id: '3.3.7', framework: 'NIST-CMMC', family: 'AU', title: 'Authoritative Time Source', description: 'Provide a system capability that synchronizes internal system clocks.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'internal system clocks are used to generate time stamps for audit records;', status: 'pending' },
        { id: 'b', description: 'an authoritative source with which to compare and synchronize internal system clocks is specified; and', status: 'pending' },
        { id: 'c', description: 'internal system clocks used to generate time stamps for audit records are compared to and synchronized with the specified authoritative time source.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-8'] }
    },
    { id: '3.3.8', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Protection', description: 'Protect audit information and audit logging tools.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit information is protected from unauthorized access;', status: 'pending' },
        { id: 'b', description: 'audit information is protected from unauthorized modification;', status: 'pending' },
        { id: 'c', description: 'audit information is protected from unauthorized deletion;', status: 'pending' },
        { id: 'd', description: 'audit logging tools are protected from unauthorized access;', status: 'pending' },
        { id: 'e', description: 'audit logging tools are protected from unauthorized modification; and', status: 'pending' },
        { id: 'f', description: 'audit logging tools are protected from unauthorized deletion.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-9'] }
    },
    { id: '3.3.9', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Management', description: 'Limit management of audit logging functionality to privileged users.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a subset of privileged users granted access to manage audit logging functionality is defined; and', status: 'pending' },
        { id: 'b', description: 'management of audit logging functionality is limited to the defined subset of privileged users.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-9'] }
    },

    // --- CONFIGURATION MANAGEMENT (CM) ---
    { id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'System Baselining', description: 'Establish and maintain baseline configurations and inventories.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a baseline configuration is established;', status: 'pending' },
        { id: 'b', description: 'the baseline configuration includes hardware, software, firmware, and documentation;', status: 'pending' },
        { id: 'c', description: 'the baseline configuration is maintained (reviewed and updated) throughout the system development life cycle;', status: 'pending' },
        { id: 'd', description: 'a system inventory is established;', status: 'pending' },
        { id: 'e', description: 'the system inventory includes hardware, software, firmware, and documentation; and', status: 'pending' },
        { id: 'f', description: 'the inventory is maintained (reviewed and updated) throughout the system development life cycle.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-2', 'CM-8'] }
    },
    { id: '3.4.2', framework: 'NIST-CMMC', family: 'CM', title: 'Security Configuration Enforcement', description: 'Establish and enforce security configuration settings.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'security configuration settings for information technology products employed in the system are established and included in the baseline configuration; and', status: 'pending' },
        { id: 'b', description: 'security configuration settings for information technology products employed in the system are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-6'] }
    },
    { id: '3.4.3', framework: 'NIST-CMMC', family: 'CM', title: 'System Change Management', description: 'Track, review, approve or disapprove, and log changes.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'changes to the system are tracked;', status: 'pending' },
        { id: 'b', description: 'changes to the system are reviewed;', status: 'pending' },
        { id: 'c', description: 'changes to the system are approved or disapproved; and', status: 'pending' },
        { id: 'd', description: 'changes to the system are logged.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-3'] }
    },
    { id: '3.4.4', framework: 'NIST-CMMC', family: 'CM', title: 'Security Impact Analysis', description: 'Analyze the security impact of changes prior to implementation.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the security impact of changes to the system is analyzed prior to implementation.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-4'] }
    },
    { id: '3.4.5', framework: 'NIST-CMMC', family: 'CM', title: 'Access Restrictions for Change', description: 'Define, document, approve, and enforce physical and logical access restrictions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'physical access restrictions associated with changes to the system are defined;', status: 'pending' },
        { id: 'b', description: 'physical access restrictions associated with changes to the system are documented;', status: 'pending' },
        { id: 'c', description: 'physical access restrictions associated with changes to the system are approved;', status: 'pending' },
        { id: 'd', description: 'physical access restrictions associated with changes to the system are enforced;', status: 'pending' },
        { id: 'e', description: 'logical access restrictions associated with changes to the system are defined;', status: 'pending' },
        { id: 'f', description: 'logical access restrictions associated with changes to the system are documented;', status: 'pending' },
        { id: 'g', description: 'logical access restrictions associated with changes to the system are approved; and', status: 'pending' },
        { id: 'h', description: 'logical access restrictions associated with changes to the system are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-5'] }
    },
    { id: '3.4.6', framework: 'NIST-CMMC', family: 'CM', title: 'Least Functionality', description: 'Employ the principle of least functionality.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'essential system capabilities are defined based on the principle of least functionality; and', status: 'pending' },
        { id: 'b', description: 'the system is configured to provide only the defined essential capabilities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-7'] }
    },
    { id: '3.4.7', framework: 'NIST-CMMC', family: 'CM', title: 'Nonessential Functionality', description: 'Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'essential programs are defined;', status: 'pending' },
        { id: 'b', description: 'the use of nonessential programs is defined;', status: 'pending' },
        { id: 'c', description: 'the use of nonessential programs is restricted, disabled, or prevented as defined;', status: 'pending' },
        { id: 'd', description: 'essential functions are defined;', status: 'pending' },
        { id: 'e', description: 'the use of nonessential functions is defined;', status: 'pending' },
        { id: 'f', description: 'the use of nonessential functions is restricted, disabled, or prevented as defined;', status: 'pending' },
        { id: 'g', description: 'essential ports are defined;', status: 'pending' },
        { id: 'h', description: 'the use of nonessential ports is defined;', status: 'pending' },
        { id: 'i', description: 'the use of nonessential ports is restricted, disabled, or prevented as defined;', status: 'pending' },
        { id: 'j', description: 'essential protocols are defined;', status: 'pending' },
        { id: 'k', description: 'the use of nonessential protocols is defined;', status: 'pending' },
        { id: 'l', description: 'the use of nonessential protocols is restricted, disabled, or prevented as defined;', status: 'pending' },
        { id: 'm', description: 'essential services are defined;', status: 'pending' },
        { id: 'n', description: 'the use of nonessential services is defined; and', status: 'pending' },
        { id: 'o', description: 'the use of nonessential services is restricted, disabled, or prevented as defined.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-7'] }
    },
    { id: '3.4.8', framework: 'NIST-CMMC', family: 'CM', title: 'Application Execution Policy', description: 'Apply deny-by-exception (blacklisting) or deny-all, permit-by-exception (whitelisting).', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a policy specifying whether whitelisting or blacklisting is to be implemented is specified;', status: 'pending' },
        { id: 'b', description: 'the software allowed to execute under whitelisting or denied use under blacklisting is specified; and', status: 'pending' },
        { id: 'c', description: 'whitelisting to allow the execution of authorized software or blacklisting to prevent the use of unauthorized software is implemented as specified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-7'] }
    },
    { id: '3.4.9', framework: 'NIST-CMMC', family: 'CM', title: 'User-Installed Software', description: 'Control and monitor user-installed software.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a policy for controlling the installation of software by users is established;', status: 'pending' },
        { id: 'b', description: 'installation of software by users is controlled based on the established policy; and', status: 'pending' },
        { id: 'c', description: 'installation of software by users is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-11'] }
    },

    // --- IDENTIFICATION AND AUTHENTICATION (IA) ---
    { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identification [CUI DATA]', description: 'Identify system users, processes acting on behalf of users, and devices.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'system users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of users are identified; and', status: 'pending' },
        { id: 'c', description: 'devices accessing the system are identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] }
    },
    { id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', title: 'Authentication [CUI DATA]', description: 'Authenticate (or verify) the identities of users, processes, or devices.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the identity of each user is authenticated or verified as a prerequisite to system access;', status: 'pending' },
        { id: 'b', description: 'the identity of each process acting on behalf of a user is authenticated or verified as a prerequisite to system access; and', status: 'pending' },
        { id: 'c', description: 'the identity of each device accessing or connecting to the system is authenticated or verified as a prerequisite to system access', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] }
    },
    { id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Multifactor Authentication', description: 'Use multifactor authentication for local and network access.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'privileged accounts are identified;', status: 'pending' },
        { id: 'b', description: 'multifactor authentication is implemented for local access to privileged accounts;', status: 'pending' },
        { id: 'c', description: 'multifactor authentication is implemented for network access to privileged accounts; and', status: 'pending' },
        { id: 'd', description: 'multifactor authentication is implemented for network access to non-privileged accounts.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] }
    },
    { id: '3.5.4', framework: 'NIST-CMMC', family: 'IA', title: 'Replay-Resistant Authentication', description: 'Employ replay-resistant authentication mechanisms.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'replay-resistant authentication mechanisms are implemented for network account access to privileged and non-privileged accounts.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] }
    },
    { id: '3.5.5', framework: 'NIST-CMMC', family: 'IA', title: 'Identifier Reuse', description: 'Prevent reuse of identifiers for a defined period.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a period within which identifiers cannot be reused is defined; and', status: 'pending' },
        { id: 'b', description: 'reuse of identifiers is prevented within the defined period', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-4'] }
    },
    { id: '3.5.6', framework: 'NIST-CMMC', family: 'IA', title: 'Identifier Handling', description: 'Disable identifiers after a defined period of inactivity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a period of inactivity after which an identifier is disabled is defined; and', status: 'pending' },
        { id: 'b', description: 'identifiers are disabled after the defined period of inactivity.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-4'] }
    },
    { id: '3.5.7', framework: 'NIST-CMMC', family: 'IA', title: 'Password Complexity', description: 'Enforce minimum password complexity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'password complexity requirements are defined;', status: 'pending' },
        { id: 'b', description: 'password change of character requirements are defined;', status: 'pending' },
        { id: 'c', description: 'minimum password complexity requirements as defined are enforced when new passwords are created; and', status: 'pending' },
        { id: 'd', description: 'minimum password change of character requirements as defined are enforced when new passwords are created.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-5'] }
    },
    { id: '3.5.8', framework: 'NIST-CMMC', family: 'IA', title: 'Password Reuse', description: 'Prohibit password reuse for a specified number of generations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the number of generations during which a password cannot be reused is specified; and', status: 'pending' },
        { id: 'b', description: 'reuse of passwords is prohibited during the specified number of generations.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-5'] }
    },
    { id: '3.5.9', framework: 'NIST-CMMC', family: 'IA', title: 'Temporary Passwords', description: 'Allow temporary password use for system logons.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'an immediate change to a permanent password is required when a temporary password is used for system logon.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-5'] }
    },
    { id: '3.5.10', framework: 'NIST-CMMC', family: 'IA', title: 'Cryptographically-Protected Passwords', description: 'Store and transmit only cryptographically-protected passwords.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'passwords are cryptographically protected in storage; and', status: 'pending' },
        { id: 'b', description: 'passwords are cryptographically protected in transit.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-5'] }
    },
    { id: '3.5.11', framework: 'NIST-CMMC', family: 'IA', title: 'Obscure Feedback', description: 'Obscure feedback of authentication information.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'authentication information is obscured during the authentication process.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-6'] }
    },

    // --- INCIDENT RESPONSE (IR) ---
    { id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Handling', description: 'Establish an operational incident-handling capability.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'an operational incident-handling capability is established;', status: 'pending' },
        { id: 'b', description: 'the operational incident-handling capability includes preparation;', status: 'pending' },
        { id: 'c', description: 'the operational incident-handling capability includes detection;', status: 'pending' },
        { id: 'd', description: 'the operational incident-handling capability includes analysis;', status: 'pending' },
        { id: 'e', description: 'the operational incident-handling capability includes containment;', status: 'pending' },
        { id: 'f', description: 'the operational incident-handling capability includes recovery; and', status: 'pending' },
        { id: 'g', description: 'the operational incident-handling capability includes user response activities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-4'] }
    },
    { id: '3.6.2', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Reporting', description: 'Track, document, and report incidents.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'incidents are tracked;', status: 'pending' },
        { id: 'b', description: 'incidents are documented;', status: 'pending' },
        { id: 'c', description: 'authorities to whom incidents are to be reported are identified;', status: 'pending' },
        { id: 'd', description: 'organizational officials to whom incidents are to be reported are identified;', status: 'pending' },
        { id: 'e', description: 'identified authorities are notified of incidents; and', status: 'pending' },
        { id: 'f', description: 'identified organizational officials are notified of incidents', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-6'] }
    },
    { id: '3.6.3', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Response Testing', description: 'Test the organizational incident response capability.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the incident response capability is tested.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-3'] }
    },

    // --- MAINTENANCE (MA) ---
    { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'Perform Maintenance', description: 'Perform maintenance on organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system maintenance is performed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] }
    },
    { id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', title: 'System Maintenance Control', description: 'Provide controls on maintenance tools and personnel.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'tools used to conduct system maintenance are controlled;', status: 'pending' },
        { id: 'b', description: 'techniques used to conduct system maintenance are controlled;', status: 'pending' },
        { id: 'c', description: 'mechanisms used to conduct system maintenance are controlled; and', status: 'pending' },
        { id: 'd', description: 'personnel used to conduct system maintenance are controlled.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-3'] }
    },
    { id: '3.7.3', framework: 'NIST-CMMC', family: 'MA', title: 'Equipment Sanitization', description: 'Ensure equipment removed for off-site maintenance is sanitized.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'equipment to be removed from organizational spaces for off-site maintenance is sanitized of any CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] }
    },
    { id: '3.7.4', framework: 'NIST-CMMC', family: 'MA', title: 'Media Inspection', description: 'Check media for malicious code before use.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'media containing diagnostic and test programs are checked for malicious code before being used in organizational systems that process, store, or transmit CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-3'] }
    },
    { id: '3.7.5', framework: 'NIST-CMMC', family: 'MA', title: 'Nonlocal Maintenance', description: 'Require multifactor authentication for nonlocal maintenance sessions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'multifactor authentication is used to establish nonlocal maintenance sessions via external network connections; and', status: 'pending' },
        { id: 'b', description: 'nonlocal maintenance sessions established via external network connections are terminated when nonlocal maintenance is complete.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-4'] }
    },
    { id: '3.7.6', framework: 'NIST-CMMC', family: 'MA', title: 'Maintenance Personnel', description: 'Supervise maintenance personnel without required access authorization.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'maintenance personnel without required access authorization are supervised during maintenance activities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-5'] }
    },

    // --- MEDIA PROTECTION (MP) ---
    { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Media Protection', description: 'Protect system media containing CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'paper media containing CUI is physically controlled;', status: 'pending' },
        { id: 'b', description: 'digital media containing CUI is physically controlled;', status: 'pending' },
        { id: 'c', description: 'paper media containing CUI is securely stored; and', status: 'pending' },
        { id: 'd', description: 'digital media containing CUI is securely stored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-2', 'MP-4'] }
    },
    { id: '3.8.2', framework: 'NIST-CMMC', family: 'MP', title: 'Media Access', description: 'Limit access to CUI on system media to authorized users.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'access to CUI on system media is limited to authorized users.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-2'] }
    },
    { id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', title: 'Media Disposal [CUI DATA]', description: 'Sanitize or destroy system media containing CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system media containing CUI is sanitized or destroyed before disposal; and', status: 'pending' },
        { id: 'b', description: 'system media containing CUI is sanitized before it is released for reuse.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-6'] }
    },
    { id: '3.8.4', framework: 'NIST-CMMC', family: 'MP', title: 'Media Markings', description: 'Mark media with necessary CUI markings.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'media containing CUI is marked with applicable CUI markings; and', status: 'pending' },
        { id: 'b', description: 'media containing CUI is marked with distribution limitations.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-3'] }
    },
    { id: '3.8.5', framework: 'NIST-CMMC', family: 'MP', title: 'Media Accountability', description: 'Maintain accountability for media during transport.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'access to media containing CUI is controlled; and', status: 'pending' },
        { id: 'b', description: 'accountability for media containing CUI is maintained during transport outside of controlled areas.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-5'] }
    },
    { id: '3.8.6', framework: 'NIST-CMMC', family: 'MP', title: 'Portable Storage Encryption', description: 'Implement cryptographic mechanisms to protect CUI on digital media.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the confidentiality of CUI stored on digital media is protected during transport using cryptographic mechanisms or alternative physical safeguards.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-5'] }
    },
    { id: '3.8.7', framework: 'NIST-CMMC', family: 'MP', title: 'Removeable Media', description: 'Control the use of removable media.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the use of removable media on system components is controlled.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-7'] }
    },
    { id: '3.8.8', framework: 'NIST-CMMC', family: 'MP', title: 'Shared Media', description: 'Prohibit the use of portable storage devices without an identifiable owner.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the use of portable storage devices is prohibited when such devices have no identifiable owner.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-7'] }
    },
    { id: '3.8.9', framework: 'NIST-CMMC', family: 'MP', title: 'Protect Backups', description: 'Protect the confidentiality of backup CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the confidentiality of backup CUI is protected at storage locations.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CP-9'] }
    },

    // --- PERSONNEL SECURITY (PS) ---
    { id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', title: 'Screen Individuals', description: 'Screen individuals prior to authorizing access.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'individuals are screened prior to authorizing access to organizational systems containing CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-3'] }
    },
    { id: '3.9.2', framework: 'NIST-CMMC', family: 'PS', title: 'Personnel Actions', description: 'Ensure systems containing CUI are protected during and after personnel actions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a policy and/or process for terminating system access and any credentials coincident with personnel actions is established;', status: 'pending' },
        { id: 'b', description: 'system access and credentials are terminated consistent with personnel actions such as termination or transfer; and', status: 'pending' },
        { id: 'c', description: 'the system is protected during and after personnel transfer actions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-4', 'PS-5'] }
    },

    // --- PHYSICAL PROTECTION (PE) ---
    { id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit Physical Access [CUI DATA]', description: 'Limit physical access to organizational systems and equipment.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'authorized individuals allowed physical access are identified;', status: 'pending' },
        { id: 'b', description: 'physical access to organizational systems is limited to authorized individuals;', status: 'pending' },
        { id: 'c', description: 'physical access to equipment is limited to authorized individuals; and', status: 'pending' },
        { id: 'd', description: 'physical access to operating environments is limited to authorized individuals.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-2', 'PE-3'] }
    },
    { id: '3.10.2', framework: 'NIST-CMMC', family: 'PE', title: 'Monitor Facility', description: 'Protect and monitor the physical facility.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the physical facility where organizational systems reside is protected;', status: 'pending' },
        { id: 'b', description: 'the support infrastructure for organizational systems is protected;', status: 'pending' },
        { id: 'c', description: 'the physical facility where organizational systems reside is monitored; and', status: 'pending' },
        { id: 'd', description: 'the support infrastructure for organizational systems is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-6'] }
    },
    { id: '3.10.3', framework: 'NIST-CMMC', family: 'PE', title: 'Escort Visitors [CUI DATA]', description: 'Escort visitors and monitor visitor activity.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'visitors are escorted; and', status: 'pending' },
        { id: 'b', description: 'visitor activity is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-3'] }
    },
    { id: '3.10.4', framework: 'NIST-CMMC', family: 'PE', title: 'Physical Access Logs [CUI DATA]', description: 'Maintain audit logs of physical access.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'audit logs of physical access are maintained.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-3'] }
    },
    { id: '3.10.5', framework: 'NIST-CMMC', family: 'PE', title: 'Manage Physical Access [CUI DATA]', description: 'Control and manage physical access devices.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'physical access devices are identified;', status: 'pending' },
        { id: 'b', description: 'physical access devices are controlled; and', status: 'pending' },
        { id: 'c', description: 'physical access devices are managed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-3'] }
    },
    { id: '3.10.6', framework: 'NIST-CMMC', family: 'PE', title: 'Alternative Work Sites', description: 'Enforce safeguarding measures at alternate work sites.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'safeguarding measures for CUI are defined for alternate work sites; and', status: 'pending' },
        { id: 'b', description: 'safeguarding measures for CUI are enforced for alternate work sites.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-17'] }
    },

    // --- RISK ASSESSMENT (RA) ---
    { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Risk Assessments', description: 'Periodically assess the risk to organizational operations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency to assess risk to organizational operations, organizational assets, and individuals is defined; and', status: 'pending' },
        { id: 'b', description: 'risk to organizational operations, organizational assets, and individuals resulting from the operation of an organizational system is assessed with the defined frequency.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-3'] }
    },
    { id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', title: 'Vulnerability Scan', description: 'Scan for vulnerabilities in organizational systems and applications.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency to scan for vulnerabilities in organizational systems and applications is defined;', status: 'pending' },
        { id: 'b', description: 'vulnerability scans are performed on organizational systems with the defined frequency;', status: 'pending' },
        { id: 'c', description: 'vulnerability scans are performed on applications with the defined frequency;', status: 'pending' },
        { id: 'd', description: 'vulnerability scans are performed on organizational systems when new vulnerabilities are identified; and', status: 'pending' },
        { id: 'e', description: 'vulnerability scans are performed on applications when new vulnerabilities are identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-5'] }
    },
    { id: '3.11.3', framework: 'NIST-CMMC', family: 'RA', title: 'Vulnerability Remediation', description: 'Remediate vulnerabilities in accordance with risk assessments.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'vulnerabilities are identified; and', status: 'pending' },
        { id: 'b', description: 'vulnerabilities are remediated in accordance with risk assessments.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-5'] }
    },

    // --- SECURITY ASSESSMENT (CA) ---
    { id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Security Control Assessment', description: 'Periodically assess security controls.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency of security control assessments is defined; and', status: 'pending' },
        { id: 'b', description: 'security controls are assessed with the defined frequency to determine if the controls are effective in their application.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CA-2'] }
    },
    { id: '3.12.2', framework: 'NIST-CMMC', family: 'CA', title: 'Operational Plan of Action', description: 'Develop and implement plans of action (POA&M).', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'deficiencies and vulnerabilities to be addressed by the plan of action are identified;', status: 'pending' },
        { id: 'b', description: 'a plan of action is developed to correct identified deficiencies and reduce or eliminate identified vulnerabilities; and', status: 'pending' },
        { id: 'c', description: 'the plan of action is implemented to correct identified deficiencies and reduce or eliminate identified vulnerabilities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CA-5'] }
    },
    { id: '3.12.3', framework: 'NIST-CMMC', family: 'CA', title: 'Security Control Monitoring', description: 'Monitor security controls on an ongoing basis.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'security controls are monitored on an ongoing basis to ensure the continued effectiveness of those controls.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CA-7'] }
    },
    { id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', title: 'System Security Plan', description: 'Develop, document, and periodically update system security plans (SSP).', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a system security plan is developed;', status: 'pending' },
        { id: 'b', description: 'the system boundary is described and documented in the system security plan;', status: 'pending' },
        { id: 'c', description: 'the system environment of operation is described and documented in the system security plan;', status: 'pending' },
        { id: 'd', description: 'the security requirements identified as non-applicable are identified;', status: 'pending' },
        { id: 'e', description: 'the method of security requirement implementation is described and documented in the system security plan;', status: 'pending' },
        { id: 'f', description: 'the relationship with or connection to other systems is described and documented in the system security plan;', status: 'pending' },
        { id: 'g', description: 'the frequency to update the system security plan is defined; and', status: 'pending' },
        { id: 'h', description: 'system security plan is updated with the defined frequency', status: 'pending' }
      ],
      mappings: { nist800_53: ['PL-2'] }
    },

    // --- SYSTEM AND COMMUNICATIONS PROTECTION (SC) ---
    { id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Boundary Protection [CUI DATA]', description: 'Monitor, control, and protect communications at external and internal boundaries.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the external system boundary is defined;', status: 'pending' },
        { id: 'b', description: 'key internal system boundaries are defined;', status: 'pending' },
        { id: 'c', description: 'communications are monitored at the external system boundary;', status: 'pending' },
        { id: 'd', description: 'communications are monitored at key internal boundaries;', status: 'pending' },
        { id: 'e', description: 'communications are controlled at the external system boundary;', status: 'pending' },
        { id: 'f', description: 'communications are controlled at key internal boundaries;', status: 'pending' },
        { id: 'g', description: 'communications are protected at the external system boundary; and', status: 'pending' },
        { id: 'h', description: 'communications are protected at key internal boundaries.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] }
    },
    { id: '3.13.2', framework: 'NIST-CMMC', family: 'SC', title: 'Security Engineering', description: 'Employ architectural designs and systems engineering principles.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'architectural designs that promote effective information security are identified;', status: 'pending' },
        { id: 'b', description: 'software development techniques that promote effective information security are identified;', status: 'pending' },
        { id: 'c', description: 'systems engineering principles that promote effective information security are identified;', status: 'pending' },
        { id: 'd', description: 'identified architectural designs that promote effective information security are employed;', status: 'pending' },
        { id: 'e', description: 'identified software development techniques that promote effective information security are employed; and', status: 'pending' },
        { id: 'f', description: 'identified systems engineering principles that promote effective information security are employed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SA-8'] }
    },
    { id: '3.13.3', framework: 'NIST-CMMC', family: 'SC', title: 'Role Separation', description: 'Separate user functionality from system management functionality.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'user functionality is identified;', status: 'pending' },
        { id: 'b', description: 'system management functionality is identified; and', status: 'pending' },
        { id: 'c', description: 'user functionality is separated from system management functionality', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6'] }
    },
    { id: '3.13.4', framework: 'NIST-CMMC', family: 'SC', title: 'Shared Resource Control', description: 'Prevent unauthorized information transfer via shared system resources.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'unauthorized and unintended information transfer via shared system resources is prevented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-4'] }
    },
    { id: '3.13.5', framework: 'NIST-CMMC', family: 'SC', title: 'Public-Access System Separation [CUI DATA]', description: 'Implement subnetworks for publicly accessible components.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'publicly accessible system components are identified; and', status: 'pending' },
        { id: 'b', description: 'subnetworks for publicly accessible system components are physically or logically separated from internal networks.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] }
    },
    { id: '3.13.6', framework: 'NIST-CMMC', family: 'SC', title: 'Network Communication by Exception', description: 'Deny network communications traffic by default.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'network communications traffic is denied by default; and', status: 'pending' },
        { id: 'b', description: 'network communications traffic is allowed by exception.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] }
    },
    { id: '3.13.7', framework: 'NIST-CMMC', family: 'SC', title: 'Split Tunneling', description: 'Prevent split tunneling.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'remote devices are prevented from simultaneously establishing non-remote connections with organizational systems and communicating via some other connection to resources in external networks (i.e., split tunneling).', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] }
    },
    { id: '3.13.8', framework: 'NIST-CMMC', family: 'SC', title: 'Data in Transit', description: 'Implement cryptographic mechanisms to protect CUI during transmission.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'cryptographic mechanisms intended to prevent unauthorized disclosure of CUI are identified;', status: 'pending' },
        { id: 'b', description: 'alternative physical safeguards intended to prevent unauthorized disclosure of CUI are identified; and', status: 'pending' },
        { id: 'c', description: 'either cryptographic mechanisms or alternative physical safeguards are implemented to prevent unauthorized disclosure of CUI during transmission.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-8'] }
    },
    { id: '3.13.9', framework: 'NIST-CMMC', family: 'SC', title: 'Connections Termination', description: 'Terminate network connections associated with communications sessions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a period of inactivity to terminate network connections associated with communications sessions is defined;', status: 'pending' },
        { id: 'b', description: 'network connections associated with communications sessions are terminated at the end of the sessions; and', status: 'pending' },
        { id: 'c', description: 'network connections associated with communications sessions are terminated after the defined period of inactivity.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-10'] }
    },
    { id: '3.13.10', framework: 'NIST-CMMC', family: 'SC', title: 'Key Management', description: 'Establish and manage cryptographic keys.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'cryptographic keys are established whenever cryptography is employed; and', status: 'pending' },
        { id: 'b', description: 'cryptographic keys are managed whenever cryptography is employed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-12'] }
    },
    { id: '3.13.11', framework: 'NIST-CMMC', family: 'SC', title: 'CUI Encryption', description: 'Employ FIPS-validated cryptography.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'FIPS-validated cryptography is employed to protect the confidentiality of CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-13'] }
    },
    { id: '3.13.12', framework: 'NIST-CMMC', family: 'SC', title: 'Collaborative Device Control', description: 'Prohibit remote activation of collaborative computing devices.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'collaborative computing devices are identified;', status: 'pending' },
        { id: 'b', description: 'collaborative computing devices provide indication to users of devices in use; and', status: 'pending' },
        { id: 'c', description: 'remote activation of collaborative computing devices is prohibited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-15'] }
    },
    { id: '3.13.13', framework: 'NIST-CMMC', family: 'SC', title: 'Mobile Code', description: 'Control and monitor the use of mobile code.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'use of mobile code is controlled; and', status: 'pending' },
        { id: 'b', description: 'use of mobile code is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-18'] }
    },
    { id: '3.13.14', framework: 'NIST-CMMC', family: 'SC', title: 'Voice Over Internet Protocol', description: 'Control and monitor the use of VoIP technologies.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'use of Voice over Internet Protocol (VoIP) technologies is controlled; and', status: 'pending' },
        { id: 'b', description: 'use of Voice over Internet Protocol (VoIP) technologies is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-19'] }
    },
    { id: '3.13.15', framework: 'NIST-CMMC', family: 'SC', title: 'Communications Authenticity', description: 'Protect the authenticity of communications sessions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the authenticity of communications sessions is protected.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-23'] }
    },
    { id: '3.13.16', framework: 'NIST-CMMC', family: 'SC', title: 'Data At Rest', description: 'Protect the confidentiality of CUI at rest.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the confidentiality of CUI at rest is protected.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-28'] }
    },

    // --- SYSTEM AND INFORMATION INTEGRITY (SI) ---
    { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Flaw Remediation [CUI DATA]', description: 'Identify, report, and correct system flaws.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the time within which to identify system flaws is specified;', status: 'pending' },
        { id: 'b', description: 'system flaws are identified within the specified time frame;', status: 'pending' },
        { id: 'c', description: 'the time within which to report system flaws is specified;', status: 'pending' },
        { id: 'd', description: 'system flaws are reported within the specified time frame;', status: 'pending' },
        { id: 'e', description: 'the time within which to correct system flaws is specified; and', status: 'pending' },
        { id: 'f', description: 'system flaws are corrected within the specified time frame.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-2'] }
    },
    { id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', title: 'Malicious Code Protection [CUI DATA]', description: 'Provide protection from malicious code.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'designated locations for malicious code protection are identified; and', status: 'pending' },
        { id: 'b', description: 'protection from malicious code at designated locations is provided.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-3'] }
    },
    { id: '3.14.3', framework: 'NIST-CMMC', family: 'SI', title: 'Security Alerts & Advisories', description: 'Monitor system security alerts and advisories.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'response actions to system security alerts and advisories are identified;', status: 'pending' },
        { id: 'b', description: 'system security alerts and advisories are monitored; and', status: 'pending' },
        { id: 'c', description: 'actions in response to system security alerts and advisories are taken.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-5'] }
    },
    { id: '3.14.4', framework: 'NIST-CMMC', family: 'SI', title: 'Update Malicious Code Protection [CUI DATA]', description: 'Update malicious code protection mechanisms.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'malicious code protection mechanisms are updated when new releases are available.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-3'] }
    },
    { id: '3.14.5', framework: 'NIST-CMMC', family: 'SI', title: 'System & File Scanning [CUI DATA]', description: 'Perform periodic scans of organizational systems.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the frequency for malicious code scans is defined;', status: 'pending' },
        { id: 'b', description: 'malicious code scans are performed with the defined frequency; and', status: 'pending' },
        { id: 'c', description: 'real-time malicious code scans of files are performed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-3'] }
    },
    { id: '3.14.6', framework: 'NIST-CMMC', family: 'SI', title: 'Monitor Communications for Attacks', description: 'Monitor systems to detect attacks.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the system is monitored to detect attacks and indicators of potential attacks;', status: 'pending' },
        { id: 'b', description: 'inbound communications traffic is monitored to detect attacks; and', status: 'pending' },
        { id: 'c', description: 'outbound communications traffic is monitored to detect attacks.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-4'] }
    },
    { id: '3.14.7', framework: 'NIST-CMMC', family: 'SI', title: 'Identify Unauthorized Use', description: 'Identify unauthorized use of organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'authorized use of the system is defined; and', status: 'pending' },
        { id: 'b', description: 'unauthorized use of the system is identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-4'] }
    }
];

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  { id: 'intro-1', familyId: 'PH1', title: 'CMMC 2.0 Framework Architecture', description: 'Overview of the transition from NIST 800-171 to CMMC 2.0.', content: '# CMMC 2.0 Structural Overview\n\nCMMC 2.0 streamlines requirements into three levels.', durationMinutes: 20, difficulty: 'Beginner' }
];

export const RMF_TASKS = [
  { id: 'P-1', step: 'P', name: 'Risk Management Role Assignment', description: 'Assign key risk management roles.', role: 'Organization Lead' }
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
  sspMetadata: { systemName: '', systemIdentifier: '', categorization: 'LOW', systemOwner: '', authorizingOfficial: '', otherDesignatedContacts: '', assignmentOfSecurityResponsibility: '', operationalStatus: 'Operational', systemType: 'General Support System', generalDescription: '', systemEnvironment: '', interconnections: '', lawsAndPolicies: '', completionDate: '', approvalDate: '' },
  financials: { annualRevenue: 5000000, employeeCount: 25, avgHourlyLaborRate: 125, brandValueEstimate: 1000000, legalRetentionAnnual: 50000 },
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