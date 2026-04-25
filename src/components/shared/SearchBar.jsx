/**
 * SearchBar — filter pill row + search input in a card.
 * Matches the filter bar pattern used in AdminManagement, AllSchools, ScanLogs, etc.
 *
 * Props:
 *   value          string       — search input value
 *   onChange       fn           — search input onChange
 *   placeholder    string
 *   filters        Array<{ label, value }> — pill filter options
 *   activeFilter   string       — currently active filter value
 *   onFilterChange fn(value)    — called when a filter pill is clicked
 *   extraActions   node         — additional controls rendered after filters (e.g. date picker)
 *
 * Usage:
 *   <SearchBar
 *     value={search} onChange={e => setSearch(e.target.value)}
 *     placeholder="Search name, email..."
 *     filters={ROLES.map(r => ({ label: humanizeEnum(r), value: r }))}
 *     activeFilter={roleFilter}
 *     onFilterChange={setRoleFilter}
 *   />
 */

import { Search } from 'lucide-react';

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Search...',
    filters = [],
    activeFilter,
    onFilterChange,
    extraActions,
}) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-card)',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
        }}>
            {/* Filter pills */}
            {filters.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {filters.map(f => (
                        <button
                            key={f.value}
                            onClick={() => onFilterChange?.(f.value)}
                            style={{
                                padding: '6px 13px',
                                borderRadius: '7px',
                                border: '1px solid',
                                borderColor: activeFilter === f.value ? 'var(--color-brand-500)' : 'var(--border-default)',
                                background: activeFilter === f.value ? 'var(--color-brand-600)' : 'white',
                                color: activeFilter === f.value ? 'white' : 'var(--text-secondary)',
                                fontWeight: activeFilter === f.value ? 700 : 400,
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            )}

            {extraActions}

            {/* Search input */}
            <div style={{ marginLeft: 'auto', position: 'relative' }}>
                <Search size={15} style={{
                    position: 'absolute', left: '10px', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                    pointerEvents: 'none',
                }} />
                <input
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={{
                        padding: '7px 12px 7px 32px',
                        border: '1px solid var(--border-default)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        width: '240px',
                        transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                />
            </div>
        </div>
    );
}
