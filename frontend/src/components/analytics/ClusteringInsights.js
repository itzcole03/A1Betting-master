import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, } from 'recharts';
const ClusteringInsights = ({ clusters, embedding, metrics, clusterStats, }) => {
    // Calculate cluster colors
    const clusterColors = [
        '#3B82F6', // Blue
        '#EF4444', // Red
        '#10B981', // Green
        '#F59E0B', // Yellow
        '#6366F1', // Indigo
        '#EC4899', // Pink
        '#8B5CF6', // Purple
        '#14B8A6', // Teal
        '#F97316', // Orange
        '#06B6D4', // Cyan
    ];
    // Prepare data for visualization
    const embeddingData = embedding?.map((point, index) => ({
        x: point[0],
        y: point[1],
        cluster: clusters[index],
    }));
    const clusterSizeData = clusterStats.size.map((size, index) => ({
        cluster: `Cluster ${index + 1}`,
        size,
    }));
    const clusterDensityData = clusterStats.density.map((density, index) => ({
        cluster: `Cluster ${index + 1}`,
        density,
    }));
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("section", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Clustering Metrics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "Silhouette Score" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: metrics.silhouetteScore.toFixed(4) }), _jsx("p", { className: "text-sm text-gray-500", children: "Measures how similar points are to their own cluster compared to other clusters" })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "Davies-Bouldin Score" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: metrics.daviesBouldinScore.toFixed(4) }), _jsx("p", { className: "text-sm text-gray-500", children: "Evaluates intra-cluster similarity and inter-cluster differences" })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: "Calinski-Harabasz Score" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: metrics.calinskiHarabaszScore.toFixed(4) }), _jsx("p", { className: "text-sm text-gray-500", children: "Ratio of between-cluster variance to within-cluster variance" })] })] })] }), _jsxs("section", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Cluster Visualization" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "2D Embedding" }), embedding && (_jsx(ResponsiveContainer, { height: 300, width: "100%", children: _jsxs(ScatterChart, { children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "x", domain: ['auto', 'auto'], name: "Component 1", type: "number" }), _jsx(YAxis, { dataKey: "y", domain: ['auto', 'auto'], name: "Component 2", type: "number" }), _jsx(Tooltip, { cursor: { strokeDasharray: '3 3' } }), _jsx(Legend, {}), Array.from(new Set(clusters)).map((cluster, index) => (_jsx(Scatter, { data: embeddingData?.filter(point => point.cluster === cluster), fill: clusterColors[index % clusterColors.length], name: `Cluster ${cluster}` }, cluster)))] }) }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Cluster Sizes" }), _jsx(ResponsiveContainer, { height: 300, width: "100%", children: _jsxs(BarChart, { data: clusterSizeData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "cluster" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "size", fill: "#3B82F6" })] }) })] })] })] }), _jsxs("section", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Cluster Statistics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Cluster Density" }), _jsx(ResponsiveContainer, { height: 300, width: "100%", children: _jsxs(BarChart, { data: clusterDensityData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "cluster" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "density", fill: "#3B82F6" })] }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Cluster Variance" }), _jsx("div", { className: "space-y-2", children: clusterStats.variance.map((variance, index) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-gray-50 rounded", children: [_jsxs("span", { className: "text-gray-600", children: ["Cluster ", index + 1] }), _jsx("span", { className: "font-mono", children: variance.toFixed(4) })] }, index))) })] })] })] }), _jsxs("section", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Cluster Details" }), _jsx("div", { className: "space-y-4", children: clusterStats.centroid.map((centroid, index) => (_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsxs("h3", { className: "text-lg font-semibold mb-2", children: ["Cluster ", index + 1] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-500", children: "Size" }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: clusterStats.size[index] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-500", children: "Density" }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: clusterStats.density[index].toFixed(4) })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("h4", { className: "text-sm font-medium text-gray-500", children: "Centroid" }), _jsxs("p", { className: "font-mono text-sm", children: ["[", centroid.map(c => c.toFixed(4)).join(', '), "]"] })] })] })] }, index))) })] })] }));
};
export default React.memo(ClusteringInsights);
