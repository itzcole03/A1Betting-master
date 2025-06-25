import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ConfidenceBandChart = ({ band }) => {
    if (!band)
        return _jsx("div", { className: "text-gray-400", children: "No confidence data" });
    const { lower, upper, mean, confidenceLevel } = band;
    // Simple horizontal bar visualization
    return (_jsxs("div", { className: "w-full flex flex-col items-center my-2", children: [_jsxs("div", { className: "w-3/4 h-4 bg-gray-200 rounded relative", children: [_jsx("div", { className: "absolute bg-blue-400 h-4 rounded", style: { left: `${((lower - lower) / (upper - lower)) * 100}%`, width: `${((upper - lower) / (upper - lower)) * 100}%` } }), _jsx("div", { className: "absolute left-1/2 top-0 h-4 w-1 bg-black", style: { left: `${((mean - lower) / (upper - lower)) * 100}%` } })] }), _jsxs("div", { className: "text-xs mt-1 text-gray-700", children: [`[${lower.toFixed(2)} - ${upper.toFixed(2)}]`, " (mean: ", mean.toFixed(2), ", ", Math.round(confidenceLevel * 100), "% CI)"] })] }));
};
