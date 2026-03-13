import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { api } from '../services/api';
import { Vendor } from '../types';

export const VendorManager: React.FC = () => {
  const auth = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    domain: '',
    serviceProvided: '',
    criticality: 'Medium',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    status: 'Active',
    hasNDASigned: false,
    hasDPA: false,
    handlesCUI: false,
    lastAssessmentDate: Date.now(),
    nextAssessmentDate: Date.now() + 365 * 24 * 60 * 60 * 1000
  });

  const orgId = 'demo-org'; // In a real app, get from user profile

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    if (!auth.user?.id_token) return;
    setIsLoading(true);
    try {
      const data = await api.getVendors(auth.user.id_token, orgId);
      setVendors(data);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user?.id_token) return;

    try {
      if (editingVendor) {
        await api.updateVendor(auth.user.id_token, orgId, editingVendor.id, formData);
      } else {
        await api.createVendor(auth.user.id_token, orgId, formData as Omit<Vendor, 'id'>);
      }
      setIsAddingVendor(false);
      setEditingVendor(null);
      setFormData({
        name: '',
        domain: '',
        serviceProvided: '',
        criticality: 'Medium',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        status: 'Active',
        hasNDASigned: false,
        hasDPA: false,
        handlesCUI: false,
        lastAssessmentDate: Date.now(),
        nextAssessmentDate: Date.now() + 365 * 24 * 60 * 60 * 1000
      });
      fetchVendors();
    } catch (error) {
      console.error("Failed to save vendor", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!auth.user?.id_token) return;
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await api.deleteVendor(auth.user.id_token, orgId, id);
      fetchVendors();
    } catch (error) {
      console.error("Failed to delete vendor", error);
    }
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'High': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" size={28} />
            Vendor Management
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Maintain your supply chain security and CUI handling authorizations.
          </p>
        </div>
        <button 
          onClick={() => setIsAddingVendor(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          Add Vendor
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-4 bg-white border-b border-slate-200 flex gap-4 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search vendors, domains, or contacts..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2 text-sm font-bold">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredVendors.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase">No Vendors Found</h3>
                <p className="text-slate-500 text-sm max-w-xs mt-2">
                  Start building your approved vendor list to manage CUI data flow.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor / Domain</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Point Person</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">CUI Handling</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Criticality</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map(vendor => (
                      <tr key={vendor.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black">
                              {vendor.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-900">{vendor.name}</div>
                              <div className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                                <Globe size={12} />
                                {vendor.domain}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-bold text-slate-700">{vendor.contactPerson}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <a href={`mailto:${vendor.contactEmail}`} className="text-slate-400 hover:text-blue-600 transition-all">
                              <Mail size={14} />
                            </a>
                            {vendor.contactPhone && (
                              <a href={`tel:${vendor.contactPhone}`} className="text-slate-400 hover:text-blue-600 transition-all">
                                <Phone size={14} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {vendor.handlesCUI ? (
                            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 w-fit">
                              <ShieldCheck size={14} />
                              Authorized
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit">
                              <ShieldAlert size={14} />
                              No CUI
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest w-fit ${getCriticalityColor(vendor.criticality)}`}>
                            {vendor.criticality}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${vendor.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${vendor.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                            {vendor.status}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setEditingVendor(vendor);
                                setFormData(vendor);
                                setIsAddingVendor(true);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(vendor.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAddingVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Register vendor details and CUI authorization status.</p>
              </div>
              <button 
                onClick={() => {
                  setIsAddingVendor(false);
                  setEditingVendor(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Vendor Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    placeholder="e.g. Acme Corp"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Domain</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    placeholder="e.g. acme.com"
                    value={formData.domain}
                    onChange={e => setFormData({...formData, domain: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Service Provided</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    placeholder="e.g. IT Support"
                    value={formData.serviceProvided}
                    onChange={e => setFormData({...formData, serviceProvided: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Criticality</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    value={formData.criticality}
                    onChange={e => setFormData({...formData, criticality: e.target.value as any})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Point Person</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    placeholder="Full Name"
                    value={formData.contactPerson}
                    onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Contact Email</label>
                  <input 
                    type="email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    placeholder="email@vendor.com"
                    value={formData.contactEmail}
                    onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Contact Phone</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    placeholder="555-0000"
                    value={formData.contactPhone}
                    onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.handlesCUI ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-500'}`}>
                      {formData.handlesCUI && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <input 
                      type="checkbox"
                      className="hidden"
                      checked={formData.handlesCUI}
                      onChange={e => setFormData({...formData, handlesCUI: e.target.checked})}
                    />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Handles CUI</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.hasNDASigned ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-500'}`}>
                      {formData.hasNDASigned && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <input 
                      type="checkbox"
                      className="hidden"
                      checked={formData.hasNDASigned}
                      onChange={e => setFormData({...formData, hasNDASigned: e.target.checked})}
                    />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">NDA Signed</span>
                  </label>
                </div>
              </div>

              <div className="col-span-2 pt-4">
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  {editingVendor ? 'Update Vendor' : 'Register Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
