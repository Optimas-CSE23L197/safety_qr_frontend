import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Heart, Pill, User, AlertTriangle, Cpu, ScanLine, CheckCircle, Clock } from 'lucide-react';
import { maskTokenHash, formatDate, formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';

const MOCK_STUDENT = {
    id: 'stu-1', first_name: 'Aarav', last_name: 'Sharma', class: 'Class 9', section: 'A',
    is_active: true, created_at: new Date(Date.now() - 86400000 * 120).toISOString(),
    parents: [{ name: 'Suresh Sharma', phone: '+91 98765 43210', relationship: 'Father', is_primary: true }, { name: 'Meena Sharma', phone: '+91 91234 56789', relationship: 'Mother', is_primary: false }],
    token: { token_hash: 'A1B2C3D4E5F6G7H8', status: 'ACTIVE', assigned_at: new Date(Date.now() - 86400000 * 90).toISOString(), expires_at: new Date(Date.now() + 86400000 * 275).toISOString() },
    emergency: { blood_group: 'B+', allergies: 'Peanuts', conditions: 'Mild asthma', medications: 'Salbutamol inhaler (as needed)', doctor_name: 'Dr. Ravi Kumar', doctor_phone: '+91 98000 12345', contacts: [{ name: 'Suresh Sharma', phone: '+91 98765 43210', relationship: 'Father', priority: 1 }, { name: 'Meena Sharma', phone: '+91 91234 56789', relationship: 'Mother', priority: 2 }] },
    recent_scans: [
        { id: 's1', result: 'SUCCESS', created_at: new Date(Date.now() - 3600000).toISOString(), ip_city: 'Mumbai', device: 'Chrome/Android' },
        { id: 's2', result: 'SUCCESS', created_at: new Date(Date.now() - 86400000).toISOString(), ip_city: 'Mumbai', device: 'Chrome/Android' },
        { id: 's3', result: 'SUCCESS', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), ip_city: 'Mumbai', device: 'Safari/iOS' },
        { id: 's4', result: 'INVALID', created_at: new Date(Date.now() - 86400000 * 3).toISOString(), ip_city: 'Pune', device: 'Chrome/Windows' },
        { id: 's5', result: 'SUCCESS', created_at: new Date(Date.now() - 86400000 * 4).toISOString(), ip_city: 'Mumbai', device: 'Chrome/Android' },
    ],
};

const SCAN_STYLE = { SUCCESS: { bg: '#ECFDF5', color: '#047857', Icon: CheckCircle }, INVALID: { bg: '#FEF2F2', color: '#B91C1C', Icon: AlertTriangle }, EXPIRED: { bg: '#FFFBEB', color: '#B45309', Icon: Clock }, REVOKED: { bg: '#FEF2F2', color: '#B91C1C', Icon: AlertTriangle } };

const Section = ({ title, icon: Icon, children }) => (
    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {Icon && <Icon size={16} color="var(--color-brand-600)" />}
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
    </div>
);

const InfoRow = ({ label, value, mono }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-slate-100)' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600, fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{value || '—'}</span>
    </div>
);

export default function StudentDetail() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const student = MOCK_STUDENT;
    const name = `${student.first_name} ${student.last_name}`;
    const token = student.token;
    const emergency = student.emergency;

    const tokenStatusStyle = { ACTIVE: { bg: '#ECFDF5', color: '#047857' }, UNASSIGNED: { bg: '#F1F5F9', color: '#475569' }, EXPIRED: { bg: '#FFFBEB', color: '#B45309' }, REVOKED: { bg: '#FEF2F2', color: '#B91C1C' } };
    const ts = tokenStatusStyle[token?.status] || tokenStatusStyle.UNASSIGNED;

    return (
        <div style={{ maxWidth: '1100px' }}>
            {/* Back + Header */}
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', marginBottom: '20px' }}>
                <ArrowLeft size={15} /> Back to Students
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-brand-700)' }}>
                    {student.first_name[0]}{student.last_name[0]}
                </div>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{name}</h2>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{student.class} · Section {student.section} · Enrolled {formatDate(student.created_at)}</span>
                </div>
                <span style={{ marginLeft: 'auto', padding: '5px 14px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, background: student.is_active ? '#ECFDF5' : '#F1F5F9', color: student.is_active ? '#047857' : '#64748B' }}>{student.is_active ? 'Active' : 'Inactive'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* Token */}
                <Section title="Token & ID Card" icon={Cpu}>
                    {token ? <>
                        <InfoRow label="Status" value={<span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: ts.bg, color: ts.color }}>{humanizeEnum(token.status)}</span>} />
                        <InfoRow label="Token Hash" value={maskTokenHash(token.token_hash)} mono />
                        <InfoRow label="Assigned" value={formatRelativeTime(token.assigned_at)} />
                        <InfoRow label="Expires" value={formatDate(token.expires_at)} />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                            <button style={{ flex: 1, padding: '8px', borderRadius: '7px', border: '1px solid var(--color-brand-300)', background: 'var(--color-brand-50)', color: 'var(--color-brand-600)', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>View QR</button>
                            <button style={{ flex: 1, padding: '8px', borderRadius: '7px', border: '1px solid #EF4444', background: '#FEF2F2', color: '#B91C1C', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>Revoke</button>
                        </div>
                    </> : <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No token assigned</div>}
                </Section>

                {/* Parents */}
                <Section title="Parents / Guardians" icon={User}>
                    {student.parents.map(p => (
                        <div key={p.name} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {p.name}
                                    {p.is_primary && <span style={{ padding: '1px 7px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8' }}>Primary</span>}
                                </div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.relationship}</div>
                            </div>
                            <a href={`tel:${p.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: 'var(--color-brand-600)', fontWeight: 600, textDecoration: 'none' }}>
                                <Phone size={13} /> {p.phone}
                            </a>
                        </div>
                    ))}
                </Section>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* Emergency Profile */}
                <Section title="Emergency Profile" icon={Heart}>
                    <InfoRow label="Blood Group" value={<span style={{ fontWeight: 700, color: '#B91C1C' }}>{emergency.blood_group}</span>} />
                    <InfoRow label="Allergies" value={emergency.allergies} />
                    <InfoRow label="Conditions" value={emergency.conditions} />
                    <InfoRow label="Medications" value={emergency.medications} />
                    <InfoRow label="Doctor" value={emergency.doctor_name} />
                    <InfoRow label="Doctor Phone" value={emergency.doctor_phone} />
                    <div style={{ marginTop: '12px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emergency Contacts</div>
                        {emergency.contacts.map(c => (
                            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--color-slate-100)' }}>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({c.relationship})</span>
                                </div>
                                <a href={`tel:${c.phone}`} style={{ fontSize: '0.8125rem', color: 'var(--color-brand-600)', fontWeight: 600, textDecoration: 'none' }}>{c.phone}</a>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Recent Scans */}
                <Section title="Recent Scan Activity" icon={ScanLine}>
                    {student.recent_scans.map(scan => {
                        const s = SCAN_STYLE[scan.result] || SCAN_STYLE.INVALID;
                        return (
                            <div key={scan.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid var(--color-slate-100)' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <s.Icon size={15} color={s.color} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: s.color }}>{humanizeEnum(scan.result)}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{scan.ip_city} · {scan.device.split('/')[0]}</div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>{formatRelativeTime(scan.created_at)}</div>
                            </div>
                        );
                    })}
                </Section>
            </div>
        </div>
    );
}