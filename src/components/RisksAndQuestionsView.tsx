import React, { useState } from 'react';
import { 
  AlertTriangle, 
  HelpCircle, 
  CheckSquare, 
  ShieldCheck, 
  AlertCircle, 
  FileCheck2, 
  Filter,
  Check
} from 'lucide-react';
import { 
  PRD_RISKS, 
  PRD_OPEN_QUESTIONS, 
  PRD_ASSUMPTIONS, 
  PRD_DOD_CHECKLIST 
} from '../data/prdData';

export const RisksAndQuestionsView: React.FC = () => {
  const [subTab, setSubTab] = useState<'risks' | 'questions' | 'assumptions' | 'dod'>('risks');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedQuestionPriority, setSelectedQuestionPriority] = useState<string>('ALL');
  const [checkedDodItems, setCheckedDodItems] = useState<Record<number, boolean>>({
    0: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const toggleDod = (idx: number) => {
    setCheckedDodItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const filteredRisks = PRD_RISKS.filter((r) => {
    return selectedSeverity === 'ALL' || r.severity === selectedSeverity;
  });

  const filteredQuestions = PRD_OPEN_QUESTIONS.filter((q) => {
    return selectedQuestionPriority === 'ALL' || q.priority === selectedQuestionPriority;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>§27 & §33 Risk Governance, Readiness & Open Inquiries</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Project Risk Matrix, Open Questions & Launch Readiness
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Transparent reporting of engineering hurdles, clinical partnerships, and data collection constraints. Key mitigations include closed-vocabulary modeling, conservative clinical disclaimers, and clear MVP cut-orders.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-stone-850 border border-stone-800 p-3 rounded-xl text-xs space-y-1">
              <span className="text-[11px] font-mono text-stone-400">Critical Open Blockers:</span>
              <div className="text-rose-400 font-bold font-mono">5 Questions</div>
              <div className="text-[10px] text-stone-400">IRB, SLP partnership, DPDP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center space-x-1 bg-stone-900 p-1.5 rounded-xl border border-stone-800 overflow-x-auto">
        {[
          { id: 'risks', label: `12 Technical Risks & Mitigations (${PRD_RISKS.length})` },
          { id: 'questions', label: `17 Open Questions (${PRD_OPEN_QUESTIONS.length})` },
          { id: 'assumptions', label: `10 Foundational Assumptions (${PRD_ASSUMPTIONS.length})` },
          { id: 'dod', label: `MVP Definition of Done (${PRD_DOD_CHECKLIST.length} Items)` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              subTab === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-VIEW 1: Risks & Mitigations */}
      {subTab === 'risks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Filter by Severity:</span>
            <div className="flex space-x-1">
              {['ALL', 'High', 'Medium'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    selectedSeverity === sev
                      ? 'bg-stone-800 text-white border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRisks.map((r) => (
              <div
                key={r.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-200">
                        {r.id}
                      </span>
                      <span className="text-[11px] text-stone-400 font-medium">
                        {r.category}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        r.severity === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {r.severity} Severity
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white mb-2 leading-snug">
                    {r.risk}
                  </h4>

                  <div className="p-3 rounded-lg bg-stone-850 border border-stone-800 text-xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Architectural Mitigation:
                    </span>
                    <p className="text-stone-300 mt-1 leading-relaxed">
                      {r.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Open Questions */}
      {subTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Filter by Urgency / Impact:</span>
            <div className="flex space-x-1">
              {['ALL', 'Critical Block', 'High', 'Medium'].map((prio) => (
                <button
                  key={prio}
                  onClick={() => setSelectedQuestionPriority(prio)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    selectedQuestionPriority === prio
                      ? 'bg-stone-800 text-white border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {q.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        q.priority === 'Critical Block'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : q.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}
                    >
                      {q.priority}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white mb-2 leading-snug">
                    {q.question}
                  </h4>

                  <div className="text-xs text-stone-400 pt-2 border-t border-stone-800">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      Direct System Impact:
                    </span>
                    <div className="text-stone-300 mt-0.5 font-medium">
                      {q.affects}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Assumptions */}
      {subTab === 'assumptions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRD_ASSUMPTIONS.map((a) => (
            <div
              key={a.id}
              className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-800 text-teal-300 border border-stone-700">
                    {a.id}
                  </span>
                  <span className="text-[11px] text-stone-400">Core Assumption</span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white mb-2 leading-snug">
                  {a.statement}
                </h4>

                <div className="p-2.5 rounded-lg bg-stone-850 border border-stone-800 text-xs text-stone-400">
                  <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                    Architectural Consequence:
                  </span>
                  <p className="text-stone-300 mt-0.5 font-medium">
                    {a.implication}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-VIEW 4: MVP Definition of Done Checklist */}
      {subTab === 'dod' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                MVP Definition of Done (DoD) Criteria (§28)
              </h3>
              <p className="text-xs text-stone-400">
                All 8 criteria are mandatory before concluding MVP and releasing to family pilots.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400">
              {Object.values(checkedDodItems).filter(Boolean).length} / {PRD_DOD_CHECKLIST.length} Completed
            </div>
          </div>

          <div className="space-y-3">
            {PRD_DOD_CHECKLIST.map((item, idx) => {
              const isChecked = !!checkedDodItems[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleDod(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-stone-200'
                      : 'bg-stone-850/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-stone-700 bg-stone-900'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {item.item}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-emerald-400 border border-stone-700">
                        Mandatory MVP
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
