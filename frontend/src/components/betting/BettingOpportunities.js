import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GlassCard from '../ui/GlassCard';
import EnhancedPropCard from '../ui/EnhancedPropCard';
import GlowButton from '../ui/GlowButton';
import Tooltip from '../ui/Tooltip';
import { formatCurrency, formatPercentage, formatOdds } from '../../utils/formatters';
export const BettingOpportunities = ({ opportunities, onBetPlacement, alerts, isLoading, }) => {
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center p-6", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" }) }));
    }
    if (opportunities.length === 0) {
        return (_jsx(GlassCard, { className: "mb-3", children: _jsx("div", { className: "text-blue-600 font-semibold", children: "No betting opportunities available at the moment." }) }));
    }
    const isBetRecommendation = (opp) => {
        return 'confidence_score' in opp && 'expected_roi' in opp && 'recommended_stake' in opp;
    };
    return (_jsxs("div", { className: "space-y-4", children: [alerts.map((alert, index) => (_jsx(GlassCard, { className: "mb-2", children: _jsx("div", { className: "text-yellow-600 font-semibold", children: alert.message }) }, index))), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: opportunities.map((opportunity, idx) => (_jsxs(GlassCard, { children: [_jsx(EnhancedPropCard, { playerName: opportunity.playerName || opportunity.prediction?.playerName || '', team: opportunity.team || '', position: opportunity.position || '', statType: opportunity.statType || '', line: opportunity.line || 0, overOdds: opportunity.overOdds || opportunity.odds || 0, underOdds: opportunity.underOdds || opportunity.odds || 0, aiBoost: opportunity.aiBoost, patternStrength: opportunity.patternStrength, bonusPercent: opportunity.bonusPercent, enhancementPercent: opportunity.enhancementPercent, pickType: opportunity.pickType, trendValue: opportunity.trendValue, gameInfo: opportunity.gameInfo, playerImageUrl: opportunity.playerImageUrl, onSelect: () => onBetPlacement(opportunity), onViewDetails: () => { } }), _jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Tooltip, { content: "Confidence score for this bet.", children: _jsxs("span", { className: `px-2 py-1 rounded-full text-xs font-bold ${isBetRecommendation(opportunity)
                                                    ? opportunity.confidence_score > 0.7
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    : opportunity.confidence > 0.7
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'}`, children: [formatPercentage(isBetRecommendation(opportunity) ? opportunity.confidence_score : opportunity.confidence), ' ', "Confidence"] }) }), _jsx(Tooltip, { content: "Expected ROI for this bet.", children: _jsxs("span", { className: "px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700", children: [formatPercentage(isBetRecommendation(opportunity) ? opportunity.expected_roi : opportunity.marketEdge), ' ', "ROI"] }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Tooltip, { content: "Recommended stake for this bet.", children: _jsxs("span", { className: "px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700", children: [formatCurrency(isBetRecommendation(opportunity) ? opportunity.recommended_stake : 0), " Stake"] }) }), _jsx(Tooltip, { content: "Odds for this bet.", children: _jsx("span", { className: "px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700", children: formatOdds(opportunity.odds) }) }), _jsx(Tooltip, { content: "Win probability for this bet.", children: _jsxs("span", { className: "px-2 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700", children: [formatPercentage(isBetRecommendation(opportunity) ? opportunity.prediction?.home_win_probability : opportunity.prediction), ' ', "Win Prob"] }) })] }), _jsx(GlowButton, { onClick: () => onBetPlacement(opportunity), className: "w-full mt-2", children: "Place Bet" })] })] }, isBetRecommendation(opportunity) ? opportunity.event_id : opportunity.id))) })] }));
};
