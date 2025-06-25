import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BetSlipSidebar from '../components/modern/BetSlipSidebar'; // To be created
import Sidebar from '../components/modern/Sidebar'; // To be created
import { Outlet } from 'react-router-dom';
// import Navbar from '../components/navigation/Navbar'; // Optional: if you want a top navbar as well
const MainLayout = () => {
    return (_jsxs("div", { className: "flex h-screen bg-background", children: [_jsx(Sidebar, {}), _jsx("main", { className: "flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8", children: _jsx(Outlet, {}) }), _jsx(BetSlipSidebar, {})] }));
};
export default MainLayout;
