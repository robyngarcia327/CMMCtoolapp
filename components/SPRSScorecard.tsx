
import React from 'react';
import { Requirement } from '../types';
import { Shield, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Info } from 'lucide-react';

interface SPRSScorecardProps {
  requirements: Requirement[];
  activeFrameworkId: string;
}

export const SPRSScorecard: React.FC<SPRSScorecardProps> = ({ requirements, activeFrameworkId }) => {
  // NIST 800-171 / CMMC 2.0 uses SPRS
  const isApplicable = activeFrameworkId === 'NIST-CMMC';
  const relevantReqs = requirements.filter(r => r.framework === 'NIST-CMMC');

  if (!isApplicable) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center mt-20">
        <Shield size={64} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700">SPRS Scorecard Not Applicable</h2>
        <p className="text-slate-500 mt-2">
          The Supplier Performance Risk System (SPRS) scoring methodology is specific to NIST 800-171 (DFARS 252.204-7012/7019/7020).
          <br />
          Please switch the active framework to <strong>NIST 800-171 / CMMC 2.0</strong> to view your DoD assessment score.
        </p>
      </div>
    );
  }

  // --- SPRS Calculation Logic ---
  const MAX_SCORE = 110;
  
  const getReqStatus = (req: Requirement) => {
    const statuses = req.objectives.map(o => o.status);
    if (statuses.some(s => s === 'not_met')) return 'not_met';
    if (statuses.some(s => s === 'pending')) return 'pending'; 
    if (statuses.every(s => s === 'met' || s === 'na')) return 'met';
    return 'pending';
  };

  const scoredReqs = relevantReqs.map(req => {
      const status = getReqStatus(req);
      const isMet = status === 'met';
      const weight = req.sprsWeight || 1;
      return {
          ...req,
          computedStatus: status,
          deduction: isMet ? 0 : weight
      };
  });

  const totalDeductions = scoredReqs.reduce((sum, r) => sum + r.deduction, 0);
  const currentScore = MAX_SCORE - totalDeductions;

  const getScoreColor = (score: number) => {
      if (score === 110) return 'text-green-600';
      if (score >= 90) return 'text-blue-600';
      if (score >= 70) return 'text-amber-500';
      return 'text-red-600';
  };

  const notMetList = scoredReqs.filter(r => r.deduction > 0).sort((a,b) => b.deduction - a.deduction);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> SPRS Scorecard
        </h1>
        <p className="text-slate-600">
            DoD Assessment Methodology (NIST SP 800-171A). This score must be uploaded to PIEE for DFARS compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Current Assessment Score</h3>
              
              <div className={`w-48 h-48 rounded-full border-8 flex items-center justify-center mb-6 relative ${
                  currentScore >= 90 ? 'border-green-100' : currentScore >= 50 ? 'border-amber-100' : 'border-red-100'
              }`}>
                   <div className={`text-6xl font-black ${getScoreColor(currentScore)}`}>
                       {currentScore}
                   </div>
                   <div className="absolute bottom-10 text-xs text-slate-400 font-medium">OUT OF 110</div>
              </div>

              <div className="w-full bg-slate-50 rounded-lg p-3 text-sm text-slate-600 border border-slate-100">
                  <div className="flex justify-between mb-1">
                      <span>Max Possible</span>
                      <span className="font-bold">110</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                      <span>Deductions</span>
                      <span className="font-bold">-{totalDeductions}</span>
                  </div>
              </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <AlertTriangle size={18} className="text-amber-600"/> Score Impact Analysis
                  </h3>
                  <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">
                      {notMetList.length} Items Reducing Score
                  </span>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[400px]">
                  {notMetList.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                          <CheckCircle2 size={48} className="text-green-500 mb-4 opacity-50" />
                          <p className="font-medium text-slate-600">Perfect Score!</p>
                          <p className="text-sm">All tracked requirements are implemented.</p>
                      </div>
                  ) : (
                      <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10">
                              <tr>
                                  <th className="p-3">Req ID</th>
                                  <th className="p-3">Title</th>
                                  <th className="p-3">Status</th>
                                  <th className="p-3 text-right">Impact</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {notMetList.map(req => (
                                  <tr key={req.id} className="hover:bg-slate-50 group">
                                      <td className="p-3 font-mono text-xs font-bold text-slate-600">{req.id}</td>
                                      <td className="p-3">
                                          <div className="font-medium text-slate-800">{req.title}</div>
                                          <div className="text-xs text-slate-500 truncate max-w-[200px]">{req.family}</div>
                                      </td>
                                      <td className="p-3">
                                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                              req.computedStatus === 'not_met' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                          }`}>
                                              {req.computedStatus === 'not_met' ? <XCircle size={10} /> : <Info size={10} />}
                                              {req.computedStatus.replace('_', ' ')}
                                          </span>
                                      </td>
                                      <td className="p-3 text-right">
                                          <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded text-xs border border-red-100">
                                              -{req.deduction} pts
                                          </span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  )}
              </div>
          </div>
      </div>
        
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex gap-4">
          <Info className="text-indigo-600 shrink-0 mt-1" size={24} />
          <div>
              <h4 className="font-bold text-indigo-900 text-sm mb-1">How is this calculated?</h4>
              <p className="text-sm text-indigo-800 leading-relaxed">
                  The NIST SP 800-171 DoD Assessment Methodology assigns a weight of <strong>1, 3, or 5 points</strong> to each requirement.
                  The score starts at <strong>110</strong>. Points are deducted for every requirement that is not "Met". 
                  <br/>
                  <span className="italic opacity-80 mt-1 block">
                    *Evidence collection status determines if a requirement is Met. If any objective is 'Pending' or 'Not Met', the full point deduction applies.
                  </span>
              </p>
          </div>
      </div>
    </div>
  );
};
