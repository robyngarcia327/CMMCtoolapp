
import React, { useState, useEffect } from 'react';
import { generateComplianceDocument } from '../services/gemini';
import { publishToConfluence } from '../services/atlassian';
import { Wand2, Save, Copy, FileText, Loader2, Shield, ShieldCheck, AlertTriangle, BookOpen, Activity, UploadCloud, Printer, Edit3, Eye, RefreshCw, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ConfluenceConfig, Requirement, Artifact, BrandingConfig, SspMetadata } from '../types';

interface DocTemplate {
  id: string;
  title: string;
  type: 'Plan' | 'Report';
  icon: React.ReactNode;
  description: string;
  standardCitation: string;
  questions: string[];
}

const TEMPLATES: DocTemplate[] = [
  {
    id: 'ssp',
    title: 'System Security Plan (SSP)',
    type: 'Plan',
    icon: <ShieldCheck className="text-blue-500" />,
    description: 'Formal document defined by NIST 800-18 describing system boundary, operational environment, and control implementation.',
    standardCitation: 'NIST SP 800-18 REV 1 ALIGNED',
    questions: [
      "1. Information System Name and Identifier",
      "2. Information System Categorization (FIPS 199 Impact)",
      "3. Information System Owner Information",
      "4. Authorizing Official Information",
      "5. Other Designated Contacts (POCs)",
      "6. Assignment of Security Responsibility",
      "7. Information System Operational Status (Operational, Under Dev, etc.)",
      "8. Information System Type (Major Application or GSS)",
      "9. General System Description/Purpose",
      "10. System Environment (Hardware/Software/Comms)",
      "11. System Interconnections / Information Sharing (ISA/MOU)",
      "12. Related Laws, Regulations, and Policies",
      "13. Implementation Statement (Detailed description of controls)",
      "14. Completion Date",
      "15. Approval Date"
    ]
  },
  {
    id: 'irp',
    title: 'Incident Response Plan (IRP)',
    type: 'Plan',
    icon: <AlertTriangle className="text-orange-500" />,
    description: 'Standalone organizational policy for detecting, responding to, and limiting security incidents per NIST 800-61.',
    standardCitation: 'NIST SP 800-61 REV 2 ALIGNED',
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
    description: 'Processes to restore critical IT assets and business operations after a disaster per NIST 800-34.',
    standardCitation: 'NIST SP 800-34 REV 1 ALIGNED',
    questions: [
      "Company Name",
      "Critical Business Functions",
      "Recovery Time Objective (RTO)",
      "Recovery Point Objective (RPO)",
      "Backup Strategy (Frequency, Locations)",
      "Alternative Processing Site (if any)",
      "Emergency Contact List Location"
    ]
  }
];

interface DocGeneratorProps {
  clientName?: string;
  clientBranding?: BrandingConfig;
  mspBranding?: BrandingConfig;
  confluenceConfig?: ConfluenceConfig;
  requirements: Requirement[];
  artifacts: Artifact[];
  sspMetadata?: SspMetadata;
}

export const DocGenerator: React.FC<DocGeneratorProps> = ({ clientName, clientBranding, mspBranding, confluenceConfig, requirements, artifacts, sspMetadata }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [viewMode, setViewMode] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  const [isPublishing, setIsPublishing] = useState(false);

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];

  // Auto-fill metadata if available
  useEffect(() => {
    if (selectedTemplateId === 'ssp' && sspMetadata) {
        setAllAnswers(prev => ({
            ...prev,
            "1. Information System Name and Identifier": `${sspMetadata.systemName} (${sspMetadata.systemIdentifier})`,
            "2. Information System Categorization (FIPS 199 Impact)": sspMetadata.categorization,
            "7. Information System Operational Status (Operational, Under Dev, etc.)": sspMetadata.operationalStatus,
            "8. Information System Type (Major Application or GSS)": sspMetadata.systemType,
            "9. General System Description/Purpose": sspMetadata.generalDescription,
            "10. System Environment (Hardware/Software/Comms)": sspMetadata.systemEnvironment,
            "12. Related Laws, Regulations, and Policies": sspMetadata.lawsAndPolicies
        }));
    }
  }, [selectedTemplateId, sspMetadata]);

  const handleInputChange = (question: string, value: string) => {
    setAllAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const relevantAnswers: Record<string, string> = {};
    
    selectedTemplate.questions.forEach(q => {
        relevantAnswers[q] = allAnswers[q] || "";
    });

    if (selectedTemplate.id === 'ssp' && requirements) {
        const assessmentContext = requirements
            .filter(r => (r.response && r.response.length > 5) || artifacts.some(a => a.requirementId === r.id))
            .map(r => {
                const proof = artifacts.filter(a => a.requirementId === r.id);
                const proofList = proof.length > 0 
                    ? `Evidence: ${proof.map(p => `[${p.name}]`).join(', ')}`
                    : "No digital evidence attached.";
                
                return `## Control ${r.id}: ${r.title}\nImplementation: ${r.response || "Not implemented."}\n${proofList}`;
            })
            .join('\n\n');
        
        if (assessmentContext) {
            relevantAnswers['Audit_Intelligence_Context'] = assessmentContext;
        }
    }

    const result = await generateComplianceDocument(selectedTemplate.type, selectedTemplate.title, relevantAnswers);
    setGeneratedDoc(result);
    setIsGenerating(false);
    setViewMode('PREVIEW');
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
    <div className="max-w-7xl mx-auto p-6 overflow-y-auto h-full text-slate-900">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Policy Center</h2>
            <p className="text-slate-600 font-medium">
            Generate professional documentation based on federal NIST standards.
            </p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl">
            <button 
                onClick={() => setViewMode('EDIT')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'EDIT' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Edit3 size={16} /> Data Entry
            </button>
            <button 
                onClick={() => setViewMode('PREVIEW')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'PREVIEW' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Eye size={16} /> Document View
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {viewMode === 'EDIT' && (
            <div className="lg:col-span-3 space-y-3">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Document Library</h3>
                {TEMPLATES.map(template => (
                    <button
                        key={template.id}
                        onClick={() => setSelectedTemplateId(template.id)}
                        className={`w-full text-left p-4 rounded-xl flex items-start gap-3 transition-all border-2 ${
                            selectedTemplateId === template.id 
                            ? 'bg-blue-50 border-blue-600 shadow-md' 
                            : 'bg-white border-transparent hover:border-slate-200'
                        }`}
                    >
                        <div className="mt-1">{template.icon}</div>
                        <div>
                            <div className={`text-sm font-bold ${selectedTemplateId === template.id ? 'text-blue-900' : 'text-slate-700'}`}>
                                {template.title}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">
                                {template.description}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        )}

        {viewMode === 'EDIT' && (
            <div className="lg:col-span-5 flex flex-col h-full">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
                    <div className="mb-6 border-b border-slate-100 pb-4">
                        <h3 className="font-black text-xl text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                            {selectedTemplate.icon}
                            {selectedTemplate.title}
                        </h3>
                        <div className="mt-3 text-[10px] bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-bold flex items-center gap-2 border border-blue-100">
                            <Info size={14} /> Alignment: {selectedTemplate.standardCitation}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                        {selectedTemplate.questions.map((q) => (
                            <div key={q} className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{q}</label>
                                <textarea 
                                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-4 text-sm min-h-[90px] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                    placeholder={`Required info for ${q}...`}
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
                            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl transition-all shadow-xl disabled:opacity-50 uppercase tracking-widest text-xs"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={20}/> : <Wand2 size={20} />}
                            {isGenerating ? 'Synthesizing...' : `Generate Draft`}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {viewMode === 'EDIT' && (
            <div className="lg:col-span-4 bg-slate-900 p-8 rounded-2xl shadow-inner border border-slate-800 flex flex-col h-full min-h-[600px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-widest text-xs">
                    <FileText size={18} className="text-blue-500"/> MarkDown Editor
                    </h3>
                    <div className="flex gap-2">
                        {generatedDoc && (
                            <button 
                                onClick={() => navigator.clipboard.writeText(generatedDoc)}
                                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                                title="Copy Markdown"
                            >
                                <Copy size={20} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 bg-slate-800/50 p-4 rounded-xl border border-slate-700 overflow-hidden relative">
                    <textarea 
                        className="w-full h-full resize-none outline-none text-[11px] font-mono text-blue-100/80 bg-transparent p-2 leading-relaxed"
                        value={generatedDoc}
                        onChange={(e) => setGeneratedDoc(e.target.value)}
                        placeholder="# Your generated document will appear here after clicking 'Generate'..."
                    />
                </div>
            </div>
        )}

        {viewMode === 'PREVIEW' && (
            <div className="col-span-12 flex flex-col items-center">
                <div className="w-full max-w-[21cm] mb-6 flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-200 print:hidden">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-all">
                            <Printer size={18} /> Export as PDF
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        {confluenceConfig?.enabled && (
                            <button 
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg"
                            >
                                {isPublishing ? <Loader2 className="animate-spin" size={16}/> : <UploadCloud size={16}/>}
                                Push to Confluence
                            </button>
                        )}
                        <button onClick={() => setViewMode('EDIT')} className="text-slate-500 hover:text-slate-800 text-sm font-bold uppercase tracking-widest mx-4">
                            Back to Editor
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow-2xl w-full max-w-[21cm] min-h-[29.7cm] p-[2.5cm] relative print:shadow-none print:w-full print:max-w-none rounded-2xl mb-12">
                    {generatedDoc ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col h-[23cm] justify-between text-center border-b-8 border-slate-900 mb-12 pb-12 page-break-after">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 text-slate-900 font-black text-xl">
                                        <Shield className="text-blue-600" size={32} />
                                        <span>Cuallee Cyber</span>
                                    </div>
                                    {clientBranding?.logoUrl && (
                                        <img src={clientBranding.logoUrl} className="h-16 object-contain" alt="Client Logo" />
                                    )}
                                </div>
                                <div className="mt-24">
                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">
                                        {selectedTemplate.standardCitation}
                                    </div>
                                    <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">{selectedTemplate.title}</h1>
                                    <div className="w-32 h-2 bg-blue-600 mx-auto mb-8"></div>
                                    <h2 className="text-3xl text-slate-500 font-medium tracking-tight italic">{clientName || 'Client Name'}</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="inline-block border-2 border-red-600 px-6 py-2 text-red-600 font-black tracking-widest text-sm uppercase">CUI / INTERNAL USE ONLY</div>
                                    <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-8">
                                        <p>Date: {new Date().toLocaleDateString()}</p>
                                        <p>Document UID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:border-b-2 prose-h2:pb-3 prose-p:text-slate-700 prose-p:leading-relaxed prose-strong:text-slate-900 prose-li:text-slate-700">
                                <ReactMarkdown>{generatedDoc}</ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[20cm] flex flex-col items-center justify-center text-slate-300">
                            <div className="bg-slate-50 p-8 rounded-full mb-6">
                                <FileText size={64} className="opacity-20" />
                            </div>
                            <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Awaiting Synthesis</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
