import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useUnifiedAnalytics } from '../../hooks/useUnifiedAnalytics.js'; // Add .js extension if required by tsconfig
import { useTheme } from '../../hooks/useTheme.js';
// If the following import fails, see the comment below for a dynamic workaround
// If you see TypeScript errors for icon imports below, ensure your react-icons version is >=5.5.0 and your tsconfig.json includes "esModuleInterop": true and "allowSyntheticDefaultImports": true. If problems persist, use a dynamic import workaround (see comment below).
// Example dynamic icon usage: const Icon = require('react-icons/fa').FaRobot;
import { FaRobot, FaBolt, FaArrowUp, FaArrowDown, FaHeartbeat, FaExclamationTriangle } from 'react-icons/fa';
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);
const StatusChip = ({ label, color, icon }) => (_jsx(Chip, { icon: icon, label: label, color: color, size: "small", sx: { mr: 1, mb: 1 } }));
const AdvancedAnalytics = () => {
    const theme = useTheme();
    // Use the unified analytics hook
    const { ml, performance } = useUnifiedAnalytics();
    // --- Types removed for build robustness. If you want to restore strict typing, define interfaces for your analytics slices. ---
    const enhancedAnalysis = (ml?.data || {});
    const loading = ml?.loading || false;
    const error = ml?.error || null;
    const modelStatus = (performance?.data?.[0] || {});
    const lastUpdate = performance?.data?.[0]?.timestamp || '';
    const fallbackActive = false; // Set as needed or infer from data
    const simulationMode = false; // Set as needed or infer from data
    // Only assign these from enhancedAnalysis (not from drift/realtime) to avoid duplicate declarations
    const sentiment = enhancedAnalysis.sentiment || {};
    const odds = enhancedAnalysis.marketData?.odds || {};
    const consensus = enhancedAnalysis.marketData?.consensus || {};
    const injuries = enhancedAnalysis.injuries || [];
    const patterns = enhancedAnalysis.patterns || [];
    const explainability = enhancedAnalysis.explainability || {};
    const aiStatus = modelStatus || {};
    // THEME: Replace theme.palette.* with hardcoded values for now
    const primaryColor = theme.theme === 'dark' ? '#1976d2' : '#1976d2'; // fallback to MUI blue
    const textColor = theme.theme === 'dark' ? '#fff' : '#222';
    // Local loading overlay
    if (loading || !enhancedAnalysis) {
        return (_jsxs(Box, { className: "flex flex-col items-center justify-center min-h-[300px]", children: [_jsx(CircularProgress, {}), _jsx(Typography, { variant: "body2", className: "mt-2 text-gray-400", children: "Loading advanced analytics..." })] }));
    }
    // Sentiment, Odds/Consensus, Injuries, Patterns, Explainability, and Model status are all defined above and should not be redeclared here.
    // (Removed duplicate declarations)
    return (_jsx(Box, { className: "w-full max-w-6xl mx-auto p-4", children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { className: "bg-gray-900 text-white dark:bg-gray-800", children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(FaRobot, { className: "inline mr-2" }), "AI Model Status"] }), _jsx(StatusChip, { label: `Status: ${aiStatus.status || 'Unknown'}`, color: aiStatus.status === 'Online' ? 'success' : 'warning', icon: _jsx(FaRobot, {}) }), _jsx(StatusChip, { label: `Accuracy: ${aiStatus.accuracy ? `${(aiStatus.accuracy * 100).toFixed(1)}%` : 'N/A'}`, color: "info", icon: _jsx(FaBolt, {}) }), _jsx(StatusChip, { label: `Confidence: ${aiStatus.confidence ? `${(aiStatus.confidence * 100).toFixed(1)}%` : 'N/A'}`, color: "primary", icon: _jsx(FaBolt, {}) }), _jsxs(Typography, { variant: "caption", className: "block mt-2 text-gray-400", children: ["Last update: ", lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'N/A'] }), simulationMode && _jsx(StatusChip, { label: "Simulation Mode", color: "warning", icon: _jsx(FaExclamationTriangle, {}) }), fallbackActive && _jsx(StatusChip, { label: "Fallback Active", color: "error", icon: _jsx(FaExclamationTriangle, {}) }), error && _jsx(Typography, { color: "error", variant: "body2", children: error })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { className: "bg-gray-900 text-white dark:bg-gray-800", children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(FaHeartbeat, { className: "inline mr-2" }), "Social Sentiment & Consensus"] }), _jsxs(Typography, { variant: "body2", children: ["Score: ", _jsx("b", { children: sentiment.score ?? 'N/A' })] }), _jsxs(Typography, { variant: "body2", children: ["Volume: ", _jsx("b", { children: sentiment.volume ?? 'N/A' })] }), _jsxs(Typography, { variant: "body2", children: ["Trending: ", _jsx("b", { children: sentiment.trending ? 'Yes' : 'No' })] }), _jsxs(Typography, { variant: "body2", children: ["Keywords: ", sentiment.keywords?.length ? sentiment.keywords.join(', ') : 'N/A'] }), _jsx(Box, { className: "mt-2", children: _jsxs(Typography, { variant: "body2", children: ["Consensus: Over ", _jsxs("b", { children: [consensus.overPercentage ?? 'N/A', "%"] }), " / Under ", _jsxs("b", { children: [consensus.underPercentage ?? 'N/A', "%"] })] }) }), _jsxs(Box, { className: "mt-2", children: [_jsx(Typography, { variant: "body2", children: "Odds:" }), _jsxs(Typography, { variant: "caption", children: ["Moneyline: ", odds.moneyline ?? 'N/A', " | Spread: ", odds.spread ?? 'N/A', " | Total: ", odds.total ?? 'N/A'] })] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { className: "bg-gray-900 text-white dark:bg-gray-800", children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(FaArrowUp, { className: "inline mr-2" }), "Pattern Recognition & Injuries"] }), patterns.length > 0 ? (_jsx(Box, { children: patterns.map((p, idx) => (_jsx(StatusChip, { label: p.label, color: p.positive ? 'success' : 'default', icon: p.positive ? _jsx(FaArrowUp, {}) : _jsx(FaArrowDown, {}) }, idx))) })) : (_jsx(Typography, { variant: "body2", children: "No significant patterns detected." })), _jsxs(Box, { className: "mt-2", children: [_jsx(Typography, { variant: "body2", children: "Injuries:" }), injuries.length > 0 ? injuries.map((inj, idx) => (_jsxs(Typography, { variant: "caption", children: [inj.player, ": ", inj.status, " (Impact: ", inj.impact, ")"] }, idx))) : _jsx(Typography, { variant: "caption", children: "No major injuries reported." })] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { className: "bg-gray-900 text-white dark:bg-gray-800 mt-4", children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Model Explainability" }), explainability.featureImportances ? (_jsx(Bar, { data: {
                                        labels: Object.keys(explainability.featureImportances),
                                        datasets: [{
                                                label: 'Feature Importance',
                                                data: Object.values(explainability.featureImportances),
                                                backgroundColor: primaryColor,
                                            }],
                                    }, options: {
                                        plugins: { legend: { display: false } },
                                        responsive: true,
                                        scales: { x: { ticks: { color: textColor } }, y: { ticks: { color: textColor } } },
                                    } })) : _jsx(Typography, { variant: "body2", children: "No explainability data available." })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { className: "bg-gray-900 text-white dark:bg-gray-800 mt-4", children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Risk & Confidence" }), _jsxs(Box, { className: "flex flex-row flex-wrap gap-2 items-center", children: [_jsx(StatusChip, { label: `Risk: ${enhancedAnalysis.riskLevel ?? 'N/A'}`, color: "warning", icon: _jsx(FaExclamationTriangle, {}) }), _jsx(StatusChip, { label: `Confidence: ${enhancedAnalysis.confidence ? `${(enhancedAnalysis.confidence * 100).toFixed(1)}%` : 'N/A'}`, color: "primary", icon: _jsx(FaBolt, {}) })] })] }) }) })] }) }));
};
export { AdvancedAnalytics };
