import { create } from 'zustand';
export const useStore = create(set => ({
    // User state
    user: null,
    setUser: user => set({ user }),
    // Bets state
    bets: [],
    addBet: bet => set(state => ({ bets: [...state.bets, bet] })),
    removeBet: betId => set(state => ({
        bets: state.bets.filter(bet => bet.id !== betId),
    })),
    updateBet: (betId, updates) => set(state => ({
        bets: state.bets.map(bet => (bet.id === betId ? { ...bet, ...updates } : bet)),
    })),
    // Props state
    props: [],
    setProps: props => set({ props }),
    updateProp: (propId, updates) => set(state => ({
        props: state.props.map(prop => (prop.id === propId ? { ...prop, ...updates } : prop)),
    })),
    // Stats state
    stats: null,
    setStats: stats => set({ stats }),
    // Performance state
    performance: [],
    setPerformance: data => set({ performance: data }),
    // News state
    headlines: [],
    setHeadlines: headlines => set({ headlines }),
    // UI state
    isDarkMode: false,
    toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
    isBetSlipOpen: false,
    toggleBetSlip: () => set(state => ({ isBetSlipOpen: !state.isBetSlipOpen })),
    selectedSport: 'all',
    setSelectedSport: sport => set({ selectedSport: sport }),
    selectedLeague: 'all',
    setSelectedLeague: league => set({ selectedLeague: league }),
}));
