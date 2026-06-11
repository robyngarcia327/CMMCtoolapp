import React, { useState } from 'react';
// Fixed error: Removed non-existent import CCP_BLUEPRINT_DOMAINS and unused NIST_CMMC_FAMILIES from standards data
import { TRAINING_MODULES } from '../data/standards';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  Target, 
  Library,
  Star,
  Zap,
  Info
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const TrainingCenter: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'BLUEPRINT' | 'DOMAINS'>('BLUEPRINT');
  
  const activeModule = TRAINING_MODULES.find((m: any) => m.id === activeModuleId);

  // Filter modules based on view mode
  const displayedModules = viewMode === 'BLUEPRINT' 
    ? TRAINING_MODULES.filter(m => m.familyId.startsWith('CCP'))
    : TRAINING_MODULES.filter(m => !m.familyId.startsWith('CCP'));

  return (
    <div className="max-w-7xl mx-auto p-8 h-full flex flex-col space-y-8 overflow-hidden">
        {/* Certification Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm shrink-0">
            <div>
                <div className="flex items-center gap-2 text-coral-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                    <Award size={14}/> Professional Certification Path
                </div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                    CMMC Academy <span className="text-slate-300 font-medium">/</span> CCP Prep
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Master the CCP Test Blueprint and NIST 800-171 Control Families.</p>
            </div>

            <div className="flex bg-silver-100 p-1 rounded-2xl border border-silver-200">
                <button 
                    onClick={() => { setViewMode('BLUEPRINT'); setActiveModuleId(null); }}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'BLUEPRINT' ? 'bg-coral-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Blueprint Domains
                </button>
                <button 
                    onClick={() => { setViewMode('DOMAINS'); setActiveModuleId(null); }}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'DOMAINS' ? 'bg-coral-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Control Masterclasses
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
            
            {/* Navigation Drawer */}
            <div className={`lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 ${activeModule ? 'hidden lg:flex' : 'flex'}`}>
                
                {/* Stats Widget */}
                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-coral-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="text-[10px] font-black text-coral-400 uppercase tracking-widest mb-4">Course Progress</div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black">12%</span>
                            <span className="text-xs text-coral-300 mb-1">Mastery Score</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-coral-500 transition-all duration-1000" style={{ width: '12%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Course Modules</h3>
                    {displayedModules.map((module: any) => (
                        <button
                            key={module.id}
                            onClick={() => setActiveModuleId(module.id)}
                            className={`w-full text-left p-5 rounded-2xl border transition-all group flex gap-4 ${
                                activeModuleId === module.id 
                                ? 'bg-coral-50 border-coral-600 shadow-md ring-1 ring-coral-100' 
                                : 'bg-white border-slate-200 hover:border-coral-300'
                            }`}
                        >
                            <div className={`p-3 rounded-xl h-fit transition-colors ${
                                activeModuleId === module.id ? 'bg-coral-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {viewMode === 'BLUEPRINT' ? <Target size={18}/> : <ShieldCheck size={18}/>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-black text-xs uppercase tracking-tight ${activeModuleId === module.id ? 'text-coral-900' : 'text-slate-800'}`}>
                                        {module.title}
                                    </h4>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{module.description}</p>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                        <Clock size={10} /> {module.durationMinutes}m
                                    </span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${
                                        module.difficulty === 'Beginner' ? 'bg-green-50 text-green-700 border-green-100' :
                                        module.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                        {module.difficulty}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Display Area */}
            <div className="lg:col-span-8 h-full min-h-0">
                {activeModule ? (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                            <div>
                                <button 
                                    onClick={() => setActiveModuleId(null)} 
                                    className="lg:hidden text-xs font-black text-coral-600 mb-2 uppercase tracking-widest flex items-center gap-1"
                                >
                                    ← Back to Syllabus
                                </button>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{activeModule.title}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">{activeModule.familyId} Module</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                                        <Zap size={10} className="text-coral-500"/> Blueprint Task Alignment
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                                    <Star size={18}/>
                                </button>
                                <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                                    <Library size={18}/>
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                            <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-4 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-li:text-slate-600 prose-code:text-coral-600 prose-code:bg-coral-50 prose-code:px-1 prose-code:rounded">
                                <ReactMarkdown>{activeModule.content}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6 shrink-0">
                            <div className="flex items-center gap-3 bg-coral-50/50 border border-coral-100 px-4 py-3 rounded-2xl text-coral-800 text-xs font-medium">
                                <Info size={16} className="shrink-0" />
                                Review implementation narratives in the 'Mission Control' to see these concepts in practice.
                            </div>
                            <button className="bg-coral-600 hover:bg-coral-700 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-coral-200 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                                <CheckCircle2 size={16} /> Complete Module
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full bg-slate-50/50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                            <GraduationCap size={48} className="opacity-20" />
                        </div>
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Select Course Content</h3>
                        <p className="max-w-xs mt-3 text-sm font-medium leading-relaxed">Choose a Blueprint Domain or Control Masterclass from the syllabus to begin your training session.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
