import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, TrendingUp, AlertTriangle, Clock, BarChart3, Gauge, Brain, Eye, } from "lucide-react";
import { Line, Bar, Scatter, Radar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler, } from "chart.js";
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler);
export const AdvancedConfidenceVisualizer = () => {
    const [predictions, setPredictions] = useState([]);
    const [confidenceMetrics, setConfidenceMetrics] = useState(null);
    const [confidenceDistribution, setConfidenceDistribution] = useState(null);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [timeRange, setTimeRange] = useState("1h");
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);
    const [isLoading, setIsLoading] = useState(true);
    // Fetch prediction data with confidence metrics
    const fetchPredictionData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [predictionsRes, metricsRes, distributionRes] = await Promise.all([
                fetch(`/api/v3/predictions/with-confidence?timeRange=${timeRange}`),
                fetch("/api/v3/predictions/confidence-metrics"),
                fetch("/api/v3/predictions/confidence-distribution"),
            ]);
            if (predictionsRes.ok) {
                const predictionsData = await predictionsRes.json();
                setPredictions(predictionsData);
            }
            if (metricsRes.ok) {
                const metricsData = await metricsRes.json();
                setConfidenceMetrics(metricsData);
            }
            if (distributionRes.ok) {
                const distributionData = await distributionRes.json();
                setConfidenceDistribution(distributionData);
            }
        }
        catch (error) {
            console.error("Error fetching prediction data:", error);
        }
        finally {
            setIsLoading(false);
        }
    }, [timeRange]);
    useEffect(() => {
        fetchPredictionData();
        const interval = setInterval(fetchPredictionData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [fetchPredictionData]);
    // Get confidence level styling
    const getConfidenceLevel = (confidence) => {
        if (confidence >= 0.95)
            return {
                level: "EXCEPTIONAL",
                color: "text-purple-600",
                bg: "bg-purple-100",
                border: "border-purple-200",
            };
        if (confidence >= 0.9)
            return {
                level: "EXCELLENT",
                color: "text-green-600",
                bg: "bg-green-100",
                border: "border-green-200",
            };
        if (confidence >= 0.8)
            return {
                level: "HIGH",
                color: "text-blue-600",
                bg: "bg-blue-100",
                border: "border-blue-200",
            };
        if (confidence >= 0.7)
            return {
                level: "GOOD",
                color: "text-yellow-600",
                bg: "bg-yellow-100",
                border: "border-yellow-200",
            };
        if (confidence >= 0.6)
            return {
                level: "MODERATE",
                color: "text-orange-600",
                bg: "bg-orange-100",
                border: "border-orange-200",
            };
        return {
            level: "LOW",
            color: "text-red-600",
            bg: "bg-red-100",
            border: "border-red-200",
        };
    };
    // High confidence predictions
    const highConfidencePredictions = useMemo(() => {
        return predictions.filter((p) => p.confidence_score >= confidenceThreshold);
    }, [predictions, confidenceThreshold]);
    // Confidence trend chart data
    const confidenceTrendData = useMemo(() => {
        if (!predictions.length)
            return null;
        const sortedPredictions = [...predictions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        return {
            labels: sortedPredictions.map((p) => new Date(p.timestamp).toLocaleTimeString()),
            datasets: [
                {
                    label: "Confidence Score",
                    data: sortedPredictions.map((p) => p.confidence_score * 100),
                    borderColor: "rgb(99, 102, 241)",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    tension: 0.1,
                    fill: true,
                },
                {
                    label: "Model Agreement",
                    data: sortedPredictions.map((p) => p.model_agreement * 100),
                    borderColor: "rgb(34, 197, 94)",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    tension: 0.1,
                    fill: false,
                },
                {
                    label: "Quantum Fidelity",
                    data: sortedPredictions.map((p) => p.quantum_fidelity * 100),
                    borderColor: "rgb(168, 85, 247)",
                    backgroundColor: "rgba(168, 85, 247, 0.1)",
                    tension: 0.1,
                    fill: false,
                },
            ],
        };
    }, [predictions]);
    // Confidence distribution chart
    const confidenceDistributionData = useMemo(() => {
        if (!confidenceDistribution)
            return null;
        return {
            labels: confidenceDistribution.confidence_bins.map((bin) => `${(bin * 100).toFixed(0)}%`),
            datasets: [
                {
                    label: "Frequency",
                    data: confidenceDistribution.frequency,
                    backgroundColor: "rgba(99, 102, 241, 0.6)",
                    yAxisID: "y",
                },
                {
                    label: "Accuracy",
                    data: confidenceDistribution.accuracy_by_bin.map((acc) => acc * 100),
                    type: "line",
                    borderColor: "rgb(34, 197, 94)",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    yAxisID: "y1",
                },
            ],
        };
    }, [confidenceDistribution]);
    // Uncertainty visualization data
    const uncertaintyScatterData = useMemo(() => {
        if (!predictions.length)
            return null;
        return {
            datasets: [
                {
                    label: "High Confidence",
                    data: predictions
                        .filter((p) => p.confidence_score >= 0.8)
                        .map((p) => ({
                        x: p.confidence_score * 100,
                        y: (p.uncertainty_bounds[1] - p.uncertainty_bounds[0]) * 100,
                    })),
                    backgroundColor: "rgba(34, 197, 94, 0.7)",
                    pointRadius: 6,
                },
                {
                    label: "Medium Confidence",
                    data: predictions
                        .filter((p) => p.confidence_score >= 0.6 && p.confidence_score < 0.8)
                        .map((p) => ({
                        x: p.confidence_score * 100,
                        y: (p.uncertainty_bounds[1] - p.uncertainty_bounds[0]) * 100,
                    })),
                    backgroundColor: "rgba(251, 191, 36, 0.7)",
                    pointRadius: 6,
                },
                {
                    label: "Low Confidence",
                    data: predictions
                        .filter((p) => p.confidence_score < 0.6)
                        .map((p) => ({
                        x: p.confidence_score * 100,
                        y: (p.uncertainty_bounds[1] - p.uncertainty_bounds[0]) * 100,
                    })),
                    backgroundColor: "rgba(239, 68, 68, 0.7)",
                    pointRadius: 6,
                },
            ],
        };
    }, [predictions]);
    // Model contribution radar chart
    const modelContributionData = useMemo(() => {
        if (!selectedPrediction?.model_weights)
            return null;
        const models = Object.keys(selectedPrediction.model_weights);
        const weights = Object.values(selectedPrediction.model_weights);
        return {
            labels: models.map((name) => name.replace("_", " ").toUpperCase()),
            datasets: [
                {
                    label: "Model Weights",
                    data: weights.map((w) => w * 100),
                    backgroundColor: "rgba(99, 102, 241, 0.2)",
                    borderColor: "rgba(99, 102, 241, 1)",
                    pointBackgroundColor: "rgba(99, 102, 241, 1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(99, 102, 241, 1)",
                },
            ],
        };
    }, [selectedPrediction]);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-96", children: _jsxs("div", { className: "text-center", children: [_jsx(Brain, { className: "w-8 h-8 animate-pulse mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-500", children: "Loading confidence analysis..." })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Advanced Confidence Analysis" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Real-time prediction confidence and uncertainty visualization" })] }), _jsx("div", { className: "flex gap-3", children: _jsxs(Button, { onClick: fetchPredictionData, variant: "outline", children: [_jsx(Eye, { className: "w-4 h-4 mr-2" }), "Refresh"] }) })] }), confidenceMetrics && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsxs(Card, { className: "border-l-4 border-l-blue-500", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Overall Confidence" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [(confidenceMetrics.overall_confidence * 100).toFixed(1), "%"] }), _jsx(Progress, { value: confidenceMetrics.overall_confidence * 100, className: "mt-2" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Average prediction confidence" })] })] }), _jsxs(Card, { className: "border-l-4 border-l-green-500", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Model Consensus" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [(confidenceMetrics.model_consensus * 100).toFixed(1), "%"] }), _jsx(Progress, { value: confidenceMetrics.model_consensus * 100, className: "mt-2" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Inter-model agreement" })] })] }), _jsxs(Card, { className: "border-l-4 border-l-purple-500", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Calibration Score" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [(confidenceMetrics.calibration_score * 100).toFixed(1), "%"] }), _jsx(Progress, { value: confidenceMetrics.calibration_score * 100, className: "mt-2" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Confidence calibration quality" })] })] }), _jsxs(Card, { className: "border-l-4 border-l-orange-500", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Coverage Probability" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [(confidenceMetrics.coverage_probability * 100).toFixed(1), "%"] }), _jsx(Progress, { value: confidenceMetrics.coverage_probability * 100, className: "mt-2" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Prediction interval accuracy" })] })] })] })), _jsxs(Tabs, { defaultValue: "trends", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-5", children: [_jsx(TabsTrigger, { value: "trends", children: "Confidence Trends" }), _jsx(TabsTrigger, { value: "distribution", children: "Distribution" }), _jsx(TabsTrigger, { value: "uncertainty", children: "Uncertainty" }), _jsx(TabsTrigger, { value: "predictions", children: "High Confidence" }), _jsx(TabsTrigger, { value: "analysis", children: "Detailed Analysis" })] }), _jsx(TabsContent, { value: "trends", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(TrendingUp, { className: "w-5 h-5 mr-2 text-blue-600" }), "Real-time Confidence Trends"] }) }), _jsx(CardContent, { children: confidenceTrendData && (_jsx("div", { className: "h-80", children: _jsx(Line, { data: confidenceTrendData, options: {
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
                                            } }) })) })] }) }), _jsx(TabsContent, { value: "distribution", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(BarChart3, { className: "w-5 h-5 mr-2 text-green-600" }), "Confidence Distribution & Calibration"] }) }), _jsx(CardContent, { children: confidenceDistributionData && (_jsx("div", { className: "h-80", children: _jsx(Bar, { data: confidenceDistributionData, options: {
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: "top",
                                                    },
                                                },
                                                scales: {
                                                    y: {
                                                        type: "linear",
                                                        display: true,
                                                        position: "left",
                                                        title: {
                                                            display: true,
                                                            text: "Frequency",
                                                        },
                                                    },
                                                    y1: {
                                                        type: "linear",
                                                        display: true,
                                                        position: "right",
                                                        title: {
                                                            display: true,
                                                            text: "Accuracy (%)",
                                                        },
                                                        grid: {
                                                            drawOnChartArea: false,
                                                        },
                                                        ticks: {
                                                            callback: function (value) {
                                                                return value + "%";
                                                            },
                                                        },
                                                    },
                                                },
                                            } }) })) })] }) }), _jsx(TabsContent, { value: "uncertainty", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(AlertTriangle, { className: "w-5 h-5 mr-2 text-orange-600" }), "Confidence vs Uncertainty"] }) }), _jsx(CardContent, { children: uncertaintyScatterData && (_jsx("div", { className: "h-80", children: _jsx(Scatter, { data: uncertaintyScatterData, options: {
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: "top",
                                                    },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: function (context) {
                                                                return `Confidence: ${context.parsed.x.toFixed(1)}%, Uncertainty: ${context.parsed.y.toFixed(1)}%`;
                                                            },
                                                        },
                                                    },
                                                },
                                                scales: {
                                                    x: {
                                                        title: {
                                                            display: true,
                                                            text: "Confidence Score (%)",
                                                        },
                                                        min: 0,
                                                        max: 100,
                                                    },
                                                    y: {
                                                        title: {
                                                            display: true,
                                                            text: "Uncertainty Range (%)",
                                                        },
                                                        min: 0,
                                                    },
                                                },
                                            } }) })) })] }) }), _jsx(TabsContent, { value: "predictions", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "High Confidence Predictions" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Threshold:" }), _jsxs("select", { value: confidenceThreshold, onChange: (e) => setConfidenceThreshold(Number(e.target.value)), className: "px-3 py-1 border rounded", children: [_jsx("option", { value: 0.95, children: "95%" }), _jsx("option", { value: 0.9, children: "90%" }), _jsx("option", { value: 0.85, children: "85%" }), _jsx("option", { value: 0.8, children: "80%" }), _jsx("option", { value: 0.75, children: "75%" })] })] })] }), _jsx("div", { className: "grid gap-4", children: highConfidencePredictions.map((prediction) => {
                                        const confidenceLevel = getConfidenceLevel(prediction.confidence_score);
                                        return (_jsx(Card, { className: `${confidenceLevel.border} ${confidenceLevel.bg} cursor-pointer hover:shadow-md transition-all`, onClick: () => setSelectedPrediction(prediction), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { className: `${confidenceLevel.color} ${confidenceLevel.bg}`, children: confidenceLevel.level }), _jsxs("span", { className: "font-medium", children: [prediction.context.sport, " -", " ", prediction.context.event_type] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-500", children: new Date(prediction.timestamp).toLocaleTimeString() })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Prediction" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: prediction.final_prediction.toFixed(2) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Confidence" }), _jsxs("p", { className: "text-lg font-bold text-gray-900", children: [(prediction.confidence_score * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Model Agreement" }), _jsxs("p", { className: "text-lg font-bold text-gray-900", children: [(prediction.model_agreement * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Uncertainty Range" }), _jsxs("p", { className: "text-lg font-bold text-gray-900", children: ["[", prediction.uncertainty_bounds[0].toFixed(2), ",", " ", prediction.uncertainty_bounds[1].toFixed(2), "]"] })] })] }), _jsx("div", { className: "mt-3", children: _jsx(Progress, { value: prediction.confidence_score * 100, className: "h-2" }) })] }) }, prediction.prediction_id));
                                    }) })] }) }), _jsx(TabsContent, { value: "analysis", children: selectedPrediction ? (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Gauge, { className: "w-5 h-5 mr-2 text-purple-600" }), "Model Contributions"] }) }), _jsx(CardContent, { children: modelContributionData && (_jsx("div", { className: "h-64", children: _jsx(Radar, { data: modelContributionData, options: {
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
                                                    } }) })) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Target, { className: "w-5 h-5 mr-2 text-green-600" }), "Prediction Details"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Final Prediction" }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: selectedPrediction.final_prediction.toFixed(3) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Quantum Fidelity" }), _jsxs("p", { className: "text-xl font-bold text-purple-600", children: [(selectedPrediction.quantum_fidelity * 100).toFixed(1), "%"] })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-2", children: "Prediction Interval" }), _jsx("div", { className: "bg-gray-100 p-3 rounded-lg", children: _jsxs("p", { className: "text-center font-mono", children: ["[", selectedPrediction.prediction_interval[0].toFixed(3), ",", " ", selectedPrediction.prediction_interval[1].toFixed(3), "]"] }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-2", children: "Processing Time" }), _jsxs("p", { className: "text-lg font-semibold text-gray-900", children: [(selectedPrediction.processing_time * 1000).toFixed(1), "ms"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-2", children: "Context" }), _jsxs("div", { className: "space-y-1", children: [_jsx(Badge, { variant: "outline", children: selectedPrediction.context.sport }), _jsx(Badge, { variant: "outline", children: selectedPrediction.context.event_type }), _jsx(Badge, { variant: "outline", children: selectedPrediction.context.market_type })] })] })] }) })] })] })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(Brain, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-500", children: "Select a prediction from the High Confidence tab to view detailed analysis" })] }) })) })] })] }));
};
export default AdvancedConfidenceVisualizer;
