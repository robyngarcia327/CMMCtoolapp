
import React, { useState } from 'react';
import { Client, User, UserRole, ClientData, BrandingConfig, IntegrationConfig } from '../types';
import { Plus, Shield, Trash2, Mail, Search, Upload, Palette, Zap } from 'lucide-react';
import { IntegrationsHub } from './IntegrationsHub';

interface OrganizationManagerProps {
  clients: Client[];
  clientDataStore: Record<string, ClientData>;
  activeClientId: string;
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onUpdateClientData: (clientId: string, data: Partial<ClientData>) => void;
}

export const OrganizationManager: React.FC<OrganizationManagerProps> = ({
  clients,
  clientDataStore,
  activeClientId,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onUpdateClientData
}) => {
  const [activeTab, setActiveTab] = useState<'CLIENTS' | 'USERS' | 'INTEGRATIONS'>('CLIENTS');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [clientForm, setClientForm] = useState<{
      name: string;
      industry: string;
      branding: BrandingConfig;
  }>({
      name: '',
      industry: '',
      branding: { primaryColor: '#3b82f6', logoUrl: '' }
  });

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({ role: 'CLIENT_USER' });

  const handleSaveClient = () => {
    if (!clientForm.name) return;

    if (editingClient) {
        onUpdateClient({
            ...editingClient,
            name: clientForm.name,
            industry: clientForm.industry,
            branding: clientForm.branding
        });
        setEditingClient(null);
    } else {
        const newClient: Client = {
            id: `client-${Date.now()}`,
            name: clientForm.name,
            industry: clientForm.industry || 'General',
            contactName: 'Admin',
            logoInitial: clientForm.name.charAt(0).toUpperCase(),
            primaryFramework: 'NIST-CMMC',
            nextAuditDate: Date.now() + 1000 * 60 * 60 * 24 * 365,
            accountManager: 'Unassigned',
            isParent: false,
            branding: clientForm.branding
        };
        onAddClient(newClient);
        setIsAddingClient(false);
    }
    
    setClientForm({ name: '', industry: '', branding: { primaryColor: '#3b82f6', logoUrl: '' } });
  };

  const openEditClient = (client: Client) => {
      setEditingClient(client);
      setClientForm({
          name: client.name,
          industry: client.industry,
          branding: client.branding || { primaryColor: '#3b82f6', logoUrl: '' }
      });
      setIsAddingClient(true);
  };

  const handleToggleParent = (client: Client) => {
      onUpdateClient({ ...client, isParent: !client.isParent });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              setClientForm(prev => ({
                  ...prev,
                  branding: { ...prev.branding, logoUrl: ev.target?.result as string }
              }));
          };
          reader.readAsDataURL(file);
      }
  };

  const getAllUsers = () => {
      let allUsers: (User & { clientName: string })[] = [];
      clients.forEach(c => {
          const cData = clientDataStore[c.id];
          if (cData && cData.users) {
              const usersWithOrg = cData.users.map(u => ({ ...u, clientName: c.name, organizationId: c.id }));
              allUsers = [...allUsers, ...usersWithOrg];
          }
      });
      return allUsers;
  };

  const handleCreateUser = () => {
      if (!newUser.name || !newUser.email || !newUser.organizationId) {
          alert("Please fill in Name, Email, and Organization.");
          return;
      }
      
      const user: User = {
          id: `u-${Date.now()}`,
          name: newUser.name,
          email: newUser.email,
          organizationId: newUser.organizationId,
          role: (newUser.role as UserRole) || 'CLIENT_USER',
          department: newUser.department || 'General',
          lastLogin: Date.now(), 
          mfaEnabled: false,
          hasPasskey: false,
          isCuiAuthorized: false
      };

      const targetClientData = clientDataStore[newUser.organizationId];
      if (targetClientData) {
          onUpdateClientData(newUser.organizationId, {
              users: [...targetClientData.users, user]
          });
      }
      setIsAddingUser(false);
      setNewUser({ role: 'CLIENT_USER' });
  };

  const handleDeleteUser = (userId: string, orgId: string) => {
       const targetClientData = clientDataStore[orgId];
       if (targetClientData) {
           onUpdateClientData(orgId, {
               users: targetClientData.users.filter(u => u.id !== userId)
           });
       }
  };

  const activeData = clientDataStore[activeClientId];
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const allUsers = getAllUsers().filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto p-6 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Center</h1>
          <p className="text-slate-600">Central administration for Clients, Users, and Automated Integrations.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
           <button 
             onClick={() => setActiveTab('CLIENTS')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'CLIENTS' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             Clients
           </button>
           <button 
             onClick={() => setActiveTab('USERS')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'USERS' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             Users
           </button>
           <button 
             onClick={() => setActiveTab('INTEGRATIONS')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'INTEGRATIONS' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             <Zap size={14} /> Integrations
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {activeTab === 'CLIENTS' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input 
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => {
                            setEditingClient(null);
                            setClientForm({ name: '', industry: '', branding: { primaryColor: '#3b82f6', logoUrl: '' } });
                            setIsAddingClient(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        <Plus size={18} /> Add Client
                    </button>
               </div>

               {isAddingClient && (
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                       <h3 className="font-bold text-slate-800 mb-4">{editingClient ? 'Edit Organization' : 'New Organization'}</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                           <div className="space-y-4">
                               <input 
                                   className="w-full border p-2 rounded" 
                                   placeholder="Company Name" 
                                   value={clientForm.name}
                                   onChange={e => setClientForm({...clientForm, name: e.target.value})}
                               />
                               <input 
                                   className="w-full border p-2 rounded" 
                                   placeholder="Industry" 
                                   value={clientForm.industry}
                                   onChange={e => setClientForm({...clientForm, industry: e.target.value})}
                               />
                           </div>
                           
                           <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
                               <h4 className="text-sm font-bold text-slate-600 flex items-center gap-2"><Palette size={14} /> Client Branding</h4>
                               
                               <div className="flex items-center gap-4">
                                   <div className="relative w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden group">
                                       {clientForm.branding?.logoUrl ? (
                                           <img src={clientForm.branding.logoUrl} className="w-full h-full object-contain" alt="Logo" />
                                       ) : (
                                           <Upload size={20} className="text-slate-400" />
                                       )}
                                       <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                                   </div>
                                   <div>
                                       <div className="text-xs text-slate-500 mb-1">Logo (Upload)</div>
                                       <div className="flex items-center gap-2">
                                           <input 
                                                type="color" 
                                                value={clientForm.branding?.primaryColor || '#3b82f6'} 
                                                onChange={e => setClientForm(prev => ({ ...prev, branding: { ...prev.branding, primaryColor: e.target.value } }))}
                                                className="w-8 h-8 rounded border-0 cursor-pointer"
                                           />
                                           <span className="text-xs font-mono">{clientForm.branding?.primaryColor}</span>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                       <div className="flex justify-end gap-2">
                           <button onClick={() => setIsAddingClient(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                           <button onClick={handleSaveClient} className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
                       </div>
                   </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredClients.map(client => (
                       <div key={client.id} className={`bg-white rounded-xl shadow-sm border p-6 relative group ${client.isParent ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-200'}`}>
                            {client.isParent && (
                                <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                                    <Shield size={10} /> Parent Org
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                {client.branding?.logoUrl ? (
                                    <img src={client.branding.logoUrl} alt={client.name} className="w-12 h-12 object-contain" />
                                ) : (
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl font-bold text-slate-500">
                                        {client.logoInitial}
                                    </div>
                                )}
                                
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg hover:text-blue-600 cursor-pointer" onClick={() => openEditClient(client)}>{client.name}</h3>
                                    <p className="text-sm text-slate-500">{client.industry}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-sm text-slate-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Users:</span>
                                    <span className="font-medium">{clientDataStore[client.id]?.users?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Framework:</span>
                                    <span className="font-medium">{client.primaryFramework}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                <button 
                                    onClick={() => handleToggleParent(client)}
                                    className={`flex-1 text-xs py-2 rounded border transition-colors ${client.isParent ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {client.isParent ? 'Is Parent (MSP)' : 'Set as Parent'}
                                </button>
                                <button 
                                    onClick={() => openEditClient(client)}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                >
                                    <Palette size={16} />
                                </button>
                                {!client.isParent && (
                                    <button 
                                        onClick={() => { if(confirm('Delete client?')) onDeleteClient(client.id) }}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                       </div>
                   ))}
               </div>
            </div>
          )}

          {activeTab === 'USERS' && (
              <div className="space-y-6">
                   <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input 
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setIsAddingUser(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        <Plus size={18} /> Add User
                    </button>
               </div>

               {isAddingUser && (
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                       <h3 className="font-bold text-slate-800 mb-4">Add New User</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                           <input 
                               className="border p-2 rounded" 
                               placeholder="Full Name" 
                               value={newUser.name}
                               onChange={e => setNewUser({...newUser, name: e.target.value})}
                           />
                           <input 
                               className="border p-2 rounded" 
                               placeholder="Email Address" 
                               value={newUser.email}
                               onChange={e => setNewUser({...newUser, email: e.target.value})}
                           />
                            <select
                                className="border p-2 rounded"
                                value={newUser.organizationId || ''}
                                onChange={e => setNewUser({...newUser, organizationId: e.target.value})}
                            >
                                <option value="" disabled>Select Organization...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <select
                                className="border p-2 rounded"
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value as any})}
                            >
                                <option value="CLIENT_USER">Client User (Restricted)</option>
                                <option value="CLIENT_ADMIN">Client Admin</option>
                                <option value="MSP_TECH">MSP Tech</option>
                                <option value="MSP_ADMIN">MSP Admin (Super User)</option>
                            </select>
                            <input 
                               className="border p-2 rounded" 
                               placeholder="Department (Optional)" 
                               value={newUser.department}
                               onChange={e => setNewUser({...newUser, department: e.target.value})}
                           />
                       </div>
                       <div className="flex justify-end gap-2">
                           <button onClick={() => setIsAddingUser(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                           <button onClick={handleCreateUser} className="px-4 py-2 bg-blue-600 text-white rounded">Save User</button>
                       </div>
                   </div>
               )}

               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                   <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                           <tr>
                               <th className="p-4">Name</th>
                               <th className="p-4">Email</th>
                               <th className="p-4">Organization</th>
                               <th className="p-4">Role</th>
                               <th className="p-4 text-right">Actions</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           {allUsers.map(user => (
                               <tr key={user.id} className="hover:bg-slate-50">
                                   <td className="p-4 font-medium text-slate-900">{user.name}</td>
                                   <td className="p-4 text-slate-500 flex items-center gap-2">
                                       <Mail size={14}/> {user.email}
                                   </td>
                                   <td className="p-4">
                                       <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium">{user.clientName}</span>
                                   </td>
                                   <td className="p-4">
                                       <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                           user.role.includes('MSP') ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                       }`}>
                                           {user.role.replace('_', ' ')}
                                       </span>
                                   </td>
                                   <td className="p-4 text-right">
                                       <button 
                                         onClick={() => handleDeleteUser(user.id, user.organizationId)}
                                         className="text-slate-400 hover:text-red-600 p-2"
                                       >
                                           <Trash2 size={16} />
                                       </button>
                                   </td>
                               </tr>
                           ))}
                           {allUsers.length === 0 && (
                               <tr><td colSpan={5} className="p-8 text-center text-slate-400">No users found.</td></tr>
                           )}
                       </tbody>
                   </table>
               </div>
              </div>
          )}

          {activeTab === 'INTEGRATIONS' && activeData && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
                  <IntegrationsHub 
                    data={activeData}
                    onUpdateConfig={(key, config) => onUpdateClientData(activeClientId, { [key]: config })}
                  />
              </div>
          )}
      </div>
    </div>
  );
};
