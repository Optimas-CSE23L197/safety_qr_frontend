/**
 * DataTable — generic table matching the AdminManagement table style.
 *
 * Props:
 *   columns   Array<Column>   — column definitions
 *   rows      Array<object>   — data rows
 *   loading   bool
 *   emptyIcon Lucide component
 *   emptyMessage string
 *
 * Column shape:
 *   {
 *     key:    string          — row[key] passed as first arg to render()
 *     label:  string          — header text
 *     render: (value, row) => node   — optional custom renderer
 *     width:  string          — optional CSS width
 *     align:  'left'|'right'|'center'
 *   }
 *
 * Usage:
 *   const columns = [
 *     { key: 'name', label: 'Name', render: (_, row) => <Avatar name={row.name} subtitle={row.email} /> },
 *     { key: 'role', label: 'Role', render: (v) => <Badge>{v}</Badge> },
 *     { key: 'created_at', label: 'Joined', render: formatDate },
 *   ];
 *   <DataTable columns={columns} rows={paginated} />
 */

import { Users } from 'lucide-react';
import EmptyState from '../shared/EmptyState.jsx';
import Spinner from '../ui/Spinner.jsx';
import TableHeader from './TableHeader.jsx';

export default function DataTable({
    columns = [],
    rows = [],
    loading = false,
    emptyIcon,
    emptyMessage = 'No data found',
}) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <TableHeader columns={columns} />
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length}>
                                <Spinner center />
                            </td>
                        </tr>
                    ) : rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length}>
                                <EmptyState
                                    icon={emptyIcon ?? Users}
                                    title={emptyMessage}
                                />
                            </td>
                        </tr>
                    ) : rows.map((row, idx) => (
                        <tr
                            key={row.id ?? idx}
                            style={{
                                borderBottom: idx < rows.length - 1 ? '1px solid var(--border-default)' : 'none',
                                transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            {columns.map(col => (
                                <td
                                    key={col.key}
                                    style={{
                                        padding: '13px 16px',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)',
                                        textAlign: col.align ?? 'left',
                                        width: col.width,
                                        whiteSpace: col.noWrap ? 'nowrap' : undefined,
                                    }}
                                >
                                    {col.render
                                        ? col.render(row[col.key], row)
                                        : (row[col.key] ?? '—')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
