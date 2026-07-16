import React, { useState } from 'react';
import { SupportTicket } from '../types';
import { Plus, Search, Filter, ShieldAlert, CheckCircle2, AlertTriangle, Play, HelpCircle, Clock, UserCheck, LifeBuoy } from 'lucide-react';

interface SupportModuleProps {
  tickets: SupportTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
}

export default function SupportModule({ tickets, setTickets }: SupportModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Selected ticket for modal detail view
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  // Create ticket state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<Partial<SupportTicket>>({
    subject: '', contactName: '', contactEmail: '', priority: 'Medium', description: '', assignedAgent: 'Ben Miller (React Dev)'
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.contactName || !newTicket.contactEmail || !newTicket.description) return;

    const ticketToAdd: SupportTicket = {
      id: `TKT-${String(tickets.length + 101).padStart(3, '0')}`,
      subject: newTicket.subject,
      contactName: newTicket.contactName,
      contactEmail: newTicket.contactEmail,
      priority: newTicket.priority as SupportTicket['priority'],
      status: 'Open',
      assignedAgent: newTicket.assignedAgent || 'Ben Miller (React Dev)',
      createdTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: newTicket.description
    };

    setTickets(prev => [ticketToAdd, ...prev]);
    
    // Reset Form
    setNewTicket({
      subject: '', contactName: '', contactEmail: '', priority: 'Medium', description: '', assignedAgent: 'Ben Miller (React Dev)'
    });
    setIsCreateModalOpen(false);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleAssignAgent = (ticketId: string, agent: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedAgent: agent } : t));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, assignedAgent: agent } : null);
    }
  };

  // Filter list
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Calculate ticket dashboard aggregates
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const criticalCount = tickets.filter(t => t.priority === 'Critical' && t.status !== 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h2 className="font-sans font-bold text-lg text-brand-text uppercase tracking-tight flex items-center gap-2">
            <LifeBuoy size={18} /> Support Operations & Incident Management
          </h2>
          <p className="text-xs text-brand-text/60 mt-1">
            Track user incidents, allocate developer threads (Java, React), and maintain CRM database SLA targets.
          </p>
        </div>
        <button
          id="tkt-btn-create"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-brand-text text-brand-bg rounded-none text-xs font-bold uppercase border border-brand-border hover:bg-transparent hover:text-brand-text transition cursor-pointer"
        >
          <Plus size={14} /> File Support Ticket
        </button>
      </div>

      {/* Support KPI Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-brand-border bg-transparent divide-y md:divide-y-0 md:divide-x divide-brand-border">
        <div className="p-4 bg-white/10 flex items-center gap-4">
          <div className="bg-brand-text/5 p-2 border border-brand-border text-brand-text font-bold">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-text/50 uppercase tracking-wider font-mono block">Unresolved Open Incidents</span>
            <span className="font-mono font-black text-xl text-brand-text mt-0.5 inline-block">{openCount}</span>
            <span className="text-brand-text/40 text-[9px] block font-mono uppercase">Awaiting SLA Triage</span>
          </div>
        </div>

        <div className="p-4 bg-white/10 flex items-center gap-4">
          <div className="bg-brand-text/5 p-2 border border-brand-border text-brand-text font-bold">
            <Play size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-text/50 uppercase tracking-wider font-mono block">Under Investigation</span>
            <span className="font-mono font-black text-xl text-brand-text mt-0.5 inline-block">{inProgressCount}</span>
            <span className="text-brand-text/40 text-[9px] block font-mono uppercase">Assigned to Specialists</span>
          </div>
        </div>

        <div className="p-4 bg-white/10 flex items-center gap-4">
          <div className="bg-brand-text/5 p-2 border border-brand-border text-brand-text font-bold">
            <ShieldAlert size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-text/50 uppercase tracking-wider font-mono block">Critical Severity Breaches</span>
            <span className="font-mono font-black text-xl text-brand-text mt-0.5 inline-block">{criticalCount}</span>
            <span className="text-brand-text/40 text-[9px] block font-mono uppercase">DB Locks & Timeout Events</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout (Tickets List + Detailed Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Ticket List Queue */}
        <div className="lg:col-span-2 bg-white/10 border border-brand-border rounded-none overflow-hidden shadow-none">
          {/* Controls */}
          <div className="p-3 border-b border-brand-border flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-brand-text/5">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 text-brand-text/60" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject, description or ticket ID..."
                className="w-full pl-8 pr-4 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden focus:ring-1 focus:ring-brand-text"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs font-bold uppercase text-brand-text bg-brand-bg border border-brand-border rounded-none px-2 py-1.5 focus:outline-hidden"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-bold uppercase text-brand-text bg-brand-bg border border-brand-border rounded-none px-2 py-1.5 focus:outline-hidden"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-text text-brand-bg uppercase text-xxs font-mono font-bold tracking-wider border-b border-brand-border">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Incident Topic</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Assigned Specialist</th>
                  <th className="py-3 px-4 text-right">Logged At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/20 text-xs text-brand-text bg-white/5">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-brand-text/50 italic">
                      No matching support incidents in active queue.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((tkt) => {
                    // Priority style
                    let prioColor = 'border-brand-border text-brand-text bg-brand-text/5';
                    if (tkt.priority === 'Critical') prioColor = 'border-rose-800 text-rose-800 bg-rose-800/10 font-bold';
                    if (tkt.priority === 'High') prioColor = 'border-amber-800 text-amber-800 bg-amber-800/10 font-semibold';

                    // Status style
                    let statColor = 'border-brand-border text-brand-text';
                    if (tkt.status === 'Resolved') statColor = 'border-emerald-800 text-emerald-800 bg-emerald-800/10 font-bold';
                    if (tkt.status === 'In Progress') statColor = 'border-brand-border text-brand-text bg-brand-text/15 font-bold';

                    return (
                      <tr 
                        key={tkt.id} 
                        id={`ticket-row-${tkt.id}`}
                        onClick={() => setSelectedTicket(tkt)}
                        className={`cursor-pointer transition duration-100 ${
                          selectedTicket?.id === tkt.id 
                            ? 'bg-brand-text text-brand-bg font-bold border-l-4 border-brand-text' 
                            : 'hover:bg-brand-text/5'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-xs text-brand-text/50">
                          {tkt.id}
                        </td>
                        <td className="py-3 px-4 max-w-[260px]">
                          <div>
                            <p className="font-bold truncate uppercase text-xs">{tkt.subject}</p>
                            <p className="text-xxs mt-0.5 truncate opacity-60">{tkt.contactName} ({tkt.contactEmail})</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-1.5 py-0.5 border text-[9px] font-bold uppercase ${prioColor}`}>
                            {tkt.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-1.5 py-0.5 border text-[9px] font-bold uppercase ${statColor}`}>
                            {tkt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs opacity-80 truncate max-w-[150px]">
                          {tkt.assignedAgent}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xxs opacity-50">
                          {tkt.createdTime}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Operations Panel */}
        <div className="bg-white/10 border border-brand-border rounded-none overflow-hidden shadow-none h-[520px] flex flex-col">
          {selectedTicket ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Detailed Header */}
              <div className="p-5 border-b border-brand-border bg-brand-text/5">
                <div className="flex justify-between items-center">
                  <span className="text-xxs font-mono font-bold text-brand-text/50">{selectedTicket.id}</span>
                  <span className="px-2 py-0.5 border border-brand-border text-[9px] font-mono font-bold uppercase">
                    {selectedTicket.status}
                  </span>
                </div>
                <h3 className="font-bold text-brand-text text-sm uppercase mt-2 leading-tight">
                  {selectedTicket.subject}
                </h3>
                <div className="text-[10px] text-brand-text/60 mt-2 font-mono flex items-center gap-1.5 flex-wrap">
                  <span>Client:</span> 
                  <span className="text-brand-text font-bold">{selectedTicket.contactName}</span>
                  <span>•</span>
                  <span className="text-brand-text opacity-85">{selectedTicket.contactEmail}</span>
                </div>
              </div>

              {/* Detailed Body */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold text-brand-text/40 uppercase tracking-wider font-mono">Incident Description</h4>
                  <p className="text-xs text-brand-text leading-relaxed mt-1.5 bg-brand-bg p-3 border border-brand-border/40 font-mono">
                    {selectedTicket.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-brand-text/40 uppercase tracking-wider font-mono">Allocated Developer Thread</h4>
                  <div className="flex items-center gap-2 mt-1.5 bg-brand-bg p-2.5 border border-brand-border/40">
                    <UserCheck size={12} className="text-brand-text" />
                    <span className="text-xs text-brand-text font-mono font-bold">{selectedTicket.assignedAgent}</span>
                  </div>
                </div>

                {/* Developer Thread Quick Allocator */}
                <div>
                  <h4 className="text-[10px] font-bold text-brand-text/40 uppercase tracking-wider font-mono">Escalate / Reallocate</h4>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <button
                      onClick={() => handleAssignAgent(selectedTicket.id, 'Sarah Connor (Java Expert)')}
                      className="text-[9px] font-mono font-bold uppercase py-1 px-2 border border-brand-border bg-brand-bg text-brand-text hover:bg-brand-text hover:text-brand-bg text-left truncate transition cursor-pointer"
                    >
                      Sarah C. (Java Core)
                    </button>
                    <button
                      onClick={() => handleAssignAgent(selectedTicket.id, 'Alex Mercer (DBA)')}
                      className="text-[9px] font-mono font-bold uppercase py-1 px-2 border border-brand-border bg-brand-bg text-brand-text hover:bg-brand-text hover:text-brand-bg text-left truncate transition cursor-pointer"
                    >
                      Alex M. (Postgres DBA)
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-3 border-t border-brand-border bg-brand-text/5 flex gap-2">
                {selectedTicket.status !== 'In Progress' && selectedTicket.status !== 'Resolved' && (
                  <button
                    onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'In Progress')}
                    className="flex-1 py-1.5 bg-brand-text text-brand-bg border border-brand-border rounded-none text-xs font-bold uppercase hover:bg-transparent hover:text-brand-text transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play size={10} /> Begin Investigation
                  </button>
                )}
                {selectedTicket.status !== 'Resolved' && (
                  <button
                    onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'Resolved')}
                    className="flex-1 py-1.5 bg-emerald-800 text-white border border-emerald-900 rounded-none text-xs font-bold uppercase hover:bg-emerald-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={10} /> Resolve Incident
                  </button>
                )}
                {selectedTicket.status === 'Resolved' && (
                  <div className="flex-1 text-center py-1.5 border border-brand-border text-emerald-800 bg-emerald-800/10 rounded-none text-xs font-mono font-bold flex items-center justify-center gap-1.5 uppercase">
                    <CheckCircle2 size={12} /> Resolved SLA Targets Met
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-brand-text/50 bg-brand-text/5 h-full">
              <HelpCircle size={32} className="text-brand-text/40 mb-2" />
              <h4 className="font-bold text-brand-text text-xs uppercase">Incident Inspector</h4>
              <p className="text-[10px] text-brand-text/60 mt-1 max-w-[200px] uppercase tracking-wide font-mono">
                Select an incident queue row to investigate and allocate resources.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-brand-text/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-brand-bg rounded-none shadow-none border-2 border-brand-border max-w-md w-full overflow-hidden animate-in fade-in duration-100">
            <div className="p-5 border-b border-brand-border bg-brand-text/5">
              <h3 className="font-bold text-md text-brand-text uppercase tracking-tight">Log Support Incident</h3>
              <p className="text-xxs text-brand-text/60 mt-1 uppercase tracking-wider font-mono">
                Creates an incident row and triggers paging protocols.
              </p>
            </div>
            <form onSubmit={handleCreateTicket} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                  Ticket Subject / Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="Connection pool leak on database cluster"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(p => ({ ...p, subject: e.target.value }))}
                  className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Vance"
                    value={newTicket.contactName}
                    onChange={(e) => setNewTicket(p => ({ ...p, contactName: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="m.vance@nova.io"
                    value={newTicket.contactEmail}
                    onChange={(e) => setNewTicket(p => ({ ...p, contactEmail: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    SLA Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(p => ({ ...p, priority: e.target.value as SupportTicket['priority'] }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                  >
                    <option value="Low">Low (Standard)</option>
                    <option value="Medium">Medium (Elevated)</option>
                    <option value="High">High (Immediate)</option>
                    <option value="Critical">Critical (Paging Core)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Assigned Resource
                  </label>
                  <select
                    value={newTicket.assignedAgent}
                    onChange={(e) => setNewTicket(p => ({ ...p, assignedAgent: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden font-mono"
                  >
                    <option value="Ben Miller (React Dev)">Ben Miller (React Dev)</option>
                    <option value="Sarah Connor (Java Expert)">Sarah Connor (Java Expert)</option>
                    <option value="Alex Mercer (DBA)">Alex Mercer (PostgreSQL DBA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                  Detailed Diagnostic Logs
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe thread dumps, SQL errors, or browser stack traces..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(p => ({ ...p, description: e.target.value }))}
                  className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border/20">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 border border-brand-border text-brand-text rounded-none text-xs font-bold uppercase hover:bg-brand-text/5 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-brand-text text-brand-bg rounded-none text-xs font-bold uppercase hover:bg-brand-text/90 cursor-pointer transition"
                >
                  Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
