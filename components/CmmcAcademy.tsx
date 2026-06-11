
import React, { useState, useMemo } from 'react';
// Fixed: Corrected imports from standards data
import { TRAINING_MODULES, ACADEMY_PHASES } from '../data/standards';
// Added: Import simulation interfaces from types.ts
import { SimulationModule, SimulationInject } from '../types';
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
  Trophy,
  ExternalLink,
  Dices,
  ShieldAlert,
  Users,
  Printer,
  ChevronLeft,
  FileBadge,
  Save,
  PenTool,
  History,
  HelpCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { QuizQuestion, ControlMastery } from '../types';

// --- SUBCOMPONENT: QUIZ RUNNER ---
const QuizRunner: React.FC<{
    questions: QuizQuestion[],
    onComplete: (score: number) => void,
    onCancel: () => void
}> = ({ questions, onComplete, onCancel }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questions[currentIndex];

    const handleNext = () => {
        if (selectedOption === currentQuestion.correctAnswerIndex) {
            setScore(prev => prev + 1);
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        const finalScore = Math.round((score / questions.length) * 100);
        return (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-coral-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Trophy size={48} className="text-coral-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Quiz Complete!</h2>
                <p className="text-slate-500 font-medium mb-8">You've completed the knowledge check for this module.</p>
                
                <div className="bg-slate-50 rounded-3xl p-8 mb-8">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Mastery Score</div>
                    <div className="text-6xl font-black text-coral-600">{finalScore}%</div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => onComplete(finalScore)}
                        className="flex-1 bg-coral-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-coral-700 transition-all"
                    >
                        Save & Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
                <button onClick={onCancel} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition-colors">Exit Quiz</button>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8 leading-tight">{currentQuestion.question}</h3>

            <div className="space-y-4 mb-8">
                {currentQuestion.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => !showExplanation && setSelectedOption(idx)}
                        disabled={showExplanation}
                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                            selectedOption === idx 
                                ? 'border-coral-600 bg-coral-50/50' 
                                : 'border-slate-100 hover:border-coral-200 bg-slate-50/30'
                        } ${showExplanation && idx === currentQuestion.correctAnswerIndex ? 'border-green-500 bg-green-50/50' : ''}
                          ${showExplanation && selectedOption === idx && idx !== currentQuestion.correctAnswerIndex ? 'border-red-500 bg-red-50/50' : ''}`}
                    >
                        <span className={`font-bold text-sm ${selectedOption === idx ? 'text-coral-700' : 'text-slate-600'}`}>
                            {option}
                        </span>
                        {showExplanation && idx === currentQuestion.correctAnswerIndex && <CheckCircle2 size={18} className="text-green-600" />}
                        {showExplanation && selectedOption === idx && idx !== currentQuestion.correctAnswerIndex && <AlertTriangle size={18} className="text-red-600" />}
                    </button>
                ))}
            </div>

            {showExplanation && (
                <div className="bg-coral-50 rounded-2xl p-6 mb-8 border border-coral-100 animate-in slide-in-from-top-2">
                    <h4 className="text-[10px] font-black text-coral-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Info size={14} /> Explanation
                    </h4>
                    <p className="text-sm text-coral-800 font-medium leading-relaxed">{currentQuestion.explanation}</p>
                </div>
            )}

            <button
                onClick={() => showExplanation ? handleNext() : setShowExplanation(true)}
                disabled={selectedOption === null}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all disabled:opacity-30"
            >
                {showExplanation ? (currentIndex === questions.length - 1 ? 'Finish' : 'Next Question') : 'Check Answer'}
            </button>
        </div>
    );
};

// --- SUBCOMPONENT: MASTERY DASHBOARD ---
const MasteryDashboard: React.FC<{ mastery: Record<string, ControlMastery> }> = ({ mastery }) => {
    const masteredCount = Object.values(mastery).filter(m => m.status === 'Mastered').length;
    const totalCount = 110; // CMMC Level 2 total controls
    const progress = Math.round((masteredCount / totalCount) * 100);

    return (
        <div className="p-10 space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-coral-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-coral-200 mb-6">Overall Mastery</h4>
                    <div className="flex items-end gap-3 mb-4">
                        <span className="text-6xl font-black leading-none">{progress}%</span>
                        <span className="text-coral-200 font-bold text-sm mb-2">Complete</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Mastered Controls</h4>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">{masteredCount}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Controls</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Learning Streak</h4>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
                            <Zap size={32} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">12 Days</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Learning</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Control Mastery Breakdown</h3>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div> Mastered
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <div className="w-2 h-2 bg-coral-500 rounded-full"></div> In Progress
                        </span>
                    </div>
                </div>
                <div className="p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {Array.from({ length: 110 }).map((_, i) => {
                        const controlId = `3.${Math.floor(i/10) + 1}.${(i % 10) + 1}`;
                        const m = mastery[controlId];
                        return (
                            <div 
                                key={i}
                                className={`h-12 rounded-xl flex items-center justify-center text-[10px] font-black transition-all border-2 ${
                                    m?.status === 'Mastered' ? 'bg-green-50 border-green-500 text-green-600' :
                                    m?.status === 'In Progress' ? 'bg-coral-50 border-coral-500 text-coral-600' :
                                    'bg-slate-50 border-slate-100 text-slate-300'
                                }`}
                                title={controlId}
                            >
                                {controlId.split('.').slice(1).join('.')}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- SUBCOMPONENT: SIMULATION RUNNER ---
const SimulationRunner: React.FC<{ 
    module: SimulationModule, 
    onExit: () => void 
}> = ({ module, onExit }) => {
    const [step, setStep] = useState<'SETUP' | 'SIM' | 'REPORT'>('SETUP');
    const [participants, setParticipants] = useState<string>('');
    const [injectIndex, setInjectIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [observation, setObservation] = useState('');

    const currentInject = module.injects[injectIndex];

    const handleNext = () => {
        if (injectIndex < module.injects.length - 1) {
            setInjectIndex(injectIndex + 1);
        } else {
            setStep('REPORT');
        }
    };

    const handleExport = () => {
        window.print();
    };

    if (step === 'SETUP') {
        return (
            <div className="max-w-3xl mx-auto py-12 px-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-red-900 text-white rounded-2xl shadow-xl shadow-red-900/20">
                            <Dices size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Simulation Setup</h2>
                            <p className="text-red-600 font-black text-[10px] uppercase tracking-widest mt-2">Leadership Guided Exercise</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Participants (Names & Titles)</label>
                            <textarea 
                                className="w-full h-32 border-2 border-slate-100 bg-slate-50 rounded-[2rem] p-6 focus:ring-4 focus:ring-red-500/10 focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-slate-900"
                                placeholder="e.g. John Doe (CEO), Jane Smith (CIO), Sarah Evans (CISO)..."
                                value={participants}
                                onChange={e => setParticipants(e.target.value)}
                            />
                            <p className="text-[10px] text-slate-400 mt-3 italic px-2">Assessor Tip: Ensure all key decision-makers are listed for training credit.</p>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                             <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-2">Scenario: {module.title}</h4>
                             <p className="text-sm text-slate-500 leading-relaxed font-medium">{module.description}</p>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={onExit} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Cancel Exercise</button>
                            <button 
                                onClick={() => setStep('SIM')}
                                disabled={!participants.trim()}
                                className="flex-[2] bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-red-100 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                            >
                                Begin Simulation <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'SIM') {
        return (
            <div className="max-w-4xl mx-auto py-12 px-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inject {injectIndex + 1} of {module.injects.length}</span>
                         <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${((injectIndex + 1) / module.injects.length) * 100}%` }} />
                         </div>
                    </div>
                    <span className="bg-red-900 text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest animate-pulse">Live Scenario</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 space-y-10">
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl relative overflow-hidden">
                             <div className="flex items-center gap-3 mb-6">
                                 <div className="p-2 bg-red-50 text-red-600 rounded-lg"><PenTool size={20} /></div>
                                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{currentInject.title}</h3>
                             </div>
                             <div className="bg-slate-900 text-red-400 p-6 rounded-2xl font-mono text-xs leading-relaxed mb-8 shadow-inner border border-slate-800">
                                 {currentInject.scenario}
                             </div>
                             
                             <div className="space-y-4">
                                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Organization Decision / Response</label>
                                 <textarea 
                                    className="w-full h-48 border-2 border-slate-100 bg-slate-50 rounded-[2rem] p-6 focus:ring-4 focus:ring-red-500/10 focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-slate-900"
                                    placeholder="Document the leadership team's consensus..."
                                    value={answers[currentInject.id] || ''}
                                    onChange={e => setAnswers({...answers, [currentInject.id]: e.target.value})}
                                 />
                             </div>
                        </div>

                        <div className="flex justify-between items-center px-4">
                             <button 
                                onClick={() => setInjectIndex(Math.max(0, injectIndex - 1))}
                                disabled={injectIndex === 0}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all"
                             >
                                <ChevronLeft size={16} /> Previous Inject
                             </button>
                             <button 
                                onClick={handleNext}
                                disabled={!answers[currentInject.id]}
                                className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all disabled:opacity-30"
                             >
                                {injectIndex === module.injects.length - 1 ? 'Finalize Report' : 'Next Inject'}
                             </button>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-coral-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-coral-300 mb-6 flex items-center gap-2">
                                 <ShieldAlert size={14}/> Regulatory Insight
                             </h4>
                             <p className="text-sm font-medium leading-relaxed italic opacity-90">
                                 "{currentInject.regulatoryHint}"
                             </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Simulation History</h4>
                             <div className="space-y-4">
                                 {module.injects.map((inj, idx) => (
                                     <div key={inj.id} className="flex items-center gap-3">
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] border-2 transition-colors ${
                                             idx === injectIndex ? 'bg-red-50 border-red-600 text-red-600' : 
                                             answers[inj.id] ? 'bg-green-50 border-green-500 text-green-500' : 
                                             'bg-white border-slate-100 text-slate-300'
                                         }`}>
                                             {answers[inj.id] && idx !== injectIndex ? <CheckCircle2 size={14}/> : idx + 1}
                                         </div>
                                         <span className={`text-[10px] font-black uppercase tracking-tight ${idx === injectIndex ? 'text-slate-900' : 'text-slate-400'}`}>{inj.title}</span>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'REPORT') {
        return (
            <div className="max-w-5xl mx-auto py-12 px-10 animate-in fade-in duration-700">
                <div className="flex justify-between items-end mb-8 print:hidden">
                    <div>
                        <button onClick={() => setStep('SIM')} className="text-coral-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline mb-2">
                             ← Back to Simulation
                        </button>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">After-Action Report (AAR)</h2>
                    </div>
                    <div className="flex gap-3">
                         <button onClick={handleExport} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-black transition-all">
                             <Printer size={16} /> Print for Evidence Folder
                         </button>
                         <button onClick={onExit} className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
                             Exit Simulator
                         </button>
                    </div>
                </div>

                {/* FORMAL DOCUMENT VIEW */}
                <div className="bg-white shadow-2xl rounded-[3rem] p-16 min-h-[1000px] border border-slate-100 relative print:shadow-none print:border-0 print:p-8">
                    <div className="flex justify-between items-start mb-16 border-b-8 border-slate-900 pb-8">
                         <div className="flex items-center gap-3">
                             <div className="p-3 bg-red-900 rounded-xl text-white shadow-lg"><FileBadge size={32} /></div>
                             <div>
                                 <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">Record of Training</h1>
                                 <p className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em] mt-2">Executive Tabletop Exercise (TTX)</p>
                             </div>
                         </div>
                         <div className="text-right">
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Integrity ID</div>
                             <div className="text-sm font-mono font-bold text-slate-900">TTX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Date Completed</div>
                             <div className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString()}</div>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Exercise Information</h4>
                            <div className="space-y-2">
                                <div className="text-xs font-black text-slate-900 uppercase">Scenario: <span className="font-bold text-slate-500 normal-case">{module.title}</span></div>
                                <div className="text-xs font-black text-slate-900 uppercase">Executive Focus: <span className="font-bold text-slate-500 normal-case">{module.executiveFocus}</span></div>
                                <div className="text-xs font-black text-slate-900 uppercase">Duration: <span className="font-bold text-slate-500 normal-case">{module.durationMinutes} Minutes</span></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Verified Participants</h4>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{participants}</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                         <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight border-l-8 border-red-600 pl-4 bg-red-50/30 py-2">Exercise Observations & Outcomes</h3>
                         
                         {module.injects.map((inj) => (
                             <div key={inj.id} className="space-y-4">
                                 <div className="flex items-center gap-3">
                                     <div className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">Inject: {inj.title}</div>
                                 </div>
                                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Scenario Context</div>
                                     <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">{inj.scenario}</p>
                                     <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Leadership Consensus & Decision</div>
                                     <p className="text-sm font-bold text-slate-900 leading-relaxed bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">{answers[inj.id]}</p>
                                     <div className="mt-4 text-[10px] font-black text-coral-400 uppercase tracking-widest flex items-center gap-2">
                                         <ShieldCheck size={12}/> Regulatory Alignment: {inj.regulatoryHint}
                                     </div>
                                 </div>
                             </div>
                         ))}
                    </div>

                    <div className="mt-20 pt-10 border-t border-slate-100">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Executive Sign-Off & Attestation</h4>
                         <div className="grid grid-cols-2 gap-12">
                             <div className="border-b border-slate-300 pb-2">
                                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-8">Organization Lead Signature</div>
                                 <div className="text-sm font-black uppercase text-slate-300">Signature Line</div>
                             </div>
                             <div className="border-b border-slate-300 pb-2">
                                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-8">Role / Title</div>
                                 <div className="text-sm font-black uppercase text-slate-300">Designation</div>
                             </div>
                         </div>
                    </div>

                    <div className="mt-24 text-center">
                        <div className="inline-block border-2 border-slate-900 px-6 py-2 text-slate-900 font-black tracking-[0.3em] text-[10px] uppercase">
                            Official CMMC Readiness Record // Internal Use Only
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};


export const CmmcAcademy: React.FC<{
    mastery: Record<string, ControlMastery>,
    onUpdateMastery: (m: Record<string, ControlMastery>) => void
}> = ({ mastery, onUpdateMastery }) => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activePhaseId, setActivePhaseId] = useState<string>(ACADEMY_PHASES[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'CURRICULUM' | 'MASTERY'>('CURRICULUM');
  const [isQuizActive, setIsQuizActive] = useState(false);
  
  const activeModule = TRAINING_MODULES.find((m: any) => m.id === activeModuleId);

  const handleQuizComplete = (score: number) => {
      if (activeModule) {
          onUpdateMastery({
              [activeModule.id]: {
                  requirementId: activeModule.id,
                  score,
                  status: score >= 80 ? 'Mastered' : 'In Progress',
                  lastAttempt: Date.now()
              }
          });
      }
      setIsQuizActive(false);
  };

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
          case 'FileText': return <FileText size={18} />;
          case 'Award': return <Award size={18} />;
          case 'Dices': return <Dices size={18} />;
          default: return <Library size={18} />;
      }
  };

  // If we are in a simulation, swap the entire UI for the simulator
  if (activeModule && (activeModule as SimulationModule).isSimulation) {
      return <SimulationRunner module={activeModule as SimulationModule} onExit={() => setActiveModuleId(null)} />;
  }

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
        
        {/* ACADEMY SIDEBAR (Course Map) */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
            <div className="p-8 border-b border-slate-100 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-coral-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4 text-coral-400">
                        <GraduationCap size={24} />
                        <span className="font-black uppercase tracking-[0.2em] text-[10px]">CMMC Academy</span>
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight leading-none">Assessment Readiness</h2>
                    <div className="mt-6 flex items-center justify-between">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Progress</div>
                         <div className="text-[10px] font-black text-coral-400 uppercase">Phase {activePhaseId.replace('PH','')}</div>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-coral-500 w-1/5 transition-all duration-1000"></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                    <button 
                        onClick={() => setView('CURRICULUM')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'CURRICULUM' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Curriculum
                    </button>
                    <button 
                        onClick={() => setView('MASTERY')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'MASTERY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Mastery
                    </button>
                </div>

                {view === 'CURRICULUM' ? (
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Knowledge Domains</h3>
                        <div className="space-y-1">
                            {ACADEMY_PHASES.map(phase => (
                                <button 
                                    key={phase.id}
                                    onClick={() => { setActivePhaseId(phase.id); setActiveModuleId(null); }}
                                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-all ${
                                        activePhaseId === phase.id ? 'bg-coral-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`${activePhaseId === phase.id ? 'text-coral-100' : 'text-slate-400 group-hover:text-coral-600'}`}>
                                            {getPhaseIcon(phase.icon)}
                                        </div>
                                        <span className="text-xs font-bold">{phase.name}</span>
                                    </div>
                                    <ChevronRight size={14} className={`${activePhaseId === phase.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all`} />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-coral-50 p-4 rounded-2xl border border-coral-100">
                            <div className="flex items-center gap-3 mb-2">
                                <BarChart3 size={16} className="text-coral-600" />
                                <span className="text-[10px] font-black text-coral-600 uppercase tracking-widest">Mastery Stats</span>
                            </div>
                            <div className="text-xs font-bold text-slate-900">12 / 110 Mastered</div>
                            <div className="w-full h-1.5 bg-coral-200 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-coral-600" style={{ width: '11%' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-silver-100/50 p-6 rounded-2xl border border-silver-200">
                    <h4 className="text-[10px] font-black text-coral-500 uppercase tracking-widest mb-3">Resource Center</h4>
                    <ul className="space-y-2">
                        <li><button className="text-xs font-bold text-slate-600 hover:text-coral-600 flex items-center gap-2">NIST SP 800-171A <ExternalLink size={10}/></button></li>
                        <li><button className="text-xs font-bold text-slate-600 hover:text-coral-600 flex items-center gap-2">CMMC CAP Guide <ExternalLink size={10}/></button></li>
                    </ul>
                </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                 <div className="flex items-center gap-3 text-slate-400 mb-1">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Enrolled Member</span>
                 </div>
                 <div className="text-xs font-bold text-slate-900 truncate">Compliance Readiness Track</div>
            </div>
        </aside>

        {/* ACADEMY CONTENT AREA */}
        <main className="flex-1 flex flex-col h-full min-w-0 bg-white">
            
            {/* Header / Search */}
            <header className="h-20 border-b border-slate-100 px-10 flex items-center justify-between shrink-0">
                <div className="flex-1 max-w-xl">
                    <div className="relative group">
                        <Search className="absolute left-4 top-2.5 text-slate-300 group-focus-within:text-coral-500 transition-colors" size={20} />
                        <input 
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-coral-500/10 focus:border-coral-500 outline-none transition-all font-medium text-sm"
                            placeholder="Search curriculum for ITAR, CUI, Artifact standards..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-silver-100 text-coral-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-silver-200 transition-all border border-silver-200">
                        <Star size={14} className="fill-coral-700" /> My Saved Modules
                    </button>
                    <div className="h-8 w-px bg-slate-200" />
                    <button className="p-2 text-slate-400 hover:text-coral-600 transition-colors">
                        <PlayCircle size={24} />
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {view === 'MASTERY' ? (
                    <MasteryDashboard mastery={mastery} />
                ) : activeModule ? (
                    <div className="max-w-4xl mx-auto py-12 px-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 mb-6">
                            <button 
                                onClick={() => { setActiveModuleId(null); setIsQuizActive(false); }}
                                className="text-coral-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline"
                            >
                                ← Curriculum View
                            </button>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                {ACADEMY_PHASES.find(p => p.id === activePhaseId)?.name}
                            </span>
                        </div>

                        {isQuizActive && activeModule.questions ? (
                            <QuizRunner 
                                questions={activeModule.questions} 
                                onComplete={handleQuizComplete}
                                onCancel={() => setIsQuizActive(false)}
                            />
                        ) : (
                            <>
                                <div className="mb-12">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">{activeModule.title}</h1>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="bg-slate-900 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">{activeModule.durationMinutes} min read</span>
                                            <span className="bg-coral-100 text-coral-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-coral-200">{activeModule.difficulty}</span>
                                        </div>
                                    </div>
                                    <p className="text-lg text-slate-500 font-medium leading-relaxed">{activeModule.description}</p>
                                </div>

                                <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:border-b-2 prose-h2:border-slate-50 prose-h2:pb-4 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-li:text-slate-600 prose-code:text-coral-600 prose-code:bg-coral-50 prose-code:px-1 prose-code:rounded shadow-sm bg-white border border-slate-100 p-10 rounded-[2rem]">
                                    <ReactMarkdown>{activeModule.content}</ReactMarkdown>
                                </div>

                                <div className="mt-12 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                                    {activeModule.questions && activeModule.questions.length > 0 && (
                                        <div className="bg-white border-2 border-coral-600 rounded-3xl p-8 flex-1 flex items-center justify-between shadow-xl">
                                            <div>
                                                <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Ready for a Knowledge Check?</h4>
                                                <p className="text-slate-500 text-sm font-medium mt-1">Complete the quiz to earn mastery points for this domain.</p>
                                            </div>
                                            <button 
                                                onClick={() => setIsQuizActive(true)}
                                                className="bg-coral-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-coral-700 transition-all flex items-center gap-2"
                                            >
                                                Start Quiz <Zap size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="bg-coral-900 rounded-3xl p-6 text-white shadow-xl flex-1 flex items-center gap-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                            <Sparkles className="text-coral-400" size={32} />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="text-lg font-black uppercase tracking-tight">Need technical help?</h4>
                                            <p className="text-coral-200 text-sm font-medium mt-1">Ask our AI Academy Instructor for clarification or real-world implementation examples.</p>
                                        </div>
                                        <button className="relative z-10 bg-white text-coral-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-coral-50 transition-all flex items-center gap-2">
                                            <MessageCircle size={14} /> Instructor Chat
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="p-12 animate-in fade-in duration-500">
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center min-h-[600px]">
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-8 border border-slate-100 text-slate-300">
                                {activePhaseId === 'PH6' ? (
                                    <Dices size={48} className="opacity-20 text-red-600" />
                                ) : (
                                    <ShieldCheck size={48} className="opacity-20 text-coral-600" />
                                )}
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                                {activePhaseId === 'PH6' ? 'Command & Control Simulations' : 'Organizational Academy'}
                            </h2>
                            <p className="text-slate-500 max-w-md mt-4 text-lg font-medium leading-relaxed">
                                {activePhaseId === 'PH6' 
                                    ? 'High-stakes tabletop exercises designed for Leadership and Executive decision-making during federal cyber incidents.'
                                    : 'Master CMMC assessment standards through thorough training. Select a domain to deep-dive into implementation and readiness requirements.'}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-3xl">
                                {displayedModules.map(module => (
                                    <button 
                                        key={module.id}
                                        onClick={() => setActiveModuleId(module.id)}
                                        className={`bg-white p-6 rounded-3xl border shadow-sm transition-all text-left group ${
                                            activePhaseId === 'PH6' ? 'hover:border-red-600' : 'hover:border-coral-600'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-white transition-all ${
                                                activePhaseId === 'PH6' ? 'group-hover:bg-red-600' : 'group-hover:bg-coral-600'
                                            }`}>
                                                <PlayCircle size={18} />
                                            </div>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{module.durationMinutes}m</span>
                                        </div>
                                        <h3 className={`font-black text-xs uppercase tracking-tight text-slate-900 transition-colors mb-2 ${
                                            activePhaseId === 'PH6' ? 'group-hover:text-red-700' : 'group-hover:text-coral-600'
                                        }`}>{module.title}</h3>
                                        <p className="text-[10px] text-slate-500 font-medium line-clamp-3 leading-relaxed">{module.description}</p>
                                        <div className={`mt-4 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity ${
                                            activePhaseId === 'PH6' ? 'text-red-600' : 'text-coral-600'
                                        }`}>
                                            {activePhaseId === 'PH6' ? 'Begin Simulation' : 'Begin Training'} <ArrowRight size={10} />
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
