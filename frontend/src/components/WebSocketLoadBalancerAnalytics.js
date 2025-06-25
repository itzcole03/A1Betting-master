import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { webSocketLoadBalancer } from '../services/WebSocketLoadBalancer';
import { EventBus } from '../unified/EventBus';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export const WebSocketLoadBalancerAnalytics = () => {
    const [metrics, setMetrics] = useState({
        totalConnections: 0,
        activeServers: 0,
        serverMetrics: new Map(),
        lastHealthCheck: 0,
    });
    const [serverLatencies, setServerLatencies] = useState(new Map());
    const [serverErrorRates, setServerErrorRates] = useState(new Map());
    const [timestamps, setTimestamps] = useState([]);
    useEffect(() => {
        const updateMetrics = () => {
            const currentMetrics = webSocketLoadBalancer.getMetrics();
            setMetrics(currentMetrics);
        };
        const interval = setInterval(updateMetrics, 1000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const handleServerHealth = (event) => {
            const { server, metrics, timestamp } = event;
            setServerLatencies(prev => {
                const latencies = prev.get(server) || [];
                return new Map(prev).set(server, [...latencies.slice(-20), metrics.latency]);
            });
            setServerErrorRates(prev => {
                const rates = prev.get(server) || [];
                return new Map(prev).set(server, [...rates.slice(-20), metrics.errorRate]);
            });
            setTimestamps(prev => [...prev.slice(-20), timestamp]);
        };
        const eventBus = EventBus.getInstance();
        eventBus.subscribe('websocket:server:health', handleServerHealth);
        return () => {
            eventBus.unsubscribe('websocket:server:health', handleServerHealth);
        };
    }, []);
    const chartData = {
        labels: timestamps.map(t => new Date(t).toLocaleTimeString()),
        datasets: Array.from(metrics.serverMetrics.entries()).map(([server, _]) => ({
            label: `Server ${server} Latency`,
            data: serverLatencies.get(server) || [],
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            tension: 0.1,
        })),
    };
    const errorRateData = {
        labels: timestamps.map(t => new Date(t).toLocaleTimeString()),
        datasets: Array.from(metrics.serverMetrics.entries()).map(([server, _]) => ({
            label: `Server ${server} Error Rate`,
            data: serverErrorRates.get(server) || [],
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            tension: 0.1,
        })),
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Server Latency',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    const errorRateOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            title: {
                display: true,
                text: 'Server Error Rates',
            },
        },
    };
    return (_jsxs("div", { className: "p-4 bg-white rounded-lg shadow", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "WebSocket Load Balancer Analytics" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Overall Metrics" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: ["Total Connections: ", metrics.totalConnections] }), _jsxs("p", { children: ["Active Servers: ", metrics.activeServers] }), _jsxs("p", { children: ["Last Health Check: ", new Date(metrics.lastHealthCheck).toLocaleTimeString()] })] })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Server Status" }), _jsx("div", { className: "space-y-2", children: Array.from(metrics.serverMetrics.entries()).map(([server, metrics]) => (_jsxs("div", { className: "border-b pb-2", children: [_jsxs("p", { className: "font-medium", children: ["Server ", server] }), _jsxs("p", { children: ["Connections: ", metrics.connections] }), _jsxs("p", { children: ["Latency: ", metrics.latency, "ms"] }), _jsxs("p", { children: ["Error Rate: ", (metrics.errorRate * 100).toFixed(2), "%"] })] }, server))) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "h-64", children: _jsx(Line, { data: chartData, options: chartOptions }) }), _jsx("div", { className: "h-64", children: _jsx(Line, { data: errorRateData, options: errorRateOptions }) })] })] }));
};
