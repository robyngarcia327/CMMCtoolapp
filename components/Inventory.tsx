
import React, { useState, useRef } from 'react';
import { Asset, CmmcAssetCategory, IntegrationConfig } from '../types';
import { 
  Laptop2, Server, Smartphone, Monitor, ShieldCheck, 
  Search, Plus, Trash2, Box, Lock, FileKey, 
  Upload, FileSpreadsheet, RefreshCw, Cloud, Info, CheckCircle2 
} from 'lucide-react';
import { integrationService } from '../services/integrations';

interface InventoryProps {
  assets: Asset[];
  onAddAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  intuneConfig?: IntegrationConfig;
  variant?: 'default' | 'wizard';
}

export const Inventory: React.FC<InventoryProps> = ({ 
  assets, 
  onAddAsset, 
  onDeleteAsset, 
  intuneConfig = { enabled: true }, // Default enabled for demo
  variant = 'default' 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
      type: 'Workstation',
      criticality: 'Medium',
      cmmcCategory: 'Out-of-Scope'
  });

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsedAssets = integrationService.parseAssetCsv(text);
      
      parsedAssets.forEach(pa => {
        onAddAsset({
          id: `CSV-${Math.floor(Math.random() * 100000)}`,
          name: pa.name || 'Unknown Asset',
          owner: pa.owner || 'Unassigned',
          location: pa.location || 'Unknown',
          type: (pa.type as any) || 'Workstation',
          criticality: (pa.criticality as any) || 'Medium',
          cmmcCategory: (pa.cmmcCategory as any) || 'Out-of-Scope',
          source: 'CSV_Import',
          lastSynced: Date.now()
        });
      });
      alert(`Imported ${parsedAssets.length} assets successfully.`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleIntuneSync = async () => {
    setIsSyncing(true);
    try {
      const syncedAssets = await integrationService.syncIntuneAssets(intuneConfig);
      syncedAssets.forEach(sa => {
        // Check for duplicates by externalId or Name
        const exists = assets.find(a => a.externalId === sa.externalId || a.name === sa.name);
        if (!exists) {
          onAddAsset({
            ...sa as Asset,
            id: `SYNC-${Math.floor(Math.random() * 100000)}`,
          });
        }
      });
      alert(`Sync Complete: Found ${syncedAssets.length} devices in Intune.`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'Server': return <Server size={18} className="text-purple-600" />;
          case 'Workstation': return <Monitor size={18} className="text-blue-600" />;
          case 'Mobile': return <Smartphone size={18} className="text-slate-600" />;
          case 'Network Device': return <Box size={18} className="text-orange-600" />; 
          case 'Software': return <FileKey size={18} className="text-green-600" />;
          default: return <Laptop2 size={18} className="text-slate-600" />;
      }
  };

  const getCategoryBadge = (cat: CmmcAssetCategory) => {
      switch(cat) {
          case 'CUI': return 'bg-red-100 text-red-800 border-red-200 ring-1 ring-red-300';
          case 'SPA': return 'bg-purple-100 text-purple-800 border-purple-200 ring-1 ring-purple-300';
          case 'CRMA': return 'bg-amber-100 text-amber-800 border-amber-200';
          case 'FCI': return 'bg-blue-100 text-blue-800 border-blue-200';
          default: return 'bg-slate-100 text-slate-500 border-slate-200';
      }
  };

  const handleAdd = () => {
      if (!newAsset.name || !newAsset.owner) return;
      onAddAsset({
          id: `ASSET-${Math.floor(Math.random() * 10000)}`,
          name: newAsset.name,
          owner: newAsset.owner,
          location: newAsset.location || 'HQ',
          type: newAsset.type as any,
          criticality: newAsset.criticality as any,
          cmmcCategory: newAsset.cmmcCategory || 'Out-of-Scope',
          source: 'Manual'
      });
      setIsAdding(false);
      setNewAsset({ type: 'Workstation', criticality: 'Medium', cmmcCategory: 'Out-of-Scope', name: '', owner: '', location: '' });
  };

  const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.owner.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={variant === 'wizard' ? '' : 'max-w-7xl mx-auto p-6'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Asset Inventory</h2>
            <p className="text-slate-600 text-sm">Track physical and logical assets for CMMC scoping.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleCsvUpload} />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm text-sm font-medium transition-all"
            >
                <FileSpreadsheet size={18} className="text-green-600" /> Bulk Import (CSV)
            </button>
            <button 
                onClick={handleIntuneSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 shadow-sm text-sm font-bold transition-all disabled:opacity-50"
            >
                {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Cloud size={18} />}
                {isSyncing ? 'Syncing...' : 'Sync with Intune'}
            </button>
            <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black shadow-lg text-sm font-bold transition-all"
            >
                <Plus size={18} /> Add Manual
            </button>
        </div>
      </div>

      {isAdding && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6 animate-in fade-in slide-in-from-top-2">
              <h3 className="font-bold text-slate-800 mb-4">Add New Asset</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asset Name</label>
                        <input className="w-full border p-2 rounded text-sm" value={newAsset.name || ''} onChange={e => setNewAsset({...newAsset, name: e.target.value})} placeholder="e.g. LPT-001" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Owner</label>
                        <input className="w-full border p-2 rounded text-sm" value={newAsset.owner || ''} onChange={e => setNewAsset({...newAsset, owner: e.target.value})} placeholder="e.g. IT Dept" />
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                        <select className="w-full border p-2 rounded text-sm" value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value as any})}>
                            <option>Workstation</option>
                            <option>Server</option>
                            <option>Network Device</option>
                            <option>Mobile</option>
                            <option>Software</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                        <input className="w-full border p-2 rounded text-sm" value={newAsset.location || ''} onChange={e => setNewAsset({...newAsset, location: e.target.value})} />
                      </div>
                  </div>

                  <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                              <ShieldCheck size={12} /> CMMC Category
                          </label>
                          <select 
                            className="w-full border p-2 rounded text-sm bg-white"
                            value={newAsset.cmmcCategory}
                            onChange={e => setNewAsset({...newAsset, cmmcCategory: e.target.value as any})}
                          >
                              <option value="Out-of-Scope">Out-of-Scope</option>
                              <option value="FCI">FCI Only</option>
                              <option value="CUI">CUI Asset</option>
                              <option value="SPA">Security Protection Asset</option>
                              <option value="CRMA">Contractor Risk Managed</option>
                          </select>
                      </div>
                  </div>
              </div>
              <div className="flex justify-end gap-2 mt-6 border-t border-slate-100 pt-4">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button onClick={handleAdd} className="px-6 py-2 bg-blue-600 text-white rounded font-bold shadow-sm">Save Asset</button>
              </div>
          </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
              <Search className="text-slate-400" size={20} />
              <input 
                className="flex-1 outline-none text-sm" 
                placeholder="Search assets..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                          <th className="p-4 w-12"></th>
                          <th className="p-4">Asset Name</th>
                          <th className="p-4">Owner</th>
                          <th className="p-4">CMMC Category</th>
                          <th className="p-4">Source</th>
                          <th className="p-4">Last Synced</th>
                          <th className="p-4 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredAssets.map(asset => (
                          <tr key={asset.id} className="hover:bg-slate-50 group">
                              <td className="p-4">
                                  <div className="p-2 bg-slate-100 rounded-lg inline-block text-slate-500">
                                      {getIcon(asset.type)}
                                  </div>
                              </td>
                              <td className="p-4">
                                  <div className="font-bold text-slate-900">{asset.name}</div>
                                  <div className="text-[10px] text-slate-500 font-mono">{asset.id}</div>
                              </td>
                              <td className="p-4 text-slate-600">{asset.owner}</td>
                              <td className="p-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase shadow-sm ${getCategoryBadge(asset.cmmcCategory)}`}>
                                      {asset.cmmcCategory === 'SPA' && <ShieldCheck size={12} />}
                                      {asset.cmmcCategory === 'CUI' && <Lock size={12} />}
                                      {asset.cmmcCategory}
                                  </span>
                              </td>
                              <td className="p-4">
                                  <div className="flex items-center gap-1.5">
                                      {asset.source === 'Intune' ? <Cloud size={14} className="text-blue-500" /> : <Info size={14} className="text-slate-400" />}
                                      <span className="text-xs font-medium text-slate-500">{asset.source || 'Manual'}</span>
                                  </div>
                              </td>
                              <td className="p-4 text-slate-400 text-xs">
                                  {asset.lastSynced ? new Date(asset.lastSynced).toLocaleString() : 'Never'}
                              </td>
                              <td className="p-4 text-right">
                                  <button onClick={() => onDeleteAsset(asset.id)} className="text-slate-400 hover:text-red-600 p-2">
                                      <Trash2 size={16} />
                                  </button>
                              </td>
                          </tr>
                      ))}
                      {filteredAssets.length === 0 && (
                          <tr><td colSpan={7} className="p-8 text-center text-slate-400 italic">No assets found matching your criteria.</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};
