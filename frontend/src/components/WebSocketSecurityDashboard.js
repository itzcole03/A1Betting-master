import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Shield, Lock, Wifi, WifiOff, AlertTriangle, CheckCircle, } from "lucide-react";
export const WebSocketSecurityDashboard = () => {
    const [connections, setConnections] = useState([]);
    const [securityLevel, setSecurityLevel] = useState("high");
    useEffect(() => {
        // Mock connection data
        const mockConnections = [
            {
                id: "odds-feed",
                name: "Live Odds Feed",
                status: "connected",
                lastSeen: new Date(),
                messageCount: 1247,
                security: "secure",
            },
            {
                id: "prediction-stream",
                name: "ML Prediction Stream",
                status: "connected",
                lastSeen: new Date(Date.now() - 30000),
                messageCount: 342,
                security: "secure",
            },
            {
                id: "arbitrage-alerts",
                name: "Arbitrage Alerts",
                status: "disconnected",
                lastSeen: new Date(Date.now() - 120000),
                messageCount: 89,
                security: "secure",
            },
        ];
        setConnections(mockConnections);
        // Update connections periodically
        const interval = setInterval(() => {
            setConnections((prev) => prev.map((conn) => ({
                ...conn,
                messageCount: conn.status === "connected"
                    ? conn.messageCount + Math.floor(Math.random() * 5)
                    : conn.messageCount,
                lastSeen: conn.status === "connected" ? new Date() : conn.lastSeen,
            })));
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    const getStatusIcon = (status) => {
        switch (status) {
            case "connected":
                return _jsx(Wifi, { className: "w-4 h-4 text-green-500" });
            case "disconnected":
                return _jsx(WifiOff, { className: "w-4 h-4 text-gray-500" });
            case "error":
                return _jsx(AlertTriangle, { className: "w-4 h-4 text-red-500" });
            default:
                return _jsx(WifiOff, { className: "w-4 h-4 text-gray-500" });
        }
    };
    const getSecurityIcon = (security) => {
        return security === "secure" ? (_jsx(Lock, { className: "w-4 h-4 text-green-500" })) : (_jsx(AlertTriangle, { className: "w-4 h-4 text-red-500" }));
    };
    const connectedCount = connections.filter((c) => c.status === "connected").length;
    const secureCount = connections.filter((c) => c.security === "secure").length;
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-blue-100 dark:bg-blue-900 rounded-lg", children: _jsx(Shield, { className: "w-6 h-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "WebSocket Security Dashboard" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Real-time connection monitoring" })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [connectedCount, "/", connections.length] }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Connected" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [secureCount, "/", connections.length] }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Secure" })] })] })] }), _jsx("div", { className: "mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(CheckCircle, { className: `w-5 h-5 ${securityLevel === "high"
                                        ? "text-green-500"
                                        : securityLevel === "medium"
                                            ? "text-yellow-500"
                                            : "text-red-500"}` }), _jsxs("span", { className: "font-medium text-gray-900 dark:text-white", children: ["Security Level: ", securityLevel.toUpperCase()] })] }), _jsx("div", { className: "flex space-x-1", children: [1, 2, 3].map((level) => (_jsx("div", { className: `w-3 h-6 rounded ${level <=
                                    (securityLevel === "high"
                                        ? 3
                                        : securityLevel === "medium"
                                            ? 2
                                            : 1)
                                    ? securityLevel === "high"
                                        ? "bg-green-500"
                                        : securityLevel === "medium"
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                    : "bg-gray-300 dark:bg-gray-600"}` }, level))) })] }) }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Active Connections" }), connections.map((connection) => (_jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [getStatusIcon(connection.status), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: connection.name }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Last seen: ", connection.lastSeen.toLocaleTimeString()] })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: [connection.messageCount.toLocaleString(), " messages"] }), _jsxs("div", { className: "flex items-center space-x-1", children: [getSecurityIcon(connection.security), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: connection.security })] })] }), _jsx("div", { className: `w-3 h-3 rounded-full ${connection.status === "connected"
                                            ? "bg-green-500 animate-pulse"
                                            : connection.status === "error"
                                                ? "bg-red-500"
                                                : "bg-gray-400"}` })] })] }, connection.id)))] }), _jsxs("div", { className: "mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-300 mb-2", children: "Security Recommendations" }), _jsxs("ul", { className: "text-sm text-blue-800 dark:text-blue-400 space-y-1", children: [_jsx("li", { children: "\u2022 All connections use SSL/TLS encryption" }), _jsx("li", { children: "\u2022 Connection tokens are rotated every 24 hours" }), _jsx("li", { children: "\u2022 Rate limiting is active on all endpoints" }), _jsx("li", { children: "\u2022 Failed connection attempts are monitored" })] })] })] }));
};
export default WebSocketSecurityDashboard;
