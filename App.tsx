
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
  Building2,
  FileText,
  Globe,
  AlertTriangle,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  ChevronRight,
  GraduationCap,
  Network,
  ClipboardList,
  Eye,
  FileSearch,
  Search,
  BarChart3,
  ShieldCheck,
  FileCheck
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
import { TrainingCenter } from './components/TrainingCenter';
import { NetworkAnalyzer } from './components/NetworkAnalyzer';
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
    className={`w-full group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 mb-0.5 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={18} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`} />
    <span className="flex-1 text-left text-sm whitespace-nowrap">{label}</span>
    {badge && (
      <span className="bg-blue-500/20 text-blue-400 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">
        {badge}
      </span>
    )}
  </button>
);

const SidebarSection = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="mb-5">
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

  // Identity logic refined
  const userDisplayName = useMemo(() => {
    const profile = auth.user?.profile;
    if (!profile) return 'Guest User';
    return profile.name || 
           (profile.given_name ? `${profile.given_name} ${profile.family_name || ''}`.trim() : null) || 
           profile.nickname || 
           (profile.email || 'User').split('@')[0];
  }, [auth.user]);

  const userGroups = useMemo(() => {
    const groups = auth.user?.profile?.['cognito:groups'];
    return (Array.isArray(groups) ? groups : []) as CognitoGroup[];
  }, [auth.user]);

  const isGlobalAdmin = userGroups.includes('Application_Administrator');
  const isTenantAdmin = userGroups.includes('Tenant_Admin');
  const isAuditor = userGroups.includes('Auditor');

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
              nextStore[c.id].users = [{
                id: auth.user?.profile.sub || 'unknown',
                name: userDisplayName,
                email: auth.user?.profile.email || '',
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
  }, [auth.isAuthenticated, auth.user, userGroups, userDisplayName]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id_token && !fetchAttempted.current) {
      fetchAttempted.current = true;
      loadOrganizations();
    }
  }, [auth.isAuthenticated, auth.user?.id_token, loadOrganizations]);

  const handleLogout = () => auth.signoutRedirect();
  
  if (auth.isLoading) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (!auth.isAuthenticated) return <Login />;
  if (isDataLoading && !hasCheckedOrgs) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  if (hasCheckedOrgs && !activeClientId) {
    return (
      <Onboarding 
        user={{ id: auth.user?.profile.sub || '', name: userDisplayName, email: auth.user?.profile.email || '', role: 'Admin_Created_Users', domain: (auth.user?.profile.email || '').split('@')[1], organizationId: '', department: '', lastLogin: 0, mfaEnabled: false, hasPasskey: false, isCuiAuthorized: false }}
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
      />
    );
  }

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];
  const activeData = clientDataStore[activeClientId];
  if (!activeData) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 size={48} className="animate-spin" /></div>;

  const currentUser = activeData.users[0];
  const allUsersAcrossTenants = (Object.values(clientDataStore) as ClientData[]).flatMap(d => d.users);

  const getViewLabel = (view: AppView) => {
    switch(view) {
      case AppView.DASHBOARD: return "Assurance Insights";
      case AppView.WIZARD: return "Guided Compliance Wizard";
      case AppView.CONTROLS: return "Security Control Audit";
      case AppView.SPRS_SCORECARD: return "DoD SPRS Scoring";
      case AppView.TRAINING: return "Compliance Training Center";
      case AppView.ASSETS: return "CUI Scoped Assets";
      case AppView.USERS: return "Identity Pool & Access";
      case AppView.NETWORK_DIAGRAM: return "Network & Scope Diagrams";
      case AppView.RISK_MANAGEMENT: return "Risk Management (FAIR)";
      case AppView.POAM: return "POA&M Remediation";
      case AppView.ASSESSOR_PORTAL: return "Assessor Review Suite";
      case AppView.REPORT_EXECUTIVE: return "Executive Summary";
      case AppView.REPORT_SSP: return "System Security Plan (SSP)";
      case AppView.REPORT_POLICY_CENTER: return "Organization Policy Center";
      default: return "Cuallee Cyber";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 z-50 border-r border-slate-900 shadow-2xl">
        <div className="p-6 pb-10">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/50">
              <Shield size={20} className="text-white" />
            </div>
            <span className="tracking-tighter uppercase font-black text-lg leading-none">Cuallee<br/><span className="text-blue-500">Cyber</span></span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 scrollbar-hide">
          <SidebarSection title="General">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" isActive={currentView === AppView.DASHBOARD} onClick={() => setCurrentView(AppView.DASHBOARD)} />
            <SidebarItem icon={Wand2} label="Wizard" isActive={currentView === AppView.WIZARD} onClick={() => setCurrentView(AppView.WIZARD)} badge="Guided" />
          </SidebarSection>

          <SidebarSection title="Compliance">
            <SidebarItem icon={ListChecks} label="Controls" isActive={currentView === AppView.CONTROLS} onClick={() => setCurrentView(AppView.CONTROLS)} />
            <SidebarItem icon={TrendingUp} label="SPRS Scorecard" isActive={currentView === AppView.SPRS_SCORECARD} onClick={() => setCurrentView(AppView.SPRS_SCORECARD)} />
            <SidebarItem icon={GraduationCap} label="Training" isActive={currentView === AppView.TRAINING} onClick={() => setCurrentView(AppView.TRAINING)} />
            <SidebarItem icon={Package} label="Assets" isActive={currentView === AppView.ASSETS} onClick={() => setCurrentView(AppView.ASSETS)} />
            <SidebarItem icon={Users} label="Users" isActive={currentView === AppView.USERS} onClick={() => setCurrentView(AppView.USERS)} />
            <SidebarItem icon={Network} label="Network Diagram" isActive={currentView === AppView.NETWORK_DIAGRAM} onClick={() => setCurrentView(AppView.NETWORK_DIAGRAM)} />
          </SidebarSection>

          <SidebarSection title="Governance">
            <SidebarItem icon={AlertTriangle} label="Risk Management" isActive={currentView === AppView.RISK_MANAGEMENT} onClick={() => setCurrentView(AppView.RISK_MANAGEMENT)} />
            <SidebarItem icon={ClipboardList} label="POA&M" isActive={currentView === AppView.POAM} onClick={() => setCurrentView(AppView.POAM)} />
          </SidebarSection>

          <SidebarSection title="Assessor Portal">
            <SidebarItem icon={Eye} label="Assessor Review" isActive={currentView === AppView.ASSESSOR_PORTAL} onClick={() => setCurrentView(AppView.ASSESSOR_PORTAL)} />
          </SidebarSection>

          <SidebarSection title="Reports">
            <SidebarItem icon={BarChart3} label="Executive Summary" isActive={currentView === AppView.REPORT_EXECUTIVE} onClick={() => setCurrentView(AppView.REPORT_EXECUTIVE)} />
            <SidebarItem icon={ShieldCheck} label="SSP Generator" isActive={currentView === AppView.REPORT_SSP} onClick={() => setCurrentView(AppView.REPORT_SSP)} />
            <SidebarItem icon={FileText} label="Policy Center" isActive={currentView === AppView.REPORT_POLICY_CENTER} onClick={() => setCurrentView(AppView.REPORT_POLICY_CENTER)} />
          </SidebarSection>

          {(isTenantAdmin || isGlobalAdmin) && (
            <SidebarSection title="System">
              <SidebarItem icon={Settings} label="Tenant Settings" isActive={currentView === AppView.ORGANIZATION_MANAGER} onClick={() => setCurrentView(AppView.ORGANIZATION_MANAGER)} />
              {isGlobalAdmin && <SidebarItem icon={Globe} label="Global Admin" isActive={currentView === AppView.GLOBAL_ADMIN} onClick={() => setCurrentView(AppView.GLOBAL_ADMIN)} />}
            </SidebarSection>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-900 bg-slate-950/50">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Active Tenant</div>
          <div className="text-xs font-bold text-white truncate uppercase">{activeClient.name}</div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-4">
             <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{getViewLabel(currentView)}</h2>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsChatOpen(!isChatOpen)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-[11px] transition-all ${isChatOpen ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <MessageSquare size={14} /> AI Support
            </button>
            
            <div className="h-6 w-px bg-slate-200" />

            <div className="relative">
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-black text-slate-900 leading-tight mb-0.5">{userDisplayName}</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{userGroups[0]?.replace(/_/g, ' ') || 'Identity Member'}</div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black border-2 border-white shadow-xl shadow-blue-600/20 text-sm">
                  {userDisplayName.charAt(0).toUpperCase()}
                </div>
              </button>

              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="px-5 py-3 border-b border-slate-50 mb-1">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Signed in as</div>
                        <div className="text-xs font-bold text-slate-700 truncate">{auth.user?.profile.email}</div>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-xs text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-black uppercase tracking-widest">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative bg-slate-50/50">
          <div className="h-full w-full overflow-y-auto">
            {currentView === AppView.DASHBOARD && <Dashboard requirements={activeData.requirements} artifacts={activeData.artifacts} activeFramework={activeFramework} onNavigate={setCurrentView} onToggleChat={() => setIsChatOpen(!isChatOpen)} />}
            {currentView === AppView.WIZARD && <ComplianceWizard requirements={activeData.requirements} artifacts={activeData.artifacts} assets={activeData.assets} wizardProgress={activeData.wizardProgress} onUpdateRequirement={handleUpdateRequirement} onAddArtifact={handleAddArtifact} onRemoveArtifact={handleRemoveArtifact} onAddAsset={handleAddAsset} onDeleteAsset={handleDeleteAsset} onUpdateProgress={handleUpdateWizardProgress} activeFrameworkId={activeFramework.id} onComplete={() => setCurrentView(AppView.DASHBOARD)} />}
            
            {/* Compliance Section */}
            {currentView === AppView.CONTROLS && (
              <div className="flex h-full overflow-hidden">
                <RequirementsList requirements={activeData.requirements} selectedReqId={selectedRequirementId} onSelectReq={(r) => setSelectedRequirementId(r.id)} activeFrameworkId={activeFramework.id} />
                {selectedRequirementId ? (
                  <RequirementDetail requirement={activeData.requirements.find(r => r.id === selectedRequirementId)!} onUpdateRequirement={handleUpdateRequirement} allArtifacts={activeData.artifacts} onAddArtifact={handleAddArtifact} onRemoveArtifact={handleRemoveArtifact} tickets={[]} onAddTicket={() => {}} cwConfig={activeData.cwConfig} jiraConfig={activeData.jiraConfig} currentUser={currentUser} activeClientId={activeClientId} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                    <ListChecks size={80} className="opacity-10 mb-4" />
                    <p className="text-sm font-black uppercase tracking-widest">Select a Control to Audit</p>
                  </div>
                )}
              </div>
            )}
            {currentView === AppView.SPRS_SCORECARD && <SPRSScorecard requirements={activeData.requirements} activeFrameworkId={activeFramework.id} />}
            {currentView === AppView.TRAINING && <TrainingCenter />}
            {currentView === AppView.ASSETS && <Inventory assets={activeData.assets} onAddAsset={handleAddAsset} onDeleteAsset={handleDeleteAsset} />}
            {currentView === AppView.USERS && <UserManagement users={activeData.users} onAddUser={() => {}} onUpdateUser={() => {}} onDeleteUser={() => {}} />}
            {currentView === AppView.NETWORK_DIAGRAM && <NetworkAnalyzer />}
            
            {/* Governance Section */}
            {currentView === AppView.RISK_MANAGEMENT && <RiskRegister risks={activeData.risks} onAddRisk={(r) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], risks: [...prev[activeClientId].risks, r] } }))} onUpdateRisk={() => {}} onDeleteRisk={(id) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], risks: prev[activeClientId].risks.filter(r => r.id !== id) } }))} />}
            {currentView === AppView.POAM && <Reports requirements={activeData.requirements} risks={activeData.risks} activeFrameworkId={activeFramework.id} onUpdateRequirement={handleUpdateRequirement} defaultTab="POAM" />}
            
            {/* Assessor Portal */}
            {currentView === AppView.ASSESSOR_PORTAL && <AssessorPortal client={activeClient} requirements={activeData.requirements} artifacts={activeData.artifacts} risks={activeData.risks} assets={activeData.assets} activeFramework={activeFramework} />}
            
            {/* Reports Section */}
            {currentView === AppView.REPORT_EXECUTIVE && <Reports requirements={activeData.requirements} risks={activeData.risks} activeFrameworkId={activeFramework.id} defaultTab="EXECUTIVE" />}
            {currentView === AppView.REPORT_SSP && <Reports requirements={activeData.requirements} activeFrameworkId={activeFramework.id} sspMetadata={activeData.sspMetadata} defaultTab="SSP" />}
            {currentView === AppView.REPORT_POLICY_CENTER && <Reports requirements={activeData.requirements} activeFrameworkId={activeFramework.id} defaultTab="MATRIX" />}

            {/* System Admin */}
            {currentView === AppView.ORGANIZATION_MANAGER && <OrganizationManager clients={clients} clientDataStore={clientDataStore} activeClientId={activeClientId} onAddClient={() => {}} onUpdateClient={() => {}} onDeleteClient={() => {}} onUpdateClientData={() => {}} />}
            {currentView === AppView.GLOBAL_ADMIN && <GlobalAdminPortal tenants={clients} allUsers={allUsersAcrossTenants} onPromoteUser={() => {}} onDeleteTenant={() => {}} onDeleteUser={() => {}} />}
          </div>
        </main>

        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
};

export default App;
