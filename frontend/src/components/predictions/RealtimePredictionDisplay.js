import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import ConfidenceIndicator from './ConfidenceIndicator';
import ShapValueDisplay from './ShapValueDisplay';
import PayoutPreviewPanel from './PayoutPreviewPanel';
const RealtimePredictionDisplay = ({ sport, eventId, }) => {
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { lastMessage, connectionStatus } = useWebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}/predictions/${sport}/${eventId}`);
    useEffect(() => {
        if (lastMessage) {
            try {
                const data = JSON.parse(lastMessage);
                setPrediction(data);
                setError(null);
            }
            catch (err) {
                setError('Failed to parse prediction data');
            }
            setIsLoading(false);
        }
    }, [lastMessage]);
    if (isLoading) {
        return (_jsxs("div", { className: "modern-card p-6 animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4 mb-4" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2" })] }));
    }
    if (error) {
        return (_jsx("div", { className: "modern-card p-6 bg-red-50 dark:bg-red-900/20", children: _jsx("p", { className: "text-red-600 dark:text-red-400", children: error }) }));
    }
    if (!prediction) {
        return (_jsx("div", { className: "modern-card p-6", children: _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "No prediction available" }) }));
    }
    return (_jsxs("div", { className: "modern-card p-6 space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-semibold", children: prediction.eventName }), _jsx("span", { className: `px-2 py-1 rounded text-sm ${connectionStatus === 'Connected'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'}`, children: connectionStatus })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2", children: "Prediction Details" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: ["Bet Type: ", prediction.betType] }), _jsxs("p", { children: ["Recommended Stake: ", prediction.recommendedStake, "%"] }), _jsx(ConfidenceIndicator, { confidence: prediction.confidence })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2", children: "Feature Impact" }), _jsx(ShapValueDisplay, { shapValues: prediction.shapValues })] })] }), _jsx(PayoutPreviewPanel, { prediction: prediction, stake: prediction.recommendedStake })] }));
};
export default React.memo(RealtimePredictionDisplay);
