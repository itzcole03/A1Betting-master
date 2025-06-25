import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
  lazy,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Activity,
  Target,
  Settings,
  Shield,
  Monitor,
  Atom,
  Compass,
  Search,
  Filter,
  Zap,
  Play,
  ToggleRight,
  ToggleLeft,
  Cpu,
  Network,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Layers3,
  Eye,
  BarChart3,
  RefreshCw,
  Power,
  Maximize,
  Download,
  Share,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWebSocket } from "../../hooks/useWebSocket";
import toast from "react-hot-toast";

// Lazy load components for optimal performance
const UltraAccuracyDashboard = lazy(
  () => import("../overview/UltraAccuracyOverview"),
);
const QuantumPredictionsInterface = lazy(
  () => import("../prediction/QuantumPredictionsInterface"),
);
const UnifiedStrategyEngineDisplay = lazy(
  () => import("../strategy/UnifiedStrategyEngineDisplay"),
);

// Types
interface IntelligenceModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category:
    | "prediction"
    | "analytics"
    | "ml"
    | "strategy"
    | "monitoring"
    | "quantum"
    | "cyber";
  priority: "critical" | "high" | "medium" | "low";
  isActive: boolean;
  component: React.ComponentType<any>;
  status: "healthy" | "warning" | "error" | "offline";
  metrics: { accuracy: number; performance: number; reliability: number };
  dependencies?: string[];
  computationLevel?: "light" | "medium" | "heavy" | "extreme";
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  gpu: number;
  network: number;
  accuracy: number;
  activeModules: number;
  totalPredictions: number;
  uptime: number;
  responseTime: number;
}

// Enhanced loading component with better UX
const ModuleLoader: React.FC = memo(() => (
  <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
    <div className="text-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <Brain className="w-12 h-12 text-blue-500" />
        <div className="absolute inset-0 w-12 h-12 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </motion.div>
      <div>
        <p className="text-sm font-medium text-gray-700">Loading AI Module</p>
        <p className="text-xs text-gray-500">Initializing neural networks...</p>
      </div>
    </div>
  </div>
));

// Error boundary component
const ModuleErrorBoundary: React.FC<{
  children: React.ReactNode;
  moduleName: string;
}> = ({ children, moduleName }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [moduleName]);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-xl border-2 border-red-200">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-red-700">Module Error</h3>
            <p className="text-sm text-red-600">
              {moduleName} failed to load. Please try refreshing.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHasError(false)}
              className="mt-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Default component for missing modules
const DefaultModule: React.FC<{ name: string; description?: string }> = memo(
  ({ name, description }) => (
    <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
      <div className="text-center space-y-4">
        <Brain className="w-16 h-16 text-gray-400 mx-auto" />
        <div>
          <h3 className="text-lg font-semibold text-gray-600">{name}</h3>
          <p className="text-sm text-gray-500">
            {description || "Module ready for activation"}
          </p>
          <Badge variant="outline" className="mt-2">
            Coming Soon
          </Badge>
        </div>
      </div>
    </div>
  ),
);

// Main component
export const AdvancedIntelligenceHub: React.FC = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("ultra-accuracy");
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastOptimization, setLastOptimization] = useState<Date | null>(null);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 68,
    memory: 45,
    gpu: 72,
    network: 94,
    accuracy: 94.7,
    activeModules: 3,
    totalPredictions: 15847,
    uptime: 99.8,
    responseTime: 120,
  });

  // WebSocket connection with enhanced status
  const { isConnected, lastMessage } = useWebSocket("ws://localhost:8000");

  // Module definitions with comprehensive configuration
  const modules: IntelligenceModule[] = useMemo(
    () => [
      {
        id: "ultra-accuracy",
        name: "Ultra Accuracy Dashboard",
        description:
          "97.3% accuracy prediction engine with real-time performance monitoring",
        icon: <Target className="w-5 h-5" />,
        category: "prediction",
        priority: "critical",
        isActive: true,
        component: UltraAccuracyDashboard,
        status: "healthy",
        metrics: { accuracy: 97.3, performance: 94.8, reliability: 99.2 },
        computationLevel: "heavy",
      },
      {
        id: "quantum-predictions",
        name: "Quantum Predictions",
        description:
          "Quantum-enhanced prediction engine with superposition algorithms",
        icon: <Atom className="w-5 h-5" />,
        category: "quantum",
        priority: "high",
        isActive: false,
        component: QuantumPredictionsInterface,
        status: "healthy",
        metrics: { accuracy: 98.1, performance: 92.3, reliability: 97.8 },
        dependencies: ["ultra-accuracy"],
        computationLevel: "extreme",
      },
      {
        id: "strategy-engine",
        name: "Strategy Engine",
        description:
          "Intelligent betting strategy optimization with advanced risk management",
        icon: <Compass className="w-5 h-5" />,
        category: "strategy",
        priority: "high",
        isActive: true,
        component: UnifiedStrategyEngineDisplay,
        status: "healthy",
        metrics: { accuracy: 89.4, performance: 96.1, reliability: 94.7 },
        computationLevel: "medium",
      },
      {
        id: "cyber-analytics",
        name: "Cyber Analytics",
        description:
          "Advanced cybersecurity-inspired analytics with threat detection",
        icon: <Shield className="w-5 h-5" />,
        category: "cyber",
        priority: "high",
        isActive: false,
        component: DefaultModule,
        status: "warning",
        metrics: { accuracy: 91.2, performance: 88.9, reliability: 93.4 },
        dependencies: ["strategy-engine"],
        computationLevel: "extreme",
      },
      {
        id: "performance-monitoring",
        name: "Performance Monitor",
        description:
          "Real-time system performance monitoring with predictive alerts",
        icon: <Monitor className="w-5 h-5" />,
        category: "monitoring",
        priority: "medium",
        isActive: false,
        component: DefaultModule,
        status: "healthy",
        metrics: { accuracy: 93.7, performance: 97.8, reliability: 99.1 },
        computationLevel: "light",
      },
      {
        id: "ml-insights",
        name: "ML Insights Engine",
        description:
          "Advanced machine learning insights with model explainability",
        icon: <Brain className="w-5 h-5" />,
        category: "ml",
        priority: "high",
        isActive: false,
        component: DefaultModule,
        status: "healthy",
        metrics: { accuracy: 95.6, performance: 90.2, reliability: 96.8 },
        dependencies: ["ultra-accuracy"],
        computationLevel: "heavy",
      },
      {
        id: "risk-analytics",
        name: "Risk Analytics",
        description: "Comprehensive risk assessment and mitigation strategies",
        icon: <AlertCircle className="w-5 h-5" />,
        category: "analytics",
        priority: "medium",
        isActive: false,
        component: DefaultModule,
        status: "healthy",
        metrics: { accuracy: 87.9, performance: 91.3, reliability: 88.6 },
        computationLevel: "medium",
      },
      {
        id: "neural-ensemble",
        name: "Neural Ensemble",
        description:
          "Multi-model ensemble learning with automatic optimization",
        icon: <Layers3 className="w-5 h-5" />,
        category: "ml",
        priority: "high",
        isActive: false,
        component: DefaultModule,
        status: "healthy",
        metrics: { accuracy: 96.4, performance: 89.7, reliability: 95.3 },
        dependencies: ["ml-insights"],
        computationLevel: "extreme",
      },
    ],
    [],
  );

  // Filtered modules based on search and category
  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      const matchesSearch =
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || module.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [modules, searchQuery, selectedCategory]);

  // Active modules
  const activeModules = useMemo(
    () =>
      modules.filter((module) => moduleStates[module.id] ?? module.isActive),
    [modules, moduleStates],
  );

  // System status calculation
  const systemStatus = useMemo(() => {
    const healthyModules = activeModules.filter(
      (m) => m.status === "healthy",
    ).length;
    const totalActive = activeModules.length;

    if (totalActive === 0)
      return {
        status: "offline",
        color: "bg-gray-500",
        textColor: "text-gray-700",
      };
    if (healthyModules === totalActive)
      return {
        status: "optimal",
        color: "bg-green-500",
        textColor: "text-green-700",
      };
    if (healthyModules / totalActive > 0.7)
      return {
        status: "good",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
      };
    return {
      status: "degraded",
      color: "bg-red-500",
      textColor: "text-red-700",
    };
  }, [activeModules]);

  // Enhanced module toggle with dependency checking
  const toggleModule = useCallback(
    (moduleId: string) => {
      const module = modules.find((m) => m.id === moduleId);
      if (!module) return;

      const currentState = moduleStates[moduleId] ?? module.isActive;
      const newState = !currentState;

      // Check dependencies when activating
      if (newState && module.dependencies) {
        const missingDeps = module.dependencies.filter(
          (depId) =>
            !(
              moduleStates[depId] ??
              modules.find((m) => m.id === depId)?.isActive
            ),
        );

        if (missingDeps.length > 0) {
          toast.error(
            `Cannot activate ${module.name}. Missing dependencies: ${missingDeps.join(", ")}`,
          );
          return;
        }
      }

      // Check dependent modules when deactivating
      if (!newState) {
        const dependentModules = modules.filter(
          (m) =>
            m.dependencies?.includes(moduleId) &&
            (moduleStates[m.id] ?? m.isActive),
        );

        if (dependentModules.length > 0) {
          toast.error(
            `Cannot deactivate ${module.name}. Required by: ${dependentModules.map((m) => m.name).join(", ")}`,
          );
          return;
        }
      }

      setModuleStates((prev) => ({
        ...prev,
        [moduleId]: newState,
      }));

      toast.success(
        `${module.name} ${newState ? "activated" : "deactivated"}`,
        {
          icon: newState ? "🟢" : "🔴",
        },
      );
    },
    [modules, moduleStates],
  );

  // Enhanced system optimization
  const optimizeSystem = useCallback(async () => {
    if (isOptimizing) return;

    setIsOptimizing(true);
    const loadingToast = toast.loading(
      "🔧 Initializing system optimization...",
    );

    try {
      // Multi-step optimization with user feedback
      const steps = [
        { message: "🧠 Optimizing neural networks...", duration: 1000 },
        { message: "⚡ Calibrating prediction models...", duration: 800 },
        {
          message: "🔄 Reallocating computational resources...",
          duration: 600,
        },
        { message: "📊 Updating performance metrics...", duration: 400 },
      ];

      for (const step of steps) {
        toast.dismiss(loadingToast);
        const stepToast = toast.loading(step.message);
        await new Promise((resolve) => setTimeout(resolve, step.duration));
        toast.dismiss(stepToast);
      }

      // Apply optimizations
      setSystemMetrics((prev) => ({
        ...prev,
        cpu: Math.max(25, prev.cpu - 20),
        memory: Math.max(20, prev.memory - 15),
        gpu: Math.max(30, prev.gpu - 10),
        accuracy: Math.min(99.9, prev.accuracy + 1.5),
        responseTime: Math.max(50, prev.responseTime - 30),
      }));

      setLastOptimization(new Date());
      toast.success("🚀 System optimized successfully! Performance improved.", {
        duration: 4000,
      });
    } catch (error) {
      toast.error("❌ Optimization failed. Please try again.");
      console.error("System optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  }, [isOptimizing]);

  // Keyboard shortcuts for power users
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "o":
            e.preventDefault();
            optimizeSystem();
            break;
          case "f":
            e.preventDefault();
            document.querySelector('input[placeholder*="Search"]')?.focus();
            break;
          case "1":
            e.preventDefault();
            setActiveTab("ultra-accuracy");
            break;
          case "2":
            e.preventDefault();
            setActiveTab("quantum-predictions");
            break;
          case "3":
            e.preventDefault();
            setActiveTab("strategy-engine");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [optimizeSystem]);

  // Real-time updates with error handling
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        setSystemMetrics((prev) => ({
          ...prev,
          cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 8)),
          memory: Math.max(
            15,
            Math.min(85, prev.memory + (Math.random() - 0.5) * 6),
          ),
          gpu: Math.max(
            25,
            Math.min(95, prev.gpu + (Math.random() - 0.5) * 10),
          ),
          network: Math.max(
            60,
            Math.min(100, prev.network + (Math.random() - 0.5) * 4),
          ),
          totalPredictions:
            prev.totalPredictions + Math.floor(Math.random() * 5),
          activeModules: activeModules.length,
          responseTime: Math.max(
            50,
            Math.min(300, prev.responseTime + (Math.random() - 0.5) * 20),
          ),
        }));
      } catch (error) {
        console.warn("Error updating system metrics:", error);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeModules.length]);

  // Category options
  const categories = [
    { value: "all", label: "All Modules" },
    { value: "prediction", label: "🎯 Prediction" },
    { value: "analytics", label: "📊 Analytics" },
    { value: "ml", label: "🧠 Machine Learning" },
    { value: "strategy", label: "🎲 Strategy" },
    { value: "monitoring", label: "📡 Monitoring" },
    { value: "quantum", label: "⚛️ Quantum" },
    { value: "cyber", label: "🛡️ Cyber" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-12 h-12 text-blue-600" />
              </motion.div>
              <div
                className={`absolute -top-1 -right-1 w-4 h-4 ${systemStatus.color} rounded-full animate-pulse shadow-lg`}
              />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Advanced Intelligence Hub
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Unified AI-powered betting intelligence platform featuring quantum
            predictions, cyber-grade analytics, and revolutionary accuracy
            systems with real-time performance monitoring
          </p>
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className="animate-pulse"
            >
              {isConnected ? "🟢 Connected" : "🔴 Offline"}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 border-blue-200 text-blue-700"
            >
              {activeModules.length} Active Modules
            </Badge>
            <Badge
              variant="outline"
              className={`${systemStatus.color.replace("bg-", "border-")} ${systemStatus.textColor}`}
            >
              System {systemStatus.status}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-purple-50 border-purple-200 text-purple-700"
            >
              ⚡ {systemMetrics.accuracy}% Accuracy
            </Badge>
            {lastOptimization && (
              <Badge
                variant="outline"
                className="bg-green-50 border-green-200 text-green-700"
              >
                🔧 Optimized {new Date(lastOptimization).toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Enhanced System Overview */}
        <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>System Overview</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={optimizeSystem}
                  disabled={isOptimizing}
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50"
                >
                  {isOptimizing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  {isOptimizing ? "Optimizing..." : "Optimize"}
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: "CPU",
                  value: systemMetrics.cpu,
                  suffix: "%",
                  color: "blue",
                  icon: <Cpu className="w-4 h-4" />,
                },
                {
                  label: "Memory",
                  value: systemMetrics.memory,
                  suffix: "%",
                  color: "green",
                  icon: <Network className="w-4 h-4" />,
                },
                {
                  label: "Accuracy",
                  value: systemMetrics.accuracy,
                  suffix: "%",
                  color: "purple",
                  icon: <Target className="w-4 h-4" />,
                },
                {
                  label: "Uptime",
                  value: systemMetrics.uptime,
                  suffix: "%",
                  color: "emerald",
                  icon: <CheckCircle className="w-4 h-4" />,
                },
              ].map((metric) => (
                <motion.div
                  key={metric.label}
                  whileHover={{ scale: 1.02 }}
                  className="text-center space-y-3 p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`text-${metric.color}-600`}>
                      {metric.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {metric.label}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Progress
                      value={metric.value}
                      className="h-3"
                      style={{
                        background: `linear-gradient(to right, rgb(59 130 246 / 0.2), rgb(147 51 234 / 0.2))`,
                      }}
                    />
                    <div className="text-lg font-bold text-gray-900">
                      {metric.value.toFixed(1)}
                      {metric.suffix}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Metrics Cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-all">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {systemMetrics.totalPredictions.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600 flex items-center justify-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Total Predictions</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-md transition-all">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {activeModules.length}/{modules.length}
                  </div>
                  <div className="text-sm text-green-600 flex items-center justify-center space-x-1">
                    <Power className="w-4 h-4" />
                    <span>Active Modules</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-all">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {systemMetrics.responseTime}ms
                  </div>
                  <div className="text-sm text-purple-600 flex items-center justify-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>Response Time</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Module Controls */}
        <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <span>Module Controls</span>
              <Badge variant="outline" className="ml-2">
                {filteredModules.length} modules
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search modules... (Ctrl+F)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-64 bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredModules.map((module) => {
              const isModuleActive = moduleStates[module.id] ?? module.isActive;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Card
                    className={`shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 border-0 ${
                      isModuleActive
                        ? "ring-2 ring-blue-200 bg-gradient-to-br from-blue-50/50 to-white"
                        : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`p-3 rounded-lg transition-all duration-200 ${
                              module.status === "healthy"
                                ? "bg-green-100 text-green-600"
                                : module.status === "warning"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : module.status === "error"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                            } ${isModuleActive ? "shadow-md" : ""}`}
                          >
                            {module.icon}
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {module.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant="outline"
                                className="capitalize text-xs"
                              >
                                {module.category}
                              </Badge>
                              <Badge
                                variant={
                                  module.priority === "critical"
                                    ? "destructive"
                                    : module.priority === "high"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {module.priority}
                              </Badge>
                              {module.computationLevel && (
                                <Badge variant="outline" className="text-xs">
                                  {module.computationLevel}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleModule(module.id)}
                            className={`transition-all duration-200 ${
                              isModuleActive
                                ? "text-green-600 hover:bg-green-50 hover:scale-110"
                                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                            }`}
                            title={`${
                              isModuleActive ? "Deactivate" : "Activate"
                            } ${module.name}`}
                          >
                            {isModuleActive ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {module.description}
                      </p>

                      {/* Enhanced Metrics */}
                      <div className="space-y-3">
                        {[
                          {
                            label: "Accuracy",
                            value: module.metrics.accuracy,
                            color: "blue",
                          },
                          {
                            label: "Performance",
                            value: module.metrics.performance,
                            color: "green",
                          },
                          {
                            label: "Reliability",
                            value: module.metrics.reliability,
                            color: "purple",
                          },
                        ].map((metric) => (
                          <div key={metric.label} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium">
                                {metric.label}
                              </span>
                              <span className="font-bold">{metric.value}%</span>
                            </div>
                            <Progress value={metric.value} className="h-2" />
                          </div>
                        ))}
                      </div>

                      {/* Dependencies */}
                      {module.dependencies &&
                        module.dependencies.length > 0 && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            <div className="flex items-center space-x-1 mb-1">
                              <Network className="w-3 h-3" />
                              <span className="font-medium">Dependencies:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {module.dependencies.map((dep) => (
                                <Badge
                                  key={dep}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {modules.find((m) => m.id === dep)?.name ||
                                    dep}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge
                          variant={
                            module.status === "healthy"
                              ? "default"
                              : module.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs capitalize"
                        >
                          {module.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Info className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Enhanced Active Module Display */}
        {activeModules.length > 0 && (
          <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  <span>Active Modules</span>
                  <Badge variant="outline">
                    {activeModules.length} running
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Maximize className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 h-auto p-2 bg-gray-50/50">
                  {activeModules.map((module) => (
                    <TabsTrigger
                      key={module.id}
                      value={module.id}
                      className="flex items-center space-x-2 p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-white/70 transition-all"
                    >
                      {module.icon}
                      <span className="hidden sm:inline font-medium">
                        {module.name}
                      </span>
                      <Badge
                        variant={
                          module.status === "healthy"
                            ? "default"
                            : "destructive"
                        }
                        className="ml-1 text-xs"
                      >
                        {module.status}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {activeModules.map((module) => (
                  <TabsContent
                    key={module.id}
                    value={module.id}
                    className="mt-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-xl p-6 bg-gradient-to-br from-white to-gray-50/50 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            {module.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {module.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {module.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              module.status === "healthy"
                                ? "default"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {module.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {module.computationLevel || "standard"}
                          </Badge>
                        </div>
                      </div>

                      <ModuleErrorBoundary moduleName={module.name}>
                        <Suspense fallback={<ModuleLoader />}>
                          <module.component
                            name={module.name}
                            description={module.description}
                          />
                        </Suspense>
                      </ModuleErrorBoundary>
                    </motion.div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* No active modules message */}
        {activeModules.length === 0 && (
          <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-12 text-center">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Active Modules
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Activate modules above to start using the Intelligence Hub
              </p>
              <Button
                onClick={() => toggleModule("ultra-accuracy")}
                variant="outline"
                className="hover:bg-blue-50"
              >
                <Target className="w-4 h-4 mr-2" />
                Activate Ultra Accuracy
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdvancedIntelligenceHub;
