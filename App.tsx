
import React, { useState, useEffect } from 'react';
import { INITIAL_CLIENTS, FRAMEWORKS, createInitialClientData, INITIAL_USERS, REQUIREMENTS_DATA } from './data/standards';
import { Requirement, Artifact, AppView, Ticket, ConnectWiseConfig, JiraConfig, ConfluenceConfig, Risk, Asset, User, Framework, Client, ClientData, ProjectTask, WizardProgress, UserRole } from './types';
import { RequirementsList } from './components/RequirementsList';
import { RequirementDetail } from './components/RequirementDetail';
import { DocGenerator } from './components/DocGenerator';
import { NetworkAnalyzer } from './components/NetworkAnalyzer';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Reports } from './components/Reports';
import { AIChat } from './components/AIChat';
import { RiskRegister } from './components/RiskRegister';
import { Inventory } from './components/Inventory';
import { UserManagement } from './components/UserManagement';
import { ClientSwitcher } from './components/ClientSwitcher';
import { ProjectBoard } from './components/ProjectBoard';
import { SPRSScorecard } from './components/SPRSScorecard';
import { ComplianceWizard } from './components/ComplianceWizard';
import { MSPDashboard } from './components/MSPDashboard';
import { OrganizationManager } from './components/OrganizationManager';
import { Login } from './components/Login';
import { storageService } from './services/storage';
import { LayoutDashboard, ListChecks, FileEdit, MessageSquare, Menu, Network, Settings as SettingsIcon, PieChart, ShieldAlert, Monitor, Users, ChevronDown, KanbanSquare, TrendingUp, Sparkles, Building2, UserCircle, LogOut, Database } from 'lucide-react';

const App: React.FC = () => {
  // --- Auth & Role State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [currentView, setCurrentView] = useState<AppView>(AppView.MSP_DASHBOARD);
  
  // --- MSP Client State (Loaded from Storage) ---
  const [clients, setClients] = useState<Client[]>(() => storageService.loadClients());
  const [activeClientId, setActiveClientId] = useState<string>(clients[0]?.id || INITIAL_CLIENTS[0].id);
  
  // Master Store: Map ClientID -> ClientData (Loaded from Storage)
  const [clientDataStore, setClientDataStore] = useState<Record<string, ClientData>>(() => storageService.loadDataStore());

  // --- Auto-Save Effect ---
  useEffect(() => {
    storageService.save(clients, clientDataStore);
  }, [clients, clientDataStore]);

  // Ensure activeClient reflects permissions
  useEffect(() => {
      if (!currentUser) return;

      // If user is restricted (Client User/Admin), force them to their org
      if (currentUser.role === 'CLIENT_USER' || currentUser.role === 'CLIENT_ADMIN') {
          if (activeClientId !== currentUser.organizationId) {
              setActiveClientId(currentUser.organizationId);
          }
      }
      // If they are on a restricted view, redirect them
      if ((currentUser.role === 'CLIENT_USER' || currentUser.role === 'CLIENT_ADMIN') && 
          (currentView === AppView.MSP_DASHBOARD || currentView === AppView.ORGANIZATION_MANAGER)) {
          setCurrentView(AppView.DASHBOARD);
      }
  }, [currentUser, activeClientId, currentView]);

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];
  
  // Fallback if data store is somehow missing the active client
  if (!clientDataStore[activeClientId]) {
      setClientDataStore(prev => ({
          ...prev,
          [activeClientId]: createInitialClientData(true)
      }));
  }
  
  const activeData = clientDataStore[activeClientId] || createInitialClientData(true);

  // Helper to update specific data for the ACTIVE client
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

  // Helper for Org Manager to update ANY client
  const updateSpecificClientData = (clientId: string, changes: Partial<ClientData>) => {
      setClientDataStore(prev => ({
          ...prev,
          [clientId]: { ...prev[clientId], ...changes }
      }));
  };

  // State Management Wrappers (Adapters for existing components)
  const requirements = activeData.requirements;
  const risks = activeData.risks;
  const assets = activeData.assets;
  const users = activeData.users;
  const artifacts = activeData.artifacts;
  const tickets = activeData.tickets;
  const tasks = activeData.tasks;
  const cwConfig = activeData.cwConfig;
  const jiraConfig = activeData.jiraConfig;
  const confluenceConfig = activeData.confluenceConfig;
  const wizardProgress = activeData.wizardProgress || { currentStep: 'INTRO', currentQuestionIndex: 0 };

  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);
  const [activeFramework, setActiveFramework] = useState<Framework>(FRAMEWORKS[0]);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const selectedRequirement = requirements.find(r => r.id === selectedRequirementId) || null;

  // Handlers
  const handleUpdateRequirement = (updatedReq: Requirement) => {
    updateActiveClientData(prev => ({
        requirements: prev.requirements.map(r => r.id === updatedReq.id ? updatedReq : r)
    }));
  };

  const handleAddArtifact = (artifact: Artifact) => {
      updateActiveClientData(prev => ({ artifacts: [...prev.artifacts, artifact] }));
  };

  const handleRemoveArtifact = (id: string) => {
      updateActiveClientData(prev => ({ artifacts: prev.artifacts.filter(a => a.id !== id) }));
  };

  const handleAddTicket = (ticket: Ticket) => {
      updateActiveClientData(prev => ({ tickets: [...prev.tickets, ticket] }));
  };

  const handleSaveSettings = (cw: ConnectWiseConfig, jira: JiraConfig, conf: ConfluenceConfig) => {
      updateActiveClientData(() => ({ cwConfig: cw, jiraConfig: jira, confluenceConfig: conf }));
  };

  // --- SMART SYNC Logic ---
  const handleReloadStandards = () => {
      const currentReqs = activeData.requirements;
      const latestReqs = REQUIREMENTS_DATA; // Imported from code (the new big list)

      // Merge Logic:
      // 1. If a requirement ID exists in latest but not current, add it.
      // 2. If a requirement ID exists in both, update text fields but KEEP status/response.
      
      const mergedRequirements = latestReqs.map(latest => {
          const existing = currentReqs.find(r => r.id === latest.id);
          if (existing) {
              return {
                  ...latest,
                  objectives: existing.objectives.length > 0 ? existing.objectives : latest.objectives, // Keep status
                  response: existing.response // Keep user answer
              };
          }
          return latest; // New requirement
      });

      // Also preserve any custom requirements the user might have added (if we supported that)
      // For now, we just replace with the merged set
      updateActiveClientData(() => ({ requirements: mergedRequirements }));
      alert(`Sync Complete! ${mergedRequirements.length} controls loaded.`);
  };
  
  const handleAddRisk = (risk: Risk) => {
      updateActiveClientData(prev => ({ risks: [risk, ...prev.risks] }));
  };
  const handleUpdateRisk = (risk: Risk) => {
      updateActiveClientData(prev => ({ risks: prev.risks.map(r => r.id === risk.id ? risk : r) }));
  };
  const handleDeleteRisk = (id: string) => {
      updateActiveClientData(prev => ({ risks: prev.risks.filter(r => r.id !== id) }));
  };

  const handleAddAsset = (asset: Asset) => {
      updateActiveClientData(prev => ({ assets: [asset, ...prev.assets] }));
  };
  const handleDeleteAsset = (id: string) => {
      updateActiveClientData(prev => ({ assets: prev.assets.filter(a => a.id !== id) }));
  };
  
  const handleAddTask = (task: ProjectTask) => {
      updateActiveClientData(prev => ({ tasks: [task, ...prev.tasks] }));
  };
  const handleUpdateTask = (task: ProjectTask) => {
      updateActiveClientData(prev => ({ tasks: prev.tasks.map(t => t.id === task.id ? task : t) }));
  };
  const handleDeleteTask = (id: string) => {
      updateActiveClientData(prev => ({ tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const handleUpdateWizardProgress = (progress: WizardProgress) => {
      updateActiveClientData(() => ({ wizardProgress: progress }));
  };

  const handleAddClient = (newClient: Client) => {
      setClients(prev => [...prev, newClient]);
      setClientDataStore(prev => ({
          ...prev,
          [newClient.id]: createInitialClientData(false)
      }));
  };

  const handleUpdateClient = (updatedClient: Client) => {
      setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };
  
  const handleDeleteClient = (clientId: string) => {
      setClients(prev => prev.filter(c => c.id !== clientId));
      // Optionally cleanup store in real app, but keep simple for now
  };

  const handleSelectReq = (req: Requirement) => {
    setSelectedRequirementId(req.id);
    setCurrentView(AppView.REQUIREMENTS);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleLogin = (user: User) => {
      setCurrentUser(user);
  };

  // --- Auth Simulation Handlers ---
  const handleSimulateUser = (role: UserRole) => {
      let mockUser: User | undefined;
      
      if (role === 'MSP_ADMIN') {
          mockUser = INITIAL_USERS.find(u => u.role === 'MSP_ADMIN');
      } else if (role === 'CLIENT_USER') {
          mockUser = INITIAL_USERS.find(u => u.role === 'CLIENT_USER');
      }

      if (mockUser) {
          setCurrentUser(mockUser);
          setIsUserMenuOpen(false);
      }
  };

  // --- LOGIN GATE ---
  if (!currentUser) {
      return <Login onLogin={handleLogin} />;
  }

  // --- Visibility Logic ---
  const isMSP = currentUser.role === 'MSP_ADMIN' || currentUser.role === 'MSP_TECH';
  const isClientAdmin = currentUser.role === 'CLIENT_ADMIN';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-0'} md:w-64 bg-slate-900 text-white transition-all duration-300 flex flex-col shrink-0 overflow-hidden absolute md:relative z-20 h-full print:hidden`}
      >
        {isMSP ? (
            <ClientSwitcher 
                clients={clients} 
                activeClient={activeClient} 
                onSelectClient={setActiveClientId} 
                onAddClient={handleAddClient} 
            />
        ) : (
            // Client Portal Header (Locked to single client)
            <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {activeClient.logoInitial}
                 </div>
                 <div className="text-left">
                     <div className="text-xs text-slate-400 font-bold uppercase">Client Portal</div>
                     <div className="text-sm font-bold text-white truncate max-w-[140px]">{activeClient.name}</div>
                 </div>
            </div>
        )}

        {/* Framework Switcher */}
        <div className="p-4 border-b border-slate-800">
            <div className="text-xs text-slate-400 uppercase font-bold mb-2 tracking-wider">Active Standard</div>
            <div className="relative group">
                <button className="w-full bg-slate-800 border border-slate-700 text-left px-3 py-2 rounded text-sm font-medium flex justify-between items-center text-slate-200 hover:bg-slate-700">
                    <span className="truncate">{activeFramework.name}</span>
                    <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 w-full bg-slate-800 border border-slate-700 rounded-lg mt-1 shadow-xl z-50 hidden group-hover:block">
                    {FRAMEWORKS.map(fw => (
                        <button
                            key={fw.id}
                            onClick={() => setActiveFramework(fw)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-700 ${activeFramework.id === fw.id ? 'text-blue-400 font-bold' : 'text-slate-300'}`}
                        >
                            {fw.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* MSP Only Views */}
          {isMSP && (
              <>
                <button
                    onClick={() => setCurrentView(AppView.MSP_DASHBOARD)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium mb-1 ${currentView === AppView.MSP_DASHBOARD ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                >
                    <Building2 size={18} />
                    MSP Command Center
                </button>
                <button
                    onClick={() => setCurrentView(AppView.ORGANIZATION_MANAGER)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium mb-4 ${currentView === AppView.ORGANIZATION_MANAGER ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                >
                    <Users size={18} />
                    Client Management
                </button>
                <div className="pt-2 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-4">Client Compliance</div>
              </>
          )}

          {/* Common Views (Visible to Clients) */}
          <button
            onClick={() => setCurrentView(AppView.WIZARD)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.WIZARD ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Sparkles size={18} />
            Assessment Wizard
          </button>

          <button
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.DASHBOARD ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
           <button
            onClick={() => {
                setCurrentView(AppView.REQUIREMENTS);
                const firstReq = requirements.find(r => r.framework === activeFramework.id);
                if (!selectedRequirementId && firstReq) setSelectedRequirementId(firstReq.id);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.REQUIREMENTS ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ListChecks size={18} />
            Requirements
          </button>
          
           <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-4">GRC Modules</div>
           
           <button
            onClick={() => setCurrentView(AppView.PROJECTS)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.PROJECTS ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <KanbanSquare size={18} />
            Project Management
          </button>

           <button
            onClick={() => setCurrentView(AppView.RISK_REGISTER)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.RISK_REGISTER ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ShieldAlert size={18} />
            Risk Register
          </button>
           <button
            onClick={() => setCurrentView(AppView.INVENTORY)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.INVENTORY ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Monitor size={18} />
            Asset Inventory
          </button>
          
          {/* Only Show User Directory if Admin or MSP */}
          {(isMSP || isClientAdmin) && (
              <button
                onClick={() => setCurrentView(AppView.USERS)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.USERS ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Users size={18} />
                User Directory
              </button>
          )}

          <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-4">Tools</div>

          <button
            onClick={() => setCurrentView(AppView.REPORTS)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.REPORTS ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <PieChart size={18} />
            Reports
          </button>
           <button
            onClick={() => setCurrentView(AppView.SPRS_SCORECARD)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.SPRS_SCORECARD ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <TrendingUp size={18} />
            SPRS Scorecard
          </button>
           <button
            onClick={() => setCurrentView(AppView.DOC_GENERATOR)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.DOC_GENERATOR ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileEdit size={18} />
            Doc Generator
          </button>
          <button
            onClick={() => setCurrentView(AppView.NETWORK_ANALYSIS)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.NETWORK_ANALYSIS ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Network size={18} />
            Network Analysis
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
            <button
                onClick={() => setCurrentView(AppView.SETTINGS)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${currentView === AppView.SETTINGS ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                <SettingsIcon size={18} />
                Settings
            </button>
             <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity text-sm font-medium"
            >
                <MessageSquare size={18} />
                AI Assistant
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Top Header / Mobile Header */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600 md:hidden">
                    <Menu size={24} />
                </button>
                <div className="hidden md:block">
                     <div className="text-lg font-bold text-slate-800">{activeClient.name}</div>
                     <div className="text-xs text-slate-500">{activeClient.industry} • {activeClient.primaryFramework}</div>
                </div>
            </div>

            {/* User Profile / Simulator */}
            <div className="relative">
                <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${currentUser.role.includes('MSP') ? 'bg-purple-600' : 'bg-blue-600'}`}>
                        {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                        <div className="text-[10px] text-slate-500">{currentUser.role.replace('_', ' ')}</div>
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                </button>
                
                {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-3 border-b border-slate-100 bg-slate-50">
                            <h4 className="text-xs font-bold text-slate-500 uppercase">Simulate Role</h4>
                        </div>
                        <button 
                            onClick={() => handleSimulateUser('MSP_ADMIN')}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 ${currentUser.role === 'MSP_ADMIN' ? 'bg-purple-50 text-purple-700' : 'text-slate-600'}`}
                        >
                            <Building2 size={16} />
                            <div>
                                <div className="font-bold text-sm">MSP Admin</div>
                                <div className="text-xs opacity-75">Full System Access</div>
                            </div>
                        </button>
                        <button 
                             onClick={() => handleSimulateUser('CLIENT_USER')}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 ${currentUser.role === 'CLIENT_USER' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                        >
                            <UserCircle size={16} />
                            <div>
                                <div className="font-bold text-sm">Client User</div>
                                <div className="text-xs opacity-75">Restricted Portal Access</div>
                            </div>
                        </button>
                        <div className="border-t border-slate-100 p-2">
                             <button onClick={() => storageService.reset()} className="w-full flex items-center justify-center gap-2 text-xs text-red-500 p-2 hover:bg-red-50 rounded">
                                 <Database size={14} /> Factory Reset (Clear Data)
                             </button>
                             <button onClick={() => setCurrentUser(null)} className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 p-2 hover:bg-slate-100 rounded">
                                 <LogOut size={14} /> Sign Out
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <main className="flex-1 overflow-hidden flex">
            {currentView === AppView.MSP_DASHBOARD && isMSP && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <MSPDashboard 
                        clients={clients} 
                        clientDataStore={clientDataStore}
                        onSelectClient={(id) => {
                            setActiveClientId(id);
                            setCurrentView(AppView.DASHBOARD);
                        }}
                    />
                </div>
            )}
            
            {currentView === AppView.ORGANIZATION_MANAGER && isMSP && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <OrganizationManager 
                        clients={clients}
                        clientDataStore={clientDataStore}
                        onAddClient={handleAddClient}
                        onUpdateClient={handleUpdateClient}
                        onDeleteClient={handleDeleteClient}
                        onUpdateClientData={updateSpecificClientData}
                    />
                </div>
            )}

            {currentView === AppView.DASHBOARD && (
                <div className="flex-1 overflow-y-auto">
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
                        onUpdateProgress={handleUpdateWizardProgress}
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
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <ListChecks size={48} className="mb-4 opacity-20" />
                            <p>Select a requirement from the list to view details.</p>
                        </div>
                    )}
                </>
            )}

            {currentView === AppView.PROJECTS && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <ProjectBoard 
                        tasks={tasks}
                        onAddTask={handleAddTask}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        requirements={requirements.filter(r => r.framework === activeFramework.id)}
                        risks={risks}
                        users={users}
                    />
                </div>
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

            {currentView === AppView.USERS && (
                 <div className="flex-1 overflow-y-auto bg-slate-50">
                    <UserManagement users={users} />
                 </div>
            )}

            {currentView === AppView.REPORTS && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <Reports requirements={requirements.filter(r => r.framework === activeFramework.id)} />
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

             {currentView === AppView.DOC_GENERATOR && (
                 <div className="flex-1 overflow-y-auto bg-slate-50">
                    <DocGenerator clientName={activeClient.name} confluenceConfig={confluenceConfig} />
                 </div>
            )}

            {currentView === AppView.NETWORK_ANALYSIS && (
                 <div className="flex-1 overflow-y-auto bg-slate-50">
                    <NetworkAnalyzer />
                 </div>
            )}

            {currentView === AppView.SETTINGS && (
                 <div className="flex-1 overflow-y-auto bg-slate-50">
                    <Settings 
                        config={cwConfig} 
                        jiraConfig={jiraConfig} 
                        confluenceConfig={confluenceConfig}
                        onSave={handleSaveSettings} 
                        onReloadStandards={handleReloadStandards}
                    />
                 </div>
            )}
        </main>

        {/* Chat Overlay */}
        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
};

export default App;
