import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, MainNavView } from './components/navigation/Navbar';
import { Sidebar } from './components/navigation/Sidebar';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPageView } from './components/public/LandingPageView';
import { ChildDashboardView } from './components/child/ChildDashboardView';
import { PracticeArenaView } from './components/practice/PracticeArenaView';
import { CourseSystemView } from './components/courses/CourseSystemView';
import { AIConversationView } from './components/conversation/AIConversationView';
import { AssessmentFlowView } from './components/assessment/AssessmentFlowView';
import { ProgressAnalyticsView } from './components/analytics/ProgressAnalyticsView';
import { ParentDashboardView } from './components/parent/ParentDashboardView';
import { TherapistDashboardView } from './components/therapist/TherapistDashboardView';
import { CommunityForumView } from './components/community/CommunityForumView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { PRDExplorerView } from './components/prd/PRDExplorerView';
import { GlobalVoiceCommander } from './components/voice/GlobalVoiceCommander';
import { ShieldAlert, Heart, Sparkles } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<MainNavView>('home');
  const { activeRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar with multi-role support */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Layout with Left Sidebar and Main Content */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar on desktop */}
        <div className="hidden lg:block">
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        </div>

        {/* Main Content Area based on current view */}
        <main className="flex-1 min-w-0 w-full">
          {currentView === 'home' && <LandingPageView setCurrentView={setCurrentView} />}
          {currentView === 'child_dashboard' && <ChildDashboardView setCurrentView={setCurrentView} />}
          {currentView === 'practice_arena' && <PracticeArenaView />}
          {currentView === 'courses' && <CourseSystemView setCurrentView={setCurrentView} />}
          {currentView === 'ai_conversation' && <AIConversationView />}
          {currentView === 'assessment' && <AssessmentFlowView setCurrentView={setCurrentView} />}
          {currentView === 'analytics' && <ProgressAnalyticsView />}
          {currentView === 'parent_portal' && <ParentDashboardView setCurrentView={setCurrentView} />}
          {currentView === 'therapist_portal' && <TherapistDashboardView />}
          {currentView === 'community' && <CommunityForumView />}
          {currentView === 'admin_portal' && <AdminDashboardView />}
          {currentView === 'prd_specs' && <PRDExplorerView />}
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal />

      {/* Global Voice Command Listener (Web Speech API) */}
      <GlobalVoiceCommander currentView={currentView} setCurrentView={setCurrentView} />

      {/* Persistent PR-02 Non-Diagnostic Medical Disclaimer & Compliance Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white text-xs text-slate-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          {/* Medical Disclaimer Callout */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start space-x-3 text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-amber-950 font-bold">Binding Regulatory Disclaimer (PR-02 & PR-07):</strong> AarogyaSpeech AI is an educational home speech practice companion designed with a certified therapist-in-the-loop workflow. It strictly does not provide medical diagnosis, clinical classification of speech disorders, or severity grading. The application does not replace Speech-Language Pathologists (SLPs). Child audio recordings are protected under a 24-hour default retention lifecycle with granular, revocable parental consent under the Digital Personal Data Protection (DPDP) Act 2023.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700">AarogyaSpeech AI</span>
              <span>·</span>
              <span>Pediatric Speech Therapy Companion</span>
              <span>·</span>
              <span>DPDP Act 2023 & RCI Supervised</span>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setCurrentView('prd_specs')} className="hover:text-emerald-700 font-semibold underline">
                PRD Specifications & Metrics
              </button>
              <span>·</span>
              <span>Designed for Hindi-speaking children (ages 5–12)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
