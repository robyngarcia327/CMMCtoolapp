import React, { useMemo, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge, 
  MarkerType,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Workflow, WorkflowStep } from '../types';
import { Shield, User, Clock, CheckCircle2, AlertCircle, PlayCircle, StopCircle, HelpCircle } from 'lucide-react';

interface WorkflowDiagramProps {
  workflow: Workflow;
  onUpdate?: (updatedWorkflow: Workflow) => void;
}

const nodeStyles: Record<string, string> = {
  start: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  process: 'bg-white border-slate-200 text-slate-900',
  decision: 'bg-amber-50 border-amber-200 text-amber-900',
  end: 'bg-rose-50 border-rose-200 text-rose-900',
};

const CustomNode = ({ data }: { data: any }) => {
  const step = data.step as WorkflowStep;
  
  const getIcon = () => {
    switch (step.type) {
      case 'start': return <PlayCircle size={14} className="text-emerald-500" />;
      case 'end': return <StopCircle size={14} className="text-rose-500" />;
      case 'decision': return <HelpCircle size={14} className="text-amber-500" />;
      default: return <Clock size={14} className="text-coral-500" />;
    }
  };

  const getStatusIcon = () => {
    switch (step.status) {
      case 'Completed': return <CheckCircle2 size={12} className="text-emerald-500" />;
      case 'In Progress': return <AlertCircle size={12} className="text-amber-500" />;
      default: return null;
    }
  };

  return (
    <div className={`px-4 py-3 rounded-xl border-2 shadow-sm min-w-[180px] max-w-[240px] ${nodeStyles[step.type || 'process']}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-[10px] font-black uppercase tracking-wider opacity-60">
            {step.type || 'Step'}
          </span>
        </div>
        {getStatusIcon()}
      </div>
      <h3 className="text-sm font-bold leading-tight mb-1">{step.title}</h3>
      <p className="text-[10px] opacity-70 line-clamp-2 mb-2">{step.description}</p>
      {step.assignedRole && (
        <div className="flex items-center gap-1 mt-auto pt-2 border-t border-current border-opacity-10">
          <User size={10} />
          <span className="text-[9px] font-bold uppercase tracking-tight">{step.assignedRole}</span>
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  workflowStep: CustomNode,
};

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ workflow, onUpdate }) => {
  // Convert workflow steps to ReactFlow nodes and edges
  const initialNodes: Node[] = useMemo(() => {
    return workflow.steps.map((step, index) => ({
      id: step.id,
      type: 'workflowStep',
      position: step.position || { x: 250, y: index * 150 },
      data: { step },
    }));
  }, [workflow.steps]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    workflow.steps.forEach(step => {
      if (step.nextStepIds) {
        step.nextStepIds.forEach(nextId => {
          edges.push({
            id: `e-${step.id}-${nextId}`,
            source: step.id,
            target: nextId,
            animated: step.status === 'In Progress',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          });
        });
      }
    });
    return edges;
  }, [workflow.steps]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSaveLayout = () => {
    if (!onUpdate) return;

    const updatedSteps = workflow.steps.map(step => {
      const node = nodes.find(n => n.id === step.id);
      return {
        ...step,
        position: node ? node.position : step.position,
      };
    });

    onUpdate({
      ...workflow,
      steps: updatedSteps,
      lastUpdated: Date.now(),
    });
  };

  return (
    <div className="h-[600px] w-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#cbd5e1" gap={20} />
        <Controls />
        <MiniMap 
          nodeColor={(n) => {
            const step = n.data.step as WorkflowStep;
            if (step.type === 'start') return '#10b981';
            if (step.type === 'end') return '#f43f5e';
            if (step.type === 'decision') return '#f59e0b';
            return '#94a3b8';
          }}
          maskColor="rgba(241, 245, 249, 0.7)"
        />
        <Panel position="top-right" className="bg-white p-2 rounded-lg shadow-md border border-slate-200 flex gap-2">
          <button 
            onClick={handleSaveLayout}
            className="px-3 py-1.5 bg-coral-600 text-white text-xs font-bold rounded-md hover:bg-coral-700 transition-colors flex items-center gap-2"
          >
            <Shield size={14} /> Save Layout
          </button>
        </Panel>
        <Panel position="top-left" className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-slate-200 pointer-events-none">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{workflow.title}</h4>
          <p className="text-[10px] text-slate-500 mt-1">Visual Data Flow Diagram</p>
        </Panel>
      </ReactFlow>
    </div>
  );
};
