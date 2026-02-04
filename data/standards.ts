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
      mappings: { nist800_53: ['AC-2', 'AC-3'] },
      interviewOptions: [
        "Who is allowed to access systems that store, process, or transmit CUI?",
        "How are users approved before being given access?",
        "Who approves access requests?",
        "How is access removed when someone leaves or changes roles?"
      ]
    },
    { id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Transaction & Function Control', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the types of transactions and functions that authorized users are permitted to execute are defined; and', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined types of transactions and functions for authorized users.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-3'] },
      interviewOptions: [
        "What actions can a normal user perform on CUI systems?",
        "Are there actions that only administrators can perform?",
        "How do you prevent users from performing unauthorized actions?"
      ]
    },
    { id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control CUI Flow', description: 'Control the flow of CUI in accordance with approved authorizations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'information flow control policies are defined;', status: 'pending' },
        { id: 'b', description: 'methods and enforcement mechanisms for controlling the flow of CUI are defined;', status: 'pending' },
        { id: 'c', description: 'designated sources and destinations for CUI are identified;', status: 'pending' },
        { id: 'd', description: 'authorizations for controlling the flow of CUI are defined; and', status: 'e', description: 'approved authorizations for controlling the flow of CUI are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-4'] },
      interviewOptions: [
        "How is CUI allowed to move between systems?",
        "Are there restrictions on emailing, downloading, or sharing CUI?",
        "Can CUI be sent to external email addresses? If yes, how is it protected?",
        "What tools enforce these restrictions?"
      ]
    },
    { id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separation of Duties', description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the duties of individuals requiring separation are defined;', status: 'pending' },
        { id: 'b', description: 'responsibilities for duties that require separation are assigned to separate individuals; and', status: 'c', description: 'access privileges that enable individuals to exercise the duties that require separation are granted to separate individuals.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-5'] },
      interviewOptions: [
        "What key sensitive tasks are split between multiple people to prevent fraud/collusion?",
        "How is separation of duties enforced in your identity management system?",
        "Who reviews the assignments of conflicting duties?"
      ]
    },
    { id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', title: 'Least Privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'privileged accounts are identified;', status: 'pending' },
        { id: 'b', description: 'access to privileged accounts is authorized in accordance with the principle of least privilege;', status: 'pending' },
        { id: 'c', description: 'security functions are identified; and', status: 'd', description: 'access to security functions is authorized in accordance with the principle of least privilege.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6'] },
      interviewOptions: [
        "How do you ensure users only have access they need to do their job?",
        "How often is user access reviewed?",
        "What happens if excessive permissions are found?"
      ]
    },
    { id: '3.1.6', framework: 'NIST-CMMC', family: 'AC', title: 'Non-Privileged Account Use', description: 'Use non-privileged accounts or roles when accessing nonsecurity functions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'nonsecurity functions are identified; and', status: 'b', description: 'non-privileged accounts or roles are used when accessing nonsecurity functions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6'] },
      interviewOptions: [
        "Who has administrative access to systems that handle CUI?",
        "How are admin accounts different from normal user accounts?",
        "Is MFA required for administrators?",
        "Are shared admin accounts used? If yes, why?"
      ]
    },
    { id: '3.1.7', framework: 'NIST-CMMC', family: 'AC', title: 'Privileged Functions', description: 'Prevent non-privileged users from executing privileged functions and capture the execution of such functions in audit logs.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'privileged functions are defined;', status: 'pending' },
        { id: 'b', description: 'non-privileged users are defined;', status: 'pending' },
        { id: 'c', description: 'non-privileged users are prevented from executing privileged functions; and', status: 'd', description: 'the execution of privileged functions is captured in audit logs.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6', 'AU-2'] },
      interviewOptions: [
        "Are users prevented from installing software?",
        "Can users modify system configurations?",
        "How are restrictions enforced?"
      ]
    },
    { id: '3.1.8', framework: 'NIST-CMMC', family: 'AC', title: 'Unsuccessful Logon Attempts', description: 'Limit unsuccessful logon attempts.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the means of limiting unsuccessful logon attempts is defined; and', status: 'b', description: 'the defined means of limiting unsuccessful logon attempts is implemented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-7'] },
      interviewOptions: [
        "How many failed attempts are allowed before an account is locked?",
        "How is the lockout threshold configured and enforced?",
        "Who is notified when a lockout occurs?"
      ]
    },
    { id: '3.1.9', framework: 'NIST-CMMC', family: 'AC', title: 'Privacy & Security Notices', description: 'Provide privacy and security notices consistent with applicable CUI rules.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'privacy and security notices required by CUI-specified rules are identified; and', status: 'b', description: 'privacy and security notices are displayed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-8'] },
      interviewOptions: [
        "Are login banners displayed on all CUI systems?",
        "Does the banner state that the system is monitored and for authorized use only?",
        "How do you verify banners are appearing on mobile or remote endpoints?"
      ]
    },
    { id: '3.1.10', framework: 'NIST-CMMC', family: 'AC', title: 'Session Lock', description: 'Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the period of inactivity after which the system initiates a session lock is defined;', status: 'pending' },
        // Fixed: Split merged objective into 'b' and 'c' to avoid duplicate property names in object literal
        { id: 'b', description: 'access to the system and viewing of data is prevented by initiating a session lock after the defined period of inactivity; and', status: 'pending' },
        { id: 'c', description: 'previously visible information is concealed via a pattern-hiding display after the defined period of inactivity.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-11'] },
      interviewOptions: [
        "Do systems automatically lock after inactivity?",
        "How long before a session locks?",
        "Can users bypass session locks?"
      ]
    },
    { id: '3.1.11', framework: 'NIST-CMMC', family: 'AC', title: 'Session Termination', description: 'Terminate (automatically) a user session after a defined condition.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'conditions requiring a user session to terminate are defined; and', status: 'b', description: 'a user session is automatically terminated after any of the defined conditions occur.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-12'] },
      interviewOptions: [
        "What conditions (e.g. end of shift, logout, disconnection) trigger automatic termination?",
        "How do you handle persistent connections for long-running processes?"
      ]
    },
    { id: '3.1.12', framework: 'NIST-CMMC', family: 'AC', title: 'Control Remote Access', description: 'Monitor and control remote access sessions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'remote access sessions are permitted;', status: 'pending' },
        { id: 'b', description: 'the types of permitted remote access are identified;', status: 'pending' },
        { id: 'c', description: 'remote access sessions are controlled; and', status: 'd', description: 'remote access sessions are monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-17'] },
      interviewOptions: [
        "How do users remotely access systems containing CUI?",
        "What security controls are required for remote access?",
        "Is remote access logged and monitored?",
        "How do you monitor access to CUI?",
        "Are alerts generated for suspicious access?",
        "Who reviews access logs?"
      ]
    },
    { id: '3.1.13', framework: 'NIST-CMMC', family: 'AC', title: 'Remote Access Confidentiality', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'cryptographic mechanisms to protect the confidentiality of remote access sessions are identified; and', status: 'b', description: 'cryptographic mechanisms to protect the confidentiality of remote access sessions are implemented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-17'] },
      interviewOptions: [
        "Is all remote access traffic encrypted using FIPS 140-2/3 validated modules?",
        "How do you verify the encryption strength of VPN or TLS sessions?"
      ]
    },
    { id: '3.1.16', framework: 'NIST-CMMC', family: 'AC', title: 'Wireless Access Authorization', description: 'Authorize wireless access prior to allowing such connections.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'wireless access points are identified; and', status: 'b', description: 'wireless access is authorized prior to allowing such connections.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-18'] },
      interviewOptions: [
        "Is wireless networking used?",
        "Can wireless devices access CUI?",
        "How is wireless access secured?"
      ]
    },
    { id: '3.1.18', framework: 'NIST-CMMC', family: 'AC', title: 'Mobile Device Connection', description: 'Control connection of mobile devices.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'mobile devices that process, store, or transmit CUI are identified;', status: 'pending' },
        { id: 'b', description: 'mobile device connections are authorized; and', status: 'c', description: 'mobile device connections are monitored and logged.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-19'] },
      interviewOptions: [
        "What devices are allowed to access CUI?",
        "Are personal devices allowed (BYOD)?",
        "How is device compliance enforced via MDM?"
      ]
    },
    { id: '3.1.20', framework: 'NIST-CMMC', family: 'AC', title: 'External Connections [CUI DATA]', description: 'Verify and control/limit connections to and use of external systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'connections to external systems are identified;', status: 'pending' },
        { id: 'b', description: 'the use of external systems is identified;', status: 'pending' },
        { id: 'c', description: 'connections to external systems are verified;', status: 'pending' },
        { id: 'd', description: 'the use of external systems is verified;', status: 'pending' },
        { id: 'e', description: 'connections to external systems are controlled/limited; and', status: 'f', description: 'the use of external systems is controlled/limited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-20'] },
      interviewOptions: [
        "Are external systems allowed to connect to your environment?",
        "How are external connections approved and documented?",
        "How are external connections monitored?"
      ]
    },

    // --- IDENTIFICATION AND AUTHENTICATION (IA) ---
    { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identification [CUI DATA]', description: 'Identify system users, processes acting on behalf of users, and devices.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'system users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of users are identified; and', status: 'c', description: 'devices accessing the system are identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] },
      interviewOptions: [
        "How are users uniquely identified?",
        "Are shared user accounts allowed?",
        "How are service accounts documented?"
      ]
    },
    { id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', title: 'Authentication [CUI DATA]', description: 'Authenticate (or verify) the identities of users, processes, or devices.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the identity of each user is authenticated or verified as a prerequisite to system access;', status: 'pending' },
        { id: 'b', description: 'the identity of each process acting on behalf of a user is authenticated or verified as a prerequisite to system access; and', status: 'c', description: 'the identity of each device accessing or connecting to the system is authenticated or verified as a prerequisite to system access', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] },
      interviewOptions: [
        "What authentication methods are used (password, MFA, smart card)?",
        "Is MFA required for all users accessing CUI?",
        "Are there any MFA exceptions?"
      ]
    },
    { id: '3.5.7', framework: 'NIST-CMMC', family: 'IA', title: 'Password Complexity', description: 'Enforce minimum password complexity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'password complexity requirements are defined;', status: 'pending' },
        { id: 'b', description: 'password change of character requirements are defined;', status: 'pending' },
        { id: 'c', description: 'minimum password complexity requirements as defined are enforced when new passwords are created; and', status: 'd', description: 'minimum password change of character requirements as defined are enforced when new passwords are created.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-5'] },
      interviewOptions: [
        "What are your password complexity requirements?",
        "How often are passwords changed?",
        "Are password reuse restrictions enforced?"
      ]
    },

    // --- AUDIT AND ACCOUNTABILITY (AU) ---
    { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'System Auditing', description: 'Create and retain system audit logs and records to the extent needed.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit logs needed (i.e., event types to be logged) to enable monitoring and analysis are specified;', status: 'pending' },
        { id: 'b', description: 'the content of audit records needed to support monitoring and analysis is defined;', status: 'pending' },
        { id: 'c', description: 'audit records are created (generated);', status: 'pending' },
        { id: 'd', description: 'audit records, once created, contain the defined content;', status: 'pending' },
        { id: 'e', description: 'retention requirements for audit records are defined; and', status: 'f', description: 'audit records are retained as defined.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2', 'AU-3', 'AU-11', 'AU-12'] },
      interviewOptions: [
        "What events are logged (logins, access, changes)?",
        "Are failed login attempts logged?",
        "Are admin actions logged?"
      ]
    },
    { id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'User Accountability', description: 'Ensure that the actions of individual system users can be uniquely traced.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the content of the audit records needed to support the ability to uniquely trace users to their actions is defined; and', status: 'b', description: 'audit records, once created, contain the defined content.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2'] },
      interviewOptions: [
        "Do logs record User, Time, System, and Action taken?"
      ]
    },
    { id: '3.3.3', framework: 'NIST-CMMC', family: 'AU', title: 'Event Review', description: 'Review and update logged events.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a process for determining when to review logged events is defined;', status: 'pending' },
        { id: 'b', description: 'event types being logged are reviewed in accordance with the defined review process; and', status: 'c', description: 'event types being logged are updated based on the review.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-6'] },
      interviewOptions: [
        "Who reviews audit logs?",
        "How often are logs reviewed?",
        "What happens if suspicious activity is found?"
      ]
    },
    { id: '3.3.8', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Protection', description: 'Protect audit information and audit logging tools.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit information is protected from unauthorized access;', status: 'pending' },
        { id: 'b', description: 'audit information is protected from unauthorized modification;', status: 'pending' },
        { id: 'c', description: 'audit information is protected from unauthorized deletion;', status: 'pending' },
        { id: 'd', description: 'audit logging tools are protected from unauthorized access;', status: 'e', description: 'audit logging tools are protected from unauthorized modification; and', status: 'f', description: 'audit logging tools are protected from unauthorized deletion.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-9'] },
      interviewOptions: [
        "How are logs protected from deletion or modification?",
        "Who can access logs?"
      ]
    },

    // --- CONFIGURATION MANAGEMENT (CM) ---
    { id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'System Baselining', description: 'Establish and maintain baseline configurations and inventories.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a baseline configuration is established;', status: 'pending' },
        { id: 'b', description: 'the baseline configuration includes hardware, software, firmware, and documentation;', status: 'pending' },
        { id: 'c', description: 'the baseline configuration is maintained (reviewed and updated) throughout the system development life cycle;', status: 'pending' },
        { id: 'd', description: 'a system inventory is established;', status: 'e', description: 'the system inventory includes hardware, software, firmware, and documentation; and', status: 'f', description: 'the inventory is maintained (reviewed and updated) throughout the system development life cycle.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-2', 'CM-8'] },
      interviewOptions: [
        "Do you have documented baseline configurations?",
        "How are new systems configured?",
        "Who approves configuration changes?",
        "How do you track hardware assets?",
        "How do you track software assets?"
      ]
    },
    { id: '3.4.3', framework: 'NIST-CMMC', family: 'CM', title: 'System Change Management', description: 'Track, review, approve or disapprove, and log changes.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'changes to the system are tracked;', status: 'pending' },
        { id: 'b', description: 'changes to the system are reviewed;', status: 'c', description: 'changes to the system are approved or disapproved; and', status: 'd', description: 'changes to the system are logged.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-3'] },
      interviewOptions: [
        "How are system changes requested?",
        "How are changes approved?",
        "Are emergency changes documented?"
      ]
    },
    { id: '3.4.8', framework: 'NIST-CMMC', family: 'CM', title: 'Application Execution Policy', description: 'Apply deny-by-exception (blacklisting) or deny-all, permit-by-exception (whitelisting).', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a policy specifying whether whitelisting or blacklisting is to be implemented is specified;', status: 'pending' },
        { id: 'b', description: 'the software allowed to execute under whitelisting or denied use under blacklisting is specified; and', status: 'c', description: 'whitelisting to allow the execution of authorized software or blacklisting to prevent the use of unauthorized software is implemented as specified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-7'] },
      interviewOptions: [
        "How do you prevent unauthorized software installation?",
        "How do you detect unauthorized software?"
      ]
    },
    { id: '3.4.6', framework: 'NIST-CMMC', family: 'CM', title: 'Least Functionality', description: 'Employ the principle of least functionality.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'essential system capabilities are defined based on the principle of least functionality; and', status: 'b', description: 'the system is configured to provide only the defined essential capabilities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-7'] },
      interviewOptions: [
        "Are unnecessary services disabled?",
        "Who decides which services are allowed?"
      ]
    },
    { id: '3.4.9', framework: 'NIST-CMMC', family: 'CM', title: 'User-Installed Software', description: 'Control and monitor user-installed software.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a policy for controlling the installation of software by users is established;', status: 'pending' },
        { id: 'b', description: 'installation of software by users is controlled based on the established policy; and', status: 'c', description: 'installation of software by users is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-11'] },
      interviewOptions: [
        "Can users install software?",
        "How are exceptions handled?"
      ]
    },

    // --- INCIDENT RESPONSE (IR) ---
    { id: '3.6.1', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Handling', description: 'Establish an operational incident-handling capability.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'an operational incident-handling capability is established;', status: 'pending' },
        { id: 'b', description: 'the operational incident-handling capability includes preparation;', status: 'pending' },
        { id: 'c', description: 'the operational incident-handling capability includes detection;', status: 'pending' },
        { id: 'd', description: 'the operational incident-handling capability includes analysis;', status: 'pending' },
        { id: 'e', description: 'the operational incident-handling capability includes containment;', status: 'pending' },
        { id: 'f', description: 'the operational incident-handling capability includes recovery; and', status: 'g', description: 'the operational incident-handling capability includes user response activities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-4'] },
      interviewOptions: [
        "How do you define a security incident?",
        "How are incidents reported?",
        "Who responds to incidents?"
      ]
    },
    { id: '3.6.2', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Reporting', description: 'Track, document, and report incidents.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'incidents are tracked;', status: 'pending' },
        { id: 'b', description: 'incidents are documented;', status: 'pending' },
        { id: 'c', description: 'authorities to whom incidents are to be reported are identified;', status: 'pending' },
        { id: 'd', description: 'organizational officials to whom incidents are to be reported are identified;', status: 'pending' },
        { id: 'e', description: 'identified authorities are notified of incidents; and', status: 'f', description: 'identified organizational officials are notified of incidents', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-6'] },
      interviewOptions: [
        "Do you have a documented IR plan?",
        "When was it last tested?",
        "How are lessons learned captured?"
      ]
    },
    { id: '3.6.3', framework: 'NIST-CMMC', family: 'IR', title: 'Incident Response Testing', description: 'Test the organizational incident response capability.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the incident response capability is tested.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-3'] },
      interviewOptions: [
        "Have you conducted tabletop or live incident tests?",
        "When was the last test?"
      ]
    },

    // --- MAINTENANCE (MA) ---
    { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'Perform Maintenance', description: 'Perform maintenance on organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system maintenance is performed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] },
      interviewOptions: [
        "How is system maintenance performed?",
        "Who performs maintenance?"
      ]
    },
    { id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', title: 'System Maintenance Control', description: 'Provide controls on maintenance tools and personnel.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'tools used to conduct system maintenance are controlled;', status: 'pending' },
        { id: 'b', description: 'techniques used to conduct system maintenance are controlled;', status: 'c', description: 'mechanisms used to conduct system maintenance are controlled; and', status: 'd', description: 'personnel used to conduct system maintenance are controlled.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-3'] },
      interviewOptions: [
        "What tools are used for maintenance?",
        "Are maintenance tools restricted?"
      ]
    },

    // --- MEDIA PROTECTION (MP) ---
    { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Media Protection', description: 'Protect system media containing CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'paper media containing CUI is physically controlled;', status: 'pending' },
        { id: 'b', description: 'digital media containing CUI is physically controlled;', status: 'pending' },
        { id: 'c', description: 'paper media containing CUI is securely stored; and', status: 'd', description: 'digital media containing CUI is securely stored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-2', 'MP-4'] },
      interviewOptions: [
        "What types of media store CUI?",
        "How is media protected?"
      ]
    },
    { id: '3.8.2', framework: 'NIST-CMMC', family: 'MP', title: 'Media Access', description: 'Limit access to CUI on system media to authorized users.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'access to CUI on system media is limited to authorized users.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-2'] },
      interviewOptions: [
        "Who can access media containing CUI?"
      ]
    },
    { id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', title: 'Media Disposal [CUI DATA]', description: 'Sanitize or destroy system media containing CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system media containing CUI is sanitized or destroyed before disposal; and', status: 'b', description: 'system media containing CUI is sanitized before it is released for reuse.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-6'] },
      interviewOptions: [
        "How is media sanitized before disposal?",
        "Who performs sanitization?"
      ]
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
        { id: 'b', description: 'system access and credentials are terminated consistent with personnel actions such as termination or transfer; and', status: 'c', description: 'the system is protected during and after personnel transfer actions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-4', 'PS-5'] }
    },

    // --- PHYSICAL PROTECTION (PE) ---
    { id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit Physical Access [CUI DATA]', description: 'Limit physical access to organizational systems and equipment.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'authorized individuals allowed physical access are identified;', status: 'pending' },
        { id: 'b', description: 'physical access to organizational systems is limited to authorized individuals;', status: 'pending' },
        { id: 'c', description: 'physical access to equipment is limited to authorized individuals; and', status: 'd', description: 'physical access to operating environments is limited to authorized individuals.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-2', 'PE-3'] },
      interviewOptions: [
        "Who can physically access systems storing CUI?",
        "How is access controlled?"
      ]
    },
    { id: '3.10.3', framework: 'NIST-CMMC', family: 'PE', title: 'Escort Visitors [CUI DATA]', description: 'Escort visitors and monitor visitor activity.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'visitors are escorted; and', status: 'b', description: 'visitor activity is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-3'] },
      interviewOptions: [
        "How are visitors logged?",
        "Are visitors escorted?"
      ]
    },

    // --- RISK ASSESSMENT (RA) ---
    { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Risk Assessments', description: 'Periodically assess the risk to organizational operations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency to assess risk to organizational operations, organizational assets, and individuals is defined; and', status: 'b', description: 'risk to organizational operations, organizational assets, and individuals resulting from the operation of an organizational system is assessed with the defined frequency.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-3'] },
      interviewOptions: [
        "When was your last risk assessment?",
        "What risks were identified?",
        "How are risks tracked?"
      ]
    },

    // --- SECURITY ASSESSMENT (CA) ---
    { id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Security Control Assessment', description: 'Periodically assess security controls.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the frequency of security control assessments is defined; and', status: 'b', description: 'security controls are assessed with the defined frequency to determine if the controls are effective in their application.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CA-2'] },
      interviewOptions: [
        "Do you have a System Security Plan?",
        "Does it reflect your current environment?"
      ]
    },
    { id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', title: 'System Security Plan', description: 'Develop, document, and periodically update system security plans (SSP).', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'a system security plan is developed;', status: 'pending' },
        { id: 'b', description: 'the system boundary is described and documented in the system security plan;', status: 'pending' },
        { id: 'c', description: 'the system environment of operation is described and documented in the system security plan;', status: 'pending' },
        { id: 'd', description: 'the security requirements identified as non-applicable are identified;', status: 'pending' },
        { id: 'e', description: 'the method of security requirement implementation is described and documented in the system security plan;', status: 'pending' },
        { id: 'f', description: 'the relationship with or connection to other systems is described and documented in the system security plan;', status: 'pending' },
        { id: 'g', description: 'the frequency to update the system security plan is defined; and', status: 'h', description: 'system security plan is updated with the defined frequency', status: 'pending' }
      ],
      mappings: { nist800_53: ['PL-2'] },
      interviewOptions: [
        "How do you track security gaps?",
        "Who owns remediation (POA&M)?"
      ]
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
        { id: 'g', description: 'communications are protected at the external system boundary; and', status: 'h', description: 'communications are protected at key internal boundaries.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] },
      interviewOptions: [
        "How is your network perimeter protected?",
        "What firewall(s) are used?"
      ]
    },
    { id: '3.13.8', framework: 'NIST-CMMC', family: 'SC', title: 'Data in Transit', description: 'Implement cryptographic mechanisms to protect CUI during transmission.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'cryptographic mechanisms intended to prevent unauthorized disclosure of CUI are identified;', status: 'pending' },
        { id: 'b', description: 'alternative physical safeguards intended to prevent unauthorized disclosure of CUI are identified; and', status: 'c', description: 'either cryptographic mechanisms or alternative physical safeguards are implemented to prevent unauthorized disclosure of CUI during transmission.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-8'] },
      interviewOptions: [
        "Is CUI encrypted in transit?",
        "What encryption methods are used?"
      ]
    },

    // --- SYSTEM AND INFORMATION INTEGRITY (SI) ---
    { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Flaw Remediation [CUI DATA]', description: 'Identify, report, and correct system flaws.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the time within which to identify system flaws is specified;', status: 'pending' },
        { id: 'b', description: 'system flaws are identified within the specified time frame;', status: 'pending' },
        { id: 'c', description: 'the time within which to report system flaws is specified;', status: 'pending' },
        { id: 'd', description: 'system flaws are reported within the specified time frame;', status: 'pending' },
        // Fixed: Split merged objective into 'e' and 'f' to avoid duplicate property names in object literal
        { id: 'e', description: 'the time within which to correct system flaws is specified; and', status: 'pending' },
        { id: 'f', description: 'system flaws are corrected within the specified time frame.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-2'] },
      interviewOptions: [
        "How are vulnerabilities identified?",
        "How quickly are patches applied?"
      ]
    },
    { id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', title: 'Malicious Code Protection [CUI DATA]', description: 'Provide protection from malicious code.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'designated locations for malicious code protection are identified; and', status: 'b', description: 'protection from malicious code at designated locations is provided.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-3'] },
      interviewOptions: [
        "What malware protection is in place?",
        "How are alerts handled?"
      ]
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