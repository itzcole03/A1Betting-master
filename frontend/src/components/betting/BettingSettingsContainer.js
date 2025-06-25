import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { BettingSettingsPanel } from './BettingSettingsPanel';
import { BettingSettingsSummary } from './BettingSettingsSummary';
import { useBettingSettings } from '../../hooks/useBettingSettings';
export const BettingSettingsContainer = () => {
    const { fetchSettings } = useBettingSettings();
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);
    return (_jsx(Box, { sx: { p: 3 }, children: _jsxs(Box, { sx: {
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    md: '2fr 1fr',
                },
                gap: 3,
            }, children: [_jsx(BettingSettingsPanel, {}), _jsx(BettingSettingsSummary, {})] }) }));
};
