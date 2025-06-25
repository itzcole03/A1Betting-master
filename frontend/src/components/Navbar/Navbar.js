import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppBar, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
const Navbar = ({ onMenuClick }) => {
    const theme = useTheme();
    return (_jsx(AppBar, { position: "fixed", sx: {
            zIndex: theme.zIndex.drawer + 1,
            height: theme.custom.headerHeight,
            transition: theme.custom.transition,
        }, children: _jsxs(Toolbar, { children: [_jsx(IconButton, { "aria-label": "open drawer", color: "inherit", edge: "start", sx: { mr: 2 }, onClick: onMenuClick, children: _jsx(MenuIcon, {}) }), _jsx(Typography, { noWrap: true, component: "div", sx: { flexGrow: 1 }, variant: "h6", children: "Sports Betting App" }), _jsx(ThemeToggle, {})] }) }));
};
export default Navbar;
