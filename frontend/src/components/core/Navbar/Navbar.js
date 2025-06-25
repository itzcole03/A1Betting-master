import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, Tooltip, useTheme, useMediaQuery, } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, Settings as SettingsIcon, Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon, } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/useAuth';
import { useThemeStore } from '@/stores/themeStore';
const Navbar = ({ onMenuClick, showMenuButton = true }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useThemeStore();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleProfile = () => {
        handleClose();
        navigate('/profile');
    };
    const handleSettings = () => {
        handleClose();
        navigate('/settings');
    };
    const handleLogout = () => {
        handleClose();
        logout();
    };
    return (_jsx(AppBar, { position: "fixed", sx: {
            zIndex: theme => theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: 1,
        }, children: _jsxs(Toolbar, { children: [showMenuButton && (_jsx(IconButton, { "aria-label": "open drawer", color: "inherit", edge: "start", sx: { mr: 2 }, onClick: onMenuClick, children: _jsx(MenuIcon, {}) })), _jsxs(Typography, { noWrap: true, component: "div", sx: {
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }, variant: "h6", children: [_jsx("img", { alt: "Sports Betting AI", src: "/logo.svg", style: { height: 32, width: 'auto' } }), !isMobile && 'Sports Betting AI'] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Tooltip, { title: "Toggle theme", children: _jsx(IconButton, { color: "inherit", onClick: toggleTheme, children: isDarkMode ? _jsx(LightModeIcon, {}) : _jsx(DarkModeIcon, {}) }) }), _jsx(Tooltip, { title: "Notifications", children: _jsx(IconButton, { color: "inherit", children: _jsx(NotificationsIcon, {}) }) }), _jsx(Tooltip, { title: "Settings", children: _jsx(IconButton, { color: "inherit", onClick: handleSettings, children: _jsx(SettingsIcon, {}) }) }), _jsx(Tooltip, { title: "Account settings", children: _jsx(IconButton, { "aria-controls": open ? 'account-menu' : undefined, "aria-expanded": open ? 'true' : undefined, "aria-haspopup": "true", size: "small", sx: { ml: 2 }, onClick: handleClick, children: _jsx(Avatar, { sx: {
                                        width: 32,
                                        height: 32,
                                        bgcolor: theme.palette.primary.main,
                                    }, children: user?.name?.[0] || 'U' }) }) })] }), _jsxs(Menu, { anchorEl: anchorEl, anchorOrigin: { horizontal: 'right', vertical: 'bottom' }, id: "account-menu", open: open, PaperProps: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                        },
                    }, transformOrigin: { horizontal: 'right', vertical: 'top' }, onClick: handleClose, onClose: handleClose, children: [_jsxs(MenuItem, { onClick: handleProfile, children: [_jsx(Avatar, {}), " Profile"] }), _jsxs(MenuItem, { onClick: handleSettings, children: [_jsx(SettingsIcon, { fontSize: "small", sx: { mr: 1 } }), " Settings"] }), _jsx(MenuItem, { onClick: handleLogout, children: "Logout" })] })] }) }));
};
export default React.memo(Navbar);
