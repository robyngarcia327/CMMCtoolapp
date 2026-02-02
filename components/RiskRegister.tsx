import React, { useState, useRef } from 'react';
import { Risk } from '../types';
import { AlertTriangle, Plus, Trash2, Save, Download, Filter, Search, ChevronDown, CheckCircle2, ShieldAlert, FileSpreadsheet, Upload, Zap, Activity, Info, BarChart3 } from 'lucide-react';
import { integrationService } from '../services/integrations';

interface RiskRegisterProps {
  risks: Risk[];
  onAddRisk: (risk: Risk) => void;
  onUpdateRisk: (risk: Risk) => void;
  onDeleteRisk: (id: string) => void;
}

const LIKELIHOOD_OPTIONS = [
  "Select ...",
  "1 - Remote",
  "2 - Unlikely",
  "3 - Possible",
  "4 - Probable",
  "5 - Almost Certain"
];

const IMPACT_OPTIONS = [
  "Select ...",
  "1 - Low",
  "2 - Medium",
  "3 - High",
  "4 - Very High",
  "5 - Extreme"
];

const RISK_RATING_OPTIONS = [
  "Select ...",
  "1 - Low",
  "2 - Medium",
  "3 - High",
  "4 - Critical"
];

const BUSINESS_DECISION_OPTIONS = [
  "Select ...",
  "1 - Address",
  "2 - Transfer",
  "3 - Avoid",
  "4 - Accept"
];

export const RiskRegister: React.FC<RiskRegisterProps> = ({ risks, onAddRisk, onUpdateRisk, onDeleteRisk }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    riskTier: 'Operational',
    riskCategory: 'Process',
    domainGrouping: '',
    riskNumber: '',
    riskTitle: '',
    riskOwner: 'CIO',
    deficiencyDescription: '',
    probableScenarios: 'N/A',
    likelihood: 'Select ...',
    impact: 'Select ...',
    inherentRiskRating: 'Select ...',
    businessDecision: 'Select ...',
    targetResidualRiskRating: 'Select ...',
    comments: '',
    status: 'Open'
  });

  const handleCreateRisk = () => {
    if (!newRisk.riskTitle) {
      alert("Risk title is required.");
      return;
    }

    const risk: Risk = {
      id: `R-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      riskTier: newRisk.riskTier || 'Operational',
      riskCategory: newRisk.riskCategory || 'Process',
      domainGrouping: newRisk.domainGrouping || '',
      riskNumber: newRisk.riskNumber || '',
      riskTitle: newRisk.riskTitle,
      riskOwner: newRisk.riskOwner || 'CIO',
      deficiencyDescription: newRisk.deficiencyDescription || '',
      probableScenarios: newRisk.probableScenarios || 'N/A',
      likelihood: newRisk.likelihood || 'Select ...',
      impact: newRisk.impact || 'Select ...',
      inherentRiskRating: newRisk.inherentRiskRating || 'Select ...',
      businessDecision: newRisk.businessDecision || 'Select ...',
      targetResidualRiskRating: newRisk.targetResidualRiskRating || 'Select ...',
      comments: newRisk.comments || '',
      status: 'Open',
      dateIdentified: Date.now()
    };

    onAddRisk(risk);
    setIsAdding(false);
    setNewRisk({
      riskTier: 'Operational',
      riskCategory: 'Process',
      likelihood: 'Select ...',
      impact: 'Select ...',
      inherentRiskRating: 'Select ...',
      businessDecision: 'Select ...',
      targetResidualRiskRating: 'Select ...',
      probableScenarios: 'N/A'
    });
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Risk Tier",
      "Risk Category",
      "Domain Grouping",
      "Risk Number",
      "Risk Title",
      "Risk Owner",
      "Description of Deficiency",
      "Probable Scenarios",
      "Likelihood",
      "Impact",
      "Inherent Risk Rating",
      "Business Decision",
      "Target Residual Risk Rating",
      "Comments"
    ];
    
    const sample = [
      "Operational",
      "Process",
      "Identity Management",
      "R-ID-01",
      "Unsupported MFA on Legacy SSO",
      "CISO",
      "Legacy platform does not support hardware tokens or push notifications.",
      "Threat agent compromises password-only account via phishing.",
      "4 - Probable",
      "5 - Extreme",
      "4 - Critical",
      "1 - Address",
      "1 - Low",
      "Legacy upgrade scheduled for FY25 Q3."
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + sample.map(s => `"${s}"`).join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "RMF_Risk_Register_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsedRisks = integrationService.parseRiskCsv(text);
      
      let addedCount = 0;
      parsedRisks.forEach(pr => {
        if (!pr.riskTitle) return;
        
        onAddRisk({
          ...pr as Risk,
          id: `R-BULK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          dateIdentified: Date.now(),
          status: 'Open'
        });
        addedCount++;
      });
      
      alert(`Bulk Import Complete: Successfully added ${addedCount} entries to the register.`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredRisks = risks.filter(r => 
    r.riskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.riskNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.domainGrouping.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header Bar */}
      <div className="p-8 border-b border-slate-200 shrink-0 bg-white flex flex-col lg:flex-row justify-between items-center gap-6 shadow-sm z-20">
        <div>
           <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
               <ShieldAlert size={14}/> NIST SP 800-30 Revision 1
           </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
            Organizational Risk Register
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Holistic identification and management of operational and compliance risks.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-48 md:w-64 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              placeholder="Filter by Domain or Title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />

          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={14} className="text-blue-600" /> Template
          </button>

          <label className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Upload size={14} className="text-green-600" /> Bulk Import
            <input type="file" className="hidden" accept=".csv" ref={fileInputRef} onChange={handleBulkUpload} />
          </label>

          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all"
          >
            {isAdding ? 'Cancel' : <><Plus size={16} /> New Entry</>}
          </button>
        </div>
      </div>

      {/* Spreadsheet View Container */}
      <div className="flex-1 overflow-auto bg-slate-100 p-6">
        <div className="inline-block min-w-full align-middle">
          <div className="bg-white border-2 border-slate-200 shadow-2xl rounded-sm overflow-hidden">
            <table className="min-w-full text-xs text-left border-collapse table-fixed">
              {/* Professional GRC Header Structure */}
              <thead className="text-[9px] font-black uppercase text-white sticky top-0 z-30">
                <tr className="h-12">
                  <th className="p-3 border-r border-slate-700 bg-slate-900 w-12 text-center" rowSpan={2}>#</th>
                  <th className="p-3 border-r border-slate-700 bg-slate-900 w-32" rowSpan={2}>Risk Tier (L1-3)</th>
                  <th className="p-3 border-r border-slate-700 bg-slate-900 w-40" rowSpan={2}>Risk Context</th>
                  <th className="p-3 border-r border-slate-700 bg-slate-900 w-48" rowSpan={2}>Domain Grouping</th>
                  <th className="p-3 border-r border-slate-700 bg-slate-900 w-32" rowSpan={2}>Risk ID</th>
                  <th className="p-3 border-r border-slate-700 bg-slate-900 w-56" rowSpan={2}>Risk Statement</th>
                  <th className="p-3 border-r border-slate-700 bg-slate-900 w-24 text-center" rowSpan={2}>Owner</th>
                  <th className="p-3 border-r border-slate-700 bg-slate-900 w-80" rowSpan={2}>Vulnerability / Deficiency Description</th>
                  <th className="p-3 border-r border-slate-700 bg-slate-900 w-64" rowSpan={2}>Probable Scenarios</th>
                  
                  {/* NIST 800-30 Group (Red) */}
                  <th className="p-3 border-r border-red-900 bg-red-700 text-center" colSpan={3}>NIST Risk Assessment</th>
                  
                  {/* Governance Group (Deep Blue) */}
                  <th className="p-3 border-r border-indigo-950 bg-indigo-900 text-center w-40">Governance Decision</th>
                  
                  {/* Residual Group (Gold) */}
                  <th className="p-3 bg-amber-600 text-center w-40" colSpan={1}>Target State</th>
                  
                  <th className="p-3 bg-slate-900 w-48" rowSpan={2}>Remediation Notes</th>
                  <th className="p-3 bg-slate-900 w-12" rowSpan={2}></th>
                </tr>
                <tr className="h-10">
                  <th className="p-3 border-r border-red-900 bg-red-700 w-32 text-center">Likelihood</th>
                  <th className="p-3 border-r border-red-900 bg-red-700 w-32 text-center">Impact (CIA)</th>
                  <th className="p-3 border-r border-red-900 bg-red-700 w-32 text-center">Inherent Risk</th>
                  <th className="p-3 border-r border-indigo-950 bg-indigo-900 w-40 text-center">Treatment</th>
                  <th className="p-3 bg-amber-600 w-40 text-center">Residual Risk</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {/* Entry Row */}
                {isAdding && (
                  <tr className="bg-blue-50/80 animate-in fade-in slide-in-from-top-2 duration-300">
                    <td className="p-2 border-r text-center font-black text-blue-600">NEW</td>
                    <td className="p-2 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-bold" value={newRisk.riskTier} onChange={e => setNewRisk({...newRisk, riskTier: e.target.value})}>
                        <option>Operational</option>
                        <option>Strategic</option>
                        <option>Compliance</option>
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded-lg p-1.5" placeholder="Process/Tool" value={newRisk.riskCategory} onChange={e => setNewRisk({...newRisk, riskCategory: e.target.value})} />
                    </td>
                    <td className="p-2 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-bold" placeholder="e.g. Identity" value={newRisk.domainGrouping} onChange={e => setNewRisk({...newRisk, domainGrouping: e.target.value})} />
                    </td>
                    <td className="p-2 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-mono" placeholder="R-001" value={newRisk.riskNumber} onChange={e => setNewRisk({...newRisk, riskNumber: e.target.value})} />
                    </td>
                    <td className="p-2 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-black uppercase" placeholder="Risk Title" value={newRisk.riskTitle} onChange={e => setNewRisk({...newRisk, riskTitle: e.target.value})} />
                    </td>
                    <td className="p-2 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-center font-bold" value={newRisk.riskOwner} onChange={e => setNewRisk({...newRisk, riskOwner: e.target.value})} />
                    </td>
                    <td className="p-2 border-r">
                      <textarea className="w-full bg-white border border-slate-300 rounded-lg p-1.5 h-16 text-[10px] font-medium" placeholder="Analyze the gap..." value={newRisk.deficiencyDescription} onChange={e => setNewRisk({...newRisk, deficiencyDescription: e.target.value})} />
                    </td>
                    <td className="p-2 border-r">
                      <textarea className="w-full bg-white border border-slate-300 rounded-lg p-1.5 h-16 text-[10px] font-medium" value={newRisk.probableScenarios} onChange={e => setNewRisk({...newRisk, probableScenarios: e.target.value})} />
                    </td>
                    <td className="p-2 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded-lg p-1.5" value={newRisk.likelihood} onChange={e => setNewRisk({...newRisk, likelihood: e.target.value})}>
                        {LIKELIHOOD_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded-lg p-1.5" value={newRisk.impact} onChange={e => setNewRisk({...newRisk, impact: e.target.value})}>
                        {IMPACT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded-lg p-1.5" value={newRisk.inherentRiskRating} onChange={e => setNewRisk({...newRisk, inherentRiskRating: e.target.value})}>
                        {RISK_RATING_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded-lg p-1.5" value={newRisk.businessDecision} onChange={e => setNewRisk({...newRisk, businessDecision: e.target.value})}>
                        {BUSINESS_DECISION_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded-lg p-1.5" value={newRisk.targetResidualRiskRating} onChange={e => setNewRisk({...newRisk, targetResidualRiskRating: e.target.value})}>
                        {RISK_RATING_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded-lg p-1.5" value={newRisk.comments} onChange={e => setNewRisk({...newRisk, comments: e.target.value})} />
                    </td>
                    <td className="p-2 text-center">
                      <button onClick={handleCreateRisk} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 shadow-lg"><Save size={20}/></button>
                    </td>
                  </tr>
                )}

                {/* Registry Data Rows */}
                {filteredRisks.length === 0 && !isAdding ? (
                  <tr><td colSpan={16} className="p-24 text-center text-slate-300 font-black uppercase tracking-[0.5em] bg-slate-50 italic">
                      <div className="flex flex-col items-center gap-4">
                          <BarChart3 size={64} className="opacity-10" />
                          Registry Offline - No Risks Mapped
                      </div>
                  </td></tr>
                ) : filteredRisks.map((risk, idx) => (
                  <tr key={risk.id} className="hover:bg-slate-50/80 border-b group transition-colors">
                    <td className="p-4 border-r text-center font-black text-slate-400 bg-slate-50/50">{idx + 1}</td>
                    <td className="p-4 border-r font-bold text-slate-700">{risk.riskTier}</td>
                    <td className="p-4 border-r text-slate-500 font-medium">{risk.riskCategory}</td>
                    <td className="p-4 border-r bg-slate-100/30 text-slate-900 font-black uppercase tracking-tight">{risk.domainGrouping}</td>
                    <td className="p-4 border-r font-mono font-black text-blue-600">{risk.riskNumber}</td>
                    <td className="p-4 border-r font-black text-slate-800 leading-tight uppercase">{risk.riskTitle}</td>
                    <td className="p-4 border-r text-center font-black text-slate-600">{risk.riskOwner}</td>
                    <td className="p-4 border-r text-slate-600 text-[10px] leading-relaxed font-medium">{risk.deficiencyDescription}</td>
                    <td className="p-4 border-r text-slate-500 text-[10px] leading-relaxed italic">{risk.probableScenarios}</td>
                    
                    {/* Assessments (NIST 800-30 Themed) */}
                    <td className={`p-4 border-r text-center font-bold ${risk.likelihood.includes('4') || risk.likelihood.includes('5') ? 'text-red-700 bg-red-50/50' : 'text-slate-700'}`}>{risk.likelihood}</td>
                    <td className={`p-4 border-r text-center font-bold ${risk.impact.includes('4') || risk.impact.includes('5') ? 'text-red-700 bg-red-50/50' : 'text-slate-700'}`}>{risk.impact}</td>
                    <td className={`p-4 border-r text-center font-black uppercase tracking-widest ${risk.inherentRiskRating.includes('High') || risk.inherentRiskRating.includes('Critical') ? 'bg-red-600 text-white shadow-inner' : 'bg-slate-100 text-slate-700'}`}>{risk.inherentRiskRating}</td>
                    
                    <td className="p-4 border-r text-center font-bold bg-indigo-50 text-indigo-900 uppercase tracking-tight">{risk.businessDecision}</td>
                    <td className={`p-4 border-r text-center font-black uppercase tracking-widest ${risk.targetResidualRiskRating.includes('Low') ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{risk.targetResidualRiskRating}</td>
                    
                    <td className="p-4 border-r text-slate-500 text-[10px] font-medium leading-relaxed">{risk.comments}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => onDeleteRisk(risk.id)} className="text-slate-300 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Registry Summary Dashboard (Footer) */}
      <div className="bg-slate-950 p-4 text-white flex flex-col md:flex-row justify-between items-center shrink-0 border-t border-slate-800 gap-4">
          <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600 shadow-lg shadow-red-900/50"></div> Critical: {risks.filter(r => r.inherentRiskRating.includes('Critical')).length}</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-900/50"></div> High Impact: {risks.filter(r => r.impact.includes('High')).length}</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Total Scenario Coverage: {risks.length}</div>
          </div>
          <div className="flex items-center gap-4">
              <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2 mr-4">
                  <ShieldAlert size={12} className="text-amber-500" /> Compliant with NIST SP 800-30 Taxonomy
              </div>
              <button className="text-[10px] font-black uppercase text-white bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 border border-white/5">
                  <Download size={14}/> Risk Profile XLS
              </button>
          </div>
      </div>
    </div>
  );
};
