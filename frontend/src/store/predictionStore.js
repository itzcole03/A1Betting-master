import { create } from 'zustand';
import { isLineup } from '@/types/lineup';
export const usePredictionStore = create((set, get) => ({
    // Initial State
    currentLineup: null,
    savedLineups: [],
    opportunities: [],
    settings: {
        enableSocialSentiment: true,
        enableWeatherData: true,
        enableInjuryData: true,
        enableMarketData: true,
        enableHistoricalData: true,
        enableSentimentData: true,
    },
    analytics: {
        accuracy: 0,
        profitLoss: 0,
        sampleSize: 0,
        winRate: 0,
        roi: 0,
        averageOdds: 0,
        bestPerformingSport: '',
        bestPerformingProp: '',
    },
    isLoading: false,
    error: null,
    automatedStrategies: {},
    // Actions
    setCurrentLineup: lineup => {
        if (lineup === null || isLineup(lineup)) {
            set({ currentLineup: lineup });
        }
        else {
            console.error('Invalid lineup object:', lineup);
        }
    },
    addSavedLineup: lineup => {
        if (isLineup(lineup)) {
            set(state => ({
                savedLineups: [...state.savedLineups, lineup],
            }));
        }
        else {
            console.error('Invalid lineup object:', lineup);
        }
    },
    setOpportunities: opportunities => set({ opportunities }),
    updateSettings: newSettings => set(state => ({
        settings: { ...state.settings, ...newSettings },
    })),
    updateAnalytics: newMetrics => set(state => ({
        analytics: { ...state.analytics, ...newMetrics },
    })),
    setIsLoading: isLoading => set({ isLoading }),
    setError: error => set({ error }),
    setStrategyAutomation: (strategyName, enabled) => {
        set(state => ({
            automatedStrategies: {
                ...state.automatedStrategies,
                [strategyName]: enabled,
            },
        }));
    },
}));
