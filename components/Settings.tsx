

import React, { useState } from 'react';
import { Save, CheckCircle, Lock, Globe, Building2, Key, Layers, BookOpen, Database, RefreshCw, AlertTriangle, Trash2, Network, Palette, Upload } from 'lucide-react';
import { ConnectWiseConfig, JiraConfig, ConfluenceConfig, BrandingConfig } from '../types';

interface SettingsProps {
  config: ConnectWiseConfig;
  jiraConfig: JiraConfig;
  confluenceConfig: ConfluenceConfig;
  mspBranding?: BrandingConfig;
  onSave: (cw: ConnectWiseConfig, jira: JiraConfig, conf: ConfluenceConfig, branding?: BrandingConfig) => void;
  onReloadStandards?: () => void;
}

type SettingsTab = 'ConnectWise' | 'Jira' | 'Confluence' | 'Auvik' | 'Branding' | 'Data';

export const Settings: React.FC<SettingsProps> = ({ config, jiraConfig, confluenceConfig, mspBranding, onSave, onReloadStandards }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('ConnectWise');
  
  const [cwData, setCwData] = useState<ConnectWiseConfig>(config);
  const [jiraData, setJiraData] = useState<JiraConfig>(jiraConfig);
  const [confData, setConfData] = useState<ConfluenceConfig>(confluenceConfig);
  const [brandingData, setBrandingData] = useState<BrandingConfig>(mspBranding || { primaryColor: '#ff7f50' });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(cwData, jiraData, confData, brandingData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              setBrandingData({ ...brandingData, logoUrl: ev.target?.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const renderCwSettings = () => (
    <div className={`p-8 grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${!cwData.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
           <div className="col-span-1 md:col-span-2 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-2">
             <span className="font-bold">Note:</span> For this demo, no real API calls are made. Credentials are stored locally in memory only.
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Globe size={16} /> Site URL
             </label>
             <input
               type="text"
               value={cwData.siteUrl}
               onChange={(e) => setCwData({...cwData, siteUrl: e.target.value})}
               placeholder="https://api-na.myconnectwise.net"
               className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Building2 size={16} /> Company ID
             </label>
             <input
               type="text"
               value={cwData.companyId}
               onChange={(e) => setCwData({...cwData, companyId: e.target.value})}
               placeholder="your_company_id"
               className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Key size={16} /> Public Key
             </label>
             <input
               type="text"
               value={cwData.publicKey}
               onChange={(e) => setCwData({...cwData, publicKey: e.target.value})}
               className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>

            <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock size={16} /> Private Key
             </label>
             <input
               type="password"
               value={cwData.privateKey}
               onChange={(e) => setCwData({...cwData, privateKey: e.target.value})}
               className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>

           <div className="space-y-2 col-span-1 md:col-span-2">
             <label className="block text-sm font-medium text-slate-700">Default Service Board</label>
             <select
               value={cwData.serviceBoard}
               onChange={(e) => setCwData({...cwData, serviceBoard: e.target.value})}
               className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
             >
                <option>Compliance Remediation</option>
                <option>Help Desk</option>
                <option>Professional Services</option>
             </select>
           </div>
    </div>
  );

  const renderJiraSettings = () => (
     <div className={`p-8 grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${!jiraData.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
           <div className="col-span-1 md:col-span-2 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-2">
             Supports Jira Cloud. Use an API Token generated from your Atlassian account settings.
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Globe size={16} /> Jira Base URL
             </label>
             <input
               type="text"
               value={jiraData.baseUrl}
               onChange={(e) => setJiraData({...jiraData, baseUrl: e.target.value})}
               placeholder="https://yourdomain.atlassian.net"
               className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Building2 size={16} /> Email Address
             </label>
             <input
               type="text"
               value={jiraData.email}
               onChange={(e) => setJiraData({...jiraData, email: e.target.value})}
               placeholder="user@example.com"
               className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>

            <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock size={16} /> API Token
             </label>
             <input
               type="password"
               value={jiraData.apiToken}
               onChange={(e) => setJiraData({...jiraData, apiToken: e.target.value})}
               className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Layers size={16} /> Default Project Key
             </label>
             <input
               type="text"
               value={jiraData.projectKey}
               onChange={(e) => setJiraData({...jiraData, projectKey: e.target.value})}
               placeholder="e.g. SEC or COMP"
               className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>
    </div>
  );

  const renderConfluenceSettings = () => (
     <div className={`p-8 grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${!confData.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
           <div className="col-span-1 md:col-span-2 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-2">
             Generated documents (SSP, IRP) can be published directly to a Confluence space.
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Globe size={16} /> Confluence Base URL
             </label>
             <input
               type="text"
               value={confData.baseUrl}
               onChange={(e) => setConfData({...confData, baseUrl: e.target.value})}
               placeholder="https://yourdomain.atlassian.net"
               className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Building2 size={16} /> Email Address
             </label>
             <input
               type="text"
               value={confData.email}
               onChange={(e) => setConfData({...confData, email: e.target.value})}
               placeholder="user@example.com"
               className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>

            <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock size={16} /> API Token
             </label>
             <input
               type="password"
               value={confData.apiToken}
               onChange={(e) => setConfData({...confData, apiToken: e.target.value})}
               className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <BookOpen size={16} /> Target Space Key
             </label>
             <input
               type="text"
               value={confData.spaceKey}
               onChange={(e) => setConfData({...confData, spaceKey: e.target.value})}
               placeholder="e.g. ISMS"
               className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>
    </div>
  );

  const renderAuvikSettings = () => (
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="col-span-1 md:col-span-2 bg-purple-50 text-purple-800 p-4 rounded-lg text-sm mb-2 flex items-start gap-2">
             <Network size={20} className="shrink-0 mt-0.5" />
             <div>
                 <span className="font-bold">Auvik Integration:</span> Configure this to enable real-time network topology analysis for the "Network Analyzer" tool. 
             </div>
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700">Auvik Region</label>
             <select className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                 <option value="US">US (United States)</option>
                 <option value="EU">EU (Europe)</option>
             </select>
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-700">Tenant ID</label>
             <input 
                 className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 placeholder="e.g. 12345678-..."
             />
           </div>
           
            <div className="space-y-2 col-span-1 md:col-span-2">
             <label className="block text-sm font-medium text-slate-700">API Key</label>
             <input 
                 type="password"
                 className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 placeholder="••••••••••••••••••••••••"
             />
           </div>
      </div>
  );

  const renderBrandingSettings = () => (
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
              <h3 className="font-bold text-slate-800 text-lg mb-2">MSP Branding</h3>
              <p className="text-slate-600 text-sm">Upload your company logo. This will appear on the cover page of all reports generated for your clients.</p>
          </div>

          <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Organization Logo</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  {brandingData.logoUrl ? (
                      <div className="relative group">
                          <img src={brandingData.logoUrl} alt="MSP Logo" className="h-16 object-contain" />
                          <button 
                            onClick={() => setBrandingData({...brandingData, logoUrl: undefined})}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                              <Trash2 size={12} />
                          </button>
                      </div>
                  ) : (
                      <div className="text-center text-slate-400">
                          <Upload size={32} className="mx-auto mb-2 opacity-50" />
                          <span className="text-xs">Upload PNG/JPG</span>
                      </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
              </div>
          </div>

          <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Brand Color</label>
              <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData({...brandingData, primaryColor: e.target.value})}
                    className="w-16 h-16 rounded border-0 cursor-pointer"
                  />
                  <div className="text-sm text-slate-500">
                      <p>Selected: <span className="font-mono font-bold text-slate-800">{brandingData.primaryColor}</span></p>
                      <p>Used for headers, buttons, and charts.</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderDataSettings = () => (
      <div className="p-8 space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <RefreshCw size={24} />
              </div>
              <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">Sync with Latest Standards</h3>
                  <p className="text-slate-600 mb-4">
                      Update your assessment with the latest CMMC / NIST definitions from the application code. 
                      This adds new controls and updates descriptions <span className="font-bold text-slate-800">without deleting your answers</span> or "Met/Not Met" status.
                  </p>
                  <button 
                    onClick={onReloadStandards}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                      <RefreshCw size={18} /> Sync Standard Definitions
                  </button>
              </div>
          </div>

          <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                  <h3 className="font-bold text-red-900 text-lg">Factory Reset</h3>
                  <p className="text-red-700 mb-4">
                      Wipe all local data, clients, and assessments. This cannot be undone. 
                      Use this if the application state is corrupted or you want to restart with fresh demo data.
                  </p>
                  <button 
                     onClick={() => {
                         if (confirm("Are you sure? This will delete all clients and risks.")) {
                             localStorage.clear();
                             window.location.reload();
                         }
                     }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                      <Trash2 size={18} /> Clear Data & Restart
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">System Configuration</h2>
        <p className="text-slate-600">Configure external integrations and manage application data.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
            <button
                onClick={() => setActiveTab('ConnectWise')}
                className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ConnectWise' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
                ConnectWise
            </button>
            <button
                onClick={() => setActiveTab('Jira')}
                className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Jira' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
                Jira Software
            </button>
            <button
                onClick={() => setActiveTab('Confluence')}
                className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Confluence' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
                Confluence
            </button>
            <button
                onClick={() => setActiveTab('Auvik')}
                className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Auvik' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
                Auvik
            </button>
            <button
                onClick={() => setActiveTab('Branding')}
                className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'Branding' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
                <Palette size={14} /> Branding
            </button>
             <button
                onClick={() => setActiveTab('Data')}
                className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'Data' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
                <Database size={14} /> Data & Backup
            </button>
        </div>

        {/* Content */}
        <div>
            {activeTab === 'ConnectWise' && (
                <>
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">CW</div>
                            <div><h3 className="font-bold text-slate-900">ConnectWise Manage</h3></div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={cwData.enabled} onChange={(e) => setCwData({...cwData, enabled: e.target.checked})} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-slate-700">Enabled</span>
                        </label>
                    </div>
                    {renderCwSettings()}
                </>
            )}
            {activeTab === 'Jira' && (
                 <>
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">JIRA</div>
                            <div><h3 className="font-bold text-slate-900">Atlassian Jira</h3></div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={jiraData.enabled} onChange={(e) => setJiraData({...jiraData, enabled: e.target.checked})} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-slate-700">Enabled</span>
                        </label>
                    </div>
                    {renderJiraSettings()}
                </>
            )}
            {activeTab === 'Confluence' && (
                 <>
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">CONF</div>
                            <div><h3 className="font-bold text-slate-900">Atlassian Confluence</h3></div>
                        </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={confData.enabled} onChange={(e) => setConfData({...confData, enabled: e.target.checked})} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-slate-700">Enabled</span>
                        </label>
                    </div>
                    {renderConfluenceSettings()}
                </>
            )}
            {activeTab === 'Auvik' && (
                <>
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">AUV</div>
                            <div><h3 className="font-bold text-slate-900">Auvik Network Management</h3></div>
                        </div>
                    </div>
                    {renderAuvikSettings()}
                </>
            )}
            {activeTab === 'Branding' && renderBrandingSettings()}
            {activeTab === 'Data' && renderDataSettings()}
        </div>

        {activeTab !== 'Data' && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${
                    isSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                >
                {isSaved ? <><CheckCircle size={20} /> Saved!</> : <><Save size={20} /> Save Configuration</>}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};