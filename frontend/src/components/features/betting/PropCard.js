import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrendingUp, TrendingDown, AlertCircle, ExternalLink, Info } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
const PropCard = ({ prop, sentiment, onViewDetails, className, team, position, statType, line, pickType = 'normal', trendValue, gameInfo, playerImageUrl }) => {
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
        addToast({ message: `${prop.player_name} ${pick.toUpperCase()} ${prop.line_score} added to slip!`, type: 'success' });
    };
    return (_jsxs("div", { className: `glass rounded-xl shadow-lg p-4 flex flex-col justify-between space-y-3 hover:shadow-primary/30 transition-shadow cursor-pointer transform hover:-translate-y-1 relative ${className || ''}`, onClick: () => onViewDetails(prop.id), "aria-label": `View details for ${prop.player_name}`, tabIndex: 0, role: "button", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [playerImageUrl && (_jsx("img", { src: playerImageUrl, alt: prop.player_name, className: "w-10 h-10 rounded-lg object-cover border border-gray-300" })), _jsxs("div", { className: "text-xs text-gray-400", children: [team, " - ", position] })] }), trendValue !== undefined && (_jsxs("span", { className: "text-xs text-white bg-gradient-to-r from-green-500 to-blue-500 px-2 py-1 rounded-full font-bold shadow", children: [trendValue, "K"] })), (pickType === 'demon' || pickType === 'goblin') && (_jsx("img", { src: pickType === 'demon' ? 'https://app.prizepicks.com/7534b2e82fa0ac08ec43.png' : 'https://app.prizepicks.com/e00b98475351cdfd1c38.png', alt: pickType, className: "w-7 h-7 ml-2" }))] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-bold text-lg text-primary-600", children: prop.player_name }), gameInfo && (_jsxs("div", { className: "text-xs text-gray-400", children: ["vs ", gameInfo.opponent, " ", gameInfo.day, " ", gameInfo.time] }))] }), _jsxs("div", { className: "flex items-center justify-center gap-2 mt-2", children: [_jsx("span", { className: "text-xl font-bold text-white", children: line }), _jsx("span", { className: "text-gray-400 text-sm", children: statType })] }), _jsxs("div", { className: "space-y-2 text-xs", children: [sentiment && (_jsxs("div", { className: "flex items-center space-x-1 text-text-muted", children: [getSentimentIcon(), _jsxs("span", { children: ["Social Sentiment: ", sentiment.sentimentScore.toFixed(2)] }), _jsx("span", { title: `Pos: ${sentiment.positiveMentions}, Neg: ${sentiment.negativeMentions}, Neu: ${sentiment.neutralMentions}`, children: _jsx(Info, { size: 12, className: "cursor-help" }) })] })), _jsxs("button", { onClick: (e) => handleExternalLink(e, `https://www.espn.com/search/results?q=${encodeURIComponent(prop.player_name)}`), className: "flex items-center space-x-1 text-blue-400 hover:text-blue-300 hover:underline", children: [_jsx(ExternalLink, { size: 12 }), _jsx("span", { children: "ESPN/News" })] })] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx("button", { onClick: e => { e.stopPropagation(); handleAddLeg('over'); }, className: "flex-1 px-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs font-semibold", disabled: isSelected, "aria-label": `Add OVER for ${prop.player_name}`, children: "Add OVER" }), _jsx("button", { onClick: e => { e.stopPropagation(); handleAddLeg('under'); }, className: "flex-1 px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-xs font-semibold", disabled: isSelected, "aria-label": `Add UNDER for ${prop.player_name}`, children: "Add UNDER" })] }), _jsx("button", { onClick: handleViewDetailsClick, className: "w-full mt-2 px-3 py-2 text-sm bg-primary/80 hover:bg-primary text-white rounded-lg transition-colors font-medium", children: "View Details & Place Bet" })] }));
};
export default PropCard;
