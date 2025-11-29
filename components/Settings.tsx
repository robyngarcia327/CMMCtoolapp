
import React, { useState } from 'react';
import { Save, CheckCircle, Lock, Globe, Building2, Key, Layers, BookOpen } from 'lucide-react';
import { ConnectWiseConfig, JiraConfig, ConfluenceConfig } from '../types';

interface SettingsProps {
  config: ConnectWiseConfig;
  jiraConfig: JiraConfig;
  confluenceConfig: ConfluenceConfig;
  onSave: (cw: ConnectWiseConfig, jira: JiraConfig, conf: ConfluenceConfig) => void;
}

type SettingsTab = 'ConnectWise' | 'Jira' | 'Confluence';

export const Settings: React.FC<SettingsProps> = ({ config, jiraConfig, confluenceConfig, onSave }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('ConnectWise');
  
  const [cwData, setCwData] = useState<ConnectWiseConfig>(config);
  const [jiraData, setJiraData] = useState<JiraConfig>(jiraConfig);
  const [confData, setConfData] = useState<ConfluenceConfig>(confluenceConfig);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(cwData, jiraData, confData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Integrations & Settings</h2>
        <p className="text-slate-600">Configure external tools to automate your compliance workflow.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
            <button
                onClick={() => setActiveTab('ConnectWise')}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ConnectWise' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
                ConnectWise
            </button>
            <button
                onClick={() => setActiveTab('Jira')}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Jira' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
                Jira Software
            </button>
            <button
                onClick={() => setActiveTab('Confluence')}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Confluence' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
                Confluence
            </button>
        </div>

        {/* Header with Enable Switch */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            {activeTab === 'ConnectWise' && (
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">CW</div>
                    <div><h3 className="font-bold text-slate-900">ConnectWise Manage</h3></div>
                </div>
            )}
            {activeTab === 'Jira' && (
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">JIRA</div>
                    <div><h3 className="font-bold text-slate-900">Atlassian Jira</h3></div>
                </div>
            )}
             {activeTab === 'Confluence' && (
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">CONF</div>
                    <div><h3 className="font-bold text-slate-900">Atlassian Confluence</h3></div>
                </div>
            )}

            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={
                    activeTab === 'ConnectWise' ? cwData.enabled : 
                    activeTab === 'Jira' ? jiraData.enabled : confData.enabled
                }
                onChange={(e) => {
                    const val = e.target.checked;
                    if (activeTab === 'ConnectWise') setCwData({...cwData, enabled: val});
                    if (activeTab === 'Jira') setJiraData({...jiraData, enabled: val});
                    if (activeTab === 'Confluence') setConfData({...confData, enabled: val});
                }}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-slate-700">Enabled</span>
            </label>
        </div>

        {/* Content */}
        <div>
            {activeTab === 'ConnectWise' && renderCwSettings()}
            {activeTab === 'Jira' && renderJiraSettings()}
            {activeTab === 'Confluence' && renderConfluenceSettings()}
        </div>

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
      </div>
    </div>
  );
};
