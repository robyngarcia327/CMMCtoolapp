import React, { useState } from 'react';
import { Requirement, Artifact, Client, Risk } from '../types';
import { ShieldCheck, FileText, Download, CheckCircle2, AlertOctagon, Search, Lock, ExternalLink, Briefcase } from 'lucide-react';

interface AuditorPortalProps {
  client: Client;
  requirements: Requirement[];
  artifacts: Artifact[];
  risks: Risk[];
}

export const AuditorPortal: React.FC<AuditorPortalProps> = ({ client, requirements, artifacts, risks }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // --- Metrics ---
  const totalReqs = requirements.length;
  const metReqs = requirements.filter(r => r.objectives.every(o => o.status === 'met' || o.status === 'na')).length;
  const implementationScore = totalReqs > 0 ? Math.round((metReqs / totalReqs) * 100) : 0;
  
  const evidenceCount = artifacts.length;
  const openPoamItems = requirements.filter(r => r.objectives.some(o => o.status === 'not_met')).length;
  // const openRisks = risks.filter(r => r.status === 'Open').length; // Unused but available if needed

  // --- Filtering ---
  const filteredReqs = requirements.filter(r => 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPackage = () => {
      alert("Generating C3PAO Audit Package (SSP + Evidence Matrix + Artifacts)... \n\n(This would download a ZIP file in production)");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-600 p-2 rounded-lg"><ShieldCheck size={24} /></div>
                  <h1 className="text-3xl font-bold">Auditor Review Portal</h1>
              </div>
              <p className="text-slate-400 max-w-xl">
                  Welcome to the {client.name} assessment environment. 
                  This portal aggregates all controls, evidence, and system plans for C3PAO review.
              </p>
          </div>
          <div className="relative z-10 flex flex-col items-end gap-3">
              <div className="text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment Target</div>
                  <div className="font-bold text-xl">{client.primaryFramework}</div>
              </div>
              <button 
                onClick={handleExportPackage}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-900/50"
              >
                  <Download size={18} /> Download Audit Package
              </button>
          </div>
          {/* Background decoration */}
          <Briefcase className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
      </div>

      {/* Readiness Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Implementation</h3>
              <div className="text-4xl font-bold text-slate-900 mb-1">{implementationScore}%</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${implementationScore}%` }}></div>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Evidence Artifacts</h3>
              <div className="text-4xl font-bold text-slate-900 mb-1">{evidenceCount}</div>
              <div className="text-xs text-slate-400">Files & Links</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Open POA&M Items</h3>
              <div className="text-4xl font-bold text-slate-900 mb-1">{openPoamItems}</div>
              <div className="text-xs text-slate-400">Controls Not Met</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">System Status</h3>
              <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                  <CheckCircle2 size={20} /> Operational
              </div>
              <div className="text-xs text-slate-400">Last scanned today</div>
          </div>
      </div>

      {/* Core Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="bg-white p-3 rounded-lg text-indigo-600 shadow-sm"><FileText size={24} /></div>
              <div>
                  <h3 className="font-bold text-indigo-900">System Security Plan (SSP)</h3>
                  <p className="text-xs text-indigo-700 mt-1 mb-3">Master document describing the system boundary and controls.</p>
                  <span className="text-xs font-bold bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-200">v2.4 - Approved</span>
              </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="bg-white p-3 rounded-lg text-amber-600 shadow-sm"><AlertOctagon size={24} /></div>
              <div>
                  <h3 className="font-bold text-amber-900">POA&M</h3>
                  <p className="text-xs text-amber-700 mt-1 mb-3">Plan of Action & Milestones for open deficiencies.</p>
                  <span className="text-xs font-bold bg-white text-amber-600 px-2 py-1 rounded border border-amber-200">{openPoamItems} Items Open</span>
              </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="bg-white p-3 rounded-lg text-slate-600 shadow-sm"><ShieldCheck size={24} /></div>
              <div>
                  <h3 className="font-bold text-slate-900">Incident Response Plan</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-3">Procedures for detecting and responding to attacks.</p>
                  <span className="text-xs font-bold bg-white text-slate-600 px-2 py-1 rounded border border-slate-200">Tested Q3 2024</span>
              </div>
          </div>
      </div>

      {/* Control & Evidence Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Control Implementation Matrix</h3>
              <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input 
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Search controls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                  <thead className="bg-white text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                          <th className="p-4 w-24">ID</th>
                          <th className="p-4 w-1/3">Control Title</th>
                          <th className="p-4 w-32">Status</th>
                          <th className="p-4">Evidence Artifacts</th>
                          <th className="p-4 text-right">Implementation</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredReqs.map(req => {
                          const reqArtifacts = artifacts.filter(a => a.requirementId === req.id);
                          const isMet = req.objectives.every(o => o.status === 'met' || o.status === 'na');
                          
                          return (
                              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="p-4 font-mono font-bold text-slate-700 align-top">{req.id}</td>
                                  <td className="p-4 align-top">
                                      <div className="font-medium text-slate-900">{req.title}</div>
                                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">{req.description}</div>
                                  </td>
                                  <td className="p-4 align-top">
                                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                          isMet ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                      }`}>
                                          {isMet ? <CheckCircle2 size={12} /> : <AlertOctagon size={12} />}
                                          {isMet ? 'Implemented' : 'Not Met'}
                                      </span>
                                  </td>
                                  <td className="p-4 align-top">
                                      {reqArtifacts.length > 0 ? (
                                          <div className="space-y-1">
                                              {reqArtifacts.map(art => (
                                                  <div key={art.id} className="flex items-center gap-2 text-xs text-blue-600 hover:underline cursor-pointer">
                                                      <FileText size={12} />
                                                      {art.name}
                                                      {art.containsCui && <Lock size={10} className="text-red-500" title="CUI Encrypted"/>}
                                                  </div>
                                              ))}
                                          </div>
                                      ) : (
                                          <span className="text-slate-400 italic text-xs">No artifacts linked</span>
                                      )}
                                  </td>
                                  <td className="p-4 text-right align-top">
                                      <button className="text-slate-400 hover:text-blue-600">
                                          <ExternalLink size={16} />
                                      </button>
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      </div>

    </div>
  );
};