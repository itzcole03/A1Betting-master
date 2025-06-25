import { jsx as _jsx } from "react/jsx-runtime";
import Tooltip from '@mui/material/Tooltip';
const getConfidenceColor = (value) => {
    if (value >= 0.8)
        return 'bg-green-500';
    if (value >= 0.6)
        return 'bg-yellow-500';
    return 'bg-red-500';
};
const getSizeClasses = (size) => {
    switch (size) {
        case 'small':
            return 'w-2 h-2';
        case 'large':
            return 'w-4 h-4';
        default:
            return 'w-3 h-3';
    }
};
export const ConfidenceIndicator = ({ value, size = 'medium', }) => {
    const color = getConfidenceColor(value);
    const sizeClasses = getSizeClasses(size);
    return (_jsx(Tooltip, { title: `${Math.round(value * 100)}% Confidence`, children: _jsx("div", { "aria-label": `Confidence level: ${Math.round(value * 100)}%`, className: `${sizeClasses} ${color} rounded-full transition-colors duration-300`, role: "status" }) }));
};
