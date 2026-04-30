// src/pages/school_admin/Students.jsx
/**
 * ALL STUDENTS — School Admin
 *
 * Modified:
 *  - Professional design overhaul: consistent spacing, refined typography,
 *    subtle interactions, clearer visual hierarchy.
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
// Design Tokens (consistent with global CSS variables)
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
    brand: {
        50: 'var(--color-brand-50, #EFF6FF)',
        100: 'var(--color-brand-100, #DBEAFE)',
        600: 'var(--color-brand-600, #2563EB)',
        700: 'var(--color-brand-700, #1D4ED8)',
    },
    slate: {
        50: 'var(--color-slate-50, #F8FAFC)',
        100: 'var(--color-slate-100, #F1F5F9)',
        200: 'var(--color-slate-200, #E2E8F0)',
        300: 'var(--color-slate-300, #CBD5E1)',
        400: 'var(--color-slate-400, #94A3B8)',
        500: 'var(--color-slate-500, #64748B)',
        600: 'var(--color-slate-600, #475569)',
        700: 'var(--color-slate-700, #334155)',
    },
    text: {
        primary: 'var(--text-primary, #0F172A)',
        secondary: 'var(--text-secondary, #475569)',
        muted: 'var(--text-muted, #94A3B8)',
    },
    border: 'var(--border-default, #E2E8F0)',
    success: { bg: '#ECFDF5', color: '#047857' },
    danger: { bg: '#FEF2F2', color: '#B91C1C' },
    warning: { bg: '#FFFBEB', color: '#B45309' },
};

const TOKEN_COLORS = {
    ACTIVE:     { bg: '#ECFDF5', color: '#047857' },
    UNASSIGNED: { bg: '#F1F5F9', color: '#475569' },
    ISSUED:     { bg: '#EFF6FF', color: '#1D4ED8' },
    EXPIRED:    { bg: '#FEF3C7', color: '#B45309' },
    REVOKED:    { bg: '#FEF2F2', color: '#B91C1C' },
    INACTIVE:   { bg: '#F8FAFC', color: '#94A3B8' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Local Atoms — Enhanced & consistent styling
// ─────────────────────────────────────────────────────────────────────────────

const Skeleton = ({ w = '100%', h = '14px', radius = '4px' }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: radius }} />
);

/** Pill badge — improved with slightly more padding and softer colour */
const TokenBadge = ({ status, label }) => {
    const colors = TOKEN_COLORS[status] ?? TOKEN_COLORS.UNASSIGNED;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '4px 12px', borderRadius: '9999px',
            fontSize: '0.75rem', fontWeight: 600,
            backgroundColor: colors.bg, color: colors.color,
            whiteSpace: 'nowrap', lineHeight: '1.3',
        }}>
            {label ?? status}
        </span>
    );
};

/** Avatar — photo or initials (unchanged, but with subtle shadow for depth) */
const Avatar = ({ name, photoUrl, size = 36 }) => {
    if (photoUrl) {
        return (
            <img
                src={photoUrl}
                alt={name}
                style={{
                    width: size, height: size, borderRadius: '50%',
                    objectFit: 'cover', flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    border: '2px solid white',
                }}
            />
        );
    }
    const initials = (name ?? '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${COLORS.brand[100]}, #BFDBFE)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.33, fontWeight: 700, color: COLORS.brand[700],
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            border: '2px solid white',
        }}>
            {initials}
        </div>
    );
};

/** Sortable column header — refined lock indicator */
const SortHeader = ({ label, field, sortField, sortDir, onSort, isPremium, alwaysAllowed = false }) => {
    const active    = sortField === field;
    const canSort   = alwaysAllowed || isPremium;
    const Icon      = active ? (sortDir === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown;
    return (
        <th style={{ textAlign: 'left', padding: '14px 16px', whiteSpace: 'nowrap' }}>
            <button
                onClick={() => canSort && onSort(field)}
                title={canSort ? `Sort by ${label}` : 'Upgrade to sort by this column'}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: 'none', border: 'none', padding: 0,
                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: active ? COLORS.brand[600] : COLORS.slate[500],
                    cursor: canSort ? 'pointer' : 'default',
                    transition: 'color 0.15s ease',
                }}
            >
                {label}
                {canSort ? (
                    <Icon size={12} color={active ? COLORS.brand[600] : COLORS.slate[400]} />
                ) : (
                    <Lock size={10} color={COLORS.slate[400]} style={{ marginLeft: '2px' }} />
                )}
            </button>
        </th>
    );
};

/** Premium-locked action button — now with a subtle warning background */
const LockedAction = ({ label, icon: Icon }) => (
    <div
        title="Available on Premium"
        style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px',
            border: `1px solid ${COLORS.slate[200]}`,
            background: COLORS.slate[100],
            color: COLORS.slate[500],
            fontSize: '0.8125rem', fontWeight: 500,
            cursor: 'not-allowed',
            transition: 'all 0.15s ease',
        }}
    >
        <Lock size={12} /> {label}
    </div>
);

/** Pagination bar — enhanced with active page visual */
const Pagination = ({ page, totalPages, pageSize, onPageChange, onPageSizeChange }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderTop: `1px solid ${COLORS.border}`,
        flexWrap: 'wrap', gap: '12px',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: COLORS.slate[500] }}>Rows per page</span>
            <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                style={{
                    padding: '6px 12px', borderRadius: '8px', fontSize: '0.8125rem',
                    border: `1px solid ${COLORS.border}`, background: 'white',
                    cursor: 'pointer', outline: 'none',
                    transition: 'border-color 0.15s ease',
                }}
                onFocus={e => e.target.style.borderColor = COLORS.brand[600]}
                onBlur={e => e.target.style.borderColor = COLORS.border}
            >
                {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8125rem', color: COLORS.slate[500], marginRight: '4px' }}>
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
                        width: '32px', height: '32px', borderRadius: '8px',
                        border: `1px solid ${disabled ? COLORS.slate[200] : COLORS.border}`,
                        background: disabled ? COLORS.slate[50] : 'white',
                        color: disabled ? COLORS.slate[300] : COLORS.text.secondary,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: disabled ? 'default' : 'pointer',
                        transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => !disabled && (e.currentTarget.style.background = COLORS.slate[50])}
                    onMouseLeave={e => !disabled && (e.currentTarget.style.background = 'white')}
                >
                    <Ic size={14} />
                </button>
            ))}
        </div>
    </div>
);

/** Quick-view drawer — polished with darker overlay and smoother animations */
const QuickViewDrawer = ({ student, onClose, isPremium, onNavigate }) => {
    if (!student) return null;
    const tokenBadge = student.current_token?.status_badge ?? { bg: '#F1F5F9', color: '#475569', label: 'Unassigned' };
    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
                    zIndex: 40, animation: 'fadeIn 0.2s ease',
                }}
            />
            {/* Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(440px, 95vw)',
                background: 'white', zIndex: 50,
                boxShadow: '-16px 0 48px rgba(0,0,0,0.15)',
                display: 'flex', flexDirection: 'column',
                animation: 'slideInRight 0.25s ease',
                borderRadius: '16px 0 0 16px',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Avatar name={student.full_name} photoUrl={student.photo_url} size={44} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: COLORS.text.primary }}>
                                {student.full_name}
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: COLORS.slate[500], marginTop: '2px' }}>
                                {student.class && `${student.class}${student.section ? ` - ${student.section}` : ''}`}
                                {student.roll_number && ` · Roll ${student.roll_number}`}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            border: `1px solid ${COLORS.border}`, background: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: COLORS.slate[500],
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = COLORS.slate[50];
                            e.currentTarget.style.color = COLORS.text.primary;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = COLORS.slate[500];
                        }}
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {/* Token status banner */}
                    <div style={{
                        padding: '14px 16px', borderRadius: '12px',
                        background: tokenBadge.bg, marginBottom: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        border: `1px solid ${tokenBadge.color}20`,
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
                                color: tokenBadge.color, opacity: 0.8,
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
                            padding: '12px 0', borderBottom: `1px solid ${COLORS.border}`,
                        }}>
                            <span style={{ fontSize: '0.8125rem', color: COLORS.slate[500] }}>{label}</span>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: COLORS.text.primary }}>{value}</span>
                        </div>
                    ))}

                    {/* Recent scans — Premium locked vault */}
                    <div style={{ marginTop: '24px' }}>
                        <div style={{
                            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
                            textTransform: 'uppercase', color: COLORS.slate[500], marginBottom: '12px',
                        }}>
                            Recent Scans
                        </div>
                        {!isPremium ? (
                            <div style={{
                                padding: '18px', borderRadius: '10px',
                                border: `1px dashed ${COLORS.slate[200]}`,
                                background: COLORS.slate[50],
                                display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                                <Lock size={14} color={COLORS.slate[400]} />
                                <span style={{ fontSize: '0.8125rem', color: COLORS.slate[500] }}>
                                    Scan history available on Premium.
                                </span>
                            </div>
                        ) : student.recent_scans?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {student.recent_scans.slice(0, 5).map((scan) => (
                                    <div key={scan.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '10px 14px', borderRadius: '8px',
                                        background: COLORS.slate[50],
                                    }}>
                                        <span style={{
                                            fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px',
                                            borderRadius: '9999px',
                                            background: scan.result === 'SUCCESS' ? COLORS.success.bg : COLORS.danger.bg,
                                            color: scan.result === 'SUCCESS' ? COLORS.success.color : COLORS.danger.color,
                                        }}>
                                            {scan.result}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: COLORS.slate[500] }}>
                                            {formatRelativeTime(scan.created_at)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.8125rem', color: COLORS.slate[400] }}>No scan records</p>
                        )}
                    </div>
                </div>

                {/* Footer actions */}
                <div style={{
                    padding: '16px 24px', borderTop: `1px solid ${COLORS.border}`,
                    display: 'flex', gap: '10px',
                }}>
                    <button
                        onClick={() => { onNavigate(student.id); onClose(); }}
                        style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '6px', padding: '10px 18px', borderRadius: '8px',
                            border: 'none',
                            background: COLORS.brand[600],
                            color: 'white', fontWeight: 600, fontSize: '0.875rem',
                            cursor: 'pointer', transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = COLORS.brand[700]}
                        onMouseLeave={e => e.currentTarget.style.background = COLORS.brand[600]}
                    >
                        <Eye size={14} /> View full profile
                    </button>
                    {isPremium && (
                        <button
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '10px 18px', borderRadius: '8px',
                                border: `1px solid ${COLORS.border}`,
                                background: 'white', color: COLORS.text.secondary,
                                fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                                transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = COLORS.slate[50]}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
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
// Main Page — Students
// ─────────────────────────────────────────────────────────────────────────────

export default function Students() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const schoolId = user?.school_id;
    const [showFilters, setShowFilters] = useState(false);

    const hook = useStudents(schoolId);

    const classOptions   = useMemo(() => [...new Set(hook.students.map((s) => s.class).filter(Boolean))].sort(), [hook.students]);
    const sectionOptions = useMemo(() => [...new Set(hook.students.map((s) => s.section).filter(Boolean))].sort(), [hook.students]);

    const hasStudents = hook.students.length > 0;
    const isSearching = !!(hook.search || hook.filterClass || hook.filterSection || hook.filterTokenStatus || hook.filterDateFrom || hook.filterDateTo);
    const skeletonRows = Array.from({ length: 8 }, (_, i) => i);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* ══════════════════════════════════════════════════════════════
                Page header — Clean, well‑aligned
            ══════════════════════════════════════════════════════════════ */}
            <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                marginBottom: '28px', flexWrap: 'wrap', gap: '16px',
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display, inherit)', fontSize: '1.5rem',
                            fontWeight: 700, color: COLORS.text.primary, margin: 0,
                            letterSpacing: '-0.02em',
                        }}>
                            All Students
                        </h2>
                        {hook.totalStudents != null && (
                            <span style={{
                                display: 'inline-flex', alignItems: 'center',
                                padding: '3px 12px', borderRadius: '9999px',
                                fontSize: '0.75rem', fontWeight: 600,
                                background: COLORS.brand[50],
                                color: COLORS.brand[600],
                                border: `1px solid ${COLORS.brand[100]}`,
                            }}>
                                {hook.totalStudents.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <p style={{ color: COLORS.slate[500], fontSize: '0.875rem', margin: 0 }}>
                        Manage students, QR tokens and ID cards
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Export CSV — Premium only, else lock */}
                    {hook.isPremium ? (
                        <button
                            onClick={hook.onExportCSV}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '8px 16px', borderRadius: '8px',
                                border: `1px solid ${COLORS.border}`,
                                background: 'white', color: COLORS.text.secondary,
                                fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = COLORS.slate[50]}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                            <Download size={14} /> Export CSV
                        </button>
                    ) : (
                        <LockedAction label="Export CSV" icon={Download} />
                    )}

                    {/* Add Student — primary CTA */}
                    <button
                        onClick={hook.goToAddStudent}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '8px 20px', borderRadius: '8px', border: 'none',
                            background: COLORS.brand[600],
                            color: 'white', fontWeight: 600, fontSize: '0.875rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 12px rgba(37,99,235,0.35)',
                            transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.45)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 12px rgba(37,99,235,0.35)';
                        }}
                    >
                        <Plus size={16} /> Add Student
                    </button>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                Premium info banner — More polished, no upgrade button
            ══════════════════════════════════════════════════════════════ */}
            {!hook.isPremium && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px', marginBottom: '20px',
                    borderRadius: '12px',
                    background: COLORS.warning.bg,
                    border: `1px solid ${COLORS.warning.color}30`,
                    flexWrap: 'wrap', gap: '12px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'rgba(180,83,9,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <Lock size={16} color={COLORS.warning.color} />
                        </div>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: COLORS.warning.color }}>
                                Premium features locked:{' '}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: '#92400E' }}>
                                Section & token filters, bulk actions, CSV export, scan history in quick view.
                            </span>
                        </div>
                    </div>

                    {/* Lock indicator pill (instead of button) */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 14px', borderRadius: '8px',
                        background: 'rgba(180,83,9,0.15)',
                        border: `1px solid ${COLORS.warning.color}40`,
                    }}>
                        <Lock size={12} color={COLORS.warning.color} />
                        <span style={{
                            fontSize: '0.8125rem', fontWeight: 600,
                            color: COLORS.warning.color,
                        }}>
                            Premium features locked
                        </span>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                Main card — Elevated, modern
            ══════════════════════════════════════════════════════════════ */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden',
            }}>
                {/* ── Unified Search & Filter Bar ─────────────────────────── */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}`,
                    background: COLORS.slate[50],
                    flexWrap: 'wrap',
                }}>
                    <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
                        <Search
                            size={16}
                            style={{
                                position: 'absolute', left: '14px', top: '50%',
                                transform: 'translateY(-50%)',
                                color: COLORS.slate[400], pointerEvents: 'none',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search by name or admission number…"
                            value={hook.search}
                            onChange={(e) => hook.onSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 14px 10px 40px',
                                borderRadius: '10px',
                                border: `1px solid ${COLORS.border}`,
                                fontSize: '0.875rem', background: 'white',
                                outline: 'none', boxSizing: 'border-box',
                                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = COLORS.brand[600];
                                e.target.style.boxShadow = `0 0 0 3px ${COLORS.brand[50]}`;
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = COLORS.border;
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters((p) => !p)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '9px 16px', borderRadius: '8px',
                            border: `1px solid ${showFilters ? COLORS.brand[600] : COLORS.border}`,
                            background: showFilters ? COLORS.brand[50] : 'white',
                            color: showFilters ? COLORS.brand[600] : COLORS.text.secondary,
                            fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => !showFilters && (e.currentTarget.style.background = COLORS.slate[50])}
                        onMouseLeave={e => !showFilters && (e.currentTarget.style.background = 'white')}
                    >
                        <SlidersHorizontal size={14} />
                        Filters
                        {hook.activeFilterCount > 0 && (
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                minWidth: '18px', height: '18px', borderRadius: '50%',
                                background: COLORS.brand[600], color: 'white',
                                fontSize: '0.6875rem', fontWeight: 700,
                                padding: '0 4px',
                            }}>
                                {hook.activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Bulk actions (Premium) */}
                    {hook.isPremium && hook.hasSelection && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            marginLeft: 'auto', flexWrap: 'wrap',
                        }}>
                            <span style={{
                                fontSize: '0.8125rem', fontWeight: 600,
                                color: COLORS.brand[600],
                            }}>
                                {hook.selectedIds.size} selected
                            </span>
                            {[
                                { label: 'Assign tokens',  icon: QrCode,  action: hook.onBulkAssignTokens },
                                { label: 'Print cards',    icon: Printer, action: () => {} },
                                { label: 'Deactivate',     icon: UserX,   action: hook.onBulkDeactivate, danger: true },
                            ].map(({ label, icon: Ic, action, danger }) => (
                                <button
                                    key={label}
                                    onClick={action}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                        padding: '6px 12px', borderRadius: '7px',
                                        border: `1px solid ${danger ? '#FECACA' : COLORS.border}`,
                                        background: danger ? '#FEF2F2' : 'white',
                                        color: danger ? '#B91C1C' : COLORS.text.secondary,
                                        fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = danger ? '#FEE2E2' : COLORS.slate[50]}
                                    onMouseLeave={e => e.currentTarget.style.background = danger ? '#FEF2F2' : 'white'}
                                >
                                    <Ic size={13} /> {label}
                                </button>
                            ))}
                            <button
                                onClick={hook.clearSelection}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    width: '28px', height: '28px', borderRadius: '6px',
                                    border: `1px solid ${COLORS.border}`, background: 'white',
                                    cursor: 'pointer', color: COLORS.slate[500],
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = COLORS.slate[50]}
                                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                            >
                                <X size={13} />
                            </button>
                        </div>
                    )}

                    {/* Locked bulk actions */}
                    {!hook.isPremium && (
                        <div style={{ marginLeft: 'auto' }}>
                            <LockedAction label="Bulk actions" icon={QrCode} />
                        </div>
                    )}
                </div>

                {/* ── Filters panel ──────────────────────────────────────── */}
                {showFilters && (
                    <StudentFilters
                        isPremium={hook.isPremium}
                        filterClass={hook.filterClass}             onFilterClass={hook.onFilterClass}
                        filterSection={hook.filterSection}         onFilterSection={hook.onFilterSection}
                        filterTokenStatus={hook.filterTokenStatus} onFilterTokenStatus={hook.onFilterTokenStatus}
                        filterDateFrom={hook.filterDateFrom}       onFilterDateFrom={hook.onFilterDateFrom}
                        filterDateTo={hook.filterDateTo}           onFilterDateTo={hook.onFilterDateTo}
                        activeFilterCount={hook.activeFilterCount}
                        onClearAll={hook.clearAllFilters}
                        classOptions={classOptions}
                        sectionOptions={sectionOptions}
                    />
                )}

                {/* ── Table ──────────────────────────────────────────────── */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead>
                            <tr style={{
                                background: COLORS.slate[50],
                                borderBottom: `2px solid ${COLORS.border}`,
                            }}>
                                <th style={{ padding: '14px 16px', width: '44px' }}>
                                    {hook.isPremium ? (
                                        <input
                                            type="checkbox"
                                            checked={hook.isAllSelected}
                                            onChange={hook.toggleSelectAll}
                                            style={{ cursor: 'pointer', accentColor: COLORS.brand[600], width: '16px', height: '16px' }}
                                        />
                                    ) : (
                                        <div title="Bulk selection is a Premium feature">
                                            <Lock size={12} color={COLORS.slate[400]} />
                                        </div>
                                    )}
                                </th>
                                <SortHeader label="Student"      field={SORT_FIELDS.NAME}      sortField={hook.sortField} sortDir={hook.sortDir} onSort={hook.onSort} isPremium={hook.isPremium} alwaysAllowed />
                                <SortHeader label="Class"        field={SORT_FIELDS.CLASS}     sortField={hook.sortField} sortDir={hook.sortDir} onSort={hook.onSort} isPremium={hook.isPremium} />
                                <SortHeader label="Token Status" field={SORT_FIELDS.TOKEN}     sortField={hook.sortField} sortDir={hook.sortDir} onSort={hook.onSort} isPremium={hook.isPremium} />
                                {hook.isPremium ? (
                                    <SortHeader label="Last Scan" field={SORT_FIELDS.LAST_SCAN} sortField={hook.sortField} sortDir={hook.sortDir} onSort={hook.onSort} isPremium />
                                ) : (
                                    <th style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
                                            textTransform: 'uppercase', color: COLORS.slate[400],
                                        }}>
                                            Last Scan <Lock size={10} color={COLORS.slate[400]} />
                                        </span>
                                    </th>
                                )}
                                <th style={{ padding: '14px 16px', textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
                                        textTransform: 'uppercase', color: COLORS.slate[500],
                                    }}>
                                        Actions
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {hook.isLoading && skeletonRows.map((i) => (
                                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                                    <td style={{ padding: '16px 16px' }}><Skeleton w="18px" h="18px" radius="4px" /></td>
                                    <td style={{ padding: '16px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Skeleton w="36px" h="36px" radius="50%" />
                                            <div style={{ flex: 1 }}>
                                                <Skeleton w="140px" h="14px" />
                                                <div style={{ marginTop: '6px' }}><Skeleton w="90px" h="11px" /></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 16px' }}><Skeleton w="60px" /></td>
                                    <td style={{ padding: '16px 16px' }}><Skeleton w="80px" h="22px" radius="9999px" /></td>
                                    <td style={{ padding: '16px 16px' }}><Skeleton w="80px" /></td>
                                    <td style={{ padding: '16px 16px', textAlign: 'right' }}><Skeleton w="60px" /></td>
                                </tr>
                            ))}

                            {!hook.isLoading && hook.students.map((student) => {
                                const tokenBadge = student.current_token?.status_badge ?? {
                                    bg: '#F1F5F9', color: '#475569', label: 'Unassigned', status: 'UNASSIGNED',
                                };
                                const isSelected = hook.selectedIds.has(student.id);

                                return (
                                    <tr
                                        key={student.id}
                                        style={{
                                            borderBottom: `1px solid ${COLORS.border}`,
                                            background: isSelected ? COLORS.brand[50] : 'white',
                                            transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = COLORS.slate[50]; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = isSelected ? COLORS.brand[50] : 'white'; }}
                                    >
                                        <td style={{ padding: '16px 16px' }}>
                                            {hook.isPremium && (
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => hook.toggleSelect(student.id)}
                                                    style={{ cursor: 'pointer', accentColor: COLORS.brand[600], width: '16px', height: '16px' }}
                                                />
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Avatar name={student.full_name} photoUrl={student.photo_url} />
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: COLORS.text.primary }}>
                                                        {student.full_name}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: COLORS.slate[500], marginTop: '3px' }}>
                                                        {student.admission_number
                                                            ? `Adm: ${student.admission_number}`
                                                            : student.roll_number
                                                                ? `Roll: ${student.roll_number}`
                                                                : 'No ID assigned'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 16px', fontSize: '0.875rem', color: COLORS.text.secondary }}>
                                            {student.class
                                                ? `${student.class}${student.section ? ` - ${student.section}` : ''}`
                                                : <span style={{ color: COLORS.slate[300] }}>—</span>
                                            }
                                        </td>
                                        <td style={{ padding: '16px 16px' }}>
                                            <TokenBadge
                                                status={student.current_token?.status ?? 'UNASSIGNED'}
                                                label={tokenBadge.label}
                                            />
                                        </td>
                                        <td style={{ padding: '16px 16px', fontSize: '0.875rem', color: COLORS.text.muted }}>
                                            {hook.isPremium
                                                ? (student.last_scan_at ? formatRelativeTime(student.last_scan_at) : '—')
                                                : (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: COLORS.slate[400] }}>
                                                        <Lock size={11} color={COLORS.slate[400]} /> Premium
                                                    </span>
                                                )
                                            }
                                        </td>
                                        <td style={{ padding: '16px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                                {/* Quick view */}
                                                <button
                                                    onClick={() => hook.setDrawerStudent(student)}
                                                    title="Quick view"
                                                    style={{
                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                        border: `1px solid ${COLORS.border}`, background: 'white',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', color: COLORS.slate[500],
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.color = COLORS.brand[600]; e.currentTarget.style.borderColor = COLORS.brand[300]; }}
                                                    onMouseLeave={e => { e.currentTarget.style.color = COLORS.slate[500]; e.currentTarget.style.borderColor = COLORS.border; }}
                                                >
                                                    <Eye size={14} />
                                                </button>

                                                {/* Print card — Premium only */}
                                                {hook.isPremium && (
                                                    <button
                                                        title="Print ID card"
                                                        style={{
                                                            width: '32px', height: '32px', borderRadius: '8px',
                                                            border: `1px solid ${COLORS.border}`, background: 'white',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer', color: COLORS.slate[500],
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.borderColor = '#93C5FD'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.color = COLORS.slate[500]; e.currentTarget.style.borderColor = COLORS.border; }}
                                                    >
                                                        <Printer size={14} />
                                                    </button>
                                                )}

                                                {/* View full profile */}
                                                <button
                                                    onClick={() => hook.goToDetail(student.id)}
                                                    style={{
                                                        padding: '6px 14px', borderRadius: '8px',
                                                        border: `1px solid ${COLORS.border}`,
                                                        background: 'white',
                                                        color: COLORS.brand[600],
                                                        fontSize: '0.8125rem', fontWeight: 500,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = COLORS.brand[50]; e.currentTarget.style.borderColor = COLORS.brand[300]; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = COLORS.border; }}
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
                        padding: '80px 32px', textAlign: 'center',
                    }}>
                        {isSearching ? (
                            <>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '16px',
                                    background: COLORS.slate[100],
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '20px',
                                }}>
                                    <Search size={28} color={COLORS.slate[400]} />
                                </div>
                                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', color: COLORS.text.primary, margin: '0 0 8px' }}>
                                    No students match your search
                                </h3>
                                <p style={{ color: COLORS.slate[500], fontSize: '0.875rem', maxWidth: '320px', margin: '0 0 24px' }}>
                                    Try adjusting your search term or clearing the active filters.
                                </p>
                                <button
                                    onClick={() => { hook.onSearch(''); hook.clearAllFilters(); }}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '10px 20px', borderRadius: '8px',
                                        border: `1px solid ${COLORS.border}`,
                                        background: 'white', color: COLORS.brand[600],
                                        fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = COLORS.brand[50]}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    <X size={13} /> Clear search & filters
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{
                                    width: '72px', height: '72px', borderRadius: '18px',
                                    background: `linear-gradient(135deg, ${COLORS.brand[100]}, #BFDBFE)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '24px',
                                }}>
                                    <Users size={32} color={COLORS.brand[600]} />
                                </div>
                                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', color: COLORS.text.primary, margin: '0 0 10px' }}>
                                    No students yet
                                </h3>
                                <p style={{ color: COLORS.slate[500], fontSize: '0.875rem', maxWidth: '360px', margin: '0 0 28px', lineHeight: '1.5' }}>
                                    Add your first student to get started. You can then generate QR tokens and print ID cards.
                                </p>
                                <button
                                    onClick={hook.goToAddStudent}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '12px 24px', borderRadius: '8px', border: 'none',
                                        background: COLORS.brand[600],
                                        color: 'white', fontWeight: 600, fontSize: '0.9375rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
                                        transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.5)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.4)';
                                    }}
                                >
                                    <Plus size={16} /> Add First Student
                                </button>
                            </>
                        )}
                    </div>
                )}

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
                Quick-view drawer — slides in from the right
            ══════════════════════════════════════════════════════════════ */}
            <QuickViewDrawer
                student={hook.drawerStudent}
                onClose={() => hook.setDrawerStudent(null)}
                isPremium={hook.isPremium}
                onNavigate={hook.goToDetail}
            />

            {/* Animation keyframes (unchanged) */}
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