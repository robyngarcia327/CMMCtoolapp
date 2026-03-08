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
        { id: 'c', description: 'devices authorized to connect are identified;', status: 'pending' },
        { id: 'd', description: 'system access is limited to authorized users;', status: 'pending' },
        { id: 'e', description: 'system access is limited to authorized processes; and', status: 'pending' },
        { id: 'f', description: 'system access is limited to authorized devices.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-2', 'AC-3'] },
      interviewOptions: ["Who is allowed to access systems that store, process, or transmit CUI?", "How are users approved before being given access?", "Who approves access requests?", "How is access removed when someone leaves or changes roles?"]
    },
    { id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Transaction & Function Control', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'permitted transactions and functions are defined; and', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined transactions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-3'] },
      interviewOptions: ["What actions can a normal user perform on CUI systems?", "Are there actions that only administrators can perform?", "How do you prevent users from performing unauthorized actions?"]
    },
    { id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Information Flow Control', description: 'Control the flow of CUI in accordance with approved authorizations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'information flow control policies are defined;', status: 'pending' },
        { id: 'b', description: 'methods for controlling flow are defined;', status: 'pending' },
        { id: 'c', description: 'designated sources/destinations for CUI are identified;', status: 'pending' },
        { id: 'd', description: 'authorizations for controlling flow are defined; and', status: 'pending' },
        { id: 'e', description: 'approved authorizations are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-4'] },
      interviewOptions: ["How is CUI allowed to move between systems?", "Are there restrictions on emailing, downloading, or sharing CUI?", "Can CUI be sent to external email addresses? If yes, how is it protected?", "What tools enforce these restrictions?"]
    },
    { id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separation of Duties', description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'separation of duties is defined;', status: 'pending' },
        { id: 'b', description: 'responsibilities for duties are assigned to separate individuals; and', status: 'pending' },
        { id: 'c', description: 'access privileges are defined to support separation of duties.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-5'] },
      interviewOptions: ["Are there tasks that require more than one person to complete?", "How do you ensure no single person has too much control over a sensitive process?", "Give an example of separation of duties in your IT or finance department."]
    },
    { id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', title: 'Least Privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'privileged accounts are identified;', status: 'pending' },
        { id: 'b', description: 'security functions are identified;', status: 'pending' },
        { id: 'c', description: 'least privilege is defined for privileged accounts;', status: 'pending' },
        { id: 'd', description: 'least privilege is defined for security functions; and', status: 'pending' },
        { id: 'e', description: 'least privilege is enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6'] },
      interviewOptions: ["How do you decide what level of access a user needs?", "Do users have administrator rights on their local computers?", "How often do you review user access levels?"]
    },
    { id: '3.1.6', framework: 'NIST-CMMC', family: 'AC', title: 'Non-Privileged User Accounts', description: 'Use non-privileged accounts or roles when accessing non-security functions.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'non-privileged accounts or roles are defined;', status: 'pending' },
        { id: 'b', description: 'non-security functions are defined; and', status: 'pending' },
        { id: 'c', description: 'non-privileged accounts or roles are used for non-security functions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6'] },
      interviewOptions: ["Do administrators use their admin accounts for daily tasks like email and web browsing?", "How do you enforce the use of standard user accounts for non-admin work?"]
    },
    { id: '3.1.7', framework: 'NIST-CMMC', family: 'AC', title: 'Privileged Function Access', description: 'Prevent non-privileged users from executing privileged functions and audit the execution of such functions.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'privileged functions are defined;', status: 'pending' },
        { id: 'b', description: 'non-privileged users are prevented from executing privileged functions; and', status: 'pending' },
        { id: 'c', description: 'execution of privileged functions is audited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-6'] },
      interviewOptions: ["How do you stop regular users from performing administrative tasks?", "Are administrative actions logged and reviewed?"]
    },
    { id: '3.1.8', framework: 'NIST-CMMC', family: 'AC', title: 'Unsuccessful Logon Attempts', description: 'Limit unsuccessful logon attempts.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'number of unsuccessful logon attempts is defined;', status: 'pending' },
        { id: 'b', description: 'time period for unsuccessful logon attempts is defined; and', status: 'pending' },
        { id: 'c', description: 'logon attempts are limited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-7'] },
      interviewOptions: ["How many failed login attempts are allowed before an account is locked?", "How long is the account locked for?"]
    },
    { id: '3.1.9', framework: 'NIST-CMMC', family: 'AC', title: 'Logon Notification', description: 'Provide privacy and security notices consistent with applicable CUI rules.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'privacy and security notices are defined; and', status: 'pending' },
        { id: 'b', description: 'notices are displayed before granting system access.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-8'] },
      interviewOptions: ["Do users see a warning banner before logging into the system?", "What does the warning banner say?"]
    },
    { id: '3.1.10', framework: 'NIST-CMMC', family: 'AC', title: 'Session Termination', description: 'Use session lock with contextual awareness and automatic termination.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'session lock is defined;', status: 'pending' },
        { id: 'b', description: 'session lock is triggered by inactivity; and', status: 'pending' },
        { id: 'c', description: 'session lock is cleared by user authentication.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-11'] },
      interviewOptions: ["How long can a computer be idle before it locks automatically?", "How do users unlock their computers?"]
    },
    { id: '3.1.11', framework: 'NIST-CMMC', family: 'AC', title: 'Session Termination', description: 'Terminate (automatically) a user session after a defined condition.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'conditions for automatic session termination are defined; and', status: 'pending' },
        { id: 'b', description: 'sessions are automatically terminated.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-12'] },
      interviewOptions: ["When does the system automatically log a user out (e.g., end of shift, long inactivity)?"]
    },
    { id: '3.1.12', framework: 'NIST-CMMC', family: 'AC', title: 'Remote Access Control', description: 'Monitor and control remote access sessions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'remote access is defined;', status: 'pending' },
        { id: 'b', description: 'remote access is monitored; and', status: 'pending' },
        { id: 'c', description: 'remote access is controlled.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-17'] },
      interviewOptions: ["How do users access the network from home or while traveling?", "Is remote access logged and monitored for suspicious activity?"]
    },
    { id: '3.1.13', framework: 'NIST-CMMC', family: 'AC', title: 'Remote Access Encryption', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'cryptographic mechanisms are defined; and', status: 'pending' },
        { id: 'b', description: 'cryptographic mechanisms are used for remote access.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-17'] },
      interviewOptions: ["Is your VPN or remote access tool using strong encryption (e.g., FIPS 140-2)?"]
    },
    { id: '3.1.14', framework: 'NIST-CMMC', family: 'AC', title: 'Remote Access Routing', description: 'Route all remote access through managed access control points.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'managed access control points are defined; and', status: 'pending' },
        { id: 'b', description: 'remote access is routed through control points.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-17'] },
      interviewOptions: ["Do all remote users have to go through the VPN or a specific gateway?"]
    },
    { id: '3.1.15', framework: 'NIST-CMMC', family: 'AC', title: 'Privileged Remote Access', description: 'Authorize remote execution of privileged commands and remote access to security-relevant information.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'privileged commands for remote execution are defined;', status: 'pending' },
        { id: 'b', description: 'security-relevant information for remote access is defined;', status: 'pending' },
        { id: 'c', description: 'remote execution of privileged commands is authorized; and', status: 'pending' },
        { id: 'd', description: 'remote access to security-relevant information is authorized.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-17'] },
      interviewOptions: ["Are administrators allowed to perform sensitive tasks remotely?", "Is there a special approval process for this?"]
    },
    { id: '3.1.16', framework: 'NIST-CMMC', family: 'AC', title: 'Wireless Access Control', description: 'Authorize wireless access prior to allowing such connections.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'wireless access is defined; and', status: 'pending' },
        { id: 'b', description: 'wireless access is authorized.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-18'] },
      interviewOptions: ["How do you control who can connect to the company Wi-Fi?", "Is there a guest Wi-Fi separate from the corporate Wi-Fi?"]
    },
    { id: '3.1.17', framework: 'NIST-CMMC', family: 'AC', title: 'Wireless Access Encryption', description: 'Protect wireless access using authentication and encryption.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'authentication for wireless access is defined;', status: 'pending' },
        { id: 'b', description: 'encryption for wireless access is defined; and', status: 'pending' },
        { id: 'c', description: 'wireless access is protected.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-18'] },
      interviewOptions: ["What encryption standard is used for Wi-Fi (e.g., WPA2/WPA3)?", "How are users authenticated on the Wi-Fi?"]
    },
    { id: '3.1.18', framework: 'NIST-CMMC', family: 'AC', title: 'Mobile Device Control', description: 'Control connection of mobile devices.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'mobile devices are defined;', status: 'pending' },
        { id: 'b', description: 'connection of mobile devices is controlled; and', status: 'pending' },
        { id: 'c', description: 'mobile device usage is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-19'] },
      interviewOptions: ["Are employees allowed to use their personal phones for work?", "Do you use a Mobile Device Management (MDM) tool?"]
    },
    { id: '3.1.19', framework: 'NIST-CMMC', family: 'AC', title: 'Mobile Device Encryption', description: 'Encrypt CUI on mobile devices and computing platforms.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'mobile devices and computing platforms are defined; and', status: 'pending' },
        { id: 'b', description: 'CUI on mobile devices is encrypted.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-19'] },
      interviewOptions: ["Is full-disk encryption enabled on all company laptops and mobile devices?"]
    },
    { id: '3.1.20', framework: 'NIST-CMMC', family: 'AC', title: 'External System Connections', description: 'Verify and control connections to and use of external systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'external systems are defined;', status: 'pending' },
        { id: 'b', description: 'connections to external systems are verified; and', status: 'pending' },
        { id: 'c', description: 'use of external systems is controlled.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-20'] },
      interviewOptions: ["Are users allowed to use personal cloud storage (e.g., Dropbox, personal Google Drive) for work files?"]
    },
    { id: '3.1.21', framework: 'NIST-CMMC', family: 'AC', title: 'Public Content Control', description: 'Limit use of organizational portable storage devices on external systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'organizational portable storage devices are defined; and', status: 'pending' },
        { id: 'b', description: 'use of devices on external systems is limited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-20'] },
      interviewOptions: ["Can company USB drives be used on home computers or public kiosks?"]
    },
    { id: '3.1.22', framework: 'NIST-CMMC', family: 'AC', title: 'Public Content Control', description: 'Control information posted or processed on publicly accessible systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'publicly accessible systems are defined;', status: 'pending' },
        { id: 'b', description: 'information to be posted is reviewed; and', status: 'pending' },
        { id: 'c', description: 'posting of CUI on public systems is prohibited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-22'] },
      interviewOptions: ["How do you ensure no sensitive information is posted on the company website or social media?"]
    },
    // --- LEVEL 3 ENHANCED AC ---
    { id: '3.1.2e', framework: 'NIST-CMMC', family: 'AC', title: 'Organizationally Controlled Assets', description: 'Requires explicit control and enforcement over assets that are organizationally managed, even if not directly processing CUI.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Organizationally controlled assets are identified;', status: 'pending' },
        { id: 'b', description: 'Access to organizationally controlled assets is restricted to authorized users and processes.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-2'] },
      interviewOptions: [
        "How do you identify and manage assets that do not directly handle CUI but are part of the corporate environment?",
        "What enforcement mechanisms ensure only authorized entities access these corporate assets?"
      ]
    },
    { id: '3.1.3e', framework: 'NIST-CMMC', family: 'AC', title: 'Secured Information Transfer', description: 'Requires enhanced protections for information transfer paths beyond standard encryption (e.g., transfer validation, trust enforcement).', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Information transfer paths are identified;', status: 'pending' },
        { id: 'b', description: 'Trust enforcement mechanisms are implemented for information transfer; and', status: 'pending' },
        { id: 'c', description: 'Information transfer validation is performed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-4'] },
      interviewOptions: [
        "How do you validate the integrity and trust of an information transfer path before data is sent?",
        "What mechanisms beyond standard TLS/VPN are used to enforce trust between systems?"
      ]
    },

    // --- AWARENESS AND TRAINING (AT) ---
    { id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Security Awareness Training', description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures related to the security of those systems.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'managers, systems administrators, and users are made aware of security risks;', status: 'pending' },
        { id: 'b', description: 'managers, systems administrators, and users are made aware of applicable policies; and', status: 'pending' },
        { id: 'c', description: 'managers, systems administrators, and users are made aware of applicable standards and procedures.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-2'] },
      interviewOptions: ["How often do employees receive security training?", "Does the training cover how to handle CUI?"]
    },
    { id: '3.2.2', framework: 'NIST-CMMC', family: 'AT', title: 'Role-Based Security Training', description: 'Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'personnel with security-related duties are identified; and', status: 'pending' },
        { id: 'b', description: 'identified personnel are trained to carry out their duties.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-3'] },
      interviewOptions: ["Do your IT staff and security officers receive specialized training for their roles?"]
    },
    { id: '3.2.3', framework: 'NIST-CMMC', family: 'AT', title: 'Insider Threat Awareness', description: 'Provide awareness training on recognizing and reporting potential indicators of insider threat.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'insider threat indicators are defined; and', status: 'pending' },
        { id: 'b', description: 'insider threat awareness training is provided.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-2'] },
      interviewOptions: ["Does your training include how to spot suspicious behavior from coworkers?"]
    },
    // --- LEVEL 3 ENHANCED AT ---
    { id: '3.2.1e', framework: 'NIST-CMMC', family: 'AT', title: 'Advanced Threat Awareness', description: 'Requires training focused on advanced persistent threats (APT) and adversarial behavior.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Advanced persistent threat (APT) awareness training is provided; and', status: 'pending' },
        { id: 'b', description: 'Adversarial behavior awareness training is provided.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-2'] },
      interviewOptions: [
        "Does your security awareness program include modules on Advanced Persistent Threats (APTs)?",
        "How are users taught to recognize specific adversarial behaviors (e.g., living-off-the-land techniques)?"
      ]
    },
    { id: '3.2.2e', framework: 'NIST-CMMC', family: 'AT', title: 'Practical Training Exercises', description: 'Requires hands-on, scenario-based exercises, not just awareness training.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Scenario-based practical training exercises are conducted; and', status: 'pending' },
        { id: 'b', description: 'Hands-on practical training is provided to personnel with security responsibilities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AT-3'] },
      interviewOptions: [
        "What hands-on or scenario-based exercises have your security teams participated in recently?",
        "How often are practical exercises (like blue team drills) conducted to test staff readiness?"
      ]
    },

    // --- AUDIT AND ACCOUNTABILITY (AU) ---
    { id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Record Creation', description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system audit logs and records are created;', status: 'pending' },
        { id: 'b', description: 'audit logs and records are retained; and', status: 'pending' },
        { id: 'c', description: 'audit logs and records enable monitoring, analysis, investigation, and reporting.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-2', 'AU-11'] },
      interviewOptions: ["What systems are currently generating logs?", "How long do you keep your security logs?"]
    },
    { id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Content', description: 'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'individual system users are uniquely identified; and', status: 'pending' },
        { id: 'b', description: 'actions of users are uniquely traced to those users.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-3'] },
      interviewOptions: ["Do users share accounts, or does everyone have their own unique username?"]
    },
    { id: '3.3.3', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Review & Analysis', description: 'Review and update logged events.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'logged events are reviewed; and', status: 'pending' },
        { id: 'b', description: 'logged events are updated.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-6'] },
      interviewOptions: ["Who is responsible for checking the logs for suspicious activity?", "How often are logs reviewed?"]
    },
    { id: '3.3.4', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Failure Alerting', description: 'Alert in the event of an audit logging process failure.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit logging process failures are defined; and', status: 'pending' },
        { id: 'b', description: 'alerts are provided in the event of a failure.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-5'] },
      interviewOptions: ["If a server stops logging, how would you know?"]
    },
    { id: '3.3.5', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Review Automation', description: 'Correlate audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit record review, analysis, and reporting processes are correlated; and', status: 'pending' },
        { id: 'b', description: 'correlated processes are used for investigation and response.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-6'] },
      interviewOptions: ["Do you use a SIEM or a central log management tool to correlate events from different systems?"]
    },
    { id: '3.3.6', framework: 'NIST-CMMC', family: 'AU', title: 'Clock Synchronization', description: 'Provide a system capability that compares and synchronizes internal system clocks with an authoritative outside time source.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'internal system clocks are identified;', status: 'pending' },
        { id: 'b', description: 'authoritative outside time source is identified; and', status: 'pending' },
        { id: 'c', description: 'internal system clocks are synchronized with the outside source.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-8'] },
      interviewOptions: ["Do all your servers and network devices get their time from a reliable source (like NTP)?"]
    },
    { id: '3.3.7', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Record Protection', description: 'Protect audit information and audit tools from unauthorized access, modification, and deletion.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit information is protected; and', status: 'pending' },
        { id: 'b', description: 'audit tools are protected.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-9'] },
      interviewOptions: ["How do you prevent an attacker from deleting logs to hide their tracks?"]
    },
    { id: '3.3.8', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Management', description: 'Limit management of audit logging functionality to a subset of privileged users.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'audit logging functionality is identified;', status: 'pending' },
        { id: 'b', description: 'privileged users are identified; and', status: 'pending' },
        { id: 'c', description: 'management of audit logging is limited to privileged users.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-9'] },
      interviewOptions: ["Who has the authority to change logging settings?"]
    },
    { id: '3.3.9', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Failure Reporting', description: 'Report failures in the audit logging process to appropriate personnel.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'personnel to be notified are identified; and', status: 'pending' },
        { id: 'b', description: 'failures are reported.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-5'] },
      interviewOptions: ["Who gets notified if logging fails?"]
    },
    // --- LEVEL 3 ENHANCED AU ---
    { id: '3.3.1e', framework: 'NIST-CMMC', family: 'AU', title: 'Centralized Log Management', description: 'Requires centralized, automated log collection and analysis.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'A centralized log management system is established; and', status: 'pending' },
        { id: 'b', description: 'Automated log analysis and correlation are implemented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-6'] },
      interviewOptions: ["How are logs from all systems (cloud, on-prem, network) aggregated into a single source of truth?", "What automated alerts are triggered by correlated events in your SIEM?"]
    },
    { id: '3.3.2e', framework: 'NIST-CMMC', family: 'AU', title: 'Audit Record Integrity', description: 'Requires cryptographic protection for audit record integrity.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Cryptographic mechanisms are used to protect audit record integrity; and', status: 'pending' },
        { id: 'b', description: 'Unauthorized modification of audit records is detected.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AU-9'] },
      interviewOptions: ["How do you cryptographically sign or hash your logs to prove they haven't been tampered with?", "What mechanism alerts you if a log file is modified or deleted by a non-system process?"]
    },

    // --- CONFIGURATION MANAGEMENT (CM) ---
    { id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'Baseline Configuration', description: 'Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'baseline configurations are established;', status: 'pending' },
        { id: 'b', description: 'baseline configurations are maintained; and', status: 'pending' },
        { id: 'c', description: 'inventories of systems are established and maintained.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-2', 'CM-8'] },
      interviewOptions: ["Do you have a standard 'Golden Image' or configuration for your servers and workstations?", "Do you have a list of all hardware and software used in the company?"]
    },
    { id: '3.4.2', framework: 'NIST-CMMC', family: 'CM', title: 'Configuration Settings', description: 'Establish and enforce security configuration settings for information technology products employed in organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'security configuration settings are established; and', status: 'pending' },
        { id: 'b', description: 'security configuration settings are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-6'] },
      interviewOptions: ["How do you ensure that security settings (like disabling guest accounts) are applied to all computers?"]
    },
    { id: '3.4.3', framework: 'NIST-CMMC', family: 'CM', title: 'Change Control', description: 'Track, review, approve, and audit changes to organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'changes to systems are tracked;', status: 'pending' },
        { id: 'b', description: 'changes are reviewed;', status: 'pending' },
        { id: 'c', description: 'changes are approved; and', status: 'pending' },
        { id: 'd', description: 'changes are audited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-3'] },
      interviewOptions: ["What is your process for making changes to a production server?", "Who has to approve a change before it is implemented?"]
    },
    { id: '3.4.4', framework: 'NIST-CMMC', family: 'CM', title: 'Security Impact Analysis', description: 'Analyze the security impact of changes prior to implementation.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'security impact of changes is analyzed; and', status: 'pending' },
        { id: 'b', description: 'analysis is performed prior to implementation.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-4'] },
      interviewOptions: ["Do you test changes in a lab environment before applying them to the live network?"]
    },
    { id: '3.4.5', framework: 'NIST-CMMC', family: 'CM', title: 'Access Restrictions for Change', description: 'Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'access restrictions for changes are defined;', status: 'pending' },
        { id: 'b', description: 'access restrictions are documented;', status: 'pending' },
        { id: 'c', description: 'access restrictions are approved; and', status: 'pending' },
        { id: 'd', description: 'access restrictions are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-5'] },
      interviewOptions: ["Who is allowed to make changes to the network or server configurations?"]
    },
    { id: '3.4.6', framework: 'NIST-CMMC', family: 'CM', title: 'Least Functionality', description: 'Employ the principle of least functionality by configuring organizational systems to provide only essential capabilities.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'essential capabilities are defined; and', status: 'pending' },
        { id: 'b', description: 'systems are configured to provide only essential capabilities.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-7'] },
      interviewOptions: ["Do you remove unnecessary software and disable unused services on your servers?"]
    },
    { id: '3.4.7', framework: 'NIST-CMMC', family: 'CM', title: 'Non-Essential Programs', description: 'Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'nonessential programs, functions, ports, protocols, and services are identified; and', status: 'pending' },
        { id: 'b', description: 'nonessential items are restricted, disabled, or prevented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-7'] },
      interviewOptions: ["Do you have a policy against users installing their own software?"]
    },
    { id: '3.4.8', framework: 'NIST-CMMC', family: 'CM', title: 'Software Whitelisting', description: 'Apply deny-by-exception (blacklisting) policy to prevent the use of unauthorized software or deny-all, permit-by-exception (whitelisting) policy to allow the use of authorized software.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'unauthorized software is identified;', status: 'pending' },
        { id: 'b', description: 'authorized software is identified; and', status: 'pending' },
        { id: 'c', description: 'software policy is applied.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-7'] },
      interviewOptions: ["Do you use a tool to block unauthorized applications from running?"]
    },
    { id: '3.4.9', framework: 'NIST-CMMC', family: 'CM', title: 'User-Installed Software', description: 'Control and monitor user-installed software.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'user-installed software is identified; and', status: 'pending' },
        { id: 'b', description: 'user-installed software is controlled and monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-11'] },
      interviewOptions: ["How do you know if a user has installed software on their work computer?"]
    },
    // --- LEVEL 3 ENHANCED CM ---
    { id: '3.4.1e', framework: 'NIST-CMMC', family: 'CM', title: 'Authoritative Repository', description: 'Requires a trusted, authoritative source for system configurations.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'An authoritative repository for system configurations is established; and', status: 'pending' },
        { id: 'b', description: 'The repository is maintained and protected from unauthorized access.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-2'] },
      interviewOptions: ["Where is the authoritative 'Golden Image' or configuration repository stored?", "How do you ensure that only authorized changes can be made to this configuration source?"]
    },
    { id: '3.4.2e', framework: 'NIST-CMMC', family: 'CM', title: 'Automated Detection & Remediation', description: 'Requires automated mechanisms to detect and correct configuration drift.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Automated mechanisms to detect configuration drift are implemented; and', status: 'pending' },
        { id: 'b', description: 'Automated mechanisms to remediate unauthorized changes are implemented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-3'] },
      interviewOptions: ["What tools do you use to automatically detect when a system's configuration drifts from the baseline?", "Does your system automatically revert unauthorized configuration changes (Self-Healing)?"]
    },
    { id: '3.4.3e', framework: 'NIST-CMMC', family: 'CM', title: 'Automated Inventory', description: 'Requires automated, continuously maintained system inventories.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Automated system inventory discovery is implemented; and', status: 'pending' },
        { id: 'b', description: 'The inventory is updated in near real-time.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-8'] },
      interviewOptions: ["How is your asset inventory updated automatically without manual data entry?", "What is the frequency of your automated network discovery scans?"]
    },

    // --- IDENTIFICATION AND AUTHENTICATION (IA) ---
    { id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identification & Authentication', description: 'Identify system users, processes acting on behalf of users, or devices.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'system users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of users are identified; and', status: 'pending' },
        { id: 'c', description: 'devices are identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] },
      interviewOptions: ["How does the system know who is logging in?"]
    },
    { id: '3.5.2', framework: 'NIST-CMMC', family: 'IA', title: 'Authentication Mechanisms', description: 'Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational systems.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'the identities of system users are authenticated;', status: 'pending' },
        { id: 'b', description: 'the identities of processes acting on behalf of users are authenticated; and', status: 'pending' },
        { id: 'c', description: 'the identities of devices are authenticated.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] },
      interviewOptions: ["What do users use to log in (e.g., password, smart card)?"]
    },
    { id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Multi-Factor Authentication', description: 'Use multi-factor authentication (MFA) for local and network access to privileged accounts and for network access to non-privileged accounts.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'multifactor authentication is used for local access to privileged accounts;', status: 'pending' },
        { id: 'b', description: 'multifactor authentication is used for network access to privileged accounts; and', status: 'pending' },
        { id: 'c', description: 'multifactor authentication is used for network access to non-privileged accounts.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] },
      interviewOptions: ["Is MFA required for all users logging in from outside the office?", "Is MFA required for administrators logging in locally?"]
    },
    { id: '3.5.4', framework: 'NIST-CMMC', family: 'IA', title: 'Replay-Resistant Authentication', description: 'Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'replay-resistant authentication mechanisms are employed for network access to privileged accounts; and', status: 'pending' },
        { id: 'b', description: 'replay-resistant authentication mechanisms are employed for network access to non-privileged accounts.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] },
      interviewOptions: ["Does your MFA tool use one-time codes or push notifications that can't be reused?"]
    },
    { id: '3.5.5', framework: 'NIST-CMMC', family: 'IA', title: 'Identifier Management', description: 'Prevent reuse of identifiers for a defined period.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the period of time to prevent reuse of identifiers is defined; and', status: 'pending' },
        { id: 'b', description: 'reuse of identifiers is prevented for the defined period of time.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-4'] },
      interviewOptions: ["If an employee leaves, how long do you wait before their username can be given to someone else?"]
    },
    { id: '3.5.6', framework: 'NIST-CMMC', family: 'IA', title: 'Identifier Management', description: 'Disable identifiers after a defined period of inactivity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the period of inactivity is defined; and', status: 'pending' },
        { id: 'b', description: 'identifiers are disabled after the defined period of inactivity.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-4'] },
      interviewOptions: ["Are accounts automatically disabled if they haven't been used for 90 days?"]
    },
    { id: '3.5.7', framework: 'NIST-CMMC', family: 'IA', title: 'Authenticator Management', description: 'Enforce a minimum password complexity and change of characters when new passwords are created.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'minimum password complexity is defined;', status: 'pending' },
        { id: 'b', description: 'the number of characters that must be changed when new passwords are created is defined; and', status: 'pending' },
        { id: 'c', description: 'password requirements are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-5'] },
      interviewOptions: ["What are your password requirements (length, special characters, etc.)?"]
    },
    { id: '3.5.8', framework: 'NIST-CMMC', family: 'IA', title: 'Authenticator Management', description: 'Prohibit password reuse for a defined number of generations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'the number of generations for which password reuse is prohibited is defined; and', status: 'pending' },
        { id: 'b', description: 'password reuse is prohibited for the defined number of generations.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-5'] },
      interviewOptions: ["Does the system prevent users from reusing their last 5 or 10 passwords?"]
    },
    { id: '3.5.9', framework: 'NIST-CMMC', family: 'IA', title: 'Authenticator Management', description: 'Allow temporary password usage for logon with an immediate change to a permanent password.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'temporary password usage for logon is allowed; and', status: 'pending' },
        { id: 'b', description: 'an immediate change to a permanent password is required after logon with a temporary password.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-5'] },
      interviewOptions: ["When you reset a password, does the user have to change it the first time they log in?"]
    },
    { id: '3.5.10', framework: 'NIST-CMMC', family: 'IA', title: 'Authenticator Management', description: 'Store and transmit only cryptographically-protected passwords.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'passwords are cryptographically protected during storage; and', status: 'pending' },
        { id: 'b', description: 'passwords are cryptographically protected during transmission.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-5'] },
      interviewOptions: ["Are passwords hashed and salted in the database?"]
    },
    { id: '3.5.11', framework: 'NIST-CMMC', family: 'IA', title: 'Authenticator Management', description: 'Obscure feedback of authentication information.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'feedback of authentication information is obscured during the authentication process.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-6'] },
      interviewOptions: ["When typing a password, are the characters hidden by dots or asterisks?"]
    },
    // --- LEVEL 3 ENHANCED IA ---
    { id: '3.5.1e', framework: 'NIST-CMMC', family: 'IA', title: 'Bidirectional Authentication', description: 'Requires mutual authentication (not just user → system).', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Mutual authentication is required for network connections; and', status: 'pending' },
        { id: 'b', description: 'Cryptographic mechanisms support bidirectional authentication.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] },
      interviewOptions: ["How do your systems verify the identity of the server they are connecting to before sending credentials?", "Do you use mTLS or similar protocols for internal service-to-service communication?"]
    },
    { id: '3.5.3e', framework: 'NIST-CMMC', family: 'IA', title: 'Block Untrusted Assets', description: 'Requires systems to actively block authentication attempts from untrusted or unknown assets.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Untrusted assets are identified via device fingerprinting or certificates; and', status: 'pending' },
        { id: 'b', description: 'Authentication attempts from untrusted assets are automatically blocked.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-3'] },
      interviewOptions: ["How does your identity system handle authentication requests from devices that aren't in your managed inventory?", "Are non-managed (BYOD) devices strictly blocked from authenticating to CUI repositories?"]
    },

    // --- MAINTENANCE (MA) ---
    { id: '3.7.1', framework: 'NIST-CMMC', family: 'MA', title: 'System Maintenance', description: 'Perform maintenance on organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'maintenance is performed on organizational systems.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] },
      interviewOptions: ["Do you have a regular schedule for patching and updating your servers?"]
    },
    { id: '3.7.2', framework: 'NIST-CMMC', family: 'MA', title: 'Maintenance Tools', description: 'Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'controls on maintenance tools are defined;', status: 'pending' },
        { id: 'b', description: 'controls on maintenance techniques are defined;', status: 'pending' },
        { id: 'c', description: 'controls on maintenance mechanisms are defined; and', status: 'pending' },
        { id: 'd', description: 'controls on maintenance personnel are defined.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-3'] },
      interviewOptions: ["What tools do you use for remote maintenance, and how are they secured?"]
    },
    { id: '3.7.3', framework: 'NIST-CMMC', family: 'MA', title: 'Remote Maintenance', description: 'Ensure equipment, including software and firmware, is maintained.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'equipment is maintained.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] },
      interviewOptions: ["How do you ensure that all hardware and software are kept up to date?"]
    },
    { id: '3.7.4', framework: 'NIST-CMMC', family: 'MA', title: 'Remote Maintenance Authentication', description: 'Require multi-factor authentication to establish nonlocal maintenance sessions via external networks and terminate such sessions when nonlocal maintenance is completed.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'MFA is required for nonlocal maintenance sessions; and', status: 'pending' },
        { id: 'b', description: 'nonlocal maintenance sessions are terminated.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-4'] },
      interviewOptions: ["Do vendors need MFA to log in and fix your systems remotely?"]
    },
    { id: '3.7.5', framework: 'NIST-CMMC', family: 'MA', title: 'Maintenance Personnel', description: 'Supervise the maintenance activities of personnel without required access authorizations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'maintenance personnel without authorizations are identified; and', status: 'pending' },
        { id: 'b', description: 'maintenance activities are supervised.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-5'] },
      interviewOptions: ["If a technician comes to fix the copier, is someone from your team watching them?"]
    },
    // --- LEVEL 3 ENHANCED MA ---
    { id: '3.7.1e', framework: 'NIST-CMMC', family: 'MA', title: 'Maintenance Logging', description: 'Requires detailed logging of all maintenance activities.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'All maintenance activities are logged;', status: 'pending' },
        { id: 'b', description: 'Maintenance logs are reviewed periodically.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MA-2'] },
      interviewOptions: ["Do you keep a detailed log of every time a server is opened or a component is replaced?", "Who reviews the maintenance logs to ensure no unauthorized changes were made?"]
    },

    // --- MEDIA PROTECTION (MP) ---
    { id: '3.8.1', framework: 'NIST-CMMC', family: 'MP', title: 'Media Protection', description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'system media containing CUI is identified;', status: 'pending' },
        { id: 'b', description: 'system media is physically controlled; and', status: 'pending' },
        { id: 'c', description: 'system media is securely stored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-2', 'MP-4'] },
      interviewOptions: ["Where do you keep backup tapes or external hard drives?", "Are paper files with sensitive info kept in locked cabinets?"]
    },
    { id: '3.8.2', framework: 'NIST-CMMC', family: 'MP', title: 'Media Access', description: 'Limit access to CUI on system media to authorized users.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'authorized users are identified; and', status: 'pending' },
        { id: 'b', description: 'access to CUI on media is limited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-2'] },
      interviewOptions: ["Who has the keys to the room where backups are stored?"]
    },
    { id: '3.8.3', framework: 'NIST-CMMC', family: 'MP', title: 'Media Marking', description: 'Sanitize or destroy system media containing CUI before disposal or release for reuse.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'system media containing CUI is identified;', status: 'pending' },
        { id: 'b', description: 'system media is sanitized or destroyed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-6'] },
      interviewOptions: ["Do you shred sensitive papers?", "How do you wipe hard drives before throwing them away?"]
    },
    { id: '3.8.4', framework: 'NIST-CMMC', family: 'MP', title: 'Media Marking', description: 'Mark media with necessary CUI markings and distribution limitations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'media containing CUI is identified; and', status: 'pending' },
        { id: 'b', description: 'media is marked.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-3'] },
      interviewOptions: ["Are USB drives or folders containing CUI clearly labeled?"]
    },
    { id: '3.8.5', framework: 'NIST-CMMC', family: 'MP', title: 'Media Inventory', description: 'Control access to media containing CUI and maintain accountability for media during transport outside of controlled areas.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'media containing CUI is identified;', status: 'pending' },
        { id: 'b', description: 'access to media is controlled; and', status: 'pending' },
        { id: 'c', description: 'accountability for media during transport is maintained.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-5'] },
      interviewOptions: ["If you send a hard drive to another office, how do you track it?"]
    },
    { id: '3.8.6', framework: 'NIST-CMMC', family: 'MP', title: 'Media Transport', description: 'Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport unless otherwise protected by alternative physical safeguards.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'cryptographic mechanisms are defined; and', status: 'pending' },
        { id: 'b', description: 'cryptographic mechanisms are used for digital media during transport.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-5'] },
      interviewOptions: ["Are all company USB drives encrypted?"]
    },
    { id: '3.8.7', framework: 'NIST-CMMC', family: 'MP', title: 'Media Storage', description: 'Control the use of removable media on system components.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'removable media is defined; and', status: 'pending' },
        { id: 'b', description: 'use of removable media is controlled.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-7'] },
      interviewOptions: ["Can users plug in their own personal USB drives into work computers?"]
    },
    { id: '3.8.8', framework: 'NIST-CMMC', family: 'MP', title: 'Portable Storage Encryption', description: 'Prohibit the use of portable storage devices when such devices have no identifiable owner.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'portable storage devices are defined; and', status: 'pending' },
        { id: 'b', description: 'use of devices with no identifiable owner is prohibited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-7'] },
      interviewOptions: ["What happens if someone finds a random USB drive in the parking lot and plugs it in?"]
    },
    { id: '3.8.9', framework: 'NIST-CMMC', family: 'MP', title: 'Portable Storage Encryption', description: 'Protect the confidentiality of backup information at storage locations.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'backup information is identified; and', status: 'pending' },
        { id: 'b', description: 'confidentiality of backup information is protected.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-4'] },
      interviewOptions: ["Are your cloud or off-site backups encrypted?"]
    },
    // --- LEVEL 3 ENHANCED MP ---
    { id: '3.8.1e', framework: 'NIST-CMMC', family: 'MP', title: 'Media Sanitization Validation', description: 'Requires validation of media sanitization processes.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Sanitization processes are validated; and', status: 'pending' },
        { id: 'b', description: 'Validation results are documented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['MP-6'] },
      interviewOptions: ["How do you verify that a hard drive was actually wiped successfully before it leaves the facility?", "Do you use a third-party service that provides 'Certificates of Destruction'?"]
    },

    // --- PERSONNEL SECURITY (PS) ---
    { id: '3.9.1', framework: 'NIST-CMMC', family: 'PS', title: 'Personnel Screening', description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'individuals are screened prior to authorizing access.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-3'] },
      interviewOptions: ["Do you perform background checks on new employees?"]
    },
    { id: '3.9.2', framework: 'NIST-CMMC', family: 'PS', title: 'Personnel Termination', description: 'Ensure that organizational systems are protected during and after personnel actions such as terminations and transfers.', cmmcLevel: 2, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'systems are protected during personnel actions; and', status: 'pending' },
        { id: 'b', description: 'systems are protected after personnel actions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-4', 'PS-5'] },
      interviewOptions: ["How quickly is a former employee's access disabled?"]
    },
    // --- LEVEL 3 ENHANCED PS ---
    { id: '3.9.2e', framework: 'NIST-CMMC', family: 'PS', title: 'Adverse Information', description: 'Requires monitoring and response to adverse personnel information impacting trust.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Criteria for adverse personnel information are defined;', status: 'pending' },
        { id: 'b', description: 'Mechanisms for reporting/monitoring adverse information are implemented; and', status: 'pending' },
        { id: 'c', description: 'Response actions for identified adverse info are executed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PS-4'] },
      interviewOptions: [
        "What process is used to monitor for adverse information regarding employees with CUI access?",
        "How are personnel security clearances or trust levels adjusted when negative reports are received?"
      ]
    },

    // --- PHYSICAL PROTECTION (PE) ---
    { id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Physical Access Control', description: 'Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'authorized individuals are identified;', status: 'pending' },
        { id: 'b', description: 'physical access to systems is limited; and', status: 'pending' },
        { id: 'c', description: 'physical access to equipment and operating environments is limited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-2'] },
      interviewOptions: ["Who is allowed into the server room?"]
    },
    { id: '3.10.2', framework: 'NIST-CMMC', family: 'PE', title: 'Physical Access Monitoring', description: 'Escort visitors and monitor visitor activity.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'visitors are escorted; and', status: 'pending' },
        { id: 'b', description: 'visitor activity is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-3'] },
      interviewOptions: ["Are guests required to sign in and wear a badge?"]
    },
    { id: '3.10.3', framework: 'NIST-CMMC', family: 'PE', title: 'Visitor Logs', description: 'Maintain audit logs of physical access.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'audit logs of physical access are maintained.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-3'] },
      interviewOptions: ["Do you keep a log of everyone who enters the building?"]
    },
    { id: '3.10.4', framework: 'NIST-CMMC', family: 'PE', title: 'Physical Access Devices', description: 'Control and manage physical access devices.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'physical access devices are identified; and', status: 'pending' },
        { id: 'b', description: 'physical access devices are controlled and managed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-8'] },
      interviewOptions: ["How do you track who has keys or keycards to the office?"]
    },
    { id: '3.10.5', framework: 'NIST-CMMC', family: 'PE', title: 'Physical Access Monitoring', description: 'Protect and monitor the physical facility and support infrastructure for organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'physical facility is protected;', status: 'pending' },
        { id: 'b', description: 'support infrastructure is protected;', status: 'pending' },
        { id: 'c', description: 'physical facility is monitored; and', status: 'pending' },
        { id: 'd', description: 'support infrastructure is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-3', 'PE-6'] },
      interviewOptions: ["Do you have security cameras or an alarm system?"]
    },
    { id: '3.10.6', framework: 'NIST-CMMC', family: 'PE', title: 'Alternate Work Sites', description: 'Enforce physical access rights to organizational systems for transmission and display.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'physical access rights for transmission are enforced; and', status: 'pending' },
        { id: 'b', description: 'physical access rights for display are enforced.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-5'] },
      interviewOptions: ["Are monitors positioned so that people walking by can't see sensitive info?"]
    },
    // --- LEVEL 3 ENHANCED PE ---
    { id: '3.10.1e', framework: 'NIST-CMMC', family: 'PE', title: 'Physical Tamper Protection', description: 'Requires tamper-protection for critical system components.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Tamper-protection mechanisms are implemented; and', status: 'pending' },
        { id: 'b', description: 'Tamper-evidence is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PE-3'] },
      interviewOptions: ["Do you use tamper-evident seals on server chassis or network racks?", "How often are physical security controls inspected for signs of tampering?"]
    },

    // --- RISK ASSESSMENT (RA) ---
    { id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Risk Assessment', description: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.', cmmcLevel: 2, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'risk assessment is performed periodically.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-3'] },
      interviewOptions: ["When was the last time you did a formal risk assessment?"]
    },
    { id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', title: 'Vulnerability Scanning', description: 'Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.', cmmcLevel: 2, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'vulnerability scanning is performed periodically; and', status: 'pending' },
        { id: 'b', description: 'vulnerability scanning is performed when new vulnerabilities are identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-5'] },
      interviewOptions: ["Do you run vulnerability scans (like Nessus or OpenVAS) on your network?"]
    },
    { id: '3.11.3', framework: 'NIST-CMMC', family: 'RA', title: 'Vulnerability Remediation', description: 'Remediate vulnerabilities in accordance with risk assessments.', cmmcLevel: 2, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'vulnerabilities are remediated.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-5'] },
      interviewOptions: ["How do you decide which vulnerabilities to fix first?"]
    },
    // --- LEVEL 3 ENHANCED RA ---
    { id: '3.11.1e', framework: 'NIST-CMMC', family: 'RA', title: 'Threat-Informed Risk Assessment', description: 'Perform risk assessments informed by current threat intelligence.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
          { id: 'a', description: 'Threat intelligence sources are identified; and', status: 'pending' },
          { id: 'b', description: 'Risk assessments incorporate data from identified threat sources.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-3'] },
      interviewOptions: [
        "How do you incorporate real-time threat intelligence into your annual risk assessments?",
        "Which threat feeds or information sharing groups (ISACs) do you subscribe to?"
      ]
    },
    { id: '3.11.2e', framework: 'NIST-CMMC', family: 'RA', title: 'Threat Hunting', description: 'Conduct active threat hunting for adversarial activity.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
          { id: 'a', description: 'Threat hunting procedures are defined; and', status: 'pending' },
          { id: 'b', description: 'Threat hunting exercises are conducted periodically.', status: 'pending' }
      ],
      mappings: { nist800_53: ['RA-5'] },
      interviewOptions: [
        "Do you perform active 'hunting' for indicators of compromise that may have bypassed your automated tools?",
        "What is the frequency of your threat hunting operations?"
      ]
    },
    { id: '3.11.3e', framework: 'NIST-CMMC', family: 'RA', title: 'Advanced Risk Identification', description: 'Identify risks from advanced persistent threats.', cmmcLevel: 3, sprsWeight: 5,
        objectives: [
          { id: 'a', description: 'Risks from advanced persistent threats are identified.', status: 'pending' }
        ],
        mappings: { nist800_53: ['RA-3'] },
        interviewOptions: ["How does your risk register specifically address Advanced Persistent Threat (APT) scenarios?"]
    },
    { id: '3.11.4e', framework: 'NIST-CMMC', family: 'RA', title: 'Security Solution Rationale', description: 'Provide technical rationale for selected security solutions.', cmmcLevel: 3, sprsWeight: 5,
        objectives: [
          { id: 'a', description: 'Technical rationale for selected security solutions is provided.', status: 'pending' }
        ],
        mappings: { nist800_53: ['RA-3'] },
        interviewOptions: ["What is the engineering rationale for the specific SIEM or EDR solution you chose to defend against APTs?"]
    },
    { id: '3.11.5e', framework: 'NIST-CMMC', family: 'RA', title: 'Security Solution Effectiveness', description: 'Test effectiveness of selected solutions.', cmmcLevel: 3, sprsWeight: 5,
        objectives: [
          { id: 'a', description: 'Effectiveness of selected solutions is tested.', status: 'pending' }
        ],
        mappings: { nist800_53: ['RA-5'] },
        interviewOptions: ["How do you quantitatively verify that your security tools are actually stopping adversarial movement?"]
    },
    { id: '3.11.6e', framework: 'NIST-CMMC', family: 'RA', title: 'Supply Chain Risk Response', description: 'Respond to supply chain risks.', cmmcLevel: 3, sprsWeight: 5,
        objectives: [
          { id: 'a', description: 'Supply chain risks are identified; and', status: 'pending' },
          { id: 'b', description: 'Response to supply chain risks is executed.', status: 'pending' }
        ],
        mappings: { nist800_53: ['SR-2'] },
        interviewOptions: ["What is your protocol if a critical hardware or software vendor reports a significant breach?"]
    },
    { id: '3.11.7e', framework: 'NIST-CMMC', family: 'RA', title: 'Supply Chain Risk Plan', description: 'Establish a supply chain risk plan.', cmmcLevel: 3, sprsWeight: 5,
        objectives: [
          { id: 'a', description: 'A supply chain risk plan is established.', status: 'pending' }
        ],
        mappings: { nist800_53: ['SR-2'] },
        interviewOptions: ["Do you have a formal Supply Chain Risk Management (SCRM) plan?"]
    },

    // --- SECURITY ASSESSMENT (CA) ---
    { id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Security Assessment', description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.', cmmcLevel: 2, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'security controls are assessed periodically.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CA-2'] },
      interviewOptions: ["How do you know if your security controls are actually working?"]
    },
    { id: '3.12.2', framework: 'NIST-CMMC', family: 'CA', title: 'Plan of Action', description: 'Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational systems.', cmmcLevel: 2, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'plans of action are developed; and', status: 'pending' },
        { id: 'b', description: 'plans of action are implemented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CA-5'] },
      interviewOptions: ["Do you have a POAM (Plan of Action and Milestones) for things you haven't fixed yet?"]
    },
    { id: '3.12.3', framework: 'NIST-CMMC', family: 'CA', title: 'Security Control Monitoring', description: 'Monitor security controls on an ongoing basis to ensure the continued effectiveness of the controls.', cmmcLevel: 2, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'security controls are monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CA-7'] },
      interviewOptions: ["Do you have a process for continuous monitoring of your security posture?"]
    },
    { id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', title: 'System Security Plan', description: 'Develop, document, and periodically update system security plans that describe system boundaries, system environments of operation, how security requirements are implemented, and the relationships with or connections to other systems.', cmmcLevel: 2, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'system security plan is developed;', status: 'pending' },
        { id: 'b', description: 'system security plan is documented; and', status: 'pending' },
        { id: 'c', description: 'system security plan is updated periodically.', status: 'pending' }
      ],
      mappings: { nist800_53: ['PL-2'] },
      interviewOptions: ["Do you have a System Security Plan (SSP)?"]
    },
    // --- LEVEL 3 ENHANCED CA ---
    { id: '3.12.1e', framework: 'NIST-CMMC', family: 'CA', title: 'Penetration Testing', description: 'Requires penetration testing to validate defensive effectiveness.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
          { id: 'a', description: 'External penetration testing is conducted; and', status: 'pending' },
          { id: 'b', description: 'Internal penetration testing is conducted.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CA-8'] },
      interviewOptions: [
        "When was your last professional penetration test conducted?",
        "How are high-priority findings from the penetration test tracked to completion?"
      ]
    },

    // --- SYSTEM AND COMMUNICATIONS PROTECTION (SC) ---
    { id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Boundary Protection', description: 'Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational systems) at the external boundaries and key internal boundaries of organizational systems.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'external boundaries are monitored, controlled, and protected; and', status: 'pending' },
        { id: 'b', description: 'key internal boundaries are monitored, controlled, and protected.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] },
      interviewOptions: ["Do you have a firewall protecting your network?"]
    },
    { id: '3.13.2', framework: 'NIST-CMMC', family: 'SC', title: 'Public Information', description: 'Employ architectural designs, software development techniques, and systems engineering principles that promote effective information security within organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'security principles are employed in architectural designs;', status: 'pending' },
        { id: 'b', description: 'security principles are employed in software development; and', status: 'pending' },
        { id: 'c', description: 'security principles are employed in systems engineering.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SA-8'] },
      interviewOptions: ["How do you ensure security is built into your systems from the start?"]
    },
    { id: '3.13.3', framework: 'NIST-CMMC', family: 'SC', title: 'Role-Based Access Control', description: 'Separate user functionality from system management functionality.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'user functionality is separated from system management functionality.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-5'] },
      interviewOptions: ["Do administrators use their admin accounts for everyday tasks like email?"]
    },
    { id: '3.13.4', framework: 'NIST-CMMC', family: 'SC', title: 'Shared Resources', description: 'Prevent unintended and unauthorized disclosure of information via shared system resources.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'unintended disclosure via shared resources is prevented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-4'] },
      interviewOptions: ["How do you ensure that one user can't see another user's temporary files?"]
    },
    { id: '3.13.5', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'subnetworks for public components are implemented; and', status: 'pending' },
        { id: 'b', description: 'subnetworks are separated from internal networks.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] },
      interviewOptions: ["Is your web server in a DMZ?"]
    },
    { id: '3.13.6', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'traffic is denied by default; and', status: 'pending' },
        { id: 'b', description: 'traffic is allowed by exception.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] },
      interviewOptions: ["Does your firewall block everything unless it's specifically allowed?"]
    },
    { id: '3.13.7', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Prevent remote devices from simultaneously establishing non-remote connections with organizational systems and connecting via some other connection to any network in any other network architecture (i.e., split-tunneling).', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'split-tunneling is prevented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] },
      interviewOptions: ["Is split-tunneling disabled on your VPN?"]
    },
    { id: '3.13.8', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'cryptographic mechanisms are defined; and', status: 'pending' },
        { id: 'b', description: 'cryptographic mechanisms are used for CUI during transmission.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-8'] },
      interviewOptions: ["Is CUI encrypted when sent over the internet (e.g., via HTTPS or SFTP)?"]
    },
    { id: '3.13.9', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Terminate network connections associated with communications sessions at the end of the sessions or after a defined period of inactivity.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'period of inactivity is defined; and', status: 'pending' },
        { id: 'b', description: 'network connections are terminated.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-10'] },
      interviewOptions: ["Do VPN sessions time out after a period of inactivity?"]
    },
    { id: '3.13.10', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Establish and manage cryptographic keys for cryptography employed in organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'cryptographic keys are established; and', status: 'pending' },
        { id: 'b', description: 'cryptographic keys are managed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-12'] },
      interviewOptions: ["How do you protect and manage your encryption keys?"]
    },
    { id: '3.13.11', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'FIPS-validated cryptography is used.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-13'] },
      interviewOptions: ["Are your encryption tools FIPS 140-2 or 140-3 validated?"]
    },
    { id: '3.13.12', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Prohibit remote activation of collaborative computing devices.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'remote activation of collaborative devices is prohibited.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-15'] },
      interviewOptions: ["Can someone remotely turn on a webcam or microphone in your conference room?"]
    },
    { id: '3.13.13', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Control and monitor the use of mobile code.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'mobile code is identified; and', status: 'pending' },
        { id: 'b', description: 'use of mobile code is controlled and monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-18'] },
      interviewOptions: ["How do you control the execution of scripts (like JavaScript or PowerShell) on your network?"]
    },
    { id: '3.13.14', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'VoIP technologies are identified; and', status: 'pending' },
        { id: 'b', description: 'use of VoIP is controlled and monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-19'] },
      interviewOptions: ["Is your VoIP traffic separated from your data traffic?"]
    },
    { id: '3.13.15', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Protect the authenticity of communications sessions.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'authenticity of communications sessions is protected.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-23'] },
      interviewOptions: ["How do you prevent session hijacking?"]
    },
    { id: '3.13.16', framework: 'NIST-CMMC', family: 'SC', title: 'Network Disconnect', description: 'Protect the confidentiality of CUI at rest.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'confidentiality of CUI at rest is protected.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-28'] },
      interviewOptions: ["Is CUI encrypted when stored on your servers?"]
    },
    // --- LEVEL 3 ENHANCED SC ---
    { id: '3.13.4e', framework: 'NIST-CMMC', family: 'SC', title: 'Isolation', description: 'Requires logical or physical isolation techniques to contain compromise.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
          { id: 'a', description: 'Critical system functions are isolated; and', status: 'pending' },
          { id: 'b', description: 'Isolation mechanisms prevent lateral movement.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] },
      interviewOptions: [
        "How do you isolate your CUI enclave from the general corporate network?",
        "What 'Micro-segmentation' techniques are in place to stop lateral movement during a breach?"
      ]
    },

    // --- SYSTEM AND INFORMATION INTEGRITY (SI) ---
    { id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Flaw Remediation', description: 'Identify, report, and correct system flaws in a timely manner.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'system flaws are identified;', status: 'pending' },
        { id: 'b', description: 'system flaws are reported; and', status: 'pending' },
        { id: 'c', description: 'system flaws are corrected.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-2'] },
      interviewOptions: ["How do you find out about new security patches for your software?"]
    },
    { id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', title: 'Malicious Code Protection', description: 'Provide protection from malicious code at appropriate locations within organizational systems.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'malicious code protection is provided at appropriate locations.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-3'] },
      interviewOptions: ["Do you have antivirus software installed on all computers?"]
    },
    { id: '3.14.3', framework: 'NIST-CMMC', family: 'SI', title: 'Update Malicious Code Protection', description: 'Update malicious code protection mechanisms when new releases are available.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'malicious code protection mechanisms are updated.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-3'] },
      interviewOptions: ["Are your antivirus definitions updated daily?"]
    },
    { id: '3.14.4', framework: 'NIST-CMMC', family: 'SI', title: 'System Scanning', description: 'Perform periodic scans of organizational systems and real-time scans of files from external sources as files are downloaded, opened, or executed.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'periodic scans of systems are performed; and', status: 'pending' },
        { id: 'b', description: 'real-time scans of files from external sources are performed.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-3'] },
      interviewOptions: ["Does your antivirus scan files as they are downloaded from the internet?"]
    },
    { id: '3.14.5', framework: 'NIST-CMMC', family: 'SI', title: 'System Scanning', description: 'Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'organizational systems are monitored;', status: 'pending' },
        { id: 'b', description: 'inbound communications traffic is monitored; and', status: 'pending' },
        { id: 'c', description: 'outbound communications traffic is monitored.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-4'] },
      interviewOptions: ["Do you use an Intrusion Detection System (IDS) or Intrusion Prevention System (IPS)?"]
    },
    { id: '3.14.6', framework: 'NIST-CMMC', family: 'SI', title: 'System Scanning', description: 'Identify unauthorized use of organizational systems.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'unauthorized use of systems is identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-4'] },
      interviewOptions: ["How would you know if someone was using a company computer for something they shouldn't?"]
    },
    { id: '3.14.7', framework: 'NIST-CMMC', family: 'SI', title: 'System Scanning', description: 'Monitor system security alerts and advisories and take appropriate actions in response.', cmmcLevel: 2, sprsWeight: 3,
      objectives: [
        { id: 'a', description: 'security alerts and advisories are monitored; and', status: 'pending' },
        { id: 'b', description: 'appropriate actions are taken in response.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-4'] },
      interviewOptions: ["Who is responsible for responding to security alerts?"]
    },
    // --- LEVEL 3 ENHANCED SI ---
    { id: '3.14.1e', framework: 'NIST-CMMC', family: 'SI', title: 'Integrity Verification', description: 'Requires cryptographic or equivalent integrity verification.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
          { id: 'a', description: 'File integrity monitoring (FIM) is implemented; and', status: 'pending' },
          { id: 'b', description: 'Software integrity checks are performed before execution.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-7'] },
      interviewOptions: [
        "How do you verify the integrity of system files on your most critical servers?",
        "Does your system alert when unauthorized changes are made to core system binaries?"
      ]
    },
    { id: '3.14.3e', framework: 'NIST-CMMC', family: 'SI', title: 'Specialized Asset Security', description: 'Requires compensating controls for assets that cannot be fully secured (e.g., IoT, OT).', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
          { id: 'a', description: 'Specialized assets are identified; and', status: 'pending' },
          { id: 'b', description: 'Compensating controls are applied to specialized assets.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-3'] },
      interviewOptions: [
        "How do you secure legacy devices or IoT hardware that cannot run your standard security stack?",
        "Are specialized assets placed on isolated 'VLAN Islands' to reduce risk?"
      ]
    },
    { id: '3.14.6e', framework: 'NIST-CMMC', family: 'SI', title: 'Threat-Guided Intrusion Detection', description: 'Requires intrusion detection driven by current threat intelligence.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
          { id: 'a', description: 'IDS/IPS signatures are updated based on threat intelligence; and', status: 'pending' },
          { id: 'b', description: 'Behavior-based detection is informed by adversarial patterns.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SI-4'] },
      interviewOptions: [
        "How is your IDS configuration updated based on new 'Threat Actor' tactics discovered in the wild?",
        "Do you use a behavior-based EDR that looks for TTPs (Tactics, Techniques, and Procedures)?"
      ]
    }
];

export const TRAINING_MODULES: (TrainingModule | SimulationModule)[] = [
  { 
    id: 'intro-1', 
    familyId: 'PH1', 
    title: 'CMMC 2.0 Framework Architecture', 
    description: 'Overview of the transition from NIST 800-171 to CMMC 2.0.', 
    content: '# CMMC 2.0 Structural Overview\n\nCMMC 2.0 streamlines requirements into three levels.\n\n## Level 1: Foundational\nFocuses on basic cyber hygiene and protection of Federal Contract Information (FCI).\n\n## Level 2: Advanced\nAligned with NIST SP 800-171, protecting Controlled Unclassified Information (CUI).\n\n## Level 3: Expert\nProtects CUI against Advanced Persistent Threats (APTs).', 
    durationMinutes: 20, 
    difficulty: 'Beginner',
    questions: [
      {
        id: 'q1',
        question: 'Which CMMC level is aligned with NIST SP 800-171?',
        options: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
        correctAnswerIndex: 1,
        explanation: 'CMMC Level 2 (Advanced) is directly aligned with the 110 controls of NIST SP 800-171.'
      },
      {
        id: 'q2',
        question: 'What type of information does CMMC Level 1 protect?',
        options: ['CUI', 'FCI', 'ITAR', 'Classified'],
        correctAnswerIndex: 1,
        explanation: 'CMMC Level 1 focuses on the protection of Federal Contract Information (FCI).'
      }
    ]
  },
  {
    id: 'cap-1',
    familyId: 'PH5',
    title: 'The CMMC Assessment Process (CAP)',
    description: 'Deep dive into the formal assessment phases and requirements.',
    content: '# The CAP Process\n\nThe CMMC Assessment Process (CAP) defines how assessments are conducted by C3PAOs.\n\n## Phase 1: Planning and Prep\nScoping, asset categorization, and self-assessment.\n\n## Phase 2: Conduct Assessment\nEvidence review, interviews, and testing.\n\n## Phase 3: Reporting\nFinal findings and SPRS entry.',
    durationMinutes: 45,
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'cap-q1',
        question: 'Who is authorized to conduct a formal CMMC Level 2 assessment?',
        options: ['Any IT Auditor', 'A C3PAO', 'The Organization itself', 'The DoD'],
        correctAnswerIndex: 1,
        explanation: 'Only Certified Third-Party Assessment Organizations (C3PAOs) can conduct formal CMMC Level 2 assessments.'
      }
    ]
  },
  {
    id: 'rm-1',
    familyId: 'PH7',
    title: 'Risk Management Framework (RMF)',
    description: 'Integrating NIST RMF with CMMC compliance.',
    content: '# Risk Management in CMMC\n\nRisk management is a continuous process of identifying, assessing, and responding to risk.\n\n## Step 1: Prepare\n## Step 2: Categorize\n## Step 3: Select\n## Step 4: Implement\n## Step 5: Assess\n## Step 6: Authorize\n## Step 7: Monitor',
    durationMinutes: 30,
    difficulty: 'Advanced',
    questions: [
      {
        id: 'rm-q1',
        question: 'What is the first step of the NIST Risk Management Framework?',
        options: ['Categorize', 'Select', 'Prepare', 'Assess'],
        correctAnswerIndex: 2,
        explanation: 'The RMF begins with the Prepare step to establish context and priorities.'
      }
    ]
  }
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
  mastery: {},
  wizardProgress: { currentStep: 'INTRO', currentQuestionIndex: 0 },
  sspMetadata: { systemName: '', systemIdentifier: '', categorization: 'LOW', systemOwner: '', authorizingOfficial: '', otherDesignatedContacts: '', assignmentOfSecurityResponsibility: '', operationalStatus: 'Operational', systemType: 'General Support System', generalDescription: '', systemEnvironment: '', interconnections: '', lawsAndPolicies: '', completionDate: '', approvalDate: '' },
  financials: { annualRevenue: 5000000, employeeCount: 25, avgHourlyLaborRate: 125, brandValueEstimate: 1000000, legalRetentionAnnual: 50000 },
  policies: [],
  poamItems: [],
  packageAnalyses: [],
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