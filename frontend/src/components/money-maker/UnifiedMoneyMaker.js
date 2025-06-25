import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useCallback, useState } from "react";
import { useMoneyMakerStore } from "@/stores/moneyMakerStore";
import { Card, Button, Input, Select, Spinner, Toast, Badge, Tabs, Tab, Progress, } from "../ui/UnifiedUI";
export const UnifiedMoneyMaker = () => {
    const store = useMoneyMakerStore();
    const { config, predictions, portfolios, metrics, isLoading, error, lastUpdate, filters, sort, } = store;
    const [activeTab, setActiveTab] = useState("config");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("info");
    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                store.setLoading(true);
                // Load initial data from your backend
                // This is where you would integrate with your actual services
                store.setLoading(false);
            }
            catch (error) {
                handleError("Failed to load initial data", error);
            }
        };
        loadData();
    }, []);
    // Fetch predictions on mount and when filters/sort change
    useEffect(() => {
        store.fetchPredictions();
    }, [JSON.stringify(filters), JSON.stringify(sort)]);
    const handleError = useCallback((message, error) => {
        store.setError(message);
        setToastMessage(message);
        setToastType("error");
        setShowToast(true);
        console.error(message, error);
    }, []);
    const handleTabChange = useCallback((value) => {
        setActiveTab(value);
    }, []);
    const handleConfigChange = useCallback((key, value) => {
        try {
            store.updateConfig({ [key]: value });
            setToastMessage("Configuration updated successfully");
            setToastType("success");
            setShowToast(true);
        }
        catch (error) {
            handleError("Failed to update configuration", error);
        }
    }, [store.updateConfig]);
    const handleInputChange = useCallback((key) => (value) => {
        const numValue = key === "timeHorizon" || key === "investmentAmount"
            ? Number(value)
            : value;
        handleConfigChange(key, numValue);
    }, [handleConfigChange]);
    const handleGeneratePortfolio = useCallback(async () => {
        try {
            store.setLoading(true);
            // Generate portfolio based on current predictions and config
            // This is where you would integrate with your portfolio generation logic
            store.setLoading(false);
        }
        catch (error) {
            handleError("Failed to generate portfolio", error);
        }
    }, [config, predictions]);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };
    const formatPercentage = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "percent",
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(value / 100);
    };
    const handleShowDetails = useCallback((prediction) => {
        // TODO: Implement details modal
        console.log("Show details for prediction:", prediction);
    }, []);
    const handlePlaceBet = useCallback((prediction) => {
        // TODO: Implement bet placement
        console.log("Place bet for prediction:", prediction);
    }, []);
    const getBadgeVariant = (riskLevel) => {
        switch (riskLevel) {
            case "low":
                return "success";
            case "medium":
                return "warning";
            case "high":
                return "danger";
            default:
                return "warning";
        }
    };
    // Sorting/filtering handlers
    const handleSortChange = (field) => {
        store.updateSort({
            field,
            direction: sort.direction === "asc" ? "desc" : "asc",
        });
    };
    const handleFilterChange = (key, value) => {
        store.updateFilters({ [key]: value });
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Spinner, { size: "large" }) }));
    }
    return (_jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Money Maker" }), _jsx(Badge, { variant: "success", children: "Active" })] }), _jsxs(Tabs, { className: "mb-8", value: activeTab, onChange: handleTabChange, children: [_jsx(Tab, { label: "Configuration", value: "config" }), _jsx(Tab, { label: "Predictions", value: "predictions" }), _jsx(Tab, { label: "Portfolios", value: "portfolios" }), _jsx(Tab, { label: "Metrics", value: "metrics" })] }), activeTab === "config" && (_jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Configuration" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Investment Amount" }), _jsx(Input, { max: "100000", min: "0", type: "number", value: String(config.investmentAmount), onChange: handleInputChange("investmentAmount") })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Time Horizon (Hours)" }), _jsx(Input, { max: "72", min: "1", type: "number", value: String(config.timeHorizon), onChange: handleInputChange("timeHorizon") })] })] })] })), activeTab === "predictions" && (_jsxs(Card, { className: "p-6", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4", children: _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Select, { className: "w-32", options: [
                                            { value: "", label: "All Risks" },
                                            { value: "low", label: "Low" },
                                            { value: "medium", label: "Medium" },
                                            { value: "high", label: "High" },
                                        ], value: filters.riskLevel || "", onChange: (value) => handleFilterChange("riskLevel", value || undefined) }), _jsx(Select, { className: "w-32", options: [
                                            { value: "", label: "All Models" },
                                            // Optionally map over available models
                                        ], value: filters.modelId || "", onChange: (value) => handleFilterChange("modelId", value || undefined) }), _jsx(Select, { className: "w-32", options: [
                                            { value: "confidence", label: "Confidence" },
                                            { value: "expectedValue", label: "Expected Value" },
                                            { value: "odds", label: "Odds" },
                                            { value: "timestamp", label: "Timestamp" },
                                        ], value: sort.field, onChange: (value) => handleSortChange(value) })] }) }), isLoading ? (_jsx("div", { className: "flex items-center justify-center min-h-[200px]", children: _jsx(Spinner, { size: "large" }) })) : predictions.length === 0 ? (_jsx("div", { className: "text-center text-gray-500 py-8", children: "No predictions available." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left", children: "Label" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Confidence" }), _jsx("th", { className: "px-4 py-2 text-left", children: "EV" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Model" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Timestamp" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Rationale" })] }) }), _jsx("tbody", { children: predictions.map((pred) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-4 py-2 font-medium", children: [pred.selection, " (", pred.marketType, ")"] }), _jsxs("td", { className: "px-4 py-2", children: [(pred.confidence * 100).toFixed(1), "%"] }), _jsx("td", { className: "px-4 py-2", children: pred.expectedValue.toFixed(3) }), _jsx("td", { className: "px-4 py-2", children: pred.metadata.modelVersion ||
                                                        Object.keys(pred.modelContributions).join(", ") }), _jsx("td", { className: "px-4 py-2", children: new Date(pred.metadata.timestamp).toLocaleString() }), _jsx("td", { className: "px-4 py-2", children: pred.explanation &&
                                                        pred.explanation.decisionPath &&
                                                        pred.explanation.decisionPath.length > 0 ? (_jsx("span", { children: pred.explanation.decisionPath.join(" → ") })) : (_jsx("span", { className: "text-gray-400", children: "\u2014" })) })] }, pred.eventId))) })] }) }))] })), activeTab === "portfolios" && (_jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-bold", children: "Active Portfolios" }), _jsx(Button, { variant: "primary", onClick: handleGeneratePortfolio, children: "Generate New Portfolio" })] }), _jsx("div", { className: "space-y-4", children: portfolios.map((portfolio) => (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-medium", children: ["Portfolio ", portfolio.id] }), _jsxs("p", { className: "text-sm text-gray-500", children: [portfolio.legs.length, " legs"] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-medium", children: ["Total Odds: ", portfolio.totalOdds.toFixed(2)] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["EV: ", formatPercentage(portfolio.expectedValue)] })] })] }), _jsx(Progress, { className: "mt-2", value: portfolio.confidence })] }, portfolio.id))) })] })), activeTab === "metrics" && (_jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Performance Metrics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h3", { className: "font-medium mb-2", children: "Overall Performance" }), _jsx("p", { className: "text-2xl font-bold", children: formatCurrency(metrics.totalProfit) }), _jsxs("p", { className: "text-sm text-gray-500", children: ["ROI: ", formatPercentage(metrics.roi)] })] }), _jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h3", { className: "font-medium mb-2", children: "Success Rate" }), _jsx("p", { className: "text-2xl font-bold", children: formatPercentage(metrics.successRate) }), _jsxs("p", { className: "text-sm text-gray-500", children: [metrics.winningBets, " / ", metrics.totalBets, " bets"] })] }), _jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h3", { className: "font-medium mb-2", children: "Risk Metrics" }), _jsx("p", { className: "text-2xl font-bold", children: metrics.sharpeRatio.toFixed(2) }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Max Drawdown: ", formatPercentage(metrics.maxDrawdown)] })] })] })] })), showToast && (_jsx(Toast, { message: toastMessage, type: toastType, onClose: () => setShowToast(false) }))] }) }));
};
export default UnifiedMoneyMaker;
