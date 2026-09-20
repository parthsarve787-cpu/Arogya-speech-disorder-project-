import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Trash2, 
  Lock, 
  Clock, 
  Award, 
  UserCheck, 
  Phone, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  RefreshCw 
} from 'lucide-react';
import { fetchParentOverview, deleteAllChildAudio, updateParentConsent } from '../../services/api';
import { MainNavView } from '../navigation/Navbar';

interface ParentDashboardProps {
  setCurrentView: (view: MainNavView) => void;
}

export const ParentDashboardView: React.FC<ParentDashboardProps> = ({ setCurrentView }) => {
  const { currentUser, currentChild } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deletingAudio, setDeletingAudio] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [consentActive, setConsentActive] = useState(true);

  const loadData = () => {
    fetchParentOverview(currentUser.id)
      .then((res) => {
        setData(res);
        setConsentActive(res.consentStatus);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const handleDeleteAllAudio = async () => {
    if (!confirm('Are you sure you want to permanently erase all of Aarav’s recorded voice audio from the server?')) return;
    setDeletingAudio(true);
    try {
      const res = await deleteAllChildAudio(currentChild.id, currentUser.id);
      setDeleteMessage(res.message);
      loadData();
    } finally {
      setDeletingAudio(false);
    }
  };

  const handleToggleConsent = async () => {
    const nextState = !consentActive;
    setConsentActive(nextState);
    await updateParentConsent(currentChild.id, nextState);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Header in English */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Parental Governance & Privacy Portal (DPDP Act 2023)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Aarav's Progress, Consent & Voice Vault
        </h1>
      </div>

      {deleteMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{deleteMessage}</span>
          </div>
          <button onClick={() => setDeleteMessage(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Top 3 Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Screen Time Limit Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Daily Screen Time Limit</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">11 / 15 min</div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '73%' }}></div>
          </div>
          <p className="text-[11px] text-slate-500">15-minute strict daily ceiling protects young children's eyes.</p>
        </div>

        {/* Verifiable Parental Consent Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Verifiable Consent (DPDP 2023)</span>
            <UserCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-slate-900">
              {consentActive ? 'Consent Active (Granted)' : 'Consent Revoked'}
            </span>
            <input
              type="checkbox"
              checked={consentActive}
              onChange={handleToggleConsent}
              className="w-5 h-5 accent-emerald-600 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Mandatory parental authorization for speech processing. Revocable at any moment.
          </p>
        </div>

        {/* 24-Hour Voice Vault Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>24-Hour Voice Vault</span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">
            {data?.activeRecordingsCount || 3} Active PCM Files
          </div>
          <button
            onClick={handleDeleteAllAudio}
            disabled={deletingAudio}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deletingAudio ? 'Purging...' : 'Hard Purge All Audio Now'}</span>
          </button>
          <p className="text-[10px] text-slate-500">
            Automatic 24h expiration. Hard purge removes audio completely from server disk.
          </p>
        </div>
      </div>

      {/* Connected Certified SLP Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center text-2xl">
              👩‍⚕️
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dr. Neha Verma, M.Sc. (SLP)</h2>
              <p className="text-xs text-sky-700 font-mono font-medium">
                RCI Registration: RCI-SLP-78249 · Senior Speech-Language Pathologist
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              Assigned Clinical Supervisor
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Doctor-Prescribed Practice Homework:
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              "Week 3: Practice minimal pair 'कमल vs तमल' 5 times daily. Ensure tongue tip rests behind lower front teeth while soft palate initiates sound."
            </p>
            <div className="text-[10px] text-slate-500">Prescribed: September 17, 2026</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Clinic Contact & Tele-Consultation:
            </span>
            <div className="space-y-1 text-slate-700 font-medium">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 98110 54321 (Apex Pediatric Speech Centre)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>dr.neha@aarogyaspeech.ai</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
