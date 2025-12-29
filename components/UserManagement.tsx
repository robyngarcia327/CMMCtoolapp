
import React, { useState } from 'react';
import { User, UserRole, IntegrationConfig } from '../types';
import { 
  User as UserIcon, Shield, Mail, Lock, RefreshCw, 
  Cloud, Database, Search, Plus, Trash2, 
  CheckCircle2, AlertTriangle, Fingerprint, Info
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
  
  const [newUser, setNewUser] = useState<Partial<User>>({
      role: 'CLIENT_USER',
      isCuiAuthorized: false
  });

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
                      hasPasskey: false
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
          role: (newUser.role as UserRole) || 'CLIENT_USER',
          department: newUser.department || 'General',
          lastLogin: Date.now(),
          mfaEnabled: false,
          hasPasskey: false,
          isCuiAuthorized: newUser.isCuiAuthorized || false,
          iamSource: 'Manual',
          lastSynced: Date.now()
      };
      
      onAddUser(user);
      setIsAdding(false);
      setNewUser({ role: 'CLIENT_USER', isCuiAuthorized: false });
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
                <UserIcon className="text-blue-600" /> Identity Management
            </h2>
            <p className="text-slate-600 text-sm">Control user access and CUI authorization levels.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleEntraSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 shadow-sm text-sm font-bold transition-all disabled:opacity-50"
            >
                {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Cloud size={16} />}
                {isSyncing ? 'Syncing Identities...' : 'Sync with Entra ID'}
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
                  <div className="flex items-center gap-2 border p-2 rounded bg-slate-50 cursor-pointer" onClick={() => setNewUser({...newUser, isCuiAuthorized: !newUser.isCuiAuthorized})}>
                      {newUser.isCuiAuthorized ? <CheckCircle2 className="text-green-600" size={20}/> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
                      <span className="text-sm font-medium text-slate-700">Authorize for CUI</span>
                  </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button onClick={handleSaveUser} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Save Identity</button>
              </div>
          </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="relative w-72">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input 
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                                    {user.iamSource === 'EntraID' && <Cloud size={12} className="text-blue-500" />}
                                    {user.iamSource || 'Manual'}
                                </span>
                                {user.lastSynced && <span className="text-[9px] text-slate-400">Synced {new Date(user.lastSynced).toLocaleDateString()}</span>}
                              </div>
                          </td>
                          <td className="p-4 text-right">
                              <button onClick={() => onDeleteUser(user.id)} className="p-2 text-slate-400 hover:text-red-600">
                                  <Trash2 size={16} />
                              </button>
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
