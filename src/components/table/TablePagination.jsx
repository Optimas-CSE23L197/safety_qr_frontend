/**
 * TablePagination — "Showing X–Y of Z" + page number buttons.
 * Matches the exact pagination style from AdminManagement.
 *
 * Props:
 *   page        number   — current page (1-based)
 *   totalPages  number
 *   total       number   — total record count
 *   pageSize    number   — records per page
 *   onChange    fn(page) — called when a page button is clicked
 *   maxButtons  number   — max page buttons shown (default 6)
 *
 * Usage:
 *   <TablePagination page={page} totalPages={totalPages} total={filtered.length} pageSize={10} onChange={setPage} />
 */

export default function TablePagination({
    page,
    totalPages,
    total,
    pageSize,
    onChange,
    maxButtons = 6,
}) {
    if (totalPages <= 1) return null;

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    // Build visible page range with ellipsis logic
    const pages = buildPages(page, totalPages, maxButtons);

    return (
        <div style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
        }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Showing {start}–{end} of {total}
            </span>

            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {pages.map((p, idx) =>
                    p === '...' ? (
                        <span key={`ellipsis-${idx}`} style={{
                            width: '32px', textAlign: 'center',
                            fontSize: '0.875rem', color: 'var(--text-muted)',
                        }}>
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onChange(p)}
                            style={{
                                width: '32px', height: '32px',
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: p === page ? 'var(--color-brand-500)' : 'var(--border-default)',
                                background: p === page ? 'var(--color-brand-600)' : 'white',
                                color: p === page ? 'white' : 'var(--text-secondary)',
                                fontWeight: p === page ? 700 : 400,
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {p}
                        </button>
                    )
                )}
            </div>
        </div>
    );
}

function buildPages(current, total, max) {
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + max - 1);

    if (end - start < max - 1) start = Math.max(1, end - max + 1);

    const pages = [];
    if (start > 1) { pages.push(1); if (start > 2) pages.push('...'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total) { if (end < total - 1) pages.push('...'); pages.push(total); }

    return pages;
}
