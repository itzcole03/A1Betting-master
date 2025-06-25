import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Target, Clock, Zap, BarChart3, Search, RefreshCw, Play, Pause, } from "lucide-react";
import { useBetting, useUser, useUI, } from "../../store/unified/UnifiedStoreManager";
const UnifiedBettingInterface = () => {
    const [liveGames, setLiveGames] = useState([]);
    const [selectedSport, setSelectedSport] = useState("all");
    const [selectedMarket, setSelectedMarket] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("value");
    const [isLiveMode, setIsLiveMode] = useState(true);
    const [selectedBet, setSelectedBet] = useState(null);
    const [stakeAmount, setStakeAmount] = useState(0);
    const { bankroll, addBet, opportunities } = useBetting();
    const { preferences } = useUser();
    const { addToast } = useUI();
    useEffect(() => {
        const loadLiveGames = async () => {
            try {
                // Mock live games data - in real app, this would come from data pipeline
                const mockGames = [
                    {
                        id: "game-1",
                        sport: "NBA",
                        homeTeam: "Los Angeles Lakers",
                        awayTeam: "Golden State Warriors",
                        status: "live",
                        startTime: new Date(),
                        liveScore: {
                            home: 78,
                            away: 82,
                            period: "3rd Quarter",
                            timeRemaining: "8:45",
                        },
                        markets: [
                            {
                                id: "market-1",
                                name: "Lakers vs Warriors - Moneyline",
                                sport: "NBA",
                                event: "Lakers vs Warriors",
                                type: "moneyline",
                                odds: [
                                    {
                                        eventId: "game-1",
                                        bookmaker: "DraftKings",
                                        market: "moneyline",
                                        outcomes: [
                                            { name: "Lakers", odds: 2.1 },
                                            { name: "Warriors", odds: 1.8 },
                                        ],
                                        timestamp: Date.now(),
                                    },
                                ],
                                volume: 85000,
                                lastUpdate: new Date(),
                                trend: "up",
                                valueScore: 8.5,
                            },
                            {
                                id: "market-2",
                                name: "Lakers vs Warriors - Total Points",
                                sport: "NBA",
                                event: "Lakers vs Warriors",
                                type: "total",
                                odds: [
                                    {
                                        eventId: "game-1",
                                        bookmaker: "FanDuel",
                                        market: "totals",
                                        outcomes: [
                                            { name: "Over 225.5", odds: 1.9 },
                                            { name: "Under 225.5", odds: 1.9 },
                                        ],
                                        timestamp: Date.now(),
                                    },
                                ],
                                volume: 92000,
                                lastUpdate: new Date(),
                                trend: "down",
                                valueScore: 7.2,
                            },
                        ],
                    },
                    {
                        id: "game-2",
                        sport: "NBA",
                        homeTeam: "Boston Celtics",
                        awayTeam: "Miami Heat",
                        status: "scheduled",
                        startTime: new Date(Date.now() + 3600000), // 1 hour from now
                        markets: [
                            {
                                id: "market-3",
                                name: "Celtics vs Heat - Spread",
                                sport: "NBA",
                                event: "Celtics vs Heat",
                                type: "spread",
                                odds: [
                                    {
                                        eventId: "game-2",
                                        bookmaker: "BetMGM",
                                        market: "spreads",
                                        outcomes: [
                                            { name: "Celtics -4.5", odds: 1.91 },
                                            { name: "Heat +4.5", odds: 1.91 },
                                        ],
                                        timestamp: Date.now(),
                                    },
                                ],
                                volume: 67000,
                                lastUpdate: new Date(),
                                trend: "stable",
                                valueScore: 9.1,
                            },
                        ],
                    },
                ];
                setLiveGames(mockGames);
            }
            catch (error) {
                addToast({
                    type: "error",
                    title: "Loading Failed",
                    message: "Failed to load live betting markets",
                });
            }
        };
        loadLiveGames();
        if (isLiveMode) {
            const interval = setInterval(loadLiveGames, 5000); // Update every 5 seconds in live mode
            return () => clearInterval(interval);
        }
    }, [isLiveMode, addToast]);
    const filteredMarkets = liveGames
        .flatMap((game) => game.markets)
        .filter((market) => {
        const matchesSport = selectedSport === "all" || market.sport === selectedSport;
        const matchesMarket = selectedMarket === "all" || market.type === selectedMarket;
        const matchesSearch = searchTerm === "" ||
            market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            market.event.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSport && matchesMarket && matchesSearch;
    })
        .sort((a, b) => {
        switch (sortBy) {
            case "value":
                return b.valueScore - a.valueScore;
            case "volume":
                return b.volume - a.volume;
            case "odds":
                return ((a.odds[0]?.outcomes[0]?.odds || 0) -
                    (b.odds[0]?.outcomes[0]?.odds || 0));
            default:
                return 0;
        }
    });
    const placeBet = (market, outcome, odds, amount) => {
        if (amount > bankroll) {
            addToast({
                type: "error",
                title: "Insufficient Funds",
                message: "Bet amount exceeds available bankroll",
            });
            return;
        }
        if (amount < 1) {
            addToast({
                type: "error",
                title: "Invalid Amount",
                message: "Bet amount must be at least $1",
            });
            return;
        }
        addBet({
            eventId: market.id,
            amount,
            odds,
            status: "active",
        });
        addToast({
            type: "success",
            title: "Bet Placed",
            message: `${outcome} - $${amount} at ${odds}`,
        });
        setSelectedBet(null);
        setStakeAmount(0);
    };
    const getTrendIcon = (trend) => {
        switch (trend) {
            case "up":
                return _jsx(TrendingUp, { className: "w-4 h-4 text-green-500" });
            case "down":
                return _jsx(TrendingDown, { className: "w-4 h-4 text-red-500" });
            default:
                return _jsx(BarChart3, { className: "w-4 h-4 text-gray-500" });
        }
    };
    const getValueColor = (score) => {
        if (score >= 8)
            return "text-green-600 bg-green-100";
        if (score >= 6)
            return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };
    const MarketCard = ({ market }) => {
        const game = liveGames.find((g) => g.markets.includes(market));
        return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white text-sm", children: market.event }), _jsxs("div", { className: "flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: market.sport }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: market.type.toUpperCase() }), game?.status === "live" && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsx("span", { className: "text-red-500 font-medium", children: "LIVE" })] }))] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [getTrendIcon(market.trend), _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${getValueColor(market.valueScore)}`, children: market.valueScore.toFixed(1) })] })] }), game?.liveScore && (_jsxs("div", { className: "mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { children: [game.homeTeam, ": ", game.liveScore.home] }), _jsx("span", { className: "font-medium", children: game.liveScore.period }), _jsxs("span", { children: [game.awayTeam, ": ", game.liveScore.away] })] }), game.liveScore.timeRemaining && (_jsx("div", { className: "text-center text-gray-500 dark:text-gray-400 mt-1", children: game.liveScore.timeRemaining }))] })), _jsx("div", { className: "space-y-2 mb-3", children: market.odds[0]?.outcomes.map((outcome, index) => (_jsxs("button", { onClick: () => {
                            setSelectedBet(market);
                            setStakeAmount(preferences.bankrollPercentage * bankroll);
                        }, className: "w-full flex items-center justify-between p-2 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: [_jsx("span", { className: "font-medium text-gray-900 dark:text-white text-sm", children: outcome.name }), _jsx("span", { className: "font-bold text-blue-600", children: outcome.odds.toFixed(2) })] }, index))) }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-600 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(BarChart3, { className: "w-3 h-3" }), _jsxs("span", { children: ["Volume: $", market.volume.toLocaleString()] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "w-3 h-3" }), _jsx("span", { children: market.lastUpdate.toLocaleTimeString() })] })] })] }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Unified Betting Interface" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Real-time betting markets with AI-powered value analysis" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-xl font-bold text-gray-900 dark:text-white", children: ["$", bankroll.toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Bankroll" })] }), _jsxs("button", { onClick: () => setIsLiveMode(!isLiveMode), className: `flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${isLiveMode
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`, children: [isLiveMode ? (_jsx(Play, { className: "w-4 h-4" })) : (_jsx(Pause, { className: "w-4 h-4" })), _jsx("span", { children: isLiveMode ? "LIVE" : "PAUSED" })] })] })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Search markets...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" })] }), _jsxs("select", { value: selectedSport, onChange: (e) => setSelectedSport(e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "all", children: "All Sports" }), _jsx("option", { value: "NBA", children: "NBA" }), _jsx("option", { value: "NFL", children: "NFL" }), _jsx("option", { value: "MLB", children: "MLB" }), _jsx("option", { value: "EPL", children: "EPL" })] }), _jsxs("select", { value: selectedMarket, onChange: (e) => setSelectedMarket(e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "all", children: "All Markets" }), _jsx("option", { value: "moneyline", children: "Moneyline" }), _jsx("option", { value: "spread", children: "Spread" }), _jsx("option", { value: "total", children: "Totals" }), _jsx("option", { value: "props", children: "Player Props" })] }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", children: [_jsx("option", { value: "value", children: "Sort by Value" }), _jsx("option", { value: "volume", children: "Sort by Volume" }), _jsx("option", { value: "odds", children: "Sort by Odds" })] }), _jsxs("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), _jsx("span", { children: "Refresh" })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Target, { className: "w-5 h-5 text-blue-600" }), _jsxs("div", { children: [_jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: filteredMarkets.length }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Markets" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Zap, { className: "w-5 h-5 text-green-600" }), _jsxs("div", { children: [_jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: liveGames.filter((g) => g.status === "live").length }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Live Games" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-purple-600" }), _jsxs("div", { children: [_jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: opportunities.length }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Opportunities" })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(BarChart3, { className: "w-5 h-5 text-yellow-600" }), _jsxs("div", { children: [_jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: filteredMarkets.length > 0
                                                ? (filteredMarkets.reduce((sum, m) => sum + m.valueScore, 0) / filteredMarkets.length).toFixed(1)
                                                : "0.0" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Avg Value" })] })] }) })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4", children: filteredMarkets.map((market) => (_jsx(MarketCard, { market: market }, market.id))) }), filteredMarkets.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-gray-400 text-6xl mb-4", children: "\uD83C\uDFAF" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "No markets found" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Try adjusting your filters or check back later for new opportunities" })] })), selectedBet && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Place Bet" }), _jsx("div", { className: "mb-4", children: _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-2", children: selectedBet.name }) }), _jsx("div", { className: "space-y-3 mb-4", children: selectedBet.odds[0]?.outcomes.map((outcome, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg", children: [_jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: outcome.name }), _jsx("span", { className: "font-bold text-blue-600", children: outcome.odds.toFixed(2) })] }, index))) }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Stake Amount" }), _jsx("input", { type: "number", value: stakeAmount, onChange: (e) => setStakeAmount(parseFloat(e.target.value) || 0), min: "1", max: bankroll, step: "0.01", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1", children: [_jsx("span", { children: "Min: $1" }), _jsxs("span", { children: ["Max: $", bankroll.toLocaleString()] })] })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: () => {
                                        setSelectedBet(null);
                                        setStakeAmount(0);
                                    }, className: "flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700", children: "Cancel" }), _jsx("button", { onClick: () => {
                                        const outcome = selectedBet.odds[0]?.outcomes[0];
                                        if (outcome) {
                                            placeBet(selectedBet, outcome.name, outcome.odds, stakeAmount);
                                        }
                                    }, disabled: stakeAmount <= 0 || stakeAmount > bankroll, className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed", children: "Place Bet" })] })] }) }))] }));
};
export default UnifiedBettingInterface;
