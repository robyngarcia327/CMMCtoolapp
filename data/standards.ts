




import { Requirement, Risk, Asset, User, Framework, Client, ClientData, ProjectTask } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST800-171', name: 'NIST 800-171 / CMMC', description: 'Protecting Controlled Unclassified Information (CUI).' },
  { id: 'ISO27001', name: 'ISO 27001:2022', description: 'International standard for Information Security Management.' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'AICPA Trust Services Criteria for Service Organizations.' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Protection of Electronic Protected Health Information (ePHI).' },
];

export const NIST_FAMILIES = [
  { id: 'AC', name: 'Access Control' },
  { id: 'AT', name: 'Awareness and Training' },
  { id: 'AU', name: 'Audit and Accountability' },
  { id: 'CM', name: 'Configuration Management' },
  { id: 'IA', name: 'Identification and Authentication' },
  { id: 'IR', name: 'Incident Response' },
  { id: 'MA', name: 'Maintenance' },
  { id: 'MP', name: 'Media Protection' },
  { id: 'PE', name: 'Physical Protection' },
  { id: 'PS', name: 'Personnel Security' },
  { id: 'RA', name: 'Risk Assessment' },
  { id: 'CA', name: 'Security Assessment' },
  { id: 'SC', name: 'System and Communications Protection' },
  { id: 'SI', name: 'System and Information Integrity' },
];

export const NIST_CSF_FUNCTIONS = [
    { id: 'GV', name: 'Govern', color: 'bg-slate-500', text: 'text-slate-700' },
    { id: 'ID', name: 'Identify', color: 'bg-blue-500', text: 'text-blue-700' },
    { id: 'PR', name: 'Protect', color: 'bg-purple-500', text: 'text-purple-700' },
    { id: 'DE', name: 'Detect', color: 'bg-orange-500', text: 'text-orange-700' },
    { id: 'RS', name: 'Respond', color: 'bg-red-500', text: 'text-red-700' },
    { id: 'RC', name: 'Recover', color: 'bg-green-500', text: 'text-green-700' },
];

export const REQUIREMENTS_DATA: Requirement[] = [
  // --- NIST 800-171 Data ---
  {
    id: '3.1.1',
    framework: 'NIST800-171',
    family: 'AC',
    title: 'Authorized Access Control',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).',
    discussion: 'Access control policies control access to systems and data. This requirement focuses on account management and ensuring only approved entities can login.',
    level: '1',
    sprsWeight: 5,
    interviewQuestion: 'How do you ensure only authorized employees can log in to your systems?',
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending' },
      { id: 'c', description: 'Devices (and other systems) are identified.', status: 'pending' },
      { id: 'd', description: 'System access is limited to authorized users.', status: 'pending' },
    ],
    mappings: {
      nist800_53: ['AC-2', 'AC-3'],
      iso27001: ['A.9.2.1'],
      nist_csf: ['PR.AC-1', 'PR.AC-4', 'PR.AC-6'],
      cis_v8: ['5.1', '6.1'],
    }
  },
  {
    id: '3.1.2',
    framework: 'NIST800-171',
    family: 'AC',
    title: 'Transaction & Function Control',
    description: 'Limit information system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'This is often referred to as "Role-Based Access Control" (RBAC). Users should only be able to do what their job requires.',
    level: '1',
    sprsWeight: 5,
    interviewQuestion: 'Describe how you restrict users to only the functions they need to do their job (Role-Based Access).',
    objectives: [
      { id: 'a', description: 'Types of transactions authorized users are permitted to execute are defined.', status: 'pending' },
      { id: 'b', description: 'Types of functions authorized users are permitted to execute are defined.', status: 'pending' },
      { id: 'c', description: 'System access is limited to permitted transactions/functions.', status: 'pending' },
    ],
    mappings: {
      nist800_53: ['AC-2(4)', 'AC-3', 'AC-17'],
      nist_csf: ['PR.AC-3', 'PR.AC-5'],
      cis_v8: ['5.3', '6.2'],
    }
  },
  {
    id: '3.1.3',
    framework: 'NIST800-171',
    family: 'AC',
    title: 'External Connections',
    description: 'Control the flow of CUI in accordance with approved authorizations.',
    discussion: 'Ensure that data flow between systems is mapped and authorized.',
    level: '2',
    sprsWeight: 5,
    interviewQuestion: 'How do you control and monitor connections to external systems (e.g., Cloud, Partners)?',
    objectives: [
      { id: 'a', description: 'Information flow control policies are defined.', status: 'pending' },
      { id: 'b', description: 'Methods for controlling data flow are implemented.', status: 'pending' },
    ],
    mappings: {
      nist800_53: ['AC-4'],
      nist_csf: ['PR.AC-3', 'PR.DS-5'],
      cis_v8: ['12.2'],
    }
  },
  {
    id: '3.2.1',
    framework: 'NIST800-171',
    family: 'AT',
    title: 'Role-Based Training',
    description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities.',
    discussion: 'Everyone needs to know the risks. Training should be relevant to their role.',
    level: '2',
    sprsWeight: 3,
    interviewQuestion: 'How often do you train employees on security risks, and is it specific to their role?',
    objectives: [
      { id: 'a', description: 'Security risks are identified for each role.', status: 'pending' },
      { id: 'b', description: 'Training material is updated regularly.', status: 'pending' },
    ],
    mappings: {
      nist800_53: ['AT-2', 'AT-3'],
      iso27001: ['A.7.2.2'],
      nist_csf: ['PR.AT-1', 'PR.AT-2'],
      cis_v8: ['14.1', '14.2'],
    }
  },
   {
    id: '3.3.1',
    framework: 'NIST800-171',
    family: 'AU',
    title: 'System Auditing',
    description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.',
    discussion: 'Logs are crucial for forensics. You must decide what to log based on risk.',
    level: '2',
    sprsWeight: 3,
    interviewQuestion: 'What systems are you logging, and how long do you keep the audit logs?',
    objectives: [
      { id: 'a', description: 'Audit events are defined.', status: 'pending' },
      { id: 'b', description: 'Logs are retained for a defined period.', status: 'pending' },
    ],
    mappings: {
      nist800_53: ['AU-2', 'AU-6'],
      iso27001: ['A.12.4.1'],
      nist_csf: ['DE.AE-3', 'PR.PT-1'],
      cis_v8: ['8.2', '8.10'],
    }
  },

  // --- ISO 27001 Mock Data ---
  {
      id: 'A.5.1',
      framework: 'ISO27001',
      family: 'Policies',
      title: 'Policies for Information Security',
      description: 'Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel.',
      discussion: 'Core governance requirement. You need written policies.',
      level: 'Mandatory',
      interviewQuestion: 'Do you have written information security policies that are approved by management and read by all staff?',
      objectives: [
          { id: 'a', description: 'Policies defined and approved.', status: 'pending' },
          { id: 'b', description: 'Policies communicated to employees.', status: 'pending' }
      ],
      mappings: {
          nist800_53: ['PM-1'],
          nist_csf: ['GV.PO-1']
      }
  },
  {
      id: 'A.8.2',
      framework: 'ISO27001',
      family: 'Asset Management',
      title: 'Information Classification',
      description: 'Information shall be classified in accordance with the information security needs of the organization based on confidentiality, integrity, availability, and relevant interested party requirements.',
      discussion: 'Label your data (e.g. Public, Internal, Confidential).',
      level: 'Mandatory',
      interviewQuestion: 'How do you classify and label your information (e.g., Confidential, Public)?',
      objectives: [
          { id: 'a', description: 'Classification scheme defined.', status: 'pending' },
          { id: 'b', description: 'Assets labeled according to scheme.', status: 'pending' }
      ],
      mappings: {
          nist800_53: ['RA-2'],
          nist_csf: ['ID.AM-5']
      }
  },

  // --- SOC 2 Mock Data ---
  {
      id: 'CC1.1',
      framework: 'SOC2',
      family: 'Control Environment',
      title: 'Ethical Values and Integrity',
      description: 'The entity demonstrates a commitment to integrity and ethical values.',
      discussion: 'This is usually satisfied by an Employee Handbook and Code of Conduct signed by all staff.',
      level: 'Common Criteria',
      interviewQuestion: 'Do you have a Code of Conduct that employees sign annually?',
      objectives: [
          { id: 'a', description: 'Code of conduct exists.', status: 'pending' },
          { id: 'b', description: 'Employees acknowledge code annually.', status: 'pending' }
      ],
      mappings: {
          nist_csf: ['GV.OC-2']
      }
  }
];

export const INITIAL_RISKS: Risk[] = [
    {
        id: 'R-001',
        description: 'Phishing attack leading to ransomware infection',
        category: 'External',
        assessmentType: 'Quantitative',
        threatEventFrequency: 12, // once a month
        vulnerability: 0.1, // 10% chance of user clicking
        lossMagnitude: 50000, // $50k cost per incident
        riskScore: 60000, // 12 * 0.1 * 50000 = $60k ALE
        remediation: 'Implement MFA, Email Filtering, and Monthly Phishing Sims.',
        owner: 'IT Director',
        status: 'Open',
        dateIdentified: Date.now() - 10000000
    },
    {
        id: 'R-002',
        description: 'Laptop theft containing unencrypted CUI',
        category: 'Physical',
        assessmentType: 'Qualitative',
        likelihood: 2,
        impact: 5,
        riskScore: 10,
        remediation: 'Full Disk Encryption (BitLocker) enforced via GPO.',
        owner: 'SysAdmin',
        status: 'Mitigated',
        dateIdentified: Date.now() - 20000000
    }
];

export const INITIAL_ASSETS: Asset[] = [
    {
        id: 'SRV-DC01',
        name: 'Domain Controller 01',
        type: 'Server',
        owner: 'IT Dept',
        location: 'HQ Server Room',
        inScopeCUI: true,
        criticality: 'High'
    },
    {
        id: 'LPT-USR-04',
        name: 'CEO Laptop',
        type: 'Workstation',
        owner: 'Jane Doe',
        location: 'Mobile',
        inScopeCUI: true,
        criticality: 'Medium'
    },
    {
        id: 'FW-EDGE-01',
        name: 'Edge Firewall',
        type: 'Network Device',
        owner: 'Network Team',
        location: 'HQ',
        inScopeCUI: true,
        criticality: 'High'
    }
];

// Mock Users with Organizations and Roles
export const INITIAL_USERS: User[] = [
    {
        id: 'u1',
        organizationId: 'client-msp',
        name: 'Alice MSP Admin',
        email: 'alice@msp.com',
        role: 'MSP_ADMIN',
        department: 'Management',
        lastLogin: Date.now(),
        mfaEnabled: true,
        hasPasskey: true // Supports TouchID/FaceID
    },
    {
        id: 'u2',
        organizationId: 'client-1',
        name: 'John Client Admin',
        email: 'john@acme.com',
        role: 'CLIENT_ADMIN',
        department: 'IT',
        lastLogin: Date.now() - 86400000,
        mfaEnabled: true,
        hasPasskey: false
    },
    {
        id: 'u3',
        organizationId: 'client-1',
        name: 'Bob Employee',
        email: 'bob@acme.com',
        role: 'CLIENT_USER',
        department: 'Sales',
        lastLogin: Date.now() - 120000,
        mfaEnabled: false, // Insecure user
        hasPasskey: false
    }
];

export const INITIAL_TASKS: ProjectTask[] = [
    {
        id: 'T-101',
        title: 'Deploy MFA for All Users',
        description: 'Roll out Duo Security to all workstations and cloud apps to satisfy AC-3.1.1.',
        status: 'in_progress',
        priority: 'High',
        assigneeId: 'u1',
        linkedRequirementId: '3.1.1',
        dueDate: Date.now() + 604800000 // +1 week
    },
    {
        id: 'T-102',
        title: 'Review System Logs',
        description: 'Weekly review of firewall and DC logs.',
        status: 'backlog',
        priority: 'Medium',
        assigneeId: 'u3',
        linkedRequirementId: '3.3.1'
    }
];

// --- MSP Data ---

export const INITIAL_CLIENTS: Client[] = [
    { 
      id: 'client-msp', 
      name: 'TechFlow Solutions (MSP)', 
      industry: 'Managed Services', 
      contactName: 'Alice Johnson', 
      logoInitial: 'T',
      primaryFramework: 'ISO 27001',
      nextAuditDate: Date.now() + 1000 * 60 * 60 * 24 * 15,
      accountManager: 'Self',
      isParent: true // PARENT ORGANIZATION
    },
    { 
      id: 'client-1', 
      name: 'Acme Defense Corp', 
      industry: 'Defense Base', 
      contactName: 'John Smith', 
      logoInitial: 'A',
      primaryFramework: 'CMMC L2',
      nextAuditDate: Date.now() + 1000 * 60 * 60 * 24 * 45,
      accountManager: 'Alice Johnson',
      isParent: false
    },
    { 
      id: 'client-2', 
      name: 'Global Health Systems', 
      industry: 'Healthcare', 
      contactName: 'Sarah Conner', 
      logoInitial: 'G',
      primaryFramework: 'HIPAA',
      nextAuditDate: Date.now() + 1000 * 60 * 60 * 24 * 180, 
      accountManager: 'Bob Builder',
      isParent: false
    },
];

export const createInitialClientData = (useMockData = false): ClientData => {
    // Deep copy requirements to ensure clean status for new client
    const cleanRequirements = JSON.parse(JSON.stringify(REQUIREMENTS_DATA));
    
    return {
        requirements: cleanRequirements,
        risks: useMockData ? [...INITIAL_RISKS] : [],
        assets: useMockData ? [...INITIAL_ASSETS] : [],
        users: useMockData ? [...INITIAL_USERS] : [],
        tasks: useMockData ? [...INITIAL_TASKS] : [],
        artifacts: [],
        tickets: [],
        versions: [],
        wizardProgress: {
            currentStep: 'INTRO',
            currentQuestionIndex: 0
        },
        cwConfig: {
            siteUrl: '',
            companyId: '',
            publicKey: '',
            privateKey: '',
            serviceBoard: 'Compliance Remediation',
            enabled: true
        },
        jiraConfig: {
            baseUrl: '',
            email: '',
            apiToken: '',
            projectKey: '',
            issueType: 'Task',
            enabled: false
        },
        confluenceConfig: {
            baseUrl: '',
            email: '',
            apiToken: '',
            spaceKey: '',
            enabled: false
        }
    };
};
