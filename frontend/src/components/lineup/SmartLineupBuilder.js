import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Star, DollarSign, TrendingUp, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
export const SmartLineupBuilder = () => {
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [remainingSalary, setRemainingSalary] = useState(50000);
    const [lineup] = useState({
        projectedTotal: 0,
        ownership: 0,
        ceiling: 0,
        floor: 0,
    });
    const [availablePlayers] = useState([
        {
            id: "1",
            name: "LeBron James",
            position: "SF",
            team: "LAL",
            salary: 11200,
            projectedPoints: 52.4,
            ownership: 25.3,
            value: 4.68,
            tier: "elite",
        },
        {
            id: "2",
            name: "Steph Curry",
            position: "PG",
            team: "GSW",
            salary: 10800,
            projectedPoints: 48.7,
            value: 4.51,
            ownership: 22.1,
            tier: "elite",
        },
        {
            id: "3",
            name: "Nikola Jokic",
            position: "C",
            team: "DEN",
            salary: 12000,
            projectedPoints: 55.2,
            ownership: 18.9,
            value: 4.6,
            tier: "elite",
        },
        {
            id: "4",
            name: "Tyler Herro",
            position: "SG",
            team: "MIA",
            salary: 7400,
            projectedPoints: 32.8,
            ownership: 12.5,
            value: 4.43,
            tier: "core",
        },
        {
            id: "5",
            name: "Draymond Green",
            position: "PF",
            team: "GSW",
            salary: 5200,
            projectedPoints: 28.1,
            ownership: 8.7,
            value: 5.4,
            tier: "value",
        },
    ]);
    const getTierColor = (tier) => {
        switch (tier) {
            case "elite":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "core":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "value":
                return "bg-green-100 text-green-800 border-green-200";
            case "punt":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
    const addPlayer = (player) => {
        if (selectedPlayers.length < 8 && remainingSalary >= player.salary) {
            setSelectedPlayers([...selectedPlayers, player]);
            setRemainingSalary(remainingSalary - player.salary);
        }
    };
    const removePlayer = (playerId) => {
        const player = selectedPlayers.find((p) => p.id === playerId);
        if (player) {
            setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
            setRemainingSalary(remainingSalary + player.salary);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "\uD83D\uDCCB Smart Lineup Builder" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "AI-powered daily fantasy lineup optimization with advanced analytics" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5 text-blue-500" }), "Current Lineup (", selectedPlayers.length, "/8)"] }) }), _jsx(CardContent, { children: selectedPlayers.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No players selected. Start building your lineup!" })) : (_jsx("div", { className: "space-y-3", children: selectedPlayers.map((player) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: "secondary", children: player.position }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: player.name }), _jsx("div", { className: "text-sm text-gray-500", children: player.team })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-medium", children: ["$", player.salary.toLocaleString()] }), _jsxs("div", { className: "text-sm text-gray-500", children: [player.projectedPoints, " pts"] })] }), _jsx("button", { onClick: () => removePlayer(player.id), className: "text-red-500 hover:text-red-700", children: "\u00D7" })] })] }, player.id))) })) })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Star, { className: "w-5 h-5 text-yellow-500" }), "Available Players"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: availablePlayers.map((player) => (_jsxs("div", { className: "flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer", onClick: () => addPlayer(player), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: "outline", children: player.position }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: player.name }), _jsx("div", { className: "text-sm text-gray-500", children: player.team })] }), _jsx(Badge, { className: getTierColor(player.tier), children: player.tier })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-medium", children: ["$", player.salary.toLocaleString()] }), _jsxs("div", { className: "text-sm text-gray-500", children: [player.projectedPoints, " pts"] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm font-medium text-green-600", children: [player.value, "x"] }), _jsxs("div", { className: "text-sm text-gray-500", children: [player.ownership, "% own"] })] })] })] }, player.id))) }) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "w-5 h-5 text-green-500" }), "Salary Cap"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Used" }), _jsxs("span", { className: "text-sm font-medium", children: ["$", (50000 - remainingSalary).toLocaleString()] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full", style: {
                                                                    width: `${((50000 - remainingSalary) / 50000) * 100}%`,
                                                                } }) })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-green-600", children: ["$", remainingSalary.toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-500", children: "Remaining" })] })] }) })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-purple-500" }), "Projections"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Projected Total" }), _jsxs("span", { className: "font-bold", children: [selectedPlayers
                                                                    .reduce((sum, p) => sum + p.projectedPoints, 0)
                                                                    .toFixed(1), " ", "pts"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Avg Ownership" }), _jsxs("span", { className: "font-bold", children: [selectedPlayers.length > 0
                                                                    ? (selectedPlayers.reduce((sum, p) => sum + p.ownership, 0) / selectedPlayers.length).toFixed(1)
                                                                    : 0, "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Lineup Value" }), _jsxs("span", { className: "font-bold text-green-600", children: [selectedPlayers.length > 0
                                                                    ? (selectedPlayers.reduce((sum, p) => sum + p.value, 0) /
                                                                        selectedPlayers.length).toFixed(2)
                                                                    : 0, "x"] })] })] }) })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "w-5 h-5 text-orange-500" }), "AI Tools"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsx("button", { className: "w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all", children: "Generate Optimal Lineup" }), _jsx("button", { className: "w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all", children: "Optimize Current" }), _jsx("button", { className: "w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all", children: "Generate Contrarian" }), _jsx("button", { className: "w-full py-2 px-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-all", children: "Export Lineup" })] })] }), _jsxs(Card, { className: "glass-card", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Target, { className: "w-5 h-5 text-red-500" }), "Lineup Rating"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-purple-600 mb-2", children: selectedPlayers.length > 0 ? "87" : "--" }), _jsx("div", { className: "text-sm text-gray-500 mb-4", children: "Overall Score" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Value" }), _jsx("span", { className: "text-green-600", children: "A+" })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Ceiling" }), _jsx("span", { className: "text-blue-600", children: "A-" })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Ownership" }), _jsx("span", { className: "text-orange-600", children: "B+" })] })] })] }) })] })] })] })] }));
};
