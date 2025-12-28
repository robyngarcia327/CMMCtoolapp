
import { Requirement, Framework, ClientData } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST-CMMC', name: 'NIST 800-171 / CMMC 2.0', description: 'Protecting CUI & CMMC Level 2 Compliance' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria 2017' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Administrative, Physical, and Technical Safeguards' }
];

// --- OFFICIAL NIST 800-171 R2 DATA (Shares same controls as CMMC L2) ---
const NIST_CMMC_CONTROLS: Requirement[] = [
  // ACCESS CONTROL (AC)
  {
    id: '3.1.1',
    framework: 'NIST-CMMC',
    family: 'AC',
    title: 'Authorized Access Control',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).',
    discussion: 'Access control policies and mechanisms control access between users and objects.',
    level: '2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending' },
      { id: 'c', description: 'Devices are identified.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-2', 'AC-3'] }
  },
  {
    id: '3.1.2',
    framework: 'NIST-CMMC',
    family: 'AC',
    title: 'Transaction & Function Control',
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'Restricts the actions users can perform once logged into the system.',
    level: '2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'Transactions are defined.', status: 'pending' },
      { id: 'b', description: 'Functions are defined.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-17'] }
  },
  {
    id: '3.1.3',
    framework: 'NIST-CMMC',
    family: 'AC',
    title: 'Control Flow',
    description: 'Control the flow of CUI in accordance with approved authorizations.',
    discussion: 'Ensures data does not traverse unauthorized boundaries.',
    level: '2',
    sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Data flow paths are identified.', status: 'pending' },
      { id: 'b', description: 'Authorizations are enforced.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AC-4'] }
  },
  // AWARENESS AND TRAINING (AT)
  {
    id: '3.2.1',
    framework: 'NIST-CMMC',
    family: 'AT',
    title: 'Security Awareness Training',
    description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities.',
    discussion: 'Training typically includes recognizing social engineering and phishing.',
    level: '2',
    sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Managers are trained.', status: 'pending' },
      { id: 'b', description: 'Users are trained.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AT-2'] }
  },
  {
    id: '3.2.2',
    framework: 'NIST-CMMC',
    family: 'AT',
    title: 'Role-Based Security Training',
    description: 'Ensure that personnel are adequately trained to carry out their assigned information security-related duties.',
    discussion: 'Provides specialized training for privileged accounts.',
    level: '2',
    sprsWeight: 1,
    objectives: [
      { id: 'a', description: 'Roles are identified.', status: 'pending' },
      { id: 'b', description: 'Training content matches roles.', status: 'pending' }
    ],
    mappings: { nist800_53: ['AT-3'] }
  },
  // AUDIT AND ACCOUNTABILITY (AU)
  {
    id: '3.3.1',
    framework: 'NIST-CMMC',
    family: 'AU',
    title: 'Audit Record Creation',
    description: 'Create and retain system audit logs and records to the extent needed to enable monitoring.',
    discussion: 'Logging is critical for incident response.',
    level: '2',
    sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Logs are generated.', status: 'pending' }],
    mappings: { nist800_53: ['AU-2'] }
  },
  {
    id: '3.3.2',
    framework: 'NIST-CMMC',
    family: 'AU',
    title: 'Audit Events',
    description: 'Ensure that the actions of individual system users can be uniquely traced to those users.',
    discussion: 'Accountability requires unique user IDs in logs.',
    level: '2',
    sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Individual users are traced.', status: 'pending' }],
    mappings: { nist800_53: ['AU-3'] }
  },
  // CONFIGURATION MANAGEMENT (CM)
  {
    id: '3.4.1',
    framework: 'NIST-CMMC',
    family: 'CM',
    title: 'Baseline Configurations',
    description: 'Establish and maintain baseline configurations and inventories of organizational systems.',
    discussion: 'Includes hardware and software manifests.',
    level: '2',
    sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Baselines are established.', status: 'pending' }],
    mappings: { nist800_53: ['CM-2'] }
  },
  // IDENTIFICATION AND AUTHENTICATION (IA)
  {
    id: '3.5.3',
    framework: 'NIST-CMMC',
    family: 'IA',
    title: 'Multi-Factor Authentication',
    description: 'Use multifactor authentication for local and network access to privileged accounts.',
    discussion: 'MFA requires knowledge, possession, and/or inherence.',
    level: '2',
    sprsWeight: 5,
    objectives: [
      { id: 'a', description: 'MFA for local privileged access.', status: 'pending' },
      { id: 'b', description: 'MFA for network privileged access.', status: 'pending' }
    ],
    mappings: { nist800_53: ['IA-2'] }
  },
  // INCIDENT RESPONSE (IR)
  {
    id: '3.6.1',
    framework: 'NIST-CMMC',
    family: 'IR',
    title: 'Incident Handling',
    description: 'Establish an operational incident-handling capability for organizational systems.',
    discussion: 'Includes detection, analysis, and containment.',
    level: '2',
    sprsWeight: 5,
    objectives: [{ id: 'a', description: 'IR capability established.', status: 'pending' }],
    mappings: { nist800_53: ['IR-4'] }
  },
  // MAINTENANCE (MA)
  {
    id: '3.7.1',
    framework: 'NIST-CMMC',
    family: 'MA',
    title: 'System Maintenance',
    description: 'Perform maintenance on organizational systems.',
    discussion: 'Ensures system reliability and patching.',
    level: '2',
    sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Maintenance is performed.', status: 'pending' }],
    mappings: { nist800_53: ['MA-2'] }
  },
  // MEDIA PROTECTION (MP)
  {
    id: '3.8.1',
    framework: 'NIST-CMMC',
    family: 'MP',
    title: 'Media Access',
    description: 'Protect (i.e., physically control and securely store) system media containing CUI.',
    discussion: 'Includes flash drives and external hard drives.',
    level: '2',
    sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Media is physically controlled.', status: 'pending' }],
    mappings: { nist800_53: ['MP-2'] }
  },
  // PERSONNEL SECURITY (PS)
  {
    id: '3.9.1',
    framework: 'NIST-CMMC',
    family: 'PS',
    title: 'Personnel Screening',
    description: 'Screen individuals prior to authorizing access to systems containing CUI.',
    discussion: 'Background checks or interviews.',
    level: '2',
    sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Individuals are screened.', status: 'pending' }],
    mappings: { nist800_53: ['PS-3'] }
  },
  // PHYSICAL PROTECTION (PE)
  {
    id: '3.10.1',
    framework: 'NIST-CMMC',
    family: 'PE',
    title: 'Physical Access Control',
    description: 'Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.',
    discussion: 'Locks, badges, and server room security.',
    level: '2',
    sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Physical access is limited.', status: 'pending' }],
    mappings: { nist800_53: ['PE-2'] }
  },
  // RISK ASSESSMENT (RA)
  {
    id: '3.11.1',
    framework: 'NIST-CMMC',
    family: 'RA',
    title: 'Risk Assessment',
    description: 'Periodically assess the risk to organizational operations resulting from the operation of systems.',
    discussion: 'Formal risk assessment process.',
    level: '2',
    sprsWeight: 3,
    objectives: [{ id: 'a', description: 'Risks are assessed.', status: 'pending' }],
    mappings: { nist800_53: ['RA-3'] }
  },
  // SECURITY ASSESSMENT (CA)
  {
    id: '3.12.1',
    framework: 'NIST-CMMC',
    family: 'CA',
    title: 'Security Control Assessment',
    description: 'Periodically assess the security controls in organizational systems.',
    discussion: 'Validating that controls work as intended.',
    level: '2',
    sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Assessments are performed.', status: 'pending' }],
    mappings: { nist800_53: ['CA-2'] }
  },
  // SYSTEM AND COMMUNICATIONS PROTECTION (SC)
  {
    id: '3.13.1',
    framework: 'NIST-CMMC',
    family: 'SC',
    title: 'Boundary Protection',
    description: 'Monitor, control, and protect organizational communications at the external and key internal boundaries.',
    discussion: 'Firewalls and proxies.',
    level: '2',
    sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Boundaries are identified.', status: 'pending' }],
    mappings: { nist800_53: ['SC-7'] }
  },
  // SYSTEM AND INFORMATION INTEGRITY (SI)
  {
    id: '3.14.1',
    framework: 'NIST-CMMC',
    family: 'SI',
    title: 'Flaw Remediation',
    description: 'Identify, report, and correct system flaws in a timely manner.',
    discussion: 'Patch management and vulnerability fixing.',
    level: '2',
    sprsWeight: 5,
    objectives: [{ id: 'a', description: 'Flaws are identified.', status: 'pending' }],
    mappings: { nist800_53: ['SI-2'] }
  }
];

// --- OFFICIAL SOC 2 TRUST SERVICES CRITERIA (2017) ---
const SOC2_CONTROLS: Requirement[] = [
  // CC1: Control Environment
  {
    id: 'CC1.1',
    framework: 'SOC2',
    family: 'CC1',
    title: 'Integrity and Ethical Values',
    description: 'The entity demonstrates a commitment to integrity and ethical values.',
    discussion: 'Requires established standards of conduct and a process to address deviations.',
    level: 'Common Criteria',
    objectives: [
      { id: 'a', description: 'Tone at the top is established through formal policies.', status: 'pending' },
      { id: 'b', description: 'Standards of conduct are communicated to all personnel.', status: 'pending' }
    ],
    mappings: { iso27001: ['A.5.1'] }
  },
  {
    id: 'CC1.2',
    framework: 'SOC2',
    family: 'CC1',
    title: 'Board Oversight',
    description: 'The board of directors demonstrates independence from management and exercises oversight of internal control.',
    discussion: 'Auditors look for board meeting minutes and evidence of security status reporting to leadership.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'Governance body reviews security posture quarterly.', status: 'pending' }],
    mappings: {}
  },
  // CC2: Communication and Information
  {
    id: 'CC2.1',
    framework: 'SOC2',
    family: 'CC2',
    title: 'Information for Internal Control',
    description: 'The entity obtains or generates and uses relevant, quality information to support the functioning of internal control.',
    discussion: 'Includes tracking system changes and data flow mapping.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'System inventories are accurate and updated.', status: 'pending' }],
    mappings: { cis_v8: ['1.1'] }
  },
  {
    id: 'CC2.2',
    framework: 'SOC2',
    family: 'CC2',
    title: 'Internal Communication',
    description: 'The entity internally communicates information, including objectives and responsibilities for internal control.',
    discussion: 'Whistleblower policies and security awareness messaging.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'Security roles are defined in job descriptions.', status: 'pending' }],
    mappings: {}
  },
  // CC3: Risk Assessment
  {
    id: 'CC3.1',
    framework: 'SOC2',
    family: 'CC3',
    title: 'Objective Specification',
    description: 'The entity specifies objectives with sufficient clarity to enable the identification and assessment of risks.',
    discussion: 'Operational, reporting, and compliance objectives must be defined.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'Annual risk assessment is performed.', status: 'pending' }],
    mappings: { nist_csf: ['ID.RA-1'] }
  },
  {
    id: 'CC3.2',
    framework: 'SOC2',
    family: 'CC3',
    title: 'Risk Identification and Analysis',
    description: 'The entity identifies risks to the achievement of its objectives across the entity.',
    discussion: 'Requires a formal risk register and impact analysis.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'Threat landscape is reviewed for emerging risks.', status: 'pending' }],
    mappings: {}
  },
  // CC4: Monitoring Activities
  {
    id: 'CC4.1',
    framework: 'SOC2',
    family: 'CC4',
    title: 'Ongoing and Separate Evaluations',
    description: 'The entity selects, develops, and performs ongoing and/or separate evaluations to ascertain whether components of internal control are present.',
    discussion: 'Internal audits and self-assessments.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'Periodic control testing occurs throughout the year.', status: 'pending' }],
    mappings: {}
  },
  // CC5: Control Activities
  {
    id: 'CC5.1',
    framework: 'SOC2',
    family: 'CC5',
    title: 'Control Activity Selection',
    description: 'The entity selects and develops control activities that contribute to the mitigation of risks.',
    discussion: 'Requires linking specific controls to identified risks.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'Controls are mapped to Trust Services Criteria.', status: 'pending' }],
    mappings: {}
  },
  // CC6: Logical and Physical Access Controls
  {
    id: 'CC6.1',
    framework: 'SOC2',
    family: 'CC6',
    title: 'Logical Access Security',
    description: 'The entity implements logical access security over relevant information assets.',
    discussion: 'Restricting digital access to authorized staff through IAM.',
    level: 'Common Criteria',
    objectives: [
      { id: 'a', description: 'Access is granted based on Least Privilege.', status: 'pending' },
      { id: 'b', description: 'Terminated users are removed within 24 hours.', status: 'pending' }
    ],
    mappings: { nist_csf: ['PR.AC-1'] }
  },
  {
    id: 'CC6.2',
    framework: 'SOC2',
    family: 'CC6',
    title: 'User Credentials',
    description: 'The entity issues and maintains unique user credentials.',
    discussion: 'Requires complexity standards and MFA.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'Multi-factor authentication is required for all production access.', status: 'pending' }],
    mappings: {}
  },
  // CC7: System Operations
  {
    id: 'CC7.1',
    framework: 'SOC2',
    family: 'CC7',
    title: 'System Monitoring',
    description: 'The entity meets its objectives by monitoring the system and taking action when anomalies are detected.',
    discussion: 'Requires centralized logging (SIEM) and alerting.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'Anomalous activity triggers automated alerts.', status: 'pending' }],
    mappings: {}
  },
  {
    id: 'CC7.2',
    framework: 'SOC2',
    family: 'CC7',
    title: 'Vulnerability Management',
    description: 'The entity evaluates and remediates vulnerabilities in a timely manner.',
    discussion: 'Requires periodic external and internal scanning.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'Patch management policy is defined and followed.', status: 'pending' }],
    mappings: {}
  },
  // CC8: Change Management
  {
    id: 'CC8.1',
    framework: 'SOC2',
    family: 'CC8',
    title: 'System Changes',
    description: 'The entity authorizes, designs, develops, tests, and documents system changes.',
    discussion: 'Auditors look for PR (Pull Request) approvals and separation of duties between Dev and Ops.',
    level: 'Common Criteria',
    objectives: [
      { id: 'a', description: 'All code changes require secondary review.', status: 'pending' },
      { id: 'b', description: 'Rollback procedures are documented for major releases.', status: 'pending' }
    ],
    mappings: {}
  },
  // CC9: Risk Mitigation
  {
    id: 'CC9.1',
    framework: 'SOC2',
    family: 'CC9',
    title: 'Business Resilience',
    description: 'The entity specifies objectives to enable the identification and assessment of risks related to business resilience.',
    discussion: 'Disaster Recovery (DR) and Business Continuity (BC) plans.',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'DR plan is tested annually.', status: 'pending' }],
    mappings: {}
  },
  {
    id: 'CC9.2',
    framework: 'SOC2',
    family: 'CC9',
    title: 'Vendor Risk Management',
    description: 'The entity evaluates and monitors the risks associated with third-party service providers.',
    discussion: 'Includes reviewing SOC reports of vendors (e.g., AWS/GCP).',
    level: 'Common Criteria',
    objectives: [{ id: 'a', description: 'Critical vendors are reviewed for security compliance annually.', status: 'pending' }],
    mappings: {}
  }
];

// --- OFFICIAL HIPAA SECURITY RULE SAFEGUARDS ---
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
  },
  {
    id: '164.312(a)(1)',
    framework: 'HIPAA',
    family: 'Technical',
    title: 'Access Control',
    description: 'Limit access only to those persons or programs granted access rights.',
    discussion: 'Unique user IDs and encryption.',
    level: 'Required',
    objectives: [{ id: 'a', description: 'Unique IDs implemented.', status: 'pending' }],
    mappings: {}
  }
];

export const REQUIREMENTS_DATA: Requirement[] = [
    ...NIST_CMMC_CONTROLS,
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
    { id: 'SI', name: 'System and Information Integrity', count: 7 },
    // SOC 2 Families
    { id: 'CC1', name: 'Control Environment', count: 5 },
    { id: 'CC2', name: 'Communication and Information', count: 3 },
    { id: 'CC3', name: 'Risk Assessment', count: 4 },
    { id: 'CC4', name: 'Monitoring Activities', count: 2 },
    { id: 'CC5', name: 'Control Activities', count: 3 },
    { id: 'CC6', name: 'Logical and Physical Access', count: 8 },
    { id: 'CC7', name: 'System Operations', count: 5 },
    { id: 'CC8', name: 'Change Management', count: 1 },
    { id: 'CC9', name: 'Risk Mitigation', count: 2 }
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
