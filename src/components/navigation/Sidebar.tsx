import React, { useState } from 'react';
import { MainNavView } from './Navbar';
import { 
  Home,
  Sparkles, 
  Mic, 
  BookOpen, 
  Bot, 
  Compass, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Stethoscope, 
  FileText, 
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  currentView: MainNavView;
  setCurrentView: (view: MainNavView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Existing navigation items in exact order
  const primaryNavItems: { id: MainNavView; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'child_dashboard', label: 'Sound Garden', icon: Sparkles },
    { id: 'practice_arena', label: 'Practice Arena', icon: Mic },
    { id: 'courses', label: 'Curriculum', icon: BookOpen },
    { id: 'ai_conversation', label: 'Mitri AI Buddy', icon: Bot },
    { id: 'assessment', label: 'Assessment', icon: Compass },
  ];

  const moreNavItems: { id: MainNavView; label: string; icon: React.ElementType }[] = [
    { id: 'assessment', label: 'Phonetic Assessment', icon: Compass },
    { id: 'analytics', label: 'Speech Twin Analytics', icon: BarChart3 },
    { id: 'parent_portal', label: 'Parent Portal', icon: ShieldCheck },
    { id: 'therapist_portal', label: 'SLP Caseload (Therapist)', icon: Stethoscope },
    { id: 'community', label: 'Community Forum', icon: Users },
    { id: 'prd_specs', label: 'PRD Specifications Matrix', icon: FileText },
  ];

  const isMoreActive = ['analytics', 'parent_portal', 'therapist_portal', 'community', 'prd_specs'].includes(currentView);

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between">
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
          Navigation
        </div>

        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* More dropdown / expandable accordion */}
        <div className="pt-1">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
              isMoreActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-4 flex items-center justify-center text-slate-500 font-bold">•</span>
              <span>More</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${roleMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {roleMenuOpen && (
            <div className="mt-1 pl-3 space-y-1 border-l-2 border-slate-100 ml-3">
              {moreNavItems.map((portal) => {
                const PIcon = portal.icon;
                const isActive = currentView === portal.id;
                return (
                  <button
                    key={portal.id}
                    onClick={() => setCurrentView(portal.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <PIcon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="truncate">{portal.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 px-2">
        AarogyaSpeech Companion
      </div>
    </aside>
  );
};
