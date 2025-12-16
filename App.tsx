import React, { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { 
  Shield, 
  LayoutDashboard, 
  ListChecks, 
  FileText, 
  Settings as SettingsIcon, 
  MessageSquare,
  AlertTriangle,
  Network,
  Package,
  Users,
  Building2,
  KanbanSquare,
  Calculator,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Wand2,
  LogOut,
  User as UserIcon,
  ChevronsUpDown,
  Menu,
  ChevronDown,
  Briefcase,
  Loader2,
  RefreshCw
} from 'lucide-react';

import { INITIAL_CLIENTS, FRAMEWORKS, createInitialClientData, REQUIREMENTS_DATA } from './data/standards';
import { Requirement, Artifact, AppView, Ticket, ConnectWiseConfig, JiraConfig, ConfluenceConfig, Risk, Asset, User, Framework, Client, ClientData, ProjectTask, WizardProgress, UserRole, BudgetLineItem, BrandingConfig, Vendor, IntegrationConfig } from './types';
import { RequirementsList } from './components/RequirementsList';
import { RequirementDetail } from './components/RequirementDetail';
import { DocGenerator } from './components/DocGenerator';
import { AIChat } from './components/AIChat';
import { Settings } from './components/Settings';
import { NetworkAnalyzer } from './components/NetworkAnalyzer';
import { RiskRegister } from './components/RiskRegister';
import { Inventory } from './components/Inventory';
import { UserManagement } from './components/UserManagement';
import { OrganizationManager } from './components/OrganizationManager';
import { ClientSwitcher } from './components/ClientSwitcher';
import { ProjectBoard } from './components/ProjectBoard';
import { BudgetCalculator } from './components/BudgetCalculator';
import { TrainingCenter } from './components/TrainingCenter';
import { Reports } from './components/Reports';
import { SPRSScorecard } from './components/SPRSScorecard';
import { ComplianceWizard } from './components/ComplianceWizard';
import { VendorManager } from './components/VendorManager';
import { MSPDashboard } from './components/MSPDashboard';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding'; 
import { Dashboard } from './components/Dashboard'; 
import { AuditorPortal } from './components/AuditorPortal'; 
import { storageService } from './services/storage';
import { authConfig } from './authConfig';
import { api } from './services/api';

// --- Render Helpers ---
const NavDropdown = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
  <div className="relative group h-full flex items-center">
      <button className="flex items-center gap-1 px-3 py-2 text-slate-300 hover:text-white font-medium transition-colors">
          <Icon size={16} /> {label} <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
      </button>
      <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 hidden group-hover:block animate-in fade-in zoom-in-95 duration-100 z-50">
          {children}
      </div>
  </div>
);

const NavItem = ({ label, icon: Icon, isActive, onClick }: { label: string, icon: any, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors ${isActive ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700'}`}
  >
      <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
      {label}
  </button>
);

const App: React.FC = () => {
  const auth = useAuth();
  
  // App State
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Data State
  const [isDataLoading, setIsDataLoading] = useState(false); 
  const [loadingMessage, setLoadingMessage] = useState("Loading Organization...");
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClientId, setActiveClientId] = useState<string>('');
  const [activeFramework, setActiveFramework] = useState<Framework>(FRAMEWORKS[0]);
  const [clientDataStore, setClientDataStore] = useState<Record<string, ClientData>>({});
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);
  
  // Onboarding/Fetch State
  const [orgFetchError, setOrgFetchError] = useState<string | null>(null);
  const [creationStatus, setCreationStatus] = useState<'idle' | 'creating' | 'verifying' | 'failed_verification'>('idle');

  // --- 1. Load Organizations on Auth ---
  const loadOrganizations = async (forceRefresh = false) => {
      // Use ACCESS TOKEN for API Authorization, not ID Token
      if (!auth.isAuthenticated || !auth.user?.access_token) return;

      setIsDataLoading(true);
      setLoadingMessage("Loading Organization...");
      setOrgFetchError(null);
      
      try {
          const apiOrgs = await api.getOrgs(auth.user.access_token);
          
          const mappedClients: Client[] = apiOrgs.map((o: any) => ({
              id: o.orgId,
              name: o.name,
              industry: 'Unknown', 
              contactName: auth.user?.profile.email || 'User',
              logoInitial: o.name.charAt(0).toUpperCase(),
              primaryFramework: 'NIST800-171',
              nextAuditDate: Date.now() + 31536000000,
              accountManager: 'Self-Managed',
              isParent: false
          }));

          setClients(mappedClients);

          if (mappedClients.length > 0) {
              const storedOrgId = localStorage.getItem('activeOrgId');
              const validStored = storedOrgId ? mappedClients.find(c => c.id === storedOrgId) : null;
              
              const selectedId = validStored ? validStored.id : mappedClients[0].id;
              setActiveClientId(selectedId);
              localStorage.setItem('activeOrgId', selectedId);

              // Initialize Data Store
              const newStore: Record<string, ClientData> = {};
              for (const c of mappedClients) {
                  if (!clientDataStore[c.id]) {
                      newStore[c.id] = createInitialClientData(false);
                  } else {
                      newStore[c.id] = clientDataStore[c.id];
                  }
                  
                  // Fetch Evidence using ACCESS TOKEN
                  api.getEvidenceList(auth.user.access_token, c.id).then(evidence => {
                      setClientDataStore(prev => ({
                          ...prev,
                          [c.id]: { ...prev[c.id], artifacts: evidence }
                      }));
                  }).catch(e => console.warn(`Failed to fetch evidence for ${c.id}`, e));
              }
              setClientDataStore(prev => ({ ...prev, ...newStore }));
          } else {
              setActiveClientId('');
          }

      } catch (e: any) {
          console.error("Failed to load organizations", e);
          setOrgFetchError(e.message || "Could not load organization data.");
      } finally {
          setIsDataLoading(false);
      }
  };

  useEffect(() => {
      if (auth.isAuthenticated && auth.user?.access_token) {
          loadOrganizations();
      }
  }, [auth.isAuthenticated, auth.user]);

  // Auto-save
  useEffect(() => {
    if (!isDataLoading && clients.length > 0) {
        storageService.save(clients, clientDataStore);
    }
  }, [clients, clientDataStore, isDataLoading]);

  // Handle Org Creation
  const handleCreateOrganization = async (name: string) => {
      if (!auth.user?.access_token) return;
      
      setCreationStatus('creating');
      setIsDataLoading(true);
      setLoadingMessage("Creating Organization...");
      setOrgFetchError(null);

      try {
          // Attempt creation using ACCESS TOKEN
          const newOrg = await api.createOrg(auth.user.access_token, name);
          // If successful response, use it immediately
          finishOrgCreation(newOrg);
      } catch (e: any) {
          console.warn("API Error during creation. Attempting recovery...", e);
          setOrgFetchError(e.message);
          
          // If creation failed (e.g. timeout), enter Verification Loop
          setCreationStatus('verifying');
          setLoadingMessage("Verifying creation...");
          
          await verifyOrganizationExists(name);
      }
  };

  const verifyOrganizationExists = async (name: string) => {
      if (!auth.user?.access_token) return;

      // Poll up to 10 times (30+ seconds) to handle DB Index Propagation Latency
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
          attempts++;
          console.log(`Verifying organization "${name}" (Attempt ${attempts}/${maxAttempts})...`);
          
          try {
              // Wait 3s between checks
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              // Use ACCESS TOKEN
              const apiOrgs = await api.getOrgs(auth.user.access_token);
              
              // 1. Strict Match
              const existing = apiOrgs.find((o: any) => o.name.trim().toLowerCase() === name.trim().toLowerCase());
              
              if (existing) {
                  finishOrgCreation(existing);
                  return;
              }

              // 2. Fuzzy/First Match: If we had NO clients before, and now we have ONE, assume it's the one we just made.
              if (clients.length === 0 && apiOrgs.length > 0) {
                  console.log("Strict match failed, but new organization found. Proceeding with:", apiOrgs[0]);
                  finishOrgCreation(apiOrgs[0]);
                  return;
              }

          } catch (err) {
              console.warn("Polling error:", err);
          }
      }

      // If loop completes without success
      setCreationStatus('failed_verification');
      setIsDataLoading(false);
  };

  const finishOrgCreation = (orgData: any) => {
      const newClient: Client = {
          id: orgData.orgId,
          name: orgData.name,
          industry: 'General',
          contactName: auth.user?.profile.email || 'Admin',
          logoInitial: orgData.name.charAt(0).toUpperCase(),
          primaryFramework: 'NIST800-171',
          nextAuditDate: Date.now() + 31536000000,
          accountManager: 'Self-Managed',
          isParent: false
      };

      setClients(prev => [...prev, newClient]);
      
      setClientDataStore(prev => ({
          ...prev,
          [newClient.id]: createInitialClientData(false)
      }));

      setActiveClientId(newClient.id);
      localStorage.setItem('activeOrgId', newClient.id);
      setIsDataLoading(false);
      setCreationStatus('idle');
  };

  // --- Auth Handling ---

  const handleLogout = () => {
      auth.removeUser();
      localStorage.removeItem('activeOrgId');
      const clientId = authConfig.client_id;
      const logoutUri = authConfig.redirect_uri;
      const cognitoDomain = authConfig.cognito_domain.replace(/\/$/, "");
      
      if (cognitoDomain.includes("your-domain")) {
          window.location.href = logoutUri;
      } else {
          window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
      }
  };
  
  if (auth.isLoading) {
      return (
          <div className="flex h-screen items-center justify-center bg-slate-900 flex-col gap-4">
              <Loader2 size={48} className="animate-spin text-blue-500" />
              <h2 className="text-xl font-bold text-white">Authenticating...</h2>
              <p className="text-slate-400">Connecting to Secure Gateway</p>
          </div>
      );
  }

  if (auth.error || !auth.isAuthenticated) {
      return <Login onLogin={() => auth.signinRedirect()} error={auth.error} />;
  }

  // --- Data Loading State (Global) ---
  if (isDataLoading) {
      return (
          <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
              <Loader2 size={48} className="animate-spin text-blue-600" />
              <h2 className="text-xl font-bold text-slate-700">{loadingMessage}</h2>
              <p className="text-slate-500">Syncing with cloud database...</p>
          </div>
      );
  }

  // --- ONBOARDING / CREATION FLOW ---
  if (!activeClientId) {
      return (
          <Onboarding 
            user={{
                id: auth.user?.profile.sub || '', 
                name: '', email: auth.user?.profile.email || '', role: 'CLIENT_USER', 
                organizationId: '', department: '', lastLogin: 0, mfaEnabled: false, hasPasskey: false, isCuiAuthorized: false 
            }}
            onCreateOrganization={handleCreateOrganization}
            onRefresh={() => loadOrganizations(true)}
            creationStatus={creationStatus}
            onRetryVerification={verifyOrganizationExists}
            errorMessage={orgFetchError}
            debugTokens={{
                accessToken: auth.user?.access_token,
                idToken: auth.user?.id_token
            }}
          />
      );
  }

  // --- MAIN APPLICATION ---
  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];
  const activeData = clientDataStore[activeClientId];
  
  if (!activeData) return <div className="p-10">Error loading organization data. Please refresh.</div>;

  // Find current user object
  const currentUser = activeData.users.find(u => u.email === auth.user?.profile.email) || {
      id: auth.user?.profile.sub || 'unknown',
      name: (auth.user?.profile.email || 'User').split('@')[0],
      email: auth.user?.profile.email || '',
      organizationId: activeClientId,
      role: 'CLIENT_ADMIN',
      department: 'IT',
      lastLogin: Date.now(),
      mfaEnabled: true,
      hasPasskey: false,
      isCuiAuthorized: true
  };

  const updateActiveClientData = (updateFn: (prev: ClientData) => Partial<ClientData>) => {
      setClientDataStore(prevStore => {
          const current = prevStore[activeClientId];
          const changes = updateFn(current);
          return {
              ...prevStore,
              [activeClientId]: { ...current, ...changes }
          };
      });
  };

  const handleUpdateClientData = (clientId: string, data: Partial<ClientData>) => {
      setClientDataStore(prev => ({
          ...prev,
          [clientId]: { ...prev[clientId], ...data }
      }));
  };

  // Data Selectors
  const requirements = activeData.requirements;
  const risks = activeData.risks;
  const assets = activeData.assets;
  const vendors = activeData.vendors || [];
  const users = activeData.users;
  const artifacts = activeData.artifacts;
  const tickets = activeData.tickets;
  const tasks = activeData.tasks;
  const budgetItems = activeData.budgetItems || [];
  const cwConfig = activeData.cwConfig;
  const jiraConfig = activeData.jiraConfig;
  const confluenceConfig = activeData.confluenceConfig;
  const mspBranding = activeData.mspBranding;
  const wizardProgress = activeData.wizardProgress || { currentStep: 'INTRO', currentQuestionIndex: 0 };
  const m365Config = activeData.m365Config;
  const awsConfig = activeData.awsConfig;
  const googleConfig = activeData.googleConfig;
  const siemConfig = activeData.siemConfig;

  // Handlers
  const handleSelectReq = (req: Requirement) => setSelectedRequirementId(req.id);
  const handleUpdateRequirement = (updated: Requirement) => {
    updateActiveClientData(prev => ({
      requirements: prev.requirements.map(r => r.id === updated.id ? updated : r)
    }));
  };
  const handleAddArtifact = (a: Artifact) => updateActiveClientData(prev => ({ artifacts: [...prev.artifacts, a] }));
  const handleRemoveArtifact = (id: string) => updateActiveClientData(prev => ({ artifacts: prev.artifacts.filter(a => a.id !== id) }));
  const handleAddTicket = (t: Ticket) => updateActiveClientData(prev => ({ tickets: [...prev.tickets, t] }));
  const handleAddRisk = (r: Risk) => updateActiveClientData(prev => ({ risks: [...prev.risks, r] }));
  const handleUpdateRisk = (r: Risk) => updateActiveClientData(prev => ({ risks: prev.risks.map(ex => ex.id === r.id ? r : ex) }));
  const handleDeleteRisk = (id: string) => updateActiveClientData(prev => ({ risks: prev.risks.filter(r => r.id !== id) }));
  const handleAddAsset = (a: Asset) => updateActiveClientData(prev => ({ assets: [...prev.assets, a] }));
  const handleDeleteAsset = (id: string) => updateActiveClientData(prev => ({ assets: prev.assets.filter(a => a.id !== id) }));
  const handleAddVendor = (v: Vendor) => updateActiveClientData(prev => ({ vendors: [...(prev.vendors || []), v] }));
  const handleUpdateVendor = (v: Vendor) => updateActiveClientData(prev => ({ vendors: prev.vendors?.map(ex => ex.id === v.id ? v : ex) }));
  const handleDeleteVendor = (id: string) => updateActiveClientData(prev => ({ vendors: prev.vendors?.filter(v => v.id !== id) }));
  const handleAddTask = (t: ProjectTask) => updateActiveClientData(prev => ({ tasks: [...prev.tasks, t] }));
  const handleUpdateTask = (t: ProjectTask) => updateActiveClientData(prev => ({ tasks: prev.tasks.map(ex => ex.id === t.id ? t : ex) }));
  const handleDeleteTask = (id: string) => updateActiveClientData(prev => ({ tasks: prev.tasks.filter(t => t.id !== id) }));
  const handleAddBudgetItem = (item: BudgetLineItem) => updateActiveClientData(prev => ({ budgetItems: [...(prev.budgetItems || []), item] }));
  const handleRemoveBudgetItem = (id: string) => updateActiveClientData(prev => ({ budgetItems: prev.budgetItems.filter(i => i.id !== id) }));
  const handleUpdateProgress = (p: WizardProgress) => updateActiveClientData(() => ({ wizardProgress: p }));

  const handleSaveSettings = (
      cw: ConnectWiseConfig, 
      jira: JiraConfig, 
      conf: ConfluenceConfig, 
      branding?: BrandingConfig,
      m365?: IntegrationConfig,
      aws?: IntegrationConfig,
      google?: IntegrationConfig,
      siem?: IntegrationConfig
  ) => {
      updateActiveClientData(() => ({ 
          cwConfig: cw, 
          jiraConfig: jira, 
          confluenceConfig: conf, 
          mspBranding: branding,
          m365Config: m365,
          awsConfig: aws,
          googleConfig: google,
          siemConfig: siem
      }));
  };

  const handleReloadStandards = () => {
      const cleanReqs = JSON.parse(JSON.stringify(REQUIREMENTS_DATA));
      updateActiveClientData((prev) => {
          const mergedReqs = cleanReqs.map((freshReq: Requirement) => {
              const existing = prev.requirements.find(r => r.id === freshReq.id);
              if (existing) {
                  return {
                      ...freshReq,
                      objectives: freshReq.objectives.map((freshObj, idx) => ({
                          ...freshObj,
                          status: existing.objectives[idx]?.status || 'pending'
                      })),
                      response: existing.response,
                      scopeStatus: existing.scopeStatus,
                      comments: existing.comments,
                      poam: existing.poam
                  };
              }
              return freshReq;
          });
          return { requirements: mergedReqs };
      });
      alert('Standards Library successfully seeded into this client.');
  };

  const selectedRequirement = requirements.find(r => r.id === selectedRequirementId);
  const isMSPUser = currentUser.role === 'MSP_ADMIN' || currentUser.role === 'MSP_TECH';

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="bg-slate-900 text-slate-200 h-16 shrink-0 shadow-md z-50">
          <div className="max-w-[1920px] mx-auto px-6 h-full flex items-center justify-between">
              
              {/* Left: Logo & Title */}
              <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                      {mspBranding?.logoUrl ? (
                          <img src={mspBranding.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
                      ) : (
                          <Shield className="text-blue-500 fill-blue-500/20" size={24} />
                      )}
                      <span>Cuallee Cyber</span>
                  </div>

                  {/* Main Menu Links */}
                  <div className="hidden md:flex items-center gap-2 h-16">
                      <button 
                        onClick={() => setCurrentView(isMSPUser ? AppView.MSP_DASHBOARD : AppView.DASHBOARD)}
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${[AppView.MSP_DASHBOARD, AppView.DASHBOARD].includes(currentView) ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                      >
                          Dashboard
                      </button>

                      <NavDropdown label="Compliance" icon={ListChecks}>
                          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment</div>
                          <NavItem label="Requirements List" icon={ListChecks} isActive={currentView === AppView.REQUIREMENTS} onClick={() => setCurrentView(AppView.REQUIREMENTS)} />
                          <NavItem label="SPRS Scorecard" icon={TrendingUp} isActive={currentView === AppView.SPRS_SCORECARD} onClick={() => setCurrentView(AppView.SPRS_SCORECARD)} />
                          <NavItem label="Onboarding Wizard" icon={Wand2} isActive={currentView === AppView.WIZARD} onClick={() => setCurrentView(AppView.WIZARD)} />
                          <div className="my-1 border-b border-slate-100"></div>
                          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Reports</div>
                          <NavItem label="Compliance Reports" icon={BarChart3} isActive={currentView === AppView.REPORTS} onClick={() => setCurrentView(AppView.REPORTS)} />
                          <NavItem label="Doc Generator" icon={FileText} isActive={currentView === AppView.DOC_GENERATOR} onClick={() => setCurrentView(AppView.DOC_GENERATOR)} />
                      </NavDropdown>

                      <NavDropdown label="Risk & Tools" icon={AlertTriangle}>
                          <NavItem label="Risk Register" icon={AlertTriangle} isActive={currentView === AppView.RISK_REGISTER} onClick={() => setCurrentView(AppView.RISK_REGISTER)} />
                          <NavItem label="POA&M Projects" icon={KanbanSquare} isActive={currentView === AppView.PROJECTS} onClick={() => setCurrentView(AppView.PROJECTS)} />
                          <NavItem label="Budget & ROI" icon={Calculator} isActive={currentView === AppView.BUDGET} onClick={() => setCurrentView(AppView.BUDGET)} />
                          <NavItem label="Training Center" icon={GraduationCap} isActive={currentView === AppView.TRAINING} onClick={() => setCurrentView(AppView.TRAINING)} />
                      </NavDropdown>

                      <NavDropdown label="Assets" icon={Package}>
                          <NavItem label="Asset Inventory" icon={Package} isActive={currentView === AppView.INVENTORY} onClick={() => setCurrentView(AppView.INVENTORY)} />
                          <NavItem label="Identity / Users" icon={Users} isActive={currentView === AppView.USERS} onClick={() => setCurrentView(AppView.USERS)} />
                          <NavItem label="Network Map" icon={Network} isActive={currentView === AppView.NETWORK_ANALYSIS} onClick={() => setCurrentView(AppView.NETWORK_ANALYSIS)} />
                          <NavItem label="Vendor Management" icon={Building2} isActive={currentView === AppView.VENDORS} onClick={() => setCurrentView(AppView.VENDORS)} />
                      </NavDropdown>

                      {isMSPUser && (
                          <NavDropdown label="Admin" icon={SettingsIcon}>
                              <NavItem label="Client Manager" icon={Building2} isActive={currentView === AppView.ORGANIZATION_MANAGER} onClick={() => setCurrentView(AppView.ORGANIZATION_MANAGER)} />
                              <NavItem label="Settings & Integrations" icon={SettingsIcon} isActive={currentView === AppView.SETTINGS} onClick={() => setCurrentView(AppView.SETTINGS)} />
                              <div className="my-1 border-b border-slate-100"></div>
                              <NavItem label="For The Auditor" icon={Briefcase} isActive={currentView === AppView.AUDITOR_PORTAL} onClick={() => setCurrentView(AppView.AUDITOR_PORTAL)} />
                          </NavDropdown>
                      )}
                  </div>
              </div>

              {/* Right: Controls & User */}
              <div className="flex items-center gap-4">
                  {/* Framework Selector */}
                  <div className="relative group hidden lg:block">
                        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                            <span>{activeFramework.id}</span>
                            <ChevronsUpDown size={12} />
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-xl p-2 hidden group-hover:block border border-slate-200 z-50">
                            {FRAMEWORKS.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFramework(f)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${activeFramework.id === f.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'}`}
                                >
                                    {f.name}
                                </button>
                            ))}
                        </div>
                  </div>

                  {/* AI Chat Toggle */}
                  <button 
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`p-2 rounded-full transition-all ${isChatOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'bg-slate-800 text-indigo-400 hover:bg-indigo-900 hover:text-white'}`}
                    title="AI Assistant"
                  >
                      <MessageSquare size={20} />
                  </button>

                  <div className="h-6 w-px bg-slate-700 mx-1"></div>

                  {/* User Profile */}
                  <div className="flex items-center gap-3">
                      <div className="text-right hidden md:block">
                          <div className="text-sm font-bold text-white">{currentUser.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{activeClient.name}</div>
                      </div>
                      <div className="relative group">
                          <button className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow border-2 border-slate-700 group-hover:border-white transition-all">
                              {currentUser.name.charAt(0)}
                          </button>
                          {/* Profile Dropdown */}
                          <div className="absolute top-full right-0 mt-2 w-48 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-1 hidden group-hover:block z-50">
                              {/* Client Switching via dropdown if more than 1 available */}
                              {clients.length > 1 && (
                                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                                      <p className="text-xs text-slate-500 mb-1">Switch Client:</p>
                                      <select 
                                        value={activeClientId} 
                                        onChange={(e) => {
                                            setActiveClientId(e.target.value);
                                            localStorage.setItem('activeOrgId', e.target.value);
                                        }}
                                        className="w-full text-sm border rounded p-1 bg-slate-50"
                                      >
                                          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                      </select>
                                  </div>
                              )}
                              <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                  <LogOut size={14} /> Sign Out
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex overflow-hidden relative">
            {currentView === AppView.MSP_DASHBOARD && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <MSPDashboard 
                        clients={clients} 
                        clientDataStore={clientDataStore}
                        onSelectClient={(id) => {
                            setActiveClientId(id);
                            localStorage.setItem('activeOrgId', id);
                            setCurrentView(AppView.DASHBOARD);
                        }}
                    />
                </div>
            )}

            {currentView === AppView.ORGANIZATION_MANAGER && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <OrganizationManager 
                        clients={clients}
                        clientDataStore={clientDataStore}
                        onAddClient={(c) => {
                            setClients([...clients, c]);
                            setClientDataStore(prev => ({
                                ...prev,
                                [c.id]: createInitialClientData(false)
                            }));
                        }}
                        onUpdateClient={(c) => setClients(clients.map(ex => ex.id === c.id ? c : ex))}
                        onDeleteClient={(id) => setClients(clients.filter(c => c.id !== id))}
                        onUpdateClientData={handleUpdateClientData}
                    />
                </div>
            )}

            {currentView === AppView.DASHBOARD && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <Dashboard 
                        requirements={requirements} 
                        artifacts={artifacts}
                        activeFramework={activeFramework}
                    />
                </div>
            )}

            {currentView === AppView.WIZARD && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <ComplianceWizard 
                        requirements={requirements}
                        artifacts={artifacts}
                        assets={assets}
                        wizardProgress={wizardProgress}
                        onUpdateRequirement={handleUpdateRequirement}
                        onAddArtifact={handleAddArtifact}
                        onRemoveArtifact={handleRemoveArtifact}
                        onAddAsset={handleAddAsset}
                        onDeleteAsset={handleDeleteAsset}
                        onUpdateProgress={handleUpdateProgress}
                        activeFrameworkId={activeFramework.id}
                        onComplete={() => setCurrentView(AppView.DASHBOARD)}
                    />
                </div>
            )}

            {currentView === AppView.REQUIREMENTS && (
                <>
                    <RequirementsList 
                        requirements={requirements} 
                        selectedReqId={selectedRequirementId}
                        onSelectReq={handleSelectReq}
                        activeFrameworkId={activeFramework.id}
                    />
                    {selectedRequirement ? (
                        <RequirementDetail 
                            requirement={selectedRequirement}
                            onUpdateRequirement={handleUpdateRequirement}
                            allArtifacts={artifacts}
                            onAddArtifact={handleAddArtifact}
                            onRemoveArtifact={handleRemoveArtifact}
                            tickets={tickets}
                            onAddTicket={handleAddTicket}
                            cwConfig={cwConfig}
                            jiraConfig={jiraConfig}
                            currentUser={currentUser}
                            m365Config={m365Config}
                            awsConfig={awsConfig}
                            siemConfig={siemConfig}
                            activeClientId={activeClientId} // PASS ACTIVE CLIENT ID FOR UPLOADS
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                            <ListChecks size={64} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">Select a requirement to view details</p>
                        </div>
                    )}
                </>
            )}

            {currentView === AppView.RISK_REGISTER && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <RiskRegister 
                        risks={risks}
                        onAddRisk={handleAddRisk}
                        onUpdateRisk={handleUpdateRisk}
                        onDeleteRisk={handleDeleteRisk}
                    />
                </div>
            )}

            {currentView === AppView.INVENTORY && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <Inventory 
                        assets={assets}
                        onAddAsset={handleAddAsset}
                        onDeleteAsset={handleDeleteAsset}
                    />
                </div>
            )}

            {currentView === AppView.VENDORS && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <VendorManager 
                        vendors={vendors}
                        onAddVendor={handleAddVendor}
                        onUpdateVendor={handleUpdateVendor}
                        onDeleteVendor={handleDeleteVendor}
                    />
                </div>
            )}

            {currentView === AppView.USERS && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <UserManagement 
                        users={users}
                        onAddUser={(u) => updateActiveClientData(prev => ({ users: [...prev.users, u] }))}
                        onUpdateUser={(u) => updateActiveClientData(prev => ({ users: prev.users.map(ex => ex.id === u.id ? u : ex) }))}
                        onDeleteUser={(id) => updateActiveClientData(prev => ({ users: prev.users.filter(u => u.id !== id) }))}
                    />
                </div>
            )}

            {currentView === AppView.NETWORK_ANALYSIS && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <NetworkAnalyzer />
                </div>
            )}

            {currentView === AppView.DOC_GENERATOR && (
                 <div className="flex-1 overflow-y-auto bg-slate-50">
                    <DocGenerator 
                        clientName={activeClient.name} 
                        clientBranding={activeClient.branding}
                        mspBranding={mspBranding}
                        confluenceConfig={confluenceConfig} 
                        requirements={requirements} 
                    />
                 </div>
            )}

            {currentView === AppView.PROJECTS && (
                <div className="flex-1 overflow-hidden bg-slate-50">
                    <ProjectBoard 
                        tasks={tasks}
                        onAddTask={handleAddTask}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        requirements={requirements}
                        risks={risks}
                        users={users}
                    />
                </div>
            )}

            {currentView === AppView.BUDGET && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <BudgetCalculator 
                        requirements={requirements}
                        budgetItems={budgetItems}
                        onAddItem={handleAddBudgetItem}
                        onRemoveItem={handleRemoveBudgetItem}
                    />
                </div>
            )}

            {currentView === AppView.TRAINING && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <TrainingCenter />
                </div>
            )}

            {currentView === AppView.REPORTS && (
                <div className="flex-1 overflow-hidden bg-slate-50">
                    <Reports requirements={requirements} onUpdateRequirement={handleUpdateRequirement} />
                </div>
            )}

            {currentView === AppView.SPRS_SCORECARD && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <SPRSScorecard 
                        requirements={requirements}
                        activeFrameworkId={activeFramework.id}
                    />
                </div>
            )}

            {currentView === AppView.AUDITOR_PORTAL && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <AuditorPortal 
                        client={activeClient}
                        requirements={requirements}
                        artifacts={artifacts}
                        risks={risks}
                    />
                </div>
            )}

            {currentView === AppView.SETTINGS && (
                 <div className="flex-1 overflow-y-auto bg-slate-50">
                    <Settings 
                        config={cwConfig} 
                        jiraConfig={jiraConfig} 
                        confluenceConfig={confluenceConfig}
                        mspBranding={mspBranding}
                        m365Config={m365Config}
                        awsConfig={awsConfig}
                        googleConfig={googleConfig}
                        siemConfig={siemConfig}
                        onSave={handleSaveSettings} 
                        onReloadStandards={handleReloadStandards}
                    />
                 </div>
            )}
      </main>

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;