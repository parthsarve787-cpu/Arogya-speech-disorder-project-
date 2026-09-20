import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  Play, 
  Bot, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Volume2 
} from 'lucide-react';
import { fetchDigitalTwin } from '../../services/api';
import { DigitalTwinProfile } from '../../../server/db';
import { MainNavView } from '../navigation/Navbar';

interface ChildDashboardProps {
  setCurrentView: (view: MainNavView) => void;
}

export const ChildDashboardView: React.FC<ChildDashboardProps> = ({ setCurrentView }) => {
  const { currentChild } = useAuth();
  const [twin, setTwin] = useState<DigitalTwinProfile | null>(null);

  useEffect(() => {
    fetchDigitalTwin(currentChild.id).then(setTwin).catch(() => {});
  }, [currentChild.id]);

  const soundGardenItems = [
    { phoneme: 'क', roman: '/k/', plant: 'कमल का फूल (Lotus)', stage: 'Sprouting 🌱', mastery: 65, color: 'text-emerald-600 bg-emerald-50' },
    { phoneme: 'प', roman: '/p/', plant: 'पौधा (Mint Leaf)', stage: 'Full Bloom 🌸', mastery: 92, color: 'text-teal-600 bg-teal-50' },
    { phoneme: 'त', roman: '/t/', plant: 'तुलसी (Tulsi Herb)', stage: 'Budding 🌿', mastery: 84, color: 'text-amber-600 bg-amber-50' },
    { phoneme: 'स', roman: '/s/', plant: 'सूरजमुखी (Sunflower)', stage: 'Sprouting 🌱', mastery: 58, color: 'text-rose-600 bg-rose-50' },
    { phoneme: 'ब', roman: '/b/', plant: 'बरगद (Banyan Sapling)', stage: 'Full Bloom 🌸', mastery: 88, color: 'text-sky-600 bg-sky-50' },
    { phoneme: 'श', roman: '/ʃ/', plant: 'शीशम (Shisham Tree)', stage: 'Budding 🌿', mastery: 70, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Welcome Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative sound circles */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 rounded-full bg-white/10 pointer-events-none blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Today's Speech Journey · 10-Minute Daily Goal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back, {currentChild.name.split(' ')[0]}! 🌟
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Your Sound Garden has 2 new blossoms ready to bloom. Practice your sounds today to maintain your 5-day streak!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('practice_arena')}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all hover:scale-102"
            >
              <Play className="w-4 h-4 fill-emerald-800 text-emerald-800" />
              <span>Start Today's Practice</span>
            </button>

            <button
              onClick={() => setCurrentView('ai_conversation')}
              className="px-5 py-3 rounded-2xl bg-emerald-800/60 hover:bg-emerald-800 text-white border border-emerald-400/40 font-bold text-xs sm:text-sm flex items-center space-x-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Chat with Mitri</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gamification Metric Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Streak */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Practice Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {currentChild.streakDays} Days
          </div>
          <div className="text-[11px] font-bold text-amber-600">On Fire! Keep it going 🔥</div>
        </div>

        {/* Metric 2: Total XP */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Total Stars / XP</span>
            <Trophy className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {currentChild.totalXp} XP
          </div>
          <div className="text-[11px] font-bold text-emerald-600">+120 XP today</div>
        </div>

        {/* Metric 3: Today's Time */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Daily Screen Time</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            11 / 15 min
          </div>
          <div className="text-[11px] font-bold text-teal-600">4 min remaining</div>
        </div>

        {/* Metric 4: Mastery Level */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Current Level</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            Word Level
          </div>
          <div className="text-[11px] font-bold text-indigo-600">Moving to Short Phrases</div>
        </div>
      </div>

      {/* Sound Garden Interactive Grid (ध्वनि बगीचा) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1 text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              <span>🌱 Interactive Gamification</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">The Sound Garden (ध्वनि बगीचा)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Practice correctly to help each phonetic plant grow into full bloom.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {soundGardenItems.map((item) => (
            <div
              key={item.phoneme}
              onClick={() => setCurrentView('practice_arena')}
              className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/30 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-black text-slate-900 group-hover:scale-110 transition-transform">
                    {item.phoneme}
                  </span>
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-500">{item.roman}</div>
                    <div className="text-xs font-bold text-slate-800">{item.plant}</div>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  {item.stage}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>Articulation Mastery</span>
                  <span className="text-emerald-700 font-bold">{item.mastery}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.mastery}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Daily Practice Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => setCurrentView('courses')}
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 cursor-pointer shadow-xs hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Course Module</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            Velar Consonants & Tongue Placement
          </h3>
          <p className="text-xs text-slate-600">
            Step-by-step guidance on placing the back of your tongue against the soft palate for /k/ and /g/ sounds.
          </p>
        </div>

        <div 
          onClick={() => setCurrentView('assessment')}
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-400 cursor-pointer shadow-xs hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Clinical Screening</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
            5-Minute Speech Baseline Checkup
          </h3>
          <p className="text-xs text-slate-600">
            A quick standardized test across 6 core Hindi phonemes to update your child speech profile.
          </p>
        </div>
      </div>

    </div>
  );
};
