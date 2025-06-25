import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useRealtimePredictions } from '../hooks/useRealtimePredictions';
import { usePredictions } from '../hooks/usePredictions';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { ShapValueDisplay } from './ShapValueDisplay';
export function RealtimePredictionDisplay({ predictionId, className = '', }) {
    const { isConnected, isConnecting, lastMessageTimestamp, isStale } = useRealtimePredictions({
        channels: ['predictions'],
        onError: error => {
            console.error('WebSocket error:', error);
        },
    });
    const { getPrediction, getConfidenceColor } = usePredictions();
    const prediction = getPrediction(predictionId);
    const formatTimestamp = (timestamp) => {
        if (!timestamp)
            return 'Never';
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    };
    if (!prediction) {
        return (_jsx("div", { className: `p-4 rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Loading prediction..." }), isConnecting && (_jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" }))] }) }));
    }
    return (_jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: `p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${className}`, exit: { opacity: 0, y: -20 }, initial: { opacity: 0, y: 20 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Real-time Prediction" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: `text-sm ${getConfidenceColor(prediction.confidence)}`, children: [Math.round(prediction.confidence * 100), "% Confidence"] }), _jsx(ConfidenceIndicator, { value: prediction.confidence })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Predicted Value" }), _jsx("span", { className: "text-xl font-bold", children: prediction.value.toFixed(2) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "Feature Importance" }), _jsx("div", { className: "space-y-2", children: prediction.factors.map(factor => (_jsx(ShapValueDisplay, { name: factor.name, value: factor.impact, weight: factor.weight }, factor.name))) })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: `h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}` }), _jsx("span", { className: isConnected ? 'text-green-500' : 'text-red-500', children: isConnected ? 'Connected' : 'Disconnected' })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: `text-sm ${isStale ? 'text-red-500' : 'text-green-500'}`, children: isStale ? 'Stale' : 'Live' }), _jsxs("span", { className: "text-gray-500", children: ["Last update: ", formatTimestamp(lastMessageTimestamp)] })] })] })] })] }));
}
