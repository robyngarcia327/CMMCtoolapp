
import React, { useState } from 'react';
import { Requirement } from '../types';
import { analyzePolicyGap } from '../services/gemini';
import { FileText, Sparkles, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PolicyAnalyzerProps {
  requirement: Requirement;
}

export const PolicyAnalyzer: React.FC<PolicyAnalyzerProps> = ({ requirement }) => {
  const [policyText, setPolicyText] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!policyText.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    const result = await analyzePolicyGap(requirement, policyText);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
           <Sparkles size={18} className="text-yellow-400" /> AI Policy Gap Analyzer
        </h3>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded">BETA</span>
      </div>

      <div className="p-6">
         {!analysis ? (
             <div className="space-y-4">
                 <p className="text-sm text-slate-600">
                     Paste your existing policy text below. The AI will audit it against <strong>Requirement {requirement.id}</strong> to check for compliance gaps.
                 </p>
                 <textarea 
                    className="w-full h-48 border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Paste policy text here (e.g., 'Access Control Policy: Users must have unique IDs...')"
                    value={policyText}
                    onChange={(e) => setPolicyText(e.target.value)}
                 />
                 <div className="flex justify-end">
                     <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !policyText}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                     >
                         {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                         {isAnalyzing ? 'Auditing Policy...' : 'Run Gap Analysis'}
                     </button>
                 </div>
             </div>
         ) : (
             <div className="animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex justify-between items-center mb-4">
                     <h4 className="font-bold text-slate-800">Audit Findings</h4>
                     <button 
                        onClick={() => setAnalysis(null)} 
                        className="text-sm text-blue-600 hover:underline"
                     >
                        Analyze Another Snippet
                     </button>
                 </div>
                 <div className="prose prose-sm max-w-none bg-slate-50 p-4 rounded-lg border border-slate-200">
                     <ReactMarkdown>{analysis}</ReactMarkdown>
                 </div>
                 <div className="mt-4 flex gap-2 text-xs text-slate-500">
                     <InfoBox type="tip" text="Tip: Copy 'Missing' items into a remediation ticket." />
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

const InfoBox = ({ type, text }: { type: 'tip' | 'warning', text: string }) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded border ${type === 'tip' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
        {type === 'tip' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
        {text}
    </div>
);
