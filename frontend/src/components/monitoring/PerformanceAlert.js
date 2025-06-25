import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
const PerformanceAlert = ({ alert, onDismiss, onAcknowledge }) => {
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 border-red-500 text-red-700';
            case 'warning':
                return 'bg-yellow-100 border-yellow-500 text-yellow-700';
            case 'info':
                return 'bg-blue-100 border-blue-500 text-blue-700';
            default:
                return 'bg-gray-100 border-gray-500 text-gray-700';
        }
    };
    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'critical':
                return (_jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { clipRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", fillRule: "evenodd" }) }));
            case 'warning':
                return (_jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { clipRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", fillRule: "evenodd" }) }));
            case 'info':
                return (_jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { clipRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", fillRule: "evenodd" }) }));
            default:
                return null;
        }
    };
    return (_jsx(motion.div, { animate: { opacity: 1, y: 0 }, className: `rounded-lg border-l-4 p-4 ${getSeverityColor(alert.severity)}`, exit: { opacity: 0, y: 20 }, initial: { opacity: 0, y: -20 }, children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0", children: getSeverityIcon(alert.severity) }), _jsx("div", { className: "ml-3 w-full", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium", children: alert.metric }), _jsxs("div", { className: "mt-1 text-sm", children: [_jsx("p", { children: alert.message }), _jsxs("p", { className: "mt-1", children: ["Current value: ", alert.value.toFixed(2), " (Threshold: ", alert.threshold.toFixed(2), ")"] }), _jsx("p", { className: "text-xs mt-1", children: new Date(alert.timestamp).toLocaleString() })] })] }), _jsxs("div", { className: "flex space-x-2", children: [onAcknowledge && (_jsx("button", { className: "text-xs px-2 py-1 rounded bg-white bg-opacity-50 hover:bg-opacity-75 transition-colors", onClick: () => onAcknowledge(alert.id), children: "Acknowledge" })), onDismiss && (_jsx("button", { className: "text-xs px-2 py-1 rounded bg-white bg-opacity-50 hover:bg-opacity-75 transition-colors", onClick: () => onDismiss(alert.id), children: "Dismiss" }))] })] }) })] }) }));
};
export default React.memo(PerformanceAlert);
