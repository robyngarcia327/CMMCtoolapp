
import { Requirement, Framework, ClientData } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST800-171', name: 'NIST SP 800-171 r2', description: 'Protecting CUI in Nonfederal Systems' },
  { id: 'CMMC-L2', name: 'CMMC 2.0 Level 2', description: 'Advanced Cyber Hygiene (Aligned with NIST 800-171)' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria 2017' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Administrative, Physical, and Technical Safeguards' }
];

// --- OFFICIAL NIST 800-171 R2 DATA ---
const NIST_171_CONTROLS: Requirement[] = [
  // ACCESS CONTROL (AC)
  {
    id: '3.1.1',
    framework: 'NIST800-171',
    family: 'AC',
    title: 'Authorized Access Control',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).',
    discussion: 'Access control policies (e.g., identity-based, role-based) and mechanisms control access between users and objects.',
    level: '2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending' },
      { id: 'b', description: 'Processes acting on behalf of authorized users are identified.', status: 'pending' },
      { id: 'c', description: 'Devices (including other systems) are identified.', status: 'pending' },
      { id: 'd', description: 'System access is limited to authorized users.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2', 'AC-3'] }
  },
  {
    id: '3.1.2',
    framework: 'NIST800-171',
    family: 'AC',
    title: 'Transaction & Function Control',
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'Restricts the actions users can perform once logged into the system.',
    level: '2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Types of transactions that authorized users are permitted to execute are defined.', status: 'pending' },
      { id: 'b', description: 'Functions that authorized users are permitted to execute are defined.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-17'] }
  },
  // AWARENESS AND TRAINING (AT) - Fixing the empty view from user screenshot
  {
    id: '3.2.1',
    framework: 'NIST800-171',
    family: 'AT',
    title: 'Security Awareness Training',
    description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures related to the security of those systems.',
    discussion: 'Training typically includes recognizing social engineering, phishing, and proper handling of CUI.',
    level: '2',
    sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Managers are made aware of security risks.', status: 'pending' },
      { id: 'b', description: 'System administrators are made aware of security risks.', status: 'pending' },
      { id: 'c', description: 'Users are made aware of security risks.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AT-2'] }
  },
  {
    id: '3.2.2',
    framework: 'NIST800-171',
    family: 'AT',
    title: 'Role-Based Security Training',
    description: 'Ensure that personnel are adequately trained to carry out their assigned information security-related duties and responsibilities.',
    discussion: 'Provides specialized training for individuals with significant security roles (e.g., ISSOs, Admins).',
    level: '2',
    sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Assigned info security duties/responsibilities are identified.', status: 'pending' },
      { id: 'b', description: 'Personnel are adequately trained for assigned duties.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AT-3'] }
  },
  // AUDIT AND ACCOUNTABILITY (AU)
  {
    id: '3.3.1',
    framework: 'NIST800-171',
    family: 'AU',
    title: 'Audit Record Creation',
    description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.',
    discussion: 'Logging is critical for incident response and forensic analysis.',
    level: '2',
    sprsWeight: 3,
    objectives: [
      { id: 'a', description: 'Audit logs/records are created.', status: 'pending' },
      { id: 'b', description: 'Logs are retained.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AU-2'] }
  },
  // IDENTIFICATION AND AUTHENTICATION (IA)
  {
    id: '3.5.3',
    framework: 'NIST800-171',
    family: 'IA',
    title: 'Multi-Factor Authentication',
    description: 'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.',
    discussion: 'MFA requires at least two factors (knowledge, possession, or inherence).',
    level: '2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'MFA is implemented for local access to privileged accounts.', status: 'pending' },
      { id: 'b', description: 'MFA is implemented for network access to privileged accounts.', status: 'pending' },
      { id: 'c', description: 'MFA is implemented for network access to non-privileged accounts.', status: 'pending' }
    ],
    mappings: { nist800_53: ['IA-2(1)', 'IA-2(2)'] }
  },
  // SYSTEM AND COMMUNICATIONS PROTECTION (SC)
  {
      id: '3.13.1',
      framework: 'NIST800-171',
      family: 'SC',
      title: 'Boundary Protection',
      description: 'Monitor, control, and protect organizational communications at the external and key internal boundaries.',
      discussion: 'Boundary protection is typically achieved via firewalls, proxies, and gateways.',
      level: '2',
      sprsWeight: 5,
      objectives: [
          { id: 'a', description: 'External boundaries are identified.', status: 'pending' },
          { id: 'b', description: 'Key internal boundaries are identified.', status: 'pending' }
      ],
      mappings: { nist800_53: ['SC-7'] }
  }
];

// --- OFFICIAL SOC 2 TRUST SERVICES CRITERIA (2017) ---
const SOC2_CONTROLS: Requirement[] = [
  {
    id: 'CC1.1',
    framework: 'SOC2',
    family: 'Control Environment',
    title: 'Integrity and Ethical Values',
    description: 'The entity demonstrates a commitment to integrity and ethical values.',
    discussion: 'Tone at the top, standards of conduct, and addressing deviations.',
    level: 'Common Criteria',
    objectives: [
        { id: 'a', description: 'Standards of conduct are established.', status: 'pending' },
        { id: 'b', description: 'Compliance with standards is evaluated.', status: 'pending' }
    ],
    mappings: { iso27001: ['A.5.1'] }
  },
  {
    id: 'CC6.1',
    framework: 'SOC2',
    family: 'Logical & Physical Access',
    title: 'Logical Access Security',
    description: 'The entity implements logical access security software, infrastructure, and architectures over relevant information assets.',
    discussion: 'Restricting access to only authorized individuals.',
    level: 'Common Criteria',
    objectives: [
        { id: 'a', description: 'Access points are managed.', status: 'pending' },
        { id: 'b', description: 'Segregation of duties is enforced.', status: 'pending' }
    ],
    mappings: { nist_csf: ['PR.AC-1'] }
  }
];

// --- OFFICIAL HIPAA SECURITY RULE SAFEGUARDS ---
const HIPAA_CONTROLS: Requirement[] = [
  {
    id: '164.308(a)(1)(i)',
    framework: 'HIPAA',
    family: 'Administrative',
    title: 'Security Management Process',
    description: 'Implement policies and procedures to prevent, detect, contain, and correct security violations.',
    discussion: 'Requires Risk Analysis and Risk Management as core components.',
    level: 'Required',
    objectives: [
        { id: 'a', description: 'Risk Analysis (R) conducted.', status: 'pending' },
        { id: 'b', description: 'Risk Management (R) implemented.', status: 'pending' }
    ],
    mappings: {}
  },
  {
    id: '164.312(a)(1)',
    framework: 'HIPAA',
    family: 'Technical',
    title: 'Access Control',
    description: 'Implement technical policies and procedures for electronic information systems that maintain ePHI to allow access only to those persons or software programs that have been granted access rights.',
    discussion: 'Includes Unique User ID, Emergency Access, and Encryption.',
    level: 'Required',
    objectives: [
        { id: 'a', description: 'Unique user identification (R).', status: 'pending' },
        { id: 'b', description: 'Emergency access procedures (R).', status: 'pending' },
        { id: 'c', description: 'Automatic logoff (A).', status: 'pending' }
    ],
    mappings: {}
  },
  {
      id: '164.312(e)(1)',
      framework: 'HIPAA',
      family: 'Technical',
      title: 'Transmission Security',
      description: 'Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network.',
      discussion: 'Focuses on integrity controls and encryption during transit.',
      level: 'Addressable',
      objectives: [
          { id: 'a', description: 'Integrity controls (A).', status: 'pending' },
          { id: 'b', description: 'Encryption (A).', status: 'pending' }
      ],
      mappings: {}
  }
];

export const REQUIREMENTS_DATA: Requirement[] = [
    ...NIST_171_CONTROLS,
    // CMMC L2 mirrors NIST 800-171 1:1
    ...NIST_171_CONTROLS.map(r => ({ 
        ...r, 
        framework: 'CMMC-L2', 
        id: r.id.replace('3.', `${r.family}.L2-3.`) 
    })),
    ...SOC2_CONTROLS,
    ...HIPAA_CONTROLS
];

export const NIST_FAMILIES = [
    { id: 'AC', name: 'Access Control', count: 22 },
    { id: 'AT', name: 'Awareness and Training', count: 3 },
    { id: 'AU', name: 'Audit and Accountability', count: 9 },
    { id: 'CM', name: 'Configuration Management', count: 9 },
    { id: 'IA', name: 'Identification and Authentication', count: 11 },
    { id: 'IR', name: 'Incident Response', count: 3 },
    { id: 'MA', name: 'Maintenance', count: 6 },
    { id: 'MP', name: 'Media Protection', count: 9 },
    { id: 'PS', name: 'Personnel Security', count: 2 },
    { id: 'PE', name: 'Physical Protection', count: 6 },
    { id: 'RA', name: 'Risk Assessment', count: 3 },
    { id: 'CA', name: 'Security Assessment', count: 4 },
    { id: 'SC', name: 'System and Communications Protection', count: 16 },
    { id: 'SI', name: 'System and Information Integrity', count: 7 }
];

export const TRAINING_MODULES = [
    {
        id: 'MOD-AT-01',
        familyId: 'AT',
        title: 'Foundational Security Awareness',
        description: 'Standard security training for all personnel.',
        durationMinutes: 15,
        difficulty: 'Beginner',
        content: '# Security Awareness\n\nRecognize and report phishing, handle CUI properly...'
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
        versions: [],
        wizardProgress: { currentStep: 'INTRO', currentQuestionIndex: 0 },
        cwConfig: { siteUrl: '', companyId: '', publicKey: '', privateKey: '', serviceBoard: 'Compliance Remediation', enabled: true },
        jiraConfig: { baseUrl: '', email: '', apiToken: '', projectKey: '', issueType: 'Task', enabled: false },
        confluenceConfig: { baseUrl: '', email: '', apiToken: '', spaceKey: '', enabled: false },
        auvikConfig: { apiKey: '', tenantId: '', region: 'US', enabled: false },
        m365Config: { enabled: false },
        awsConfig: { enabled: false },
        googleConfig: { enabled: false },
        siemConfig: { enabled: false }
    };
};
