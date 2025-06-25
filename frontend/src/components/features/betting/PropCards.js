import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropCard from './PropCard';
import { useState, useEffect } from 'react';
import SkeletonLoader from '../base/SkeletonLoader'; // Import SkeletonLoader
import { Modal } from './Modals'; // For Prop Details Modal
import { Search, AlertTriangle, Info } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
const PropCardSkeleton = () => (_jsxs("div", { className: "glass rounded-xl shadow-lg p-4 flex flex-col justify-between space-y-3", children: [_jsx(SkeletonLoader, { height: "1em", width: "40%", className: "mb-2" }), _jsx(SkeletonLoader, { height: "1.5em", width: "70%", className: "mb-1" }), _jsx(SkeletonLoader, { height: "2em", width: "50%", className: "mb-3" }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsx(SkeletonLoader, { height: "0.8em", width: "60%" }), _jsx(SkeletonLoader, { height: "0.8em", width: "50%" })] }), _jsx(SkeletonLoader, { height: "2.5em", width: "100%", className: "mt-2" })] }));
const PropCards = () => {
    const { props, isLoadingProps, error, sentiments, fetchProps, fetchSentiments, addToast, } = useAppStore((state) => ({
        props: state.props,
        isLoadingProps: state.isLoadingProps,
        error: state.error, // Assuming a general error field in store for prop fetching
        sentiments: state.sentiments,
        fetchProps: state.fetchProps,
        fetchSentiments: state.fetchSentiments,
        addToast: state.addToast,
    }));
    const [selectedPropDetails, setSelectedPropDetails] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [leagueFilter, setLeagueFilter] = useState('all'); // e.g., 'NBA', 'NFL', 'all'
    useEffect(() => {
        // Fetch initial props, can be re-fetched based on filters later
        fetchProps();
        // Fetch initial general sentiments, or fetch specific ones when props load
        // fetchSentiments('market_overview'); // Example for general sentiment
    }, [fetchProps]);
    const handleViewDetails = (propId) => {
        const prop = props.find(p => p.id === propId);
        if (prop) {
            setSelectedPropDetails(prop);
            setIsDetailModalOpen(true);
            // Fetch sentiment for this specific prop/player if not already fetched
            if (!sentiments[prop.player_name.toLowerCase()]) {
                fetchSentiments(prop.player_name);
            }
            // Also fetch prize picks lines
            useAppStore.getState().fetchPrizePicksLines(prop.id); // Assuming this action exists
        }
    };
    const getSentimentForProp = (prop) => {
        return sentiments[prop.player_name.toLowerCase()];
    };
    const filteredProps = (Array.isArray(props) ? props : [])
        .filter(p => (leagueFilter === 'all' || p.league?.toLowerCase() === leagueFilter.toLowerCase()) &&
        (p.player_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.stat_type?.toLowerCase().includes(searchTerm.toLowerCase())));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-3", children: [_jsx("h3", { className: "text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent drop-shadow-lg mb-2", children: "\uD83C\uDFAF Player Props" }), _jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [_jsx("label", { htmlFor: "leagueFilter", className: "sr-only", children: "Filter by League" }), _jsxs("div", { className: "relative w-full sm:w-64", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" }), _jsx("input", { type: "text", placeholder: "Search props, players...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-3 py-2 glass rounded-xl text-lg font-semibold text-primary-700 dark:text-primary-200 focus:ring-primary focus:border-primary shadow-md" })] }), _jsxs("select", { id: "leagueFilter", value: leagueFilter, onChange: (e) => setLeagueFilter(e.target.value), className: "glass rounded-xl p-2 text-primary-700 dark:text-primary-200 font-semibold shadow-md", children: [_jsx("option", { value: "all", children: "All Leagues" }), _jsx("option", { value: "NBA", children: "NBA" }), _jsx("option", { value: "NFL", children: "NFL" }), _jsx("option", { value: "MLB", children: "MLB" })] })] })] }), isLoadingProps && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: Array.from({ length: 8 }).map((_, index) => _jsx(PropCardSkeleton, {}, index)) })), !isLoadingProps && error && (_jsxs("div", { className: "text-center p-4 bg-red-500/10 text-red-400 rounded-lg", children: [_jsx(AlertTriangle, { className: "w-6 h-6 inline mr-2" }), " Error fetching props: ", error] })), !isLoadingProps && !error && (filteredProps?.length ?? 0) === 0 && (_jsx("div", { className: "text-center p-4 text-primary-400", children: "No props found matching your criteria. Try adjusting filters or search." })), !isLoadingProps && !error && (filteredProps?.length ?? 0) > 0 && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", children: (filteredProps || []).map((prop) => (_jsx(PropCard, { prop: prop, sentiment: getSentimentForProp(prop), onViewDetails: handleViewDetails, className: "prop-card glass modern-card hover:scale-105 transition-transform duration-300 cursor-pointer" }, prop.id))) })), selectedPropDetails && (_jsx(Modal, { isOpen: isDetailModalOpen, onClose: () => setIsDetailModalOpen(false), title: `${selectedPropDetails.player_name} - ${selectedPropDetails.stat_type} ${selectedPropDetails.line_score}`, children: _jsxs("div", { className: "space-y-4 p-1 text-text", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [useAppStore.getState().currentPrizePicksPlayer?.image_url && (_jsx("img", { src: useAppStore.getState().currentPrizePicksPlayer?.image_url, alt: selectedPropDetails.player_name, className: "w-16 h-16 rounded-full object-cover" })), _jsxs("div", { children: [_jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "League:" }), " ", selectedPropDetails.league] }), _jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "Team:" }), " ", useAppStore.getState().currentPrizePicksPlayer?.team || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "Position:" }), " ", useAppStore.getState().currentPrizePicksPlayer?.position || 'N/A'] })] })] }), _jsxs("p", { children: [_jsx("strong", { className: "text-text-muted", children: "Description:" }), " ", selectedPropDetails.description || 'No description available.'] }), useAppStore.getState().isLoadingLines ? (_jsx("p", { className: "text-text-muted", children: "Loading odds..." })) : useAppStore.getState().currentPrizePicksLines ? (_jsxs("div", { className: "grid grid-cols-2 gap-2 p-3 bg-surface/50 rounded-lg", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-sm text-green-400", children: ["OVER ", useAppStore.getState().currentPrizePicksLines?.line_score] }), _jsx("p", { className: "text-lg font-semibold", children: useAppStore.getState().currentPrizePicksLines?.over_odds || selectedPropDetails.overOdds || 'N/A' })] }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm text-red-400", children: ["UNDER ", useAppStore.getState().currentPrizePicksLines?.line_score] }), _jsx("p", { className: "text-lg font-semibold", children: useAppStore.getState().currentPrizePicksLines?.under_odds || selectedPropDetails.underOdds || 'N/A' })] })] })) : (_jsx("p", { className: "text-text-muted", children: "Odds information not available." })), _jsxs("p", { className: "text-sm text-text-muted", children: ["Sentiment: ", getSentimentForProp(selectedPropDetails)?.sentimentScore.toFixed(2) ?? 'N/A'] }), useAppStore.getState().isLoadingLines ? (_jsx("p", { className: "text-text-muted", children: "Loading sentiment data..." })) : getSentimentForProp(selectedPropDetails) ? (_jsx("div", { className: "flex items-center space-x-2", children: _jsx("span", { title: `Pos: ${getSentimentForProp(selectedPropDetails)?.positiveMentions ?? 0}, Neg: ${getSentimentForProp(selectedPropDetails)?.negativeMentions ?? 0}, Neu: ${getSentimentForProp(selectedPropDetails)?.neutralMentions ?? 0}`, children: _jsx(Info, { size: 12, className: "cursor-help" }) }) })) : (_jsx("p", { className: "text-text-muted", children: "Player sentiment data not available." })), _jsxs("div", { className: "border-t border-border pt-3 mt-3", children: [_jsx("h5", { className: "text-md font-semibold mb-2 text-text-muted", children: "Advanced Insights" }), _jsx("p", { className: "text-xs text-text-muted", children: "Detailed historical performance, AI predictions, and news-driven insights for this prop are not currently available." })] }), _jsxs("div", { className: "mt-6 flex gap-2", children: [_jsx("button", { onClick: () => {
                                        const lines = useAppStore.getState().currentPrizePicksLines;
                                        const pickOdds = lines?.over_odds; // Or however you determine which odds to use
                                        if (pickOdds === undefined && selectedPropDetails.overOdds === undefined) {
                                            addToast({ message: `Odds for OVER ${selectedPropDetails.line_score} not available. Cannot add to slip.`, type: 'error' });
                                            return;
                                        }
                                        const legToAdd = {
                                            propId: selectedPropDetails.id,
                                            pick: 'over',
                                            line: selectedPropDetails.line_score,
                                            statType: selectedPropDetails.stat_type,
                                            playerName: selectedPropDetails.player_name,
                                            odds: (pickOdds ?? selectedPropDetails.overOdds ?? 0), // Use 0 as fallback
                                        };
                                        useAppStore.getState().addLeg(legToAdd);
                                        addToast({ message: `${selectedPropDetails.player_name} OVER ${selectedPropDetails.line_score} added to slip!`, type: 'success' });
                                        setIsDetailModalOpen(false);
                                    }, className: "flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors", children: "Add OVER to Bet Slip" }), _jsx("button", { onClick: () => {
                                        const lines = useAppStore.getState().currentPrizePicksLines;
                                        const pickOdds = lines?.under_odds;
                                        if (pickOdds === undefined && selectedPropDetails.underOdds === undefined) {
                                            addToast({ message: `Odds for UNDER ${selectedPropDetails.line_score} not available. Cannot add to slip.`, type: 'error' });
                                            return;
                                        }
                                        const legToAdd = {
                                            propId: selectedPropDetails.id,
                                            pick: 'under',
                                            line: selectedPropDetails.line_score,
                                            statType: selectedPropDetails.stat_type,
                                            playerName: selectedPropDetails.player_name,
                                            odds: (pickOdds ?? selectedPropDetails.underOdds ?? 0), // Use 0 as fallback
                                        };
                                        useAppStore.getState().addLeg(legToAdd);
                                        addToast({ message: `${selectedPropDetails.player_name} UNDER ${selectedPropDetails.line_score} added to slip!`, type: 'success' });
                                        setIsDetailModalOpen(false);
                                    }, className: "flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors", children: "Add UNDER to Bet Slip" })] }), _jsx("button", { onClick: () => setIsDetailModalOpen(false), className: "w-full mt-2 px-4 py-2 bg-surface/80 hover:bg-surface text-text rounded-lg transition-colors", children: "Close" })] }) }))] }));
};
export default PropCards;
