import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const ShapValueDisplay = ({ shapValues }) => {
    const sortedValues = [...shapValues].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    return (_jsx("div", { className: "space-y-2", children: sortedValues.map((item, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm truncate max-w-[60%]", children: item.feature }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-24 h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full ${item.impact > 0 ? 'bg-green-500' : 'bg-red-500'}`, style: {
                                    width: `${Math.min(Math.abs(item.value) * 100, 100)}%`,
                                    marginLeft: item.impact < 0 ? 'auto' : '0',
                                } }) }), _jsx("span", { className: `text-sm font-medium ${item.impact > 0 ? 'text-green-600' : 'text-red-600'}`, children: item.value.toFixed(2) })] })] }, index))) }));
};
export default React.memo(ShapValueDisplay);
