import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { ShapBreakdownModal } from './ShapBreakdownModal';
export function ShapValueDisplay({ feature }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const getColor = (value) => {
        if (value > 0)
            return 'bg-green-500';
        if (value < 0)
            return 'bg-red-500';
        return 'bg-gray-500';
    };
    const getBarWidth = (value) => {
        // Normalize the value to a percentage between 0 and 100
        const normalizedValue = Math.abs(value) * 100;
        return Math.min(normalizedValue, 100);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors", onClick: () => setIsModalOpen(true), children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: feature.feature }), _jsx("span", { className: "font-medium", children: feature.value.toFixed(3) })] }), _jsx("div", { className: "h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: `${getColor(feature.value)} h-full transition-all duration-300 ease-in-out`, style: {
                                width: `${getBarWidth(feature.value)}%`,
                                marginLeft: feature.value < 0 ? 'auto' : '0',
                            } }) }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500 dark:text-gray-400", children: [_jsxs("span", { children: ["Weight: ", feature.weight?.toFixed(2) ?? 'N/A'] }), _jsx("span", { children: feature.value > 0
                                    ? 'Positive Impact'
                                    : feature.value < 0
                                        ? 'Negative Impact'
                                        : 'Neutral' })] })] }), _jsx(ShapBreakdownModal, { feature: feature, isOpen: isModalOpen, onClose: () => setIsModalOpen(false) })] }));
}
