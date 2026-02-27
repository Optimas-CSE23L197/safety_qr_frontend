import { useState } from 'react';
import { QrCode, Download, RefreshCw, User, Printer, Search, Eye, CheckCircle } from 'lucide-react';
import { getFullName, getInitials, maskTokenHash, formatDate, humanizeEnum } from '../../../utils/formatters.js';
import useAuth from '../../../hooks/useAuth.js';
import useDebounce from '../../../hooks/useDebounce.js';

const MOCK_STUDENTS = Array.from({ length: 16 }, (_, i) => ({
    id: `stu-${i + 1}`,
    first_name: ['Aarav', 'Priya', 'Rohit', 'Sneha', 'Karan', 'Divya', 'Arjun', 'Meera', 'Vikram', 'Ananya', 'Raj', 'Pooja', 'Dev', 'Riya', 'Aditya', 'Nisha'][i],
    last_name: ['Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Joshi', 'Verma', 'Shah', 'Mehta', 'Reddy', 'Nair', 'Iyer', 'Chopra', 'Bansal', 'Malhotra', 'Kapoor'][i],
    class: `Class ${Math.floor(i / 4) + 8}`, section: ['A', 'B', 'C', 'D'][i % 4],
    token_hash: i % 4 !== 3 ? `QR${Math.random().toString(36).slice(2, 14).toUpperCase()}` : null,
    token_status: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'UNASSIGNED'][i % 4],
    qr_generated_at: i % 4 !== 3 ? new Date(Date.now() - i * 86400000 * 30).toISOString() : null,
}));

const QRCodeDisplay = ({ studentName, tokenHash }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {/* Simulated QR code visual */}
        <div style={{ width: '120px', height: '120px', background: 'white', border: '2px solid var(--color-slate-200)', borderRadius: '8px', padding: '8px', display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '1.5px' }}>
            {Array.from({ length: 49 }, (_, i) => {
                const corners = [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 43, 44, 45, 46, 48];
                const seed = (tokenHash?.charCodeAt(i % tokenHash.length) || i) * 17;
                const filled = corners.includes(i) ? true : (seed % 3 !== 0);
                return <div key={i} style={{ background: filled ? '#0F172A' : 'white', borderRadius: '1px' }} />;
            })}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{maskTokenHash(tokenHash || '')}</div>
    </div>
);

export default function QRManagement() {
    const { can } = useAuth();
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [generated, setGenerated] = useState(new Set());
    const debouncedSearch = useDebounce(search, 300);

    const filtered = MOCK_STUDENTS.filter(s =>
        !debouncedSearch || getFullName(s.first_name, s.last_name).toLowerCase().includes(debouncedSearch.toLowerCase()) || s.class.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    const selectedStudent = MOCK_STUDENTS.find(s => s.id === selected);
    const hasToken = selectedStudent?.token_status === 'ACTIVE';

    return (
        <div style={{ maxWidth: '1200px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>QR Management</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>View and download student QR codes for ID cards</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
                {/* Student list */}
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-default)' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or class..." style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                                onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                        </div>
                    </div>
                    <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                        {filtered.map((student, idx) => {
                            const name = getFullName(student.first_name, student.last_name);
                            const isSelected = selected === student.id;
                            const hasActiveToken = student.token_status === 'ACTIVE';
                            return (
                                <div key={student.id} onClick={() => setSelected(student.id)}
                                    style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: isSelected ? 'var(--color-brand-50)' : 'transparent', borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-default)' : 'none', borderLeft: isSelected ? '3px solid var(--color-brand-500)' : '3px solid transparent', transition: 'all 0.1s' }}
                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--color-slate-50)'; }}
                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: isSelected ? 'var(--color-brand-100)' : 'var(--color-slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8125rem', color: isSelected ? 'var(--color-brand-700)' : 'var(--text-muted)', flexShrink: 0 }}>
                                        {getInitials(name)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.class} – {student.section}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {hasActiveToken
                                            ? <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: '#ECFDF5', color: '#047857' }}>QR Ready</span>
                                            : <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>No Token</span>
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* QR Preview Panel */}
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                    {!selectedStudent ? (
                        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <QrCode size={40} style={{ marginBottom: '12px', opacity: 0.25, display: 'block', margin: '0 auto 16px' }} />
                            <div style={{ fontWeight: 500, marginBottom: '6px' }}>Select a student</div>
                            <div style={{ fontSize: '0.875rem' }}>Click any student to preview their QR code</div>
                        </div>
                    ) : (
                        <>
                            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-brand-700)' }}>
                                        {getInitials(getFullName(selectedStudent.first_name, selectedStudent.last_name))}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{getFullName(selectedStudent.first_name, selectedStudent.last_name)}</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{selectedStudent.class} – {selectedStudent.section}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                {hasToken ? (
                                    <>
                                        <QRCodeDisplay studentName={getFullName(selectedStudent.first_name, selectedStudent.last_name)} tokenHash={selectedStudent.token_hash} />
                                        <div style={{ width: '100%', padding: '12px', background: 'var(--color-slate-50)', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOKEN STATUS</span>
                                                <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: '#ECFDF5', color: '#047857' }}>ACTIVE</span>
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{maskTokenHash(selectedStudent.token_hash)}</div>
                                            {selectedStudent.qr_generated_at && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Generated {formatDate(selectedStudent.qr_generated_at)}</div>}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '8px', background: 'linear-gradient(135deg,#2563EB,#1E40AF)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                                                <Download size={15} /> Download PNG
                                            </button>
                                            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 14px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}>
                                                <Printer size={15} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                        <QrCode size={40} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
                                        <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>No active token</div>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Assign an active token to this student to generate a QR code.</p>
                                        <button style={{ padding: '8px 18px', borderRadius: '8px', background: 'var(--color-brand-600)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                                            Assign Token
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}