import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
const useStore = create()(devtools(persist(set => ({
    // Initial State
    user: null,
    props: [],
    selectedProps: [],
    entries: [],
    metrics: null,
    opportunities: [],
    alerts: [],
    darkMode: false,
    sidebarOpen: true,
    activeModal: null,
    bets: [],
    toasts: [],
    isLoading: false,
    error: null,
    // Auth Actions
    login: async (email, password) => {
        try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }
            const user = await response.json();
            set({ user });
        }
        catch (error) {
            throw error;
        }
    },
    register: async (name, email, password) => {
        try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            const user = await response.json();
            set({ user });
        }
        catch (error) {
            throw error;
        }
    },
    logout: () => set({ user: null }),
    // Actions
    setProps: props => set({ props }),
    togglePropSelection: propId => set(state => ({
        selectedProps: state.selectedProps.includes(propId)
            ? state.selectedProps.filter(id => id !== propId)
            : [...state.selectedProps, propId],
    })),
    addEntry: entry => set(state => ({
        entries: [...state.entries, entry],
    })),
    updateEntry: (entryId, updates) => set(state => ({
        entries: state.entries.map(entry => entry.id === entryId ? { ...entry, ...updates } : entry),
    })),
    setMetrics: metrics => set({ metrics }),
    addOpportunity: opportunity => set(state => ({
        opportunities: [...state.opportunities, opportunity],
    })),
    removeOpportunity: opportunityId => set(state => ({
        opportunities: state.opportunities.filter(opp => opp.id !== opportunityId),
    })),
    addAlert: alert => set(state => ({
        alerts: [...state.alerts, alert],
    })),
    removeAlert: alertId => set(state => ({
        alerts: state.alerts.filter(alert => alert.id !== alertId),
    })),
    toggleDarkMode: () => set(state => ({
        darkMode: !state.darkMode,
    })),
    toggleSidebar: () => set(state => ({
        sidebarOpen: !state.sidebarOpen,
    })),
    setActiveModal: modalId => set({ activeModal: modalId }),
    addBet: bet => set(state => ({
        bets: [...state.bets, bet],
    })),
    updateBet: (betId, updates) => set(state => ({
        bets: state.bets.map(bet => (bet.id === betId ? { ...bet, ...updates } : bet)),
    })),
    removeBet: betId => set(state => ({
        bets: state.bets.filter(bet => bet.id !== betId),
    })),
    addToast: toast => set(state => ({
        toasts: [...(state.toasts || []), toast],
    })),
    removeToast: id => set(state => ({
        toasts: (state.toasts || []).filter(t => t.id !== id),
    })),
    clearToasts: () => set({ toasts: [] }),
    setError: error => set({ error }),
    clearError: () => set({ error: null }),
}), {
    name: 'sports-betting-store',
    partialize: state => ({
        user: state.user,
        props: state.props,
        selectedProps: state.selectedProps,
        entries: state.entries,
        metrics: state.metrics,
        opportunities: state.opportunities,
        alerts: state.alerts,
        darkMode: state.darkMode,
        sidebarOpen: state.sidebarOpen,
        activeModal: state.activeModal,
        bets: state.bets,
        toasts: state.toasts,
        isLoading: state.isLoading,
        error: state.error,
    }),
})));
export default useStore;
