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

  // --- 3.10 PHYSICAL PROTECTION (PE) ---
  { 
    id: '3.10.1', framework: 'NIST-CMMC', family: 'PE', title: 'Limit physical access [CUI DATA]', 
    description: 'Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.', 
    interviewQuestion: 'Where are CUI systems physically located (Offices/DCs/Home) and how are authorized individuals restricted (Badges/Keys)?',
    examineOptions: ['List of facilities with CUI access', 'Authorized personnel list', 'Photos or diagrams of access controls', 'Physical access policy'],
    interviewOptions: ['Identification process for authorized physical access', 'Role-based access right reviews', 'Equipment storing CUI (Endpoints, Servers, Backups)'],
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
    interviewQuestion: 'Are facilities and support infrastructure monitored via cameras/alarms and are alerts reviewed?',
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
    interviewOptions: ['Visitor escort requirements', 'Visitor sign-in process', 'Are visitors allowed near CUI systems?'],
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'visitors are escorted; and', status: 'pending' },
        { id: 'b', description: 'visitor activity is monitored.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['PE-3'] } 
  },
  { 
    id: '3.10.4', framework: 'NIST-CMMC', family: 'PE', title: 'Physical Access Logs [CUI DATA]', 
    description: 'Maintain audit logs of physical access.', 
    interviewQuestion: 'Are physical access events logged, how long are they retained, and who reviews them?',
    examineOptions: ['Badge/Access log export', 'Retention policy'],
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'audit logs of physical access are maintained.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['PE-3'] } 
  },
  { 
    id: '3.10.5', framework: 'NIST-CMMC', family: 'PE', title: 'Manage Physical Access [CUI DATA]', 
    description: 'Control and manage physical access devices.', 
    interviewQuestion: 'Are access devices (badges/keys) inventoried and revoked promptly upon termination?',
    examineOptions: ['Access device inventory', 'Offboarding checklist evidence'],
    interviewOptions: ['Handling of lost or stolen devices', 'Revocation process'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'physical access devices are identified;', status: 'pending' },
        { id: 'b', description: 'physical access devices are controlled; and', status: 'pending' },
        { id: 'c', description: 'physical access devices are managed.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['PE-6'] } 
  },
  { 
    id: '3.10.6', framework: 'NIST-CMMC', family: 'PE', title: 'Alternative Work Sites', 
    description: 'Enforce safeguarding measures for CUI at alternate work sites.', 
    interviewQuestion: 'What safeguards (Screen locks, clean desk, no printing) exist for CUI access from home offices?',
    examineOptions: ['Remote work / telework policy', 'Endpoint hardening evidence'],
    interviewOptions: ['Safeguards at alternate sites', 'User training on remote CUI handling'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'safeguarding measures for CUI are defined for alternate work sites; and', status: 'pending' },
        { id: 'b', description: 'safeguarding measures for CUI are enforced for alternate work sites.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['PE-5'] } 
  },

  // --- 3.11 RISK ASSESSMENT (RA) ---
  { 
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Risk Assessments', 
    description: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.', 
    interviewQuestion: 'How often are risk assessments performed and do they cover storage, transmission, and external dependencies?',
    examineOptions: ['Risk assessment report', 'Defined assessment frequency', 'Risk register'],
    interviewOptions: ['Business processes handling CUI', 'Rating methodology for documented risks'],
    sprsWeight: 5, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the frequency to assess risk to organizational operations, organizational assets, and individuals is defined; and', status: 'pending' },
        { id: 'b', description: 'risk to organizational operations, organizational assets, and individuals resulting from the operation of an organizational system that processes, stores, or transmits CUI is assessed with the defined frequency.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['RA-3'] } 
  },
  { 
    id: '3.11.2', framework: 'NIST-CMMC', family: 'RA', title: 'Vulnerability Scan', 
    description: 'Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.', 
    interviewQuestion: 'What tools perform vulnerability scanning and what is the scan frequency for systems and apps?',
    examineOptions: ['Scanner configuration', 'Scan reports', 'Scan schedule'],
    interviewOptions: ['Scanning after new vulnerabilities are announced', 'Scope of application scanning'],
    sprsWeight: 5, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the frequency to scan for vulnerabilities in organizational systems and applications is defined;', status: 'pending' },
        { id: 'b', description: 'vulnerability scans are performed on organizational systems with the defined frequency;', status: 'pending' },
        { id: 'c', description: 'vulnerability scans are performed on applications with the defined frequency;', status: 'pending' },
        { id: 'd', description: 'vulnerability scans are performed on organizational systems when new vulnerabilities are identified; and', status: 'pending' },
        { id: 'e', description: 'vulnerability scans are performed on applications when new vulnerabilities are identified.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['RA-5'] } 
  },
  { 
    id: '3.11.3', framework: 'NIST-CMMC', family: 'RA', title: 'Vulnerability Remediation', 
    description: 'Remediate vulnerabilities in accordance with risk assessments.', 
    interviewQuestion: 'How are vulnerabilities prioritized and are remediation timelines risk-based?',
    examineOptions: ['Remediation tracking (tickets)', 'SLA or remediation policy'],
    interviewOptions: ['Handling of remediation exceptions', 'Prioritization methodology'],
    sprsWeight: 5, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'vulnerabilities are identified; and', status: 'pending' },
        { id: 'b', description: 'vulnerabilities are remediated in accordance with risk assessments.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['RA-5'] } 
  },

  // --- 3.12 SECURITY ASSESSMENT (CA) ---
  { 
    id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Security Control Assessment', 
    description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.', 
    interviewQuestion: 'How often are controls assessed and are these assessments internal, external, or both?',
    examineOptions: ['Assessment schedule', 'Prior assessment results'],
    interviewOptions: ['Methodology for documenting results', 'Frequency of control effectiveness reviews'],
    sprsWeight: 5, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the frequency of security control assessments is defined; and', status: 'pending' },
        { id: 'b', description: 'security controls are assessed with the defined frequency to determine if the controls are effective in their application.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['CA-2'] } 
  },
  { 
    id: '3.12.2', framework: 'NIST-CMMC', family: 'CA', title: 'Operational Plan of Action', 
    description: 'Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational systems.', 
    interviewQuestion: 'Are deficiencies formally tracked in a POA&M and does each item include owner, risk, and target date?',
    examineOptions: ['POA&M document', 'Evidence of remediation progress'],
    interviewOptions: ['Mitigation steps for open findings', 'Process for updating remediation status'],
    sprsWeight: 5, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'deficiencies and vulnerabilities to be addressed by the plan of action are identified;', status: 'pending' },
        { id: 'b', description: 'a plan of action is developed to correct identified deficiencies and reduce or eliminate identified vulnerabilities; and', status: 'pending' },
        { id: 'c', description: 'the plan of action is implemented to correct identified deficiencies and reduce or eliminate identified vulnerabilities.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['CA-5'] } 
  },
  { 
    id: '3.12.3', framework: 'NIST-CMMC', family: 'CA', title: 'Security Control Monitoring', 
    description: 'Monitor security controls on an ongoing basis to ensure the continued effectiveness of the controls.', 
    interviewQuestion: 'How do you ensure controls remain effective (SIEM, config monitoring, policy reviews)?',
    examineOptions: ['Continuous monitoring description', 'Evidence sources list'],
    interviewOptions: ['Frequency of monitoring activities', 'Process for reacting to control drift'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'security controls are monitored on an ongoing basis to ensure the continued effectiveness of those controls.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['CA-7'] } 
  },
  { 
    id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', title: 'System Security Plan', 
    description: 'Develop, document, and periodically update system security plans that describe system boundaries, system environments of operation, how security requirements are implemented, and the relationships with or connections to other systems.', 
    interviewQuestion: 'Does your SSP describe architecture, boundaries, CUI flow, and non-applicable control justifications?',
    examineOptions: ['SSP document', 'Network & data flow diagrams', 'SSP revision history'],
    interviewOptions: ['CUI system boundary definition', 'External system connections'],
    sprsWeight: 5, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'a system security plan is developed;', status: 'pending' },
        { id: 'b', description: 'the system boundary is described and documented in the system security plan;', status: 'pending' },
        { id: 'c', description: 'the system environment of operation is described and documented in the system security plan;', status: 'pending' },
        { id: 'd', description: 'the security requirements identified and approved by the designated authority as non-applicable are identified;', status: 'pending' },
        { id: 'e', description: 'the method of security requirement implementation is described and documented in the system security plan;', status: 'pending' },
        { id: 'f', description: 'the relationship with or connection to other systems is described and documented in the system security plan;', status: 'pending' },
        { id: 'g', description: 'the frequency to update the system security plan is defined; and', status: 'pending' },
        { id: 'h', description: 'system security plan is updated with the defined frequency', status: 'pending' }
    ], 
    mappings: { nist800_53: ['PL-2'] } 
  },

  // --- 3.13 SYSTEM AND COMMUNICATIONS PROTECTION (SC) ---
  { 
    id: '3.13.1', framework: 'NIST-CMMC', family: 'SC', title: 'Boundary Protection [CUI DATA]', 
    description: 'Monitor, control, and protect communications (i.e., information transmitted or received by organizational systems) at the external boundaries and key internal boundaries of organizational systems.', 
    interviewQuestion: 'How are communications monitored and controlled at external boundaries (Cloud, VPC) and internal VLANs?',
    examineOptions: ['Network diagrams', 'Firewall / security group rules'],
    interviewOptions: ['Internet edge vs Cloud tenant boundary', 'VPC/VNet and VLAN separation'],
    sprsWeight: 1, cmmcLevel: 2, 
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
  { 
    id: '3.13.5', framework: 'NIST-CMMC', family: 'SC', title: 'Public system separation', 
    description: 'Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.', 
    interviewQuestion: 'Are public-facing systems isolated from CUI networks using DMZs, subnets, or tenant separation?',
    examineOptions: ['Architecture diagram', 'Segmentation evidence'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'publicly accessible system components are identified; and', status: 'pending' },
        { id: 'b', description: 'subnetworks for publicly accessible system components are physically or logically separated from internal networks.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['SC-7(5)'] } 
  },
  { 
    id: '3.13.6', framework: 'NIST-CMMC', family: 'SC', title: 'Deny by default', 
    description: 'Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).', 
    interviewQuestion: 'Are firewall rules "deny all, allow by exception" and are exceptions documented?',
    examineOptions: ['Firewall policy export'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'network communications traffic is denied by default; and', status: 'pending' },
        { id: 'b', description: 'network communications traffic is allowed by exception.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['SC-7(7)'] } 
  },
  { 
    id: '3.13.7', framework: 'NIST-CMMC', family: 'SC', title: 'Split tunneling', 
    description: 'Prevent remote devices from simultaneously establishing non-remote connections with organizational systems and communicating via some other connection to resources in external networks (i.e., split tunneling).', 
    interviewQuestion: 'Is split tunneling disabled for CUI access and are any exceptions documented?',
    examineOptions: ['VPN configuration screenshots'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'remote devices are prevented from simultaneously establishing non-remote connections with the system and communicating via some other connection to resources in external networks (i.e., split tunneling).', status: 'pending' }
    ], 
    mappings: { nist800_53: ['SC-8'] } 
  },
  { 
    id: '3.13.11', framework: 'NIST-CMMC', family: 'SC', title: 'CUI Encryption', 
    description: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.', 
    interviewQuestion: 'Is FIPS-validated cryptography used for CUI at rest/transit and are keys centrally managed?',
    examineOptions: ['Encryption settings', 'Key management evidence'],
    interviewOptions: ['Storage locations of CUI', 'Transmission methods for CUI'],
    sprsWeight: 1, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'FIPS-validated cryptography is employed to protect the confidentiality of CUI.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['SC-13'] } 
  },

  // --- 3.14 SYSTEM AND INFORMATION INTEGRITY (SI) ---
  { 
    id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Flaw Remediation [CUI DATA]', 
    description: 'Identify, report, and correct system flaws in a timely manner.', 
    interviewQuestion: 'Are timelines defined for identifying, reporting, and fixing system flaws?',
    examineOptions: ['Patch management policy', 'Remediation tickets'],
    sprsWeight: 5, cmmcLevel: 1, 
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
  { 
    id: '3.14.2', framework: 'NIST-CMMC', family: 'SI', title: 'Malicious Code Protection [CUI DATA]', 
    description: 'Provide protection from malicious code at designated locations within organizational systems.', 
    interviewQuestion: 'Where is malware protection deployed and are signature updates automatic?',
    examineOptions: ['Endpoint security configuration', 'Scan reports'],
    interviewOptions: ['Real-time vs periodic scanning', 'Signature update mechanism'],
    sprsWeight: 1, cmmcLevel: 1, 
    objectives: [
        { id: 'a', description: 'designated locations for malicious code protection are identified; and', status: 'pending' },
        { id: 'b', description: 'protection from malicious code at designated locations is provided.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['SI-3'] } 
  },
  { 
    id: '3.14.6', framework: 'NIST-CMMC', family: 'SI', title: 'Monitor Communications for Attacks', 
    description: 'Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.', 
    interviewQuestion: 'Is inbound and outbound traffic monitored and are alerts generated for indicators of attack?',
    examineOptions: ['SIEM alerts', 'Monitoring architecture'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'the system is monitored to detect attacks and indicators of potential attacks;', status: 'pending' },
        { id: 'b', description: 'inbound communications traffic is monitored to detect attacks and indicators of potential attacks; and', status: 'pending' },
        { id: 'c', description: 'outbound communications traffic is monitored to detect attacks and indicators of potential attacks.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['SI-4'] } 
  },
  { 
    id: '3.14.7', framework: 'NIST-CMMC', family: 'SI', title: 'Identify Unauthorized Use', 
    description: 'Identify unauthorized use of organizational systems.', 
    interviewQuestion: 'What defines "authorized use" and how is unauthorized activity detected?',
    examineOptions: ['Use policy', 'Detection rules'],
    sprsWeight: 3, cmmcLevel: 2, 
    objectives: [
        { id: 'a', description: 'authorized use of the system is defined; and', status: 'pending' },
        { id: 'b', description: 'unauthorized use of the system is identified.', status: 'pending' }
    ], 
    mappings: { nist800_53: ['SI-4'] } 
  }
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
    id: 'cap-1', familyId: 'PH5', title: 'Phase 1: Pre-Assessment Preparation',
    description: 'Master the prerequisites for a C3PAO engagement.',
    content: `# Phase 1 Prep...`,
    durationMinutes: 25, difficulty: 'Intermediate'
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