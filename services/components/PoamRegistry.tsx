
import React, { useState } from 'react';
import { Requirement, PoamItem, ClientData } from '../types';
import { ClipboardList, AlertTriangle, CheckCircle2, Clock, Calendar, ArrowRight, Plus, X, Save } from 'lucide-react';

interface PoamRegistryProps {
  requirements: Requirement[];
  poamItems: PoamItem[];
  onUpdate: (updates: Partial<ClientData>) => void;
}

export const PoamRegistry: React.FC<PoamRegistryProps> = ({ requirements, poamItems, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPoam, setNewPoam] = useState<Partial<PoamItem>>({
    weaknessName: '',
    scheduledCompletionDate: '',
    milestones: '',
    status: 'Open'
  });

  const linkedPoams: PoamItem[] = requirements
    .filter(r => r.poam)
    .map(r => ({
      ...r.poam!,
      id: `linked-${r.id}`,
      linkedRequirementId: r.id,
      dateIdentified: Date.now() // Placeholder for linked items
    }));

  const allPoams = [...linkedPoams, ...poamItems].sort((a, b) => b.dateIdentified - a.dateIdentified);

  const handleCreatePoam = (e: React.FormEvent) => {
    e.preventDefault();
    const item: PoamItem = {
      id: `manual-${Date.now()}`,
      weaknessName: newPoam.weaknessName || '',
      scheduledCompletionDate: newPoam.scheduledCompletionDate || '',
      milestones: newPoam.milestones || '',
      status: newPoam.status || 'Open',
      dateIdentified: Date.now()
    };

    onUpdate({
      poamItems: [...poamItems, item]
    });
    setIsModalOpen(false);
    setNewPoam({ weaknessName: '', scheduledCompletionDate: '', milestones: '', status: 'Open' });
  };

  return (
    <div className="h-full bg-slate-50 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Plan of Action & Milestones (POA&M)</h1>
            <p className="text-slate-500 font-medium mt-1">Tracking remediation for identified security weaknesses.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 mr-4">
              <div className="text-center">
                <div className="text-lg font-black text-slate-900">{allPoams.length}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Items</div>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-center">
                <div className="text-lg font-black text-green-600">{allPoams.filter(p => p.status === 'Completed').length}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved</div>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-200"
            >
              <Plus size={16} /> New POA&M Item
            </button>
          </div>
        </div>

        {allPoams.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-200 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <ClipboardList size={48} className="text-slate-200" />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No POA&M Items Found</h2>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
              Your POA&M is currently empty. Items are added here when gaps are identified during assessments or you can add them manually.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
            >
              <Plus size={14} /> Create your first entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {allPoams.map(item => (
              <div key={item.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${item.linkedRequirementId ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{item.weaknessName}</h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.linkedRequirementId ? `Linked to Control ${item.linkedRequirementId}` : 'Manual Entry'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} /> Scheduled Completion
                    </h4>
                    <p className="text-sm font-bold text-slate-700">{item.scheduledCompletionDate || 'Not Set'}</p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} /> Milestones & Remediation Plan
                    </h4>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.milestones}</p>
                  </div>
                </div>

                {item.linkedRequirementId && (
                  <div className="mt-8 pt-8 border-t border-slate-50 flex justify-end">
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:text-blue-700 transition-all">
                      View Control Details <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New POA&M Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border-t-[12px] border-slate-900">
            <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
              <h3 className="font-black uppercase tracking-[0.2em] text-lg flex items-center gap-3">
                <ClipboardList size={24} className="text-blue-400" /> New POA&M Entry
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors"><X size={28} /></button>
            </div>
            <form onSubmit={handleCreatePoam} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Weakness Name / Description</label>
                <textarea 
                  required
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 h-24 resize-none" 
                  placeholder="Describe the identified compliance gap..."
                  value={newPoam.weaknessName}
                  onChange={e => setNewPoam({...newPoam, weaknessName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Scheduled Completion</label>
                  <input 
                    type="date"
                    required
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900" 
                    value={newPoam.scheduledCompletionDate}
                    onChange={e => setNewPoam({...newPoam, scheduledCompletionDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Status</label>
                  <select 
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900" 
                    value={newPoam.status}
                    onChange={e => setNewPoam({...newPoam, status: e.target.value as any})}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Risk Accepted">Risk Accepted</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Milestones & Remediation Plan</label>
                <textarea 
                  required
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 h-32 resize-none" 
                  placeholder="Outline the steps required to remediate this weakness..."
                  value={newPoam.milestones}
                  onChange={e => setNewPoam({...newPoam, milestones: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" className="flex-[2] py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-2">
                  <Save size={16} /> Save POA&M Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
