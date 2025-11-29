

import React, { useState } from 'react';
import { Asset } from '../types';
import { Laptop2, Server, Smartphone, Monitor, ShieldCheck, Search, Plus, Trash2 } from 'lucide-react';

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
      inScopeCUI: false
  });

  const getIcon = (type: string) => {
      switch(type) {
          case 'Server': return <Server size={18} className="text-purple-600" />;
          case 'Workstation': return <Monitor size={18} className="text-blue-600" />;
          case 'Mobile': return <Smartphone size={18} className="text-slate-600" />;
          case 'Network Device': return <Monitor size={18} className="text-orange-600" />; // Fallback icon
          default: return <Laptop2 size={18} className="text-slate-600" />;
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
          inScopeCUI: newAsset.inScopeCUI || false
      });
      setIsAdding(false);
      setNewAsset({ type: 'Workstation', criticality: 'Medium', inScopeCUI: false, name: '', owner: '', location: '' });
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
                        Before we assess security controls, list the critical devices that store or process sensitive data.
                     </p>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-slate-900">Asset Inventory</h2>
                    <p className="text-slate-600">Track hardware and software assets within the compliance boundary.</p>
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
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6">
              <h3 className="font-bold text-slate-800 mb-4">Add New Asset</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asset Name/Tag</label>
                      <input className="w-full border p-2 rounded" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} placeholder="e.g. LPT-001" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Owner</label>
                      <input className="w-full border p-2 rounded" value={newAsset.owner} onChange={e => setNewAsset({...newAsset, owner: e.target.value})} placeholder="e.g. IT Dept" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                      <select className="w-full border p-2 rounded" value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value as any})}>
                          <option>Workstation</option>
                          <option>Server</option>
                          <option>Network Device</option>
                          <option>Mobile</option>
                          <option>Software</option>
                      </select>
                  </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                      <input className="w-full border p-2 rounded" value={newAsset.location} onChange={e => setNewAsset({...newAsset, location: e.target.value})} />
                  </div>
                  <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 rounded text-blue-600" checked={newAsset.inScopeCUI} onChange={e => setNewAsset({...newAsset, inScopeCUI: e.target.checked})} />
                          <span className="font-medium text-slate-700">Stores/Processes CUI?</span>
                      </label>
                  </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
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
          <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700">
                      <tr>
                          <th className="p-4">Type</th>
                          <th className="p-4">Asset Name</th>
                          <th className="p-4">Owner</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">CUI Scope</th>
                          <th className="p-4 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredAssets.length === 0 && (
                          <tr><td colSpan={6} className="p-6 text-center text-slate-400 italic">No assets added yet.</td></tr>
                      )}
                      {filteredAssets.map(asset => (
                          <tr key={asset.id} className="hover:bg-slate-50">
                              <td className="p-4">
                                  <div className="p-2 bg-slate-100 rounded-lg inline-block">
                                      {getIcon(asset.type)}
                                  </div>
                              </td>
                              <td className="p-4 font-medium text-slate-900">{asset.name}</td>
                              <td className="p-4 text-slate-600">{asset.owner}</td>
                              <td className="p-4 text-slate-600">{asset.location}</td>
                              <td className="p-4">
                                  {asset.inScopeCUI ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          <ShieldCheck size={12} /> In Scope
                                      </span>
                                  ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                          Out of Scope
                                      </span>
                                  )}
                              </td>
                              <td className="p-4 text-right">
                                  <button onClick={() => onDeleteAsset(asset.id)} className="text-slate-400 hover:text-red-600">
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
