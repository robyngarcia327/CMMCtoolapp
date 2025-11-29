


import React, { useState } from 'react';
import { Client } from '../types';
import { ChevronDown, Plus, Building2, Check, X, Shield } from 'lucide-react';

interface ClientSwitcherProps {
  clients: Client[];
  activeClient: Client;
  onSelectClient: (clientId: string) => void;
  onAddClient: (client: Client) => void;
}

export const ClientSwitcher: React.FC<ClientSwitcherProps> = ({
  clients,
  activeClient,
  onSelectClient,
  onAddClient,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientIndustry, setNewClientIndustry] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;

    const newClient: Client = {
        id: `client-${Date.now()}`,
        name: newClientName,
        industry: newClientIndustry || 'General',
        contactName: 'Admin',
        logoInitial: newClientName.charAt(0).toUpperCase(),
        primaryFramework: 'NIST800-171',
        nextAuditDate: Date.now() + 1000 * 60 * 60 * 24 * 365, // +1 year
        accountManager: 'Unassigned',
        isParent: false
    };
    
    onAddClient(newClient);
    setNewClientName('');
    setNewClientIndustry('');
    setIsAdding(false);
    setIsOpen(false);
  };

  return (
    <div className="relative border-b border-slate-800">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800 transition-colors group"
      >
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-blue-900/50 transition-all ${activeClient.isParent ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 'bg-gradient-to-br from-blue-600 to-indigo-600'}`}>
                {activeClient.logoInitial}
            </div>
            <div className="text-left">
                <div className="text-sm font-bold text-white truncate max-w-[120px]">{activeClient.name}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                    {activeClient.isParent && <Shield size={10} className="text-purple-400"/>}
                    {activeClient.industry}
                </div>
            </div>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
            <div 
                className="fixed inset-0 z-10" 
                onClick={() => { setIsOpen(false); setIsAdding(false); }}
            ></div>
            <div className="absolute left-2 right-2 top-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                {!isAdding ? (
                    <>
                        <div className="max-h-64 overflow-y-auto py-1">
                            {clients.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => { onSelectClient(client.id); setIsOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-slate-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${client.isParent ? 'bg-purple-900 text-purple-200' : 'bg-slate-700 text-slate-300'}`}>
                                            {client.logoInitial}
                                        </div>
                                        <span className={`text-sm ${activeClient.id === client.id ? 'text-white font-bold' : 'text-slate-300'}`}>
                                            {client.name}
                                        </span>
                                    </div>
                                    {activeClient.id === client.id && <Check size={14} className="text-blue-400" />}
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-slate-700 p-2">
                            <button 
                                onClick={() => setIsAdding(true)}
                                className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded transition-colors"
                            >
                                <Plus size={14} /> Add New Client
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleAdd} className="p-4 bg-slate-800">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase">New Client</h4>
                            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white">
                                <X size={14} />
                            </button>
                        </div>
                        <div className="space-y-2 mb-3">
                            <input 
                                autoFocus
                                placeholder="Company Name"
                                value={newClientName}
                                onChange={e => setNewClientName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                             <input 
                                placeholder="Industry (Optional)"
                                value={newClientIndustry}
                                onChange={e => setNewClientIndustry(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={!newClientName}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded transition-colors disabled:opacity-50"
                        >
                            Create Tenant
                        </button>
                    </form>
                )}
            </div>
        </>
      )}
    </div>
  );
};
