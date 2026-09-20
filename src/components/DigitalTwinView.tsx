import React, { useState } from 'react';
import { 
  UserCheck, 
  Sliders, 
  Calculator, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  ArrowRight, 
  TrendingUp, 
  RotateCcw,
  CheckCircle,
  Clock,
  Compass
} from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  // State for Interactive Formula Simulator
  const [currentMastery, setCurrentMastery] = useState<number>(0.55);
  const [outcome, setOutcome] = useState<number>(1); // 1 = correct, 0 = error
  const [confidence, setConfidence] = useState<number>(0.85);
  const [alpha, setAlpha] = useState<number>(0.25);

  // Calculate updated mastery using: (1 - alpha * c) * mastery + alpha * c * s
  const updatedMastery = Number(
    ((1 - alpha * confidence) * currentMastery + alpha * confidence * outcome).toFixed(3)
  );

  const delta = Number((updatedMastery - currentMastery).toFixed(3));

  const progressionLadder = [
    { rung: '1. Phonemes & Syllables', desc: 'Isolated sounds, carrier syllables (e.g. "क", "का", "की")', focus: 'Acoustic placement & voicing', level: 'Beginner' },
    { rung: '2. Target Words', desc: 'Picture-supported words across initial, medial, and final positions', focus: 'Word-level phonological accuracy', level: 'Beginner–Intermediate' },
    { rung: '3. Phrases & Minimal Pairs', desc: 'Short phrases and contrastive minimal pairs (e.g. "काला" vs "ताला")', focus: 'Phonological contrast discrimination', level: 'Intermediate' },
    { rung: '4. Sentences & Reading', desc: 'Multi-word connected speech sentences with rhythm', focus: 'Prosody, connected speech blending', level: 'Intermediate–Advanced' },
    { rung: '5. Guided Conversation', desc: 'Turn-taking conversational scenarios (school, shopping, family)', focus: 'Spontaneous communicative competence', level: 'Advanced (P2)' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>§11 & §13 Child Speech Digital Twin & Adaptive Learning</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Personalized Speech Profile & Adaptive Engine
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              A dynamic state representation of the child's longitudinal practice trajectory. It is an algorithmic practice model—<strong className="text-emerald-300 font-semibold">never a biological diagnosis or clinical disorder classification</strong>.
            </p>
          </div>

          <div className="bg-stone-850 border border-stone-800 p-3 rounded-xl text-xs space-y-1 shrink-0">
            <span className="text-[11px] font-mono text-stone-400">State Snapshot Format:</span>
            <div className="text-emerald-400 font-bold font-mono">PostgreSQL JSONB</div>
            <div className="text-[10px] text-stone-400">Immutable versioned snapshots</div>
          </div>
        </div>
      </div>

      {/* Interactive Mastery Update Formula Playground */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Interactive Mastery State Update Simulator (§11)
            </h3>
            <p className="text-xs text-stone-400">
              Test how an attempt outcome, weighted by model confidence and learning rate α, dynamically recalibrates phoneme mastery.
            </p>
          </div>

          <div className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-lg">
            mastery ← (1 − α·c)·mastery + α·c·s
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Controls */}
          <div className="bg-stone-850/80 border border-stone-800 rounded-xl p-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span className="font-medium">Prior Phoneme Mastery (mastery):</span>
                <span className="font-mono text-emerald-400 font-bold">{(currentMastery * 100).toFixed(0)}% ({currentMastery})</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={currentMastery}
                onChange={(e) => setCurrentMastery(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span className="font-medium">Attempt Pronunciation Outcome (s):</span>
                <span className={`font-bold text-xs ${outcome === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {outcome === 1 ? 'Correct Production (1)' : 'Misarticulation (0)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => setOutcome(1)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    outcome === 1
                      ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500'
                      : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                  }`}
                >
                  ✓ Correct (s = 1)
                </button>
                <button
                  onClick={() => setOutcome(0)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    outcome === 0
                      ? 'bg-rose-600/30 text-rose-200 border-rose-500'
                      : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                  }`}
                >
                  ✗ Misarticulation (s = 0)
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span className="font-medium">Acoustic Model Confidence (c):</span>
                <span className="font-mono text-teal-400 font-bold">{(confidence * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <span className="text-[10px] text-stone-500">
                Low-confidence attempts (&lt;0.60) are gated as Inconclusive and excluded from updates.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-stone-300 mb-1">
                <span className="font-medium">Learning Rate Weight (α):</span>
                <span className="font-mono text-purple-400 font-bold">{alpha}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Outcome Gauge & Mathematical Breakdown */}
          <div className="bg-stone-850/80 border border-stone-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Recalculated State Output:
              </span>

              <div className="flex items-baseline space-x-3 mt-2">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {(updatedMastery * 100).toFixed(1)}%
                </div>
                <div
                  className={`text-sm font-bold flex items-center ${
                    delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {delta >= 0 ? `+${(delta * 100).toFixed(1)}%` : `${(delta * 100).toFixed(1)}%`}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-800 h-3 rounded-full mt-3 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-teal-500 to-emerald-500"
                  style={{ width: `${Math.min(100, Math.max(0, updatedMastery * 100))}%` }}
                />
              </div>

              <div className="mt-4 p-3 rounded-lg bg-stone-900 border border-stone-800 text-xs font-mono space-y-1 text-stone-300">
                <div className="text-stone-400 text-[10px] uppercase font-bold">Calculation Trace:</div>
                <div>effective_rate = α · c = {alpha} · {confidence} = {(alpha * confidence).toFixed(3)}</div>
                <div>weight_prior = (1 − {(alpha * confidence).toFixed(3)}) = {(1 - alpha * confidence).toFixed(3)}</div>
                <div>contribution_prior = {(1 - alpha * confidence).toFixed(3)} · {currentMastery} = {((1 - alpha * confidence) * currentMastery).toFixed(3)}</div>
                <div>contribution_new = {(alpha * confidence).toFixed(3)} · {outcome} = {(alpha * confidence * outcome).toFixed(3)}</div>
                <div className="text-emerald-300 font-bold pt-1 border-t border-stone-800">
                  updated_mastery = {updatedMastery} ({(updatedMastery * 100).toFixed(1)}%)
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800/80 text-[11px] text-stone-400">
              <strong>Clinical Guard:</strong> Mastery requires a configurable minimum attempt threshold (e.g. 5 attempts) before being considered statistically stable.
            </div>
          </div>
        </div>
      </div>

      {/* Progression Ladder and Adaptive Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progression Ladder */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Pedagogical Progression Ladder (§13.2)
              </h3>
              <span className="text-xs text-stone-500 font-mono">5 Rungs</span>
            </div>
            <p className="text-xs text-stone-400 mb-4">
              Scaffolding progression: Child advances to higher rungs upon demonstrating readiness, with lower rungs remaining replayable at any time.
            </p>

            <div className="space-y-2.5">
              {progressionLadder.map((r, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-850/80 border border-stone-800 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{r.rung}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-stone-800 text-stone-300">
                        {r.level}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 mt-1">{r.desc}</p>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      Focus: <span className="text-emerald-300 font-medium">{r.focus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Adaptive Rules & Frustration Guard */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                Adaptive Staircase & Frustration Guard (§13.4)
              </h3>
              <span className="text-xs text-stone-500 font-mono">FR-054</span>
            </div>
            <p className="text-xs text-stone-400">
              Heuristic algorithms tailored for child motivation, ensuring sessions never conclude on a discouraging note.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-stone-850 border border-stone-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">
                  Advancement Staircase (N_up)
                </span>
                <span className="text-[10px] font-mono text-stone-400">Parameter: N_up = 3</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Upon achieving N_up consecutive successful productions of a target sound, difficulty advances to more challenging contexts (from initial position -&gt; medial position -&gt; consonant clusters -&gt; reduced visual scaffolding).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-850 border border-stone-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Support Fallback Staircase (N_down)
                </span>
                <span className="text-[10px] font-mono text-stone-400">Parameter: N_down = 2</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Upon experiencing N_down consecutive struggles, the recommender steps back to an easier variation, followed immediately by a confidence-building item with high prior mastery.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-850 border border-stone-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 uppercase tracking-wider text-[11px]">
                  Frustration Circuit Breaker
                </span>
                <span className="text-[10px] font-mono text-rose-400">Protective Rule</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Repeated inconclusive or low outcomes within a session automatically transition the child into a relaxing listening quiz or playful mini-game. <strong>The system is strictly forbidden from ending any practice session on a failed attempt.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
