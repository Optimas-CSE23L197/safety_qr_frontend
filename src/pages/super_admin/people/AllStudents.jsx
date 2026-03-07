/**
 * ALL STUDENTS — Super Admin
 * Schema models: Student, Token, Card, School, EmergencyProfile
 *
 * Production pattern:
 *   - All search/filter/sort hits the API (debounced)
 *   - Server returns paginated results + total count
 *   - Never loads all students client-side
 *
 * To wire to real API: replace `simulateAPI()` with your fetch calls.
 * Suggested endpoint: GET /api/super/students?q=&school=&status=&class=&page=&limit=20
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Users, Search, SlidersHorizontal, X, ChevronDown,
    ChevronLeft, ChevronRight, Eye, ShieldOff, ShieldCheck,
    RotateCcw, CreditCard, AlertTriangle, CheckCircle2,
    XCircle, Clock, Zap, Building2, BookOpen, Hash,
    Phone, Calendar, Download, RefreshCw, Loader2,
    BadgeAlert, CircleDot, Fingerprint, Layers,
    UserX, UserCheck, AlertCircle, Check, Copy,
    HeartPulse, Smartphone, KeyRound, Ban
} from 'lucide-react';

// ─── SCHEMA-ALIGNED MOCK DATA ─────────────────────────────────────────────────
// Student: id, school_id, first_name, last_name, class, section, is_active,
//          created_at, deleted_at, photo_url
// Token:   id, student_id, status (UNASSIGNED|ISSUED|ACTIVE|INACTIVE|REVOKED|EXPIRED)
// Card:    id, student_id, card_number, print_status (PENDING|PRINTED|REPRINTED|FAILED)

const SCHOOLS = [
    { id: 'sch-001', name: 'Greenwood International', code: 'GWI' },
    { id: 'sch-002', name: 'Sunrise Academy', code: 'SRA' },
    { id: 'sch-003', name: 'Delhi Public School R3', code: 'DPS' },
    { id: 'sch-004', name: "St. Mary's Convent", code: 'SMC' },
    { id: 'sch-005', name: 'Modern High School', code: 'MHS' },
];

const TOKEN_STATUS = ['UNASSIGNED', 'ISSUED', 'ACTIVE', 'INACTIVE', 'REVOKED', 'EXPIRED'];
const PRINT_STATUS = ['PENDING', 'PRINTED', 'REPRINTED', 'FAILED'];
const CLASSES = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randId(prefix) { return `${prefix}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`; }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); }

const TOTAL_MOCK = 247;
const ALL_STUDENTS = Array.from({ length: TOTAL_MOCK }, (_, i) => {
    const firstName = ['Aarav', 'Ananya', 'Arjun', 'Diya', 'Ishaan', 'Kavya', 'Rohan', 'Priya', 'Vivaan', 'Siya', 'Aditya', 'Meera', 'Kiran', 'Riya', 'Arnav', 'Neha', 'Dev', 'Pooja', 'Shiv', 'Nisha'][i % 20];
    const lastName = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Verma', 'Mehta', 'Shah', 'Joshi', 'Nair', 'Reddy', 'Rao', 'Iyer', 'Das', 'Bose', 'Mishra', 'Tiwari', 'Pandey', 'Kapoor', 'Malhotra'][Math.floor(i / 20) % 20];
    const schoolObj = SCHOOLS[i % SCHOOLS.length];
    const tokenSt = rand(TOKEN_STATUS);
    const printSt = rand(PRINT_STATUS);
    const isActive = i % 11 !== 0;
    return {
        id: `stu-${String(i + 1).padStart(5, '0')}`,
        school_id: schoolObj.id,
        school: schoolObj,
        first_name: firstName,
        last_name: lastName,
        class: rand(CLASSES),
        section: rand(SECTIONS),
        is_active: isActive,
        created_at: daysAgo(Math.floor(Math.random() * 365)),
        deleted_at: !isActive && i % 20 === 0 ? daysAgo(10) : null,
        photo_url: null,
        token: {
            id: randId('TOK'),
            status: tokenSt,
            expires_at: tokenSt === 'ACTIVE' ? daysAgo(-180) : null,
            activated_at: tokenSt === 'ACTIVE' || tokenSt === 'INACTIVE' ? daysAgo(30) : null,
        },
        card: {
            id: randId('CRD'),
            card_number: `CRD-${String(i + 1001).padStart(6, '0')}`,
            print_status: printSt,
            printed_at: printSt === 'PRINTED' || printSt === 'REPRINTED' ? daysAgo(15) : null,
        },
        emergency: {
            blood_group: rand(BLOOD_GROUPS),
            allergies: i % 7 === 0 ? 'Peanuts, Dust' : null,
        },
    };
});

// ─── SERVER-SIDE SIMULATION ───────────────────────────────────────────────────
// Replace this entire function with: const res = await fetch(`/api/super/students?${params}`)
async function simulateAPI({ q, schoolId, activeStatus, tokenStatus, printStatus, classFilter, page, limit }) {
    await new Promise(r => setTimeout(r, 320));
    let results = [...ALL_STUDENTS];
    if (q) {
        const lq = q.toLowerCase();
        results = results.filter(s =>
            s.first_name.toLowerCase().includes(lq) ||
            s.last_name.toLowerCase().includes(lq) ||
            s.id.toLowerCase().includes(lq) ||
            s.card.card_number.toLowerCase().includes(lq) ||
            s.token.id.toLowerCase().includes(lq) ||
            s.school.name.toLowerCase().includes(lq)
        );
    }
    if (schoolId !== 'ALL') results = results.filter(s => s.school_id === schoolId);
    if (activeStatus !== 'ALL') results = results.filter(s => activeStatus === 'ACTIVE' ? s.is_active : !s.is_active);
    if (tokenStatus !== 'ALL') results = results.filter(s => s.token.status === tokenStatus);
    if (printStatus !== 'ALL') results = results.filter(s => s.card.print_status === printStatus);
    if (classFilter !== 'ALL') results = results.filter(s => s.class === classFilter);
    const total = results.length;
    const data = results.slice((page - 1) * limit, page * limit);
    return { data, total, page, limit };
}

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const TOKEN_CFG = {
    ACTIVE: { label: 'Active', color: '#10B981', bg: '#ECFDF5' },
    ISSUED: { label: 'Issued', color: '#6366F1', bg: '#EEF2FF' },
    INACTIVE: { label: 'Inactive', color: '#F59E0B', bg: '#FFFBEB' },
    UNASSIGNED: { label: 'Unassigned', color: '#94A3B8', bg: '#F1F5F9' },
    REVOKED: { label: 'Revoked', color: '#EF4444', bg: '#FEF2F2' },
    EXPIRED: { label: 'Expired', color: '#6B7280', bg: '#F3F4F6' },
};
const PRINT_CFG = {
    PRINTED: { label: 'Printed', color: '#10B981', bg: '#ECFDF5' },
    PENDING: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB' },
    REPRINTED: { label: 'Reprinted', color: '#6366F1', bg: '#EEF2FF' },
    FAILED: { label: 'Failed', color: '#EF4444', bg: '#FEF2F2' },
};

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const initials = s => `${s.first_name[0]}${s.last_name?.[0] || ''}`.toUpperCase();
const avatarColor = id => {
    const colors = ['#6366F1', '#10B981', '#F59E0B', '#0EA5E9', '#8B5CF6', '#EC4899', '#14B8A6'];
    let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % colors.length;
    return colors[h];
};

const LIMIT = 20;

// ─── DRAWER ───────────────────────────────────────────────────────────────────
function StudentDrawer({ student: raw, onClose, onAction }) {
    const [student, setStudent] = useState(raw);
    const [busy, setBusy] = useState(null);
    const [done, setDone] = useState(null);
    const [copied, setCopied] = useState(null);

    useEffect(() => { setStudent(raw); setBusy(null); setDone(null); }, [raw]);
    if (!student) return null;

    const copy = (val, key) => { navigator.clipboard.writeText(val).catch(() => { }); setCopied(key); setTimeout(() => setCopied(null), 1800); };

    const doAction = async (type) => {
        setBusy(type);
        await new Promise(r => setTimeout(r, 1000));
        let updated = { ...student };
        if (type === 'activate') updated.is_active = true;
        if (type === 'deactivate') updated.is_active = false;
        if (type === 'revoke') updated = { ...updated, token: { ...updated.token, status: 'REVOKED' } };
        if (type === 'reset') updated = { ...updated, token: { ...updated.token, status: 'UNASSIGNED' } };
        setStudent(updated);
        setBusy(null); setDone(type);
        onAction(student.id, type, updated);
        setTimeout(() => setDone(null), 2000);
    };

    const ac = avatarColor(student.id);
    const tc = TOKEN_CFG[student.token.status] || TOKEN_CFG.UNASSIGNED;
    const pc = PRINT_CFG[student.card.print_status] || PRINT_CFG.PENDING;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 300, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(6px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ width: '100%', maxWidth: 500, background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 50px rgba(0,0,0,0.18)', animation: 'slideIn 0.25s cubic-bezier(0.22,1,0.36,1)' }}>

                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E293B)', padding: '28px 28px 24px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                                {initials(student)}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>{student.first_name} {student.last_name}</h2>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '3px 0 0', fontFamily: 'monospace' }}>{student.id}</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                            <X size={15} color="rgba(255,255,255,0.6)" />
                        </button>
                    </div>

                    {/* Quick status strip */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <Chip label={student.is_active ? 'Active' : 'Inactive'} color={student.is_active ? '#10B981' : '#EF4444'} bg={student.is_active ? '#ECFDF5' : '#FEF2F2'} dark />
                        <Chip label={`Token: ${tc.label}`} color={tc.color} bg={tc.bg} dark />
                        <Chip label={`Card: ${pc.label}`} color={pc.color} bg={pc.bg} dark />
                    </div>
                </div>

                {/* Scrollable body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>

                    {/* Profile */}
                    <DSection title="Student Profile" icon={Users} color="#6366F1">
                        <DRow label="School" value={student.school?.name} sub={student.school?.code} />
                        <DRow label="Class" value={`Class ${student.class} — Section ${student.section}`} />
                        <DRow label="Student ID" value={<CopyVal val={student.id} k="sid" copied={copied} onCopy={copy} />} />
                        <DRow label="Enrolled" value={fmtDate(student.created_at)} />
                        <DRow label="Status" value={<Chip label={student.is_active ? 'Active' : 'Inactive'} color={student.is_active ? '#10B981' : '#EF4444'} bg={student.is_active ? '#ECFDF5' : '#FEF2F2'} />} />
                    </DSection>

                    {/* Token */}
                    <DSection title="Token Control" icon={KeyRound} color="#F59E0B">
                        <DRow label="Token ID" value={<CopyVal val={student.token.id} k="tid" copied={copied} onCopy={copy} />} />
                        <DRow label="Status" value={<Chip label={tc.label} color={tc.color} bg={tc.bg} />} />
                        <DRow label="Activated" value={fmtDate(student.token.activated_at)} />
                        <DRow label="Expires" value={fmtDate(student.token.expires_at)} />
                    </DSection>

                    {/* Card */}
                    <DSection title="Physical Card" icon={CreditCard} color="#0EA5E9">
                        <DRow label="Card Number" value={<CopyVal val={student.card.card_number} k="cnum" copied={copied} onCopy={copy} />} />
                        <DRow label="Print Status" value={<Chip label={pc.label} color={pc.color} bg={pc.bg} />} />
                        <DRow label="Printed At" value={fmtDate(student.card.printed_at)} />
                    </DSection>

                    {/* Emergency */}
                    <DSection title="Emergency Profile" icon={HeartPulse} color="#EF4444">
                        <DRow label="Blood Group" value={<span style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.9rem' }}>{student.emergency?.blood_group || '—'}</span>} />
                        <DRow label="Allergies" value={student.emergency?.allergies || 'None recorded'} />
                    </DSection>

                    {/* Failure alert */}
                    {(student.token.status === 'REVOKED' || student.token.status === 'EXPIRED') && (
                        <div style={{ background: '#FEF2F2', borderRadius: 12, padding: '12px 16px', border: '1px solid #FCA5A5', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <AlertTriangle size={15} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
                            <div>
                                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Token {student.token.status}</p>
                                <p style={{ fontSize: '0.82rem', color: '#B91C1C', fontWeight: 500, margin: '3px 0 0' }}>Student cannot be scanned until token is reset.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div style={{ padding: '16px 28px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <p style={{ fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Actions</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {/* Activate / Deactivate */}
                        {student.is_active ? (
                            <ActBtn icon={UserX} label="Deactivate" type="deactivate" busy={busy} done={done} color="#EF4444" bg="#FEF2F2" onClick={() => doAction('deactivate')} />
                        ) : (
                            <ActBtn icon={UserCheck} label="Activate" type="activate" busy={busy} done={done} color="#10B981" bg="#ECFDF5" onClick={() => doAction('activate')} />
                        )}

                        {/* Revoke token */}
                        <ActBtn icon={Ban} label="Revoke Token" type="revoke" busy={busy} done={done} color="#F59E0B" bg="#FFFBEB"
                            disabled={student.token.status === 'REVOKED' || student.token.status === 'UNASSIGNED'}
                            onClick={() => doAction('revoke')} />

                        {/* Reset token */}
                        <ActBtn icon={RotateCcw} label="Reset Token" type="reset" busy={busy} done={done} color="#6366F1" bg="#EEF2FF"
                            onClick={() => doAction('reset')} />

                        {/* Reprinted flag */}
                        <ActBtn icon={CreditCard} label="Mark Reprinted" type="reprint" busy={busy} done={done} color="#0EA5E9" bg="#E0F2FE"
                            onClick={() => doAction('reprint')} />
                    </div>

                    <button onClick={onClose} style={{ padding: '10px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AllStudentsPage() {
    const [students, setStudents] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState('');
    const [debouncedQ, setDebouncedQ] = useState('');
    const [schoolF, setSchoolF] = useState('ALL');
    const [activeF, setActiveF] = useState('ALL');
    const [tokenF, setTokenF] = useState('ALL');
    const [printF, setPrintF] = useState('ALL');
    const [classF, setClassF] = useState('ALL');
    const [showFilters, setShowFilters] = useState(false);
    const [selected, setSelected] = useState(null);
    const [toast, setToast] = useState(null);
    const debounceRef = useRef(null);

    // Debounce search
    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => { setDebouncedQ(q); setPage(1); }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [q]);

    // Fetch — replace simulateAPI with real API call
    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await simulateAPI({ q: debouncedQ, schoolId: schoolF, activeStatus: activeF, tokenStatus: tokenF, printStatus: printF, classFilter: classF, page, limit: LIMIT });
            setStudents(res.data);
            setTotal(res.total);
        } finally {
            setLoading(false);
        }
    }, [debouncedQ, schoolF, activeF, tokenF, printF, classF, page]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const activeFilters = [schoolF !== 'ALL', activeF !== 'ALL', tokenF !== 'ALL', printF !== 'ALL', classF !== 'ALL'].filter(Boolean).length;
    const clearFilters = () => { setSchoolF('ALL'); setActiveF('ALL'); setTokenF('ALL'); setPrintF('ALL'); setClassF('ALL'); setPage(1); };

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };

    const handleAction = (id, type) => {
        setStudents(prev => prev.map(s => {
            if (s.id !== id) return s;
            let u = { ...s };
            if (type === 'activate') u.is_active = true;
            if (type === 'deactivate') u.is_active = false;
            if (type === 'revoke') u = { ...u, token: { ...u.token, status: 'REVOKED' } };
            if (type === 'reset') u = { ...u, token: { ...u.token, status: 'UNASSIGNED' } };
            return u;
        }));
        const msgs = { activate: 'Student activated', deactivate: 'Student deactivated', revoke: 'Token revoked', reset: 'Token reset', reprint: 'Card marked for reprint' };
        showToast(msgs[type] || 'Action complete');
    };

    // Stats from current page (server would return these too)
    const stats = {
        active: ALL_STUDENTS.filter(s => s.is_active).length,
        inactive: ALL_STUDENTS.filter(s => !s.is_active).length,
        tokenActive: ALL_STUDENTS.filter(s => s.token.status === 'ACTIVE').length,
        cardPrinted: ALL_STUDENTS.filter(s => s.card.print_status === 'PRINTED' || s.card.print_status === 'REPRINTED').length,
        revoked: ALL_STUDENTS.filter(s => s.token.status === 'REVOKED').length,
    };

    const GRID = '2.2fr 1fr 0.9fr 1fr 1fr 1fr 0.5fr';
    const COLS = ['Student', 'School', 'Class', 'Token', 'Card', 'Enrolled', ''];

    return (
        <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto', fontFamily: "'IBM Plex Sans','Segoe UI',system-ui,sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>
            <style>{`
        @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(14px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        .fup { animation:fadeUp 0.3s ease both; }
        .tr:hover { background:#F8FAFC !important; }
        input:focus,select:focus { border-color:#6366F1 !important; outline:none; }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#F3F4F6} ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:8px}
      `}</style>

            {toast && (
                <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#0F172A', color: '#fff', padding: '11px 20px', borderRadius: 12, fontSize: '0.83rem', fontWeight: 700, zIndex: 999, boxShadow: '0 8px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 8, animation: 'toastIn 0.2s ease', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <CheckCircle2 size={14} color="#10B981" />{toast.msg}
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }} className="fup">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#6366F1,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
                        <Users size={19} color="#fff" strokeWidth={2} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.025em' }}>All Students</h1>
                        <p style={{ fontSize: '0.77rem', color: '#64748B', margin: '2px 0 0' }}>
                            {loading ? 'Loading…' : `${total.toLocaleString()} students across ${SCHOOLS.length} schools`}
                        </p>
                    </div>
                </div>
                <button onClick={fetchStudents} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, color: '#374151', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; }}>
                    <RefreshCw size={13} /> Refresh
                </button>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 13, marginBottom: 22 }} className="fup">
                <StatTile label="Total Students" value={TOTAL_MOCK} color="#6366F1" bg="#EEF2FF" icon={Users} />
                <StatTile label="Active" value={stats.active} color="#10B981" bg="#ECFDF5" icon={UserCheck} />
                <StatTile label="Inactive" value={stats.inactive} color="#EF4444" bg="#FEF2F2" icon={UserX} />
                <StatTile label="Active Tokens" value={stats.tokenActive} color="#F59E0B" bg="#FFFBEB" icon={KeyRound} />
                <StatTile label="Revoked Tokens" value={stats.revoked} color="#94A3B8" bg="#F1F5F9" icon={Ban} />
            </div>

            {/* Filter bar */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '13px 18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }} className="fup">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                        <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, student ID, card number, token ID…"
                            style={{ width: '100%', padding: '9px 12px 9px 33px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: '0.82rem', color: '#0F172A', boxSizing: 'border-box', background: '#F8FAFC', fontFamily: 'inherit', transition: 'border-color 0.15s' }} />
                    </div>

                    <button onClick={() => setShowFilters(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${showFilters || activeFilters ? '#6366F1' : '#E2E8F0'}`, background: showFilters || activeFilters ? '#EEF2FF' : '#F8FAFC', color: showFilters || activeFilters ? '#6366F1' : '#374151', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        <SlidersHorizontal size={13} /> Filters
                        {activeFilters > 0 && <span style={{ background: '#6366F1', color: '#fff', borderRadius: 20, padding: '1px 6px', fontSize: '0.66rem', fontWeight: 900 }}>{activeFilters}</span>}
                    </button>

                    <span style={{ fontSize: '0.77rem', color: '#94A3B8', fontWeight: 600, marginLeft: 'auto', flexShrink: 0 }}>
                        {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : `${total.toLocaleString()} records`}
                    </span>
                </div>

                {showFilters && (
                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 12, paddingTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <FGroup label="Status">
                            {['ALL', 'ACTIVE', 'INACTIVE'].map(s => <FPill key={s} active={activeF === s} color={s === 'ACTIVE' ? '#10B981' : s === 'INACTIVE' ? '#EF4444' : '#6366F1'} bg={s === 'ACTIVE' ? '#ECFDF5' : s === 'INACTIVE' ? '#FEF2F2' : '#EEF2FF'} onClick={() => { setActiveF(s); setPage(1); }}>
                                {s === 'ALL' ? 'All' : s === 'ACTIVE' ? 'Active' : 'Inactive'}
                            </FPill>)}
                        </FGroup>
                        <FGroup label="Token">
                            <FSel value={tokenF} onChange={e => { setTokenF(e.target.value); setPage(1); }} active={tokenF !== 'ALL'}>
                                <option value="ALL">All Statuses</option>
                                {TOKEN_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                            </FSel>
                        </FGroup>
                        <FGroup label="Card Print">
                            <FSel value={printF} onChange={e => { setPrintF(e.target.value); setPage(1); }} active={printF !== 'ALL'}>
                                <option value="ALL">All Print Status</option>
                                {PRINT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                            </FSel>
                        </FGroup>
                        <FGroup label="School">
                            <FSel value={schoolF} onChange={e => { setSchoolF(e.target.value); setPage(1); }} active={schoolF !== 'ALL'}>
                                <option value="ALL">All Schools</option>
                                {SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </FSel>
                        </FGroup>
                        <FGroup label="Class">
                            <FSel value={classF} onChange={e => { setClassF(e.target.value); setPage(1); }} active={classF !== 'ALL'}>
                                <option value="ALL">All Classes</option>
                                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                            </FSel>
                        </FGroup>
                        {activeFilters > 0 && <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, border: '1.5px solid #FCA5A5', background: '#FEF2F2', color: '#EF4444', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', alignSelf: 'center', marginLeft: 'auto' }}><X size={10} />Clear All</button>}
                    </div>
                )}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }} className="fup">
                <div style={{ display: 'grid', gridTemplateColumns: GRID, padding: '0 20px', background: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                    {COLS.map(c => <div key={c} style={{ padding: '11px 8px', fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c}</div>)}
                </div>

                {loading ? (
                    <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#94A3B8' }}>
                        <Loader2 size={28} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite', color: '#6366F1' }} />
                        <p style={{ fontSize: '0.83rem', fontWeight: 600, margin: 0 }}>Loading students…</p>
                    </div>
                ) : students.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
                        <Users size={36} strokeWidth={1} style={{ opacity: 0.35, marginBottom: 10 }} />
                        <p style={{ fontWeight: 800, color: '#64748B', margin: 0 }}>No students found</p>
                        <p style={{ fontSize: '0.8rem', margin: '5px 0 0' }}>Try adjusting your search or filters.</p>
                    </div>
                ) : students.map((s, i) => {
                    const tc = TOKEN_CFG[s.token.status];
                    const pc = PRINT_CFG[s.card.print_status];
                    const ac = avatarColor(s.id);
                    return (
                        <div key={s.id} className="tr" style={{ display: 'grid', gridTemplateColumns: GRID, padding: '0 20px', borderBottom: i < students.length - 1 ? '1px solid #F9FAFB' : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s' }}
                            onClick={() => setSelected(s)}>
                            {/* Student */}
                            <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: 11 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                    {initials(s)}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ fontSize: '0.83rem', fontWeight: 700, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.first_name} {s.last_name}</p>
                                    <p style={{ fontSize: '0.69rem', color: '#94A3B8', margin: '1px 0 0', fontFamily: 'monospace' }}>{s.id}</p>
                                </div>
                                {!s.is_active && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#EF4444', background: '#FEF2F2', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>INACTIVE</span>}
                            </div>
                            {/* School */}
                            <div style={{ padding: '12px 8px' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.school.name}</p>
                                <p style={{ fontSize: '0.68rem', color: '#94A3B8', margin: '1px 0 0' }}>{s.school.code}</p>
                            </div>
                            {/* Class */}
                            <div style={{ padding: '12px 8px' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>Class {s.class}</span>
                                <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: 5 }}>Sec {s.section}</span>
                            </div>
                            {/* Token */}
                            <div style={{ padding: '12px 8px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: '0.69rem', fontWeight: 700, color: tc.color, background: tc.bg, border: `1px solid ${tc.color}20` }}>
                                    <CircleDot size={9} strokeWidth={3} />{tc.label}
                                </span>
                            </div>
                            {/* Card */}
                            <div style={{ padding: '12px 8px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 6, fontSize: '0.69rem', fontWeight: 700, color: pc.color, background: pc.bg }}>
                                    {pc.label}
                                </span>
                                <p style={{ fontSize: '0.68rem', color: '#94A3B8', margin: '2px 0 0', fontFamily: 'monospace' }}>{s.card.card_number}</p>
                            </div>
                            {/* Date */}
                            <div style={{ padding: '12px 8px' }}>
                                <span style={{ fontSize: '0.77rem', color: '#64748B' }}>{fmtDate(s.created_at)}</span>
                            </div>
                            {/* Action */}
                            <div style={{ padding: '12px 8px', display: 'flex', justifyContent: 'center' }}>
                                <button onClick={e => { e.stopPropagation(); setSelected(s); }} style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '6px 7px', cursor: 'pointer', display: 'flex', color: '#64748B', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#6366F1'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}>
                                    <Eye size={13} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Pagination */}
                {!loading && total > LIMIT && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                            Showing {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} of {total.toLocaleString()}
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <PBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={14} /></PBtn>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let n; if (totalPages <= 5) n = i + 1; else if (page <= 3) n = i + 1; else if (page >= totalPages - 2) n = totalPages - 4 + i; else n = page - 2 + i;
                                return <PBtn key={n} active={page === n} onClick={() => setPage(n)}>{n}</PBtn>;
                            })}
                            {totalPages > 5 && <span style={{ padding: '0 4px', lineHeight: '32px', color: '#94A3B8' }}>…</span>}
                            <PBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={14} /></PBtn>
                        </div>
                    </div>
                )}
            </div>

            {selected && <StudentDrawer student={students.find(s => s.id === selected.id) || selected} onClose={() => setSelected(null)} onAction={handleAction} />}
        </div>
    );
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function StatTile({ label, value, color, bg, icon: Icon }) {
    return (
        <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 5px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={color} strokeWidth={1.8} />
            </div>
            <div>
                <p style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>{value.toLocaleString()}</p>
                <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: '4px 0 0', fontWeight: 600 }}>{label}</p>
            </div>
        </div>
    );
}
function DSection({ title, icon: Icon, color, children }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={12} color={color} strokeWidth={2.2} />
                </div>
                <p style={{ fontSize: '0.68rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{title}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
        </div>
    );
}
function DRow({ label, value, sub }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>{label}</span>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>{value || '—'}</div>
                {sub && <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 1 }}>{sub}</div>}
            </div>
        </div>
    );
}
function Chip({ label, color, bg, dark }) {
    return <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, color: dark ? color : color, background: dark ? color + '22' : bg, border: `1px solid ${color}25` }}>{label}</span>;
}
function CopyVal({ val, k, copied, onCopy }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <code style={{ fontSize: '0.78rem', color: '#6366F1', fontWeight: 700 }}>{val}</code>
            <button onClick={() => onCopy(val, k)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#CBD5E1', display: 'flex', padding: 2 }}>
                {copied === k ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
            </button>
        </span>
    );
}
function ActBtn({ icon: Icon, label, type, busy, done, color, bg, disabled, onClick }) {
    const isLoading = busy === type;
    const isDone = done === type;
    return (
        <button onClick={onClick} disabled={disabled || busy !== null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${color}25`, background: bg, color, fontSize: '0.78rem', fontWeight: 700, cursor: disabled || busy ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, transition: 'all 0.15s' }}>
            {isLoading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : isDone ? <Check size={13} /> : <Icon size={13} />}
            {isLoading ? 'Wait…' : isDone ? 'Done!' : label}
        </button>
    );
}
function FGroup({ label, children }) {
    return (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 2 }}>{label}:</span>
            {children}
        </div>
    );
}
function FPill({ active, color = '#6366F1', bg = '#EEF2FF', onClick, children }) {
    return <button onClick={onClick} style={{ padding: '4px 12px', borderRadius: 20, border: `1.5px solid ${active ? color : '#E2E8F0'}`, background: active ? bg : '#fff', color: active ? color : '#64748B', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s' }}>{children}</button>;
}
function FSel({ value, onChange, active, children }) {
    return (
        <div style={{ position: 'relative' }}>
            <select value={value} onChange={onChange} style={{ padding: '4px 26px 4px 11px', borderRadius: 20, border: `1.5px solid ${active ? '#6366F1' : '#E2E8F0'}`, background: active ? '#EEF2FF' : '#fff', color: active ? '#6366F1' : '#64748B', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', appearance: 'none', outline: 'none', fontFamily: 'inherit' }}>{children}</select>
            <ChevronDown size={10} color={active ? '#6366F1' : '#94A3B8'} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
    );
}
function PBtn({ onClick, disabled, active, children }) {
    return <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, borderRadius: 8, border: `1.5px solid ${active ? '#6366F1' : '#E2E8F0'}`, background: active ? '#6366F1' : '#fff', color: active ? '#fff' : '#374151', fontSize: '0.78rem', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}>{children}</button>;
}