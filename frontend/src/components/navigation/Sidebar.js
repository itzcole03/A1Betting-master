import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider, Box, } from '@mui/material';
import { Dashboard as DashboardIcon, SportsSoccer as SportsIcon, Analytics as AnalyticsIcon, Settings as SettingsIcon, } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
const menuItems = [
    { text: 'Dashboard', icon: _jsx(DashboardIcon, {}), path: '/' },
    { text: 'Sports', icon: _jsx(SportsIcon, {}), path: '/sports' },
    { text: 'Analytics', icon: _jsx(AnalyticsIcon, {}), path: '/analytics' },
    { text: 'Settings', icon: _jsx(SettingsIcon, {}), path: '/settings' },
];
const Sidebar = ({ open, onClose, width = 240 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };
    return (_jsx(Drawer, { open: open, sx: {
            width,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width,
                boxSizing: 'border-box',
            },
        }, variant: "temporary", onClose: onClose, children: _jsxs(Box, { sx: { overflow: 'auto', mt: 8 }, children: [_jsx(List, { children: menuItems.map(item => (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { selected: location.pathname === item.path, onClick: () => handleNavigation(item.path), children: [_jsx(ListItemIcon, { children: item.icon }), _jsx(ListItemText, { primary: item.text })] }) }, item.text))) }), _jsx(Divider, {})] }) }));
};
export default React.memo(Sidebar);
