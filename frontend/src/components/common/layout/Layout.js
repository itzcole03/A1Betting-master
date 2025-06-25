import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Box, Container } from '@mui/material';
const Layout = ({ children }) => {
    return (_jsxs(Box, { sx: { display: 'flex' }, children: [_jsx(Navbar, {}), _jsx(Sidebar, {}), _jsx(Box, { component: "main", sx: {
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    pt: 8,
                    px: 3,
                }, children: _jsx(Container, { maxWidth: "lg", children: children }) })] }));
};
export default Layout;
