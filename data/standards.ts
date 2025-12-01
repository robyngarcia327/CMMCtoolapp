import { Requirement, Risk, Asset, User, Framework, Client, ClientData, ProjectTask, BudgetLineItem, TrainingModule } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST800-171', name: 'NIST SP 800-171 r2', description: 'Protecting CUI in Nonfederal Systems' },
  { id: 'CMMC-L2', name: 'CMMC 2.0 Level 2', description: 'Advanced Cyber Hygiene (Aligned with NIST 800-171)' },
  { id: 'ISO27001', name: 'ISO/IEC 27001:2022', description: 'Information Security Management' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria (Security, Availability, Confidentiality)' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Protection of Electronic Protected Health Information (ePHI)' }
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
  { id: 'PS', name: 'Personnel Security' },
  { id: 'PE', name: 'Physical Protection' },
  { id: 'RA', name: 'Risk Assessment' },
  { id: 'CA', name: 'Security Assessment' },
  { id: 'SC', name: 'System and Communications Protection' },
  { id: 'SI', name: 'System and Information Integrity' }
];

export const NIST_CSF_FUNCTIONS = [
    { id: 'GV', name: 'Govern', color: 'bg-blue-500', text: 'text-blue-600' },
    { id: 'ID', name: 'Identify', color: 'bg-indigo-500', text: 'text-indigo-600' },
    { id: 'PR', name: 'Protect', color: 'bg-purple-500', text: 'text-purple-600' },
    { id: 'DE', name: 'Detect', color: 'bg-yellow-500', text: 'text-yellow-600' },
    { id: 'RS', name: 'Respond', color: 'bg-red-500', text: 'text-red-600' },
    { id: 'RC', name: 'Recover', color: 'bg-green-500', text: 'text-green-600' }
];

export const TRAINING_MODULES: TrainingModule[] = [
    {
        id: 'MOD-AC-01',
        familyId: 'AC',
        title: 'Access Control Basics',
        description: 'Understanding Least Privilege and Separation of Duties.',
        durationMinutes: 15,
        difficulty: 'Beginner',
        content: '# Access Control\n\nLimit information system access to authorized users...'
    },
    {
        id: 'MOD-IA-01',
        familyId: 'IA',
        title: 'Identity Management',
        description: 'MFA, Password complexity, and account lifecycles.',
        durationMinutes: 20,
        difficulty: 'Intermediate',
        content: '# Identity & Authentication\n\nUsers must be uniquely identified...'
    }
];

export const REQUIREMENTS_DATA: Requirement[] = [
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
    scopeStatus: 'IN_SCOPE',
    mappings: { nist800_53: ['AC-2', 'AC-3'], iso27001: ['A.9.2.1'], nist_csf: ['PR.AC-1', 'PR.AC-4'], cis_v8: ['5.1', '6.1'] }
  },
  {
    id: '3.1.2',
    framework: 'NIST800-171',
    family: 'AC',
    title: 'Transaction & Function Control',
    description: 'Limit information system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'This is Role-Based Access Control (RBAC).',
    level: '1',
    sprsWeight: 5,
    interviewQuestion: 'Do you restrict users to only the functions they need to do their job?',
    objectives: [
      { id: 'a', description: 'Types of transactions are defined.', status: 'pending' },
      { id: 'b', description: 'System access is limited to permitted functions.', status: 'pending' },
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: { nist800_53: ['AC-2(4)'], nist_csf: ['PR.AC-3'] }
  },
  {
    id: '3.5.3',
    framework: 'NIST800-171',
    family: 'IA',
    title: 'Multi-Factor Authentication',
    description: 'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.',
    discussion: 'MFA is mandatory for CMMC.',
    level: '2',
    sprsWeight: 5,
    interviewQuestion: 'Is MFA enabled for ALL users (remote and local)?',
    objectives: [ { id: 'a', description: 'MFA used for network access.', status: 'pending' } ],
    scopeStatus: 'IN_SCOPE',
    mappings: { nist800_53: ['IA-2(1)', 'IA-2(2)'], nist_csf: ['PR.AC-7'] }
  }
];

export const INITIAL_RISKS: Risk[] = [
    {
        id: 'R-1001',
        description: 'Unpatched Domain Controller vulnerability (ZeroLogon)',
        category: 'Technical',
        remediation: 'Apply Microsoft Security Patch KB45678 immediately.',
        owner: 'SysAdmin',
        status: 'Open',
        dateIdentified: Date.now() - 1000 * 60 * 60 * 24 * 5,
        assessmentType: 'Quantitative',
        threatEventFrequency: 2,
        vulnerability: 0.9,
        lossMagnitude: 50000,
        riskScore: 90000 
    }
];

export const INITIAL_ASSETS: Asset[] = [
    {
        id: 'A-001',
        name: 'DC-01',
        type: 'Server',
        owner: 'IT Dept',
        location: 'Server Room',
        cmmcCategory: 'SPA',
        criticality: 'High',
        enclave: 'Core'
    },
    {
        id: 'A-002',
        name: 'ENG-LT-04',
        type: 'Workstation',
        owner: 'Engineering',
        location: 'Remote',
        cmmcCategory: 'CUI',
        criticality: 'Medium',
        enclave: 'VPN'
    }
];

export const INITIAL_USERS: User[] = [
    { 
        id: 'u1', 
        organizationId: 'client-msp', 
        name: 'Alice Admin', 
        email: 'alice@msp.com', 
        role: 'MSP_ADMIN', 
        department: 'IT Security', 
        lastLogin: Date.now(),
        mfaEnabled: true,
        hasPasskey: true 
    },
    { 
        id: 'u2', 
        organizationId: 'client-msp', 
        name: 'Tom Tech', 
        email: 'tom@msp.com', 
        role: 'MSP_TECH', 
        department: 'Support', 
        lastLogin: Date.now(),
        mfaEnabled: true,
        hasPasskey: false 
    },
    { 
        id: 'u3', 
        organizationId: 'client-a', 
        name: 'Bob Client', 
        email: 'bob@acme.com', 
        role: 'CLIENT_ADMIN', 
        department: 'Operations', 
        lastLogin: Date.now(),
        mfaEnabled: false,
        hasPasskey: false 
    }
];

export const INITIAL_TASKS: ProjectTask[] = [];
export const INITIAL_BUDGET: BudgetLineItem[] = [];

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
      isParent: true,
      branding: {
          primaryColor: '#ff7f50',
          logoUrl: ''
      }
    },
    { 
      id: 'client-a', 
      name: 'Acme Aerospace', 
      industry: 'Defense Contractor', 
      contactName: 'Bob Smith', 
      logoInitial: 'A',
      primaryFramework: 'CMMC-L2',
      nextAuditDate: Date.now() + 1000 * 60 * 60 * 24 * 60,
      accountManager: 'Alice Johnson',
      isParent: false 
    }
];

export const createInitialClientData = (useMockData = false): ClientData => {
    // Deep copy requirements to ensure clean status for new client
    const cleanRequirements = JSON.parse(JSON.stringify(REQUIREMENTS_DATA || []));
    
    return {
        requirements: cleanRequirements,
        risks: useMockData ? [...(INITIAL_RISKS || [])] : [],
        assets: useMockData ? [...(INITIAL_ASSETS || [])] : [],
        users: useMockData ? [...(INITIAL_USERS || [])] : [],
        tasks: useMockData ? [...(INITIAL_TASKS || [])] : [],
        budgetItems: useMockData ? [...(INITIAL_BUDGET || [])] : [],
        vendors: [],
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
        },
        auvikConfig: {
            apiKey: '',
            tenantId: '',
            region: 'US',
            enabled: false
        },
        // NEW INTEGRATION DEFAULTS
        m365Config: { enabled: false },
        awsConfig: { enabled: false },
        googleConfig: { enabled: false },
        siemConfig: { enabled: false },
        
        mspBranding: {
            logoUrl: '',
            primaryColor: '#ff7f50'
        }
    };
};