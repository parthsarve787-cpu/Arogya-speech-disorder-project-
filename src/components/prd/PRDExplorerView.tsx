import React, { useState } from 'react';
import { OverviewView } from '../OverviewView';
import { ModulesView } from '../ModulesView';
import { MLPipelineView } from '../MLPipelineView';
import { DigitalTwinView } from '../DigitalTwinView';
import { SecurityPrivacyView } from '../SecurityPrivacyView';
import { RisksAndQuestionsView } from '../RisksAndQuestionsView';
import { InteractivePrototypeView } from '../InteractivePrototypeView';
import { 
  FileCode2, 
  Layers, 
  Cpu, 
  Compass, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles 
} from 'lucide-react';

export const PRDExplorerView: React.FC = () => {
  const [subTab, setSubTab] = useState<
    'overview' | 'modules' | 'pipeline' | 'twin' | 'security' | 'risks' | 'prototype'
  >('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectTab = (tab: string) => {
    if (tab === 'ml_pipeline') setSubTab('pipeline');
    else if (tab === 'digital_twin') setSubTab('twin');
    else if (tab === 'security_privacy') setSubTab('security');
    else if (tab === 'risks_questions') setSubTab('risks');
    else if (tab === 'prototype') setSubTab('prototype');
    else if (tab === 'modules') setSubTab('modules');
    else setSubTab('overview');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/25 mb-1">
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Product Requirements Document (PRD v1.0) & Architecture Specs</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            AarogyaSpeech AI PRD & Engineering Metrics Explorer
          </h1>
        </div>

        {subTab === 'modules' && (
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requirements, modules, principles..."
            className="bg-stone-850 border border-stone-750 text-white rounded-xl px-3 py-1.5 text-xs w-64 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        )}
      </div>

      {/* Sub navigation bar */}
      <div className="flex bg-stone-900 border border-stone-800 p-1.5 rounded-2xl overflow-x-auto text-xs gap-1">
        {[
          { id: 'overview', label: 'Executive Overview', icon: Layers },
          { id: 'modules', label: 'Modules & Features', icon: Layers },
          { id: 'pipeline', label: 'ML Speech Pipeline', icon: Cpu },
          { id: 'twin', label: 'Digital Twin Math', icon: Compass },
          { id: 'security', label: 'Security & DPDP', icon: ShieldCheck },
          { id: 'risks', label: 'Risks & DoD Matrix', icon: AlertTriangle },
          { id: 'prototype', label: 'PRD Simulator', icon: Sparkles },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id as any)}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
                subTab === t.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-850'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render sub-tab content */}
      <div className="pt-2">
        {subTab === 'overview' && <OverviewView onSelectTab={handleSelectTab} />}
        {subTab === 'modules' && <ModulesView searchQuery={searchQuery} />}
        {subTab === 'pipeline' && <MLPipelineView />}
        {subTab === 'twin' && <DigitalTwinView />}
        {subTab === 'security' && <SecurityPrivacyView />}
        {subTab === 'risks' && <RisksAndQuestionsView />}
        {subTab === 'prototype' && <InteractivePrototypeView />}
      </div>
    </div>
  );
};
