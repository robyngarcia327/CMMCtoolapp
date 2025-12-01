import React, { useState, useEffect } from 'react';
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
  ChevronsUpDown
} from 'lucide-react';

import { INITIAL_CLIENTS, FRAMEWORKS, createInitialClientData, INITIAL_USERS, REQUIREMENTS_DATA } from './data/standards';
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
import { Dashboard } from './components/Dashboard'; // Fix: Ensure this import exists
import { storageService } from './services/storage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.MSP_DASHBOARD);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [clients, setClients] = useState<Client[]>(() => storageService.loadClients());
  const [activeClientId, setActiveClientId] = useState<string>(clients[0]?.id || INITIAL_CLIENTS[0].id);
  const [activeFramework, setActiveFramework] = useState<Framework>(FRAMEWORKS[0]);
  
  const [clientDataStore, setClientDataStore] = useState<Record<string, ClientData>>(() => storageService.loadDataStore());

  // Selection States
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);

  useEffect(() => {
    // Auto-save data on changes
    storageService.save(clients, clientDataStore);
  }, [clients, clientDataStore]);

  // Fallback if data store is somehow missing the active client
  if (!clientDataStore[activeClientId]) {
      setClientDataStore(prev => ({
          ...prev,
          [activeClientId]: createInitialClientData(true)
      }));
  }
  
  const activeData = clientDataStore[activeClientId] || createInitialClientData(true);
  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];

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

  // Adapters
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
                      comments: existing.comments
                  };
              }
              return freshReq;
          });
          return { requirements: mergedReqs };
      });
      alert('Standards synced successfully!');
  };

  // Auth Handling
  if (!currentUser) {
      return <Login onLogin={setCurrentUser} />;
  }

  const selectedRequirement = requirements.find(r => r.id === selectedRequirementId);
  const isMSPUser = currentUser.role === 'MSP_ADMIN' || currentUser.role === 'MSP_TECH';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-all duration-300">
        
        {/* Branding / MSP Logo */}
        <div className="p-4 border-b border-slate-800">
            {mspBranding?.logoUrl ? (
                <img src={mspBranding.logoUrl} alt="MSP Logo" className="h-8 object-contain mb-2" />
            ) : (
                <div className="flex items-center gap-2 text-white font-bold text-lg mb-1">
                    <Shield className="text-blue-500" /> Cyber ComplAI
                </div>
            )}
            <div className="text-xs text-slate-500 font-medium tracking-wider">MSP PLATFORM</div>
        </div>

        {/* Client Switcher (Only visible to MSPs) */}
        {isMSPUser && (
            <ClientSwitcher 
                clients={clients} 
                activeClient={activeClient} 
                onSelectClient={setActiveClientId} 
                onAddClient={(c) => setClients([...clients, c])}
            />
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
                {isMSPUser && (
                    <div className="mb-4">
                        <button onClick={() => setCurrentView(AppView.MSP_DASHBOARD)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.MSP_DASHBOARD ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                            <TrendingUp size={18} /> <span className="font-medium text-sm">MSP Dashboard</span>
                        </button>
                        <button onClick={() => setCurrentView(AppView.ORGANIZATION_MANAGER)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.ORGANIZATION_MANAGER ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                            <Building2 size={18} /> <span className="font-medium text-sm">Organizations</span>
                        </button>
                    </div>
                )}

                <div className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Compliance</div>
                <button onClick={() => setCurrentView(AppView.DASHBOARD)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.DASHBOARD ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <LayoutDashboard size={18} /> <span className="font-medium text-sm">Dashboard</span>
                </button>
                <button onClick={() => setCurrentView(AppView.REQUIREMENTS)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.REQUIREMENTS ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <ListChecks size={18} /> <span className="font-medium text-sm">Requirements</span>
                </button>
                <button onClick={() => setCurrentView(AppView.REPORTS)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.REPORTS ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <BarChart3 size={18} /> <span className="font-medium text-sm">Reports</span>
                </button>
                <button onClick={() => setCurrentView(AppView.SPRS_SCORECARD)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.SPRS_SCORECARD ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <TrendingUp size={18} /> <span className="font-medium text-sm">SPRS Scorecard</span>
                </button>

                <div className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Tools</div>
                <button onClick={() => setCurrentView(AppView.WIZARD)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.WIZARD ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'hover:bg-slate-800'}`}>
                    <Wand2 size={18} /> <span className="font-medium text-sm">Onboarding Wizard</span>
                </button>
                <button onClick={() => setCurrentView(AppView.RISK_REGISTER)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.RISK_REGISTER ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <AlertTriangle size={18} /> <span className="font-medium text-sm">Risk Register</span>
                </button>
                <button onClick={() => setCurrentView(AppView.PROJECTS)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.PROJECTS ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <KanbanSquare size={18} /> <span className="font-medium text-sm">Projects / POAM</span>
                </button>
                <button onClick={() => setCurrentView(AppView.DOC_GENERATOR)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.DOC_GENERATOR ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <FileText size={18} /> <span className="font-medium text-sm">Doc Generator</span>
                </button>
                
                <div className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Assets</div>
                <button onClick={() => setCurrentView(AppView.INVENTORY)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.INVENTORY ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <Package size={18} /> <span className="font-medium text-sm">Asset Inventory</span>
                </button>
                <button onClick={() => setCurrentView(AppView.NETWORK_ANALYSIS)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.NETWORK_ANALYSIS ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <Network size={18} /> <span className="font-medium text-sm">Network Map</span>
                </button>
                <button onClick={() => setCurrentView(AppView.VENDORS)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.VENDORS ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <Building2 size={18} /> <span className="font-medium text-sm">Vendor Risk</span>
                </button>

                <div className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Admin</div>
                <button onClick={() => setCurrentView(AppView.BUDGET)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.BUDGET ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <Calculator size={18} /> <span className="font-medium text-sm">Budget & ROI</span>
                </button>
                <button onClick={() => setCurrentView(AppView.TRAINING)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.TRAINING ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <GraduationCap size={18} /> <span className="font-medium text-sm">Training Center</span>
                </button>
                <button onClick={() => setCurrentView(AppView.SETTINGS)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === AppView.SETTINGS ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
                    <SettingsIcon size={18} /> <span className="font-medium text-sm">Configuration</span>
                </button>
            </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs">
                    {currentUser.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{currentUser.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{currentUser.role.replace('_', ' ')}</span>
                </div>
            </div>
            <button 
                onClick={() => setCurrentUser(null)} 
                className="text-slate-500 hover:text-white transition-colors" 
                title="Sign Out"
            >
                <LogOut size={16} />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-700 font-medium">
                    {activeClient.isParent ? <Shield size={14} className="text-purple-600"/> : <Building2 size={14} className="text-blue-600"/>}
                    {activeClient.name}
                </div>
                
                {/* Framework Selector */}
                {currentView !== AppView.WIZARD && (
                    <div className="relative group">
                        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                            Framework: <span className="text-slate-900 font-bold">{activeFramework.id}</span>
                            <ChevronsUpDown size={14} className="text-slate-400" />
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 hidden group-hover:block z-50">
                            <div className="text-xs font-bold text-slate-400 px-2 py-1 uppercase">Switch Standard</div>
                            {FRAMEWORKS.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFramework(f)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${activeFramework.id === f.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                                >
                                    <div>{f.name}</div>
                                    <div className="text-xs text-slate-400 font-normal truncate">{f.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                    isChatOpen ? 'bg-indigo-600 text-white' : 'bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50'
                }`}
            >
                <MessageSquare size={18} />
                {isChatOpen ? 'Close Assistant' : 'Ask AI Assistant'}
            </button>
        </header>

        {/* Views Switch */}
        <main className="flex-1 flex overflow-hidden">
            {currentView === AppView.MSP_DASHBOARD && (
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

            {currentView === AppView.ORGANIZATION_MANAGER && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <OrganizationManager 
                        clients={clients}
                        clientDataStore={clientDataStore}
                        onAddClient={(c) => setClients([...clients, c])}
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
                            // Wired Up Integrations
                            m365Config={m365Config}
                            awsConfig={awsConfig}
                            siemConfig={siemConfig}
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
                    <Reports requirements={requirements} />
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

            {currentView === AppView.SETTINGS && (
                 <div className="flex-1 overflow-y-auto bg-slate-50">
                    <Settings 
                        config={cwConfig} 
                        jiraConfig={jiraConfig} 
                        confluenceConfig={confluenceConfig}
                        mspBranding={mspBranding}
                        // Wired Up Integrations
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
    </div>
  );
};

export default App;