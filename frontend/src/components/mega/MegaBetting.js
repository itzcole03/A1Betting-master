import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { CYBER_COLORS, CYBER_GRADIENTS, CyberContainer, CyberText, CyberButton, } from "./CyberTheme";
import { DollarSign, Target, TrendingUp, Zap, Shield, Calculator, Timer, Activity, CheckCircle, Clock, } from "lucide-react";
// MEGA BETTING COMPONENT - Consolidates UltimateMoneyMaker, BettingInterface, Arbitrage, etc.
const MegaBetting = ({ userBalance = 127430.5, riskProfile = "moderate", autoMode = true, className = "", }) => {
    const [activeTab, setActiveTab] = useState("opportunities");
    const [scanning, setScanning] = useState(autoMode);
    const [opportunities, setOpportunities] = useState([
        {
            id: 1,
            type: "arbitrage",
            sport: "NBA",
            game: "Lakers vs Warriors",
            market: "Spread",
            value: 247.5,
            roi: 12.4,
            confidence: 94.7,
            timeLeft: "2h 34m",
            bookmakers: ["DraftKings", "FanDuel"],
            risk: "low",
            status: "active",
        },
        {
            id: 2,
            type: "value",
            sport: "NFL",
            game: "Chiefs vs Bills",
            market: "Total Points",
            value: 189.25,
            roi: 8.7,
            confidence: 87.3,
            timeLeft: "4h 12m",
            bookmakers: ["BetMGM", "Caesars"],
            risk: "medium",
            status: "active",
        },
        {
            id: 3,
            type: "kelly",
            sport: "MLB",
            game: "Yankees vs Red Sox",
            market: "Moneyline",
            value: 156.75,
            roi: 15.3,
            confidence: 91.2,
            timeLeft: "6h 45m",
            bookmakers: ["Bet365", "PointsBet"],
            risk: "low",
            status: "pending",
        },
    ]);
    const [bettingStats, setBettingStats] = useState({
        totalOpportunities: opportunities.length,
        avgROI: 12.1,
        successRate: 89.4,
        totalProfit: 47230,
        activeBets: 23,
        pendingBets: 8,
        weeklyProfit: 1247,
        weeklyROI: 8.7,
    });
    // Auto-scan for opportunities every 30 seconds
    useEffect(() => {
        if (!scanning)
            return;
        const interval = setInterval(() => {
            // Simulate new opportunities
            const newOpportunity = {
                id: Date.now(),
                type: ["arbitrage", "value", "kelly"][Math.floor(Math.random() * 3)],
                sport: ["NBA", "NFL", "MLB", "NHL"][Math.floor(Math.random() * 4)],
                game: "Live Game",
                market: ["Spread", "Total", "Moneyline"][Math.floor(Math.random() * 3)],
                value: Math.random() * 300 + 100,
                roi: Math.random() * 20 + 5,
                confidence: Math.random() * 30 + 70,
                timeLeft: `${Math.floor(Math.random() * 8)}h ${Math.floor(Math.random() * 60)}m`,
                bookmakers: ["DraftKings", "FanDuel"],
                risk: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
                status: "active",
            };
            setOpportunities((prev) => [newOpportunity, ...prev.slice(0, 4)]);
            setBettingStats((prev) => ({
                ...prev,
                totalOpportunities: prev.totalOpportunities + 1,
                totalProfit: prev.totalProfit + (Math.random() - 0.5) * 50,
            }));
        }, 30000);
        return () => clearInterval(interval);
    }, [scanning]);
    const tabs = [
        { key: "opportunities", label: "Opportunities", icon: Target },
        { key: "active", label: "Active Bets", icon: Activity },
        { key: "kelly", label: "Kelly Calculator", icon: Calculator },
        { key: "arbitrage", label: "Arbitrage Scanner", icon: Shield },
    ];
    const getRiskColor = (risk) => {
        switch (risk) {
            case "low":
                return CYBER_COLORS.primary;
            case "medium":
                return CYBER_COLORS.accent;
            case "high":
                return "#ff4757";
            default:
                return CYBER_COLORS.text.muted;
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case "arbitrage":
                return CYBER_COLORS.primary;
            case "value":
                return CYBER_COLORS.secondary;
            case "kelly":
                return CYBER_COLORS.accent;
            default:
                return CYBER_COLORS.text.muted;
        }
    };
    const renderOpportunitiesTab = () => (_jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: "16px" }, children: [_jsx("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                }, children: [
                    {
                        label: "Active Opportunities",
                        value: bettingStats.totalOpportunities,
                        icon: Target,
                        color: CYBER_COLORS.primary,
                    },
                    {
                        label: "Average ROI",
                        value: `${bettingStats.avgROI}%`,
                        icon: TrendingUp,
                        color: CYBER_COLORS.secondary,
                    },
                    {
                        label: "Success Rate",
                        value: `${bettingStats.successRate}%`,
                        icon: CheckCircle,
                        color: CYBER_COLORS.accent,
                    },
                    {
                        label: "Weekly Profit",
                        value: `$${bettingStats.weeklyProfit}`,
                        icon: DollarSign,
                        color: CYBER_COLORS.purple,
                    },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (_jsxs(CyberContainer, { variant: "card", style: { padding: "16px", textAlign: "center" }, children: [_jsx(Icon, { size: 24, color: stat.color, style: { marginBottom: "8px", margin: "0 auto" } }), _jsx(CyberText, { variant: "title", style: {
                                    color: stat.color,
                                    fontSize: "20px",
                                    marginBottom: "4px",
                                }, children: stat.value }), _jsx(CyberText, { variant: "caption", color: "muted", children: stat.label })] }, index));
                }) }), opportunities.map((opp) => (_jsxs(CyberContainer, { variant: "card", style: { padding: "20px" }, children: [_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "16px",
                        }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsxs("div", { style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            marginBottom: "8px",
                                        }, children: [_jsx("span", { style: {
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "10px",
                                                    fontWeight: "600",
                                                    textTransform: "uppercase",
                                                    backgroundColor: `${getTypeColor(opp.type)}20`,
                                                    color: getTypeColor(opp.type),
                                                    border: `1px solid ${getTypeColor(opp.type)}40`,
                                                }, children: opp.type }), _jsxs("span", { style: {
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "10px",
                                                    fontWeight: "600",
                                                    backgroundColor: `${getRiskColor(opp.risk)}20`,
                                                    color: getRiskColor(opp.risk),
                                                    border: `1px solid ${getRiskColor(opp.risk)}40`,
                                                }, children: [opp.risk.toUpperCase(), " RISK"] })] }), _jsxs(CyberText, { variant: "title", style: { marginBottom: "4px" }, children: [opp.game, " - ", opp.market] }), _jsxs(CyberText, { variant: "body", color: "muted", style: { marginBottom: "8px" }, children: [opp.sport, " \u2022 ", opp.bookmakers.join(" vs ")] }), _jsxs("div", { style: { display: "flex", gap: "24px" }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "caption", color: "muted", children: "Expected Value" }), _jsxs(CyberText, { variant: "body", style: { color: CYBER_COLORS.primary, fontWeight: "600" }, children: ["$", opp.value.toFixed(2)] })] }), _jsxs("div", { children: [_jsx(CyberText, { variant: "caption", color: "muted", children: "ROI" }), _jsxs(CyberText, { variant: "body", style: { color: CYBER_COLORS.secondary, fontWeight: "600" }, children: [opp.roi.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx(CyberText, { variant: "caption", color: "muted", children: "Confidence" }), _jsxs(CyberText, { variant: "body", style: { color: CYBER_COLORS.accent, fontWeight: "600" }, children: [opp.confidence.toFixed(1), "%"] })] })] })] }), _jsxs("div", { style: { textAlign: "right" }, children: [_jsxs("div", { style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            marginBottom: "12px",
                                        }, children: [_jsx(Clock, { size: 14, color: CYBER_COLORS.text.muted }), _jsx(CyberText, { variant: "caption", color: "muted", children: opp.timeLeft })] }), _jsx(CyberButton, { variant: "primary", onClick: () => console.log("Place bet:", opp.id), style: { width: "auto", padding: "8px 16px", marginBottom: 0 }, children: "Place Bet" })] })] }), _jsx("div", { style: {
                            width: "100%",
                            height: "4px",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "2px",
                            overflow: "hidden",
                        }, children: _jsx("div", { style: {
                                width: `${opp.confidence}%`,
                                height: "100%",
                                backgroundImage: CYBER_GRADIENTS.button,
                                transition: "width 0.3s ease",
                            } }) })] }, opp.id)))] }));
    const renderKellyTab = () => (_jsxs(CyberContainer, { variant: "card", style: { padding: "20px" }, children: [_jsxs(CyberText, { variant: "title", style: { marginBottom: "16px", display: "flex", alignItems: "center" }, children: [_jsx(Calculator, { size: 20, style: { marginRight: "8px", color: CYBER_COLORS.primary } }), "Kelly Criterion Calculator"] }), _jsxs("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "24px",
                }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "body", color: "muted", style: { marginBottom: "8px" }, children: "The Kelly Criterion calculates optimal bet sizing based on your edge and bankroll." }), _jsx("div", { style: {
                                    padding: "16px",
                                    backgroundColor: "rgba(6, 255, 165, 0.1)",
                                    border: `1px solid ${CYBER_COLORS.primary}30`,
                                    borderRadius: "8px",
                                }, children: _jsxs(CyberText, { variant: "body", style: { color: CYBER_COLORS.primary }, children: ["Current Bankroll: $", userBalance.toLocaleString()] }) })] }), _jsxs("div", { children: [_jsx(CyberText, { variant: "body", style: { marginBottom: "8px" }, children: "Kelly Formula:" }), _jsx("div", { style: {
                                    padding: "12px",
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    borderRadius: "8px",
                                    fontFamily: "monospace",
                                    fontSize: "14px",
                                }, children: "f = (bp - q) / b" }), _jsx(CyberText, { variant: "caption", color: "muted", style: { marginTop: "8px" }, children: "Where: f = fraction to bet, b = odds, p = win probability, q = lose probability" })] })] })] }));
    return (_jsxs("div", { className: `mega-betting ${className}`, style: {
            minHeight: "100vh",
            background: CYBER_GRADIENTS.background,
            padding: "24px",
            color: CYBER_COLORS.text.primary,
        }, children: [_jsxs(CyberContainer, { variant: "panel", style: { marginBottom: "24px", padding: "20px" }, children: [_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                        }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "title", style: { fontSize: "28px", marginBottom: "4px" }, children: "Ultimate Money Maker" }), _jsx(CyberText, { variant: "body", color: "muted", children: "AI-powered betting opportunities with quantum edge detection" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [scanning ? (_jsx(Zap, { size: 16, color: CYBER_COLORS.primary, style: { animation: "cyber-pulse 1s infinite" } })) : (_jsx(Timer, { size: 16, color: CYBER_COLORS.text.muted })), _jsx(CyberText, { variant: "caption", color: scanning ? "accent" : "muted", children: scanning ? "Scanning..." : "Paused" })] }), _jsx(CyberButton, { variant: scanning ? "primary" : "secondary", onClick: () => setScanning(!scanning), children: scanning ? "Stop Scanning" : "Start Scanning" })] })] }), _jsx("div", { style: { display: "flex", gap: "8px" }, children: tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (_jsx(CyberButton, { variant: activeTab === tab.key ? "primary" : "secondary", active: activeTab === tab.key, onClick: () => setActiveTab(tab.key), icon: _jsx(Icon, { size: 16 }), style: { marginBottom: 0, width: "auto", padding: "8px 16px" }, children: tab.label }, tab.key));
                        }) })] }), _jsxs("div", { style: { minHeight: "500px" }, children: [activeTab === "opportunities" && renderOpportunitiesTab(), activeTab === "kelly" && renderKellyTab(), activeTab === "active" && (_jsxs(CyberContainer, { variant: "card", style: { padding: "40px", textAlign: "center" }, children: [_jsx(Activity, { size: 48, color: CYBER_COLORS.secondary, style: { marginBottom: "16px", margin: "0 auto" } }), _jsx(CyberText, { variant: "title", style: { marginBottom: "8px" }, children: "Active Bets Dashboard" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Live tracking of your placed bets and their performance" })] })), activeTab === "arbitrage" && (_jsxs(CyberContainer, { variant: "card", style: { padding: "40px", textAlign: "center" }, children: [_jsx(Shield, { size: 48, color: CYBER_COLORS.accent, style: { marginBottom: "16px", margin: "0 auto" } }), _jsx(CyberText, { variant: "title", style: { marginBottom: "8px" }, children: "Arbitrage Scanner" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Advanced arbitrage detection across multiple sportsbooks" })] }))] })] }));
};
export default MegaBetting;
