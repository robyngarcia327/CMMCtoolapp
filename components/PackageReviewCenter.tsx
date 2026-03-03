
import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  Trash2, 
  Zap, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  ClipboardList,
  Calendar,
  Plus,
  X,
  FileSearch,
  LayoutDashboard,
  Trophy
} from 'lucide-react';
import { Requirement, PackageFile, PackageAnalysis, GapItem, ProjectTask, ClientData } from '../types';
import { analyzeCmmcPackage, generateProjectPlanFromGaps } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface PackageReviewCenterProps {
  requirements: Requirement[];
  analyses?: PackageAnalysis[];
  onUpdate: (updates: Partial<ClientData>) => void;
  onAddTasks: (tasks: ProjectTask[]) => void;
}

export const PackageReviewCenter: React.FC<PackageReviewCenterProps> = ({ 
  requirements, 
  analyses = [], 
  onUpdate,
  onAddTasks
}) => {
  const [files, setFiles] = useState<PackageFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(analyses.length > 0 ? analyses[0].id : null);
  const [selectedGapIds, setSelectedGapIds] = useState<Set<string>>(new Set());
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const activeAnalysis = analyses.find(a => a.id === activeAnalysisId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    uploadedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        const newFile: PackageFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          base64: base64,
          size: file.size
        };
        setFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCmmcPackage(
        files.map(f => ({ name: f.name, base64: f.base64, mimeType: f.type })),
        requirements
      );

      const newAnalysis: PackageAnalysis = {
        id: `analysis-${Date.now()}`,
        timestamp: Date.now(),
        files: [...files],
        summary: result.summary,
        gaps: result.gaps.map((g: any) => ({ ...g, selected: false })),
      };

      onUpdate({ packageAnalyses: [newAnalysis, ...analyses] });
      setActiveAnalysisId(newAnalysis.id);
      setFiles([]); // Clear upload queue
    } catch (e) {
      alert("Analysis failed. Please check your files and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleGapSelection = (id: string) => {
    const newSelection = new Set(selectedGapIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedGapIds(newSelection);
  };

  const handleAddToPoam = () => {
    if (!activeAnalysis) return;
    
    const selectedGaps = activeAnalysis.gaps.filter(g => selectedGapIds.has(g.id));
    if (selectedGaps.length === 0) return;

    // In this app, POA&M is often represented by requirement status or poam field
    // We'll update the requirements linked to these gaps
    const updatedRequirements = requirements.map(req => {
      const gap = selectedGaps.find(g => g.requirementId === req.id);
      if (gap) {
        return {
          ...req,
          poam: {
            weaknessName: gap.description,
            scheduledCompletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            milestones: gap.recommendation,
            status: 'Open'
          },
          objectives: req.objectives.map(o => ({ ...o, status: 'not_met' as const }))
        };
      }
      return req;
    });

    onUpdate({ requirements: updatedRequirements });
    alert(`${selectedGaps.length} gaps added to POA&M.`);
  };

  const handleGenerateProjectPlan = async () => {
    if (!activeAnalysis) return;
    const selectedGaps = activeAnalysis.gaps.filter(g => selectedGapIds.has(g.id));
    if (selectedGaps.length === 0) {
      alert("Please select at least one gap to generate a plan.");
      return;
    }

    setIsGeneratingPlan(true);
    try {
      const tasks = await generateProjectPlanFromGaps(selectedGaps);
      onAddTasks(tasks);
      
      // Update analysis with the plan
      const updatedAnalyses = analyses.map(a => 
        a.id === activeAnalysisId ? { ...a, projectPlan: tasks } : a
      );
      onUpdate({ packageAnalyses: updatedAnalyses });
      
      alert("Project plan generated and added to your tasks.");
    } catch (e) {
      alert("Failed to generate project plan.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon size={18} className="text-purple-500" />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet size={18} className="text-green-600" />;
    return <FileText size={18} className="text-blue-500" />;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: History */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Package History</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Previous AI Audits</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {analyses.length === 0 ? (
              <div className="text-center py-10">
                <FileSearch size={32} className="text-slate-200 mx-auto mb-4" />
                <p className="text-xs text-slate-400 font-medium">No previous audits found.</p>
              </div>
            ) : (
              analyses.map(a => (
                <button
                  key={a.id}
                  onClick={() => setActiveAnalysisId(a.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    activeAnalysisId === a.id 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-white border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-xs uppercase tracking-tight text-slate-900">
                      Audit {new Date(a.timestamp).toLocaleDateString()}
                    </h4>
                    <span className="text-[9px] font-black text-slate-400 uppercase">
                      {a.files.length} Files
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate font-medium">
                    {a.gaps.length} Gaps identified
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Upload Area */}
          <div className="p-8 bg-white border-b border-slate-200 shrink-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">CMMC Package Auditor</h2>
                <p className="text-slate-500 text-xs font-medium mt-1">Upload your SSP, Policies, and Evidence for a full AI review.</p>
              </div>
              <div className="flex gap-3">
                <label className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all cursor-pointer flex items-center gap-2">
                  <Plus size={16} /> Add Files
                  <input type="file" multiple className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />
                </label>
                <button
                  onClick={handleAnalyze}
                  disabled={files.length === 0 || isAnalyzing}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-30"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} className="text-blue-200" />}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Package'}
                </button>
              </div>
            </div>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2">
                {files.map(f => (
                  <div key={f.id} className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl group">
                    {getFileIcon(f.type)}
                    <span className="text-[10px] font-bold text-slate-700 max-w-[150px] truncate">{f.name}</span>
                    <button onClick={() => removeFile(f.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeAnalysis ? (
              <div className="max-w-5xl mx-auto space-y-10">
                {/* Executive Summary */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                        <Sparkles size={24} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Executive Summary</h3>
                    </div>
                    <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium">
                      <ReactMarkdown>{activeAnalysis.summary}</ReactMarkdown>
                    </div>
                  </div>
                </div>

                {/* Itemized Gaps */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                      <AlertTriangle size={20} className="text-orange-500" /> Itemized Gaps ({activeAnalysis.gaps.length})
                    </h3>
                    <div className="flex gap-3">
                      <button 
                        onClick={handleAddToPoam}
                        disabled={selectedGapIds.size === 0}
                        className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-30"
                      >
                        <ClipboardList size={14} /> Add to POA&M
                      </button>
                      <button 
                        onClick={handleGenerateProjectPlan}
                        disabled={selectedGapIds.size === 0 || isGeneratingPlan}
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 disabled:opacity-30 shadow-lg shadow-slate-200"
                      >
                        {isGeneratingPlan ? <Loader2 className="animate-spin" size={14} /> : <Calendar size={14} />}
                        {isGeneratingPlan ? 'Generating...' : 'Generate Project Plan'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {activeAnalysis.gaps.map(gap => (
                      <div 
                        key={gap.id}
                        onClick={() => toggleGapSelection(gap.id)}
                        className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${
                          selectedGapIds.has(gap.id) 
                            ? 'bg-blue-50 border-blue-600 shadow-xl shadow-blue-100' 
                            : 'bg-white border-slate-100 hover:border-blue-200'
                        }`}
                      >
                        <div className="flex gap-6">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                            selectedGapIds.has(gap.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'
                          }`}>
                            {selectedGapIds.has(gap.id) && <CheckCircle2 size={14} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg mb-2 inline-block ${
                                  gap.severity === 'High' ? 'bg-red-100 text-red-700' :
                                  gap.severity === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {gap.severity} Severity
                                </span>
                                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{gap.title}</h4>
                                {gap.requirementId && (
                                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 block">
                                    Requirement {gap.requirementId}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">{gap.description}</p>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-green-600" /> Recommendation
                              </h5>
                              <p className="text-xs text-slate-700 font-bold leading-relaxed">{gap.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20">
                <div className="w-32 h-32 bg-white rounded-[3rem] border border-slate-200 flex items-center justify-center mb-10 shadow-xl shadow-slate-200/50">
                  <LayoutDashboard size={48} className="text-slate-200" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Ready for Review?</h2>
                <p className="max-w-md text-slate-500 font-medium leading-relaxed mb-10">
                  Upload your CMMC package files above. Our AI Auditor will cross-reference your documentation against NIST 800-171 controls to identify gaps and generate a remediation plan.
                </p>
                <div className="flex items-center gap-8 text-slate-300">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">SSP & Policies</span>
                  </div>
                  <ChevronRight size={20} />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <ImageIcon size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Screenshots</span>
                  </div>
                  <ChevronRight size={20} />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <Trophy size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Compliance</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
