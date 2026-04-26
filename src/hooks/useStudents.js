// src/hooks/useStudents.js
/**
 * useStudents — plan-aware hook for the All Students page.
 *
 * Basic plan:
 *   - Search by name / admission number
 *   - Single filter: class/grade
 *   - Pagination (page + pageSize)
 *   - View student detail
 *   - Add single student
 *
 * Premium plan (all of the above, plus):
 *   - Multi-filter: section, token status, date range
 *   - Sortable columns (any field)
 *   - Bulk actions: assign tokens, print cards, deactivate, export
 *   - Export to CSV / PDF
 *   - Quick-view drawer data (recent scans inline)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate }                               from 'react-router-dom';
import useDashboardStore                             from '../store/dashboardStore.js';
import useStudentStore                               from '../store/student.store.js';
import { useToast }                                  from './useToast.js';
import { ROUTES }                                    from '../config/routes.config.js';

// ─── constants ────────────────────────────────────────────────────────────────

export const PAGE_SIZE_OPTIONS = [10, 25, 50];
export const DEFAULT_PAGE_SIZE = 25;

export const TOKEN_STATUS_OPTIONS = [
    { value: '',           label: 'All statuses' },
    { value: 'ACTIVE',     label: 'Active'        },
    { value: 'UNASSIGNED', label: 'Unassigned'    },
    { value: 'EXPIRED',    label: 'Expired'       },
    { value: 'REVOKED',    label: 'Revoked'       },
    { value: 'INACTIVE',   label: 'Inactive'      },
];

export const SORT_FIELDS = {
    NAME:       'full_name',
    CLASS:      'class',
    TOKEN:      'token_status',
    LAST_SCAN:  'last_scan_at',
    CREATED_AT: 'created_at',
};

// ─── hook ─────────────────────────────────────────────────────────────────────

export function useStudents(schoolId) {
    const navigate    = useNavigate();
    const { showToast } = useToast();
    const { isPremium } = useDashboardStore();

    const {
        students,
        totalStudents,
        loading,
        fetchStudents,
        bulkAssignTokens,
        bulkDeactivate,
    } = useStudentStore();

    // ── Search & filters ──────────────────────────────────────────────────────
    const [search,      setSearch]      = useState('');
    const [filterClass, setFilterClass] = useState('');

    // Premium-only filters — silently ignored on Basic
    const [filterSection,     setFilterSection]     = useState('');
    const [filterTokenStatus, setFilterTokenStatus] = useState('');
    const [filterDateFrom,    setFilterDateFrom]    = useState('');
    const [filterDateTo,      setFilterDateTo]      = useState('');

    // ── Sort ──────────────────────────────────────────────────────────────────
    const [sortField, setSortField] = useState(SORT_FIELDS.NAME);
    const [sortDir,   setSortDir]   = useState('asc');        // 'asc' | 'desc'

    // ── Pagination ────────────────────────────────────────────────────────────
    const [page,     setPage]     = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    // ── Selection (Premium bulk actions) ─────────────────────────────────────
    const [selectedIds, setSelectedIds] = useState(new Set());

    // ── Quick-view drawer ─────────────────────────────────────────────────────
    const [drawerStudent, setDrawerStudent] = useState(null);

    // ── Debounce search ───────────────────────────────────────────────────────
    const searchTimer = useRef(null);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const handleSearchChange = useCallback((value) => {
        setSearch(value);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setDebouncedSearch(value);
            setPage(1);
        }, 350);
    }, []);

    // ── Build query params and fetch ──────────────────────────────────────────
    const buildParams = useCallback(() => {
        const params = {
            page,
            pageSize,
            search: debouncedSearch || undefined,
            class:  filterClass     || undefined,
            sortField,
            sortDir,
        };

        if (isPremium) {
            if (filterSection)     params.section      = filterSection;
            if (filterTokenStatus) params.tokenStatus  = filterTokenStatus;
            if (filterDateFrom)    params.createdFrom  = filterDateFrom;
            if (filterDateTo)      params.createdTo    = filterDateTo;
        }

        return params;
    }, [
        page, pageSize, debouncedSearch, filterClass,
        sortField, sortDir, isPremium,
        filterSection, filterTokenStatus, filterDateFrom, filterDateTo,
    ]);

    useEffect(() => {
        if (!schoolId) return;
        fetchStudents(schoolId, buildParams()).catch((err) => {
            console.error('fetchStudents error:', err);
            showToast('Failed to load students', 'error');
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schoolId, buildParams]);

    // Reset page when any filter changes
    const handleFilterChange = useCallback((setter) => (value) => {
        setter(value);
        setPage(1);
    }, []);

    // ── Sort toggle ───────────────────────────────────────────────────────────
    const handleSort = useCallback((field) => {
        // Basic plan: only allow sorting by name
        if (!isPremium && field !== SORT_FIELDS.NAME) return;
        setSortDir((prev) => sortField === field && prev === 'asc' ? 'desc' : 'asc');
        setSortField(field);
        setPage(1);
    }, [isPremium, sortField]);

    // ── Selection helpers ─────────────────────────────────────────────────────
    const toggleSelect = useCallback((id) => {
        if (!isPremium) return;
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, [isPremium]);

    const toggleSelectAll = useCallback(() => {
        if (!isPremium) return;
        if (selectedIds.size === students.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(students.map((s) => s.id)));
        }
    }, [isPremium, selectedIds.size, students]);

    const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

    // ── Bulk actions (Premium only) ───────────────────────────────────────────
    const handleBulkAssignTokens = useCallback(async () => {
        if (!isPremium || !selectedIds.size) return;
        try {
            await bulkAssignTokens(schoolId, [...selectedIds]);
            showToast(`Tokens assigned to ${selectedIds.size} students`, 'success');
            clearSelection();
        } catch {
            showToast('Failed to assign tokens', 'error');
        }
    }, [isPremium, selectedIds, schoolId, bulkAssignTokens, showToast, clearSelection]);

    const handleBulkDeactivate = useCallback(async () => {
        if (!isPremium || !selectedIds.size) return;
        try {
            await bulkDeactivate(schoolId, [...selectedIds]);
            showToast(`${selectedIds.size} students deactivated`, 'success');
            clearSelection();
        } catch {
            showToast('Failed to deactivate students', 'error');
        }
    }, [isPremium, selectedIds, schoolId, bulkDeactivate, showToast, clearSelection]);

    // ── Export CSV (Premium only) ─────────────────────────────────────────────
    const handleExportCSV = useCallback(() => {
        if (!isPremium) return;
        const headers = 'Name,Admission No,Class,Section,Token Status,Last Scan';
        const rows = students.map((s) =>
            [
                s.full_name,
                s.admission_number ?? '',
                s.class            ?? '',
                s.section          ?? '',
                s.current_token?.status ?? 'UNASSIGNED',
                s.last_scan_at     ?? '',
            ].join(',')
        );
        const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('CSV exported', 'success');
    }, [isPremium, students, showToast]);

    // ── Navigation ────────────────────────────────────────────────────────────
    const goToDetail = useCallback((studentId) =>
        navigate(ROUTES.SCHOOL_ADMIN.STUDENT_DETAIL.replace(':studentId', studentId)),
    [navigate]);

    const goToAddStudent = useCallback(() =>
        navigate(ROUTES.SCHOOL_ADMIN.ADD_STUDENT),
    [navigate]);

    // ── Derived ───────────────────────────────────────────────────────────────
    const totalPages   = Math.max(1, Math.ceil((totalStudents ?? 0) / pageSize));
    const hasSelection = selectedIds.size > 0;
    const isAllSelected = students.length > 0 && selectedIds.size === students.length;

    const activeFilterCount = [
        filterClass, filterSection, filterTokenStatus, filterDateFrom, filterDateTo,
    ].filter(Boolean).length;

    const clearAllFilters = useCallback(() => {
        setFilterClass('');
        setFilterSection('');
        setFilterTokenStatus('');
        setFilterDateFrom('');
        setFilterDateTo('');
        setPage(1);
    }, []);

    return {
        // data
        students,
        totalStudents,
        isLoading: loading.list ?? false,

        // search
        search,
        onSearch: handleSearchChange,

        // filters
        filterClass,    onFilterClass:    handleFilterChange(setFilterClass),
        filterSection,  onFilterSection:  handleFilterChange(setFilterSection),
        filterTokenStatus, onFilterTokenStatus: handleFilterChange(setFilterTokenStatus),
        filterDateFrom, onFilterDateFrom: handleFilterChange(setFilterDateFrom),
        filterDateTo,   onFilterDateTo:   handleFilterChange(setFilterDateTo),
        activeFilterCount,
        clearAllFilters,

        // sort
        sortField, sortDir, onSort: handleSort,

        // pagination
        page, totalPages, pageSize,
        onPageChange:    setPage,
        onPageSizeChange: (sz) => { setPageSize(sz); setPage(1); },

        // selection
        selectedIds, hasSelection, isAllSelected,
        toggleSelect, toggleSelectAll, clearSelection,

        // bulk actions
        onBulkAssignTokens: handleBulkAssignTokens,
        onBulkDeactivate:   handleBulkDeactivate,
        onExportCSV:        handleExportCSV,

        // drawer
        drawerStudent, setDrawerStudent,

        // nav
        goToDetail, goToAddStudent,

        // plan
        isPremium,
    };
}