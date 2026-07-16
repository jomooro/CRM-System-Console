import React, { useState } from 'react';
import { Contact, Deal } from '../types';
import { Plus, Search, Filter, ShieldAlert, CheckCircle2, ChevronRight, Briefcase, Trash2, Edit2, Users } from 'lucide-react';

interface CRMModuleProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
}

export default function CRMModule({ contacts, setContacts, deals, setDeals }: CRMModuleProps) {
  const [crmSubTab, setCrmSubTab] = useState<'contacts' | 'pipeline'>('contacts');
  
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Form modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: '', email: '', phone: '', company: '', status: 'Lead', value: 0, assignedTo: 'John Doe'
  });

  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({
    title: '', company: '', value: 0, stage: 'Lead', contactPerson: '', probability: 20, closingDate: '2026-08-30'
  });

  // Calculate stats
  const totalPipeline = deals.reduce((acc, curr) => acc + (curr.stage !== 'Lost' ? curr.value : 0), 0);
  const totalWins = deals.filter(d => d.stage === 'Won').reduce((acc, curr) => acc + curr.value, 0);
  const activeLeadsCount = contacts.filter(c => c.status === 'Lead').length;

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email || !newContact.company) return;

    const contactToAdd: Contact = {
      id: `CON-${String(contacts.length + 1).padStart(3, '0')}`,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || '+1 (555) 000-0000',
      company: newContact.company,
      status: newContact.status as Contact['status'],
      value: Number(newContact.value) || 0,
      assignedTo: newContact.assignedTo || 'John Doe',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setContacts(prev => [contactToAdd, ...prev]);
    
    // Automatically create a matching deal for high value leads
    if (contactToAdd.value > 10000) {
      const dealToAdd: Deal = {
        id: `DEAL-${String(deals.length + 1).padStart(3, '0')}`,
        title: `${contactToAdd.company} Contract`,
        company: contactToAdd.company,
        value: contactToAdd.value,
        stage: 'Lead',
        contactPerson: contactToAdd.name,
        probability: 20,
        closingDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setDeals(prev => [dealToAdd, ...prev]);
    }

    // Reset Form
    setNewContact({ name: '', email: '', phone: '', company: '', status: 'Lead', value: 0, assignedTo: 'John Doe' });
    setIsContactModalOpen(false);
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.title || !newDeal.company || !newDeal.value) return;

    const dealToAdd: Deal = {
      id: `DEAL-${String(deals.length + 1).padStart(3, '0')}`,
      title: newDeal.title,
      company: newDeal.company,
      value: Number(newDeal.value) || 0,
      stage: newDeal.stage as Deal['stage'],
      contactPerson: newDeal.contactPerson || 'Unknown Contact',
      probability: Number(newDeal.probability) || 50,
      closingDate: newDeal.closingDate || '2026-12-31'
    };

    setDeals(prev => [dealToAdd, ...prev]);
    
    // Reset Form
    setNewDeal({ title: '', company: '', value: 0, stage: 'Lead', contactPerson: '', probability: 20, closingDate: '2026-08-30' });
    setIsDealModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateDealStage = (dealId: string, direction: 'forward' | 'backward' | 'win' | 'lose') => {
    const stages: Deal['stage'][] = ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'];
    
    setDeals(prev => prev.map(deal => {
      if (deal.id !== dealId) return deal;

      let currentIdx = stages.indexOf(deal.stage);
      let nextStage = deal.stage;
      let prob = deal.probability;

      if (direction === 'win') {
        nextStage = 'Won';
        prob = 100;
      } else if (direction === 'lose') {
        nextStage = 'Lost';
        prob = 0;
      } else {
        if (direction === 'forward' && currentIdx < stages.length - 3) { // stop before Won/Lost
          nextStage = stages[currentIdx + 1];
          prob = Math.min(prob + 20, 95);
        } else if (direction === 'backward' && currentIdx > 0) {
          nextStage = stages[currentIdx - 1];
          prob = Math.max(prob - 20, 10);
        }
      }

      return {
        ...deal,
        stage: nextStage,
        probability: prob
      };
    }));
  };

  // Filter contacts
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pipelineStages: Deal['stage'][] = ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'];

  return (
    <div className="space-y-6">
      {/* Module Title & Quick Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h2 className="font-sans font-bold text-lg text-brand-text tracking-tight uppercase flex items-center gap-2">
            <Users size={18} /> Core CRM Workspace
          </h2>
          <p className="text-xs text-brand-text/60 mt-1">
            Manage corporate sales pipeline accounts, lead generations, and deal stages.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            id="crm-btn-add-contact"
            onClick={() => setIsContactModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-brand-text text-brand-bg rounded-none text-xs font-bold uppercase border border-brand-border hover:bg-transparent hover:text-brand-text transition cursor-pointer"
          >
            <Plus size={14} /> Add Lead/Contact
          </button>
          <button
            id="crm-btn-add-deal"
            onClick={() => setIsDealModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 text-brand-text rounded-none text-xs font-bold uppercase border border-brand-border hover:bg-brand-text hover:text-brand-bg transition cursor-pointer"
          >
            <Briefcase size={14} /> Create Sales Deal
          </button>
        </div>
      </div>

      {/* CRM Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-brand-border bg-transparent divide-y md:divide-y-0 md:divide-x divide-brand-border">
        <div className="p-5 flex flex-col justify-between bg-white/10 h-28">
          <span className="text-[10px] font-bold text-brand-text/50 uppercase tracking-wider font-mono">
            Active Deal Funnel Value
          </span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="font-mono text-2xl font-black text-brand-text">
              ${totalPipeline.toLocaleString()}
            </span>
            <span className="bg-brand-text/5 text-brand-text px-2 py-0.5 border border-brand-border text-[9px] font-bold uppercase flex items-center gap-1">
              <CheckCircle2 size={10} /> Active Deals
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col justify-between bg-white/10 h-28">
          <span className="text-[10px] font-bold text-brand-text/50 uppercase tracking-wider font-mono">
            Total Closed Won Revenue
          </span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="font-mono text-2xl font-black text-brand-text">
              ${totalWins.toLocaleString()}
            </span>
            <span className="bg-brand-text/5 text-brand-text px-2 py-0.5 border border-brand-border text-[9px] font-bold uppercase">
              PostgreSQL Sync
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col justify-between bg-white/10 h-28">
          <span className="text-[10px] font-bold text-brand-text/50 uppercase tracking-wider font-mono">
            Pre-sales Leads Count
          </span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="font-mono text-2xl font-black text-brand-text">
              {activeLeadsCount}
            </span>
            <span className="bg-brand-text/5 text-brand-text px-2 py-0.5 border border-brand-border text-[9px] font-bold uppercase">
              Top Funnel
            </span>
          </div>
        </div>
      </div>

      {/* Internal Tab Selector */}
      <div className="flex border border-brand-border bg-brand-text/5 p-1 rounded-none">
        <button
          onClick={() => setCrmSubTab('contacts')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
            crmSubTab === 'contacts'
              ? 'bg-brand-text text-brand-bg'
              : 'text-brand-text/60 hover:text-brand-text'
          }`}
        >
          Contacts & Client Database ({filteredContacts.length})
        </button>
        <button
          onClick={() => setCrmSubTab('pipeline')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
            crmSubTab === 'pipeline'
              ? 'bg-brand-text text-brand-bg'
              : 'text-brand-text/60 hover:text-brand-text'
          }`}
        >
          Interactive Deal Pipeline ({deals.length})
        </button>
      </div>

      {/* Sub-tab 1: Contacts Database List */}
      {crmSubTab === 'contacts' && (
        <div className="bg-white/10 border border-brand-border rounded-none overflow-hidden shadow-none">
          {/* Controls */}
          <div className="p-3 border-b border-brand-border flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-brand-text/5">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 text-brand-text/60" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contact, email, or company name..."
                className="w-full pl-8 pr-4 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden focus:ring-1 focus:ring-brand-text"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 border border-brand-border rounded-none px-3 py-1.5 bg-brand-bg text-brand-text text-xs">
                <Filter size={12} className="text-brand-text/60" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold uppercase text-brand-text bg-transparent border-none focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Lead">Lead</option>
                  <option value="Contact">Contact</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-text text-brand-bg uppercase text-xxs font-mono font-bold tracking-wider border-b border-brand-border">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Name / Email</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Estimated Value</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/20 text-xs text-brand-text bg-white/5">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-brand-text/50 italic">
                      No matching records found. Create one above to begin!
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-brand-text/5 transition duration-100">
                      <td className="py-3 px-4 font-mono font-bold text-xs text-brand-text/50">
                        {contact.id}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold text-brand-text">{contact.name}</p>
                          <p className="text-brand-text/55 text-xxs mt-0.5">{contact.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-brand-text/80">
                        {contact.company}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 border border-brand-border text-[9px] font-bold uppercase tracking-wide">
                          {contact.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-brand-text">
                        ${contact.value.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-brand-text/60 font-mono text-xxs">
                        {contact.assignedTo}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-1 text-brand-text hover:text-rose-700 transition"
                          title="Delete Contact"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Interactive Pipeline Kanban Board */}
      {crmSubTab === 'pipeline' && (
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {pipelineStages.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageTotalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div key={stage} className="bg-white/10 rounded-none p-3 min-w-[220px] border border-brand-border flex flex-col h-[520px]">
                {/* Header Info */}
                <div className="p-2 flex items-center justify-between mb-3 font-sans font-bold text-[10px] uppercase bg-brand-text text-brand-bg rounded-none border border-brand-border">
                  <span>{stage} ({stageDeals.length})</span>
                  <span className="font-mono">${stageTotalValue.toLocaleString()}</span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {stageDeals.length === 0 ? (
                    <div className="h-full border border-dashed border-brand-border/40 rounded-none flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-brand-text/40 text-[9px] uppercase tracking-wider font-mono">Empty Stage</span>
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div key={deal.id} className="bg-white/20 p-3 rounded-none border border-brand-border/40 hover:border-brand-border hover:bg-white/30 transition shadow-none">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xxs font-bold text-brand-text font-mono tracking-tight bg-brand-text/10 px-1 py-0.5">
                            {deal.id}
                          </span>
                          <span className="text-[10px] text-brand-text/50 font-mono">
                            {deal.probability}%
                          </span>
                        </div>
                        <h4 className="font-bold text-brand-text text-xs mt-1.5 leading-tight uppercase line-clamp-2">
                          {deal.title}
                        </h4>
                        <p className="text-[10px] text-brand-text/60 font-medium mt-0.5">
                          {deal.company}
                        </p>
                        
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-brand-border/20">
                          <span className="font-mono font-bold text-brand-text text-xs">
                            ${deal.value.toLocaleString()}
                          </span>
                          <span className="text-brand-text/40 text-[10px] font-mono">
                            {deal.closingDate}
                          </span>
                        </div>

                        {/* Interactive Phase Shifters */}
                        {stage !== 'Won' && stage !== 'Lost' && (
                          <div className="flex justify-between items-center gap-1.5 mt-3 pt-2 border-t border-brand-border/10">
                            <button
                              onClick={() => handleUpdateDealStage(deal.id, 'backward')}
                              disabled={stage === 'Lead'}
                              className="text-[9px] text-brand-text px-1.5 py-0.5 bg-brand-bg hover:bg-brand-text hover:text-brand-bg rounded-none border border-brand-border disabled:opacity-40 cursor-pointer uppercase font-bold"
                            >
                              ◄ Back
                            </button>
                            <button
                              onClick={() => handleUpdateDealStage(deal.id, 'forward')}
                              className="text-[9px] text-brand-text px-1.5 py-0.5 bg-brand-bg hover:bg-brand-text hover:text-brand-bg rounded-none border border-brand-border cursor-pointer uppercase font-bold"
                            >
                              Next ►
                            </button>
                          </div>
                        )}
                        
                        {stage !== 'Won' && stage !== 'Lost' && (
                          <div className="flex justify-stretch gap-1 mt-1.5">
                            <button
                              onClick={() => handleUpdateDealStage(deal.id, 'win')}
                              className="flex-1 text-[8px] text-emerald-800 bg-brand-bg border border-brand-border px-1 py-0.5 hover:bg-emerald-800 hover:text-white rounded-none text-center cursor-pointer font-bold uppercase"
                            >
                              ✓ Won
                            </button>
                            <button
                              onClick={() => handleUpdateDealStage(deal.id, 'lose')}
                              className="flex-1 text-[8px] text-rose-800 bg-brand-bg border border-brand-border px-1 py-0.5 hover:bg-rose-800 hover:text-white rounded-none text-center cursor-pointer font-bold uppercase"
                            >
                              ✗ Lost
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD CONTACT */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-brand-text/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-brand-bg rounded-none shadow-none border-2 border-brand-border max-w-md w-full overflow-hidden animate-in fade-in duration-100">
            <div className="p-5 border-b border-brand-border bg-brand-text/5">
              <h3 className="font-bold text-md text-brand-text uppercase tracking-tight">Add Lead / Contact</h3>
              <p className="text-xxs text-brand-text/60 mt-1 uppercase tracking-wider font-mono">
                Values over $10K automatically trigger pipeline deals.
              </p>
            </div>
            <form onSubmit={handleAddContact} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Jenkins"
                  value={newContact.name}
                  onChange={(e) => setNewContact(p => ({ ...p, name: e.target.value }))}
                  className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden focus:border-brand-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sjenkins@corp.com"
                    value={newContact.email}
                    onChange={(e) => setNewContact(p => ({ ...p, email: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 012-3456"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(p => ({ ...p, phone: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                  Company
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apex Technologies"
                  value={newContact.company}
                  onChange={(e) => setNewContact(p => ({ ...p, company: e.target.value }))}
                  className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Est. Value ($)
                  </label>
                  <input
                    type="number"
                    placeholder="45000"
                    value={newContact.value || ''}
                    onChange={(e) => setNewContact(p => ({ ...p, value: Number(e.target.value) }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Initial Status
                  </label>
                  <select
                    value={newContact.status}
                    onChange={(e) => setNewContact(p => ({ ...p, status: e.target.value as Contact['status'] }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Contact">Contact</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border/20">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-3 py-1.5 border border-brand-border text-brand-text rounded-none text-xs font-bold uppercase hover:bg-brand-text/5 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-brand-text text-brand-bg rounded-none text-xs font-bold uppercase hover:bg-brand-text/90 cursor-pointer transition"
                >
                  Create Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DEAL */}
      {isDealModalOpen && (
        <div className="fixed inset-0 bg-brand-text/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-brand-bg rounded-none shadow-none border-2 border-brand-border max-w-md w-full overflow-hidden animate-in fade-in duration-100">
            <div className="p-5 border-b border-brand-border bg-brand-text/5">
              <h3 className="font-bold text-md text-brand-text uppercase tracking-tight">Create Sales Deal</h3>
              <p className="text-xxs text-brand-text/60 mt-1 uppercase tracking-wider font-mono">
                Insert a record directly into the Active Pipeline.
              </p>
            </div>
            <form onSubmit={handleAddDeal} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                  Deal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enterprise CRM Clustering"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal(p => ({ ...p, title: e.target.value }))}
                  className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Quantum Cloud"
                    value={newDeal.company}
                    onChange={(e) => setNewDeal(p => ({ ...p, company: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="Elena Rostova"
                    value={newDeal.contactPerson}
                    onChange={(e) => setNewDeal(p => ({ ...p, contactPerson: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Deal Value ($)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="75000"
                    value={newDeal.value || ''}
                    onChange={(e) => setNewDeal(p => ({ ...p, value: Number(e.target.value) }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Stage
                  </label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal(p => ({ ...p, stage: e.target.value as Deal['stage'] }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="60"
                    value={newDeal.probability || ''}
                    onChange={(e) => setNewDeal(p => ({ ...p, probability: Number(e.target.value) }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-text/75 uppercase tracking-wider font-mono">
                    Closing Date
                  </label>
                  <input
                    type="date"
                    value={newDeal.closingDate}
                    onChange={(e) => setNewDeal(p => ({ ...p, closingDate: e.target.value }))}
                    className="w-full mt-1 px-3 py-1.5 border border-brand-border rounded-none text-xs bg-brand-bg text-brand-text focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border/20">
                <button
                  type="button"
                  onClick={() => setIsDealModalOpen(false)}
                  className="px-3 py-1.5 border border-brand-border text-brand-text rounded-none text-xs font-bold uppercase hover:bg-brand-text/5 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-brand-text text-brand-bg rounded-none text-xs font-bold uppercase hover:bg-brand-text/90 cursor-pointer transition"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
