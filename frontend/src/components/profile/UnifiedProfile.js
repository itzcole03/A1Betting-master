import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Settings, TrendingUp, DollarSign, Award, Target, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
export const UnifiedProfile = () => {
    const [user] = useState({
        name: "Pro Bettor",
        email: "pro@a1betting.com",
        memberSince: "2023-01-15",
        tier: "Premium",
        avatar: null,
        stats: {
            totalProfit: 15420.75,
            winRate: 68.5,
            totalBets: 234,
            avgROI: 12.3,
        },
        achievements: [
            {
                id: 1,
                title: "High Roller",
                description: "Placed $10k+ in bets",
                icon: "💰",
            },
            {
                id: 2,
                title: "Accuracy Expert",
                description: "70%+ win rate for 30 days",
                icon: "🎯",
            },
            {
                id: 3,
                title: "Streak Master",
                description: "10+ win streak achieved",
                icon: "🔥",
            },
        ],
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "\uD83D\uDC64 User Profile" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "Your betting performance and achievements" })] }), _jsx(Card, { className: "glass-card", children: _jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-8 h-8 text-white" }) }), _jsxs("div", { className: "flex-1", children: [_jsx(CardTitle, { className: "text-xl", children: user.name }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: user.email }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx(Badge, { variant: "success", children: user.tier }), _jsxs("span", { className: "text-sm text-gray-500", children: ["Member since ", new Date(user.memberSince).toLocaleDateString()] })] })] }), _jsx("button", { className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700", children: _jsx(Settings, { className: "w-5 h-5" }) })] }) }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(Card, { className: "text-center", children: _jsxs(CardContent, { className: "p-6", children: [_jsx(DollarSign, { className: "w-8 h-8 text-green-500 mx-auto mb-2" }), _jsxs("div", { className: "text-2xl font-bold text-green-600", children: ["$", user.stats.totalProfit.toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-500", children: "Total Profit" })] }) }), _jsx(Card, { className: "text-center", children: _jsxs(CardContent, { className: "p-6", children: [_jsx(Target, { className: "w-8 h-8 text-blue-500 mx-auto mb-2" }), _jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [user.stats.winRate, "%"] }), _jsx("div", { className: "text-sm text-gray-500", children: "Win Rate" })] }) }), _jsx(Card, { className: "text-center", children: _jsxs(CardContent, { className: "p-6", children: [_jsx(TrendingUp, { className: "w-8 h-8 text-purple-500 mx-auto mb-2" }), _jsx("div", { className: "text-2xl font-bold text-purple-600", children: user.stats.totalBets }), _jsx("div", { className: "text-sm text-gray-500", children: "Total Bets" })] }) }), _jsx(Card, { className: "text-center", children: _jsxs(CardContent, { className: "p-6", children: [_jsx(Award, { className: "w-8 h-8 text-orange-500 mx-auto mb-2" }), _jsxs("div", { className: "text-2xl font-bold text-orange-600", children: [user.stats.avgROI, "%"] }), _jsx("div", { className: "text-sm text-gray-500", children: "Avg ROI" })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uD83C\uDFC6 Achievements" }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: user.achievements.map((achievement) => (_jsxs("div", { className: "p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/30", children: [_jsx("div", { className: "text-2xl mb-2", children: achievement.icon }), _jsx("h4", { className: "font-semibold text-yellow-800 dark:text-yellow-200", children: achievement.title }), _jsx("p", { className: "text-sm text-yellow-600 dark:text-yellow-400", children: achievement.description })] }, achievement.id))) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uD83D\uDCC8 Recent Activity" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Lakers vs Warriors - Over 220.5" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Won \u2022 2 hours ago" })] }), _jsx("div", { className: "text-green-600 font-bold", children: "+$150" })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Chiefs ML vs Bills" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Pending \u2022 1 day ago" })] }), _jsx("div", { className: "text-blue-600 font-bold", children: "$75" })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Patriots +7.5" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Lost \u2022 3 days ago" })] }), _jsx("div", { className: "text-red-600 font-bold", children: "-$100" })] })] }) })] })] }));
};
