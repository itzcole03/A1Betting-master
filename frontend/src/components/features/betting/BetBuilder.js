import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useStore } from "../../../stores/useStore";
import { getErrorMessage } from "../../../utils/errorUtils";
import { isTeamDiversified, validateEntry } from "../../../utils/businessRules";
import { oddsToDecimal, calculatePotentialPayout, calculateWinProbability, } from "../../../utils/odds";
import { SmartControlsBar } from "../../../components/controls/SmartControlsBar";
import GlassCard from "../../../components/ui/GlassCard";
import EnhancedPropCard from "../../../components/ui/EnhancedPropCard";
import PredictionExplanationOverlay from "../../../components/ui/PredictionExplanationOverlay";
import { PayoutPreview } from "../../../components/PayoutPreview";
export const BetBuilder = () => {
    const selectedProps = useStore((s) => s.selectedProps);
    const clearSelectedProps = useStore((s) => s.clearSelectedProps);
    const addEntry = useStore((s) => s.addEntry);
    const [entry, setEntry] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [overlayOpen, setOverlayOpen] = useState(false);
    // Odds and payout calculation
    const oddsArr = selectedProps.map((p) => p.odds.toString());
    const payout = calculatePotentialPayout(entry, oddsArr);
    const winProb = calculateWinProbability(selectedProps.map((p) => p.confidence));
    const diversified = isTeamDiversified(selectedProps);
    const combinedDecimal = oddsArr.reduce((acc, o) => acc * oddsToDecimal(o), 1);
    // Bonus and enhancement (placeholder logic)
    const bonusPercent = selectedProps.length * 2; // Example: 2% per pick
    const enhancementPercent = selectedProps.reduce((acc, p) => acc + (p.aiBoost || 0), 0) / (selectedProps.length || 1);
    // Submit betslip
    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);
        if (selectedProps.length < 2) {
            setError("You must select at least 2 picks.");
            return;
        }
        if (!diversified) {
            setError("Too many props from the same team.");
            return;
        }
        const entryObj = {
            id: "",
            userId: "",
            status: "pending",
            type: "parlay",
            props: selectedProps,
            stake: entry,
            potentialPayout: payout,
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
    // Add missing variable/type definitions for props, isLoadingProps, propsError, availableProps, handleSelect, handleViewDetails, riskMultiplier, projectedEV
    // For demonstration, use placeholders or simple logic if not already defined
    const isLoadingProps = false;
    const propsError = null;
    const availableProps = [];
    const handleSelect = (prop, pick) => { };
    const handleViewDetails = (prop) => { };
    const riskMultiplier = 1.0;
    const projectedEV = 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(SmartControlsBar, { className: "mb-4 glass-card animate-fade-in" }), _jsx("div", { className: "flex-1 space-y-4", children: _jsxs(GlassCard, { className: "p-4 animate-scale-in", children: [_jsx("h2", { className: "text-xl font-bold mb-2 text-primary-600", children: "Available Props" }), isLoadingProps && (_jsx("div", { className: "text-gray-400", children: "Loading props..." })), propsError && (_jsx("div", { className: "text-red-500", children: "Failed to load props." })), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: availableProps.map((prop) => (_jsx(EnhancedPropCard, { playerName: prop.player?.name || prop.playerName, statType: prop.type, line: prop.line, overOdds: prop.odds?.over ?? prop.overOdds, underOdds: prop.odds?.under ?? prop.underOdds, sentiment: prop.sentiment, aiBoost: prop.aiBoost, patternStrength: prop.patternStrength, bonusPercent: bonusPercent, enhancementPercent: enhancementPercent, selected: selectedProps.some((p) => p.id === prop.id), onSelect: (pick) => handleSelect(prop, pick), onViewDetails: () => handleViewDetails(prop), className: "transition-transform duration-200 hover:scale-105" }, prop.id))) })] }) }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsx(GlassCard, { className: "p-4 animate-fade-in", children: _jsx("div", { className: "flex flex-col gap-4", children: _jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Entry" }), _jsxs("div", { className: "premium-input-container w-24", children: [_jsx("span", { className: "currency-symbol", children: "$" }), _jsx("input", { className: "premium-input text-gray-900", max: 1000, min: 1, type: "number", value: entry, onChange: (e) => setEntry(Number(e.target.value)) })] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Payout" }), _jsxs("div", { className: "text-xl font-bold text-green-600 animate-glow", children: ["$", payout.toFixed(2)] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Win Prob" }), _jsxs("div", { className: "text-xl font-bold text-blue-600", children: [winProb.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Combined Odds" }), _jsx("div", { className: "text-xl font-bold text-purple-600", children: combinedDecimal.toFixed(2) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Bonus %" }), _jsxs("div", { className: "text-lg text-green-500 font-bold", children: [bonusPercent, "%"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Enhance %" }), _jsxs("div", { className: "text-lg text-blue-500 font-bold", children: [enhancementPercent.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Risk Multiplier" }), _jsxs("div", { className: "text-lg text-yellow-500 font-bold", children: [riskMultiplier.toFixed(2), "x"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 font-medium", children: "Projected EV" }), _jsx("div", { className: `text-lg font-bold ${projectedEV >= 0 ? "text-green-600" : "text-red-500"}`, children: projectedEV.toFixed(2) })] })] }) }) }), _jsxs(GlassCard, { className: "p-4 animate-fade-in", children: [_jsx("h3", { className: "text-lg font-semibold text-primary-600 mb-2", children: "Your Picks" }), selectedProps.length === 0 && (_jsx("div", { className: "text-gray-400 dark:text-gray-500", children: "No picks selected yet." })), _jsx("div", { className: "space-y-2", children: selectedProps.map((leg) => (_jsx(EnhancedPropCard, { playerName: leg.player?.name || leg.playerName, statType: leg.type, line: leg.line, overOdds: leg.odds?.over ?? leg.overOdds, underOdds: leg.odds?.under ?? leg.underOdds, sentiment: leg.sentiment, aiBoost: leg.aiBoost, patternStrength: leg.patternStrength, bonusPercent: bonusPercent, enhancementPercent: enhancementPercent, selected: true, onSelect: (pick) => handleSelect(leg, pick), onViewDetails: () => handleViewDetails(leg), className: "opacity-90" }, leg.id))) }), selectedProps.length > 0 && (_jsx("div", { className: "mt-6 animate-fade-in", children: _jsx(PayoutPreview, { eventId: selectedProps[0].id }) }))] }), error && (_jsx("div", { className: "p-4 text-red-600 text-sm font-medium", children: error })), success && (_jsx("div", { className: "p-4 text-green-600 text-sm font-medium", children: success })), _jsx("div", { className: "flex justify-end", children: _jsx("button", { className: "modern-button bg-primary-500 text-white px-8 py-3 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed", disabled: loading || selectedProps.length < 2, onClick: handleSubmit, children: loading ? (_jsx("span", { className: "loading-spinner-premium" })) : ("Submit Entry") }) })] }), _jsx(PredictionExplanationOverlay, { open: overlayOpen, onClose: () => setOverlayOpen(false), data: {} })] }));
};
