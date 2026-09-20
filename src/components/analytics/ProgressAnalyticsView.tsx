import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Cpu 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { fetchDigitalTwin } from '../../services/api';
import { DigitalTwinProfile } from '../../../server/db';

export const ProgressAnalyticsView: React.FC = () => {
  const { currentChild } = useAuth();
  const [twin, setTwin] = useState<DigitalTwinProfile | null>(null);

  useEffect(() => {
    fetchDigitalTwin(currentChild.id).then(setTwin).catch(() => {});
  }, [currentChild.id]);

  const weeklyPracticeData = [
    { day: 'Mon', minutes: 12, accuracy: 72 },
    { day: 'Tue', minutes: 15, accuracy: 78 },
    { day: 'Wed', minutes: 14, accuracy: 80 },
    { day: 'Thu', minutes: 10, accuracy: 74 },
    { day: 'Fri', minutes: 16, accuracy: 85 },
    { day: 'Sat', minutes: 15, accuracy: 88 },
    { day: 'Sun', minutes: 11, accuracy: 82 },
  ];

  const phonemeRadarData = twin
    ? Object.values(twin.phonemes).map((p) => ({
        subject: `${p.symbolHindi} (/${p.phoneme}/)`,
        mastery: Math.round(p.overallMastery * 100),
        target: 85,
      }))
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Header in English */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 mb-1">
          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bayesian Phonetic Speech Twin (§22 PRD)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Longitudinal Articulation & Progress Analytics
        </h1>
      </div>

      {/* Top 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Overall Articulation Mastery</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700">
            {twin ? Math.round(twin.overallMasteryScore * 100) : 72}%
          </div>
          <p className="text-[11px] font-bold text-emerald-600">+9% improvement over past week</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Difficulty Ladder Level</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{twin?.currentDifficultyLadder || 'Word'} Level</div>
          <p className="text-[11px] text-slate-500">Graduating from words to short carrier phrases</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Frustration Circuit Breaker</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-teal-700">
            {twin ? (twin.frustrationScore * 100).toFixed(0) : '15'}%
          </div>
          <p className="text-[11px] font-bold text-teal-600">&lt; 60% safe threshold (positive engagement)</p>
        </div>
      </div>

      {/* Dual Charts: Radar Mastery & Weekly Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Phonetic Mastery Spectrum (Radar Distribution)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={phonemeRadarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar name="Aarav's Mastery" dataKey="mastery" stroke="#059669" fill="#10b981" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Minutes Bar Chart */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Daily Practice Duration (Consistency)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPracticeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="minutes" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Granular Phoneme Breakdown Matrix */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Positional Articulation Breakdown Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 text-[11px] text-slate-500 uppercase font-bold">
              <tr>
                <th className="py-3 px-3">Phoneme</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Initial</th>
                <th className="py-3 px-3">Medial</th>
                <th className="py-3 px-3">Final</th>
                <th className="py-3 px-3">Overall</th>
                <th className="py-3 px-3">Clinical Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {twin &&
                Object.values(twin.phonemes).map((p) => (
                  <tr key={p.phoneme} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center space-x-2">
                      <span className="text-base">{p.symbolHindi}</span>
                      <span className="font-mono text-slate-500 font-normal">/{p.phoneme}/</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{p.category}</td>
                    <td className="py-3 px-3 font-mono">{Math.round(p.initialMastery * 100)}%</td>
                    <td className="py-3 px-3 font-mono">{Math.round(p.medialMastery * 100)}%</td>
                    <td className="py-3 px-3 font-mono">{Math.round(p.finalMastery * 100)}%</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      {Math.round(p.overallMastery * 100)}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Mastered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'In Progress'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
