import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { calculateUserStats } from '../../utils/analyticsHelpers';
import { useAppStore } from '@/store/useAppStore';
const UserStats = () => {
    const { entries, user } = useAppStore(state => ({
        entries: state.entries,
        user: state.user,
    }));
    const stats = calculateUserStats(entries, user?.id);
    // Placeholder data removed
    // const stats = {
    //   totalBets: entries.length || 0,
    //   winRate: 0,
    //   totalProfitLoss: 0,
    //   roi: 0,
    // };
    if (!user) {
        return _jsx("p", { className: "text-text-muted", children: "Please log in to see your stats." });
    }
    if (!Array.isArray(entries) || entries.length === 0) {
        return _jsx("p", { className: "text-text-muted", children: "No betting history to calculate stats." });
    }
    return (_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [_jsxs("div", { className: "p-4 glass rounded-2xl bg-gradient-to-br from-blue-100/60 to-blue-300/30 shadow-md animate-fade-in", children: [_jsx("p", { className: "text-xs text-blue-700 font-semibold mb-1", children: "Total Bets" }), _jsx("p", { className: "text-2xl font-extrabold text-blue-900", children: stats.totalBets })] }), _jsxs("div", { className: "p-4 glass rounded-2xl bg-gradient-to-br from-green-100/60 to-green-300/30 shadow-md animate-fade-in", children: [_jsx("p", { className: "text-xs text-green-700 font-semibold mb-1", children: "Win Rate" }), _jsxs("p", { className: "text-2xl font-extrabold text-green-700", children: [stats.winRate.toFixed(1), "%"] })] }), _jsxs("div", { className: "p-4 glass rounded-2xl bg-gradient-to-br from-yellow-100/60 to-yellow-300/30 shadow-md animate-fade-in", children: [_jsx("p", { className: "text-xs text-yellow-700 font-semibold mb-1", children: "Profit/Loss" }), _jsxs("p", { className: `text-2xl font-extrabold ${stats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`, children: ["$", stats.totalProfitLoss.toFixed(2)] })] }), _jsxs("div", { className: "p-4 glass rounded-2xl bg-gradient-to-br from-purple-100/60 to-purple-300/30 shadow-md animate-fade-in", children: [_jsx("p", { className: "text-xs text-purple-700 font-semibold mb-1", children: "ROI" }), _jsxs("p", { className: "text-2xl font-extrabold text-purple-700", children: [stats.roi.toFixed(1), "%"] })] })] }));
};
export default UserStats;
