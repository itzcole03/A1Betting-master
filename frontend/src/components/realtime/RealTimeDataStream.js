import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRealtimeData } from "../../hooks/useRealtimeData";
import { useUnifiedAnalytics } from "../../hooks/useUnifiedAnalytics";
const RealTimeDataStream = () => {
    const [streamData, setStreamData] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [metrics, setMetrics] = useState({
        latency: 0,
        messagesPerSecond: 0,
        connectionUptime: 0,
        totalMessages: 0,
        errors: 0,
    });
    const [filters, setFilters] = useState({
        types: new Set(["odds", "injury", "arbitrage", "prediction"]),
        sources: new Set(["prizepicks", "sportsradar", "internal"]),
        minImpact: "low",
        maxMessages: 100,
    });
    const [autoScroll, setAutoScroll] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const { realtime } = useUnifiedAnalytics({ realtime: true });
    // Real-time WebSocket connection
    const { data, isConnected: wsConnected } = useRealtimeData({
        url: "ws://localhost:8080/realtime",
        onMessage: useCallback((message) => {
            const newData = {
                timestamp: Date.now(),
                type: message.type || "market",
                source: message.source || "unknown",
                data: message.data || message,
                impact: message.impact || "medium",
                processed: false,
            };
            setStreamData((prev) => {
                const updated = [newData, ...prev].slice(0, filters.maxMessages);
                return updated;
            });
            setMetrics((prev) => ({
                ...prev,
                totalMessages: prev.totalMessages + 1,
                messagesPerSecond: prev.messagesPerSecond + 0.1, // Approximate
            }));
        }, [filters.maxMessages]),
        onConnect: useCallback(() => {
            setIsConnected(true);
            setMetrics((prev) => ({ ...prev, connectionUptime: Date.now() }));
        }, []),
        onDisconnect: useCallback(() => {
            setIsConnected(false);
        }, []),
        onError: useCallback(() => {
            setMetrics((prev) => ({ ...prev, errors: prev.errors + 1 }));
        }, []),
    });
    // Simulated real-time data generator for development
    useEffect(() => {
        if (!wsConnected) {
            const interval = setInterval(() => {
                const mockData = generateMockStreamData();
                const newData = {
                    timestamp: Date.now(),
                    type: mockData.type,
                    source: mockData.source,
                    data: mockData.data,
                    impact: mockData.impact,
                    processed: false,
                };
                setStreamData((prev) => {
                    const updated = [newData, ...prev].slice(0, filters.maxMessages);
                    return updated;
                });
                setMetrics((prev) => ({
                    ...prev,
                    totalMessages: prev.totalMessages + 1,
                    latency: Math.random() * 50 + 10, // Simulate latency 10-60ms
                }));
            }, 2000 + Math.random() * 3000); // Random interval 2-5 seconds
            return () => clearInterval(interval);
        }
    }, [wsConnected, filters.maxMessages]);
    const generateMockStreamData = () => {
        const types = [
            "odds",
            "injury",
            "lineup",
            "weather",
            "market",
            "prediction",
            "arbitrage",
        ];
        const sources = [
            "prizepicks",
            "sportsradar",
            "espn",
            "internal",
            "external",
        ];
        const impacts = ["high", "medium", "low"];
        const type = types[Math.floor(Math.random() * types.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const impact = impacts[Math.floor(Math.random() * impacts.length)];
        const mockDataMap = {
            odds: {
                playerId: "player_123",
                propType: "points",
                oldOdds: -110,
                newOdds: -105,
                change: 5,
                bookmaker: "DraftKings",
            },
            injury: {
                playerId: "player_456",
                playerName: "LeBron James",
                severity: "questionable",
                bodyPart: "ankle",
                gameImpact: "probable",
            },
            arbitrage: {
                opportunity: {
                    profit: 3.2,
                    investment: 100,
                    books: ["FanDuel", "BetMGM"],
                    odds: [+150, -140],
                },
            },
            prediction: {
                predictionId: "pred_789",
                confidence: 0.78,
                value: 23.5,
                change: 1.2,
            },
            market: {
                sentiment: "bullish",
                volume: "high",
                priceMovement: "+2.3%",
            },
        };
        return {
            type,
            source,
            impact,
            data: mockDataMap[type] || {
                raw: "Unknown data type",
            },
        };
    };
    // Filtered data based on current filters
    const filteredData = useMemo(() => {
        return streamData.filter((item) => {
            if (!filters.types.has(item.type))
                return false;
            if (!filters.sources.has(item.source))
                return false;
            const impactLevel = { low: 1, medium: 2, high: 3 };
            const minLevel = impactLevel[filters.minImpact];
            const itemLevel = impactLevel[item.impact];
            return itemLevel >= minLevel;
        });
    }, [streamData, filters]);
    const toggleFilter = useCallback((category, value) => {
        setFilters((prev) => {
            const newSet = new Set(prev[category]);
            if (newSet.has(value)) {
                newSet.delete(value);
            }
            else {
                newSet.add(value);
            }
            return { ...prev, [category]: newSet };
        });
    }, []);
    const clearStream = useCallback(() => {
        setStreamData([]);
        setMetrics((prev) => ({ ...prev, totalMessages: 0, errors: 0 }));
    }, []);
    const exportStream = useCallback(() => {
        const exportData = {
            timestamp: new Date().toISOString(),
            metrics,
            filters: {
                ...filters,
                types: Array.from(filters.types),
                sources: Array.from(filters.sources),
            },
            data: filteredData,
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `realtime-stream-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [metrics, filters, filteredData]);
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString();
    };
    const getImpactColor = (impact) => {
        switch (impact) {
            case "high":
                return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
            case "medium":
                return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
            case "low":
                return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
            default:
                return "text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };
    const getTypeIcon = (type) => {
        const icons = {
            odds: "📊",
            injury: "🏥",
            lineup: "👥",
            weather: "🌤️",
            market: "📈",
            prediction: "🔮",
            arbitrage: "⚖️",
        };
        return icons[type] || "📡";
    };
    return (_jsxs("div", { className: "realtime-stream max-w-7xl mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "\u26A1 Real-Time Data Stream" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}` }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-300", children: isConnected ? "Connected" : "Disconnected" })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("button", { onClick: () => setAutoScroll(!autoScroll), className: `px-3 py-1 text-sm rounded ${autoScroll
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"}`, children: ["Auto-scroll: ", autoScroll ? "ON" : "OFF"] }), _jsx("button", { onClick: exportStream, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700", children: "Export" }), _jsx("button", { onClick: clearStream, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700", children: "Clear" })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4 mt-6", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [metrics.latency.toFixed(0), "ms"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Latency" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: metrics.totalMessages }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Messages" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [metrics.messagesPerSecond.toFixed(1), "/s"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Rate" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [Math.floor((Date.now() - metrics.connectionUptime) / 1000), "s"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Uptime" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: metrics.errors }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Errors" })] })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Filters" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Data Types" }), _jsx("div", { className: "flex flex-wrap gap-2", children: [
                                            "odds",
                                            "injury",
                                            "lineup",
                                            "weather",
                                            "market",
                                            "prediction",
                                            "arbitrage",
                                        ].map((type) => (_jsxs("button", { onClick: () => toggleFilter("types", type), className: `px-3 py-1 text-sm rounded-full ${filters.types.has(type)
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`, children: [getTypeIcon(type), " ", type] }, type))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Sources" }), _jsx("div", { className: "flex flex-wrap gap-2", children: [
                                            "prizepicks",
                                            "sportsradar",
                                            "espn",
                                            "internal",
                                            "external",
                                        ].map((source) => (_jsx("button", { onClick: () => toggleFilter("sources", source), className: `px-3 py-1 text-sm rounded-full ${filters.sources.has(source)
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`, children: source }, source))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Minimum Impact" }), _jsxs("select", { value: filters.minImpact, onChange: (e) => setFilters((prev) => ({
                                            ...prev,
                                            minImpact: e.target.value,
                                        })), className: "px-3 py-1 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "high", children: "High" })] })] })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow", children: [_jsx("div", { className: "p-6 border-b border-gray-200 dark:border-gray-700", children: _jsxs("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: ["Live Stream (", filteredData.length, " messages)"] }) }), _jsx("div", { className: "max-h-96 overflow-y-auto", style: { scrollBehavior: autoScroll ? "smooth" : "auto" }, children: filteredData.length === 0 ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCE1" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "Waiting for Data..." }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Real-time data will appear here as it streams in." })] })) : (_jsx("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: filteredData.map((item, index) => (_jsx("div", { className: "p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer", onClick: () => setSelectedItem(item), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "text-lg", children: getTypeIcon(item.type) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: item.type.charAt(0).toUpperCase() +
                                                                        item.type.slice(1) }), _jsx("span", { className: `px-2 py-1 text-xs rounded-full ${getImpactColor(item.impact)}`, children: item.impact })] }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["From ", item.source, " \u2022 ", formatTimestamp(item.timestamp)] })] })] }), _jsx("div", { className: "text-right", children: _jsx("div", { className: "text-sm text-gray-900 dark:text-white", children: typeof item.data === "object"
                                                    ? Object.keys(item.data).length + " fields"
                                                    : String(item.data) }) })] }) }, `${item.timestamp}-${index}`))) })) })] }), selectedItem && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [getTypeIcon(selectedItem.type), " ", selectedItem.type.charAt(0).toUpperCase() +
                                                selectedItem.type.slice(1), " ", "Data"] }), _jsx("button", { onClick: () => setSelectedItem(null), className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children: "\u2715" })] }) }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700 dark:text-gray-300", children: "Source:" }), _jsx("span", { className: "ml-2 text-gray-900 dark:text-white", children: selectedItem.source })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700 dark:text-gray-300", children: "Timestamp:" }), _jsx("span", { className: "ml-2 text-gray-900 dark:text-white", children: new Date(selectedItem.timestamp).toLocaleString() })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700 dark:text-gray-300", children: "Impact:" }), _jsx("span", { className: `ml-2 px-2 py-1 text-xs rounded-full ${getImpactColor(selectedItem.impact)}`, children: selectedItem.impact })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700 dark:text-gray-300", children: "Data:" }), _jsx("pre", { className: "mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-x-auto", children: JSON.stringify(selectedItem.data, null, 2) })] })] }) })] }) }))] }));
};
export default RealTimeDataStream;
