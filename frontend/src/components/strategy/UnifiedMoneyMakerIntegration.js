import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { UnifiedServiceRegistry } from '../../services/unified/UnifiedServiceRegistry';
import { Card, Button, Input, Select, Slider, Spinner, Toast, Badge, Modal, Tabs, Tab, Progress, } from '../ui/UnifiedUI';
export const UnifiedMoneyMakerIntegration = () => {
    // Initialize services
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const predictionService = serviceRegistry.getService('prediction');
    const analyticsService = serviceRegistry.getService('analytics');
    const stateService = serviceRegistry.getService('state');
    const notificationService = serviceRegistry.getService('notification');
    const errorService = serviceRegistry.getService('error');
    // State
    const [config, setConfig] = useState({
        investmentAmount: 1000,
        riskProfile: 'moderate',
        timeHorizon: 24,
        confidenceThreshold: 85,
        modelWeights: {},
        arbitrageThreshold: 0.05,
        maxExposure: 50,
        correlationLimit: 0.7,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [portfolios, setPortfolios] = useState([]);
    const [showPortfolios, setShowPortfolios] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [analysisResults, setAnalysisResults] = useState(null);
    // Load initial configuration
    useEffect(() => {
        loadConfiguration();
    }, []);
    const loadConfiguration = async () => {
        try {
            setLoading(true);
            const models = await predictionService.getAvailableModels();
            const modelWeights = models.reduce((acc, model) => ({
                ...acc,
                [model.id]: 1 / models.length,
            }), {});
            setConfig(prev => ({ ...prev, modelWeights }));
        }
        catch (error) {
            handleError('Failed to load configuration', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleConfigChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };
    const generatePortfolios = async () => {
        try {
            setLoading(true);
            const results = await predictionService.generateMoneyMakerPortfolios(config);
            setPortfolios(results.portfolios);
            setAnalysisResults(results.analysis);
            setShowPortfolios(true);
        }
        catch (error) {
            handleError('Failed to generate portfolios', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleError = (message, error) => {
        setError(message);
        setToast({ message, type: 'error' });
        errorService.handleError(error, {
            code: 'MONEY_MAKER_ERROR',
            source: 'UnifiedMoneyMakerIntegration',
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
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Spinner, { size: "large" }) }));
    }
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Money Maker Integration" }), _jsx(Badge, { variant: "success", children: "Advanced Mode" })] }), _jsxs(Tabs, { className: "mb-8", value: activeTab, onChange: setActiveTab, children: [_jsx(Tab, { label: "Basic Settings", value: "basic" }), _jsx(Tab, { label: "Advanced Settings", value: "advanced" }), _jsx(Tab, { label: "Arbitrage", value: "arbitrage" }), _jsx(Tab, { label: "Analysis", value: "analysis" })] }), activeTab === 'basic' && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs(Card, { children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Investment & Risk" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Investment Amount" }), _jsx(Input, { max: "100000", min: "10", type: "number", value: config.investmentAmount, onChange: e => handleConfigChange('investmentAmount', parseFloat(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Risk Profile" }), _jsx(Select, { options: [
                                                            { value: 'conservative', label: 'Conservative' },
                                                            { value: 'moderate', label: 'Moderate' },
                                                            { value: 'aggressive', label: 'Aggressive' },
                                                        ], value: config.riskProfile, onChange: e => handleConfigChange('riskProfile', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Time Horizon (Hours)" }), _jsx(Input, { max: "72", min: "1", type: "number", value: config.timeHorizon, onChange: e => handleConfigChange('timeHorizon', parseInt(e.target.value)) })] })] })] }), _jsxs(Card, { children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Model Configuration" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Confidence Threshold" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Slider, { max: 99, min: 80, value: config.confidenceThreshold, onChange: value => handleConfigChange('confidenceThreshold', value) }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: "80%" }), _jsxs("span", { children: ["Current: ", config.confidenceThreshold, "%"] }), _jsx("span", { children: "99%" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Model Weights" }), _jsx("div", { className: "space-y-4", children: Object.entries(config.modelWeights).map(([modelId, weight]) => (_jsx("div", { className: "flex items-center space-x-4", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "font-medium", children: modelId }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: formatPercentage(weight * 100) })] }), _jsx(Slider, { max: 100, min: 0, value: weight * 100, onChange: value => handleConfigChange('modelWeights', {
                                                                            ...config.modelWeights,
                                                                            [modelId]: value / 100,
                                                                        }) })] }) }, modelId))) })] })] })] })] })), activeTab === 'advanced' && (_jsxs(Card, { children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Advanced Configuration" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Maximum Exposure" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Slider, { max: 100, min: 10, value: config.maxExposure, onChange: value => handleConfigChange('maxExposure', value) }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: "10%" }), _jsxs("span", { children: ["Current: ", config.maxExposure, "%"] }), _jsx("span", { children: "100%" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Correlation Limit" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Slider, { max: 1, min: 0, step: 0.1, value: config.correlationLimit, onChange: value => handleConfigChange('correlationLimit', value) }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: "0.0" }), _jsxs("span", { children: ["Current: ", config.correlationLimit] }), _jsx("span", { children: "1.0" })] })] })] })] })] })), activeTab === 'arbitrage' && (_jsxs(Card, { children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Arbitrage Settings" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Arbitrage Threshold" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Slider, { max: 10, min: 1, step: 0.1, value: config.arbitrageThreshold * 100, onChange: value => handleConfigChange('arbitrageThreshold', value / 100) }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: "1%" }), _jsxs("span", { children: ["Current: ", formatPercentage(config.arbitrageThreshold)] }), _jsx("span", { children: "10%" })] })] })] }), _jsxs("div", { className: "bg-gray-50 dark:bg-gray-800 p-4 rounded", children: [_jsx("h3", { className: "font-medium mb-2", children: "Arbitrage Opportunities" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "The system will automatically identify and prioritize arbitrage opportunities based on the configured threshold. Higher thresholds will result in more conservative arbitrage selections." })] })] })] })), activeTab === 'analysis' && analysisResults && (_jsxs(Card, { children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Performance Analysis" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded", children: [_jsx("h3", { className: "font-medium mb-2", children: "Win Rate" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: formatPercentage(analysisResults.winRate) })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded", children: [_jsx("h3", { className: "font-medium mb-2", children: "ROI" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: formatPercentage(analysisResults.roi) })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded", children: [_jsx("h3", { className: "font-medium mb-2", children: "Profit Factor" }), _jsx("p", { className: "text-2xl font-bold text-purple-600", children: analysisResults.profitFactor.toFixed(2) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-2", children: "Model Performance" }), _jsx("div", { className: "space-y-4", children: Object.entries(analysisResults.modelPerformance).map(([modelId, performance]) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-medium", children: modelId }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: formatPercentage(performance.accuracy) })] }), _jsx(Progress, { className: "h-2", max: 100, value: performance.accuracy })] }, modelId))) })] })] })] })), _jsxs("div", { className: "flex justify-end mt-8 space-x-4", children: [_jsx(Button, { variant: "secondary", onClick: loadConfiguration, children: "Reset" }), _jsx(Button, { disabled: loading, variant: "primary", onClick: generatePortfolios, children: loading ? _jsx(Spinner, { size: "small" }) : 'Generate Portfolios' })] })] }), _jsx(Modal, { isOpen: showPortfolios, title: "Money Maker Portfolios", onClose: () => setShowPortfolios(false), children: _jsx("div", { className: "space-y-6", children: portfolios.map((portfolio, index) => (_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-lg font-medium", children: ["Portfolio ", index + 1] }), _jsxs("div", { className: "flex space-x-2", children: [portfolio.arbitrageOpportunity && _jsx(Badge, { variant: "success", children: "Arbitrage" }), _jsxs(Badge, { variant: portfolio.expectedValue > 0
                                                    ? 'success'
                                                    : portfolio.expectedValue < 0
                                                        ? 'danger'
                                                        : 'warning', children: [formatPercentage(portfolio.expectedValue), " Expected Value"] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2", children: "Legs" }), _jsx("div", { className: "space-y-2", children: portfolio.legs.map((leg, legIndex) => (_jsxs("div", { className: "p-2 bg-gray-50 dark:bg-gray-800 rounded", children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "font-medium", children: leg.selection }), _jsx("span", { children: leg.odds.toFixed(2) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400", children: [_jsx("div", { children: _jsxs("span", { children: ["Confidence: ", formatPercentage(leg.confidence)] }) }), _jsx("div", { children: _jsxs("span", { children: ["Kelly: ", formatPercentage(leg.kellyFraction)] }) }), _jsx("div", { children: _jsxs("span", { children: ["Stake: ", formatCurrency(portfolio.optimalStakes[leg.eventId])] }) }), _jsx("div", { children: _jsxs("span", { children: ["EV: ", formatPercentage(leg.expectedValue)] }) })] })] }, legIndex))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Odds" }), _jsx("p", { className: "font-medium", children: portfolio.totalOdds.toFixed(2) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Risk Score" }), _jsx("p", { className: "font-medium", children: portfolio.riskScore.toFixed(2) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Confidence" }), _jsx("p", { className: "font-medium", children: formatPercentage(portfolio.confidence) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Expected Value" }), _jsx("p", { className: `font-medium ${portfolio.expectedValue > 0 ? 'text-green-600' : 'text-red-600'}`, children: formatPercentage(portfolio.expectedValue) })] })] }), _jsx(Button, { className: "w-full", variant: "primary", onClick: () => {
                                            // Handle portfolio selection
                                            setShowPortfolios(false);
                                        }, children: "Select Portfolio" })] })] }, index))) }) }), toast && _jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })] }));
};
