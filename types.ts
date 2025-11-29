
export interface AssessmentObjective {
  id: string;
  description: string;
  status: 'met' | 'not_met' | 'na' | 'pending';
}

export interface Requirement {
  id: string;
  framework: string; // e.g., 'NIST800-171', 'ISO27001', 'SOC2'
  family: string;
  title: string;
  description: string;
  discussion: string;
  level: string; // e.g., "1", "2", "3" or "Level 1"
  objectives: AssessmentObjective[];
  sprsWeight?: number; // SPRS Score weight (typically 1, 3, or 5)
  
  // New fields for Onboarding Wizard
  interviewQuestion?: string; // Friendly question text
  response?: string; // User's text answer to the question

  mappings: {
    nist800_53?: string[];
    iso27001?: string[];
    nist_csf?: string[]; // e.g., "PR.AC-1", "ID.AM-1"
    cis_v8?: string[];   // e.g., "3.1", "5.2"
    soc2?: string[];
    hipaa?: string[];
  };
}

export interface Artifact {
  id: string;
  requirementId: string;
  name: string;
  type: 'image' | 'document' | 'link';
  url: string; // dataURL for images, mock URL for files
  timestamp: number;
  notes?: string;
}

export interface Ticket {
  id: string;
  requirementId: string;
  summary: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'In Progress' | 'Resolved';
  board: string; // CW Service Board or Jira Project Name
  createdAt: number;
  ticketNumber: string; // e.g., #1024 or PROJ-123
  source: 'ConnectWise' | 'Jira';
  url?: string;
}

export interface ConnectWiseConfig {
  companyId: string;
  publicKey: string;
  privateKey: string;
  siteUrl: string;
  serviceBoard: string;
  enabled: boolean;
}

export interface JiraConfig {
  baseUrl: string; // e.g., https://mycompany.atlassian.net
  email: string;
  apiToken: string;
  projectKey: string; // e.g., SEC, COMP
  issueType: string; // e.g., Task, Bug
  enabled: boolean;
}

export interface ConfluenceConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  spaceKey: string; // e.g., COMP, ISMS
  parentPageId?: string;
  enabled: boolean;
}

export interface AuvikConfig {
  apiKey: string;
  tenantId: string;
  region: 'US' | 'EU';
  enabled: boolean;
}

// Represents a device fetched from Auvik
export interface AuvikDevice {
  id: string;
  name: string;
  type: 'Switch' | 'Firewall' | 'Server' | 'Workstation' | 'Printer' | 'AccessPoint';
  ipAddress: string;
  vlan?: string;
  firmware?: string;
  isOnline: boolean;
}

export interface DocGenSession {
  id: string;
  type: 'SSP' | 'WISP';
  answers: Record<string, string>; // QuestionID -> Answer
  generatedContent: string;
}

// --- New Features Interfaces ---

export interface Risk {
  id: string;
  description: string;
  category: 'Technical' | 'Administrative' | 'Physical' | 'External';
  remediation: string;
  owner: string;
  status: 'Open' | 'Mitigated' | 'Accepted' | 'Transferred';
  dateIdentified: number;
  
  // Assessment Methodology
  assessmentType: 'Qualitative' | 'Quantitative';

  // Qualitative Fields (Legacy/Simple)
  likelihood?: 1 | 2 | 3 | 4 | 5; // 1=Rare, 5=Almost Certain
  impact?: 1 | 2 | 3 | 4 | 5; // 1=Insignificant, 5=Catastrophic
  
  // Quantitative / FAIR Fields
  threatEventFrequency?: number; // (TEF) Times per year event occurs
  vulnerability?: number; // (V) Probability of successful exploit (0.0 - 1.0)
  lossMagnitude?: number; // (PLM) Estimated financial loss per event ($)
  
  // Computed
  riskScore: number; // For Qualitative: Likelihood * Impact. For FAIR: ALE ($)
}

export interface RiskProfileVersion {
  id: string;
  versionNumber: string; // e.g., "v1.0", "v1.1"
  timestamp: number;
  createdBy: string;
  risks: Risk[]; // Snapshot of risks at that time
}

export interface Asset {
  id: string;
  name: string;
  type: 'Server' | 'Workstation' | 'Mobile' | 'Software' | 'Network Device';
  owner: string;
  location: string;
  inScopeCUI: boolean; // Is it part of the boundary?
  criticality: 'Low' | 'Medium' | 'High';
}

export type UserRole = 'MSP_ADMIN' | 'MSP_TECH' | 'CLIENT_ADMIN' | 'CLIENT_USER';

export interface User {
  id: string;
  organizationId: string; // Links to Client.id
  name: string;
  email: string;
  role: UserRole;
  department: string;
  lastLogin: number;
  // Auth Security Fields
  mfaEnabled: boolean;
  hasPasskey: boolean; // Supports WebAuthn/Device Keys
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  priority: 'Low' | 'Medium' | 'High';
  assigneeId?: string; // Links to User.id
  linkedRequirementId?: string; // Links to POA&M item
  linkedRiskId?: string; // Links to Risk
  dueDate?: number;
}

// --- Budgeting Interfaces ---
export interface BudgetLineItem {
  id: string;
  linkedRequirementId: string; // The gap this fixes
  name: string; // e.g., "MFA License (Duo)"
  category: 'Software' | 'Hardware' | 'Labor' | 'Consulting';
  costType: 'One-Time' | 'Recurring/Year';
  amount: number;
  notes?: string;
}

export interface Framework {
  id: string;
  name: string;
  description: string;
}

// --- MSP Client Interfaces ---

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  logoInitial: string;
  // MSP Fields
  primaryFramework: string; // e.g. "CMMC L2"
  nextAuditDate: number; // Timestamp
  accountManager: string;
  isParent: boolean; // Is this the MSP / Parent Organization?
}

export interface WizardProgress {
  currentStep: 'INTRO' | 'INVENTORY' | 'NETWORK' | 'ASSESSMENT' | 'VALIDATION';
  currentQuestionIndex: number;
}

export interface ClientData {
  requirements: Requirement[];
  risks: Risk[];
  assets: Asset[];
  users: User[];
  artifacts: Artifact[];
  tickets: Ticket[];
  tasks: ProjectTask[];
  budgetItems: BudgetLineItem[];
  cwConfig: ConnectWiseConfig;
  jiraConfig: JiraConfig;
  confluenceConfig: ConfluenceConfig;
  auvikConfig: AuvikConfig;
  versions: RiskProfileVersion[];
  wizardProgress: WizardProgress;
}

export enum AppView {
  MSP_DASHBOARD = 'MSP_DASHBOARD', // Top-level MSP View
  ORGANIZATION_MANAGER = 'ORGANIZATION_MANAGER', // Central Client/User Management
  DASHBOARD = 'DASHBOARD',
  REQUIREMENTS = 'REQUIREMENTS',
  DOC_GENERATOR = 'DOC_GENERATOR',
  NETWORK_ANALYSIS = 'NETWORK_ANALYSIS',
  RISK_REGISTER = 'RISK_REGISTER',
  INVENTORY = 'INVENTORY',
  USERS = 'USERS',
  PROJECTS = 'PROJECTS',
  BUDGET = 'BUDGET', // New View
  SETTINGS = 'SETTINGS',
  CHAT = 'CHAT',
  REPORTS = 'REPORTS',
  SPRS_SCORECARD = 'SPRS_SCORECARD',
  WIZARD = 'WIZARD', // New Onboarding Wizard View
}
