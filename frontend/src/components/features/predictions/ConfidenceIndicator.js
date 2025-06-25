import { jsx as _jsx } from "react/jsx-runtime";
export function ConfidenceIndicator({ value, size = 'md' }) {
    const getColor = (value) => {
        if (value >= 0.8)
            return 'bg-green-500';
        if (value >= 0.6)
            return 'bg-yellow-500';
        if (value >= 0.4)
            return 'bg-orange-500';
        return 'bg-red-500';
    };
    const getSize = (size) => {
        switch (size) {
            case 'sm':
                return 'h-1 w-16';
            case 'lg':
                return 'h-3 w-32';
            default:
                return 'h-2 w-24';
        }
    };
    return (_jsx("div", { className: `${getSize(size)} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`, children: _jsx("div", { className: `${getColor(value)} h-full transition-all duration-300 ease-in-out`, style: { width: `${value * 100}%` } }) }));
}
