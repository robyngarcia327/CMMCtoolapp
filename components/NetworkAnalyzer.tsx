import React, { useState, useEffect } from 'react';
import { analyzeNetworkDiagram, analyzeAuvikTopology } from '../services/gemini';
import { fetchAuvikNetworkTopology } from '../services/auvik';
import { AuvikConfig, AuvikDevice, Artifact } from '../types';
import { api } from '../services/api';
import { useAuth } from "react-oidc-context";
import { Upload, Network, Search, ArrowRight, Loader2, ShieldAlert, CheckCircle2, Shield, RefreshCw, Layers, FileText, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface NetworkAnalyzerProps {
    variant?: 'default' | 'wizard';
    activeClientId?: string;
    existingAnalysis?: string;
    existingDiagramId?: string;
    artifacts: Artifact[];
    onUpdateAnalysis: (result: string) => void;
    onUpdateDiagramId: (id: string) => void;
    onAddArtifact: (a: Artifact) => void;
}

export const NetworkAnalyzer: React.FC<NetworkAnalyzerProps> = ({ 
    variant = 'default',
    activeClientId,
    existingAnalysis,
    existingDiagramId,
    artifacts,
    onUpdateAnalysis,
    onUpdateDiagramId,
    onAddArtifact
}) => {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'AUVIK'>('UPLOAD');
  
  // Upload State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
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

  // Effect to load existing diagram preview if artifact ID exists
  useEffect(() => {
    const loadExistingPreview = async () => {
        if (existingDiagramId && activeClientId && auth.user?.id_token) {
            try {
                const url = await api.getDownloadUrl(auth.user.id_token, activeClientId, existingDiagramId);
                setPreviewUrl(url);
            } catch (e) {
                console.error("Failed to load existing network diagram", e);
            }
        }
    };
    loadExistingPreview();
  }, [existingDiagramId, activeClientId, auth.user?.id_token]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeClientId || !auth.user?.id_token) return;

    if (file.type === 'application/pdf') {
        setIsPdf(true);
        setPreviewUrl(null);
        setError("PDF diagrams are supported for storage, but AI visual analysis requires an image format (PNG/JPG) in this version.");
    } else if (file.type.startsWith('image/')) {
        setIsPdf(false);
        setError(null);
        const reader = new FileReader();
        reader.onload = (event) => setPreviewUrl(event.target?.result as string);
        reader.readAsDataURL(file);
    } else {
        setError("Please upload an image file (PNG, JPG, WebP) or PDF.");
        return;
    }

    // Immediately upload to secure storage
    setIsAnalyzing(true);
    try {
        const newArtifact = await api.uploadEvidence(
            auth.user.id_token,
            activeClientId,
            file,
            'NETWORK-SCOPE'
        );
        onAddArtifact(newArtifact);
        onUpdateDiagramId(newArtifact.id);
        
        // If it's an image, trigger AI analysis automatically
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64 = event.target?.result as string;
                const result = await analyzeNetworkDiagram(base64);
                onUpdateAnalysis(result);
                setIsAnalyzing(false);
            };
            reader.readAsDataURL(file);
        } else {
            setIsAnalyzing(false);
        }
    } catch (err) {
        setError("Secure upload failed. Please try again.");
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
          const devices = await fetchAuvikNetworkTopology(auvikConfig);
          setAuvikDevices(devices);
          
          setIsAnalyzing(true);
          const aiAnalysis = await analyzeAuvikTopology(devices);
          onUpdateAnalysis(aiAnalysis);
          setIsAnalyzing(false);

      } catch (e) {
          setError("Failed to sync with Auvik.");
      } finally {
          setIsFetchingAuvik(false);
      }
  };

  const isWizard = variant === 'wizard';

  return (
    <div className={isWizard ? '' : 'max-w-6xl mx-auto p-6 h-full overflow-y-auto'}>
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
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('UPLOAD')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'UPLOAD' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Diagram Upload
                </button>
                <button
                    onClick={() => setActiveTab('AUVIK')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'AUVIK' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Auvik Integration
                </button>
            </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
        
        <div className="lg:col-span-5 space-y-6">
            {activeTab === 'UPLOAD' && (
                <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${previewUrl || isPdf ? 'border-blue-200 bg-blue-50/50' : 'border-slate-300 hover:bg-slate-50'}`}>
                    {!previewUrl && !isPdf ? (
                        <label className="cursor-pointer flex flex-col items-center w-full h-full">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Upload className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">Secure Vault Upload</h3>
                            <p className="text-sm text-slate-500 mb-4 mt-1">Network maps are stored in your private S3 bucket.</p>
                            <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                            <span className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
                                Select Map File
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
                                    src={previewUrl!} 
                                    alt="Network Diagram Preview" 
                                    className="max-h-[300px] w-auto mx-auto rounded shadow-lg object-contain bg-white" 
                                />
                            )}
                            <label className="absolute -top-2 -right-2 bg-white text-slate-500 rounded-full p-2 shadow border border-slate-200 hover:text-blue-600 cursor-pointer">
                                <RefreshCw size={16} /> 
                                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                            </label>
                        </div>
                    )}
                </div>
            )}

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
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 text-sm border border-red-100">
                    <ShieldAlert size={20} />
                    {error}
                </div>
            )}
            
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                    <Layers size={18}/> Compliance Architect Tips
                </h4>
                <ul className="space-y-2 text-sm text-indigo-800">
                    <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span><strong>Isolate CUI:</strong> Maps must demonstrate logical isolation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span><strong>Storage:</strong> All diagrams are encrypted at rest in your tenant's S3 vault.</span>
                    </li>
                </ul>
            </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[500px] overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield size={20} className="text-indigo-600" />
                    <h3 className="font-semibold text-slate-800">Architectural Recommendations</h3>
                </div>
                {existingAnalysis && !isAnalyzing && (
                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 size={12}/> Analysis Persisted
                    </span>
                )}
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                {isAnalyzing || isFetchingAuvik ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                        <Loader2 size={48} className="animate-spin text-blue-500" />
                        <p className="text-slate-500 font-medium text-lg">AI Generating Insight...</p>
                    </div>
                ) : existingAnalysis ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="prose prose-slate prose-sm max-w-none prose-headings:text-slate-900 prose-headings:font-black">
                            <ReactMarkdown>{existingAnalysis}</ReactMarkdown>
                        </div>
                    </div>
                ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                        <div className="p-6 bg-slate-50 rounded-full mb-2">
                            <ArrowRight size={32} />
                        </div>
                        <p className="text-sm font-medium">Upload a diagram or Sync Auvik to generate recommendations.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};