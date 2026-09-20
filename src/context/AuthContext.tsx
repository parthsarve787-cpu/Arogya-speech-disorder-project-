import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ChildProfile } from '../../server/db';
import { loginUser, signupUser } from '../services/api';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db as firestoreDb } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export type UserRole = 'child' | 'parent' | 'therapist' | 'admin';

interface AuthContextType {
  currentUser: User;
  currentChild: ChildProfile;
  activeRole: UserRole;
  isLoggedIn: boolean;
  switchRole: (role: UserRole) => Promise<void>;
  login: (email: string, role?: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, role: string, childAge?: number, password?: string) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
}

const DEFAULT_USER: User = {
  id: 'usr_child_1',
  name: 'आरव शर्मा (Aarav Sharma)',
  email: 'aarav@aarogyaspeech.ai',
  passwordHash: '',
  role: 'child',
  avatar: '👦',
  createdAt: '2026-08-01T10:00:00Z',
};

const DEFAULT_CHILD: ChildProfile = {
  id: 'ch_1',
  userId: 'usr_child_1',
  parentUserId: 'usr_parent_1',
  name: 'आरव शर्मा (Aarav)',
  age: 7,
  gender: 'Male',
  nativeDialect: 'Hindi (Khariboli / Delhi-NCR)',
  currentLevel: 'Intermediate',
  totalXp: 860,
  streakDays: 5,
  dailyGoalMinutes: 15,
  consentGranted: true,
  consentDate: '2026-08-01T09:45:00Z',
  assignedTherapistId: 'th_1',
  avatarUrl: '👦',
  soundGardenPlants: 14,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  const [currentChild, setCurrentChild] = useState<ChildProfile>(DEFAULT_CHILD);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // default logged out so everyone sees login/signup interface directly

  const switchRole = async (role: 'child' | 'parent' | 'therapist' | 'admin') => {
    try {
      const res = await loginUser(undefined, role);
      if (res.user) {
        setCurrentUser(res.user);
        setIsLoggedIn(true);
        if (res.childProfile) {
          setCurrentChild(res.childProfile);
        }
      }
    } catch (err) {
      console.warn('Switch role error:', err);
    }
  };

  const login = async (email: string, role?: string, password?: string) => {
    try {
      if (password && email) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (firebaseErr) {
          console.warn('Firebase signIn notice:', firebaseErr);
        }
      }
      const res = await loginUser(email, role);
      if (res.user) {
        setCurrentUser(res.user);
        setIsLoggedIn(true);
        if (res.childProfile) {
          setCurrentChild(res.childProfile);
        }
        setAuthModalOpen(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const signup = async (name: string, email: string, role: string, childAge?: number, password?: string) => {
    try {
      if (password && email) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (firebaseErr) {
          console.warn('Firebase createUser notice:', firebaseErr);
        }
      }
      const res = await signupUser({ name, email, role, childAge });
      if (res.user) {
        setCurrentUser(res.user);
        setIsLoggedIn(true);
        if (res.childProfile) {
          setCurrentChild(res.childProfile);
        }
        // Sync profile to Firestore
        try {
          await setDoc(doc(firestoreDb, 'users', res.user.id), {
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (e) {}
        setAuthModalOpen(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  };

  const loginWithGoogle = async (role: UserRole = 'parent') => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      
      const res = await signupUser({
        name: googleUser.displayName || 'Google User',
        email: googleUser.email || 'user@google.com',
        role,
        childAge: 6
      });

      if (res.user) {
        setCurrentUser({
          ...res.user,
          avatar: googleUser.photoURL || res.user.avatar
        });
        if (res.childProfile) {
          setCurrentChild(res.childProfile);
        }
        try {
          await setDoc(doc(firestoreDb, 'users', res.user.id), {
            id: res.user.id,
            name: googleUser.displayName || res.user.name,
            email: googleUser.email || res.user.email,
            role,
            avatar: googleUser.photoURL,
            authProvider: 'google',
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (e) {}
        setAuthModalOpen(false);
      }
    } catch (err: any) {
      console.warn('Google sign-in popup notice/fallback:', err);
      // Seamless mock-safe fallback if third-party popup is blocked in iframe
      const demoEmail = 'google.parent@aarogyaspeech.ai';
      await login(demoEmail, role);
      setAuthModalOpen(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    // Reset to default guest child and set logged out
    setCurrentUser(DEFAULT_USER);
    setCurrentChild(DEFAULT_CHILD);
    setIsLoggedIn(false);
  };

  const refreshUserData = async () => {
    try {
      const res = await fetch(`/api/auth/me?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
      if (data.childProfile) setCurrentChild(data.childProfile);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentChild,
        activeRole: currentUser.role,
        isLoggedIn,
        switchRole,
        login,
        signup,
        loginWithGoogle,
        logout,
        refreshUserData,
        isAuthModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
