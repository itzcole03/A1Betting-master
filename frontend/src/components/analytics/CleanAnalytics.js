import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Brain, Target, Activity, DollarSign, Clock, Shield, AlertTriangle, CheckCircle, } from "lucide-react";
export const CleanAnalytics = () => {
    const [models, setModels] = useState([
        {
            id: "1",
            name: "NBA Advanced Model v3.2",
            accuracy: 94.7,
            predictions: 1247,
            profit: 8247.63,
            roi: 67.3,
            sharpeRatio: 2.8,
            maxDrawdown: -8.2,
            lastUpdated: new Date(),
            status: "active",
        },
        {
            id: "2",
            name: "NFL Player Props AI v1.8",
            accuracy: 89.2,
            predictions: 893,
            profit: 5621.45,
            roi: 54.7,
            sharpeRatio: 2.3,
            maxDrawdown: -12.1,
            lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
            status: "active",
        },
        {
            id: "3",
            name: "Ensemble Model v2.1",
            accuracy: 91.8,
            predictions: 2156,
            profit: 12847.92,
            roi: 78.9,
            sharpeRatio: 3.1,
            maxDrawdown: -6.5,
            lastUpdated: new Date(Date.now() - 2 * 60 * 1000),
            status: "active",
        },
        {
            id: "4",
            name: "Deep Learning Predictor v4.0",
            accuracy: 87.4,
            predictions: 567,
            profit: 3421.78,
            roi: 42.8,
            sharpeRatio: 1.9,
            maxDrawdown: -15.3,
            lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
            status: "training",
        },
    ]);
    const [metrics, setMetrics] = useState({
        totalPredictions: 4863,
        accuracy: 91.3,
        profit: 30138.78,
        roi: 64.7,
        winRate: 87.2,
        avgOdds: 1.89,
        avgStake: 247.5,
        totalVolume: 1203470,
        bestModel: "Ensemble Model v2.1",
        worstModel: "Deep Learning Predictor v4.0",
        riskScore: 3.7,
        confidenceScore: 94.2,
    });
    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setModels((prev) => prev.map((model) => ({
                ...model,
                accuracy: Math.max(80, Math.min(98, model.accuracy + (Math.random() - 0.5) * 0.5)),
                profit: Math.max(0, model.profit + (Math.random() - 0.3) * 100),
                roi: Math.max(0, model.roi + (Math.random() - 0.5) * 2),
                lastUpdated: new Date(),
            })));
        }, 30000);
        return () => clearInterval(interval);
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "text-green-400 bg-green-500/10 border-green-500/20";
            case "training":
                return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
            case "offline":
                return "text-red-400 bg-red-500/10 border-red-500/20";
            default:
                return "text-gray-400 bg-gray-500/10 border-gray-500/20";
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "active":
                return _jsx(CheckCircle, { size: 12, className: "text-green-400" });
            case "training":
                return _jsx(Clock, { size: 12, className: "text-yellow-400" });
            case "offline":
                return _jsx(AlertTriangle, { size: 12, className: "text-red-400" });
            default:
                return _jsx(Activity, { size: 12, className: "text-gray-400" });
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-cyan-900/30 border border-gray-700/50 backdrop-blur-xl overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 opacity-10", children: [_jsx("div", { className: "absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl" }), _jsx("div", { className: "absolute bottom-1/4 right-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl" })] }), _jsxs("div", { className: "relative flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-4xl font-bold text-white mb-2 flex items-center space-x-3", children: [_jsx(BarChart3, { size: 40, className: "text-purple-400" }), _jsx("span", { children: "Advanced Analytics" })] }), _jsx("p", { className: "text-xl text-gray-300", children: "Real-time performance tracking with advanced ML metrics and market analysis" })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-3xl font-bold text-purple-400", children: [metrics.accuracy, "%"] }), _jsx("div", { className: "text-gray-400", children: "Overall Accuracy" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-green-500/20", children: _jsx(DollarSign, { size: 24, className: "text-green-400" }) }), _jsx("div", { className: "text-sm text-green-400 font-bold", children: "+64.7%" })] }), _jsxs("div", { className: "text-2xl font-bold text-white mb-1", children: ["$", metrics.profit.toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-400", children: "Total Profit" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-blue-500/20", children: _jsx(Target, { size: 24, className: "text-blue-400" }) }), _jsx("div", { className: "text-sm text-blue-400 font-bold", children: "+2.8%" })] }), _jsxs("div", { className: "text-2xl font-bold text-white mb-1", children: [metrics.winRate, "%"] }), _jsx("div", { className: "text-sm text-gray-400", children: "Win Rate" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-purple-500/20", children: _jsx(Brain, { size: 24, className: "text-purple-400" }) }), _jsx("div", { className: "text-sm text-purple-400 font-bold", children: "Live" })] }), _jsx("div", { className: "text-2xl font-bold text-white mb-1", children: metrics.totalPredictions.toLocaleString() }), _jsx("div", { className: "text-sm text-gray-400", children: "Total Predictions" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "p-3 rounded-xl bg-yellow-500/20", children: _jsx(Shield, { size: 24, className: "text-yellow-400" }) }), _jsx("div", { className: "text-sm text-yellow-400 font-bold", children: "Low" })] }), _jsxs("div", { className: "text-2xl font-bold text-white mb-1", children: [metrics.riskScore, "/10"] }), _jsx("div", { className: "text-sm text-gray-400", children: "Risk Score" })] })] }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-8", children: [_jsxs("div", { className: "xl:col-span-2 space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20", children: _jsx(Brain, { size: 20, className: "text-blue-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Model Performance" }), _jsx("p", { className: "text-sm text-gray-400", children: "Real-time AI model analytics" })] })] }) }), _jsx("div", { className: "space-y-4", children: models.map((model, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, className: "p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl hover:border-gray-600/50 transition-all", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("h3", { className: "text-lg font-bold text-white", children: model.name }), _jsxs("span", { className: `px-2 py-1 rounded text-sm font-bold border ${getStatusColor(model.status)} flex items-center space-x-1`, children: [getStatusIcon(model.status), _jsx("span", { children: model.status })] })] }), _jsxs("p", { className: "text-sm text-gray-400", children: [model.predictions.toLocaleString(), " predictions \u2022 Last updated: ", model.lastUpdated.toLocaleTimeString()] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold text-green-400", children: ["$", model.profit.toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-400", children: "Profit" })] })] }), _jsxs("div", { className: "grid grid-cols-5 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Accuracy" }), _jsxs("div", { className: "text-lg font-bold text-white", children: [model.accuracy.toFixed(1), "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "ROI" }), _jsxs("div", { className: "text-lg font-bold text-green-400", children: [model.roi.toFixed(1), "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Sharpe" }), _jsx("div", { className: "text-lg font-bold text-blue-400", children: model.sharpeRatio.toFixed(1) })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Max DD" }), _jsxs("div", { className: "text-lg font-bold text-red-400", children: [model.maxDrawdown.toFixed(1), "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Predictions" }), _jsx("div", { className: "text-lg font-bold text-white", children: model.predictions })] })] })] }, model.id))) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx("div", { className: "p-2 rounded-lg bg-green-500/20", children: _jsx(TrendingUp, { size: 18, className: "text-green-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Performance Summary" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Best Model" }), _jsx("span", { className: "text-sm text-green-400 font-medium", children: metrics.bestModel })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Avg Odds" }), _jsx("span", { className: "text-sm text-white", children: metrics.avgOdds })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Avg Stake" }), _jsxs("span", { className: "text-sm text-white", children: ["$", metrics.avgStake] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Total Volume" }), _jsxs("span", { className: "text-sm text-white", children: ["$", metrics.totalVolume.toLocaleString()] })] })] })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx("div", { className: "p-2 rounded-lg bg-red-500/20", children: _jsx(Shield, { size: 18, className: "text-red-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Risk Analysis" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Portfolio Risk" }), _jsxs("span", { className: "text-sm text-white", children: [metrics.riskScore, "/10"] })] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full", style: { width: `${(metrics.riskScore / 10) * 100}%` } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm text-gray-400", children: "Confidence" }), _jsxs("span", { className: "text-sm text-white", children: [metrics.confidenceScore, "%"] })] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full", style: { width: `${metrics.confidenceScore}%` } }) })] })] })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-xl", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Quick Actions" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { className: "w-full p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 rounded-lg transition-all text-left", children: [_jsx("div", { className: "font-medium", children: "Export Report" }), _jsx("div", { className: "text-xs text-gray-400", children: "Download analytics PDF" })] }), _jsxs("button", { className: "w-full p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:border-green-400/50 text-green-400 hover:text-green-300 rounded-lg transition-all text-left", children: [_jsx("div", { className: "font-medium", children: "Model Comparison" }), _jsx("div", { className: "text-xs text-gray-400", children: "Compare performance" })] }), _jsxs("button", { className: "w-full p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-400/50 text-purple-400 hover:text-purple-300 rounded-lg transition-all text-left", children: [_jsx("div", { className: "font-medium", children: "Retrain Models" }), _jsx("div", { className: "text-xs text-gray-400", children: "Update with new data" })] })] })] })] })] })] }));
};
export default CleanAnalytics;
