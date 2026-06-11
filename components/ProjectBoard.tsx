import React, { useState } from 'react';
import { ProjectTask, Requirement, Risk, User } from '../types';
import { KanbanSquare, Plus, Calendar, User as UserIcon, AlertTriangle, CheckCircle2, ChevronRight, X, ArrowRight, ArrowLeft, Download } from 'lucide-react';

interface ProjectBoardProps {
  tasks: ProjectTask[];
  onAddTask: (task: ProjectTask) => void;
  onUpdateTask: (task: ProjectTask) => void;
  onDeleteTask: (id: string) => void;
  requirements: Requirement[];
  risks: Risk[];
  users: User[];
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  requirements,
  risks,
  users
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    status: 'backlog',
    priority: 'Medium',
    title: '',
    description: ''
  });

  // Calculate stats for POAM import
  const unmetReqs = requirements.filter(r => {
      const statuses = r.objectives.map(o => o.status);
      return statuses.some(s => s === 'not_met') || statuses.every(s => s === 'pending');
  });
  const openRisks = risks.filter(r => r.status === 'Open');

  const handleCreateTask = () => {
    if (!newTask.title) return;
    const task: ProjectTask = {
      id: `T-${Date.now().toString().slice(-4)}`,
      title: newTask.title,
      description: newTask.description || '',
      status: newTask.status as any,
      priority: newTask.priority as any,
      assigneeId: newTask.assigneeId,
      dueDate: newTask.dueDate,
    };
    onAddTask(task);
    setIsAdding(false);
    setNewTask({ status: 'backlog', priority: 'Medium', title: '', description: '' });
  };

  const importFromPoam = () => {
      let count = 0;
      unmetReqs.forEach(req => {
          if (tasks.some(t => t.linkedRequirementId === req.id)) return;
          
          const task: ProjectTask = {
              id: `T-P${req.id.replace(/\./g,'')}`,
              title: `Remediate: ${req.title}`,
              description: `Implement controls to satisfy ${req.id}. ${req.description}`,
              status: 'backlog',
              priority: 'High',
              linkedRequirementId: req.id
          };
          onAddTask(task);
          count++;
      });
      alert(`Imported ${count} tasks from POA&M (Unmet Requirements).`);
  };

  const importFromRisks = () => {
      let count = 0;
      openRisks.forEach(risk => {
          if (tasks.some(t => t.linkedRiskId === risk.id)) return;

          const task: ProjectTask = {
              id: `T-${risk.id}`,
              title: `Mitigate: ${risk.riskTitle}`,
              description: `Execute remediation plan: ${risk.comments || risk.deficiencyDescription}`,
              status: 'backlog',
              priority: (risk.impact.includes('4') || risk.impact.includes('5')) ? 'High' : 'Medium',
              linkedRiskId: risk.id
          };
          onAddTask(task);
          count++;
      });
      alert(`Imported ${count} tasks from Risk Register.`);
  };

  // --- NEW: Export Functionality ---
  const handleExportPoam = () => {
      // Filter for active items (not done)
      const activeTasks = tasks.filter(t => t.status !== 'done');
      
      if (activeTasks.length === 0) {
          alert("No active tasks to export.");
          return;
      }

      // Create CSV Header
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Control ID,Weakness Description,Priority,Status,Scheduled Completion,Milestones\n";

      // Add Rows
      activeTasks.forEach(task => {
          const controlId = task.linkedRequirementId || task.linkedRiskId || "N/A";
          const desc = `"${task.title} - ${task.description.replace(/"/g, '""')}"`; // Escape quotes
          const date = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "TBD";
          
          const row = `${controlId},${desc},${task.priority},${task.status},${date},See Task Details`;
          csvContent += row + "\n";
      });

      // Trigger Download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `POAM_Export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const columns: { id: ProjectTask['status']; title: string; color: string }[] = [
    { id: 'backlog', title: 'Backlog / To Do', color: 'bg-slate-100 border-slate-200' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
    { id: 'review', title: 'Validation / Review', color: 'bg-purple-50 border-purple-200' },
    { id: 'done', title: 'Done', color: 'bg-green-50 border-green-200' },
  ];

  const moveTask = (task: ProjectTask, direction: 'left' | 'right') => {
      const statusOrder: ProjectTask['status'][] = ['backlog', 'in_progress', 'review', 'done'];
      const currentIndex = statusOrder.indexOf(task.status);
      const newIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
      
      if (newIndex >= 0 && newIndex < statusOrder.length) {
          onUpdateTask({ ...task, status: statusOrder[newIndex] });
      }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <KanbanSquare className="text-blue-600" /> Project Management
            </h2>
            <p className="text-slate-600">Track deployment and remediation tasks.</p>
        </div>
        <div className="flex gap-2">
             <button 
                onClick={handleExportPoam}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium flex items-center gap-2 shadow-sm"
                title="Download POA&M CSV"
            >
                <Download size={16} /> Export POA&M
            </button>
             <button 
                onClick={importFromPoam}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
                title="Generate tasks from Unmet Requirements"
            >
                <AlertTriangle size={16} className="text-amber-500" /> Import POA&M ({unmetReqs.length})
            </button>
             <button 
                onClick={importFromRisks}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
                title="Generate tasks from Open Risks"
            >
                <AlertTriangle size={16} className="text-red-500" /> Import Risks ({openRisks.length})
            </button>
            <button 
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 shadow-sm"
            >
                <Plus size={16} /> New Task
            </button>
        </div>
      </div>

      {isAdding && (
          <div className="mb-6 p-6 bg-white rounded-xl shadow border border-slate-200 animate-in fade-in slide-in-from-top-2 shrink-0">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-800">Create New Task</h3>
                  <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                      <input 
                        className="w-full border p-2 rounded" 
                        placeholder="Task Title"
                        value={newTask.title} 
                        onChange={e => setNewTask({...newTask, title: e.target.value})}
                        autoFocus
                      />
                  </div>
                  <div className="md:col-span-2">
                      <textarea 
                        className="w-full border p-2 rounded h-20" 
                        placeholder="Description..."
                        value={newTask.description} 
                        onChange={e => setNewTask({...newTask, description: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Assignee</label>
                      <select 
                        className="w-full border p-2 rounded"
                        value={newTask.assigneeId || ''}
                        onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}
                      >
                          <option value="">Unassigned</option>
                          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                  </div>
                  <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1">Priority</label>
                       <select 
                        className="w-full border p-2 rounded"
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                      >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                      </select>
                  </div>
              </div>
              <div className="mt-4 flex justify-end">
                  <button onClick={handleCreateTask} className="px-6 py-2 bg-blue-600 text-white rounded font-medium">Create Task</button>
              </div>
          </div>
      )}

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex h-full gap-6 min-w-[1000px]">
              {columns.map(col => {
                  const colTasks = tasks.filter(t => t.status === col.id);
                  return (
                      <div key={col.id} className="flex-1 flex flex-col h-full bg-slate-50 rounded-xl border border-slate-200">
                          <div className={`p-4 border-b ${col.color} rounded-t-xl`}>
                              <div className="flex justify-between items-center">
                                  <h3 className="font-bold text-slate-800">{col.title}</h3>
                                  <span className="bg-white/50 px-2 py-0.5 rounded text-xs font-bold text-slate-600">{colTasks.length}</span>
                              </div>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto p-3 space-y-3">
                              {colTasks.map(task => {
                                  const assignee = users.find(u => u.id === task.assigneeId);
                                  return (
                                      <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative">
                                          
                                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
                                              {col.id !== 'backlog' && (
                                                <button onClick={() => moveTask(task, 'left')} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Move Back">
                                                    <ArrowLeft size={16} />
                                                </button>
                                              )}
                                              {col.id !== 'done' && (
                                                <button onClick={() => moveTask(task, 'right')} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Move Forward">
                                                    <ArrowRight size={16} />
                                                </button>
                                              )}
                                          </div>

                                          <div className="flex justify-between items-start mb-2 pr-12">
                                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border ${
                                                  task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                                                  task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                  'bg-green-50 text-green-600 border-green-100'
                                              }`}>
                                                  {task.priority}
                                              </span>
                                              {task.linkedRequirementId && (
                                                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                                                      Req {task.linkedRequirementId}
                                                  </span>
                                              )}
                                               {task.linkedRiskId && (
                                                  <span className="text-[10px] bg-red-50 px-1.5 py-0.5 rounded text-red-500 font-mono">
                                                      Risk {task.linkedRiskId}
                                                  </span>
                                              )}
                                          </div>
                                          
                                          <h4 className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{task.title}</h4>
                                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
                                          
                                          <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                              <div className="flex items-center gap-1.5">
                                                  {assignee ? (
                                                      <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded">
                                                          <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[9px] font-bold">
                                                              {assignee.name.charAt(0)}
                                                          </div>
                                                          <span className="max-w-[80px] truncate">{assignee.name}</span>
                                                      </div>
                                                  ) : (
                                                      <div className="flex items-center gap-1 text-xs text-slate-400">
                                                          <UserIcon size={12} /> Unassigned
                                                      </div>
                                                  )}
                                              </div>
                                              
                                              {task.dueDate && (
                                                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                      <Calendar size={10} />
                                                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
    </div>
  );
};