import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/styles';
import { realTimeUpdates } from '@/services/realTimeUpdates';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useErrorBoundary } from '@/hooks/useErrorBoundary';
const UpdatesCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
}));
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { "aria-labelledby": `updates-tab-${index}`, hidden: value !== index, id: `updates-tabpanel-${index}`, role: "tabpanel", ...other, children: value === index && _jsx(Box, { sx: { p: 3 }, children: children }) }));
};
export const RealTimeUpdates = ({ sport }) => {
    const [value, setValue] = useState(0);
    const [expanded, setExpanded] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updates, setUpdates] = useState({
        odds: [],
        injuries: [],
        lineMovements: [],
        news: [],
        predictions: [],
    });
    const { sendMessage, isConnected } = useWebSocket(process.env.VITE_WS_URL || 'ws://localhost:3000', {
        onMessage: data => {
            if (data.type === 'prediction:update') {
                setUpdates(prev => ({
                    ...prev,
                    predictions: [data.payload, ...prev.predictions].slice(0, 10),
                }));
            }
            else if (data.type === 'odds:update') {
                setUpdates(prev => ({
                    ...prev,
                    odds: [data.payload, ...prev.odds].slice(0, 10),
                }));
            }
            else if (data.type === 'model:metrics') {
                console.log('Model metrics:', data.payload);
            }
        },
    });
    const { showBoundary } = useErrorBoundary();
    const handleError = useCallback((error) => {
        setError(error.message);
        showBoundary(error);
    }, [showBoundary]);
    const loadUpdates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const sportUpdates = await realTimeUpdates.getSportUpdates(sport);
            setUpdates(prev => ({
                ...prev,
                ...sportUpdates,
            }));
        }
        catch (error) {
            handleError(error);
        }
        finally {
            setLoading(false);
        }
    }, [sport, handleError]);
    useEffect(() => {
        loadUpdates();
    }, [loadUpdates]);
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    };
    const handleRefresh = () => {
        loadUpdates();
    };
    if (!isConnected) {
        return (_jsx(UpdatesCard, { children: _jsx(CardContent, { children: _jsx(Alert, { severity: "warning", children: "WebSocket connection lost. Attempting to reconnect..." }) }) }));
    }
    return (_jsx(UpdatesCard, { children: _jsxs(CardContent, { children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", mb: 2, children: [_jsx(Typography, { variant: "h6", children: "Real-Time Updates" }), _jsxs(Box, { children: [_jsx(IconButton, { disabled: loading, onClick: handleRefresh, children: _jsx(RefreshIcon, {}) }), _jsx(IconButton, { onClick: () => setExpanded(!expanded), children: expanded ? _jsx(ExpandLessIcon, {}) : _jsx(ExpandMoreIcon, {}) })] })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs(Collapse, { in: expanded, children: [_jsxs(Tabs, { sx: { borderBottom: 1, borderColor: 'divider' }, value: value, variant: "fullWidth", onChange: handleTabChange, children: [_jsx(Tab, { label: "Odds" }), _jsx(Tab, { label: "Injuries" }), _jsx(Tab, { label: "Line Movements" }), _jsx(Tab, { label: "News" }), _jsx(Tab, { label: "Predictions" })] }), loading ? (_jsx(Box, { display: "flex", justifyContent: "center", p: 3, children: _jsx(CircularProgress, {}) })) : (_jsxs(_Fragment, { children: [_jsx(TabPanel, { index: 0, value: value, children: _jsx(List, { children: updates.odds.map((odds, index) => (_jsxs(React.Fragment, { children: [_jsxs(ListItem, { children: [_jsx(ListItemIcon, { children: odds.movement.direction === 'up' ? (_jsx(TrendingUpIcon, { color: "success" })) : odds.movement.direction === 'down' ? (_jsx(TrendingDownIcon, { color: "error" })) : (_jsx(InfoIcon, { color: "action" })) }), _jsx(ListItemText, { primary: `${odds.value} (${odds.movement.direction})`, secondary: `Updated ${formatTimestamp(odds.timestamp)}` }), _jsxs(Box, { display: "flex", gap: 1, children: [_jsx(Chip, { color: "success", label: `O ${odds.overMultiplier}x`, size: "small" }), _jsx(Chip, { color: "error", label: `U ${odds.underMultiplier}x`, size: "small" })] })] }), index < updates.odds.length - 1 && _jsx(Divider, {})] }, odds.propId))) }) }), _jsx(TabPanel, { index: 1, value: value, children: _jsx(List, { children: updates.injuries.map((injury, index) => (_jsxs(React.Fragment, { children: [_jsxs(ListItem, { children: [_jsx(ListItemIcon, { children: _jsx(LocalHospitalIcon, { color: injury.status === 'out'
                                                                    ? 'error'
                                                                    : injury.status === 'questionable'
                                                                        ? 'warning'
                                                                        : 'success' }) }), _jsx(ListItemText, { primary: `${injury.playerName} (${injury.team})`, secondary: _jsxs(_Fragment, { children: [_jsx(Typography, { color: "textPrimary", component: "span", variant: "body2", children: injury.status.toUpperCase() }), ` - ${injury.injury}`, injury.expectedReturn && (_jsx(Typography, { color: "textSecondary", component: "span", variant: "body2", children: ` - Expected return: ${injury.expectedReturn}` }))] }) })] }), index < updates.injuries.length - 1 && _jsx(Divider, {})] }, injury.playerId))) }) }), _jsx(TabPanel, { index: 2, value: value, children: _jsx(List, { children: updates.lineMovements.map((movement, index) => (_jsxs(React.Fragment, { children: [_jsxs(ListItem, { children: [_jsx(ListItemIcon, { children: movement.direction === 'up' ? (_jsx(TrendingUpIcon, { color: "success" })) : (_jsx(TrendingDownIcon, { color: "error" })) }), _jsx(ListItemText, { primary: `${movement.oldValue} → ${movement.newValue}`, secondary: `Updated ${formatTimestamp(movement.timestamp)}` }), _jsx(Chip, { color: movement.confidence >= 80 ? 'success' : 'warning', label: `${movement.confidence}% confidence`, size: "small" })] }), index < updates.lineMovements.length - 1 && _jsx(Divider, {})] }, `${movement.propId}_${movement.timestamp}`))) }) }), _jsx(TabPanel, { index: 3, value: value, children: _jsx(List, { children: updates.news.map((news, index) => (_jsxs(React.Fragment, { children: [_jsxs(ListItem, { children: [_jsx(ListItemIcon, { children: _jsx(NotificationsIcon, { color: news.impact === 'high'
                                                                    ? 'error'
                                                                    : news.impact === 'medium'
                                                                        ? 'warning'
                                                                        : 'info' }) }), _jsx(ListItemText, { primary: news.title, secondary: _jsxs(_Fragment, { children: [_jsx(Typography, { color: "textPrimary", component: "span", variant: "body2", children: news.type.toUpperCase() }), ` - ${news.content}`, _jsx(Typography, { color: "textSecondary", component: "span", variant: "body2", children: ` - ${formatTimestamp(news.timestamp)}` })] }) })] }), index < updates.news.length - 1 && _jsx(Divider, {})] }, news.id))) }) }), _jsx(TabPanel, { index: 4, value: value, children: _jsx(List, { children: updates.predictions.map((prediction, index) => (_jsxs(React.Fragment, { children: [_jsxs(ListItem, { children: [_jsx(ListItemIcon, { children: _jsx(Tooltip, { title: `Confidence: ${(prediction.confidence * 100).toFixed(1)}%`, children: _jsx(Box, { children: prediction.confidence > 0.8 ? (_jsx(TrendingUpIcon, { color: "success" })) : prediction.confidence > 0.6 ? (_jsx(InfoIcon, { color: "info" })) : (_jsx(WarningIcon, { color: "warning" })) }) }) }), _jsx(ListItemText, { primary: `${prediction.event} - ${prediction.market}`, secondary: _jsxs(_Fragment, { children: [_jsxs(Typography, { color: "textPrimary", component: "span", variant: "body2", children: ["Prediction: ", prediction.prediction] }), _jsx("br", {}), _jsxs(Typography, { color: "textSecondary", component: "span", variant: "body2", children: ["Updated ", formatTimestamp(prediction.timestamp)] })] }) }), _jsx(Box, { display: "flex", gap: 1, children: _jsx(Chip, { color: prediction.confidence > 0.8
                                                                    ? 'success'
                                                                    : prediction.confidence > 0.6
                                                                        ? 'info'
                                                                        : 'warning', label: `Confidence: ${(prediction.confidence * 100).toFixed(1)}%`, size: "small" }) })] }), index < updates.predictions.length - 1 && _jsx(Divider, {})] }, prediction.id))) }) })] }))] })] }) }));
};
