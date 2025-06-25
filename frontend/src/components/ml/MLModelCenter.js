import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Brain, Play, Pause, Settings, TrendingUp, Target, Zap, AlertCircle, CheckCircle, Clock, Download, RefreshCw, Activity, } from "lucide-react";
import { mlEngine } from "../../services/ml/UnifiedMLEngine";
import { useUnifiedStore } from "../../store/unified/UnifiedStoreManager";
const MLModelCenter = () => {
    const [modelStatuses, setModelStatuses] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [isRetrainingAll, setIsRetrainingAll] = useState(false);
    const [systemHealth, setSystemHealth] = useState("healthy");
    const { actions } = useUnifiedStore();
    useEffect(() => {
        const loadModelStatuses = async () => {
            try {
                const activeModels = mlEngine.getActiveModels();
                const statuses = await Promise.all(activeModels.map(async (model) => {
                    const performance = mlEngine.getModelPerformance(model.name);
                    return {
                        model,
                        performance: performance || null,
                        isRetraining: false,
                        lastUpdate: new Date(model.lastTrained),
                        health: performance?.accuracy && performance.accuracy > 0.7
                            ? "healthy"
                            : performance?.accuracy && performance.accuracy > 0.6
                                ? "warning"
                                : "error",
                    };
                }));
                setModelStatuses(statuses);
                // Calculate system health
                const healthyModels = statuses.filter((s) => s.health === "healthy").length;
                const totalModels = statuses.length;
                if (healthyModels / totalModels >= 0.8) {
                    setSystemHealth("healthy");
                }
                else if (healthyModels / totalModels >= 0.6) {
                    setSystemHealth("warning");
                }
                else {
                    setSystemHealth("error");
                }
            }
            catch (error) {
                console.error("Failed to load model statuses:", error);
                actions.addToast({
                    type: "error",
                    title: "Model Loading Failed",
                    message: "Unable to load ML model statuses",
                });
            }
        };
        loadModelStatuses();
        const interval = setInterval(loadModelStatuses, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [actions]);
    const handleRetrain = async (modelName) => {
        setModelStatuses((prev) => prev.map((status) => status.model.name === modelName
            ? { ...status, isRetraining: true }
            : status));
        try {
            await mlEngine.retrain(modelName);
            actions.addToast({
                type: "success",
                title: "Retraining Complete",
                message: `Model ${modelName} has been successfully retrained`,
            });
            // Reload model status
            const updatedModel = mlEngine
                .getActiveModels()
                .find((m) => m.name === modelName);
            if (updatedModel) {
                setModelStatuses((prev) => prev.map((status) => status.model.name === modelName
                    ? {
                        ...status,
                        model: updatedModel,
                        isRetraining: false,
                        lastUpdate: new Date(),
                        health: "healthy",
                    }
                    : status));
            }
        }
        catch (error) {
            actions.addToast({
                type: "error",
                title: "Retraining Failed",
                message: `Failed to retrain model ${modelName}`,
            });
            setModelStatuses((prev) => prev.map((status) => status.model.name === modelName
                ? { ...status, isRetraining: false }
                : status));
        }
    };
    const handleRetrainAll = async () => {
        setIsRetrainingAll(true);
        setModelStatuses((prev) => prev.map((status) => ({ ...status, isRetraining: true })));
        try {
            await mlEngine.retrain(); // Retrain all models
            actions.addToast({
                type: "success",
                title: "All Models Retrained",
                message: "All ML models have been successfully retrained",
            });
            // Reload all model statuses
            const activeModels = mlEngine.getActiveModels();
            setModelStatuses((prev) => prev.map((status, index) => ({
                ...status,
                model: activeModels[index] || status.model,
                isRetraining: false,
                lastUpdate: new Date(),
                health: "healthy",
            })));
        }
        catch (error) {
            actions.addToast({
                type: "error",
                title: "Bulk Retraining Failed",
                message: "Failed to retrain all models",
            });
            setModelStatuses((prev) => prev.map((status) => ({ ...status, isRetraining: false })));
        }
        finally {
            setIsRetrainingAll(false);
        }
    };
    const toggleModelStatus = (modelName) => {
        setModelStatuses((prev) => prev.map((status) => status.model.name === modelName
            ? {
                ...status,
                model: { ...status.model, isActive: !status.model.isActive },
            }
            : status));
        actions.addToast({
            type: "info",
            title: "Model Status Updated",
            message: `Model ${modelName} ${modelStatuses.find((s) => s.model.name === modelName)?.model.isActive ? "deactivated" : "activated"}`,
        });
    };
    const getHealthColor = (health) => {
        switch (health) {
            case "healthy":
                return "text-green-600 bg-green-100";
            case "warning":
                return "text-yellow-600 bg-yellow-100";
            case "error":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };
    const getHealthIcon = (health) => {
        switch (health) {
            case "healthy":
                return _jsx(CheckCircle, { className: "w-4 h-4" });
            case "warning":
                return _jsx(AlertCircle, { className: "w-4 h-4" });
            case "error":
                return _jsx(AlertCircle, { className: "w-4 h-4" });
            default:
                return _jsx(Activity, { className: "w-4 h-4" });
        }
    };
    const ModelCard = ({ status }) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg", children: _jsx(Brain, { className: "w-5 h-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: status.model.name }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [status.model.type.toUpperCase(), " \u2022 v", status.model.version] })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(status.health)}`, children: [getHealthIcon(status.health), _jsx("span", { className: "ml-1", children: status.health.toUpperCase() })] }), _jsx("button", { onClick: () => toggleModelStatus(status.model.name), disabled: status.isRetraining, className: `p-2 rounded-lg transition-colors ${status.model.isActive
                                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"} disabled:opacity-50 disabled:cursor-not-allowed`, title: status.model.isActive ? "Deactivate Model" : "Activate Model", children: status.model.isActive ? (_jsx(Play, { className: "w-4 h-4" })) : (_jsx(Pause, { className: "w-4 h-4" })) })] })] }), status.performance && (_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [(status.performance.accuracy * 100).toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Accuracy" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [(status.performance.precision * 100).toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Precision" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: status.performance.totalPredictions }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Predictions" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-green-600", children: [(status.performance.profitability * 100).toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Profit" })] })] })), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Ensemble Weight" }), _jsxs("span", { className: "font-medium text-gray-900 dark:text-white", children: [(status.model.weight * 100).toFixed(0), "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${status.model.weight * 100}%` } }) })] }), _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsxs("span", { children: ["Last trained: ", status.lastUpdate.toLocaleDateString()] })] }), _jsxs("span", { children: [status.model.features.length, " features"] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => handleRetrain(status.model.name), disabled: status.isRetraining || isRetrainingAll, className: "flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2", children: status.isRetraining ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" }), _jsx("span", { children: "Training..." })] })) : (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "w-4 h-4" }), _jsx("span", { children: "Retrain" })] })) }), _jsx("button", { onClick: () => setSelectedModel(status.model.name), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: _jsx(Settings, { className: "w-4 h-4" }) }), _jsx("button", { className: "px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", title: "Download Model", children: _jsx(Download, { className: "w-4 h-4" }) })] })] }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "ML Model Center" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Manage and monitor your machine learning models" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(systemHealth)}`, children: [getHealthIcon(systemHealth), _jsxs("span", { className: "ml-1", children: ["System ", systemHealth.toUpperCase()] })] }), _jsx("button", { onClick: handleRetrainAll, disabled: isRetrainingAll, className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2", children: isRetrainingAll ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" }), _jsx("span", { children: "Retraining All..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Zap, { className: "w-4 h-4" }), _jsx("span", { children: "Retrain All" })] })) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg", children: _jsx(Brain, { className: "w-5 h-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: modelStatuses.length }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Models" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-green-100 dark:bg-green-900/20 rounded-lg", children: _jsx(CheckCircle, { className: "w-5 h-5 text-green-600" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: modelStatuses.filter((s) => s.model.isActive).length }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Active Models" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg", children: _jsx(TrendingUp, { className: "w-5 h-5 text-purple-600" }) }), _jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [modelStatuses.length > 0
                                                    ? ((modelStatuses.reduce((acc, s) => acc + (s.performance?.accuracy || 0), 0) /
                                                        modelStatuses.length) *
                                                        100).toFixed(1)
                                                    : 0, "%"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Avg Accuracy" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg", children: _jsx(Target, { className: "w-5 h-5 text-yellow-600" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: modelStatuses.reduce((acc, s) => acc + (s.performance?.totalPredictions || 0), 0) }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Predictions" })] })] }) })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: modelStatuses.map((status, index) => (_jsx(ModelCard, { status: status }, index))) }), selectedModel && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: ["Model Details: ", selectedModel] }), _jsx("button", { onClick: () => setSelectedModel(null), className: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300", children: "\u00D7" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-3", children: "Configuration" }), _jsx("div", { className: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4", children: _jsx("pre", { className: "text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: JSON.stringify(modelStatuses.find((s) => s.model.name === selectedModel)
                                                    ?.model.hyperparameters, null, 2) }) })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-3", children: "Performance Metrics" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: Object.entries(modelStatuses.find((s) => s.model.name === selectedModel)
                                                ?.model.performance || {}).map(([key, value]) => (_jsxs("div", { className: "bg-gray-50 dark:bg-gray-700 rounded-lg p-3", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: key
                                                            .replace(/([A-Z])/g, " $1")
                                                            .replace(/^./, (str) => str.toUpperCase()) }), _jsx("div", { className: "font-semibold text-gray-900 dark:text-white", children: typeof value === "number" ? value.toFixed(3) : value })] }, key))) })] })] })] }) }))] }));
};
export default MLModelCenter;
