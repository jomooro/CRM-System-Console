export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Lead' | 'Contact' | 'Customer';
  value: number; // Potential/Actual Deal Value
  assignedTo: string;
  createdDate: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: 'Lead' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  contactPerson: string;
  probability: number; // Percentage
  closingDate: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  contactName: string;
  contactEmail: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedAgent: string;
  createdTime: string;
  description: string;
}

export interface DBMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  cacheHitRatio: number; // e.g., 99.4
  diskIops: number;
  uptime: string;
}

export interface DBBackup {
  id: string;
  filename: string;
  size: string;
  createdAt: string;
  status: 'Completed' | 'Restoring' | 'Failed';
  type: 'Full' | 'Incremental';
}

export interface SlowQuery {
  id: string;
  query: string;
  durationMs: number;
  calls: number;
  recommendation: string;
}

export interface SQLResult {
  columns: string[];
  rows: Record<string, any>[];
  message?: string;
  executionTimeMs: number;
}

export interface APIRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; desc: string }[];
  requestBody?: string;
  responseBody: string;
  statusCode: number;
}
