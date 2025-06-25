import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
const Layout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    return (_jsxs(Box, { sx: { display: 'flex' }, children: [_jsx(Navbar, { showMenuButton: isMobile, onMenuClick: handleDrawerToggle }), _jsx(Sidebar, { open: mobileOpen, variant: isMobile ? 'temporary' : 'permanent', onClose: handleDrawerToggle }), _jsx(Box, { component: "main", sx: {
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - 240px)` },
                    mt: 8,
                }, children: _jsx(Outlet, {}) })] }));
};
export default React.memo(Layout);
