import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { RiskProfileService } from '../services/risk/RiskProfileService';
import { riskManagementService } from '../services/riskManagement';
const RiskManagerPage = () => {
    const [profiles, setProfiles] = useState([]);
    const [activeBets, setActiveBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // Fetch risk profiles and active bets on mount (using services)
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const profileService = RiskProfileService.getInstance();
                const fetchedProfiles = profileService.getAllProfiles();
                setProfiles(fetchedProfiles);
                // For demo, use riskManagementService for bets
                const bets = riskManagementService.getBets();
                setActiveBets(bets);
            }
            catch (err) {
                setError('Failed to load risk profiles or active bets.');
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    const activeProfile = profiles.find((p) => p.isActive);
    const totalExposure = activeBets.reduce((sum, bet) => sum + bet.stake, 0);
    const maxPotentialLoss = totalExposure;
    const maxPotentialWin = activeBets.reduce((sum, bet) => sum + bet.potentialWin, 0);
    // If you need to color-code risk, adapt this function to BetRecord or remove if not needed
    const getRiskColor = (_risk) => {
        // Placeholder: implement if BetRecord has a risk property
        return 'text-gray-600 dark:text-gray-400';
    };
    // Modal logic for creating a new profile (scaffold)
    // (Implementation will be added in a future step)
    return (_jsx("main", { className: "section space-y-6 lg:space-y-8 animate-fade-in", children: _jsxs("div", { className: "modern-card p-6 lg:p-8", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8", children: [_jsx("h1", { className: "text-2xl lg:text-3xl font-bold", children: "\u2696\uFE0F Risk Manager" }), _jsx("button", { className: "modern-button", onClick: () => setShowModal(true), children: "Create New Profile" })] }), loading ? (_jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Loading..." })) : error ? (_jsx("div", { className: "text-red-600 dark:text-red-400", children: error })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Active Profile" }), _jsx("p", { className: "text-2xl font-bold", children: activeProfile?.name || 'None' })] }), _jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Total Exposure" }), _jsxs("p", { className: "text-2xl font-bold", children: ["$", totalExposure.toFixed(2)] })] }), _jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Max Potential Loss" }), _jsxs("p", { className: "text-2xl font-bold text-red-600", children: ["-$", maxPotentialLoss.toFixed(2)] })] }), _jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Max Potential Win" }), _jsxs("p", { className: "text-2xl font-bold text-green-600", children: ["+$", maxPotentialWin.toFixed(2)] })] })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Risk Profiles" }), profiles.length === 0 ? (_jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "No risk profiles available." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: profiles.map((profile) => (_jsxs("div", { className: `modern-card p-6 ${profile.isActive ? 'ring-2 ring-primary-500' : ''}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-lg font-bold", children: profile.name }), profile.isActive && (_jsx("span", { className: "px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full", children: "Active" }))] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Max Stake" }), _jsxs("span", { className: "font-medium", children: ["$", profile.maxStake] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Max Exposure" }), _jsxs("span", { className: "font-medium", children: ["$", profile.maxExposure] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Stop Loss" }), _jsxs("span", { className: "font-medium", children: ["-$", profile.stopLoss] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Take Profit" }), _jsxs("span", { className: "font-medium", children: ["+$", profile.takeProfit] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Kelly Fraction" }), _jsxs("span", { className: "font-medium", children: [profile.kellyFraction, "x"] })] })] }), !profile.isActive && _jsx("button", { className: "modern-button mt-4", children: "Set Active" })] }, profile.id))) }))] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Active Bets" }), activeBets.length === 0 ? (_jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "No active bets." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "modern-table w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Event" }), _jsx("th", { children: "Stake" }), _jsx("th", { children: "Odds" }), _jsx("th", { children: "Potential Win" }), _jsx("th", { children: "Risk" }), _jsx("th", { children: "Expires At" })] }) }), _jsx("tbody", { children: activeBets.map((bet) => (_jsxs("tr", { children: [_jsx("td", { children: bet.event }), _jsxs("td", { children: ["$", bet.stake] }), _jsx("td", { children: bet.odds }), _jsxs("td", { children: ["$", bet.potentialWin] }), _jsx("td", { className: getRiskColor(bet.risk), children: bet.risk }), _jsx("td", { children: new Date(bet.expiresAt).toLocaleString() })] }, bet.id))) })] }) }))] })] })), showModal && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Create New Profile" }), _jsx("button", { className: "modern-button mt-4", onClick: () => setShowModal(false), children: "Close" })] }) }))] }) }));
};
export default RiskManagerPage;
