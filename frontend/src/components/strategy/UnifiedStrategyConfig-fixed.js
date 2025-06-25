import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { UnifiedServiceRegistry } from "../../services/unified/UnifiedServiceRegistry";
import { useUnifiedAnalytics } from "../../hooks/useUnifiedAnalytics";
import {
  Card,
  Button,
  Input,
  Select,
  Slider,
  Spinner,
  Toast,
  Badge,
  Modal,
  Tabs,
  Tab,
} from "../ui/UnifiedUI";

const UnifiedStrategyConfig = () => {
  // Initialize services
  const serviceRegistry = UnifiedServiceRegistry.getInstance();
  const predictionService = serviceRegistry.getService("prediction");
  const analyticsService = serviceRegistry.getService("analytics");
  const stateService = serviceRegistry.getService("state");
  const notificationService = serviceRegistry.getService("notification");
  const errorService = serviceRegistry.getService("error");
  const webSocketService = serviceRegistry.getService("websocket");

  // State
  const [config, setConfig] = useState({
    investmentAmount: 1000,
    modelSet: {},
    confidenceThreshold: 85,
    strategyMode: "balanced",
    portfolioSize: 3,
    sportsUniverse: {
      all: true,
      selected: [],
    },
    timeHorizon: {
      value: 1,
      unit: "hours",
    },
    riskProfile: {
      maxDrawdown: 20,
      maxExposure: 50,
      correlationLimit: 0.7,
    },
  });

  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Analytics state using the existing hook
  const analytics = useUnifiedAnalytics({
    ml: true,
    performance: true,
    betting: true,
  });

  // Load available models
  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      // Mock model loading since we can't access the actual service methods
      const mockModels = [
        {
          id: "model1",
          name: "Advanced ML Model",
          type: "neural_network",
          enabled: true,
          weight: 0.4,
        },
        {
          id: "model2",
          name: "Statistical Model",
          type: "statistical",
          enabled: true,
          weight: 0.3,
        },
        {
          id: "model3",
          name: "Ensemble Model",
          type: "ensemble",
          enabled: false,
          weight: 0.3,
        },
      ];
      setModels(mockModels);

      // Initialize model weights in config
      const modelSet = {};
      mockModels.forEach((model) => {
        modelSet[model.id] = {
          enabled: model.enabled,
          weight: model.weight,
        };
      });
      setConfig((prev) => ({ ...prev, modelSet }));
    } catch (err) {
      handleError("Failed to load models", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleModelWeightChange = (modelId, weight) => {
    setConfig((prev) => ({
      ...prev,
      modelSet: {
        ...prev.modelSet,
        [modelId]: { ...prev.modelSet[modelId], weight },
      },
    }));
  };

  const handleModelToggle = (modelId, enabled) => {
    setConfig((prev) => ({
      ...prev,
      modelSet: {
        ...prev.modelSet,
        [modelId]: { ...prev.modelSet[modelId], enabled },
      },
    }));
  };

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      // Mock recommendations generation
      const mockRecommendations = [
        {
          id: 1,
          sport: "Basketball",
          event: "Lakers vs Warriors",
          selection: "Lakers +5.5",
          confidence: 0.87,
          expectedValue: 0.15,
          stake: 50,
        },
      ];
      setRecommendations(mockRecommendations);
      setShowRecommendations(true);
    } catch (err) {
      handleError("Failed to generate recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message, error) => {
    console.error(message, error);
    setError(message);
    setToast({
      type: "error",
      message: message,
    });
  };

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

  if (loading && models.length === 0) {
    return _jsx(Card, {
      children: _jsx("div", {
        className: "flex justify-center items-center p-8",
        children: _jsx(Spinner, { size: "lg" }),
      }),
    });
  }

  return _jsxs(_Fragment, {
    children: [
      _jsx(Card, {
        children: _jsxs("div", {
          className: "p-6",
          children: [
            _jsx("h2", {
              className: "text-xl font-bold mb-4",
              children: "Strategy Configuration",
            }),
            _jsxs(Tabs, {
              value: activeTab,
              onChange: setActiveTab,
              children: [
                _jsx(Tab, { value: "basic", children: "Basic Settings" }),
                _jsx(Tab, { value: "models", children: "Model Configuration" }),
                _jsx(Tab, { value: "risk", children: "Risk Management" }),
              ],
            }),
            activeTab === "basic" &&
              _jsxs("div", {
                className: "space-y-4 mt-4",
                children: [
                  _jsxs("div", {
                    children: [
                      _jsx("label", {
                        className: "block text-sm font-medium mb-2",
                        children: "Investment Amount",
                      }),
                      _jsx(Input, {
                        type: "number",
                        value: config.investmentAmount,
                        onChange: (e) =>
                          handleConfigChange(
                            "investmentAmount",
                            Number(e.target.value),
                          ),
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    children: [
                      _jsx("label", {
                        className: "block text-sm font-medium mb-2",
                        children: "Strategy Mode",
                      }),
                      _jsxs(Select, {
                        value: config.strategyMode,
                        onChange: (value) =>
                          handleConfigChange("strategyMode", value),
                        children: [
                          _jsx("option", {
                            value: "conservative",
                            children: "Conservative",
                          }),
                          _jsx("option", {
                            value: "balanced",
                            children: "Balanced",
                          }),
                          _jsx("option", {
                            value: "aggressive",
                            children: "Aggressive",
                          }),
                        ],
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    children: [
                      _jsx("label", {
                        className: "block text-sm font-medium mb-2",
                        children: `Confidence Threshold: ${config.confidenceThreshold}%`,
                      }),
                      _jsx(Slider, {
                        min: 50,
                        max: 95,
                        value: config.confidenceThreshold,
                        onChange: (value) =>
                          handleConfigChange("confidenceThreshold", value),
                      }),
                    ],
                  }),
                ],
              }),
            activeTab === "models" &&
              _jsxs("div", {
                className: "space-y-4 mt-4",
                children: [
                  _jsx("h3", {
                    className: "text-lg font-semibold",
                    children: "Model Configuration",
                  }),
                  models.map((model) =>
                    _jsxs(
                      "div",
                      {
                        className: "border rounded p-4",
                        children: [
                          _jsxs("div", {
                            className: "flex justify-between items-center mb-2",
                            children: [
                              _jsx("span", {
                                className: "font-medium",
                                children: model.name,
                              }),
                              _jsx(Button, {
                                variant: config.modelSet[model.id]?.enabled
                                  ? "primary"
                                  : "secondary",
                                size: "sm",
                                onClick: () =>
                                  handleModelToggle(
                                    model.id,
                                    !config.modelSet[model.id]?.enabled,
                                  ),
                                children: config.modelSet[model.id]?.enabled
                                  ? "Enabled"
                                  : "Disabled",
                              }),
                            ],
                          }),
                          config.modelSet[model.id]?.enabled &&
                            _jsxs("div", {
                              children: [
                                _jsx("label", {
                                  className: "block text-sm text-gray-600 mb-1",
                                  children: `Weight: ${((config.modelSet[model.id]?.weight || 0) * 100).toFixed(0)}%`,
                                }),
                                _jsx(Slider, {
                                  min: 0,
                                  max: 1,
                                  step: 0.1,
                                  value: config.modelSet[model.id]?.weight || 0,
                                  onChange: (value) =>
                                    handleModelWeightChange(model.id, value),
                                }),
                              ],
                            }),
                        ],
                      },
                      model.id,
                    ),
                  ),
                ],
              }),
            activeTab === "risk" &&
              _jsxs("div", {
                className: "space-y-4 mt-4",
                children: [
                  _jsx("h3", {
                    className: "text-lg font-semibold",
                    children: "Risk Management",
                  }),
                  _jsxs("div", {
                    children: [
                      _jsx("label", {
                        className: "block text-sm font-medium mb-2",
                        children: `Max Drawdown: ${config.riskProfile.maxDrawdown}%`,
                      }),
                      _jsx(Slider, {
                        min: 5,
                        max: 50,
                        value: config.riskProfile.maxDrawdown,
                        onChange: (value) =>
                          handleConfigChange("riskProfile", {
                            ...config.riskProfile,
                            maxDrawdown: value,
                          }),
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    children: [
                      _jsx("label", {
                        className: "block text-sm font-medium mb-2",
                        children: `Max Exposure: ${config.riskProfile.maxExposure}%`,
                      }),
                      _jsx(Slider, {
                        min: 10,
                        max: 100,
                        value: config.riskProfile.maxExposure,
                        onChange: (value) =>
                          handleConfigChange("riskProfile", {
                            ...config.riskProfile,
                            maxExposure: value,
                          }),
                      }),
                    ],
                  }),
                ],
              }),
            _jsx("div", {
              className: "mt-6 pt-4 border-t",
              children: _jsx(Button, {
                onClick: generateRecommendations,
                disabled: loading,
                className: "w-full",
                children: loading
                  ? "Generating..."
                  : "Generate Recommendations",
              }),
            }),
          ],
        }),
      }),
      showRecommendations &&
        _jsx(Modal, {
          isOpen: showRecommendations,
          onClose: () => setShowRecommendations(false),
          title: "Portfolio Recommendations",
          children: _jsx("div", {
            className: "space-y-4",
            children: recommendations.map((recommendation, index) =>
              _jsxs(
                "div",
                {
                  className: "border rounded p-4",
                  children: [
                    _jsx("h4", {
                      className: "font-semibold",
                      children: recommendation.event,
                    }),
                    _jsx("p", {
                      className: "text-sm text-gray-600",
                      children: recommendation.selection,
                    }),
                    _jsxs("div", {
                      className: "flex justify-between mt-2",
                      children: [
                        _jsxs(Badge, {
                          variant: "success",
                          children: [
                            formatPercentage(recommendation.confidence),
                            " Confidence",
                          ],
                        }),
                        _jsxs(Badge, {
                          variant: "warning",
                          children: [
                            formatPercentage(recommendation.expectedValue),
                            " Expected Value",
                          ],
                        }),
                      ],
                    }),
                    _jsx("div", {
                      className: "mt-4",
                      children: _jsx(Button, {
                        onClick: () => setShowRecommendations(false),
                        children: "Select Portfolio",
                      }),
                    }),
                  ],
                },
                index,
              ),
            ),
          }),
        }),
      toast &&
        _jsx(Toast, {
          message: toast.message,
          type: toast.type,
          onClose: () => setToast(null),
        }),
    ],
  });
};

// Export both named and default exports to support all import styles
export { UnifiedStrategyConfig };
export default UnifiedStrategyConfig;
