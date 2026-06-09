import React, { useState } from 'react';
import { X, Ticket, Loader2, ClipboardList } from 'lucide-react';
import { ConnectWiseConfig, Ticket as TicketType } from '../types';
import { createConnectWiseTicket } from '../services/connectwise';

interface ConnectWiseTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConnectWiseConfig;
  requirementId: string;
  requirementTitle: string;
  defaultSummary?: string;
  onTicketCreated: (ticket: TicketType) => void;
}

export const ConnectWiseTicketModal: React.FC<ConnectWiseTicketModalProps> = ({
  isOpen,
  onClose,
  config,
  requirementId,
  requirementTitle,
  defaultSummary,
  onTicketCreated,
}) => {
  const [summary, setSummary] = useState(defaultSummary || `Remediation: ${requirementId} - ${requirementTitle}`);
  const [description, setDescription] = useState(`Requirement ${requirementId} is currently not met.\n\nRequired Action:\nImplementation of proper controls to satisfy: ${requirementTitle}.`);
  const [board, setBoard] = useState(config.serviceBoard || 'Compliance Remediation');
  const [priority, setPriority] = useState<TicketType['priority']>('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newTicket = await createConnectWiseTicket({
        requirementId,
        summary,
        description,
        board,
        priority,
        source: 'ConnectWise',
      }, config);
      onTicketCreated(newTicket);
      onClose();
    } catch (error) {
      console.error("Failed to create ticket", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-900 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold flex items-center gap-2">
            <Ticket size={20} /> Create Remediation Ticket
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
             <input
               type="text"
               value={summary}
               onChange={(e) => setSummary(e.target.value)}
               className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
               required
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
             <textarea
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               rows={5}
               className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
               required
             />
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Board</label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option>Compliance Remediation</option>
                  <option>Help Desk</option>
                  <option>NOC</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
             </div>
           </div>

           <div className="pt-4 flex gap-3 justify-end">
             <button
               type="button"
               onClick={onClose}
               className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
             >
               Cancel
             </button>
             <button
               type="submit"
               disabled={isSubmitting}
               className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
             >
               {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ClipboardList size={18} />}
               Create Ticket
             </button>
           </div>
        </form>
      </div>
    </div>
  );
};