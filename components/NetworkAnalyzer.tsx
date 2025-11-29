

import React, { useState } from 'react';
import { analyzeNetworkDiagram } from '../services/gemini';
import { Upload, Network, Search, ArrowRight, Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface NetworkAnalyzerProps {
    variant?: 'default' | 'wizard';
}

export const NetworkAnalyzer: React.FC<NetworkAnalyzerProps> = ({ variant = 'default' }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (PNG, JPG, WebP). If you have a Visio file, please export it as an image first.");
      return;
    }
    setError(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeNetworkDiagram(selectedImage);
      setAnalysisResult(result);
    } catch (err) {
      setError("Failed to analyze the diagram. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isWizard = variant === 'wizard';

  return (
    <div className={isWizard ? '' : 'max-w-5xl mx-auto p-6'}>
      {isWizard ? (
        <div className="mb-6 space-y-1">
             <h3 className="text-lg font-bold text-slate-800">Map System Boundaries</h3>
             <p className="text-sm text-slate-500 max-w-xl">
                 Upload a network diagram to let our AI identify the compliance scope (In-Scope vs Out-of-Scope).
             </p>
        </div>
      ) : (
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Network className="text-blue-600" /> System Boundary Analysis
            </h1>
            <p className="text-slate-600">
            Upload your network diagrams, data flow diagrams, or topology maps (Visio exports, screenshots). 
            Our AI will help define system boundaries and identify in-scope vs. out-of-scope assets.
            </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Upload & Preview */}
        <div className="space-y-6">
            <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${selectedImage ? 'border-blue-200 bg-blue-50/50' : 'border-slate-300 hover:bg-slate-50'}`}>
                {!selectedImage ? (
                    <label className="cursor-pointer flex flex-col items-center w-full h-full">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="text-blue-600" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">Upload Diagram</h3>
                        <p className="text-sm text-slate-500 mb-4 mt-1">PNG, JPG, or WebP</p>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        <span className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
                            Select File
                        </span>
                    </label>
                ) : (
                    <div className="w-full relative">
                        <img 
                            src={selectedImage} 
                            alt="Network Diagram Preview" 
                            className="max-h-[300px] w-auto mx-auto rounded shadow-lg object-contain bg-white" 
                        />
                        <button 
                            onClick={() => { setSelectedImage(null); setAnalysisResult(null); }}
                            className="absolute -top-2 -right-2 bg-white text-slate-500 rounded-full p-1 shadow border border-slate-200 hover:text-red-500"
                        >
                            <ShieldAlert size={16} /> 
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 text-sm">
                    <ShieldAlert size={20} />
                    {error}
                </div>
            )}

            {selectedImage && !analysisResult && (
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
                >
                    {isAnalyzing ? <Loader2 className="animate-spin" /> : <Search />}
                    {isAnalyzing ? 'Analyzing Topology...' : 'Identify Boundaries & Scope'}
                </button>
            )}

            {/* Tips Section */}
            {!selectedImage && !isWizard && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-3">Best Practices for Diagrams</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                            Clearly label CUI assets (servers, databases).
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                            Show boundary protection devices (Firewalls, Proxies).
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                            Indicate MSP/Cloud connections.
                        </li>
                    </ul>
                </div>
            )}
        </div>

        {/* Right Column: Results */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[400px] overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <Network size={20} className="text-indigo-600" />
                <h3 className="font-semibold text-slate-800">Architectural Assessment</h3>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
                {analysisResult ? (
                    <div className="prose prose-slate max-w-none text-sm">
                         <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 bg-slate-100 p-2 rounded-lg border border-slate-200">
                             <ShieldAlert size={14} className="text-amber-500" />
                             <span>AI-generated assessment. Verify all boundaries with your 3PAO.</span>
                         </div>
                        <ReactMarkdown>{analysisResult}</ReactMarkdown>
                    </div>
                ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                        {isAnalyzing ? (
                            <>
                                <Loader2 size={32} className="animate-spin text-blue-500" />
                                <p className="text-slate-500 font-medium text-sm">Analyzing network flow...</p>
                            </>
                        ) : (
                            <>
                                <div className="p-4 bg-slate-50 rounded-full">
                                    <ArrowRight size={24} />
                                </div>
                                <p className="text-sm">Upload a diagram to begin.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
