import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Clock, 
  UserCheck, 
  AlertOctagon, 
  CheckCircle2, 
  Key, 
  FileText, 
  Eye, 
  Filter
} from 'lucide-react';
import { 
  PRD_RBAC, 
  PRD_SECURITY_SPECS, 
  PRD_SAFETY_SPECS 
} from '../data/prdData';

export const SecurityPrivacyView: React.FC = () => {
  const [subTab, setSubTab] = useState<'lifecycle' | 'rbac' | 'sec_specs' | 'saf_specs'>('lifecycle');

  const lifecycleSteps = [
    { step: '1. Consent Check', desc: 'Hardware recording APIs and upload endpoints are strictly locked until verified parental consent is active.', icon: Key, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' },
    { step: '2. Scoped Capture', desc: 'Audio captured only during active exercise; background recording and webcam activation are permanently blocked.', icon: Clock, color: 'text-teal-400 border-teal-500/40 bg-teal-950/40' },
    { step: '3. Signed Upload', desc: 'Direct upload over TLS 1.3 to private storage using short-lived signed URLs with random UUID keys.', icon: Lock, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' },
    { step: '4. File Validation', desc: 'Strict server-side checks: magic-byte inspection, max 10s duration, audio MIME type validation.', icon: ShieldCheck, color: 'text-blue-400 border-blue-500/40 bg-blue-950/40' },
    { step: '5. Ephemeral Worker', desc: 'Decoded audio processed in isolated sandbox; temporary worker copies wiped immediately upon completion.', icon: UserCheck, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40' },
    { step: '6. Derived Vectors Only', desc: 'Only acoustic logits, phoneme scores, and error flags stored. Zero voiceprints or biometric embeddings.', icon: FileText, color: 'text-purple-400 border-purple-500/40 bg-purple-950/40' },
    { step: '7. 24-Hour TTL Expiry', desc: 'Default policy: raw audio deleted within 24 hours of analysis. Long-term audio storage requires explicit parent opt-in.', icon: Clock, color: 'text-amber-400 border-amber-500/40 bg-amber-950/40' },
    { step: '8. Hard Deletion & Audit', desc: 'Scheduled verification job purges expired files; parent one-tap deletion triggers instant cascade.', icon: Trash2, color: 'text-rose-400 border-rose-500/40 bg-rose-950/40' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>§20 & §18 Security, Child Data Privacy & Safety Specifications</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Child Privacy Architecture & RBAC Governance
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Designed around data minimization, verifiable parental consent, ephemeral voice processing, and a strict 24-hour default raw audio retention window. Zero voiceprints or biometric speaker embeddings are ever generated.
            </p>
          </div>

          <div className="bg-stone-850 border border-stone-800 p-3 rounded-xl text-xs space-y-1 shrink-0">
            <span className="text-[11px] font-mono text-stone-400">Audio Retention Window:</span>
            <div className="text-amber-400 font-bold font-mono">24 Hours (Default TTL)</div>
            <div className="text-[10px] text-stone-400">Enforced by automated cleanup cron</div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center space-x-1 bg-stone-900 p-1.5 rounded-xl border border-stone-800 overflow-x-auto">
        {[
          { id: 'lifecycle', label: '8-Step Voice Recording Lifecycle' },
          { id: 'rbac', label: 'Role-Based Access Matrix (RBAC)' },
          { id: 'sec_specs', label: '14 Security Requirements (SEC)' },
          { id: 'saf_specs', label: '11 Child Safety Rules (SAF)' },
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

      {/* SUB-VIEW 1: Voice Recording Lifecycle */}
      {subTab === 'lifecycle' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                The 8-Stage Voice Data Lifecycle (§20.2)
              </h3>
              <p className="text-xs text-stone-400">
                End-to-end protection from in-browser microphone activation to hard deletion.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {lifecycleSteps.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${item.color} flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-white">
                          STEP 0{idx + 1}
                        </span>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1.5">{item.step}</h4>
                      <p className="text-xs text-stone-300 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legal and Regulatory Compliance Notice */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start space-x-3">
              <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Compliance & Regulatory Posture Note (§20.5 & NG-10)
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  No legal or regulatory compliance claims are asserted prior to formal pilot legal verification. The architecture proactively implements strict technical data-protection principles (purpose limitation, data minimization, verifiable parental consent, audit trails, and automatic deletion) to align with India’s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and minor data governance standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: RBAC Matrix */}
      {subTab === 'rbac' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-stone-800">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Role-Based Access Control (RBAC) Permission Matrix (§6)
            </h3>
            <p className="text-xs text-stone-400">
              Server-side authorization enforced default-deny with object-level checks on every endpoint.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-850 text-stone-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="p-3.5">Protected Resource</th>
                  <th className="p-3.5 text-emerald-400">Child</th>
                  <th className="p-3.5 text-teal-400">Parent</th>
                  <th className="p-3.5 text-sky-400">Therapist (SLP)</th>
                  <th className="p-3.5 text-purple-400">Administrator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 text-stone-300">
                {PRD_RBAC.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-850/50">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <Lock className="w-3 h-3 text-stone-500" />
                      {row.resource}
                    </td>
                    <td className="p-3.5 text-stone-300">
                      <span className="px-2 py-0.5 rounded bg-stone-800 text-[11px]">
                        {row.child}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-300">
                      <span className="px-2 py-0.5 rounded bg-teal-950/40 text-teal-300 border border-teal-800/40 text-[11px]">
                        {row.parent}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-300">
                      <span className="px-2 py-0.5 rounded bg-sky-950/40 text-sky-300 border border-sky-800/40 text-[11px]">
                        {row.therapist}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-300">
                      <span className="px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40 text-[11px]">
                        {row.admin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Security Specifications (SEC-01 to SEC-14) */}
      {subTab === 'sec_specs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRD_SECURITY_SPECS.map((sec) => (
            <div
              key={sec.id}
              className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {sec.id}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    {sec.area}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
                  {sec.requirement}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-VIEW 4: Child Community Safety Rules (SAF-01 to SAF-11) */}
      {subTab === 'saf_specs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRD_SAFETY_SPECS.map((saf) => (
            <div
              key={saf.id}
              className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                    {saf.id}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {saf.title}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
                  {saf.requirement}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
