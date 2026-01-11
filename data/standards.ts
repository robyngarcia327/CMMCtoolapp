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

export const SOC2_FAMILIES = [
  { id: 'CC', name: 'Common Criteria' },
  { id: 'A', name: 'Availability' },
  { id: 'C', name: 'Confidentiality' },
  { id: 'PI', name: 'Processing Integrity' },
  { id: 'P', name: 'Privacy' }
];

export const HIPAA_FAMILIES = [
  { id: 'ADMIN', name: 'Administrative Safeguards' },
  { id: 'PHYS', name: 'Physical Safeguards' },
  { id: 'TECH', name: 'Technical Safeguards' }
];

export const ACADEMY_PHASES = [
  { id: 'PH1', name: 'The Foundation', icon: 'BookOpen' },
  { id: 'PH2', name: 'Scoping & Strategy', icon: 'Target' },
  { id: 'PH3', name: 'The 14 Domains (Technical)', icon: 'Shield' },
  { id: 'PH4', name: 'Documentation & Narrative', icon: 'FileText' },
  { id: 'PH5', name: 'Assessment Readiness (CAP)', icon: 'Award' },
  { id: 'PH6', name: 'Tabletop Simulations (TTX)', icon: 'Dices' }
];

const createObjs = (ids: string[]) => ids.map(id => ({ id, description: `Verify assessment objective [${id}] for this control requirement.`, status: 'pending' as const }));

const NIST_800_171_CONTROLS: Requirement[] = [
  // 3.1 ACCESS CONTROL
  { 
    id: '3.1.1', framework: 'NIST-CMMC', family: 'AC', title: 'Limit system access to authorized users', 
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, or devices (including other systems).', 
    sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a', 'b', 'c', 'd', 'e', 'f']),
    mappings: { nist800_53: ['AC-2'] } 
  },
  { 
    id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Limit access to transactions and functions', 
    description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', 
    sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a', 'b']),
    mappings: { nist800_53: ['AC-6'] } 
  },
  { 
    id: '3.1.3', framework: 'NIST-CMMC', family: 'AC', title: 'Control the flow of CUI', 
    description: 'Control the flow of CUI in accordance with approved authorizations.', 
    sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a', 'b']),
    mappings: { nist800_53: ['AC-4'] } 
  },
  { 
    id: '3.1.8', framework: 'NIST-CMMC', family: 'AC', title: 'Limit unsuccessful logon attempts', 
    description: 'Limit unsuccessful logon attempts.', 
    sprsWeight: 1, cmmcLevel: 2, objectives: createObjs(['a', 'b', 'c']),
    mappings: { nist800_53: ['AC-7'] } 
  },

  // 3.3 AUDIT AND ACCOUNTABILITY
  { 
    id: '3.3.1', framework: 'NIST-CMMC', family: 'AU', title: 'Create and retain audit logs', 
    description: 'Create and retain system audit logs and records to enable monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.', 
    sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a', 'b', 'c']),
    mappings: { nist800_53: ['AU-2'] } 
  },
  { 
    id: '3.3.2', framework: 'NIST-CMMC', family: 'AU', title: 'Audit individual user actions', 
    description: 'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.', 
    sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']),
    mappings: { nist800_53: ['AU-3'] } 
  },

  // 3.5 IDENTIFICATION AND AUTHENTICATION
  { 
    id: '3.5.1', framework: 'NIST-CMMC', family: 'IA', title: 'Identify system users/devices', 
    description: 'Identify system users, processes acting on behalf of users, or devices.', 
    sprsWeight: 1, cmmcLevel: 1, objectives: createObjs(['a', 'b']),
    mappings: { nist800_53: ['IA-2'] } 
  },
  { 
    id: '3.5.3', framework: 'NIST-CMMC', family: 'IA', title: 'Multi-Factor Authentication (MFA)', 
    description: 'Use multi-factor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.', 
    sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a', 'b', 'c', 'd']),
    mappings: { nist800_53: ['IA-2(1)', 'IA-2(2)'] } 
  },

  // 3.11 RISK ASSESSMENT
  { 
    id: '3.11.1', framework: 'NIST-CMMC', family: 'RA', title: 'Periodically assess risk', 
    description: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.', 
    sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a', 'b', 'c', 'd', 'e']),
    mappings: { nist800_53: ['RA-3'] } 
  },

  // 3.12 SECURITY ASSESSMENT
  { 
    id: '3.12.1', framework: 'NIST-CMMC', family: 'CA', title: 'Periodically assess security controls', 
    description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.', 
    sprsWeight: 5, cmmcLevel: 2, objectives: createObjs(['a', 'b']),
    mappings: { nist800_53: ['CA-2'] } 
  },
  { 
    id: '3.12.4', framework: 'NIST-CMMC', family: 'CA', title: 'Update system security plans', 
    description: 'Update system security plans on an ongoing basis.', 
    sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a']),
    mappings: { nist800_53: ['PL-2'] } 
  },

  // 3.14 SYSTEM AND INFORMATION INTEGRITY
  { 
    id: '3.14.1', framework: 'NIST-CMMC', family: 'SI', title: 'Identify and correct system flaws', 
    description: 'Identify, report, and correct system flaws in a timely manner.', 
    sprsWeight: 5, cmmcLevel: 1, objectives: createObjs(['a', 'b', 'c']),
    mappings: { nist800_53: ['SI-2'] } 
  },
  { 
    id: '3.14.3', framework: 'NIST-CMMC', family: 'SI', title: 'Monitor for indicators of attack', 
    description: 'Monitor system security alerts and advisories and take appropriate actions in response.', 
    sprsWeight: 3, cmmcLevel: 2, objectives: createObjs(['a', 'b']),
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
    id: 'fnd-1', familyId: 'PH1', title: 'CMMC v2.0 Architecture',
    description: 'Understand the transition from v1.0 to v2.0 and the 3-tier model.',
    content: `
# Module 1: The CMMC 2.0 Ecosystem
...
    `,
    durationMinutes: 20, difficulty: 'Beginner'
  },

  {
    id: 'ttx-1', 
    familyId: 'PH6', 
    title: 'Sim: The 72-Hour Clock (Breach Reporting)',
    description: 'Executive Exercise: A ransomware attack is detected. Test your DC3/DIBNet reporting response.',
    isSimulation: true,
    executiveFocus: 'Incident Response & Regulatory Compliance',
    injects: [
        {
            id: 'inj-1',
            title: 'Initial Discovery',
            scenario: 'At 02:00 AM on a Saturday, your Lead Admin detects a large data exfiltration event from the CUI file server. A ransom note is dropped 10 minutes later.',
            question: 'Who is the first person in leadership to be notified according to your IRP, and what "Clock" starts now?',
            regulatoryHint: 'DFARS 252.204-7012 mandates reporting within 72 hours of discovery.'
        },
        {
            id: 'inj-2',
            title: 'Evidence Preservation',
            scenario: 'The IT team wants to wipe the infected server and restore from backups immediately to get the business back online.',
            question: 'Do you allow the restore immediately? What are your obligations regarding the preservation of "Medium Assurance" evidence?',
            regulatoryHint: 'NIST 800-171 3.12.3 requires protecting system logs and preserving images for DoD analysis.'
        },
        {
            id: 'inj-3',
            title: 'Federal Reporting',
            scenario: 'Leadership decides a report must be filed with the DoD Cyber Crime Center (DC3).',
            question: 'Does your organization have a "Medium Assurance Certificate"? Who is authorized to log into the DIBNet portal?',
            regulatoryHint: 'Failure to have a valid certificate often delays reporting beyond the 72-hour window.'
        }
    ],
    content: `
# Executive Tabletop Exercise: Breach Reporting
This is an interactive simulation. You will be guided through three "Injects" where you must document your organization's decisions. 
Upon completion, a **Record of Training** will be generated for your CMMC Assessment Evidence Folder.
    `,
    durationMinutes: 45, difficulty: 'Advanced'
  },
  {
    id: 'ttx-2', 
    familyId: 'PH6', 
    title: 'Sim: The ITAR Spill',
    description: 'Leadership Exercise: Managing an unauthorized CUI disclosure on an unmanaged personal device.',
    isSimulation: true,
    executiveFocus: 'CUI Governance & Personnel Security',
    injects: [
        {
            id: 'inj-1',
            title: 'The Mistake',
            scenario: 'A project manager accidentally BCC\'d their personal Gmail account with ITAR-controlled technical drawings for "Project Blue-Beam".',
            question: 'Is this a "Cyber Incident" or a "Security Spill"? What is the immediate technical containment action?',
            regulatoryHint: 'Unauthorized disclosure to a non-FedRAMP cloud provider (Gmail) is a reportable event.'
        },
        {
            id: 'inj-2',
            title: 'Personnel Security',
            scenario: 'The employee is a high performer but has a history of bypassing security for convenience.',
            question: 'How does your Personnel Security (PS) policy handle "Non-Malicious Gaps"? What proof do we show an auditor that we corrected the behavior?',
            regulatoryHint: 'CMMC PS.L2-3.9.2 requires ensuring that CUI is only accessible to authorized persons.'
        }
    ],
    content: `
# Executive Tabletop Exercise: CUI Governance
This simulation tests your "Culture of Security" and ability to remediate spills without compromising the CMMC assessment boundary.
    `,
    durationMinutes: 30, difficulty: 'Intermediate'
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