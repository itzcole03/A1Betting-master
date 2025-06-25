import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Alert, AlertTitle, IconButton, Chip, Stack, Select, MenuItem, FormControl, InputLabel, } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PerformanceMonitor } from '../../core/analytics/PerformanceMonitor';
import { useLogger } from '../../hooks/useLogger';
import { useMetrics } from '../../hooks/useMetrics';
export const PerformanceAlerts = ({ modelName, onAlertClick, }) => {
    const [alerts, setAlerts] = useState([]);
    const [severity, setSeverity] = useState('all');
    const [timeframe, setTimeframe] = useState('day');
    const logger = useLogger();
    const metrics = useMetrics();
    useEffect(() => {
        const fetchAlerts = () => {
            const monitor = PerformanceMonitor.getInstance(logger, metrics);
            const startTime = getStartTime(timeframe);
            const filteredAlerts = monitor.getAlerts(modelName, severity === 'all' ? undefined : severity, startTime);
            setAlerts(filteredAlerts);
        };
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [modelName, severity, timeframe, logger, metrics]);
    const getStartTime = (timeframe) => {
        if (timeframe === 'all')
            return undefined;
        const now = new Date();
        switch (timeframe) {
            case 'day':
                return new Date(now.setDate(now.getDate() - 1));
            case 'week':
                return new Date(now.setDate(now.getDate() - 7));
            case 'month':
                return new Date(now.setMonth(now.getMonth() - 1));
            default:
                return undefined;
        }
    };
    const handleClearAlerts = () => {
        const monitor = PerformanceMonitor.getInstance(logger, metrics);
        monitor.clearAlerts(modelName);
        setAlerts([]);
    };
    const formatMetricValue = (metric, value) => {
        if (metric === 'roi' || metric === 'winRate' || metric === 'maxDrawdown') {
            return `${(value * 100).toFixed(1)}%`;
        }
        return value.toFixed(2);
    };
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", mb: 2, children: [_jsx(Typography, { variant: "h6", children: "Performance Alerts" }), _jsxs(Stack, { direction: "row", spacing: 2, children: [_jsxs(FormControl, { size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { children: "Severity" }), _jsxs(Select, { label: "Severity", value: severity, onChange: e => setSeverity(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All" }), _jsx(MenuItem, { value: "warning", children: "Warning" }), _jsx(MenuItem, { value: "critical", children: "Critical" })] })] }), _jsxs(FormControl, { size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { children: "Timeframe" }), _jsxs(Select, { label: "Timeframe", value: timeframe, onChange: e => setTimeframe(e.target.value), children: [_jsx(MenuItem, { value: "day", children: "Last 24 Hours" }), _jsx(MenuItem, { value: "week", children: "Last Week" }), _jsx(MenuItem, { value: "month", children: "Last Month" }), _jsx(MenuItem, { value: "all", children: "All Time" })] })] }), _jsx(IconButton, { size: "small", onClick: handleClearAlerts, children: _jsx(CloseIcon, {}) })] })] }), _jsx(Stack, { spacing: 2, children: alerts.length === 0 ? (_jsx(Alert, { severity: "info", children: "No alerts in the selected timeframe." })) : (alerts.map((alert, index) => (_jsxs(Alert, { severity: alert.severity, sx: { cursor: onAlertClick ? 'pointer' : 'default' }, onClick: () => onAlertClick?.(alert), children: [_jsxs(AlertTitle, { children: [alert.modelName, " - ", alert.metric] }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsxs(Typography, { children: ["Current value: ", formatMetricValue(alert.metric, alert.value)] }), _jsx(Chip, { color: alert.severity === 'critical' ? 'error' : 'warning', label: `Threshold: ${formatMetricValue(alert.metric, alert.threshold)}`, size: "small" }), _jsx(Typography, { color: "text.secondary", variant: "caption", children: new Date(alert.timestamp).toLocaleString() })] })] }, index)))) })] }) }));
};
