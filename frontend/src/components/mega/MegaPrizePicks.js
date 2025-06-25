import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { CYBER_COLORS, CYBER_GRADIENTS, CyberText, CyberButton, } from "./CyberTheme";
import { MegaCard, MegaButton } from "./MegaUI";
import { Target, TrendingUp, TrendingDown, Activity, Trophy, Clock, XCircle, } from "lucide-react";
// MEGA PRIZEPICKS - Cyber-themed with original prop card styling preserved
const MegaPrizePicks = ({ className = "" }) => {
    const [selectedSport, setSelectedSport] = useState("All");
    const [lineup, setLineup] = useState([]);
    const [entryAmount, setEntryAmount] = useState(25);
    const [loading, setLoading] = useState(false);
    // Mock player props data (in real app, this would come from API)
    const [playerProps] = useState([
        {
            id: "1",
            playerName: "LeBron James",
            team: "LAL",
            opponent: "GSW",
            sport: "NBA",
            statType: "Points",
            projectedValue: 25.5,
            overOdds: -110,
            underOdds: -110,
            gameTime: "8:00 PM ET",
            trend: "up",
            confidence: 87.3,
        },
        {
            id: "2",
            playerName: "Stephen Curry",
            team: "GSW",
            opponent: "LAL",
            sport: "NBA",
            statType: "3-Pointers Made",
            projectedValue: 4.5,
            overOdds: -105,
            underOdds: -115,
            gameTime: "8:00 PM ET",
            trend: "up",
            confidence: 92.1,
        },
        {
            id: "3",
            playerName: "Josh Allen",
            team: "BUF",
            opponent: "MIA",
            sport: "NFL",
            statType: "Passing Yards",
            projectedValue: 275.5,
            overOdds: -110,
            underOdds: -110,
            gameTime: "Sunday 1:00 PM ET",
            trend: "stable",
            confidence: 84.7,
        },
        {
            id: "4",
            playerName: "Tyreek Hill",
            team: "MIA",
            opponent: "BUF",
            sport: "NFL",
            statType: "Receiving Yards",
            projectedValue: 85.5,
            overOdds: -108,
            underOdds: -112,
            gameTime: "Sunday 1:00 PM ET",
            trend: "down",
            confidence: 78.9,
        },
        {
            id: "5",
            playerName: "Mookie Betts",
            team: "LAD",
            opponent: "SD",
            sport: "MLB",
            statType: "Hits",
            projectedValue: 1.5,
            overOdds: -115,
            underOdds: -105,
            gameTime: "Tonight 7:10 PM ET",
            trend: "up",
            confidence: 89.4,
        },
        {
            id: "6",
            playerName: "Fernando Tatis Jr.",
            team: "SD",
            opponent: "LAD",
            sport: "MLB",
            statType: "Total Bases",
            projectedValue: 2.5,
            overOdds: -110,
            underOdds: -110,
            gameTime: "Tonight 7:10 PM ET",
            trend: "stable",
            confidence: 81.2,
        },
    ]);
    const sports = ["All", "NBA", "NFL", "MLB", "NHL"];
    const filteredProps = selectedSport === "All"
        ? playerProps
        : playerProps.filter((prop) => prop.sport === selectedSport);
    // Original PrizePicks-style prop card (preserved styling)
    const PropCard = ({ prop, onSelect }) => {
        const isSelected = lineup.some((entry) => entry.propId === prop.id);
        const selectedChoice = lineup.find((entry) => entry.propId === prop.id)?.choice;
        // Reliable player avatar (DiceBear service)
        const getPlayerImageUrl = (playerName, sport) => {
            const encodedName = encodeURIComponent(playerName);
            const sportColors = {
                NBA: { bg: "1f2937", color: "ffffff" },
                NFL: { bg: "059669", color: "ffffff" },
                MLB: { bg: "7c2d12", color: "ffffff" },
                NHL: { bg: "1e40af", color: "ffffff" },
            };
            const colors = sportColors[sport] || {
                bg: "6366f1",
                color: "ffffff",
            };
            return `https://api.dicebear.com/7.x/initials/png?seed=${encodedName}&size=64&backgroundColor=${colors.bg}&color=${colors.color}&fontSize=24&fontWeight=600`;
        };
        return (_jsxs("div", { style: {
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                backdropFilter: "blur(20px)",
                border: isSelected
                    ? `2px solid ${CYBER_COLORS.primary}`
                    : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "20px",
                transition: "all 0.3s ease",
                boxShadow: isSelected
                    ? `0 0 20px ${CYBER_COLORS.primary}40, 0 8px 32px rgba(0, 0, 0, 0.1)`
                    : "0 8px 32px rgba(0, 0, 0, 0.1)",
                position: "relative",
                overflow: "hidden",
            }, children: [_jsx("div", { style: {
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        backgroundColor: `${CYBER_COLORS.accent}20`,
                        border: `1px solid ${CYBER_COLORS.accent}40`,
                        fontSize: "10px",
                        fontWeight: "600",
                        color: CYBER_COLORS.accent,
                    }, children: prop.sport }), _jsxs("div", { style: {
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                    }, children: [_jsx("img", { src: getPlayerImageUrl(prop.playerName, prop.sport), alt: prop.playerName, style: {
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                marginRight: "12px",
                                border: `2px solid ${CYBER_COLORS.primary}40`,
                            } }), _jsxs("div", { children: [_jsx("div", { style: {
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        color: CYBER_COLORS.text.primary,
                                        marginBottom: "2px",
                                    }, children: prop.playerName }), _jsxs("div", { style: {
                                        fontSize: "12px",
                                        color: CYBER_COLORS.text.muted,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }, children: [_jsxs("span", { children: [prop.team, " vs ", prop.opponent] }), _jsx(Clock, { size: 10 }), _jsx("span", { children: prop.gameTime })] })] })] }), _jsxs("div", { style: { textAlign: "center", marginBottom: "16px" }, children: [_jsx("div", { style: {
                                fontSize: "14px",
                                color: CYBER_COLORS.text.secondary,
                                marginBottom: "4px",
                                fontWeight: "500",
                            }, children: prop.statType }), _jsx("div", { style: {
                                fontSize: "28px",
                                fontWeight: "800",
                                color: CYBER_COLORS.primary,
                                marginBottom: "4px",
                            }, children: prop.projectedValue }), prop.confidence && (_jsxs("div", { style: {
                                fontSize: "12px",
                                color: CYBER_COLORS.secondary,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "4px",
                            }, children: [_jsx(Target, { size: 12 }), prop.confidence.toFixed(1), "% confidence"] }))] }), _jsxs("div", { style: {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                    }, children: [_jsxs("button", { onClick: () => onSelect(prop.id, "over"), style: {
                                padding: "12px",
                                borderRadius: "8px",
                                border: selectedChoice === "over"
                                    ? `2px solid ${CYBER_COLORS.primary}`
                                    : "1px solid rgba(255, 255, 255, 0.2)",
                                backgroundColor: selectedChoice === "over"
                                    ? `${CYBER_COLORS.primary}20`
                                    : "rgba(0, 255, 136, 0.1)",
                                color: selectedChoice === "over"
                                    ? CYBER_COLORS.primary
                                    : CYBER_COLORS.secondary,
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "4px",
                            }, children: [_jsx(TrendingUp, { size: 14 }), "OVER"] }), _jsxs("button", { onClick: () => onSelect(prop.id, "under"), style: {
                                padding: "12px",
                                borderRadius: "8px",
                                border: selectedChoice === "under"
                                    ? `2px solid ${CYBER_COLORS.primary}`
                                    : "1px solid rgba(255, 255, 255, 0.2)",
                                backgroundColor: selectedChoice === "under"
                                    ? `${CYBER_COLORS.primary}20`
                                    : "rgba(255, 71, 87, 0.1)",
                                color: selectedChoice === "under" ? CYBER_COLORS.primary : "#ff4757",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "4px",
                            }, children: [_jsx(TrendingDown, { size: 14 }), "UNDER"] })] }), prop.trend && (_jsxs("div", { style: {
                        position: "absolute",
                        bottom: "12px",
                        left: "12px",
                        fontSize: "10px",
                        color: prop.trend === "up"
                            ? CYBER_COLORS.primary
                            : prop.trend === "down"
                                ? "#ff4757"
                                : CYBER_COLORS.text.muted,
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                    }, children: [prop.trend === "up" && _jsx(TrendingUp, { size: 10 }), prop.trend === "down" && _jsx(TrendingDown, { size: 10 }), prop.trend === "stable" && _jsx(Activity, { size: 10 }), prop.trend] }))] }));
    };
    const handlePropSelect = (propId, choice) => {
        const prop = playerProps.find((p) => p.id === propId);
        if (!prop)
            return;
        setLineup((prev) => {
            const existing = prev.find((entry) => entry.propId === propId);
            if (existing) {
                if (existing.choice === choice) {
                    // Remove if same choice selected
                    return prev.filter((entry) => entry.propId !== propId);
                }
                else {
                    // Update choice
                    return prev.map((entry) => entry.propId === propId ? { ...entry, choice } : entry);
                }
            }
            else {
                // Add new selection (max 6 picks)
                if (prev.length >= 6)
                    return prev;
                return [...prev, { propId, choice, prop }];
            }
        });
    };
    const calculatePayout = () => {
        const multipliers = {
            2: 3,
            3: 5,
            4: 10,
            5: 20,
            6: 50,
        };
        const pickCount = lineup.length;
        if (pickCount < 2)
            return 0;
        return (entryAmount * (multipliers[pickCount] || 1));
    };
    return (_jsxs("div", { className: `mega-prizepicks ${className}`, style: {
            minHeight: "100vh",
            background: CYBER_GRADIENTS.background,
            padding: "24px",
        }, children: [_jsxs(MegaCard, { variant: "panel", style: { marginBottom: "24px", padding: "20px" }, children: [_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                        }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "title", style: { fontSize: "28px", marginBottom: "4px" }, children: "PrizePicks Pro" }), _jsx(CyberText, { variant: "body", color: "muted", children: "Professional player prop analysis with AI enhancement" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [_jsx(Trophy, { size: 16, color: CYBER_COLORS.primary }), _jsx(CyberText, { variant: "caption", color: "accent", children: "Elite Predictions" })] })] }), _jsx("div", { style: { display: "flex", gap: "8px" }, children: sports.map((sport) => (_jsx(CyberButton, { variant: selectedSport === sport ? "primary" : "secondary", active: selectedSport === sport, onClick: () => setSelectedSport(sport), style: { marginBottom: 0, width: "auto", padding: "8px 16px" }, children: sport }, sport))) })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }, children: [_jsx("div", { children: _jsx("div", { style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "20px",
                            }, children: filteredProps.map((prop) => (_jsx(PropCard, { prop: prop, onSelect: handlePropSelect }, prop.id))) }) }), _jsxs(MegaCard, { variant: "glass", padding: "lg", style: { height: "fit-content", position: "sticky", top: "24px" }, children: [_jsxs(CyberText, { variant: "title", style: {
                                    marginBottom: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                }, children: [_jsx(Target, { size: 20, style: { marginRight: "8px", color: CYBER_COLORS.primary } }), "Lineup Builder"] }), _jsxs("div", { style: { marginBottom: "16px" }, children: [_jsx(CyberText, { variant: "body", style: { marginBottom: "8px" }, children: "Entry Amount" }), _jsx("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [5, 10, 25, 50, 100].map((amount) => (_jsxs("button", { onClick: () => setEntryAmount(amount), style: {
                                                padding: "8px 12px",
                                                borderRadius: "6px",
                                                border: entryAmount === amount
                                                    ? `2px solid ${CYBER_COLORS.primary}`
                                                    : "1px solid rgba(255, 255, 255, 0.1)",
                                                backgroundColor: entryAmount === amount
                                                    ? `${CYBER_COLORS.primary}20`
                                                    : "rgba(255, 255, 255, 0.05)",
                                                color: entryAmount === amount
                                                    ? CYBER_COLORS.primary
                                                    : CYBER_COLORS.text.secondary,
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                            }, children: ["$", amount] }, amount))) })] }), _jsxs("div", { style: { marginBottom: "16px" }, children: [_jsxs(CyberText, { variant: "body", style: { marginBottom: "8px" }, children: ["Selected Picks (", lineup.length, "/6)"] }), _jsx("div", { style: { display: "grid", gap: "8px" }, children: lineup.map((entry, index) => (_jsx("div", { style: {
                                                padding: "12px",
                                                borderRadius: "8px",
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                                fontSize: "12px",
                                            }, children: _jsxs("div", { style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }, children: [_jsxs("div", { children: [_jsx(CyberText, { variant: "caption", style: { fontWeight: "600" }, children: entry.prop.playerName }), _jsxs("div", { style: { color: CYBER_COLORS.text.muted }, children: [entry.prop.statType, " ", entry.choice.toUpperCase(), " ", entry.prop.projectedValue] })] }), _jsx("button", { onClick: () => setLineup((prev) => prev.filter((e) => e.propId !== entry.propId)), style: {
                                                            background: "none",
                                                            border: "none",
                                                            color: "#ff4757",
                                                            cursor: "pointer",
                                                            padding: "4px",
                                                        }, children: _jsx(XCircle, { size: 16 }) })] }) }, entry.propId))) })] }), lineup.length >= 2 && (_jsxs("div", { style: {
                                    padding: "16px",
                                    borderRadius: "8px",
                                    backgroundColor: `${CYBER_COLORS.primary}20`,
                                    border: `1px solid ${CYBER_COLORS.primary}40`,
                                    marginBottom: "16px",
                                }, children: [_jsxs("div", { style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }, children: [_jsx(CyberText, { variant: "body", children: "Potential Payout:" }), _jsxs(CyberText, { variant: "title", style: { color: CYBER_COLORS.primary, fontSize: "20px" }, children: ["$", calculatePayout().toLocaleString()] })] }), _jsxs(CyberText, { variant: "caption", color: "muted", children: [lineup.length, " picks \u2022", " ", (calculatePayout() / entryAmount).toFixed(1), "x multiplier"] })] })), _jsx(MegaButton, { variant: "primary", disabled: lineup.length < 2, fullWidth: true, onClick: () => console.log("Submit lineup:", lineup), children: lineup.length < 2
                                    ? "Select 2+ Picks"
                                    : `Submit Lineup ($${entryAmount})` }), lineup.length < 2 && (_jsx(CyberText, { variant: "caption", color: "muted", style: { textAlign: "center", marginTop: "8px" }, children: "Minimum 2 picks required" }))] })] })] }));
};
export default MegaPrizePicks;
