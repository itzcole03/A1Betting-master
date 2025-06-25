import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { strategyService } from '@/services/strategy';
import { StrategyAutomationToggle } from '@/components/StrategyAutomationToggle';
export const StrategiesPage = () => {
    const strategies = strategyService.getAllStrategies();
    return (_jsx(Grid, { container: true, spacing: 2, children: strategies.map(strategy => (_jsx(Grid, { item: true, md: 6, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", children: strategy.name }), _jsx(Typography, { color: "textSecondary", variant: "body2", children: strategy.description }), _jsx(StrategyAutomationToggle, { strategyName: strategy.name })] }) }) }, strategy.name))) }));
};
