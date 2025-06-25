import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useTheme, useMediaQuery, Button, Menu, MenuItem, Avatar, } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, Analytics as AnalyticsIcon, Casino as CasinoIcon, AccountBalance as AccountBalanceIcon, Settings as SettingsIcon, SportsSoccer as SportsSoccerIcon, Logout as LogoutIcon, } from '@mui/icons-material';
import { useStore } from '@/store';
import { authService } from '@/services/auth';
const drawerWidth = 240;
const menuItems = [
    { text: 'Dashboard', icon: _jsx(DashboardIcon, {}), path: '/' },
    { text: 'Analytics', icon: _jsx(AnalyticsIcon, {}), path: '/analytics' },
    { text: 'Arbitrage', icon: _jsx(CasinoIcon, {}), path: '/arbitrage' },
    { text: 'Bets', icon: _jsx(SportsSoccerIcon, {}), path: '/bets' },
    { text: 'Bankroll', icon: _jsx(AccountBalanceIcon, {}), path: '/bankroll' },
    { text: 'Settings', icon: _jsx(SettingsIcon, {}), path: '/settings' },
];
export default function Navigation() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useStore();
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = async () => {
        try {
            await authService.logout();
            setUser(null);
            navigate('/login');
        }
        catch (error) {
            console.error('Logout error:', error);
        }
    };
    const drawer = (_jsxs(Box, { children: [_jsx(Toolbar, { children: _jsx(Typography, { variant: "h6", noWrap: true, component: "div", children: "Betting Analyzer" }) }), _jsx(List, { children: menuItems.map((item) => (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { selected: location.pathname === item.path, onClick: () => {
                            navigate(item.path);
                            if (isMobile) {
                                setMobileOpen(false);
                            }
                        }, children: [_jsx(ListItemIcon, { children: item.icon }), _jsx(ListItemText, { primary: item.text })] }) }, item.text))) })] }));
    return (_jsxs(Box, { sx: { display: 'flex' }, children: [_jsx(AppBar, { position: "fixed", sx: {
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }, children: _jsxs(Toolbar, { children: [_jsx(IconButton, { color: "inherit", "aria-label": "open drawer", edge: "start", onClick: handleDrawerToggle, sx: { mr: 2, display: { md: 'none' } }, children: _jsx(MenuIcon, {}) }), _jsx(Typography, { variant: "h6", noWrap: true, component: "div", sx: { flexGrow: 1 }, children: menuItems.find((item) => item.path === location.pathname)?.text ||
                                'Dashboard' }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsxs(Button, { onClick: handleMenuOpen, sx: {
                                        color: 'inherit',
                                        textTransform: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }, children: [_jsx(Avatar, { sx: {
                                                width: 32,
                                                height: 32,
                                                mr: 1,
                                                bgcolor: 'primary.main',
                                            }, children: user?.username.charAt(0).toUpperCase() }), _jsx(Typography, { variant: "body1", children: user?.username })] }), _jsxs(Menu, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: handleMenuClose, onClick: handleMenuClose, children: [_jsxs(MenuItem, { onClick: () => navigate('/settings'), children: [_jsx(ListItemIcon, { children: _jsx(SettingsIcon, { fontSize: "small" }) }), _jsx(ListItemText, { children: "Settings" })] }), _jsxs(MenuItem, { onClick: handleLogout, children: [_jsx(ListItemIcon, { children: _jsx(LogoutIcon, { fontSize: "small" }) }), _jsx(ListItemText, { children: "Logout" })] })] })] })] }) }), _jsxs(Box, { component: "nav", sx: { width: { md: drawerWidth }, flexShrink: { md: 0 } }, children: [_jsx(Drawer, { variant: "temporary", open: mobileOpen, onClose: handleDrawerToggle, ModalProps: {
                            keepMounted: true, // Better open performance on mobile.
                        }, sx: {
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }, children: drawer }), _jsx(Drawer, { variant: "permanent", sx: {
                            display: { xs: 'none', md: 'block' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }, open: true, children: drawer })] }), _jsx(Box, { component: "main", sx: {
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px',
                } })] }));
}
