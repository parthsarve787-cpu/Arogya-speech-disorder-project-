import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Activity, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  FileEdit, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { 
  fetchTherapistDashboard, 
  submitTherapistOverride, 
  addTherapistNote, 
  prescribeHomework 
} from '../../services/api';

export const TherapistDashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [overrideModalResult, setOverrideModalResult] = useState<any>(null);
  const [overrideLabel, setOverrideLabel] = useState('Fronting /k/ -> [t]');
  const [slpNote, setSlpNote] = useState('');
  const [newClinicalNote, setNewClinicalNote] = useState('');
  const [newHomeworkInstructions, setNewHomeworkInstructions] = useState('');

  const loadData = () => {
    fetchTherapistDashboard('th_1')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyOverride = async () => {
    if (!overrideModalResult) return;
    await submitTherapistOverride(overrideModalResult.id, overrideLabel, slpNote);
    setOverrideModalResult(null);
    setSlpNote('');
    loadData();
  };

  const handleAddNote = async () => {
    if (!newClinicalNote.trim()) return;
    await addTherapistNote('th_1', 'ch_1', newClinicalNote);
    setNewClinicalNote('');
    loadData();
  };

  const handlePrescribeHomework = async () => {
    if (!newHomeworkInstructions.trim()) return;
    await prescribeHomework('th_1', 'ch_1', 'k', newHomeworkInstructions);
    setNewHomeworkInstructions('');
    loadData();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Header in English */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200 mb-1">
          <Activity className="w-3.5 h-3.5 text-sky-600" />
          <span>Clinical SLP Caseload & Tele-Rehabilitation Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Dr. Neha Verma — Patient Caseload & AI Audit Review
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          RCI Registration: RCI-SLP-78249 · Apex Pediatric Speech Centre
        </p>
      </div>

      {/* Patient Caseload Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-2xl">
              👦
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Aarav Sharma</h2>
              <div className="text-xs text-slate-500 font-medium">
                7 Years Old · Standard Khariboli Hindi · 5-Day Active Streak
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              Active Tele-Practice
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-semibold">Diagnostic Classification:</span>
            <div className="font-bold text-slate-900 mt-0.5">Functional Misarticulation (Velar Fronting)</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-semibold">Average GOP Score:</span>
            <div className="font-bold text-emerald-700 font-mono mt-0.5">0.78 (Stable Baseline)</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-semibold">Current Practice Ladder:</span>
            <div className="font-bold text-sky-700 mt-0.5">Minimal Pair Contrast (/k/ vs /t/)</div>
          </div>
        </div>
      </div>

      {/* Recent Speech Analysis Sessions & Label Override */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Speech Sessions & Clinical Override Logs
            </h3>
            <p className="text-xs text-slate-500">Therapist-in-the-Loop Oversight Mandate (PR-01)</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            Audit Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 text-[11px] text-slate-500 uppercase font-bold">
              <tr>
                <th className="py-3 px-3">Target Word</th>
                <th className="py-3 px-3">Position</th>
                <th className="py-3 px-3">AI Diagnostic Label</th>
                <th className="py-3 px-3">GOP Score</th>
                <th className="py-3 px-3">SLP Clinical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(data?.recentAnalyses || []).map((analysis: any) => (
                <tr key={analysis.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{analysis.targetWord}</td>
                  <td className="py-3 px-3 text-slate-600 capitalize">{analysis.position}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        analysis.isMatch
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {analysis.errorType || 'Accurate'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-700 font-bold">{analysis.gopScore.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    {analysis.overriddenByTherapist ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                        ✓ {analysis.therapistOverrideLabel}
                      </span>
                    ) : (
                      <button
                        onClick={() => setOverrideModalResult(analysis)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-bold flex items-center space-x-1 transition-colors"
                      >
                        <FileEdit className="w-3 h-3 text-sky-600" />
                        <span>Override Label</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Homework & Clinical Notes Prescriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Homework Prescriber */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Prescribe Practice Homework</h3>
          <textarea
            value={newHomeworkInstructions}
            onChange={(e) => setNewHomeworkInstructions(e.target.value)}
            placeholder="e.g., Practice minimal pair 'कमल vs तमल' 5 times daily before dinner..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={handlePrescribeHomework}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Homework to Parent Portal</span>
          </button>
        </div>

        {/* Private Clinical Notes */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Confidential SLP Clinical Notes</h3>
          <textarea
            value={newClinicalNote}
            onChange={(e) => setNewClinicalNote(e.target.value)}
            placeholder="Record private clinical notes on tongue posture, patient motivation, and fatigue..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={handleAddNote}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Private Clinical Note</span>
          </button>
        </div>
      </div>

      {/* Override Modal */}
      {overrideModalResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Clinical Label Override — {overrideModalResult.targetWord}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Supervise AI acoustic inference with your certified clinical diagnosis as a Speech-Language Pathologist.
            </p>

            <div>
              <label className="block text-slate-700 text-xs font-bold mb-1">New Clinical Label:</label>
              <select
                value={overrideLabel}
                onChange={(e) => setOverrideLabel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium"
              >
                <option value="Fronting /k/ -> [t]">Velar Fronting /k/ → [t]</option>
                <option value="Interdental Lisping">Interdental Lisping</option>
                <option value="Normal Developmental Variation">Normal Developmental Variation</option>
                <option value="Acoustic Imprecision Only">Acoustic Imprecision Only (Distortion)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold mb-1">Clinical Rationale:</label>
              <input
                type="text"
                value={slpNote}
                onChange={(e) => setSlpNote(e.target.value)}
                placeholder="e.g., Tongue anchor stable, keep minimal pair practice ongoing..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleApplyOverride}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-2xs"
              >
                Save Clinical Override
              </button>
              <button
                onClick={() => setOverrideModalResult(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
