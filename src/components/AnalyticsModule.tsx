import React, { useState, useRef } from 'react';
import { Contact, Deal, SupportTicket } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  BarChart3, 
  Grid, 
  Download, 
  Upload, 
  Table, 
  RefreshCcw, 
  Globe, 
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface AnalyticsModuleProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  deals: Deal[];
  tickets: SupportTicket[];
}

export default function AnalyticsModule({ contacts, setContacts, deals, tickets }: AnalyticsModuleProps) {
  const [activeTab, setActiveTab] = useState<'powerbi' | 'excel'>('powerbi');
  const [selectedRegion, setSelectedRegion] = useState<string>('Global');
  
  // CSV Import drag & drop states
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Excel Inline Edit states
  const [editingCell, setEditingCell] = useState<{ rowId: string; colName: string } | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Power BI Regional multipliers (to simulate live regional queries)
  const regionMultiplier: Record<string, number> = {
    'Global': 1.0,
    'Americas': 0.55,
    'EMEA': 0.30,
    'APAC': 0.15
  };

  const mult = regionMultiplier[selectedRegion] || 1.0;

  // Compute live pipeline aggregate for charts
  const rawPipelineData = [
    { name: 'Lead', value: Math.round(deals.filter(d => d.stage === 'Lead').reduce((acc, d) => acc + d.value, 0) * mult) },
    { name: 'Contacted', value: Math.round(deals.filter(d => d.stage === 'Contacted').reduce((acc, d) => acc + d.value, 0) * mult) },
    { name: 'Proposal', value: Math.round(deals.filter(d => d.stage === 'Proposal').reduce((acc, d) => acc + d.value, 0) * mult) },
    { name: 'Negotiation', value: Math.round(deals.filter(d => d.stage === 'Negotiation').reduce((acc, d) => acc + d.value, 0) * mult) },
    { name: 'Won', value: Math.round(deals.filter(d => d.stage === 'Won').reduce((acc, d) => acc + d.value, 0) * mult) },
    { name: 'Lost', value: Math.round(deals.filter(d => d.stage === 'Lost').reduce((acc, d) => acc + d.value, 0) * mult) }
  ];

  // Incidents SLA Chart data over time
  const rawIncidentData = [
    { day: 'Mon', Resolved: Math.round(12 * mult), Open: Math.round(4 * mult) },
    { day: 'Tue', Resolved: Math.round(16 * mult), Open: Math.round(6 * mult) },
    { day: 'Wed', Resolved: Math.round(14 * mult), Open: Math.round(7 * mult) },
    { day: 'Thu', Resolved: Math.round(18 * mult), Open: Math.round(5 * mult) },
    { day: 'Fri', Resolved: Math.round(22 * mult), Open: Math.round(3 * mult) },
    { day: 'Sat', Resolved: Math.round(8 * mult), Open: Math.round(2 * mult) },
    { day: 'Sun', Resolved: Math.round(5 * mult), Open: Math.round(1 * mult) }
  ];

  // Lead channels breakdown chart
  const leadChannelData = [
    { name: 'REST APIs', value: Math.round(40 * mult), color: '#6366f1' },
    { name: 'Partners', value: Math.round(25 * mult), color: '#38bdf8' },
    { name: 'Organic Search', value: Math.round(20 * mult), color: '#34d399' },
    { name: 'Cold Outbound', value: Math.round(15 * mult), color: '#f59e0b' }
  ];

  // Excel Cell Inline Double Click Editor
  const handleCellDoubleClick = (contactId: string, colName: string, currentValue: any) => {
    setEditingCell({ rowId: contactId, colName });
    setEditingValue(String(currentValue));
  };

  const handleCellSave = (contactId: string, colName: string) => {
    if (!editingCell) return;

    setContacts(prev => prev.map(c => {
      if (c.id !== contactId) return c;

      let val: any = editingValue;
      if (colName === 'value') {
        val = Number(editingValue.replace(/[^0-9]/g, '')) || 0;
      }

      return {
        ...c,
        [colName]: val
      };
    }));

    setEditingCell(null);
  };

  // Excel CSV exporter
  const handleExportCSV = () => {
    const headers = ['id', 'name', 'email', 'phone', 'company', 'status', 'value', 'assignedTo', 'createdDate'];
    const rows = contacts.map(c => [
      c.id, c.name, c.email, c.phone, c.company, c.status, c.value, c.assignedTo, c.createdDate
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `crm_contacts_excel_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel CSV importer (CSV Parser)
  const handleFileDropAndUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim() !== '');
        
        if (lines.length <= 1) {
          throw new Error("CSV has no rows");
        }

        const newContactsList: Contact[] = [];
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          const columns = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
          if (columns.length < 5) continue;

          newContactsList.push({
            id: `CON-${String(contacts.length + i).padStart(3, '0')}`,
            name: columns[1] || columns[0],
            email: columns[2] || 'imported@crm.com',
            phone: columns[3] || '+1 (555) 000-0000',
            company: columns[4] || 'Imported Corp',
            status: (columns[5] as Contact['status']) || 'Lead',
            value: Number(columns[6]) || 15000,
            assignedTo: columns[7] || 'Bob Johnson',
            createdDate: columns[8] || new Date().toISOString().slice(0, 10)
          });
        }

        if (newContactsList.length > 0) {
          setContacts(prev => [...newContactsList, ...prev]);
          setCsvUploadSuccess(`Successfully imported ${newContactsList.length} customer rows from Excel sheet!`);
          setTimeout(() => setCsvUploadSuccess(null), 4000);
        }
      } catch (err) {
        alert("Failed to parse CSV file. Ensure standard column formatting.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h2 className="font-sans font-bold text-lg text-brand-text uppercase tracking-tight flex items-center gap-2">
            <BarChart3 size={18} /> Reporting & BI Dashboard Workspace
          </h2>
          <p className="text-xs text-brand-text/60 mt-1">
            Display live sales charts from Power BI gateway and update records inside Microsoft Excel-style online grids.
          </p>
        </div>
        
        {/* Toggle BI / Excel */}
        <div className="flex bg-brand-text/5 p-1 border border-brand-border text-xs font-bold uppercase tracking-wider font-mono shrink-0">
          <button
            onClick={() => setActiveTab('powerbi')}
            className={`px-3 py-1 cursor-pointer transition flex items-center gap-1.5 ${activeTab === 'powerbi' ? 'bg-brand-text text-brand-bg font-bold' : 'text-brand-text/60 hover:text-brand-text'}`}
          >
            <TrendingUp size={13} /> Power BI Reports
          </button>
          <button
            onClick={() => setActiveTab('excel')}
            className={`px-3 py-1 cursor-pointer transition flex items-center gap-1.5 ${activeTab === 'excel' ? 'bg-brand-text text-brand-bg font-bold' : 'text-brand-text/60 hover:text-brand-text'}`}
          >
            <FileSpreadsheet size={13} /> Microsoft Excel Spreadsheet
          </button>
        </div>
      </div>

      {/* SUCCESS TOAST FOR CSV IMPORT */}
      {csvUploadSuccess && (
        <div className="bg-emerald-800/10 border border-brand-border text-emerald-800 p-4 rounded-none flex items-center gap-3">
          <CheckCircle className="shrink-0" size={16} />
          <span className="text-xs font-bold font-mono uppercase">{csvUploadSuccess}</span>
        </div>
      )}

      {/* TAB 1: POWER BI ANALYTICS VIEW */}
      {activeTab === 'powerbi' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white/10 border border-brand-border p-4 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="text-brand-text/60" size={14} />
              <span className="text-xs font-bold text-brand-text uppercase tracking-wider font-mono">
                Power BI Gateway Filter:
              </span>
            </div>
            
            <div className="flex bg-brand-text/5 p-1 border border-brand-border text-xs font-bold uppercase tracking-wider font-mono w-full md:w-auto">
              {['Global', 'Americas', 'EMEA', 'APAC'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`flex-1 md:flex-none px-3.5 py-1 transition cursor-pointer ${
                    selectedRegion === region
                      ? 'bg-brand-text text-brand-bg font-bold'
                      : 'text-brand-text/60 hover:text-brand-text'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Graphical layout: Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Pipeline Stage Bar Chart */}
            <div className="lg:col-span-2 bg-white/10 border border-brand-border p-5 rounded-none shadow-none">
              <h3 className="font-bold text-brand-text text-xs uppercase tracking-wider font-mono mb-4 flex justify-between items-center">
                <span>Active Funnel Volume (by Stage)</span>
                <span className="text-[10px] text-brand-text font-bold bg-brand-text/5 border border-brand-border px-2.5 py-0.5 font-mono uppercase">
                  Postgres Live Stream
                </span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rawPipelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--brand-border)" opacity={0.3} />
                    <XAxis dataKey="name" stroke="var(--brand-text)" fontSize={10} tickLine={false} fontClassName="font-mono uppercase" />
                    <YAxis stroke="var(--brand-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Pipeline Value']} cursor={{ fill: 'rgba(20,20,20,0.05)' }} />
                    <Bar dataKey="value" fill="var(--brand-text)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leads distribution Pie Chart */}
            <div className="bg-white/10 border border-brand-border p-5 rounded-none shadow-none flex flex-col">
              <h3 className="font-bold text-brand-text text-xs uppercase tracking-wider font-mono mb-4">
                Lead Acquisition Sources
              </h3>
              <div className="flex-1 h-44 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadChannelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {leadChannelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Volume Share']} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Central percentage stats overlay */}
                <div className="absolute text-center">
                  <span className="text-xl font-mono font-bold text-brand-text block">
                    {Math.round(40 * mult)}%
                  </span>
                  <span className="text-[9px] font-bold text-brand-text/60 font-mono uppercase tracking-wider">
                    REST API
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono uppercase font-bold text-brand-text/70">
                {leadChannelData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 border border-brand-border inline-block shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Incidents Area Chart */}
            <div className="lg:col-span-3 bg-white/10 border border-brand-border p-5 rounded-none shadow-none">
              <h3 className="font-bold text-brand-text text-xs uppercase tracking-wider font-mono mb-4">
                Operational SLA Resolution Cycles (Incident Load Trend)
              </h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rawIncidentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--brand-border)" opacity={0.3} />
                    <XAxis dataKey="day" stroke="var(--brand-text)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--brand-text)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} iconType="square" />
                    <Area type="monotone" dataKey="Resolved" stroke="#10b981" fillOpacity={0.1} fill="#10b981" strokeWidth={2} />
                    <Area type="monotone" dataKey="Open" stroke="#ef4444" fillOpacity={0.1} fill="#ef4444" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXCEL SPREADSHEET VIEW */}
      {activeTab === 'excel' && (
        <div className="bg-white/10 border border-brand-border rounded-none overflow-hidden shadow-none">
          {/* Spreadsheet Header Utility bar */}
          <div className="p-4 border-b border-brand-border bg-brand-text/5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 px-3 py-1 bg-emerald-800/10 text-emerald-800 border border-brand-border text-xs font-bold font-mono uppercase">
                <Table size={14} /> CRM_Excel_Grid.csv
              </span>
              <span className="text-[10px] text-brand-text/60 font-bold uppercase font-mono">
                Double-click any cell below to modify values inline and press Enter.
              </span>
            </div>

            {/* Importer/Exporter buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 border border-brand-border bg-brand-bg hover:bg-brand-text hover:text-brand-bg text-xs font-bold uppercase font-mono transition cursor-pointer"
              >
                <Upload size={14} /> Import Spreadsheet
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileDropAndUpload}
                accept=".csv"
                className="hidden"
              />
              
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-text text-brand-bg border border-brand-border text-xs font-bold uppercase font-mono transition cursor-pointer"
              >
                <Download size={14} /> Export CSV Excel
              </button>
            </div>
          </div>

          {/* Interactive grid table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr className="bg-brand-text/10 text-brand-text font-mono font-bold border-b border-brand-border text-[10px] tracking-wider uppercase">
                  <th className="py-2.5 px-4 border-r border-brand-border w-12 text-center bg-brand-text/15 text-brand-text font-black">Row</th>
                  <th className="py-2.5 px-4 border-r border-brand-border">A: Contact ID</th>
                  <th className="py-2.5 px-4 border-r border-brand-border">B: Contact Name</th>
                  <th className="py-2.5 px-4 border-r border-brand-border">C: Email Address</th>
                  <th className="py-2.5 px-4 border-r border-brand-border">D: Telephone</th>
                  <th className="py-2.5 px-4 border-r border-brand-border">E: Company</th>
                  <th className="py-2.5 px-4 border-r border-brand-border">F: Status</th>
                  <th className="py-2.5 px-4">G: Value ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/20 bg-brand-bg">
                {contacts.map((contact, idx) => (
                  <tr key={contact.id} className="hover:bg-brand-text/5">
                    {/* Row Index */}
                    <td className="py-3 px-4 border-r border-brand-border text-center bg-brand-text/5 font-mono font-bold text-brand-text/40">
                      {idx + 1}
                    </td>

                    {/* ID Cell (Read Only) */}
                    <td className="py-3 px-4 border-r border-brand-border font-mono text-brand-text/40 bg-brand-text/5">
                      {contact.id}
                    </td>

                    {/* Name Cell */}
                    <td 
                      onDoubleClick={() => handleCellDoubleClick(contact.id, 'name', contact.name)}
                      className="py-3 px-4 border-r border-brand-border font-medium text-brand-text cursor-cell hover:bg-brand-text/5 hover:ring-1 hover:ring-brand-border"
                    >
                      {editingCell?.rowId === contact.id && editingCell?.colName === 'name' ? (
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => handleCellSave(contact.id, 'name')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(contact.id, 'name')}
                          autoFocus
                          className="w-full bg-brand-bg border border-brand-border focus:outline-hidden px-2 py-1 rounded-none font-sans text-brand-text"
                        />
                      ) : (
                        contact.name
                      )}
                    </td>

                    {/* Email Cell */}
                    <td 
                      onDoubleClick={() => handleCellDoubleClick(contact.id, 'email', contact.email)}
                      className="py-3 px-4 border-r border-brand-border text-brand-text/85 font-mono cursor-cell hover:bg-brand-text/5 hover:ring-1 hover:ring-brand-border"
                    >
                      {editingCell?.rowId === contact.id && editingCell?.colName === 'email' ? (
                        <input
                          type="email"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => handleCellSave(contact.id, 'email')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(contact.id, 'email')}
                          autoFocus
                          className="w-full bg-brand-bg border border-brand-border focus:outline-hidden px-2 py-1 rounded-none font-mono text-brand-text"
                        />
                      ) : (
                        contact.email
                      )}
                    </td>

                    {/* Telephone Cell */}
                    <td 
                      onDoubleClick={() => handleCellDoubleClick(contact.id, 'phone', contact.phone)}
                      className="py-3 px-4 border-r border-brand-border text-brand-text/80 font-mono cursor-cell hover:bg-brand-text/5 hover:ring-1 hover:ring-brand-border"
                    >
                      {editingCell?.rowId === contact.id && editingCell?.colName === 'phone' ? (
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => handleCellSave(contact.id, 'phone')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(contact.id, 'phone')}
                          autoFocus
                          className="w-full bg-brand-bg border border-brand-border focus:outline-hidden px-2 py-1 rounded-none font-mono text-brand-text"
                        />
                      ) : (
                        contact.phone
                      )}
                    </td>

                    {/* Company Cell */}
                    <td 
                      onDoubleClick={() => handleCellDoubleClick(contact.id, 'company', contact.company)}
                      className="py-3 px-4 border-r border-brand-border text-brand-text font-bold cursor-cell hover:bg-brand-text/5 hover:ring-1 hover:ring-brand-border"
                    >
                      {editingCell?.rowId === contact.id && editingCell?.colName === 'company' ? (
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => handleCellSave(contact.id, 'company')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(contact.id, 'company')}
                          autoFocus
                          className="w-full bg-brand-bg border border-brand-border focus:outline-hidden px-2 py-1 rounded-none font-sans text-brand-text"
                        />
                      ) : (
                        contact.company
                      )}
                    </td>

                    {/* Status Cell */}
                    <td 
                      onDoubleClick={() => handleCellDoubleClick(contact.id, 'status', contact.status)}
                      className="py-3 px-4 border-r border-brand-border cursor-cell hover:bg-brand-text/5 hover:ring-1 hover:ring-brand-border"
                    >
                      {editingCell?.rowId === contact.id && editingCell?.colName === 'status' ? (
                        <select
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => handleCellSave(contact.id, 'status')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(contact.id, 'status')}
                          autoFocus
                          className="w-full bg-brand-bg border border-brand-border focus:outline-hidden px-2 py-1 rounded-none text-xs font-sans text-brand-text"
                        >
                          <option value="Lead">Lead</option>
                          <option value="Contact">Contact</option>
                          <option value="Customer">Customer</option>
                        </select>
                      ) : (
                        <span className="px-1.5 py-0.5 border border-brand-border text-[9px] font-bold font-mono uppercase bg-brand-text/5 text-brand-text">
                          {contact.status}
                        </span>
                      )}
                    </td>

                    {/* Value Cell */}
                    <td 
                      onDoubleClick={() => handleCellDoubleClick(contact.id, 'value', contact.value)}
                      className="py-3 px-4 font-mono font-semibold text-brand-text text-right cursor-cell hover:bg-brand-text/5 hover:ring-1 hover:ring-brand-border"
                    >
                      {editingCell?.rowId === contact.id && editingCell?.colName === 'value' ? (
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => handleCellSave(contact.id, 'value')}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(contact.id, 'value')}
                          autoFocus
                          className="w-24 bg-brand-bg border border-brand-border focus:outline-hidden px-2 py-1 rounded-none font-mono text-right text-brand-text"
                        />
                      ) : (
                        `$${contact.value.toLocaleString()}`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
