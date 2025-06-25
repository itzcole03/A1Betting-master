import { jsxs as _jsxs, Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useWebSocketStore } from '../services/websocket';
import { Box, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn } from '../utils/animations';
const StatusContainer = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.snackbar,
    animation: `${fadeIn} 0.3s ease-in-out`,
}));
export const ConnectionStatus = () => {
    const { isConnected, isReconnecting, lastError, resetError } = useWebSocketStore();
    const [serviceStatus, setServiceStatus] = React.useState({});
    React.useEffect(() => {
        const updateStatus = () => {
            setServiceStatus(window.appStatus ? { ...window.appStatus } : {});
        };
        updateStatus();
        const interval = setInterval(updateStatus, 2000);
        return () => clearInterval(interval);
    }, []);
    const renderStatus = (service, label) => {
        const status = serviceStatus[service];
        if (!status)
            return null;
        let color = 'success';
        if (!status.connected)
            color = status.quality < 0.5 ? 'error' : 'warning';
        return (_jsxs(Box, { display: "flex", alignItems: "center", gap: 1, mb: 0.5, children: [_jsxs(Typography, { variant: "body2", color: color, fontWeight: 600, children: [label, ":"] }), _jsxs(Typography, { variant: "body2", color: color, children: [status.connected ? 'Online' : 'Offline', typeof status.quality === 'number' && (_jsxs(_Fragment, { children: [" (Q: ", Math.round(status.quality * 100), "%)"] }))] }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: status.timestamp ? `Updated ${Math.floor((Date.now() - status.timestamp) / 1000)}s ago` : '' })] }, service));
    };
    return (_jsxs(_Fragment, { children: [_jsxs(StatusContainer, { children: [renderStatus('weather', 'Weather'), renderStatus('injuries', 'Injuries'), renderStatus('realtime', 'Real-Time'), isReconnecting && (_jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsx(CircularProgress, { size: 20 }), _jsx(Typography, { color: "textSecondary", variant: "body2", children: "Reconnecting..." })] })), !isConnected && !isReconnecting && (_jsx(Typography, { color: "error", variant: "body2", children: "Disconnected" }))] }), _jsx(Snackbar, { anchorOrigin: { vertical: 'bottom', horizontal: 'center' }, autoHideDuration: 6000, open: !!lastError, onClose: resetError, children: _jsx(Alert, { severity: "error", sx: { width: '100%' }, onClose: resetError, children: lastError }) })] }));
};
