import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip } from '../ui/UnifiedUI';
export const UncertaintyIndicator = ({ value, className = '', }) => {
    const getColor = (uncertainty) => {
        if (uncertainty <= 0.1)
            return 'bg-green-500';
        if (uncertainty <= 0.2)
            return 'bg-yellow-500';
        return 'bg-red-500';
    };
    const getLabel = (uncertainty) => {
        if (uncertainty <= 0.1)
            return 'Low Uncertainty';
        if (uncertainty <= 0.2)
            return 'Medium Uncertainty';
        return 'High Uncertainty';
    };
    return (_jsx(Tooltip, { content: `${(value * 100).toFixed(1)}% Uncertainty`, children: _jsxs("div", { className: `flex items-center space-x-1 ${className}`, children: [_jsx("div", { className: `w-2 h-2 rounded-full ${getColor(value)}` }), _jsx("span", { className: "text-xs text-gray-600", children: getLabel(value) })] }) }));
};
