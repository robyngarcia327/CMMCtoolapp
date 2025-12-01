
import React, { useState } from 'react';
import { Vendor } from '../types';
import { Building2, Search, Plus, ShieldCheck, AlertTriangle, FileText, Calendar, Trash2, Edit2 } from 'lucide-react';

interface VendorManagerProps {
  vendors: Vendor[];
  onAddVendor: (vendor: Vendor) => void;
  onUpdateVendor: (vendor: Vendor) => void;
  onDeleteVendor: (id: string) => void;
}

export const VendorManager: React.FC<VendorManagerProps> = ({ vendors, onAddVendor, onUpdateVendor, onDeleteVendor }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
      status: 'Active',
      criticality: 'Medium',
      hasNDASigned: false,
      hasDPA: false
  });

  const handleSave = () => {
      if (!newVendor.name) return;
      
      const vendor: Vendor = {
          id: newVendor.id || `V-${Date.now()}`,
          name: newVendor.name,
          serviceProvided: newVendor.serviceProvided || '',
          criticality: newVendor.criticality as any,
          contactPerson: newVendor.contactPerson || '',
          contactEmail: newVendor.contactEmail || '',
          status: newVendor.status as any,
          hasNDASigned: newVendor.hasNDASigned || false,
          hasDPA: newVendor.hasDPA || false,
          lastAssessmentDate: newVendor.lastAssessmentDate || Date.now(),
          nextAssessmentDate: newVendor.nextAssessmentDate || Date.now() + (1000 * 60 * 60 * 24 * 365) // +1 year
      };

      if (newVendor.id) {
          onUpdateVendor(vendor);
      } else {
          onAddVendor(vendor);
      }
      setIsAdding(false);
      setNewVendor({ status: 'Active', criticality: 'Medium', hasNDASigned: false, hasDPA: false });
  };

  const getCriticalityBadge = (level: string) => {
      switch(level) {
          case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
          case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
          case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          default: return 'bg-blue-100 text-blue-800 border-blue-200';
      }
  };

  const filteredVendors = vendors?.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="text-indigo-600" /> Vendor Risk Management
            </h2>
            <p className="text-slate-600">Track third-party vendors, contracts, and security assessments.</p>
        </div>
        <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
        >
            <Plus size={18} /> Add Vendor
        </button>
      </div>

      {isAdding && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6 animate-in fade-in slide-in-from-top-2">
              <h3 className="font-bold text-slate-800 mb-4">{newVendor.id ? 'Edit Vendor' : 'Onboard New Vendor'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vendor Name</label>
                      <input className="w-full border p-2 rounded" value={newVendor.name || ''} onChange={e => setNewVendor({...newVendor, name: e.target.value})} placeholder="e.g. AWS, cleaning service" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service Provided</label>
                      <input className="w-full border p-2 rounded" value={newVendor.serviceProvided || ''} onChange={e => setNewVendor({...newVendor, serviceProvided: e.target.value})} placeholder="e.g. Hosting, Janitorial" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Criticality</label>
                      <select className="w-full border p-2 rounded" value={newVendor.criticality} onChange={e => setNewVendor({...newVendor, criticality: e.target.value as any})}>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Person</label>
                      <input className="w-full border p-2 rounded" value={newVendor.contactPerson || ''} onChange={e => setNewVendor({...newVendor, contactPerson: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Email</label>
                      <input className="w-full border p-2 rounded" value={newVendor.contactEmail || ''} onChange={e => setNewVendor({...newVendor, contactEmail: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                      <select className="w-full border p-2 rounded" value={newVendor.status} onChange={e => setNewVendor({...newVendor, status: e.target.value as any})}>
                          <option>Active</option>
                          <option>Under Review</option>
                          <option>Rejected</option>
                      </select>
                  </div>
                  <div className="md:col-span-3 flex gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" checked={newVendor.hasNDASigned} onChange={e => setNewVendor({...newVendor, hasNDASigned: e.target.checked})} />
                          <span className="text-sm font-medium text-slate-700">NDA Signed?</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" checked={newVendor.hasDPA} onChange={e => setNewVendor({...newVendor, hasDPA: e.target.checked})} />
                          <span className="text-sm font-medium text-slate-700">DPA (Data Processing Agreement)?</span>
                      </label>
                  </div>
              </div>
              <div className="flex justify-end gap-2 mt-6 border-t border-slate-100 pt-4">
                  <button onClick={() => { setIsAdding(false); setNewVendor({}); }} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded">Cancel</button>
                  <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded font-medium shadow-sm hover:bg-blue-700">Save Vendor</button>
              </div>
          </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
              <Search className="text-slate-400" size={20} />
              <input 
                className="flex-1 outline-none text-sm" 
                placeholder="Search vendors..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
          </div>
          
          <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold">
                  <tr>
                      <th className="p-4">Vendor</th>
                      <th className="p-4">Service</th>
                      <th className="p-4">Criticality</th>
                      <th className="p-4">Compliance Status</th>
                      <th className="p-4">Next Review</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {filteredVendors.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">No vendors found.</td></tr>
                  )}
                  {filteredVendors.map(vendor => (
                      <tr key={vendor.id} className="hover:bg-slate-50 group">
                          <td className="p-4">
                              <div className="font-bold text-slate-900">{vendor.name}</div>
                              <div className="text-xs text-slate-500">{vendor.contactEmail}</div>
                          </td>
                          <td className="p-4 text-slate-600">{vendor.serviceProvided}</td>
                          <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold border ${getCriticalityBadge(vendor.criticality)}`}>
                                  {vendor.criticality}
                              </span>
                          </td>
                          <td className="p-4">
                              <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2 text-xs">
                                      {vendor.hasNDASigned ? <ShieldCheck size={14} className="text-green-600" /> : <AlertTriangle size={14} className="text-red-500" />}
                                      <span className={vendor.hasNDASigned ? 'text-slate-700' : 'text-red-600'}>NDA</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                      {vendor.hasDPA ? <FileText size={14} className="text-green-600" /> : <AlertTriangle size={14} className="text-amber-500" />}
                                      <span className={vendor.hasDPA ? 'text-slate-700' : 'text-amber-600'}>DPA</span>
                                  </div>
                              </div>
                          </td>
                          <td className="p-4 text-slate-600 flex items-center gap-2">
                              <Calendar size={14} className="text-slate-400" />
                              {new Date(vendor.nextAssessmentDate || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setNewVendor(vendor); setIsAdding(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                      <Edit2 size={16} />
                                  </button>
                                  <button onClick={() => onDeleteVendor(vendor.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
};
