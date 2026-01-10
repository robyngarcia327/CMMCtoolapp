
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from "react-oidc-context";
import { 
  Shield, 
  ListChecks, 
  MessageSquare,
  Package,
  Users,
  TrendingUp,
  Wand2,
  LogOut,
  ChevronDown,
  Loader2,
  Eye,
  Building2,
  FileText,
  Lock,
  Globe,
  AlertTriangle,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  ChevronRight
} from 'lucide-react';

import { FRAMEWORKS, createInitialClientData } from './data/standards';
import { Requirement, Artifact, AppView, Ticket, User, Framework, Client, ClientData, CognitoGroup, Risk, WizardProgress, Asset } from './types';
import { RequirementsList } from './components/RequirementsList';
import { RequirementDetail } from './components/RequirementDetail';
import { AIChat } from './components/AIChat';
import { Inventory } from './components/Inventory';
import { UserManagement } from './components/UserManagement';
import { Reports } from './components/Reports';
import { SPRSScorecard } from './components/SPRSScorecard';
import { ComplianceWizard } from './components/ComplianceWizard';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding'; 
import { Dashboard } from './components/Dashboard'; 
import { AssessorPortal } from './components/AssessorPortal';
import { OrganizationManager } from './components/OrganizationManager';
import { GlobalAdminPortal } from './components/GlobalAdminPortal';
import { RiskRegister } from './components/RiskRegister';
import { api } from './services/api';

const SidebarItem = ({ 
  label, 
  icon: Icon, 
  isActive, 
  onClick, 
  badge 
}: { 
  label: string, 
  icon: any, 
  isActive: boolean, 
  onClick: () => void,
  badge?: string 
}) => (
  <button 
    onClick={onClick}
    className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`} />
    <span className="flex-1 text-left text-sm whitespace-nowrap">{label}</span>
    {badge && (
      <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
        {badge}
      </span>
    )}
  </button>
);

// Added optional children to fix TypeScript errors (e.g., on lines 345, 351, 358, 365, 372) where children were reported missing in JSX usage
const SidebarSection = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="mb-6">
    <div className="px-4 mb-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{title}</div>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const App: React.FC = () => {
  const auth = useAuth();
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false); 
  const [hasCheckedOrgs, setHasCheckedOrgs] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClientId, setActiveClientId] = useState<string>('');
  const [activeFramework, setActiveFramework] = useState<Framework>(FRAMEWORKS[0]);
  const [clientDataStore, setClientDataStore] = useState<Record<string, ClientData>>({});
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);
  const fetchAttempted = useRef(false);

  // --- STATE HANDLERS ---
  const handleUpdateRequirement = (updatedReq: Requirement) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
      ...prev,
      [activeClientId]: {
        ...prev[activeClientId],
        requirements: prev[activeClientId].requirements.map(r => r.id === updatedReq.id ? updatedReq : r)
      }
    }));
  };

  const handleUpdateWizardProgress = (progress: WizardProgress) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
      ...prev,
      [activeClientId]: {
        ...prev[activeClientId],
        wizardProgress: progress
      }
    }));
  };

  const handleAddAsset = (asset: Asset) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
      ...prev,
      [activeClientId]: {
        ...prev[activeClientId],
        assets: [...prev[activeClientId].assets, asset]
      }
    }));
  };

  const handleDeleteAsset = (id: string) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
      ...prev,
      [activeClientId]: {
        ...prev[activeClientId],
        assets: prev[activeClientId].assets.filter(a => a.id !== id)
      }
    }));
  };

  const handleAddArtifact = (artifact: Artifact) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
      ...prev,
      [activeClientId]: {
        ...prev[activeClientId],
        artifacts: [...prev[activeClientId].artifacts, artifact]
      }
    }));
  };

  const handleRemoveArtifact = (id: string) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
      ...prev,
      [activeClientId]: {
        ...prev[activeClientId],
        artifacts: prev[activeClientId].artifacts.filter(a => a.id !== id)
      }
    }));
  };

  // DEBUG: Monitor Auth State
  useEffect(() => {
    if (auth.isAuthenticated) {
      console.log("Auth Identity Check:", auth.user?.profile);
    }
  }, [auth.isAuthenticated, auth.user]);

  const userGroups = useMemo(() => {
    const groups = auth.user?.profile?.['cognito:groups'];
    return (Array.isArray(groups) ? groups : []) as CognitoGroup[];
  }, [auth.user]);

  const isGlobalAdmin = userGroups.includes('Application_Administrator');
  const isTenantAdmin = userGroups.includes('Tenant_Admin');
  const isAuditor = userGroups.includes('Auditor');

  const loadOrganizations = useCallback(async () => {
    const idToken = auth.user?.id_token;
    if (!auth.isAuthenticated || !idToken) return;
    setIsDataLoading(true);
    try {
      const apiOrgs = await api.getOrgs(idToken);
      const mappedClients: Client[] = apiOrgs.map((o: any) => ({
        id: o.orgId || o.id,
        name: o.name || 'Organization',
        domain: o.domain || 'unverified.com',
        industry: o.industry || 'Defense Industrial Base', 
        contactName: auth.user?.profile.email || 'Admin',
        logoInitial: (o.name || 'O').charAt(0).toUpperCase(),
        primaryFramework: 'NIST-CMMC',
        nextAuditDate: Date.now() + 31536000000,
        accountManager: 'Self-Managed',
        isParent: !!o.isParent
      }));
      setClients(mappedClients);
      if (mappedClients.length > 0) {
        const selectedId = mappedClients[0].id;
        setActiveClientId(selectedId);
        setClientDataStore(prev => {
          const nextStore = { ...prev };
          mappedClients.forEach(c => {
            if (!nextStore[c.id]) {
              nextStore[c.id] = createInitialClientData(false);
              
              // IDENTITY FIX: Better parsing of names to avoid "rgg" email prefix issues
              const profile = auth.user?.profile;
              const displayName = profile?.name || 
                                (profile?.given_name ? `${profile.given_name} ${profile.family_name || ''}`.trim() : null) ||
                                profile?.nickname || 
                                (profile?.email || 'User').split('@')[0];

              nextStore[c.id].users = [{
                id: profile?.sub || 'unknown',
                name: displayName,
                email: profile?.email || '',
                organizationId: c.id,
                domain: c.domain,
                role: userGroups[0] || 'Admin_Created_Users',
                department: 'Compliance',
                lastLogin: Date.now(),
                mfaEnabled: true,
                hasPasskey: false,
                isCuiAuthorized: true
              }];
            }
          });
          return nextStore;
        });
      }
      setHasCheckedOrgs(true);
    } catch (e) {
      console.error("Load failed", e);
    } finally {
      setIsDataLoading(false);
    }
  }, [auth.isAuthenticated, auth.user, userGroups]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id_token && !fetchAttempted.current) {
      fetchAttempted.current = true;
      loadOrganizations();
    }
  }, [auth.isAuthenticated, auth.user?.id_token, loadOrganizations]);

  const handleGlobalPromote = async (userId: string, group: CognitoGroup) => {
    if (!auth.user?.id_token) return;
    try {
      await api.promoteUser(auth.user.id_token, userId, group);
      alert("Cognito Group updated.");
      loadOrganizations();
    } catch (e: any) { alert(e.message); }
  };

  const handleAddRisk = (risk: Risk) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
      ...prev,
      [activeClientId]: {
        ...prev[activeClientId],
        risks: [...prev[activeClientId].risks, risk]
      }
    }));
  };

  const handleDeleteRisk = (riskId: string) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
      ...prev,
      [activeClientId]: {
        ...prev[activeClientId],
        risks: prev[activeClientId].risks.filter(r => r.id !== riskId)
      }
    }));
  };

  const handleLogout = () => auth.signoutRedirect();
  
  if (auth.isLoading) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (!auth.isAuthenticated) return <Login />;
  if (isDataLoading && !hasCheckedOrgs) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  if (hasCheckedOrgs && !activeClientId) {
    return (
      <Onboarding 
        user={{ id: auth.user?.profile.sub || '', name: '', email: auth.user?.profile.email || '', role: 'Admin_Created_Users', domain: (auth.user?.profile.email || '').split('@')[1], organizationId: '', department: '', lastLogin: 0, mfaEnabled: false, hasPasskey: false, isCuiAuthorized: false }}
        onCreateOrganization={async (name, domain) => {
          if (!auth.user?.id_token) return;
          setIsDataLoading(true);
          try {
            await api.createOrg(auth.user.id_token, name, domain);
            fetchAttempted.current = false;
            await loadOrganizations();
          } catch (e) { setIsDataLoading(false); }
        }}
        onRefresh={() => { fetchAttempted.current = false; loadOrganizations(); }}
        debugTokens={{ idToken: auth.user?.id_token }}
      />
    );
  }

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];
  const activeData = clientDataStore[activeClientId];
  if (!activeData) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 size={48} className="animate-spin" /></div>;

  const currentUser = activeData.users[0];
  const allUsersAcrossTenants = (Object.values(clientDataStore) as ClientData[]).flatMap(d => d.users);

  // Helper to get view labels for the Top Bar
  const getViewLabel = (view: AppView) => {
    switch(view) {
      case AppView.DASHBOARD: return "Executive Dashboard";
      case AppView.REQUIREMENTS: return "Control Analysis";
      case AppView.SPRS_SCORECARD: return "DoD SPRS Scorecard";
      case AppView.WIZARD: return "Compliance Wizard";
      case AppView.RISK_REGISTER: return "Risk Register (FAIR)";
      case AppView.INVENTORY: return "Asset Inventory";
      case AppView.REPORTS: return "Compliance Reports";
      case AppView.ASSESSOR_PORTAL: return "Assessor Interface";
      case AppView.ORGANIZATION_MANAGER: return "Tenant Settings";
      case AppView.USERS: return "Team Management";
      case AppView.GLOBAL_ADMIN: return "Global Command Center";
      default: return "Cuallee Cyber";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* VERTICAL SIDEBAR */}
      <aside className="w-72 bg-slate-950 text-slate-300 flex flex-col shrink-0 z-50 border-r border-slate-900 shadow-2xl">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/50">
              <Shield size={24} className="text-white" />
            </div>
            <span className="tracking-tighter uppercase font-black text-xl leading-none">Cuallee<br/><span className="text-blue-500">Cyber</span></span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 scrollbar-hide">
          <SidebarSection title="General">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" isActive={currentView === AppView.DASHBOARD} onClick={() => setCurrentView(AppView.DASHBOARD)} />
            <SidebarItem icon={Wand2} label="Step-by-Step Wizard" isActive={currentView === AppView.WIZARD} onClick={() => setCurrentView(AppView.WIZARD)} badge="New" />
          </SidebarSection>

          {!isAuditor && (
            <SidebarSection title="Compliance">
              <SidebarItem icon={ListChecks} label="Control Details" isActive={currentView === AppView.REQUIREMENTS} onClick={() => setCurrentView(AppView.REQUIREMENTS)} />
              <SidebarItem icon={TrendingUp} label="SPRS Scorecard" isActive={currentView === AppView.SPRS_SCORECARD} onClick={() => setCurrentView(AppView.SPRS_SCORECARD)} />
              <SidebarItem icon={FileText} label="Compliance Reports" isActive={currentView === AppView.REPORTS} onClick={() => setCurrentView(AppView.REPORTS)} />
            </SidebarSection>
          )}

          <SidebarSection title="Governance">
            <SidebarItem icon={AlertTriangle} label="Risk Register" isActive={currentView === AppView.RISK_REGISTER} onClick={() => setCurrentView(AppView.RISK_REGISTER)} />
            <SidebarItem icon={Package} label="Asset Inventory" isActive={currentView === AppView.INVENTORY} onClick={() => setCurrentView(AppView.INVENTORY)} />
            <SidebarItem icon={ClipboardCheck} label="Assessor Portal" isActive={currentView === AppView.ASSESSOR_PORTAL} onClick={() => setCurrentView(AppView.ASSESSOR_PORTAL)} />
          </SidebarSection>

          {(isTenantAdmin || isGlobalAdmin) && (
            <SidebarSection title="Administration">
              <SidebarItem icon={Settings} label="Tenant Settings" isActive={currentView === AppView.ORGANIZATION_MANAGER} onClick={() => setCurrentView(AppView.ORGANIZATION_MANAGER)} />
              <SidebarItem icon={Users} label="Team Access" isActive={currentView === AppView.USERS} onClick={() => setCurrentView(AppView.USERS)} />
            </SidebarSection>
          )}

          {isGlobalAdmin && (
            <SidebarSection title="System">
              <SidebarItem icon={Globe} label="Global Admin" isActive={currentView === AppView.GLOBAL_ADMIN} onClick={() => setCurrentView(AppView.GLOBAL_ADMIN)} />
            </SidebarSection>
          )}
        </nav>

        <div className="p-4 border-t border-slate-900 mt-auto">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Organization</div>
            <div className="text-xs font-bold text-white truncate uppercase">{activeClient.name}</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* TOP BAR */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{getViewLabel(currentView)}</h2>
             {selectedRequirementId && currentView === AppView.REQUIREMENTS && (
               <>
                 <ChevronRight size={16} className="text-slate-300" />
                 <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{selectedRequirementId}</span>
               </>
             )}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${isChatOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <MessageSquare size={16} /> 
              {isChatOpen ? 'Close Assistant' : 'AI Help'}
            </button>

            <div className="h-8 w-px bg-slate-200" />

            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-black text-slate-900 leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{userGroups[0]?.replace(/_/g, ' ') || 'Member'}</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black border-4 border-white shadow-xl shadow-blue-600/20 text-lg">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-200 py-4 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-6 py-4 border-b border-slate-100 mb-2">
                       <div className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Active Identity</div>
                       <div className="text-sm font-black text-slate-900 truncate">{currentUser.email}</div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-6 py-4 text-xs text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-black uppercase tracking-widest"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          <div className="h-full w-full overflow-y-auto bg-slate-50/50">
            {currentView === AppView.DASHBOARD && <Dashboard requirements={activeData.requirements} artifacts={activeData.artifacts} activeFramework={activeFramework} onNavigate={setCurrentView} onToggleChat={() => setIsChatOpen(!isChatOpen)} />}
            {currentView === AppView.GLOBAL_ADMIN && <GlobalAdminPortal tenants={clients} allUsers={allUsersAcrossTenants} onPromoteUser={handleGlobalPromote} onDeleteTenant={() => {}} onDeleteUser={() => {}} />}
            {currentView === AppView.REQUIREMENTS && (
              <div className="flex h-full overflow-hidden">
                <RequirementsList requirements={activeData.requirements} selectedReqId={selectedRequirementId} onSelectReq={(r) => setSelectedRequirementId(r.id)} activeFrameworkId={activeFramework.id} />
                {selectedRequirementId ? (
                  <RequirementDetail requirement={activeData.requirements.find(r => r.id === selectedRequirementId)!} onUpdateRequirement={handleUpdateRequirement} allArtifacts={activeData.artifacts} onAddArtifact={handleAddArtifact} onRemoveArtifact={handleRemoveArtifact} tickets={[]} onAddTicket={() => {}} cwConfig={activeData.cwConfig} jiraConfig={activeData.jiraConfig} currentUser={currentUser} activeClientId={activeClientId} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                    <ListChecks size={80} className="opacity-10 mb-4" />
                    <p className="text-lg font-black uppercase tracking-widest">Select a Control to Audit</p>
                  </div>
                )}
              </div>
            )}
            {currentView === AppView.RISK_REGISTER && <RiskRegister risks={activeData.risks} onAddRisk={handleAddRisk} onUpdateRisk={() => {}} onDeleteRisk={handleDeleteRisk} />}
            {currentView === AppView.REPORTS && <Reports requirements={activeData.requirements} risks={activeData.risks} activeFrameworkId={activeFramework.id} sspMetadata={activeData.sspMetadata} />}
            {currentView === AppView.SPRS_SCORECARD && <SPRSScorecard requirements={activeData.requirements} activeFrameworkId={activeFramework.id} />}
            {currentView === AppView.ASSESSOR_PORTAL && <AssessorPortal client={activeClient} requirements={activeData.requirements} artifacts={activeData.artifacts} risks={activeData.risks} assets={activeData.assets} activeFramework={activeFramework} />}
            {currentView === AppView.WIZARD && <ComplianceWizard requirements={activeData.requirements} artifacts={activeData.artifacts} assets={activeData.assets} wizardProgress={activeData.wizardProgress} onUpdateRequirement={handleUpdateRequirement} onAddArtifact={handleAddArtifact} onRemoveArtifact={handleRemoveArtifact} onAddAsset={handleAddAsset} onDeleteAsset={handleDeleteAsset} onUpdateProgress={handleUpdateWizardProgress} activeFrameworkId={activeFramework.id} onComplete={() => setCurrentView(AppView.DASHBOARD)} />}
            {currentView === AppView.USERS && <UserManagement users={activeData.users} onAddUser={() => {}} onUpdateUser={() => {}} onDeleteUser={() => {}} />}
            {currentView === AppView.ORGANIZATION_MANAGER && <OrganizationManager clients={clients} clientDataStore={clientDataStore} activeClientId={activeClientId} onAddClient={() => {}} onUpdateClient={() => {}} onDeleteClient={() => {}} onUpdateClientData={() => {}} />}
            {currentView === AppView.INVENTORY && <Inventory assets={activeData.assets} onAddAsset={handleAddAsset} onDeleteAsset={handleDeleteAsset} />}
          </div>
        </main>

        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
};

export default App;
