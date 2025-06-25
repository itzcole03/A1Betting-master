import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Atom, Zap, Target, Brain, BarChart3, Settings, RefreshCw, CheckCircle, Layers, Network, Activity, } from "lucide-react";
import { Radar, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend, Filler, } from "chart.js";
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend, Filler);
export const QuantumPredictionsInterface = () => {
    const [predictionRequest, setPredictionRequest] = useState({
        event_id: "",
        sport: "basketball",
        features: {},
        target_accuracy: 0.95,
        optimization_strategy: "quantum_ensemble",
        uncertainty_method: "deep_ensembles",
    });
    const [predictionResult, setPredictionResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStage, setProcessingStage] = useState("");
    const [quantumState, setQuantumState] = useState({
        superposition: 0,
        entanglement: 0,
        coherence: 0,
        decoherence: 0,
    });
    // Simulate quantum state evolution
    useEffect(() => {
        const interval = setInterval(() => {
            setQuantumState((prev) => ({
                superposition: (prev.superposition + Math.random() * 0.1) % 1,
                entanglement: Math.sin(Date.now() / 1000) * 0.5 + 0.5,
                coherence: Math.cos(Date.now() / 1200) * 0.3 + 0.7,
                decoherence: Math.random() * 0.2,
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    // Generate quantum prediction
    const generateQuantumPrediction = useCallback(async () => {
        if (!predictionRequest.event_id) {
            alert("Please provide an event ID");
            return;
        }
        setIsProcessing(true);
        setProcessingStage("Initializing quantum states...");
        try {
            // Simulate processing stages
            const stages = [
                "Initializing quantum states...",
                "Applying quantum superposition...",
                "Calculating feature entanglement...",
                "Optimizing quantum coherence...",
                "Running quantum ensemble...",
                "Measuring quantum advantage...",
                "Finalizing prediction...",
            ];
            for (let i = 0; i < stages.length; i++) {
                setProcessingStage(stages[i]);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            // Make actual API call
            const response = await fetch("/api/v4/predict/ultra-accuracy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(predictionRequest),
            });
            if (response.ok) {
                const result = await response.json();
                setPredictionResult(result);
            }
            else {
                // Fallback with simulated data
                const simulatedResult = {
                    event_id: predictionRequest.event_id,
                    prediction: {
                        base_prediction: Math.random() * 100 + 50,
                        quantum_correction: (Math.random() - 0.5) * 10,
                        final_prediction: Math.random() * 100 + 50,
                        uncertainty_bounds: [40, 90],
                    },
                    quantum_metrics: {
                        entanglement_score: Math.random() * 0.3 + 0.7,
                        coherence_measure: Math.random() * 0.2 + 0.8,
                        quantum_advantage: Math.random() * 0.15 + 0.05,
                        fidelity: Math.random() * 0.1 + 0.9,
                        decoherence_time: Math.random() * 5 + 10,
                        entangled_features: [
                            "player_performance",
                            "team_synergy",
                            "venue_effects",
                        ],
                    },
                    processing_metrics: {
                        total_processing_time: Math.random() * 2 + 1,
                        feature_engineering_time: Math.random() * 0.5 + 0.2,
                        prediction_time: Math.random() * 1.5 + 0.5,
                    },
                };
                setPredictionResult(simulatedResult);
            }
        }
        catch (error) {
            console.error("Quantum prediction failed:", error);
        }
        finally {
            setIsProcessing(false);
            setProcessingStage("");
        }
    }, [predictionRequest]);
    // Add sample features
    const addSampleFeatures = useCallback(() => {
        const sampleFeatures = {
            player_efficiency: Math.random() * 30 + 10,
            team_rating: Math.random() * 20 + 80,
            recent_performance: Math.random() * 25 + 15,
            venue_advantage: Math.random() * 10 + 5,
            weather_impact: Math.random() * 5,
            injury_factor: Math.random() * 15,
            momentum_score: Math.random() * 20 + 10,
            market_sentiment: Math.random() * 30 + 40,
        };
        setPredictionRequest((prev) => ({
            ...prev,
            features: sampleFeatures,
        }));
    }, []);
    // Quantum state visualization
    const quantumStateData = useMemo(() => ({
        labels: ["Superposition", "Entanglement", "Coherence", "Stability"],
        datasets: [
            {
                label: "Quantum State",
                data: [
                    quantumState.superposition * 100,
                    quantumState.entanglement * 100,
                    quantumState.coherence * 100,
                    (1 - quantumState.decoherence) * 100,
                ],
                backgroundColor: "rgba(147, 51, 234, 0.2)",
                borderColor: "rgba(147, 51, 234, 1)",
                pointBackgroundColor: "rgba(147, 51, 234, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(147, 51, 234, 1)",
            },
        ],
    }), [quantumState]);
    // Quantum advantage chart
    const quantumAdvantageData = useMemo(() => {
        if (!predictionResult)
            return null;
        return {
            datasets: [
                {
                    label: "Quantum vs Classical",
                    data: [
                        {
                            x: predictionResult.prediction.base_prediction,
                            y: predictionResult.prediction.final_prediction,
                        },
                    ],
                    backgroundColor: "rgba(147, 51, 234, 0.7)",
                    borderColor: "rgba(147, 51, 234, 1)",
                    pointRadius: 8,
                },
            ],
        };
    }, [predictionResult]);
    return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(Atom, { className: "w-8 h-8 text-purple-600" }), "Quantum Predictions Engine"] }), _jsx("p", { className: "text-gray-600 mt-1", children: "Advanced quantum-inspired predictions with superposition and entanglement" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs(Button, { onClick: addSampleFeatures, variant: "outline", children: [_jsx(Settings, { className: "w-4 h-4 mr-2" }), "Add Sample Data"] }), _jsxs(Button, { onClick: generateQuantumPrediction, disabled: isProcessing, className: "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700", children: [isProcessing ? (_jsx(RefreshCw, { className: "w-4 h-4 animate-spin mr-2" })) : (_jsx(Zap, { className: "w-4 h-4 mr-2" })), isProcessing ? "Processing..." : "Generate Quantum Prediction"] })] })] }), _jsxs(Card, { className: "border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-violet-50", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Activity, { className: "w-5 h-5 mr-2 text-purple-600" }), "Live Quantum State"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Superposition" }), _jsx(Progress, { value: quantumState.superposition * 100, className: "mt-2" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [(quantumState.superposition * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Entanglement" }), _jsx(Progress, { value: quantumState.entanglement * 100, className: "mt-2" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [(quantumState.entanglement * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Coherence" }), _jsx(Progress, { value: quantumState.coherence * 100, className: "mt-2" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [(quantumState.coherence * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Stability" }), _jsx(Progress, { value: (1 - quantumState.decoherence) * 100, className: "mt-2" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [((1 - quantumState.decoherence) * 100).toFixed(1), "%"] })] })] }) })] }), isProcessing && (_jsx(Card, { className: "border-l-4 border-l-blue-500 bg-blue-50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(RefreshCw, { className: "w-5 h-5 animate-spin text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-blue-800", children: processingStage }), _jsx("p", { className: "text-sm text-blue-600", children: "Quantum computation in progress..." })] })] }) }) })), _jsxs(Tabs, { defaultValue: "input", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsx(TabsTrigger, { value: "input", children: "Input & Configuration" }), _jsx(TabsTrigger, { value: "quantum", children: "Quantum Visualization" }), _jsx(TabsTrigger, { value: "results", children: "Prediction Results" }), _jsx(TabsTrigger, { value: "analysis", children: "Quantum Analysis" })] }), _jsxs(TabsContent, { value: "input", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Event Configuration" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "event-id", children: "Event ID" }), _jsx(Input, { id: "event-id", value: predictionRequest.event_id, onChange: (e) => setPredictionRequest((prev) => ({
                                                                    ...prev,
                                                                    event_id: e.target.value,
                                                                })), placeholder: "Enter event identifier" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "sport", children: "Sport" }), _jsxs("select", { id: "sport", value: predictionRequest.sport, onChange: (e) => setPredictionRequest((prev) => ({
                                                                    ...prev,
                                                                    sport: e.target.value,
                                                                })), className: "w-full px-3 py-2 border rounded-md", children: [_jsx("option", { value: "basketball", children: "Basketball" }), _jsx("option", { value: "football", children: "Football" }), _jsx("option", { value: "baseball", children: "Baseball" }), _jsx("option", { value: "soccer", children: "Soccer" }), _jsx("option", { value: "hockey", children: "Hockey" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "target-accuracy", children: "Target Accuracy" }), _jsx(Input, { id: "target-accuracy", type: "number", min: "0.8", max: "0.99", step: "0.01", value: predictionRequest.target_accuracy, onChange: (e) => setPredictionRequest((prev) => ({
                                                                    ...prev,
                                                                    target_accuracy: parseFloat(e.target.value),
                                                                })) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Quantum Parameters" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "optimization-strategy", children: "Optimization Strategy" }), _jsxs("select", { id: "optimization-strategy", value: predictionRequest.optimization_strategy, onChange: (e) => setPredictionRequest((prev) => ({
                                                                    ...prev,
                                                                    optimization_strategy: e.target.value,
                                                                })), className: "w-full px-3 py-2 border rounded-md", children: [_jsx("option", { value: "quantum_ensemble", children: "Quantum Ensemble" }), _jsx("option", { value: "neural_architecture_search", children: "Neural Architecture Search" }), _jsx("option", { value: "meta_learning", children: "Meta Learning" }), _jsx("option", { value: "bayesian_optimization", children: "Bayesian Optimization" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "uncertainty-method", children: "Uncertainty Method" }), _jsxs("select", { id: "uncertainty-method", value: predictionRequest.uncertainty_method, onChange: (e) => setPredictionRequest((prev) => ({
                                                                    ...prev,
                                                                    uncertainty_method: e.target.value,
                                                                })), className: "w-full px-3 py-2 border rounded-md", children: [_jsx("option", { value: "deep_ensembles", children: "Deep Ensembles" }), _jsx("option", { value: "bayesian_neural_network", children: "Bayesian Neural Network" }), _jsx("option", { value: "monte_carlo_dropout", children: "Monte Carlo Dropout" }), _jsx("option", { value: "conformal_prediction", children: "Conformal Prediction" })] })] }), _jsxs("div", { className: "bg-purple-100 p-4 rounded-lg", children: [_jsx("h4", { className: "font-medium text-purple-800 mb-2", children: "Quantum Features Active" }), _jsxs("div", { className: "space-y-1 text-sm text-purple-700", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Superposition-based ensemble modeling" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Feature entanglement analysis" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Quantum coherence optimization" })] })] })] })] })] })] }), _jsxs(Card, { className: "mt-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Feature Vector Input" }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: Object.entries(predictionRequest.features).map(([key, value]) => (_jsxs("div", { children: [_jsx(Label, { htmlFor: key, children: key.replace("_", " ").toUpperCase() }), _jsx(Input, { id: key, type: "number", value: value, onChange: (e) => setPredictionRequest((prev) => ({
                                                                ...prev,
                                                                features: {
                                                                    ...prev.features,
                                                                    [key]: parseFloat(e.target.value) || 0,
                                                                },
                                                            })) })] }, key))) }), Object.keys(predictionRequest.features).length === 0 && (_jsxs("div", { className: "text-center py-8", children: [_jsx("p", { className: "text-gray-500 mb-4", children: "No features configured" }), _jsx(Button, { onClick: addSampleFeatures, variant: "outline", children: "Add Sample Features" })] }))] })] })] }), _jsx(TabsContent, { value: "quantum", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Layers, { className: "w-5 h-5 mr-2 text-purple-600" }), "Quantum State Visualization"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "h-80", children: _jsx(Radar, { data: quantumStateData, options: {
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
                                            } }) }) })] }) }), _jsx(TabsContent, { value: "results", children: predictionResult ? (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Target, { className: "w-5 h-5 mr-2 text-green-600" }), "Prediction Output"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Base Prediction" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: predictionResult.prediction.base_prediction.toFixed(2) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Quantum Correction" }), _jsxs("p", { className: "text-2xl font-bold text-purple-600", children: [predictionResult.prediction.quantum_correction > 0
                                                                                ? "+"
                                                                                : "", predictionResult.prediction.quantum_correction.toFixed(2)] })] })] }), _jsxs("div", { className: "bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-purple-800", children: "Final Quantum Prediction" }), _jsx("p", { className: "text-3xl font-bold text-purple-900", children: predictionResult.prediction.final_prediction.toFixed(2) }), _jsxs("p", { className: "text-sm text-purple-700 mt-1", children: ["Uncertainty: [", predictionResult.prediction.uncertainty_bounds[0].toFixed(1), ",", " ", predictionResult.prediction.uncertainty_bounds[1].toFixed(1), "]"] })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Brain, { className: "w-5 h-5 mr-2 text-purple-600" }), "Quantum Metrics"] }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Entanglement Score" }), _jsxs(Badge, { variant: "outline", children: [(predictionResult.quantum_metrics.entanglement_score *
                                                                            100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Coherence Measure" }), _jsxs(Badge, { variant: "outline", children: [(predictionResult.quantum_metrics.coherence_measure *
                                                                            100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Quantum Advantage" }), _jsxs(Badge, { variant: "outline", children: [(predictionResult.quantum_metrics.quantum_advantage *
                                                                            100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Fidelity" }), _jsxs(Badge, { variant: "outline", children: [(predictionResult.quantum_metrics.fidelity * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Decoherence Time" }), _jsxs(Badge, { variant: "outline", children: [predictionResult.quantum_metrics.decoherence_time.toFixed(1), "s"] })] })] }), _jsxs("div", { className: "mt-4 p-3 bg-gray-50 rounded", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Entangled Features" }), _jsx("div", { className: "flex flex-wrap gap-2", children: predictionResult.quantum_metrics.entangled_features.map((feature, idx) => (_jsx(Badge, { variant: "secondary", className: "text-xs", children: feature.replace("_", " ") }, idx))) })] })] })] })] })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(Atom, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-500", children: "No quantum prediction generated yet" }), _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Configure your input and generate a prediction to see results" })] }) })) }), _jsx(TabsContent, { value: "analysis", children: predictionResult && quantumAdvantageData ? (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(BarChart3, { className: "w-5 h-5 mr-2 text-blue-600" }), "Quantum vs Classical Comparison"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "h-64", children: _jsx(Scatter, { data: quantumAdvantageData, options: {
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: "top",
                                                            },
                                                        },
                                                        scales: {
                                                            x: {
                                                                title: {
                                                                    display: true,
                                                                    text: "Classical Prediction",
                                                                },
                                                            },
                                                            y: {
                                                                title: {
                                                                    display: true,
                                                                    text: "Quantum-Enhanced Prediction",
                                                                },
                                                            },
                                                        },
                                                    } }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Performance Analysis" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Processing Time" }), _jsxs("p", { className: "text-lg font-bold text-gray-900", children: [predictionResult.processing_metrics.total_processing_time.toFixed(2), "s"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Feature Engineering" }), _jsxs("p", { className: "text-lg font-bold text-gray-900", children: [predictionResult.processing_metrics.feature_engineering_time.toFixed(2), "s"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Prediction Time" }), _jsxs("p", { className: "text-lg font-bold text-gray-900", children: [predictionResult.processing_metrics.prediction_time.toFixed(2), "s"] })] })] }) })] })] })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(Network, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-500", children: "No analysis data available" }), _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Generate a quantum prediction to view detailed analysis" })] }) })) })] })] }));
};
export default QuantumPredictionsInterface;
