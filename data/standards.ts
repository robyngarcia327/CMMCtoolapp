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
      interviewOptions: [
        "Who is allowed to access systems that store, process, or transmit CUI?",
        "How are users approved before being given access?",
        "Who approves access requests?",
        "How is access removed when someone leaves or changes roles?"
      ]
    },
    { id: '3.1.2', framework: 'NIST-CMMC', family: 'AC', title: 'Transaction & Function Control', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', cmmcLevel: 1, sprsWeight: 1,
      objectives: [
        { id: 'a', description: 'permitted transactions and functions are defined; and', status: 'pending' },
        { id: 'b', description: 'system access is limited to the defined transactions.', status: 'pending' }
      ],
      mappings: { nist800_53: ['AC-3'] },
      interviewOptions: [
        "What actions can a normal user perform on CUI systems?",
        "Are there actions that only administrators can perform?",
        "How do you prevent users from performing unauthorized actions?"
      ]
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
      interviewOptions: [
        "How is CUI allowed to move between systems?",
        "Are there restrictions on emailing, downloading, or sharing CUI?",
        "Can CUI be sent to external email addresses? If yes, how is it protected?",
        "What tools enforce these restrictions?"
      ]
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

    // --- CONFIGURATION MANAGEMENT (CM) ---
    { id: '3.4.1e', framework: 'NIST-CMMC', family: 'CM', title: 'Authoritative Repository', description: 'Requires a trusted, authoritative source for system configurations.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'An authoritative repository for system configurations is established; and', status: 'pending' },
        { id: 'b', description: 'The repository is maintained and protected from unauthorized access.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-2'] },
      interviewOptions: [
        "Where is the authoritative 'Golden Image' or configuration repository stored?",
        "How do you ensure that only authorized changes can be made to this configuration source?"
      ]
    },
    { id: '3.4.2e', framework: 'NIST-CMMC', family: 'CM', title: 'Automated Detection & Remediation', description: 'Requires automated mechanisms to detect and correct configuration drift.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Automated mechanisms to detect configuration drift are implemented; and', status: 'pending' },
        { id: 'b', description: 'Automated mechanisms to remediate unauthorized changes are implemented.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-3'] },
      interviewOptions: [
        "What tools do you use to automatically detect when a system's configuration drifts from the baseline?",
        "Does your system automatically revert unauthorized configuration changes (Self-Healing)?"
      ]
    },
    { id: '3.4.3e', framework: 'NIST-CMMC', family: 'CM', title: 'Automated Inventory', description: 'Requires automated, continuously maintained system inventories.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Automated system inventory discovery is implemented; and', status: 'pending' },
        { id: 'b', description: 'The inventory is updated in near real-time.', status: 'pending' }
      ],
      mappings: { nist800_53: ['CM-8'] },
      interviewOptions: [
        "How is your asset inventory updated automatically without manual data entry?",
        "What is the frequency of your automated network discovery scans?"
      ]
    },

    // --- IDENTIFICATION AND AUTHENTICATION (IA) ---
    { id: '3.5.1e', framework: 'NIST-CMMC', family: 'IA', title: 'Bidirectional Authentication', description: 'Requires mutual authentication (not just user → system).', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Mutual authentication is required for network connections; and', status: 'pending' },
        { id: 'b', description: 'Cryptographic mechanisms support bidirectional authentication.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-2'] },
      interviewOptions: [
        "How do your systems verify the identity of the server they are connecting to before sending credentials?",
        "Do you use mTLS or similar protocols for internal service-to-service communication?"
      ]
    },
    { id: '3.5.3e', framework: 'NIST-CMMC', family: 'IA', title: 'Block Untrusted Assets', description: 'Requires systems to actively block authentication attempts from untrusted or unknown assets.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'Untrusted assets are identified via device fingerprinting or certificates; and', status: 'pending' },
        { id: 'b', description: 'Authentication attempts from untrusted assets are automatically blocked.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IA-3'] },
      interviewOptions: [
        "How does your identity system handle authentication requests from devices that aren't in your managed inventory?",
        "Are non-managed (BYOD) devices strictly blocked from authenticating to CUI repositories?"
      ]
    },

    // --- INCIDENT RESPONSE (IR) ---
    { id: '3.6.1e', framework: 'NIST-CMMC', family: 'IR', title: 'Security Operations Center (SOC)', description: 'Requires centralized, continuous security monitoring capability.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'A 24/7 security operations center (SOC) capability is established; or', status: 'pending' },
        { id: 'b', description: 'Continuous security monitoring is performed via automated orchestration.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-4'] },
      interviewOptions: [
        "Do you have a dedicated internal or managed SOC providing 24/7 coverage?",
        "How is security monitoring data centralized for correlated analysis?"
      ]
    },
    { id: '3.6.2e', framework: 'NIST-CMMC', family: 'IR', title: 'Cyber Incident Response Team (CIRT)', description: 'Requires a formally defined and operational cyber response team.', cmmcLevel: 3, sprsWeight: 5,
      objectives: [
        { id: 'a', description: 'A formal Cyber Incident Response Team (CIRT) is designated; and', status: 'pending' },
        { id: 'b', description: 'CIRT roles and responsibilities are documented and operational.', status: 'pending' }
      ],
      mappings: { nist800_53: ['IR-7'] },
      interviewOptions: [
        "Who are the designated members of your CIRT?",
        "How often does the CIRT meet to review response procedures or lessons learned?"
      ]
    },

    // --- PERSONNEL SECURITY (PS) ---
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

    // --- RISK ASSESSMENT (RA) ---
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
        objectives: [],
        mappings: { nist800_53: ['RA-3'] },
        interviewOptions: ["How does your risk register specifically address Advanced Persistent Threat (APT) scenarios?"]
    },
    { id: '3.11.4e', framework: 'NIST-CMMC', family: 'RA', title: 'Security Solution Rationale', description: 'Provide technical rationale for selected security solutions.', cmmcLevel: 3, sprsWeight: 5,
        objectives: [],
        mappings: { nist800_53: ['RA-3'] },
        interviewOptions: ["What is the engineering rationale for the specific SIEM or EDR solution you chose to defend against APTs?"]
    },
    { id: '3.11.5e', framework: 'NIST-CMMC', family: 'RA', title: 'Security Solution Effectiveness', description: 'Test effectiveness of selected solutions.', cmmcLevel: 3, sprsWeight: 5,
        objectives: [],
        mappings: { nist800_53: ['RA-5'] },
        interviewOptions: ["How do you quantitatively verify that your security tools are actually stopping adversarial movement?"]
    },
    { id: '3.11.6e', framework: 'NIST-CMMC', family: 'RA', title: 'Supply Chain Risk Response', description: 'Respond to supply chain risks.', cmmcLevel: 3, sprsWeight: 5,
        objectives: [],
        mappings: { nist800_53: ['SR-2'] },
        interviewOptions: ["What is your protocol if a critical hardware or software vendor reports a significant breach?"]
    },
    { id: '3.11.7e', framework: 'NIST-CMMC', family: 'RA', title: 'Supply Chain Risk Plan', description: 'Establish a supply chain risk plan.', cmmcLevel: 3, sprsWeight: 5,
        objectives: [],
        mappings: { nist800_53: ['SR-2'] },
        interviewOptions: ["Do you have a formal Supply Chain Risk Management (SCRM) plan?"]
    },

    // --- SECURITY ASSESSMENT (CA) ---
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
  policies: [],
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