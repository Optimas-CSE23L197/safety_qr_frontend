/**
 * AUTH LAYOUT — Centered layout for login page
 */

import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #0A1628 0%, #0F2044 50%, #1A3260 100%)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(37,99,235,0.15) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(30,64,175,0.2) 0%, transparent 50%)`,
            }} />

            {/* Grid dots pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
            }} />

            {/* Left brand panel */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '60px',
                position: 'relative',
                maxWidth: '520px',
            }}>
                <div style={{ marginBottom: '48px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '32px',
                        boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.2,
                        marginBottom: '16px',
                    }}>
                        School Management<br />Platform
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.55)',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        maxWidth: '360px',
                    }}>
                        Secure, centralized management for student ID cards, token systems, and campus access control.
                    </p>
                </div>

                {/* Feature list */}
                {['Student token & card management', 'Real-time scan monitoring', 'Parent communication portal', 'Emergency profile access'].map((feature) => (
                    <div key={feature} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#3B82F6',
                            flexShrink: 0,
                        }} />
                        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
                            {feature}
                        </span>
                    </div>
                ))}
            </div>

            {/* Right: Form panel */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                position: 'relative',
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: 'rgba(255,255,255,0.97)',
                    borderRadius: '20px',
                    padding: '40px',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
