import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, ExternalLink, Info, CheckCircle, } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
const PropCard = ({ prop, sentiment, onViewDetails, className }) => {
    const { addToast, legs, addLeg } = useAppStore();
    const isSelected = legs.some(l => l.propId === prop.id);
    const handleViewDetailsClick = () => {
        onViewDetails(prop.id);
    };
    const handleExternalLink = (e, url) => {
        e.stopPropagation(); // Prevent card click if link is clicked
        window.open(url, '_blank');
        addToast({ message: `Opening news link: ${url.substring(0, 30)}...`, type: 'info' });
    };
    const getSentimentIcon = () => {
        if (!sentiment || sentiment.sentimentScore === undefined)
            return _jsx(AlertCircle, { className: "w-4 h-4 text-gray-500" });
        if (sentiment.sentimentScore > 0.2)
            return _jsx(TrendingUp, { className: "w-4 h-4 text-green-500" });
        if (sentiment.sentimentScore < -0.2)
            return _jsx(TrendingDown, { className: "w-4 h-4 text-red-500" });
        return _jsx(AlertCircle, { className: "w-4 h-4 text-yellow-500" });
    };
    const handleAddLeg = (pick) => {
        const odds = pick === 'over' ? prop.overOdds : prop.underOdds;
        if (odds === undefined) {
            addToast({ message: `Odds for ${pick.toUpperCase()} not available.`, type: 'error' });
            return;
        }
        addLeg({
            propId: prop.id,
            pick,
            line: prop.line_score,
            statType: prop.stat_type,
            playerName: prop.player_name,
            odds,
        });
        addToast({
            message: `${prop.player_name} ${pick.toUpperCase()} ${prop.line_score} added to slip!`,
            type: 'success',
        });
    };
    return (_jsxs("div", { "aria-label": `View details for ${prop.player_name}`, className: `glass rounded-xl shadow-lg p-4 flex flex-col justify-between space-y-3 hover:shadow-primary/30 transition-shadow cursor-pointer transform hover:-translate-y-1 relative ${className || ''}`, role: "button", tabIndex: 0, onClick: handleViewDetailsClick, onKeyDown: e => {
            if (e.key === 'Enter')
                handleViewDetailsClick();
        }, children: [isSelected && (_jsx("div", { className: "absolute top-3 right-3 text-green-400", title: "Selected in bet slip", children: _jsx(CheckCircle, { size: 22 }) })), _jsxs("div", { children: [_jsx("div", { className: "flex justify-between items-start mb-2", children: _jsxs("p", { className: "text-sm text-text-muted uppercase tracking-wider", children: [prop.league, " - ", prop.stat_type] }) }), _jsx("h4", { className: "text-lg font-semibold text-text truncate", title: prop.player_name, children: prop.player_name }), _jsxs("p", { className: "text-2xl font-bold text-primary", children: [prop.line_score, ' ', _jsx("span", { className: "text-sm font-normal text-text-muted", children: prop.description || prop.stat_type })] })] }), _jsxs("div", { className: "space-y-2 text-xs", children: [sentiment && (_jsxs("div", { className: "flex items-center space-x-1 text-text-muted", children: [getSentimentIcon(), _jsxs("span", { children: ["Social Sentiment: ", sentiment.sentimentScore.toFixed(2)] }), _jsx("span", { title: `Pos: ${sentiment.positiveMentions}, Neg: ${sentiment.negativeMentions}, Neu: ${sentiment.neutralMentions}`, children: _jsx(Info, { className: "cursor-help", size: 12 }) })] })), _jsxs("button", { className: "flex items-center space-x-1 text-blue-400 hover:text-blue-300 hover:underline", onClick: e => handleExternalLink(e, `https://www.espn.com/search/results?q=${encodeURIComponent(prop.player_name)}`), children: [_jsx(ExternalLink, { size: 12 }), _jsx("span", { children: "ESPN/News" })] })] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx("button", { "aria-label": `Add OVER for ${prop.player_name}`, className: "flex-1 px-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs font-semibold", disabled: isSelected, onClick: e => {
                            e.stopPropagation();
                            handleAddLeg('over');
                        }, children: "Add OVER" }), _jsx("button", { "aria-label": `Add UNDER for ${prop.player_name}`, className: "flex-1 px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-xs font-semibold", disabled: isSelected, onClick: e => {
                            e.stopPropagation();
                            handleAddLeg('under');
                        }, children: "Add UNDER" })] }), _jsx("button", { className: "w-full mt-2 px-3 py-2 text-sm bg-primary/80 hover:bg-primary text-white rounded-lg transition-colors font-medium", onClick: handleViewDetailsClick, children: "View Details & Place Bet" })] }));
};
export default React.memo(PropCard);
