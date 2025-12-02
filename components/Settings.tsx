import React, { useState } from 'react';
import { Save, CheckCircle, Lock, Globe, Building2, Key, Layers, BookOpen, Database, RefreshCw, AlertTriangle, Trash2, Network, Palette, Upload, Cloud, Server, Shield, Plug, Library, HardDrive } from 'lucide-react';
import { ConnectWiseConfig, JiraConfig, ConfluenceConfig, BrandingConfig, IntegrationConfig } from '../types';

interface SettingsProps {
  config: ConnectWiseConfig;
  jiraConfig: JiraConfig;
  confluenceConfig: ConfluenceConfig;
  mspBranding?: BrandingConfig;
  m365Config?: IntegrationConfig;
  awsConfig?: IntegrationConfig;
  googleConfig?: IntegrationConfig;
  siemConfig?: IntegrationConfig;
  
  onSave: (cw: ConnectWiseConfig, jira: JiraConfig, conf: ConfluenceConfig, branding?: BrandingConfig, m365?: IntegrationConfig, aws?: IntegrationConfig, google?: IntegrationConfig, siem?: IntegrationConfig) => void;
  onReloadStandards?: () => void;
  onImportData?: (jsonData: string) => void;
  onExportData?: () => void;
}

type SettingsTab = 'ConnectWise' | 'Jira' | 'Confluence' | 'Auvik' | 'Integrations' | 'Branding' | 'Data' | 'Library';

export const Settings: React.FC<SettingsProps> = ({ 
    config, 
    jiraConfig, 
    confluenceConfig, 
    mspBranding,
    m365Config,
    awsConfig,
    googleConfig,
    siemConfig,
    onSave, 
    onReloadStandards,
    onImportData,
    onExportData
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('ConnectWise');
  
  const [cwData, setCwData] = useState<ConnectWiseConfig>(config);
  const [jiraData, setJiraData] = useState<JiraConfig>(jiraConfig);
  const [confData, setConfData] = useState<ConfluenceConfig>(confluenceConfig);
  const [brandingData, setBrandingData] = useState<BrandingConfig>(mspBranding || { primaryColor: '#ff7f50', logoUrl: '' });

  const [m365Data, setM365Data] = useState<IntegrationConfig>(m365Config || { enabled: false });
  const [awsData, setAwsData] = useState<IntegrationConfig>(awsConfig || { enabled: false });
  const [googleData, setGoogleData] = useState<IntegrationConfig>(googleConfig || { enabled: false });
  const [siemData, setSiemData] = useState<IntegrationConfig>(siemConfig || { enabled: false });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(cwData, jiraData, confData, brandingData, m365Data, awsData, googleData, siemData);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          if (event.target?.result && onImportData) {
              onImportData(event.target.result as string);
          }
      };
      reader.readAsText(file);
  };

  const renderIntegrations = () => (
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* M365 */}
          <div className={`border rounded-xl p-6 flex flex-col gap-4 ${m365Data.enabled ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Cloud size={20}/></div>
                  <div><h3 className="font-bold text-slate-900">Microsoft 365</h3><p className="text-xs text-slate-500">Entra ID, Secure Score</p></div>
              </div>
              <div className="flex-1"></div>
              {m365Data.enabled ? (
                  <div className="text-xs text-green-700 font-medium flex items-center gap-1"><CheckCircle size={12}/> Connected as {m365Data.accountName || 'Admin'}</div>
              ) : (
                  <input className="border rounded p-2 text-xs w-full" placeholder="Tenant ID (Demo)" onChange={e => setM365Data({...m365Data, accountName: e.target.value})} />
              )}
              <button 
                onClick={() => setM365Data({ ...m365Data, enabled: !m365Data.enabled })}
                className={`w-full py-2 rounded-lg font-bold text-sm ${m365Data.enabled ? 'bg-white text-red-600 border border-red-100 hover:bg-red-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                  {m365Data.enabled ? 'Disconnect' : 'Connect'}
              </button>
          </div>

          {/* AWS */}
          <div className={`border rounded-xl p-6 flex flex-col gap-4 ${awsData.enabled ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white"><Server size={20}/></div>
                  <div><h3 className="font-bold text-slate-900">AWS Cloud</h3><p className="text-xs text-slate-500">IAM, S3 Configs</p></div>
              </div>
              <div className="flex-1"></div>
              {awsData.enabled ? (
                  <div className="text-xs text-green-700 font-medium flex items-center gap-1"><CheckCircle size={12}/> Connected</div>
              ) : (
                  <input className="border rounded p-2 text-xs w-full" placeholder="Account ID (Demo)" />
              )}
              <button 
                onClick={() => setAwsData({ ...awsData, enabled: !awsData.enabled })}
                className={`w-full py-2 rounded-lg font-bold text-sm ${awsData.enabled ? 'bg-white text-red-600 border border-red-100' : 'bg-slate-900 text-white'}`}
              >
                  {awsData.enabled ? 'Disconnect' : 'Connect'}
              </button>
          </div>

          {/* Google */}
          <div className={`border rounded-xl p-6 flex flex-col gap-4 ${googleData.enabled ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white"><Globe size={20}/></div>
                  <div><h3 className="font-bold text-slate-900">Google Workspace</h3><p className="text-xs text-slate-500">Users, Drive Policies</p></div>
              </div>
              <div className="flex-1"></div>
              <button 
                onClick={() => setGoogleData({ ...googleData, enabled: !googleData.enabled })}
                className={`w-full py-2 rounded-lg font-bold text-sm ${googleData.enabled ? 'bg-white text-red-600 border border-red-100' : 'bg-slate-900 text-white'}`}
              >
                  {googleData.enabled ? 'Disconnect' : 'Connect'}
              </button>
          </div>

          {/* SIEM */}
          <div className={`border rounded-xl p-6 flex flex-col gap-4 ${siemData.enabled ? 'bg-purple-50 border-purple-200' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white"><Shield size={20}/></div>
                  <div><h3 className="font-bold text-slate-900">SIEM / SOAR</h3><p className="text-xs text-slate-500">Splunk, Sentinel, CrowdStrike</p></div>
              </div>
              <div className="flex-1"></div>
              <button 
                onClick={() => setSiemData({ ...siemData, enabled: !siemData.enabled })}
                className={`w-full py-2 rounded-lg font-bold text-sm ${siemData.enabled ? 'bg-white text-red-600 border border-red-100' : 'bg-slate-900 text-white'}`}
              >
                  {siemData.enabled ? 'Disconnect' : 'Connect'}
              </button>
          </div>
      </div>
  );

  const renderLibrary = () => (
      <div className="p-8 space-y-6">
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-6 flex gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm h-fit text-indigo-600"><Library size={24}/></div>
              <div>
                  <h3 className="font-bold text-indigo-900 text-lg">Framework Library</h3>
                  <p className="text-sm text-indigo-700 mt-1">
                      This section manages the "Master Definitions" for compliance frameworks.
                      Clicking "Seed Database" below will trigger the automated population process, 
                      copying 110+ controls into your active client's database.
                  </p>
              </div>
          </div>

          <div className="grid gap-4">
              <div className="bg-white border p-6 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                      <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Shield size={18} className="text-blue-600"/> NIST SP 800-171 r2</h4>
                      <div className="flex gap-4 mt-1">
                         <p className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Version: 2.0</p>
                         <p className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Controls: 110</p>
                      </div>
                  </div>
                  <button onClick={onReloadStandards} className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-800">
                      Reset / Repair Library
                  </button>
              </div>
              <div className="bg-white border p-6 rounded-xl flex items-center justify-between opacity-70 border-dashed">
                  <div>
                      <h4 className="font-bold text-slate-700 text-lg">ISO 27001:2022</h4>
                      <div className="flex gap-4 mt-1">
                         <p className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Version: 2022</p>
                         <p className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Controls: 93</p>
                      </div>
                  </div>
                  <button className="bg-slate-100 text-slate-400 px-4 py-2 rounded text-sm font-bold cursor-not-allowed">
                      <Lock size={14} className="inline mr-1"/> Locked
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">System Configuration</h2>
            <p className="text-slate-600">Manage integrations and application settings.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-bold text-green-700">
            <HardDrive size={12} /> Local Storage Mode (Secure)
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
            <button onClick={() => setActiveTab('ConnectWise')} className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'ConnectWise' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'}`}>ConnectWise</button>
            <button onClick={() => setActiveTab('Jira')} className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'Jira' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'}`}>Jira</button>
            <button onClick={() => setActiveTab('Confluence')} className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'Confluence' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'}`}>Confluence</button>
            <button onClick={() => setActiveTab('Integrations')} className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'Integrations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600'}`}><Plug size={14}/> Cloud Integrations</button>
            <button onClick={() => setActiveTab('Auvik')} className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'Auvik' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-600'}`}>Auvik</button>
            <button onClick={() => setActiveTab('Library')} className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'Library' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-600'}`}><Library size={14}/> Frameworks</button>
            <button onClick={() => setActiveTab('Branding')} className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'Branding' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600'}`}><Palette size={14}/> Branding</button>
            <button onClick={() => setActiveTab('Data')} className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'Data' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'}`}><Database size={14}/> Data</button>
        </div>

        <div>
            {activeTab === 'ConnectWise' && (
                <div className="p-6">
                    <h3 className="font-bold mb-4">ConnectWise Manage</h3>
                    <div className="space-y-4">
                        <input className="border p-2 w-full rounded" placeholder="Site URL" value={cwData.siteUrl} onChange={e=>setCwData({...cwData, siteUrl: e.target.value})} />
                        <input className="border p-2 w-full rounded" placeholder="Company ID" value={cwData.companyId} onChange={e=>setCwData({...cwData, companyId: e.target.value})} />
                        <div className="flex items-center gap-2"><input type="checkbox" checked={cwData.enabled} onChange={e=>setCwData({...cwData, enabled: e.target.checked})} /> Enabled</div>
                    </div>
                </div>
            )}
            {activeTab === 'Jira' && (
                 <div className="p-6">
                    <h3 className="font-bold mb-4">Jira Software</h3>
                    <div className="space-y-4">
                        <input className="border p-2 w-full rounded" placeholder="Base URL" value={jiraData.baseUrl} onChange={e=>setJiraData({...jiraData, baseUrl: e.target.value})} />
                        <input className="border p-2 w-full rounded" placeholder="Email" value={jiraData.email} onChange={e=>setJiraData({...jiraData, email: e.target.value})} />
                        <div className="flex items-center gap-2"><input type="checkbox" checked={jiraData.enabled} onChange={e=>setJiraData({...jiraData, enabled: e.target.checked})} /> Enabled</div>
                    </div>
                </div>
            )}
            {activeTab === 'Confluence' && (
                 <div className="p-6">
                    <h3 className="font-bold mb-4">Confluence</h3>
                    <div className="space-y-4">
                        <input className="border p-2 w-full rounded" placeholder="Base URL" value={confData.baseUrl} onChange={e=>setConfData({...confData, baseUrl: e.target.value})} />
                        <input className="border p-2 w-full rounded" placeholder="Space Key" value={confData.spaceKey} onChange={e=>setConfData({...confData, spaceKey: e.target.value})} />
                        <div className="flex items-center gap-2"><input type="checkbox" checked={confData.enabled} onChange={e=>setConfData({...confData, enabled: e.target.checked})} /> Enabled</div>
                    </div>
                </div>
            )}
            {activeTab === 'Integrations' && renderIntegrations()}
            {activeTab === 'Auvik' && (
                <div className="p-6">
                    <h3 className="font-bold mb-4">Auvik Network Management</h3>
                    <div className="grid gap-4">
                        <input className="border p-2 rounded" placeholder="Tenant ID" />
                        <input className="border p-2 rounded" type="password" placeholder="API Key" />
                    </div>
                </div>
            )}
            {activeTab === 'Library' && renderLibrary()}
            {activeTab === 'Branding' && (
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">Logo</label>
                        <div className="border-2 border-dashed p-6 rounded flex flex-col items-center">
                            {brandingData.logoUrl ? <img src={brandingData.logoUrl} className="h-16 mb-2 object-contain" /> : <Upload className="mb-2 text-slate-400"/>}
                            <input type="file" onChange={handleLogoUpload} className="text-xs" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">Primary Color</label>
                        <input type="color" value={brandingData.primaryColor} onChange={e => setBrandingData({...brandingData, primaryColor: e.target.value})} className="w-full h-12 rounded cursor-pointer" />
                    </div>
                </div>
            )}
            {activeTab === 'Data' && (
                <div className="p-8 space-y-6">
                    <div className="bg-white border p-6 rounded-xl flex items-center justify-between">
                        <div><h3 className="font-bold">Import Data</h3><p className="text-sm text-slate-500">Restore from JSON backup.</p></div>
                        <label className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer"><Upload size={16} className="inline mr-2"/> Upload<input type="file" className="hidden" onChange={handleFileUpload}/></label>
                    </div>
                    <button onClick={onExportData} className="w-full border border-slate-300 px-4 py-2 rounded">Download Backup</button>
                </div>
            )}
        </div>

        {activeTab !== 'Data' && activeTab !== 'Library' && (
            <div className="p-6 bg-slate-50 border-t flex justify-end">
                <button onClick={handleSave} className={`px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center gap-2 ${isSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isSaved ? <><CheckCircle size={20}/> Saved!</> : <><Save size={20}/> Save Changes</>}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};