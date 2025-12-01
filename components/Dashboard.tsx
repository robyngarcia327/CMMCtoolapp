import React from 'react';
import { Requirement, Artifact, Framework } from '../types';
import { NIST_FAMILIES, NIST_CSF_FUNCTIONS } from '../data/standards';
import { PieChart, ShieldCheck, AlertTriangle, FileText, TrendingUp, Layers } from 'lucide-react';

interface DashboardProps {
  requirements: Requirement[];
  artifacts: Artifact[];
  activeFramework: Framework;
}

export const Dashboard: React.FC<DashboardProps> = ({ requirements, artifacts, activeFramework }) => {
  // --- Calculation Logic ---
  
  // Filter requirements by the ACTIVE framework so dashboard shows relevant stats
  const activeReqs = requirements.filter(r => r.framework === activeFramework.id);
  const totalReqs = activeReqs.length;
  
  const getReqStatus = (req: Requirement) => {
    const statuses = req.objectives.map(o => o.status);
    if (statuses.some(s => s === 'not_met')) return 'not_met';
    if (statuses.every(s => s === 'met' || s === 'na')) return 'met';
    return 'pending';
  };

  const reqStatuses = activeReqs.map(getReqStatus);
  const metReqs = reqStatuses.filter(s => s === 'met').length;
  const notMetReqs = reqStatuses.filter(s => s === 'not_met').length;
  const complianceScore = totalReqs > 0 ? Math.round((metReqs / totalReqs) * 100) : 0;

  // Calculate Family Stats
  let familyStats;
  
  if (activeFramework.id === 'NIST800-171') {
      // FIX: Added (family: any) to prevent TS7006 error
      familyStats = NIST_FAMILIES.map((family: any) => {
        const familyReqs = activeReqs.filter(r => r.family === family.id);
        const total = familyReqs.length;
        if (total === 0) return null;

        const met = familyReqs.filter(r => getReqStatus(r) === 'met').length;
        return {
          id: family.id,
          name: family.name,
          total,
          met,
          percent: Math.round((met / total) * 100)
        };
      }).filter(Boolean);
  } else {
      // Generic grouping for ISO, SOC2, etc.
      const uniqueFamilies = Array.from(new Set(activeReqs.map(r => r.family)));
      familyStats = uniqueFamilies.map(fam => {
          const familyReqs = activeReqs.filter(r => r.family === fam);
          const total = familyReqs.length;
          const met = familyReqs.filter(r => getReqStatus(r) === 'met').length;
          return {
              id: fam,
              name: fam,
              total,
              met,
              percent: Math.round((met / total) * 100)
          };
      });
  }

  // Calculate CSF Stats
  // FIX: Added (func: any) to prevent TS7006 error
  const csfStats = NIST_CSF_FUNCTIONS.map((func: any) => {
    const relevantReqs = activeReqs.filter(r => 
        r.mappings.nist_csf?.some(mapping => mapping.startsWith(func.id))
    );
    const total = relevantReqs.length;
    if (total === 0) return { ...func, total: 0, percent: 0, met: 0 };

    const met = relevantReqs.filter(r => getReqStatus(r) === 'met').length;
    return {
        ...func,
        total,
        met,
        percent: Math.round((met / total) * 100)
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Executive Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Executive Dashboard</h1>
                <p className="text-slate-600 flex items-center gap-2">
                    Current Standard: <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{activeFramework.name}</span>
                </p>
            </div>
            <div className="flex gap-3">
                 <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm">
                    <span className="text-slate-500">Last Audit:</span> <span className="font-semibold">Today</span>
                 </div>
            </div>
        </div>

        {/* Top Level KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute right-0 top-0 h-full w-1 bg-blue-500"></div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Compliance Score</h3>
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <TrendingUp size={20} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-slate-900">{complianceScore}%</p>
                </div>
                <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${complianceScore}%` }}></div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                 <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Controls Met</h3>
                    <div className="bg-green-50 p-2 rounded-lg text-green-600">
                        <ShieldCheck size={20} />
                    </div>
                </div>
                <p className="text-4xl font-bold text-slate-900">{metReqs} <span className="text-lg text-slate-400 font-normal">/ {totalReqs}</span></p>
                <p className="text-xs text-slate-400 mt-2">Satisfactory implementation</p>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                 <div className="absolute right-0 top-0 h-full w-1 bg-amber-500"></div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Gaps Identified</h3>
                    <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                        <AlertTriangle size={20} />
                    </div>
                </div>
                <p className="text-4xl font-bold text-slate-900">{notMetReqs}</p>
                <p className="text-xs text-slate-400 mt-2">Requires remediation plan</p>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                 <div className="absolute right-0 top-0 h-full w-1 bg-purple-500"></div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Artifacts</h3>
                    <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                        <FileText size={20} />
                    </div>
                </div>
                <p className="text-4xl font-bold text-slate-900">{artifacts.length}</p>
                <p className="text-xs text-slate-400 mt-2">Evidence collected</p>
            </div>
        </div>

        {/* Framework Overlay (NIST CSF) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Layers size={20} className="text-indigo-600"/> NIST CSF 2.0 Coverage
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {csfStats.map((stat: any) => (
                    <div key={stat.id} className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col items-center text-center">
                         <div className={`w-8 h-8 ${stat.color} rounded-full flex items-center justify-center text-white text-xs font-bold mb-3 shadow-sm`}>
                             {stat.id}
                         </div>
                         <div className="text-sm font-semibold text-slate-800 mb-1">{stat.name}</div>
                         <div className="text-xs text-slate-500 mb-3">{stat.met} / {stat.total}</div>
                         
                         <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                             <div className={`h-full ${stat.color} opacity-80`} style={{ width: `${stat.percent}%` }}></div>
                         </div>
                         <div className={`mt-2 text-xs font-bold ${stat.text}`}>{stat.percent}%</div>
                    </div>
                ))}
            </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <PieChart size={20} className="text-blue-600"/> Breakdown by Domain / Family
                </h3>
                <div className="space-y-5">
                    {familyStats?.map((stat: any) => (
                        <div key={stat.id}>
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 line-clamp-1 max-w-[80px]">{stat.id}</span>
                                    {stat.name}
                                </span>
                                <span className="text-xs font-bold text-slate-900">{stat.met}/{stat.total} ({stat.percent}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        stat.percent === 100 ? 'bg-green-500' : 
                                        stat.percent > 50 ? 'bg-blue-500' : 'bg-amber-500'
                                    }`} 
                                    style={{ width: `${stat.percent}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                    {familyStats?.length === 0 && (
                         <div className="text-center py-10 text-slate-400">Add requirements to see breakdown.</div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-6">Recent Evidence</h3>
                <div className="space-y-0 border-l-2 border-slate-100 ml-2">
                    {artifacts.slice(-6).reverse().map(art => (
                        <div key={art.id} className="relative pl-6 pb-6 last:pb-0">
                             <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                                 art.type === 'image' ? 'bg-blue-400' : 'bg-purple-400'
                             }`}></div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 mb-0.5">{new Date(art.timestamp).toLocaleDateString()}</span>
                                <span className="text-sm font-medium text-slate-800 line-clamp-1">{art.name}</span>
                                <span className="text-xs text-slate-500">Req {art.requirementId}</span>
                            </div>
                        </div>
                    ))}
                    {artifacts.length === 0 && <p className="text-sm text-slate-400 italic pl-4">No recent activity.</p>}
                </div>
            </div>
        </div>
    </div>
  );
};