import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const StatusIndicator = ({ status, label }) => {
    const statusColors = {
        active: "bg-green-400",
        warning: "bg-yellow-400",
        error: "bg-red-400",
    };
    return (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: `w-2 h-2 ${statusColors[status]} rounded-full animate-pulse` }), _jsx("span", { className: "text-sm text-gray-300", children: label })] }));
};
export default StatusIndicator;
