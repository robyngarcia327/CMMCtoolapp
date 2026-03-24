
import React, { useState, useRef } from 'react';
import { Asset, CmmcAssetCategory, IntegrationConfig } from '../types';
import { 
  Laptop2, Server, Smartphone, Monitor, ShieldCheck, 
  Search, Plus, Trash2, Box, Lock, FileKey, 
  Upload, FileSpreadsheet, RefreshCw, Cloud, Info, CheckCircle2, 
  ListPlus, X, Save
} from 'lucide-react';
import { integrationService } from '../services/integrations';

interface InventoryProps {
  assets: Asset[];
  onAddAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  intuneConfig?: IntegrationConfig;
  variant?: 'default' | 'wizard';
}

interface BulkRow {
  name: string;
  type: string;
  owner: string;
  category: CmmcAssetCategory;
}

export const Inventory: React.FC<InventoryProps> = ({ 
  assets, 
  onAddAsset, 
  onDeleteAsset, 
  intuneConfig = { enabled: true }, 
  variant = 'default' 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Bulk Entry State
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([
    { name: '', type: 'Workstation', owner: '', category: 'Out-of-Scope' }
  ]);

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
      
      let importCount = 0;
      parsedAssets.forEach(pa => {
        if (!pa.name) return;

        onAddAsset({
          id: `CSV-${Math.floor(Math.random() * 100000)}`,
          name: pa.name,
          owner: pa.owner || 'Unassigned',
          location: pa.location || 'Unknown',
          type: (pa.type as any) || 'Workstation',
          criticality: (pa.criticality as any) || 'Medium',
          cmmcCategory: (pa.cmmcCategory as any) || 'Out-of-Scope',
          source: 'CSV_Import',
          lastSynced: Date.now()
        });
        importCount++;
      });
      alert(`Imported ${importCount} assets successfully.`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleIntuneSync = async () => {
    setIsSyncing(true);
    try {
      const syncedAssets = await integrationService.syncIntuneAssets(intuneConfig);
      let newCount = 0;
      syncedAssets.forEach(sa => {
        const exists = assets.find(a => a.externalId === sa.externalId || a.name === sa.name);
        if (!exists) {
          onAddAsset({
            ...sa as Asset,
            id: `SYNC-${Math.floor(Math.random() * 100000)}`,
          });
          newCount++;
        }
      });
      alert(`Sync Complete: Discovered ${syncedAssets.length} devices. Added ${newCount} new assets.`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddBulkRow = () => {
    setBulkRows([...bulkRows, { name: '', type: 'Workstation', owner: '', category: 'Out-of-Scope' }]);
  };

  const updateBulkRow = (index: number, field: keyof BulkRow, value: string) => {
    const updated = [...bulkRows];
    updated[index] = { ...updated[index], [field]: value };
    setBulkRows(updated);
  };

  const handleSaveBulk = () => {
    const validRows = bulkRows.filter(r => r.name.trim() !== '');
    validRows.forEach(r => {
      onAddAsset({
        id: `BULK-${Math.floor(Math.random() * 10000)}`,
        name: r.name,
        owner: r.owner || 'Unassigned',
        location: 'HQ',
        type: r.type as any,
        criticality: 'Medium',
        cmmcCategory: r.category,
        source: 'Manual'
      });
    });
    setIsBulkMode(false);
    setBulkRows([{ name: '', type: 'Workstation', owner: '', category: 'Out-of-Scope' }]);
    alert(`Bulk entry complete. Added ${validRows.length} items.`);
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'Server': return <Server size={18} className="text-purple-600" />;
          case 'Workstation': return <Monitor size={18} className="text-coral-600" />;
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
          case 'FCI': return 'bg-coral-100 text-coral-800 border-coral-200';
          default: return 'bg-silver-100 text-slate-500 border-silver-200';
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

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={variant === 'wizard' ? 'p-4' : 'max-w-7xl mx-auto p-6 overflow-y-auto h-full'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Asset Inventory</h2>
            <p className="text-slate-600 text-sm">Track physical and logical assets for compliance scoping.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleCsvUpload} />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-silver-300 text-slate-700 rounded-lg hover:bg-silver-50 shadow-sm text-sm font-medium transition-all"
            >
                <FileSpreadsheet size={18} className="text-green-600" /> Bulk Import (CSV)
            </button>
            <button 
                onClick={() => { setIsBulkMode(!isBulkMode); setIsAdding(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-sm font-bold transition-all ${isBulkMode ? 'bg-coral-100 text-coral-700 border border-coral-200' : 'bg-white border border-silver-300 text-slate-700 hover:bg-silver-50'}`}
            >
                <ListPlus size={18} /> Interactive Bulk Entry
            </button>
            <button 
                onClick={() => { setIsAdding(true); setIsBulkMode(false); }}
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
              <div className="flex justify-end gap-2 mt-6 border-t border-silver-100 pt-4">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button onClick={handleAdd} className="px-6 py-2 bg-coral-600 text-white rounded font-bold shadow-sm">Save Asset</button>
              </div>
          </div>
      )}

      {isBulkMode && (
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-silver-100 mb-6 animate-in fade-in slide-in-from-top-2 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-coral-900 uppercase tracking-tight">Interactive Bulk Asset Entry</h3>
                  <button onClick={() => setIsBulkMode(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
              </div>
              <div className="overflow-x-auto border rounded-xl mb-4">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-silver-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b">
                          <tr>
                              <th className="p-3">Asset Name</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Owner / User</th>
                              <th className="p-3">Compliance Category</th>
                              <th className="p-3 w-10"></th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-silver-100">
                          {bulkRows.map((row, idx) => (
                              <tr key={idx}>
                                  <td className="p-2"><input className="w-full border rounded p-1.5 text-sm" placeholder="e.g. SRV-01" value={row.name} onChange={e => updateBulkRow(idx, 'name', e.target.value)} /></td>
                                  <td className="p-2">
                                      <select className="w-full border rounded p-1.5 text-sm" value={row.type} onChange={e => updateBulkRow(idx, 'type', e.target.value)}>
                                          <option>Server</option>
                                          <option>Workstation</option>
                                          <option>Network Device</option>
                                          <option>Software</option>
                                      </select>
                                  </td>
                                  <td className="p-2"><input className="w-full border rounded p-1.5 text-sm" placeholder="e.g. IT Admin" value={row.owner} onChange={e => updateBulkRow(idx, 'owner', e.target.value)} /></td>
                                  <td className="p-2">
                                      <select className="w-full border rounded p-1.5 text-sm" value={row.category} onChange={e => updateBulkRow(idx, 'category', e.target.value as any)}>
                                          <option value="Out-of-Scope">Out-of-Scope</option>
                                          <option value="CUI">CUI Asset</option>
                                          <option value="SPA">SPA</option>
                                          <option value="FCI">FCI Only</option>
                                      </select>
                                  </td>
                                  <td className="p-2">
                                      <button onClick={() => setBulkRows(bulkRows.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-red-500"><X size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              <div className="flex justify-between items-center">
                  <button onClick={handleAddBulkRow} className="text-coral-600 font-bold text-xs uppercase flex items-center gap-1 hover:underline">
                      <Plus size={14} /> Add Row
                  </button>
                  <div className="flex gap-2">
                      <button onClick={() => setIsBulkMode(false)} className="px-6 py-2 text-slate-500 font-bold text-xs uppercase">Discard</button>
                      <button onClick={handleSaveBulk} className="px-8 py-2 bg-coral-600 text-white rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-lg shadow-coral-100">
                          <Save size={14} /> Save Assets
                      </button>
                  </div>
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
                                      {asset.source === 'Intune' ? <span title="Synced from Intune"><Cloud size={14} className="text-coral-500" /></span> : 
                                       asset.source === 'CSV_Import' ? <span title="Imported via CSV"><FileSpreadsheet size={14} className="text-green-500" /></span> : 
                                       <span title="Manually entered"><Info size={14} className="text-slate-400" /></span>}
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
