
import React from 'react';
import { Requirement } from '../types';
import { ClipboardList, AlertTriangle, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';

interface PoamRegistryProps {
  requirements: Requirement[];
}

export const PoamRegistry: React.FC<PoamRegistryProps> = ({ requirements }) => {
  const poamItems = requirements.filter(r => r.poam);

  return (
    <div className="h-full bg-slate-50 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Plan of Action & Milestones (POA&M)</h1>
            <p className="text-slate-500 font-medium mt-1">Tracking remediation for identified security weaknesses.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-black text-slate-900">{poamItems.length}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Open Items</div>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="text-center">
              <div className="text-lg font-black text-green-600">{poamItems.filter(p => p.poam?.status === 'Completed').length}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved</div>
            </div>
          </div>
        </div>

        {poamItems.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-200 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <ClipboardList size={48} className="text-slate-200" />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No POA&M Items Found</h2>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">
              Your POA&M is currently empty. Items are added here when gaps are identified during package audits or manual assessments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {poamItems.map(req => (
              <div key={req.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{req.poam?.weaknessName}</h3>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Linked to Control {req.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      req.poam?.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {req.poam?.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} /> Scheduled Completion
                    </h4>
                    <p className="text-sm font-bold text-slate-700">{req.poam?.scheduledCompletionDate}</p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} /> Milestones & Remediation Plan
                    </h4>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{req.poam?.milestones}</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50 flex justify-end">
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:text-blue-700 transition-all">
                    View Control Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
