import React from 'react';
import { 
  Activity, 
  Layers, 
  Cpu, 
  UserCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Mic, 
  Search, 
  Download, 
  Check, 
  Sparkles,
  FileText
} from 'lucide-react';
import { PRD_META } from '../data/prdData';

export type TabType = 
  | 'overview' 
  | 'modules' 
  | 'ml_pipeline' 
  | 'digital_twin' 
  | 'security_privacy' 
  | 'risks_questions' 
  | 'prototype';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExportSummary: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onExportSummary,
  copied,
}) => {
  const tabs = [
    { id: 'overview' as TabType, label: 'Executive Overview', icon: Activity, badge: 'KPIs' },
    { id: 'modules' as TabType, label: 'Modules & Requirements', icon: Layers, badge: '30 M · 91 FR' },
    { id: 'ml_pipeline' as TabType, label: 'AI/ML Speech Pipeline', icon: Cpu, badge: 'wav2vec 2.0' },
    { id: 'digital_twin' as TabType, label: 'Digital Twin & Adaptive', icon: UserCheck, badge: 'Adaptive' },
    { id: 'security_privacy' as TabType, label: 'Security, Privacy & RBAC', icon: ShieldCheck, badge: '24h TTL' },
    { id: 'risks_questions' as TabType, label: 'Risks & Readiness', icon: AlertTriangle, badge: '17 Qs' },
    { id: 'prototype' as TabType, label: 'Interactive Live Sandbox', icon: Mic, badge: 'Demo' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-md">
      {/* Top Banner with Brand and Meta Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3.5 pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-white font-bold">
              <Sparkles className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  {PRD_META.title}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {PRD_META.version}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                    {PRD_META.date}
                  </span>
                </h1>
              </div>
              <p className="text-xs text-stone-400 font-medium">
                <span className="text-emerald-400 font-semibold">{PRD_META.tagline}</span> — System PRD Analysis & Architectural Intelligence
              </p>
            </div>
          </div>

          {/* Quick Actions & Search */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="global-prd-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FRs, modules, risks..."
                className="w-full bg-stone-800/90 border border-stone-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              id="export-summary-btn"
              onClick={onExportSummary}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
              title="Copy executive PRD summary to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-100" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2.5 mt-2 border-t border-stone-800/80 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
