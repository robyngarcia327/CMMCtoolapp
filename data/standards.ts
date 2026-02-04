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
    // --- ACCESS CONTROL (AC) DOMAIN ---
    
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
        { id: 'c', description: 'designated sources and destinations (e.g., networks, individuals, and devices) for CUI within the system and between interconnected systems are identified;', status: 'pending' },
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
        { id: 'a', description: 'privacy and security notices required by CUI-specified rules are identified, consistent, and associated with the specific CUI category; and', status: 'pending' },
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

    // --- AWARENESS AND TRAINING (AT) DOMAIN ---

    { id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Role-Based Risk Awareness', description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures related to the security of those systems.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'security risks associated with organizational activities involving CUI are identified;', status: 'pending' },
        { id: 'b', description: 'policies, standards, and procedures related to the security of the system are identified;', status: 'pending' },
        { id: 'c', description: 'managers, systems administrators, and users of the system are made aware of the security risks associated with their activities; and', status: 'pending' },
        { id: 'd', description: 'managers, systems administrators, and users of the system are made aware of the applicable policies, standards, and procedures related to the security of the system.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-2'] }
    },
    { id: '3.2.2', framework: 'NIST-CMMC', family: 'AT', title: 'Role-Based Training', description: 'Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'information security-related duties, roles, and responsibilities are defined;', status: 'pending' },
        { id: 'b', description: 'information security-related duties, roles, and responsibilities are assigned to designated personnel; and', status: 'pending' },
        { id: 'c', description: 'personnel are adequately trained to carry out their assigned information security-related duties, roles, and responsibilities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-3'] }
    },
    { id: '3.2.3', framework: 'NIST-CMMC', family: 'AT', title: 'Insider Threat Awareness', description: 'Provide security awareness training on recognizing and reporting potential indicators of insider threat.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'potential indicators associated with insider threats are identified; and', status: 'pending' },
        { id: 'b', description: 'security awareness training on recognizing and reporting potential indicators of insider threat is provided to managers and employees.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-2', 'PM-12'] }
    },

    // --- AUDIT AND ACCOUNTABILITY (AU) DOMAIN ---

    { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'System Auditing', description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit logs needed (i.e., event types to be logged) to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity are specified;', status: 'pending' },
        { id: 'b', description: 'the content of audit records needed to support monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity is defined;', status: 'pending' },
        { id: 'c', description: 'audit records are created (generated);', status: 'pending' },
        { id: 'd', description: 'audit records, once created, contain the defined content;', status: 'pending' },
        { id: 'e', description: 'retention requirements for audit records are defined; and', status: 'pending' },
        { id: 'f', description: 'audit records are retained as defined.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2', 'AU-3', 'AU-11', 'AU-12'] }
    },
    { id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'User Accountability', description: 'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the content of the audit records needed to support the ability to uniquely trace users to their actions is defined; and', status: 'pending' },
        { id: 'b', description: 'audit records, once created, contain the defined content.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2', 'AU-3'] }
    },
    { id: '3.3.3', framework: 'NIST-CMMC', family: 'AU', title: 'Event Review', description: 'Review and update logged events.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a process for determining when to review logged events is defined;', status: 'pending' },
        { id: 'b', description: 'event types being logged are reviewed in accordance with the defined review process; and', status: 'pending' },
        { id: 'c', description: 'event types being logged are updated based on the review.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2', 'AU-3'] }
    },
    { id: '3.3.4', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Failure Alerting', description: 'Alert in the event of an audit logging process failure.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'personnel or roles to be alerted in the event of an audit logging process failure are identified;', status: 'pending' },
        { id: 'b', description: 'types of audit logging process failures for which alert will be generated are defined; and', status: 'pending' },
        { id: 'c', description: 'identified personnel or roles are alerted in the event of an audit logging process failure.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-5'] }
    },
    { id: '3.3.5', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Correlation', description: 'Correlate audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity are defined; and', status: 'pending' },
        { id: 'b', description: 'defined audit record review, analysis, and reporting processes are correlated.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-6'] }
    },
    { id: '3.3.6', framework: 'NIST-CMMC', family: 'AU', title: 'Reduction & Reporting', description: 'Provide audit record reduction and report generation to support on-demand analysis and reporting.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'an audit record reduction capability that supports on-demand analysis is provided; and', status: 'pending' },
        { id: 'b', description: 'a report generation capability that supports on-demand reporting is provided.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-7'] }
    },
    { id: '3.3.7', framework: 'NIST-CMMC', family: 'AU', title: 'Authoritative Time Source', description: 'Provide a system capability that compares and synchronizes internal system clocks with an authoritative source to generate time stamps for audit records.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'internal system clocks are used to generate time stamps for audit records;', status: 'pending' },
        { id: 'b', description: 'an authoritative source with which to compare and synchronize internal system clocks is specified; and', status: 'pending' },
        { id: 'c', description: 'internal system clocks used to generate time stamps for audit records are compared to and synchronized with the specified authoritative time source.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-8'] }
    },
    { id: '3.3.8', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Protection', description: 'Protect audit information and audit logging tools from unauthorized access, modification, and deletion.', cmmcLevel: 2, sprsWeight: 3,
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
    { id: '3.3.9', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Management', description: 'Limit management of audit logging functionality to a subset of privileged users.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a subset of privileged users granted access to manage audit logging functionality is defined; and', status: 'pending' },
        { id: 'b', description: 'management of audit logging functionality is limited to the defined subset of privileged users.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-9'] }
    },

    // --- CONFIGURATION MANAGEMENT (CM) DOMAIN ---

    { id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'System Baselining', description: 'Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.', cmmcLevel: 2, sprsWeight: 3,
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
    { id: '3.4.2', framework: 'NIST-CMMC', family: 'CM', title: 'Security Configuration Enforcement', description: 'Establish and enforce security configuration settings for information technology products employed in organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'security configuration settings for information technology products employed in the system are established and included in the baseline configuration; and', status: 'pending' },
        { id: 'b', description: 'security configuration settings for information technology products employed in the system are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-6'] }
    },
    { id: '3.4.3', framework: 'NIST-CMMC', family: 'CM', title: 'System Change Management', description: 'Track, review, approve or disapprove, and log changes to organizational systems.', cmmcLevel: 2, sprsWeight: 3,
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
    { id: '3.4.5', framework: 'NIST-CMMC', family: 'CM', title: 'Access Restrictions for Change', description: 'Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational systems.', cmmcLevel: 2, sprsWeight: 3,
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
    { id: '3.4.6', framework: 'NIST-CMMC', family: 'CM', title: 'Least Functionality', description: 'Employ the principle of least functionality by configuring organizational systems to provide only essential capabilities.', cmmcLevel: 2, sprsWeight: 3,
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
    { id: '3.4.8', framework: 'NIST-CMMC', family: 'CM', title: 'Application Execution Policy', description: 'Apply deny-by-exception (blacklisting) policy to prevent the use of unauthorized software or deny-all, permit-by-exception (whitelisting) policy to allow the execution of authorized software.', cmmcLevel: 2, sprsWeight: 3,
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

    // --- IDENTIFICATION AND AUTHENTICATION (IA) DOMAIN ---

    { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identification [CUI DATA]', description: 'Identify system users, processes acting on behalf of users, and devices.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'system users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of users are identified; and', status: 'pending' },
        { id: 'c', description: 'devices accessing the system are identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2', 'IA-3'] }
    },
    { id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', title: 'Authentication [CUI DATA]', description: 'Authenticate (or verify) the identities of users, processes, or devices, as a prerequisite to allowing access to organizational systems.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the identity of each user is authenticated or verified as a prerequisite to system access;', status: 'pending' },
        { id: 'b', description: 'the identity of each process acting on behalf of a user is authenticated or verified as a prerequisite to system access; and', status: 'pending' },
        { id: 'c', description: 'the identity of each device accessing or connecting to the system is authenticated or verified as a prerequisite to system access.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2', 'IA-3'] }
    },
    { id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Multifactor Authentication', description: 'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'privileged accounts are identified;', status: 'pending' },
        { id: 'b', description: 'multifactor authentication is implemented for local access to privileged accounts;', status: 'pending' },
        { id: 'c', description: 'multifactor authentication is implemented for network access to privileged accounts; and', status: 'pending' },
        { id: 'd', description: 'multifactor authentication is implemented for network access to non-privileged accounts.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] }
    },
    { id: '3.5.4', framework: 'NIST-CMMC', family: 'IA', title: 'Replay-Resistant Authentication', description: 'Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'replay-resistant authentication mechanisms are implemented for network account access to privileged and non-privileged accounts.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] }
    },
    { id: '3.5.5', framework: 'NIST-CMMC', family: 'IA', title: 'Identifier Reuse', description: 'Prevent reuse of identifiers for a defined period.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a period within which identifiers cannot be reused is defined; and', status: 'pending' },
        { id: 'b', description: 'reuse of identifiers is prevented within the defined period.', status: 'pending' }
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
    { id: '3.5.7', framework: 'NIST-CMMC', family: 'IA', title: 'Password Complexity', description: 'Enforce a minimum password complexity and change of characters when new passwords are created.', cmmcLevel: 2, sprsWeight: 3,
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
    { id: '3.5.9', framework: 'NIST-CMMC', family: 'IA', title: 'Temporary Passwords', description: 'Allow temporary password use for system logons with an immediate change to a permanent password.', cmmcLevel: 2, sprsWeight: 3,
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

    // --- INCIDENT RESPONSE (IR) DOMAIN ---

    { id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Handling', description: 'Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.', cmmcLevel: 2, sprsWeight: 3,
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
    { id: '3.6.2', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Reporting', description: 'Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'incidents are tracked;', status: 'pending' },
        { id: 'b', description: 'incidents are documented;', status: 'pending' },
        { id: 'c', description: 'authorities to whom incidents are to be reported are identified;', status: 'pending' },
        { id: 'd', description: 'organizational officials to whom incidents are to be reported are identified;', status: 'pending' },
        { id: 'e', description: 'identified authorities are notified of incidents; and', status: 'pending' },
        { id: 'f', description: 'identified organizational officials are notified of incidents.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-6'] }
    },
    { id: '3.6.3', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Response Testing', description: 'Test the organizational incident response capability.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the incident response capability is tested.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-3'] }
    },

    // --- MAINTENANCE (MA) DOMAIN ---

    { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'Perform Maintenance', description: 'Perform maintenance on organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system maintenance is performed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] }
    },
    { id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', title: 'System Maintenance Control', description: 'Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'tools used to conduct system maintenance are controlled;', status: 'pending' },
        { id: 'b', description: 'techniques used to conduct system maintenance are controlled;', status: 'pending' },
        { id: 'c', description: 'mechanisms used to conduct system maintenance are controlled; and', status: 'pending' },
        { id: 'd', description: 'personnel used to conduct system maintenance are controlled.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-3'] }
    },
    { id: '3.7.3', framework: 'NIST-CMMC', family: 'MA', title: 'Equipment Sanitization', description: 'Ensure equipment removed for off-site maintenance is sanitized of any CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'equipment to be removed from organizational spaces for off-site maintenance is sanitized of any CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] }
    },
    { id: '3.7.4', framework: 'NIST-CMMC', family: 'MA', title: 'Media Inspection', description: 'Check media containing diagnostic and test programs for malicious code before the media are used in organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'media containing diagnostic and test programs are checked for malicious code before being used in organizational systems that process, store, or transmit CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-3'] }
    },
    { id: '3.7.5', framework: 'NIST-CMMC', family: 'MA', title: 'Nonlocal Maintenance', description: 'Require multifactor authentication to establish nonlocal maintenance sessions via external network connections and terminate such connections when nonlocal maintenance is complete.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'multifactor authentication is used to establish nonlocal maintenance sessions via external network connections; and', status: 'pending' },
        { id: 'b', description: 'nonlocal maintenance sessions established via external network connections are terminated when nonlocal maintenance is complete.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-4'] }
    },
    { id: '3.7.6', framework: 'NIST-CMMC', family: 'MA', title: 'Maintenance Personnel', description: 'Supervise the maintenance activities of maintenance personnel without required access authorization.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'maintenance personnel without required access authorization are supervised during maintenance activities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-5'] }
    },

    // --- MEDIA PROTECTION (MP) DOMAIN ---

    { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Media Protection', description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.', cmmcLevel: 2, sprsWeight: 3,
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
    { id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', title: 'Media Disposal [CUI DATA]', description: 'Sanitize or destroy system media containing CUI before disposal or release for reuse.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system media containing CUI is sanitized or destroyed before disposal; and', status: 'pending' },
        { id: 'b', description: 'system media containing CUI is sanitized before it is released for reuse.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-6'] }
    },
    { id: '3.8.4', framework: 'NIST-CMMC', family: 'MP', title: 'Media Markings', description: 'Mark media with necessary CUI markings and distribution limitations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'media containing CUI is marked with applicable CUI markings; and', status: 'pending' },
        { id: 'b', description: 'media containing CUI is marked with distribution limitations.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-3'] }
    },
    { id: '3.8.5', framework: 'NIST-CMMC', family: 'MP', title: 'Media Accountability', description: 'Control access to media containing CUI and maintain accountability for media during transport outside of controlled areas.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'access to media containing CUI is controlled; and', status: 'pending' },
        { id: 'b', description: 'accountability for media containing CUI is maintained during transport outside of controlled areas.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-5'] }
    },
    { id: '3.8.6', framework: 'NIST-CMMC', family: 'MP', title: 'Portable Storage Encryption', description: 'Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport unless otherwise protected by alternative physical safeguards.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the confidentiality of CUI stored on digital media is protected during transport using cryptographic mechanisms or alternative physical safeguards.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-5'] }
    },
    { id: '3.8.7', framework: 'NIST-CMMC', family: 'MP', title: 'Removeable Media', description: 'Control the use of removable media on system components.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the use of removable media on system components is controlled.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-7'] }
    },
    { id: '3.8.8', framework: 'NIST-CMMC', family: 'MP', title: 'Shared Media', description: 'Prohibit the use of portable storage devices when such devices have no identifiable owner.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the use of portable storage devices is prohibited when such devices have no identifiable owner.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-7'] }
    },
    { id: '3.8.9', framework: 'NIST-CMMC', family: 'MP', title: 'Protect Backups', description: 'Protect the confidentiality of backup CUI at storage locations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the confidentiality of backup CUI is protected at storage locations.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CP-9'] }
    },

    // --- PERSONNEL SECURITY (PS) DOMAIN ---

    { id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', title: 'Screen Individuals', description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'individuals are screened prior to authorizing access to organizational systems containing CUI.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-3'] }
    },
    { id: '3.9.2', framework: 'NIST-CMMC', family: 'PS', title: 'Personnel Actions', description: 'Ensure that organizational systems containing CUI are protected during and after personnel actions such as terminations and transfers.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a policy and/or process for terminating system access and any credentials coincident with personnel actions is established;', status: 'pending' },
        { id: 'b', description: 'system access and credentials are terminated consistent with personnel actions such as termination or transfer; and', status: 'pending' },
        { id: 'c', description: 'the system is protected during and after personnel transfer actions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-4', 'PS-5'] }
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