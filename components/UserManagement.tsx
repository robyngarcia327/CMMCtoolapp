

import React, { useState, useRef } from 'react';
import { User, UserRole, IntegrationConfig } from '../types';
import { 
  User as UserIcon, Shield, Mail, Lock, RefreshCw, 
  Cloud, Database, Search, Plus, Trash2, 
  CheckCircle2, AlertTriangle, Fingerprint, Info,
  FileSpreadsheet, Upload, Key, ShieldCheck, UserCheck,
  Edit3, X, Save
} from 'lucide-react';
import { integrationService } from '../services/integrations';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  entraConfig?: IntegrationConfig;
}

export const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onAddUser, 
  onUpdateUser, 
  onDeleteUser,
  entraConfig = { enabled: true } // Default enabled for demo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newUser, setNewUser] = useState<Partial<User>>({
      role: 'CLIENT_USER',
      isCuiAuthorized: false,
      accessLevel: 'Low',
      permissions: [],
      roles: []
  });

  const [editUser, setEditUser] = useState<Partial<User>>({});

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsedUsers = integrationService.parseUserCsv(text);
      
      let addedCount = 0;
      parsedUsers.forEach(pu => {
        if (!pu.email || !pu.name) return;

        // Prevent duplicate emails
        const exists = users.find(u => u.email.toLowerCase() === pu.email?.toLowerCase());
        if (!exists) {
            onAddUser({
              id: `U-CSV-${Math.floor(Math.random() * 100000)}`,
              organizationId: 'current',
              name: pu.name,
              email: pu.email,
              domain: pu.email.split('@')[1] || 'unknown.com',
              role: pu.role || 'CLIENT_USER',
              department: pu.department || 'General',
              lastLogin: 0,
              mfaEnabled: !!pu.mfaEnabled,
              hasPasskey: false,
              isCuiAuthorized: false,
              iamSource: 'CSV_Import',
              lastSynced: Date.now(),
              accessLevel: 'Low',
              permissions: [],
              roles: []
            });
            addedCount++;
        }
      });
      alert(`Import complete: Added ${addedCount} new identities from CSV.`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEntraSync = async () => {
      setIsSyncing(true);
      try {
          const syncedUsers = await integrationService.syncEntraUsers(entraConfig);
          let addedCount = 0;
          let updatedCount = 0;

          syncedUsers.forEach(su => {
              const exists = users.find(u => u.email === su.email);
              if (!exists) {
                  onAddUser({
                      ...su as User,
                      id: `ENTRA-${Date.now()}-${Math.random()}`,
                      organizationId: 'current',
                      lastLogin: 0,
                      hasPasskey: false,
                      domain: su.email?.split('@')[1] || 'unknown.com',
                      accessLevel: 'Low',
                      permissions: [],
                      roles: []
                  });
                  addedCount++;
              } else {
                  // Update existing user metadata if synced from Entra
                  onUpdateUser({ 
                      ...exists, 
                      iamSource: 'EntraID', 
                      lastSynced: Date.now(),
                      mfaEnabled: su.mfaEnabled || exists.mfaEnabled
                  });
                  updatedCount++;
              }
          });
          alert(`Identity Sync Complete: Found ${syncedUsers.length} users. Added ${addedCount}, Updated ${updatedCount}.`);
      } catch (e: any) {
          alert(e.message);
      } finally {
          setIsSyncing(false);
      }
  };

  const handleSaveUser = () => {
      if (!newUser.name || !newUser.email) return;
      
      const user: User = {
          id: `U-${Date.now()}`,
          organizationId: 'current',
          name: newUser.name,
          email: newUser.email,
          domain: newUser.email.split('@')[1] || 'unknown.com',
          role: (newUser.role as UserRole) || 'CLIENT_USER',
          department: newUser.department || 'General',
          lastLogin: Date.now(),
          mfaEnabled: false,
          hasPasskey: false,
          isCuiAuthorized: newUser.isCuiAuthorized || false,
          iamSource: 'Manual',
          lastSynced: Date.now(),
          accessLevel: newUser.accessLevel || 'Low',
          permissions: newUser.permissions || [],
          roles: newUser.roles || []
      };
      
      onAddUser(user);
      setIsAdding(false);
      setNewUser({ role: 'CLIENT_USER', isCuiAuthorized: false, accessLevel: 'Low', permissions: [], roles: [] });
  };

  const handleStartEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditUser({ ...user });
  };

  const handleSaveEdit = () => {
    if (editingUserId && editUser.name) {
      onUpdateUser(editUser as User);
      setEditingUserId(null);
      setEditUser({});
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 overflow-y-auto h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="text-coral-600" /> Identity Management
            </h2>
            <p className="text-slate-600 text-sm">Control user access, CUI authorization, and role-based permissions.</p>
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
                onClick={handleEntraSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-coral-50 border border-coral-200 text-coral-700 rounded-lg hover:bg-coral-100 shadow-sm text-sm font-bold transition-all disabled:opacity-50"
            >
                {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Cloud size={16} />}
                {isSyncing ? 'Syncing...' : 'Sync with Entra ID'}
            </button>
            <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black shadow-lg text-sm font-bold transition-all"
            >
                <Plus size={16} /> Add Manual
            </button>
        </div>
      </div>

      {isAdding && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6 animate-in fade-in slide-in-from-top-2">
              <h3 className="font-bold text-slate-800 mb-4">Add Manual Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <input className="border p-2 rounded text-sm" placeholder="Full Name" value={newUser.name || ''} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                  <input className="border p-2 rounded text-sm" placeholder="Email" value={newUser.email || ''} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                  <input className="border p-2 rounded text-sm" placeholder="Department" value={newUser.department || ''} onChange={e => setNewUser({...newUser, department: e.target.value})} />
                  
                  <select 
                    className="border p-2 rounded text-sm" 
                    value={newUser.accessLevel} 
                    onChange={e => setNewUser({...newUser, accessLevel: e.target.value as any})}
                  >
                    <option value="Low">Access Level: Low</option>
                    <option value="Medium">Access Level: Medium</option>
                    <option value="High">Access Level: High</option>
                    <option value="Restricted">Access Level: Restricted</option>
                  </select>

                  <div className="flex items-center gap-2 border p-2 rounded bg-slate-50 cursor-pointer" onClick={() => setNewUser({...newUser, isCuiAuthorized: !newUser.isCuiAuthorized})}>
                      {newUser.isCuiAuthorized ? <CheckCircle2 className="text-green-600" size={20}/> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
                      <span className="text-sm font-medium text-slate-700">Authorize for CUI</span>
                  </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button onClick={handleSaveUser} className="px-4 py-2 bg-coral-600 text-white rounded font-bold">Save Identity</button>
              </div>
          </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-silver-200 flex justify-between items-center bg-silver-50">
              <div className="relative w-72">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input 
                    className="w-full pl-9 pr-4 py-2 border border-silver-300 rounded-lg text-sm focus:ring-2 focus:ring-coral-500 outline-none"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
          </div>

          <table className="w-full text-left text-sm">
              <thead className="bg-white text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                      <th className="p-4">Identity</th>
                      <th className="p-4">Access & Roles</th>
                      <th className="p-4">CUI Authorization</th>
                      <th className="p-4">MFA Status</th>
                      <th className="p-4">Source</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50 group">
                          <td className="p-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                      {user.name.charAt(0)}
                                  </div>
                                  <div>
                                      <div className="font-medium text-slate-900">{user.name}</div>
                                      <div className="text-xs text-slate-500">{user.email}</div>
                                  </div>
                              </div>
                          </td>
                          <td className="p-4">
                              {editingUserId === user.id ? (
                                <div className="space-y-2">
                                  <select 
                                    className="w-full border p-1 rounded text-xs"
                                    value={editUser.accessLevel}
                                    onChange={e => setEditUser({...editUser, accessLevel: e.target.value as any})}
                                  >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Restricted">Restricted</option>
                                  </select>
                                  <input 
                                    className="w-full border p-1 rounded text-xs"
                                    placeholder="Roles (comma separated)"
                                    value={editUser.roles?.join(', ') || ''}
                                    onChange={e => setEditUser({...editUser, roles: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                                  />
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                                      user.accessLevel === 'High' || user.accessLevel === 'Restricted' 
                                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                        : 'bg-coral-50 text-coral-700 border-coral-200'
                                    }`}>
                                      {user.accessLevel || 'Low'} Access
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {user.roles?.map((role, i) => (
                                      <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1 py-0.5 rounded">
                                        {role}
                                      </span>
                                    ))}
                                    {(!user.roles || user.roles.length === 0) && (
                                      <span className="text-[9px] text-slate-400 italic">No roles assigned</span>
                                    )}
                                  </div>
                                </div>
                              )}
                          </td>
                          <td className="p-4">
                              <button 
                                onClick={() => onUpdateUser({ ...user, isCuiAuthorized: !user.isCuiAuthorized })}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                                    user.isCuiAuthorized 
                                    ? 'bg-red-50 text-red-700 border-red-200' 
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                              >
                                  {user.isCuiAuthorized ? <Lock size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-400"></div>}
                                  {user.isCuiAuthorized ? 'Authorized' : 'Standard'}
                              </button>
                          </td>
                          <td className="p-4">
                              {user.mfaEnabled ? (
                                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-bold flex items-center gap-1">
                                      <CheckCircle2 size={10} /> MFA Active
                                  </span>
                              ) : (
                                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-bold flex items-center gap-1">
                                      <AlertTriangle size={10} /> Insecure
                                  </span>
                              )}
                          </td>
                          <td className="p-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                    {(user.iamSource === 'EntraID' || user.iamSource === 'CSV_Import') && <Database size={12} className="text-coral-500" />}
                                    {user.iamSource || 'Manual'}
                                </span>
                                {user.lastSynced && <span className="text-[9px] text-slate-400">Synced {new Date(user.lastSynced).toLocaleDateString()}</span>}
                              </div>
                          </td>
                          <td className="p-4 text-right">
                              <div className="flex justify-end gap-1">
                                {editingUserId === user.id ? (
                                  <>
                                    <button onClick={handleSaveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                      <Save size={16} />
                                    </button>
                                    <button onClick={() => setEditingUserId(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                                      <X size={16} />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => handleStartEdit(user)} className="p-2 text-slate-400 hover:text-coral-600 hover:bg-coral-50 rounded-lg">
                                      <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => onDeleteUser(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                          </td>
                      </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">No identities found.</td></tr>
                  )}
              </tbody>
          </table>
      </div>
    </div>
  );
};