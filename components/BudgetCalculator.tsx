
import React, { useState } from 'react';
import { Requirement, BudgetLineItem } from '../types';
import { DollarSign, Plus, Trash2, PieChart, Download, Calculator, Hammer, HardDrive, Laptop } from 'lucide-react';

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
  const [newItem, setNewItem] = useState<Partial<BudgetLineItem>>({ category: 'Software', costType: 'One-Time' });

  // Get unmet requirements
  const unmetReqs = requirements.filter(r => r.objectives.some(o => o.status === 'not_met'));

  // Calculate Totals
  const oneTimeTotal = budgetItems.filter(i => i.costType === 'One-Time').reduce((sum, i) => sum + i.amount, 0);
  const recurringTotal = budgetItems.filter(i => i.costType === 'Recurring/Year').reduce((sum, i) => sum + i.amount, 0);
  const totalFirstYear = oneTimeTotal + recurringTotal;

  const handleAdd = () => {
      if (!newItem.name || !newItem.amount) return;
      onAddItem({
          id: `BUDGET-${Date.now()}`,
          linkedRequirementId: selectedReq || 'General',
          name: newItem.name,
          category: newItem.category as any,
          costType: newItem.costType as any,
          amount: Number(newItem.amount),
          notes: newItem.notes
      });
      setNewItem({ category: 'Software', costType: 'One-Time', name: '', amount: 0, notes: '' });
  };

  const getCategoryIcon = (cat: string) => {
      switch(cat) {
          case 'Software': return <Laptop size={16} className="text-blue-500" />;
          case 'Hardware': return <HardDrive size={16} className="text-purple-500" />;
          case 'Labor': return <Hammer size={16} className="text-orange-500" />;
          default: return <DollarSign size={16} className="text-green-500" />;
      }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               <Calculator className="text-green-600" /> Remediation Budget & ROI
           </h1>
           <p className="text-slate-600">Estimate the financial cost to achieve compliance.</p>
        </div>
        <div className="flex gap-4">
             <div className="text-right">
                 <div className="text-xs font-bold text-slate-500 uppercase">One-Time Cost</div>
                 <div className="text-xl font-bold text-slate-800">${oneTimeTotal.toLocaleString()}</div>
             </div>
             <div className="text-right">
                 <div className="text-xs font-bold text-slate-500 uppercase">Annual Recurring</div>
                 <div className="text-xl font-bold text-slate-800">${recurringTotal.toLocaleString()}</div>
             </div>
             <div className="text-right pl-4 border-l border-slate-300">
                 <div className="text-xs font-bold text-slate-500 uppercase">First Year Total</div>
                 <div className="text-2xl font-black text-green-600">${totalFirstYear.toLocaleString()}</div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
              <h3 className="font-bold text-slate-800 mb-4">Add Line Item</h3>
              
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link to Gap (Optional)</label>
                      <select 
                        className="w-full border p-2 rounded text-sm"
                        value={selectedReq}
                        onChange={e => setSelectedReq(e.target.value)}
                      >
                          <option value="">General / Unlinked</option>
                          {unmetReqs.map(r => (
                              <option key={r.id} value={r.id}>{r.id} - {r.title.substring(0,30)}...</option>
                          ))}
                      </select>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Item Name</label>
                      <input 
                        className="w-full border p-2 rounded text-sm" 
                        placeholder="e.g. MFA Licenses (50 users)"
                        value={newItem.name || ''}
                        onChange={e => setNewItem({...newItem, name: e.target.value})}
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                        <select 
                            className="w-full border p-2 rounded text-sm"
                            value={newItem.category}
                            onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                        >
                            <option>Software</option>
                            <option>Hardware</option>
                            <option>Labor</option>
                            <option>Consulting</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                        <select 
                            className="w-full border p-2 rounded text-sm"
                            value={newItem.costType}
                            onChange={e => setNewItem({...newItem, costType: e.target.value as any})}
                        >
                            <option>One-Time</option>
                            <option>Recurring/Year</option>
                        </select>
                      </div>
                  </div>

                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estimated Cost ($)</label>
                      <input 
                        type="number"
                        className="w-full border p-2 rounded text-sm font-mono" 
                        placeholder="0.00"
                        value={newItem.amount || ''}
                        onChange={e => setNewItem({...newItem, amount: parseFloat(e.target.value)})}
                      />
                  </div>

                  <button 
                    onClick={handleAdd}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 mt-2"
                  >
                      Add to Budget
                  </button>
              </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                   <h3 className="font-bold text-slate-800">Budget Breakdown</h3>
                   <button className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                       <Download size={14} /> Export CSV
                   </button>
               </div>
               
               <table className="w-full text-sm text-left">
                   <thead className="bg-white text-slate-500 border-b border-slate-100">
                       <tr>
                           <th className="p-4">Item</th>
                           <th className="p-4">Gap</th>
                           <th className="p-4">Category</th>
                           <th className="p-4">Type</th>
                           <th className="p-4 text-right">Cost</th>
                           <th className="p-4"></th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                       {budgetItems.map(item => (
                           <tr key={item.id} className="hover:bg-slate-50">
                               <td className="p-4 font-medium text-slate-900">{item.name}</td>
                               <td className="p-4 text-xs font-mono text-slate-500">{item.linkedRequirementId === 'General' ? '-' : item.linkedRequirementId}</td>
                               <td className="p-4">
                                   <div className="flex items-center gap-2 text-slate-600">
                                       {getCategoryIcon(item.category)} {item.category}
                                   </div>
                               </td>
                               <td className="p-4 text-slate-500">{item.costType}</td>
                               <td className="p-4 text-right font-mono font-bold text-slate-800">${item.amount.toLocaleString()}</td>
                               <td className="p-4 text-right">
                                   <button onClick={() => onRemoveItem(item.id)} className="text-slate-400 hover:text-red-500">
                                       <Trash2 size={16} />
                                   </button>
                               </td>
                           </tr>
                       ))}
                       {budgetItems.length === 0 && (
                           <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">No budget items added.</td></tr>
                       )}
                   </tbody>
               </table>
          </div>
      </div>
    </div>
  );
};
