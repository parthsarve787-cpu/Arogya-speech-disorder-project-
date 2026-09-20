import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';
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
  Menu, 
  X, 
  LogIn,
  User as UserIcon,
  LogOut
} from 'lucide-react';

export type MainNavView = 
  | 'home'
  | 'child_dashboard'
  | 'practice_arena'
  | 'courses'
  | 'ai_conversation'
  | 'assessment'
  | 'parent_portal'
  | 'analytics'
  | 'community'
  | 'therapist_portal'
  | 'admin_portal'
  | 'prd_specs';

interface NavbarProps {
  currentView: MainNavView;
  setCurrentView: (view: MainNavView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { 
    setAuthModalOpen, 
    setAuthModalMode,
    isLoggedIn,
    logout
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Feature navigation items
  const primaryNavItems: { id: MainNavView; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'child_dashboard', label: 'Sound Garden', icon: Sparkles },
    { id: 'practice_arena', label: 'Practice Arena', icon: Mic },
    { id: 'courses', label: 'Curriculum', icon: BookOpen },
    { id: 'ai_conversation', label: 'Mitri AI Buddy', icon: Bot },
    { id: 'assessment', label: 'Assessment', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'parent_portal', label: 'Parent Portal', icon: ShieldCheck },
    { id: 'therapist_portal', label: 'SLP Caseload', icon: Stethoscope },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'prd_specs', label: 'PRD Specs', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left Side: Pure Brand Logo */}
          <div 
            onClick={() => setCurrentView('home')}
            className="cursor-pointer"
          >
            <BrandLogo size="md" />
          </div>

          {/* Right Action Bar: Direct Login / Signup (Always accessible to everyone) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs transition-all active:scale-95 flex items-center space-x-1.5"
                  title="Account Settings"
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Account</span>
                </button>

                <button
                  onClick={async () => {
                    await logout();
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200 transition-all flex items-center space-x-1"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all active:scale-95 flex items-center space-x-1.5"
                title="Login / Signup"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / Signup</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-1 animate-fadeIn">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile Auth Button */}
            <div className="pt-3 mt-2 border-t border-slate-200 px-2 space-y-2">
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center justify-center space-x-2 shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>{isLoggedIn ? 'Account' : 'Login / Signup'}</span>
              </button>

              {isLoggedIn && (
                <button
                  onClick={async () => {
                    await logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
