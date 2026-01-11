import React, { useState, useMemo } from 'react';
import { TRAINING_MODULES, ACADEMY_PHASES } from '../data/standards';
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
  Info,
  Search,
  ArrowRight,
  Sparkles,
  MessageCircle,
  FileText,
  PlayCircle,
  Trophy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const CmmcAcademy: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activePhaseId, setActivePhaseId] = useState<string>(ACADEMY_PHASES[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  
  const activeModule = TRAINING_MODULES.find((m: any) => m.id === activeModuleId);

  // Filter modules based on search and selected phase
  const displayedModules = useMemo(() => {
    return TRAINING_MODULES.filter(m => {
        const matchesPhase = m.familyId === activePhaseId;
        const matchesSearch = searchTerm === '' || 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            m.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesPhase && matchesSearch;
    });
  }, [activePhaseId, searchTerm]);

  const getPhaseIcon = (iconName: string) => {
      switch(iconName) {
          case 'BookOpen': return <BookOpen size={18} />;
          case 'Target': return <Target size={18} />;
          case 'Shield': return <ShieldCheck size={18} />;
          case 'ClipboardCheck': return <FileText size={18} />;
          case 'Award': return <Award size={18} />;
          default: return <Library size={18} />;
      }
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
        
        {/* ACADEMY SIDEBAR (Course Map) */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
            <div className="p-8 border-b border-slate-100 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                        <GraduationCap size={24} />
                        <span className="font-black uppercase tracking-[0.2em] text-[10px]">CMMC Academy</span>
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight leading-none">Curriculum Map</h2>
                    <div className="mt-6 flex items-center justify-between">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Status</div>
                         <div className="text-[10px] font-black text-blue-400 uppercase">Level 1 Practitioner</div>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-blue-500 w-1/4 transition-all duration-1000"></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Learning Path Phases</h3>
                    <div className="space-y-1">
                        {ACADEMY_PHASES.map(phase => (
                            <button 
                                key={phase.id}
                                onClick={() => { setActivePhaseId(phase.id); setActiveModuleId(null); }}
                                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-all ${
                                    activePhaseId === phase.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`${activePhaseId === phase.id ? 'text-blue-100' : 'text-slate-400 group-hover:text-blue-600'}`}>
                                        {getPhaseIcon(phase.icon)}
                                    </div>
                                    <span className="text-xs font-bold">{phase.name}</span>
                                </div>
                                <ChevronRight size={14} className={`${activePhaseId === phase.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">CCP Exam Simulations</h3>
                    <div className="space-y-1">
                        <button className="w-full text-left px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-all border border-transparent hover:border-slate-200">
                             <Trophy size={18} className="text-amber-500" />
                             <span className="text-xs font-bold">Practice Assessment</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                 <div className="flex items-center gap-3 text-slate-400 mb-1">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Enrollment Status</span>
                 </div>
                 <div className="text-xs font-bold text-slate-900">Corporate Enterprise License</div>
            </div>
        </aside>

        {/* ACADEMY CONTENT AREA */}
        <main className="flex-1 flex flex-col h-full min-w-0 bg-white">
            
            {/* Header / Search */}
            <header className="h-20 border-b border-slate-100 px-10 flex items-center justify-between shrink-0">
                <div className="flex-1 max-w-xl">
                    <div className="relative group">
                        <Search className="absolute left-4 top-2.5 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input 
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                            placeholder="Search curriculum for ITAR, IT, Audit, etc..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100">
                        <Star size={14} className="fill-indigo-700" /> My Certifications
                    </button>
                    <div className="h-8 w-px bg-slate-200" />
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <PlayCircle size={24} />
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeModule ? (
                    <div className="max-w-4xl mx-auto py-12 px-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 mb-6">
                            <button 
                                onClick={() => setActiveModuleId(null)}
                                className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline"
                            >
                                ← Curriculum View
                            </button>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                {ACADEMY_PHASES.find(p => p.id === activePhaseId)?.name}
                            </span>
                        </div>

                        <div className="mb-12">
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">{activeModule.title}</h1>
                                <div className="flex gap-2">
                                    <span className="bg-slate-900 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">{activeModule.durationMinutes} min read</span>
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-200">{activeModule.difficulty}</span>
                                </div>
                            </div>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">{activeModule.description}</p>
                        </div>

                        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:border-b-2 prose-h2:border-slate-50 prose-h2:pb-4 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-li:text-slate-600 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded shadow-sm bg-white border border-slate-100 p-10 rounded-[2rem]">
                            <ReactMarkdown>{activeModule.content}</ReactMarkdown>
                        </div>

                        <div className="mt-12 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl flex-1 flex items-center gap-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                    <Sparkles className="text-blue-400" size={32} />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-lg font-black uppercase tracking-tight">Stuck on a concept?</h4>
                                    <p className="text-blue-200 text-sm font-medium mt-1">Ask our AI Academy Instructor for clarification or real-world examples.</p>
                                </div>
                                <button className="relative z-10 bg-white text-indigo-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2">
                                    <MessageCircle size={14} /> Open Instructor Chat
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 animate-in fade-in duration-500">
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center min-h-[600px]">
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-8 border border-slate-100 text-slate-300">
                                <Zap size={48} className="opacity-20" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Welcome to CMMC Academy</h2>
                            <p className="text-slate-500 max-w-md mt-4 text-lg font-medium leading-relaxed">
                                Our holistic training program bridges technical implementation with assessment professionalism. Select a module from your learning path to begin.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-3xl">
                                {displayedModules.map(module => (
                                    <button 
                                        key={module.id}
                                        onClick={() => setActiveModuleId(module.id)}
                                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-600 hover:shadow-xl transition-all text-left group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <PlayCircle size={18} />
                                            </div>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{module.durationMinutes}m</span>
                                        </div>
                                        <h3 className="font-black text-xs uppercase tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{module.title}</h3>
                                        <p className="text-[10px] text-slate-500 font-medium line-clamp-3 leading-relaxed">{module.description}</p>
                                        <div className="mt-4 flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            Begin Module <ArrowRight size={10} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};