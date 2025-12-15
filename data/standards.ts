import { Requirement, Risk, Asset, User, Framework, Client, ClientData, ProjectTask, BudgetLineItem, TrainingModule, IntegrationConfig } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST800-171', name: 'NIST SP 800-171 r2', description: 'Protecting CUI in Nonfederal Systems' },
  { id: 'CMMC-L2', name: 'CMMC 2.0 Level 2', description: 'Advanced Cyber Hygiene (Aligned with NIST 800-171)' },
  { id: 'ISO27001', name: 'ISO/IEC 27001:2022', description: 'Information Security Management' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria (Security, Availability, Confidentiality)' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Protection of Electronic Protected Health Information (ePHI)' }
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

export const NIST_CSF_FUNCTIONS = [
    { id: 'GV', name: 'Govern', color: 'bg-blue-500', text: 'text-blue-600' },
    { id: 'ID', name: 'Identify', color: 'bg-indigo-500', text: 'text-indigo-600' },
    { id: 'PR', name: 'Protect', color: 'bg-purple-500', text: 'text-purple-600' },
    { id: 'DE', name: 'Detect', color: 'bg-yellow-500', text: 'text-yellow-600' },
    { id: 'RS', name: 'Respond', color: 'bg-red-500', text: 'text-red-600' },
    { id: 'RC', name: 'Recover', color: 'bg-green-500', text: 'text-green-600' }
];

// --- Data Generators ---

// Helper to generate the full 110 controls
const generateNistControls = (): Requirement[] => {
    const reqs: Requirement[] = [];
    
    // Defined "Hero" controls with specific text
    const specificControls: Record<string, Partial<Requirement>> = {
        '3.1.1': { title: 'Authorized Access Control', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).', sprsWeight: 5 },
        '3.1.3': { title: 'CUI Flow Control', description: 'Control the flow of CUI in accordance with approved authorizations.', sprsWeight: 5 },
        '3.5.3': { title: 'Multi-Factor Authentication', description: 'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.', sprsWeight: 5 },
        '3.6.1': { title: 'Incident Handling', description: 'Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.', sprsWeight: 3 },
        '3.10.1': { title: 'Physical Access Control', description: 'Limit physical access to organizational information systems, equipment, and the respective operating environments to authorized individuals.', sprsWeight: 5 },
        '3.11.1': { title: 'Risk Assessment', description: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems.', sprsWeight: 1 },
        '3.13.1': { title: 'Boundary Protection', description: 'Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational information systems) at the external boundaries and key internal boundaries of the information systems.', sprsWeight: 5 },
        '3.14.1': { title: 'Flaw Remediation', description: 'Identify, report, and correct information system flaws in a timely manner.', sprsWeight: 5 },
    };

    NIST_FAMILIES.forEach(family => {
        for (let i = 1; i <= family.count; i++) {
            // Determine Control ID (e.g. 3.1.1)
            // Note: Mapping family ID to number (AC=3.1, AT=3.2, etc) is complex, simplifying for demo generator
            // We will use a simplified mapping logic or just assume sequential generation for the "Full Data" feel
            
            const familyIndex = NIST_FAMILIES.findIndex(f => f.id === family.id) + 1;
            const id = `3.${familyIndex}.${i}`;
            
            const specific = specificControls[id];

            reqs.push({
                id: id,
                framework: 'NIST800-171',
                family: family.id,
                title: specific?.title || `${family.name} Control ${i}`,
                description: specific?.description || `Implement controls to satisfy requirements for ${family.name} in accordance with NIST 800-171 r2. This is a generated placeholder for control ${id}.`,
                discussion: 'Specific guidance from NIST Special Publication 800-171 Revision 2.',
                level: '2',
                sprsWeight: specific?.sprsWeight || 1,
                objectives: [
                    { id: 'a', description: 'Control is defined.', status: 'pending' },
                    { id: 'b', description: 'Control is implemented.', status: 'pending' },
                    { id: 'c', description: 'Control is tested.', status: 'pending' }
                ],
                scopeStatus: 'IN_SCOPE',
                mappings: {
                    nist800_53: [`${family.id}-${i}`],
                    nist_csf: ['PR.AC-1'] // Placeholder mapping
                }
            });
        }
    });
    return reqs;
};

const generateIsoControls = (): Requirement[] => {
    return [
        {
            id: 'A.5.1',
            framework: 'ISO27001',
            family: 'Policies',
            title: 'Policies for Information Security',
            description: 'Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel.',
            discussion: 'Core governance requirement.',
            level: 'Mandatory',
            objectives: [{ id: 'a', description: 'Policies defined', status: 'pending' }],
            scopeStatus: 'IN_SCOPE',
            mappings: {}
        },
        {
             id: 'A.9.1',
            framework: 'ISO27001',
            family: 'Access Control',
            title: 'Access Control Policy',
            description: 'Access to information and information processing facilities shall be limited in accordance with access control policy.',
            discussion: 'Manage access rights.',
            level: 'Mandatory',
            objectives: [{ id: 'a', description: 'Policy defined', status: 'pending' }],
            scopeStatus: 'IN_SCOPE',
            mappings: {}
        }
    ];
};

// THIS IS THE REAL FRAMEWORK DATA (Used for seeding)
export const REQUIREMENTS_DATA: Requirement[] = [
    ...generateNistControls(),
    ...generateIsoControls()
];

// THIS IS REAL CONTENT (Training)
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

// --- CLEAN STATE (No Demo Data) ---
export const INITIAL_RISKS: Risk[] = [];
export const INITIAL_ASSETS: Asset[] = [];
export const INITIAL_USERS: User[] = [];
export const INITIAL_TASKS: ProjectTask[] = [];
export const INITIAL_BUDGET: BudgetLineItem[] = [];
export const INITIAL_CLIENTS: Client[] = [];

export const createInitialClientData = (useMockData = false): ClientData => {
    // If we are starting fresh, we usually want to SEED the Requirements (110 controls),
    // but the status of them should be "Pending" / Empty.
    const cleanRequirements = JSON.parse(JSON.stringify(REQUIREMENTS_DATA));
    
    return {
        requirements: cleanRequirements,
        risks: [],
        assets: [],
        users: [],
        tasks: [],
        budgetItems: [],
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