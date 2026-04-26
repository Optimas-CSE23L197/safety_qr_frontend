// src/pages/school_admin/Students.jsx
/**
 * ALL STUDENTS — School Admin
 *
 * Basic plan:
 *   Search · Class filter · Name sort · View student · Add student · Pagination
 *
 * Premium plan (all above +):
 *   Section / Token Status / Date filters · Any column sort · Column: Last Scan
 *   Bulk: assign tokens · Bulk: deactivate · Bulk: print cards
 *   Export CSV · Quick-view drawer with inline scan history
 *   Row action: Print card
 */

import { useState, useMemo }      from 'react';
import { useNavigate }            from 'react-router-dom';
import {
    Search, Plus, Download, Printer, UserX, QrCode,
    SlidersHorizontal, ChevronUp, ChevronDown, ChevronsUpDown,
    Eye, Sparkles, Lock, ChevronLeft, ChevronRight,
    GraduationCap, X, AlertCircle, Users,
} from 'lucide-react';

import useAuth           from '../../hooks/useAuth.js';
import { useStudents, PAGE_SIZE_OPTIONS, SORT_FIELDS } from '../../hooks/useStudents.js';
import { formatDate, formatRelativeTime }              from '../../utils/formatters.js';
import { ROUTES }                                      from '../../config/routes.config.js';
import StudentFilters                                   from '../../components/students/StudentFilters.jsx';
import Spinner                                         from '../../components/ui/Spinner.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Token status colour map
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_COLORS = {
    ACTIVE:     { bg: '#ECFDF5', color: '#047857' },
    UNASSIGNED: { bg: '#F1F5F9', color: '#475569' },
    ISSUED:     { bg: '#EFF6FF', color: '#1D4ED8' },
    EXPIRED:    { bg: '#FEF3C7', color: '#B45309' },
    REVOKED:    { bg: '#FEF2F2', color: '#B91C1C' },
    INACTIVE:   { bg: '#F8FAFC', color: '#94A3B8' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Local atoms
// ─────────────────────────────────────────────────────────────────────────────

const Skeleton = ({ w = '100%', h = '14px', radius = '4px' }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: radius }} />
);

/** Pill badge */
const TokenBadge = ({ status, label }) => {
    const colors = TOKEN_COLORS[status] ?? TOKEN_COLORS.UNASSIGNED;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '3px 9px', borderRadius: '9999px',
            fontSize: '0.75rem', fontWeight: 600,
            background: colors.bg, color: colors.color,
            whiteSpace: 'nowrap',
        }}>
            {label ?? status}
        </span>
    );
};

/** Avatar — photo or initials */
const Avatar = ({ name, photoUrl, size = 36 }) => {
    if (photoUrl) {
        return (
            <img
                src={photoUrl}
                alt={name}
                style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
        );
    }
    const initials = (name ?? '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.33, fontWeight: 700, color: 'var(--color-brand-700)',
        }}>
            {initials}
        </div>
    );
};

/** Sortable column header button */
const SortHeader = ({ label, field, sortField, sortDir, onSort, isPremium, alwaysAllowed = false }) => {
    const active    = sortField === field;
    const canSort   = alwaysAllowed || isPremium;
    const Icon      = active ? (sortDir === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown;
    return (
        <th style={{ textAlign: 'left', padding: '12px 16px', whiteSpace: 'nowrap' }}>
            <button
                onClick={() => canSort && onSort(field)}
                title={canSort ? undefined : 'Upgrade to sort by this column'}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: 'none', border: 'none', padding: 0,
                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: active ? 'var(--color-brand-600)' : 'var(--text-muted)',
                    cursor: canSort ? 'pointer' : 'default',
                }}
            >
                {label}
                {canSort
                    ? <Icon size={12} />
                    : <Lock size={10} color="var(--color-warning-400)" />
                }
            </button>
        </th>
    );
};

/** Premium-locked action button */
const LockedAction = ({ label, icon: Icon, onClick, navigateTo }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={navigateTo ? () => navigate(navigateTo) : onClick}
            title="Upgrade to Premium to unlock"
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '7px 14px', borderRadius: '8px',
                border: '1px solid var(--color-warning-300)',
                background: 'var(--color-warning-50)',
                color: 'var(--color-warning-600)',
                fontSize: '0.8125rem', fontWeight: 500,
                cursor: 'pointer', opacity: 0.85,
                transition: 'opacity 0.1s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.85'}
        >
            <Lock size={11} /> {label}
        </button>
    );
};

/** Pagination bar */
const Pagination = ({ page, totalPages, pageSize, onPageChange, onPageSizeChange }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderTop: '1px solid var(--border-default)',
        flexWrap: 'wrap', gap: '12px',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Rows per page</span>
            <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                style={{
                    padding: '4px 8px', borderRadius: '6px', fontSize: '0.8125rem',
                    border: '1px solid var(--border-default)', background: 'white',
                    cursor: 'pointer',
                }}
            >
                {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginRight: '8px' }}>
                Page {page} of {totalPages}
            </span>
            {[
                { icon: ChevronLeft,  delta: -1, disabled: page <= 1 },
                { icon: ChevronRight, delta:  1, disabled: page >= totalPages },
            ].map(({ icon: Ic, delta, disabled }) => (
                <button
                    key={delta}
                    onClick={() => !disabled && onPageChange(page + delta)}
                    disabled={disabled}
                    style={{
                        width: '30px', height: '30px', borderRadius: '6px',
                        border: '1px solid var(--border-default)',
                        background: disabled ? 'var(--color-slate-50)' : 'white',
                        color: disabled ? 'var(--color-slate-300)' : 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: disabled ? 'default' : 'pointer',
                    }}
                >
                    <Ic size={14} />
                </button>
            ))}
        </div>
    </div>
);

/** Quick-view drawer — slides in from the right */
const QuickViewDrawer = ({ student, onClose, isPremium, onNavigate }) => {
    if (!student) return null;
    const tokenBadge = student.current_token?.status_badge ?? { bg: '#F1F5F9', color: '#475569', label: 'Unassigned' };
    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)',
                    zIndex: 40, animation: 'fadeIn 0.2s ease',
                }}
            />
            {/* Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(440px, 95vw)',
                background: 'white', zIndex: 50,
                boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
                display: 'flex', flexDirection: 'column',
                animation: 'slideInRight 0.25s ease',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', borderBottom: '1px solid var(--border-default)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Avatar name={student.full_name} photoUrl={student.photo_url} size={44} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                {student.full_name}
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {student.class && `${student.class}${student.section ? ` - ${student.section}` : ''}`}
                                {student.roll_number && ` · Roll ${student.roll_number}`}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            border: '1px solid var(--border-default)', background: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

                    {/* Token status */}
                    <div style={{
                        padding: '14px 16px', borderRadius: '10px',
                        background: tokenBadge.bg, marginBottom: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <QrCode size={16} color={tokenBadge.color} />
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: tokenBadge.color }}>
                                {tokenBadge.label}
                            </span>
                        </div>
                        {student.current_token?.id && (
                            <span style={{
                                fontFamily: 'monospace', fontSize: '0.75rem',
                                color: tokenBadge.color, opacity: 0.7,
                            }}>
                                #{student.current_token.id.slice(-6).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Key facts */}
                    {[
                        { label: 'Admission No', value: student.admission_number ?? '—' },
                        { label: 'Roll Number',  value: student.roll_number      ?? '—' },
                        { label: 'Enrolled',     value: student.created_at_formatted ?? formatDate(student.created_at) },
                    ].map(({ label, value }) => (
                        <div key={label} style={{
                            display: 'flex', justifyContent: 'space-between',
                            padding: '10px 0', borderBottom: '1px solid var(--border-default)',
                        }}>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{label}</span>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                        </div>
                    ))}

                    {/* Recent scans — Premium only */}
                    <div style={{ marginTop: '20px' }}>
                        <div style={{
                            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
                            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px',
                        }}>
                            Recent Scans
                        </div>
                        {!isPremium ? (
                            <div style={{
                                padding: '16px', borderRadius: '8px',
                                border: '1px dashed var(--color-warning-300)',
                                background: 'var(--color-warning-50)',
                                display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                                <Lock size={14} color="var(--color-warning-600)" />
                                <span style={{ fontSize: '0.8125rem', color: 'var(--color-warning-700)' }}>
                                    Scan history available on Premium.
                                </span>
                            </div>
                        ) : student.recent_scans?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {student.recent_scans.slice(0, 5).map((scan) => (
                                    <div key={scan.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '8px 12px', borderRadius: '8px',
                                        background: 'var(--color-slate-50)',
                                    }}>
                                        <span style={{
                                            fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px',
                                            borderRadius: '9999px',
                                            background: scan.result === 'SUCCESS' ? '#ECFDF5' : '#FEF2F2',
                                            color:      scan.result === 'SUCCESS' ? '#047857' : '#B91C1C',
                                        }}>
                                            {scan.result}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {formatRelativeTime(scan.created_at)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No scan records</p>
                        )}
                    </div>
                </div>

                {/* Footer actions */}
                <div style={{
                    padding: '16px 24px', borderTop: '1px solid var(--border-default)',
                    display: 'flex', gap: '10px',
                }}>
                    <button
                        onClick={() => { onNavigate(student.id); onClose(); }}
                        style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '6px', padding: '9px 16px', borderRadius: '8px',
                            border: 'none',
                            background: 'var(--color-brand-600)',
                            color: 'white', fontWeight: 600, fontSize: '0.875rem',
                            cursor: 'pointer',
                        }}
                    >
                        <Eye size={14} /> View full profile
                    </button>
                    {isPremium && (
                        <button
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '9px 14px', borderRadius: '8px',
                                border: '1px solid var(--border-default)',
                                background: 'white', color: 'var(--text-secondary)',
                                fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                            }}
                        >
                            <Printer size={14} /> Print card
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function Students() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const schoolId = user?.school_id;

    const [showFilters, setShowFilters] = useState(false);

    const hook = useStudents(schoolId);

    // Derive class + section options from loaded students (or could come from store)
    const classOptions   = useMemo(() => [...new Set(hook.students.map((s) => s.class).filter(Boolean))].sort(), [hook.students]);
    const sectionOptions = useMemo(() => [...new Set(hook.students.map((s) => s.section).filter(Boolean))].sort(), [hook.students]);

    const hasStudents = hook.students.length > 0;
    const isSearching = !!(hook.search || hook.filterClass || hook.filterSection || hook.filterTokenStatus || hook.filterDateFrom || hook.filterDateTo);

    // ── Skeleton rows ──────────────────────────────────────────────────────────
    const skeletonRows = Array.from({ length: 8 }, (_, i) => i);

    return (
        <div style={{ maxWidth: '1400px' }}>

            {/* ══════════════════════════════════════════════════════════════
                Page header
            ══════════════════════════════════════════════════════════════ */}
            <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                marginBottom: '24px', flexWrap: 'wrap', gap: '16px',
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)', fontSize: '1.375rem',
                            fontWeight: 700, color: 'var(--text-primary)', margin: 0,
                        }}>
                            All Students
                        </h2>
                        {hook.totalStudents != null && (
                            <span style={{
                                display: 'inline-flex', alignItems: 'center',
                                padding: '3px 10px', borderRadius: '9999px',
                                fontSize: '0.75rem', fontWeight: 600,
                                background: 'var(--color-brand-50)',
                                color: 'var(--color-brand-600)',
                            }}>
                                {hook.totalStudents.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                        Manage students, QR tokens and ID cards
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Export CSV — Premium only */}
                    {hook.isPremium ? (
                        <button
                            onClick={hook.onExportCSV}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                padding: '8px 14px', borderRadius: '8px',
                                border: '1px solid var(--border-default)',
                                background: 'white', color: 'var(--text-secondary)',
                                fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                                transition: 'background 0.1s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-slate-50)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                            <Download size={14} /> Export CSV
                        </button>
                    ) : (
                        <LockedAction
                            label="Export CSV"
                            icon={Download}
                            navigateTo={ROUTES.SCHOOL_ADMIN.SETTINGS}
                        />
                    )}

                    {/* Add Student — always visible */}
                    <button
                        onClick={hook.goToAddStudent}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '8px 18px', borderRadius: '8px', border: 'none',
                            background: 'var(--color-brand-600)',
                            color: 'white', fontWeight: 600, fontSize: '0.875rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                            transition: 'transform 0.1s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Plus size={16} /> Add Student
                    </button>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                Premium upsell banner (Basic only, contextual)
            ══════════════════════════════════════════════════════════════ */}
            {!hook.isPremium && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 20px', marginBottom: '16px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                    border: '1px solid var(--color-warning-200)',
                    flexWrap: 'wrap', gap: '10px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <Sparkles size={15} color="white" />
                        </div>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-warning-800)' }}>
                                Unlock Premium features on this page:{' '}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-warning-700)' }}>
                                section &amp; token filters, bulk actions, CSV export, scan history in quick view.
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(ROUTES.SCHOOL_ADMIN.SETTINGS)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '7px 16px', borderRadius: '8px', border: 'none',
                            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                            color: 'white', fontWeight: 600, fontSize: '0.8125rem',
                            cursor: 'pointer', flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(217,119,6,0.30)',
                        }}
                    >
                        <Sparkles size={12} /> Upgrade to Premium
                    </button>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                Main card
            ══════════════════════════════════════════════════════════════ */}
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>

                {/* ── Search bar + filter toggle ──────────────────────────── */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '16px 20px', borderBottom: '1px solid var(--border-default)',
                    flexWrap: 'wrap',
                }}>
                    {/* Search input */}
                    <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
                        <Search
                            size={15}
                            style={{
                                position: 'absolute', left: '12px', top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)', pointerEvents: 'none',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search by name or admission number…"
                            value={hook.search}
                            onChange={(e) => hook.onSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '8px 12px 8px 36px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-default)',
                                fontSize: '0.875rem', background: 'white',
                                outline: 'none', boxSizing: 'border-box',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-brand-400)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
                        />
                    </div>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters((p) => !p)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', borderRadius: '8px',
                            border: `1px solid ${showFilters ? 'var(--color-brand-400)' : 'var(--border-default)'}`,
                            background: showFilters ? 'var(--color-brand-50)' : 'white',
                            color: showFilters ? 'var(--color-brand-600)' : 'var(--text-secondary)',
                            fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                        }}
                    >
                        <SlidersHorizontal size={14} />
                        Filters
                        {hook.activeFilterCount > 0 && (
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '18px', height: '18px', borderRadius: '50%',
                                background: 'var(--color-brand-600)', color: 'white',
                                fontSize: '0.6875rem', fontWeight: 700,
                            }}>
                                {hook.activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Bulk actions (Premium only, shown when rows selected) */}
                    {hook.isPremium && hook.hasSelection && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            marginLeft: 'auto', flexWrap: 'wrap',
                        }}>
                            <span style={{
                                fontSize: '0.8125rem', fontWeight: 600,
                                color: 'var(--color-brand-600)',
                            }}>
                                {hook.selectedIds.size} selected
                            </span>
                            {[
                                { label: 'Assign tokens',  icon: QrCode,  action: hook.onBulkAssignTokens },
                                { label: 'Print cards',    icon: Printer, action: () => {} },
                                { label: 'Deactivate',     icon: UserX,   action: hook.onBulkDeactivate,
                                    danger: true },
                            ].map(({ label, icon: Ic, action, danger }) => (
                                <button
                                    key={label}
                                    onClick={action}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                        padding: '6px 12px', borderRadius: '7px',
                                        border: `1px solid ${danger ? 'var(--color-danger-200)' : 'var(--border-default)'}`,
                                        background: danger ? 'var(--color-danger-50)' : 'white',
                                        color: danger ? 'var(--color-danger-600)' : 'var(--text-secondary)',
                                        fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
                                    }}
                                >
                                    <Ic size={13} /> {label}
                                </button>
                            ))}
                            <button
                                onClick={hook.clearSelection}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    width: '28px', height: '28px', borderRadius: '6px',
                                    border: '1px solid var(--border-default)', background: 'white',
                                    cursor: 'pointer', color: 'var(--text-muted)',
                                }}
                            >
                                <X size={13} />
                            </button>
                        </div>
                    )}

                    {/* Locked bulk actions teaser (Basic) */}
                    {!hook.isPremium && (
                        <div style={{ marginLeft: 'auto' }}>
                            <LockedAction
                                label="Bulk actions"
                                icon={QrCode}
                                navigateTo={ROUTES.SCHOOL_ADMIN.SETTINGS}
                            />
                        </div>
                    )}
                </div>

                {/* ── Filters panel ──────────────────────────────────────── */}
                {showFilters && (
                    <StudentFilters
                        isPremium={hook.isPremium}
                        filterClass={hook.filterClass}         onFilterClass={hook.onFilterClass}
                        filterSection={hook.filterSection}     onFilterSection={hook.onFilterSection}
                        filterTokenStatus={hook.filterTokenStatus} onFilterTokenStatus={hook.onFilterTokenStatus}
                        filterDateFrom={hook.filterDateFrom}   onFilterDateFrom={hook.onFilterDateFrom}
                        filterDateTo={hook.filterDateTo}       onFilterDateTo={hook.onFilterDateTo}
                        activeFilterCount={hook.activeFilterCount}
                        onClearAll={hook.clearAllFilters}
                        classOptions={classOptions}
                        sectionOptions={sectionOptions}
                    />
                )}

                {/* ── Table ──────────────────────────────────────────────── */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead style={{ background: 'var(--color-slate-50)', borderBottom: '1px solid var(--border-default)' }}>
                            <tr>
                                {/* Checkbox — Premium only */}
                                <th style={{ padding: '12px 16px', width: '44px' }}>
                                    {hook.isPremium ? (
                                        <input
                                            type="checkbox"
                                            checked={hook.isAllSelected}
                                            onChange={hook.toggleSelectAll}
                                            style={{ cursor: 'pointer', accentColor: 'var(--color-brand-600)' }}
                                        />
                                    ) : (
                                        <div title="Bulk selection is a Premium feature">
                                            <Lock size={12} color="var(--color-slate-300)" />
                                        </div>
                                    )}
                                </th>

                                <SortHeader label="Student" field={SORT_FIELDS.NAME} sortField={hook.sortField} sortDir={hook.sortDir} onSort={hook.onSort} isPremium={hook.isPremium} alwaysAllowed />
                                <SortHeader label="Class"   field={SORT_FIELDS.CLASS} sortField={hook.sortField} sortDir={hook.sortDir} onSort={hook.onSort} isPremium={hook.isPremium} />
                                <SortHeader label="Token Status" field={SORT_FIELDS.TOKEN} sortField={hook.sortField} sortDir={hook.sortDir} onSort={hook.onSort} isPremium={hook.isPremium} />

                                {/* Last Scan — Premium only */}
                                {hook.isPremium ? (
                                    <SortHeader label="Last Scan" field={SORT_FIELDS.LAST_SCAN} sortField={hook.sortField} sortDir={hook.sortDir} onSort={hook.onSort} isPremium />
                                ) : (
                                    <th style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
                                            textTransform: 'uppercase', color: 'var(--color-slate-300)',
                                        }}>
                                            Last Scan <Lock size={10} color="var(--color-warning-400)" />
                                        </span>
                                    </th>
                                )}

                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
                                        textTransform: 'uppercase', color: 'var(--text-muted)',
                                    }}>
                                        Actions
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Loading skeletons */}
                            {hook.isLoading && skeletonRows.map((i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-default)' }}>
                                    <td style={{ padding: '14px 16px' }}><Skeleton w="18px" h="18px" radius="4px" /></td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Skeleton w="36px" h="36px" radius="50%" />
                                            <div style={{ flex: 1 }}>
                                                <Skeleton w="140px" h="14px" />
                                                <div style={{ marginTop: '5px' }}><Skeleton w="90px" h="11px" /></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}><Skeleton w="60px" /></td>
                                    <td style={{ padding: '14px 16px' }}><Skeleton w="80px" h="22px" radius="9999px" /></td>
                                    <td style={{ padding: '14px 16px' }}><Skeleton w="80px" /></td>
                                    <td style={{ padding: '14px 16px', textAlign: 'right' }}><Skeleton w="60px" /></td>
                                </tr>
                            ))}

                            {/* Student rows */}
                            {!hook.isLoading && hook.students.map((student) => {
                                const tokenBadge = student.current_token?.status_badge ?? {
                                    bg: '#F1F5F9', color: '#475569', label: 'Unassigned', status: 'UNASSIGNED',
                                };
                                const isSelected = hook.selectedIds.has(student.id);

                                return (
                                    <tr
                                        key={student.id}
                                        style={{
                                            borderBottom: '1px solid var(--border-default)',
                                            background: isSelected ? 'var(--color-brand-50)' : 'white',
                                            transition: 'background 0.1s ease',
                                        }}
                                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--color-slate-50)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? 'var(--color-brand-50)' : 'white'; }}
                                    >
                                        {/* Checkbox */}
                                        <td style={{ padding: '14px 16px' }}>
                                            {hook.isPremium && (
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => hook.toggleSelect(student.id)}
                                                    style={{ cursor: 'pointer', accentColor: 'var(--color-brand-600)' }}
                                                />
                                            )}
                                        </td>

                                        {/* Student name + meta */}
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Avatar name={student.full_name} photoUrl={student.photo_url} />
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                                                        {student.full_name}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                        {student.admission_number
                                                            ? `Adm: ${student.admission_number}`
                                                            : student.roll_number
                                                                ? `Roll: ${student.roll_number}`
                                                                : 'No ID assigned'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Class / Section */}
                                        <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {student.class
                                                ? `${student.class}${student.section ? ` - ${student.section}` : ''}`
                                                : <span style={{ color: 'var(--color-slate-300)' }}>—</span>
                                            }
                                        </td>

                                        {/* Token status */}
                                        <td style={{ padding: '14px 16px' }}>
                                            <TokenBadge
                                                status={student.current_token?.status ?? 'UNASSIGNED'}
                                                label={tokenBadge.label}
                                            />
                                        </td>

                                        {/* Last scan (Premium) */}
                                        <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {hook.isPremium
                                                ? (student.last_scan_at ? formatRelativeTime(student.last_scan_at) : '—')
                                                : (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-slate-300)' }}>
                                                        <Lock size={11} color="var(--color-warning-300)" /> Premium
                                                    </span>
                                                )
                                            }
                                        </td>

                                        {/* Row actions */}
                                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                                {/* Quick view — always */}
                                                <button
                                                    onClick={() => hook.setDrawerStudent(student)}
                                                    title="Quick view"
                                                    style={{
                                                        width: '30px', height: '30px', borderRadius: '6px',
                                                        border: '1px solid var(--border-default)', background: 'white',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', color: 'var(--text-muted)',
                                                        transition: 'color 0.1s, border-color 0.1s',
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-600)'; e.currentTarget.style.borderColor = 'var(--color-brand-300)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                                                >
                                                    <Eye size={14} />
                                                </button>

                                                {/* Print card — Premium */}
                                                {hook.isPremium && (
                                                    <button
                                                        title="Print ID card"
                                                        style={{
                                                            width: '30px', height: '30px', borderRadius: '6px',
                                                            border: '1px solid var(--border-default)', background: 'white',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer', color: 'var(--text-muted)',
                                                            transition: 'color 0.1s, border-color 0.1s',
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-info-600)'; e.currentTarget.style.borderColor = 'var(--color-info-300)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                                                    >
                                                        <Printer size={14} />
                                                    </button>
                                                )}

                                                {/* Full profile — always */}
                                                <button
                                                    onClick={() => hook.goToDetail(student.id)}
                                                    style={{
                                                        padding: '5px 12px', borderRadius: '6px',
                                                        border: '1px solid var(--border-default)',
                                                        background: 'white',
                                                        color: 'var(--color-brand-600)',
                                                        fontSize: '0.8125rem', fontWeight: 500,
                                                        cursor: 'pointer',
                                                        transition: 'background 0.1s',
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-brand-50)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ── Empty states ────────────────────────────────────────── */}
                {!hook.isLoading && !hasStudents && (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '64px 32px', textAlign: 'center',
                    }}>
                        {isSearching ? (
                            <>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '14px',
                                    background: 'var(--color-slate-100)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '16px',
                                }}>
                                    <Search size={24} color="var(--color-slate-400)" />
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', margin: '0 0 6px' }}>
                                    No students match your search
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '320px', margin: '0 0 20px' }}>
                                    Try adjusting your search term or clearing the active filters.
                                </p>
                                <button
                                    onClick={() => { hook.onSearch(''); hook.clearAllFilters(); }}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                        padding: '8px 16px', borderRadius: '8px',
                                        border: '1px solid var(--border-default)',
                                        background: 'white', color: 'var(--color-brand-600)',
                                        fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                                    }}
                                >
                                    <X size={13} /> Clear search &amp; filters
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '20px',
                                }}>
                                    <Users size={28} color="var(--color-brand-600)" />
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem', margin: '0 0 8px' }}>
                                    No students yet
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '340px', margin: '0 0 24px' }}>
                                    Add your first student to get started. You can then generate QR tokens and print ID cards.
                                </p>
                                <button
                                    onClick={hook.goToAddStudent}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '10px 22px', borderRadius: '8px', border: 'none',
                                        background: 'var(--color-brand-600)',
                                        color: 'white', fontWeight: 600, fontSize: '0.9375rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 10px rgba(37,99,235,0.25)',
                                    }}
                                >
                                    <Plus size={16} /> Add First Student
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* ── Pagination ──────────────────────────────────────────── */}
                {!hook.isLoading && hasStudents && (
                    <Pagination
                        page={hook.page}
                        totalPages={hook.totalPages}
                        pageSize={hook.pageSize}
                        onPageChange={hook.onPageChange}
                        onPageSizeChange={hook.onPageSizeChange}
                    />
                )}
            </div>

            {/* ══════════════════════════════════════════════════════════════
                Quick-view drawer
            ══════════════════════════════════════════════════════════════ */}
            <QuickViewDrawer
                student={hook.drawerStudent}
                onClose={() => hook.setDrawerStudent(null)}
                isPremium={hook.isPremium}
                onNavigate={hook.goToDetail}
            />

            {/* Drawer animation keyframes */}
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to   { transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            `}</style>
        </div>
    );
}