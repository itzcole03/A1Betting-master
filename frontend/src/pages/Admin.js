import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import errorHandler from '../utils/errorHandler';
import { ModelSettings } from '../components/admin/ModelSettings';
import { ErrorLogs } from '../components/admin/ErrorLogs';
const Admin = () => {
    const [errorReport, setErrorReport] = useState(null);
    const [selectedSeverity, setSelectedSeverity] = useState('ALL');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [threshold, setThreshold] = useState(50);
    const [selectedModel, setSelectedModel] = useState('default');
    const [autoClearCache, setAutoClearCache] = useState(false);
    const [cacheStatus, setCacheStatus] = useState({
        size: 0,
        lastCleared: null,
    });
    useEffect(() => {
        // Load initial error report
        const report = errorHandler.generateReport();
        setErrorReport(report);
        updateCacheStatus();
    }, []);
    const updateCacheStatus = () => {
        // Simulate cache size calculation
        const size = Math.floor(Math.random() * 1000);
        const lastCleared = localStorage.getItem('cache_last_cleared');
        setCacheStatus({ size, lastCleared });
    };
    const handleDownloadReport = () => {
        errorHandler.downloadReport();
    };
    const handleClearLogs = () => {
        errorHandler.clearLogs();
        const report = errorHandler.generateReport();
        setErrorReport(report);
    };
    const handleClearCache = () => {
        // Simulate cache clearing
        localStorage.setItem('cache_last_cleared', new Date().toISOString());
        updateCacheStatus();
    };
    const handleThresholdChange = (_event, newValue) => {
        setThreshold(newValue);
    };
    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };
    const handleAutoClearChange = (event) => {
        setAutoClearCache(event.target.checked);
    };
    const handleSettingsChange = (settings) => {
        // TODO: Implement settings update logic
        console.log('Settings updated:', settings);
    };
    const filteredErrors = errorReport?.errors?.filter((error) => {
        const severityMatch = selectedSeverity === 'ALL' || error.details?.severity === selectedSeverity;
        const categoryMatch = selectedCategory === 'ALL' || error.details?.category === selectedCategory;
        return severityMatch && categoryMatch;
    }) || [];
    return (_jsx("div", { className: "p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-blue-950", children: _jsxs(GlassCard, { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4", children: "Admin Panel" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8", children: [_jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Model Settings" }), _jsx(ModelSettings, { onSettingsChange: handleSettingsChange })] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Error Logs" }), _jsx(ErrorLogs, {})] })] }), _jsxs("div", { className: "flex flex-wrap gap-4 mb-4", children: [_jsx(GlowButton, { onClick: handleDownloadReport, children: "Download Error Report" }), _jsx(GlowButton, { onClick: handleClearLogs, children: "Clear Logs" }), _jsx(GlowButton, { onClick: handleClearCache, children: "Clear Cache" })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [_jsxs(GlassCard, { className: "flex-1", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Cache Status" }), _jsxs("div", { className: "text-sm text-gray-700 dark:text-gray-300", children: ["Size: ", cacheStatus.size, " MB"] }), _jsxs("div", { className: "text-sm text-gray-700 dark:text-gray-300", children: ["Last Cleared: ", cacheStatus.lastCleared || 'Never'] }), _jsxs("div", { className: "mt-2", children: [_jsx("label", { className: "font-medium mr-2", children: "Auto Clear Cache" }), _jsx("input", { type: "checkbox", checked: autoClearCache, onChange: handleAutoClearChange })] })] }), _jsxs(GlassCard, { className: "flex-1", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Error Filter" }), _jsxs("div", { className: "flex gap-2 mb-2", children: [_jsxs("select", { value: selectedSeverity, onChange: e => setSelectedSeverity(e.target.value), className: "modern-input", children: [_jsx("option", { value: "ALL", children: "All Severities" }), _jsx("option", { value: "LOW", children: "Low" }), _jsx("option", { value: "MEDIUM", children: "Medium" }), _jsx("option", { value: "HIGH", children: "High" })] }), _jsxs("select", { value: selectedCategory, onChange: e => setSelectedCategory(e.target.value), className: "modern-input", children: [_jsx("option", { value: "ALL", children: "All Categories" }), _jsx("option", { value: "SYSTEM", children: "System" }), _jsx("option", { value: "MODEL", children: "Model" }), _jsx("option", { value: "USER", children: "User" })] })] }), _jsx("div", { className: "max-h-40 overflow-y-auto", children: filteredErrors.length === 0 ? (_jsx("div", { className: "text-gray-500", children: "No errors found." })) : (filteredErrors.map((err, idx) => (_jsxs("div", { className: "p-2 border-b border-gray-200 dark:border-gray-700", children: [_jsx("div", { className: "font-semibold text-red-600 dark:text-red-400", children: err.details?.message }), _jsxs("div", { className: "text-xs text-gray-500", children: [err.details?.category, " | ", err.details?.severity] })] }, idx)))) })] })] })] }) }));
};
export default Admin;
