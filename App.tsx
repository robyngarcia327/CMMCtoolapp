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
  BookOpen
} from 'lucide-react';

import { FRAMEWORKS, createInitialClientData, REQUIREMENTS_DATA } from './data/standards';
import { Requirement, Artifact, AppView, Ticket, User, Framework, Client, ClientData, CognitoGroup, Risk, WizardProgress, Asset, BudgetLineItem } from './types';
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
import { FairRiskAnalyzer } from './components/FairRiskAnalyzer';
import { CmmcAcademy } from './components/CmmcAcademy';
import { NetworkAnalyzer } from './components/NetworkAnalyzer';
import { BudgetCalculator } from './components/BudgetCalculator';
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
  const [clientDataStore, setClientDataStore] = useState<Record<string, ClientData>>({});
  const fetchAttempted = useRef(false);

  // Identity logic
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

  // DERIVED ACTIVE CLIENT (THE RECOVERY LOGIC)
  const activeClient = useMemo(() => {
    const client = clients.find(c => c.id === activeClientId) || clients[0];
    if (!client) return { name: 'Unauthorized Tenant', id: '', domain: '', industry: '', contactName: '', logoInitial: '?', primaryFramework: '', targetCmmcLevel: 2 as const, nextAuditDate: 0, accountManager: '', isParent: false };
    
    // Explicit branding for ArcLight
    const nameLower = client.name.toLowerCase();
    const domainLower = (client.domain || '').toLowerCase();
    const isGeneric = nameLower === 'organization' || nameLower === 'placeholder' || client.name.trim() === '';
    
    if (isGeneric || domainLower.includes('arclight')) {
        if (domainLower.includes('arclight')) return { ...client, name: 'ArcLight Information Technology' };
        
        const domainPrefix = (client.domain || 'organization').split('.')[0];
        const recoveredName = domainPrefix.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return { ...client, name: recoveredName };
    }
    return client;
  }, [clients, activeClientId]);

  // Sync state to local storage
  useEffect(() => { localStorage.setItem(KEY_VIEW, currentView); }, [currentView]);
  useEffect(() => { if (activeClientId) localStorage.setItem(KEY_CLIENT, activeClientId); }, [activeClientId]);
  useEffect(() => { if (selectedRequirementId) localStorage.setItem(KEY_REQ, selectedRequirementId); else localStorage.removeItem(KEY_REQ); }, [selectedRequirementId]);

  // Data Handlers (Functional Updates to prevent data loss)
  const handleUpdateRequirement = (updatedReq: Requirement) => {
    if (!activeClientId) return;
    setClientDataStore(prev => {
        const tenantData = prev[activeClientId];
        if (!tenantData) return prev;
        return {
            ...prev,
            [activeClientId]: {
                ...tenantData,
                requirements: tenantData.requirements.map(r => r.id === updatedReq.id ? updatedReq : r)
            }
        };
    });
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
        const persistedId = localStorage.getItem(KEY_CLIENT);
        const selectedId = mappedClients.some(c => c.id === persistedId) ? (persistedId as string) : mappedClients[0].id;
        setActiveClientId(selectedId);
        
        setClientDataStore(prev => {
          const nextStore = { ...prev };
          mappedClients.forEach(c => {
            if (!nextStore[c.id]) {
              nextStore[c.id] = createInitialClientData(false);
              // Ensure full requirements set is linked
              nextStore[c.id].requirements = JSON.parse(JSON.stringify(REQUIREMENTS_DATA));
              nextStore[c.id].users = [{ id: auth.user?.profile.sub || 'unknown', name: userDisplayName, email: auth.user?.profile.email || '', organizationId: c.id, domain: c.domain, role: userGroups[0] || 'Admin_Created_Users', department: 'Compliance', lastLogin: Date.now(), mfaEnabled: true, hasPasskey: false, isCuiAuthorized: true }];
            }
          });
          return nextStore;
        });
      }
      setHasCheckedOrgs(true);
    } catch (error) { console.error("Load failed", error); } finally { setIsDataLoading(false); }
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

  if (hasCheckedOrgs && !activeClientId) {
    return (
      <Onboarding user={{ id: auth.user?.profile.sub || '', name: userDisplayName, email: auth.user?.profile.email || '', role: 'Admin_Created_Users', domain: (auth.user?.profile.email || '').split('@')[1], organizationId: '', department: '', lastLogin: 0, mfaEnabled: false, hasPasskey: false, isCuiAuthorized: false }} onCreateOrganization={async (name, domain) => {
          if (!auth.user?.id_token) return;
          setIsDataLoading(true);
          try { await api.createOrg(auth.user.id_token, name, domain); fetchAttempted.current = false; await loadOrganizations(); } catch (e) { setIsDataLoading(false); }
        }} onRefresh={() => { fetchAttempted.current = false; loadOrganizations(); }}
      />
    );
  }

  const activeData = clientDataStore[activeClientId];
  if (!activeData) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 size={48} className="animate-spin" /></div>;

  // FIX: Explicitly cast activeData to ClientData to resolve type inference issues where users property was being seen as part of 'unknown'
  const targetLevel = (activeData as ClientData).targetCmmcLevel;
  // FIX: Explicitly cast activeData to ClientData to resolve type inference issues where users property was being seen as part of 'unknown'
  const currentUser = (activeData as ClientData).users[0];
  // FIX: Explicitly type the iteration variable 'd' as ClientData to resolve 'unknown' type error in flatMap
  const allUsersAcrossTenants = Object.values(clientDataStore).flatMap((d: ClientData) => d.users);

  const getViewLabel = (view: AppView) => {
    switch(view) {
      case AppView.DASHBOARD: return "Assurance Insights";
      case AppView.WIZARD: return "Guided Compliance Wizard";
      case AppView.CONTROLS: return "Security Control Audit";
      case AppView.SPRS_SCORECARD: return "DoD SPRS Scoring";
      case AppView.TRAINING: return "CMMC Academy // Assessment Mastery";
      case AppView.ASSETS: return "CUI Scoped Assets";
      case AppView.USERS: return "Identity Pool & Access";
      case AppView.NETWORK_DIAGRAM: return "Network & Scope Diagrams";
      case AppView.RISK_MANAGEMENT: return "Risk Register";
      case AppView.FAIR_ANALYZER: return "Quantitative Risk Analysis (FAIR)";
      case AppView.POAM: return "POA&M Remediation";
      case AppView.COST_TO_COMPLIANCE: return "Certification Budgeting";
      case AppView.ASSESSOR_PORTAL: return "Assessor Review Suite";
      case AppView.REPORT_EXECUTIVE: return "Executive Summary";
      case AppView.REPORT_SSP: return "System Security Plan (SSP)";
      case AppView.REPORT_POLICY_CENTER: return "Organization Policy Center";
      default: return "Cuallee Cyber";
    }
  };

  const selectedReq = selectedRequirementId ? activeData.requirements.find(r => r.id === selectedRequirementId) : null;

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
            <SidebarItem icon={Wand2} label="Wizard" isActive={currentView === AppView.WIZARD} onClick={() => setCurrentView(AppView.WIZARD)} badge="Guided" />
            <SidebarItem icon={GraduationCap} label="CMMC Academy" isActive={currentView === AppView.TRAINING} onClick={() => setCurrentView(AppView.TRAINING)} badge="New" />
          </SidebarSection>
          <SidebarSection title="Compliance">
            <SidebarItem icon={ListChecks} label="Controls" isActive={currentView === AppView.CONTROLS} onClick={() => setCurrentView(AppView.CONTROLS)} />
            <SidebarItem icon={TrendingUp} label="SPRS Scorecard" isActive={currentView === AppView.SPRS_SCORECARD} onClick={() => setCurrentView(AppView.SPRS_SCORECARD)} />
            <SidebarItem icon={Package} label="Assets" isActive={currentView === AppView.ASSETS} onClick={() => setCurrentView(AppView.ASSETS)} />
            <SidebarItem icon={Users} label="Users" isActive={currentView === AppView.USERS} onClick={() => setCurrentView(AppView.USERS)} />
            <SidebarItem icon={Network} label="Network Diagram" isActive={currentView === AppView.NETWORK_DIAGRAM} onClick={() => setCurrentView(AppView.NETWORK_DIAGRAM)} />
          </SidebarSection>
          <SidebarSection title="Governance">
            <SidebarItem icon={AlertTriangle} label="Risk Register" isActive={currentView === AppView.RISK_MANAGEMENT} onClick={() => setCurrentView(AppView.RISK_MANAGEMENT)} />
            <SidebarItem icon={ShieldAlert} label="FAIR Analysis" isActive={currentView === AppView.FAIR_ANALYZER} onClick={() => setCurrentView(AppView.FAIR_ANALYZER)} badge="PRO" />
            <SidebarItem icon={ClipboardList} label="POA&M" isActive={currentView === AppView.POAM} onClick={() => setCurrentView(AppView.POAM)} />
            <SidebarItem icon={Calculator} label="Cost to Compliance" isActive={currentView === AppView.COST_TO_COMPLIANCE} onClick={() => setCurrentView(AppView.COST_TO_COMPLIANCE)} />
          </SidebarSection>
          <SidebarSection title="Assessor Portal">
            <SidebarItem icon={Eye} label="Assessor Review" isActive={currentView === AppView.ASSESSOR_PORTAL} onClick={() => setCurrentView(AppView.ASSESSOR_PORTAL)} />
          </SidebarSection>
          <SidebarSection title="Reports">
            <SidebarItem icon={BarChart3} label="Executive Summary" isActive={currentView === AppView.REPORT_EXECUTIVE} onClick={() => setCurrentView(AppView.REPORT_EXECUTIVE)} />
            <SidebarItem icon={ShieldCheck} label="SSP Generator" isActive={currentView === AppView.REPORT_SSP} onClick={() => setCurrentView(AppView.REPORT_SSP)} />
            <SidebarItem icon={FileText} label="Policy Center" isActive={currentView === AppView.REPORT_POLICY_CENTER} onClick={() => setCurrentView(AppView.REPORT_POLICY_CENTER)} />
          </SidebarSection>
          {isTenantAdmin && (
            <SidebarSection title="System">
              <SidebarItem icon={Settings} label="Tenant Settings" isActive={currentView === AppView.ORGANIZATION_MANAGER} onClick={() => setCurrentView(AppView.ORGANIZATION_MANAGER)} />
            </SidebarSection>
          )}
        </nav>
        <div className="p-4 mt-auto border-t border-slate-900 bg-slate-950/50">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Active Tenant</div>
          <div className="text-xs font-bold text-white truncate uppercase">{activeClient.name}</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-4"><h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{getViewLabel(currentView)}</h2></div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsChatOpen(!isChatOpen)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-[11px] transition-all ${isChatOpen ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><MessageSquare size={14} /> AI Support</button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="relative">
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] font-black text-blue-600 tracking-tight uppercase leading-none mb-0.5">{activeClient.name}</div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">{userDisplayName}</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{userGroups[0]?.replace(/_/g, ' ') || 'Identity Member'}</div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black border-2 border-white shadow-xl shadow-blue-600/20 text-sm">{userDisplayName.charAt(0).toUpperCase()}</div>
              </button>
              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="px-5 py-3 border-b border-slate-50 mb-1">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Signed in as</div>
                        <div className="text-xs font-bold text-slate-700 truncate">{auth.user?.profile.email}</div>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-xs text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-black uppercase tracking-widest"><LogOut size={14} /> Sign Out</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative bg-slate-50/50">
          <div className="h-full w-full overflow-y-auto">
            {currentView === AppView.DASHBOARD && <Dashboard requirements={activeData.requirements} artifacts={activeData.artifacts} activeFramework={activeFramework} targetLevel={targetLevel} onUpdateLevel={handleUpdateLevel} onNavigate={setCurrentView} onToggleChat={() => setIsChatOpen(!isChatOpen)} />}
            {currentView === AppView.WIZARD && <ComplianceWizard requirements={activeData.requirements} artifacts={activeData.artifacts} assets={activeData.assets} wizardProgress={activeData.wizardProgress} onUpdateRequirement={handleUpdateRequirement} onAddArtifact={(a) => { setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: [...prev[activeClientId].artifacts, a] } })) }} onRemoveArtifact={(id) => { setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: prev[activeClientId].artifacts.filter(a => a.id !== id) } })) }} onUpdateProgress={(p) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], wizardProgress: p } }))} onUpdateLevel={handleUpdateLevel} targetLevel={targetLevel} activeFrameworkId={activeFramework.id} onComplete={() => setCurrentView(AppView.DASHBOARD)} />}
            {currentView === AppView.CONTROLS && (
              <div className="flex h-full overflow-hidden">
                <RequirementsList requirements={activeData.requirements} selectedReqId={selectedRequirementId} onSelectReq={(r) => setSelectedRequirementId(r.id)} activeFrameworkId={activeFramework.id} targetLevel={targetLevel} />
                {selectedReq ? (
                  <RequirementDetail requirement={selectedReq} onUpdateRequirement={handleUpdateRequirement} allArtifacts={activeData.artifacts} onAddArtifact={(a) => { setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: [...prev[activeClientId].artifacts, a] } })) }} onRemoveArtifact={(id) => { setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: prev[activeClientId].artifacts.filter(a => a.id !== id) } })) }} tickets={[]} onAddTicket={() => {}} cwConfig={activeData.cwConfig} jiraConfig={activeData.jiraConfig} currentUser={currentUser} activeClientId={activeClientId} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
                        <ListChecks size={80} className="opacity-10 mb-4" />
                        <p className="text-sm font-black uppercase tracking-widest">Select a Control to Audit</p>
                        <p className="text-xs text-slate-400 mt-2">Pick a security family from the left sidebar to begin.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {currentView === AppView.SPRS_SCORECARD && <SPRSScorecard requirements={activeData.requirements} activeFrameworkId={activeFramework.id} targetLevel={targetLevel} />}
            {currentView === AppView.TRAINING && <CmmcAcademy />}
            {currentView === AppView.ASSETS && <Inventory assets={activeData.assets} onAddAsset={(a) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], assets: [...prev[activeClientId].assets, a] } }))} onDeleteAsset={(id) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], assets: (prev[activeClientId].assets || []).filter(a => a.id !== id) } }))} />}
            {currentView === AppView.USERS && <UserManagement users={activeData.users} onAddUser={() => {}} onUpdateUser={() => {}} onDeleteUser={() => {}} />}
            {currentView === AppView.NETWORK_DIAGRAM && <NetworkAnalyzer />}
            {currentView === AppView.RISK_MANAGEMENT && <RiskRegister risks={activeData.risks} onAddRisk={(r) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], risks: [...prev[activeClientId].risks, r] } }))} onUpdateRisk={() => {}} onDeleteRisk={(id) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], risks: prev[activeClientId].risks.filter(r => r.id !== id) } }))} />}
            {currentView === AppView.FAIR_ANALYZER && <FairRiskAnalyzer risks={activeData.risks} onUpdateRisk={(r) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], risks: prev[activeClientId].risks.map(risk => risk.id === r.id ? r : risk) } }))} />}
            {currentView === AppView.POAM && <Reports requirements={activeData.requirements} risks={activeData.risks} activeFrameworkId={activeFramework.id} targetLevel={targetLevel} onUpdateRequirement={handleUpdateRequirement} defaultTab="POAM" />}
            {currentView === AppView.COST_TO_COMPLIANCE && <BudgetCalculator requirements={activeData.requirements} budgetItems={activeData.budgetItems || []} onAddItem={(i) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], budgetItems: [...prev[activeClientId].budgetItems, i] } }))} onRemoveItem={(id) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], budgetItems: prev[activeClientId].budgetItems.filter(i => i.id !== id) } }))} />}
            {currentView === AppView.ASSESSOR_PORTAL && <AssessorPortal client={activeClient} requirements={activeData.requirements} artifacts={activeData.artifacts} risks={activeData.risks} assets={activeData.assets} activeFramework={activeFramework} />}
            {currentView === AppView.REPORT_EXECUTIVE && <Reports requirements={activeData.requirements} risks={activeData.risks} activeFrameworkId={activeFramework.id} targetLevel={targetLevel} defaultTab="EXECUTIVE" />}
            {currentView === AppView.REPORT_SSP && <Reports requirements={activeData.requirements} activeFrameworkId={activeFramework.id} targetLevel={targetLevel} sspMetadata={activeData.sspMetadata} defaultTab="SSP" />}
            {currentView === AppView.REPORT_POLICY_CENTER && <Reports requirements={activeData.requirements} activeFrameworkId={activeFramework.id} targetLevel={targetLevel} defaultTab="MATRIX" />}
            {currentView === AppView.ORGANIZATION_MANAGER && <OrganizationManager clients={clients} clientDataStore={clientDataStore} activeClientId={activeClientId} onAddClient={() => {}} onUpdateClient={() => {}} onDeleteClient={() => {}} onUpdateClientData={() => {}} />}
          </div>
        </main>
        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
};

export default App;