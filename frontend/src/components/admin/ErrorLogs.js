import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Box, Select, MenuItem, FormControl, InputLabel, } from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { errorLogger } from '../../utils/errorLogger';
export const ErrorLogs = () => {
    const [logs, setLogs] = useState([]);
    const [severityFilter, setSeverityFilter] = useState('all');
    const fetchLogs = () => {
        const allLogs = errorLogger.getLogs();
        setLogs(allLogs);
    };
    useEffect(() => {
        fetchLogs();
        // Refresh logs every 30 seconds
        const interval = setInterval(fetchLogs, 30000);
        return () => clearInterval(interval);
    }, []);
    const handleClearLogs = () => {
        errorLogger.clearLogs();
        setLogs([]);
    };
    const handleSeverityChange = (event) => {
        const severity = event.target.value;
        setSeverityFilter(severity);
    };
    const filteredLogs = severityFilter === 'all' ? logs : logs.filter(log => log.severity === severityFilter);
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            default:
                return 'default';
        }
    };
    return (_jsxs(Paper, { sx: { p: 3, mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [_jsx(Typography, { variant: "h6", children: "Error Logs" }), _jsxs(Box, { sx: { display: 'flex', gap: 2 }, children: [_jsxs(FormControl, { sx: { minWidth: 120 }, children: [_jsx(InputLabel, { children: "Severity" }), _jsxs(Select, { label: "Severity", size: "small", value: severityFilter, onChange: handleSeverityChange, children: [_jsx(MenuItem, { value: "all", children: "All" }), _jsx(MenuItem, { value: "error", children: "Error" }), _jsx(MenuItem, { value: "warning", children: "Warning" }), _jsx(MenuItem, { value: "info", children: "Info" })] })] }), _jsx(IconButton, { color: "primary", onClick: fetchLogs, children: _jsx(RefreshIcon, {}) }), _jsx(IconButton, { color: "error", onClick: handleClearLogs, children: _jsx(DeleteIcon, {}) })] })] }), _jsx(TableContainer, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Timestamp" }), _jsx(TableCell, { children: "Severity" }), _jsx(TableCell, { children: "Message" }), _jsx(TableCell, { children: "Context" })] }) }), _jsxs(TableBody, { children: [filteredLogs.map((log, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: new Date(log.timestamp).toLocaleString() }), _jsx(TableCell, { children: _jsx(Chip, { color: getSeverityColor(log.severity), label: log.severity, size: "small" }) }), _jsx(TableCell, { children: log.message }), _jsx(TableCell, { children: log.context ? (_jsx("pre", { style: { margin: 0, whiteSpace: 'pre-wrap' }, children: JSON.stringify(log.context, null, 2) })) : ('-') })] }, index))), filteredLogs.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { align: "center", colSpan: 4, children: "No logs found" }) }))] })] }) })] }));
};
