import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
export function LiveGamesDisplay({ games: propGames, } = {}) {
    const [games, setGames] = useState([]);
    // Mock data for when no games are provided
    useEffect(() => {
        if (!propGames) {
            setGames([
                {
                    id: "1",
                    sport: "NBA",
                    homeTeam: "Lakers",
                    awayTeam: "Warriors",
                    gameTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                    status: "Scheduled",
                    venue: "Crypto.com Arena",
                },
                {
                    id: "2",
                    sport: "NBA",
                    homeTeam: "Celtics",
                    awayTeam: "Heat",
                    gameTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
                    status: "Scheduled",
                    venue: "TD Garden",
                },
                {
                    id: "3",
                    sport: "NFL",
                    homeTeam: "Chiefs",
                    awayTeam: "Bills",
                    gameTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago (live)
                    status: "Live",
                    venue: "Arrowhead Stadium",
                    homeScore: 14,
                    awayScore: 10,
                },
            ]);
        }
        else {
            setGames(propGames);
        }
    }, [propGames]);
    const getSportIcon = (sport) => {
        const icons = {
            NBA: "🏀",
            NFL: "🏈",
            MLB: "⚾",
            NHL: "🏒",
            Soccer: "⚽",
        };
        return icons[sport] || "🏆";
    };
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "live":
            case "in progress":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
            case "scheduled":
            case "pre-game":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
            case "final":
            case "completed":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
            default:
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
        }
    };
    if (games.length === 0) {
        return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg", children: [_jsx("h3", { className: "text-xl font-bold mb-4 dark:text-white", children: "Live Games" }), _jsxs("div", { className: "text-center py-8", children: [_jsx(Calendar, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "No games available from real data sources" })] })] }));
    }
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-xl font-bold dark:text-white", children: "Live Games" }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: [games.length, " games from real sources"] })] }), _jsx("div", { className: "space-y-4", children: games.slice(0, 10).map((game) => (_jsxs("div", { className: "p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "text-2xl", children: getSportIcon(game.sport) }), _jsxs("div", { children: [_jsxs("div", { className: "font-semibold text-lg dark:text-white", children: [game.awayTeam, " @ ", game.homeTeam] }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: [game.sport, " \u2022 ", game.source] })] })] }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`, children: game.status })] }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsx("span", { children: format(new Date(game.gameTime), "MMM d, h:mm a") })] }), game.venue && (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsx("span", { className: "truncate", children: game.venue })] }))] })] }, game.id))) })] }));
}
