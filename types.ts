
export interface AssessmentObjective {
  id: string;
  description: string;
  status: 'met' | 'not_met' | 'na' | 'pending';
  method?: 'Examine' | 'Interview' | 'Test';
}

export interface Requirement {
  id: string;
  framework: string;
  family: string;
  title: string;
  description: string;
  discussion: string;
  level: string;
  cmmcLevel?: 1 | 2 | 3; 
  objectives: AssessmentObjective[];
  sprsWeight?: number;
  response?: string;
  scopeStatus?: 'IN_SCOPE' | 'OUT_OF_SCOPE';
  mappings: {
    nist800_53?: string[];
    iso27001?: string[];
    nist_csf?: string[];
  };
  poam?: PoamEntry;
  comments?: Comment[];
  evidenceEmail?: string;
  interviewQuestion?: string;
}

export interface Artifact {
  id: string;
  requirementId: string;
  name: string;
  type: 'image' | 'document' | 'link' | 'email' | 'json';
  url: string;
  timestamp: number;
  source?: 'USER_UPLOAD' | 'API_AUTO';
}

export type CmmcAssetCategory = 'CUI' | 'FCI' | 'SPA' | 'CRMA' | 'Out-of-Scope';

export interface Asset {
  id: string;
  name: string;
  type: 'Server' | 'Workstation' | 'Mobile' | 'Software' | 'Network Device';
  owner: string;
  location: string;
  cmmcCategory: CmmcAssetCategory;
  enclave?: string;
  criticality: 'Low' | 'Medium' | 'High';
  source?: 'Manual' | 'Intune' | 'CSV_Import' | 'ActiveDirectory';
  lastSynced?: number;
  externalId?: string;
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
  isCuiAuthorized: boolean;
  iamSource?: 'Manual' | 'Microsoft365' | 'EntraID' | 'ActiveDirectory' | 'CSV_Import';
  lastSynced?: number;
}

export interface IntegrationConfig {
    enabled: boolean;
    connectedAt?: number;
    accountName?: string;
    tenantId?: string;
    apiKey?: string;
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

export interface SspMetadata {
  systemName: string;
  systemIdentifier: string;
  categorization: 'LOW' | 'MODERATE' | 'HIGH';
  systemOwner: string;
  authorizingOfficial: string;
  otherDesignatedContacts?: string;
  assignmentOfSecurityResponsibility?: string;
  operationalStatus?: 'Operational' | 'Under Development' | 'Major Modification';
  systemType?: string;
  generalDescription?: string;
  systemEnvironment?: string;
  interconnections?: string;
  lawsAndPolicies?: string;
  completionDate?: string;
  approvalDate?: string;
}

export interface ClientData {
  requirements: Requirement[];
  assets: Asset[];
  users: User[];
  artifacts: Artifact[];
  risks: Risk[];
  vendors: Vendor[];
  tickets: Ticket[];
  tasks: ProjectTask[];
  budgetItems: BudgetLineItem[];
  wizardProgress: WizardProgress;
  sspMetadata: SspMetadata;
  m365Config: IntegrationConfig;
  intuneConfig: IntegrationConfig;
  adConfig: IntegrationConfig;
  cwConfig: ConnectWiseConfig;
  jiraConfig: JiraConfig;
  confluenceConfig: ConfluenceConfig;
  auvikConfig: AuvikConfig;
  awsConfig: IntegrationConfig;
  googleConfig: IntegrationConfig;
  siemConfig: IntegrationConfig;
  defenderConfig: IntegrationConfig;
  s1Config: IntegrationConfig;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  REQUIREMENTS = 'REQUIREMENTS',
  INVENTORY = 'INVENTORY',
  USERS = 'USERS',
  BULK_IMPORT = 'BULK_IMPORT',
  SETTINGS = 'SETTINGS',
  REPORTS = 'REPORTS',
  SPRS_SCORECARD = 'SPRS_SCORECARD',
  WIZARD = 'WIZARD',
  DOC_GENERATOR = 'DOC_GENERATOR',
  NETWORK_ANALYSIS = 'NETWORK_ANALYSIS',
  AUDITOR_PORTAL = 'AUDITOR_PORTAL',
  ORGANIZATION_MANAGER = 'ORGANIZATION_MANAGER',
  MSP_DASHBOARD = 'MSP_DASHBOARD',
  INTEGRATIONS = 'INTEGRATIONS'
}

export interface Framework {
  id: string;
  name: string;
  description: string;
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

export interface AuvikDevice {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  vlan?: string;
  firmware?: string;
  isOnline: boolean;
}

export interface AuvikConfig extends IntegrationConfig {
  apiKey: string;
  region: 'US' | 'EU';
}

export interface ConfluenceConfig extends IntegrationConfig {
  baseUrl: string;
  email?: string;
  apiToken?: string;
  spaceKey: string;
}

export interface JiraConfig extends IntegrationConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  issueType: string;
}

export interface ConnectWiseConfig extends IntegrationConfig {
  companyId: string;
  publicKey: string;
  privateKey: string;
  siteUrl: string;
  serviceBoard: string;
}

export interface BrandingConfig {
  primaryColor: string;
  logoUrl: string;
}

export interface Ticket {
  id: string;
  requirementId: string;
  summary: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: string;
  board: string;
  createdAt: number;
  ticketNumber?: string;
  source: 'ConnectWise' | 'Jira';
  url?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface PoamEntry {
  weaknessName: string;
  scheduledCompletionDate: string;
  milestones: string;
  status: string;
}

export type RiskCategory = 'Technical' | 'Administrative' | 'Physical' | 'External';
export type RiskStatus = 'Open' | 'Mitigated' | 'Risk Accepted' | 'Closed';
export type RiskAssessmentType = 'Qualitative' | 'Quantitative';

export interface Risk {
  id: string;
  description: string;
  category: RiskCategory;
  remediation: string;
  owner: string;
  status: RiskStatus;
  dateIdentified: number;
  assessmentType: RiskAssessmentType;
  threatEventFrequency?: number;
  vulnerability?: number;
  lossMagnitude?: number;
  likelihood?: 1 | 2 | 3 | 4 | 5;
  impact?: 1 | 2 | 3 | 4 | 5;
  riskScore: number;
}

export interface RiskProfileVersion {
  id: string;
  versionNumber: string;
  timestamp: number;
  createdBy: string;
  risks: Risk[];
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  priority: 'Low' | 'Medium' | 'High';
  assigneeId?: string;
  dueDate?: number;
  linkedRequirementId?: string;
  linkedRiskId?: string;
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
  lastAssessmentDate: number;
  nextAssessmentDate: number;
}
