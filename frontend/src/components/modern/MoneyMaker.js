import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import { PrizePicksAPI } from '../../services/PrizePicksAPI';
import { UnifiedBettingSystem } from '../../core/UnifiedBettingSystem';
import SHAPVisualization from '../shared/SHAPVisualization';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRiskProfile } from '@/hooks/useRiskProfile';
const defaultBettingContext = {
    bankroll: 1000,
    maxRiskPerBet: 100,
    minOdds: 1.1,
    maxOdds: 1000,
    odds: 1.5,
    metrics: {
        totalBets: 0,
        winRate: 0,
        roi: 0,
        profitLoss: 0,
        clvAverage: 0,
        edgeRetention: 0,
        kellyMultiplier: 0,
        marketEfficiencyScore: 0,
        averageOdds: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        betterThanExpected: 0,
    },
    recentBets: [],
    timestamp: Date.now(),
};
const MoneyMaker = () => {
    const [loading, setLoading] = useState(false);
    const [parlays, setParlays] = useState([]);
    const [selectedParlay, setSelectedParlay] = useState(null);
    const [error, setError] = useState(null);
    const bettingSystem = UnifiedBettingSystem.getInstance();
    const prizePicksAPI = PrizePicksAPI.getInstance();
    const addBet = useStore(state => state.addBet);
    const { riskProfile, validateBet } = useRiskProfile();
    useEffect(() => {
        generateParlays();
    }, []);
    const generateParlays = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch available projections
            const projections = await prizePicksAPI.getProjections({
                limit: 100,
            });
            // Group projections by sport and analyze each group
            const sportGroups = groupProjectionsBySport(projections);
            const parlayCards = [];
            for (const [sport, sportProjections] of Object.entries(sportGroups)) {
                // Analyze each projection in the sport group
                const decisions = await Promise.all(sportProjections.map(() => bettingSystem.analyzeBettingOpportunity(defaultBettingContext)));
                // Find high confidence projections
                const highConfidenceDecisions = decisions.filter(d => d.confidence > 0.7);
                // Generate parlays from high confidence projections
                const sportParlays = generateParlaysFromDecisions(highConfidenceDecisions, sportProjections);
                parlayCards.push(...sportParlays);
            }
            // Sort parlays by expected value
            const sortedParlays = parlayCards.sort((a, b) => b.expectedValue - a.expectedValue);
            setParlays(sortedParlays.slice(0, 10)); // Show top 10 parlays
        }
        catch (err) {
            setError('Failed to generate parlays. Please try again later.');
            console.error('Error generating parlays:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const groupProjectionsBySport = (projections) => {
        return projections.reduce((acc, proj) => {
            if (!acc[proj.sport]) {
                acc[proj.sport] = [];
            }
            acc[proj.sport].push(proj);
            return acc;
        }, {});
    };
    const generateParlaysFromDecisions = (decisions, projections) => {
        const parlays = [];
        const maxParlaySize = 3;
        // Generate combinations of 2-3 legs
        for (let size = 2; size <= maxParlaySize; size++) {
            const combinations = generateCombinations(decisions, size);
            for (const combo of combinations) {
                const projectionSet = combo
                    .map(decision => projections.find(p => p.playerId === decision.metadata.playerId))
                    .filter((p) => Boolean(p));
                if (projectionSet.length !== combo.length)
                    continue;
                // Calculate combined metrics
                const combinedConfidence = combo.reduce((acc, d) => acc * d.confidence, 1);
                const combinedEV = combo.reduce((acc, d) => acc + (d.metadata && d.metadata.riskScore ? d.metadata.riskScore : 0), 0) / combo.length;
                // Calculate potential payout
                const odds = combo.length === 2 ? 3 : 6; // Simplified odds calculation
                const potentialPayout = 100 * odds; // Assuming $100 stake
                // Combine analysis factors
                const historicalTrends = Array.from(new Set(combo.flatMap(d => d.analysis.historicalTrends)));
                const marketSignals = Array.from(new Set(combo.flatMap(d => d.analysis.marketSignals)));
                const riskFactors = Array.from(new Set(combo.flatMap(d => d.analysis.riskFactors)));
                parlays.push({
                    id: `parlay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    projections: projectionSet,
                    confidence: combinedConfidence,
                    expectedValue: combinedEV,
                    potentialPayout,
                    analysis: {
                        historicalTrends,
                        marketSignals,
                        riskFactors,
                    },
                });
            }
        }
        return parlays;
    };
    const generateCombinations = (arr, size) => {
        const result = [];
        function combine(current, start) {
            if (current.length === size) {
                result.push([...current]);
                return;
            }
            for (let i = start; i < arr.length; i++) {
                current.push(arr[i]);
                combine(current, i + 1);
                current.pop();
            }
        }
        combine([], 0);
        return result;
    };
    const placeBet = (parlay) => {
        // Validate bet against risk profile
        const betData = {
            stake: 100,
            confidence: parlay.confidence,
            kellyFraction: 0.1, // Example, replace with actual calculation if available
            sport: parlay.projections[0]?.sport || '',
            market: parlay.projections[0]?.propType || '',
            eventId: parlay.projections[0]?.eventId || '',
        };
        const validation = validateBet(betData);
        if (!validation.isValid) {
            setError('Bet does not meet risk profile: ' + validation.errors.join(', '));
            return;
        }
        // Create bet record
        const bet = {
            id: `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: 'current_user',
            propId: parlay.projections.map(p => p.id).join('_'),
            type: 'PARLAY',
            line: 0,
            odds: parlay.projections.length === 2 ? 3 : 6,
            stake: 100,
            result: 'pending',
            payout: parlay.potentialPayout,
            timestamp: Date.now(),
            metadata: {
                confidence: parlay.confidence,
                expectedValue: parlay.expectedValue,
                predictionFactors: [
                    ...(parlay.analysis.historicalTrends || []),
                    ...(parlay.analysis.marketSignals || []),
                ],
            },
        };
        // Add bet to store
        addBet(bet);
        // Clear selection
        setSelectedParlay(null);
    };
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [_jsx("strong", { className: "font-bold", children: "Error!" }), _jsxs("span", { className: "block sm:inline", children: [" ", error] })] }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "AI-Powered Parlay Suggestions" }), _jsx("button", { className: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50", disabled: loading, onClick: generateParlays, children: loading ? 'Generating...' : 'Generate New Parlays' })] }), loading ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: parlays.map(parlay => (_jsxs("div", { className: `bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform duration-200 ${selectedParlay === parlay.id ? 'ring-2 ring-indigo-500 transform scale-105' : ''}`, onClick: () => setSelectedParlay(parlay.id), children: [_jsx("div", { className: "bg-indigo-600 px-4 py-2", children: _jsxs("h3", { className: "text-lg font-semibold text-white", children: [parlay.projections.length, "-Leg Parlay"] }) }), _jsx("div", { className: "p-4 space-y-4", children: parlay.projections.map(proj => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-white", children: proj.playerName }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [proj.propType, " ", proj.line] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-medium text-gray-900 dark:text-white", children: [proj.team, " vs ", proj.opponent] }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: new Date(proj.gameTime).toLocaleDateString() })] })] }, proj.id))) }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 p-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Confidence" }), _jsxs("p", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [(parlay.confidence * 100).toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Expected Value" }), _jsxs("p", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [(parlay.expectedValue * 100).toFixed(1), "%"] })] })] }) }), _jsxs("div", { className: "border-t border-gray-200 dark:border-gray-700 p-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white mb-2", children: "Analysis" }), _jsxs("ul", { className: "text-sm text-gray-500 dark:text-gray-400 space-y-1", children: [parlay.analysis.historicalTrends.slice(0, 2).map((trend, i) => (_jsxs("li", { className: "flex items-center", children: [_jsx("span", { className: "w-2 h-2 bg-green-500 rounded-full mr-2" }), trend] }, i))), parlay.analysis.marketSignals.slice(0, 2).map((signal, i) => (_jsxs("li", { className: "flex items-center", children: [_jsx("span", { className: "w-2 h-2 bg-blue-500 rounded-full mr-2" }), signal] }, i)))] }), _jsxs(Accordion, { sx: { mt: 2 }, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, {}), children: _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Model Explanation (SHAP)" }) }), _jsxs(AccordionDetails, { children: [_jsx(SHAPVisualization, { explanations: [
                                                        ...parlay.analysis.historicalTrends.map((t, i) => ({
                                                            feature: t,
                                                            value: 1,
                                                            impact: 1,
                                                            direction: 'positive',
                                                        })),
                                                        ...parlay.analysis.marketSignals.map((t, i) => ({
                                                            feature: t,
                                                            value: 0.7,
                                                            impact: 0.7,
                                                            direction: 'positive',
                                                        })),
                                                        ...parlay.analysis.riskFactors.map((t, i) => ({
                                                            feature: t,
                                                            value: -0.5,
                                                            impact: -0.5,
                                                            direction: 'negative',
                                                        })),
                                                    ] }), _jsxs("div", { className: "mt-2", children: [_jsx("span", { className: "font-medium", children: "Rationale:" }), _jsxs("ul", { className: "list-disc ml-6", children: [parlay.analysis.historicalTrends.map((t, i) => (_jsx("li", { className: "text-sm text-gray-500 dark:text-gray-400", children: t }, i))), parlay.analysis.marketSignals.map((t, i) => (_jsx("li", { className: "text-sm text-gray-500 dark:text-gray-400", children: t }, i))), parlay.analysis.riskFactors.map((t, i) => (_jsx("li", { className: "text-sm text-gray-500 dark:text-gray-400", children: t }, i)))] })] })] })] })] }), selectedParlay === parlay.id && (_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900", children: _jsxs("button", { className: "w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700", onClick: () => placeBet(parlay), children: ["Place $100 Bet (Potential: $", parlay.potentialPayout, ")"] }) }))] }, parlay.id))) }))] }));
};
export default React.memo(MoneyMaker);
