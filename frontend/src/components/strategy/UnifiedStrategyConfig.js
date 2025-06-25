import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { UnifiedServiceRegistry } from '../../services/unified/UnifiedServiceRegistry';
import { useEventAnalytics } from '../../hooks/useUnifiedAnalytics';
import { Card, Button, Input, Select, Slider, Spinner, Toast, Badge, Modal, Tabs, Tab, } from '../ui/UnifiedUI';
export const UnifiedStrategyConfig = () => {
    // Initialize services
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const predictionService = serviceRegistry.getService('prediction');
    const analyticsService = serviceRegistry.getService('analytics');
    const stateService = serviceRegistry.getService('state');
    const notificationService = serviceRegistry.getService('notification');
    const errorService = serviceRegistry.getService('error');
    const webSocketService = serviceRegistry.getService('websocket');
    // State
    const [config, setConfig] = useState({
        investmentAmount: 1000,
        modelSet: {},
        confidenceThreshold: 85,
        strategyMode: 'balanced',
        portfolioSize: 3,
        sportsUniverse: {
            all: true,
            selected: [],
        },
        timeHorizon: {
            value: 1,
            unit: 'hours',
        },
        riskProfile: {
            maxDrawdown: 20,
            maxExposure: 50,
            correlationLimit: 0.7,
        },
    });
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    // Analytics state
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedMarket, setSelectedMarket] = useState(null);
    const [selectedSelection, setSelectedSelection] = useState(null);
    const analytics = useEventAnalytics(selectedEvent || '', selectedMarket || '', selectedSelection || '');
    const { metrics, trendDelta, riskProfile, explainabilityMap, modelMetadata, isLoading: analyticsLoading, error: analyticsError, getMetricColor, getTrendIcon, getRiskLevelColor, } = analytics;
    // Load available models
    useEffect(() => {
        loadModels();
    }, []);
    const loadModels = async () => {
        try {
            setLoading(true);
            const availableModels = await predictionService.getAvailableModels();
            setModels(availableModels);
            // Initialize model set with default weights
            const modelSet = availableModels.reduce((acc, model) => ({
                ...acc,
                [model.id]: {
                    enabled: true,
                    weight: 1 / availableModels.length,
                },
            }), {});
            setConfig(prev => ({ ...prev, modelSet }));
        }
        catch (error) {
            handleError('Failed to load models', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleConfigChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };
    const handleModelWeightChange = (modelId, weight) => {
        setConfig(prev => ({
            ...prev,
            modelSet: {
                ...prev.modelSet,
                [modelId]: {
                    ...prev.modelSet[modelId],
                    weight,
                },
            },
        }));
    };
    const handleModelToggle = (modelId, enabled) => {
        setConfig(prev => ({
            ...prev,
            modelSet: {
                ...prev.modelSet,
                [modelId]: {
                    ...prev.modelSet[modelId],
                    enabled,
                },
            },
        }));
    };
    const generateRecommendations = async () => {
        try {
            setLoading(true);
            const recommendations = await predictionService.generatePortfolioRecommendations(config);
            setRecommendations(recommendations);
            setShowRecommendations(true);
        }
        catch (error) {
            handleError('Failed to generate recommendations', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleError = (message, error) => {
        setError(message);
        setToast({ message, type: 'error' });
        errorService.handleError(error, {
            code: 'STRATEGY_CONFIG_ERROR',
            source: 'UnifiedStrategyConfig',
            details: { message },
        });
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    const formatPercentage = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(value / 100);
    };
    // Subscribe to real-time updates
    useEffect(() => {
        if (!selectedEvent || !selectedMarket || !selectedSelection)
            return;
        const unsubscribe = webSocketService?.subscribe?.('analytics', (data) => {
            if (data.eventId === selectedEvent && data.marketId === selectedMarket) {
                // Analytics hook will auto-update via its own effect
            }
        });
        return () => unsubscribe && unsubscribe();
    }, [selectedEvent, selectedMarket, selectedSelection, webSocketService]);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Spinner, { size: "large" }) }));
    }
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Strategy Configuration" }), selectedEvent && selectedMarket && selectedSelection && (_jsxs("div", { className: "mb-6 p-4 bg-gray-50 rounded-lg", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Strategy Configuration" }), analyticsLoading ? (_jsx("div", { className: "flex justify-center py-4", children: _jsx(Spinner, { size: "medium" }) })) : analyticsError ? (_jsx("div", { className: "text-red-500 text-center", children: _jsx("p", { children: analyticsError }) })) : (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: metrics && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Accuracy" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("p", { className: "text-lg font-semibold", children: [(metrics.accuracy * 100).toFixed(1), "%"] }), trendDelta && (_jsx(Icon, { className: `w-4 h-4 ${getMetricColor(trendDelta.accuracyDelta, 'positive')}`, name: getTrendIcon(trendDelta.accuracyDelta) }))] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Precision" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("p", { className: "text-lg font-semibold", children: [(metrics.precision * 100).toFixed(1), "%"] }), trendDelta && (_jsx(Icon, { className: `w-4 h-4 ${getMetricColor(trendDelta.precisionDelta, 'positive')}`, name: getTrendIcon(trendDelta.precisionDelta) }))] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Recall" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("p", { className: "text-lg font-semibold", children: [(metrics.recall * 100).toFixed(1), "%"] }), trendDelta && (_jsx(Icon, { className: `w-4 h-4 ${getMetricColor(trendDelta.recallDelta, 'positive')}`, name: getTrendIcon(trendDelta.recallDelta) }))] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Profit/Loss" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("p", { className: "text-lg font-semibold", children: [metrics.profitLoss.toFixed(2), "%"] }), _jsx(Icon, { className: `w-4 h-4 ${getMetricColor(metrics.profitLoss, 'positive')}`, name: getTrendIcon(metrics.profitLoss) })] })] })] })) })), riskProfile && (_jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Risk Profile" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { variant: riskProfile.riskLevel.toLowerCase(), children: riskProfile.riskLevel }), _jsx("p", { className: "text-sm text-gray-600", children: riskProfile.recommendation })] })] })), modelMetadata && (_jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Model Stability" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { variant: modelMetadata.stability > 0.8
                                                    ? 'success'
                                                    : modelMetadata.stability > 0.6
                                                        ? 'warning'
                                                        : 'danger', children: modelMetadata.stability > 0.8
                                                    ? 'High'
                                                    : modelMetadata.stability > 0.6
                                                        ? 'Medium'
                                                        : 'Low' }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Last updated: ", new Date(modelMetadata.lastUpdated).toLocaleString()] })] })] }))] })), _jsxs(Tabs, { className: "mb-8", value: activeTab, onChange: setActiveTab, children: [_jsx(Tab, { label: "Basic Settings", value: "basic" }), _jsx(Tab, { label: "Advanced Settings", value: "advanced" }), _jsx(Tab, { label: "Risk Management", value: "risk" }), _jsx(Tab, { label: "Model Selection", value: "models" })] }), activeTab === 'basic' && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs(Card, { children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Investment & Strategy" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Investment Amount" }), _jsx(Input, { max: "100000", min: "10", type: "number", value: config.investmentAmount, onChange: e => handleConfigChange('investmentAmount', parseFloat(e.target.value)) }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Range: $10 - $100,000" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Strategy Mode" }), _jsx(Select, { options: [
                                                            { value: 'maximum_profit', label: 'Maximum Profit' },
                                                            { value: 'balanced', label: 'Balanced' },
                                                            { value: 'conservative', label: 'Conservative' },
                                                            { value: 'aggressive', label: 'Aggressive' },
                                                            { value: 'arbitrage', label: 'Arbitrage' },
                                                            { value: 'ai_adaptive', label: 'AI-Adaptive' },
                                                        ], value: config.strategyMode, onChange: e => handleConfigChange('strategyMode', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Portfolio Size" }), _jsx(Select, { options: [
                                                            { value: 2, label: '2 Legs' },
                                                            { value: 3, label: '3 Legs' },
                                                            { value: 4, label: '4 Legs' },
                                                            { value: 5, label: '5 Legs' },
                                                            { value: 6, label: '6 Legs' },
                                                        ], value: config.portfolioSize, onChange: e => handleConfigChange('portfolioSize', parseInt(e.target.value)) })] })] })] }), _jsxs(Card, { children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Sports & Time Horizon" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Sports Universe" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { checked: config.sportsUniverse.all, className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded", type: "checkbox", onChange: e => handleConfigChange('sportsUniverse', {
                                                                            ...config.sportsUniverse,
                                                                            all: e.target.checked,
                                                                            selected: e.target.checked ? [] : config.sportsUniverse.selected,
                                                                        }) }), _jsx("label", { className: "ml-2 block text-sm text-gray-700 dark:text-gray-300", children: "All Sports" })] }), !config.sportsUniverse.all && (_jsx(Select, { multiple: true, options: [
                                                                    { value: 'football', label: 'Football' },
                                                                    { value: 'basketball', label: 'Basketball' },
                                                                    { value: 'baseball', label: 'Baseball' },
                                                                    { value: 'hockey', label: 'Hockey' },
                                                                    { value: 'soccer', label: 'Soccer' },
                                                                    { value: 'tennis', label: 'Tennis' },
                                                                ], value: config.sportsUniverse.selected, onChange: e => handleConfigChange('sportsUniverse', {
                                                                    ...config.sportsUniverse,
                                                                    selected: Array.from(e.target.selectedOptions, option => option.value),
                                                                }) }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Time Horizon" }), _jsxs("div", { className: "flex space-x-4", children: [_jsx(Input, { className: "w-24", min: "1", type: "number", value: config.timeHorizon.value, onChange: e => handleConfigChange('timeHorizon', {
                                                                    ...config.timeHorizon,
                                                                    value: parseInt(e.target.value),
                                                                }) }), _jsx(Select, { options: [
                                                                    { value: 'minutes', label: 'Minutes' },
                                                                    { value: 'hours', label: 'Hours' },
                                                                    { value: 'days', label: 'Days' },
                                                                ], value: config.timeHorizon.unit, onChange: e => handleConfigChange('timeHorizon', {
                                                                    ...config.timeHorizon,
                                                                    unit: e.target.value,
                                                                }) })] })] })] })] })] })), activeTab === 'advanced' && (_jsxs(Card, { children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Advanced Configuration" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Confidence Threshold" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Slider, { max: 99, min: 80, value: config.confidenceThreshold, onChange: value => handleConfigChange('confidenceThreshold', value) }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: "80%" }), _jsxs("span", { children: ["Current: ", config.confidenceThreshold, "%"] }), _jsx("span", { children: "99%" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Model Weights" }), _jsx("div", { className: "space-y-4", children: models.map(model => (_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("input", { checked: config.modelSet[model.id]?.enabled, className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded", type: "checkbox", onChange: e => handleModelToggle(model.id, e.target.checked) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "font-medium", children: model.name }), _jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Accuracy: ", formatPercentage(model.accuracy)] })] }), _jsx(Slider, { disabled: !config.modelSet[model.id]?.enabled, max: 100, min: 0, value: config.modelSet[model.id]?.weight * 100, onChange: value => handleModelWeightChange(model.id, value / 100) })] })] }, model.id))) })] })] })] })), activeTab === 'risk' && (_jsxs(Card, { children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Risk Management" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Maximum Drawdown" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Slider, { max: 50, min: 5, value: config.riskProfile.maxDrawdown, onChange: value => handleConfigChange('riskProfile', {
                                                            ...config.riskProfile,
                                                            maxDrawdown: value,
                                                        }) }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: "5%" }), _jsxs("span", { children: ["Current: ", config.riskProfile.maxDrawdown, "%"] }), _jsx("span", { children: "50%" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Maximum Exposure" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Slider, { max: 100, min: 10, value: config.riskProfile.maxExposure, onChange: value => handleConfigChange('riskProfile', {
                                                            ...config.riskProfile,
                                                            maxExposure: value,
                                                        }) }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: "10%" }), _jsxs("span", { children: ["Current: ", config.riskProfile.maxExposure, "%"] }), _jsx("span", { children: "100%" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Correlation Limit" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Slider, { max: 1, min: 0, step: 0.1, value: config.riskProfile.correlationLimit, onChange: value => handleConfigChange('riskProfile', {
                                                            ...config.riskProfile,
                                                            correlationLimit: value,
                                                        }) }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: "0.0" }), _jsxs("span", { children: ["Current: ", config.riskProfile.correlationLimit] }), _jsx("span", { children: "1.0" })] })] })] })] })] })), activeTab === 'models' && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: models.map(model => (_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-medium", children: model.name }), _jsxs(Badge, { variant: model.accuracy >= 90 ? 'success' : model.accuracy >= 80 ? 'warning' : 'danger', children: [formatPercentage(model.accuracy), " Accuracy"] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400", children: model.description }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Type" }), _jsx("p", { className: "font-medium", children: model.type })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Profit Factor" }), _jsx("p", { className: "font-medium", children: model.profitFactor.toFixed(2) })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Last Updated: ", new Date(model.lastUpdated).toLocaleDateString()] }), _jsx("input", { checked: config.modelSet[model.id]?.enabled, className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded", type: "checkbox", onChange: e => handleModelToggle(model.id, e.target.checked) })] })] })] }, model.id))) })), _jsxs("div", { className: "flex justify-end mt-8 space-x-4", children: [_jsx(Button, { variant: "secondary", onClick: () => {
                                    // Reset to default configuration
                                    loadModels();
                                }, children: "Reset" }), _jsx(Button, { disabled: loading, variant: "primary", onClick: generateRecommendations, children: loading ? _jsx(Spinner, { size: "small" }) : 'Generate Recommendations' })] })] }), _jsx(Modal, { isOpen: showRecommendations, title: "Portfolio Recommendations", onClose: () => setShowRecommendations(false), children: _jsx("div", { className: "space-y-6", children: recommendations.map((recommendation, index) => (_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-lg font-medium", children: ["Portfolio ", index + 1] }), _jsxs(Badge, { variant: recommendation.expectedValue > 0
                                            ? 'success'
                                            : recommendation.expectedValue < 0
                                                ? 'danger'
                                                : 'warning', children: [formatPercentage(recommendation.expectedValue), " Expected Value"] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2", children: "Legs" }), _jsx("div", { className: "space-y-2", children: recommendation.legs.map((leg, legIndex) => (_jsxs("div", { className: "p-2 bg-gray-50 dark:bg-gray-800 rounded", children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "font-medium", children: leg.selection }), _jsx("span", { children: leg.odds.toFixed(2) })] }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: leg.marketType }), _jsxs("span", { children: ["Confidence: ", formatPercentage(leg.confidence)] })] })] }, legIndex))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Odds" }), _jsx("p", { className: "font-medium", children: recommendation.totalOdds.toFixed(2) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Risk Score" }), _jsx("p", { className: "font-medium", children: recommendation.riskScore.toFixed(2) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Confidence" }), _jsx("p", { className: "font-medium", children: formatPercentage(recommendation.confidence) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Expected Value" }), _jsx("p", { className: `font-medium ${recommendation.expectedValue > 0 ? 'text-green-600' : 'text-red-600'}`, children: formatPercentage(recommendation.expectedValue) })] })] }), _jsx(Button, { className: "w-full", variant: "primary", onClick: () => {
                                            // Handle portfolio selection
                                            setShowRecommendations(false);
                                        }, children: "Select Portfolio" })] })] }, index))) }) }), toast && _jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })] }));
};
