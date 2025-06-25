import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import ArbitrageOpportunities from "./ArbitrageOpportunities";
import LiveOddsTicker from "./LiveOddsTicker"; // Changed to default import
import MLFactorViz from "./MLFactorViz";
import ModelPerformance from "./ModelPerformance";
import Navbar from "./navigation/Navbar";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { RiskProfileType } from "../types/betting"; // Import enum and PredictionData
const Dashboard = () => {
    const [_activeView, setActiveView] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // useToast removed as the hook is not found
    // State for PerformanceMetrics
    const [bankroll, _setBankroll] = useState(10000);
    const [profit, _setProfit] = useState(1500);
    const [riskProfile, _setRiskProfile] = useState(RiskProfileType.MODERATE); // Use enum
    const [recommendations, _setRecommendations] = useState([
        {
            id: "rec1",
            market: "Game A Winner",
            outcome: "Team X",
            stake: 100,
            odds: 1.5,
            potentialWin: 150,
            status: "won",
            result: "win",
            timestamp: new Date(),
        },
        {
            id: "rec2",
            market: "Game B Over/Under",
            outcome: "Over 2.5",
            stake: 50,
            odds: 2.0,
            potentialWin: 100,
            status: "lost",
            result: "loss",
            timestamp: new Date(),
        },
    ]);
    // State for LiveOddsTicker: Record<MarketName, Record<Bookmaker, Odds>>
    const [liveOddsData, _setLiveOddsData] = useState({
        "Game X Winner": { Bookie1: 1.85, Bookie2: 1.9 },
        "Game Y Total Points": { Bookie1: 200.5, Bookie3: 199.5 },
    });
    // State for Arbitrage Opportunities
    const [arbitrageOpportunities, _setArbitrageOpportunities] = useState([
        {
            id: "arb1",
            sport: "Soccer",
            event: "Team A vs Team B",
            market: "Match Winner",
            outcomes: [
                { bookmaker: "BookmakerX", name: "Team A", price: 2.0 },
                { bookmaker: "BookmakerY", name: "Draw", price: 3.5 },
                { bookmaker: "BookmakerZ", name: "Team B", price: 4.0 },
            ],
            profitPercentage: 2.5,
            lastUpdated: new Date(),
        },
        {
            id: "arb2",
            sport: "Basketball",
            event: "Team C vs Team D",
            market: "Total Points Over/Under 210.5",
            outcomes: [
                { bookmaker: "BookmakerP", name: "Over 210.5", price: 1.9 },
                { bookmaker: "BookmakerQ", name: "Under 210.5", price: 1.95 },
            ],
            profitPercentage: 1.8,
            lastUpdated: new Date(),
        },
    ]);
    // State for Model Performance (matches ModelMetrics type from src/types/prediction.ts)
    const [modelMetricsData, _setModelMetricsData] = useState({
        accuracy: 0.85,
        precision: 0.8,
        recall: 0.82,
        f1Score: 0.81,
        lastUpdated: new Date().toISOString(),
        winRate: 0.55,
        profitFactor: 0.1,
        averageOdds: 1.9,
        averageConfidence: 0.75,
        totalPredictions: 100,
        successfulPredictions: 55,
    });
    // State for ML Insights (original, potentially to be removed or refactored)
    const [_mlInsightsData, _setMlInsightsData] = useState([
        {
            id: "insight1",
            title: "High Value Bet Detected",
            description: "Strong signal for upcoming NBA game based on player performance.",
            confidence: 0.88,
            timestamp: new Date(),
        },
    ]);
    // State for MLFactorViz props
    const [currentPlayerId, _setCurrentPlayerId] = useState("player123");
    const [currentMetric, _setCurrentMetric] = useState("points");
    const [currentPredictionData, _setCurrentPredictionData] = useState({
        value: 25.5,
        confidence: 0.78,
        timestamp: Date.now(),
    });
    const [currentStrategyData, _setCurrentStrategyData] = useState({
        confidence: 0.65,
        expectedValue: 1.2,
    });
    useEffect(() => {
        // TEMPORARILY DISABLED FOR DEBUGGING WEBSOCKET ISSUES
        // Migrated to unified WebSocketManager
        // WebSocketManager.getInstance();
        console.log("Dashboard: Skipping WebSocketManager initialization for debugging");
        // Example WebSocket event listeners (currently commented out)
        // wsServiceInstance.on('arbitrageAlert', (data: any) => {
        //   console.log('Arbitrage Alert:', data);
        //   // Update arbitrageOpportunities state here
        // });
        // wsServiceInstance.on('oddsUpdate', (data: any) => {
        //   console.log('Odds Update:', data);
        //   // Update liveOddsData state here
        // });
        return () => {
            // Clean up WebSocket listeners if they were active
            // wsServiceInstance.off('arbitrageAlert');
            // wsServiceInstance.off('oddsUpdate');
            // Consider if disconnect is needed here or managed by WebSocketService singleton lifecycle
        };
    }, []);
    const _handleViewChange = (view) => {
        setActiveView(view);
    };
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleMenuClick = () => {
        console.log("Menu clicked");
        toggleSidebar();
    };
    const handleSmartSidebarClick = () => {
        console.log("Smart sidebar clicked");
    };
    return (_jsx("div", { className: "flex h-screen bg-gray-100 dark:bg-gray-900", children: _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(Navbar, { onMenuClick: handleMenuClick, onSmartSidebarClick: handleSmartSidebarClick }), _jsxs("main", { className: "flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 pt-20", children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-800 dark:text-white mb-6", children: "AI Sports Betting Dashboard" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 dark:text-white mb-3", children: "Model Performance" }), _jsx(ModelPerformance, { modelMetricsData: modelMetricsData })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 dark:text-white mb-3", children: "Performance Metrics" }), _jsx(PerformanceMetrics, { bankroll: bankroll, profit: profit, recommendations: recommendations, riskProfile: riskProfile })] }), _jsxs("div", { className: "md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 shadow rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 dark:text-white mb-3", children: "Live Odds" }), _jsx(LiveOddsTicker, { data: liveOddsData })] }), _jsxs("div", { className: "lg:col-span-1 bg-white dark:bg-gray-800 shadow rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 dark:text-white mb-3", children: "Money Maker" }), _jsx(MoneyMaker, {})] }), _jsxs("div", { className: "lg:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 dark:text-white mb-3", children: "Arbitrage Opportunities" }), _jsx(ArbitrageOpportunities, { opportunities: arbitrageOpportunities })] }), _jsxs("div", { className: "md:col-span-1 lg:col-span-3 bg-white dark:bg-gray-800 shadow rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 dark:text-white mb-3", children: "ML Factor Viz" }), _jsx(MLFactorViz, { metric: currentMetric, playerId: currentPlayerId, prediction: currentPredictionData, strategy: currentStrategyData })] })] })] })] }) }));
};
export default React.memo(Dashboard);
