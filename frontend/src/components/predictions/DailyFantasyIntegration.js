import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Grid, TextField, FormControl, InputLabel, Select, MenuItem, } from '@mui/material';
import { useLogger } from '../../hooks/useLogger';
import { useMetrics } from '../../hooks/useMetrics';
export const DailyFantasyIntegration = ({ onDataUpdate, sport, date, }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [apiKey, setApiKey] = useState('');
    const [site, setSite] = useState('draftkings');
    const logger = useLogger();
    const metrics = useMetrics();
    useEffect(() => {
        const fetchData = async () => {
            if (!apiKey)
                return;
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/dailyfantasy/${sport}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        site,
                        date,
                        sport,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.statusText}`);
                }
                const fantasyData = await response.json();
                // Calculate value score based on projected points and salary
                const processedData = fantasyData.map((player) => ({
                    ...player,
                    valueScore: player.projectedPoints / (player.salary / 1000), // Points per $1000
                }));
                setData(processedData);
                onDataUpdate(processedData);
                metrics.track('dailyfantasy_data_fetched', 1, {
                    sport,
                    site,
                    playerCount: processedData.length.toString(),
                });
                logger.info('Successfully fetched DailyFantasy data', {
                    sport,
                    site,
                    playerCount: processedData.length,
                });
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch DailyFantasy data';
                setError(errorMessage);
                logger.error('Error fetching DailyFantasy data', { error: errorMessage });
                metrics.increment('dailyfantasy_fetch_error');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [apiKey, site, date, sport, onDataUpdate, logger, metrics]);
    const handleApiKeyChange = (event) => {
        setApiKey(event.target.value);
    };
    const handleSiteChange = (event) => {
        setSite(event.target.value);
    };
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Daily Fantasy Integration" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, md: 6, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "API Key", margin: "normal", type: "password", value: apiKey, onChange: handleApiKeyChange }) }), _jsx(Grid, { item: true, md: 6, xs: 12, children: _jsxs(FormControl, { fullWidth: true, margin: "normal", children: [_jsx(InputLabel, { children: "Site" }), _jsxs(Select, { label: "Site", value: site, onChange: handleSiteChange, children: [_jsx(MenuItem, { value: "draftkings", children: "DraftKings" }), _jsx(MenuItem, { value: "fanduel", children: "FanDuel" })] })] }) })] }), isLoading && (_jsx(Box, { display: "flex", justifyContent: "center", my: 3, children: _jsx(CircularProgress, {}) })), error && (_jsx(Alert, { severity: "error", sx: { mt: 2 }, children: error })), data.length > 0 && (_jsxs(Box, { mt: 3, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Data Summary" }), _jsxs(Typography, { variant: "body2", children: [data.length, " players loaded"] }), _jsxs(Typography, { variant: "body2", children: ["Average Value Score:", ' ', (data.reduce((sum, player) => sum + (player.valueScore || 0), 0) / data.length).toFixed(2)] })] }))] }) }));
};
