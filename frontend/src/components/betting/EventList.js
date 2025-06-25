import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography, CircularProgress, Box, Chip, } from '@mui/material';
import { useBettingStore } from '../../stores/bettingStore';
import { format } from 'date-fns';
const EventList = ({ events, isLoading, selectedSport }) => {
    const { selectedEvent, selectEvent } = useBettingStore();
    if (isLoading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", p: 3, children: _jsx(CircularProgress, {}) }));
    }
    if (!selectedSport) {
        return (_jsx(Box, { p: 3, children: _jsx(Typography, { align: "center", color: "text.secondary", children: "Please select a sport to view events" }) }));
    }
    if (events.length === 0) {
        return (_jsx(Box, { p: 3, children: _jsxs(Typography, { align: "center", color: "text.secondary", children: ["No events available for ", selectedSport.name] }) }));
    }
    return (_jsx(List, { children: events.map(event => (_jsx(ListItem, { disablePadding: true, divider: true, sx: {
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
            }, children: _jsx(ListItemButton, { selected: selectedEvent?.id === event.id, onClick: () => selectEvent(event), children: _jsx(ListItemText, { primary: _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsxs(Typography, { variant: "subtitle1", children: [event.homeTeam, " vs ", event.awayTeam] }), _jsx(Chip, { color: event.status === 'live'
                                    ? 'error'
                                    : event.status === 'upcoming'
                                        ? 'primary'
                                        : 'default', label: event.status, size: "small" })] }), secondary: _jsxs(Box, { alignItems: "center", display: "flex", gap: 2, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: format(new Date(event.startTime), 'MMM d, h:mm a') }), event.score && (_jsxs(Typography, { color: "text.secondary", variant: "body2", children: ["Score: ", event.score.home, " - ", event.score.away] }))] }) }) }) }, event.id))) }));
};
export default React.memo(EventList);
