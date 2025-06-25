import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUnifiedAnalytics } from '@/hooks/useUnifiedAnalytics';
export const BettingAnalytics = () => {
    const { betting } = useUnifiedAnalytics({ betting: true });
    if (betting.loading) {
        return _jsx("div", { style: { padding: 24 }, children: "Loading..." });
    }
    if (betting.error) {
        return _jsxs("div", { style: { padding: 24, color: 'red' }, children: ["Error: ", betting.error] });
    }
    const stats = betting.data || {
        roi: 0,
        winRate: 0,
        profitLoss: 0,
        riskMetrics: { var: 0, sharpe: 0, sortino: 0 },
        confidence: 0,
    };
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx("h2", { children: "Betting Analytics" }), _jsxs("div", { style: { display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }, children: [_jsxs("div", { style: { flex: 1, minWidth: 200, background: '#f9f9f9', borderRadius: 8, padding: 16 }, children: [_jsx("h4", { children: "Win Rate" }), _jsxs("div", { style: { fontSize: 24 }, children: [stats.winRate?.toFixed(1), "%"] })] }), _jsxs("div", { style: { flex: 1, minWidth: 200, background: '#f9f9f9', borderRadius: 8, padding: 16 }, children: [_jsx("h4", { children: "ROI" }), _jsxs("div", { style: { fontSize: 24 }, children: [stats.roi?.toFixed(1), "%"] })] }), _jsxs("div", { style: { flex: 1, minWidth: 200, background: '#f9f9f9', borderRadius: 8, padding: 16 }, children: [_jsx("h4", { children: "Profit/Loss" }), _jsxs("div", { style: { fontSize: 24 }, children: ["$", stats.profitLoss?.toFixed(2)] })] }), _jsxs("div", { style: { flex: 1, minWidth: 200, background: '#f9f9f9', borderRadius: 8, padding: 16 }, children: [_jsx("h4", { children: "Confidence" }), _jsx("div", { style: { fontSize: 24 }, children: stats.confidence?.toFixed(2) })] })] }), _jsx("h3", { children: "Risk Metrics" }), _jsxs("div", { style: { display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }, children: [_jsxs("div", { style: { flex: 1, minWidth: 200, background: '#f9f9f9', borderRadius: 8, padding: 16 }, children: [_jsx("h4", { children: "VaR" }), _jsx("div", { style: { fontSize: 20 }, children: stats.riskMetrics?.var?.toFixed(2) ?? 'N/A' })] }), _jsxs("div", { style: { flex: 1, minWidth: 200, background: '#f9f9f9', borderRadius: 8, padding: 16 }, children: [_jsx("h4", { children: "Sharpe" }), _jsx("div", { style: { fontSize: 20 }, children: stats.riskMetrics?.sharpe?.toFixed(2) ?? 'N/A' })] }), _jsxs("div", { style: { flex: 1, minWidth: 200, background: '#f9f9f9', borderRadius: 8, padding: 16 }, children: [_jsx("h4", { children: "Sortino" }), _jsx("div", { style: { fontSize: 20 }, children: stats.riskMetrics?.sortino?.toFixed(2) ?? 'N/A' })] })] })] }));
};
export default React.memo(BettingAnalytics);
