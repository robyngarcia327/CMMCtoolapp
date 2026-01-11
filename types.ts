export type CognitoGroup = 'Admin_Created_Users' | 'Application_Administrator' | 'Tenant_Admin' | 'Auditor';

export interface TrainingModule {
  id: string;
  familyId: string;
  title: string;
  description: string;
  content: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

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
  discussion?: string;
  level?: string;
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
  examineOptions?: string[];
  interviewOptions?: string[];
  testOptions?: string[];
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

export type UserRole = 'CLIENT_USER' | 'CLIENT_ADMIN' | 'MSP_TECH' | 'MSP_ADMIN';

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: CognitoGroup | UserRole;
  domain: string;
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
  domain: string; 
  industry: string;
  contactName: string;
  logoInitial: string;
  primaryFramework: string;
  nextAuditDate: number;
  accountManager: string;
  isParent: boolean;
  branding?: BrandingConfig;
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
  // General
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  
  // Compliance
  CONTROLS = 'CONTROLS',
  SPRS_SCORECARD = 'SPRS_SCORECARD',
  TRAINING = 'TRAINING',
  ASSETS = 'ASSETS',
  USERS = 'USERS',
  NETWORK_DIAGRAM = 'NETWORK_DIAGRAM',
  
  // Governance
  RISK_MANAGEMENT = 'RISK_MANAGEMENT',
  POAM = 'POAM',
  COST_TO_COMPLIANCE = 'COST_TO_COMPLIANCE',
  
  // Assessor
  ASSESSOR_PORTAL = 'ASSESSOR_PORTAL',
  
  // Reports
  REPORT_EXECUTIVE = 'REPORT_EXECUTIVE',
  REPORT_SSP = 'REPORT_SSP',
  REPORT_POLICY_CENTER = 'REPORT_POLICY_CENTER',
  
  // Admin
  ORGANIZATION_MANAGER = 'ORGANIZATION_MANAGER',
  GLOBAL_ADMIN = 'GLOBAL_ADMIN'
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

export interface Framework {
  id: string;
  name: string;
  description: string;
}

export interface BrandingConfig {
  primaryColor: string;
  logoUrl: string;
}

export interface ConnectWiseConfig extends IntegrationConfig {
  companyId: string;
  publicKey: string;
  privateKey: string;
  siteUrl: string;
  serviceBoard: string;
}

export interface JiraConfig extends IntegrationConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  issueType: string;
}

export interface ConfluenceConfig extends IntegrationConfig {
  baseUrl: string;
  spaceKey: string;
}

export interface AuvikConfig extends IntegrationConfig {
  apiKey: string;
  region: 'US' | 'EU';
}

export interface AuvikDevice {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  vlan: string;
  firmware?: string;
  isOnline: boolean;
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

export interface Risk {
  id: string; // The '#' numerical index in spreadsheet
  riskTier: string; // e.g., Operational, Strategic
  riskCategory: string; // e.g., Process, Financial, M&A
  domainGrouping: string; // e.g., Identification & Authentication
  riskNumber: string; // e.g., R-IAM-04
  riskTitle: string; // Short title of the risk
  riskOwner: string; // e.g., CIO, CAO
  deficiencyDescription: string; // Description of risk due to control deficiency
  probableScenarios: string; // Text field for probable scenarios
  likelihood: string; // e.g., 4 - Probable
  impact: string; // e.g., 2 - Medium
  inherentRiskRating: string; // Calculated or manual
  businessDecision: string; // Decision on IR
  targetResidualRiskRating: string; // Target rating after mitigation
  comments: string; // Narrative comments
  status: 'Open' | 'Mitigated' | 'Transferred' | 'Accepted';
  dateIdentified: number;
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
  category: 'Software' | 'Hardware' | 'Internal Labor' | 'Vendor Fees' | 'Assessor Fees';
  costType: 'One-Time' | 'Recurring/Year';
  amount: number;
  hours?: number;
  rate?: number;
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