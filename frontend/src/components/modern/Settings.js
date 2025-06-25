import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Switch, FormControlLabel, Button, List, ListItem, ListItemText, Divider, useTheme, } from '@mui/material';
import { DataIntegrationHub } from '../../core/DataIntegrationHub';
import { useAppState } from './StateProvider';
import { useThemeStore } from '@/stores/themeStore';
const Settings = () => {
    const { props, entries } = useAppState();
    const theme = useTheme();
    const { mode, toggleTheme } = useThemeStore();
    const [lastSync, setLastSync] = useState(new Date());
    const [liveUpdates, setLiveUpdates] = useState(true);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
    const [dataSharing, setDataSharing] = useState(false);
    const [compactView, setCompactView] = useState(false);
    const handleExport = (type) => {
        const data = { props, entries };
        const blob = new Blob([type === 'json' ? JSON.stringify(data, null, 2) : toCSV(data)], {
            type: type === 'json' ? 'application/json' : 'text/csv',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `betting-data.${type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    function toCSV(data) {
        // Simple CSV export for demo
        const propRows = data.props.map((p) => `${p.id},${p.player},${p.team},${p.stat},${p.line},${p.type},${p.percentage}`);
        const entryRows = data.entries.map((e) => `${e.id},${e.date},${e.legs},${e.entry},${e.potentialPayout},${e.status}`);
        return `Props\nID,Player,Team,Stat,Line,Type,Percentage\n${propRows.join('\n')}\n\nEntries\nID,Date,Legs,Entry,PotentialPayout,Status\n${entryRows.join('\n')}`;
    }
    // Data source health
    const hub = DataIntegrationHub.getInstance();
    const metrics = Array.from(hub.getSourceMetrics().entries());
    return (_jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 3 }, children: [_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { sx: { mb: 3 }, variant: "h6", children: "Appearance" }), _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(FormControlLabel, { control: _jsx(Switch, { checked: mode === 'dark', onChange: toggleTheme }), label: "Dark Mode" }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: compactView, onChange: e => setCompactView(e.target.checked) }), label: "Compact View" })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { sx: { mb: 3 }, variant: "h6", children: "Notifications" }), _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(FormControlLabel, { control: _jsx(Switch, { checked: liveUpdates, onChange: e => setLiveUpdates(e.target.checked) }), label: "Live Updates" }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: true }), label: "Arbitrage Alerts" }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: true }), label: "High Confidence Picks" })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { sx: { mb: 3 }, variant: "h6", children: "Data & Privacy" }), _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(Button, { fullWidth: true, variant: "outlined", onClick: () => handleExport('csv'), children: "Export Betting Data (CSV)" }), _jsx(Button, { fullWidth: true, variant: "outlined", onClick: () => handleExport('json'), children: "Export Betting Data (JSON)" }), _jsx(Button, { fullWidth: true, color: "error", variant: "outlined", children: "Clear All Data" })] }), _jsxs(Box, { sx: { mt: 4 }, children: [_jsx(Typography, { sx: { mb: 2 }, variant: "subtitle1", children: "Data Source Health" }), _jsx(List, { children: metrics.map(([id, m]) => (_jsx(ListItem, { children: _jsx(ListItemText, { primary: id, secondary: `Latency ${m.latency.toFixed(0)}ms, Reliability ${(m.reliability * 100).toFixed(1)}%, Last Sync ${new Date(m.lastSync).toLocaleTimeString()}` }) }, id))) }), _jsxs(Typography, { color: "text.secondary", variant: "caption", children: ["Last Sync: ", lastSync.toLocaleTimeString()] })] }), _jsx(Divider, { sx: { my: 3 } }), _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(FormControlLabel, { control: _jsx(Switch, { checked: analyticsEnabled, onChange: e => setAnalyticsEnabled(e.target.checked) }), label: "Enable Analytics" }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: dataSharing, onChange: e => setDataSharing(e.target.checked) }), label: "Allow Data Sharing" })] })] }) })] }));
};
export default React.memo(Settings);
