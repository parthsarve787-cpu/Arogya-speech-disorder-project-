import React, { useState } from 'react';
import { 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Scale, 
  Sparkles, 
  ShieldCheck, 
  Mic, 
  Sliders,
  Database,
  Terminal,
  Activity
} from 'lucide-react';
import { PRD_PIPELINE_STEPS } from '../data/prdData';

export const MLPipelineView: React.FC = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const currentStep = PRD_PIPELINE_STEPS[selectedStepIndex];

  const decisionOwnership = [
    { decision: 'Produced phoneme sequence', ai: '✔ (wav2vec 2.0)', rules: '', human: '' },
    { decision: 'Expected phonemes & acceptable variants', ai: '', rules: '✔ (G2P + Lexicon)', human: '✔ SLP validates' },
    { decision: 'Error classification (Sub/Om/Add)', ai: '', rules: '✔ (Alignment rules on AI outputs)', human: '' },
    { decision: 'Distortion assertion', ai: 'Low-GOP flag only', rules: '', human: '✔ Human SLP only' },
    { decision: 'Inconclusive gating', ai: '', rules: '✔ Threshold rule', human: '' },
    { decision: 'Daily practice priority & difficulty step', ai: '', rules: '✔ Adaptive heuristics', human: '✔ Therapist may override' },
    { decision: 'Suggested learning practice level', ai: '', rules: '✔ Baseline rules', human: '✔ Parent/Therapist confirm or override' },
    { decision: 'Confirmed clinical error label', ai: '', rules: '', human: '✔ Human Therapist' },
    { decision: 'Clinical interpretation, goals, diagnosis', ai: 'Strictly prohibited (PR-02)', rules: '', human: '✔ Human SLP only' },
    { decision: 'Content & audio safety verification', ai: '', rules: '', human: '✔ Native speaker / SLP' },
  ];

  const errorTaxonomy = [
    {
      type: 'Substitution',
      definition: 'Target phoneme replaced by another phoneme in child production',
      exampleHindi: 'कहना ("कहना" /k-h-n-a/ spoken as "तहना" /t-h-n-a/)',
      detectionLogic: 'Phonetic feature-weighted edit alignment matches produced token to alternate phoneme.',
      mvpHandling: 'Reported with target-produced pair, confidence score, and adult visibility.',
      statusColor: 'text-amber-400 bg-amber-950/40 border-amber-800/40'
    },
    {
      type: 'Omission',
      definition: 'Target phoneme dropped entirely from the utterance',
      exampleHindi: 'कमल ("कमल" /k-m-l/ spoken as "मल" /m-l/)',
      detectionLogic: 'Forced alignment detects gap or null frame in expected phoneme slot.',
      mvpHandling: 'Reported as omitted sound; suggested carrier syllable drill generated.',
      statusColor: 'text-rose-400 bg-rose-950/40 border-rose-800/40'
    },
    {
      type: 'Addition',
      definition: 'Spurious extra phoneme inserted into the sequence',
      exampleHindi: 'स्कूल ("स्कूल" /s-k-u-l/ spoken as "इस्कूल" /i-s-k-u-l/)',
      detectionLogic: 'Produced tokens exceed expected slot alignment sequence.',
      mvpHandling: 'Reported as inserted sound; phonological context analyzed.',
      statusColor: 'text-sky-400 bg-sky-950/40 border-sky-800/40'
    },
    {
      type: 'Distortion',
      definition: 'Atypical, acoustically warped, or imprecise production of the sound',
      exampleHindi: 'Lateral lisp or imprecise dentalization on /s/ (स)',
      detectionLogic: 'Acoustic Goodness of Pronunciation (GOP) falls below calibrated threshold without clear substitution token.',
      mvpHandling: 'Strictly flagged only as "Possible Distortion"; deferred to SLP confirmation; never asserted as fact by AI.',
      statusColor: 'text-purple-400 bg-purple-950/40 border-purple-800/40'
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>§10 & §26 AI/ML Architecture Specifications</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Acoustic Phoneme Inference & Error Detection Engine
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Hindi child speech analysis pipeline built on fine-tuned wav2vec 2.0 with CTC loss, forced alignment, and Goodness of Pronunciation (GOP) scoring. Whisper is used strictly as an auxiliary transcript sanity check—never for phoneme error labels.
            </p>
          </div>

          <div className="bg-stone-850 border border-stone-800 p-3 rounded-xl text-xs space-y-1 shrink-0">
            <div className="text-stone-400 font-mono text-[11px]">Primary Model Checkpoint:</div>
            <div className="text-emerald-400 font-bold font-mono">wav2vec 2.0 (Hindi CTC)</div>
            <div className="text-[10px] text-stone-400">Quantized CPU inference &lt; 2.5s P95</div>
          </div>
        </div>
      </div>

      {/* Interactive 8-Stage Pipeline Ribbon */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Interactive 8-Stage Audio Inference Pipeline (§10.1)
          </h3>
          <p className="text-xs text-stone-400">
            Click any processing stage to inspect its mathematical component, input/output data structures, and operational boundaries.
          </p>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PRD_PIPELINE_STEPS.map((step, idx) => {
            const isSelected = selectedStepIndex === idx;
            return (
              <button
                key={step.stepNumber}
                onClick={() => setSelectedStepIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/40 text-white'
                    : 'bg-stone-850/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    0{step.stepNumber}
                  </span>
                  <div className="text-xs font-bold mt-1 text-white leading-tight">
                    {step.name}
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-stone-400 truncate">
                  {step.type.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Stage Deep-Dive Card */}
        <div className="bg-stone-850 border border-stone-800 rounded-xl p-5 mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                STAGE {currentStep.stepNumber} OF 8
              </span>
              <h4 className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
                {currentStep.name}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono">
                  {currentStep.type}
                </span>
              </h4>
            </div>

            <div className="text-xs text-stone-400">
              Technology: <span className="text-emerald-300 font-mono font-semibold">{currentStep.component}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Functional Operation:
                </span>
                <p className="text-stone-200 leading-relaxed mt-1 text-xs sm:text-sm font-normal">
                  {currentStep.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Known Limitations & Boundary Constraints:
                </span>
                <p className="text-stone-300 mt-1 leading-relaxed">
                  {currentStep.limitations}
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-stone-900/80 border border-stone-800 rounded-xl p-4">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Internal Architectural Contract:
              </span>
              
              {currentStep.stepNumber === 1 && (
                <div className="font-mono text-[11px] text-stone-300 space-y-1">
                  <div>Input: Browser Audio Stream (44.1/48kHz WebM/WAV)</div>
                  <div>Output: Signed S3 Upload Target (random UUID key)</div>
                  <div>Latency budget: &lt; 200ms connection</div>
                </div>
              )}

              {currentStep.stepNumber === 2 && (
                <div className="font-mono text-[11px] text-stone-300 space-y-1">
                  <div>Sampling: 16,000 Hz, 16-bit Mono PCM</div>
                  <div>Gate Checks: VAD speech present, SNR &gt; 12 dB, Clipping &lt; 1%</div>
                  <div>Action on Fail: Return retry hint; ZERO inference executed</div>
                </div>
              )}

              {currentStep.stepNumber === 3 && (
                <div className="font-mono text-[11px] text-stone-300 space-y-1">
                  <div>Input: Devanagari target string (e.g., "कमल")</div>
                  <div>Output: Canonical phonemes [/k/, /m/, /l/] + acceptable variants</div>
                  <div>Validation: Curated & vetted by licensed Indian SLP</div>
                </div>
              )}

              {currentStep.stepNumber === 4 && (
                <div className="font-mono text-[11px] text-stone-300 space-y-1">
                  <div>Architecture: CNN feature extractor + 12 Transformer layers</div>
                  <div>Loss: Connectionist Temporal Classification (CTC)</div>
                  <div>Adaptation: 2-stage fine-tuning (Adult Hindi -&gt; Consented Child data)</div>
                </div>
              )}

              {currentStep.stepNumber === 5 && (
                <div className="font-mono text-[11px] text-stone-300 space-y-1">
                  <div>Formula: GOP(p) = (1/T) * log( P(O|p) / sum(P(O|q)) )</div>
                  <div>Alignment: Frame-by-frame Viterbi dynamic time warping</div>
                  <div>Output: Continuous log-likelihood match score per expected sound</div>
                </div>
              )}

              {currentStep.stepNumber === 6 && (
                <div className="font-mono text-[11px] text-stone-300 space-y-1">
                  <div>Algorithm: Feature-weighted Levenshtein distance matrix</div>
                  <div>Threshold Gating: GOP &lt; threshold -&gt; Flag "Possible Distortion"</div>
                  <div>Confidence Gating: c &lt; 0.60 -&gt; Label "Inconclusive" (excluded from Twin)</div>
                </div>
              )}

              {currentStep.stepNumber === 7 && (
                <div className="font-mono text-[11px] text-stone-300 space-y-1">
                  <div>Formula: mastery = (1 - alpha*c)*mastery + alpha*c*s</div>
                  <div>Persistence: JSONB vector snapshot stored in PostgreSQL</div>
                  <div>Overrides: Therapist manual label overrides stored separately</div>
                </div>
              )}

              {currentStep.stepNumber === 8 && (
                <div className="font-mono text-[11px] text-stone-300 space-y-1">
                  <div>Plan Selection: Warm-up -&gt; Focus Sounds -&gt; Game Mode -&gt; Review</div>
                  <div>Precedence: Therapist assignments take #1 priority</div>
                  <div>Explainability: Every item includes human-readable reason string</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decision Ownership & Error Taxonomy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decision Ownership Table */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              Decision Ownership Matrix (§10.3)
            </h3>
            <span className="text-xs text-stone-500 font-mono">PR-01 & PR-02</span>
          </div>
          <p className="text-xs text-stone-400 mb-3">
            Clear delineation of authority: AI handles signal posteriors; deterministic rules manage scaffolding; human SLP owns clinical judgement.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="pb-2">Decision Point</th>
                  <th className="pb-2 text-center">AI / ML</th>
                  <th className="pb-2 text-center">Rules</th>
                  <th className="pb-2 text-right">Human SLP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                {decisionOwnership.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-850/40">
                    <td className="py-2.5 font-medium text-stone-200">{row.decision}</td>
                    <td className="py-2.5 text-center text-emerald-400 font-medium">{row.ai}</td>
                    <td className="py-2.5 text-center text-teal-400 font-medium">{row.rules}</td>
                    <td className="py-2.5 text-right text-sky-400 font-medium">{row.human}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Phoneme Error Taxonomy */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                Misarticulation Classification Taxonomy (§12)
              </h3>
              <span className="text-xs text-stone-500 font-mono">M-10 Spec</span>
            </div>
            <p className="text-xs text-stone-400 mb-4">
              Standard phonological error classifications and their exact automated handling under AarogyaSpeech AI.
            </p>

            <div className="space-y-3">
              {errorTaxonomy.map((err) => (
                <div key={err.type} className="p-3 rounded-xl bg-stone-850/80 border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${err.statusColor}`}>
                        {err.type}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {err.exampleHindi}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 pt-1 font-medium">{err.definition}</p>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    <strong className="text-stone-300">Logic:</strong> {err.detectionLogic}
                  </p>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    <strong className="text-stone-300">Handling:</strong> {err.mvpHandling}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Model Evaluation & Scientific Rigor */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Model Evaluation Protocol & Decision Gate (§26.2)
          </h3>
          <span className="text-xs text-stone-400 font-mono">Held-Out Child Splits</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-300">
          <div className="p-3.5 rounded-xl bg-stone-850 border border-stone-800 space-y-1.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-300">
              1. Child-Level Split Isolation
            </h4>
            <p className="text-stone-400 leading-relaxed">
              Splits are strictly partitioned by <strong>unique child ID</strong>, never by individual recording. The test split is frozen untouched during all hyperparameter tuning. Includes typical-speech children to measure false rejection.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-850 border border-stone-800 space-y-1.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-300">
              2. Asymmetric Error Cost Penalty
            </h4>
            <p className="text-stone-400 leading-relaxed">
              <strong>False Rejections (FRR)</strong>—penalizing a child who pronounced correctly—are mathematically weighted far more severely than false acceptances to protect child motivation and self-esteem.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-850 border border-stone-800 space-y-1.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-300">
              3. Reduced-Claims Fallback Gate
            </h4>
            <p className="text-stone-400 leading-relaxed">
              If held-out phoneme F1 fails the acceptance gate (&sect;26.2), the system automatically degrades to <strong>reduced-claims mode</strong>: word-attempt verification only, restricting phoneme feedback to high-accuracy subsets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
