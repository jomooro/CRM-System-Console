import { useState, useEffect, useRef } from 'react';
import { DBMetrics, DBBackup, SlowQuery, SQLResult } from '../types';
import { 
  initialBackups, 
  initialSlowQueries, 
  mockDatabaseTables, 
  presetQueries 
} from '../data/mockData';
import { 
  Database, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Clock, 
  Cpu, 
  CpuIcon, 
  Terminal, 
  Zap, 
  CloudLightning,
  Sparkles,
  SearchCode,
  HardDrive
} from 'lucide-react';

interface PostgresModuleProps {
  contacts: any[];
  deals: any[];
  tickets: any[];
}

export default function PostgresModule({ contacts, deals, tickets }: PostgresModuleProps) {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'backup' | 'monitoring' | 'diagnostics'>('sandbox');
  
  // Real-time Metrics state (oscillating slightly over time)
  const [metrics, setMetrics] = useState<DBMetrics>({
    cpuUsage: 14.2,
    memoryUsage: 62.8,
    activeConnections: 18,
    cacheHitRatio: 99.42,
    diskIops: 1280,
    uptime: "14 days, 6 hours, 12 minutes"
  });

  // DB Backups list
  const [backups, setBackups] = useState<DBBackup[]>(initialBackups);
  const [isBackupLoading, setIsBackupLoading] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState<string[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);

  // Slow queries list (for index tuning)
  const [slowQueries, setSlowQueries] = useState<SlowQuery[]>(initialSlowQueries);
  const [tunedQueryIds, setTunedQueryIds] = useState<string[]>([]);

  // SQL Console states
  const [sqlQuery, setSqlQuery] = useState<string>(presetQueries[0].sql);
  const [queryResult, setQueryResult] = useState<SQLResult | null>(null);
  const [isQueryExecuting, setIsQueryExecuting] = useState(false);
  
  // Active custom triggers simulation
  const [activeTriggers, setActiveTriggers] = useState<string[]>(["audit_deal_closed_trigger"]);
  const [auditLogs, setAuditLogs] = useState<any[]>(mockDatabaseTables.audit_logs);

  // Oscillate metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(8, Math.min(95, Number((prev.cpuUsage + (Math.random() * 4 - 2)).toFixed(1)))),
        memoryUsage: Math.max(50, Math.min(80, Number((prev.memoryUsage + (Math.random() * 0.6 - 0.3)).toFixed(2)))),
        activeConnections: Math.max(10, Math.min(45, prev.activeConnections + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
        diskIops: Math.max(800, Math.min(2500, Math.round(prev.diskIops + (Math.random() * 150 - 75)))),
        cacheHitRatio: Math.max(99.0, Math.min(99.99, Number((prev.cacheHitRatio + (Math.random() * 0.04 - 0.02)).toFixed(2))))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Execute SQL Sandbox Queries
  const handleRunSQL = () => {
    setIsQueryExecuting(true);
    setTimeout(() => {
      const cleanSql = sqlQuery.trim().replace(/\s+/g, ' ').toLowerCase();
      const execTime = Math.floor(Math.random() * 15) + 3; // 3-18ms

      let result: SQLResult = {
        columns: [],
        rows: [],
        executionTimeMs: execTime,
        message: "Query returned 0 rows."
      };

      try {
        // Trigger / Stored procedure declaration handling
        if (cleanSql.includes("create or replace function") || cleanSql.includes("create trigger")) {
          // Parse function name or trigger
          const triggerName = "sales_deal_status_audit_trigger";
          if (!activeTriggers.includes(triggerName)) {
            setActiveTriggers(prev => [...prev, triggerName]);
          }

          // Register a trigger audit log row
          const newLog = {
            log_id: auditLogs.length + 101,
            table_name: "deals",
            action: "TRIGGER_CREATED",
            changed_by: "dba_user",
            description: "Registered PL/pgSQL function 'audit_sales_deal_status' and statement-level trigger.",
            logged_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
          };
          setAuditLogs(prev => [newLog, ...prev]);

          result = {
            columns: ["command_tag", "status"],
            rows: [{ command_tag: "CREATE FUNCTION", status: "Trigger Function active. Fired automatically on SQL action." }],
            executionTimeMs: 12,
            message: "PL/pgSQL Trigger successfully compiled on PostgreSQL engine. Audit logging active."
          };
        }
        // Query audit_logs table
        else if (cleanSql.includes("from audit_logs")) {
          result = {
            columns: ["log_id", "table_name", "action", "changed_by", "description", "logged_at"],
            rows: auditLogs,
            executionTimeMs: execTime,
            message: `SELECT returned ${auditLogs.length} audit logs created by Postgres triggers.`
          };
        }
        // Query contacts
        else if (cleanSql.includes("from contacts")) {
          let rowsToReturn = [...contacts];
          
          if (cleanSql.includes("status = 'customer'")) {
            rowsToReturn = rowsToReturn.filter(c => c.status === 'Customer');
          } else if (cleanSql.includes("status = 'lead'")) {
            rowsToReturn = rowsToReturn.filter(c => c.status === 'Lead');
          }

          if (cleanSql.includes("order by value desc")) {
            rowsToReturn.sort((a, b) => b.value - a.value);
          }

          result = {
            columns: ["id", "name", "email", "company", "status", "value"],
            rows: rowsToReturn.map(r => ({
              id: r.id, name: r.name, email: r.email, company: r.company, status: r.status, value: r.value
            })),
            executionTimeMs: execTime,
            message: `SELECT returned ${rowsToReturn.length} contacts matching parameters.`
          };
        }
        // Query deals
        else if (cleanSql.includes("from deals")) {
          let rowsToReturn = [...deals];
          
          if (cleanSql.includes("group by stage")) {
            // Group by aggregation
            const stagesMap: Record<string, { count: number; total: number; avg_prob: number }> = {};
            rowsToReturn.forEach(deal => {
              if (!stagesMap[deal.stage]) {
                stagesMap[deal.stage] = { count: 0, total: 0, avg_prob: 0 };
              }
              stagesMap[deal.stage].count += 1;
              stagesMap[deal.stage].total += deal.value;
              stagesMap[deal.stage].avg_prob += deal.probability;
            });

            const aggregatedRows = Object.entries(stagesMap).map(([stage, metrics]) => ({
              stage: stage,
              count: metrics.count,
              total_value: metrics.total,
              avg_probability: Math.round(metrics.avg_prob / metrics.count)
            }));

            result = {
              columns: ["stage", "count", "total_value", "avg_probability"],
              rows: aggregatedRows,
              executionTimeMs: execTime + 10,
              message: `GROUP BY aggregation evaluated on memory tables. Retained ${aggregatedRows.length} stages.`
            };
          } else {
            result = {
              columns: ["id", "title", "company", "value", "stage", "probability"],
              rows: rowsToReturn.map(r => ({
                id: r.id, title: r.title, company: r.company, value: r.value, stage: r.stage, probability: r.probability
              })),
              executionTimeMs: execTime,
              message: `SELECT returned ${rowsToReturn.length} deals in sales pipeline.`
            };
          }
        }
        // Query tickets
        else if (cleanSql.includes("from tickets")) {
          let rowsToReturn = [...tickets];
          if (cleanSql.includes("status != 'resolved'")) {
            rowsToReturn = rowsToReturn.filter(t => t.status !== 'Resolved');
          }
          result = {
            columns: ["id", "subject", "contactname", "priority", "status", "assignedagent"],
            rows: rowsToReturn.map(r => ({
              id: r.id, subject: r.subject, contactname: r.contactName, priority: r.priority, status: r.status, assignedagent: r.assignedAgent
            })),
            executionTimeMs: execTime,
            message: `SELECT returned ${rowsToReturn.length} incidents logged in operations module.`
          };
        } 
        // Fallback or explain select query
        else {
          result = {
            columns: ["system_info", "status"],
            rows: [
              { system_info: "PostgreSQL Database Engine Online", status: "Compiled successfully. Ready to receive commands." }
            ],
            executionTimeMs: 1,
            message: "Command processed. Schema consists of tables: 'contacts', 'deals', 'tickets', 'audit_logs'."
          };
        }
      } catch (err: any) {
        result = {
          columns: ["error_code", "syntax_error"],
          rows: [{ error_code: "42601", syntax_error: "PostgreSQL Syntax Error: unexpected token near parameter clause." }],
          executionTimeMs: 4,
          message: "ERROR: syntax error at or near parameter."
        };
      }

      setQueryResult(result);
      setIsQueryExecuting(false);
    }, 600);
  };

  // Run DB Backup simulation
  const handleCreateBackup = () => {
    setIsBackupLoading(true);
    setTimeout(() => {
      const newBkp: DBBackup = {
        id: `BKP-00${backups.length + 1}`,
        filename: `pg_dump_crm_prod_${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 8)}_${Math.floor(Math.random() * 9000 + 1000)}.sql`,
        size: `${(248 + Math.random() * 5).toFixed(1)} MB`,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'Completed',
        type: 'Full'
      };
      setBackups(prev => [newBkp, ...prev]);
      setIsBackupLoading(false);
    }, 2000);
  };

  // Point-in-time Recovery simulation
  const handleRestoreBackup = (bkp: DBBackup) => {
    setIsRestoring(true);
    setRestoreProgress([]);
    
    const logs = [
      `[08:46:01] INITIATING POINT-IN-TIME RECOVERY (PITR)...`,
      `[08:46:01] Attaching to container image pg_engine:15-alpine...`,
      `[08:46:02] Stopping client connection pooler PgBouncer...`,
      `[08:46:02] Restoring base SQL filesystem dump: ${bkp.filename} (${bkp.size})...`,
      `[08:46:03] Replaying Write-Ahead Logs (WAL) archive segments to target LSN...`,
      `[08:46:03] Restoring trigger states and stored procedures definitions...`,
      `[08:46:04] Database consistency verified. 0 logical errors detected.`,
      `[08:46:04] Re-starting main PostgreSQL cluster. Connection pools open.`,
      `[08:46:04] RECOVERY SUCCESSFUL! System restored back to: ${bkp.createdAt}`
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setRestoreProgress(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsRestoring(false);
          // Update restored backup status visual
          setBackups(prev => prev.map(b => b.id === bkp.id ? { ...b, status: 'Completed' } : b));
        }
      }, (index + 1) * 450);
    });
  };

  // Performance Index Optimization
  const handleOptimizeIndex = (queryId: string) => {
    // Simulate SQL DDL execution
    setTunedQueryIds(prev => [...prev, queryId]);
    setSlowQueries(prev => prev.map(q => {
      if (q.id === queryId) {
        return {
          ...q,
          durationMs: Math.round(q.durationMs * 0.02) // reduced by 98%
        };
      }
      return q;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h2 className="font-sans font-bold text-lg text-brand-text uppercase tracking-tight flex items-center gap-2">
            <Database size={18} /> Database Engine & Hub
          </h2>
          <p className="text-xs text-brand-text/60 mt-1">
            Execute SQL, administer backups, initiate Point-in-Time Recovery, and tune high-load index triggers.
          </p>
        </div>
        <div className="flex bg-brand-text/5 p-1 border border-brand-border text-xs font-bold uppercase tracking-wider font-mono">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3 py-1 cursor-pointer transition ${activeTab === 'sandbox' ? 'bg-brand-text text-brand-bg font-bold' : 'text-brand-text/60 hover:text-brand-text'}`}
          >
            SQL Sandbox
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1 cursor-pointer transition ${activeTab === 'backup' ? 'bg-brand-text text-brand-bg font-bold' : 'text-brand-text/60 hover:text-brand-text'}`}
          >
            Backup & PITR
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-3 py-1 cursor-pointer transition ${activeTab === 'monitoring' ? 'bg-brand-text text-brand-bg font-bold' : 'text-brand-text/60 hover:text-brand-text'}`}
          >
            DB Telemetry
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1 cursor-pointer transition ${activeTab === 'diagnostics' ? 'bg-brand-text text-brand-bg font-bold' : 'text-brand-text/60 hover:text-brand-text'}`}
          >
            Index Tuning
          </button>
        </div>
      </div>

      {/* Live Oscillating System Health Bar (Visible in DBA workspace) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-brand-text text-brand-bg p-4 border border-brand-border flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75">CPU Usage</span>
            <span className="font-mono text-xl font-black mt-1 inline-block">{metrics.cpuUsage}%</span>
          </div>
          <Cpu size={18} />
        </div>

        <div className="bg-brand-text text-brand-bg p-4 border border-brand-border flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75">Shared Hit Ratio</span>
            <span className="font-mono text-xl font-black mt-1 inline-block">{metrics.cacheHitRatio}%</span>
          </div>
          <Zap size={18} />
        </div>

        <div className="bg-brand-text text-brand-bg p-4 border border-brand-border flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75">Active Pool</span>
            <span className="font-mono text-xl font-black mt-1 inline-block">{metrics.activeConnections} / 100</span>
          </div>
          <RefreshCw size={16} className="animate-spin-slow" />
        </div>

        <div className="bg-brand-text text-brand-bg p-4 border border-brand-border flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75">Disk IOPS</span>
            <span className="font-mono text-xl font-black mt-1 inline-block">{metrics.diskIops} IO/s</span>
          </div>
          <HardDrive size={18} />
        </div>
      </div>

      {/* TAB 1: SQL SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Preset templates */}
          <div className="space-y-4">
            <div className="bg-white/10 p-4 border border-brand-border">
              <h4 className="font-bold text-brand-text text-xs mb-3 uppercase tracking-wider flex items-center gap-2">
                <SearchCode size={14} /> SQL Presets (Java API Triggers)
              </h4>
              <p className="text-xxs text-brand-text/70 mb-3 leading-relaxed uppercase font-mono">
                Choose template queries corresponding to typical Java DAO endpoints and PostgreSQL triggers:
              </p>
              <div className="space-y-2">
                {presetQueries.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSqlQuery(preset.sql)}
                    className="w-full text-left p-2.5 border border-brand-border bg-brand-bg hover:bg-brand-text hover:text-brand-bg text-xs transition block cursor-pointer"
                  >
                    <p className="font-bold uppercase text-[10px] tracking-wide">{preset.name}</p>
                    <p className="text-[9px] opacity-60 mt-1 truncate font-mono">{preset.sql}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Active schema overview */}
            <div className="bg-white/10 p-4 border border-brand-border text-[10px] space-y-2 font-mono text-brand-text">
              <h4 className="font-bold text-brand-text text-xs font-sans uppercase tracking-wider mb-2">PostgreSQL Catalog Schema</h4>
              <div className="p-2 bg-brand-bg border border-brand-border/40">
                <span className="font-bold">contacts</span> (id PK, name, email, company, status, value)
              </div>
              <div className="p-2 bg-brand-bg border border-brand-border/40">
                <span className="font-bold">deals</span> (id PK, title, company, value, stage, probability)
              </div>
              <div className="p-2 bg-brand-bg border border-brand-border/40">
                <span className="font-bold">tickets</span> (id PK, subject, status, priority, assigned)
              </div>
              <div className="p-2 bg-brand-bg border border-brand-border/40">
                <span className="font-bold">audit_logs</span> (log_id PK, table_name, action, changed_by, description, logged_at)
              </div>
            </div>
          </div>

          {/* Console Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-brand-text border border-brand-border overflow-hidden shadow-none flex flex-col h-[520px]">
              {/* Header */}
              <div className="bg-brand-text px-4 py-2 border-b border-brand-bg/20 flex justify-between items-center text-xs">
                <span className="text-brand-bg font-mono flex items-center gap-2 font-bold uppercase tracking-wide">
                  <Terminal size={12} /> psql (15.2) • crm_prod_db
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-brand-bg/70 font-mono text-[9px] uppercase tracking-wider">Autocommit: ON</span>
                </div>
              </div>

              {/* Text Area Code block */}
              <div className="flex-1 flex flex-col">
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="flex-1 bg-brand-text text-brand-bg p-5 font-mono text-xs focus:outline-hidden resize-none leading-relaxed"
                  placeholder="SELECT * FROM contacts WHERE status = 'Customer';"
                  spellCheck={false}
                />
              </div>

              {/* Console Run controls */}
              <div className="bg-brand-text px-4 py-2 border-t border-brand-bg/20 flex justify-between items-center">
                <span className="text-[9px] font-mono text-brand-bg/50 uppercase tracking-wide">
                  Press Execute SQL button to run commands.
                </span>
                <button
                  id="postgres-btn-run-sql"
                  onClick={handleRunSQL}
                  disabled={isQueryExecuting}
                  className="bg-brand-bg text-brand-text border border-brand-border rounded-none px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <Play size={10} /> {isQueryExecuting ? 'Executing...' : 'Execute SQL'}
                </button>
              </div>
            </div>

            {/* Query Outputs */}
            {queryResult && (
              <div className="bg-white/10 border border-brand-border overflow-hidden shadow-none">
                <div className="px-4 py-2 border-b border-brand-border bg-brand-text/5 flex justify-between items-center text-xs font-mono">
                  <span className="text-brand-text font-bold uppercase tracking-wide">Query Result Grid</span>
                  <span className="text-brand-text/60 font-medium">
                    Time: {queryResult.executionTimeMs} ms • {queryResult.rows.length} rows affected
                  </span>
                </div>

                {queryResult.rows.length > 0 ? (
                  <div className="overflow-x-auto max-h-[250px]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-brand-text/10 text-brand-text font-mono font-bold uppercase border-b border-brand-border">
                          {queryResult.columns.map((col, idx) => (
                            <th key={idx} className="py-2 px-4 border-r border-brand-border/10">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="font-mono text-brand-text divide-y divide-brand-border/20 bg-brand-bg">
                        {queryResult.rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-brand-text/5">
                            {queryResult.columns.map((col, colIdx) => (
                              <td key={colIdx} className="py-2 px-4 border-r border-brand-border/10 font-mono">
                                {typeof row[col] === 'number' && col === 'value' ? `$${row[col].toLocaleString()}` : String(row[col])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                <div className="px-4 py-2 border-t border-brand-border bg-brand-text/5 text-[10px] font-mono text-brand-text/75 uppercase tracking-wide">
                  {queryResult.message}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BACKUPS & PITR RECOVERY */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Backups List */}
          <div className="lg:col-span-2 bg-white/10 border border-brand-border overflow-hidden shadow-none">
            <div className="p-4 border-b border-brand-border bg-brand-text/5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-brand-text text-xs uppercase tracking-wider">PostgreSQL Backup Registry</h3>
                <p className="text-[10px] text-brand-text/60 mt-1 uppercase font-mono">
                  Binary WAL files and full snapshots maintained by background daemons.
                </p>
              </div>
              <button
                onClick={handleCreateBackup}
                disabled={isBackupLoading}
                className="px-3 py-1.5 bg-brand-text text-brand-bg border border-brand-border font-mono font-bold text-[10px] uppercase tracking-wider rounded-none transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
              >
                {isBackupLoading ? 'Running dump...' : 'pg_dump Backup'}
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-text text-brand-bg font-mono uppercase font-bold border-b border-brand-border">
                    <th className="py-3 px-4">Backup ID</th>
                    <th className="py-3 px-4">Filename</th>
                    <th className="py-3 px-4">Archival Size</th>
                    <th className="py-3 px-4">Created On</th>
                    <th className="py-3 px-4">Log Type</th>
                    <th className="py-3 px-4 text-right">PITR Command</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-brand-text divide-y divide-brand-border/20 bg-white/5">
                  {backups.map((bkp) => (
                    <tr key={bkp.id} className="hover:bg-brand-text/5">
                      <td className="py-3 px-4 font-bold text-brand-text/40">{bkp.id}</td>
                      <td className="py-3 px-4 text-brand-text font-bold truncate max-w-[200px]" title={bkp.filename}>
                        {bkp.filename}
                      </td>
                      <td className="py-3 px-4">{bkp.size}</td>
                      <td className="py-3 px-4 opacity-75">{bkp.createdAt}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-1.5 py-0.5 border border-brand-border text-[9px] font-bold uppercase bg-brand-text/5">
                          {bkp.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRestoreBackup(bkp)}
                          disabled={isRestoring}
                          className="px-2 py-1 border border-brand-border bg-brand-bg text-brand-text font-bold font-mono uppercase text-[9px] transition cursor-pointer hover:bg-brand-text hover:text-brand-bg disabled:opacity-50"
                        >
                          Restore PITR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recovery Log Monitor */}
          <div className="bg-brand-text border border-brand-border p-5 flex flex-col h-[380px] shadow-none">
            <h4 className="text-[10px] font-bold text-brand-bg font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal size={12} className="text-brand-bg" /> PITR Progress Shell
            </h4>
            
            <div className="flex-1 bg-brand-text border border-brand-bg/20 p-4 font-mono text-[10px] text-brand-bg/85 overflow-y-auto space-y-2 leading-relaxed">
              {restoreProgress.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-bg/50 text-center px-4">
                  <Database size={24} className="mb-2" />
                  <p className="uppercase text-[9px] tracking-wider font-bold">Awaiting recovery signal...</p>
                </div>
              ) : (
                restoreProgress.map((log, idx) => {
                  let logColor = 'text-brand-bg/80';
                  if (log.includes('SUCCESSFUL')) logColor = 'text-emerald-300 font-bold';
                  if (log.includes('RECOVERY')) logColor = 'text-emerald-300 font-bold';
                  if (log.includes('INITIATING')) logColor = 'text-sky-300 font-bold';
                  
                  return (
                    <div key={idx} className={`${logColor} tracking-tight uppercase`}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="mt-3 text-[9px] font-mono uppercase text-brand-bg/60 text-center">
              {isRestoring ? 'WAL log sequence replay active...' : 'Standby engine ready.'}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TELEMETRY & GRAPHS */}
      {activeTab === 'monitoring' && (
        <div className="bg-white/10 border border-brand-border p-5 shadow-none">
          <h3 className="font-bold text-brand-text text-xs uppercase tracking-wider mb-2">Live PostgreSQL Daemon Pool Diagnostics</h3>
          <p className="text-xxs text-brand-text/60 mb-5 uppercase tracking-wide font-mono">
            Internal client tracking pool metrics, lock state, and shared buffer hit stats updated every 3s.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-4 bg-brand-bg border border-brand-border/60 space-y-3">
              <h4 className="font-bold text-brand-text font-sans uppercase tracking-wider text-xs">Active Thread Lock Statistics</h4>
              <div className="flex justify-between py-1.5 border-b border-brand-border/10">
                <span className="uppercase text-[10px] text-brand-text/60">Lock Requests Granularity:</span>
                <span className="font-bold text-brand-text uppercase">Row Exclusive</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-border/10">
                <span className="uppercase text-[10px] text-brand-text/60">Deadlocks Logged (24h):</span>
                <span className="font-bold text-emerald-800 uppercase">0 cases</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-border/10">
                <span className="uppercase text-[10px] text-brand-text/60">Replica Wal Lag (Primary):</span>
                <span className="font-bold text-brand-text uppercase">0 bytes</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="uppercase text-[10px] text-brand-text/60">Active Triggers Enabled:</span>
                <span className="font-bold text-brand-text uppercase">{activeTriggers.length} triggers</span>
              </div>
            </div>

            <div className="p-4 bg-brand-bg border border-brand-border/60 space-y-3">
              <h4 className="font-bold text-brand-text font-sans uppercase tracking-wider text-xs">Trigger Performance Settings</h4>
              <div className="flex justify-between py-1.5 border-b border-brand-border/10">
                <span className="uppercase text-[10px] text-brand-text/60">Trigger Compilation:</span>
                <span className="font-bold text-emerald-800 uppercase">Pre-compiled PL/pgSQL</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-border/10">
                <span className="uppercase text-[10px] text-brand-text/60">Audit Table Row Count:</span>
                <span className="font-bold text-brand-text">{auditLogs.length} rows</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-border/10">
                <span className="uppercase text-[10px] text-brand-text/60">Trigger Overhead Latency:</span>
                <span className="font-bold text-brand-text font-mono">&lt; 0.45 ms / txn</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="uppercase text-[10px] text-brand-text/60">Autovacuum Running:</span>
                <span className="font-bold text-emerald-800 uppercase">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIAGNOSTICS & INDEX OPTIMIZATION */}
      {activeTab === 'diagnostics' && (
        <div className="bg-white/10 border border-brand-border overflow-hidden shadow-none">
          <div className="p-4 border-b border-brand-border bg-brand-text/5">
            <h3 className="font-bold text-brand-text text-xs uppercase tracking-wider">Query Plan Analyzer & Index Tuning</h3>
            <p className="text-[10px] text-brand-text/60 mt-1 uppercase font-mono">
              Capturing sequential table scans and recommending optimal indexes to improve REST API SLAs.
            </p>
          </div>

          <div className="divide-y divide-brand-border/20 text-xs bg-white/5">
            {slowQueries.map((query) => {
              const isTuned = tunedQueryIds.includes(query.id);
              return (
                <div key={query.id} className="p-5 hover:bg-brand-text/5 transition flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-text/40">{query.id}</span>
                      <span className="px-1.5 py-0.5 border border-brand-border text-[9px] font-bold font-mono uppercase bg-brand-text/10">
                        Duration: {query.durationMs}ms
                      </span>
                      <span className="text-brand-text/50 font-mono text-[9px] uppercase">Calls: {query.calls}</span>
                    </div>
                    <p className="font-mono text-brand-text bg-brand-bg p-2.5 border border-brand-border/40 break-all leading-relaxed">
                      {query.query}
                    </p>
                    <div className="p-2.5 bg-brand-text/5 border border-brand-border text-brand-text leading-relaxed font-sans flex items-start gap-2">
                      <Zap size={14} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-brand-text text-[10px] uppercase tracking-wider font-mono">DBA Performance Optimization Plan</p>
                        <p className="mt-0.5 text-xs">{query.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="self-center md:self-auto shrink-0">
                    {isTuned ? (
                      <div className="text-center px-3 py-1.5 border border-brand-border text-emerald-800 bg-emerald-800/10 font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 size={12} /> Index Tuned!
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOptimizeIndex(query.id)}
                        className="px-3 py-1.5 bg-brand-text text-brand-bg border border-brand-border rounded-none text-xs font-mono font-bold uppercase tracking-wider hover:bg-transparent hover:text-brand-text cursor-pointer transition flex items-center gap-1.5"
                      >
                        <Sparkles size={11} /> Tune Query Index
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
