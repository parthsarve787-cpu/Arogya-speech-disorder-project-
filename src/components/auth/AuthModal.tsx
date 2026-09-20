import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { X, ShieldCheck, Sparkles, Lock, Mail, User as UserIcon, AlertCircle, LogOut, CheckCircle2, ChevronRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    signup,
    loginWithGoogle,
    currentUser,
    isLoggedIn,
    logout
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [childAge, setChildAge] = useState(6);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      if (authModalMode === 'login') {
        await login(email, role, password);
      } else {
        await signup(name, email, role, childAge, password);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle(role);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google sign in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAuthModalOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => setAuthModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Prominent Cross Close Button (Band karne ke liye) */}
        <button
          type="button"
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          aria-label="Close modal"
          title="Close (Exit modal)"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AarogyaSpeech AI</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {isLoggedIn ? 'Account Profile' : authModalMode === 'login' ? 'Sign In / Log In' : 'Create an Account'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {isLoggedIn ? 'Manage your connected profile and speech workspace' : 'Save speech practice progress, phonetic digital twins, and clinical logs'}
          </p>
        </div>

        {/* If Already Logged In: Show Profile Section & Logout Option */}
        {isLoggedIn ? (
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300/60 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                {currentUser.avatar || '👤'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-sm font-black text-slate-900 truncate">{currentUser.name}</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  Role: {currentUser.role}
                </div>
              </div>
            </div>

            {/* Profile Information details */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-600">
                <span>Account Status:</span>
                <span className="font-bold text-emerald-600 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active & Verified</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Cloud Storage:</span>
                <span className="font-semibold text-slate-800">Firebase Firestore</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Data Privacy:</span>
                <span className="font-semibold text-slate-800">DPDP Act 2023 Compliant</span>
              </div>
            </div>

            {/* Switch Account or Logout buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setAuthModalMode('login');
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-98 shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login / Sign In to Another Account</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-700 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out of Account</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="w-full py-2 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Primary Toggle: Log In / Sign Up */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => { setAuthModalMode('login'); setErrorMessage(null); }}
                className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                  authModalMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Log In / Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthModalMode('signup'); setErrorMessage(null); }}
                className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                  authModalMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {authModalMode === 'signup' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name:</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma / Dr. Neha Verma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    />
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address:</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password:</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Your Role:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'parent', label: 'Parent / Guardian', icon: '👩' },
                    { id: 'child', label: 'Child Learner', icon: '👦' },
                    { id: 'therapist', label: 'Speech Pathologist (SLP)', icon: '👩‍⚕️' },
                    { id: 'admin', label: 'System Admin', icon: '🛡️' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRole(r.id as UserRole)}
                      className={`p-2 rounded-xl border flex items-center space-x-2 text-left transition-all ${
                        role === r.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm">{r.icon}</span>
                      <span className="text-xs">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {authModalMode === 'signup' && (role === 'child' || role === 'parent') && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Child Age:</span>
                    <span className="text-emerald-700">{childAge} years old</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="12"
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>5 yrs (Beginner)</span>
                    <span>8 yrs</span>
                    <span>12 yrs (Advanced)</span>
                  </div>
                </div>
              )}

              {/* Main Action Submit Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md shadow-emerald-600/25 transition-all active:scale-98 disabled:opacity-60"
              >
                {loading ? 'Verifying...' : authModalMode === 'login' ? 'Sign In / Log In' : 'Create Account'}
              </button>
            </form>

            {/* Other Options Divider */}
            <div className="relative flex py-0.5 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="shrink mx-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider">Other Option</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Continue with Google Option */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-2.5 px-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center space-x-3 shadow-xs transition-all active:scale-98 hover:border-slate-400 disabled:opacity-60"
              >
                {googleLoading ? (
                  <span className="text-xs">Connecting to Google...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Or explore with 1-click test profiles:</span>
              <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={() => { login('aarav@aarogyaspeech.ai', 'child'); }}
                  className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="text-[11px] font-bold text-slate-900">👦 Aarav (Child)</div>
                  <div className="text-[10px] text-slate-500">7 yr old, /k/ practice</div>
                </button>
                <button
                  type="button"
                  onClick={() => { login('priya@aarogyaspeech.ai', 'parent'); }}
                  className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="text-[11px] font-bold text-slate-900">👩 Priya (Parent)</div>
                  <div className="text-[10px] text-slate-500">Mother of Aarav</div>
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected Speech Data · DPDP Act 2023 · Firebase Firestore Cloud</span>
        </div>
      </div>
    </div>
  );
};
