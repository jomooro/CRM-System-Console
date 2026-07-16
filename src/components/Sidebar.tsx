import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  LifeBuoy, 
  Database, 
  BarChart3, 
  Webhook,
  Activity,
  Server
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard, num: '[01]' },
    { id: 'crm', name: 'CRM & Sales', icon: Users, num: '[02]' },
    { id: 'support', name: 'Support Ops', icon: LifeBuoy, num: '[03]' },
    { id: 'postgres', name: 'Database', icon: Database, num: '[04]' },
    { id: 'analytics', name: 'Reporting', icon: BarChart3, num: '[05]' },
    { id: 'api', name: 'APIs', icon: Webhook, num: '[06]' },
  ];

  return (
    <aside className="w-64 bg-brand-bg text-brand-text flex flex-col h-full border-r border-brand-border shrink-0 font-sans select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-text flex items-center justify-center shrink-0">
            <span className="text-brand-bg font-sans font-black text-sm">CRM</span>
          </div>
          <div>
            <h1 className="font-sans font-bold text-sm tracking-tight uppercase text-brand-text">
              System Core
            </h1>
            <span className="font-serif italic text-xs opacity-60 font-normal">
              v4.2.1-stable
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="p-4 border-b border-brand-border">
        <h2 className="font-serif italic text-xs text-brand-text/60 mb-3">Core Operations</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-2.5 font-bold uppercase text-xxs transition-colors text-left border ${
                  isActive
                    ? 'bg-brand-text text-brand-bg border-brand-border'
                    : 'text-brand-text border-transparent hover:border-brand-border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={14} className="shrink-0" />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono text-[9px] tracking-tighter opacity-60">{item.num}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Health Section (Dynamic Stats for High Density Style) */}
      <div className="flex-1 p-4 bg-brand-text/3 flex flex-col justify-between">
        <div>
          <h2 className="font-serif italic text-xs text-brand-text/60 mb-3">System Health</h2>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase opacity-60 font-bold tracking-wider">Query Load</span>
              <div className="h-1 bg-brand-text/10 mt-1">
                <div className="h-full bg-brand-text w-[62%] transition-all duration-500"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase opacity-60 font-bold tracking-wider">Memory (Postgres)</span>
              <div className="h-1 bg-brand-text/10 mt-1">
                <div className="h-full bg-brand-text w-[45%] transition-all duration-500"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase opacity-60 font-bold tracking-wider">API Latency</span>
              <span className="font-mono text-lg font-bold tracking-tighter mt-0.5">
                24.8<span className="text-xs opacity-40 font-normal">ms</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Info Block */}
        <div className="pt-4 border-t border-brand-border/10">
          <div className="flex items-center justify-between text-[10px] font-mono opacity-60">
            <span>CLUSTER:</span>
            <span className="font-bold">pg-prod-01</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono opacity-60 mt-1">
            <span>UPTIME:</span>
            <span className="font-bold text-emerald-700">99.98%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
