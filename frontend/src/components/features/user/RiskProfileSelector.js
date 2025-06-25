import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Button, ButtonGroup, Tooltip } from '@mui/material';
import { RiskProfileType } from '@/types/betting';
export const RiskProfileSelector = ({ currentProfile, onProfileChange, }) => {
    const profiles = [
        {
            type: RiskProfileType.CONSERVATIVE,
            label: 'Conservative',
            description: 'Lower risk, higher confidence required',
        },
        {
            type: RiskProfileType.MODERATE,
            label: 'Moderate',
            description: 'Balanced risk and reward',
        },
        {
            type: RiskProfileType.AGGRESSIVE,
            label: 'Aggressive',
            description: 'Higher risk tolerance, more opportunities',
        },
    ];
    return (_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Risk Profile" }), _jsx(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: "Select your risk tolerance level" }), _jsx(ButtonGroup, { "aria-label": "risk profile selection", sx: { mt: 2 }, variant: "contained", children: profiles.map(profile => (_jsx(Tooltip, { placement: "top", title: profile.description, children: _jsx(Button, { color: currentProfile === profile.type ? 'primary' : 'inherit', variant: currentProfile === profile.type ? 'contained' : 'outlined', onClick: () => onProfileChange(profile.type), children: profile.label }) }, profile.type))) })] }));
};
