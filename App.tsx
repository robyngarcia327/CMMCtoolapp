
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  RefreshCw,
  Map
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
const NavDropdown = ({ label, icon: Icon, children }: React.PropsWithChildren<{ label: string, icon: any }>) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="relative h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
        <button className="flex items-center gap-1 px-3 py-2 text-slate-300 hover:text-white font-medium transition-colors">
            <Icon size={16} /> {label} <ChevronDown size={14} className={`opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-[80%] left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 animate-in fade-in zoom-in-95 duration-100 z-[100]">
              {children}
          </div>
        )}
    </div>
  );
};

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
  const [isFrameworkMenuOpen, setIsFrameworkMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Data State
  const [isDataLoading, setIsDataLoading] = useState(false); 
  const [hasCheckedOrgs, setHasCheckedOrgs] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Authenticating...");
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClientId, setActiveClientId] = useState<string>('');
  const [activeFramework, setActiveFramework] = useState<Framework>(FRAMEWORKS[0]);
  const [clientDataStore, setClientDataStore] = useState<Record<string, ClientData>>({});
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);
  
  // Onboarding/Fetch State
  const [orgFetchError, setOrgFetchError] = useState<string | null>(null);
  const [creationStatus, setCreationStatus] = useState<'idle' | 'creating' | 'verifying' | 'failed_verification'>('idle');

  const fetchAttempted = useRef(false);

  const loadOrganizations = useCallback(async () => {
      if (!auth.isAuthenticated || !auth.user?.id_token) return;

      setIsDataLoading(true);
      setLoadingMessage("Checking Organization Memberships...");
      setOrgFetchError(null);
      
      try {
          const apiOrgs = await api.getOrgs(auth.user.id_token);
          
          const mappedClients: Client[] = apiOrgs.map((o: any) => ({
              id: o.orgId,
              name: o.name,
              industry: o.industry || 'Unknown', 
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

              setClientDataStore(prev => {
                  const nextStore = { ...prev };
                  mappedClients.forEach(c => {
                      if (!nextStore[c.id]) {
                          nextStore[c.id] = createInitialClientData(false);
                      }
                  });
                  return nextStore;
              });

              api.getEvidenceList(auth.user.id_token, selectedId).then(evidence => {
                  setClientDataStore(prev => ({
                      ...prev,
                      [selectedId]: { ...prev[selectedId], artifacts: evidence }
                  }));
              }).catch(e => console.warn(`Failed to fetch evidence for ${selectedId}`, e));
          } else {
              setActiveClientId('');
          }
          setHasCheckedOrgs(true);
      } catch (e: any) {
          console.error("Failed to load organizations", e);
          setOrgFetchError(e.message || "Could not load organization data.");
          setHasCheckedOrgs(false); 
      } finally {
          setIsDataLoading(false);
      }
  }, [auth.isAuthenticated, auth.user]);

  useEffect(() => {
      if (auth.isAuthenticated && auth.user?.id_token && !fetchAttempted.current) {
          fetchAttempted.current = true;
          loadOrganizations();
      }
  }, [auth.isAuthenticated, auth.user?.id_token, loadOrganizations]);

  const handleLogout = () => {
      auth.removeUser();
      localStorage.removeItem('activeOrgId');
      window.location.reload();
  };
  
  if (auth.isLoading) {
      return (
          <div className="flex h-screen items-center justify-center bg-slate-900 flex-col gap-4">
              <Loader2 size={48} className="animate-spin text-blue-500" />
              <h2 className="text-xl font-bold text-white">Connecting...</h2>
          </div>
      );
  }

  if (auth.error || !auth.isAuthenticated) {
      return <Login onLogin={() => auth.signinRedirect()} error={auth.error} />;
  }

  if (isDataLoading || !hasCheckedOrgs) {
      return (
          <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
              <Loader2 size={48} className="animate-spin text-blue-600" />
              <h2 className="text-xl font-bold text-slate-700">{loadingMessage}</h2>
              <p className="text-slate-500 text-sm">Verifying secure session...</p>
          </div>
      );
  }

  if (!activeClientId) {
      return (
          <Onboarding 
            user={{
                id: auth.user?.profile.sub || '', 
                name: '', email: auth.user?.profile.email || '', role: 'CLIENT_USER', 
                organizationId: '', department: '', lastLogin: 0, mfaEnabled: false, hasPasskey: false, isCuiAuthorized: false 
            }}
            onCreateOrganization={(name) => {}} // Placeholder logic
            onRefresh={() => loadOrganizations()}
            creationStatus={creationStatus}
            errorMessage={orgFetchError}
            debugTokens={{ idToken: auth.user?.id_token }}
          />
      );
  }

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];
  const activeData = clientDataStore[activeClientId];
  
  if (!activeData) return (
      <div className="p-10 flex flex-col items-center justify-center gap-4 h-screen bg-slate-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-sm">
            <AlertTriangle className="text-amber-500 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Sync Interrupted</h2>
            <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                <RefreshCw size={16} /> Resume Session
            </button>
          </div>
      </div>
  );

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

  const requirements = activeData.requirements;
  const artifacts = activeData.artifacts;
  const tickets = activeData.tickets;

  const handleSelectReq = (req: Requirement) => setSelectedRequirementId(req.id);
  const handleUpdateRequirement = (updated: Requirement) => {
    updateActiveClientData(prev => ({
      requirements: prev.requirements.map(r => r.id === updated.id ? updated : r)
    }));
  };
  const handleAddArtifact = (a: Artifact) => updateActiveClientData(prev => ({ artifacts: [...prev.artifacts, a] }));
  const handleRemoveArtifact = (id: string) => updateActiveClientData(prev => ({ artifacts: prev.artifacts.filter(a => a.id !== id) }));
  const handleAddTicket = (t: Ticket) => updateActiveClientData(prev => ({ tickets: [...prev.tickets, t] }));

  const selectedRequirement = requirements.find(r => r.id === selectedRequirementId);
  const isMSPUser = currentUser.role === 'MSP_ADMIN' || currentUser.role === 'MSP_TECH';

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Click-Away Backdrop for mobile/dropdowns */}
      {(isProfileMenuOpen || isFrameworkMenuOpen) && (
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => { setIsProfileMenuOpen(false); setIsFrameworkMenuOpen(false); }}></div>
      )}

      <header className="bg-slate-900 text-slate-200 h-16 shrink-0 shadow-md z-50">
          <div className="max-w-[1920px] mx-auto px-6 h-full flex items-center justify-between">
              <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                      <Shield className="text-blue-500" size={24} />
                      <span>Cuallee Cyber</span>
                  </div>
                  <div className="hidden md:flex items-center gap-2 h-16">
                      <button onClick={() => setCurrentView(AppView.DASHBOARD)} className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${currentView === AppView.DASHBOARD ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>Dashboard</button>
                      <NavDropdown label="Compliance" icon={ListChecks}>
                          <NavItem label="Outline Requirements" icon={Map} isActive={currentView === AppView.REQUIREMENTS} onClick={() => setCurrentView(AppView.REQUIREMENTS)} />
                          <NavItem label="SPRS Scorecard" icon={TrendingUp} isActive={currentView === AppView.SPRS_SCORECARD} onClick={() => setCurrentView(AppView.SPRS_SCORECARD)} />
                          <NavItem label="Onboarding Wizard" icon={Wand2} isActive={currentView === AppView.WIZARD} onClick={() => setCurrentView(AppView.WIZARD)} />
                      </NavDropdown>
                      <NavDropdown label="Assets" icon={Package}>
                          <NavItem label="Asset Inventory" icon={Package} isActive={currentView === AppView.INVENTORY} onClick={() => setCurrentView(AppView.INVENTORY)} />
                          <NavItem label="Identity" icon={Users} isActive={currentView === AppView.USERS} onClick={() => setCurrentView(AppView.USERS)} />
                          <NavItem label="Network Map" icon={Network} isActive={currentView === AppView.NETWORK_ANALYSIS} onClick={() => setCurrentView(AppView.NETWORK_ANALYSIS)} />
                      </NavDropdown>
                  </div>
              </div>

              <div className="flex items-center gap-4">
                  {/* Framework Dropdown (Click-based) */}
                  <div className="relative">
                        <button 
                          onClick={() => setIsFrameworkMenuOpen(!isFrameworkMenuOpen)}
                          className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${isFrameworkMenuOpen ? 'bg-slate-700 text-white border-blue-500' : 'text-slate-400 bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                        >
                            <span>{activeFramework.id}</span>
                            <ChevronDown size={12} className={`transition-transform ${isFrameworkMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isFrameworkMenuOpen && (
                          <div className="absolute top-full right-0 mt-2 w-64 bg-white text-slate-900 rounded-xl shadow-2xl p-2 border border-slate-200 z-[100] animate-in fade-in zoom-in-95 duration-100">
                                {FRAMEWORKS.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => { setActiveFramework(f); setIsFrameworkMenuOpen(false); }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 ${activeFramework.id === f.id ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                                    >
                                        <div className="font-bold">{f.id}</div>
                                        <div className="text-[10px] opacity-70">{f.name}</div>
                                    </button>
                                ))}
                          </div>
                        )}
                  </div>

                  <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-2 rounded-full transition-all ${isChatOpen ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'}`}><MessageSquare size={20} /></button>

                  <div className="h-6 w-px bg-slate-700 mx-1"></div>

                  {/* Profile Dropdown (Click-based) */}
                  <div className="flex items-center gap-3 relative">
                      <div className="text-right hidden md:block">
                          <div className="text-sm font-bold text-white">{currentUser.name}</div>
                          <div className="text-[10px] font-bold text-slate-400">{activeClient.name}</div>
                      </div>
                      <button 
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className={`w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow border-2 transition-all ${isProfileMenuOpen ? 'border-white' : 'border-slate-700'}`}
                      >
                          {currentUser.name.charAt(0)}
                      </button>
                      
                      {isProfileMenuOpen && (
                          <div className="absolute top-full right-0 mt-3 w-56 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-[100] animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="px-4 py-2 border-b border-slate-100 mb-2">
                                  <div className="text-xs font-bold text-slate-400 uppercase">Organization</div>
                                  <div className="text-sm font-bold truncate">{activeClient.name}</div>
                              </div>
                              <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                              >
                                  <LogOut size={16} /> Sign Out
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
            {currentView === AppView.DASHBOARD && <Dashboard requirements={requirements} artifacts={artifacts} activeFramework={activeFramework} />}
            {currentView === AppView.REQUIREMENTS && (
                <>
                    <RequirementsList requirements={requirements} selectedReqId={selectedRequirementId} onSelectReq={handleSelectReq} activeFrameworkId={activeFramework.id} />
                    {selectedRequirement ? (
                        <RequirementDetail requirement={selectedRequirement} onUpdateRequirement={handleUpdateRequirement} allArtifacts={artifacts} onAddArtifact={handleAddArtifact} onRemoveArtifact={handleRemoveArtifact} tickets={tickets} onAddTicket={handleAddTicket} cwConfig={activeData.cwConfig} jiraConfig={activeData.jiraConfig} currentUser={currentUser} activeClientId={activeClientId} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                            <ListChecks size={64} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">Select a requirement to outline your compliance strategy.</p>
                        </div>
                    )}
                </>
            )}
      </main>
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
