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

// NIST SP 800-171A Granular Determination Statements with Guided Wizard Content
const NIST_800_171_CONTROLS: Requirement[] = [
  // --- 3.1 ACCESS CONTROL (AC) ---
  { 
    id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', 
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', 
    interviewQuestion: 'How do you define an "authorized user" and where is that enforced (groups/roles/policies)?',
    examineOptions: ['List of authorized user groups/roles', 'List of authorized device types + enforcement method (MDM/CA/NAC)', 'List of service accounts/service principals that touch CUI'],
    interviewOptions: ['Authoritative identity sources (Entra ID/AD/Cognito)', 'Restriction methods for processes/service principals', 'Device class access rules (Corp vs BYOD)'],
    testOptions: ['Attempt access from unknown/unmanaged device', 'Verify conditional access enforcement'],
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'authorized users are identified;', status: 'pending' },
        { id: 'b', description: 'processes acting on behalf of authorized users are identified;', status: 'pending' },
        { id: 'c', description: 'devices (and other systems) authorized to connect to the system are identified;', status: 'pending' },
        { id: 'd', description: 'system access is limited to authorized users;', status: 'pending' },
        { id: 'e', description: 'system access is limited to processes acting on behalf of authorized users; and', status: 'pending' },
        { id: 'f', description: 'system access is limited to authorized devices (including other systems).', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-2'] } 
  },
  { 
    id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Limit access to transactions/functions', 
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', 
    interviewQuestion: 'What transactions/functions (view/edit/share) are allowed per role and where is this enforced?',
    examineOptions: ['Role-to-Action matrix or checklist', 'Screenshots/exports of app role permissions', 'SharePoint/OneDrive permission configurations'],
    interviewOptions: ['Applications processing/transmitting CUI', 'Governance of "break-glass" privileged roles', 'Enforcement mechanisms (RBAC/SaaS permissions)'],
    sprsWeight: 5, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'the types of transactions and functions that authorized users are permitted to execute are defined; and', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined types of transactions and functions for authorized users.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-6'] } 
  },
  { 
    id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control the flow of CUI', 
    description: 'Control the flow of CUI in accordance with approved authorizations.', 
    interviewQuestion: 'What are your approved CUI communication domains and how do you prevent flow to unauthorized paths?',
    examineOptions: ['Authorized external domains table', 'DLP configuration (Policy list + actions)', 'CUI Location inventory (SharePoint/Teams/S3)', 'Approved transfer methods list (Encrypted email/SFTP)'],
    interviewOptions: ['Information flow policies (Approved vs Prohibited paths)', 'Prevention of external sharing to non-approved domains', 'Blocking copy/paste or download to unmanaged devices'],
    testOptions: ['Attempt to share CUI to personal cloud (Dropbox/iCloud)', 'Verify block on non-approved domain email transfer'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'information flow control policies are defined;', status: 'pending' },
        { id: 'b', description: 'methods and enforcement mechanisms for controlling the flow of CUI are defined;', status: 'pending' },
        { id: 'c', description: 'designated sources and destinations (e.g., networks, individuals, and devices) for CUI within the system and between interconnected systems are identified;', status: 'pending' },
        { id: 'd', description: 'authorizations for controlling the flow of CUI are defined; and', status: 'pending' },
        { id: 'e', description: 'approved authorizations for controlling the flow of CUI are enforced.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-4'] } 
  },
  { 
    id: '3.1.4', framework: 'NIST-CMMC', family: 'AC', title: 'Separate duties of individuals', 
    description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', 
    interviewQuestion: 'Which duties (e.g. provisioning, log admin) require separation and how are roles assigned?',
    examineOptions: ['List of SoD duties + assigned roles', 'Admin role membership export', 'Change management workflow logs'],
    interviewOptions: ['Definition of conflicting duties', 'Can one person grant CUI access and disable logging?'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the duties of individuals requiring separation are defined;', status: 'pending' },
        { id: 'b', description: 'responsibilities for duties that require separation are assigned to separate individuals; and', status: 'pending' },
        { id: 'c', description: 'access privileges that enable individuals to exercise the duties that require separation are granted to separate individuals.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-5'] } 
  },
  { 
    id: '3.1.5', framework: 'NIST-CMMC', family: 'AC', title: 'Employ least privilege', 
    description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', 
    interviewQuestion: 'How is privileged access reviewed and do you use JIT/PIM for time-bound admin roles?',
    examineOptions: ['Privileged role list', 'Access review evidence (tickets/attestations)', 'PIM/PAM logs'],
    interviewOptions: ['Restriction of security functions (DLP edits, log deletion)', 'Review schedule for privileged accounts'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'privileged accounts are identified;', status: 'pending' },
        { id: 'b', description: 'access to privileged accounts is authorized in accordance with the principle of least privilege;', status: 'pending' },
        { id: 'c', description: 'security functions are identified; and', status: 'pending' },
        { id: 'd', description: 'access to security functions is authorized in accordance with the principle of least privilege.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-6'] } 
  },
  { 
    id: '3.1.6', framework: 'NIST-CMMC', family: 'AC', title: 'Use non-privileged accounts', 
    description: 'Use non-privileged accounts or roles when accessing nonsecurity functions.', 
    interviewQuestion: 'Are admins required to use separate non-admin accounts for standard work (email/browsing)?',
    examineOptions: ['Access policy statement', 'Endpoint control logs'],
    interviewOptions: ['Enforcement of PAW (Hardened Admin Workstations)', 'Account separation strategy'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'nonsecurity functions are identified; and', status: 'pending' },
        { id: 'b', description: 'users are required', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-6(2)'] } 
  },
  { 
    id: '3.1.7', framework: 'NIST-CMMC', family: 'AC', title: 'Prevent non-privileged users from executing privileged functions', 
    description: 'Prevent non-privileged users from executing privileged functions and audit use of privileged functions.', 
    interviewQuestion: 'Where are privileged actions logged and how do you review these critical events?',
    examineOptions: ['Screenshot of audit event categories enabled', 'Sample privileged action log entry'],
    interviewOptions: ['Definition of "privileged functions" in your environment', 'Technical blocking of non-admin execution'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'privileged functions are defined;', status: 'pending' },
        { id: 'b', description: 'non-privileged users are defined;', status: 'pending' },
        { id: 'c', description: 'non-privileged users are prevented from executing privileged functions; and', status: 'pending' },
        { id: 'd', description: 'the execution of privileged functions is captured in audit logs.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-6(5)'] } 
  },
  { 
    id: '3.1.8', framework: 'NIST-CMMC', family: 'AC', title: 'Limit unsuccessful logon attempts', 
    description: 'Limit unsuccessful logon attempts.', 
    interviewQuestion: 'What lockout/throttling policy is enforced across all platforms (AD/Cloud/SaaS)?',
    examineOptions: ['Policy settings screenshots (Lockout threshold/duration)', 'IdP password policy exports'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the means of limiting unsuccessful logon attempts is defined; and', status: 'pending' },
        { id: 'b', description: 'the defined means of limiting unsuccessful logon attempts is implemented.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-7'] } 
  },
  { 
    id: '3.1.9', framework: 'NIST-CMMC', family: 'AC', title: 'Provide privacy & security notices', 
    description: 'Provide privacy and security notices consistent with applicable CUI rules.', 
    interviewQuestion: 'Where are CUI-related login/app banners displayed and do they map to current rules?',
    examineOptions: ['Banner text proof', 'List of implementation points (VDI, Web Portals, Workstations)'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'privacy and security notices required by CUI-specified rules are identified, consistent, and associated with the specific CUI category; and', status: 'pending' },
        { id: 'b', description: 'privacy and security notices are displayed.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-8'] } 
  },
  { 
    id: '3.1.10', framework: 'NIST-CMMC', family: 'AC', title: 'Session Lock', 
    description: 'Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.', 
    interviewQuestion: 'What is the inactivity timeout for lock screen and how is it enforced (GPO/MDM)?',
    examineOptions: ['MDM configuration profile (Session settings)', 'GPO export for Screen Lock'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the period of inactivity after which the system initiates a session lock is defined;', status: 'pending' },
        { id: 'b', description: 'access to the system and viewing of data is prevented by initiating a session lock after the defined period of inactivity; and', status: 'pending' },
        { id: 'c', description: 'previously visible information is concealed via a pattern-hiding display after the defined period of inactivity.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-11'] } 
  },
  { 
    id: '3.1.11', framework: 'NIST-CMMC', family: 'AC', title: 'Session Termination', 
    description: 'Terminate (automatically) a user session after a defined condition.', 
    interviewQuestion: 'What conditions (VDI disconnect, web idle) terminate an active CUI session?',
    examineOptions: ['Session timeout settings for VPN/VDI/SaaS', 'Conditional Access session frequency settings'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'conditions requiring a user session to terminate are defined; and', status: 'pending' },
        { id: 'b', description: 'a user session is automatically terminated after any of the defined conditions occur.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-12'] } 
  },
  { 
    id: '3.1.12', framework: 'NIST-CMMC', family: 'AC', title: 'Control Remote Access', 
    description: 'Monitor and control remote access sessions.', 
    interviewQuestion: 'Which remote access methods (VPN, ZTNA, RMM) can access CUI systems and are they approved?',
    examineOptions: ['Approved remote access methods list', 'Screenshot of VPN/ZTNA access policies', 'SIEM/Native logs of remote sessions'],
    interviewOptions: ['Blocking of ad-hoc tools (TeamViewer/AnyDesk)', 'Restriction by device posture or network location'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'remote access sessions are permitted;', status: 'pending' },
        { id: 'b', description: 'the types of permitted remote access are identified;', status: 'pending' },
        { id: 'c', description: 'remote access sessions are controlled; and', status: 'pending' },
        { id: 'd', description: 'remote access sessions are monitored.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-17'] } 
  },
  { 
    id: '3.1.13', framework: 'NIST-CMMC', family: 'AC', title: 'Remote Access Confidentiality', 
    description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', 
    interviewQuestion: 'Are all remote sessions encrypted using FIPS-validated mechanisms (TLS 1.2+, IPSec)?',
    examineOptions: ['Encryption protocol list (TLS versions)', 'VPN/VDI policy config screenshots'],
    interviewOptions: ['Disabling of legacy/insecure protocols (FTP/Telnet)', 'Enforcement for API and Admin portals'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'cryptographic mechanisms to protect the confidentiality of remote access sessions are identified; and', status: 'pending' },
        { id: 'b', description: 'cryptographic mechanisms to protect the confidentiality of remote access sessions are implemented.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-17(2)'] } 
  },
  { 
    id: '3.1.14', framework: 'NIST-CMMC', family: 'AC', title: 'Remote Access Routing', 
    description: 'Route remote access via managed access control points.', 
    interviewQuestion: 'Are users forced through managed control points (VPN/ZTNA) and is split-tunneling disabled for CUI?',
    examineOptions: ['Network diagram with CUI boundary highlighted', 'Firewall/VPC/NACL rule evidence'],
    interviewOptions: ['Ingress points into the CUI environment', 'Blocking direct access from public internet'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'managed access control points are identified and implemented; and', status: 'pending' },
        { id: 'b', description: 'remote access is routed through managed network access control points.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-17(3)'] } 
  },
  { 
    id: '3.1.15', framework: 'NIST-CMMC', family: 'AC', title: 'Privileged Remote Access', 
    description: 'Authorize remote execution of privileged commands and remote access to security relevant information.', 
    interviewQuestion: 'Are privileged users required to use MFA and Bastion/Jump hosts for remote access?',
    examineOptions: ['Admin remote access workflow description', 'Logs showing privileged remote sessions'],
    interviewOptions: ['Use of hardened admin workstations', 'MFA requirements for remote admin execution'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'privileged commands authorized for remote execution are identified;', status: 'pending' },
        { id: 'b', description: 'security-relevant information authorized to be accessed remotely is identified;', status: 'pending' },
        { id: 'c', description: 'the execution of the identified privileged commands via remote access is authorized; and', status: 'pending' },
        { id: 'd', description: 'access to the identified security-relevant information via remote access is authorized.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AC-17(4)'] } 
  },

  // --- 3.2 AWARENESS AND TRAINING (AT) ---
  { 
    id: '3.2.1', framework: 'NIST-CMMC', family: 'AT', title: 'Role-Based Risk Awareness', 
    description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures related to the security of those systems.', 
    interviewQuestion: 'Do users receive CUI-specific training (What it is, how to report incidents) before access?',
    examineOptions: ['Training curriculum outline', 'Training completion report', 'Training content slides/modules'],
    interviewOptions: ['Incident reporting expectations for end users', 'Tracking and enforcement mechanism for training'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'security risks associated with organizational activities involving CUI are identified;', status: 'pending' },
        { id: 'b', description: 'policies, standards, and procedures related to the security of the system are identified;', status: 'pending' },
        { id: 'c', description: 'managers, systems administrators, and users of the system are made aware of the security risks associated with their activities; and', status: 'pending' },
        { id: 'd', description: 'managers, systems administrators, and users of the system are made aware of the applicable policies, standards, and procedures related to the security of the system.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AT-2'] } 
  },
  { 
    id: '3.2.2', framework: 'NIST-CMMC', family: 'AT', title: 'Role-Based Training', 
    description: 'Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities.', 
    interviewQuestion: 'Do privileged roles receive specialized training on DLP enforcement and audit logging?',
    examineOptions: ['Role-to-Training mapping matrix', 'Evidence of specialized completion by admins'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'information security-related duties, roles, and responsibilities are defined;', status: 'pending' },
        { id: 'b', description: 'information security-related duties, roles, and responsibilities are assigned to designated personnel; and', status: 'pending' },
        { id: 'c', description: 'personnel are adequately trained to carry out their assigned information security related duties, roles, and responsibilities.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AT-3'] } 
  },

  // --- 3.3 AUDIT AND ACCOUNTABILITY (AU) ---
  { 
    id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'System Auditing', 
    description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.', 
    interviewQuestion: 'Which systems (IdP, Cloud, SaaS) generate CUI-related logs and are they centralized?',
    examineOptions: ['Log source inventory', 'SIEM ingestion proof', 'Configuration of audit policies'],
    interviewOptions: ['Logging for Privileged actions and DLP enforcement', 'Retention period for centralized logs'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'audit logs needed (i.e., event types to be logged) to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity are specified;', status: 'pending' },
        { id: 'b', description: 'the content of audit records needed to support monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity is defined;', status: 'pending' },
        { id: 'c', description: 'audit records are created (generated);', status: 'pending' },
        { id: 'd', description: 'audit records, once created, contain the defined content;', status: 'pending' },
        { id: 'e', description: 'retention requirements for audit records are defined; and', status: 'pending' },
        { id: 'f', description: 'audit records are retained as defined.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AU-2'] } 
  },
  { 
    id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'User Accountability', 
    description: 'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.', 
    interviewQuestion: 'Are shared accounts prohibited and can all actions be tied to unique identities?',
    examineOptions: ['Identity policy document', 'Evidence of unique account enforcement'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the content of the audit records needed to support the ability to uniquely trace users to their actions is defined; and', status: 'pending' },
        { id: 'b', description: 'audit records, once created, contain the defined content.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['AU-3'] } 
  },

  // --- 3.4 CONFIGURATION MANAGEMENT (CM) ---
  { 
    id: '3.4.1', framework: 'NIST-CMMC', family: 'CM', title: 'System Baselining', 
    description: 'Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.', 
    interviewQuestion: 'Are secure baselines defined for all CUI systems and how are they enforced?',
    examineOptions: ['Secure baseline documents', 'Enforcement evidence (GPO/MDM)', 'Hardware/Software inventory list'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'a baseline configuration is established;', status: 'pending' },
        { id: 'b', description: 'the baseline configuration includes hardware, software, firmware, and documentation;', status: 'pending' },
        { id: 'c', description: 'the baseline configuration is maintained (reviewed and updated) throughout the system development life cycle;', status: 'pending' },
        { id: 'd', description: 'a system inventory is established;', status: 'pending' },
        { id: 'e', description: 'the system inventory includes hardware, software, firmware, and documentation; and', status: 'pending' },
        { id: 'f', description: 'the inventory is maintained (reviewed and updated) throughout the system development life cycle.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['CM-2'] } 
  },

  // --- 3.10 PHYSICAL PROTECTION (PE) ---
  { 
    id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit Physical Access [CUI DATA]', 
    description: 'Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.', 
    interviewQuestion: 'Where are CUI systems physically located (Offices/DCs/Home) and how are authorized individuals identified and restricted (Badges/Keys)?',
    examineOptions: ['List of facilities with CUI access', 'Authorized personnel list', 'Photos or diagrams of access controls', 'Physical access policy'],
    interviewOptions: ['Identification process for authorized physical access', 'Role-based access right reviews'],
    testOptions: ['Attempt unauthorized access to server room/data center'],
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'authorized individuals allowed physical access are identified;', status: 'pending' },
        { id: 'b', description: 'physical access to organizational systems is limited to authorized individuals;', status: 'pending' },
        { id: 'c', description: 'physical access to equipment is limited to authorized individuals; and', status: 'pending' },
        { id: 'd', description: 'physical access to operating environments is limited to authorized individuals.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['PE-2'] } 
  },
  { 
    id: '3.10.2', framework: 'NIST-CMMC', family: 'PE', title: 'Monitor Facility', 
    description: 'Protect and monitor the physical facility and support infrastructure for organizational systems.', 
    interviewQuestion: 'Are facilities monitored via cameras/alarms and are alerts generated and reviewed?',
    examineOptions: ['Monitoring system description', 'Evidence of monitoring (camera list, alarm contract)', 'Incident or alert logs'],
    interviewOptions: ['Protection of support infrastructure (HVAC, Power, Closets)', 'Alert review process'],
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'the physical facility where organizational systems reside is protected;', status: 'pending' },
        { id: 'b', description: 'the support infrastructure for organizational systems is protected;', status: 'pending' },
        { id: 'c', description: 'the physical facility where organizational systems reside is monitored; and', status: 'pending' },
        { id: 'd', description: 'the support infrastructure for organizational systems is monitored.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['PE-3'] } 
  },
  { 
    id: '3.10.3', framework: 'NIST-CMMC', family: 'PE', title: 'Escort Visitors [CUI DATA]', 
    description: 'Escort visitors and monitor visitor activity.', 
    interviewQuestion: 'Are visitors required to sign in, wear badges, and be escorted at all times near CUI systems?',
    examineOptions: ['Visitor access procedure', 'Visitor log sample'],
    interviewOptions: ['Visitor escort requirements', 'Visitor sign-in process'],
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'visitors are escorted; and', status: 'pending' },
        { id: 'b', description: 'visitor activity is monitored.',