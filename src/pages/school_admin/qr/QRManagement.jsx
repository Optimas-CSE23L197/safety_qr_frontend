import { useState } from 'react';
import { QrCode, Download, Printer, Search } from 'lucide-react';
import { getFullName, getInitials, maskTokenHash, formatDate } from '../../../utils/formatters.js';
import useAuth from '../../../hooks/useAuth.js';
import useDebounce from '../../../hooks/useDebounce.js';

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_STUDENTS = Array.from({ length: 16 }, (_, i) => ({
    id: `stu-${i + 1}`,
    first_name: ['Aarav','Priya','Rohit','Sneha','Karan','Divya','Arjun','Meera','Vikram','Ananya','Raj','Pooja','Dev','Riya','Aditya','Nisha'][i],
    last_name:  ['Sharma','Patel','Singh','Gupta','Kumar','Joshi','Verma','Shah','Mehta','Reddy','Nair','Iyer','Chopra','Bansal','Malhotra','Kapoor'][i],
    class:           `Class ${Math.floor(i / 4) + 8}`,
    section:         ['A','B','C','D'][i % 4],
    token_hash:      i % 4 !== 3 ? `QR${Math.random().toString(36).slice(2, 14).toUpperCase()}` : null,
    token_status:    ['ACTIVE','ACTIVE','ACTIVE','UNASSIGNED'][i % 4],
    qr_generated_at: i % 4 !== 3 ? new Date(Date.now() - i * 86400000 * 30).toISOString() : null,
}));

// ── Simulated QR Code visual ──────────────────────────────────────────────────
const QRCodeDisplay = ({ tokenHash }) => (
    <div className="flex flex-col items-center gap-2">
        {/* 7×7 grid simulating a QR pattern */}
        <div
            className="w-[120px] h-[120px] bg-white border-2 border-slate-200 rounded-lg p-2 grid gap-[1.5px]"
            style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
        >
            {Array.from({ length: 49 }, (_, i) => {
                const corners = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,48];
                const seed    = (tokenHash?.charCodeAt(i % (tokenHash?.length || 1)) || i) * 17;
                const filled  = corners.includes(i) ? true : (seed % 3 !== 0);
                return (
                    <div
                        key={i}
                        className="rounded-[1px]"
                        style={{ background: filled ? '#0F172A' : 'white' }}
                    />
                );
            })}
        </div>
        <div className="font-mono text-[0.6875rem] text-slate-400 tracking-[0.05em]">
            {maskTokenHash(tokenHash || '')}
        </div>
    </div>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function QRManagement() {
    const { can }    = useAuth();
    const [search, setSearch]     = useState('');
    const [selected, setSelected] = useState(null);
    const debouncedSearch = useDebounce(search, 300);

    const filtered = MOCK_STUDENTS.filter(s =>
        !debouncedSearch ||
        getFullName(s.first_name, s.last_name).toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.class.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const selectedStudent = MOCK_STUDENTS.find(s => s.id === selected);
    const hasToken        = selectedStudent?.token_status === 'ACTIVE';

    return (
        <div className="max-w-[1200px]">

            {/* ── Page header ──────────────────────────────────────────────── */}
            <div className="mb-6">
                <h2 className="font-display text-[1.375rem] font-bold text-slate-900 m-0">
                    QR Management
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    View and download student QR codes for ID cards
                </p>
            </div>

            {/* ── Two-column layout ─────────────────────────────────────────── */}
            <div className="grid gap-5 items-start" style={{ gridTemplateColumns: '1fr 360px' }}>

                {/* ── Student list panel ───────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-[var(--shadow-card)] overflow-hidden">

                    {/* Search bar */}
                    <div className="p-4 border-b border-slate-200">
                        <div className="relative">
                            <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search student or class..."
                                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors duration-100"
                            />
                        </div>
                    </div>

                    {/* Student rows */}
                    <div className="max-h-[520px] overflow-y-auto">
                        {filtered.map((student, idx) => {
                            const name           = getFullName(student.first_name, student.last_name);
                            const isSelected     = selected === student.id;
                            const hasActiveToken = student.token_status === 'ACTIVE';
                            return (
                                <div
                                    key={student.id}
                                    onClick={() => setSelected(student.id)}
                                    className={[
                                        'px-4 py-[13px] flex items-center gap-3 cursor-pointer transition-all duration-100',
                                        idx < filtered.length - 1 ? 'border-b border-slate-200' : '',
                                        isSelected
                                            ? 'bg-blue-50 border-l-[3px] border-l-blue-500'
                                            : 'border-l-[3px] border-l-transparent hover:bg-slate-50',
                                    ].join(' ')}
                                >
                                    {/* Avatar */}
                                    <div className={[
                                        'w-[38px] h-[38px] rounded-full flex items-center justify-center font-display font-bold text-[0.8125rem] shrink-0',
                                        isSelected ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400',
                                    ].join(' ')}>
                                        {getInitials(name)}
                                    </div>

                                    {/* Name + class */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-slate-900 truncate">{name}</div>
                                        <div className="text-xs text-slate-400">{student.class} – {student.section}</div>
                                    </div>

                                    {/* Token status pill */}
                                    {hasActiveToken
                                        ? <span className="px-2 py-[2px] rounded-full text-[0.7rem] font-semibold bg-emerald-50 text-emerald-700 whitespace-nowrap">QR Ready</span>
                                        : <span className="px-2 py-[2px] rounded-full text-[0.7rem] font-semibold bg-slate-100 text-slate-500 whitespace-nowrap">No Token</span>
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── QR Preview Panel ─────────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-[var(--shadow-card)] overflow-hidden">

                    {/* Empty state */}
                    {!selectedStudent ? (
                        <div className="py-[60px] px-5 text-center text-slate-400">
                            <QrCode size={40} className="opacity-25 mx-auto mb-4" />
                            <div className="font-medium mb-1.5">Select a student</div>
                            <div className="text-sm">Click any student to preview their QR code</div>
                        </div>
                    ) : (
                        <>
                            {/* Student header strip */}
                            <div className="px-5 py-5 border-b border-slate-200 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center font-display font-bold text-[0.9375rem] text-blue-800 shrink-0">
                                        {getInitials(getFullName(selectedStudent.first_name, selectedStudent.last_name))}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[0.9375rem] text-slate-900">
                                            {getFullName(selectedStudent.first_name, selectedStudent.last_name)}
                                        </div>
                                        <div className="text-[0.8125rem] text-slate-400">
                                            {selectedStudent.class} – {selectedStudent.section}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* QR content area */}
                            <div className="px-5 py-7 flex flex-col items-center gap-5">
                                {hasToken ? (
                                    <>
                                        <QRCodeDisplay tokenHash={selectedStudent.token_hash} />

                                        {/* Token info card */}
                                        <div className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="flex justify-between mb-1.5">
                                                <span className="text-xs text-slate-400 font-semibold">TOKEN STATUS</span>
                                                <span className="px-2 py-[2px] rounded-full text-[0.7rem] font-bold bg-emerald-50 text-emerald-700">
                                                    ACTIVE
                                                </span>
                                            </div>
                                            <div className="font-mono text-[0.8125rem] text-slate-900 break-all">
                                                {maskTokenHash(selectedStudent.token_hash)}
                                            </div>
                                            {selectedStudent.qr_generated_at && (
                                                <div className="text-xs text-slate-400 mt-1.5">
                                                    Generated {formatDate(selectedStudent.qr_generated_at)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-2 w-full">
                                            <button className="flex-1 flex items-center justify-center gap-1.5 py-[9px] rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 font-semibold text-sm cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-100">
                                                <Download size={15} /> Download PNG
                                            </button>
                                            <button className="flex items-center justify-center px-3.5 py-[9px] rounded-lg border border-slate-200 bg-white text-slate-600 font-medium text-sm cursor-pointer hover:bg-slate-50 transition-colors duration-100">
                                                <Printer size={15} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    /* No active token state */
                                    <div className="text-center py-5">
                                        <QrCode size={40} className="opacity-20 mx-auto mb-3" />
                                        <div className="font-semibold text-slate-600 mb-1.5">No active token</div>
                                        <p className="text-sm text-slate-400 mb-4">
                                            Assign an active token to this student to generate a QR code.
                                        </p>
                                        <button className="px-[18px] py-2 rounded-lg bg-blue-700 text-white border-0 font-semibold text-sm cursor-pointer hover:bg-blue-800 transition-colors duration-100">
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