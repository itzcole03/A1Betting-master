import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import useStore from "../store/useStore";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EntryStatus, LineupType } from "../types/core";
import { getErrorMessage } from "../utils/errorUtils";
import { isTeamDiversified, validateEntry } from "../utils/businessRules";
import { oddsToDecimal, calculatePotentialPayout, calculateWinProbability, } from "../utils/odds";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSentimentBadge = (sentiment) => {
    if (!sentiment)
        return null;
    const color = sentiment.direction === "up"
        ? "bg-green-100 text-green-700"
        : sentiment.direction === "down"
            ? "bg-red-100 text-red-700"
            : "bg-gray-200 text-gray-700";
    const icon = sentiment.direction === "up"
        ? "▲"
        : sentiment.direction === "down"
            ? "▼"
            : "−";
    return (_jsxs("span", { className: `ml-2 px-2 py-1 rounded-full text-xs ${color} cursor-help`, title: sentiment.tooltip || "", children: [icon, " ", sentiment.score] }));
};
// Map confidence to emoji (example logic)
function getPropEmoji(confidence) {
    if (confidence >= 80)
        return "💰";
    if (confidence <= 35)
        return "👹";
    return "⇄";
}
export const BetBuilder = () => {
    // Use only selectedProps for betslip UI
    const selectedProps = useStore((s) => s.selectedProps);
    const props = useStore((s) => s.props);
    const togglePropSelection = useStore((s) => s.togglePropSelection);
    const addEntry = useStore((s) => s.addEntry);
    // Create helper functions for prop selection
    const clearSelectedProps = () => {
        selectedProps.forEach((propId) => togglePropSelection(propId));
    };
    const [entry, setEntry] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // Get actual prop objects from selectedProps IDs
    const selectedPropObjects = selectedProps
        .map((propId) => props.find((p) => p.id === propId))
        .filter(Boolean);
    // Odds and payout calculation
    const oddsArr = selectedPropObjects.map((p) => p.odds?.toString() || "2.0");
    const payout = calculatePotentialPayout(entry, oddsArr);
    const winProb = calculateWinProbability(selectedPropObjects.map((p) => p.confidence || 50));
    // Team diversification check
    const diversified = isTeamDiversified(selectedPropObjects);
    // Combined odds (decimal)
    const combinedDecimal = oddsArr.reduce((acc, o) => acc * oddsToDecimal(o), 1);
    // Handle prop selection (no-op, as only selectedProps are shown)
    // In a real app, you would source PlayerProp[] from a dedicated prop list, not players[]
    // Submit betslip
    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);
        if (selectedPropObjects.length < 2) {
            setError("You must select at least 2 picks.");
            return;
        }
        if (!diversified) {
            setError("Too many props from the same team.");
            return;
        }
        const entryObj = {
            id: `entry-${Date.now()}`,
            userId: "user-1",
            status: EntryStatus.PENDING,
            type: LineupType.PARLAY,
            props: selectedProps,
            stake: entry,
            potentialWinnings: payout,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const validationErrors = validateEntry(entryObj);
        if (validationErrors.length) {
            setError(validationErrors.join(" "));
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/entries/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entryObj),
            });
            if (!res.ok) {
                const err = await res.json();
                setError(getErrorMessage(err));
                setLoading(false);
                return;
            }
            addEntry(entryObj);
            setSuccess("Entry submitted successfully!");
            clearSelectedProps();
        }
        catch (err) {
            setError(getErrorMessage(err));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsx("div", { className: "px-4 py-3 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Bet Builder" }) }), _jsxs("div", { className: "p-4 bg-gray-50 border-b border-gray-200 flex gap-4 items-center", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Entry" }), _jsxs("div", { className: "premium-input-container w-24", children: [_jsx("span", { className: "currency-symbol", children: "$" }), _jsx("input", { className: "premium-input text-gray-900", max: 1000, min: 1, type: "number", value: entry, onChange: (e) => setEntry(Number(e.target.value)) })] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Payout" }), _jsxs("div", { className: "text-xl font-bold text-green-600", children: ["$", payout.toFixed(2)] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Win Prob" }), _jsxs("div", { className: "text-xl font-bold text-blue-600", children: [winProb.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Combined Odds" }), _jsx("div", { className: "text-xl font-bold text-purple-600", children: combinedDecimal.toFixed(2) })] })] }), selectedPropObjects.length > 0 && (_jsxs("div", { className: "p-4 border-t border-gray-200", children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 mb-3", children: "Your Picks" }), _jsx("div", { className: "space-y-2", children: selectedPropObjects.map((leg, idx) => (_jsxs("div", { className: "flex justify-between items-center p-3 rounded-lg glass", children: [_jsxs("div", { children: [_jsxs("span", { className: "font-bold text-gray-900", children: [leg.player?.name || "Unknown Player", " ", leg.type || "Unknown Type", " ", leg.line || "N/A"] }), _jsx("span", { className: "ml-2 text-2xl", children: getPropEmoji(leg.confidence || 50) })] }), _jsx("div", { className: "text-right", children: _jsxs("span", { className: "font-bold text-blue-600", children: [leg.confidence || 50, "%"] }) })] }, idx))) })] })), error && (_jsx("div", { className: "p-4 text-red-600 text-sm font-medium", children: error })), success && (_jsx("div", { className: "p-4 text-green-600 text-sm font-medium", children: success })), _jsx("div", { className: "p-4 border-t flex justify-end", children: _jsx("button", { className: "modern-button bg-primary-500 text-white px-8 py-3 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed", disabled: loading || selectedPropObjects.length < 2, onClick: handleSubmit, children: loading ? (_jsx("span", { className: "loading-spinner-premium" })) : ("Submit Entry") }) })] }));
};
