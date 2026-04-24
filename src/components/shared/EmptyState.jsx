/**
 * EmptyState — centred empty/zero-data illustration with message and optional CTA.
 *
 * Props:
 *   icon     Lucide component (default: Inbox)
 *   title    string
 *   subtitle string
 *   action   node     — optional CTA button
 *
 * Usage:
 *   <EmptyState icon={Users} title="No administrators found" subtitle="Try adjusting your search or filters." />
 *   <EmptyState icon={Building2} title="No schools yet" action={<Button icon={Plus}>Register School</Button>} />
 */

import { Inbox } from 'lucide-react';

export default function EmptyState({
    icon: Icon = Inbox,
    title = 'Nothing here yet',
    subtitle,
    action,
}) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '60px 20px', textAlign: 'center',
        }}>
            <div style={{
                width: '56px', height: '56px', borderRadius: '14px',
                background: 'var(--color-slate-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
            }}>
                <Icon size={26} color="var(--text-muted)" strokeWidth={1.5} />
            </div>
            <p style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                margin: '0 0 6px',
            }}>
                {title}
            </p>
            {subtitle && (
                <p style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    margin: '0 0 20px',
                    maxWidth: '280px',
                    lineHeight: 1.5,
                }}>
                    {subtitle}
                </p>
            )}
            {action}
        </div>
    );
}
