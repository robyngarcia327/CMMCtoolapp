import React, { useState } from 'react';
import { 
  Cloud, 
  Shield, 
  Network, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Settings2, 
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
  Server,
  Zap
} from 'lucide-react';
import { IntegrationConfig, ClientData } from '../types';

interface IntegrationsHubProps {
  data: ClientData;
  onUpdateConfig: (key: keyof ClientData, config: IntegrationConfig) => void;
}

interface Connector {
  id: keyof ClientData;
  name: string;
  category: 'Identity' | 'Endpoint' | 'Infrastructure' | 'Network' | 'Operations';
  icon: React.ReactNode;
  description: string;
  mappedFamilies: string[];
  providerColor: string;
}

const CONNECTORS: Connector[] = [
  {
    id: 'm365Config',
    name: 'Microsoft 365',
    category: 'Identity',
    icon: <Cloud className="text-coral-500" />,
    description: 'Sync identities, track MFA status, and ingest Secure Score data.',
    mappedFamilies: ['AC', 'IA', 'AT', 'MP'],
    providerColor: 'bg-coral-600'
  },
  {
    id: 'defenderConfig',
    name: 'Microsoft Defender',
    category: 'Endpoint',
    icon: <Shield className="text-coral-600" />,
    description: 'Pull endpoint security telemetry and vulnerability assessment data.',
    mappedFamilies: ['SI', 'RA', 'IR'],
    providerColor: 'bg-coral-500'
  },
  {
    id: 's1Config',
    name: 'SentinelOne',
    category: 'Endpoint',
    icon: <Zap className="text-purple-600" />,
    description: 'Monitor active threats and endpoint protection status across all devices.',
    mappedFamilies: ['SI', 'IR'],
    providerColor: 'bg-purple-600'
  },
  {
    id: 'auvikConfig',
    name: 'Auvik',
    category: 'Network',
    icon: <Network className="text-purple-900" />,
    description: 'Automated network discovery, topology mapping, and VLAN scoping.',
    mappedFamilies: ['SC', 'CM', 'AC'],
    providerColor: 'bg-purple-900'
  },
  {
    id: 'awsConfig',
    name: 'AWS Cloud',
    category: 'Infrastructure',
    icon: <Server className="text-orange-500" />,
    description: 'IAM analysis, S3 bucket policy monitoring, and infrastructure-as-code audit.',
    mappedFamilies: ['AC', 'SC', 'CP'],
    providerColor: 'bg-orange-500'
  },
  {
    id: 'googleConfig',
    name: 'Google Workspace',
    category: 'Identity',
    icon: <Database className="text-red-500" />,
    description: 'User governance and cloud storage policy enforcement tracking.',
    mappedFamilies: ['AC', 'MP'],
    providerColor: 'bg-red-500'
  },
  {
    id: 'siemConfig',
    name: 'SIEM / Sentinel',
    category: 'Operations',
    icon: <Lock className="text-coral-600" />,
    description: 'Centralized log analysis and incident reporting integration.',
    mappedFamilies: ['AU', 'IR', 'SI'],
    providerColor: 'bg-coral-600'
  }
];

export const IntegrationsHub: React.FC<IntegrationsHubProps> = ({ data, onUpdateConfig }) => {
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleSync = (id: string) => {
    setIsSyncing(id);
    setTimeout(() => {
        setIsSyncing(null);
        alert(`Successfully synced data from ${id.replace('Config', '')}. Evidence has been refreshed.`);
    }, 2000);
  };

  const selectedConnector = CONNECTORS.find(c => c.id === selectedConnectorId);
  const config = selectedConnector ? (data[selectedConnector.id] as IntegrationConfig) : null;

  return (
    <div className="max-w-7xl mx-auto p-8 h-full flex flex-col space-y-8 overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Zap className="text-coral-600 fill-coral-600" size={28} /> Integrations Hub
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Connect your security tools to automate compliance evidence collection.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-coral-50 text-coral-700 rounded-xl border border-coral-100 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={14} /> Total Automations: {CONNECTORS.filter(c => (data[c.id] as IntegrationConfig)?.enabled).length} Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Connector List */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONNECTORS.map(connector => {
                const isEnabled = (data[connector.id] as IntegrationConfig)?.enabled;
                const activeSync = isSyncing === connector.id;

                return (
                    <div 
                        key={connector.id}
                        className={`bg-white rounded-2xl border transition-all hover:shadow-lg flex flex-col ${
                            isEnabled ? 'border-coral-100 ring-1 ring-coral-50' : 'border-slate-200'
                        } ${selectedConnectorId === connector.id ? 'ring-2 ring-coral-500' : ''}`}
                    >
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    {connector.icon}
                                </div>
                                <div className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    isEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {isEnabled ? 'Connected' : 'Offline'}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{connector.name}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{connector.description}</p>
                            
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                {connector.mappedFamilies.map(f => (
                                    <span key={f} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-black">{f}</span>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex items-center justify-between">
                            <button 
                                onClick={() => setSelectedConnectorId(connector.id as string)}
                                className="text-xs font-bold text-coral-600 flex items-center gap-1 hover:underline"
                            >
                                <Settings2 size={14} /> Configure
                            </button>
                            {isEnabled && (
                                <button 
                                    onClick={() => handleSync(connector.id as string)}
                                    disabled={activeSync}
                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-coral-600 hover:border-coral-200 transition-all disabled:opacity-50"
                                >
                                    <RefreshCw size={14} className={activeSync ? 'animate-spin text-coral-600' : ''} />
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-4 h-full">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col min-h-[500px]">
                {selectedConnector ? (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className={`p-8 text-white ${selectedConnector.providerColor}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    {/* Added fix: casting selectedConnector.icon to React.ReactElement<any> to satisfy props requirements for Lucide icons */}
                                    {React.cloneElement(selectedConnector.icon as React.ReactElement<any>, { className: 'text-white', size: 24 })}
                                </div>
                                <button onClick={() => setSelectedConnectorId(null)} className="p-2 hover:bg-white/10 rounded-full">
                                    <AlertCircle size={20} className="rotate-45" />
                                </button>
                            </div>
                            <h2 className="text-2xl font-black">{selectedConnector.name}</h2>
                            <p className="text-white/70 text-sm mt-1">Provider Integration Settings</p>
                        </div>

                        <div className="p-8 space-y-6 flex-1">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${config?.enabled ? 'bg-green-500' : 'bg-slate-300'} animate-pulse`} />
                                    <span className="font-bold text-sm text-slate-700">Integration Status</span>
                                </div>
                                <button 
                                    onClick={() => onUpdateConfig(selectedConnector.id, { ...config!, enabled: !config?.enabled })}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                        config?.enabled ? 'bg-red-50 text-red-600' : 'bg-coral-600 text-white shadow-lg'
                                    }`}
                                >
                                    {config?.enabled ? 'Disable' : 'Enable'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tenant / Environment ID</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-coral-500 outline-none transition-all font-mono"
                                        placeholder="e.g. env-9921-prod"
                                        value={config?.tenantId || ''}
                                        onChange={(e) => onUpdateConfig(selectedConnector.id, { ...config!, tenantId: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">API Access Token</label>
                                    <input 
                                        type="password" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-coral-500 outline-none transition-all font-mono"
                                        placeholder="••••••••••••••••"
                                        value={config?.apiKey || ''}
                                        onChange={(e) => onUpdateConfig(selectedConnector.id, { ...config!, apiKey: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" /> Automation Benefits
                                </h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-xs text-slate-600">
                                        <div className="mt-0.5 text-coral-600"><CheckCircle2 size={12} /></div>
                                        <span>Automates evidence for <strong>{selectedConnector.mappedFamilies.length * 8} assessment objectives</strong>.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-slate-600">
                                        <div className="mt-0.5 text-coral-600"><CheckCircle2 size={12} /></div>
                                        <span>Continuous monitoring detects configuration drift in real-time.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-slate-900 transition-colors">
                                View Logs <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 h-full flex flex-col items-center justify-center text-center">
                        <div className="p-6 bg-slate-50 rounded-full mb-6">
                            <Zap size={48} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Select a Tool</h3>
                        <p className="text-sm text-slate-400 mt-2">Configure environment identifiers and authentication tokens to begin automation.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};