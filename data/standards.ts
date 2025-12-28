
import { Requirement, Framework, ClientData, TrainingModule } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST-CMMC', name: 'CMMC 2.0 / NIST 800-171', description: 'Comprehensive DoD Compliance Portfolio (Levels 1-3)' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria 2017' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Administrative, Physical, and Technical Safeguards' }
];

/**
 * CMMC LEVEL 1: Basic Safeguarding (15 Requirements)
 * Derived from 48 CFR 52.204-21
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
    discussion: 'Wipe hard drives or shred papers before throwing them away.',
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
    discussion: 'Visitors shouldn\'t walk around alone in secure areas.',
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
    discussion: 'Separate public-facing systems (e.g., web servers) from internal networks using a DMZ.',
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
  },
  {
    id: 'SI.L1-3.14.4',
    framework: 'NIST-CMMC',
    family: 'SI',
    cmmcLevel: 1,
    title: 'Update Malicious Code Protection',
    description: 'Update malicious code protection mechanisms when new releases are available.',
    discussion: 'Keep AV signatures current.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Protection mechanisms are updated.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['SI-3'] },
    sprsWeight: 1
  },
  {
    id: 'SI.L1-3.14.5',
    framework: 'NIST-CMMC',
    family: 'SI',
    cmmcLevel: 1,
    title: 'System Scanning',
    description: 'Perform periodic scans of the information system and real-time scans of files from external sources as files are downloaded, opened, or executed.',
    discussion: 'Scan downloaded files immediately.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Periodic scans are performed.', status: 'pending', method: 'Test' },
      { id: 'b', description: 'Real-time scans of files are performed.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['SI-3'] },
    sprsWeight: 1
  }
];

/**
 * CMMC LEVEL 2: NIST 800-171 r2 (110 Requirements)
 * Standardized numbering: 3.x.x
 */
const CMMC_L2_CONTROLS: Requirement[] = [
  {
    id: '3.1.1',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 2,
    title: 'Access Control Policy',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).',
    discussion: 'Ensure only known people and machines get into the CUI environment.',
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
    discussion: 'Role-based access control (RBAC). No one gets "keys to everything" without reason.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Permitted transactions and functions are defined.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'System access is limited to permitted transactions and functions.', status: 'pending', method: 'Test' }
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
      { id: 'b', description: 'CUI flow is controlled per authorizations.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AC-4'] }
  },
  {
    id: '3.3.1',
    framework: 'NIST-CMMC',
    family: 'AU',
    cmmcLevel: 2,
    title: 'Audit Logging',
    description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.',
    discussion: 'Detailed logging of successful and failed logon events, file access, and config changes.',
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
    id: '3.4.1',
    framework: 'NIST-CMMC',
    family: 'CM',
    cmmcLevel: 2,
    title: 'Baseline Configuration',
    description: 'Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.',
    discussion: 'A "Golden Image" or documented standard build for all workstations.',
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
    id: '3.5.3',
    framework: 'NIST-CMMC',
    family: 'IA',
    cmmcLevel: 2,
    title: 'Multi-Factor Authentication',
    description: 'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.',
    discussion: 'MFA requires knowledge, possession, and/or inherence. Vital for CUI protection.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'MFA is used for network access to privileged accounts.', status: 'pending', method: 'Test' },
      { id: 'b', description: 'MFA is used for network access to non-privileged accounts.', status: 'pending', method: 'Test' },
      { id: 'c', description: 'MFA is used for local access to privileged accounts.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['IA-2'] }
  },
  {
    id: '3.12.1',
    framework: 'NIST-CMMC',
    family: 'CA',
    cmmcLevel: 2,
    title: 'Security Assessment',
    description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.',
    discussion: 'Regular internal audits of your CMMC program.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Security controls are identified for assessment.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Assessment plan is developed.', status: 'pending', method: 'Examine' },
      { id: 'c', description: 'Security assessments are conducted periodically.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['CA-2'] }
  },
  {
    id: '3.13.11',
    framework: 'NIST-CMMC',
    family: 'SC',
    cmmcLevel: 2,
    title: 'CUI Cryptography',
    description: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.',
    discussion: 'Ensure Bitlocker or HTTPS uses FIPS 140-2/3 validated modules.',
    level: 'Level 2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'FIPS-validated cryptography is identified for use.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'FIPS-validated cryptography is employed to protect CUI.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['SC-13'] }
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
    discussion: 'Restricts non-organizational information resources which present significant risks.',
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
