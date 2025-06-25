import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CyberLayout from "../components/layout/CyberLayout";
import CyberDashboard from "../pages/CyberDashboard";
import CyberPremiumDashboard from "../pages/CyberPremiumDashboard";
import CyberMoneyMaker from "../pages/CyberMoneyMaker";
import CyberPrizePicksPage from "../pages/CyberPrizePicksPage";
import CyberAnalyticsPage from "../pages/CyberAnalyticsPage";
import CyberDefaultPage from "../pages/CyberDefaultPage";
const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(CyberLayout, {}),
        children: [
            {
                index: true,
                element: _jsx(CyberDashboard, {}),
            },
            {
                path: "premium-dashboard",
                element: _jsx(CyberPremiumDashboard, {}),
            },
            {
                path: "money-maker",
                element: _jsx(CyberMoneyMaker, {}),
            },
            {
                path: "prizepicks",
                element: _jsx(CyberPrizePicksPage, {}),
            },
            {
                path: "ml-center",
                element: (_jsx(CyberDefaultPage, { title: "ML Center", description: "Machine learning command center with 47 neural networks and deep learning models", icon: "fa-brain" })),
            },
            {
                path: "quantum",
                element: (_jsx(CyberDefaultPage, { title: "Quantum Predictions", description: "Quantum-enhanced prediction engine with 1024 qubits and superposition algorithms", icon: "fa-atom" })),
            },
            {
                path: "analytics",
                element: _jsx(CyberAnalyticsPage, {}),
            },
            {
                path: "realtime",
                element: (_jsx(CyberDefaultPage, { title: "Real-time Monitor", description: "Live data monitoring with instant processing and intelligent alerts", icon: "fa-eye" })),
            },
            {
                path: "settings",
                element: (_jsx(CyberDefaultPage, { title: "Settings", description: "Platform configuration and account management options", icon: "fa-cog" })),
            },
        ],
    },
]);
const CyberRoutes = () => {
    return _jsx(RouterProvider, { router: router });
};
export default CyberRoutes;
