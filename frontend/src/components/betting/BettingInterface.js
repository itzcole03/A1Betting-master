import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Tab, Tabs } from '@mui/material';
import { useSports, useEvents, useOdds, usePlaceBet } from '../../services/bettingService';
import { useBettingStore } from '../../stores/bettingStore';
import SportSelector from './SportSelector';
import EventList from './EventList';
import BetSlip from './BetSlip';
import OddsDisplay from './OddsDisplay';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import { BettingAnalytics } from './BettingAnalytics';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { "aria-labelledby": `betting-tab-${index}`, hidden: value !== index, id: `betting-tabpanel-${index}`, role: "tabpanel", ...other, children: value === index && _jsx(Box, { sx: { p: 3 }, children: children }) }));
}
const BettingInterface = () => {
    const { selectedSport, selectedEvent, updateOdds, setSelectedSport, setSelectedEvent } = useBettingStore();
    const { data: sports, isLoading: sportsLoading } = useSports();
    const { data: events, isLoading: eventsLoading } = useEvents(selectedSport?.id ?? '');
    const { data: odds } = useOdds(selectedEvent?.id ?? '');
    const placeBet = usePlaceBet();
    const [selectedTab, setSelectedTab] = useState(0);
    // Update odds in store when they change
    useEffect(() => {
        if (odds && selectedEvent) {
            updateOdds(selectedEvent.id, odds);
        }
    }, [odds, selectedEvent, updateOdds]);
    const handleError = (error) => {
        toast.error(`An error occurred: ${error.message}`);
    };
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    if (sportsLoading) {
        return (_jsx(Box, { alignItems: "center", display: "flex", justifyContent: "center", minHeight: "100vh", children: _jsx(Typography, { children: "Loading sports data..." }) }));
    }
    return (_jsx(ErrorBoundary, { fallback: _jsx("div", { children: "Something went wrong" }), onError: handleError, children: _jsxs(Box, { sx: { flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }, children: [_jsx(Paper, { sx: { width: '100%', mb: 2 }, children: _jsxs(Tabs, { indicatorColor: "primary", textColor: "primary", value: selectedTab, variant: "fullWidth", onChange: handleTabChange, children: [_jsx(Tab, { label: "Betting" }), _jsx(Tab, { label: "Analytics" })] }) }), _jsx(TabPanel, { index: 0, value: selectedTab, children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, md: 3, xs: 12, children: [_jsx(SportSelector, { selectedSport: selectedSport, onSportSelect: setSelectedSport }), _jsx(EventList, { selectedEvent: selectedEvent, sport: selectedSport, onEventSelect: setSelectedEvent })] }), _jsx(Grid, { item: true, md: 6, xs: 12, children: selectedEvent && _jsx(OddsDisplay, { event: selectedEvent }) }), _jsx(Grid, { item: true, md: 3, xs: 12, children: _jsx(BetSlip, { onPlaceBet: placeBet.mutate }) })] }) }), _jsx(TabPanel, { index: 1, value: selectedTab, children: _jsx(BettingAnalytics, {}) })] }) }));
};
export default React.memo(BettingInterface);
