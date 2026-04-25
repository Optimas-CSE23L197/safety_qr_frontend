/**
 * TableEmptyState — thin wrapper that renders EmptyState inside a table <td>.
 * Used internally by DataTable; export for manual use when not using DataTable.
 *
 * Props: same as EmptyState (icon, title, subtitle, action)
 */

import EmptyState from '../shared/EmptyState.jsx';

export default function TableEmptyState({ colSpan = 1, ...props }) {
    return (
        <tr>
            <td colSpan={colSpan} style={{ padding: 0 }}>
                <EmptyState {...props} />
            </td>
        </tr>
    );
}
