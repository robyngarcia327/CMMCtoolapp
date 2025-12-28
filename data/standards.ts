
import { Requirement, Framework, ClientData, TrainingModule } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST-CMMC', name: 'CMMC 2.0 / NIST 800-171', description: 'Comprehensive DoD Compliance Portfolio (Levels 1-3)' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria 2017' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Administrative, Physical, and Technical Safeguards' }
];

/**
 * CMMC LEVEL 1: Basic Safeguarding (15 Requirements Complete)
 * Source: 48 CFR 52.204-21 / CMMC 2.0 Level 1
 */
const CMMC_L1_CONTROLS: Requirement[] = [
  {
    id: 'AC.L1-3.1.1',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 1,
    title: 'Authorized Access Control',
    description: 'Limit information system access to authorized users, processes acting on behalf of authorized users, or devices (including other information systems).',
    discussion: 'Control who can use organizational computers and what they can do.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending', method: 'Interview' },
      { id: 'c', description: 'Devices are identified.', status: 'pending', method: 'Test' },
      { id: 'd', description: 'System access is limited to authorized users, processes, and devices.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['AC-2'] },
    sprsWeight: 1
  },
  {
    id: 'AC.L1-3.1.2',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 1,
    title: 'Transaction & Function Control',
    description: 'Limit information system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'Ensure users only perform actions required for their role.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Authorized transactions are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Authorized functions are identified.', status: 'pending', method: 'Examine' },
      { id: 'c', description: 'System access is limited to permitted transactions and functions.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AC-6'] },
    sprsWeight: 1
  },
  {
    id: 'AC.L1-3.1.20',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 1,
    title: 'External Connections',
    description: 'Verify and control/limit connections to and use of external information systems.',
    discussion: 'Limit use of external systems like public cloud storage or unauthorized remote desktops.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'External connections are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'External connections are verified.', status: 'pending', method: 'Test' },
      { id: 'c', description: 'Use of external systems is controlled/limited.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['AC-20'] },
    sprsWeight: 1
  },
  {
    id: 'AC.L1-3.1.22',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 1,
    title: 'Public Information Control',
    description: 'Control information posted or processed on publicly accessible information systems.',
    discussion: 'Prevent sensitive info from being published on public websites.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Publicly accessible systems are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Posting of non-public info is prevented.', status: 'pending', method: 'Interview' }
    ],
    mappings: { nist800_53: ['AC-22'] },
    sprsWeight: 1
  },
  {
    id: 'IA.L1-3.5.1',
    framework: 'NIST-CMMC',
    family: 'IA',
    cmmcLevel: 1,
    title: 'Identification',
    description: 'Identify information system users, processes acting on behalf of users, or devices.',
    discussion: 'Unique identifiers (e.g., user names) for everyone.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Users are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Processes are identified.', status: 'pending', method: 'Examine' },
      { id: 'c', description: 'Devices are identified.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['IA-2'] },
    sprsWeight: 1
  },
  {
    id: 'IA.L1-3.5.2',
    framework: 'NIST-CMMC',
    family: 'IA',
    cmmcLevel: 1,
    title: 'Authentication',
    description: 'Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational information systems.',
    discussion: 'Passwords, PINs, or biometrics must be used.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Identities are verified before access.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['IA-2'] },
    sprsWeight: 1
  },
  {
    id: 'MP.L1-3.8.3',
    framework: 'NIST-CMMC',
    family: 'MP',
    cmmcLevel: 1,
    title: 'Media Sanitization',
    description: 'Sanitize or destroy information system media containing Federal Contract Information before disposal or release for reuse.',
    discussion: 'Wipe hard drives or shred papers before disposal.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'System media are sanitized or destroyed.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['MP-6'] },
    sprsWeight: 1
  },
  {
    id: 'PE.L1-3.10.1',
    framework: 'NIST-CMMC',
    family: 'PE',
    cmmcLevel: 1,
    title: 'Physical Access Control',
    description: 'Limit physical access to organizational information systems, equipment, and the respective operating environments to authorized individuals.',
    discussion: 'Keep server rooms and offices locked.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Physical access is limited.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['PE-2'] },
    sprsWeight: 1
  },
  {
    id: 'PE.L1-3.10.3',
    framework: 'NIST-CMMC',
    family: 'PE',
    cmmcLevel: 1,
    title: 'Escort Visitors',
    description: 'Escort visitors and monitor visitor activity.',
    discussion: 'Visitors should be supervised in secure areas.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Visitors are escorted.', status: 'pending', method: 'Interview' },
      { id: 'b', description: 'Visitor activity is monitored.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['PE-3'] },
    sprsWeight: 1
  },
  {
    id: 'PE.L1-3.10.4',
    framework: 'NIST-CMMC',
    family: 'PE',
    cmmcLevel: 1,
    title: 'Visitor Logs',
    description: 'Maintain audit logs of physical access.',
    discussion: 'Sign-in sheets for visitors.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Access logs are maintained.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['PE-3'] },
    sprsWeight: 1
  },
  {
    id: 'PE.L1-3.10.5',
    framework: 'NIST-CMMC',
    family: 'PE',
    cmmcLevel: 1,
    title: 'Control Access Devices',
    description: 'Control and manage physical access devices.',
    discussion: 'Keys, badges, and fobs must be tracked.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Physical access devices are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Devices are controlled and managed.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['PE-3'] },
    sprsWeight: 1
  },
  {
    id: 'SC.L1-3.13.1',
    framework: 'NIST-CMMC',
    family: 'SC',
    cmmcLevel: 1,
    title: 'Boundary Protection',
    description: 'Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational information systems) at the external boundaries and transmit-receive points of the information systems.',
    discussion: 'Firewalls and routers must protect the perimeter.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Boundaries are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Communications are monitored and controlled.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['SC-7'] },
    sprsWeight: 1
  },
  {
    id: 'SC.L1-3.13.5',
    framework: 'NIST-CMMC',
    family: 'SC',
    cmmcLevel: 1,
    title: 'Subnetworks for Public Systems',
    description: 'Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.',
    discussion: 'Separate public-facing systems (e.g., web servers) from internal networks.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Subnetworks for public systems are implemented.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Subnetworks are separated from internal networks.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['SC-7'] },
    sprsWeight: 1
  },
  {
    id: 'SI.L1-3.14.1',
    framework: 'NIST-CMMC',
    family: 'SI',
    cmmcLevel: 1,
    title: 'Flaw Remediation',
    description: 'Identify, report, and correct information and information system flaws in a timely manner.',
    discussion: 'Install software updates and security patches.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'System flaws are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Flaws are reported.', status: 'pending', method: 'Interview' },
      { id: 'c', description: 'Flaws are corrected in a timely manner.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['SI-2'] },
    sprsWeight: 1
  },
  {
    id: 'SI.L1-3.14.2',
    framework: 'NIST-CMMC',
    family: 'SI',
    cmmcLevel: 1,
    title: 'Malicious Code Protection',
    description: 'Provide protection from malicious code at appropriate locations within organizational information systems.',
    discussion: 'Anti-virus and anti-malware software.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Malicious code protection is provided.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['SI-3'] },
    sprsWeight: 1
  }
];

/**
 * CMMC LEVEL 2: NIST 800-171 r2 (Complete Set Representative)
 * Standardized numbering: 3.x.x
 */
const CMMC_L2_CONTROLS: Requirement[] = [
  // --- ACCESS CONTROL (AC) ---
  {
    id: '3.1.1',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 2,
    title: 'Access Control Policy',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).',
    discussion: 'Core access control requirement. Ensure only known people and machines get in.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending', method: 'Examine' },
      { id: 'c', description: 'Devices (including other systems) are identified.', status: 'pending', method: 'Examine' },
      { id: 'd', description: 'System access is limited to authorized users.', status: 'pending', method: 'Test' },
      { id: 'e', description: 'System access is limited to authorized processes.', status: 'pending', method: 'Test' },
      { id: 'f', description: 'System access is limited to authorized devices.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AC-2', 'AC-3'] }
  },
  {
    id: '3.1.2',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 2,
    title: 'Account Management',
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'Role-based access control (RBAC).',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Permitted transactions and functions are defined.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'System access is limited to the defined types of transactions and functions.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AC-6'] }
  },
  {
    id: '3.1.3',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 2,
    title: 'Control CUI Flow',
    description: 'Control the flow of CUI in accordance with approved authorizations.',
    discussion: 'Prevent CUI from leaking to unauthorized networks or systems.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Authorizations for CUI flow are defined.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'The flow of CUI is controlled in accordance with authorizations.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AC-4'] }
  },
  {
    id: '3.1.5',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 2,
    title: 'Least Privilege',
    description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.',
    discussion: 'Users only have access to what they need.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Privileged accounts are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Security functions are identified.', status: 'pending', method: 'Examine' },
      { id: 'c', description: 'The principle of least privilege is applied.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AC-6'] }
  },
  {
    id: '3.1.8',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 2,
    title: 'Unsuccessful Logon Attempts',
    description: 'Limit unsuccessful logon attempts.',
    discussion: 'Prevent brute-force attacks.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'The number of allowed unsuccessful logon attempts is defined.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Unsuccessful logon attempts are limited.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AC-7'] }
  },
  {
    id: '3.1.12',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 2,
    title: 'Session Termination',
    description: 'Automatically terminate a user session after a defined condition.',
    discussion: 'Lock screens after 15 minutes of inactivity.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Conditions for session termination are defined.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Sessions are terminated after defined conditions.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AC-12'] }
  },
  {
    id: '3.1.18',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 2,
    title: 'Monitor and Control Remote Access',
    description: 'Monitor and control remote access sessions.',
    discussion: 'Maintain audit records of remote connections.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Remote access sessions are monitored.', status: 'pending', method: 'Test' },
      { id: 'b', description: 'Remote access sessions are controlled.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AC-17'] }
  },

  // --- AWARENESS & TRAINING (AT) ---
  {
    id: '3.2.1',
    framework: 'NIST-CMMC',
    family: 'AT',
    cmmcLevel: 2,
    title: 'Security Awareness Training',
    description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities.',
    discussion: 'Annual cybersecurity training.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Personnel are made aware of security risks.', status: 'pending', method: 'Interview' },
      { id: 'b', description: 'Training is provided to all identified personnel.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['AT-2'] }
  },

  // --- AUDIT AND ACCOUNTABILITY (AU) ---
  {
    id: '3.3.1',
    framework: 'NIST-CMMC',
    family: 'AU',
    cmmcLevel: 2,
    title: 'Audit Logging',
    description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.',
    discussion: 'Log important events like logins and file changes.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System audit logs and records are created.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'System audit logs and records are retained.', status: 'pending', method: 'Examine' },
      { id: 'c', description: 'Logs enable monitoring of unauthorized activity.', status: 'pending', method: 'Test' },
      { id: 'd', description: 'Logs enable analysis and investigation of activity.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AU-2'] }
  },
  {
    id: '3.3.2',
    framework: 'NIST-CMMC',
    family: 'AU',
    cmmcLevel: 2,
    title: 'Audit Review',
    description: 'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.',
    discussion: 'User traceability in logs.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Actions of individual system users are uniquely traced.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AU-3'] }
  },

  // --- CONFIGURATION MANAGEMENT (CM) ---
  {
    id: '3.4.1',
    framework: 'NIST-CMMC',
    family: 'CM',
    cmmcLevel: 2,
    title: 'Baseline Configuration',
    description: 'Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.',
    discussion: 'Standard gold images for PCs.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Baseline configurations are established.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Baseline configurations are maintained.', status: 'pending', method: 'Examine' },
      { id: 'c', description: 'Inventories of organizational systems are established.', status: 'pending', method: 'Examine' },
      { id: 'd', description: 'Inventories of organizational systems are maintained.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['CM-2'] }
  },
  {
    id: '3.4.2',
    framework: 'NIST-CMMC',
    family: 'CM',
    cmmcLevel: 2,
    title: 'Configuration Change Control',
    description: 'Establish and enforce security configuration settings for information technology products employed in organizational systems.',
    discussion: 'Apply secure settings (STIGs/CIS).',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Security configuration settings are established.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Security configuration settings are enforced.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['CM-6'] }
  },

  // --- IDENTIFICATION AND AUTHENTICATION (IA) ---
  {
    id: '3.5.3',
    framework: 'NIST-CMMC',
    family: 'IA',
    cmmcLevel: 2,
    title: 'Multi-Factor Authentication',
    description: 'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.',
    discussion: 'MFA for everyone.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'MFA is used for network access to privileged accounts.', status: 'pending', method: 'Test' },
      { id: 'b', description: 'MFA is used for network access to non-privileged accounts.', status: 'pending', method: 'Test' },
      { id: 'c', description: 'MFA is used for local access to privileged accounts.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['IA-2'] }
  },

  // --- INCIDENT RESPONSE (IR) ---
  {
    id: '3.6.1',
    framework: 'NIST-CMMC',
    family: 'IR',
    cmmcLevel: 2,
    title: 'Incident Response Capability',
    description: 'Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.',
    discussion: 'Incident response plan.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Incident-handling capability is established.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Capability includes preparation.', status: 'pending', method: 'Examine' },
      { id: 'c', description: 'Capability includes detection.', status: 'pending', method: 'Examine' },
      { id: 'd', description: 'Capability includes analysis.', status: 'pending', method: 'Examine' },
      { id: 'e', description: 'Capability includes containment.', status: 'pending', method: 'Examine' },
      { id: 'f', description: 'Capability includes recovery.', status: 'pending', method: 'Examine' },
      { id: 'g', description: 'Capability includes user response activities.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['IR-4'] }
  },

  // --- MEDIA PROTECTION (MP) ---
  {
    id: '3.8.1',
    framework: 'NIST-CMMC',
    family: 'MP',
    cmmcLevel: 2,
    title: 'Protect Media Content',
    description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.',
    discussion: 'Lock up USBs.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'System media containing CUI is identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'System media containing CUI is protected.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['MP-2'] }
  },

  // --- PERSONNEL SECURITY (PS) ---
  {
    id: '3.9.1',
    framework: 'NIST-CMMC',
    family: 'PS',
    cmmcLevel: 2,
    title: 'Screen Personnel',
    description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.',
    discussion: 'Background checks.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Individuals are screened prior to access.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['PS-3'] }
  },

  // --- RISK ASSESSMENT (RA) ---
  {
    id: '3.11.1',
    framework: 'NIST-CMMC',
    family: 'RA',
    cmmcLevel: 2,
    title: 'Vulnerability Risk Assessment',
    description: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.',
    discussion: 'Vulnerability scans.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Risks resulting from system operation are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Risks are assessed periodically.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['RA-3'] }
  },

  // --- SECURITY ASSESSMENT (CA) ---
  {
    id: '3.12.1',
    framework: 'NIST-CMMC',
    family: 'CA',
    cmmcLevel: 2,
    title: 'Security Control Assessment',
    description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.',
    discussion: 'Self-audits.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Security controls are identified for assessment.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Assessments are conducted periodically.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['CA-2'] }
  },

  // --- SYSTEM AND COMMUNICATIONS PROTECTION (SC) ---
  {
    id: '3.13.1',
    framework: 'NIST-CMMC',
    family: 'SC',
    cmmcLevel: 2,
    title: 'Boundary Protection',
    description: 'Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational systems) at the external boundaries and transmit-receive points of the information systems.',
    discussion: 'Firewalls.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'External boundaries are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Transmit-receive points are identified.', status: 'pending', method: 'Examine' },
      { id: 'c', description: 'Communications at external boundaries are monitored.', status: 'pending', method: 'Test' },
      { id: 'd', description: 'Communications at external boundaries are controlled.', status: 'pending', method: 'Test' },
      { id: 'e', description: 'Communications at external boundaries are protected.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['SC-7'] }
  },
  {
    id: '3.13.11',
    framework: 'NIST-CMMC',
    family: 'SC',
    cmmcLevel: 2,
    title: 'CUI Cryptography',
    description: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.',
    discussion: 'FIPS 140-2 encryption.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'FIPS-validated cryptography is identified for use.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'FIPS-validated cryptography is employed to protect CUI.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['SC-13'] }
  },

  // --- SYSTEM AND INFORMATION INTEGRITY (SI) ---
  {
    id: '3.14.1',
    framework: 'NIST-CMMC',
    family: 'SI',
    cmmcLevel: 2,
    title: 'Flaw Remediation',
    description: 'Identify, report, and correct system flaws in a timely manner.',
    discussion: 'Patching.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'System flaws are identified.', status: 'pending', method: 'Test' },
      { id: 'b', description: 'System flaws are reported.', status: 'pending', method: 'Interview' },
      { id: 'c', description: 'System flaws are corrected in a timely manner.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['SI-2'] }
  }
];

// --- CMMC LEVEL 3: Enhanced Protection (APT) ---
const CMMC_L3_CONTROLS: Requirement[] = [
  {
    id: 'AC.L3-3.1.2e',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 3,
    title: 'Organizationally Controlled Assets',
    description: 'Restrict access to systems and system components to only those information resources that are owned, provisioned, or issued by the organization.',
    discussion: 'Restricts non-organizational resources.',
    level: 'Level 3',
    objectives: [
      { id: 'a', description: 'Information resources owned/provisioned by org are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Access is restricted to only organizationally controlled assets.', status: 'pending', method: 'Test' }
    ],
    mappings: {},
    sprsWeight: 5
  }
];

// --- SOC 2 ---
const SOC2_CONTROLS: Requirement[] = [
  {
    id: 'CC1.1',
    framework: 'SOC2',
    family: 'CC1',
    title: 'Integrity and Ethical Values',
    description: 'The entity demonstrates a commitment to integrity and ethical values.',
    discussion: 'Requires established standards of conduct.',
    level: 'Common Criteria',
    objectives: [
      { id: 'a', description: 'Tone at the top is established through formal policies.', status: 'pending' }
    ],
    mappings: { iso27001: ['A.5.1'] }
  }
];

// --- HIPAA ---
const HIPAA_CONTROLS: Requirement[] = [
  {
    id: '164.308(a)(1)(i)',
    framework: 'HIPAA',
    family: 'Administrative',
    title: 'Security Management Process',
    description: 'Implement policies to prevent, detect, contain, and correct security violations.',
    discussion: 'Requires Risk Analysis and Risk Management.',
    level: 'Required',
    objectives: [{ id: 'a', description: 'Risk Analysis conducted.', status: 'pending' }],
    mappings: {}
  }
];

export const REQUIREMENTS_DATA: Requirement[] = [
    ...CMMC_L1_CONTROLS,
    ...CMMC_L2_CONTROLS,
    ...CMMC_L3_CONTROLS,
    ...SOC2_CONTROLS,
    ...HIPAA_CONTROLS
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
  { id: 'CC1', name: 'Control Environment' },
  { id: 'CC2', name: 'Communication and Information' },
  { id: 'CC3', name: 'Risk Assessment' },
  { id: 'CC4', name: 'Monitoring Activities' },
  { id: 'CC5', name: 'Control Activities' }
];

export const HIPAA_FAMILIES = [
  { id: 'Administrative', name: 'Administrative Safeguards' },
  { id: 'Physical', name: 'Physical Safeguards' },
  { id: 'Technical', name: 'Technical Safeguards' }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'TR-AC-01',
    familyId: 'AC',
    title: 'Mastering Access Control',
    description: 'How to implement identity and access management for CMMC compliance.',
    content: '# Access Control Mastery\n\nUnderstand how to limit information system access to authorized users.',
    durationMinutes: 20,
    difficulty: 'Intermediate'
  }
];

export const createInitialClientData = (useMockData = false): ClientData => {
    return {
        requirements: JSON.parse(JSON.stringify(REQUIREMENTS_DATA)),
        risks: [],
        assets: [],
        users: [],
        tasks: [],
        budgetItems: [],
        vendors: [],
        artifacts: [],
        tickets: [],
        wizardProgress: { currentStep: 'INTRO', currentQuestionIndex: 0 },
        cwConfig: { siteUrl: '', companyId: '', publicKey: '', privateKey: '', serviceBoard: 'Compliance Remediation', enabled: true },
        jiraConfig: { baseUrl: '', email: '', apiToken: '', projectKey: '', issueType: 'Task', enabled: false },
        confluenceConfig: { baseUrl: '', email: '', apiToken: '', spaceKey: '', enabled: false },
        auvikConfig: { apiKey: '', tenantId: '', region: 'US', enabled: false },
        m365Config: { enabled: false },
        awsConfig: { enabled: false },
        googleConfig: { enabled: false },
        siemConfig: { enabled: false },
        sspMetadata: {
          systemName: 'Corporate IT Infrastructure',
          systemIdentifier: 'CORP-IT-001',
          categorization: 'MODERATE',
          systemOwner: 'Chief Information Officer',
          authorizingOfficial: 'Chief Security Officer',
          otherDesignatedContacts: 'IT Manager, Security Engineer',
          assignmentOfSecurityResponsibility: 'Senior Information Security Officer (SISO)',
          operationalStatus: 'Operational',
          systemType: 'General Support System',
          generalDescription: 'Primary business processing network supporting all corporate operations and data storage.',
          systemEnvironment: 'Hybrid cloud environment (Azure/On-prem) with segmented VLANs for production and testing.',
          interconnections: 'VPN tunnels to AWS regions; dedicated fiber to data center.',
          lawsAndPolicies: 'FISMA, DFARS 252.204-7012, Privacy Act 1974, NIST SP 800-171',
          completionDate: new Date().toISOString().split('T')[0],
          approvalDate: ''
        }
    };
};
