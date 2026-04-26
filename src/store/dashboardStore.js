// src/store/dashboardStore.js
import { create } from 'zustand';

/**
 * School-admin dashboard store.
 * Owns both UI state (sidebar, etc.) and plan/subscription facts
 * hydrated by useDashboard after a successful API fetch.
 */
const useDashboardStore = create((set) => ({
    // ── Plan ──────────────────────────────────────────────────────────
    plan: 'basic',          // 'basic' | 'premium'
    isPremium: false,
    subscriptionEnd: null,  // ISO date string | null
    featureUsage: { used: 2, total: 10 }, // feature gate progress

    // ── Actions ───────────────────────────────────────────────────────
    setPlan: (plan) =>
        set({
            plan,
            isPremium: plan === 'premium',
        }),

    setSubscriptionEnd: (date) => set({ subscriptionEnd: date }),

    setFeatureUsage: (usage) => set({ featureUsage: usage }),

    hydratePlan: ({ plan, subscriptionEnd, featureUsage }) =>
        set({
            plan: plan ?? 'basic',
            isPremium: (plan ?? 'basic') === 'premium',
            subscriptionEnd: subscriptionEnd ?? null,
            featureUsage: featureUsage ?? { used: 2, total: 10 },
        }),
}));

export default useDashboardStore;