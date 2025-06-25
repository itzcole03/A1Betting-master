import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import { predictionService } from '../../services/predictionService';
import useStore from '../../store/useStore';
import { UnifiedStrategyConfig } from '../strategy/UnifiedStrategyConfig';
import EnhancedPropCard from '../ui/EnhancedPropCard';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import { NotificationCenter } from '../ui/NotificationCenter';
import Tooltip from '../ui/Tooltip';
const Dashboard = () => {
    const { darkMode } = useStore();
    // Fetch recent predictions
    const { data: predictions, isLoading: predictionsLoading } = useQuery({
        queryKey: ['predictions'],
        queryFn: () => predictionService.getRecentPredictions(),
        staleTime: 30000,
    });
    // Fetch engine metrics
    const { data: metrics, isLoading: metricsLoading } = useQuery({
        queryKey: ['metrics'],
        queryFn: () => predictionService.getEngineMetrics(),
        staleTime: 30000,
    });
    // Performance chart data
    const chartData = {
        labels: predictions?.map(p => new Date(p.timestamp).toLocaleTimeString()) || [],
        datasets: [
            {
                label: 'Prediction Accuracy',
                data: predictions?.map(p => p.prediction) || [],
                borderColor: '#5D5CDE',
                backgroundColor: 'rgba(93, 92, 222, 0.1)',
                tension: 0.4,
            },
            {
                label: 'Confidence',
                data: predictions?.map(p => p.confidence) || [],
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                tension: 0.4,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 1,
            },
        },
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "flex justify-end mb-2", children: _jsx(NotificationCenter, {}) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(GlassCard, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Tooltip, { content: "Total number of predictions made by the engine.", children: _jsx("span", { className: "text-sm text-gray-500 cursor-help", children: "Total Predictions" }) }), _jsx("span", { className: "text-3xl font-bold text-primary-500", children: metricsLoading ? '...' : metrics?.total_predictions || 0 })] }) }), _jsx(GlassCard, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Tooltip, { content: "Average accuracy of all predictions.", children: _jsx("span", { className: "text-sm text-gray-500 cursor-help", children: "Avg Accuracy" }) }), _jsx("span", { className: "text-3xl font-bold text-primary-500", children: metricsLoading ? '...' : metrics?.average_accuracy ? `${(metrics.average_accuracy * 100).toFixed(1)}%` : '0%' })] }) }), _jsx(GlassCard, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Tooltip, { content: "Success rate of predictions (win %).", children: _jsx("span", { className: "text-sm text-gray-500 cursor-help", children: "Success Rate" }) }), _jsx("span", { className: "text-3xl font-bold text-primary-500", children: metricsLoading ? '...' : metrics?.success_rate ? `${(metrics.success_rate * 100).toFixed(1)}%` : '0%' })] }) }), _jsx(GlassCard, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Tooltip, { content: "Return on investment from all predictions.", children: _jsx("span", { className: "text-sm text-gray-500 cursor-help", children: "ROI" }) }), _jsx("span", { className: "text-3xl font-bold text-primary-500", children: metricsLoading ? '...' : metrics?.roi ? `${metrics.roi.toFixed(2)}%` : '0%' })] }) })] }), _jsxs(GlassCard, { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Performance Overview" }), _jsx(Tooltip, { content: "Refresh chart data", children: _jsx(GlowButton, { onClick: () => window.location.reload(), children: "Refresh" }) })] }), _jsx("div", { className: "h-80", children: _jsx(Line, { data: chartData, options: chartOptions }) })] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Recent Predictions" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: predictionsLoading
                            ? Array.from({ length: 3 }).map((_, i) => (_jsx("div", { className: "animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" }, i)))
                            : predictions?.slice(0, 6).map(prediction => (_jsx(EnhancedPropCard, { playerName: prediction.playerName, statType: prediction.statType, line: prediction.line, overOdds: prediction.overOdds, underOdds: prediction.underOdds, sentiment: prediction.sentiment, aiBoost: prediction.aiBoost, patternStrength: prediction.patternStrength, bonusPercent: prediction.bonusPercent, enhancementPercent: prediction.enhancementPercent, onSelect: () => { }, onViewDetails: () => { } }, prediction.id))) })] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Strategy Compositor" }), _jsx(UnifiedStrategyConfig, {})] })] }));
};
// DEPRECATED: Use UnifiedDashboard.tsx instead. This file is no longer used.
const Dashboard = () => null;
export default Dashboard;
