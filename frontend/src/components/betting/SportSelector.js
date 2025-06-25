import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useBettingStore } from '../../stores/bettingStore';
const SportSelector = ({ sports }) => {
    const { selectedSport, selectSport } = useBettingStore();
    const handleSportChange = (_, newSport) => {
        if (newSport !== null) {
            selectSport(newSport);
        }
    };
    return (_jsx(Box, { sx: { width: '100%' }, children: _jsx(ToggleButtonGroup, { exclusive: true, "aria-label": "sport selection", sx: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                '& .MuiToggleButton-root': {
                    flex: '1 1 auto',
                    minWidth: '100px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                    },
                },
            }, value: selectedSport, onChange: handleSportChange, children: sports.map(sport => (_jsx(ToggleButton, { "aria-label": sport.name, disabled: !sport.active, value: sport, children: _jsxs(Box, { sx: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }, children: [_jsx("img", { alt: sport.name, src: sport.icon, style: { width: 24, height: 24 } }), sport.name] }) }, sport.id))) }) }));
};
export default React.memo(SportSelector);
