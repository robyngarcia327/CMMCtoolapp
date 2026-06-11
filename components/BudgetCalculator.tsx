import React, { useState, useMemo } from 'react';
import { Requirement, BudgetLineItem } from '../types';
import { 
  DollarSign, Plus, Trash2, PieChart, Download, Calculator, 
  Hammer, HardDrive, Laptop, Users, Briefcase, 
  ArrowRight, ShieldCheck, ListRestart, AlertCircle, TrendingUp,
  MapPin, Clock, UserCheck, Plane, FileBadge
} from 'lucide-react';

interface BudgetCalculatorProps {
  requirements: Requirement[];
  budgetItems: BudgetLineItem[];
  onAddItem: (item: BudgetLineItem) => void;
  onRemoveItem: (id: string) => void;
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({ 
  requirements, 
  budgetItems, 
  onAddItem, 
  onRemoveItem 
}) => {
  const [selectedReq, setSelectedReq] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showAssessorPlanner, setShowAssessorPlanner] = useState(false);
  
  const [newItem, setNewItem] = useState<Partial<BudgetLineItem>>({ 
    category: 'Software', 
    costType: 'One-Time',
    hours: 0,
    rate: 0
  });

  // Assessor Specific State
  const [assessorData, setAssessorData] = useState({
      name: 'C3PAO Certification Assessment',
      count: 2,
      dayRate: 2500,
      days: 5,
      travel: 3500
  });

  // Data Selectors
  const gaps = useMemo(() => 
    requirements.filter(r => r.objectives.some(o => o.status === 'not_met' || o.status === 'pending')),
    [requirements]
  );

  // Financial Summary Calculations
  const summary = useMemo(() => {
    const oneTime = budgetItems.filter(i => i.costType === 'One-Time').reduce((sum, i) => sum + i.amount, 0);
    const recurring = budgetItems.filter(i => i.costType === 'Recurring/Year').reduce((sum, i) => sum + i.amount, 0);
    
    const byCategory = {
      'Software': budgetItems.filter(i => i.category === 'Software').reduce((sum, i) => sum + i.amount, 0),
      'Hardware': budgetItems.filter(i => i.category === 'Hardware').reduce((sum, i) => sum + i.amount, 0),
      'Internal Labor': budgetItems.filter(i => i.category === 'Internal Labor').reduce((sum, i) => sum + i.amount, 0),
      'Vendor Fees': budgetItems.filter(i => i.category === 'Vendor Fees').reduce((sum, i) => sum + i.amount, 0),
      'Assessor Fees': budgetItems.filter(i => i.category === 'Assessor Fees').reduce((sum, i) => sum + i.amount, 0),
    };

    return { oneTime, recurring, total: oneTime + recurring, byCategory };
  }, [budgetItems]);

  const handleAdd = () => {
    if (!newItem.name || (!newItem.amount && !newItem.hours)) return;
    
    const finalAmount = (newItem.category === 'Internal Labor' || newItem.category === 'Vendor Fees') && newItem.rate && newItem.hours
      ? newItem.rate * newItem.hours
      : Number(newItem.amount || 0);

    onAddItem({
      id: `BUDGET-${Date.now()}`,
      linkedRequirementId: selectedReq || 'General',
      name: newItem.name,
      category: newItem.category as any,
      costType: newItem.costType as any,
      amount: finalAmount,
      hours: newItem.hours,
      rate: newItem.rate,
      notes: newItem.notes
    });
    setNewItem({ category: 'Software', costType: 'One-Time', hours: 0, rate: 0 });
    setIsAdding(false);
  };

  const handleAddAssessorFees = () => {
      const professionalFees = assessorData.count * assessorData.dayRate * assessorData.days;
      const total = professionalFees + assessorData.travel;
      
      onAddItem({
          id: `BUDGET-ASSESSOR-${Date.now()}`,
          linkedRequirementId: 'General',
          name: assessorData.name,
          category: 'Assessor Fees',
          costType: 'One-Time',
          amount: total,
          notes: `Professional Fees: $${professionalFees.toLocaleString()} (${assessorData.count} assessors x $${assessorData.dayRate}/day x ${assessorData.days} days). Travel/Logistics: $${assessorData.travel.toLocaleString()}.`
      });
      setShowAssessorPlanner(false);
  };

  const syncFromPoam = () => {
    let count = 0;
    gaps.forEach(gap => {
      if (budgetItems.some(bi => bi.linkedRequirementId === gap.id)) return;
      onAddItem({
        id: `BUDGET-POAM-${gap.id}-${Date.now()}`,
        linkedRequirementId: gap.id,
        name: `Remediation: ${gap.title}`,
        category: 'Vendor Fees',
        costType: 'One-Time',
        amount: 0,
        notes: `Auto-populated from POA&M Gap ${gap.id}. Requires estimate.`
      });
      count++;
    });
    alert(`Identified ${count} new remediation requirements from POA&M.`);
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Software': return <Laptop size={16} className="text-coral-500" />;
      case 'Hardware': return <HardDrive size={16} className="text-purple-500" />;
      case 'Internal Labor': return <Users size={16} className="text-coral-500" />;
      case 'Vendor Fees': return <Briefcase size={16} className="text-orange-500" />;
      case 'Assessor Fees': return <ShieldCheck size={16} className="text-emerald-500" />;
      default: return <DollarSign size={16} className="text-green-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 h-full overflow-y-auto space-y-8 bg-slate-50/50">
      
      {/* Financial Mission Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-black text-coral-600 uppercase tracking-[0.2em] mb-2">
               <TrendingUp size={12}/> Investment Strategy
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Cost to Compliance</h1>
           <p className="text-slate-500 font-medium mt-1">Resource planning and budgetary forecasting for CMMC certification.</p>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={() => setShowAssessorPlanner(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all"
            >
                <FileBadge size={14} /> Assessor Planner
            </button>
            <button 
                onClick={syncFromPoam}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all"
            >
                <ListRestart size={14} className="text-coral-600" /> Sync POA&M ({gaps.length})
            </button>
            <button 
                onClick={() => { setIsAdding(!isAdding); setShowAssessorPlanner(false); }}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all"
            >
                <Plus size={14} /> {isAdding ? 'Cancel' : 'New Line Item'}
            </button>
        </div>
      </div>

      {/* Management Dashboard KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Initial Investment (CapEx)</div>
              <div className="text-4xl font-black text-slate-900">${summary.oneTime.toLocaleString()}</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
                  <div className="bg-coral-600 h-full" style={{ width: '100%' }} />
              </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recurring Annual (OpEx)</div>
              <div className="text-4xl font-black text-coral-600">${summary.recurring.toLocaleString()}</div>
              <div className="text-xs text-slate-400 font-bold mt-6">Projected Maintenance Cost</div>
          </div>
          <div className="bg-emerald-50 p-8 rounded-3xl shadow-sm border border-emerald-100 flex flex-col justify-between">
              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Assessor Provisions</div>
              <div className="text-4xl font-black text-emerald-700">${summary.byCategory['Assessor Fees'].toLocaleString()}</div>
              <div className="text-xs text-emerald-500 font-bold mt-6 flex items-center gap-1.5">
                  <ShieldCheck size={12}/> Allocated to C3PAO
              </div>
          </div>
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col justify-between text-white">
              <div className="text-[10px] font-black text-coral-400 uppercase tracking-widest mb-4">Total Certification Cost</div>
              <div className="text-4xl font-black">${summary.total.toLocaleString()}</div>
              <div className="text-[10px] text-white/50 font-bold mt-6 uppercase tracking-widest">Year 1 Projection</div>
          </div>
      </div>

      {/* Assessor Fee Planner (Dedicated Tool) */}
      {showAssessorPlanner && (
          <div className="bg-emerald-900 text-white p-10 rounded-[3rem] shadow-2xl animate-in fade-in slide-in-from-top-6 duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4">
                      <div className="p-4 bg-white/10 rounded-2xl w-fit mb-6"><FileBadge size={32} className="text-emerald-400" /></div>
                      <h2 className="text-3xl font-black tracking-tight uppercase mb-4 leading-none">Assessor Fee Planner</h2>
                      <p className="text-emerald-100 text-sm leading-relaxed mb-8">
                          Certification costs vary by C3PAO. Use this tool to estimate professional fees based on assessment duration and personnel requirements.
                      </p>
                      
                      <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Readiness Presets</h4>
                          <div className="flex flex-wrap gap-2">
                              <button 
                                onClick={() => setAssessorData({...assessorData, days: 3, count: 1, travel: 1500})}
                                className="px-3 py-1.5 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                              >
                                L1 Self-Guided
                              </button>
                              <button 
                                onClick={() => setAssessorData({...assessorData, days: 5, count: 2, travel: 3500})}
                                className="px-3 py-1.5 bg-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-400"
                              >
                                L2 Standard
                              </button>
                              <button 
                                onClick={() => setAssessorData({...assessorData, days: 10, count: 3, travel: 6000})}
                                className="px-3 py-1.5 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                              >
                                L3 High-Complexity
                              </button>
                          </div>
                      </div>
                  </div>

                  <div className="lg:col-span-8 bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                           <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 px-1">Engagement Name</label>
                                <input 
                                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-400"
                                    value={assessorData.name}
                                    onChange={e => setAssessorData({...assessorData, name: e.target.value})}
                                />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 px-1">Assessors</label>
                                    <div className="flex items-center gap-2 bg-white/10 p-4 rounded-xl border border-white/20">
                                        <Users size={16} className="text-emerald-400" />
                                        <input 
                                            type="number" 
                                            className="bg-transparent border-none outline-none font-bold text-lg w-full"
                                            value={assessorData.count}
                                            onChange={e => setAssessorData({...assessorData, count: parseInt(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 px-1">Daily Rate ($)</label>
                                    <div className="flex items-center gap-2 bg-white/10 p-4 rounded-xl border border-white/20">
                                        <DollarSign size={16} className="text-emerald-400" />
                                        <input 
                                            type="number" 
                                            className="bg-transparent border-none outline-none font-bold text-lg w-full"
                                            value={assessorData.dayRate}
                                            onChange={e => setAssessorData({...assessorData, dayRate: parseInt(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                           </div>
                      </div>

                      <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 px-1">Days on Site</label>
                                    <div className="flex items-center gap-2 bg-white/10 p-4 rounded-xl border border-white/20">
                                        <Clock size={16} className="text-emerald-400" />
                                        <input 
                                            type="number" 
                                            className="bg-transparent border-none outline-none font-bold text-lg w-full"
                                            value={assessorData.days}
                                            onChange={e => setAssessorData({...assessorData, days: parseInt(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 px-1">Logistics / T&E</label>
                                    <div className="flex items-center gap-2 bg-white/10 p-4 rounded-xl border border-white/20">
                                        <Plane size={16} className="text-emerald-400" />
                                        <input 
                                            type="number" 
                                            className="bg-transparent border-none outline-none font-bold text-lg w-full"
                                            value={assessorData.travel}
                                            onChange={e => setAssessorData({...assessorData, travel: parseInt(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                           </div>
                           
                           <div className="bg-emerald-950/50 p-6 rounded-2xl border border-emerald-800/50 flex justify-between items-center">
                               <div>
                                   <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Total Fee Estimate</div>
                                   <div className="text-3xl font-black text-white">${(assessorData.count * assessorData.dayRate * assessorData.days + assessorData.travel).toLocaleString()}</div>
                               </div>
                               <button 
                                 onClick={handleAddAssessorFees}
                                 className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl"
                               >
                                   Lock in Budget
                               </button>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {isAdding && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-coral-100 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Financial Data Entry</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Link to Compliance Gap</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-coral-500 outline-none"
                            value={selectedReq}
                            onChange={e => setSelectedReq(e.target.value)}
                          >
                              <option value="">General Organizational Cost</option>
                              {gaps.map(r => (
                                  <option key={r.id} value={r.id}>{r.id}: {r.title.substring(0,40)}...</option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Item Name</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-coral-500 outline-none" 
                            placeholder="e.g. SIEM Software Subscription"
                            value={newItem.name || ''}
                            onChange={e => setNewItem({...newItem, name: e.target.value})}
                          />
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Expense Class</label>
                            <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-coral-500 outline-none"
                                value={newItem.category}
                                onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                            >
                                <option>Software</option>
                                <option>Hardware</option>
                                <option>Internal Labor</option>
                                <option>Vendor Fees</option>
                                <option>Assessor Fees</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Model</label>
                            <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-coral-500 outline-none"
                                value={newItem.costType}
                                onChange={e => setNewItem({...newItem, costType: e.target.value as any})}
                            >
                                <option>One-Time</option>
                                <option>Recurring/Year</option>
                            </select>
                          </div>
                      </div>

                      {newItem.category === 'Internal Labor' || newItem.category === 'Vendor Fees' ? (
                          <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                             <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Est. Hours</label>
                                <input 
                                    type="number"
                                    className="w-full bg-silver-50 border border-silver-100 rounded-xl p-3 text-sm font-mono font-bold focus:ring-2 focus:ring-coral-500 outline-none" 
                                    placeholder="40"
                                    value={newItem.hours || ''}
                                    onChange={e => setNewItem({...newItem, hours: parseFloat(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Hourly Rate ($)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-silver-50 border border-silver-100 rounded-xl p-3 text-sm font-mono font-bold focus:ring-2 focus:ring-coral-500 outline-none" 
                                    placeholder="150"
                                    value={newItem.rate || ''}
                                    onChange={e => setNewItem({...newItem, rate: parseFloat(e.target.value)})}
                                />
                            </div>
                          </div>
                      ) : (
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fixed Amount ($)</label>
                            <input 
                                type="number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold focus:ring-2 focus:ring-coral-500 outline-none" 
                                placeholder="0.00"
                                value={newItem.amount || ''}
                                onChange={e => setNewItem({...newItem, amount: parseFloat(e.target.value)})}
                            />
                        </div>
                      )}
                  </div>

                  <div className="space-y-4">
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Remediation Notes</label>
                          <textarea 
                             className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-coral-500 outline-none min-h-[95px]"
                             placeholder="Basis for estimation..."
                             value={newItem.notes || ''}
                             onChange={e => setNewItem({...newItem, notes: e.target.value})}
                          />
                      </div>
                  </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                  <button onClick={() => setIsAdding(false)} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                  <button 
                    onClick={handleAdd}
                    className="bg-coral-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-coral-100 hover:bg-coral-700 transition-all flex items-center gap-2"
                  >
                      Add to Project Budget <ArrowRight size={14}/>
                  </button>
              </div>
          </div>
      )}

      {/* Item List / Management Report Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
               <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-lg border border-slate-200"><Calculator size={18} className="text-slate-400"/></div>
                   <h3 className="font-black text-slate-900 uppercase tracking-tight">Certification Ledger</h3>
               </div>
               <button className="text-[10px] font-black uppercase tracking-widest text-coral-600 flex items-center gap-1.5 hover:underline">
                   <Download size={14} /> Export Financial Summary
               </button>
           </div>
           
           <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                   <thead className="bg-slate-900 text-white">
                       <tr>
                           <th className="p-5 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Remediation Item</th>
                           <th className="p-5 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Gap ID</th>
                           <th className="p-5 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Classification</th>
                           <th className="p-5 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Unit Basis</th>
                           <th className="p-5 text-[10px] font-black uppercase tracking-widest text-right">Projected Cost</th>
                           <th className="p-5 w-12"></th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                       {budgetItems.length === 0 ? (
                           <tr><td colSpan={6} className="p-20 text-center text-slate-400 italic bg-slate-50/30">
                               <div className="flex flex-col items-center gap-4">
                                   <AlertCircle size={40} className="opacity-20" />
                                   <p className="font-bold text-sm">Financial Registry Empty - Import from POA&M to begin.</p>
                               </div>
                           </td></tr>
                       ) : budgetItems.map(item => (
                           <tr key={item.id} className={`hover:bg-slate-50/80 transition-colors group ${item.category === 'Assessor Fees' ? 'bg-emerald-50/20' : ''}`}>
                               <td className="p-5">
                                   <div className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                       {item.category === 'Assessor Fees' && <ShieldCheck size={14} className="text-emerald-600" />}
                                       {item.name}
                                   </div>
                                   {item.notes && <div className="text-[10px] text-slate-500 mt-1 italic leading-relaxed">{item.notes}</div>}
                               </td>
                               <td className="p-5">
                                   <span className={`font-mono text-xs font-black ${item.linkedRequirementId === 'General' ? 'text-slate-300' : 'text-coral-600'}`}>
                                       {item.linkedRequirementId === 'General' ? 'GLOBAL' : item.linkedRequirementId}
                                   </span>
                               </td>
                               <td className="p-5">
                                   <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-tight ${item.category === 'Assessor Fees' ? 'text-emerald-700' : 'text-slate-700'}`}>
                                       {getCategoryIcon(item.category)} {item.category}
                                   </div>
                               </td>
                               <td className="p-5 text-center">
                                   {item.hours ? (
                                       <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-black">
                                           {item.hours}h @ ${item.rate}/hr
                                       </span>
                                   ) : (
                                       <span className="text-slate-300">Lump Sum</span>
                                   )}
                               </td>
                               <td className="p-5 text-right font-mono font-black text-slate-900">
                                   <span className={item.amount === 0 ? 'text-red-500 animate-pulse' : ''}>
                                       ${item.amount.toLocaleString()}
                                   </span>
                               </td>
                               <td className="p-5 text-right">
                                   <button onClick={() => onRemoveItem(item.id)} className="text-slate-300 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100">
                                       <Trash2 size={16} />
                                   </button>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
      </div>

       <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
              <PieChart size={32} className="text-coral-400" />
          </div>
          <div className="flex-1">
              <h4 className="text-xl font-black uppercase tracking-tight mb-2">Cost Optimization Strategy</h4>
              <p className="text-coral-200 text-sm leading-relaxed max-w-2xl font-medium">
                  By tracking remediation costs at the control level, you can generate an ROI report demonstrating how specific technical upgrades satisfy multiple framework requirements, potentially reducing vendor fees by identifying tool overlap.
              </p>
          </div>
          <button className="bg-white text-coral-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-coral-50 transition-all">
              Generate ROI Forecast
          </button>
      </div>
    </div>
  );
};