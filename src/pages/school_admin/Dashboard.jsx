// src/pages/school_admin/Dashboard.jsx
/**
 * SCHOOL ADMIN DASHBOARD — RESQID
 * Redesigned: refined luxury-editorial aesthetic, crisp type system,
 * glass-morphism accents, smooth micro-interactions, rich data states.
 * All logic, hooks, and stores left untouched.
 *
 * FIX: Renamed `var` helper to `cssVar` to avoid reserved keyword conflict
 * that caused Babel/Vite parse error on line 278.
 */

import { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
    GraduationCap, Cpu, AlertTriangle, ScanLine,
    TrendingUp, TrendingDown, CheckCircle,
    ArrowRight, CreditCard, Users, RefreshCw,
    Lock, Timer, Fingerprint, Download, Sparkles,
    QrCode, UserPlus, Activity, Shield, Bell, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth.js';
import { useDashboard } from '../../hooks/useDashboard.js';
import useDashboardStore from '../../store/dashboardStore.js';
import { formatRelativeTime, humanizeEnum, formatCompact } from '../../utils/formatters.js';
import { ROUTES } from '../../config/routes.config.js';
import PlanCard from '../../components/dashboard/PlanCard.jsx';
import {
    TOKEN_DONUT_COLORS,
    SEVERITY_COLORS,
    MAX_PREVIEW_ROWS,
    CHART_PERIODS,
} from '../../constants/dashboard.constants.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
}

/** CSS variable helper — named cssVar to avoid collision with the `var` keyword */
const cssVar = (v) => `var(${v})`;

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;600;700;800;900&family=Epilogue:wght@300;400;500;600;700&display=swap');

:root {
  --d-display: 'Cabinet Grotesk', sans-serif;
  --d-body: 'Epilogue', sans-serif;

  /* Core palette — deep navy foundation */
  --d-bg: #F4F6FB;
  --d-surface: #FFFFFF;
  --d-surface-2: #F9FAFB;
  --d-border: rgba(15,25,60,0.07);
  --d-border-strong: rgba(15,25,60,0.12);

  /* Brand */
  --d-ink: #0C1226;
  --d-ink-2: #3D4A6B;
  --d-ink-3: #7B86A0;
  --d-ink-4: #B0B8CE;

  /* Accents */
  --d-blue: #2B59F5;
  --d-blue-dim: rgba(43,89,245,0.10);
  --d-blue-mid: rgba(43,89,245,0.18);
  --d-blue-dark: #1A3FD4;

  --d-emerald: #059669;
  --d-emerald-dim: rgba(5,150,105,0.10);

  --d-amber: #D97706;
  --d-amber-dim: rgba(217,119,6,0.10);

  --d-rose: #E11D48;
  --d-rose-dim: rgba(225,29,72,0.10);

  --d-violet: #7C3AED;
  --d-violet-dim: rgba(124,58,237,0.10);

  --d-cyan: #0891B2;
  --d-cyan-dim: rgba(8,145,178,0.10);

  /* Shadows */
  --d-shadow-xs: 0 1px 2px rgba(12,18,38,0.04);
  --d-shadow-sm: 0 2px 8px rgba(12,18,38,0.06), 0 1px 2px rgba(12,18,38,0.04);
  --d-shadow-md: 0 4px 16px rgba(12,18,38,0.08), 0 2px 4px rgba(12,18,38,0.04);
  --d-shadow-lg: 0 8px 32px rgba(12,18,38,0.10), 0 2px 8px rgba(12,18,38,0.06);
  --d-shadow-blue: 0 4px 20px rgba(43,89,245,0.30);

  --d-radius: 16px;
  --d-radius-sm: 10px;
  --d-radius-xs: 6px;
  --d-radius-pill: 999px;
}

.d-root * { box-sizing: border-box; margin: 0; padding: 0; }
.d-root { font-family: var(--d-body); background: var(--d-bg); min-height: 100vh; }

/* ── Skeleton ── */
@keyframes d-shimmer {
  0%   { background-position: -800px 0; }
  100% { background-position: 800px 0; }
}
.d-skel {
  background: linear-gradient(90deg, #E8ECF5 25%, #F1F4FA 50%, #E8ECF5 75%);
  background-size: 800px 100%;
  animation: d-shimmer 1.5s infinite linear;
  border-radius: 8px;
}

/* ── Card ── */
.d-card {
  background: var(--d-surface);
  border-radius: var(--d-radius);
  border: 1px solid var(--d-border);
  box-shadow: var(--d-shadow-sm);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

/* ── Stat card ── */
.d-stat { position: relative; overflow: hidden; }
.d-stat::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--d-radius);
  background: linear-gradient(135deg, rgba(255,255,255,0) 60%, rgba(255,255,255,0.7));
  pointer-events: none;
  z-index: 1;
}
.d-stat:hover {
  transform: translateY(-3px);
  box-shadow: var(--d-shadow-md);
}

/* ── Animations ── */
@keyframes d-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes d-scale {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
.d-anim { animation: d-up 0.5s cubic-bezier(0.22,1,0.36,1) both; }
.d-anim:nth-child(1) { animation-delay: 0ms; }
.d-anim:nth-child(2) { animation-delay: 60ms; }
.d-anim:nth-child(3) { animation-delay: 120ms; }
.d-anim:nth-child(4) { animation-delay: 180ms; }
.d-anim:nth-child(5) { animation-delay: 240ms; }

.d-scale { animation: d-scale 0.5s cubic-bezier(0.22,1,0.36,1) both; }

/* ── Buttons ── */
.d-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: var(--d-radius-sm);
  border: 1px solid var(--d-border-strong);
  background: var(--d-surface); color: var(--d-ink-2);
  font-family: var(--d-body); font-size: 0.8125rem; font-weight: 500;
  cursor: pointer; transition: all 0.15s ease;
  white-space: nowrap; box-shadow: var(--d-shadow-xs);
}
.d-btn-ghost:hover {
  background: var(--d-surface-2);
  border-color: var(--d-border-strong);
  color: var(--d-ink);
}
.d-btn-ghost:focus-visible { outline: 2px solid var(--d-blue); outline-offset: 2px; }

.d-btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 18px; border-radius: var(--d-radius-sm);
  border: none;
  background: var(--d-blue); color: #fff;
  font-family: var(--d-body); font-size: 0.8125rem; font-weight: 600;
  cursor: pointer; transition: all 0.15s ease;
  box-shadow: var(--d-shadow-blue);
}
.d-btn-primary:hover { background: var(--d-blue-dark); transform: translateY(-1px); }
.d-btn-primary:active { transform: translateY(0); }
.d-btn-primary:focus-visible { outline: 2px solid var(--d-blue); outline-offset: 2px; }

/* ── Period tabs ── */
.d-tab {
  padding: 5px 12px; border-radius: 7px; border: none;
  font-family: var(--d-body); font-size: 0.8rem; font-weight: 500;
  cursor: pointer; transition: all 0.15s ease; color: var(--d-ink-3);
  background: transparent;
}
.d-tab.active { background: var(--d-blue); color: #fff; box-shadow: 0 2px 8px rgba(43,89,245,0.28); }
.d-tab:not(.active):hover { background: var(--d-blue-dim); color: var(--d-blue); }

/* ── Scroll ── */
.d-scroll { scrollbar-width: thin; scrollbar-color: var(--d-border-strong) transparent; }
.d-scroll::-webkit-scrollbar { width: 3px; }
.d-scroll::-webkit-scrollbar-thumb { background: var(--d-border-strong); border-radius: 4px; }

/* ── Row hover ── */
.d-row {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 10px; border-radius: 10px;
  cursor: pointer; transition: background 0.12s ease;
}
.d-row:hover { background: var(--d-surface-2); }
.d-row:focus-visible { outline: 2px solid var(--d-blue); outline-offset: 2px; }

/* ── Divider ── */
.d-div { height: 1px; background: var(--d-border); margin: 1px 0; }

/* ── Responsive ── */
@media (max-width: 1200px) {
  .d-bottom { grid-template-columns: 1fr 1fr !important; }
  .d-plan-col { grid-column: 1 / -1; }
  .d-stats { grid-template-columns: repeat(3,1fr) !important; }
}
@media (max-width: 960px) {
  .d-charts { grid-template-columns: 1fr !important; }
  .d-donut-col { max-width: 100% !important; }
}
@media (max-width: 768px) {
  .d-stats { grid-template-columns: repeat(2,1fr) !important; }
  .d-bottom { grid-template-columns: 1fr !important; }
  .d-header-inner { flex-direction: column !important; align-items: flex-start !important; }
  .d-pad { padding: 16px !important; }
}
@media (max-width: 480px) {
  .d-stats { grid-template-columns: 1fr !important; }
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Style injector
// ─────────────────────────────────────────────────────────────────────────────

const injectStyles = (() => {
    let done = false;
    return () => {
        if (done) return;
        done = true;
        const el = document.createElement('style');
        el.textContent = STYLES;
        document.head.appendChild(el);
    };
})();

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────

const Sk = ({ w = '100%', h = '16px', r = '8px', style = {} }) => (
    <div className="d-skel" style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }} />
);

/** Coloured icon container */
const IconBox = ({ color, bg, icon: Icon, size = 17, boxSize = 38 }) => (
    <div style={{
        width: boxSize, height: boxSize, borderRadius: 10, flexShrink: 0,
        background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
        <Icon size={size} color={color} strokeWidth={2} />
    </div>
);

/** Premium/Basic plan badge */
const PlanBadge = ({ isPremium }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 10px', borderRadius: cssVar('--d-radius-pill'),
        fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em',
        textTransform: 'uppercase',
        background: isPremium
            ? 'linear-gradient(130deg,#F59E0B 0%,#EF4444 100%)'
            : cssVar('--d-surface-2'),
        color: isPremium ? '#fff' : cssVar('--d-ink-3'),
        border: isPremium ? 'none' : `1px solid ${cssVar('--d-border-strong')}`,
        boxShadow: isPremium ? '0 2px 8px rgba(239,68,68,0.30)' : 'none',
    }}>
        {isPremium && <Sparkles size={8} strokeWidth={2.5} />}
        {isPremium ? 'Premium' : 'Basic'}
    </span>
);

/** Coloured status dot */
const Dot = ({ color }) => (
    <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: color, display: 'inline-block', flexShrink: 0,
    }} />
);

/** Section heading row */
const SectionHead = ({ title, sub, action, actionPath }) => {
    const navigate = useNavigate();
    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: 20, gap: 12,
        }}>
            <div>
                <h3 style={{
                    fontFamily: cssVar('--d-display'), fontSize: '0.9375rem',
                    fontWeight: 700, color: cssVar('--d-ink'), lineHeight: 1.2,
                }}>
                    {title}
                </h3>
                {sub && (
                    <p style={{ fontSize: '0.78rem', color: cssVar('--d-ink-3'), marginTop: 3 }}>
                        {sub}
                    </p>
                )}
            </div>
            {action && actionPath && (
                <button className="d-btn-ghost" style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                    onClick={() => navigate(actionPath)}>
                    {action} <ChevronRight size={11} strokeWidth={2.5} />
                </button>
            )}
        </div>
    );
};

/** Chart tooltip */
const ChartTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: cssVar('--d-ink'), borderRadius: 12,
            padding: '10px 15px', border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
        }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', marginBottom: 8, letterSpacing: '0.04em' }}>
                {label}
            </p>
            {payload.map((e) => (
                <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Dot color={e.color} />
                    <span style={{ color: '#fff', fontSize: '0.8125rem', fontWeight: 600 }}>
                        {e.value}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        {e.name}
                    </span>
                </div>
            ))}
        </div>
    );
};

/** Error banner */
const ErrorBanner = ({ onRetry }) => (
    <div role="alert" style={{
        background: 'var(--d-rose-dim)', border: '1px solid rgba(225,29,72,0.20)',
        borderRadius: 12, padding: '14px 20px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={16} color="var(--d-rose)" strokeWidth={2} />
            <span style={{ fontWeight: 600, color: 'var(--d-rose)', fontSize: '0.875rem' }}>
                Failed to load dashboard data.
            </span>
        </div>
        <button className="d-btn-ghost" onClick={onRetry} style={{
            color: 'var(--d-rose)', borderColor: 'rgba(225,29,72,0.25)',
            fontSize: '0.8rem', padding: '5px 13px',
        }}>
            <RefreshCw size={12} strokeWidth={2} /> Retry
        </button>
    </div>
);

/** Empty / zero state */
const ZeroState = ({ icon: Icon, title, desc, action, actionPath, color = 'var(--d-blue)' }) => {
    const navigate = useNavigate();
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '32px 20px', textAlign: 'center', gap: 10,
        }}>
            <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: color.startsWith('var') ? `color-mix(in srgb, ${color} 12%, transparent)` : `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Icon size={22} color={color} strokeWidth={1.8} />
            </div>
            <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--d-ink)', marginBottom: 4 }}>
                    {title}
                </p>
                {desc && (
                    <p style={{ fontSize: '0.79rem', color: 'var(--d-ink-3)', maxWidth: 210, lineHeight: 1.5 }}>
                        {desc}
                    </p>
                )}
            </div>
            {action && actionPath && (
                <button className="d-btn-ghost" style={{ marginTop: 4, fontSize: '0.8rem' }}
                    onClick={() => navigate(actionPath)}>
                    {action} <ArrowRight size={12} />
                </button>
            )}
        </div>
    );
};

/** Status pill badge */
const StatusPill = ({ status, colorMap }) => {
    const c = colorMap?.[status] || { bg: 'var(--d-surface-2)', text: 'var(--d-ink-3)', dot: 'var(--d-ink-4)' };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 999,
            fontSize: '0.72rem', fontWeight: 600,
            background: c.bg, color: c.text, border: `1px solid ${c.border || 'transparent'}`,
            whiteSpace: 'nowrap', flexShrink: 0,
        }}>
            {c.dot && <Dot color={c.dot} />}
            {humanizeEnum(status)}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, color, bg, trend, trendLabel, loading, locked }) => (
    <div className="d-card d-stat d-anim" style={{ padding: '22px 22px 20px' }}>
        {/* Decorative gradient orb */}
        <div aria-hidden style={{
            position: 'absolute', top: -20, right: -20, width: 90, height: 90,
            borderRadius: '50%', background: bg, opacity: 0.6,
            filter: 'blur(12px)', pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <p style={{
                    fontFamily: cssVar('--d-body'), fontSize: '0.72rem', fontWeight: 600,
                    letterSpacing: '0.07em', textTransform: 'uppercase',
                    color: locked ? cssVar('--d-ink-4') : cssVar('--d-ink-3'),
                    lineHeight: 1,
                }}>
                    {label}
                </p>
                <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: locked ? cssVar('--d-surface-2') : bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${locked ? cssVar('--d-border') : 'transparent'}`,
                }}>
                    <Icon size={15} color={locked ? cssVar('--d-ink-4') : color} strokeWidth={2} />
                </div>
            </div>

            {/* Value */}
            <div style={{ marginTop: 14 }}>
                {loading ? (
                    <Sk h="32px" w="72px" style={{ marginTop: 2 }} />
                ) : locked ? (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, marginTop: 2,
                    }}>
                        <Lock size={13} color={cssVar('--d-ink-4')} strokeWidth={2} />
                        <span style={{
                            fontFamily: cssVar('--d-display'), fontSize: '1.5rem',
                            fontWeight: 800, color: cssVar('--d-border-strong'),
                            letterSpacing: '0.12em',
                        }}>
                            ——
                        </span>
                    </div>
                ) : (
                    <div style={{
                        fontFamily: cssVar('--d-display'), fontSize: '2.125rem',
                        fontWeight: 900, color: cssVar('--d-ink'), lineHeight: 1,
                        letterSpacing: '-0.02em',
                    }}>
                        {value}
                    </div>
                )}
            </div>

            {/* Trend */}
            {!loading && (
                <div style={{ marginTop: 10, minHeight: 18 }}>
                    {locked ? (
                        <span style={{
                            fontSize: '0.72rem', fontWeight: 600, color: cssVar('--d-amber'),
                            background: cssVar('--d-amber-dim'), padding: '2px 8px',
                            borderRadius: 4,
                        }}>
                            Premium only
                        </span>
                    ) : trendLabel ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            {trend === 'up'   && <TrendingUp   size={11} color="var(--d-emerald)" strokeWidth={2.5} />}
                            {trend === 'down' && <TrendingDown size={11} color="var(--d-rose)"    strokeWidth={2.5} />}
                            <span style={{
                                fontSize: '0.75rem', fontWeight: 500,
                                color: trend === 'up'   ? cssVar('--d-emerald')
                                     : trend === 'down' ? cssVar('--d-rose')
                                     : cssVar('--d-ink-3'),
                            }}>
                                {trendLabel}
                            </span>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

const SchoolAdminDashboard = () => {
    injectStyles();

    const { schoolId } = useAuth();
    const navigate = useNavigate();
    const [chartPeriod, setChartPeriod] = useState(7);

    const { plan, isPremium, subscriptionEnd, featureUsage } = useDashboardStore();
    const { data, isLoading, isError, refetch } = useDashboard(schoolId ?? null, chartPeriod);

    const stats           = data?.stats           ?? {};
    const scanTrend       = data?.scanTrend       ?? [];
    const tokenBreakdown  = data?.tokenBreakdown  ?? [];
    const recentAnomalies = data?.recentAnomalies ?? [];
    const pendingRequests = data?.pendingRequests ?? [];
    const subscription    = data?.subscription    ?? null;

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const handleExportCSV = () => {
        if (!scanTrend.length) return;
        const rows = scanTrend.map((r) => `${r.date},${r.success},${r.failed}`);
        const blob = new Blob([['Date,Success,Failed', ...rows].join('\n')], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = Object.assign(document.createElement('a'), {
            href: url, download: `scan-activity-${chartPeriod}d.csv`,
        });
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // ── SEVERITY colour map for status pills
    const SEV_MAP = {
        LOW:      { bg: '#ECFDF5', text: '#059669', dot: '#10B981', border: 'rgba(16,185,129,0.25)' },
        MEDIUM:   { bg: '#FFFBEB', text: '#D97706', dot: '#FBBF24', border: 'rgba(251,191,36,0.25)' },
        HIGH:     { bg: '#FFF1F2', text: '#E11D48', dot: '#F43F5E', border: 'rgba(244,63,94,0.25)' },
        CRITICAL: { bg: '#FFF1F2', text: '#BE123C', dot: '#E11D48', border: 'rgba(225,29,72,0.30)' },
    };

    return (
        <div className="d-root d-pad" style={{ padding: 28, maxWidth: 1440 }}>

            {/* ─────────── Header ─────────── */}
            <div className="d-header-inner" style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 28, gap: 16,
            }}>
                <div>
                    {/* Eyebrow */}
                    <p style={{
                        fontFamily: cssVar('--d-body'), fontSize: '0.72rem', fontWeight: 600,
                        letterSpacing: '0.09em', textTransform: 'uppercase',
                        color: cssVar('--d-ink-3'), marginBottom: 6,
                    }}>
                        School Admin · Overview
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <h1 style={{
                            fontFamily: cssVar('--d-display'), fontSize: '1.625rem',
                            fontWeight: 900, color: cssVar('--d-ink'), lineHeight: 1,
                            letterSpacing: '-0.02em',
                        }}>
                            {getGreeting()} 👋
                        </h1>
                        <PlanBadge isPremium={isPremium} />
                    </div>

                    <p style={{
                        color: cssVar('--d-ink-3'), fontSize: '0.8125rem',
                        marginTop: 5, fontWeight: 400,
                    }}>
                        {today}
                    </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {!isPremium && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '7px 14px', borderRadius: 9,
                            background: cssVar('--d-surface'), border: `1px solid ${cssVar('--d-border-strong')}`,
                            fontSize: '0.79rem', fontWeight: 500, color: cssVar('--d-ink-3'),
                            boxShadow: cssVar('--d-shadow-xs'),
                        }}>
                            <Lock size={12} strokeWidth={2} color={cssVar('--d-ink-4')} />
                            Premium features locked
                        </span>
                    )}
                    <button className="d-btn-ghost"
                        onClick={() => navigate(ROUTES.SCHOOL_ADMIN?.STUDENTS ?? '#')}>
                        <UserPlus size={13} strokeWidth={2} /> Register Student
                    </button>
                    <button className="d-btn-primary"
                        onClick={() => navigate(ROUTES.SCHOOL_ADMIN?.TOKEN_INVENTORY ?? '#')}>
                        <QrCode size={13} strokeWidth={2} /> Generate QR
                    </button>
                </div>
            </div>

            {/* ─────────── Banners ─────────── */}
            {isError && <ErrorBanner onRetry={refetch} />}

            {subscription?.status === 'PAST_DUE' && (
                <div role="alert" style={{
                    background: cssVar('--d-amber-dim'), border: '1px solid rgba(217,119,6,0.22)',
                    borderRadius: 12, padding: '13px 20px', marginBottom: 20,
                    display: 'flex', alignItems: 'center', gap: 12,
                }}>
                    <CreditCard size={16} color={cssVar('--d-amber')} strokeWidth={2} />
                    <p style={{ fontSize: '0.875rem', color: '#92400E', fontWeight: 500 }}>
                        <strong>Subscription payment overdue.</strong>&nbsp;
                        Please renew to avoid service interruption.
                    </p>
                </div>
            )}

            {/* ─────────── Stat Cards ─────────── */}
            <div className="d-stats" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5,1fr)',
                gap: 14, marginBottom: 20,
            }}>
                <StatCard
                    label="Total Students"
                    value={formatCompact(stats.totalStudents ?? 0)}
                    icon={GraduationCap}
                    color="var(--d-blue)" bg="var(--d-blue-dim)"
                    trend="up"
                    trendLabel={stats.newStudentsThisMonth ? `+${stats.newStudentsThisMonth} this month` : null}
                    loading={isLoading}
                />
                <StatCard
                    label="Active Tokens"
                    value={formatCompact(stats.activeTokens ?? 0)}
                    icon={Cpu}
                    color="var(--d-emerald)" bg="var(--d-emerald-dim)"
                    trendLabel={stats.totalTokens ? `${stats.totalTokens} total` : null}
                    loading={isLoading}
                />
                <StatCard
                    label="Today's Scans"
                    value={formatCompact(stats.todayScans ?? 0)}
                    icon={ScanLine}
                    color="var(--d-cyan)" bg="var(--d-cyan-dim)"
                    trend={stats.scanTrendUp === true ? 'up' : stats.scanTrendUp === false ? 'down' : null}
                    trendLabel={stats.scanChangePercent != null ? `${stats.scanChangePercent}% vs yesterday` : null}
                    loading={isLoading}
                />
                <StatCard
                    label="Avg Scan Time"
                    value={isPremium && stats.avgScanTimeMs != null ? `${stats.avgScanTimeMs}ms` : null}
                    icon={Timer}
                    color="var(--d-violet)" bg="var(--d-violet-dim)"
                    trendLabel={isPremium ? 'Per scan event' : null}
                    loading={isLoading} locked={!isPremium}
                />
                <StatCard
                    label="Unique Scanners"
                    value={isPremium && stats.uniqueScanners != null ? formatCompact(stats.uniqueScanners) : null}
                    icon={Fingerprint}
                    color="#DB2777" bg="rgba(219,39,119,0.10)"
                    trendLabel={isPremium ? 'Distinct devices' : null}
                    loading={isLoading} locked={!isPremium}
                />
            </div>

            {/* ─────────── Charts row ─────────── */}
            <div className="d-charts" style={{
                display: 'grid', gridTemplateColumns: '1fr 320px',
                gap: 14, marginBottom: 20,
            }}>

                {/* Scan Activity */}
                <div className="d-card d-scale" style={{ padding: 24 }}>
                    {/* Chart header */}
                    <div style={{
                        display: 'flex', alignItems: 'flex-start',
                        justifyContent: 'space-between', marginBottom: 22, gap: 12, flexWrap: 'wrap',
                    }}>
                        <div>
                            <h3 style={{
                                fontFamily: cssVar('--d-display'), fontSize: '0.9375rem',
                                fontWeight: 700, color: cssVar('--d-ink'),
                            }}>
                                Scan Activity
                            </h3>
                            <p style={{ fontSize: '0.78rem', color: cssVar('--d-ink-3'), marginTop: 3 }}>
                                Success vs failed — last {chartPeriod} days
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {/* Period switcher */}
                            <div style={{
                                display: 'flex', background: cssVar('--d-surface-2'),
                                border: `1px solid ${cssVar('--d-border-strong')}`,
                                borderRadius: 10, padding: 3, gap: 2,
                            }}>
                                {CHART_PERIODS.map(({ label, value, premiumOnly }) => {
                                    const locked = premiumOnly && !isPremium;
                                    const active = !locked && chartPeriod === value;
                                    return (
                                        <button
                                            key={value}
                                            className={`d-tab${active ? ' active' : ''}`}
                                            title={locked ? 'Premium only' : undefined}
                                            style={{
                                                color: locked ? cssVar('--d-ink-4') : undefined,
                                                cursor: locked ? 'not-allowed' : 'pointer',
                                            }}
                                            onClick={() => { if (!locked) setChartPeriod(value); }}
                                        >
                                            {locked && <Lock size={9} style={{ marginRight: 3 }} />}
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>

                            {isPremium && (
                                <button className="d-btn-ghost" onClick={handleExportCSV}
                                    style={{ padding: '5px 13px', fontSize: '0.79rem' }}
                                    aria-label="Export CSV">
                                    <Download size={12} strokeWidth={2} /> Export
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Legend dots */}
                    <div style={{ display: 'flex', gap: 18, marginBottom: 16 }}>
                        {[
                            { color: '#10B981', label: 'Success' },
                            { color: '#F43F5E', label: 'Failed' },
                        ].map((l) => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 24, height: 3, borderRadius: 2, background: l.color }} />
                                <span style={{ fontSize: '0.75rem', color: cssVar('--d-ink-3'), fontWeight: 500 }}>
                                    {l.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {isLoading ? (
                        <Sk h="210px" />
                    ) : (
                        <ResponsiveContainer width="100%" height={210} aria-label="Scan activity chart">
                            <AreaChart data={scanTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#10B981" stopOpacity={0.16} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#F43F5E" stopOpacity={0.12} />
                                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--d-border)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10.5, fill: 'var(--d-ink-3)', fontFamily: 'var(--d-body)' }}
                                    axisLine={false} tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10.5, fill: 'var(--d-ink-3)', fontFamily: 'var(--d-body)' }}
                                    axisLine={false} tickLine={false}
                                />
                                <Tooltip content={<ChartTip />} />
                                <Area
                                    type="monotone" dataKey="success" name="Success"
                                    stroke="#10B981" strokeWidth={2.5} fill="url(#gGreen)"
                                    dot={false} activeDot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                                />
                                <Area
                                    type="monotone" dataKey="failed" name="Failed"
                                    stroke="#F43F5E" strokeWidth={2.5} fill="url(#gRed)"
                                    dot={false} activeDot={{ r: 4, fill: '#F43F5E', strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Token Status donut */}
                <div className="d-card d-scale d-donut-col" style={{ padding: 24 }}>
                    <SectionHead
                        title="Token Status"
                        action={isPremium ? 'Manage' : undefined}
                        actionPath={isPremium ? ROUTES.SCHOOL_ADMIN?.TOKEN_INVENTORY : undefined}
                    />

                    {!isPremium ? (
                        <ZeroState
                            icon={Lock}
                            title="Premium feature"
                            desc="Detailed token breakdown is available on the Premium plan."
                            color="var(--d-ink-4)"
                        />
                    ) : isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
                            <Sk h="150px" w="150px" r="50%" />
                        </div>
                    ) : tokenBreakdown.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={148} aria-label="Token status donut">
                                <PieChart>
                                    <Pie
                                        data={tokenBreakdown} cx="50%" cy="50%"
                                        innerRadius={44} outerRadius={68}
                                        paddingAngle={4} dataKey="count" nameKey="status" strokeWidth={0}
                                    >
                                        {tokenBreakdown.map((entry) => (
                                            <Cell key={entry.status}
                                                fill={TOKEN_DONUT_COLORS[entry.status] || '#94A3B8'}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v, n) => [v, typeof n === 'string' ? humanizeEnum(n) : n]}
                                        contentStyle={{
                                            fontFamily: 'var(--d-body)', fontSize: '0.8rem',
                                            borderRadius: 10, border: '1px solid var(--d-border)',
                                            boxShadow: 'var(--d-shadow-md)',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Legend */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                                {tokenBreakdown.map((entry) => (
                                    <div key={entry.status} style={{
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between', fontSize: '0.8125rem',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                background: TOKEN_DONUT_COLORS[entry.status] || '#94A3B8',
                                                flexShrink: 0,
                                            }} />
                                            <span style={{ color: cssVar('--d-ink-2'), fontWeight: 500 }}>
                                                {humanizeEnum(entry.status)}
                                            </span>
                                        </div>
                                        <span style={{ fontWeight: 700, color: cssVar('--d-ink') }}>
                                            {entry.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <ZeroState
                            icon={QrCode}
                            title="No tokens yet"
                            desc="Generate your first QR token in Token Management."
                            action="Go to Token Management"
                            actionPath={ROUTES.SCHOOL_ADMIN?.TOKEN_INVENTORY}
                            color="var(--d-blue)"
                        />
                    )}
                </div>
            </div>

            {/* ─────────── Bottom grid ─────────── */}
            <div className="d-bottom" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 280px',
                gap: 14,
            }}>

                {/* Recent Anomalies */}
                <div className="d-card d-scale" style={{ padding: 24 }}>
                    <SectionHead
                        title="Recent Anomalies"
                        sub={
                            isLoading ? null
                            : recentAnomalies.length > 0
                                ? `${recentAnomalies.length} flagged scan${recentAnomalies.length > 1 ? 's' : ''}`
                                : 'No active anomalies'
                        }
                        action="View all"
                        actionPath={ROUTES.SCHOOL_ADMIN?.ANOMALIES}
                    />

                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[1,2,3].map((i) => <Sk key={i} h="54px" />)}
                        </div>
                    ) : recentAnomalies.length === 0 ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '24px 0',
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%',
                                background: cssVar('--d-emerald-dim'),
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                            }}>
                                <CheckCircle size={22} color={cssVar('--d-emerald')} strokeWidth={1.8} />
                            </div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: cssVar('--d-ink-2') }}>
                                All clear — no anomalies
                            </p>
                        </div>
                    ) : (
                        <div className="d-scroll" style={{
                            display: 'flex', flexDirection: 'column', gap: 1,
                            maxHeight: 272, overflowY: 'auto',
                        }}>
                            {recentAnomalies.slice(0, MAX_PREVIEW_ROWS).map((anomaly, idx) => (
                                <div key={anomaly.id}>
                                    <div
                                        className="d-row"
                                        tabIndex={0} role="button"
                                        aria-label={`Anomaly: ${humanizeEnum(anomaly.type)} for ${anomaly.student_name}`}
                                        onClick={() => navigate(ROUTES.SCHOOL_ADMIN?.ANOMALIES)}
                                        onKeyDown={(e) => e.key === 'Enter' && navigate(ROUTES.SCHOOL_ADMIN?.ANOMALIES)}
                                    >
                                        <IconBox
                                            icon={AlertTriangle}
                                            color="var(--d-rose)" bg="var(--d-rose-dim)"
                                            boxSize={36} size={15}
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontWeight: 600, fontSize: '0.855rem',
                                                color: cssVar('--d-ink'),
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                            }}>
                                                {humanizeEnum(anomaly.type)}
                                            </div>
                                            <div style={{ fontSize: '0.73rem', color: cssVar('--d-ink-3'), marginTop: 1 }}>
                                                {anomaly.student_name}
                                                {isPremium && ` · ${formatRelativeTime(anomaly.created_at)}`}
                                            </div>
                                        </div>
                                        {isPremium ? (
                                            <StatusPill
                                                status={anomaly.severity ?? 'HIGH'}
                                                colorMap={SEV_MAP}
                                            />
                                        ) : (
                                            <div style={{
                                                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                                background: (anomaly.severity === 'HIGH' || anomaly.severity === 'CRITICAL')
                                                    ? 'var(--d-rose)' : '#FCD34D',
                                            }} />
                                        )}
                                    </div>
                                    {idx < Math.min(recentAnomalies.length, MAX_PREVIEW_ROWS) - 1 && (
                                        <div className="d-div" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {!isPremium && recentAnomalies.length > 0 && (
                        <div style={{
                            marginTop: 14, padding: '10px 14px', borderRadius: 9,
                            background: cssVar('--d-amber-dim'), border: '1px solid rgba(217,119,6,0.20)',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <Lock size={11} color={cssVar('--d-amber')} strokeWidth={2} />
                            <span style={{ fontSize: '0.78rem', color: '#92400E', fontWeight: 500 }}>
                                Severity breakdown &amp; drill-down on Premium.
                            </span>
                        </div>
                    )}
                </div>

                {/* Parent Requests */}
                <div className="d-card d-scale" style={{ padding: 24 }}>
                    <SectionHead
                        title="Parent Requests"
                        sub={
                            isLoading ? null
                            : pendingRequests.length > 0
                                ? `${pendingRequests.length} awaiting review`
                                : 'All caught up'
                        }
                        action="Review all"
                        actionPath={ROUTES.SCHOOL_ADMIN?.PARENT_REQUESTS}
                    />

                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[1,2,3].map((i) => <Sk key={i} h="54px" />)}
                        </div>
                    ) : pendingRequests.length === 0 ? (
                        <ZeroState
                            icon={Users}
                            title="All caught up!"
                            desc="No pending parent requests right now."
                            color="var(--d-emerald)"
                        />
                    ) : (
                        <div className="d-scroll" style={{
                            display: 'flex', flexDirection: 'column', gap: 1,
                            maxHeight: 272, overflowY: 'auto',
                        }}>
                            {pendingRequests.slice(0, MAX_PREVIEW_ROWS).map((req, idx) => (
                                <div key={req.id}>
                                    <div
                                        className="d-row"
                                        tabIndex={0} role="button"
                                        aria-label={`Request from ${req.parent_name} for ${req.student_name}`}
                                        onClick={() => navigate(ROUTES.SCHOOL_ADMIN?.PARENT_REQUESTS)}
                                        onKeyDown={(e) => e.key === 'Enter' && navigate(ROUTES.SCHOOL_ADMIN?.PARENT_REQUESTS)}
                                    >
                                        <IconBox
                                            icon={Users}
                                            color="var(--d-blue)" bg="var(--d-blue-dim)"
                                            boxSize={36} size={15}
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontWeight: 600, fontSize: '0.855rem',
                                                color: cssVar('--d-ink'),
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                            }}>
                                                {req.student_name}
                                            </div>
                                            <div style={{ fontSize: '0.73rem', color: cssVar('--d-ink-3'), marginTop: 1 }}>
                                                {req.parent_name}
                                                {isPremium && ` · ${humanizeEnum(req.type)} · ${formatRelativeTime(req.created_at)}`}
                                            </div>
                                        </div>
                                        <StatusPill
                                            status="PENDING"
                                            colorMap={{
                                                PENDING: {
                                                    bg: '#FFFBEB', text: '#B45309',
                                                    dot: '#F59E0B', border: 'rgba(245,158,11,0.25)',
                                                },
                                            }}
                                        />
                                    </div>
                                    {idx < Math.min(pendingRequests.length, MAX_PREVIEW_ROWS) - 1 && (
                                        <div className="d-div" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Plan card */}
                <div className="d-plan-col">
                    <PlanCard
                        plan={plan}
                        isPremium={isPremium}
                        subscriptionEnd={subscriptionEnd}
                        featureUsage={featureUsage}
                        hideUpgradeButton={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default SchoolAdminDashboard;