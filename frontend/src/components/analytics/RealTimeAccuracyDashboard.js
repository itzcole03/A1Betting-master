import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Zap, Brain, RefreshCw, Gauge, } from "lucide-react";
import { Line, Radar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, ArcElement, Filler, } from "chart.js";
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, ArcElement, Filler);
export const RealTimeAccuracyDashboard = () => {
    const [currentMetrics, setCurrentMetrics] = useState(null);
    const [metricsHistory, setMetricsHistory] = useState([]);
    const [alerts, setAlerts] = useState(null);
    const [isLive, setIsLive] = useState(true);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("connecting");
    // Fetch current accuracy metrics
    const fetchCurrentMetrics = useCallback(async () => {
        try {
            setConnectionStatus("connecting");
            const response = await fetch("/api/v4/accuracy/current-metrics");
            if (response.ok) {
                const data = await response.json();
                setCurrentMetrics(data);
                setMetricsHistory((prev) => [...prev.slice(-100), data]); // Keep last 100 points
                setLastUpdate(new Date());
                setConnectionStatus("connected");
            }
            else {
                setConnectionStatus("disconnected");
            }
        }
        catch (error) {
            console.error("Error fetching accuracy metrics:", error);
            setConnectionStatus("disconnected");
        }
    }, []);
    // Fetch active alerts
    const fetchAlerts = useCallback(async () => {
        try {
            const response = await fetch("/api/v4/accuracy/alerts");
            if (response.ok) {
                const data = await response.json();
                setAlerts(data);
            }
        }
        catch (error) {
            console.error("Error fetching alerts:", error);
        }
    }, []);
    // Trigger accuracy optimization
    const triggerOptimization = useCallback(async (strategy = "quantum_ensemble") => {
        setIsOptimizing(true);
        try {
            const response = await fetch("/api/v4/accuracy/optimize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    strategy,
                    target_accuracy: 0.95,
                    ensemble_strategy: "multi_level_stacking",
                    weight_optimization: "bayesian_optimization",
                }),
            });
            if (response.ok) {
                const result = await response.json();
                console.log("Optimization triggered:", result);
                // Refresh metrics after optimization
                setTimeout(() => {
                    fetchCurrentMetrics();
                    fetchAlerts();
                }, 2000);
            }
        }
        catch (error) {
            console.error("Error triggering optimization:", error);
        }
        finally {
            setIsOptimizing(false);
        }
    }, [fetchCurrentMetrics, fetchAlerts]);
    // Real-time updates
    useEffect(() => {
        if (!isLive)
            return;
        const fetchData = async () => {
            await Promise.all([fetchCurrentMetrics(), fetchAlerts()]);
        };
        // Initial fetch
        fetchData();
        // Set up real-time polling
        const interval = setInterval(fetchData, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, [isLive, fetchCurrentMetrics, fetchAlerts]);
    // Get accuracy level styling
    const getAccuracyLevel = (accuracy) => {
        if (accuracy >= 0.97)
            return {
                level: "EXCEPTIONAL",
                color: "text-purple-600",
                bg: "bg-purple-100",
                border: "border-purple-500",
            };
        if (accuracy >= 0.92)
            return {
                level: "EXCELLENT",
                color: "text-green-600",
                bg: "bg-green-100",
                border: "border-green-500",
            };
        if (accuracy >= 0.85)
            return {
                level: "GOOD",
                color: "text-blue-600",
                bg: "bg-blue-100",
                border: "border-blue-500",
            };
        if (accuracy >= 0.75)
            return {
                level: "ACCEPTABLE",
                color: "text-yellow-600",
                bg: "bg-yellow-100",
                border: "border-yellow-500",
            };
        if (accuracy >= 0.6)
            return {
                level: "WARNING",
                color: "text-orange-600",
                bg: "bg-orange-100",
                border: "border-orange-500",
            };
        return {
            level: "CRITICAL",
            color: "text-red-600",
            bg: "bg-red-100",
            border: "border-red-500",
        };
    };
    // Chart data for accuracy trends
    const accuracyTrendData = useMemo(() => {
        if (metricsHistory.length < 2)
            return null;
        const labels = metricsHistory.map((m) => new Date(m.timestamp).toLocaleTimeString());
        return {
            labels,
            datasets: [
                {
                    label: "Overall Accuracy",
                    data: metricsHistory.map((m) => m.overall_accuracy * 100),
                    borderColor: "rgb(99, 102, 241)",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    tension: 0.1,
                    fill: true,
                },
                {
                    label: "Directional Accuracy",
                    data: metricsHistory.map((m) => m.directional_accuracy * 100),
                    borderColor: "rgb(34, 197, 94)",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    tension: 0.1,
                    fill: false,
                },
                {
                    label: "Model Agreement",
                    data: metricsHistory.map((m) => m.model_agreement * 100),
                    borderColor: "rgb(168, 85, 247)",
                    backgroundColor: "rgba(168, 85, 247, 0.1)",
                    tension: 0.1,
                    fill: false,
                },
            ],
        };
    }, [metricsHistory]);
    // Performance radar chart data
    const performanceRadarData = useMemo(() => {
        if (!currentMetrics)
            return null;
        return {
            labels: [
                "Overall Accuracy",
                "Directional Accuracy",
                "Model Agreement",
                "Prediction Confidence",
                "Uncertainty Quality",
                "Performance Stability",
            ],
            datasets: [
                {
                    label: "Current Performance",
                    data: [
                        currentMetrics.overall_accuracy * 100,
                        currentMetrics.directional_accuracy * 100,
                        currentMetrics.model_agreement * 100,
                        currentMetrics.prediction_confidence * 100,
                        currentMetrics.uncertainty_quality * 100,
                        currentMetrics.performance_stability * 100,
                    ],
                    backgroundColor: "rgba(99, 102, 241, 0.2)",
                    borderColor: "rgba(99, 102, 241, 1)",
                    pointBackgroundColor: "rgba(99, 102, 241, 1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(99, 102, 241, 1)",
                },
            ],
        };
    }, [currentMetrics]);
    if (!currentMetrics) {
        return (_jsx("div", { className: "flex items-center justify-center h-96", children: _jsxs("div", { className: "text-center", children: [_jsx(Activity, { className: "w-8 h-8 animate-pulse mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-500", children: "Loading real-time accuracy dashboard..." })] }) }));
    }
    const accuracyLevel = getAccuracyLevel(currentMetrics.overall_accuracy);
    return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Real-Time Accuracy Monitor" }), _jsxs("div", { className: "flex items-center gap-4 mt-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${connectionStatus === "connected"
                                                    ? "bg-green-500"
                                                    : connectionStatus === "connecting"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"}` }), _jsx("span", { className: "text-sm text-gray-600 capitalize", children: connectionStatus })] }), lastUpdate && (_jsxs("span", { className: "text-sm text-gray-500", children: ["Last update: ", lastUpdate.toLocaleTimeString()] }))] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs(Button, { onClick: () => setIsLive(!isLive), variant: isLive ? "default" : "outline", className: "flex items-center gap-2", children: [_jsx(Activity, { className: `w-4 h-4 ${isLive ? "animate-pulse" : ""}` }), isLive ? "Live" : "Paused"] }), _jsxs(Button, { onClick: () => triggerOptimization("quantum_ensemble"), disabled: isOptimizing, className: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700", children: [isOptimizing ? (_jsx(RefreshCw, { className: "w-4 h-4 animate-spin mr-2" })) : (_jsx(Zap, { className: "w-4 h-4 mr-2" })), isOptimizing ? "Optimizing..." : "Optimize"] })] })] }), alerts && alerts.active_alerts.length > 0 && (_jsxs(Alert, { className: "border-l-4 border-l-red-500 bg-red-50", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-medium", children: [alerts.critical_count, " critical alerts, ", alerts.warning_count, " ", "warnings"] }), _jsxs(Badge, { variant: "destructive", children: [alerts.total_count, " total"] })] }) })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs(Card, { className: `border-l-4 ${accuracyLevel.border} ${accuracyLevel.bg}`, children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Overall Accuracy" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [(currentMetrics.overall_accuracy * 100).toFixed(1), "%"] }), _jsx(Badge, { className: `${accuracyLevel.color} ${accuracyLevel.bg} mt-1`, children: accuracyLevel.level })] }), _jsx("div", { className: "flex items-center", children: currentMetrics.accuracy_trend > 0 ? (_jsx(TrendingUp, { className: "w-6 h-6 text-green-500" })) : (_jsx(TrendingDown, { className: "w-6 h-6 text-red-500" })) })] }), _jsx(Progress, { value: currentMetrics.overall_accuracy * 100, className: "mt-3" })] })] }), _jsxs(Card, { className: "border-l-4 border-l-green-500", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Model Agreement" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [(currentMetrics.model_agreement * 100).toFixed(1), "%"] }), _jsx(Progress, { value: currentMetrics.model_agreement * 100, className: "mt-2" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [currentMetrics.models_active, " models active"] })] })] }), _jsxs(Card, { className: "border-l-4 border-l-blue-500", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Prediction Confidence" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [(currentMetrics.prediction_confidence * 100).toFixed(1), "%"] }), _jsx(Progress, { value: currentMetrics.prediction_confidence * 100, className: "mt-2" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [currentMetrics.predictions_count, " predictions"] })] })] }), _jsxs(Card, { className: "border-l-4 border-l-purple-500", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Optimization Score" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [(currentMetrics.optimization_score * 100).toFixed(1), "%"] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [currentMetrics.prediction_latency.toFixed(0), "ms latency"] })] }), _jsx(Brain, { className: "w-8 h-8 text-purple-500" })] }), _jsx(Progress, { value: currentMetrics.optimization_score * 100, className: "mt-3" })] })] })] }), _jsxs(Tabs, { defaultValue: "trends", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsx(TabsTrigger, { value: "trends", children: "Accuracy Trends" }), _jsx(TabsTrigger, { value: "performance", children: "Performance Radar" }), _jsx(TabsTrigger, { value: "metrics", children: "Detailed Metrics" }), _jsx(TabsTrigger, { value: "alerts", children: "Active Alerts" })] }), _jsx(TabsContent, { value: "trends", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(TrendingUp, { className: "w-5 h-5 mr-2 text-blue-600" }), "Real-Time Accuracy Trends"] }) }), _jsx(CardContent, { children: accuracyTrendData && (_jsx("div", { className: "h-80", children: _jsx(Line, { data: accuracyTrendData, options: {
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: "top",
                                                    },
                                                    tooltip: {
                                                        mode: "index",
                                                        intersect: false,
                                                    },
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        max: 100,
                                                        ticks: {
                                                            callback: function (value) {
                                                                return value + "%";
                                                            },
                                                        },
                                                    },
                                                },
                                                interaction: {
                                                    mode: "nearest",
                                                    axis: "x",
                                                    intersect: false,
                                                },
                                            } }) })) })] }) }), _jsx(TabsContent, { value: "performance", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Gauge, { className: "w-5 h-5 mr-2 text-purple-600" }), "Performance Overview"] }) }), _jsx(CardContent, { children: performanceRadarData && (_jsx("div", { className: "h-80", children: _jsx(Radar, { data: performanceRadarData, options: {
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: "top",
                                                    },
                                                },
                                                scales: {
                                                    r: {
                                                        beginAtZero: true,
                                                        max: 100,
                                                        ticks: {
                                                            callback: function (value) {
                                                                return value + "%";
                                                            },
                                                        },
                                                    },
                                                },
                                            } }) })) })] }) }), _jsx(TabsContent, { value: "metrics", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Directional Accuracy" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-xl font-bold text-gray-900", children: [(currentMetrics.directional_accuracy * 100).toFixed(1), "%"] }), _jsx(Progress, { value: currentMetrics.directional_accuracy * 100, className: "mt-2" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Uncertainty Quality" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-xl font-bold text-gray-900", children: [(currentMetrics.uncertainty_quality * 100).toFixed(1), "%"] }), _jsx(Progress, { value: currentMetrics.uncertainty_quality * 100, className: "mt-2" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Performance Stability" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-xl font-bold text-gray-900", children: [(currentMetrics.performance_stability * 100).toFixed(1), "%"] }), _jsx(Progress, { value: currentMetrics.performance_stability * 100, className: "mt-2" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Calibration Error" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-xl font-bold text-gray-900", children: [(currentMetrics.calibration_error * 100).toFixed(1), "%"] }), _jsx(Progress, { value: 100 - currentMetrics.calibration_error * 100, className: "mt-2" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Feature Drift" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-xl font-bold text-gray-900", children: [(currentMetrics.feature_drift_score * 100).toFixed(1), "%"] }), _jsx(Progress, { value: 100 - currentMetrics.feature_drift_score * 100, className: "mt-2" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Profit Correlation" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-xl font-bold text-gray-900", children: [(currentMetrics.profit_correlation * 100).toFixed(1), "%"] }), _jsx(Progress, { value: Math.abs(currentMetrics.profit_correlation) * 100, className: "mt-2" })] })] })] }) }), _jsx(TabsContent, { value: "alerts", children: _jsx("div", { className: "space-y-4", children: alerts && alerts.active_alerts.length > 0 ? (alerts.active_alerts.map((alert) => (_jsx(Card, { className: `border-l-4 ${alert.severity === "critical"
                                    ? "border-l-red-500 bg-red-50"
                                    : alert.severity === "warning"
                                        ? "border-l-yellow-500 bg-yellow-50"
                                        : "border-l-blue-500 bg-blue-50"}`, children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: alert.severity === "critical"
                                                                ? "destructive"
                                                                : "secondary", children: alert.severity.toUpperCase() }), _jsx("span", { className: "font-medium", children: alert.metric_name.replace("_", " ").toUpperCase() })] }), _jsx("span", { className: "text-sm text-gray-500", children: new Date(alert.timestamp).toLocaleTimeString() })] }), _jsx("p", { className: "text-sm font-medium text-gray-800 mb-2", children: alert.message }), _jsxs("div", { className: "text-xs text-gray-600 mb-3", children: ["Current: ", alert.current_value.toFixed(3), " | Threshold:", " ", alert.threshold_value.toFixed(3)] }), _jsxs("div", { className: "bg-white p-3 rounded border", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Recommendations:" }), _jsx("ul", { className: "text-sm text-gray-600 space-y-1", children: alert.recommendations.map((rec, idx) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-blue-500 mt-1", children: "\u2022" }), rec] }, idx))) })] })] }) }, alert.alert_id)))) : (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(CheckCircle, { className: "w-12 h-12 mx-auto mb-4 text-green-500" }), _jsx("p", { className: "text-lg font-semibold text-gray-700", children: "All Systems Optimal" }), _jsx("p", { className: "text-gray-500", children: "No accuracy alerts at this time" })] }) })) }) })] })] }));
};
export default RealTimeAccuracyDashboard;
