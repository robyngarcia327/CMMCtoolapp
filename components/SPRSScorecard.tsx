import React, { useMemo } from 'react';
import { Requirement } from '../types';
import { Shield, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Info, ShieldAlert, ShieldCheck, Download, FileSpreadsheet } from 'lucide-react';

interface SPRSScorecardProps {
  requirements: Requirement[];
  activeFrameworkId: string;
  targetLevel: 1 | 2 | 3;
}

export const SPRSScorecard: React.FC<SPRSScorecardProps> = ({ requirements, activeFrameworkId, targetLevel }) => {
  // NIST 800-171 / CMMC 2.0 uses SPRS methodology
  const isApplicable = activeFrameworkId === 'NIST-CMMC';
  
  // Filter requirements by both framework and the user's selected target level scope
  const activeReqs = useMemo(() => 
    requirements.filter(r => r.framework === 'NIST-CMMC' && r.cmmcLevel <= targetLevel),
    [requirements, targetLevel]
  );

  const getReqStatus = (req: Requirement) => {
    if (!req.objectives || req.objectives.length === 0) return 'pending';
    const statuses = req.objectives.map(o => o.status);
    if (statuses.some(s => s === 'not_met')) return 'not_met';
    if (statuses.every(s => s === 'met' || s === 'na')) return 'met';
    return 'pending';
  };

  // --- SPRS Calculation Logic ---
  const scoredData = useMemo(() => {
    const scored = activeReqs.map(req => {
      const status = getReqStatus(req);
      const isMet = status === 'met';
      // In SPRS, if it's not met, we deduct the weight. 
      // Default to 1 if weight is missing.
      const weight = req.sprsWeight || 1;
      return {
          ...req,
          computedStatus: status,
          deduction: isMet ? 0 : weight
      };
    });

    const totalDeductions = scored.reduce((sum, r) => sum + r.deduction, 0);
    // Base score for Level 2 is usually 110. Level 1 is 17.
    const baseScore = targetLevel === 1 ? 17 : 110; 
    const currentScore = baseScore - totalDeductions;
    const readinessPercentage = Math.round((scored.filter(r => r.computedStatus === 'met').length / (activeReqs.length || 1)) * 100);

    return { scored, totalDeductions, currentScore, baseScore, readinessPercentage };
  }, [activeReqs, targetLevel]);

  const handleExportSPRS = () => {
    const headers = ["Requirement ID", "Title", "Status", "SPRS Value", "Deduction", "Implementation Date"];
    
    const rows = scoredData.scored.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.computedStatus.toUpperCase(),
      r.sprsWeight || 1,
      r.deduction,
      new Date().toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + "SPRS Assessment Export\n"
      + `Target CMMC Level,${targetLevel}\n`
      + `Final SPRS Score,${scoredData.currentScore}\n\n`
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SPRS_Scorecard_Export_L${targetLevel}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getScoreColor = (score: number) => {
      if (score >= (scoredData.baseScore * 0.9)) return 'text-green-600';
      if (score >= (scoredData.baseScore * 0.7)) return 'text-amber-500';
      return 'text-red-600';
  };

  const notMetList = scoredData.scored
    .filter(r => r.deduction > 0)
    .sort((a, b) => b.deduction - a.deduction);

  if (!isApplicable) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center mt-20 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Shield size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">SPRS Scorecard Not Applicable</h2>
        <p className="text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
          The Supplier Performance Risk System (SPRS) scoring methodology is specific to NIST 800-171 and CMMC environments.
        </p>
        <div className="mt-8 p-4 bg-blue-50 text-blue-700 text-xs font-bold rounded-2xl border border-blue-100 inline-block">
            Framework Alignment Required: NIST-CMMC / 800-171
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 h-full overflow-y-auto pb-20 bg-slate-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <ShieldCheck size={14}/> DoD Assessment Methodology
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">SPRS Posture Scorecard</h1>
            <p className="text-slate-500 font-medium mt-1">Self-Assessment score for CMMC Level {targetLevel} compliance. (NIST SP 800-171A)</p>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={handleExportSPRS}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all"
             >
                <FileSpreadsheet size={16} className="text-blue-400" /> Export for PIEE / SPRS
             </button>
             <div className="px-6 py-2 bg-slate-100 rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                Scope: {activeReqs.length} Practices
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Official Assessment Score</h3>
              
              <div className={`w-56 h-56 rounded-full border-[12px] flex flex-col items-center justify-center mb-8 relative transition-colors duration-500 ${
                  scoredData.currentScore >= (scoredData.baseScore * 0.8) ? 'border-green-100' : 'border-red-100'
              }`}>
                   <div className={`text-7xl font-black tracking-tighter ${getScoreColor(scoredData.currentScore)}`}>
                       {scoredData.currentScore}
                   </div>
                   <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Scale: -203 to {scoredData.baseScore}</div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Readiness</div>
                      <div className="text-xl font-black text-slate-900">{scoredData.readinessPercentage}%</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deductions</div>
                      <div className="text-xl font-black text-red-600">-{scoredData.totalDeductions}</div>
                  </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 w-full">
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      <span>Risk Tiering</span>
                      <span className={scoredData.currentScore > 70 ? 'text-green-600' : 'text-red-600'}>
                        {scoredData.currentScore > 90 ? 'Low Risk' : scoredData.currentScore > 50 ? 'Medium Risk' : 'High Risk'}
                      </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-red-500" style={{ width: '33.33%' }} />
                      <div className="h-full bg-amber-500" style={{ width: '33.33%' }} />
                      <div className="h-full bg-green-500" style={{ width: '33.33%' }} />
                  </div>
              </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 text-sm">
                      <ShieldAlert size={18} className="text-red-600"/> High-Impact Remediation Priorities
                  </h3>
                  <div className="flex gap-2">
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-black uppercase">5pt Gaps: {notMetList.filter(r => r.deduction === 5).length}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase">3pt Gaps: {notMetList.filter(r => r.deduction === 3).length}</span>
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[500px] p-6 space-y-3">
                  {notMetList.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                          <div className="p-6 bg-green-50 rounded-full mb-4">
                              <CheckCircle2 size={48} className="text-green-500" />
                          </div>
                          <p className="font-black uppercase tracking-widest text-slate-500">Perfect Score Achieved</p>
                          <p className="text-xs text-slate-400 mt-1">All practices in Level {targetLevel} scope are fully implemented.</p>
                      </div>
                  ) : (
                      notMetList.map(req => (
                          <div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-red-200 transition-all group bg-white shadow-sm">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm shrink-0 ${
                                  req.deduction === 5 ? 'bg-red-600 text-white' : 
                                  req.deduction === 3 ? 'bg-amber-500 text-white' : 
                                  'bg-slate-900 text-white'
                              }`}>
                                  -{req.deduction}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                      <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest">{req.id}</span>
                                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{req.family}</span>
                                  </div>
                                  <div className="font-bold text-slate-900 text-sm truncate uppercase tracking-tight">{req.title}</div>
                              </div>
                              <div className="text-right shrink-0">
                                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                      req.computedStatus === 'not_met' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-400'
                                  }`}>
                                      {req.computedStatus.replace('_', ' ')}
                                  </span>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>
        
      <div className="bg-indigo-900 rounded-3xl p-8 text-white flex flex-col md:flex-row gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md h-fit">
              <TrendingUp className="text-blue-400" size={32} />
          </div>
          <div className="space-y-4">
              <h4 className="text-xl font-black uppercase tracking-tight">PIEE / SPRS Reporting Guide</h4>
              <p className="text-blue-200 text-sm leading-relaxed max-w-4xl font-medium">
                  To report your score in PIEE, use the "Export for PIEE / SPRS" button above to get a CSV of your assessment values. 
                  When entering your score into the SPRS website, you must provide your <span className="text-white font-bold">final score</span>, 
                  the <span className="text-white font-bold">CMMC Level</span> assessed, and the date the assessment was completed.
                  Your score should be supported by a <span className="text-white font-bold">System Security Plan (SSP)</span> and an active 
                  <span className="text-white font-bold"> POA&M</span> for any deductions.
              </p>
          </div>
      </div>
    </div>
  );
};