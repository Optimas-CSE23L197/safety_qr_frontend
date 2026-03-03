/**
 * StatusBadge — semantic status pill. Thin wrapper around Badge
 * with a pre-wired status → colour map for the most common statuses
 * used across the platform (school, admin, subscription, scan statuses).
 *
 * STATUS MAP:
 *   active / enabled / online / success / paid        → green
 *   inactive / disabled / offline / failed / expired  → red
 *   pending / trial / processing                       → amber
 *   suspended / cancelled                              → slate
 *   info / syncing                                     → blue
 *
 * Props:
 *   status   string   — raw status string (case-insensitive)
 *   dot      bool     — show dot instead of relying on text (default false)
 *
 * Usage:
 *   <StatusBadge status="active" />
 *   <StatusBadge status={school.subscription_status} />
 *   <StatusBadge status="PENDING" />
 */

import Badge from '../ui/Badge.jsx';

const STATUS_MAP = {
    // green
    active: 'success',
    enabled: 'success',
    online: 'success',
    success: 'success',
    paid: 'success',
    completed: 'success',
    verified: 'success',
    // red
    inactive: 'danger',
    disabled: 'danger',
    offline: 'danger',
    failed: 'danger',
    expired: 'danger',
    error: 'danger',
    rejected: 'danger',
    // amber
    pending: 'warning',
    trial: 'warning',
    processing: 'warning',
    review: 'warning',
    // slate
    suspended: 'neutral',
    cancelled: 'neutral',
    archived: 'neutral',
    inactive2: 'neutral',
    // blue
    info: 'info',
    syncing: 'info',
    scheduled: 'info',
};

export default function StatusBadge({ status = '', dot = false }) {
    const key = status.toLowerCase().replace(/[^a-z]/g, '');
    const variant = STATUS_MAP[key] ?? 'neutral';
    const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return <Badge variant={variant} dot={dot}>{label}</Badge>;
}