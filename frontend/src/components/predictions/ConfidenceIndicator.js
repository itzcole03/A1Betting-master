import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const ConfidenceIndicator = ({ confidence }) => {
    const getConfidenceColor = (value) => {
        if (value >= 0.8)
            return 'bg-green-500';
        if (value >= 0.6)
            return 'bg-yellow-500';
        return 'bg-red-500';
    };
    const getConfidenceLabel = (value) => {
        if (value >= 0.8)
            return 'High';
        if (value >= 0.6)
            return 'Medium';
        return 'Low';
    };
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Confidence" }), _jsx("span", { className: "text-sm font-medium", children: getConfidenceLabel(confidence) })] }), _jsx("div", { className: "h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full ${getConfidenceColor(confidence)} transition-all duration-500`, style: { width: `${confidence * 100}%` } }) }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsx("span", { children: "0%" }), _jsx("span", { children: "50%" }), _jsx("span", { children: "100%" })] })] }));
};
export default React.memo(ConfidenceIndicator);
