import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip } from '../ui/UnifiedUI';
export const ShapValueBar = ({ name, value, className = '' }) => {
    const absValue = Math.abs(value);
    const isPositive = value > 0;
    const color = isPositive ? 'bg-green-500' : 'bg-red-500';
    const formattedName = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (_jsx(Tooltip, { content: `${value.toFixed(4)} (${isPositive ? 'Positive' : 'Negative'} Impact)`, children: _jsxs("div", { className: `space-y-1 ${className}`, children: [_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-gray-600", children: formattedName }), _jsx("span", { className: `font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`, children: value.toFixed(4) })] }), _jsx("div", { className: "h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full ${color} transition-all duration-300`, style: { width: `${Math.min(absValue * 100, 100)}%` } }) })] }) }));
};
