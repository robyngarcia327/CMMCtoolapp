
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Shield, 
  Info,
  ChevronRight,
  ClipboardList,
  Save,
  Trash2,
  RefreshCw,
  Zap,
  BookOpen,
  X,
  Plus,
  Edit3,
  Layout,
  History,
  FilePlus2,
  Download,
  Eye
} from 'lucide-react';
import { Requirement, ClientData, PolicyDocument, PolicySection } from '../types';
import { auditPolicyAgainstFramework, parsePolicyDocument } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface PolicyReviewCenterProps {
  requirements: Requirement[];
  activeFrameworkId: string;
  policies?: PolicyDocument[];
  onUpdate: (updates: Partial<ClientData>) => void;
}

export const PolicyReviewCenter: React.FC<PolicyReviewCenterProps> = ({ 
    requirements, 
    activeFrameworkId,
    policies = [],
    onUpdate
}) => {
  const [activePolicyId, setActivePolicyId] = useState<string | null>(policies.length > 0 ? policies[0].id : null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const activePolicy = policies.find(p => p.id === activePolicyId);

  // Filter requirements for the active framework to use as the audit baseline
  const activeReqs = requirements.filter(r => r.framework === activeFrameworkId);

  const handleCreatePolicy = () => {
    const newPolicy: PolicyDocument = {
      id: `pol-${Date.now()}`,
      title: 'New Organizational Policy',
      description: 'Draft policy document',
      sections: [
        { id: `sec-${Date.now()}`, title: 'Introduction', content: 'Define the scope and purpose of this policy.' }
      ],
      lastModified: Date.now(),
      status: 'Draft'
    };
    onUpdate({ policies: [...policies, newPolicy] });
    setActivePolicyId(newPolicy.id);
    setIsEditing(true);
  };

  const handleDeletePolicy = (id: string) => {
    if (confirm('Are you sure you want to delete this policy?')) {
      const updated = policies.filter(p => p.id !== id);
      onUpdate({ policies: updated });
      if (activePolicyId === id) {
        setActivePolicyId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  const handleUpdatePolicy = (updates: Partial<PolicyDocument>) => {
    if (!activePolicyId) return;
    const updated = policies.map(p => 
      p.id === activePolicyId ? { ...p, ...updates, lastModified: Date.now() } : p
    );
    onUpdate({ policies: updated });
  };

  const handleAddSection = () => {
    if (!activePolicy) return;
    const newSection: PolicySection = {
      id: `sec-${Date.now()}`,
      title: 'New Section',
      content: ''
    };
    handleUpdatePolicy({ sections: [...activePolicy.sections, newSection] });
    setActiveSectionId(newSection.id);
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<PolicySection>) => {
    if (!activePolicy) return;
    const updatedSections = activePolicy.sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    );
    handleUpdatePolicy({ sections: updatedSections });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!activePolicy) return;
    const updatedSections = activePolicy.sections.filter(s => s.id !== sectionId);
    handleUpdatePolicy({ sections: updatedSections });
    if (activeSectionId === sectionId) setActiveSectionId(null);
  };

  const handleAudit = async () => {
    if (!activePolicy) return;
    setIsAuditing(true);
    
    try {
      const fullText = activePolicy.sections.map(s => `## ${s.title}\n${s.content}`).join('\n\n');
      const fileData = (activePolicy.fileBase64 && activePolicy.fileMimeType) 
        ? { base64: activePolicy.fileBase64, mimeType: activePolicy.fileMimeType } 
        : undefined;
      
      const result = await auditPolicyAgainstFramework(
        activePolicy.title,
        fullText,
        activeReqs,
        fileData
      );
      handleUpdatePolicy({ analysisResult: result });
    } catch (e) {
      alert("AI Audit engine encountered an error.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleParseDocument = async () => {
    if (!activePolicy || !activePolicy.fileBase64 || !activePolicy.fileMimeType) return;
    
    if (activePolicy.sections.length > 0 && !confirm('This will replace existing sections with AI-parsed content. Continue?')) {
        return;
    }

    setIsParsing(true);
    try {
        const sections = await parsePolicyDocument({
            base64: activePolicy.fileBase64,
            mimeType: activePolicy.fileMimeType
        });
        handleUpdatePolicy({ sections });
        alert(`Successfully parsed ${sections.length} sections from document.`);
    } catch (e: any) {
        alert(e.message || "AI Parsing engine encountered an error.");
    } finally {
        setIsParsing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activePolicyId) {
      const reader = new FileReader();
      const isBinary = file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc');

      reader.onload = async (ev) => {
        const content = ev.target?.result as string;
        
        if (!isBinary) {
          // If it's a text file, offer to import as sections or just attach
          if (confirm('Would you like to import this text file as a new section?')) {
            const newSection: PolicySection = {
              id: `sec-${Date.now()}`,
              title: file.name.split('.')[0],
              content: content
            };
            handleUpdatePolicy({ 
              sections: [...(activePolicy?.sections || []), newSection],
              lastModified: Date.now()
            });
            return;
          }
          
          handleUpdatePolicy({
            fileBase64: undefined,
            fileMimeType: file.type || 'application/octet-stream',
            fileName: file.name,
            lastModified: Date.now()
          });
        } else {
          setIsParsing(true);
          try {
            const sections = await parsePolicyDocument({
              base64: content,
              mimeType: file.type || 'application/octet-stream'
            });
            handleUpdatePolicy({
              fileBase64: content,
              fileMimeType: file.type || 'application/octet-stream',
              fileName: file.name,
              sections: sections,
              lastModified: Date.now()
            });
          } catch (e: any) {
            console.error("Auto-parsing failed", e);
            alert(e.message || "Auto-parsing failed. The document was attached but sections were not identified.");
            handleUpdatePolicy({
              fileBase64: content,
              fileMimeType: file.type || 'application/octet-stream',
              fileName: file.name,
              lastModified: Date.now()
            });
          } finally {
            setIsParsing(false);
          }
        }
      };
      
      if (isBinary) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="h-full flex bg-slate-50 overflow-hidden">
      {/* Sidebar: Policy List */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 space-y-3">
          <button 
            onClick={handleCreatePolicy}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200"
          >
            <FilePlus2 size={16} /> New Policy Document
          </button>
          
          <label className={`w-full bg-white border-2 border-slate-100 text-slate-600 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer ${isParsing ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isParsing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} 
            {isParsing ? 'Parsing Document...' : 'Upload Policy File'}
            <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt" 
                disabled={isParsing}
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        const isBinary = file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc');
                        reader.onload = async (ev) => {
                            const content = ev.target?.result as string;
                            const newPolicyId = `pol-${Date.now()}`;
                            let sections: PolicySection[] = [];

                            if (isBinary) {
                                setIsParsing(true);
                                try {
                                    sections = await parsePolicyDocument({
                                        base64: content,
                                        mimeType: file.type || 'application/octet-stream'
                                    });
                                } catch (e: any) {
                                    console.error("Auto-parsing failed", e);
                                    alert(e.message || "Auto-parsing failed. The document was uploaded but sections were not identified.");
                                } finally {
                                    setIsParsing(false);
                                }
                            }

                            const newPolicy: PolicyDocument = {
                                id: newPolicyId,
                                title: file.name.split('.')[0],
                                description: `Uploaded policy: ${file.name}`,
                                sections: sections,
                                lastModified: Date.now(),
                                status: 'Draft',
                                fileBase64: isBinary ? content : undefined,
                                fileMimeType: file.type || 'application/octet-stream',
                                fileName: file.name
                            };
                            onUpdate({ policies: [...policies, newPolicy] });
                            setActivePolicyId(newPolicyId);
                        };
                        if (isBinary) reader.readAsDataURL(file);
                        else reader.readAsText(file);
                    }
                }} 
            />
          </label>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Saved Documents</h4>
          {policies.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={20} className="text-slate-300" />
              </div>
              <p className="text-xs text-slate-400 font-medium">No policies created yet.</p>
            </div>
          ) : (
            policies.map(pol => (
              <div 
                key={pol.id}
                onClick={() => setActivePolicyId(pol.id)}
                className={`group p-4 rounded-2xl cursor-pointer transition-all border ${
                  activePolicyId === pol.id 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h5 className={`font-black text-xs uppercase tracking-tight truncate ${activePolicyId === pol.id ? 'text-coral-900' : 'text-slate-700'}`}>
                    {pol.title}
                  </h5>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeletePolicy(pol.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    pol.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {pol.status}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {new Date(pol.lastModified).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activePolicy ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white p-8 border-b border-slate-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-coral-600 text-white rounded-[1.5rem] shadow-xl shadow-coral-100">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <input 
                        className="text-2xl font-black text-slate-900 uppercase tracking-tighter outline-none border-b-2 border-coral-500 bg-coral-50/50 px-2"
                        value={activePolicy.title}
                        onChange={e => handleUpdatePolicy({ title: e.target.value })}
                        autoFocus
                      />
                    ) : (
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{activePolicy.title}</h2>
                    )}
                    <button onClick={() => setIsEditing(!isEditing)} className="p-2 text-slate-400 hover:text-coral-600 transition-colors">
                      <Edit3 size={18} />
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs font-medium mt-1">
                    Last modified: {new Date(activePolicy.lastModified).toLocaleString()} • {activePolicy.sections.length} Sections
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-all shadow-sm">
                  <Upload size={14}/> {activePolicy.fileName ? 'Change File' : 'Attach File'}
                  <input type="file" className="hidden" accept=".txt,.md,.pdf,.doc,.docx" onChange={handleFileUpload} />
                </label>
                <button 
                  onClick={handleAudit}
                  disabled={isAuditing}
                  className="bg-coral-600 hover:bg-coral-700 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-coral-100 transition-all flex items-center gap-2 disabled:opacity-30"
                >
                  {isAuditing ? <Loader2 className="animate-spin" size={14}/> : <Zap size={14} className="text-coral-200"/>}
                  {isAuditing ? 'Auditing...' : 'AI Audit'}
                </button>
              </div>
            </div>

            {/* Workspace Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Left: Editor */}
              <div className="lg:col-span-7 border-r border-slate-200 flex flex-col bg-white overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Layout size={14} /> Document Structure
                  </div>
                  <button 
                    onClick={handleAddSection}
                    className="flex items-center gap-1 text-[10px] font-black text-coral-600 uppercase tracking-widest hover:text-coral-700"
                  >
                    <Plus size={14} /> Add Section
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {activePolicy.sections.map((section, idx) => (
                    <div key={section.id} className="group relative">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                          <input 
                            className="font-black text-slate-900 uppercase tracking-tight outline-none border-b border-transparent focus:border-coral-400 bg-transparent"
                            value={section.title}
                            onChange={e => handleUpdateSection(section.id, { title: e.target.value })}
                            placeholder="Section Title"
                          />
                        </div>
                        <button 
                          onClick={() => handleDeleteSection(section.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <textarea 
                        className="w-full min-h-[150px] p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-coral-500/5 focus:border-coral-400 focus:bg-white transition-all text-slate-700 leading-relaxed font-medium resize-none"
                        placeholder="Enter section content..."
                        value={section.content}
                        onChange={e => handleUpdateSection(section.id, { content: e.target.value })}
                      />
                    </div>
                  ))}
                  
                  {activePolicy.fileName && (
                    <div className="mt-10 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                          <FileText size={20} className="text-coral-600" />
                        </div>
                        <div>
                          <h6 className="font-black text-slate-900 text-xs uppercase tracking-tight">{activePolicy.fileName}</h6>
                          <div className="flex items-center gap-3 mt-1">
                            <button 
                                onClick={() => setShowViewer(true)}
                                className="text-[9px] text-coral-600 font-black uppercase tracking-widest hover:underline flex items-center gap-1"
                            >
                                <Eye size={10} /> View Document
                            </button>
                            <button 
                                onClick={handleParseDocument}
                                disabled={isParsing}
                                className="text-[9px] text-indigo-600 font-black uppercase tracking-widest hover:underline flex items-center gap-1 disabled:opacity-50"
                            >
                                {isParsing ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10} />}
                                AI Parse to Sections
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleUpdatePolicy({ fileName: undefined, fileBase64: undefined, fileMimeType: undefined })}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Viewer Modal */}
              {showViewer && activePolicy.fileBase64 && (
                <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-10 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl h-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                            <h3 className="font-black uppercase tracking-[0.2em] text-sm flex items-center gap-3">
                                <FileText size={20} className="text-coral-400" /> {activePolicy.fileName}
                            </h3>
                            <button onClick={() => setShowViewer(false)} className="text-white/50 hover:text-white transition-colors"><X size={24} /></button>
                        </div>
                        <div className="flex-1 bg-slate-100 p-4">
                            {activePolicy.fileMimeType === 'application/pdf' ? (
                                <iframe 
                                    src={activePolicy.fileBase64} 
                                    className="w-full h-full rounded-2xl border-none"
                                    title="Document Viewer"
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                        <AlertTriangle size={32} className="text-amber-500" />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Preview Not Available</h4>
                                    <p className="text-sm text-slate-500 mt-2 max-w-md font-medium leading-relaxed">
                                        This file type ({activePolicy.fileMimeType}) cannot be previewed directly. 
                                        Use "AI Parse to Sections" to extract the content into the editor.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              )}

              {/* Right: AI Analysis */}
              <div className="lg:col-span-5 flex flex-col bg-slate-50/50 overflow-hidden">
                <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Sparkles size={14} className="text-coral-600" /> AI Compliance Audit
                  </div>
                  {activePolicy.analysisResult && (
                    <button 
                      onClick={() => handleUpdatePolicy({ analysisResult: undefined })}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-coral-600 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  {!activePolicy.analysisResult && !isAuditing ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10">
                      <div className="w-20 h-20 bg-white rounded-[2rem] border border-slate-200 flex items-center justify-center mb-6 shadow-sm">
                        <Search size={32} className="text-slate-200" />
                      </div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Awaiting Analysis</h4>
                      <p className="text-xs text-slate-400 mt-2 max-w-[200px] font-medium leading-relaxed">
                        Click "AI Audit" to analyze this document against {activeFrameworkId} controls.
                      </p>
                    </div>
                  ) : isAuditing ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10">
                      <div className="relative mb-8">
                        <div className="w-24 h-24 border-4 border-blue-100 rounded-full animate-ping absolute inset-0"></div>
                        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl relative z-10">
                          <Sparkles size={32} className="text-white animate-pulse" />
                        </div>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">AI Auditor Working...</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4">Mapping controls to content</p>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-h2:text-sm prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2 prose-p:text-xs prose-p:leading-relaxed prose-li:text-xs">
                        <ReactMarkdown>{activePolicy.analysisResult || ''}</ReactMarkdown>
                      </div>
                      
                      <div className="mt-6 flex gap-3">
                        <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                          <ClipboardList size={14}/> Sync to POAM
                        </button>
                        <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
                          <Download size={18}/>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <div className="w-32 h-32 bg-white rounded-[3rem] border border-slate-200 flex items-center justify-center mb-10 shadow-xl shadow-slate-200/50">
              <BookOpen size={48} className="text-slate-200" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Policy Repository</h2>
            <p className="max-w-md text-slate-500 font-medium leading-relaxed mb-10">
              Select a document from the sidebar to view or edit, or create a new policy to begin building your compliance documentation.
            </p>
            <button 
              onClick={handleCreatePolicy}
              className="bg-coral-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-coral-200 hover:bg-coral-700 transition-all flex items-center gap-3"
            >
              <Plus size={20} /> Create First Policy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

