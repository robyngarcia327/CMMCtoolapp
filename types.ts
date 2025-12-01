export interface AssessmentObjective {
  id: string;
  description: string;
  status: 'met' | 'not_met' | 'na' | 'pending';
}

export interface ReferenceLink {
  title: string;
  url: string;
  type: 'Guide' | 'Video' | 'Template' | 'Official';
}

export interface TrainingModule {
  id: string;
  familyId: string;
  title: string;
  description: string;
  content: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface Requirement {
  id: string;
  framework: string;
  family: string;
  title: string;
  description: string;
  discussion: string;
  level: string;
  objectives: AssessmentObjective[];
  sprsWeight?: number;
  interviewQuestion?: string;
  response?: string;
  scopeStatus?: 'IN_SCOPE' | 'OUT_OF_SCOPE';
  scopeJustification?: string;
  references?: ReferenceLink[];
  comments?: Comment[];
  evidenceEmail?: string;
  mappings: {
    nist800_53?: string[];
    iso27001?: string[];
    nist_csf?: string[];
    cis_v8?: string[];
    soc2?: string[];
    hipaa?: string[];
  };
}

export interface Artifact {
  id: string;
  requirementId: string;
  name: string;
  type: 'image' | 'document' | 'link' | 'email' | 'json'; // Added json for API data
  url: string;
  timestamp: number;
  notes?: string;
  expiryDate?: number;
  containsCui?: boolean; // FIPS protection flag
  source?: 'USER_UPLOAD' | 'API_AUTO'; // Automation flag
}

export interface Ticket {
  id: string;
  requirementId: string;
  summary: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'In Progress' | 'Resolved';
  board: string;
  createdAt: number;
  ticketNumber: string;
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
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  issueType: string;
  enabled: boolean;
}

export interface ConfluenceConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  spaceKey: string;
  parentPageId?: string;
  enabled: boolean;
}

export interface AuvikConfig {
  apiKey: string;
  tenantId: string;
  region: 'US' | 'EU';
  enabled: boolean;
}

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
  answers: Record<string, string>;
  generatedContent: string;
}

export interface Risk {
  id: string;
  description: string;
  category: 'Technical' | 'Administrative' | 'Physical' | 'External';
  remediation: string;
  owner: string;
  status: 'Open' | 'Mitigated' | 'Accepted' | 'Transferred';
  dateIdentified: number;
  assessmentType: 'Qualitative' | 'Quantitative';
  likelihood?: 1 | 2 | 3 | 4 | 5;
  impact?: 1 | 2 | 3 | 4 | 5;
  threatEventFrequency?: number;
  vulnerability?: number;
  lossMagnitude?: number;
  riskScore: number;
}

export interface RiskProfileVersion {
  id: string;
  versionNumber: string;
  timestamp: number;
  createdBy: string;
  risks: Risk[];
}

// Updated for CMMC Specific Asset Classification
export type CmmcAssetCategory = 'CUI' | 'FCI' | 'SPA' | 'CRMA' | 'Out-of-Scope';

export interface Asset {
  id: string;
  name: string;
  type: 'Server' | 'Workstation' | 'Mobile' | 'Software' | 'Network Device';
  owner: string;
  location: string;
  cmmcCategory: CmmcAssetCategory; // Replaces boolean
  enclave?: string; // e.g. "CUI VLAN"
  criticality: 'Low' | 'Medium' | 'High';
}

export interface Vendor {
  id: string;
  name: string;
  serviceProvided: string;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  contactPerson: string;
  contactEmail: string;
  status: 'Active' | 'Under Review' | 'Rejected';
  hasNDASigned: boolean;
  hasDPA: boolean;
  lastAssessmentDate?: number;
  nextAssessmentDate?: number;
}

export type UserRole = 'MSP_ADMIN' | 'MSP_TECH' | 'CLIENT_ADMIN' | 'CLIENT_USER';

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  lastLogin: number;
  mfaEnabled: boolean;
  hasPasskey: boolean;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  priority: 'Low' | 'Medium' | 'High';
  assigneeId?: string;
  linkedRequirementId?: string;
  linkedRiskId?: string;
  dueDate?: number;
}

export interface BudgetLineItem {
  id: string;
  linkedRequirementId: string;
  name: string;
  category: 'Software' | 'Hardware' | 'Labor' | 'Consulting';
  costType: 'One-Time' | 'Recurring/Year';
  amount: number;
  notes?: string;
}

// --- Integration Configurations ---
export interface IntegrationConfig {
    enabled: boolean;
    connectedAt?: number;
    accountName?: string;
    // In a real app, you might store encrypted tokens here or in a backend
}

export interface Framework {
  id: string;
  name: string;
  description: string;
}

export interface BrandingConfig {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  logoInitial: string;
  primaryFramework: string;
  nextAuditDate: number;
  accountManager: string;
  isParent: boolean;
  branding?: BrandingConfig;
}

export interface WizardProgress {
  currentStep: 'INTRO' | 'INVENTORY' | 'NETWORK' | 'ASSESSMENT' | 'VALIDATION';
  currentQuestionIndex: number;
}

export interface ClientData {
  requirements: Requirement[];
  risks: Risk[];
  assets: Asset[];
  vendors: Vendor[];
  users: User[];
  artifacts: Artifact[];
  tickets: Ticket[];
  tasks: ProjectTask[];
  budgetItems: BudgetLineItem[];
  cwConfig: ConnectWiseConfig;
  jiraConfig: JiraConfig;
  confluenceConfig: ConfluenceConfig;
  auvikConfig: AuvikConfig;
  
  // Cloud Integrations
  m365Config: IntegrationConfig;
  awsConfig: IntegrationConfig;
  googleConfig: IntegrationConfig;
  siemConfig: IntegrationConfig;

  mspBranding?: BrandingConfig;
  versions: RiskProfileVersion[];
  wizardProgress: WizardProgress;
}

export enum AppView {
  MSP_DASHBOARD = 'MSP_DASHBOARD',
  ORGANIZATION_MANAGER = 'ORGANIZATION_MANAGER',
  DASHBOARD = 'DASHBOARD',
  REQUIREMENTS = 'REQUIREMENTS',
  DOC_GENERATOR = 'DOC_GENERATOR',
  NETWORK_ANALYSIS = 'NETWORK_ANALYSIS',
  RISK_REGISTER = 'RISK_REGISTER',
  INVENTORY = 'INVENTORY',
  VENDORS = 'VENDORS',
  USERS = 'USERS',
  PROJECTS = 'PROJECTS',
  BUDGET = 'BUDGET',
  TRAINING = 'TRAINING',
  SETTINGS = 'SETTINGS',
  CHAT = 'CHAT',
  REPORTS = 'REPORTS',
  SPRS_SCORECARD = 'SPRS_SCORECARD',
  WIZARD = 'WIZARD',
  AUDITOR_PORTAL = 'AUDITOR_PORTAL',
}