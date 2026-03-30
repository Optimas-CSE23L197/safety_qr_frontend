// =============================================================================
// src/store/dashboardStore.js — RESQID
// Zustand store for school admin dashboard UI state only.
//
// ARCHITECTURE DECISION
// ─────────────────────────────────────────────────────────────────────────────
// Server state (API data, loading, error) → TanStack Query (useDashboard hook)
// UI state (sidebar collapsed, active filters, etc.) → Zustand
//
// This store owns ONLY:
//   - Nothing for the dashboard currently — TanStack Query owns all server state
//
// The store is here as an extension point. If you add:
//   - "last refreshed at" display
//   - manual refresh triggers
//   - optimistic anomaly resolution from the dashboard list
// ...those belong here.
//
// For now the dashboard is purely read — TanStack Query handles everything.
// =============================================================================

import { create } from "zustand";

export const useDashboardStore = create(() => ({
  // Extension point — see file header
}));
