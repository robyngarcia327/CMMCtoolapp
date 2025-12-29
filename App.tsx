
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from "react-oidc-context";
import { 
  Shield, 
  ListChecks, 
  MessageSquare,
  AlertTriangle,
  Network,
  Package,
  Users,
  TrendingUp,
  Wand2,
  LogOut,
  ChevronDown,
  Loader2,
  RefreshCw,
  Map,
  AlertCircle,
  Eye,
  FileSpreadsheet,
  Building2,
  FileText,
  Database
} from 'lucide-react';

import { FRAMEWORKS, createInitialClientData } from './data/standards';
import { Requirement, Artifact, AppView, Ticket, ConnectWiseConfig, JiraConfig, User, Framework, Client, ClientData, WizardProgress, IntegrationConfig } from './types';
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
import { MSPDashboard } from './components/MSPDashboard';
import { OrganizationManager } from './components/OrganizationManager';
import { DocGenerator } from './components/DocGenerator';
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
  
  // App Navigation
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFrameworkMenuOpen, setIsFrameworkMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Data & Lifecycle
  const [isDataLoading, setIsDataLoading] = useState(false); 
  const [hasCheckedOrgs, setHasCheckedOrgs] = useState(false);
  const [orgFetchError, setOrgFetchError] = useState<string | null>(null);
  
  // Workspace State
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClientId, setActiveClientId] = useState<string>('');
  const [activeFramework, setActiveFramework] = useState<Framework>(FRAMEWORKS[0]);
  const [clientDataStore, setClientDataStore] = useState<Record<string, ClientData>>({});
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);

  const fetchAttempted = useRef(false);

  const loadOrganizations = useCallback(async () => {
      const idToken = auth.user?.id_token;
      if (!auth.isAuthenticated || !idToken) return;

      setIsDataLoading(true);
      setOrgFetchError(null);
      
      try {
          const apiOrgs = await api.getOrgs(idToken);
          const mappedClients: Client[] = apiOrgs
            .filter(o => o && typeof o === 'object')
            .map((o: any) => {
              const nameValue = o.name || o.Name || o.orgName || o.organizationName || o.displayName;
              const orgIdValue = o.orgId || o.OrgId || o.id || o.organizationId;
              const safeName = (typeof nameValue === 'string' && nameValue.trim() !== '') ? nameValue : 'Organization';
              const safeId = orgIdValue || `temp-${Math.random()}`;
              return {
                  id: safeId,
                  name: safeName,
                  industry: o.industry || o.Industry || 'General', 
                  contactName: auth.user?.profile.email || 'User',
                  logoInitial: safeName.charAt(0).toUpperCase(),
                  primaryFramework: 'NIST-CMMC',
                  nextAuditDate: Date.now() + 31536000000,
                  accountManager: 'Self-Managed',
                  isParent: false
              };
          });

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

              api.getEvidenceList(idToken, selectedId).then(evidence => {
                  setClientDataStore(prev => ({
                      ...prev,
                      [selectedId]: { ...prev[selectedId], artifacts: evidence }
                  }));
              }).catch(e => console.warn(`Background evidence fetch failed for ${selectedId}`, e));
          } else {
              setActiveClientId('');
          }
          setHasCheckedOrgs(true);
      } catch (e: any) {
          console.error("Critical: Failed to load organizations", e);
          setOrgFetchError(e.message || "Network Error: Could not connect to the security gateway.");
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

  const enterLocalMode = () => {
      setHasCheckedOrgs(true);
      setOrgFetchError(null);
      const localId = 'local-dev-org';
      const localClient: Client = {
          id: localId,
          name: 'Local Assessment (Demo)',
          industry: 'Defense Industrial Base',
          contactName: auth.user?.profile.email || 'Admin',
          logoInitial: 'L',
          primaryFramework: 'NIST-CMMC',
          nextAuditDate: Date.now() + 31536000000,
          accountManager: 'Self-Managed',
          isParent: false
      };
      setClients([localClient]);
      setActiveClientId(localId);
      setClientDataStore({ [localId]: createInitialClientData(false) });
  };

  const handleLogout = () => {
      localStorage.removeItem('activeOrgId');
      auth.signoutRedirect();
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

  if (isDataLoading && !hasCheckedOrgs) {
      return (
          <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4 text-center">
              <Loader2 size={48} className="animate-spin text-blue-600 mb-2" />
              <h2 className="text-xl font-bold text-slate-800">Checking Organization...</h2>
              <p className="text-slate-500 text-sm max-w-xs">Verifying your secure workspace access.</p>
          </div>
      );
  }

  if (orgFetchError && !hasCheckedOrgs) {
      return (
          <div className="flex h-screen items-center justify-center bg-slate-50 p-6">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} className="text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Sync Error</h2>
                  <p className="text-slate-500 text-sm mb-6">{orgFetchError}</p>
                  <div className="space-y-3">
                    <button onClick={() => { fetchAttempted.current = false; loadOrganizations(); }} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <RefreshCw size={18} /> Retry Connection
                    </button>
                    <button onClick={enterLocalMode} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2">
                        <Database size={18} /> Proceed in Local Mode
                    </button>
                    <button onClick={handleLogout} className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                        Sign Out
                    </button>
                  </div>
              </div>
          </div>
      );
  }

  if (hasCheckedOrgs && !activeClientId) {
      return (
          <Onboarding 
            user={{
                id: auth.user?.profile.sub || '', 
                name: '', email: auth.user?.profile.email || '', role: 'CLIENT_USER', 
                organizationId: '', department: '', lastLogin: 0, mfaEnabled: false, hasPasskey: false, isCuiAuthorized: false 
            }}
            onCreateOrganization={async (name) => {
                if (!auth.user?.id_token) return;
                setIsDataLoading(true);
                try {
                    await api.createOrg(auth.user.id_token, name);
                    fetchAttempted.current = false;
                    await loadOrganizations();
                } catch (e: any) {
                    setOrgFetchError(e.message);
                    setIsDataLoading(false);
                }
            }}
            onRefresh={() => { fetchAttempted.current = false; loadOrganizations(); }}
            debugTokens={{ idToken: auth.user?.id_token }}
          />
      );
  }

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];
  const activeData = clientDataStore[activeClientId];
  
  if (!activeData) return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
          <Loader2 size={48} className="animate-spin text-blue-600" />
      </div>
  );

  const currentUser: User = activeData.users.find(u => u.email === auth.user?.profile.email) || {
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
          if (!current) return prevStore;
          const changes = updateFn(current);
          return { ...prevStore, [activeClientId]: { ...current, ...changes } };
      });
  };

  const updateClientDataById = (clientId: string, data: Partial<ClientData>) => {
      setClientDataStore(prev => ({
          ...prev,
          [clientId]: { ...prev[clientId], ...data }
      }));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
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
                  <nav className="hidden md:flex items-center gap-1 h-16">
                      <button onClick={() => setCurrentView(AppView.DASHBOARD)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${currentView === AppView.DASHBOARD ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}>Dashboard</button>
                      <NavDropdown label="Compliance" icon={ListChecks}>
                          <NavItem label="Requirement Detail" icon={ListChecks} isActive={currentView === AppView.REQUIREMENTS} onClick={() => setCurrentView(AppView.REQUIREMENTS)} />
                          <NavItem label="SPRS Scorecard" icon={TrendingUp} isActive={currentView === AppView.SPRS_SCORECARD} onClick={() => setCurrentView(AppView.SPRS_SCORECARD)} />
                          <NavItem label="Bulk Import" icon={FileSpreadsheet} isActive={currentView === AppView.BULK_IMPORT} onClick={() => setCurrentView(AppView.BULK_IMPORT)} />
                          <NavItem label="Onboarding Wizard" icon={Wand2} isActive={currentView === AppView.WIZARD} onClick={() => setCurrentView(AppView.WIZARD)} />
                      </NavDropdown>
                      <NavDropdown label="Governance" icon={FileText}>
                          <NavItem label="Policy Center" icon={FileText} isActive={currentView === AppView.DOC_GENERATOR} onClick={() => setCurrentView(AppView.DOC_GENERATOR)} />
                          <NavItem label="Asset Inventory" icon={Package} isActive={currentView === AppView.INVENTORY} onClick={() => setCurrentView(AppView.INVENTORY)} />
                          <NavItem label="Identity Management" icon={Users} isActive={currentView === AppView.USERS} onClick={() => setCurrentView(AppView.USERS)} />
                          <NavItem label="Network Map" icon={Network} isActive={currentView === AppView.NETWORK_ANALYSIS} onClick={() => setCurrentView(AppView.NETWORK_ANALYSIS)} />
                      </NavDropdown>
                      <button onClick={() => setCurrentView(AppView.AUDITOR_PORTAL)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${currentView === AppView.AUDITOR_PORTAL ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}>Auditor Portal</button>
                      <button onClick={() => setCurrentView(AppView.REPORTS)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${currentView === AppView.REPORTS ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}>Reports</button>
                  </nav>
              </div>

              <div className="flex items-center gap-4">
                  <div className="relative">
                        <button 
                          onClick={() => setIsFrameworkMenuOpen(!isFrameworkMenuOpen)}
                          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${isFrameworkMenuOpen ? 'bg-slate-700 text-white border-blue-500' : 'text-slate-400 bg-slate-800 border-slate-700 hover:border-slate-500'}`}
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

                  <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-2 rounded-full transition-all ${isChatOpen ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400 hover:bg-slate-700'}`}><MessageSquare size={20} /></button>

                  <div className="h-6 w-px bg-slate-700 mx-1"></div>

                  <div className="flex items-center gap-3 relative">
                      <div className="text-right hidden lg:block">
                          <div className="text-sm font-bold text-white">{currentUser.name}</div>
                          <div className="text-[10px] font-bold text-slate-500 truncate max-w-[100px]">{activeClient.name}</div>
                      </div>
                      <button 
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className={`w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-lg border-2 transition-all ${isProfileMenuOpen ? 'border-white scale-110' : 'border-slate-700 hover:border-slate-500'}`}
                      >
                          {currentUser.name.charAt(0)}
                      </button>
                      
                      {isProfileMenuOpen && (
                          <div className="absolute top-full right-0 mt-3 w-56 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="px-4 py-3 border-b border-slate-100 mb-2">
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Organization</div>
                                  <div className="text-sm font-bold truncate text-slate-800">{activeClient.name}</div>
                              </div>
                              <button 
                                onClick={() => setCurrentView(AppView.ORGANIZATION_MANAGER)}
                                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors font-medium group"
                              >
                                  <div className="bg-slate-100 text-slate-500 p-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Building2 size={14} />
                                  </div>
                                  Admin Settings
                              </button>
                              <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-bold group"
                              >
                                  <div className="bg-red-100 text-red-600 p-1.5 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <LogOut size={14} />
                                  </div>
                                  Sign Out
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
            {currentView === AppView.DASHBOARD && (
              <Dashboard 
                requirements={activeData.requirements} 
                artifacts={activeData.artifacts} 
                activeFramework={activeFramework} 
                onNavigate={setCurrentView}
                onToggleChat={() => setIsChatOpen(!isChatOpen)}
              />
            )}
            {currentView === AppView.REQUIREMENTS && (
                <>
                    <RequirementsList requirements={activeData.requirements} selectedReqId={selectedRequirementId} onSelectReq={(r) => setSelectedRequirementId(r.id)} activeFrameworkId={activeFramework.id} />
                    {selectedRequirementId ? (
                        <RequirementDetail 
                          requirement={activeData.requirements.find(r => r.id === selectedRequirementId)!} 
                          onUpdateRequirement={(updated) => updateActiveClientData(prev => ({ requirements: prev.requirements.map(r => r.id === updated.id ? updated : r) }))} 
                          allArtifacts={activeData.artifacts} 
                          onAddArtifact={(a) => updateActiveClientData(prev => ({ artifacts: [...prev.artifacts, a] }))} 
                          onRemoveArtifact={(id) => updateActiveClientData(prev => ({ artifacts: prev.artifacts.filter(a => a.id !== id) }))} 
                          tickets={activeData.tickets} 
                          onAddTicket={(t) => updateActiveClientData(prev => ({ tickets: [...prev.tickets, t] }))} 
                          cwConfig={activeData.cwConfig} 
                          jiraConfig={activeData.jiraConfig} 
                          currentUser={currentUser} 
                          activeClientId={activeClientId} 
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                            <ListChecks size={64} className="mb-4 opacity-10" />
                            <p className="text-lg font-medium">Select a requirement to begin.</p>
                        </div>
                    )}
                </>
            )}
            {currentView === AppView.SPRS_SCORECARD && <SPRSScorecard requirements={activeData.requirements} activeFrameworkId={activeFramework.id} />}
            {currentView === AppView.AUDITOR_PORTAL && <AuditorPortal client={activeClient} requirements={activeData.requirements} artifacts={activeData.artifacts} risks={activeData.risks} />}
            {currentView === AppView.BULK_IMPORT && (
                <div className="flex-1 w-full h-full">
                    <BulkImport 
                        requirements={activeData.requirements} 
                        activeFrameworkId={activeFramework.id} 
                        activeClientId={activeClientId}
                        onBatchUpdate={(updated) => updateActiveClientData(prev => ({
                            requirements: prev.requirements.map(r => {
                                const match = updated.find(u => u.id === r.id);
                                return match ? match : r;
                            })
                        }))}
                    />
                </div>
            )}
            {currentView === AppView.DOC_GENERATOR && (
                <DocGenerator 
                    requirements={activeData.requirements} 
                    artifacts={activeData.artifacts}
                    clientName={activeClient.name}
                    confluenceConfig={activeData.confluenceConfig}
                    sspMetadata={activeData.sspMetadata}
                />
            )}
            {currentView === AppView.REPORTS && (
                <Reports 
                    requirements={activeData.requirements} 
                    artifacts={activeData.artifacts}
                    activeFrameworkId={activeFramework.id}
                    onUpdateRequirement={(updated) => updateActiveClientData(prev => ({ requirements: prev.requirements.map(r => r.id === updated.id ? updated : r) }))} 
                    sspMetadata={activeData.sspMetadata}
                />
            )}
            {currentView === AppView.WIZARD && (
                <ComplianceWizard 
                    requirements={activeData.requirements} 
                    artifacts={activeData.artifacts} 
                    assets={activeData.assets}
                    wizardProgress={activeData.wizardProgress} 
                    onUpdateRequirement={(updated) => updateActiveClientData(prev => ({ requirements: prev.requirements.map(r => r.id === updated.id ? updated : r) }))} 
                    onAddArtifact={(a) => updateActiveClientData(prev => ({ artifacts: [...prev.artifacts, a] }))} 
                    onRemoveArtifact={(id) => updateActiveClientData(prev => ({ artifacts: prev.artifacts.filter(a => a.id !== id) }))} 
                    onAddAsset={(a) => updateActiveClientData(prev => ({ assets: [...prev.assets, a] }))}
                    onDeleteAsset={(id) => updateActiveClientData(prev => ({ assets: prev.assets.filter(a => a.id !== id) }))}
                    onUpdateProgress={(p) => updateActiveClientData(prev => ({ wizardProgress: p }))} 
                    activeFrameworkId={activeFramework.id} 
                    onComplete={() => setCurrentView(AppView.DASHBOARD)} 
                />
            )}
            {currentView === AppView.INVENTORY && (
                <Inventory 
                    assets={activeData.assets} 
                    onAddAsset={(a) => updateActiveClientData(prev => ({ assets: [...prev.assets, a] }))} 
                    onDeleteAsset={(id) => updateActiveClientData(prev => ({ assets: prev.assets.filter(a => a.id !== id) }))} 
                />
            )}
            {currentView === AppView.USERS && <UserManagement users={activeData.users} onAddUser={(u) => updateActiveClientData(prev => ({ users: [...prev.users, u] }))} onUpdateUser={(u) => updateActiveClientData(prev => ({ users: prev.users.map(old => old.id === u.id ? u : old) }))} onDeleteUser={(id) => updateActiveClientData(prev => ({ users: prev.users.filter(u => u.id !== id) }))} />}
            {currentView === AppView.NETWORK_ANALYSIS && <NetworkAnalyzer />}
            {currentView === AppView.MSP_DASHBOARD && <MSPDashboard clients={clients} clientDataStore={clientDataStore} onSelectClient={(id) => { setActiveClientId(id); setCurrentView(AppView.DASHBOARD); }} />}
            {currentView === AppView.ORGANIZATION_MANAGER && (
                <OrganizationManager 
                    clients={clients} 
                    clientDataStore={clientDataStore}
                    onAddClient={(c) => setClients([...clients, c])}
                    onUpdateClient={(c) => setClients(clients.map(old => old.id === c.id ? c : old))}
                    onDeleteClient={(id) => setClients(clients.filter(c => c.id !== id))}
                    onUpdateClientData={updateClientDataById}
                />
            )}
      </main>
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
