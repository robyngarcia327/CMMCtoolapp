
import React, { useState } from 'react';
import { analyzeNetworkDiagram, analyzeAuvikTopology } from '../services/gemini';
import { fetchAuvikNetworkTopology } from '../services/auvik';
import { AuvikConfig, AuvikDevice } from '../types';
import { Upload, Network, Search, ArrowRight, Loader2, ShieldAlert, CheckCircle2, Shield, RefreshCw, Layers, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface NetworkAnalyzerProps {
    variant?: 'default' | 'wizard';
}

export const NetworkAnalyzer: React.FC<NetworkAnalyzerProps> = ({ variant = 'default' }) => {
  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'AUVIK'>('UPLOAD');
  
  // Upload State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auvik State
  const [auvikConfig, setAuvikConfig] = useState<AuvikConfig>({
      apiKey: '',
      tenantId: '',
      region: 'US',
      enabled: false
  });
  const [auvikDevices, setAuvikDevices] = useState<AuvikDevice[]>([]);
  const [isFetchingAuvik, setIsFetchingAuvik] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check for PDF
    if (file.type === 'application/pdf') {
        setIsPdf(true);
        // In a real implementation, we would use pdf.js to render the first page to canvas
        // For this demo, we set a placeholder to simulate PDF upload acceptance
        setSelectedImage(null); 
        setAnalysisResult("PDF Uploaded. Note: For this demo, full PDF parsing requires backend processing. Please try converting your PDF to an image (JPG/PNG) for the best AI analysis results in this browser-based version.");
        return;
    }
    
    setIsPdf(false);

    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (PNG, JPG, WebP) or PDF.");
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

  const handleAnalyzeDiagram = async () => {
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

  const handleAuvikSync = async () => {
      if (!auvikConfig.apiKey || !auvikConfig.tenantId) {
          setError("Please enter Auvik API credentials.");
          return;
      }
      setError(null);
      setIsFetchingAuvik(true);
      try {
          // 1. Fetch Topology
          const devices = await fetchAuvikNetworkTopology(auvikConfig);
          setAuvikDevices(devices);
          
          // 2. Analyze with Gemini
          setIsAnalyzing(true);
          const aiAnalysis = await analyzeAuvikTopology(devices);
          setAnalysisResult(aiAnalysis);
          setIsAnalyzing(false);

      } catch (e) {
          setError("Failed to sync with Auvik.");
      } finally {
          setIsFetchingAuvik(false);
      }
  };

  const isWizard = variant === 'wizard';

  return (
    <div className={isWizard ? '' : 'max-w-6xl mx-auto p-6'}>
      {!isWizard && (
          <div className="mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Network className="text-blue-600" /> Network Architecture Analysis
                </h1>
                <p className="text-slate-600">
                    Analyze system boundaries, detect flat networks, and generate CUI Enclave recommendations.
                </p>
            </div>
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                    onClick={() => { setActiveTab('UPLOAD'); setAnalysisResult(null); setError(null); }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'UPLOAD' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Diagram Upload
                </button>
                <button
                    onClick={() => { setActiveTab('AUVIK'); setAnalysisResult(null); setError(null); }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'AUVIK' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Auvik Integration
                </button>
            </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input Source */}
        <div className="lg:col-span-5 space-y-6">
            
            {/* --- UPLOAD MODE --- */}
            {activeTab === 'UPLOAD' && (
                <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${selectedImage || isPdf ? 'border-blue-200 bg-blue-50/50' : 'border-slate-300 hover:bg-slate-50'}`}>
                    {!selectedImage && !isPdf ? (
                        <label className="cursor-pointer flex flex-col items-center w-full h-full">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Upload className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">Upload Diagram</h3>
                            <p className="text-sm text-slate-500 mb-4 mt-1">Images (.png, .jpg) or PDF</p>
                            <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                            <span className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
                                Select File
                            </span>
                        </label>
                    ) : (
                        <div className="w-full relative">
                            {isPdf ? (
                                <div className="flex flex-col items-center p-8 text-slate-500">
                                    <FileText size={48} className="mb-2 text-red-500"/>
                                    <span className="font-semibold text-slate-700">Network_Diagram.pdf</span>
                                </div>
                            ) : (
                                <img 
                                    src={selectedImage!} 
                                    alt="Network Diagram Preview" 
                                    className="max-h-[300px] w-auto mx-auto rounded shadow-lg object-contain bg-white" 
                                />
                            )}
                            <button 
                                onClick={() => { setSelectedImage(null); setIsPdf(false); setAnalysisResult(null); }}
                                className="absolute -top-2 -right-2 bg-white text-slate-500 rounded-full p-1 shadow border border-slate-200 hover:text-red-500"
                            >
                                <ShieldAlert size={16} /> 
                            </button>
                        </div>
                    )}
                    
                     {selectedImage && !analysisResult && (
                        <button
                            onClick={handleAnalyzeDiagram}
                            disabled={isAnalyzing}
                            className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-sm transition-all disabled:opacity-50"
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin" /> : <Search />}
                            {isAnalyzing ? 'Analyzing Topology...' : 'Analyze Architecture'}
                        </button>
                    )}
                </div>
            )}

            {/* --- AUVIK MODE --- */}
            {activeTab === 'AUVIK' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">AUV</div>
                        <div>
                            <h3 className="font-bold text-slate-900">Auvik Connection</h3>
                            <p className="text-xs text-slate-500">Sync network assets in real-time.</p>
                        </div>
                     </div>

                     <div className="space-y-3">
                         <div>
                             <label className="text-xs font-bold text-slate-500 uppercase">Tenant ID</label>
                             <input 
                                className="w-full border border-slate-300 rounded p-2 text-sm"
                                placeholder="e.g. 12345678-..."
                                value={auvikConfig.tenantId}
                                onChange={e => setAuvikConfig({...auvikConfig, tenantId: e.target.value})}
                             />
                         </div>
                         <div>
                             <label className="text-xs font-bold text-slate-500 uppercase">API Key</label>
                             <input 
                                type="password"
                                className="w-full border border-slate-300 rounded p-2 text-sm"
                                placeholder="••••••••••••••"
                                value={auvikConfig.apiKey}
                                onChange={e => setAuvikConfig({...auvikConfig, apiKey: e.target.value})}
                             />
                         </div>
                     </div>
                     
                     <button
                        onClick={handleAuvikSync}
                        disabled={isFetchingAuvik}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold shadow-sm transition-all disabled:opacity-50"
                     >
                        {isFetchingAuvik ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />}
                        {isFetchingAuvik ? 'Scanning Network...' : 'Sync & Analyze'}
                     </button>

                     {/* Device List Preview */}
                     {auvikDevices.length > 0 && (
                         <div className="mt-4 pt-4 border-t border-slate-100">
                             <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Discovered Devices ({auvikDevices.length})</h4>
                             <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                 {auvikDevices.map(dev => (
                                     <div key={dev.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded border border-slate-100">
                                         <div className="flex items-center gap-2">
                                             <div className={`w-2 h-2 rounded-full ${dev.vlan === '1' ? 'bg-red-400' : 'bg-green-400'}`}></div>
                                             <span className="font-medium text-slate-700">{dev.name}</span>
                                         </div>
                                         <span className="text-slate-400 font-mono">{dev.ipAddress}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     )}
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 text-sm border border-red-100">
                    <ShieldAlert size={20} />
                    {error}
                </div>
            )}
            
            {/* Tips Section */}
            {!analysisResult && (
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                        <Layers size={18}/> Compliance Architect Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-indigo-800">
                        <li className="flex items-start gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Isolate CUI:</strong> Never mix CUI assets on the same VLAN as Guest Wi-Fi or IoT devices.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Enclave Strategy:</strong> Use a Terminal Server (Jump Box) to access CUI data to keep end-user laptops out of scope.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Diagrams:</strong> Must show the "Assessment Boundary" clearly for auditors.</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>

        {/* RIGHT COLUMN: AI Results */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[500px] overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <Shield size={20} className="text-indigo-600" />
                <h3 className="font-semibold text-slate-800">Architectural Recommendations</h3>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto">
                {analysisResult ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {/* Summary Badge */}
                        <div className="flex gap-4">
                             <div className="bg-red-50 text-red-800 border border-red-200 px-4 py-3 rounded-lg flex-1">
                                 <div className="text-xs font-bold uppercase mb-1 opacity-75">Analysis Outcome</div>
                                 <div className="font-bold flex items-center gap-2"><ShieldAlert size={18}/> Segmentation Required</div>
                             </div>
                             <div className="bg-blue-50 text-blue-800 border border-blue-200 px-4 py-3 rounded-lg flex-1">
                                 <div className="text-xs font-bold uppercase mb-1 opacity-75">Architecture Type</div>
                                 <div className="font-bold flex items-center gap-2"><Layers size={18}/> Flat Network Detected</div>
                             </div>
                        </div>

                        <div className="prose prose-slate prose-sm max-w-none">
                            <ReactMarkdown>{analysisResult}</ReactMarkdown>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                <CheckCircle2 size={18} /> CUI Enclave Recommendation
                            </h4>
                            <p className="text-sm text-green-800 mb-3">
                                Based on the analysis, implementing a secure enclave is highly recommended to reduce your assessment scope.
                            </p>
                            <button className="bg-white border border-green-300 text-green-700 px-3 py-1.5 rounded text-sm font-bold shadow-sm hover:bg-green-100">
                                View Enclave Blueprint
                            </button>
                        </div>
                    </div>
                ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                        {isAnalyzing || isFetchingAuvik ? (
                            <>
                                <Loader2 size={48} className="animate-spin text-blue-500" />
                                <p className="text-slate-500 font-medium text-lg">
                                    {isFetchingAuvik ? 'Querying Auvik API...' : 'AI Analyzing Architecture...'}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="p-6 bg-slate-50 rounded-full mb-2">
                                    <ArrowRight size={32} />
                                </div>
                                <p className="text-sm font-medium">Upload a diagram or Sync Auvik to generate recommendations.</p>
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
