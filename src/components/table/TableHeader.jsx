/**
 * TableHeader — <thead> row for DataTable.
 * Separated so it can be reused or extended with sort arrows later.
 *
 * Props:
 *   columns  Array<{ key, label, align, width }>
 *
 * Usage (internal, used by DataTable automatically):
 *   <TableHeader columns={columns} />
 */

export default function TableHeader({ columns = [] }) {
    return (
        <thead>
            <tr style={{
                borderBottom: '1px solid var(--border-default)',
                background: 'var(--color-slate-50)',
            }}>
                {columns.map(col => (
                    <th
                        key={col.key}
                        style={{
                            padding: '11px 16px',
                            textAlign: col.align ?? 'left',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            width: col.width,
                            userSelect: 'none',
                        }}
                    >
                        {col.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
}