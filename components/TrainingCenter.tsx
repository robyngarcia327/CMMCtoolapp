
import React, { useState } from 'react';
import { TRAINING_MODULES, NIST_FAMILIES } from '../data/standards';
import { BookOpen, PlayCircle, Clock, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const TrainingCenter: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  
  const activeModule = TRAINING_MODULES.find(m => m.id === activeModuleId);

  // Group modules by family
  const familiesWithTraining = NIST_FAMILIES.filter(f => 
      TRAINING_MODULES.some(m => m.familyId === f.id)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="text-blue-600" /> Technician Training Center
                </h1>
                <p className="text-slate-600">
                    Deep-dive technical training to understand the "Why" and "How" of compliance.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            
            {/* Library / List */}
            <div className={`lg:col-span-4 space-y-6 ${activeModule ? 'hidden lg:block' : ''}`}>
                {familiesWithTraining.map(family => (
                    <div key={family.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-700">{family.id} - {family.name}</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {TRAINING_MODULES.filter(m => m.familyId === family.id).map(module => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveModuleId(module.id)}
                                    className={`w-full text-left p-4 hover:bg-blue-50 transition-colors group ${activeModuleId === module.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-semibold text-sm ${activeModuleId === module.id ? 'text-blue-900' : 'text-slate-800'}`}>
                                            {module.title}
                                        </h4>
                                        {activeModuleId === module.id && <ChevronRight size={16} className="text-blue-500" />}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{module.description}</p>
                                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {module.durationMinutes} min</span>
                                        <span className={`px-1.5 py-0.5 rounded ${module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {module.difficulty}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Viewer */}
            <div className="lg:col-span-8 h-full">
                {activeModule ? (
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4">
                        <div className="p-6 border-b border-slate-100 bg-slate-50">
                            <button 
                                onClick={() => setActiveModuleId(null)} 
                                className="lg:hidden text-sm text-blue-600 mb-2 font-medium"
                            >
                                ← Back to Library
                            </button>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeModule.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">{activeModule.familyId}</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> {activeModule.durationMinutes} min read</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 prose prose-slate max-w-none">
                            <ReactMarkdown>{activeModule.content}</ReactMarkdown>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                            <span className="text-sm text-slate-500 italic">Read carefully to understand the technical requirements.</span>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105">
                                <CheckCircle2 size={18} /> Mark Complete
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <BookOpen size={64} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">Select a training module to begin.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
