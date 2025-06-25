import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { performanceService } from '../../services/performanceService';
import { toast } from 'react-toastify';
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const PerformanceDashboard = () => {
    const [metrics, setMetrics] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState('response_time');
    const [timeRange, setTimeRange] = useState('1h');
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch performance metrics
                const metricsData = await performanceService.getMetrics(selectedMetric);
                setMetrics(metricsData);
                // Fetch alerts
                const response = await fetch('/api/monitoring/performance/alerts');
                const alertsData = await response.json();
                setAlerts(alertsData);
                // Show toast for new critical alerts
                alertsData
                    .filter((alert) => alert.severity === 'critical')
                    .forEach((alert) => {
                    toast.error(`Critical alert: ${alert.metric_name} exceeded threshold (${alert.current_value} > ${alert.threshold})`);
                });
            }
            catch (error) {
                console.error('Error fetching performance data:', error);
                toast.error('Failed to fetch performance data');
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [selectedMetric, timeRange]);
    const chartData = {
        labels: metrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: selectedMetric,
                data: metrics.map(m => m.value),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${selectedMetric} over time`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    return (_jsx("div", { className: "p-6", children: _jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Performance Monitoring" }), _jsxs("div", { className: "flex gap-4 mb-6", children: [_jsxs("select", { className: "p-2 border rounded", value: selectedMetric, onChange: e => setSelectedMetric(e.target.value), children: [_jsx("option", { value: "response_time", children: "Response Time" }), _jsx("option", { value: "error_rate", children: "Error Rate" }), _jsx("option", { value: "cpu_usage", children: "CPU Usage" }), _jsx("option", { value: "memory_usage", children: "Memory Usage" })] }), _jsxs("select", { className: "p-2 border rounded", value: timeRange, onChange: e => setTimeRange(e.target.value), children: [_jsx("option", { value: "1h", children: "Last Hour" }), _jsx("option", { value: "6h", children: "Last 6 Hours" }), _jsx("option", { value: "24h", children: "Last 24 Hours" }), _jsx("option", { value: "7d", children: "Last 7 Days" })] })] }), _jsx("div", { className: "bg-white p-4 rounded-lg shadow mb-6", children: _jsx(Line, { data: chartData, options: chartOptions }) }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Active Alerts" }), alerts.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No active alerts" })) : (_jsx("div", { className: "space-y-4", children: alerts.map((alert, index) => (_jsxs("div", { className: `p-4 rounded ${alert.severity === 'critical'
                                    ? 'bg-red-100 border-red-500'
                                    : 'bg-yellow-100 border-yellow-500'} border`, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: alert.metric_name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Current: ", alert.current_value.toFixed(2), " | Threshold:", ' ', alert.threshold.toFixed(2)] })] }), _jsx("span", { className: `px-2 py-1 rounded text-sm ${alert.severity === 'critical'
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-yellow-500 text-white'}`, children: alert.severity })] }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: new Date(alert.timestamp).toLocaleString() })] }, index))) }))] })] }) }));
};
export default React.memo(PerformanceDashboard);
