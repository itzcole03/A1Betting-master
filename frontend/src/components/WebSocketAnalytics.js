import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import SafeChart from './ui/SafeChart';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export const WebSocketAnalytics = ({ webSocketService }) => {
    const [metrics, setMetrics] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState('latency');
    useEffect(() => {
        const updateMetrics = () => {
            const connections = webSocketService.getConnections();
            const currentMetrics = connections.map((conn) => conn.metrics);
            setMetrics(currentMetrics);
        };
        const interval = setInterval(updateMetrics, 1000);
        return () => clearInterval(interval);
    }, [webSocketService]);
    const chartData = {
        labels: metrics.map((_, index) => `Time ${index}`),
        datasets: [
            {
                label: 'Latency (ms)',
                data: metrics.map(m => m.latency),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: 'Message Size (bytes)',
                data: metrics.map(m => m.messageSize),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
            },
            {
                label: 'Compression Ratio',
                data: metrics.map(m => m.compressionRatio),
                borderColor: 'rgb(54, 162, 235)',
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
                text: 'WebSocket Performance Metrics',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    return (_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "WebSocket Analytics" }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mb-4", children: [_jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "font-semibold", children: "Total Connections" }), _jsx("p", { className: "text-2xl", children: metrics.length })] }), _jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "font-semibold", children: "Average Latency" }), _jsxs("p", { className: "text-2xl", children: [metrics.length > 0
                                        ? Math.round(metrics.reduce((acc, m) => acc + m.latency, 0) / metrics.length)
                                        : 0, ' ', "ms"] })] }), _jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsx("h3", { className: "font-semibold", children: "Message Rate" }), _jsxs("p", { className: "text-2xl", children: [metrics.length > 0
                                        ? Math.round(metrics.reduce((acc, m) => acc + m.messageCount, 0) / metrics.length)
                                        : 0, ' ', "/s"] })] })] }), _jsx("div", { className: "bg-white p-4 rounded shadow", children: _jsx(SafeChart, { type: "line", data: chartData, options: chartOptions, loadingMessage: "Loading WebSocket metrics..." }) }),
                                        : 0, ' ', "/s"] })] })] }), _jsx("div", { className: "bg-white p-4 rounded shadow", children: _jsx(Line, { data: chartData, options: chartOptions }) }), _jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Connection Status" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: metrics.map((metric, index) => (_jsxs("div", { className: "bg-white p-4 rounded shadow", children: [_jsxs("h4", { className: "font-semibold", children: ["Connection ", index + 1] }), _jsxs("p", { children: ["Status: ", metric.isConnected ? 'Connected' : 'Disconnected'] }), _jsxs("p", { children: ["Messages: ", metric.messageCount] }), _jsxs("p", { children: ["Errors: ", metric.errorCount] }), _jsxs("p", { children: ["Last Error: ", metric.lastError || 'None'] })] }, index))) })] })] }));
};