

import { Requirement, Framework, ClientData, TrainingModule } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST-CMMC', name: 'CMMC 2.0 / NIST 800-171', description: 'Comprehensive DoD Compliance Portfolio (Levels 1-3)' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria 2017' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Administrative, Physical, and Technical Safeguards' }
];

// --- CMMC LEVEL 1: Basic Safeguarding (FCI) ---
const CMMC_L1_CONTROLS: Requirement[] = [
  {
    id: 'AC.L1-b.1.i',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 1,
    title: 'Authorized Access Control',
    description: 'Limit information system access to authorized users, processes acting on behalf of authorized users, or devices.',
    discussion: 'Identify users, processes, and devices that are allowed to use company computers.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending', method: 'Interview' },
      { id: 'c', description: 'Devices are identified.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['AC-2'] }
  },
  {
    id: 'IA.L1-b.1.v',
    framework: 'NIST-CMMC',
    family: 'IA',
    cmmcLevel: 1,
    title: 'Identification',
    description: 'Identify information system users, processes acting on behalf of users, or devices.',
    discussion: 'Unique identifiers (e.g., user names) should be assigned to all users.',
    level: 'Level 1',
    objectives: [
      { id: 'a', description: 'System users are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending', method: 'Interview' }
    ],
    mappings: { nist800_53: ['IA-2'] }
  }
];

// --- CMMC LEVEL 2: NIST 800-171 r2 (CUI) ---
const CMMC_L2_CONTROLS: Requirement[] = [
  {
    id: '3.1.1',
    framework: 'NIST-CMMC',
    family: 'AC',
    cmmcLevel: 2,
    title: 'Access Control Policy',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).',
    discussion: 'Access control policies and mechanisms control access between users and objects.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending', method: 'Examine' }
    ],
    mappings: { nist800_53: ['AC-2', 'AC-3'] }
  },
  {
    id: '3.5.3',
    framework: 'NIST-CMMC',
    family: 'IA',
    cmmcLevel: 2,
    title: 'Multi-Factor Authentication',
    description: 'Use multifactor authentication for local and network access to privileged accounts.',
    discussion: 'MFA requires knowledge, possession, and/or inherence.',
    level: 'Level 2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'MFA for local privileged access.', status: 'pending', method: 'Test' },
      { id: 'b', description: 'MFA for network privileged access.', status: 'pending', method: 'Test' }
    ],
    mappings: { nist800_53: ['IA-2'] }
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
    mappings: {}
  },
  {
    id: 'RA.L3-3.11.1e',
    framework: 'NIST-CMMC',
    family: 'RA',
    cmmcLevel: 3,
    title: 'Threat-Informed Risk Assessment',
    description: 'Employ threat intelligence as part of a risk assessment to guide development of systems and security architectures.',
    discussion: 'Integration of threat intelligence into each step of the risk management process.',
    level: 'Level 3',
    objectives: [
      { id: 'a', description: 'Risk assessment methodology is identified.', status: 'pending', method: 'Examine' },
      { id: 'b', description: 'Threat intelligence guides system development.', status: 'pending', method: 'Interview' }
    ],
    mappings: {}
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

// Added to resolve import error in RequirementsList.tsx
export const SOC2_FAMILIES = [
  { id: 'CC1', name: 'Control Environment' },
  { id: 'CC2', name: 'Communication and Information' },
  { id: 'CC3', name: 'Risk Assessment' },
  { id: 'CC4', name: 'Monitoring Activities' },
  { id: 'CC5', name: 'Control Activities' }
];

// Added to resolve import error in RequirementsList.tsx
export const HIPAA_FAMILIES = [
  { id: 'Administrative', name: 'Administrative Safeguards' },
  { id: 'Physical', name: 'Physical Safeguards' },
  { id: 'Technical', name: 'Technical Safeguards' }
];

// Added to resolve import error in TrainingCenter.tsx
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
          systemOwner: '',
          authorizingOfficial: '',
          assignmentOfSecurityResponsibility: '',
          operationalStatus: 'Operational',
          systemType: 'Major Application' | 'General Support System',
          generalDescription: 'Primary business processing network.',
          systemEnvironment: 'Hybrid cloud environment (Azure/On-prem).',
          interconnections: '',
          lawsAndPolicies: 'FISMA, DFARS 252.204-7012, Privacy Act 1974'
        }
    };
};
