import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config.js';

const AlertBanner = ({ pastDueCount }) => {
    const navigate = useNavigate();
    if (!pastDueCount) return null;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '12px', padding: '12px 18px', borderRadius: '10px',
            background: 'var(--color-warning-50)', border: '1px solid var(--color-warning-200)',
            marginBottom: '24px',
        }}>
            <AlertTriangle size={16} color="var(--color-warning-600)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-warning-800)' }}>
                    {pastDueCount} schools have past-due subscriptions.{' '}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-warning-700)' }}>
                    Review and follow up to prevent service interruption.
                </span>
            </div>
            <button
                onClick={() => navigate(ROUTES.SUPER_ADMIN.SUBSCRIPTIONS)}
                style={{
                    padding: '6px 14px', borderRadius: '7px',
                    border: '1px solid var(--color-warning-500)',
                    background: 'white', color: 'var(--color-warning-700)',
                    fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                }}
            >
                View Subscriptions
            </button>
        </div>
    );
};

export default AlertBanner;