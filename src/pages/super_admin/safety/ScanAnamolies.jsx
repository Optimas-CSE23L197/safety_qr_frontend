import React, { useState } from 'react';
import {
  AlertTriangle, CheckCircle, Eye, MapPin, Monitor, Shield,
  ShieldAlert, Phone, Mail, MessageCircle, Flag, X, Bell,
  Send, Clock, User, Activity, Lock, Unlock, FileText,
  ChevronDown, ChevronUp, ExternalLink, ThumbsUp, ThumbsDown,
  Info, Filter, Download, RefreshCw, Search, MoreVertical,
  Zap, Globe, Wifi, Moon, Server, Database, Hash, Users as UsersIcon
} from 'lucide-react';
import { formatRelativeTime, formatDateTime, humanizeEnum, maskTokenHash } from '#utils/formatters.js';
import { useAnomalies } from '#hooks/super-admin/useAnomalies.js';
import useAnomalyStore from '#store/super-admin/anomalyStore.js';
import useAuth from '#hooks/useAuth.js';
import useToast from '#hooks/useToast.js';

// ─── ANOMALY TYPES (Matches Prisma Schema) ────────────────────────────────────
const ANOMALY_TYPES = {
  HIGH_FREQUENCY: {
    label: 'High Frequency',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    icon: Zap,
    severity: 'MEDIUM',
    description: 'Unusually high number of scans in short time'
  },
  MULTIPLE_LOCATIONS: {
    label: 'Multiple Locations',
    color: '#B91C1C',
    bg: '#FEF2F2',
    icon: Globe,
    severity: 'HIGH',
    description: 'Token scanned from multiple locations simultaneously'
  },
  SUSPICIOUS_IP: {
    label: 'Suspicious IP',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: Wifi,
    severity: 'HIGH',
    description: 'Scan from known suspicious IP address'
  },
  AFTER_HOURS: {
    label: 'After Hours',
    color: '#6D28D9',
    bg: '#F5F3FF',
    icon: Moon,
    severity: 'LOW',
    description: 'Scan occurred outside school operating hours'
  },
  BULK_SCRAPING: {
    label: 'Bulk Scraping',
    color: '#7C3AED',
    bg: '#EDE9FE',
    icon: Server,
    severity: 'CRITICAL',
    description: 'Multiple tokens scanned in rapid succession'
  },
  HONEYPOT_TRIGGERED: {
    label: 'Honeypot Triggered',
    color: '#991B1B',
    bg: '#FEF2F2',
    icon: ShieldAlert,
    severity: 'CRITICAL',
    description: 'Suspicious activity detected on honeypot token'
  },
  REPEATED_FAILURE: {
    label: 'Repeated Failure',
    color: '#B45309',
    bg: '#FFFBEB',
    icon: AlertTriangle,
    severity: 'MEDIUM',
    description: 'Multiple failed scan attempts'
  }
};

const SEVERITY_COLORS = {
  CRITICAL: { bg: '#7F1A1A', color: '#FEF2F2', label: 'Critical', order: 0 },
  HIGH: { bg: '#991B1B', color: '#FEF2F2', label: 'High', order: 1 },
  MEDIUM: { bg: '#B45309', color: '#FEF2F2', label: 'Medium', order: 2 },
  LOW: { bg: '#065F46', color: '#FEF2F2', label: 'Low', order: 3 }
};

// ─── RESOLUTION ACTION MODAL ──────────────────────────────────────────────────
const ResolutionModal = ({ anomaly, onClose, onResolve, isResolving }) => {
  const [notes, setNotes] = useState('');
  const [action, setAction] = useState('VERIFIED_SAFE');
  const [notifyParent, setNotifyParent] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const actions = [
    { id: 'VERIFIED_SAFE', label: 'Mark as Safe', icon: CheckCircle, color: '#10B981', description: 'False positive, no action needed' },
    { id: 'CONTACT_PARENT', label: 'Contact Parent', icon: Phone, color: '#3B82F6', description: 'Notify parent via SMS/Email' },
    { id: 'REVOKE_TOKEN', label: 'Revoke Token', icon: Lock, color: '#EF4444', description: 'Immediately disable the token' },
    { id: 'ESCALATE', label: 'Escalate', icon: AlertTriangle, color: '#F59E0B', description: 'Flag for super admin review' }
  ];

  const handleSubmit = async () => {
    if (!notes.trim()) return;
    setSubmitting(true);
    const resolutionNote = `${action}: ${notes}${notifyParent ? ' - Parent notified' : ''}`;
    await onResolve(anomaly.id, resolutionNote);
    setSubmitting(false);
    onClose();
  };

  const typeMeta = ANOMALY_TYPES[anomaly.anomaly_type] || ANOMALY_TYPES.HIGH_FREQUENCY;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-6 py-5 border-b border-[var(--border-default)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl" style={{ background: typeMeta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <typeMeta.icon size={18} color={typeMeta.color} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0">Resolve Anomaly</h3>
              <p className="text-xs text-[var(--text-muted)] m-0">{typeMeta.label} · {anomaly.student_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-4 rounded-xl" style={{ background: typeMeta.bg }}>
            <p className="text-sm font-medium mb-1" style={{ color: typeMeta.color }}>Reason</p>
            <p className="text-sm text-[var(--text-primary)]">{anomaly.reason}</p>
            {anomaly.metadata && Object.keys(anomaly.metadata).length > 0 && (
              <details className="mt-3">
                <summary className="text-xs font-medium cursor-pointer" style={{ color: typeMeta.color }}>View Details</summary>
                <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(anomaly.metadata, null, 2)}
                </pre>
              </details>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Resolution Action</label>
            <div className="space-y-2">
              {actions.map(act => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setAction(act.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${action === act.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-[var(--border-default)] bg-white hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${act.color}20` }}>
                      <act.icon size={14} color={act.color} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{act.label}</div>
                      <div className="text-xs text-[var(--text-muted)]">{act.description}</div>
                    </div>
                    {action === act.id && <CheckCircle size={14} color="#7C3AED" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Resolution Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describe the action taken or reason for resolution..."
              rows={3}
              className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {action !== 'REVOKE_TOKEN' && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
              <input
                type="checkbox"
                checked={notifyParent}
                onChange={e => setNotifyParent(e.target.checked)}
                id="notifyParent"
                className="w-4 h-4"
              />
              <label htmlFor="notifyParent" className="text-sm cursor-pointer">
                Notify parent via SMS/Email about this resolution
              </label>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-[var(--border-default)] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-medium hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || isResolving || !notes.trim()}
            className="px-5 py-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            {submitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Resolve Anomaly
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ANOMALY CARD ─────────────────────────────────────────────────────────────
const AnomalyCard = ({ anomaly, onResolve, canAct, isResolving }) => {
  const [expanded, setExpanded] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  const typeMeta = ANOMALY_TYPES[anomaly.anomaly_type] || ANOMALY_TYPES.HIGH_FREQUENCY;
  const severityMeta = SEVERITY_COLORS[anomaly.severity] || SEVERITY_COLORS.MEDIUM;
  const TypeIcon = typeMeta.icon;

  const getActionBadge = (actionNote) => {
    if (!actionNote) return null;
    if (actionNote.includes('VERIFIED_SAFE')) return { label: '✓ Verified Safe', color: '#10B981', bg: '#ECFDF5' };
    if (actionNote.includes('CONTACT_PARENT')) return { label: '📞 Parent Notified', color: '#3B82F6', bg: '#EFF6FF' };
    if (actionNote.includes('REVOKE_TOKEN')) return { label: '🔒 Token Revoked', color: '#EF4444', bg: '#FEF2F2' };
    if (actionNote.includes('ESCALATE')) return { label: '⚠️ Escalated', color: '#F59E0B', bg: '#FFFBEB' };
    return { label: 'Resolved', color: '#64748B', bg: '#F1F5F9' };
  };

  const actionBadge = anomaly.resolution_note ? getActionBadge(anomaly.resolution_note) : null;

  return (
    <>
      <div className={`bg-white rounded-xl border transition-all hover:shadow-md ${anomaly.resolved ? 'border-[var(--border-default)] opacity-80' : `border-l-4`
        }`} style={!anomaly.resolved ? { borderLeftColor: typeMeta.color } : {}}>
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: typeMeta.bg }}>
              <TypeIcon size={22} color={typeMeta.color} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-bold text-[var(--text-primary)]">{anomaly.student_name || 'Multiple Students'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: typeMeta.bg, color: typeMeta.color }}>
                  {typeMeta.label}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: severityMeta.bg, color: severityMeta.color }}>
                  {severityMeta.label}
                </span>
                {anomaly.resolved && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    ✓ Resolved
                  </span>
                )}
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-2">{anomaly.reason}</p>

              <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] mb-3">
                <span className="flex items-center gap-1"><Clock size={12} /> {formatRelativeTime(anomaly.created_at)}</span>
                <span className="flex items-center gap-1"><Hash size={12} /> {maskTokenHash(anomaly.token_hash || 'Unknown')}</span>
              </div>

              {anomaly.resolved && anomaly.resolution_note && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-50 border-l-4 border-emerald-500">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-semibold text-emerald-700">Resolution:</span>
                        {actionBadge && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: actionBadge.bg, color: actionBadge.color }}>
                            {actionBadge.label}
                          </span>
                        )}
                        <span className="text-xs text-emerald-600">by {anomaly.resolved_by || 'System'}</span>
                      </div>
                      <p className="text-sm text-emerald-800">{anomaly.resolution_note}</p>
                      <p className="text-xs text-emerald-600 mt-1">Resolved {formatRelativeTime(anomaly.resolved_at)}</p>
                    </div>
                  </div>
                </div>
              )}

              {expanded && anomaly.metadata && Object.keys(anomaly.metadata).length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-slate-50">
                  <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Metadata</p>
                  <pre className="text-xs font-mono overflow-x-auto">
                    {JSON.stringify(anomaly.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              {!anomaly.resolved && canAct && (
                <button
                  onClick={() => setShowResolveModal(true)}
                  disabled={isResolving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Flag size={14} /> Resolve
                </button>
              )}
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-8 h-8 rounded-lg border border-[var(--border-default)] bg-white flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showResolveModal && (
        <ResolutionModal
          anomaly={anomaly}
          onClose={() => setShowResolveModal(false)}
          onResolve={onResolve}
          isResolving={isResolving}
        />
      )}
    </>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ScanAnamolies() {
  const { user, can } = useAuth();
  const { showToast } = useToast();
  const [filter, setFilter] = useState('UNRESOLVED');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const {
    anomalies,
    stats,
    filters: filterOptions,
    pagination,
    loading,
    resolveAnomaly,
    isResolving,
    refetch,
  } = useAnomalies({
    page,
    limit: 10,
    search: searchTerm,
    resolved: filter === 'UNRESOLVED' ? 'UNRESOLVED' : filter === 'RESOLVED' ? 'RESOLVED' : '',
    anomaly_type: typeFilter !== 'ALL' ? typeFilter : '',
    severity: severityFilter !== 'ALL' ? severityFilter : '',
  });

  const canAct = can('anomalies.manage') || user?.role === 'SCHOOL_ADMIN';

  const unresolvedBySeverity = {
    CRITICAL: stats.by_severity?.CRITICAL || 0,
    HIGH: stats.by_severity?.HIGH || 0,
    MEDIUM: stats.by_severity?.MEDIUM || 0,
    LOW: stats.by_severity?.LOW || 0,
  };

  const handleResolve = async (id, resolutionNote) => {
    await resolveAnomaly({ id, resolved_by: resolutionNote });
    showToast('Anomaly resolved successfully', 'success');
  };

  const handleRefresh = async () => {
    await refetch();
    showToast('Anomalies refreshed', 'info');
  };

  const handleExport = () => {
    const dataToExport = anomalies;
    const csv = [
      ['ID', 'Student', 'Type', 'Severity', 'Reason', 'Created', 'Resolved', 'Resolution Note'],
      ...dataToExport.map(a => [
        a.id, a.student_name, a.anomaly_type, a.severity, a.reason,
        new Date(a.created_at).toLocaleString(), a.resolved ? 'Yes' : 'No',
        a.resolution_note || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anomalies_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export started', 'success');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <ShieldAlert size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0">
                  Scan Anomalies
                </h1>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">
                  Monitor and respond to suspicious scan activities
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={anomalies.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              <Download size={14} /> Export
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className="text-[var(--text-muted)]" />
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Total</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.total || 0}</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Unresolved</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.unresolved || 0}</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} className="text-emerald-500" />
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Resolved</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.resolved || 0}</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Critical/High</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{unresolvedBySeverity.CRITICAL + unresolvedBySeverity.HIGH}</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-[var(--text-muted)]" />
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Resolution Rate</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {[
              ['UNRESOLVED', `Unresolved (${stats.unresolved || 0})`],
              ['RESOLVED', `Resolved (${stats.resolved || 0})`],
              ['ALL', `All (${stats.total || 0})`]
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setFilter(key); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === key
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={severityFilter}
            onChange={e => { setSeverityFilter(e.target.value); setPage(1); }}
            className="py-1.5 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white"
          >
            <option value="ALL">All Severities</option>
            {filterOptions?.severities?.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            className="py-1.5 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white min-w-[160px]"
          >
            <option value="ALL">All Types</option>
            {filterOptions?.anomalyTypes?.map(t => (
              <option key={t} value={t}>{ANOMALY_TYPES[t]?.label || t}</option>
            ))}
          </select>

          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search by student, token, IP..."
              className="w-full py-1.5 pl-9 pr-3 border border-[var(--border-default)] rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {loading && anomalies.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border-default)] py-16 text-center">
          <RefreshCw size={48} className="mx-auto mb-3 text-[var(--text-muted)] opacity-30 animate-spin" />
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">Loading anomalies...</h3>
        </div>
      ) : anomalies.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border-default)] py-16 text-center">
          <Shield size={48} className="mx-auto mb-3 text-[var(--text-muted)] opacity-30" />
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">No anomalies found</h3>
          <p className="text-sm text-[var(--text-muted)]">
            {filter !== 'ALL' ? 'Try changing your filters' : 'All systems are operating normally'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {anomalies.map(anomaly => (
            <AnomalyCard
              key={anomaly.id}
              anomaly={anomaly}
              onResolve={handleResolve}
              canAct={canAct && !anomaly.resolved}
              isResolving={isResolving}
            />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg border border-[var(--border-default)] bg-white text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-[var(--text-secondary)]">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-3 py-2 rounded-lg border border-[var(--border-default)] bg-white text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}