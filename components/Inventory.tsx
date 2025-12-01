import React, { useState } from 'react';
import { Asset, CmmcAssetCategory } from '../types';
import { Laptop2, Server, Smartphone, Monitor, ShieldCheck, Search, Plus, Trash2, Box, Lock, FileKey } from 'lucide-react';

interface InventoryProps {
  assets: Asset[];
  onAddAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  variant?: 'default' | 'wizard';
}

export const Inventory: React.FC<InventoryProps> = ({ assets, onAddAsset, onDeleteAsset, variant = 'default' }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
      type: 'Workstation',
      criticality: 'Medium',
      cmmcCategory: 'Out-of-Scope'
  });

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
          enclave: newAsset.enclave || ''
      });
      setIsAdding(false);
      setNewAsset({ type: 'Workstation', criticality: 'Medium', cmmcCategory: 'Out-of-Scope', name: '', owner: '', location: '', enclave: '' });
  };

  const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.owner.toLowerCase().includes(searchTerm.toLowerCase()));

  const isWizard = variant === 'wizard';

  return (
    <div className={isWizard ? '' : 'max-w-7xl mx-auto p-6'}>
      <div className="flex justify-between items-end mb-6">
        <div>
            {isWizard ? (
                <div className="space-y-1">
                     <h3 className="text-lg font-bold text-slate-800">Identify Hardware & Software</h3>
                     <p className="text-sm text-slate-500 max-w-xl">
                        List devices. Critical for CMMC is identifying <strong>Security Protection Assets (SPA)</strong> and where <strong>CUI</strong> lives.
                     </p>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-slate-900">Asset Inventory</h2>
                    <p className="text-slate-600">Track assets by CMMC Category (CUI, SPA, CRMA) and Enclave.</p>
                </>
            )}
        </div>
        <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
        >
            <Plus size={18} /> Add Asset
        </button>
      </div>

      {isAdding && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6 animate-in fade-in slide-in-from-top-2">
              <h3 className="font-bold text-slate-800 mb-4">Add New Asset</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asset Name/Tag</label>
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
                            className="w-full border p-2 rounded text-sm"
                            value={newAsset.cmmcCategory}
                            onChange={e => setNewAsset({...newAsset, cmmcCategory: e.target.value as any})}
                          >
                              <option value="Out-of-Scope">Out-of-Scope</option>
                              <option value="FCI">FCI Only (Federal Contract Info)</option>
                              <option value="CUI">CUI Asset (Stores/Processes CUI)</option>
                              <option value="SPA">Security Protection Asset (Firewall, AD)</option>
                              <option value="CRMA">Contractor Risk Managed (No CUI, but risky)</option>
                          </select>
                          <p className="text-[10px] text-slate-500 mt-1">
                              <strong>SPA:</strong> Assets that provide security.<br/>
                              <strong>CUI:</strong> Assets that touch CUI.
                          </p>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enclave / VLAN</label>
                          <input className="w-full border p-2 rounded text-sm" value={newAsset.enclave || ''} onChange={e => setNewAsset({...newAsset, enclave: e.target.value})} placeholder="e.g. CUI Enclave" />
                      </div>
                  </div>
              </div>
              <div className="flex justify-end gap-2 mt-6 border-t border-slate-100 pt-4">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button onClick={handleAdd} className="px-6 py-2 bg-blue-600 text-white rounded font-medium shadow-sm">Save Asset</button>
              </div>
          </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
              <Search className="text-slate-400" size={20} />
              <input 
                className="flex-1 outline-none text-sm" 
                placeholder="Search assets by name or owner..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
          </div>
          <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold sticky top-0 z-10 shadow-sm">
                      <tr>
                          <th className="p-4 w-12"></th>
                          <th className="p-4">Asset Name</th>
                          <th className="p-4">Owner</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">CMMC Category</th>
                          <th className="p-4">Enclave</th>
                          <th className="p-4 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredAssets.length === 0 && (
                          <tr><td colSpan={7} className="p-6 text-center text-slate-400 italic">No assets added yet.</td></tr>
                      )}
                      {filteredAssets.map(asset => (
                          <tr key={asset.id} className="hover:bg-slate-50 group">
                              <td className="p-4">
                                  <div className="p-2 bg-slate-100 rounded-lg inline-block text-slate-500">
                                      {getIcon(asset.type)}
                                  </div>
                              </td>
                              <td className="p-4">
                                  <div className="font-bold text-slate-900">{asset.name}</div>
                                  <div className="text-xs text-slate-500">{asset.type}</div>
                              </td>
                              <td className="p-4 text-slate-600">{asset.owner}</td>
                              <td className="p-4 text-slate-600">{asset.location}</td>
                              <td className="p-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase shadow-sm ${getCategoryBadge(asset.cmmcCategory)}`}>
                                      {asset.cmmcCategory === 'SPA' && <ShieldCheck size={12} />}
                                      {asset.cmmcCategory === 'CUI' && <Lock size={12} />}
                                      {asset.cmmcCategory}
                                  </span>
                              </td>
                              <td className="p-4">
                                  {asset.enclave ? (
                                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-600">
                                          {asset.enclave}
                                      </span>
                                  ) : (
                                      <span className="text-slate-400 text-xs">-</span>
                                  )}
                              </td>
                              <td className="p-4 text-right">
                                  <button onClick={() => onDeleteAsset(asset.id)} className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                      <Trash2 size={16} />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};