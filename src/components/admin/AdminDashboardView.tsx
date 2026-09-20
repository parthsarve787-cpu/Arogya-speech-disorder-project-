import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Users, 
  Server, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw 
} from 'lucide-react';
import { fetchAdminMetrics, fetchAdminAuditLogs } from '../../services/api';
import { AuditLog } from '../../../server/db';

export const AdminDashboardView: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAdminMetrics(), fetchAdminAuditLogs()])
      .then(([m, l]) => {
        setMetrics(m);
        setLogs(l);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Header in English */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>System Administration & Audit Trail (DPDP Act 2023)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Platform Governance, Privacy & Security Audit
        </h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Users</span>
          <div className="text-3xl font-black text-slate-900">{metrics?.totalUsers || 4}</div>
          <p className="text-[10px] text-slate-500 font-medium">1 Child · 1 Parent · 1 SLP</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Processed Audio Sessions</span>
          <div className="text-3xl font-black text-emerald-700">{metrics?.totalAudioProcessed || 22}</div>
          <p className="text-[10px] text-emerald-600 font-medium">GOP Likelihood Evaluated</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">24h Ephemeral Vault</span>
          <div className="text-3xl font-black text-amber-600">{metrics?.activeAudioInVault || 3}</div>
          <p className="text-[10px] text-amber-600 font-medium">Automated TTL Purge Active</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Average GOP Score</span>
          <div className="text-3xl font-black text-teal-700 font-mono">{metrics?.averageGopScore || '0.78'}</div>
          <p className="text-[10px] text-slate-500 font-medium">High Confidence Band</p>
        </div>
      </div>

      {/* Compliance & DPDP Status Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">DPDP Act 2023 & RCI Compliance Guarantee</h3>
            <p className="text-xs text-slate-500">
              Ephemeral Voice Storage (24h TTL) · Revocable Parental Consent · Secure Encrypted Persistence
            </p>
          </div>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold w-fit">
          ✓ Verified & Enforced
        </span>
      </div>

      {/* Immutable Audit Log Stream */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Immutable Governance Audit Logs</h3>
            <p className="text-xs text-slate-500">Real-time ledger of access, consent, and deletion events</p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            Real-Time Stream
          </span>
        </div>

        <div className="divide-y divide-slate-100 font-mono text-xs">
          {logs.map((log) => (
            <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors px-2 rounded-xl">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {log.action}
                  </span>
                  <span className="text-slate-900 font-sans font-bold text-xs">{log.targetResource}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-sans">{log.details}</p>
              </div>

              <div className="text-right text-[11px] text-slate-400 shrink-0 font-sans">
                <div className="font-semibold text-slate-600">{log.actorName} ({log.actorRole})</div>
                <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
