import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
const getEmoji = (type) => {
    if (type === 'goblin')
        return '💰';
    if (type === 'demon')
        return '👹';
    return '⇄';
};
const getSentimentBadge = (sentiment) => {
    if (!sentiment)
        return null;
    const color = sentiment.direction === 'up'
        ? 'bg-green-100 text-green-700'
        : sentiment.direction === 'down'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-200 text-gray-700';
    const icon = sentiment.direction === 'up' ? '▲' : sentiment.direction === 'down' ? '▼' : '−';
    return (_jsxs("span", { className: `ml-2 px-2 py-1 rounded-full text-xs ${color} cursor-help`, title: sentiment.tooltip || '', children: [icon, " ", sentiment.score] }));
};
const PropCards = ({ props }) => {
    const [selected, setSelected] = useState(null);
    if (!props.length) {
        return (_jsx("main", { className: "section space-y-6 lg:space-y-8 animate-fade-in", children: _jsx("div", { className: "modern-card p-6 lg:p-8 text-center text-gray-500", children: "No props available. Please check back later." }) }));
    }
    return (_jsx("main", { className: "section space-y-6 lg:space-y-8 animate-fade-in", children: _jsxs("div", { className: "modern-card p-6 lg:p-8", children: [_jsx("h2", { className: "text-2xl lg:text-3xl font-bold mb-6", children: "\uD83C\uDFAF Player Props" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8", children: props.map(prop => (_jsx("div", { className: "prop-card glass text-gray-900 dark:text-white relative transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer", onClick: () => setSelected(prop.player_name + prop.stat_type + prop.game_time), children: _jsxs("div", { className: "p-4 lg:p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h3", { className: "text-lg lg:text-xl font-bold flex items-center gap-2", children: [prop.player_name, getSentimentBadge(prop?.sentiment)] }), _jsx("span", { className: "text-xs font-bold text-gray-500", children: prop.team_abbreviation })] }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium", children: [prop.stat_type, " ", prop.line_value] }), _jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("span", { className: "text-2xl lg:text-3xl font-bold", children: getEmoji(prop.winningProp.type) }), _jsxs("span", { className: "text-sm font-bold", children: [(prop.winningProp.percentage * 100).toFixed(1), "%"] }), _jsxs("span", { className: "text-xs text-orange-500 ml-2", children: ["\uD83D\uDD25", prop.pick_count] })] }), prop?.espnNews && (_jsxs("a", { className: "text-xs text-blue-600 hover:underline", href: typeof prop.espnNews === 'string'
                                        ? undefined
                                        : prop.espnNews?.link, rel: "noopener noreferrer", target: "_blank", children: ["\uD83D\uDCF0", ' ', typeof prop.espnNews === 'string'
                                            ? prop.espnNews
                                            : prop.espnNews?.title] }))] }) }, prop.player_name + prop.stat_type + prop.game_time))) }), selected && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-6 backdrop-blur-sm", onClick: () => setSelected(null), children: _jsxs("div", { className: "modern-card max-w-2xl w-full p-8 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto", onClick: e => e.stopPropagation(), children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: "Prop Details" }), _jsx("pre", { className: "text-xs whitespace-pre-wrap break-all", children: JSON.stringify(props.find(p => p.player_name + p.stat_type + p.game_time === selected), null, 2) }), _jsx("button", { className: "modern-button mt-6", onClick: () => setSelected(null), children: "Close" })] }) }))] }) }));
};
export default React.memo(PropCards);
