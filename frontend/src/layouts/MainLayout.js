import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';
export default function MainLayout() {
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Navbar, {}), _jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsx("main", { className: "flex-1 p-6", children: _jsx("div", { className: "mx-auto max-w-7xl", children: _jsx(Outlet, {}) }) })] })] }));
}
