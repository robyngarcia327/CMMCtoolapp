import React, { useState } from 'react';
import { Requirement } from '../types';
import { NIST_CMMC_FAMILIES, REQUIREMENTS_DATA } from '../data/standards';
import { Info, Filter, Database, Plus, RefreshCw } from 'lucide-react';

interface RequirementsListProps {
  requirements: Requirement[];
  selectedReqId: string | null;
  onSelectReq: (req: Requirement) => void;
  activeFrameworkId: string;
  targetLevel: 1 | 2 | 3;
  onUpdateRequirement?: (req: Requirement) => void;
  onBatchUpdate?: (reqs: Requirement[]) => void;
}

export const RequirementsList: React.FC<RequirementsListProps> = ({
  requirements,
  selectedReqId,
  onSelectReq,
  activeFrameworkId,
  targetLevel,
  onUpdateRequirement,
  onBatchUpdate
}) => {
  const [filterFamily, setFilterFamily] = useState<string>('ALL');

  // Filter first by Active Framework, then by CMMC Level, then by Family
  const frameworkReqs = requirements.filter(r => 
    r.framework === activeFrameworkId && r.cmmcLevel <= targetLevel
  );
  
  const filteredReqs = filterFamily === 'ALL'
    ? frameworkReqs
    : frameworkReqs.filter(r => r.family === filterFamily);

  // Extract families based on framework
  let families: { id: string, name: string }[] = [];
  if (activeFrameworkId === 'NIST-CMMC') {
      families = NIST_CMMC_FAMILIES;
  } else {
      families = Array.from(new Set(frameworkReqs.map(r => r.family))).map(f => ({ id: f as string, name: f as string }));
  }

  const handleSeedLibrary = () => {
    if (onBatchUpdate) {
        // Find requirements in REQUIREMENTS_DATA that are missing from current list
        const currentIds = new Set(requirements.map(r => r.id));
        const missingReqs = REQUIREMENTS_DATA.filter(r => !currentIds.has(r.id));
        
        if (missingReqs.length > 0) {
            onBatchUpdate(missingReqs);
            alert(`Synchronized ${missingReqs.length} missing controls to your environment. Total controls in scope: ${requirements.length + missingReqs.length}`);
        } else {
            alert("Your compliance library is already fully synchronized with the NIST 800-171 standard.");
        }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-silver-200 w-80 md:w-96 shrink-0">
      <div className="p-4 border-b border-silver-200 bg-slate-50">
        <div className="flex items-center justify-between mb-3">
             <h2 className="font-bold text-slate-800">Requirements</h2>
             <div className="flex gap-2">
                <button 
                    onClick={handleSeedLibrary}
                    className="p-1.5 bg-white border border-silver-200 rounded text-slate-400 hover:text-coral-600 transition-colors"
                    title="Sync Official Standards"
                >
                    <RefreshCw size={12} />
                </button>
                <span className="text-[9px] bg-coral-100 border border-coral-200 px-1.5 py-0.5 rounded text-coral-700 font-mono font-black uppercase">
                    Level {targetLevel} Scope
                </span>
             </div>
        </div>
        
        <div className="relative">
            <select
            value={filterFamily}
            onChange={(e) => setFilterFamily(e.target.value)}
            className="w-full p-2 pl-9 bg-white border border-silver-300 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-coral-500 outline-none"
            >
            <option value="ALL">All 14 Security Domains</option>
            {families.map((f: any) => (
                <option key={f.id} value={f.id}>{f.id}: {f.name}</option>
            ))}
            </select>
            <Filter size={14} className="absolute left-3 top-3 text-slate-400" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredReqs.map(req => (
          <div
            key={req.id}
            onClick={() => onSelectReq(req)}
            className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors group ${
              selectedReqId === req.id ? 'bg-coral-50 border-l-4 border-l-coral-500' : 'border-l-4 border-l-transparent'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`font-mono text-[10px] font-black px-1.5 py-0.5 rounded ${
                  selectedReqId === req.id ? 'bg-coral-200 text-coral-800' : 'bg-slate-100 text-slate-600 group-hover:bg-white'
              }`}>
                {req.id}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{req.family}</span>
            </div>
            <h4 className={`text-sm font-bold leading-tight mb-1 ${selectedReqId === req.id ? 'text-coral-900' : 'text-slate-800'}`}>
                {req.title}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">{req.description}</p>
          </div>
        ))}
        
        {filteredReqs.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4 border border-dashed border-slate-300">
                    <Database size={32} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Scope Empty</h3>
                <p className="text-xs text-slate-500 mt-2">No active controls mapped for Level {targetLevel}.</p>
                <button 
                    onClick={handleSeedLibrary}
                    className="mt-6 w-full bg-coral-600 text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-coral-100"
                >
                    <Plus size={14}/> Seed 110 Practices
                </button>
            </div>
        )}
      </div>
    </div>
  );
};