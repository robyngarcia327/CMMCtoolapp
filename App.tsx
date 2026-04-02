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
  ArrowRight,
  FileCheck2,
  AlertCircle,
  RefreshCcw,
  GitBranch
} from 'lucide-react';

import { FRAMEWORKS, createInitialClientData, REQUIREMENTS_DATA } from './data/standards';
import { Requirement, Artifact, AppView, Ticket, User, Framework, Client, ClientData, CognitoGroup, Risk, WizardProgress, Asset, BudgetLineItem, OrganizationFinancials, ControlMastery, ProjectTask } from './types';
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
import { RiskRegistry } from './components/RiskRegistry';
import { FairRiskAnalyzer } from './components/FairRiskAnalyzer';
import { CmmcAcademy } from './components/CmmcAcademy';
import { RmfLifecycle } from './components/RmfLifecycle';
import { BudgetCalculator } from './components/BudgetCalculator';
import { PolicyReviewCenter } from './components/PolicyReviewCenter';
import { PackageReviewCenter } from './components/PackageReviewCenter';
import { PoamRegistry } from './components/PoamRegistry';
import { WorkflowManager } from './components/WorkflowManager';
import { SecureVault } from './components/SecureVault';
import { VendorManager } from './components/VendorManager';
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
        ? 'bg-coral-600 text-white shadow-lg shadow-coral-900/20 font-bold' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={18} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-coral-400'} transition-colors`} />
    <span className="flex-1 text-left text-sm whitespace-nowrap">{label}</span>
    {badge && (
      <span className="bg-coral-500/20 text-coral-400 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">
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
  try {
    const auth = useAuth();
  console.log("App Render - Auth State:", { 
    isAuthenticated: auth.isAuthenticated, 
    isLoading: auth.isLoading, 
    error: auth.error?.message,
    user: auth.user ? "Present" : "Missing"
  });
  
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
  const [isDataLoading, setIsDataLoading] = useState(false); 
  const [apiError, setApiError] = useState<string | null>(null);
  const [hasCheckedOrgs, setHasCheckedOrgs] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeFramework, setActiveFramework] = useState<Framework>(FRAMEWORKS[0]);
  
  const [clientDataStore, setClientDataStore] = useState<Record<string, ClientData>>(() => {
    const saved = localStorage.getItem(KEY_DATASTORE);
    return saved ? JSON.parse(saved) : {};
  });

  const fetchAttempted = useRef(false);

  // --- DEEP DATA INTEGRITY SYNC ---
  useEffect(() => {
    if (activeClientId && clientDataStore[activeClientId]) {
        const clientData = clientDataStore[activeClientId];
        const clientReqs = clientData.requirements;
        let needsSync = false;

        const syncedReqs = clientReqs.map(existing => {
            const official = REQUIREMENTS_DATA.find(o => o.id === existing.id);
            if (official) {
                const isPlaceholder = existing.objectives?.some(eo => eo.description.includes('is satisfied') || eo.description.includes('objective ['));
                const needsDescriptionSync = isPlaceholder || official.objectives.some(o => {
                    const matched = existing.objectives?.find(eo => eo.id === o.id);
                    return !matched || matched.description !== o.description;
                });

                if (needsDescriptionSync || official.objectives.length !== (existing.objectives?.length || 0)) {
                    needsSync = true;
                    return {
                        ...existing,
                        objectives: official.objectives.map(o => {
                            const existingObj = existing.objectives?.find(eo => eo.id === o.id);
                            return existingObj ? { ...o, status: existingObj.status } : o;
                        })
                    };
                }
            }
            return existing;
        });

        const currentIds = new Set(clientReqs.map(r => r.id));
        const missingFromClient = REQUIREMENTS_DATA.filter(r => r.framework === 'NIST-CMMC' && !currentIds.has(r.id));
        
        if (needsSync || missingFromClient.length > 0) {
            const finalReqs = [...syncedReqs, ...missingFromClient];
            finalReqs.sort((a, b) => {
                const aParts = a.id.split('.').map(Number);
                const bParts = b.id.split('.').map(Number);
                for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                    if ((aParts[i] || 0) < (bParts[i] || 0)) return -1;
                    if ((aParts[i] || 0) > (bParts[i] || 0)) return 1;
                }
                return 0;
            });

            setClientDataStore(prev => ({
                ...prev,
                [activeClientId]: { ...prev[activeClientId], requirements: finalReqs }
            }));
        }
    }
  }, [activeClientId]);

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
    return profile.name || (profile.email || 'User').split('@')[0];
  }, [auth.user]);

  const activeClient = useMemo(() => {
    const client = clients.find(c => c.id === activeClientId);
    if (client) return client;
    if (clients.length > 0) return clients[0];
    return { name: 'Unauthorized Tenant', id: '', domain: '', industry: '', contactName: '', logoInitial: '?', primaryFramework: '', targetCmmcLevel: 2 as const, nextAuditDate: 0, accountManager: '', isParent: false };
  }, [clients, activeClientId]);

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

  const handleBatchUpdateRequirements = (newReqs: Requirement[]) => {
      if (!activeClientId) return;
      setClientDataStore(prev => {
          const merged = [...prev[activeClientId].requirements];
          newReqs.forEach(nr => {
              const idx = merged.findIndex(r => r.id === nr.id);
              if (idx !== -1) merged[idx] = nr;
              else merged.push(nr);
          });
          return { ...prev, [activeClientId]: { ...prev[activeClientId], requirements: merged } };
      });
  };

  const handleUpdateClientData = (updates: Partial<ClientData>) => {
      if (!activeClientId) return;
      setClientDataStore(prev => ({
          ...prev,
          [activeClientId]: { ...prev[activeClientId], ...updates }
      }));
  };

  const handleUpdateFinancials = (fin: OrganizationFinancials) => {
      if (!activeClientId) return;
      setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], financials: fin } }));
  };

  const handleUpdateRisk = (risk: Risk) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], risks: prev[activeClientId].risks.map(r => r.id === risk.id ? risk : r) } }));
  };

  const handleAddRisk = (risk: Risk) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], risks: [...prev[activeClientId].risks, risk] } }));
  };

  const handleUpdateLevel = (lvl: 1 | 2 | 3) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], targetCmmcLevel: lvl } }));
  };

  const handleUpdateMastery = (updatedMastery: Record<string, ControlMastery>) => {
    if (!activeClientId) return;
    setClientDataStore(prev => ({
        ...prev,
        [activeClientId]: {
            ...prev[activeClientId],
            mastery: { ...prev[activeClientId].mastery, ...updatedMastery }
        }
    }));
  };

  const handleAddTasks = (tasks: ProjectTask[]) => {
      if (!activeClientId) return;
      setClientDataStore(prev => ({
          ...prev,
          [activeClientId]: {
              ...prev[activeClientId],
              tasks: [...prev[activeClientId].tasks, ...tasks]
          }
      }));
  };

  const loadOrganizations = useCallback(async () => {
    // FIX: Using ID TOKEN for API calls as required by Cognito Authorizers
    const idToken = auth.user?.id_token;
    if (!auth.isAuthenticated || !idToken) return;
    
    setIsDataLoading(true);
    setApiError(null);
    try {
      const apiOrgs = await api.getOrgs(idToken);
      
      const mappedClients: Client[] = apiOrgs.map((o: any) => ({
        id: o.orgId, 
        name: o.name || 'Organization', 
        domain: (auth.user?.profile.email || '').split('@')[1], 
        industry: 'Defense Industrial Base', 
        contactName: auth.user?.profile.email || 'Admin', 
        logoInitial: (o.name || 'O').charAt(0).toUpperCase(), 
        primaryFramework: 'NIST-CMMC', 
        targetCmmcLevel: 2, 
        nextAuditDate: Date.now() + 31536000000, 
        accountManager: 'Self-Managed', 
        isParent: false
      }));
      
      setClients(mappedClients);
      
      if (mappedClients.length > 0) {
        const savedId = localStorage.getItem(KEY_CLIENT);
        const selId = (savedId && mappedClients.some(c => c.id === savedId)) 
          ? savedId 
          : mappedClients[0].id;
          
        setActiveClientId(selId);
        setClientDataStore(prev => {
          const nextStore = { ...prev };
          mappedClients.forEach(c => {
            if (!nextStore[c.id]) nextStore[c.id] = createInitialClientData(false);
          });
          return nextStore;
        });
      }
    } catch (error: any) { 
      console.error("Discovery error:", error); 
      //Surfaces the detailed error from fetchJson
      setApiError(error.message);
    } finally { 
      setIsDataLoading(false); 
      setHasCheckedOrgs(true); 
    }
  }, [auth.isAuthenticated, auth.user]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id_token && !fetchAttempted.current) {
      fetchAttempted.current = true;
      loadOrganizations();
    }
  }, [auth.isAuthenticated, auth.user, loadOrganizations]);

  const handleLogout = () => { auth.signoutRedirect(); };
  
  if (auth.isLoading) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-coral-500" size={48} /></div>;
  if (!auth.isAuthenticated) return <Login />;

  if (apiError) {
      return (
          <div className="flex h-screen flex-col items-center justify-center bg-slate-950 p-8 text-center">
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex items-center justify-center mb-6">
                  <AlertCircle size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Vault Connection Failure</h2>
              <p className="text-slate-400 max-w-md mb-8">{apiError}</p>
              <button 
                  onClick={() => { fetchAttempted.current = false; loadOrganizations(); }}
                  className="bg-white text-slate-950 px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-coral-50 transition-all"
              >
                  <RefreshCcw size={16} /> Retry Connection
              </button>
          </div>
      );
  }

  if (isDataLoading && !hasCheckedOrgs) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-coral-600" size={48} /></div>;

  const [creationStatus, setCreationStatus] = useState<'idle' | 'creating' | 'verifying' | 'failed_verification'>('idle');

  const handleCreateOrganization = async (name: string, domain: string, financials: OrganizationFinancials) => {
    if (!auth.user?.id_token) return;
    setCreationStatus('creating');
    setIsDataLoading(true);
    try {
      const newOrg = await api.createOrg(auth.user.id_token, name, domain);
      setCreationStatus('verifying');
      setClientDataStore(prev => ({
        ...prev,
        [newOrg.orgId]: { ...createInitialClientData(false), financials }
      }));
      fetchAttempted.current = false;
      await loadOrganizations();
      setCreationStatus('idle');
    } catch (error: any) {
      setCreationStatus('failed_verification');
      throw error; // Rethrow to be caught by Onboarding's handleSubmitFinal
    } finally {
      setIsDataLoading(false);
    }
  };

  if (hasCheckedOrgs && (clients.length === 0 || !activeClientId)) {
    return (
      <Onboarding 
        user={{ 
          id: auth.user?.profile.sub || '', 
          name: userDisplayName, 
          email: auth.user?.profile.email || '', 
          role: 'Admin_Created_Users', 
          domain: (auth.user?.profile.email || '').split('@')[1], 
          organizationId: '', 
          department: '', 
          lastLogin: 0, 
          mfaEnabled: false, 
          hasPasskey: false, 
          isCuiAuthorized: false 
        }} 
        onCreateOrganization={handleCreateOrganization} 
        onRefresh={() => { fetchAttempted.current = false; loadOrganizations(); }} 
        creationStatus={creationStatus}
        debugTokens={{ idToken: auth.user?.id_token }} 
      />
    );
  }

  const activeData = clientDataStore[activeClientId];
  if (!activeData) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 size={48} className="animate-spin" /></div>;

  const getViewLabel = (view: AppView) => {
    switch(view) {
      case AppView.DASHBOARD: return "Posture Insights";
      case AppView.WIZARD: return "Guided Wizard";
      case AppView.CONTROLS: return "Audit Criteria";
      case AppView.SPRS_SCORECARD: return "DoD Scorecard";
      case AppView.WORKFLOWS: return "Organizational Workflows";
      case AppView.ASSESSOR_PORTAL: return "Assessor View";
      case AppView.ASSETS: return "Asset Pool";
      case AppView.USERS: return "Identity Management";
      case AppView.RISK_MANAGEMENT: return "Risk Registry";
      case AppView.FAIR_ANALYZER: return "FAIR Modeler";
      case AppView.RMF_LIFECYCLE: return "RMF Lifecycle";
      case AppView.COST_TO_COMPLIANCE: return "Financial Strategy";
      case AppView.REPORT_EXECUTIVE: return "Executive Report";
      case AppView.REPORT_SSP: return "System Security Plan";
      case AppView.POLICY_AUDIT: return "Policy Review";
      case AppView.PACKAGE_REVIEW: return "Package Auditor";
      case AppView.SECURE_VAULT: return "Secure Document Vault";
      case AppView.VENDORS: return "Vendor Ecosystem";
      case AppView.POAM: return "POA&M Registry";
      default: return "Cuallee Cyber";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 z-50 border-r border-silver-800 shadow-2xl">
        <div className="p-6 pb-10">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-coral-600 rounded-xl shadow-lg shadow-coral-900/20"><Shield size={20} className="text-white" /></div>
            <span className="tracking-tighter uppercase font-black text-lg leading-none">Cuallee<br/><span className="text-coral-500">Cyber</span></span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 scrollbar-hide">
          <SidebarSection title="General">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" isActive={currentView === AppView.DASHBOARD} onClick={() => setCurrentView(AppView.DASHBOARD)} />
            <SidebarItem icon={Wand2} label="Wizard" isActive={currentView === AppView.WIZARD} onClick={() => setCurrentView(AppView.WIZARD)} badge="Guided" />
            <SidebarItem icon={GitBranch} label="Workflows" isActive={currentView === AppView.WORKFLOWS} onClick={() => setCurrentView(AppView.WORKFLOWS)} />
          </SidebarSection>
          <SidebarSection title="Compliance">
            <SidebarItem icon={ListChecks} label="Controls" isActive={currentView === AppView.CONTROLS} onClick={() => setCurrentView(AppView.CONTROLS)} />
            <SidebarItem icon={ClipboardList} label="POA&M" isActive={currentView === AppView.POAM} onClick={() => setCurrentView(AppView.POAM)} />
            <SidebarItem icon={TrendingUp} label="SPRS Scorecard" isActive={currentView === AppView.SPRS_SCORECARD} onClick={() => setCurrentView(AppView.SPRS_SCORECARD)} />
            <SidebarItem icon={ClipboardCheck} label="Assessor View" isActive={currentView === AppView.ASSESSOR_PORTAL} onClick={() => setCurrentView(AppView.ASSESSOR_PORTAL)} badge="CAP 2.0" />
            <SidebarItem icon={Package} label="Assets" isActive={currentView === AppView.ASSETS} onClick={() => setCurrentView(AppView.ASSETS)} />
            <SidebarItem icon={Users} label="Users" isActive={currentView === AppView.USERS} onClick={() => setCurrentView(AppView.USERS)} />
            <SidebarItem icon={Building2} label="Vendors" isActive={currentView === AppView.VENDORS} onClick={() => setCurrentView(AppView.VENDORS)} />
          </SidebarSection>
          <SidebarSection title="Governance">
            <SidebarItem icon={AlertTriangle} label="Risk Registry" isActive={currentView === AppView.RISK_MANAGEMENT} onClick={() => setCurrentView(AppView.RISK_MANAGEMENT)} />
            <SidebarItem icon={Calculator} label="FAIR Analyzer" isActive={currentView === AppView.FAIR_ANALYZER} onClick={() => setCurrentView(AppView.FAIR_ANALYZER)} />
            <SidebarItem icon={ShieldAlert} label="RMF Lifecycle" isActive={currentView === AppView.RMF_LIFECYCLE} onClick={() => setCurrentView(AppView.RMF_LIFECYCLE)} />
            <SidebarItem icon={BarChart3} label="Budgeting" isActive={currentView === AppView.COST_TO_COMPLIANCE} onClick={() => setCurrentView(AppView.COST_TO_COMPLIANCE)} />
          </SidebarSection>
          <SidebarSection title="Reports">
            <SidebarItem icon={Shield} label="Secure Vault" isActive={currentView === AppView.SECURE_VAULT} onClick={() => setCurrentView(AppView.SECURE_VAULT)} badge="New" />
            <SidebarItem icon={FileSearch} label="Package Auditor" isActive={currentView === AppView.PACKAGE_REVIEW} onClick={() => setCurrentView(AppView.PACKAGE_REVIEW)} badge="AI" />
            <SidebarItem icon={FileCheck2} label="Policy Review" isActive={currentView === AppView.POLICY_AUDIT} onClick={() => setCurrentView(AppView.POLICY_AUDIT)} />
            <SidebarItem icon={FileCheck} label="Executive Summary" isActive={currentView === AppView.REPORT_EXECUTIVE} onClick={() => setCurrentView(AppView.REPORT_EXECUTIVE)} />
            <SidebarItem icon={FileText} label="System Security Plan" isActive={currentView === AppView.REPORT_SSP} onClick={() => setCurrentView(AppView.REPORT_SSP)} />
          </SidebarSection>
        </nav>
        <div className="p-4 mt-auto border-t border-slate-900 bg-slate-950/50">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Context</div>
          <div className="text-xs font-bold text-white truncate uppercase">{activeClient.name}</div>
          <button onClick={handleLogout} className="mt-4 w-full flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-red-400 transition-colors">
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-silver-200 px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-4"><h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{getViewLabel(currentView)}</h2></div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsChatOpen(!isChatOpen)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-[11px] transition-all ${isChatOpen ? 'bg-coral-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><MessageSquare size={14} /> AI Expert</button>
            <div className="w-8 h-8 rounded-xl bg-coral-600 flex items-center justify-center text-white font-black shadow-lg shadow-coral-200">{userDisplayName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative bg-slate-50/50">
          <div className="h-full w-full overflow-y-auto">
            {currentView === AppView.DASHBOARD && <Dashboard requirements={activeData.requirements} artifacts={activeData.artifacts} activeFramework={activeFramework} targetLevel={activeData.targetCmmcLevel} onUpdateLevel={handleUpdateLevel} onNavigate={setCurrentView} onToggleChat={() => setIsChatOpen(!isChatOpen)} />}
            {currentView === AppView.WIZARD && (
                <ComplianceWizard 
                    requirements={activeData.requirements} 
                    artifacts={activeData.artifacts} 
                    assets={activeData.assets} 
                    wizardProgress={activeData.wizardProgress} 
                    activeClientData={activeData}
                    onUpdateRequirement={handleUpdateRequirement} 
                    onBatchUpdate={handleBatchUpdateRequirements} 
                    onAddArtifact={(a) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: [...prev[activeClientId].artifacts, a] }}))} 
                    onRemoveArtifact={(id: string) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: prev[activeClientId].artifacts.filter(art => art.id !== id) }}))} 
                    onUpdateProgress={(p) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], wizardProgress: p }}))} 
                    onUpdateLevel={handleUpdateLevel} 
                    onUpdateClientData={handleUpdateClientData}
                    targetLevel={activeData.targetCmmcLevel} 
                    activeFrameworkId={activeFramework.id} 
                    activeClientId={activeClientId}
                    onComplete={() => setCurrentView(AppView.DASHBOARD)} 
                    onAddAsset={(a) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], assets: [...prev[activeClientId].assets, a] }}))} 
                    onDeleteAsset={(id: string) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], assets: prev[activeClientId].assets.filter(a => a.id !== id) }}))} 
                />
            )}
            {currentView === AppView.CONTROLS && (
                <div className="flex h-full">
                    <RequirementsList requirements={activeData.requirements} selectedReqId={selectedRequirementId} onSelectReq={(r) => { setSelectedRequirementId(r.id); localStorage.setItem(KEY_REQ, r.id); }} onUpdateRequirement={handleUpdateRequirement} onBatchUpdate={handleBatchUpdateRequirements} activeFrameworkId={activeFramework.id} targetLevel={activeData.targetCmmcLevel} />
                    {selectedRequirementId ? (
                        <RequirementDetail requirement={activeData.requirements.find(r => r.id === selectedRequirementId)!} onUpdateRequirement={handleUpdateRequirement} allArtifacts={activeData.artifacts} onAddArtifact={(a) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: [...prev[activeClientId].artifacts, a] }}))} onRemoveArtifact={(id: string) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], artifacts: prev[activeClientId].artifacts.filter(art => art.id !== id) }}))} tickets={activeData.tickets} onAddTicket={(t) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], tickets: [...prev[activeClientId].tickets, t] }}))} cwConfig={activeData.cwConfig} jiraConfig={activeData.jiraConfig} currentUser={activeData.users[0]} activeClientId={activeClientId} policies={activeData.policies} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <div className="bg-slate-100 p-12 rounded-full mb-4 shadow-inner"><ListChecks size={64} className="opacity-10" /></div>
                            <p className="font-bold uppercase tracking-widest text-sm">Select a requirement to audit criteria</p>
                        </div>
                    )}
                </div>
            )}
            {currentView === AppView.SPRS_SCORECARD && <SPRSScorecard requirements={activeData.requirements} activeFrameworkId={activeFramework.id} targetLevel={activeData.targetCmmcLevel} />}
            {currentView === AppView.WORKFLOWS && (
                <WorkflowManager 
                    workflows={activeData.workflows || []} 
                    onUpdate={handleUpdateClientData} 
                />
            )}
            {currentView === AppView.ASSESSOR_PORTAL && <AssessorPortal client={activeClient} requirements={activeData.requirements} artifacts={activeData.artifacts} activeFramework={activeFramework} assets={activeData.assets} risks={activeData.risks} policies={activeData.policies} />}
            {currentView === AppView.RISK_MANAGEMENT && <RiskRegistry risks={activeData.risks} financials={activeData.financials} onAddRisk={handleAddRisk} onUpdateRisk={handleUpdateRisk} onDeleteRisk={(id: string) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], risks: prev[activeClientId].risks.filter(r => r.id !== id) }}))} onUpdateFinancials={handleUpdateFinancials} />}
            {currentView === AppView.FAIR_ANALYZER && <FairRiskAnalyzer risks={activeData.risks} financials={activeData.financials} onUpdateRisk={handleUpdateRisk} />}
            {currentView === AppView.RMF_LIFECYCLE && <RmfLifecycle />}
            {currentView === AppView.COST_TO_COMPLIANCE && <BudgetCalculator requirements={activeData.requirements} budgetItems={activeData.budgetItems} onAddItem={(i) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], budgetItems: [...prev[activeClientId].budgetItems, i] }}))} onRemoveItem={(id: string) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], budgetItems: prev[activeClientId].budgetItems.filter(i => i.id !== id) }}))} />}
            {currentView === AppView.ASSETS && <Inventory assets={activeData.assets} onAddAsset={(a) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], assets: [...prev[activeClientId].assets, a] }}))} onDeleteAsset={(id: string) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], assets: prev[activeClientId].assets.filter(a => a.id !== id) }}))} />}
            {currentView === AppView.USERS && <UserManagement users={activeData.users} onAddUser={(u) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], users: [...prev[activeClientId].users, u] }}))} onUpdateUser={(u) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], users: prev[activeClientId].users.map(usr => usr.id === u.id ? u : usr) }}))} onDeleteUser={(id: string) => setClientDataStore(prev => ({ ...prev, [activeClientId]: { ...prev[activeClientId], users: prev[activeClientId].users.filter(u => u.id !== id) }}))} />}
            {currentView === AppView.REPORT_EXECUTIVE && <Reports requirements={activeData.requirements} activeFrameworkId={activeFramework.id} targetLevel={activeData.targetCmmcLevel} defaultTab="EXECUTIVE" />}
            {currentView === AppView.REPORT_SSP && <Reports requirements={activeData.requirements} activeFrameworkId={activeFramework.id} targetLevel={activeData.targetCmmcLevel} defaultTab="SSP" />}
            {currentView === AppView.POLICY_AUDIT && <PolicyReviewCenter 
              requirements={activeData.requirements} 
              activeFrameworkId={activeFramework.id} 
              policies={activeData.policies}
              onUpdate={handleUpdateClientData}
            />}
            {currentView === AppView.PACKAGE_REVIEW && (
              <PackageReviewCenter 
                requirements={activeData.requirements}
                analyses={activeData.packageAnalyses}
                policies={activeData.policies}
                onUpdate={handleUpdateClientData}
                onAddTasks={handleAddTasks}
              />
            )}
            {currentView === AppView.POAM && <PoamRegistry 
              requirements={activeData.requirements} 
              poamItems={activeData.poamItems || []}
              onUpdate={handleUpdateClientData}
            />}
            {currentView === AppView.SECURE_VAULT && <SecureVault />}
            {currentView === AppView.VENDORS && <VendorManager activeClientId={activeClientId} />}
          </div>
        </main>
        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
    );
  } catch (e: any) {
    console.error("App Render Crash:", e);
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-950 p-8 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Application Crash</h2>
        <p className="text-slate-400 max-w-md mb-8">{e.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-white text-slate-950 px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-coral-50 transition-all"
        >
          <RefreshCcw size={16} /> Reload Application
        </button>
      </div>
    );
  }
};

export default App;
