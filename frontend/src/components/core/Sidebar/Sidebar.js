import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, useTheme, useMediaQuery, } from '@mui/material';
import { Dashboard as DashboardIcon, Analytics as AnalyticsIcon, SportsSoccer as SportsIcon, Settings as SettingsIcon, TrendingUp as TrendingUpIcon, History as HistoryIcon, } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeStore } from '@/stores/themeStore';
const drawerWidth = 240;
const menuItems = [
    { text: 'Dashboard', icon: _jsx(DashboardIcon, {}), path: '/' },
    { text: 'Predictions', icon: _jsx(SportsIcon, {}), path: '/predictions' },
    { text: 'Analytics', icon: _jsx(AnalyticsIcon, {}), path: '/analytics' },
    { text: 'Trends', icon: _jsx(TrendingUpIcon, {}), path: '/trends' },
    { text: 'History', icon: _jsx(HistoryIcon, {}), path: '/history' },
    { text: 'Settings', icon: _jsx(SettingsIcon, {}), path: '/settings' },
];
const Sidebar = ({ open = true, onClose, variant = 'permanent' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const { isDarkMode } = useThemeStore();
    const handleNavigation = (path) => {
        navigate(path);
        if (onClose) {
            onClose();
        }
    };
    const drawerContent = (_jsxs(Box, { sx: { overflow: 'auto', mt: 8 }, children: [_jsx(List, { children: menuItems.map(item => (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { selected: location.pathname === item.path, sx: {
                            '&.Mui-selected': {
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                                '&:hover': {
                                    backgroundColor: isDarkMode
                                        ? 'rgba(255, 255, 255, 0.12)'
                                        : 'rgba(0, 0, 0, 0.12)',
                                },
                            },
                        }, onClick: () => handleNavigation(item.path), children: [_jsx(ListItemIcon, { sx: {
                                    color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                                }, children: item.icon }), _jsx(ListItemText, { primary: item.text, primaryTypographyProps: {
                                    color: location.pathname === item.path ? 'primary' : 'inherit',
                                } })] }) }, item.text))) }), _jsx(Divider, {})] }));
    if (isMobile) {
        return (_jsx(Drawer, { ModalProps: {
                keepMounted: true, // Better open performance on mobile.
            }, open: open, sx: {
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }, variant: "temporary", onClose: onClose, children: drawerContent }));
    }
    return (_jsx(Drawer, { sx: {
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                borderRight: `1px solid ${theme.palette.divider}`,
            },
        }, variant: "permanent", children: drawerContent }));
};
export default React.memo(Sidebar);
