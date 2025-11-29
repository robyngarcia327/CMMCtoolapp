
import React from 'react';
import { Client, ClientData } from '../types';
import { Users, AlertTriangle, Calendar, CheckCircle2, TrendingUp, ArrowRight, ShieldAlert, MoreHorizontal } from 'lucide-react';

interface MSPDashboardProps {
  clients: Client[];
  clientDataStore: Record<string, ClientData>;
  onSelectClient: (clientId: string) => void;
}

export const MSPDashboard: React.FC<MSPDashboardProps> = ({ clients, clientDataStore, onSelectClient }) => {
  // Helper to calculate score for a specific client
  const getClientScore = (clientId: string) => {
    const data = clientDataStore[clientId];
    if (!data) return 0;

    // Filter by the client's primary framework if possible, otherwise use all loaded requirements
    // For simplicity in this aggregate view, we take the average met status of ALL current requirements in their profile
    const reqs = data.requirements;
    if (reqs.length === 0) return 0;

    const metCount = reqs.filter(r => r.objectives.every(o => o.status === 'met' || o.status === 'na')).length;
    return Math.round((metCount / reqs.length) * 100);
  };

  const getStatus = (score: number) => {
      if (score >= 90) return { label: 'Compliant', color: 'bg-green-100 text-green-700' };
      if (score >= 70) return { label: 'At Risk', color: 'bg-amber-100 text-amber-700' };
      return { label: 'Non-Compliant', color: 'bg-red-100 text-red-700' };
  };

  const enhancedClients = clients.map(c => {
      const score = getClientScore(c.id);
      return {
          ...c,
          score,
          statusObj: getStatus(score),
          daysToAudit: Math.ceil((c.nextAuditDate - Date.now()) / (1000 * 60 * 60 * 24))
      };
  });

  const totalClients = clients.length;
  const atRiskClients = enhancedClients.filter(c => c.score < 90).length;
  const upcomingAudits = enhancedClients.filter(c => c.daysToAudit <= 30 && c.daysToAudit >= 0).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">MSP Command Center</h1>
        <p className="text-slate-600">Overview of client compliance posture and audit lifecycles.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Users size={24} />
              </div>
              <div>
                  <div className="text-sm font-bold text-slate-500 uppercase">Total Clients</div>
                  <div className="text-3xl font-bold text-slate-900">{totalClients}</div>
              </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <ShieldAlert size={24} />
              </div>
              <div>
                  <div className="text-sm font-bold text-slate-500 uppercase">Clients At Risk</div>
                  <div className="text-3xl font-bold text-slate-900">{atRiskClients}</div>
                  <div className="text-xs text-slate-400">Score below 90%</div>
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                  <Calendar size={24} />
              </div>
              <div>
                  <div className="text-sm font-bold text-slate-500 uppercase">Audits (30 Days)</div>
                  <div className="text-3xl font-bold text-slate-900">{upcomingAudits}</div>
              </div>
          </div>
      </div>

      {/* Main Client Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="text-slate-500" /> Compliance Portfolio
              </h3>
              <button className="text-sm text-blue-600 font-medium hover:underline">Download Report</button>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                          <th className="p-4">Client Name</th>
                          <th className="p-4">Framework</th>
                          <th className="p-4">Compliance Score</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Recertification Due</th>
                          <th className="p-4 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {enhancedClients.sort((a,b) => a.daysToAudit - b.daysToAudit).map(client => (
                          <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                              <td className="p-4">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200">
                                          {client.logoInitial}
                                      </div>
                                      <div>
                                          <div className="font-bold text-slate-900">{client.name}</div>
                                          <div className="text-xs text-slate-500">{client.industry}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="p-4">
                                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-mono font-medium">
                                      {client.primaryFramework}
                                  </span>
                              </td>
                              <td className="p-4 w-1/4">
                                  <div className="flex items-center gap-3">
                                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full ${
                                                client.score >= 90 ? 'bg-green-500' : client.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                                            }`} 
                                            style={{ width: `${client.score}%` }}
                                          ></div>
                                      </div>
                                      <span className="font-bold text-slate-700 w-8">{client.score}%</span>
                                  </div>
                              </td>
                              <td className="p-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${client.statusObj.color}`}>
                                      {client.statusObj.label}
                                  </span>
                              </td>
                              <td className="p-4">
                                  <div className="flex items-center gap-2">
                                      <span className={`font-medium ${client.daysToAudit <= 30 ? 'text-red-600' : 'text-slate-600'}`}>
                                          {new Date(client.nextAuditDate).toLocaleDateString()}
                                      </span>
                                      {client.daysToAudit <= 30 && (
                                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                                              {client.daysToAudit} days
                                          </span>
                                      )}
                                  </div>
                              </td>
                              <td className="p-4 text-right">
                                  <button 
                                    onClick={() => onSelectClient(client.id)}
                                    className="bg-white border border-slate-300 text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto"
                                  >
                                      Manage <ArrowRight size={12} />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

      {/* Upcoming Timeline Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="text-indigo-600" /> Audit Lifecycle Timeline (Next 6 Months)
          </h3>
          <div className="relative pt-6 pb-2">
               <div className="absolute top-8 left-0 w-full h-1 bg-slate-100 rounded-full"></div>
               <div className="flex justify-between relative">
                   {[0,1,2,3,4,5].map(offset => {
                       const date = new Date();
                       date.setMonth(date.getMonth() + offset);
                       const monthLabel = date.toLocaleString('default', { month: 'short' });
                       
                       // Check for audits in this month
                       const auditsInMonth = enhancedClients.filter(c => {
                           const d = new Date(c.nextAuditDate);
                           return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
                       });

                       return (
                           <div key={offset} className="flex flex-col items-center relative group">
                               <div className="w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm z-10 mb-2"></div>
                               <span className="text-xs font-bold text-slate-500 uppercase">{monthLabel}</span>
                               
                               {/* Audit Markers */}
                               {auditsInMonth.length > 0 && (
                                   <div className="absolute top-[-40px] flex flex-col items-center animate-in slide-in-from-bottom-2">
                                       <div className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap mb-1">
                                           {auditsInMonth.length} Audit{auditsInMonth.length > 1 ? 's' : ''}
                                       </div>
                                       <div className="w-0.5 h-4 bg-indigo-600"></div>
                                   </div>
                               )}
                           </div>
                       );
                   })}
               </div>
          </div>
      </div>
    </div>
  );
};
