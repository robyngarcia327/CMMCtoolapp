
import React, { useState, useEffect } from 'react';
import { generateComplianceDocument } from '../services/gemini';
import { publishToConfluence } from '../services/atlassian';
import { Wand2, Save, Copy, FileText, Loader2, ShieldCheck, AlertTriangle, BookOpen, Activity, UploadCloud } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ConfluenceConfig } from '../types';

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
  confluenceConfig?: ConfluenceConfig;
}

export const DocGenerator: React.FC<DocGeneratorProps> = ({ clientName, confluenceConfig }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState('');
  
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
    selectedTemplate.questions.forEach(q => {
        relevantAnswers[q] = allAnswers[q] || "";
    });

    const result = await generateComplianceDocument(selectedTemplate.type, selectedTemplate.title, relevantAnswers);
    setGeneratedDoc(result);
    setIsGenerating(false);
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Compliance Document Generator</h2>
        <p className="text-slate-600">
          Select a document type, answer the guided interview questions, and generate audit-ready drafts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Template Selector Sidebar */}
        <div className="lg:col-span-3 space-y-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Document Types</h3>
            {TEMPLATES.map(template => (
                <button
                    key={template.id}
                    onClick={() => {
                        setSelectedTemplateId(template.id);
                        setGeneratedDoc(''); // Clear previous doc to avoid confusion
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

        {/* Center: Interview Form */}
        <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
                <div className="mb-6 border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        {selectedTemplate.icon}
                        {selectedTemplate.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Please provide details below to customize your document.</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
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

        {/* Right: Output */}
        <div className="lg:col-span-4 bg-slate-50 p-6 rounded-xl shadow-inner border border-slate-200 flex flex-col h-full min-h-[600px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-blue-600"/> Generated Draft
            </h3>
            <div className="flex gap-2">
                {generatedDoc && (
                    <button 
                        onClick={() => navigator.clipboard.writeText(generatedDoc)}
                        className="text-slate-500 hover:text-blue-600 transition-colors p-2 hover:bg-slate-200 rounded"
                        title="Copy to clipboard"
                    >
                        <Copy size={20} />
                    </button>
                )}
            </div>
          </div>

          <div className="flex-1 bg-white p-6 rounded-lg border border-slate-200 overflow-y-auto prose prose-slate prose-sm max-w-none shadow-sm">
            {generatedDoc ? (
              <ReactMarkdown>{generatedDoc}</ReactMarkdown>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
                <Wand2 size={48} className="mb-4 opacity-20" />
                <p className="font-medium">Ready to Draft</p>
                <p className="text-sm mt-2">Fill out the questionnaire and click generate to create your {selectedTemplate.title}.</p>
              </div>
            )}
          </div>
          
          {generatedDoc && (
            <div className="mt-4 flex flex-col gap-3">
                 <div className="text-xs text-slate-500 text-center bg-yellow-50 p-2 rounded border border-yellow-100 text-yellow-700">
                    <span className="font-bold">Disclaimer:</span> This is an AI-generated draft. Review before official use.
                </div>
                {confluenceConfig?.enabled ? (
                    <button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200 font-semibold py-2 rounded-lg transition-all"
                    >
                         {isPublishing ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
                         Publish to Confluence
                    </button>
                ) : (
                    <div className="text-center text-xs text-slate-400">
                        Enable Confluence in Settings to publish directly.
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
