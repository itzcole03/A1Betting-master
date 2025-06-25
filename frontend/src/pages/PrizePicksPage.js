import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PropCard from '../components/modern/PropCard';
import { useEffect, useState, useMemo } from 'react';
import { Modal } from '../components/modern/Modals';
import { Search, Filter, AlertTriangle, Info, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
const PrizePicksPage = () => {
    const { props, isLoadingProps, error: propsError, currentPrizePicksPlayer, isLoadingPlayer, currentPrizePicksLines, isLoadingLines, sentiments, fetchProps, fetchPrizePicksPlayer, fetchPrizePicksLines, fetchSentiments, addLeg, addToast, } = useAppStore((state) => ({
        props: state.props,
        isLoadingProps: state.isLoadingProps,
        error: state.error,
        currentPrizePicksPlayer: state.currentPrizePicksPlayer,
        isLoadingPlayer: state.isLoadingPlayer,
        currentPrizePicksLines: state.currentPrizePicksLines,
        isLoadingLines: state.isLoadingLines,
        sentiments: state.sentiments,
        fetchProps: state.fetchProps,
        fetchPrizePicksPlayer: state.fetchPrizePicksPlayer,
        fetchPrizePicksLines: state.fetchPrizePicksLines,
        fetchSentiments: state.fetchSentiments,
        addLeg: state.addLeg,
        addToast: state.addToast,
    }));
    const [selectedProp, setSelectedProp] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [leagueFilter, setLeagueFilter] = useState('all');
    const [statTypeFilter, setStatTypeFilter] = useState('all');
    useEffect(() => {
        fetchProps(leagueFilter === 'all' ? undefined : leagueFilter, statTypeFilter === 'all' ? undefined : statTypeFilter);
    }, [fetchProps, leagueFilter, statTypeFilter]);
    const handleViewDetails = async (prop) => {
        setSelectedProp(prop);
        setIsDetailModalOpen(true);
        fetchPrizePicksPlayer(prop.player_name);
        fetchPrizePicksLines(prop.id);
        fetchSentiments(prop.player_name);
    };
    const getSentimentForProp = (propPlayerName) => {
        return sentiments[propPlayerName.toLowerCase()];
    };
    const allLeagues = useMemo(() => Array.from(new Set((Array.isArray(props) ? props : []).map((p) => p.league))), [props]);
    const allStatTypes = useMemo(() => Array.from(new Set((Array.isArray(props) ? props : []).map((p) => p.stat_type))), [props]);
    const filteredProps = (Array.isArray(props) ? props : []).filter((p) => (leagueFilter === 'all' || p.league?.toLowerCase() === leagueFilter.toLowerCase()) &&
        (statTypeFilter === 'all' || p.stat_type?.toLowerCase() === statTypeFilter.toLowerCase()) &&
        (p.player_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.stat_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())));
    const handleAddLeg = (pickType) => {
        if (!selectedProp)
            return;
        const lines = currentPrizePicksLines; // From useAppStore selector
        let pickOdds;
        if (pickType === 'over') {
            pickOdds = lines?.over_odds ?? selectedProp.overOdds;
        }
        else {
            pickOdds = lines?.under_odds ?? selectedProp.underOdds;
        }
        if (pickOdds === undefined) {
            addToast({ message: `Odds for ${selectedProp.player_name} ${pickType.toUpperCase()} not available. Cannot add to slip.`, type: 'error' });
            return;
        }
        const leg = {
            propId: selectedProp.id,
            pick: pickType,
            line: selectedProp.line_score,
            statType: selectedProp.stat_type,
            playerName: selectedProp.player_name,
            odds: pickOdds, // Added odds
        };
        addLeg(leg);
        addToast({ message: `${selectedProp.player_name} ${pickType.toUpperCase()} ${selectedProp.line_score} added to slip!`, type: 'success' });
        setIsDetailModalOpen(false);
    };
    return (_jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-6", children: [_jsx("h1", { className: "text-3xl font-semibold text-text", children: "PrizePicks Player Props" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 glass rounded-xl shadow-lg", children: [_jsxs("div", { className: "relative col-span-1 sm:col-span-2 md:col-span-2", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" }), _jsx("input", { type: "text", placeholder: "Search props, players...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-3 py-2 bg-surface/50 border border-gray-600 rounded-lg text-text focus:ring-primary focus:border-primary" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "leagueFilter", className: "block text-xs font-medium text-text-muted mb-1", children: "League" }), _jsxs("select", { id: "leagueFilter", value: leagueFilter, onChange: (e) => setLeagueFilter(e.target.value), className: "w-full p-2 bg-surface/50 border border-gray-600 rounded-lg text-text focus:ring-primary focus:border-primary", children: [_jsx("option", { value: "all", children: "All Leagues" }), allLeagues.map((league) => _jsx("option", { value: league, children: league }, league))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "statTypeFilter", className: "block text-xs font-medium text-text-muted mb-1", children: "Stat Type" }), _jsxs("select", { id: "statTypeFilter", value: statTypeFilter, onChange: (e) => setStatTypeFilter(e.target.value), className: "w-full p-2 bg-surface/50 border border-gray-600 rounded-lg text-text focus:ring-primary focus:border-primary", children: [_jsx("option", { value: "all", children: "All Stat Types" }), allStatTypes.map((stat) => _jsx("option", { value: stat, children: stat }, stat))] })] }), _jsxs("button", { onClick: () => fetchProps(leagueFilter === 'all' ? undefined : leagueFilter, statTypeFilter === 'all' ? undefined : statTypeFilter), className: "col-span-1 sm:col-span-2 md:col-span-4 flex items-center justify-center p-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50", disabled: isLoadingProps, children: [isLoadingProps ? _jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : _jsx(Filter, { className: "w-5 h-5 mr-2" }), " Apply Filters"] })] }), isLoadingProps && (_jsxs("div", { className: "flex flex-col items-center justify-center h-64", children: [_jsx(Loader2, { className: "w-12 h-12 animate-spin text-primary mb-3" }), _jsx("p", { className: "text-text-muted", children: "Loading PrizePicks Props..." })] })), !isLoadingProps && propsError && (_jsxs("div", { className: "text-center p-6 bg-red-500/10 text-red-400 rounded-xl", children: [_jsx(AlertTriangle, { className: "w-8 h-8 inline mr-2" }), " Error fetching props: ", propsError] })), !isLoadingProps && !propsError && (filteredProps?.length ?? 0) === 0 && (_jsx("div", { className: "text-center p-6 text-text-muted rounded-xl glass", children: "No props found matching your criteria. Try adjusting filters or search." })), !isLoadingProps && !propsError && (filteredProps?.length ?? 0) > 0 && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: (filteredProps || []).map((prop) => (_jsx(PropCard, { prop: prop, sentiment: getSentimentForProp(prop.player_name), onViewDetails: () => handleViewDetails(prop) }, prop.id))) })), selectedProp && (_jsx(Modal, { isOpen: isDetailModalOpen, onClose: () => setIsDetailModalOpen(false), title: `${selectedProp.player_name} - ${selectedProp.stat_type} ${selectedProp.line_score}`, size: "lg", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-primary mb-2", children: "Prop Details" }), isLoadingPlayer && _jsxs("div", { className: "flex items-center", children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2 text-primary" }), _jsx("span", { className: "text-text-muted", children: "Loading player..." })] }), !isLoadingPlayer && propsError && !currentPrizePicksPlayer && _jsx("p", { className: "text-sm text-red-400", children: "Error loading player details." }), !isLoadingPlayer && currentPrizePicksPlayer && (_jsxs(_Fragment, { children: [_jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "League:" }), " ", selectedProp.league] }), _jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "Team:" }), " ", currentPrizePicksPlayer.team || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "Position:" }), " ", currentPrizePicksPlayer.position || 'N/A'] })] })), _jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "Description:" }), " ", selectedProp.description] }), selectedProp.start_time && _jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "Start Time:" }), " ", new Date(selectedProp.start_time).toLocaleString()] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-primary mb-2", children: "Market Lines" }), isLoadingLines && _jsxs("div", { className: "flex items-center", children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin mr-2 text-primary" }), _jsx("span", { className: "text-text-muted", children: "Loading lines..." })] }), !isLoadingLines && propsError && !currentPrizePicksLines && _jsx("p", { className: "text-sm text-red-400", children: "Error loading market lines." }), !isLoadingLines && currentPrizePicksLines && (_jsxs(_Fragment, { children: [_jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "Over Odds:" }), " ", currentPrizePicksLines.over_odds ?? selectedProp.overOdds ?? 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "Under Odds:" }), " ", currentPrizePicksLines.under_odds ?? selectedProp.underOdds ?? 'N/A'] })] })), !isLoadingLines && !currentPrizePicksLines && !propsError && _jsx("p", { className: "text-text-muted", children: "No specific line data available." })] })] }), currentPrizePicksPlayer?.image_url && (_jsx("img", { src: currentPrizePicksPlayer.image_url, alt: currentPrizePicksPlayer.name, className: "w-24 h-24 rounded-full mx-auto my-3 shadow-md" })), _jsxs("div", { className: "my-3", children: [_jsx("h4", { className: "text-md font-semibold text-primary mb-1", children: "Social Sentiment" }), sentiments[selectedProp.player_name.toLowerCase()] ? (_jsxs("div", { className: "flex items-center space-x-2 text-sm text-text-muted", children: [sentiments[selectedProp.player_name.toLowerCase()].sentimentScore > 0.2 ? _jsx(TrendingUp, { className: "text-green-500" }) :
                                            sentiments[selectedProp.player_name.toLowerCase()].sentimentScore < -0.2 ? _jsx(TrendingDown, { className: "text-red-500" }) :
                                                _jsx(Info, { className: "text-yellow-500" }), _jsxs("span", { children: ["Score: ", sentiments[selectedProp.player_name.toLowerCase()].sentimentScore.toFixed(2)] }), _jsxs("span", { children: ["(Pos: ", sentiments[selectedProp.player_name.toLowerCase()].positiveMentions, ", Neg: ", sentiments[selectedProp.player_name.toLowerCase()].negativeMentions, ")"] })] })) : _jsx("p", { className: "text-sm text-text-muted", children: "Sentiment not available or still loading." })] }), _jsx("p", { className: "text-sm text-text-muted", children: "Advanced stats, historical performance, and AI predictions for this prop will be shown here." }), _jsxs("div", { className: "mt-6 flex gap-3", children: [_jsxs("button", { onClick: () => handleAddLeg('over'), className: "flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium", children: ["Add OVER ", selectedProp.line_score, " to Slip"] }), _jsxs("button", { onClick: () => handleAddLeg('under'), className: "flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium", children: ["Add UNDER ", selectedProp.line_score, " to Slip"] })] }), _jsx("button", { onClick: () => setIsDetailModalOpen(false), className: "w-full mt-3 px-4 py-2 bg-surface/80 hover:bg-surface text-text rounded-lg transition-colors", children: "Close" })] }) }))] }));
};
export default PrizePicksPage;
