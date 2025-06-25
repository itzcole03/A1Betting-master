import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { webSocketBatching } from '../services/WebSocketBatching';
import { EventBus } from '../unified/EventBus';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export const WebSocketBatchingAnalytics = () => {
    const [metrics, setMetrics] = useState({
        totalBatches: 0,
        totalMessages: 0,
        averageBatchSize: 0,
        compressionRatio: 1,
        lastBatchTime: 0,
    });
    const [batchSizes, setBatchSizes] = useState([]);
    const [compressionRatios, setCompressionRatios] = useState([]);
    const [timestamps, setTimestamps] = useState([]);
    useEffect(() => {
        const updateMetrics = () => {
            const currentMetrics = webSocketBatching.getMetrics();
            setMetrics(currentMetrics);
        };
        const interval = setInterval(updateMetrics, 1000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const handleBatchSent = (event) => {
            setBatchSizes(prev => [...prev.slice(-20), event.batchSize]);
            setCompressionRatios(prev => [...prev.slice(-20), event.compressionRatio]);
            setTimestamps(prev => [...prev.slice(-20), event.timestamp]);
        };
        const eventBus = EventBus.getInstance();
        eventBus.subscribe('websocket:batch:sent', handleBatchSent);
        return () => {
            eventBus.unsubscribe('websocket:batch:sent', handleBatchSent);
        };
    }, []);
    const chartData = {
        labels: timestamps.map(t => new Date(t).toLocaleTimeString()),
        datasets: [
            {
                label: 'Batch Size',
                data: batchSizes,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: 'Compression Ratio',
                data: compressionRatios,
                borderColor: 'rgb(255, 99, 132)',
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
                text: 'WebSocket Batching Metrics',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    return (_jsxs("div", { className: "p-4 bg-white rounded-lg shadow", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "WebSocket Batching Analytics" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Total Metrics" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: ["Total Batches: ", metrics.totalBatches] }), _jsxs("p", { children: ["Total Messages: ", metrics.totalMessages] }), _jsxs("p", { children: ["Average Batch Size: ", metrics.averageBatchSize.toFixed(2)] })] })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Performance Metrics" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: ["Compression Ratio: ", metrics.compressionRatio.toFixed(2), "x"] }), _jsxs("p", { children: ["Last Batch Time: ", new Date(metrics.lastBatchTime).toLocaleTimeString()] })] })] })] }), _jsx("div", { className: "h-64", children: _jsx(Line, { data: chartData, options: chartOptions }) })] }));
};
