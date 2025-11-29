


import React from 'react';
import { User } from '../types';
import { User as UserIcon, Shield, Mail, Calendar, Fingerprint, Lock } from 'lucide-react';

interface UserManagementProps {
  users: User[];
}

export const UserManagement: React.FC<UserManagementProps> = ({ users }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">User Directory</h2>
        <p className="text-slate-600">Manage compliance team members and key personnel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
              <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center relative overflow-hidden">
                  
                  {/* Security Badge */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                      {user.mfaEnabled && (
                          <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-200">
                              <Lock size={10} /> MFA ON
                          </div>
                      )}
                      {user.hasPasskey && (
                          <div className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-200">
                              <Fingerprint size={10} /> PASSKEY
                          </div>
                      )}
                      {!user.mfaEnabled && !user.hasPasskey && (
                           <div className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-200">
                              INSECURE
                          </div>
                      )}
                  </div>

                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 mt-2">
                      <UserIcon size={32} className="text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{user.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                      <Mail size={14} /> {user.email}
                  </div>
                  
                  <div className="w-full border-t border-slate-100 pt-4 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-1 rounded">
                          <Shield size={14} className="text-blue-500"/>
                          {user.role}
                      </div>
                      <div className="text-slate-400 text-xs flex items-center gap-1">
                          <Calendar size={12} />
                          Active: {new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                  </div>
              </div>
          ))}
          
          {/* Add User Placeholder */}
          <button className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all group">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100">
                  <UserIcon size={24} />
              </div>
              <span className="font-medium">Add New User</span>
          </button>
      </div>
    </div>
  );
};
