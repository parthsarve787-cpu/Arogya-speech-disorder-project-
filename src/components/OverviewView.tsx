import React from 'react';
import { 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  Cpu, 
  Users, 
  HeartHandshake, 
  ArrowRight, 
  Sparkles,
  Lock,
  Compass,
  AlertCircle,
  HelpCircle,
  Database
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  PRD_META, 
  PRD_PRINCIPLES, 
  PRD_NON_GOALS, 
  PRD_PERSONAS, 
  PRD_MODULES, 
  PRD_REQUIREMENTS,
  PRD_RISKS,
  PRD_OPEN_QUESTIONS
} from '../data/prdData';

interface OverviewViewProps {
  onSelectTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onSelectTab }) => {
  // Compute chart metrics
  const phaseData = [
    { name: 'MVP (Build Now)', count: PRD_MODULES.filter(m => m.phase === 'MVP').length, color: '#10b981' },
    { name: 'MVP-lite', count: PRD_MODULES.filter(m => m.phase === 'MVP-lite').length, color: '#06b6d4' },
    { name: 'Phase 2 (P2)', count: PRD_MODULES.filter(m => m.phase === 'P2').length, color: '#f59e0b' },
    { name: 'Future (FUT)', count: PRD_MODULES.filter(m => m.phase === 'FUT').length, color: '#8b5cf6' },
  ];

  const reqCategories = [
    { category: 'Audio & Speech AI', count: PRD_REQUIREMENTS.filter(r => r.category === 'Speech AI' || r.category === 'Audio Pipeline').length },
    { category: 'Assessment & Practice', count: PRD_REQUIREMENTS.filter(r => r.category === 'Assessment' || r.category === 'Courses & Practice').length },
    { category: 'Adaptive & Digital Twin', count: PRD_REQUIREMENTS.filter(r => r.category === 'Adaptive Engine' || r.category === 'Digital Twin').length },
    { category: 'Public, Auth & User', count: PRD_REQUIREMENTS.filter(r => r.category === 'Public & Auth' || r.category === 'User Management').length },
    { category: 'Therapist & Dashboards', count: PRD_REQUIREMENTS.filter(r => r.category === 'Therapist Support' || r.category === 'Dashboards').length },
    { category: 'Gamification & AI Chat', count: PRD_REQUIREMENTS.filter(r => r.category === 'Gamification' || r.category === 'AI Conversation').length },
    { category: 'Admin & Operations', count: PRD_REQUIREMENTS.filter(r => r.category === 'Admin' || r.category === 'Notifications').length },
  ];

  const criticalQuestions = PRD_OPEN_QUESTIONS.filter(q => q.priority === 'Critical Block').length;
  const highRisks = PRD_RISKS.filter(r => r.severity === 'High').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Project Requirements Analysis & Architectural Extraction</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {PRD_META.title} — System Architecture & Metric Blueprint
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              A comprehensive analytical breakdown of AarogyaSpeech AI: a web platform designed for <strong className="text-emerald-300 font-semibold">AI-assisted, therapist-in-the-loop Hindi speech practice</strong> for children with functional misarticulation (ages 5–12). Bounded to a closed-vocabulary MVP with rigorous non-diagnostic clinical boundaries and strict 24-hour voice data protection.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <button
              onClick={() => onSelectTab('prototype')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
            >
              <span>Launch Live Audio Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('ml_pipeline')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Inspect ML Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm hover:border-stone-700 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Functional Reqs</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">91</div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">64 MVP</span> · 9 Lite · 18 P2
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm hover:border-stone-700 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Product Modules</span>
            <Layers className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">30</div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1.5">
            <span className="text-teal-400 font-semibold">18 Core MVP</span> (Critical path)
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm hover:border-stone-700 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Core Principles</span>
            <Compass className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">10</div>
          <div className="text-[11px] text-stone-400 mt-1">
            Binding: <span className="text-sky-300">Therapist-in-the-loop</span>
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm hover:border-stone-700 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Explicit Non-Goals</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">10</div>
          <div className="text-[11px] text-rose-300/90 mt-1">
            Zero medical diagnosis
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm hover:border-stone-700 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Audio Retention</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">24 hrs</div>
          <div className="text-[11px] text-stone-400 mt-1">
            Raw audio deleted; vectors only
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-sm hover:border-stone-700 transition-colors">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Blockers & Risks</span>
            <AlertCircle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{criticalQuestions + highRisks}</div>
          <div className="text-[11px] text-stone-400 mt-1">
            <span className="text-orange-400 font-semibold">{criticalQuestions} Critical Qs</span> · {highRisks} High Risks
          </div>
        </div>
      </div>

      {/* The Core System Loop Visualizer */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              The Closed-Loop Architectural Feedback Engine
            </h3>
            <p className="text-xs text-stone-400">
              End-to-end flow defined in §2 & §32: Every practice attempt refines the Child Speech Digital Twin.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
            G-01 Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { step: '1. Speak', title: 'Hindi Target', desc: 'Child speaks prompted Devanagari word into browser mic', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300' },
            { step: '2. Preprocess', title: 'DSP Quality Gate', desc: '16kHz mono, VAD & SNR check; rejects unusable clips', color: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-300' },
            { step: '3. Analyze', title: 'wav2vec 2.0 CTC', desc: 'Extracts acoustic posteriors & forced alignment', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-300' },
            { step: '4. Detect', title: 'GOP & Errors', desc: 'Classifies Substitution, Omission, Addition & Distortion', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300' },
            { step: '5. Digital Twin', title: 'State Update', desc: 'Exponential moving average mastery update formula', color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300' },
            { step: '6. Personalize', title: 'Adaptive Engine', desc: 'Prioritizes weak phonemes & generates daily plan', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300' },
            { step: '7. Review & Adapt', title: 'Adult Oversight', desc: 'Parent weekly view; therapist confirms or overrides', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-300' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border bg-gradient-to-b ${item.color} flex flex-col justify-between`}
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold opacity-80">
                  {item.step}
                </span>
                <h4 className="text-xs font-bold text-white mt-1">{item.title}</h4>
                <p className="text-[11px] text-stone-300 mt-1 line-clamp-3 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Analytics Grid: Distribution of Modules and Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Scope by Phase */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Module Allocation by Phase (30 Modules)
              </h3>
              <span className="text-xs text-stone-400">§7 Product Scope</span>
            </div>
            <p className="text-xs text-stone-400 mb-4">
              Clear scoping ensures engineering feasibility: MVP core accounts for 60% of architecture, while AI voice calls and peer community are phased into P2.
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#78716c" tick={{ fontSize: 11 }} />
                <YAxis stroke="#78716c" tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {phaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-stone-800 text-center">
            {phaseData.map((p, idx) => (
              <div key={idx} className="bg-stone-850 rounded-lg p-2">
                <div className="text-xs text-stone-400">{p.name.split(' ')[0]}</div>
                <div className="text-base font-bold text-white mt-0.5" style={{ color: p.color }}>
                  {p.count} <span className="text-[10px] text-stone-500 font-normal">mods</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements by Subsystem */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Functional Requirements Distribution (91 FRs)
              </h3>
              <span className="text-xs text-stone-400">§8-§19 Specifications</span>
            </div>
            <p className="text-xs text-stone-400 mb-4">
              Breakdown across the 7 major functional domains showing heavy concentration in Speech AI, Assessment, and Adaptive Personalization.
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reqCategories}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 55, bottom: 5 }}
              >
                <XAxis type="number" stroke="#78716c" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="category" type="category" stroke="#78716c" tick={{ fontSize: 10 }} width={85} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-800">
            <span>Highest density: <strong>Assessment & Practice (24 FRs)</strong></span>
            <button 
              onClick={() => onSelectTab('modules')} 
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              Explore all 91 FRs →
            </button>
          </div>
        </div>
      </div>

      {/* Target User Roles & RBAC Overview */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Target Stakeholders & User Roles (§6)
            </h3>
            <p className="text-xs text-stone-400">
              Role-scaled permissions guarantee child psychological safety and strict parental governance.
            </p>
          </div>
          <button 
            onClick={() => onSelectTab('security_privacy')} 
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
          >
            Full RBAC Matrix →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRD_PERSONAS.map((p) => (
            <div 
              key={p.role} 
              className="bg-stone-850/80 border border-stone-800 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-800 text-emerald-300 border border-stone-700">
                    {p.role}
                  </span>
                  <span className="text-[11px] text-stone-400">{p.ageRange}</span>
                </div>
                <div className="text-xs font-semibold text-stone-200 mb-1">Tone & Stance:</div>
                <p className="text-xs text-stone-400 mb-3 italic">"{p.tone}"</p>

                <div className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Key Capabilities:
                </div>
                <ul className="space-y-1 text-xs text-stone-300 mb-3">
                  {p.keyActions.slice(0, 3).map((act, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-stone-800">
                <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">
                  Enforced Boundary:
                </div>
                <p className="text-[11px] text-stone-400 line-clamp-2">
                  {p.restrictedActions[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Binding Principles & Non-Goals Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 10 Principles */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              10 Binding Architectural Principles (PR-01 to PR-10)
            </h3>
            <span className="text-xs text-stone-500 font-mono">§2 Principles</span>
          </div>
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {PRD_PRINCIPLES.map((pr) => (
              <div key={pr.id} className="p-2.5 rounded-lg bg-stone-850/70 border border-stone-800">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
                    {pr.id}
                  </span>
                  <h4 className="text-xs font-semibold text-stone-200">{pr.title}</h4>
                </div>
                <p className="text-xs text-stone-300 mt-1 font-medium">{pr.statement}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{pr.implications}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 10 Non-Goals */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              10 Strict Non-Goals & Guardrails (NG-01 to NG-10)
            </h3>
            <span className="text-xs text-stone-500 font-mono">§5 Guardrails</span>
          </div>
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {PRD_NON_GOALS.map((ng) => (
              <div key={ng.id} className="p-2.5 rounded-lg bg-stone-850/70 border border-stone-800">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
                    {ng.id}
                  </span>
                  <h4 className="text-xs font-semibold text-rose-200">{ng.statement}</h4>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  <strong>Rationale:</strong> {ng.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
