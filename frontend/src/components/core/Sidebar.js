import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme, } from '@mui/material';
import { Dashboard as DashboardIcon, SportsSoccer as SportsIcon, AccountBalance as WalletIcon, History as HistoryIcon, Settings as SettingsIcon, } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
const menuItems = [
    { text: 'Dashboard', icon: _jsx(DashboardIcon, {}), path: '/' },
    { text: 'Sports', icon: _jsx(SportsIcon, {}), path: '/sports' },
    { text: 'Wallet', icon: _jsx(WalletIcon, {}), path: '/wallet' },
    { text: 'History', icon: _jsx(HistoryIcon, {}), path: '/history' },
    { text: 'Settings', icon: _jsx(SettingsIcon, {}), path: '/settings' },
];
const Sidebar = ({ open, onClose }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };
    return (_jsx(Drawer, { anchor: "left", open: open, sx: {
            width: theme.custom.sidebarWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: theme.custom.sidebarWidth,
                boxSizing: 'border-box',
                mt: `${theme.custom.headerHeight}px`,
                transition: theme.custom.transition,
            },
        }, variant: "persistent", onClose: onClose, children: _jsx(List, { children: menuItems.map(item => (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { selected: location.pathname === item.path, onClick: () => handleNavigation(item.path), children: [_jsx(ListItemIcon, { children: item.icon }), _jsx(ListItemText, { primary: item.text })] }) }, item.text))) }) }));
};
export default Sidebar;
