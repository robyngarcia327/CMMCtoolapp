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
  FileCheck,
  Calculator,
  ShieldAlert,
  BookOpen,
  ArrowRight
} from 'lucide-react';

import { FRAMEWORKS, createInitialClientData, REQUIREMENTS_DATA } from './data/standards';
import { Requirement, Artifact, AppView, Ticket, User, Framework, Client, ClientData, CognitoGroup, Risk, WizardProgress, Asset, BudgetLineItem, OrganizationFinancials } from './types';
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
import { RiskRegister } from './components/RiskRegister';
import { FairRiskAnalyzer } from './components/FairRiskAnalyzer';
import { CmmcAcademy } from './components/CmmcAcademy';
import { RmfLifecycle } from './components/RmfLifecycle';
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
  
  // Persistence Keys
  const KEY_VIEW = 'cuallee_cyber_v2_current_view';
  const KEY_CLIENT = 'cuallee_cyber_v2_active_client';
  const KEY_REQ = 'cuallee_cyber_v2_selected_req';
  const KEY_DATASTORE = 'cuallee_cyber_v2_datastore';

  const [currentView, setCurrentView] = useState<AppView>(() => {
    const saved = localStorage.getItem(KEY_VIEW);
    if (saved && Object.values(AppView).includes(saved as AppView)) return saved as AppView;
    return AppView.DASHBOARD;
  });
  
  const [activeClientId, setActiveClientId] = useState<string>(() => {
    return localStorage.getItem(KEY_CLIENT) || '';
  });

  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(() => {
    return localStorage.getItem(KEY_REQ);
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false); 
  const [hasCheckedOrgs, setHasCheckedOrgs] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeFramework, setActiveFramework] = useState<Framework>(FRAMEWORKS[0]);
  
  const [clientDataStore, setClientDataStore] = useState<Record<string, ClientData>>(() => {
    const saved = localStorage.getItem(KEY_DATASTORE);
    return saved ? JSON.parse(saved) : {};
  });

  const fetchAttempted = useRef(false);

  useEffect(() => {
    localStorage.setItem(KEY_VIEW, currentView);
  }, [currentView]);

  useEffect(() => {
    if (activeClientId) localStorage.setItem(KEY_CLIENT, activeClientId);
  }, [activeClientId]);

  useEffect(() => {
    if (Object.keys(clientDataStore).length > 0) {
      localStorage.setItem(KEY_DATASTORE, JSON.stringify(clientDataStore));
    }
  }, [clientDataStore]);

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

  const activeClient = useMemo(() => {
    const client = clients.find(c => c.id === activeClientId);
    if (client) return client;
    if (clients.length > 0) return clients[0];

    return { 
      name: 'Unauthorized Tenant', 
      id: '', domain: '', 
      industry: '', 
      contactName: '', 
      logoInitial: '?', 
      primaryFramework: '', 
      targetCmmcLevel: 2 as const, 
      nextAuditDate: 0, 
      accountManager: '', 
      isParent: false 
    };
  }, [clients, activeClientId]);

  const handleUpdateRequirement = (updatedReq: Requirement) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
        ...prev,
        [activeClientId]: {
            ...prev[activeClientId],
            requirements: prev[activeClientId].requirements.some(r => r.id === updatedReq.id)
                ? prev[activeClientId].requirements.map(r => r.id === updatedReq.id ? updatedReq : r)
                : [...prev[activeClientId].requirements, updatedReq]
        }
    }));
  };

  const handleBatchUpdateRequirements = (newReqs: Requirement[]) => {
      if (!activeClientId) return;
      setClientDataStore(prev => {
          const currentReqs = prev[activeClientId].requirements;
          const merged = [...currentReqs];
          
          newReqs.forEach(nr => {
              const idx = merged.findIndex(r => r.id === nr.id);
              if (idx !== -1) {
                merged[idx] = { 
                  ...merged[idx], 
                  response: nr.response,
                  objectives: nr.objectives
                };
              }
              else merged.push(nr);
          });

          return {
              ...prev,
              [activeClientId]: {
                  ...prev[activeClientId],
                  requirements: merged
              }
          };
      });
  };

  const handleUpdateFinancials = (fin: OrganizationFinancials) => {
      if (!activeClientId) return;
      setClientDataStore(prev => ({
          ...prev,
          [activeClientId]: { ...prev[activeClientId], financials: fin }
      }));
  };

  const handleUpdateRisk = (risk: Risk) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
        ...prev,
        [activeClientId]: {
            ...prev[activeClientId],
            risks: prev[activeClientId].risks.map(r => r.id === risk.id ? risk : r)
        }
    }));
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

  const handleUpdateLevel = (lvl: 1 | 2 | 3) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], targetCmmcLevel: lvl } }));
    setClients(prev => prev.map(c => c.id === activeClientId ? { ...c, targetCmmcLevel: lvl } : c));
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
        domain: o.domain || (auth.user?.profile.email || '').split('@')[1] || 'unverified.com',
        industry: o.industry || 'Defense Industrial Base', 
        contactName: auth.user?.profile.email || 'Admin',
        logoInitial: (o.name || 'O').charAt(0).toUpperCase(),
        primaryFramework: 'NIST-CMMC',
        targetCmmcLevel: 2, 
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
              const initial = createInitialClientData(false);
              nextStore[c.id] = initial;
              nextStore[c.id].users = [{ id: auth.user?.profile.sub || 'unknown', name: userDisplayName, email: auth.user?.profile.email || '', organizationId: c.id, domain: c.domain, role: userGroups[0] || 'Admin_Created_Users', department: 'Compliance', lastLogin: Date.now(), mfaEnabled: true, hasPasskey: false, isCuiAuthorized: true }];
            }
          });
          return nextStore;
        });
      }
    } catch (error) { 
      console.error("Load failed", error); 
    } finally { 
      setIsDataLoading(false); 
      setHasCheckedOrgs(true); 
    }
  }, [auth.isAuthenticated, auth.user, userGroups, userDisplayName]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id_token && !fetchAttempted.current) {
      fetchAttempted.current = true;
      loadOrganizations();
    }
  }, [auth.isAuthenticated, auth.user?.id_token, loadOrganizations]);

  const handleLogout = () => {
    localStorage.removeItem(KEY_VIEW);
    localStorage.removeItem(KEY_CLIENT);
    localStorage.removeItem(KEY_REQ);
    auth.signoutRedirect();
  };
  
  if (auth.isLoading) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (!auth.isAuthenticated) return <Login />;
  if (isDataLoading && !hasCheckedOrgs) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  if (hasCheckedOrgs && (clients.length === 0 || !activeClientId)) {
    return (
      <Onboarding 
        user={{ id: auth.user?.profile.sub || '', name: userDisplayName, email: auth.user?.profile.email || '', role: 'Admin_Created_Users', domain: (auth.user?.profile.email || '').split('@')[1], organizationId: '', department: '', lastLogin: 0, mfaEnabled: false, hasPasskey: false, isCuiAuthorized: false }} 
        onCreateOrganization={async (name, domain, financials) => {
          if (!auth.user?.id_token) return;
          setIsDataLoading(true);
          try { 
            const newOrg = await api.createOrg(auth.user.id_token, name, domain); 
            setClientDataStore(prev => ({ ...prev, [newOrg.orgId]: { ...createInitialClientData(false), financials: financials || createInitialClientData(false).financials } }));
            fetchAttempted.current = false; 
            await loadOrganizations(); 
          } catch (e) { 
            console.error("Onboarding failed", e);
          } finally { setIsDataLoading(false); }
        }} 
        onRefresh={() => { fetchAttempted.current = false; loadOrganizations(); }}
        debugTokens={{ idToken: auth.user?.id_token }}
      />
    );
  }

  const activeData = clientDataStore[activeClientId];
  if (!activeData) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 size={48} className="animate-spin" /></div>;

  const getViewLabel = (view: AppView) => {
    switch(view) {
      case AppView.DASHBOARD: return "Posture Insights";
      case AppView.WIZARD: return "Guided Compliance Wizard";
      case AppView.CONTROLS: return "NIST Control Audit";
      case AppView.SPRS_SCORECARD: return "DoD Scorecard";
      case AppView.ASSESSOR_PORTAL: return "Assessor View";
      case AppView.RISK_MANAGEMENT: return "Quantitative Risk Registry";
      case AppView.FAIR_ANALYZER: return "FAIR Risk Modeler";
      case AppView.RMF_LIFECYCLE: return "RMF Operations Center";
      case AppView.TRAINING: return "CMMC Academy";
      case AppView.REPORT_EXECUTIVE: return "Executive Report";
      case AppView.REPORT_SSP: return "System Security Plan";
      case AppView.ASSETS: return "Asset Inventory";
      case AppView.USERS: return "Identity Pool";
      default: return "Cuallee Cyber";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 z-50 border-r border-slate-900 shadow-2xl">
        <div className="p-6 pb-10">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/50"><Shield size={20} className="text-white" /></div>
            <span className="tracking-tighter uppercase font-black text-lg leading-none">Cuallee<br/><span className="text-blue-500">Cyber</span></span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 scrollbar-hide">
          <SidebarSection title="General">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" isActive={currentView === AppView.DASHBOARD} onClick={() => setCurrentView(AppView.DASHBOARD)} />
            <SidebarItem icon={Wand2} label="Wizard" isActive={currentView === AppView.WIZARD} onClick={() => setCurrentView(AppView.WIZARD)} badge="Save & Import" />
            <SidebarItem icon={GraduationCap} label="Academy" isActive={currentView === AppView.TRAINING} onClick={() => setCurrentView(AppView.TRAINING)} />
          </SidebarSection>
          <SidebarSection title="Compliance">
            <SidebarItem icon={ListChecks} label="Controls" isActive={currentView === AppView.CONTROLS} onClick={() => setCurrentView(AppView.CONTROLS)} />
            <SidebarItem icon={TrendingUp} label="SPRS Scorecard" isActive={currentView === AppView.SPRS_SCORECARD} onClick={() => setCurrentView(AppView.SPRS_SCORECARD)} />
            <SidebarItem icon={ClipboardCheck} label="Assessor View" isActive={currentView === AppView.ASSESSOR_PORTAL} onClick={() => setCurrentView(AppView.ASSESSOR_PORTAL)} badge="Official" />
            <SidebarItem icon={Package} label="Assets" isActive={currentView === AppView.ASSETS} onClick={() => setCurrentView(AppView.ASSETS)} />
            <SidebarItem icon={Users} label="Users" isActive={currentView === AppView.USERS} onClick={() => setCurrentView(AppView.USERS)} />
          </SidebarSection>
          <SidebarSection title="Governance">
            <SidebarItem icon={AlertTriangle} label="Risk Registry" isActive={currentView === AppView.RISK_MANAGEMENT} onClick={() => setCurrentView(AppView.RISK_MANAGEMENT)} />
            <SidebarItem icon={Calculator} label="FAIR Analyzer" isActive={currentView === AppView.FAIR_ANALYZER} onClick={() => setCurrentView(AppView.FAIR_ANALYZER)} />
            <SidebarItem icon={ShieldAlert} label="RMF Lifecycle" isActive={currentView === AppView.RMF_LIFECYCLE} onClick={() => setCurrentView(AppView.RMF_LIFECYCLE)} />
          </SidebarSection>
          <SidebarSection title="Documentation">
            <SidebarItem icon={FileCheck} label="Executive Summary" isActive={currentView === AppView.REPORT_EXECUTIVE} onClick={() => setCurrentView(AppView.REPORT_EXECUTIVE)} />
            <SidebarItem icon={FileText} label="System Security Plan" isActive={currentView === AppView.REPORT_SSP} onClick={() => setCurrentView(AppView.REPORT_SSP)} />
          </SidebarSection>
        </nav>
        <div className="p-4 mt-auto border-t border-slate-900 bg-slate-950/50">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Active Context</div>
          <div className="text-xs font-bold text-white truncate uppercase">{activeClient.name}</div>
          <button onClick={handleLogout} className="mt-4 w-full flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-red-400 transition-colors">
            <LogOut size={14} /> Log Out Securely
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-4"><h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{getViewLabel(currentView)}</h2></div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsChatOpen(!isChatOpen)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-[11px] transition-all ${isChatOpen ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><MessageSquare size={14} /> AI Support</button>
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">{userDisplayName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative bg-slate-50/50">
          <div className="h-full w-full overflow-y-auto">
            {currentView === AppView.DASHBOARD && <Dashboard requirements={activeData.requirements} artifacts={activeData.artifacts} activeFramework={activeFramework} targetLevel={activeData.targetCmmcLevel} onUpdateLevel={handleUpdateLevel} onNavigate={setCurrentView} onToggleChat={() => setIsChatOpen(!isChatOpen)} />}
            {currentView === AppView.WIZARD && <ComplianceWizard requirements={activeData.requirements} artifacts={activeData.artifacts} assets={activeData.assets} wizardProgress={activeData.wizardProgress} onUpdateRequirement={handleUpdateRequirement} onBatchUpdate={handleBatchUpdateRequirements} onAddArtifact={(a) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: [...prev[activeClientId].artifacts, a] }}))} onRemoveArtifact={(id) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: prev[activeClientId].artifacts.filter(art => art.id !== id) }}))} onUpdateProgress={(p) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], wizardProgress: p }}))} onUpdateLevel={handleUpdateLevel} targetLevel={activeData.targetCmmcLevel} activeFrameworkId={activeFramework.id} onComplete={() => setCurrentView(AppView.DASHBOARD)} onAddAsset={(a) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], assets: [...prev[activeClientId].assets, a] }}))} onDeleteAsset={(id) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], assets: prev[activeClientId].assets.filter(a => a.id !== id) }}))} />}
            {currentView === AppView.CONTROLS && (
                <div className="flex h-full">
                    <RequirementsList requirements={activeData.requirements} selectedReqId={selectedRequirementId} onSelectReq={(r) => { setSelectedRequirementId(r.id); localStorage.setItem(KEY_REQ, r.id); }} onUpdateRequirement={handleUpdateRequirement} onBatchUpdate={handleBatchUpdateRequirements} activeFrameworkId={activeFramework.id} targetLevel={activeData.targetCmmcLevel} />
                    {selectedRequirementId ? (
                        <RequirementDetail requirement={activeData.requirements.find(r => r.id === selectedRequirementId)!} onUpdateRequirement={handleUpdateRequirement} allArtifacts={activeData.artifacts} onAddArtifact={(a) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: [...prev[activeClientId].artifacts, a] }}))} onRemoveArtifact={(id) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: prev[activeClientId].artifacts.filter(art => art.id !== id) }}))} tickets={activeData.tickets} onAddTicket={(t) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], tickets: [...prev[activeClientId].tickets, t] }}))} cwConfig={activeData.cwConfig} jiraConfig={activeData.jiraConfig} currentUser={activeData.users[0]} activeClientId={activeClientId} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <div className="bg-slate-100 p-8 rounded-full mb-4"><ListChecks size={64} className="opacity-10" /></div>
                            <p className="font-bold uppercase tracking-widest text-sm">Select a practice to review details</p>
                        </div>
                    )}
                </div>
            )}
            {currentView === AppView.SPRS_SCORECARD && <SPRSScorecard requirements={activeData.requirements} activeFrameworkId={activeFramework.id} targetLevel={activeData.targetCmmcLevel} />}
            {currentView === AppView.TRAINING && <CmmcAcademy />}
            {currentView === AppView.ASSESSOR_PORTAL && <AssessorPortal client={activeClient} requirements={activeData.requirements} artifacts={activeData.artifacts} activeFramework={activeFramework} assets={activeData.assets} risks={activeData.risks} />}
            {currentView === AppView.RISK_MANAGEMENT && <RiskRegister risks={activeData.risks} financials={activeData.financials} onAddRisk={handleAddRisk} onUpdateRisk={handleUpdateRisk} onDeleteRisk={(id) => {}} onUpdateFinancials={handleUpdateFinancials} />}
            {currentView === AppView.FAIR_ANALYZER && <FairRiskAnalyzer risks={activeData.risks} financials={activeData.financials} onUpdateRisk={handleUpdateRisk} />}
            {currentView === AppView.RMF_LIFECYCLE && <RmfLifecycle />}
            {currentView === AppView.ASSETS && <Inventory assets={activeData.assets} onAddAsset={(a) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], assets: [...prev[activeClientId].assets, a] }}))} onDeleteAsset={(id) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], assets: prev[activeClientId].assets.filter(a => a.id !== id) }}))} />}
            {currentView === AppView.USERS && <UserManagement users={activeData.users} onAddUser={(u) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], users: [...prev[activeClientId].users, u] }}))} onUpdateUser={(u) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], users: prev[activeClientId].users.map(usr => usr.id === u.id ? u : usr) }}))} onDeleteUser={(id) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], users: prev[activeClientId].users.filter(u => u.id !== id) }}))} />}
            {currentView === AppView.REPORT_EXECUTIVE && <Reports requirements={activeData.requirements} activeFrameworkId={activeFramework.id} targetLevel={activeData.targetCmmcLevel} defaultTab="EXECUTIVE" />}
            {currentView === AppView.REPORT_SSP && <Reports requirements={activeData.requirements} activeFrameworkId={activeFramework.id} targetLevel={activeData.targetCmmcLevel} defaultTab="SSP" />}
          </div>
        </main>
        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
};

export default App;