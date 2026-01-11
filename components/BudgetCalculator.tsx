import React, { useState, useMemo } from 'react';
import { Requirement, BudgetLineItem } from '../types';
import { 
  DollarSign, Plus, Trash2, PieChart, Download, Calculator, 
  Hammer, HardDrive, Laptop, Users, Briefcase, 
  ArrowRight, ShieldCheck, ListRestart, AlertCircle, TrendingUp
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
  const [newItem, setNewItem] = useState<Partial<BudgetLineItem>>({ 
    category: 'Software', 
    costType: 'One-Time',
    hours: 0,
    rate: 0
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
    
    // Auto-calculate amount if labor
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

  const syncFromPoam = () => {
    let count = 0;
    gaps.forEach(gap => {
      // Check if already in budget
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
    alert(`Identified ${count} new remediation requirements from POA&M. Added as $0 draft entries.`);
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Software': return <Laptop size={16} className="text-blue-500" />;
      case 'Hardware': return <HardDrive size={16} className="text-purple-500" />;
      case 'Internal Labor': return <Users size={16} className="text-indigo-500" />;
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
           <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
               <TrendingUp size={12}/> Investment Strategy
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Cost to Compliance</h1>
           <p className="text-slate-500 font-medium mt-1">Resource planning and budgetary forecasting for CMMC certification.</p>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={syncFromPoam}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all"
            >
                <ListRestart size={14} className="text-blue-600" /> Sync POA&M ({gaps.length})
            </button>
            <button 
                onClick={() => setIsAdding(!isAdding)}
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
                  <div className="bg-blue-600 h-full" style={{ width: '100%' }} />
              </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recurring Annual (OpEx)</div>
              <div className="text-4xl font-black text-indigo-600">${summary.recurring.toLocaleString()}</div>
              <div className="text-xs text-slate-400 font-bold mt-6">Projected Maintenance Cost</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Assessor Provisions</div>
              <div className="text-4xl font-black text-emerald-600">${summary.byCategory['Assessor Fees'].toLocaleString()}</div>
              <div className="text-xs text-slate-400 font-bold mt-6">C3PAO Allocation</div>
          </div>
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col justify-between text-white">
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Total Certification Cost</div>
              <div className="text-4xl font-black">${summary.total.toLocaleString()}</div>
              <div className="text-[10px] text-white/50 font-bold mt-6 uppercase tracking-widest">Year 1 Projection</div>
          </div>
      </div>

      {isAdding && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-blue-100 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Financial Data Entry</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Link to Compliance Gap</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
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
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="e.g. C3PAO Final Assessment"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
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
                                    className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                                    placeholder="40"
                                    value={newItem.hours || ''}
                                    onChange={e => setNewItem({...newItem, hours: parseFloat(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Hourly Rate ($)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
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
                             className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none min-h-[95px]"
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
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
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
               <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5 hover:underline">
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
                           <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                               <td className="p-5">
                                   <div className="font-black text-slate-900 uppercase tracking-tight">{item.name}</div>
                                   {item.notes && <div className="text-[10px] text-slate-500 mt-1 italic leading-relaxed">{item.notes}</div>}
                               </td>
                               <td className="p-5">
                                   <span className={`font-mono text-xs font-black ${item.linkedRequirementId === 'General' ? 'text-slate-300' : 'text-blue-600'}`}>
                                       {item.linkedRequirementId === 'General' ? 'GLOBAL' : item.linkedRequirementId}
                                   </span>
                               </td>
                               <td className="p-5">
                                   <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-tight">
                                       {getCategoryIcon(item.category)} {item.category}
                                   </div>
                               </td>
                               <td className="p-5 text-center">
                                   {item.hours ? (
                                       <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-black">
                                           {item.hours}h @ ${item.rate}/hr
                                       </span>
                                   ) : (
                                       <span className="text-slate-300">Fixed</span>
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

      <div className="bg-blue-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
              <PieChart size={32} className="text-blue-400" />
          </div>
          <div className="flex-1">
              <h4 className="text-xl font-black uppercase tracking-tight mb-2">Cost Optimization Strategy</h4>
              <p className="text-blue-200 text-sm leading-relaxed max-w-2xl font-medium">
                  By tracking remediation costs at the control level, you can generate an ROI report demonstrating how specific technical upgrades satisfy multiple framework requirements, potentially reducing vendor fees by identifying tool overlap.
              </p>
          </div>
          <button className="bg-white text-blue-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all">
              Generate ROI Forecast
          </button>
      </div>
    </div>
  );
};