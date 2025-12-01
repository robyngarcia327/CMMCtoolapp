import { Requirement, Risk, Asset, User, Framework, Client, ClientData, ProjectTask, BudgetLineItem, TrainingModule } from '../types';

// ... (Constants for FRAMEWORKS, NIST_FAMILIES, NIST_CSF_FUNCTIONS, TRAINING_MODULES, REQUIREMENTS_DATA remain the same as previous updates) ...
// Ensure you copy them from the existing file or previous prompts if missing.
// I will output the createInitialClientData function update here.

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
            logoUrl: 'https://via.placeholder.com/150x50/ff7f50/ffffff?text=TechFlow+MSP',
            primaryColor: '#ff7f50'
        }
    };
};

// ... (Rest of mock data constants: INITIAL_CLIENTS, etc.)