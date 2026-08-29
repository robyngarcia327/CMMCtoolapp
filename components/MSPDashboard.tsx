
import React, { useState } from 'react';
import { Client, ClientData } from '../types';
import { Users, Calendar, CheckCircle2, TrendingUp, ArrowRight, ShieldAlert, Clock, FileWarning, Plus, X, Loader2 } from 'lucide-react';

interface MSPDashboardProps {
  clients: Client[];
  clientDataStore: Record<string, ClientData>;
  onSelectClient: (clientId: string) => void;
  onCreateClient: (input: { name: string; domain: string; industry: string; adminEmail?: string }) => Promise<void>;
}

export const MSPDashboard: React.FC<MSPDashboardProps> = ({ clients, clientDataStore, onSelectClient, onCreateClient }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ name: '', domain: '', industry: 'Defense Industrial Base', adminEmail: '' });

  const submitClient = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setIsCreating(true);
    try {
      await onCreateClient(form);
      setForm({ name: '', domain: '', industry: 'Defense Industrial Base', adminEmail: '' });
      setShowCreate(false);
    } catch (error: any) {
      setFormError(error?.message || 'Client creation failed.');
    } finally {
      setIsCreating(false);
    }
  };
  // Helper to calculate score for a specific client
  const getClientMetrics = (clientId: string) => {
    const data = clientDataStore[clientId];
    if (!data) return { score: 0, staleEvidence: 0 };

    // Compliance Score
    const reqs = data.requirements;
    const totalReqs = reqs.length || 1;
    const metCount = reqs.filter(r => r.objectives.every(o => o.status === 'met' || o.status === 'na')).length;
    const score = Math.round((metCount / totalReqs) * 100);

    // Stale Evidence (Older than 365 days)
    const staleEvidence = data.artifacts.filter(a => {
        const ageDays = (Date.now() - a.timestamp) / (1000 * 60 * 60 * 24);
        return ageDays > 365;
    }).length;

    return { score, staleEvidence };
  };

  const getStatus = (score: number) => {
      if (score >= 90) return { label: 'Compliant', color: 'bg-green-100 text-green-700' };
      if (score >= 70) return { label: 'At Risk', color: 'bg-amber-100 text-amber-700' };
      return { label: 'Non-Compliant', color: 'bg-red-100 text-red-700' };
  };

  const enhancedClients = clients.map(c => {
      const metrics = getClientMetrics(c.id);
      return {
          ...c,
          score: metrics.score,
          staleEvidence: metrics.staleEvidence,
          statusObj: getStatus(metrics.score),
          daysToAudit: Math.ceil((c.nextAuditDate - Date.now()) / (1000 * 60 * 60 * 24))
      };
  });

  const totalClients = clients.length;
  const atRiskClients = enhancedClients.filter(c => c.score < 90).length;
  const upcomingAudits = enhancedClients.filter(c => c.daysToAudit <= 30 && c.daysToAudit >= 0).length;
  const clientsWithStaleEvidence = enhancedClients.filter(c => c.staleEvidence > 0).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">MSP Command Center</h1>
          <p className="text-slate-600">Overview of client compliance posture and audit lifecycles.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
          <Plus size={17} /> Add managed client
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="create-client-title">
          <form onSubmit={submitClient} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div><h2 id="create-client-title" className="text-xl font-bold text-slate-900">Add managed client</h2><p className="text-sm text-slate-500">Create an isolated client workspace and optionally invite its administrator.</p></div>
              <button type="button" onClick={() => setShowCreate(false)} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Client name<input required minLength={2} maxLength={160} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
              <label className="block text-sm font-bold text-slate-700">Primary domain<input required placeholder="client.example" value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
              <label className="block text-sm font-bold text-slate-700">Industry<input required value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
              <label className="block text-sm font-bold text-slate-700">Client administrator email <span className="font-normal text-slate-400">(optional)</span><input type="email" value={form.adminEmail} onChange={e => setForm({ ...form, adminEmail: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
            </div>
            {formError && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{formError}</div>}
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700">Cancel</button><button disabled={isCreating} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{isCreating && <Loader2 size={16} className="animate-spin" />} Create client</button></div>
          </form>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                  <FileWarning size={24} />
              </div>
              <div>
                  <div className="text-sm font-bold text-slate-500 uppercase">Stale Evidence</div>
                  <div className="text-3xl font-bold text-slate-900">{clientsWithStaleEvidence}</div>
                  <div className="text-xs text-slate-400">Clients w/ expired docs</div>
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
                          <th className="p-4">Evidence Health</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Recertification Due</th>
                          <th className="p-4 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {enhancedClients.length === 0 && <tr><td colSpan={7} className="p-12 text-center text-slate-500">No managed clients yet. Add your first client to create its isolated CMMC workspace.</td></tr>}
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
                                  {client.staleEvidence > 0 ? (
                                      <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded w-fit">
                                          <Clock size={12} /> {client.staleEvidence} Expired
                                      </span>
                                  ) : (
                                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                                          <CheckCircle2 size={12} /> Healthy
                                      </span>
                                  )}
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
    </div>
  );
};
