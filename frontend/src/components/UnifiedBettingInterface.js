import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWebSocket } from '../hooks/useWebSocket';
import { useShapData } from '../hooks/useShapData';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '@/utils/formatters';
import { RiskProfileType, } from '@/types/betting';
import { RiskProfileSelector } from './RiskProfileSelector';
import ShapVisualization from './ShapVisualization';
import { BettingOpportunities } from './BettingOpportunities';
import { PerformanceMetrics } from './PerformanceMetrics';
import { useUnifiedAnalytics } from '../hooks/useUnifiedAnalytics';
import { Button, Card, Input, Select, Tabs, Tab, Badge, Spinner } from './ui/UnifiedUI';
import { useFilterStore } from '../stores/filterStore';
// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
};
const scaleIn = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.2, ease: 'easeOut' },
};
export const UnifiedBettingInterface = ({ initialBankroll, onBetPlaced, darkMode: externalDarkMode, onDarkModeChange: _onDarkModeChange, }) => {
    const { token: _token } = useAuth();
    const [activeTab, setActiveTab] = useState('opportunities');
    const [internalDarkMode, setInternalDarkMode] = useState(false);
    const [bankroll, _setBankroll] = useState(initialBankroll);
    const [riskProfile, setRiskProfile] = useState(RiskProfileType.MODERATE);
    const [_userConstraints] = useState({
        max_bankroll_stake: 0.1,
        time_window_hours: 24,
        preferred_sports: [],
        preferred_markets: [],
    });
    const [selectedEvent, _setSelectedEvent] = useState(null);
    const [notification, _setNotification] = useState(null);
    const [bettingOpportunities, setBettingOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [alerts, _setAlerts] = useState([]);
    const [config, setConfig] = useState({
        investment: 1000,
        modelSet: 'ensemble',
        confidence: 0.8,
        strategy: 'balanced',
        sports: 'all',
    });
    const darkMode = externalDarkMode ?? internalDarkMode;
    const filterStore = useFilterStore();
    // WebSocket connection for real-time updates
    const wsQuery = new URLSearchParams({
        riskProfile: filterStore.riskProfile,
        confidenceThreshold: String(filterStore.confidenceThreshold),
        stakeSizing: String(filterStore.stakeSizing),
        model: filterStore.model,
        activeFilters: Array.from(filterStore.activeFilters).join(','),
    }).toString();
    const wsUrl = `${process.env.VITE_WS_URL}/ws/betting?${wsQuery}`;
    const { isConnected } = useWebSocket(wsUrl, {
        onMessage: (data) => {
            if (data.type === 'betting_opportunities') {
                setBettingOpportunities(data.opportunities);
                setIsLoading(false);
            }
        },
    });
    // Analytics and predictions
    const { performance } = useUnifiedAnalytics({
        ...config,
        ml: { autoUpdate: true, updateInterval: 300000 }, // 5 minutes
        performance: true,
        drift: true,
    });
    // SHAP visualization data
    const { features: shapData, loading: shapLoading, error: _shapError, } = useShapData({
        eventId: selectedEvent?.id || '',
        modelType: 'xgboost',
    });
    const shapFeatures = useMemo(() => {
        if (!shapData)
            return [];
        return Object.entries(shapData).map(([name, impact]) => ({
            name,
            value: 0,
            impact: Number(impact),
        }));
    }, [shapData]);
    // Memoize selected model and metrics
    const selectedModel = useMemo(() => performance?.data?.[0], [performance?.data]);
    const modelMetrics = useMemo(() => selectedModel?.metrics, [selectedModel]);
    // Calculate profit based on model performance
    const calculatedProfit = useMemo(() => {
        if (!modelMetrics)
            return 0;
        // Use f1Score as a proxy for ROI until real bankroll tracking is implemented
        return config.investment * (modelMetrics.f1 ?? 0);
    }, [modelMetrics, config.investment]);
    // Memoize recommendations from betting opportunities
    const bettingRecommendations = useMemo(() => {
        return bettingOpportunities.map(opp => ({
            ...opp,
            result: 'pending', // Add result field required by PerformanceMetrics
        }));
    }, [bettingOpportunities]);
    return (_jsx(motion.div, { animate: "animate", "aria-label": "Unified Betting Interface", className: "w-full max-w-7xl mx-auto p-4 space-y-6", exit: "exit", initial: "initial", variants: fadeInUp, children: _jsxs(Card, { className: "p-6", children: [_jsxs("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Betting Interface" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["Current Bankroll: ", formatCurrency(bankroll)] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(RiskProfileSelector, { currentProfile: riskProfile, onProfileChange: setRiskProfile }), _jsx(Button, { "aria-label": "Toggle dark mode", variant: "ghost", onClick: () => setInternalDarkMode(!internalDarkMode), children: darkMode ? 'Light Mode' : 'Dark Mode' })] })] }), _jsxs("main", { className: "mt-6", children: [_jsxs(Tabs, { value: activeTab, onChange: setActiveTab, children: [_jsx(Tab, { label: "Opportunities", value: "opportunities" }), _jsx(Tab, { label: "Analytics", value: "analytics" }), _jsx(Tab, { label: "Settings", value: "settings" })] }), _jsxs(motion.section, { animate: "animate", "aria-label": activeTab, className: "mt-4", exit: "exit", initial: "initial", variants: scaleIn, children: [activeTab === 'opportunities' && (_jsx(motion.div, { animate: "animate", className: "mt-4", exit: "exit", initial: "initial", variants: scaleIn, children: isLoading ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx(Spinner, { "aria-label": "Loading opportunities", size: "large" }) })) : (_jsx(BettingOpportunities, { alerts: alerts, isLoading: isLoading, opportunities: bettingOpportunities, onBetPlacement: onBetPlaced })) }, "opportunities")), activeTab === 'analytics' && (_jsx(motion.div, { animate: "animate", className: "mt-4", exit: "exit", initial: "initial", variants: scaleIn, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(Card, { children: _jsx(PerformanceMetrics, { bankroll: bankroll, profit: calculatedProfit, recommendations: bettingRecommendations, riskProfile: riskProfile }) }), _jsx(Card, { children: _jsx(ShapVisualization, { features: shapFeatures, isLoading: shapLoading, title: "Feature Importance" }) })] }) }, "analytics")), activeTab === 'settings' && (_jsx(motion.div, { animate: "animate", className: "mt-4", exit: "exit", initial: "initial", variants: scaleIn, children: _jsx(Card, { children: _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { "aria-label": "Investment Amount", helperText: "Maximum amount to invest per bet", label: "Investment Amount", type: "number", value: config.investment.toString(), onChange: value => setConfig(prev => ({ ...prev, investment: Number(value) })) }), _jsx(Select, { "aria-label": "Model Set", label: "Model Set", options: [
                                                        { value: 'ensemble', label: 'Ensemble' },
                                                        { value: 'traditional', label: 'Traditional' },
                                                        { value: 'deeplearning', label: 'Deep Learning' },
                                                        { value: 'timeseries', label: 'Time Series' },
                                                        { value: 'optimization', label: 'Optimization' },
                                                    ], value: config.modelSet, onChange: value => setConfig(prev => ({
                                                        ...prev,
                                                        modelSet: value,
                                                    })) }), _jsx(Select, { "aria-label": "Strategy", label: "Strategy", options: [
                                                        { value: 'maximum', label: 'Maximum' },
                                                        { value: 'balanced', label: 'Balanced' },
                                                        { value: 'conservative', label: 'Conservative' },
                                                        { value: 'aggressive', label: 'Aggressive' },
                                                        { value: 'arbitrage', label: 'Arbitrage' },
                                                        { value: 'ai_adaptive', label: 'AI Adaptive' },
                                                    ], value: config.strategy, onChange: value => setConfig(prev => ({
                                                        ...prev,
                                                        strategy: value,
                                                    })) })] }) }) }, "settings"))] })] }), notification && (_jsx(motion.div, { animate: { opacity: 1, y: 0 }, "aria-live": "polite", className: "mt-4", exit: { opacity: 0, y: -20 }, initial: { opacity: 0, y: 20 }, children: _jsx(Badge, { variant: notification.type === 'success' ? 'success' : 'danger', children: notification.message }) })), !isConnected && (_jsx(motion.div, { animate: { opacity: 1 }, "aria-live": "polite", className: "mt-4", initial: { opacity: 0 }, children: _jsx(Badge, { variant: "warning", children: "WebSocket disconnected. Attempting to reconnect..." }) }))] }) }));
};
