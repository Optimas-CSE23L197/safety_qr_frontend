import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SectionHeader = ({ title, subtitle, actionLabel, actionPath }) => {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                    {title}
                </h3>
                {subtitle && <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)', margin: '2px 0 0' }}>{subtitle}</p>}
            </div>
            {actionLabel && (
                <button
                    onClick={() => navigate(actionPath)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px',
                        borderRadius: '6px', border: '1px solid var(--border-default)',
                        background: 'transparent', fontSize: '0.8125rem', fontWeight: 500,
                        color: 'var(--color-brand-600)', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-brand-50)'; e.currentTarget.style.borderColor = 'var(--color-brand-300)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                >
                    {actionLabel} <ArrowRight size={13} />
                </button>
            )}
        </div>
    );
};

export default SectionHeader;
