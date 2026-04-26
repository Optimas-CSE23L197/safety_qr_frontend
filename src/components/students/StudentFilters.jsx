// src/components/students/StudentFilters.jsx
/**
 * StudentFilters
 * Basic:   search + class/grade filter
 * Premium: + section, token status, date range
 *
 * Props mirror the shape returned by useStudents.
 */

import { Lock, Sparkles, X, SlidersHorizontal } from 'lucide-react';
import { useNavigate }                           from 'react-router-dom';
import { ROUTES }                                from '../../config/routes.config.js';
import { TOKEN_STATUS_OPTIONS }                  from '../../hooks/useStudents.js';

// ─── tiny shared atoms ────────────────────────────────────────────────────────

const FilterLabel = ({ children }) => (
    <span style={{
        fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--text-muted)',
        display: 'block', marginBottom: '4px',
    }}>
        {children}
    </span>
);

const Select = ({ value, onChange, children, disabled }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
            padding: '7px 10px', borderRadius: '8px', fontSize: '0.8125rem',
            border: '1px solid var(--border-default)',
            background: disabled ? 'var(--color-slate-50)' : 'white',
            color: disabled ? 'var(--color-slate-400)' : 'var(--text-primary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            minWidth: '140px', appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
            paddingRight: '28px',
        }}
    >
        {children}
    </select>
);

const DateInput = ({ value, onChange, placeholder }) => (
    <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
            padding: '7px 10px', borderRadius: '8px', fontSize: '0.8125rem',
            border: '1px solid var(--border-default)',
            background: 'white', color: 'var(--text-primary)',
            minWidth: '140px',
        }}
    />
);

// ─── locked premium slot ──────────────────────────────────────────────────────

const LockedFilter = ({ label, navigateTo }) => {
    const navigate = useNavigate();
    return (
        <div>
            <FilterLabel>{label}</FilterLabel>
            <button
                onClick={() => navigate(navigateTo)}
                title="Upgrade to Premium to unlock"
                style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '7px 12px', borderRadius: '8px',
                    border: '1px dashed var(--color-warning-300)',
                    background: 'var(--color-warning-50)',
                    color: 'var(--color-warning-600)',
                    fontSize: '0.8125rem', fontWeight: 500,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-warning-100)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-warning-50)'}
            >
                <Lock size={11} /> Premium
            </button>
        </div>
    );
};

// ─── main component ───────────────────────────────────────────────────────────

export default function StudentFilters({
    isPremium,

    filterClass,    onFilterClass,
    filterSection,  onFilterSection,
    filterTokenStatus, onFilterTokenStatus,
    filterDateFrom, onFilterDateFrom,
    filterDateTo,   onFilterDateTo,

    activeFilterCount,
    onClearAll,

    // classOptions and sectionOptions come from store-derived unique values
    classOptions   = [],
    sectionOptions = [],
}) {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
            gap: '12px', padding: '16px 20px',
            background: 'var(--color-slate-50)',
            borderTop: '1px solid var(--border-default)',
            borderBottom: '1px solid var(--border-default)',
        }}>

            {/* ── Class / Grade (Basic) ──────────────────────────── */}
            <div>
                <FilterLabel>Class / Grade</FilterLabel>
                <Select value={filterClass} onChange={onFilterClass}>
                    <option value="">All classes</option>
                    {classOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </Select>
            </div>

            {/* ── Section (Premium) ─────────────────────────────── */}
            {isPremium ? (
                <div>
                    <FilterLabel>Section</FilterLabel>
                    <Select value={filterSection} onChange={onFilterSection}>
                        <option value="">All sections</option>
                        {sectionOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </Select>
                </div>
            ) : (
                <LockedFilter label="Section" navigateTo={ROUTES.SCHOOL_ADMIN.SETTINGS} />
            )}

            {/* ── Token Status (Premium) ────────────────────────── */}
            {isPremium ? (
                <div>
                    <FilterLabel>Token Status</FilterLabel>
                    <Select value={filterTokenStatus} onChange={onFilterTokenStatus}>
                        {TOKEN_STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </Select>
                </div>
            ) : (
                <LockedFilter label="Token Status" navigateTo={ROUTES.SCHOOL_ADMIN.SETTINGS} />
            )}

            {/* ── Date range (Premium) ──────────────────────────── */}
            {isPremium ? (
                <>
                    <div>
                        <FilterLabel>Enrolled from</FilterLabel>
                        <DateInput value={filterDateFrom} onChange={onFilterDateFrom} placeholder="From" />
                    </div>
                    <div>
                        <FilterLabel>Enrolled to</FilterLabel>
                        <DateInput value={filterDateTo} onChange={onFilterDateTo} placeholder="To" />
                    </div>
                </>
            ) : (
                <LockedFilter label="Date Range" navigateTo={ROUTES.SCHOOL_ADMIN.SETTINGS} />
            )}

            {/* ── Clear filters ─────────────────────────────────── */}
            {activeFilterCount > 0 && (
                <button
                    onClick={onClearAll}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '7px 12px', borderRadius: '8px',
                        border: '1px solid var(--border-default)',
                        background: 'white', color: 'var(--text-muted)',
                        fontSize: '0.8125rem', cursor: 'pointer',
                        transition: 'color 0.15s',
                        alignSelf: 'flex-end',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger-600)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <X size={12} /> Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
                </button>
            )}

            {/* ── Premium upsell pill (Basic only) ─────────────── */}
            {!isPremium && (
                <button
                    onClick={() => navigate(ROUTES.SCHOOL_ADMIN.SETTINGS)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '7px 14px', borderRadius: '8px', border: 'none',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        color: 'white', fontWeight: 600, fontSize: '0.8125rem',
                        cursor: 'pointer', marginLeft: 'auto',
                        boxShadow: '0 2px 8px rgba(217,119,6,0.30)',
                        transition: 'transform 0.1s ease',
                        alignSelf: 'flex-end',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Sparkles size={12} /> Unlock all filters
                </button>
            )}
        </div>
    );
}