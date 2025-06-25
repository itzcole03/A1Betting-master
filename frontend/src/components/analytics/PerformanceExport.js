import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Stack, Typography, } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useModelPerformance } from '../../hooks/useModelPerformance';
export const PerformanceExport = ({ modelName, onClose }) => {
    const [format, setFormat] = useState('csv');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const { history } = useModelPerformance(modelName);
    const handleExport = () => {
        const filteredData = history.filter(entry => {
            const timestamp = new Date(entry.timestamp);
            return (!startDate || timestamp >= startDate) && (!endDate || timestamp <= endDate);
        });
        const data = filteredData.map(entry => ({
            timestamp: new Date(entry.timestamp).toISOString(),
            ...entry.metrics,
        }));
        switch (format) {
            case 'csv':
                exportCSV(data);
                break;
            case 'json':
                exportJSON(data);
                break;
            case 'excel':
                exportExcel(data);
                break;
        }
    };
    const exportCSV = (data) => {
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header]).join(',')),
        ].join('\n');
        downloadFile(csvContent, 'performance_data.csv', 'text/csv');
    };
    const exportJSON = (data) => {
        const jsonContent = JSON.stringify(data, null, 2);
        downloadFile(jsonContent, 'performance_data.json', 'application/json');
    };
    const exportExcel = (data) => {
        // For Excel export, we'll use CSV format with .xlsx extension
        // In a real implementation, you would use a library like xlsx
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header]).join(',')),
        ].join('\n');
        downloadFile(csvContent, 'performance_data.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    };
    const downloadFile = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    return (_jsxs(Dialog, { fullWidth: true, open: true, maxWidth: "sm", onClose: onClose, children: [_jsx(DialogTitle, { children: "Export Performance Data" }), _jsx(DialogContent, { children: _jsxs(Stack, { spacing: 3, sx: { mt: 2 }, children: [_jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Format" }), _jsxs(Select, { label: "Format", value: format, onChange: e => setFormat(e.target.value), children: [_jsx(MenuItem, { value: "csv", children: "CSV" }), _jsx(MenuItem, { value: "json", children: "JSON" }), _jsx(MenuItem, { value: "excel", children: "Excel" })] })] }), _jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle2", children: "Date Range" }), _jsxs(Stack, { direction: "row", spacing: 2, children: [_jsx(DatePicker, { label: "Start Date", slotProps: { textField: { fullWidth: true } }, value: startDate, onChange: (date) => setStartDate(date) }), _jsx(DatePicker, { label: "End Date", slotProps: { textField: { fullWidth: true } }, value: endDate, onChange: (date) => setEndDate(date) })] })] }), _jsxs(Typography, { color: "text.secondary", variant: "body2", children: [history.length, " data points available"] })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, children: "Cancel" }), _jsx(Button, { color: "primary", variant: "contained", onClick: handleExport, children: "Export" })] })] }));
};
