import React, { useState, useEffect } from 'react';
import { generateComplianceDocument } from '../services/gemini';
import { publishToConfluence } from '../services/atlassian';
import { Wand2, Save, Copy, FileText, Loader2, ShieldCheck, AlertTriangle, BookOpen, Activity, UploadCloud, Printer, Edit3, Eye, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ConfluenceConfig, Client, BrandingConfig, Requirement } from '../types';

interface DocTemplate {
  id: string;
  title: string;
  type: 'Plan' | 'Report';
  icon: React.ReactNode;
  description: string;
  questions: string[];
}

const TEMPLATES: DocTemplate[] = [
  {
    id: 'ssp',
    title: 'System Security Plan (SSP)',
    type: 'Plan',
    icon: <ShieldCheck className="text-blue-500" />,
    description: 'The primary document describing the system boundary, operational environment, and implementation of security controls.',
    questions: [
      "Company Name",
      "System Name",
      "System Owner (Name/Title)",
      "General System Description",
      "Types of Information Processed (e.g., CUI, FCI)",
      "System Boundary Description (Network/Physical)",
      "Locations where CUI is stored",
      "Cloud Service Providers used (e.g., AWS, Azure, O365)"
    ]
  },
  {
    id: 'irp',
    title: 'Incident Response Plan (IRP)',
    type: 'Plan',
    icon: <AlertTriangle className="text-orange-500" />,
    description: 'Procedures for detecting, responding to, and limiting the effect of security incidents.',
    questions: [
      "Company Name",
      "Incident Response Team (Roles/Titles)",
      "Incident Reporting Method (e.g., email, ticketing system)",
      "External Notification Requirements (e.g., DoD within 72 hours)",
      "Containment Strategy for Malware",
      "Eradication & Recovery Procedures",
      "Testing & Training Frequency"
    ]
  },
  {
    id: 'drp',
    title: 'Disaster Recovery Plan (DRP)',
    type: 'Plan',
    icon: <Activity className="text-red-500" />,
    description: 'Processes to restore critical IT assets and business operations after a disaster.',
    questions: [
      "Company Name",
      "Critical Business Functions",
      "Recovery Time Objective (RTO)",
      "Recovery Point Objective (RPO)",
      "Backup Strategy (Frequency, Locations)",
      "Alternative Processing Site (if any)",
      "Emergency Contact List Location"
    ]
  },
  {
    id: 'tabletop',
    title: 'Table Top Exercise Report',
    type: 'Report',
    icon: <BookOpen className="text-purple-500" />,
    description: 'A report documenting a simulation exercise to test the IRP.',
    questions: [
      "Date of Exercise",
      "Exercise Facilitator",
      "Participants (Names/Roles)",
      "Scenario Tested (e.g., Ransomware, Insider Threat)",
      "Objectives of the Exercise",
      "Key Findings & Observations",
      "Gaps Identified in Current Plans",
      "Action Items for Improvement"
    ]
  },
  {
    id: 'lessons_learned',
    title: 'Lessons Learned / After Action',
    type: 'Report',
    icon: <FileText className="text-green-500" />,
    description: 'Formal documentation of a security incident or event to prevent recurrence.',
    questions: [
      "Company Name",
      "Incident Reference ID/Date",
      "Brief Incident Summary",
      "Root Cause Analysis (Why did it happen?)",
      "What went well during the response?",
      "What did not go well?",
      "Corrective Actions Implemented"
    ]
  }
];

interface DocGeneratorProps {
  clientName?: string;
  clientBranding?: BrandingConfig;
  mspBranding?: BrandingConfig;
  confluenceConfig?: ConfluenceConfig;
  requirements: Requirement[]; // Added this required prop
}

export const DocGenerator: React.FC<DocGeneratorProps> = ({ clientName, clientBranding, mspBranding, confluenceConfig, requirements }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [viewMode, setViewMode] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  
  const [isPublishing, setIsPublishing] = useState(false);

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];

  // Auto-fill company name if clientName changes
  useEffect(() => {
    if (clientName) {
      setAllAnswers(prev => ({ ...prev, "Company Name": clientName }));
    }
  }, [clientName]);

  const handleInputChange = (question: string, value: string) => {
    setAllAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const relevantAnswers: Record<string, string> = {};
    
    // 1. Manual Answers
    selectedTemplate.questions.forEach(q => {
        relevantAnswers[q] = allAnswers[q] || "";
    });

    // 2. Auto-Fill for SSP (Live Data)
    if (selectedTemplate.id === 'ssp' && requirements) {
        const assessmentContext = requirements
            .filter(r => r.response && r.response.length > 5)
            .map(r => `Control ${r.id}: ${r.response}`)
            .join('\n');
        
        if (assessmentContext) {
            relevantAnswers['Assessment_Data_Dump'] = assessmentContext;
        }
    }

    const result = await generateComplianceDocument(selectedTemplate.type, selectedTemplate.title, relevantAnswers);
    setGeneratedDoc(result);
    setIsGenerating(false);
    setViewMode('PREVIEW'); // Switch to preview automatically
  };

  const handlePublish = async () => {
    if (!confluenceConfig || !confluenceConfig.enabled) return;
    setIsPublishing(true);
    try {
        const url = await publishToConfluence(
            `${selectedTemplate.title} - ${new Date().toISOString().split('T')[0]}`,
            generatedDoc,
            confluenceConfig
        );
        alert(`Published to Confluence successfully!\nURL: ${url}`);
    } catch (e) {
        alert("Failed to publish to Confluence.");
    } finally {
        setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Compliance Document Generator</h2>
            <p className="text-slate-600">
            Generate professional, dual-branded policies and reports.
            </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
                onClick={() => setViewMode('EDIT')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'EDIT' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Edit3 size={16} /> Draft
            </button>
            <button 
                onClick={() => setViewMode('PREVIEW')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'PREVIEW' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Eye size={16} /> Print Preview
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Template Selector Sidebar (Visible in Edit Mode, Hidden in Preview to give space) */}
        {viewMode === 'EDIT' && (
            <div className="lg:col-span-3 space-y-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Document Types</h3>
                {TEMPLATES.map(template => (
                    <button
                        key={template.id}
                        onClick={() => {
                            setSelectedTemplateId(template.id);
                            // Keep generated doc if it matches template, else maybe warn?
                        }}
                        className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all ${
                            selectedTemplateId === template.id 
                            ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                            : 'hover:bg-slate-100 border border-transparent'
                        }`}
                    >
                        <div className="mt-0.5">{template.icon}</div>
                        <div>
                            <div className={`text-sm font-semibold ${selectedTemplateId === template.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                {template.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {template.description}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        )}

        {/* Center: Interview Form (Edit Mode) */}
        {viewMode === 'EDIT' && (
            <div className="lg:col-span-5 flex flex-col h-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
                    <div className="mb-6 border-b border-slate-100 pb-4">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            {selectedTemplate.icon}
                            {selectedTemplate.title}
                        </h3>
                        {selectedTemplate.id === 'ssp' && (
                            <div className="mt-2 text-xs bg-green-50 text-green-700 p-2 rounded flex items-center gap-2">
                                <RefreshCw size={14} /> Live Sync Enabled: Will ingest assessment data.
                            </div>
                        )}
                        <p className="text-sm text-slate-500 mt-1">Please provide details below to customize your document.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 max-h-[600px]">
                        {selectedTemplate.questions.map((q) => (
                            <div key={q} className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">{q}</label>
                                <textarea 
                                    className="w-full border border-slate-300 rounded-lg p-3 text-sm min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                    placeholder={`Enter ${q.toLowerCase()}...`}
                                    value={allAnswers[q] || ''}
                                    onChange={(e) => handleInputChange(q, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 mt-4 border-t border-slate-100">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all shadow-sm disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={20}/> : <Wand2 size={20} />}
                            {isGenerating ? 'Generating Draft...' : `Generate ${selectedTemplate.type}`}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Right: Output (Edit Mode - Raw Markdown) */}
        {viewMode === 'EDIT' && (
            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-xl shadow-inner border border-slate-200 flex flex-col h-full min-h-[600px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600"/> Content Editor
                    </h3>
                    <div className="flex gap-2">
                        {generatedDoc && (
                            <button 
                                onClick={() => navigator.clipboard.writeText(generatedDoc)}
                                className="text-slate-500 hover:text-blue-600 transition-colors p-2 hover:bg-slate-200 rounded"
                                title="Copy Markdown"
                            >
                                <Copy size={20} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 bg-white p-4 rounded-lg border border-slate-200 overflow-hidden relative">
                    <textarea 
                        className="w-full h-full resize-none outline-none text-sm font-mono text-slate-600 p-2"
                        value={generatedDoc}
                        onChange={(e) => setGeneratedDoc(e.target.value)}
                        placeholder="# Your generated document will appear here..."
                    />
                </div>
            </div>
        )}

        {/* --- PREVIEW MODE (Full Width) --- */}
        {viewMode === 'PREVIEW' && (
            <div className="col-span-12 flex flex-col items-center">
                
                {/* Actions Toolbar */}
                <div className="w-full max-w-[21cm] mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 print:hidden">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.print()} className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium">
                            <Printer size={18} /> Print / PDF
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        {confluenceConfig?.enabled && (
                            <button 
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 flex items-center gap-2"
                            >
                                {isPublishing ? <Loader2 className="animate-spin" size={16}/> : <UploadCloud size={16}/>}
                                Push to Confluence
                            </button>
                        )}
                        <button onClick={() => setViewMode('EDIT')} className="text-slate-500 hover:text-slate-800 text-sm underline">
                            Back to Editor
                        </button>
                    </div>
                </div>

                {/* The "Paper" */}
                <div className="bg-white shadow-2xl w-full max-w-[21cm] min-h-[29.7cm] p-[2cm] relative print:shadow-none print:w-full print:max-w-none">
                    
                    {generatedDoc ? (
                        <>
                            {/* --- COVER PAGE --- */}
                            <div className="flex flex-col h-[25cm] justify-between text-center border-b-2 border-slate-100 mb-10 pb-10 page-break-after">
                                {/* Logos */}
                                <div className="flex justify-between items-start px-4">
                                    {mspBranding?.logoUrl ? (
                                        <img src={mspBranding.logoUrl} className="h-16 object-contain" alt="MSP Logo" />
                                    ) : (
                                        <div className="h-16 w-32 bg-slate-100 flex items-center justify-center text-slate-400 text-xs rounded">MSP Logo</div>
                                    )}
                                    
                                    {clientBranding?.logoUrl ? (
                                        <img src={clientBranding.logoUrl} className="h-16 object-contain" alt="Client Logo" />
                                    ) : (
                                        <div className="h-16 w-32 bg-slate-100 flex items-center justify-center text-slate-400 text-xs rounded">Client Logo</div>
                                    )}
                                </div>

                                {/* Title Block */}
                                <div className="my-20">
                                    <h1 className="text-4xl font-bold text-slate-900 mb-4 font-serif tracking-tight">{selectedTemplate.title}</h1>
                                    <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
                                    <h2 className="text-2xl text-slate-600 font-light">{clientName || 'Client Name'}</h2>
                                </div>

                                {/* Footer Info */}
                                <div className="text-slate-400 text-sm font-serif">
                                    <p>Classification: <strong>CUI / INTERNAL USE ONLY</strong></p>
                                    <p className="mt-2">Generated: {new Date().toLocaleDateString()}</p>
                                    <p>Version: 1.0</p>
                                </div>
                            </div>

                            {/* --- CONTENT --- */}
                            <div className="prose prose-slate max-w-none font-serif prose-headings:font-sans prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2 prose-p:text-justify prose-li:text-justify">
                                <ReactMarkdown>{generatedDoc}</ReactMarkdown>
                            </div>

                            {/* --- FOOTER (Repeating in print if possible, but hard in CSS) --- */}
                            <div className="mt-20 pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-400 font-sans print:fixed print:bottom-0 print:left-0 print:w-full print:px-8 print:bg-white">
                                <span>{clientName} - {selectedTemplate.title}</span>
                                <span>Page <span className="page-number"></span></span>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300">
                            <FileText size={64} className="mb-4 opacity-20" />
                            <p className="text-lg">No content generated yet.</p>
                            <button onClick={() => setViewMode('EDIT')} className="mt-4 text-blue-600 hover:underline">Go to Editor</button>
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};