
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
  FileSpreadsheet,
  Building2,
  FileText,
  Lock,
  Globe,
  AlertTriangle
} from 'lucide-react';

import { FRAMEWORKS, createInitialClientData } from './data/standards';
import { Requirement, Artifact, AppView, Ticket, User, Framework, Client, ClientData, CognitoGroup, Risk } from './types';
import { RequirementsList } from './components/RequirementsList';
import { RequirementDetail } from './components/RequirementDetail';
import { AIChat } from './components/AIChat';
import { NetworkAnalyzer } from './components/NetworkAnalyzer';
import { Inventory } from './components/Inventory';
import { UserManagement } from './components/UserManagement';
import { Reports } from './components/Reports';
import { SPRSScorecard } from './components/SPRSScorecard';
import { ComplianceWizard } from './components/ComplianceWizard';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding'; 
import { Dashboard } from './components/Dashboard'; 
import { AuditorPortal } from './components/AuditorPortal';
import { BulkImport } from './components/BulkImport';
import { OrganizationManager } from './components/OrganizationManager';
import { GlobalAdminPortal } from './components/GlobalAdminPortal';
import { DocGenerator } from './components/DocGenerator';
import { RiskRegister } from './components/RiskRegister';
import { api } from './services/api';

const NavDropdown = ({ label, icon: Icon, children }: React.PropsWithChildren<{ label: string, icon: any }>) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="relative h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
        <button className="flex items-center gap-1 px-3 py-2 text-slate-300 hover:text-white font-medium transition-colors text-sm">
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
    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors ${isActive ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700 text-sm'}`}
  >
      <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
      {label}
  </button>
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
                          nextStore[c.id].users = [{
                              id: auth.user?.profile.sub || 'unknown',
                              name: (auth.user?.profile.email || 'User').split('@')[0],
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
  
  if (auth.isLoading) return <div className="flex h-screen items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (!auth.isAuthenticated) return <Login onLogin={() => auth.signinRedirect()} error={auth.error} />;
  if (isDataLoading && !hasCheckedOrgs) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

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
  if (!activeData) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 size={48} className="animate-spin" /></div>;

  const currentUser = activeData.users[0];
  const allUsersAcrossTenants = (Object.values(clientDataStore) as ClientData[]).flatMap(d => d.users);

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <header className="bg-slate-900 text-slate-200 h-16 shrink-0 shadow-md z-50">
          <div className="max-w-[1920px] mx-auto px-6 h-full flex items-center justify-between">
              <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                      <Shield className="text-blue-500" size={24} />
                      <span className="tracking-tighter uppercase font-black">Cuallee Cyber</span>
                  </div>
                  <nav className="hidden md:flex items-center gap-1 h-16">
                      <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors hover:text-white">Dashboard</button>
                      {!isAuditor && (
                          <NavDropdown label="Compliance" icon={ListChecks}>
                            <NavItem label="Control Detail" icon={ListChecks} isActive={currentView === AppView.REQUIREMENTS} onClick={() => setCurrentView(AppView.REQUIREMENTS)} />
                            <NavItem label="SPRS Score" icon={TrendingUp} isActive={currentView === AppView.SPRS_SCORECARD} onClick={() => setCurrentView(AppView.SPRS_SCORECARD)} />
                            <NavItem label="Bulk Entry" icon={FileSpreadsheet} isActive={currentView === AppView.BULK_IMPORT} onClick={() => setCurrentView(AppView.BULK_IMPORT)} />
                            <NavItem label="Wizard" icon={Wand2} isActive={currentView === AppView.WIZARD} onClick={() => setCurrentView(AppView.WIZARD)} />
                          </NavDropdown>
                      )}
                      <NavDropdown label="Governance" icon={Eye}>
                          <NavItem label="FAIR Risk Register" icon={AlertTriangle} isActive={currentView === AppView.RISK_REGISTER} onClick={() => setCurrentView(AppView.RISK_REGISTER)} />
                          <NavItem label="Auditor Portal" icon={Shield} isActive={currentView === AppView.AUDITOR_PORTAL} onClick={() => setCurrentView(AppView.AUDITOR_PORTAL)} />
                          <NavItem label="Asset Registry" icon={Package} isActive={currentView === AppView.INVENTORY} onClick={() => setCurrentView(AppView.INVENTORY)} />
                          <NavItem label="Compliance Reports" icon={FileText} isActive={currentView === AppView.REPORTS} onClick={() => setCurrentView(AppView.REPORTS)} />
                      </NavDropdown>
                      {(isTenantAdmin || isGlobalAdmin) && (
                        <NavDropdown label="Tenant" icon={Lock}>
                            <NavItem label="Settings" icon={Building2} isActive={currentView === AppView.ORGANIZATION_MANAGER} onClick={() => setCurrentView(AppView.ORGANIZATION_MANAGER)} />
                            <NavItem label="Team Control" icon={Users} isActive={currentView === AppView.USERS} onClick={() => setCurrentView(AppView.USERS)} />
                        </NavDropdown>
                      )}
                      {isGlobalAdmin && (
                        <button onClick={() => setCurrentView(AppView.GLOBAL_ADMIN)} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-blue-500/30 ${currentView === AppView.GLOBAL_ADMIN ? 'bg-blue-600 text-white' : 'text-blue-400'}`}>
                            <Globe size={14}/> Platform Admin
                        </button>
                      )}
                  </nav>
              </div>
              <div className="flex items-center gap-4">
                  <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-2 rounded-full transition-all ${isChatOpen ? 'bg-blue-600' : 'bg-slate-800 text-blue-400'}`}><MessageSquare size={20} /></button>
                  <div className="flex items-center gap-3 relative">
                      <div className="text-right hidden lg:block">
                          <div className="text-xs font-black text-white uppercase">{currentUser.name}</div>
                          <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{currentUser.role.replace(/_/g, ' ')}</div>
                      </div>
                      <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-black border-2 border-slate-700">{currentUser.name.charAt(0)}</button>
                      {isProfileMenuOpen && (
                          <div className="absolute top-full right-0 mt-3 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-3 z-[100]">
                              <div className="px-5 py-3 border-b border-slate-100 mb-2">
                                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Organization</div>
                                  <div className="text-sm font-black truncate uppercase">{activeClient.name}</div>
                              </div>
                              <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-xs text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-black uppercase">
                                  <LogOut size={14} /> Sign Out
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
            {currentView === AppView.DASHBOARD && <Dashboard requirements={activeData.requirements} artifacts={activeData.artifacts} activeFramework={activeFramework} onNavigate={setCurrentView} onToggleChat={() => setIsChatOpen(!isChatOpen)} />}
            {currentView === AppView.GLOBAL_ADMIN && <GlobalAdminPortal tenants={clients} allUsers={allUsersAcrossTenants} onPromoteUser={handleGlobalPromote} onDeleteTenant={() => {}} onDeleteUser={() => {}} />}
            {currentView === AppView.REQUIREMENTS && (
                <>
                    <RequirementsList requirements={activeData.requirements} selectedReqId={selectedRequirementId} onSelectReq={(r) => setSelectedRequirementId(r.id)} activeFrameworkId={activeFramework.id} />
                    {selectedRequirementId ? <RequirementDetail requirement={activeData.requirements.find(r => r.id === selectedRequirementId)!} onUpdateRequirement={() => {}} allArtifacts={activeData.artifacts} onAddArtifact={() => {}} onRemoveArtifact={() => {}} tickets={[]} onAddTicket={() => {}} cwConfig={activeData.cwConfig} jiraConfig={activeData.jiraConfig} currentUser={currentUser} activeClientId={activeClientId} /> : <div className="flex-1 flex flex-col items-center justify-center text-slate-400"><ListChecks size={64} className="opacity-10" /><p className="text-lg">Select a control.</p></div>}
                </>
            )}
            {currentView === AppView.RISK_REGISTER && <RiskRegister risks={activeData.risks} onAddRisk={handleAddRisk} onUpdateRisk={() => {}} onDeleteRisk={handleDeleteRisk} />}
            {currentView === AppView.REPORTS && <Reports requirements={activeData.requirements} risks={activeData.risks} activeFrameworkId={activeFramework.id} sspMetadata={activeData.sspMetadata} />}
            {currentView === AppView.SPRS_SCORECARD && <SPRSScorecard requirements={activeData.requirements} activeFrameworkId={activeFramework.id} />}
            {currentView === AppView.AUDITOR_PORTAL && <AuditorPortal client={activeClient} requirements={activeData.requirements} artifacts={activeData.artifacts} risks={activeData.risks} assets={activeData.assets} activeFramework={activeFramework} />}
            {currentView === AppView.WIZARD && <ComplianceWizard requirements={activeData.requirements} artifacts={activeData.artifacts} wizardProgress={activeData.wizardProgress} onUpdateRequirement={() => {}} onAddArtifact={() => {}} onRemoveArtifact={() => {}} onUpdateProgress={() => {}} activeFrameworkId={activeFramework.id} onComplete={() => setCurrentView(AppView.DASHBOARD)} />}
            {currentView === AppView.USERS && <UserManagement users={activeData.users} onAddUser={() => {}} onUpdateUser={() => {}} onDeleteUser={() => {}} />}
            {currentView === AppView.ORGANIZATION_MANAGER && <OrganizationManager clients={clients} clientDataStore={clientDataStore} activeClientId={activeClientId} onAddClient={() => {}} onUpdateClient={() => {}} onDeleteClient={() => {}} onUpdateClientData={() => {}} />}
      </main>
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
