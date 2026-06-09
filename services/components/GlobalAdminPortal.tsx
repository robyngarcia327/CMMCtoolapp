
import React, { useState } from 'react';
import { 
  Shield, 
  Building2, 
  Users, 
  Search, 
  UserCheck, 
  Activity,
  Eye,
  Trash2,
  Fingerprint,
  ChevronRight,
  ShieldAlert,
  Globe,
  UserPlus
} from 'lucide-react';
import { Client, User, CognitoGroup } from '../types';

interface GlobalAdminPortalProps {
  tenants: Client[];
  allUsers: User[];
  onPromoteUser: (userId: string, group: CognitoGroup) => void;
  onDeleteTenant: (tenantId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const GlobalAdminPortal: React.FC<GlobalAdminPortalProps> = ({
  tenants,
  allUsers,
  onPromoteUser,
  onDeleteTenant,
  onDeleteUser
}) => {
  const [activeTab, setActiveTab] = useState<'TENANTS' | 'USERS' | 'AUDITORS'>('TENANTS');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const auditors = allUsers.filter(u => u.role === 'Auditor');

  return (
    <div className="max-w-7xl mx-auto p-6 h-full flex flex-col space-y-8 overflow-y-auto bg-slate-50/30">
      
      {/* Global Header */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-coral-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-coral-500 rounded-2xl flex items-center justify-center shadow-lg rotate-3">
                      <Shield size={32} />
                  </div>
                  <div>
                      <h1 className="text-3xl font-black tracking-tight uppercase">Global Admin Command</h1>
                      <p className="text-coral-300 font-bold text-xs uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                          <Activity size={12} className="animate-pulse" /> Platform Operations & Governance
                      </p>
                  </div>
              </div>
              <div className="flex gap-4">
                  <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
                      <div className="text-[10px] font-black text-coral-300 uppercase tracking-widest mb-1">Active Tenants</div>
                      <div className="text-2xl font-black">{tenants.length}</div>
                  </div>
                  <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
                      <div className="text-[10px] font-black text-coral-300 uppercase tracking-widest mb-1">Total Users</div>
                      <div className="text-2xl font-black">{allUsers.length}</div>
                  </div>
              </div>
          </div>
      </div>

      {/* Navigation & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
              {[
                { id: 'TENANTS', label: 'Tenants', icon: Building2 },
                { id: 'USERS', label: 'Identity Pool', icon: Users },
                { id: 'AUDITORS', label: 'Auditor Registry', icon: UserCheck }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === tab.id ? 'bg-coral-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
          </div>

          <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-coral-500 outline-none shadow-inner"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          
          {activeTab === 'TENANTS' && (
              <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
                      <tr>
                          <th className="p-5">Organization Name</th>
                          <th className="p-5">Domain Context</th>
                          <th className="p-5 text-center">User Count</th>
                          <th className="p-5">Status</th>
                          <th className="p-5 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredTenants.map(tenant => (
                          <tr key={tenant.id} className="hover:bg-slate-50 group">
                              <td className="p-5">
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-sm border border-slate-200 group-hover:bg-coral-600 group-hover:text-white transition-colors">
                                          {tenant.logoInitial}
                                      </div>
                                      <div>
                                          <div className="font-black text-slate-900">{tenant.name}</div>
                                          <div className="text-[10px] text-slate-400 font-bold uppercase">{tenant.industry}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="p-5 font-mono text-xs text-coral-600 font-bold">
                                  @{tenant.domain}
                              </td>
                              <td className="p-5 text-center">
                                  <span className="bg-slate-100 px-3 py-1 rounded-full font-black text-xs text-slate-600">
                                      {allUsers.filter(u => u.organizationId === tenant.id).length}
                                  </span>
                              </td>
                              <td className="p-5">
                                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-green-200">Verified Tenant</span>
                              </td>
                              <td className="p-5 text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400"><Eye size={16} /></button>
                                      <button onClick={() => onDeleteTenant(tenant.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          )}

          {activeTab === 'USERS' && (
              <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
                      <tr>
                          <th className="p-5">Identity</th>
                          <th className="p-5">Domain Context</th>
                          <th className="p-5">Cognito Group</th>
                          <th className="p-5">Permissions</th>
                          <th className="p-5 text-right">Promotion</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map(user => (
                          <tr key={user.id} className="hover:bg-slate-50 group">
                              <td className="p-5">
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                                          {user.name.charAt(0)}
                                      </div>
                                      <div>
                                          <div className="font-black text-slate-900">{user.name}</div>
                                          <div className="text-xs text-slate-500">{user.email}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="p-5">
                                  <div className="flex flex-col">
                                      <span className="font-bold text-slate-700">@{user.domain}</span>
                                  </div>
                              </td>
                              <td className="p-5">
                                  <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${
                                          user.role === 'Application_Administrator' ? 'bg-purple-500' :
                                          user.role === 'Tenant_Admin' ? 'bg-coral-500' :
                                          user.role === 'Auditor' ? 'bg-amber-500' : 'bg-slate-400'
                                      }`} />
                                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{user.role.replace(/_/g, ' ')}</span>
                                  </div>
                              </td>
                              <td className="p-5">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                                      user.role === 'Tenant_Admin' ? 'bg-coral-50 text-coral-700 border-coral-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                                  }`}>
                                      {user.role === 'Tenant_Admin' ? 'ORG_ADMIN' : 'STANDARD_USER'}
                                  </span>
                              </td>
                              <td className="p-5 text-right">
                                  <select 
                                    className="bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase px-2 py-1 outline-none hover:border-coral-500"
                                    value={user.role}
                                    onChange={e => onPromoteUser(user.id, e.target.value as CognitoGroup)}
                                  >
                                      <option value="Admin_Created_Users">Admin Created</option>
                                      <option value="Tenant_Admin">Tenant Admin</option>
                                      <option value="Auditor">Auditor</option>
                                      <option value="Application_Administrator">Global Admin</option>
                                  </select>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          )}

          {activeTab === 'AUDITORS' && (
              <div className="p-8 space-y-8">
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start gap-4">
                      <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
                          <ShieldAlert size={24} />
                      </div>
                      <div>
                          <h4 className="font-black text-amber-900 uppercase text-xs tracking-widest mb-1">Assigned Auditor Registry</h4>
                          <p className="text-sm text-amber-800 leading-relaxed max-w-2xl">
                              The <strong>Auditor</strong> group is reserved for verified third-party assessors. 
                              These accounts have read-only access to specific compliance narratives and evidence across their assigned domains.
                          </p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {auditors.map(auditor => (
                          <div key={auditor.id} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 relative group overflow-hidden">
                              <div className="flex items-center gap-4 mb-6">
                                  <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-coral-600 shadow-sm">
                                      <UserCheck size={28} />
                                  </div>
                                  <div>
                                      <div className="font-black text-slate-900 leading-tight">{auditor.name}</div>
                                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{auditor.email}</div>
                                  </div>
                              </div>
                              <div className="space-y-3">
                                  <div className="flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Domain Affinity</span>
                                      <span className="text-slate-900 font-bold">@{auditor.domain}</span>
                                  </div>
                              </div>
                              <button className="w-full mt-6 bg-white border border-slate-200 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-coral-600 hover:text-white transition-all">
                                  View Audit Assignments
                              </button>
                          </div>
                      ))}
                      <button className="border-4 border-dashed border-slate-100 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-300 hover:border-coral-100 hover:text-coral-300 transition-all group">
                          <UserPlus size={48} className="mb-4 group-hover:scale-110 transition-transform" />
                          <span className="font-black uppercase tracking-widest text-[10px]">Add Auditor Group</span>
                      </button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
