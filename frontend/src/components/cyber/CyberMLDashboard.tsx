import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  TrendingUp,
  Zap,
  Target,
  Settings,
  BarChart3,
  Cpu,
  Layers,
  Network,
  GitBranch,
  Microscope,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Award,
  Gauge,
  Sparkles,
  Eye,
  Calculator,
  Atom,
  Binary,
  Play,
  Pause,
} from "lucide-react";

// Import existing ML Dashboard component
import UltraAdvancedMLDashboard from "../ml/UltraAdvancedMLDashboard";

// Cyber UI Components
import GlassCard from "../ui/GlassCard";
import CyberButton from "../ui/CyberButton";
import MetricCard from "../ui/MetricCard";
import StatusIndicator from "../ui/StatusIndicator";

interface ModelStatus {
  id: string;
  name: string;
  type: "neural" | "ensemble" | "quantum" | "statistical";
  status: "active" | "training" | "ready" | "offline";
  accuracy: number;
  performance: number;
  lastUpdate: Date;
  predictions: number;
  confidence: number;
}

interface TrainingPipeline {
  stage: string;
  progress: number;
  eta: string;
  status: "running" | "completed" | "failed" | "pending";
  description: string;
}

interface CyberMLState {
  isTraining: boolean;
  autoOptimize: boolean;
  models: ModelStatus[];
  pipeline: TrainingPipeline[];
  systemHealth: {
    cpuUsage: number;
    memoryUsage: number;
    gpuUsage: number;
    temperature: number;
  };
  selectedTab: "overview" | "models" | "training" | "performance" | "quantum";
  lastUpdate: Date | null;
}

const CyberMLDashboard: React.FC = () => {
  // State management
  const [state, setState] = useState<CyberMLState>({
    isTraining: false,
    autoOptimize: true,
    models: [],
    pipeline: [],
    systemHealth: {
      cpuUsage: 0,
      memoryUsage: 0,
      gpuUsage: 0,
      temperature: 0,
    },
    selectedTab: "overview",
    lastUpdate: null,
  });

  // Generate model status data
  const generateModelStatus = useCallback((): ModelStatus[] => {
    return [
      {
        id: "model-1",
        name: "XGBoost Ensemble V3",
        type: "ensemble",
        status: "active",
        accuracy: 94.7,
        performance: 87.3,
        lastUpdate: new Date(Date.now() - 300000),
        predictions: 1247,
        confidence: 89.6,
      },
      {
        id: "model-2",
        name: "Neural Network Pro",
        type: "neural",
        status: "active",
        accuracy: 92.1,
        performance: 91.8,
        lastUpdate: new Date(Date.now() - 180000),
        predictions: 987,
        confidence: 92.3,
      },
      {
        id: "model-3",
        name: "Quantum Predictor",
        type: "quantum",
        status: "training",
        accuracy: 97.8,
        performance: 95.2,
        lastUpdate: new Date(Date.now() - 600000),
        predictions: 456,
        confidence: 96.7,
      },
      {
        id: "model-4",
        name: "Statistical Master",
        type: "statistical",
        status: "ready",
        accuracy: 88.4,
        performance: 85.1,
        lastUpdate: new Date(Date.now() - 120000),
        predictions: 2134,
        confidence: 87.9,
      },
    ];
  }, []);

  // Generate training pipeline data
  const generateTrainingPipeline = useCallback((): TrainingPipeline[] => {
    return [
      {
        stage: "Data Preprocessing",
        progress: 100,
        eta: "Completed",
        status: "completed",
        description: "Feature engineering and data validation",
      },
      {
        stage: "Model Training",
        progress: 67,
        eta: "12m 34s",
        status: "running",
        description: "Training neural network with new data",
      },
      {
        stage: "Hyperparameter Optimization",
        progress: 0,
        eta: "25m 18s",
        status: "pending",
        description: "Bayesian optimization of model parameters",
      },
      {
        stage: "Model Validation",
        progress: 0,
        eta: "8m 45s",
        status: "pending",
        description: "Cross-validation and performance testing",
      },
    ];
  }, []);

  // Generate system health data
  const generateSystemHealth = useCallback(() => {
    return {
      cpuUsage: Math.floor(Math.random() * 30) + 60, // 60-90%
      memoryUsage: Math.floor(Math.random() * 20) + 70, // 70-90%
      gpuUsage: Math.floor(Math.random() * 40) + 50, // 50-90%
      temperature: Math.floor(Math.random() * 15) + 65, // 65-80°C
    };
  }, []);

  // Perform system update
  const performSystemUpdate = useCallback(async () => {
    setState((prev) => ({ ...prev, isTraining: true }));

    try {
      // Simulate system update
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const models = generateModelStatus();
      const pipeline = generateTrainingPipeline();
      const systemHealth = generateSystemHealth();

      setState((prev) => ({
        ...prev,
        models,
        pipeline,
        systemHealth,
        lastUpdate: new Date(),
        isTraining: false,
      }));
    } catch (error) {
      console.error("System update failed:", error);
      setState((prev) => ({ ...prev, isTraining: false }));
    }
  }, [generateModelStatus, generateTrainingPipeline, generateSystemHealth]);

  // Auto refresh effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.autoOptimize) {
      intervalId = setInterval(() => {
        performSystemUpdate();
      }, 15000); // 15 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [state.autoOptimize, performSystemUpdate]);

  // Initial load
  useEffect(() => {
    performSystemUpdate();
  }, [performSystemUpdate]);

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case "neural":
        return <Brain className="w-5 h-5" />;
      case "ensemble":
        return <Layers className="w-5 h-5" />;
      case "quantum":
        return <Atom className="w-5 h-5" />;
      case "statistical":
        return <Calculator className="w-5 h-5" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "training":
        return "text-yellow-400";
      case "ready":
        return "text-blue-400";
      case "offline":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "training":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "ready":
        return <Play className="w-4 h-4" />;
      case "offline":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Pause className="w-4 h-4" />;
    }
  };

  const getPipelineStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500/30 bg-green-500/10";
      case "running":
        return "border-yellow-500/30 bg-yellow-500/10";
      case "failed":
        return "border-red-500/30 bg-red-500/10";
      case "pending":
        return "border-gray-500/30 bg-gray-500/10";
      default:
        return "border-gray-500/30 bg-gray-500/10";
    }
  };

  const getHealthColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return "text-red-400";
    if (value >= threshold - 20) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="space-y-8 animate-slide-in-up">
      {/* Cyber Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-6 text-electric-400 float-element">
          <Brain className="w-16 h-16 mx-auto" />
        </div>
        <h1 className="holographic text-4xl font-black mb-4">
          ML CONTROL CENTER
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Advanced machine learning command center with 47 neural networks
        </p>
      </div>

      {/* System Overview */}
      <GlassCard
        title="Neural Network Command Center"
        glowing={state.isTraining}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Active Models"
            value="47"
            icon="fa-brain"
            change="+2"
            trend="up"
          />
          <MetricCard
            label="Avg Accuracy"
            value="93.2%"
            icon="fa-target"
            change="+1.8%"
            trend="up"
          />
          <MetricCard
            label="Predictions/Min"
            value="1,247"
            icon="fa-chart-line"
            change="+156"
            trend="up"
          />
          <MetricCard
            label="GPU Utilization"
            value={`${state.systemHealth.gpuUsage}%`}
            icon="fa-microchip"
            change="+5%"
            trend="up"
          />
        </div>

        {/* Control Panel */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          {/* Tab Navigation */}
          <div className="flex space-x-2">
            {(
              [
                { key: "overview", label: "Overview", icon: "fa-eye" },
                { key: "models", label: "Models", icon: "fa-brain" },
                { key: "training", label: "Training", icon: "fa-cogs" },
                {
                  key: "performance",
                  label: "Performance",
                  icon: "fa-chart-line",
                },
                { key: "quantum", label: "Quantum", icon: "fa-atom" },
              ] as const
            ).map((tab) => (
              <CyberButton
                key={tab.key}
                label={tab.label}
                onClick={() =>
                  setState((prev) => ({ ...prev, selectedTab: tab.key }))
                }
                variant={state.selectedTab === tab.key ? "primary" : "ghost"}
                size="sm"
                icon={tab.icon}
              />
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 items-center">
            <CyberButton
              label={state.isTraining ? "UPDATING..." : "SYSTEM UPDATE"}
              onClick={performSystemUpdate}
              variant="primary"
              icon="fa-refresh"
              disabled={state.isTraining}
            />

            <CyberButton
              label={state.autoOptimize ? "AUTO ON" : "AUTO OFF"}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  autoOptimize: !prev.autoOptimize,
                }))
              }
              variant={state.autoOptimize ? "secondary" : "ghost"}
              size="md"
              icon="fa-robot"
            />

            <StatusIndicator
              status={state.isTraining ? "warning" : "active"}
              label={
                state.lastUpdate
                  ? `Updated: ${state.lastUpdate.toLocaleTimeString()}`
                  : "Ready"
              }
            />
          </div>
        </div>
      </GlassCard>

      {/* Models Tab */}
      {state.selectedTab === "models" && (
        <GlassCard title="AI Model Status" glowing={true}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {state.models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 glass-card rounded-lg">
                      {getModelTypeIcon(model.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{model.name}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        {getStatusIcon(model.status)}
                        <span className={getStatusColor(model.status)}>
                          {model.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-electric-400">
                      {model.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Accuracy</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 glass-card rounded-lg">
                    <div className="text-lg font-bold text-green-400">
                      {model.performance.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Performance</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-lg">
                    <div className="text-lg font-bold text-blue-400">
                      {model.predictions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Predictions</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-lg">
                    <div className="text-lg font-bold text-purple-400">
                      {model.confidence.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Confidence</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Training Tab */}
      {state.selectedTab === "training" && (
        <GlassCard title="Training Pipeline" glowing={true}>
          <div className="space-y-4">
            {state.pipeline.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-lg border ${getPipelineStatusColor(stage.status)}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-white">{stage.stage}</h3>
                    <p className="text-sm text-gray-400">{stage.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-electric-400">
                      {stage.progress}%
                    </div>
                    <div className="text-xs text-gray-400">
                      ETA: {stage.eta}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-electric-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stage.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* System Health */}
      {state.selectedTab === "performance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard title="System Health">
            <div className="space-y-4">
              {[
                {
                  label: "CPU Usage",
                  value: state.systemHealth.cpuUsage,
                  unit: "%",
                  threshold: 80,
                },
                {
                  label: "Memory Usage",
                  value: state.systemHealth.memoryUsage,
                  unit: "%",
                  threshold: 85,
                },
                {
                  label: "GPU Usage",
                  value: state.systemHealth.gpuUsage,
                  unit: "%",
                  threshold: 90,
                },
                {
                  label: "Temperature",
                  value: state.systemHealth.temperature,
                  unit: "°C",
                  threshold: 75,
                },
              ].map((metric, index) => (
                <div
                  key={metric.label}
                  className="flex justify-between items-center p-4 glass-card rounded-lg"
                >
                  <div className="font-semibold text-white">{metric.label}</div>
                  <div
                    className={`text-xl font-bold ${getHealthColor(metric.value, metric.threshold)}`}
                  >
                    {metric.value}
                    {metric.unit}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Performance Chart">
            <div className="h-64 bg-gradient-to-br from-electric-400/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-electric-400 mx-auto mb-4" />
                <div className="text-electric-400 font-bold">
                  Real-Time Performance
                </div>
                <div className="text-sm text-gray-400">
                  Neural network activity visualization
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Legacy Integration */}
      <GlassCard title="Ultra-Advanced ML Dashboard Integration">
        <div className="p-4 glass-card rounded-lg">
          <UltraAdvancedMLDashboard />
        </div>
      </GlassCard>
    </div>
  );
};

export default CyberMLDashboard;
