import React, { useState, useRef } from 'react';
import { Risk } from '../types';
import { AlertTriangle, Plus, Trash2, Save, Download, Filter, Search, ChevronDown, CheckCircle2, ShieldAlert, FileSpreadsheet, Upload } from 'lucide-react';
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
      "Access Control",
      "R-AC-01",
      "Weak Password Policy",
      "CIO",
      "Password complexity not enforced for legacy systems.",
      "Brute force attack succeeds on non-MFA enabled systems.",
      "3 - Possible",
      "4 - Very High",
      "3 - High",
      "1 - Address",
      "1 - Low",
      "Legacy upgrade scheduled for Q3."
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + sample.map(s => `"${s}"`).join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Risk_Register_Template.csv");
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
      <div className="p-6 border-b border-slate-200 shrink-0 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm z-20">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
            <AlertTriangle className="text-amber-500" size={24} /> 
            Organizational Risk Register
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Compliance & Operational Safeguard Portfolio</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="relative mr-2">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm w-48 md:w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Filter register..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={14} className="text-blue-600" /> Template
          </button>

          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Upload size={14} className="text-green-600" /> Bulk Import
            <input type="file" className="hidden" accept=".csv" ref={fileInputRef} onChange={handleBulkUpload} />
          </label>

          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all"
          >
            {isAdding ? 'Cancel' : <><Plus size={16} /> New Entry</>}
          </button>
        </div>
      </div>

      {/* Spreadsheet View Container */}
      <div className="flex-1 overflow-auto bg-slate-100 p-4">
        <div className="inline-block min-w-full align-middle">
          <div className="bg-white border-2 border-slate-300 shadow-2xl rounded-sm overflow-hidden">
            <table className="min-w-full text-xs text-left border-collapse table-fixed">
              {/* Spreadsheet Header Structure */}
              <thead className="text-[10px] font-black uppercase text-white sticky top-0 z-30">
                <tr className="h-10">
                  <th className="p-2 border-r border-slate-700 bg-slate-900 w-12 text-center" rowSpan={2}>#</th>
                  <th className="p-2 border-r border-slate-700 bg-slate-900 w-32" rowSpan={2}>Risk Tier</th>
                  <th className="p-2 border-r border-slate-700 bg-slate-900 w-40" rowSpan={2}>Risk Context / Category</th>
                  <th className="p-2 border-r border-slate-700 bg-slate-900 w-48" rowSpan={2}>Domain Grouping</th>
                  <th className="p-2 border-r border-slate-700 bg-slate-900 w-32" rowSpan={2}>Risk #</th>
                  <th className="p-2 border-r border-slate-700 bg-slate-900 w-48" rowSpan={2}>Risk</th>
                  <th className="p-2 border-r border-slate-700 bg-slate-900 w-24 text-center" rowSpan={2}>Risk Owner</th>
                  <th className="p-2 border-r border-slate-700 bg-slate-900 w-72" rowSpan={2}>Description of Possible Risk Due To Control Deficiency</th>
                  <th className="p-2 border-r border-slate-700 bg-slate-900 w-64" rowSpan={2}>Probable Scenarios</th>
                  
                  {/* Assessment Group (Red) */}
                  <th className="p-2 border-r border-red-900 bg-red-700 text-center" colSpan={3}>Assessment</th>
                  
                  {/* Decision Group (Deep Blue) */}
                  <th className="p-2 border-r border-indigo-950 bg-indigo-900 text-center w-40">Governance</th>
                  
                  {/* Residual Group (Gold) */}
                  <th className="p-2 bg-amber-600 text-center w-40">Target</th>
                  
                  <th className="p-2 bg-slate-900 w-48" rowSpan={2}>Comments</th>
                  <th className="p-2 bg-slate-900 w-12" rowSpan={2}></th>
                </tr>
                <tr className="h-10">
                  <th className="p-2 border-r border-red-900 bg-red-700 w-32">Likelihood</th>
                  <th className="p-2 border-r border-red-900 bg-red-700 w-32">Impact</th>
                  <th className="p-2 border-r border-red-900 bg-red-700 w-32">Inherent Risk Rating</th>
                  <th className="p-2 border-r border-indigo-950 bg-indigo-900 w-40">Business Decision on IR</th>
                  <th className="p-2 bg-amber-600 w-40">Residual Risk Rating</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {/* Entry Row */}
                {isAdding && (
                  <tr className="bg-blue-50 animate-in fade-in slide-in-from-top-1">
                    <td className="p-1.5 border-r text-center font-bold text-blue-600">New</td>
                    <td className="p-1.5 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded p-1" value={newRisk.riskTier} onChange={e => setNewRisk({...newRisk, riskTier: e.target.value})}>
                        <option>Operational</option>
                        <option>Strategic</option>
                        <option>Compliance</option>
                      </select>
                    </td>
                    <td className="p-1.5 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded p-1" placeholder="Category" value={newRisk.riskCategory} onChange={e => setNewRisk({...newRisk, riskCategory: e.target.value})} />
                    </td>
                    <td className="p-1.5 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded p-1" placeholder="e.g. Identity" value={newRisk.domainGrouping} onChange={e => setNewRisk({...newRisk, domainGrouping: e.target.value})} />
                    </td>
                    <td className="p-1.5 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded p-1" placeholder="e.g. R-IRO-04" value={newRisk.riskNumber} onChange={e => setNewRisk({...newRisk, riskNumber: e.target.value})} />
                    </td>
                    <td className="p-1.5 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded p-1 font-bold" placeholder="Risk Title" value={newRisk.riskTitle} onChange={e => setNewRisk({...newRisk, riskTitle: e.target.value})} />
                    </td>
                    <td className="p-1.5 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded p-1 text-center" value={newRisk.riskOwner} onChange={e => setNewRisk({...newRisk, riskOwner: e.target.value})} />
                    </td>
                    <td className="p-1.5 border-r">
                      <textarea className="w-full bg-white border border-slate-300 rounded p-1 h-12 text-[10px]" placeholder="Detailed description..." value={newRisk.deficiencyDescription} onChange={e => setNewRisk({...newRisk, deficiencyDescription: e.target.value})} />
                    </td>
                    <td className="p-1.5 border-r">
                      <textarea className="w-full bg-white border border-slate-300 rounded p-1 h-12 text-[10px]" value={newRisk.probableScenarios} onChange={e => setNewRisk({...newRisk, probableScenarios: e.target.value})} />
                    </td>
                    <td className="p-1.5 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded p-1" value={newRisk.likelihood} onChange={e => setNewRisk({...newRisk, likelihood: e.target.value})}>
                        {LIKELIHOOD_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-1.5 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded p-1" value={newRisk.impact} onChange={e => setNewRisk({...newRisk, impact: e.target.value})}>
                        {IMPACT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-1.5 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded p-1" value={newRisk.inherentRiskRating} onChange={e => setNewRisk({...newRisk, inherentRiskRating: e.target.value})}>
                        {RISK_RATING_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-1.5 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded p-1" value={newRisk.businessDecision} onChange={e => setNewRisk({...newRisk, businessDecision: e.target.value})}>
                        {BUSINESS_DECISION_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-1.5 border-r">
                      <select className="w-full bg-white border border-slate-300 rounded p-1" value={newRisk.targetResidualRiskRating} onChange={e => setNewRisk({...newRisk, targetResidualRiskRating: e.target.value})}>
                        {RISK_RATING_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-1.5 border-r">
                      <input className="w-full bg-white border border-slate-300 rounded p-1" value={newRisk.comments} onChange={e => setNewRisk({...newRisk, comments: e.target.value})} />
                    </td>
                    <td className="p-1.5 text-center">
                      <button onClick={handleCreateRisk} className="text-green-600 hover:text-green-800"><Save size={20}/></button>
                    </td>
                  </tr>
                )}

                {/* Data Rows */}
                {filteredRisks.length === 0 && !isAdding ? (
                  <tr><td colSpan={16} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest bg-slate-50 italic">Registry Empty - Add first risk to begin assessment</td></tr>
                ) : filteredRisks.map((risk, idx) => (
                  <tr key={risk.id} className="hover:bg-slate-50 border-b group transition-colors">
                    <td className="p-3 border-r text-center font-bold text-slate-500 bg-slate-50/50">{idx + 1}</td>
                    <td className="p-3 border-r font-medium text-slate-700">{risk.riskTier}</td>
                    <td className="p-3 border-r text-slate-600">{risk.riskCategory}</td>
                    <td className="p-3 border-r bg-slate-100/30 text-slate-900 font-bold">{risk.domainGrouping}</td>
                    <td className="p-3 border-r font-mono font-bold text-blue-700">{risk.riskNumber}</td>
                    <td className="p-3 border-r font-bold text-slate-800 leading-tight">{risk.riskTitle}</td>
                    <td className="p-3 border-r text-center font-black text-slate-600">{risk.riskOwner}</td>
                    <td className="p-3 border-r text-slate-500 text-[10px] leading-relaxed italic">{risk.deficiencyDescription}</td>
                    <td className="p-3 border-r text-slate-500 text-[10px] leading-relaxed">{risk.probableScenarios}</td>
                    
                    {/* Assessments (Red Tint) */}
                    <td className={`p-3 border-r text-center font-bold ${risk.likelihood.includes('4') || risk.likelihood.includes('5') ? 'text-red-700 bg-red-50/50' : 'text-slate-700'}`}>{risk.likelihood}</td>
                    <td className={`p-3 border-r text-center font-bold ${risk.impact.includes('4') || risk.impact.includes('5') ? 'text-red-700 bg-red-50/50' : 'text-slate-700'}`}>{risk.impact}</td>
                    <td className={`p-3 border-r text-center font-black ${risk.inherentRiskRating.includes('High') || risk.inherentRiskRating.includes('Critical') ? 'bg-red-600 text-white' : 'bg-red-50 text-red-900'}`}>{risk.inherentRiskRating}</td>
                    
                    <td className="p-3 border-r text-center font-bold bg-indigo-50 text-indigo-900">{risk.businessDecision}</td>
                    <td className={`p-3 border-r text-center font-black ${risk.targetResidualRiskRating.includes('Low') ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{risk.targetResidualRiskRating}</td>
                    
                    <td className="p-3 border-r text-slate-500 text-[10px]">{risk.comments}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => onDeleteRisk(risk.id)} className="text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Spreadsheet Status Footer */}
      <div className="bg-slate-900 p-3 text-white flex justify-between items-center shrink-0">
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-80">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Critical: {risks.filter(r => r.inherentRiskRating.includes('Critical')).length}</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> High Impact: {risks.filter(r => r.impact.includes('High')).length}</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Total Mapped: {risks.length}</div>
          </div>
          <div className="flex gap-4">
              <button className="text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  <Download size={12}/> Export XLS
              </button>
          </div>
      </div>
    </div>
  );
};