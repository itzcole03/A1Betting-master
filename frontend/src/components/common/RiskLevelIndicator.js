import { jsx as _jsx } from "react/jsx-runtime";
import { Tooltip, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
const getRiskLevelConfig = (level) => {
    switch (level) {
        case 'low':
            return {
                color: 'success',
                icon: _jsx(TrendingDownIcon, {}),
                label: 'Low Risk',
            };
        case 'medium':
            return {
                color: 'warning',
                icon: _jsx(TrendingFlatIcon, {}),
                label: 'Medium Risk',
            };
        case 'high':
            return {
                color: 'error',
                icon: _jsx(TrendingUpIcon, {}),
                label: 'High Risk',
            };
    }
};
export const RiskLevelIndicator = ({ level, showIcon = true, }) => {
    const config = getRiskLevelConfig(level);
    return (_jsx(Tooltip, { title: `${config.label} - ${getRiskLevelDescription(level)}`, children: _jsx(Chip, { className: "transition-colors duration-300", color: config.color, icon: showIcon ? config.icon : undefined, label: config.label, size: "small", variant: "outlined" }) }));
};
const getRiskLevelDescription = (level) => {
    switch (level) {
        case 'low':
            return 'High confidence, low volatility prediction';
        case 'medium':
            return 'Moderate confidence and risk level';
        case 'high':
            return 'High potential reward with increased risk';
    }
};
