import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useLocation } from "react-router-dom";
const CyberSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const navigation = [
        {
            name: "Dashboard",
            key: "dashboard",
            icon: "fa-home",
            category: "main",
            path: "/",
        },
        {
            name: "Premium Dashboard",
            key: "premium-dashboard",
            icon: "fa-crown",
            category: "premium",
            path: "/premium-dashboard",
        },
        {
            name: "Money Maker",
            key: "money-maker",
            icon: "fa-dollar-sign",
            category: "main",
            path: "/money-maker",
        },
        {
            name: "PrizePicks Pro",
            key: "prizepicks",
            icon: "fa-trophy",
            category: "main",
            path: "/prizepicks",
        },
        {
            name: "ML Center",
            key: "ml-center",
            icon: "fa-brain",
            category: "ai",
            path: "/ml-center",
        },
        {
            name: "Quantum Predictions",
            key: "quantum",
            icon: "fa-atom",
            category: "ai",
            path: "/quantum",
        },
        {
            name: "Analytics",
            key: "analytics",
            icon: "fa-chart-line",
            category: "insights",
            path: "/analytics",
        },
        {
            name: "Real-time Monitor",
            key: "realtime",
            icon: "fa-eye",
            category: "insights",
            path: "/realtime",
        },
        {
            name: "Settings",
            key: "settings",
            icon: "fa-cog",
            category: "account",
            path: "/settings",
        },
    ];
    const categories = {
        main: "Core Features",
        premium: "Premium",
        ai: "AI & ML",
        insights: "Analytics",
        account: "Account",
    };
    const groupedNav = navigation.reduce((acc, item) => {
        if (!acc[item.category])
            acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});
    const isActive = (path) => {
        return location.pathname === path;
    };
    const handleNavigation = (path) => {
        navigate(path);
    };
    return (_jsx("div", { className: "w-80 h-screen border-r", style: {
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(40px) saturate(200%)",
            borderRight: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
        }, children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-lg font-bold text-electric-400 mb-2", children: "Navigation" }), _jsx("div", { className: "text-sm text-gray-400", children: "36 Advanced Features" })] }), _jsx("nav", { className: "space-y-6", children: Object.entries(groupedNav).map(([category, items]) => (_jsxs("div", { children: [_jsx("h3", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3", children: categories[category] }), _jsx("ul", { className: "space-y-1", children: items.map((item) => (_jsx("li", { children: _jsxs("button", { onClick: () => handleNavigation(item.path), className: `nav-item w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${isActive(item.path)
                                            ? "active text-electric-400"
                                            : "text-gray-300 hover:text-white"}`, style: {
                                            borderRadius: "12px",
                                            marginBottom: "4px",
                                            ...(isActive(item.path)
                                                ? {
                                                    background: "rgba(0,255,136,0.2)",
                                                    borderLeft: "4px solid #00ff88",
                                                    paddingLeft: "16px",
                                                    boxShadow: "0 4px 12px rgba(0,255,136,0.3)",
                                                    color: "#06ffa5",
                                                }
                                                : {
                                                    background: "rgba(255, 255, 255, 0.05)",
                                                    backdropFilter: "blur(20px) saturate(180%)",
                                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                                    color: "#d1d5db",
                                                }),
                                        }, children: [_jsx("i", { className: `fas ${item.icon} mr-3`, style: {
                                                    width: "16px",
                                                    color: isActive(item.path) ? "#06ffa5" : "#9ca3af",
                                                } }), _jsx("span", { children: item.name })] }) }, item.key))) })] }, category))) })] }) }));
};
export default CyberSidebar;
