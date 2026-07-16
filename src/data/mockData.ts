import { Contact, Deal, SupportTicket, DBBackup, SlowQuery } from '../types';

export const initialContacts: Contact[] = [
  {
    id: "CON-001",
    name: "Sarah Jenkins",
    email: "sjenkins@apextech.com",
    phone: "+1 (555) 019-2834",
    company: "Apex Technologies",
    status: "Customer",
    value: 45000,
    assignedTo: "John Doe",
    createdDate: "2026-02-14"
  },
  {
    id: "CON-002",
    name: "Marcus Vance",
    email: "m.vance@novasystems.io",
    phone: "+1 (555) 014-9812",
    company: "Nova Systems",
    status: "Customer",
    value: 78000,
    assignedTo: "Jane Smith",
    createdDate: "2026-01-20"
  },
  {
    id: "CON-003",
    name: "Elena Rostova",
    email: "e.rostova@quantumcloud.de",
    phone: "+49 89 201934",
    company: "Quantum Cloud",
    status: "Lead",
    value: 120000,
    assignedTo: "John Doe",
    createdDate: "2026-05-10"
  },
  {
    id: "CON-004",
    name: "David Chen",
    email: "dchen@banyansolutions.com",
    phone: "+1 (555) 017-4433",
    company: "Banyan Solutions",
    status: "Contact",
    value: 35000,
    assignedTo: "Bob Johnson",
    createdDate: "2026-04-18"
  },
  {
    id: "CON-005",
    name: "Olivia Martinez",
    email: "omartinez@vanguardcorp.com",
    phone: "+1 (555) 012-7711",
    company: "Vanguard Corp",
    status: "Customer",
    value: 95000,
    assignedTo: "Jane Smith",
    createdDate: "2026-03-05"
  },
  {
    id: "CON-006",
    name: "Alistair Graham",
    email: "a.graham@ironholdings.co.uk",
    phone: "+44 20 7946 0958",
    company: "Iron Holdings",
    status: "Lead",
    value: 62000,
    assignedTo: "Bob Johnson",
    createdDate: "2026-06-01"
  },
  {
    id: "CON-007",
    name: "Yuki Tanaka",
    email: "y-tanaka@cybernet-tokyo.jp",
    phone: "+81 3 5555 0144",
    company: "Cybernet Tokyo",
    status: "Contact",
    value: 150000,
    assignedTo: "John Doe",
    createdDate: "2026-06-14"
  },
  {
    id: "CON-008",
    name: "Robert Gable",
    email: "rgable@stonecreek.net",
    phone: "+1 (555) 018-9922",
    company: "Stonecreek Insurance",
    status: "Customer",
    value: 28000,
    assignedTo: "Jane Smith",
    createdDate: "2026-02-28"
  }
];

export const initialDeals: Deal[] = [
  {
    id: "DEAL-001",
    title: "Enterprise Cloud Migration",
    company: "Quantum Cloud",
    value: 120000,
    stage: "Proposal",
    contactPerson: "Elena Rostova",
    probability: 60,
    closingDate: "2026-09-15"
  },
  {
    id: "DEAL-002",
    title: "PostgreSQL Database Clustering Setup",
    company: "Nova Systems",
    value: 78000,
    stage: "Won",
    contactPerson: "Marcus Vance",
    probability: 100,
    closingDate: "2026-05-30"
  },
  {
    id: "DEAL-003",
    title: "Cybersecurity Audit & Response System",
    company: "Cybernet Tokyo",
    value: 150000,
    stage: "Negotiation",
    contactPerson: "Yuki Tanaka",
    probability: 80,
    closingDate: "2026-08-01"
  },
  {
    id: "DEAL-004",
    title: "Core CRM Licensing Expansion",
    company: "Apex Technologies",
    value: 45000,
    stage: "Won",
    contactPerson: "Sarah Jenkins",
    probability: 100,
    closingDate: "2026-06-10"
  },
  {
    id: "DEAL-005",
    title: "REST API Integration & Middleware",
    company: "Banyan Solutions",
    value: 35000,
    stage: "Contacted",
    contactPerson: "David Chen",
    probability: 30,
    closingDate: "2026-10-31"
  },
  {
    id: "DEAL-006",
    title: "Business Intelligence Reporting (Power BI)",
    company: "Vanguard Corp",
    value: 95000,
    stage: "Won",
    contactPerson: "Olivia Martinez",
    probability: 100,
    closingDate: "2026-04-12"
  },
  {
    id: "DEAL-007",
    title: "Java ERP API Integration",
    company: "Iron Holdings",
    value: 62000,
    stage: "Lead",
    contactPerson: "Alistair Graham",
    probability: 10,
    closingDate: "2026-12-15"
  }
];

export const initialTickets: SupportTicket[] = [
  {
    id: "TKT-101",
    subject: "REST API timeout during bulk contact import",
    contactName: "David Chen",
    contactEmail: "dchen@banyansolutions.com",
    priority: "High",
    status: "Open",
    assignedAgent: "Sarah Connor (Java Expert)",
    createdTime: "2026-07-15 14:32",
    description: "Our API client receives a 504 Gateway Timeout when executing a POST request containing more than 500 contacts. The backend thread might be blocking during batch insert."
  },
  {
    id: "TKT-102",
    subject: "PostgreSQL CPU spiked to 100% on trigger call",
    contactName: "Marcus Vance",
    contactEmail: "m.vance@novasystems.io",
    priority: "Critical",
    status: "In Progress",
    assignedAgent: "Alex Mercer (DBA)",
    createdTime: "2026-07-16 08:15",
    description: "Every time a deal is marked 'Won', the audit trigger function runs. We noticed high CPU load and table locks on deals table. Need to check indexes."
  },
  {
    id: "TKT-103",
    subject: "Excel export report displaying wrong timezone",
    contactName: "Olivia Martinez",
    contactEmail: "omartinez@vanguardcorp.com",
    priority: "Medium",
    status: "Open",
    assignedAgent: "Ben Miller (React Dev)",
    createdTime: "2026-07-15 10:00",
    description: "The spreadsheet downloaded via Excel Export lists deal dates as UTC, but the Power BI dashboard represents them in Eastern Time. They should be aligned."
  },
  {
    id: "TKT-104",
    subject: "Unable to refresh Power BI live database connection",
    contactName: "Sarah Jenkins",
    contactEmail: "sjenkins@apextech.com",
    priority: "High",
    status: "Resolved",
    assignedAgent: "Alex Mercer (DBA)",
    createdTime: "2026-07-14 11:20",
    description: "The Power BI gateway reported TLS handshake failed. Handled by rotating the PostgreSQL ssl certificate and updating the power bi security settings."
  },
  {
    id: "TKT-105",
    subject: "Minor typographical error in CRM client page",
    contactName: "Alistair Graham",
    contactEmail: "a.graham@ironholdings.co.uk",
    priority: "Low",
    status: "Resolved",
    assignedAgent: "Ben Miller (React Dev)",
    createdTime: "2026-07-13 16:45",
    description: "Corrected 'Companie' to 'Company' in the lead details modal window headers."
  }
];

export const initialBackups: DBBackup[] = [
  {
    id: "BKP-001",
    filename: "pg_dump_crm_prod_20260716_0000.sql",
    size: "248.5 MB",
    createdAt: "2026-07-16 00:00",
    status: "Completed",
    type: "Full"
  },
  {
    id: "BKP-002",
    filename: "pg_dump_crm_prod_20260715_0000.sql",
    size: "246.1 MB",
    createdAt: "2026-07-15 00:00",
    status: "Completed",
    type: "Full"
  },
  {
    id: "BKP-003",
    filename: "pg_wal_archive_segment_7F3092.bin",
    size: "16.0 MB",
    createdAt: "2026-07-16 08:00",
    status: "Completed",
    type: "Incremental"
  },
  {
    id: "BKP-004",
    filename: "pg_dump_crm_prod_20260714_0000.sql",
    size: "244.3 MB",
    createdAt: "2026-07-14 00:00",
    status: "Completed",
    type: "Full"
  }
];

export const initialSlowQueries: SlowQuery[] = [
  {
    id: "QRY-001",
    query: "SELECT * FROM contacts c JOIN deals d ON c.company = d.company WHERE d.stage = 'Won' AND c.status = 'Customer';",
    durationMs: 840,
    calls: 1450,
    recommendation: "Missing composite index. Add: CREATE INDEX idx_deals_stage_company ON deals(stage, company); CREATE INDEX idx_contacts_status_company ON contacts(status, company);"
  },
  {
    id: "QRY-002",
    query: "SELECT DISTINCT company, count(*) FROM contacts GROUP BY company ORDER BY count(*) DESC;",
    durationMs: 210,
    calls: 4200,
    recommendation: "Table scan on contacts. Consider creating a covering index: CREATE INDEX idx_contacts_company ON contacts(company);"
  },
  {
    id: "QRY-003",
    query: "SELECT * FROM tickets t WHERE t.description ILIKE '%database%';",
    durationMs: 1250,
    calls: 150,
    recommendation: "Sequential scan on large text. Replace ILIKE with PostgreSQL Full-Text Search index: CREATE INDEX idx_tickets_desc_fts ON tickets USING gin(to_tsvector('english', description));"
  }
];

// Rich datasets specifically for our SQL simulator environment
export const mockDatabaseTables = {
  contacts: [
    { id: 1, name: "Sarah Jenkins", email: "sjenkins@apextech.com", company: "Apex Technologies", status: "Customer", value: 45000 },
    { id: 2, name: "Marcus Vance", email: "m.vance@novasystems.io", company: "Nova Systems", status: "Customer", value: 78000 },
    { id: 3, name: "Elena Rostova", email: "e.rostova@quantumcloud.de", company: "Quantum Cloud", status: "Lead", value: 120000 },
    { id: 4, name: "David Chen", email: "dchen@banyansolutions.com", company: "Banyan Solutions", status: "Contact", value: 35000 },
    { id: 5, name: "Olivia Martinez", email: "omartinez@vanguardcorp.com", company: "Vanguard Corp", status: "Customer", value: 95000 },
    { id: 6, name: "Alistair Graham", email: "a.graham@ironholdings.co.uk", company: "Iron Holdings", status: "Lead", value: 62000 },
    { id: 7, name: "Yuki Tanaka", email: "y-tanaka@cybernet-tokyo.jp", company: "Cybernet Tokyo", status: "Contact", value: 150000 },
    { id: 8, name: "Robert Gable", email: "rgable@stonecreek.net", company: "Stonecreek Insurance", status: "Customer", value: 28000 }
  ],
  deals: [
    { id: 1, title: "Enterprise Cloud Migration", company: "Quantum Cloud", value: 120000, stage: "Proposal", probability: 60 },
    { id: 2, title: "PostgreSQL Database Clustering Setup", company: "Nova Systems", value: 78000, stage: "Won", probability: 100 },
    { id: 3, title: "Cybersecurity Audit & Response", company: "Cybernet Tokyo", value: 150000, stage: "Negotiation", probability: 80 },
    { id: 4, title: "Core CRM Licensing Expansion", company: "Apex Technologies", value: 45000, stage: "Won", probability: 100 },
    { id: 5, title: "REST API Integration & Middleware", company: "Banyan Solutions", value: 35000, stage: "Contacted", probability: 30 },
    { id: 6, title: "Business Intelligence Reporting", company: "Vanguard Corp", value: 95000, stage: "Won", probability: 100 },
    { id: 7, title: "Java ERP API Integration", company: "Iron Holdings", value: 62000, stage: "Lead", probability: 10 }
  ],
  tickets: [
    { id: 1, subject: "REST API timeout on bulk contact", status: "Open", priority: "High", assigned: "Sarah Connor" },
    { id: 2, subject: "PostgreSQL CPU spiked to 100%", status: "In Progress", priority: "Critical", assigned: "Alex Mercer" },
    { id: 3, subject: "Excel export wrong timezone", status: "Open", priority: "Medium", assigned: "Ben Miller" },
    { id: 4, subject: "Unable to refresh Power BI connection", status: "Resolved", priority: "High", assigned: "Alex Mercer" },
    { id: 5, subject: "Typographical error in client page", status: "Resolved", priority: "Low", assigned: "Ben Miller" }
  ],
  audit_logs: [
    { log_id: 101, table_name: "deals", action: "UPDATE", changed_by: "system_trigger", description: "DEAL-002 stage updated to 'Won'. Trigger audit_deal_closed logged successfully.", logged_at: "2026-07-16 08:15:22" },
    { log_id: 102, table_name: "contacts", action: "INSERT", changed_by: "rest_api_user", description: "Created CON-007 (Yuki Tanaka) via API.", logged_at: "2026-07-16 08:32:01" },
    { log_id: 103, table_name: "tickets", action: "UPDATE", changed_by: "support_bot", description: "Ticket TKT-104 status marked as 'Resolved'.", logged_at: "2026-07-16 08:44:11" }
  ]
};

export const presetQueries = [
  {
    name: "Retrieve Active Customers",
    sql: "SELECT * FROM contacts WHERE status = 'Customer' ORDER BY value DESC;",
    description: "Queries the contacts table to return all validated clients ordered by commercial value."
  },
  {
    name: "Pipeline Value By Deal Stage",
    sql: "SELECT stage, count(*) AS count, SUM(value) AS total_value, AVG(probability) AS avg_probability FROM deals GROUP BY stage ORDER BY total_value DESC;",
    description: "Aggregation query calculating the core sales funnel volume and average probability for active pipeline negotiations."
  },
  {
    name: "Unresolved Tickets By Priority",
    sql: "SELECT priority, count(*) AS ticket_count FROM tickets WHERE status != 'Resolved' GROUP BY priority ORDER BY ticket_count DESC;",
    description: "Monitors support backlogs to highlight critical/high incidents demanding immediate action."
  },
  {
    name: "Create Audit Trigger Function",
    sql: `CREATE OR REPLACE FUNCTION audit_sales_deal_status() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stage = 'Won' THEN
    INSERT INTO audit_logs (table_name, action, changed_by, description)
    VALUES ('deals', 'UPDATE', 'trigger_executor', 'Deal ' || NEW.title || ' won. Value: ' || NEW.value);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`,
    description: "Prepares a PostgreSQL stored trigger procedure to automatically capture successful closed deals inside the audit log database table."
  },
  {
    name: "View Audit Trigger Logs",
    sql: "SELECT * FROM audit_logs ORDER BY logged_at DESC LIMIT 10;",
    description: "Fetches historical system entries registered automatically by active PostgreSQL trigger functions."
  }
];

export const mockRESTEndpoints = [
  {
    id: "api-contacts-get",
    method: "GET" as const,
    endpoint: "/api/v1/contacts",
    description: "Retrieve a paginated list of all active contacts and clients in the CRM.",
    parameters: [
      { name: "status", type: "string", required: false, desc: "Filter contacts by status (Lead, Contact, Customer)" },
      { name: "limit", type: "integer", required: false, desc: "Max items to return (default: 20)" }
    ],
    statusCode: 200,
    responseBody: JSON.stringify({
      status: "success",
      results: 3,
      data: {
        contacts: [
          { id: "CON-001", name: "Sarah Jenkins", email: "sjenkins@apextech.com", company: "Apex Technologies", status: "Customer", value: 45000 },
          { id: "CON-002", name: "Marcus Vance", email: "m.vance@novasystems.io", company: "Nova Systems", status: "Customer", value: 78000 },
          { id: "CON-005", name: "Olivia Martinez", email: "omartinez@vanguardcorp.com", company: "Vanguard Corp", status: "Customer", value: 95000 }
        ]
      }
    }, null, 2)
  },
  {
    id: "api-contacts-post",
    method: "POST" as const,
    endpoint: "/api/v1/contacts",
    description: "Register a brand new sales lead or corporate contact in the CRM database.",
    requestBody: JSON.stringify({
      name: "Jean-Luc Picard",
      email: "picard@enterprise.org",
      company: "Starfleet Logistics",
      status: "Lead",
      value: 125000,
      assignedTo: "John Doe"
    }, null, 2),
    statusCode: 201,
    responseBody: JSON.stringify({
      status: "success",
      message: "Contact registered successfully and database triggers fired.",
      data: {
        id: "CON-009",
        name: "Jean-Luc Picard",
        email: "picard@enterprise.org",
        company: "Starfleet Logistics",
        status: "Lead",
        value: 125000,
        assignedTo: "John Doe",
        createdDate: "2026-07-16"
      }
    }, null, 2)
  },
  {
    id: "api-tickets-post",
    method: "POST" as const,
    endpoint: "/api/v1/tickets",
    description: "Log a brand new customer support incident and place it into the appropriate priority queue.",
    requestBody: JSON.stringify({
      subject: "Unable to load custom charts",
      contactName: "David Chen",
      contactEmail: "dchen@banyansolutions.com",
      priority: "High",
      description: "When viewing the dashboard, some chart assets fail to render. Checking network console logs reveals a CORS error."
    }, null, 2),
    statusCode: 201,
    responseBody: JSON.stringify({
      status: "success",
      message: "Incident created and routed to appropriate support tier.",
      ticketId: "TKT-106",
      meta: {
        assignedAgent: "Ben Miller (React Dev)",
        estimatedSlaHrs: 4
      }
    }, null, 2)
  },
  {
    id: "api-system-health",
    method: "GET" as const,
    endpoint: "/api/v1/health",
    description: "Ping service to return real-time health checks on PostgreSQL replication lags, Java JVM pools, and general API status.",
    statusCode: 200,
    responseBody: JSON.stringify({
      status: "healthy",
      timestamp: "2026-07-16T08:46:00Z",
      services: {
        java_core_service: { status: "UP", memory_used_mb: 412, active_threads: 24 },
        postgresql_primary: { status: "UP", active_connections: 18, replication_lag_ms: 0 },
        powerbi_gateway: { status: "ONLINE", last_refresh: "2026-07-16T08:00:00Z" }
      }
    }, null, 2)
  }
];
