import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  Filter, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { PRD_MODULES, PRD_REQUIREMENTS } from '../data/prdData';
import { Phase, Category } from '../types';

interface ModulesViewProps {
  searchQuery: string;
}

export const ModulesView: React.FC<ModulesViewProps> = ({ searchQuery }) => {
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'requirements'>('modules');
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyCriticalPath, setOnlyCriticalPath] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const phases: { label: string; value: string }[] = [
    { label: 'All Phases', value: 'ALL' },
    { label: 'MVP (Build Now)', value: 'MVP' },
    { label: 'MVP-lite', value: 'MVP-lite' },
    { label: 'Phase 2 (P2)', value: 'P2' },
    { label: 'Future (FUT)', value: 'FUT' },
  ];

  const categories: string[] = [
    'ALL',
    'Core Architecture',
    'Audio & AI',
    'Assessment & Practice',
    'User & Roles',
    'Gamification & Engagement',
    'Security, Privacy & Admin',
  ];

  // Filter modules
  const filteredModules = useMemo(() => {
    return PRD_MODULES.filter((m) => {
      const matchesPhase = selectedPhase === 'ALL' || m.phase === selectedPhase;
      const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
      const matchesCritical = !onlyCriticalPath || m.isCriticalPath;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        m.id.toLowerCase().includes(query) ||
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.keyOutputs.toLowerCase().includes(query);
      return matchesPhase && matchesCategory && matchesCritical && matchesSearch;
    });
  }, [selectedPhase, selectedCategory, onlyCriticalPath, searchQuery]);

  // Filter requirements
  const filteredRequirements = useMemo(() => {
    return PRD_REQUIREMENTS.filter((r) => {
      const matchesPhase = selectedPhase === 'ALL' || r.phase === selectedPhase;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        r.id.toLowerCase().includes(query) ||
        r.requirement.toLowerCase().includes(query) ||
        r.module.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query);
      return matchesPhase && matchesSearch;
    });
  }, [selectedPhase, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPhaseBadge = (phase: Phase) => {
    switch (phase) {
      case 'MVP':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'MVP-lite':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'P2':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'FUT':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* View Switcher and Filters Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Toggle between Modules and Reqs */}
        <div className="flex items-center space-x-1 bg-stone-850 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveSubTab('modules')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'modules'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>30 Architecture Modules</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-900/60 font-mono">
              {filteredModules.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('requirements')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'requirements'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>91 Functional Requirements</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-900/60 font-mono">
              {filteredRequirements.length}
            </span>
          </button>
        </div>

        {/* Phase and Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Phase Filter */}
          <div className="flex items-center space-x-1 bg-stone-850 px-2 py-1 rounded-lg border border-stone-800 text-xs">
            <span className="text-stone-400 text-[11px]">Phase:</span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {phases.map((p) => (
                <option key={p.value} value={p.value} className="bg-stone-900 text-stone-200">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter (when in Modules tab) */}
          {activeSubTab === 'modules' && (
            <div className="flex items-center space-x-1 bg-stone-850 px-2 py-1 rounded-lg border border-stone-800 text-xs">
              <span className="text-stone-400 text-[11px]">Domain:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-stone-900 text-stone-200">
                    {c === 'ALL' ? 'All Domains' : c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Critical Path Toggle */}
          {activeSubTab === 'modules' && (
            <label className="flex items-center space-x-1.5 text-xs text-stone-300 bg-stone-850 px-2.5 py-1 rounded-lg border border-stone-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyCriticalPath}
                onChange={(e) => setOnlyCriticalPath(e.target.checked)}
                className="rounded border-stone-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-stone-900"
              />
              <span>Critical Path Only</span>
            </label>
          )}
        </div>
      </div>

      {/* Critical Path Flow Info Notice */}
      {activeSubTab === 'modules' && (
        <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-3.5 text-xs text-stone-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
              CRITICAL PATH (§7)
            </span>
            <span className="font-mono text-stone-400">
              M-02 → M-03 → Consent → M-05 → M-06 → M-07/08 → M-10 → M-12 → M-15/13/14 → M-17/16 → M-21 → M-22/23
            </span>
          </div>
          <span className="text-[11px] text-stone-400">
            Fine-tuned wav2vec 2.0 acoustic model is highest risk dependency
          </span>
        </div>
      )}

      {/* SUB-VIEW 1: Modules Grid */}
      {activeSubTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((module) => {
            const linkedFRs = PRD_REQUIREMENTS.filter((r) => r.module === module.id);
            return (
              <div
                key={module.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between hover:border-stone-700 transition-colors shadow-sm relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">
                        {module.id}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {module.section}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {module.isCriticalPath && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Critical Path
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getPhaseBadge(
                          module.phase
                        )}`}
                      >
                        {module.phase}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    {module.name}
                  </h3>

                  <div className="text-[11px] text-stone-400 font-medium mb-2.5">
                    Category: <span className="text-stone-300">{module.category}</span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed mb-3">
                    {module.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-stone-800/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Key Deliverables:
                    </span>
                    <div className="text-xs text-emerald-300 font-medium mt-0.5">
                      {module.keyOutputs}
                    </div>
                  </div>

                  {module.dependencies.length > 0 && (
                    <div className="flex items-center space-x-1.5 pt-1">
                      <span className="text-[10px] text-stone-500">Depends on:</span>
                      <div className="flex flex-wrap gap-1">
                        {module.dependencies.map((dep) => (
                          <span
                            key={dep}
                            className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 border border-stone-700"
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {linkedFRs.length > 0 && (
                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
                      <span>{linkedFRs.length} Functional Requirement{linkedFRs.length > 1 ? 's' : ''}</span>
                      <span className="text-emerald-400 font-mono text-[10px]">
                        {linkedFRs.map(r => r.id).slice(0, 3).join(', ')}{linkedFRs.length > 3 ? '...' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-VIEW 2: Functional Requirements Explorer */}
      {activeSubTab === 'requirements' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-stone-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Full Requirements Catalog ({filteredRequirements.length} / 91 Reqs)
              </h3>
              <p className="text-xs text-stone-400">
                Extracted specifications from PRD §8 through §19, complete with target phase and owning module.
              </p>
            </div>
            <button
              onClick={() => {
                const allText = filteredRequirements.map(r => `[${r.id}] (${r.phase} | ${r.module}): ${r.requirement}`).join('\n');
                handleCopy(allText, 'ALL_REQS');
              }}
              className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 flex items-center space-x-1.5 cursor-pointer"
            >
              {copiedId === 'ALL_REQS' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'ALL_REQS' ? 'Copied Filtered' : 'Copy Filtered'}</span>
            </button>
          </div>

          <div className="divide-y divide-stone-800 max-h-[650px] overflow-y-auto">
            {filteredRequirements.map((req) => (
              <div
                key={req.id}
                className="p-4 hover:bg-stone-850/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
              >
                <div className="space-y-1.5 max-w-4xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {req.id}
                    </span>
                    <span className="font-mono text-xs text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                      {req.module}
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium">
                      {req.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${getPhaseBadge(
                        req.phase
                      )}`}
                    >
                      {req.phase}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
                    {req.requirement}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(`[${req.id}] ${req.requirement}`, req.id)}
                  className="self-start sm:self-center shrink-0 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
                  title="Copy requirement text"
                >
                  {copiedId === req.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}

            {filteredRequirements.length === 0 && (
              <div className="p-8 text-center text-stone-400 text-xs">
                No functional requirements matched the selected filters.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
