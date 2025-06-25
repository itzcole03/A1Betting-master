import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { AdvancedMLDashboardPanels } from './AdvancedMLDashboardPanels';
const mockPerformanceHistory = [
    { date: '2025-06-01', accuracy: 0.89, f1: 0.85 },
    { date: '2025-06-02', accuracy: 0.91, f1: 0.88 },
    { date: '2025-06-03', accuracy: 0.93, f1: 0.90 },
    { date: '2025-06-04', accuracy: 0.92, f1: 0.89 },
    { date: '2025-06-05', accuracy: 0.94, f1: 0.91 },
];
export const AdvancedMLDashboard = ({ models }) => {
    const [selectedModelId, setSelectedModelId] = useState(models[0]?.id || '');
    const [timeRange, setTimeRange] = useState('7d');
    const eventId = 'event-123'; // Replace with real event ID as needed
    const activeModels = models.filter(m => m.status === 'active');
    const trainingModels = models.filter(m => m.status === 'training');
    const errorModels = models.filter(m => m.status === 'error');
    const chartData = {
        labels: models.map(m => m.name),
        datasets: [{
                label: 'Model Confidence',
                data: models.map(m => m.confidence),
                backgroundColor: models.map(m => m.status === 'active' ? 'rgba(16, 185, 129, 0.5)' :
                    m.status === 'training' ? 'rgba(245, 158, 11, 0.5)' :
                        'rgba(239, 68, 68, 0.5)'),
                borderColor: models.map(m => m.status === 'active' ? 'rgb(16, 185, 129)' :
                    m.status === 'training' ? 'rgb(245, 158, 11)' :
                        'rgb(239, 68, 68)'),
                borderWidth: 1
            }]
    };
    return (_jsxs("div", { className: "advanced-ml-dashboard", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "ML Model Status" }), _jsxs("div", { className: "flex gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Model" }), _jsx("select", { value: selectedModelId, onChange: e => setSelectedModelId(e.target.value), className: "rounded border px-2 py-1 dark:bg-gray-800 dark:text-white", children: models.map(m => (_jsx("option", { value: m.id, children: m.name }, m.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Time Range" }), _jsxs("select", { value: timeRange, onChange: e => setTimeRange(e.target.value), className: "rounded border px-2 py-1 dark:bg-gray-800 dark:text-white", children: [_jsx("option", { value: "7d", children: "Last 7 Days" }), _jsx("option", { value: "30d", children: "Last 30 Days" }), _jsx("option", { value: "90d", children: "Last 90 Days" })] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "glass-premium p-4 rounded-xl", children: [_jsx("div", { className: "text-sm text-gray-500", children: "Active Models" }), _jsx("div", { className: "text-2xl font-bold text-success-500", children: activeModels.length })] }), _jsxs("div", { className: "glass-premium p-4 rounded-xl", children: [_jsx("div", { className: "text-sm text-gray-500", children: "Training" }), _jsx("div", { className: "text-2xl font-bold text-warning-500", children: trainingModels.length })] }), _jsxs("div", { className: "glass-premium p-4 rounded-xl", children: [_jsx("div", { className: "text-sm text-gray-500", children: "Errors" }), _jsx("div", { className: "text-2xl font-bold text-error-500", children: errorModels.length })] })] }), _jsxs("div", { className: "glass-premium p-4 rounded-xl mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Model Confidence Distribution" }), _jsx("div", { className: "h-64", children: _jsx(Chart, { type: "bar", data: chartData, options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 1
                                    }
                                }
                            } }) })] }), _jsx(AdvancedMLDashboardPanels, { eventId: eventId, modelId: selectedModelId, modelPerformanceHistory: mockPerformanceHistory })] }));
};
