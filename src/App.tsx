import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CRMModule from './components/CRMModule';
import SupportModule from './components/SupportModule';
import PostgresModule from './components/PostgresModule';
import AnalyticsModule from './components/AnalyticsModule';
import APIPlayground from './components/APIPlayground';

import { Contact, Deal, SupportTicket } from './types';
import { initialContacts, initialDeals, initialTickets } from './data/mockData';

import { 
  Users, 
  Briefcase, 
  LifeBuoy, 
  Database, 
  CheckCircle2, 
  Server, 
  ShieldCheck, 
  Clock, 
  Layers, 
  FileSpreadsheet,
  Settings,
  HelpCircle
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('crm_theme') || 'nordic';
  });

  // Sync theme to root class & localStorage
  useEffect(() => {
    localStorage.setItem('crm_theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-terminal', 'theme-blue', 'theme-nordic', 'theme-steel');
    if (theme === 'dark') {
      root.classList.add('theme-dark');
    }
  }, [theme]);

  const [fade, setFade] = useState(true);

  // Trigger smooth fade-in animation on theme change
  useEffect(() => {
    setFade(false);
    const timer = setTimeout(() => {
      setFade(true);
    }, 25);
    return () => clearTimeout(timer);
  }, [theme]);

  // Load from local storage or fallback to mock data
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('crm_contacts');
    return saved ? JSON.parse(saved) : initialContacts;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('crm_deals');
    return saved ? JSON.parse(saved) : initialDeals;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('crm_tickets');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('crm_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('crm_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('crm_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Calculations for KPI Cards
  const totalPipelineValue = deals.reduce((sum, d) => sum + (d.stage !== 'Lost' ? d.value : 0), 0);
  const totalRevenueWon = deals.filter(d => d.stage === 'Won').reduce((sum, d) => sum + d.value, 0);
  const openIncidentsCount = tickets.filter(t => t.status !== 'Resolved').length;
  const totalCustomers = contacts.filter(c => c.status === 'Customer').length;

  // Mini Chart Data
  const miniChartData = deals.slice(0, 5).map(d => ({ name: d.company.slice(0, 10), value: d.value }));

  // Live Simulated activity logs
  const systemLogs = [
    { time: "08:45:22", type: "DB_TRIGGER", desc: "Trigger audit_sales_deal_status fired: Row in audit_logs successfully updated." },
    { time: "08:32:01", type: "REST_API", desc: "API Request POST /api/v1/contacts successfully processed. Status code 210 Created." },
    { time: "08:15:10", type: "SUPPORT_SLA", desc: "Support ticket TKT-104 priority evaluated. SLA countdown established at 4 hours." },
    { time: "08:00:00", type: "DB_BACKUP", desc: "Cron pg_dump run complete. Full backup file written: pg_dump_crm_prod_20260716.sql" },
    { time: "07:44:11", type: "JAVA_CORE", desc: "JVM Connection pool validated. 18 active connection threads re-allocated." }
  ];

  return (
    <div className={`flex h-screen bg-brand-bg text-brand-text overflow-hidden font-sans select-none ${fade ? 'animate-theme-fade' : ''}`}>
      
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Global Action Header */}
        <header className="bg-transparent h-16 border-b border-brand-border px-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-bold text-brand-text/60 uppercase tracking-wider hidden md:inline">
              Host Environment: Cloud-Production
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-brand-text/5 px-2.5 py-1 border border-brand-border">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 inline-block animate-pulse"></span>
              <span>JVM THREADS: UP</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-brand-text/5 px-2.5 py-1 border border-brand-border">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 inline-block animate-pulse"></span>
              <span>POSTGRES: PRIMARY ONLINE</span>
            </div>
            {/* Interactive Theme Switcher */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-brand-text/5 px-2.5 py-1 border border-brand-border">
              <span className="text-brand-text/50 uppercase">THEME:</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-transparent font-bold uppercase focus:outline-hidden text-brand-text cursor-pointer border-none p-0 text-[10px] select-none"
              >
                <option value="nordic" className="bg-brand-bg text-brand-text font-bold">Nordic Frost</option>
                <option value="dark" className="bg-brand-bg text-brand-text font-bold">Cosmic Slate</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-brand-text leading-none uppercase">moorosi.jt@gmail.com</p>
              <span className="text-[9px] text-brand-text/50 font-bold font-mono tracking-tighter mt-0.5 inline-block uppercase">
                DBA & Systems Specialist
              </span>
            </div>
            <div className="w-8 h-8 bg-brand-text text-brand-bg flex items-center justify-center font-bold text-xs uppercase border border-brand-border">
              M
            </div>
          </div>
        </header>

        {/* Dynamic View Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 max-w-none w-full mx-auto">
          
          {/* TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Home Greeting Banner */}
              <div className="border border-brand-border bg-white/10 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-none shadow-none">
                <div>
                  <h2 className="font-sans font-bold text-lg tracking-tight text-brand-text uppercase flex items-center gap-2">
                    Unified CRM Systems Console
                  </h2>
                  <p className="text-brand-text/75 text-xs mt-1 max-w-3xl leading-relaxed">
                    This interactive simulator showcases professional experience building CRM modules, orchestrating 
                    Database diagnostics/PITR, writing trigger triggers, and executing reporting spreadsheets.
                  </p>
                </div>
                
                {/* Simulated timestamp block */}
                <div className="bg-brand-text/5 px-3 py-1.5 border border-brand-border font-mono text-xxs text-brand-text/85 whitespace-nowrap rounded-none">
                  <span className="block text-[8px] text-brand-text/50 uppercase tracking-widest font-bold">Mock Server Time</span>
                  <span className="font-bold flex items-center gap-1 mt-0.5 uppercase">
                    <Clock size={11} /> 2026-07-16 08:46:00
                  </span>
                </div>
              </div>

              {/* High-Level KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-brand-border bg-transparent divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
                
                {/* KPI 1 */}
                <div className="p-5 flex flex-col justify-between bg-white/10 h-32">
                  <div className="flex justify-between items-center text-brand-text/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">CRM Contacts</span>
                    <Users size={14} className="text-brand-text" />
                  </div>
                  <div>
                    <h3 className="font-mono text-3xl font-black text-brand-text tracking-tight">
                      {contacts.length}
                    </h3>
                    <p className="text-[9px] text-brand-text/60 font-mono mt-1 uppercase flex items-center gap-1">
                      <span className="text-emerald-800 font-bold">● Active</span> {totalCustomers} converted
                    </p>
                  </div>
                </div>

                {/* KPI 2 */}
                <div className="p-5 flex flex-col justify-between bg-white/10 h-32">
                  <div className="flex justify-between items-center text-brand-text/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Sales Pipeline</span>
                    <Briefcase size={14} className="text-brand-text" />
                  </div>
                  <div>
                    <h3 className="font-mono text-3xl font-black text-brand-text tracking-tight">
                      ${totalPipelineValue.toLocaleString()}
                    </h3>
                    <p className="text-[9px] text-brand-text/60 font-mono mt-1 uppercase flex items-center gap-1">
                      <span className="text-indigo-800 font-bold">${totalRevenueWon.toLocaleString()}</span> Won rev
                    </p>
                  </div>
                </div>

                {/* KPI 3 */}
                <div className="p-5 flex flex-col justify-between bg-white/10 h-32">
                  <div className="flex justify-between items-center text-brand-text/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Support Incidents</span>
                    <LifeBuoy size={14} className="text-brand-text" />
                  </div>
                  <div>
                    <h3 className="font-mono text-3xl font-black text-brand-text tracking-tight">
                      {openIncidentsCount}
                    </h3>
                    <p className="text-[9px] text-brand-text/60 font-mono mt-1 uppercase flex items-center gap-1">
                      <span className="text-amber-800 font-bold">94.8%</span> SLA COMPLIANCE
                    </p>
                  </div>
                </div>

                {/* KPI 4 */}
                <div className="p-5 flex flex-col justify-between bg-white/10 h-32">
                  <div className="flex justify-between items-center text-brand-text/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">PostgreSQL Cache</span>
                    <Database size={14} className="text-brand-text" />
                  </div>
                  <div>
                    <h3 className="font-mono text-3xl font-black text-brand-text tracking-tight">
                      99.42%
                    </h3>
                    <p className="text-[9px] text-brand-text/60 font-mono mt-1 uppercase flex items-center gap-1">
                      <span className="text-sky-850 font-bold">Active</span> WAL Log Cluster
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Middle section - Charts and Activity logs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 border border-brand-border divide-y lg:divide-y-0 lg:divide-x divide-brand-border bg-transparent">
                
                {/* Recharts Pipeline Preview */}
                <div className="lg:col-span-2 p-5 bg-white/10 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-sans font-bold text-brand-text text-xs uppercase tracking-wider">
                      BI Sales Pipeline Visualization
                    </h4>
                    <span className="text-[9px] font-bold font-mono text-brand-text/60 bg-brand-text/5 border border-brand-border/20 px-2 py-0.5">
                      Power BI Simulated Feed
                    </span>
                  </div>
                  
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={miniChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" fontSize={9} stroke="#141414" tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#141414', 
                            borderColor: '#141414', 
                            color: '#E4E3E0',
                            borderRadius: '0px',
                            fontFamily: 'monospace',
                            fontSize: '10px'
                          }}
                          itemStyle={{ color: '#E4E3E0' }}
                          labelStyle={{ color: '#E4E3E0', fontWeight: 'bold' }}
                          formatter={(value) => [`$${value}`, 'Value']} 
                        />
                        <Bar dataKey="value" fill="#141414" radius={0} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Live Daemon Logs shell */}
                <div className="bg-[#141414] text-[#E4E3E0] p-5 flex flex-col h-[234px]">
                  <h4 className="text-[10px] font-bold text-[#E4E3E0]/70 font-mono uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                    <Server size={12} className="text-[#E4E3E0]" /> Central System Event Daemon
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[9px] text-[#E4E3E0]/85 pr-1 leading-normal">
                    {systemLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2 items-start hover:bg-white/5 p-1">
                        <span className="text-[#E4E3E0]/40 shrink-0">{log.time}</span>
                        <span className={`text-[8px] font-bold uppercase shrink-0 px-1 border ${
                          log.type === 'DB_TRIGGER' ? 'bg-[#E4E3E0]/10 border-[#E4E3E0]/20 text-indigo-300' :
                          log.type === 'REST_API' ? 'bg-[#E4E3E0]/10 border-[#E4E3E0]/20 text-emerald-300' : 'bg-transparent border-[#E4E3E0]/20 text-amber-300'
                        }`}>
                          {log.type}
                        </span>
                        <p className="flex-1 break-all tracking-tight">{log.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Developer Mapping Guide */}
              <div className="border border-brand-border p-5 bg-white/10 space-y-4">
                <h4 className="font-bold text-brand-text text-xs uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={14} className="text-brand-text" /> Interactive Technology Mapping Guide
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
                  
                  {/* Guide Block 1 */}
                  <div className="p-4 border border-brand-border/30 bg-white/5 space-y-1.5">
                    <p className="font-bold text-brand-text font-sans flex items-center gap-1.5 uppercase text-xxs tracking-wider">
                      <Database size={12} /> SQL, Postgres & Procedures
                    </p>
                    <p className="text-brand-text/75 text-xs">
                      Toggle to the <strong>Database</strong> tab to explore an interactive SQL console. Select SQL presets, compile triggers, and run recovery checkpoints.
                    </p>
                  </div>

                  {/* Guide Block 2 */}
                  <div className="p-4 border border-brand-border/30 bg-white/5 space-y-1.5">
                    <p className="font-bold text-brand-text font-sans flex items-center gap-1.5 uppercase text-xxs tracking-wider">
                      <FileSpreadsheet size={12} /> Excel & Power BI Integration
                    </p>
                    <p className="text-brand-text/75 text-xs">
                      Navigate to the <strong>Reporting</strong> tab to see rich charts with regional sliders, edit customer rows inline, export files, or drop spreadsheet data.
                    </p>
                  </div>

                  {/* Guide Block 3 */}
                  <div className="p-4 border border-brand-border/30 bg-white/5 space-y-1.5">
                    <p className="font-bold text-brand-text font-sans flex items-center gap-1.5 uppercase text-xxs tracking-wider">
                      <Layers size={12} /> Java REST APIs & Support Desk
                    </p>
                    <p className="text-brand-text/75 text-xs">
                      Test visual mock endpoint calls in the <strong>APIs</strong> tab. New entries submitted via POST inject live data into the active views automatically.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: CORE CRM WORKSPACE */}
          {activeTab === 'crm' && (
            <CRMModule 
              contacts={contacts} 
              setContacts={setContacts} 
              deals={deals} 
              setDeals={setDeals} 
            />
          )}

          {/* TAB: SUPPORT OPERATIONS */}
          {activeTab === 'support' && (
            <SupportModule 
              tickets={tickets} 
              setTickets={setTickets} 
            />
          )}

          {/* TAB: POSTGRES DBA WORKSPACE */}
          {activeTab === 'postgres' && (
            <PostgresModule 
              contacts={contacts} 
              deals={deals} 
              tickets={tickets} 
            />
          )}

          {/* TAB: EXCEL & POWER BI ANALYTICS */}
          {activeTab === 'analytics' && (
            <AnalyticsModule 
              contacts={contacts} 
              setContacts={setContacts} 
              deals={deals} 
              tickets={tickets} 
            />
          )}

          {/* TAB: REST API PLAYGROUND */}
          {activeTab === 'api' && (
            <APIPlayground 
              contacts={contacts} 
              setContacts={setContacts} 
              tickets={tickets} 
              setTickets={setTickets} 
            />
          )}

        </main>

        {/* Global bottom-bar status ticker */}
        <footer className="h-8 border-t border-brand-border flex items-center justify-between px-6 bg-brand-text text-brand-bg font-mono text-[10px] shrink-0 select-none">
          <div className="flex gap-6 uppercase">
            <span>DB: POSTGRES_15.4</span>
            <span>REPL_LAG: 0ms</span>
            <span>CACHE HIT: 99.42%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-40 uppercase">Active Session:</span>
            <span>moorosi.jt@gmail.com</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
