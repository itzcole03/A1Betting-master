import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const WinProbabilityMeter = ({ winProbability }) => {
    if (!winProbability)
        return _jsx("div", { className: "text-gray-400", children: "No win probability" });
    const { probability, impliedOdds, modelOdds } = winProbability;
    return (_jsxs("div", { className: "flex flex-col items-center my-2", children: [_jsxs("div", { className: "w-3/4 bg-gray-200 rounded-full h-4 relative", children: [_jsx("div", { className: "bg-green-500 h-4 rounded-full", style: { width: `${Math.round(probability * 100)}%` } }), _jsxs("span", { className: "absolute left-1/2 top-0 text-xs text-gray-700", style: { transform: 'translateX(-50%)' }, children: [Math.round(probability * 100), "%"] })] }), _jsxs("div", { className: "text-xs mt-1 text-gray-700", children: ["Implied Odds: ", impliedOdds?.toFixed(2) ?? '--', " | Model Odds: ", modelOdds?.toFixed(2) ?? '--'] })] }));
};
