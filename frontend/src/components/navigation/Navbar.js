import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SmartMenuIcon from '@mui/icons-material/SmartToy';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';
const MotionIconButton = motion.create(IconButton);
const Navbar = ({ onMenuClick, onSmartSidebarClick, title = 'Sports Betting App', }) => {
    const theme = useTheme();
    return (_jsx(AppBar, { position: "fixed", sx: {
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(8px)',
            borderBottom: 1,
            borderColor: 'divider',
        }, children: _jsxs(Toolbar, { children: [_jsx(MotionIconButton, { "aria-label": "open drawer", color: "primary", edge: "start", sx: { mr: 2 }, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: onMenuClick, children: _jsx(MenuIcon, {}) }), _jsx(Typography, { noWrap: true, component: "div", sx: {
                        flexGrow: 1,
                        color: 'primary.main',
                        fontWeight: 600,
                    }, variant: "h6", children: title }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(MotionIconButton, { "aria-label": "open smart sidebar", color: "primary", edge: "start", sx: { mr: 2 }, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: onSmartSidebarClick, children: _jsx(SmartMenuIcon, {}) }), _jsx(ThemeToggle, {})] })] }) }));
};
export default Navbar;
