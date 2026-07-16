import React, { useState } from 'react';
import { Contact, SupportTicket } from '../types';
import { mockRESTEndpoints } from '../data/mockData';
import { 
  Webhook, 
  Send, 
  Terminal, 
  Code, 
  CheckCircle2, 
  Lock, 
  Globe, 
  CornerDownRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface APIPlaygroundProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  tickets: SupportTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
}

export default function APIPlayground({ contacts, setContacts, tickets, setTickets }: APIPlaygroundProps) {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(mockRESTEndpoints[0].id);
  const [customRequestBody, setCustomRequestBody] = useState<string>(mockRESTEndpoints[1].requestBody || '');
  
  // Simulated execution output states
  const [activeResponse, setActiveResponse] = useState<any>(null);
  const [activeStatus, setActiveStatus] = useState<number | null>(null);
  const [activeHeaders, setActiveHeaders] = useState<string>('');
  const [activeCurl, setActiveCurl] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const selectedEndpoint = mockRESTEndpoints.find(e => e.id === selectedEndpointId) || mockRESTEndpoints[0];

  const handleSendRequest = () => {
    setIsRunning(true);
    
    // Simulate latency
    setTimeout(() => {
      let finalResponse = JSON.parse(selectedEndpoint.responseBody);
      let finalStatus = selectedEndpoint.statusCode;
      let curlCommand = `curl -X ${selectedEndpoint.method} "https://ais-pre-tgtwbpkn.run.app${selectedEndpoint.endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer crm_jwt_token_example"`;

      try {
        // GET Contacts simulation
        if (selectedEndpoint.id === 'api-contacts-get') {
          finalResponse = {
            status: "success",
            results: contacts.length,
            data: {
              contacts: contacts.slice(0, 3).map(c => ({
                id: c.id, name: c.name, email: c.email, company: c.company, status: c.status, value: c.value
              }))
            }
          };
        } 
        // POST Contact simulation
        else if (selectedEndpoint.id === 'api-contacts-post') {
          const body = JSON.parse(customRequestBody);
          if (!body.name || !body.email || !body.company) {
            throw new Error("Missing mandatory fields");
          }

          const newId = `CON-${String(contacts.length + 1).padStart(3, '0')}`;
          const contactToAdd: Contact = {
            id: newId,
            name: body.name,
            email: body.email,
            phone: body.phone || '+1 (555) 901-2288',
            company: body.company,
            status: body.status || 'Lead',
            value: Number(body.value) || 25000,
            assignedTo: body.assignedTo || 'John Doe',
            createdDate: new Date().toISOString().slice(0, 10)
          };

          // Append to state dynamically!
          setContacts(prev => [contactToAdd, ...prev]);

          finalResponse = {
            status: "success",
            message: "Contact registered successfully and database triggers fired.",
            data: contactToAdd
          };
          finalStatus = 201;
          curlCommand = `curl -X POST "https://ais-pre-tgtwbpkn.run.app/api/v1/contacts" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer crm_jwt_token_example" \\
  -d '${JSON.stringify(body, null, 2)}'`;
        } 
        // POST Ticket simulation
        else if (selectedEndpoint.id === 'api-tickets-post') {
          const body = JSON.parse(customRequestBody);
          if (!body.subject || !body.contactName || !body.contactEmail) {
            throw new Error("Missing mandatory fields");
          }

          const newId = `TKT-${String(tickets.length + 101).padStart(3, '0')}`;
          const ticketToAdd: SupportTicket = {
            id: newId,
            subject: body.subject,
            contactName: body.contactName,
            contactEmail: body.contactEmail,
            priority: body.priority || 'Medium',
            status: 'Open',
            assignedAgent: 'Ben Miller (React Dev)',
            createdTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
            description: body.description || 'No additional details provided.'
          };

          // Append to state dynamically!
          setTickets(prev => [ticketToAdd, ...prev]);

          finalResponse = {
            status: "success",
            message: "Incident created and routed to appropriate support tier.",
            ticketId: newId,
            meta: {
              assignedAgent: "Ben Miller (React Dev)",
              estimatedSlaHrs: 4
            }
          };
          finalStatus = 201;
          curlCommand = `curl -X POST "https://ais-pre-tgtwbpkn.run.app/api/v1/tickets" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer crm_jwt_token_example" \\
  -d '${JSON.stringify(body, null, 2)}'`;
        }
      } catch (err: any) {
        finalStatus = 400;
        finalResponse = {
          status: "fail",
          error: "Bad Request",
          message: err.message || "Invalid JSON syntax inside payload body."
        };
      }

      // Generate HTTP headers
      const headers = `HTTP/2 ${finalStatus} ${finalStatus === 201 ? 'Created' : 'OK'}\r\n` +
                      `date: ${new Date().toUTCString()}\r\n` +
                      `content-type: application/json; charset=utf-8\r\n` +
                      `server: Java-Spring-Boot/3.1.2\r\n` +
                      `x-rate-limit-remaining: 998/1000\r\n` +
                      `access-control-allow-origin: *`;

      setActiveResponse(finalResponse);
      setActiveStatus(finalStatus);
      setActiveHeaders(headers);
      setActiveCurl(curlCommand || `curl -X ${selectedEndpoint.method} "https://ais-pre-tgtwbpkn.run.app${selectedEndpoint.endpoint}"`);
      setIsRunning(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-5">
        <div>
          <h2 className="font-sans font-bold text-lg text-brand-text uppercase tracking-tight flex items-center gap-2">
            <Webhook size={18} /> APIs Explorer & Playground
          </h2>
          <p className="text-xs text-brand-text/60 mt-1">
            Simulate live REST client operations mapping to backend Java controllers and query records in PostgreSQL.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Endpoint Selector panel */}
        <div className="space-y-4">
          <div className="bg-white/10 border border-brand-border p-4">
            <h3 className="font-bold text-brand-text text-xs uppercase tracking-wider mb-3 font-sans">REST Endpoints List</h3>
            <div className="space-y-2">
              {mockRESTEndpoints.map((endpoint) => {
                const isSelected = selectedEndpointId === endpoint.id;
                
                // Color mapping for methods
                let methodBg = 'bg-brand-text/5 text-brand-text';
                if (endpoint.method === 'GET') methodBg = 'bg-brand-text/10 text-brand-text border-brand-border';
                if (endpoint.method === 'POST') methodBg = 'bg-brand-text/15 text-brand-text border-brand-border';

                return (
                  <button
                    key={endpoint.id}
                    onClick={() => {
                      setSelectedEndpointId(endpoint.id);
                      if (endpoint.requestBody) {
                        setCustomRequestBody(endpoint.requestBody);
                      } else {
                        setCustomRequestBody('');
                      }
                      // Clear stale console output
                      setActiveResponse(null);
                      setActiveStatus(null);
                    }}
                    className={`w-full p-3 rounded-none border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-brand-border bg-brand-text/10 shadow-none font-bold'
                        : 'border-brand-border/40 bg-brand-bg hover:bg-brand-text hover:text-brand-bg'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 border font-mono ${isSelected ? 'border-brand-border bg-brand-text text-brand-bg' : methodBg}`}>
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-xs font-bold leading-none truncate max-w-[150px]">
                        {endpoint.endpoint}
                      </span>
                    </div>
                    <p className="text-[10px] opacity-70 leading-snug line-clamp-2 font-mono uppercase">
                      {endpoint.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secure Headers info */}
          <div className="bg-white/10 border border-brand-border p-4 space-y-3 text-xs">
            <h4 className="font-bold text-brand-text uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Lock size={14} /> Secure Gateway Settings
            </h4>
            <div className="space-y-2 font-mono text-[10px] text-brand-text/80 leading-relaxed">
              <div className="flex justify-between p-1.5 bg-brand-bg border border-brand-border/40">
                <span className="uppercase text-[9px] opacity-60">Authorization:</span>
                <span className="font-bold uppercase">Bearer crm_token</span>
              </div>
              <div className="flex justify-between p-1.5 bg-brand-bg border border-brand-border/40">
                <span className="uppercase text-[9px] opacity-60">Content-Type:</span>
                <span className="lowercase">application/json</span>
              </div>
              <div className="flex justify-between p-1.5 bg-brand-bg border border-brand-border/40">
                <span className="uppercase text-[9px] opacity-60">API Gateway:</span>
                <span className="text-emerald-800 font-bold uppercase">Healthy (100%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Console Request & Response playground */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/10 border border-brand-border rounded-none overflow-hidden shadow-none">
            {/* Playground title */}
            <div className="p-4 border-b border-brand-border bg-brand-text/5 flex justify-between items-center text-xs">
              <span className="font-sans font-bold text-brand-text uppercase tracking-wider flex items-center gap-1.5">
                <Code size={14} /> API Request Console
              </span>
              <button
                onClick={handleSendRequest}
                disabled={isRunning}
                className="px-3 py-1.5 bg-brand-text text-brand-bg border border-brand-border rounded-none font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <Send size={10} /> {isRunning ? 'Sending...' : 'Send Request'}
              </button>
            </div>

            {/* Request parameters / Payload schema */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[9px] font-bold text-brand-text/60 uppercase tracking-wider font-mono block">Target Endpoint</span>
                <div className="font-mono text-xs text-brand-text font-bold bg-brand-bg p-2.5 border border-brand-border mt-1 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 border border-brand-border bg-brand-text/5">
                    {selectedEndpoint.method}
                  </span>
                  <span>https://api.crm.com{selectedEndpoint.endpoint}</span>
                </div>
              </div>

              {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                <div>
                  <span className="text-[9px] font-bold text-brand-text/60 uppercase tracking-wider font-mono block">Query Parameters</span>
                  <div className="border border-brand-border overflow-hidden mt-1 text-[10px] font-mono">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-brand-text/10 text-brand-text font-bold border-b border-brand-border uppercase">
                          <th className="py-2 px-3">Param</th>
                          <th className="py-2 px-3">Type</th>
                          <th className="py-2 px-3">Required</th>
                          <th className="py-2 px-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/20 text-brand-text/80 bg-brand-bg">
                        {selectedEndpoint.parameters.map((p, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3 font-bold text-brand-text">{p.name}</td>
                            <td className="py-2 px-3 opacity-60">{p.type}</td>
                            <td className="py-2 px-3">{p.required ? 'true' : 'false'}</td>
                            <td className="py-2 px-3 text-brand-text/70">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedEndpoint.method === 'POST' && (
                <div>
                  <span className="text-[9px] font-bold text-brand-text/60 uppercase tracking-wider font-mono block mb-1">
                    Request Payload Body (JSON)
                  </span>
                  <textarea
                    value={customRequestBody}
                    onChange={(e) => setCustomRequestBody(e.target.value)}
                    className="w-full h-36 bg-brand-text text-brand-bg p-4 rounded-none font-mono text-xs focus:outline-hidden leading-relaxed border border-brand-border"
                    spellCheck={false}
                  />
                  <p className="text-[9px] text-brand-text/60 mt-1 uppercase font-mono tracking-tight">
                    Modifying this body and executing the request will actively inject records into the respective tab views.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RESPONSE SECTION */}
          {activeResponse && (
            <div className="bg-brand-text text-brand-bg border border-brand-border rounded-none overflow-hidden shadow-none space-y-0 font-mono text-xs">
              {/* HTTP status bar */}
              <div className="px-4 py-2 bg-brand-text border-b border-brand-bg/20 flex justify-between items-center">
                <span className="text-brand-bg/80 flex items-center gap-1.5 uppercase tracking-wide">
                  <Terminal size={12} /> HTTP Response Console
                </span>
                <span className="border border-brand-bg/30 px-2 py-0.5 font-bold uppercase text-[9px] bg-brand-bg/10 text-emerald-300">
                  Status: {activeStatus}
                </span>
              </div>

              {/* cURL command block */}
              <div className="p-4 bg-brand-text border-b border-brand-bg/20 text-[10px] text-brand-bg/70 leading-relaxed overflow-x-auto">
                <p className="text-brand-bg/55 font-bold uppercase tracking-wider text-[8px] mb-1">Generated cURL</p>
                <code className="whitespace-pre">{activeCurl}</code>
              </div>

              {/* Response Headers */}
              <div className="p-4 bg-brand-text border-b border-brand-bg/20 text-[10px] text-brand-bg/50 leading-relaxed overflow-x-auto whitespace-pre">
                <p className="text-brand-bg/40 font-bold uppercase tracking-wider text-[8px] mb-1">Response Headers</p>
                <code>{activeHeaders}</code>
              </div>

              {/* Response Body payload */}
              <div className="p-5 overflow-x-auto max-h-[300px] bg-brand-text text-brand-bg">
                <p className="text-brand-bg/60 font-bold uppercase tracking-wider text-[8px] mb-2">Response Body (JSON)</p>
                <pre className="leading-relaxed tracking-tight text-brand-bg">{JSON.stringify(activeResponse, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
