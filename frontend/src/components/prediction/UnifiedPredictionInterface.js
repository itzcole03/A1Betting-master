import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { UnifiedServiceRegistry } from '../../services/unified/UnifiedServiceRegistry';
import { Card, Button, Spinner, Badge, Modal, Toast } from '../ui/UnifiedUI';
export const UnifiedPredictionInterface = () => {
    // Initialize services
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const predictionService = serviceRegistry.getService('prediction');
    const analyticsService = serviceRegistry.getService('analytics');
    const webSocketService = serviceRegistry.getService('websocket');
    const stateService = serviceRegistry.getService('state');
    const settingsService = serviceRegistry.getService('settings');
    const notificationService = serviceRegistry.getService('notification');
    const errorService = serviceRegistry.getService('error');
    // State
    const [predictions, setPredictions] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [toast, setToast] = useState(null);
    // Load data
    useEffect(() => {
        loadData();
        setupWebSocket();
        return () => {
            webSocketService.disconnect();
        };
    }, []);
    const loadData = async () => {
        try {
            setLoading(true);
            const [predictions, opportunities] = await Promise.all([
                predictionService.getPredictions(),
                predictionService.getOpportunities(),
            ]);
            setPredictions(predictions);
            setOpportunities(opportunities);
        }
        catch (error) {
            handleError('Failed to load prediction data', error);
        }
        finally {
            setLoading(false);
        }
    };
    const setupWebSocket = () => {
        webSocketService.connect();
        webSocketService.subscribe('predictions', data => {
            setPredictions(prev => [...prev, data]);
            notificationService.notifyUser({
                type: 'info',
                message: 'New prediction available',
                data,
            });
        });
        webSocketService.subscribe('opportunities', data => {
            setOpportunities(prev => [...prev, data]);
            notificationService.notifyUser({
                type: 'info',
                message: 'New opportunity detected',
                data,
            });
        });
    };
    const handleError = (message, error) => {
        setError(message);
        setToast({ message, type: 'error' });
        errorService.handleError(error, {
            code: 'PREDICTION_ERROR',
            source: 'UnifiedPredictionInterface',
            details: { message },
        });
    };
    const handlePredictionClick = (prediction) => {
        setSelectedPrediction(prediction);
        setShowDetailsModal(true);
    };
    const handleOpportunityClick = async (opportunity) => {
        try {
            await predictionService.analyzeOpportunity(opportunity);
            setToast({
                message: 'Opportunity analyzed successfully',
                type: 'success',
            });
        }
        catch (error) {
            handleError('Failed to analyze opportunity', error);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Spinner, { size: "large" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Card, { className: "max-w-md", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-red-500 mb-4", children: "Error" }), _jsx("p", { className: "text-gray-600 mb-4", children: error }), _jsx(Button, { variant: "primary", onClick: loadData, children: "Retry" })] }) }) }));
    }
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-4", children: "Predictions & Opportunities" }), _jsx("div", { className: "flex justify-between items-center", children: _jsx("div", { className: "flex space-x-4", children: _jsx(Button, { variant: "primary", onClick: loadData, children: "Refresh" }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Recent Predictions" }), _jsx("div", { className: "space-y-4", children: predictions.map(prediction => (_jsxs(Card, { className: "cursor-pointer hover:shadow-lg transition-shadow", onClick: () => handlePredictionClick(prediction), children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: prediction.marketType }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Event ID: ", prediction.eventId] })] }), _jsx(Badge, { variant: prediction.confidence >= 0.8
                                                        ? 'success'
                                                        : prediction.confidence >= 0.6
                                                            ? 'primary'
                                                            : 'secondary', children: prediction.confidence.toFixed(2) })] }), _jsxs("div", { className: "mt-2", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Prediction: ", prediction.prediction.toFixed(2)] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Model: ", prediction.modelVersion] })] })] }, prediction.id))) })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Betting Opportunities" }), _jsx("div", { className: "space-y-4", children: opportunities.map(opportunity => (_jsxs(Card, { className: "cursor-pointer hover:shadow-lg transition-shadow", onClick: () => handleOpportunityClick(opportunity), children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: opportunity.marketType }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Event ID: ", opportunity.eventId] })] }), _jsxs(Badge, { variant: opportunity.expectedValue >= 0.1
                                                        ? 'success'
                                                        : opportunity.expectedValue >= 0
                                                            ? 'primary'
                                                            : 'danger', children: ["EV: ", opportunity.expectedValue.toFixed(2)] })] }), _jsxs("div", { className: "mt-2", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Prediction: ", opportunity.prediction.toFixed(2)] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Kelly Fraction: ", opportunity.kellyFraction.toFixed(2)] })] })] }, opportunity.id))) })] })] }), _jsx(Modal, { isOpen: showDetailsModal, title: "Prediction Details", onClose: () => setShowDetailsModal(false), children: selectedPrediction && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: "Market Information" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Type: ", selectedPrediction.marketType] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Event ID: ", selectedPrediction.eventId] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: "Prediction Details" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Value: ", selectedPrediction.prediction.toFixed(2)] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Confidence: ", selectedPrediction.confidence.toFixed(2)] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: "Features" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: Object.entries(selectedPrediction.features).map(([key, value]) => (_jsxs("div", { className: "text-sm", children: [_jsxs("span", { className: "text-gray-600", children: [key, ":"] }), _jsx("span", { className: "ml-2", children: value.toFixed(2) })] }, key))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: "Metadata" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: Object.entries(selectedPrediction.metadata).map(([key, value]) => (_jsxs("div", { className: "text-sm", children: [_jsxs("span", { className: "text-gray-600", children: [key, ":"] }), _jsx("span", { className: "ml-2", children: value })] }, key))) })] })] })) }), toast && _jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })] }));
};
