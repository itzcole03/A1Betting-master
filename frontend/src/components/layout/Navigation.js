import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
const Navigation = () => {
    const location = useLocation();
    const isActive = (path) => {
        return location.pathname === path;
    };
    return (_jsx("nav", { className: "bg-white shadow-lg", children: _jsx("div", { className: "max-w-7xl mx-auto px-4", children: _jsx("div", { className: "flex justify-between h-16", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0 flex items-center", children: _jsx(Link, { className: "text-xl font-bold text-gray-800", to: "/", children: "AI Sports Betting" }) }), _jsxs("div", { className: "hidden sm:ml-6 sm:flex sm:space-x-8", children: [_jsx(Link, { className: `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/')
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`, to: "/", children: "Dashboard" }), _jsx(Link, { className: `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/money-maker')
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`, to: "/money-maker", children: "Money Maker" }), _jsx(Link, { className: `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/monitoring')
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`, to: "/monitoring", children: "Performance" })] })] }) }) }) }));
};
export default React.memo(Navigation);
