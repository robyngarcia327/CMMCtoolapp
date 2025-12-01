import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Shield, Mail, Calendar, Fingerprint, Lock, RefreshCw, Cloud, Database, Search, Plus, Trash2, CheckCircle2, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'CUI' | 'REGULAR'>('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [newUser, setNewUser] = useState<Partial<User>>({
      role: 'CLIENT_USER',
      isCuiAuthorized: false,
      iamSource: 'Manual'
  });

  const handleSync = (source: 'M365' | 'Google') => {
      setIsSyncing(true);
      setTimeout(() => {
          setIsSyncing(false);
          alert(`Successfully synced 12 users from ${source}. (Mock)`);
          // In a real app, this would merge new users into the list
      }, 1500);
  };

  const handleSaveUser = () => {
      if (!newUser.name || !newUser.email) return;
      
      const user: User = {
          id: `u-${Date.now()}`,
          organizationId: 'current-client', // In a real app this comes from context
          name: newUser.name,
          email: newUser.email,
          role: (newUser.role as UserRole) || 'CLIENT_USER',
          department: newUser.department || 'General',
          lastLogin: Date.now(),
          mfaEnabled: false,
          hasPasskey: false,
          isCuiAuthorized: newUser.isCuiAuthorized || false,
          iamSource: 'Manual'
      };
      
      onAddUser(user);
      setIsAdding(false);
      setNewUser({ role: 'CLIENT_USER', isCuiAuthorized: false, iamSource: 'Manual' });
  };

  const toggleCuiStatus = (user: User) => {
      onUpdateUser({ ...user, isCuiAuthorized: !user.isCuiAuthorized });
  };

  const filteredUsers = users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (filterType === 'CUI') return u.isCuiAuthorized;
      if (filterType === 'REGULAR') return !u.isCuiAuthorized;
      return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="text-blue-600" /> Identity & Access Management
            </h2>
            <p className="text-slate-600">Manage user identities, CUI authorization, and IAM synchronization.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => handleSync('M365')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm text-sm font-medium"
            >
                {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Cloud size={16} />}
                Sync M365
            </button>
            <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium"
            >
                <Plus size={16} /> Add User
            </button>
        </div>
      </div>

      {isAdding && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6 animate-in fade-in slide-in-from-top-2">
              <h3 className="font-bold text-slate-800 mb-4">Add Manual User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <input className="border p-2 rounded" placeholder="Full Name" value={newUser.name || ''} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                  <input className="border p-2 rounded" placeholder="Email" value={newUser.email || ''} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                  <input className="border p-2 rounded" placeholder="Department" value={newUser.department || ''} onChange={e => setNewUser({...newUser, department: e.target.value})} />
                  
                  <div className="flex items-center gap-2 border p-2 rounded bg-slate-50 cursor-pointer" onClick={() => setNewUser({...newUser, isCuiAuthorized: !newUser.isCuiAuthorized})}>
                      {newUser.isCuiAuthorized ? <CheckCircle2 className="text-green-600" size={20}/> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
                      <span className="text-sm font-medium text-slate-700">Authorize for CUI Access</span>
                  </div>
              </div>
              <div className="flex justify-end gap-2">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button onClick={handleSaveUser} className="px-4 py-2 bg-blue-600 text-white rounded font-medium">Save Identity</button>
              </div>
          </div>
      )}

      {/* Stats / Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <button onClick={() => setFilterType('ALL')} className={`p-4 rounded-xl border text-left transition-all ${filterType === 'ALL' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
              <div className="text-sm font-bold text-slate-500 uppercase">Total Users</div>
              <div className="text-2xl font-bold text-slate-900">{users.length}</div>
          </button>
          <button onClick={() => setFilterType('CUI')} className={`p-4 rounded-xl border text-left transition-all ${filterType === 'CUI' ? 'bg-red-50 border-red-200 ring-1 ring-red-300' : 'bg-white border-slate-200 hover:border-red-300'}`}>
              <div className="text-sm font-bold text-red-600 uppercase flex items-center gap-2"><Lock size={14}/> CUI Authorized</div>
              <div className="text-2xl font-bold text-slate-900">{users.filter(u => u.isCuiAuthorized).length}</div>
          </button>
          <button onClick={() => setFilterType('REGULAR')} className={`p-4 rounded-xl border text-left transition-all ${filterType === 'REGULAR' ? 'bg-green-50 border-green-200 ring-1 ring-green-300' : 'bg-white border-slate-200 hover:border-green-300'}`}>
              <div className="text-sm font-bold text-green-600 uppercase">Standard Users</div>
              <div className="text-2xl font-bold text-slate-900">{users.filter(u => !u.isCuiAuthorized).length}</div>
          </button>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-center">
              <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-500 font-medium">MFA Adoption</span>
                  <span className="font-bold text-slate-700">{Math.round((users.filter(u => u.mfaEnabled).length / users.length) * 100) || 0}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${(users.filter(u => u.mfaEnabled).length / users.length) * 100}%` }}></div>
              </div>
          </div>
      </div>

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
                      <th className="p-4">Department</th>
                      <th className="p-4">Authorization</th>
                      <th className="p-4">Security</th>
                      <th className="p-4">Source</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50 group transition-colors">
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
                          <td className="p-4 text-slate-600">{user.department}</td>
                          <td className="p-4">
                              <button 
                                onClick={() => toggleCuiStatus(user)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                                    user.isCuiAuthorized 
                                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                  {user.isCuiAuthorized ? <Lock size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-400"></div>}
                                  {user.isCuiAuthorized ? 'CUI Access' : 'Standard'}
                              </button>
                          </td>
                          <td className="p-4">
                              <div className="flex gap-2">
                                  {user.mfaEnabled ? (
                                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-bold flex items-center gap-1">
                                          <CheckCircle2 size={10} /> MFA
                                      </span>
                                  ) : (
                                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-bold flex items-center gap-1">
                                          <AlertTriangle size={10} /> No MFA
                                      </span>
                                  )}
                                  {user.hasPasskey && (
                                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold flex items-center gap-1">
                                          <Fingerprint size={10} /> Passkey
                                      </span>
                                  )}
                              </div>
                          </td>
                          <td className="p-4">
                              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                  {user.iamSource || 'Manual'}
                              </span>
                          </td>
                          <td className="p-4 text-right">
                              <button 
                                onClick={() => onDeleteUser(user.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                              >
                                  <Trash2 size={16} />
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
};