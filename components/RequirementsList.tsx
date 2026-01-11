import React, { useState } from 'react';
import { Requirement } from '../types';
import { NIST_CMMC_FAMILIES, SOC2_FAMILIES, HIPAA_FAMILIES } from '../data/standards';
import { Info, Filter } from 'lucide-react';

interface RequirementsListProps {
  requirements: Requirement[];
  selectedReqId: string | null;
  onSelectReq: (req: Requirement) => void;
  activeFrameworkId: string;
  targetLevel: 1 | 2 | 3;
}

export const RequirementsList: React.FC<RequirementsListProps> = ({
  requirements,
  selectedReqId,
  onSelectReq,
  activeFrameworkId,
  targetLevel
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
  if (activeFrameworkId === 'NIST-CMMC') families = NIST_CMMC_FAMILIES;
  else if (activeFrameworkId === 'SOC2') families = SOC2_FAMILIES;
  else if (activeFrameworkId === 'HIPAA') families = HIPAA_FAMILIES;
  else {
      families = Array.from(new Set(frameworkReqs.map(r => r.family))).map(f => ({ id: f as string, name: f as string }));
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-80 md:w-96 shrink-0">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-3">
             <h2 className="font-bold text-slate-800">Requirements</h2>
             <div className="flex gap-1">
                <span className="text-[9px] bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded text-blue-700 font-mono font-black uppercase">
                    Level {targetLevel}
                </span>
             </div>
        </div>
        
        <div className="relative">
            <select
            value={filterFamily}
            onChange={(e) => setFilterFamily(e.target.value)}
            className="w-full p-2 pl-9 bg-white border border-slate-300 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
            >
            <option value="ALL">All Scoped Domains</option>
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
              selectedReqId === req.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`font-mono text-[10px] font-black px-1.5 py-0.5 rounded ${
                  selectedReqId === req.id ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600 group-hover:bg-white'
              }`}>
                {req.id}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{req.family}</span>
            </div>
            <h4 className={`text-sm font-bold leading-tight mb-1 ${selectedReqId === req.id ? 'text-blue-900' : 'text-slate-800'}`}>
                {req.title}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">{req.description}</p>
          </div>
        ))}
        
        {filteredReqs.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center">
                <Info size={32} className="mb-2 opacity-50" />
                No requirements found for this level.
            </div>
        )}
      </div>
    </div>
  );
};