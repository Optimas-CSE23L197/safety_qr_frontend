/**
 * SCHOOL ADMIN — QR MANAGEMENT
 * View and download student QR codes from tokens.
 * Aligned with Token and QrAsset models from schema:
 * - Token: token_hash, status, student_id, school_id
 * - QrAsset: token_id, storage_key, public_url, format, width_px, height_px, file_size_kb
 */

import { useState } from 'react';
import {
    QrCode, Download, RefreshCw, User, Printer, Search, Eye,
    CheckCircle, XCircle, Clock, AlertTriangle, FileImage,
    FileCode, FileText, DownloadCloud, RotateCcw, ChevronDown,
    Shield, Check, Loader2, Image, Code, File, Zap
} from 'lucide-react';
import { getFullName, getInitials, maskTokenHash, formatDate, formatRelativeTime, humanizeEnum } from '../../../utils/formatters.js';
import useAuth from '../../../hooks/useAuth.js';
import useDebounce from '../../../hooks/useDebounce.js';
import { toast } from '../../../utils/toast.js';

// ─── Token Status Config (Matches TokenStatus Enum) ───────────────────────────
const STATUS_CONFIG = {
    ACTIVE: { label: 'Active', color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle },
    UNASSIGNED: { label: 'Unassigned', color: '#6B7280', bg: '#F3F4F6', Icon: Clock },
    ISSUED: { label: 'Issued', color: '#3B82F6', bg: '#EFF6FF', Icon: Eye },
    INACTIVE: { label: 'Inactive', color: '#9CA3AF', bg: '#F9FAFB', Icon: XCircle },
    REVOKED: { label: 'Revoked', color: '#EF4444', bg: '#FEF2F2', Icon: AlertTriangle },
    EXPIRED: { label: 'Expired', color: '#F59E0B', bg: '#FFFBEB', Icon: AlertTriangle },
};

// ─── QR Format Options (Matches QrFormat Enum) ────────────────────────────────
const QR_FORMATS = [
    { id: 'PNG', label: 'PNG', icon: Image, color: '#3B82F6', bg: '#EFF6FF', mime: 'image/png', extension: 'png' },
    { id: 'SVG', label: 'SVG', icon: Code, color: '#8B5CF6', bg: '#F5F3FF', mime: 'image/svg+xml', extension: 'svg' },
    { id: 'PDF', label: 'PDF', icon: File, color: '#EF4444', bg: '#FEF2F2', mime: 'application/pdf', extension: 'pdf' },
];

// ─── QR Size Options ──────────────────────────────────────────────────────────
const QR_SIZES = [
    { label: 'Small (256px)', width: 256, height: 256 },
    { label: 'Medium (512px)', width: 512, height: 512 },
    { label: 'Large (1024px)', width: 1024, height: 1024 },
    { label: 'Extra Large (2048px)', width: 2048, height: 2048 },
];

// ─── Mock Data (Matches Schema with Token + QrAsset) ──────────────────────────
const MOCK_TOKENS = Array.from({ length: 20 }, (_, i) => ({
    id: `tok_${i + 1}`,
    token_hash: `QR${Math.random().toString(36).slice(2, 18).toUpperCase()}`,
    status: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'UNASSIGNED', 'ACTIVE', 'ISSUED', 'ACTIVE', 'REVOKED'][i % 8],
    student_id: i % 4 !== 3 ? `stu_${i + 1}` : null,
    student_name: i % 4 !== 3 ? ['Aarav Sharma', 'Priya Patel', 'Rohit Singh', 'Sneha Gupta', 'Karan Kumar', 'Divya Joshi', 'Arjun Verma', 'Meera Shah', 'Vikram Mehta', 'Ananya Reddy'][i % 10] : null,
    student_class: i % 4 !== 3 ? `${Math.floor(Math.random() * 12) + 1}${['A', 'B', 'C'][i % 3]}` : null,
    student_section: i % 4 !== 3 ? ['A', 'B', 'C', 'D'][i % 4] : null,
    school_id: 'sch_001',
    expires_at: new Date(Date.now() + 86400000 * (Math.random() * 300 + 30)).toISOString(),
    created_at: new Date(Date.now() - 86400000 * (i % 90 + 10)).toISOString(),
    qr_asset: i % 4 !== 3 ? {
        id: `qr_${i + 1}`,
        format: ['PNG', 'SVG', 'PNG', 'PNG'][i % 4],
        width_px: 512,
        height_px: 512,
        file_size_kb: Math.floor(Math.random() * 100 + 20),
        public_url: `https://storage.example.com/qr/${Math.random().toString(36).slice(2, 10)}.png`,
        generated_at: new Date(Date.now() - 86400000 * (i % 30 + 5)).toISOString(),
    } : null,
}));

// ─── QR Code Display Component ────────────────────────────────────────────────
const QRCodeDisplay = ({ token, format, onFormatChange, onSizeChange, selectedSize, onRegenerate, regenerating }) => {
    const statusCfg = STATUS_CONFIG[token.status] || STATUS_CONFIG.UNASSIGNED;
    const StatusIcon = statusCfg.Icon;
    const qrAsset = token.qr_asset;
    const currentFormat = QR_FORMATS.find(f => f.id === format) || QR_FORMATS[0];
    const FormatIcon = currentFormat.icon;

    const handleDownload = () => {
        if (!qrAsset?.public_url) {
            toast.error('QR code not available for download');
            return;
        }
        const link = document.createElement('a');
        link.href = qrAsset.public_url;
        link.download = `qr_${token.student_name?.replace(/\s/g, '_') || 'token'}_${token.token_hash.slice(0, 8)}.${currentFormat.extension}`;
        link.click();
        toast.success('Download started');
    };

    const handlePrint = () => {
        if (!qrAsset?.public_url) {
            toast.error('QR code not available for printing');
            return;
        }
        const printWindow = window.open();
        printWindow.document.write(`
            <html>
                <head><title>QR Code - ${token.student_name || 'Token'}</title></head>
                <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0">
                    <img src="${qrAsset.public_url}" style="max-width:90%;height:auto" />
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="flex flex-col items-center gap-5">
            {/* QR Code Visual */}
            <div className="relative">
                <div className="w-48 h-48 bg-white border-2 border-slate-200 rounded-xl p-4 flex items-center justify-center shadow-lg">
                    {qrAsset ? (
                        <img
                            src={qrAsset.public_url}
                            alt="QR Code"
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="monospace" font-size="14"%3ENo QR%3C/text%3E%3C/svg%3E' }}
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                            <QrCode size={48} strokeWidth={1} />
                            <span className="text-xs">Not generated</span>
                        </div>
                    )}
                </div>
                {token.status === 'ACTIVE' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                        <Check size={12} className="text-white" />
                    </div>
                )}
            </div>

            {/* Token Info */}
            <div className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Token Status</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                        <StatusIcon size={10} /> {statusCfg.label}
                    </span>
                </div>
                <code className="text-xs font-mono text-slate-600 break-all">{maskTokenHash(token.token_hash)}</code>
                {qrAsset && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-500">
                        Generated: {formatRelativeTime(qrAsset.generated_at)}
                        {qrAsset.file_size_kb && <span className="ml-2">· {qrAsset.file_size_kb} KB</span>}
                    </div>
                )}
            </div>

            {/* Format & Size Controls */}
            <div className="w-full space-y-3">
                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Format</label>
                    <div className="flex gap-2">
                        {QR_FORMATS.map(fmt => {
                            const Icon = fmt.icon;
                            const isActive = format === fmt.id;
                            return (
                                <button
                                    key={fmt.id}
                                    onClick={() => onFormatChange(fmt.id)}
                                    className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${isActive
                                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon size={14} /> {fmt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Size</label>
                    <div className="grid grid-cols-2 gap-2">
                        {QR_SIZES.map(size => (
                            <button
                                key={size.label}
                                onClick={() => onSizeChange(size)}
                                className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${selectedSize?.width === size.width
                                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {size.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex gap-2">
                <button
                    onClick={handleDownload}
                    disabled={!qrAsset}
                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                    <Download size={15} /> Download {currentFormat.label}
                </button>
                <button
                    onClick={handlePrint}
                    disabled={!qrAsset}
                    className="py-2.5 px-4 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium flex items-center gap-2 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                    <Printer size={15} />
                </button>
                <button
                    onClick={onRegenerate}
                    disabled={regenerating || token.status !== 'ACTIVE'}
                    className="py-2.5 px-4 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium flex items-center gap-2 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    title="Regenerate QR"
                >
                    {regenerating ? <Loader2 size={15} className="animate-spin" /> : <RotateCcw size={15} />}
                </button>
            </div>
        </div>
    );
};

// ─── Generate QR Modal ────────────────────────────────────────────────────────
const GenerateQRModal = ({ token, onClose, onGenerate }) => {
    const [format, setFormat] = useState('PNG');
    const [size, setSize] = useState(QR_SIZES[1]);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        setGenerating(true);
        await new Promise(r => setTimeout(r, 1000));
        onGenerate(token.id, format, size);
        setGenerating(false);
        onClose();
    };

    const selectedFormat = QR_FORMATS.find(f => f.id === format);
    const FormatIcon = selectedFormat?.icon;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-slate-100">
                    <h3 className="font-display text-xl font-bold text-slate-900 m-0">Generate QR Code</h3>
                    <p className="text-sm text-slate-500 mt-0.5">For {token.student_name || 'Unassigned Token'}</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Format</label>
                        <div className="flex gap-2">
                            {QR_FORMATS.map(fmt => {
                                const Icon = fmt.icon;
                                return (
                                    <button
                                        key={fmt.id}
                                        onClick={() => setFormat(fmt.id)}
                                        className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium flex items-center justify-center gap-1.5 ${format === fmt.id
                                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                                            : 'border-slate-200 bg-white text-slate-600'
                                            }`}
                                    >
                                        <Icon size={14} /> {fmt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Size</label>
                        <div className="grid grid-cols-2 gap-2">
                            {QR_SIZES.map(s => (
                                <button
                                    key={s.label}
                                    onClick={() => setSize(s)}
                                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium ${size.width === s.width
                                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                                        : 'border-slate-200 bg-white text-slate-600'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 text-sm text-blue-800">
                        <p className="font-semibold mb-1">Generation Preview</p>
                        <p>• Format: {selectedFormat?.label}</p>
                        <p>• Dimensions: {size.width}×{size.height}px</p>
                        <p>• Will be stored in cloud storage</p>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
                    <button onClick={handleGenerate} disabled={generating} className="px-5 py-2 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50">
                        {generating ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />}
                        Generate QR
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QRManagement() {
    const { user, can } = useAuth();
    const [tokens, setTokens] = useState(MOCK_TOKENS);
    const [search, setSearch] = useState('');
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const [qrFormat, setQrFormat] = useState('PNG');
    const [qrSize, setQrSize] = useState(QR_SIZES[1]);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [regeneratingTokenId, setRegeneratingTokenId] = useState(null);
    const debouncedSearch = useDebounce(search, 300);

    // Filter tokens (only current school's tokens with student assigned)
    const myTokens = tokens.filter(t => t.school_id === (user?.school_id || 'sch_001'));

    const filtered = myTokens.filter(t =>
        !debouncedSearch ||
        (t.student_name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (t.student_class || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.token_hash.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const selectedToken = myTokens.find(t => t.id === selectedTokenId);
    const hasQr = selectedToken?.qr_asset !== null;
    const isActive = selectedToken?.status === 'ACTIVE';

    const handleGenerateQR = (tokenId, format, size) => {
        setTokens(prev => prev.map(t => {
            if (t.id === tokenId) {
                return {
                    ...t,
                    qr_asset: {
                        id: `qr_${Date.now()}`,
                        format: format,
                        width_px: size.width,
                        height_px: size.height,
                        file_size_kb: Math.floor(Math.random() * 100 + 20),
                        public_url: `https://storage.example.com/qr/${Date.now()}_${t.token_hash.slice(0, 8)}.${format.toLowerCase()}`,
                        generated_at: new Date().toISOString(),
                    }
                };
            }
            return t;
        }));
        toast.success('QR code generated successfully');
    };

    const handleRegenerateQR = async (tokenId) => {
        setRegeneratingTokenId(tokenId);
        await new Promise(r => setTimeout(r, 1000));
        setTokens(prev => prev.map(t => {
            if (t.id === tokenId && t.qr_asset) {
                return {
                    ...t,
                    qr_asset: {
                        ...t.qr_asset,
                        public_url: `https://storage.example.com/qr/${Date.now()}_${t.token_hash.slice(0, 8)}.${t.qr_asset.format.toLowerCase()}`,
                        generated_at: new Date().toISOString(),
                        file_size_kb: Math.floor(Math.random() * 100 + 20),
                    }
                };
            }
            return t;
        }));
        setRegeneratingTokenId(null);
        toast.success('QR code regenerated');
    };

    const stats = {
        total: myTokens.filter(t => t.student_name).length,
        withQr: myTokens.filter(t => t.qr_asset && t.student_name).length,
        active: myTokens.filter(t => t.status === 'ACTIVE' && t.student_name).length,
    };

    return (
        <div className="max-w-[1300px] mx-auto px-4 py-6">
            {showGenerateModal && selectedToken && (
                <GenerateQRModal
                    token={selectedToken}
                    onClose={() => setShowGenerateModal(false)}
                    onGenerate={handleGenerateQR}
                />
            )}

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                        <QrCode size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] m-0">QR Management</h1>
                        <p className="text-sm text-[var(--text-muted)] mt-0.5">Generate and download student QR codes for ID cards</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                    <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                    <div className="text-xs text-slate-500">Students with Tokens</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-600">{stats.withQr}</div>
                    <div className="text-xs text-slate-500">QR Generated</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                    <div className="text-2xl font-bold text-brand-600">{stats.active}</div>
                    <div className="text-xs text-slate-500">Active Tokens</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student/Token List */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={e => { setSearch(e.target.value); setSelectedTokenId(null); }}
                                placeholder="Search by student name, class, or token hash..."
                                className="w-full py-2 pl-9 pr-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand-500"
                            />
                        </div>
                    </div>
                    <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-100">
                        {filtered.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <QrCode size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No students found</p>
                            </div>
                        ) : (
                            filtered.map(token => {
                                const statusCfg = STATUS_CONFIG[token.status] || STATUS_CONFIG.UNASSIGNED;
                                const StatusIcon = statusCfg.Icon;
                                const isSelected = selectedTokenId === token.id;
                                const hasQrAsset = token.qr_asset !== null;

                                return (
                                    <div
                                        key={token.id}
                                        onClick={() => setSelectedTokenId(token.id)}
                                        className={`p-4 cursor-pointer transition-colors ${isSelected ? 'bg-brand-50 border-l-4 border-l-brand-500' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {token.student_name ? getInitials(token.student_name) : '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-slate-900">
                                                    {token.student_name || 'Unassigned Token'}
                                                </div>
                                                {token.student_name && (
                                                    <div className="text-xs text-slate-500">
                                                        {token.student_class} · {token.student_section}
                                                    </div>
                                                )}
                                                <code className="text-xs font-mono text-slate-400 mt-1 block truncate">
                                                    {maskTokenHash(token.token_hash)}
                                                </code>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                                                    <StatusIcon size={10} /> {statusCfg.label}
                                                </span>
                                                {hasQrAsset && (
                                                    <span className="text-xs text-emerald-600 flex items-center gap-0.5">
                                                        <Check size={10} /> QR Ready
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* QR Preview Panel */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {!selectedToken ? (
                        <div className="p-12 text-center text-slate-400">
                            <QrCode size={48} className="mx-auto mb-3 opacity-30" />
                            <p className="font-medium">Select a student</p>
                            <p className="text-sm">Click any student to view their QR code</p>
                        </div>
                    ) : !selectedToken.student_name ? (
                        <div className="p-12 text-center">
                            <AlertTriangle size={40} className="mx-auto mb-3 text-amber-500 opacity-50" />
                            <p className="font-medium text-slate-700">Token Not Assigned</p>
                            <p className="text-sm text-slate-500 mb-4">This token is not assigned to any student</p>
                            <button className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium">
                                Assign to Student
                            </button>
                        </div>
                    ) : !isActive ? (
                        <div className="p-12 text-center">
                            <XCircle size={40} className="mx-auto mb-3 text-red-500 opacity-50" />
                            <p className="font-medium text-slate-700">Token {selectedToken.status?.toLowerCase()}</p>
                            <p className="text-sm text-slate-500">QR codes are only available for active tokens</p>
                        </div>
                    ) : (
                        <div className="p-6">
                            {/* Student Header */}
                            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center font-bold text-brand-700">
                                    {getInitials(selectedToken.student_name)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{selectedToken.student_name}</h3>
                                    <p className="text-sm text-slate-500">{selectedToken.student_class} · {selectedToken.student_section}</p>
                                </div>
                            </div>

                            {/* QR Display */}
                            {hasQr ? (
                                <QRCodeDisplay
                                    token={selectedToken}
                                    format={qrFormat}
                                    onFormatChange={setQrFormat}
                                    onSizeChange={setQrSize}
                                    selectedSize={qrSize}
                                    onRegenerate={() => handleRegenerateQR(selectedToken.id)}
                                    regenerating={regeneratingTokenId === selectedToken.id}
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-4 py-8">
                                    <QrCode size={64} className="text-slate-300" />
                                    <p className="text-slate-500 text-center">
                                        No QR code generated yet
                                    </p>
                                    <button
                                        onClick={() => setShowGenerateModal(true)}
                                        className="px-5 py-2 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold flex items-center gap-2"
                                    >
                                        <Zap size={15} /> Generate QR Code
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}