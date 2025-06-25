import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBettingAnalytics } from "../hooks/useBettingAnalytics";
import { useSmartAlerts } from "../hooks/useSmartAlerts";
import { Card } from "./base/Card";
import { Progress } from "./base/Progress";
import { Badge } from "./base/Badge";
import { Alert } from "./base/Alert";
import { Skeleton } from "./base/Skeleton";
import { Table } from "./base/Table";
export const BettingAnalytics = ({ onOpportunitySelect, }) => {
    const [selectedSport, setSelectedSport] = useState("all");
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
    const [sortField, setSortField] = useState("confidence");
    const [sortDirection, setSortDirection] = useState("desc");
    const { opportunities, predictions, performance, isLoading, error } = useBettingAnalytics({
        minConfidence: confidenceThreshold,
        autoRefresh: true,
        refreshInterval: 30000,
    });
    const { alerts } = useSmartAlerts({
        wsEndpoint: import.meta.env.VITE_WS_ENDPOINT || "",
        enabledTypes: ["LINE_MOVEMENT", "INJURY", "WEATHER"],
        minSeverity: "medium",
    });
    const filteredOpportunities = useMemo(() => {
        return opportunities
            .filter((opp) => selectedSport === "all" || opp.sport === selectedSport)
            .sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            return sortDirection === "asc"
                ? aValue > bValue
                    ? 1
                    : -1
                : bValue > aValue
                    ? 1
                    : -1;
        });
    }, [opportunities, selectedSport, sortField, sortDirection]);
    const handleOpportunityClick = useCallback((opportunity) => {
        onOpportunitySelect?.(opportunity);
    }, [onOpportunitySelect]);
    const renderPerformanceMetrics = () => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsx(Card, { children: _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "Win Rate" }), _jsxs("div", { className: "mt-2 flex items-center", children: [_jsxs("span", { className: "text-2xl font-semibold", children: [(performance.winRate * 100).toFixed(1), "%"] }), _jsx(Badge, { variant: performance.winRate >= 0.55 ? "success" : "warning", className: "ml-2", children: performance.winRate >= 0.55 ? "Profitable" : "Monitor" })] }), _jsx(Progress, { value: performance.winRate * 100, max: 100, variant: performance.winRate >= 0.55 ? "success" : "warning", className: "mt-2" })] }) }), _jsx(Card, { children: _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "ROI" }), _jsxs("div", { className: "mt-2 flex items-center", children: [_jsxs("span", { className: "text-2xl font-semibold", children: [(performance.roi * 100).toFixed(1), "%"] }), _jsx(Badge, { variant: performance.roi > 0 ? "success" : "danger", className: "ml-2", children: performance.roi > 0 ? "Positive" : "Negative" })] }), _jsx(Progress, { value: Math.min(Math.max(performance.roi * 100, 0), 100), max: 100, variant: performance.roi > 0 ? "success" : "danger", className: "mt-2" })] }) }), _jsx(Card, { children: _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "Edge Retention" }), _jsxs("div", { className: "mt-2 flex items-center", children: [_jsxs("span", { className: "text-2xl font-semibold", children: [(performance.edgeRetention * 100).toFixed(1), "%"] }), _jsx(Badge, { variant: performance.edgeRetention >= 0.7 ? "success" : "warning", className: "ml-2", children: performance.edgeRetention >= 0.7 ? "Strong" : "Weak" })] }), _jsx(Progress, { value: performance.edgeRetention * 100, max: 100, variant: performance.edgeRetention >= 0.7 ? "success" : "warning", className: "mt-2" })] }) })] }));
    if (error) {
        return (_jsx(Alert, { type: "error", title: "Error Loading Analytics", message: error.message }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [isLoading ? (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsx(Skeleton, { className: "h-32" }), _jsx(Skeleton, { className: "h-32" }), _jsx(Skeleton, { className: "h-32" })] })) : (renderPerformanceMetrics()), _jsx(Card, { children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Betting Opportunities" }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs("select", { className: "w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent", value: selectedSport, onChange: (e) => setSelectedSport(e.target.value), children: [_jsx("option", { value: "all", children: "All Sports" }), _jsx("option", { value: "NBA", children: "NBA" }), _jsx("option", { value: "NFL", children: "NFL" }), _jsx("option", { value: "MLB", children: "MLB" }), _jsx("option", { value: "NHL", children: "NHL" })] }), _jsxs("select", { className: "w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent", value: confidenceThreshold, onChange: (e) => setConfidenceThreshold(Number(e.target.value)), children: [_jsx("option", { value: 0.6, children: "60%+ Confidence" }), _jsx("option", { value: 0.7, children: "70%+ Confidence" }), _jsx("option", { value: 0.8, children: "80%+ Confidence" }), _jsx("option", { value: 0.9, children: "90%+ Confidence" })] })] })] }), _jsx(AnimatePresence, { children: alerts.length > 0 && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "mb-4", children: _jsx(Alert, { type: "warning", title: "Active Alerts", message: `${alerts.length} alert${alerts.length === 1 ? "" : "s"} require your attention` }) })) }), _jsx(Table, { data: filteredOpportunities, columns: [
                                {
                                    key: "sport",
                                    title: "Sport",
                                    render: (value) => _jsx(Badge, { variant: "default", children: value }),
                                },
                                {
                                    key: "description",
                                    title: "Opportunity",
                                    render: (value, item) => (_jsxs("div", { className: "flex items-center", children: [_jsx("span", { children: value }), alerts.some((alert) => alert.metadata.gameId === item.gameId) && (_jsx(Badge, { variant: "warning", className: "ml-2", children: "Alert" }))] })),
                                },
                                {
                                    key: "confidence",
                                    title: "Confidence",
                                    render: (value) => (_jsx("div", { className: "w-32", children: _jsx(Progress, { value: value * 100, max: 100, variant: value >= 0.8 ? "success" : "warning", showValue: true, size: "sm" }) })),
                                },
                                {
                                    key: "expectedValue",
                                    title: "Expected Value",
                                    render: (value) => (_jsxs("span", { className: value > 0 ? "text-green-600" : "text-red-600", children: [value > 0 ? "+" : "", (value * 100).toFixed(1), "%"] })),
                                },
                            ], onRowClick: handleOpportunityClick, emptyMessage: "No opportunities match your criteria", sortKey: sortField, sortDirection: sortDirection, onSort: (key) => {
                                if (key === sortField) {
                                    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                                }
                                else {
                                    setSortField(key);
                                    setSortDirection("desc");
                                }
                            } })] }) })] }));
};
