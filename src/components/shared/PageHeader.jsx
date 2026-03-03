/**
 * PageHeader — consistent page title + subtitle + optional action button area.
 *
 * Props:
 *   title      string   — page heading
 *   subtitle   string   — small muted text below title
 *   action     node     — right-side slot (Button, etc.)
 *   back       bool     — shows a back chevron (uses window.history)
 *   onBack     fn       — custom back handler
 *
 * Usage:
 *   <PageHeader title="Admin Management" subtitle="26 administrators · 24 active" action={<Button icon={Plus}>Create Admin</Button>} />
 *   <PageHeader title="School Details" back />
 */

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({
    title,
    subtitle,
    action,
    back = false,
    onBack,
}) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) { onBack(); return; }
        navigate(-1);
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            marginBottom: '24px', gap: '16px',
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {back && (
                    <button
                        onClick={handleBack}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '34px', height: '34px', borderRadius: '8px', marginTop: '2px',
                            border: '1px solid var(--border-default)', background: 'white',
                            cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0,
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                        <ArrowLeft size={16} />
                    </button>
                )}
                <div>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.375rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                        lineHeight: 1.2,
                    }}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem',
                            margin: '4px 0 0',
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {action && (
                <div style={{ flexShrink: 0 }}>
                    {action}
                </div>
            )}
        </div>
    );
}