import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Displays risk reasoning as a list with icons and severity styling.
 * Omits display if riskReasoning is empty or undefined.
 */
export function RiskReasoningDisplay({ riskReasoning, className = "" }) {
    if (!riskReasoning || riskReasoning.length === 0)
        return null;
    // Simple severity detection (can be improved)
    const getSeverity = (reason) => {
        if (/low|minor|no major/i.test(reason))
            return "low";
        if (/high|critical|elevated|volatility|risk/i.test(reason))
            return "high";
        return "medium";
    };
    const iconForSeverity = (severity) => {
        switch (severity) {
            case "high":
                return _jsx("span", { className: "text-red-500 mr-1", title: "High Risk", children: "\u26A0\uFE0F" });
            case "medium":
                return _jsx("span", { className: "text-yellow-500 mr-1", title: "Medium Risk", children: "\uD83E\uDDE0" });
            case "low":
            default:
                return _jsx("span", { className: "text-green-500 mr-1", title: "Low Risk", children: "\uD83D\uDD0D" });
        }
    };
    return (_jsxs("div", { className: `risk-reasoning-display bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2 ${className}`, children: [_jsxs("div", { className: "font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center", children: [_jsx("span", { className: "mr-2", children: "Risk Reasoning" }), _jsxs("span", { className: "text-xs text-gray-400", children: ["(", riskReasoning.length, ")"] })] }), _jsx("ul", { className: "space-y-1", children: riskReasoning.map((reason, idx) => {
                    const severity = getSeverity(reason);
                    return (_jsxs("li", { className: "flex items-start text-sm", children: [iconForSeverity(severity), _jsx("span", { className: severity === "high"
                                    ? "text-red-700 dark:text-red-400"
                                    : severity === "medium"
                                        ? "text-yellow-700 dark:text-yellow-400"
                                        : "text-green-700 dark:text-green-400", children: reason })] }, idx));
                }) })] }));
}
