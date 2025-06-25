import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Grid, Button, FormControl, InputLabel, Select, MenuItem, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from '@mui/material';
import { useLogger } from '../../hooks/useLogger';
import { useMetrics } from '../../hooks/useMetrics';
export const PredictionGenerator = ({ modelName, availableModels, onPredictionsGenerated, }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedModel, setSelectedModel] = useState(modelName);
    const [predictions, setPredictions] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const logger = useLogger();
    const metrics = useMetrics();
    useEffect(() => {
        setSelectedModel(modelName);
    }, [modelName]);
    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };
    const handleDateChange = (event) => {
        setDate(event.target.value);
    };
    const generatePredictions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/predictions/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    modelName: selectedModel,
                    date,
                }),
            });
            if (!response.ok) {
                throw new Error(`Failed to generate predictions: ${response.statusText}`);
            }
            const data = await response.json();
            const timestamp = new Date().toISOString();
            const processedPredictions = data.map((prediction) => ({
                ...prediction,
                timestamp,
            }));
            setPredictions(processedPredictions);
            onPredictionsGenerated(processedPredictions);
            metrics.track('predictions_generated', 1, {
                modelName: selectedModel,
                predictionCount: processedPredictions.length.toString(),
            });
            logger.info('Successfully generated predictions', {
                modelName: selectedModel,
                predictionCount: processedPredictions.length,
            });
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate predictions';
            setError(errorMessage);
            logger.error('Error generating predictions', { error: errorMessage });
            metrics.increment('prediction_generation_error');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Generate Predictions" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, md: 4, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Model" }), _jsx(Select, { label: "Model", value: selectedModel, onChange: handleModelChange, children: availableModels.map(model => (_jsx(MenuItem, { value: model, children: model }, model))) })] }) }), _jsx(Grid, { item: true, md: 4, xs: 12, children: _jsx(TextField, { fullWidth: true, InputLabelProps: { shrink: true }, label: "Date", type: "date", value: date, onChange: handleDateChange }) }), _jsx(Grid, { item: true, md: 4, xs: 12, children: _jsx(Button, { fullWidth: true, color: "primary", disabled: isLoading, sx: { height: '56px' }, variant: "contained", onClick: generatePredictions, children: "Generate Predictions" }) })] }), isLoading && (_jsx(Box, { display: "flex", justifyContent: "center", my: 3, children: _jsx(CircularProgress, {}) })), error && (_jsx(Alert, { severity: "error", sx: { mt: 2 }, children: error })), predictions.length > 0 && (_jsxs(Box, { mt: 3, children: [_jsx(Typography, { gutterBottom: true, variant: "subtitle1", children: "Generated Predictions" }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Player" }), _jsx(TableCell, { align: "right", children: "Win Probability" }), _jsx(TableCell, { align: "right", children: "Predicted Score" }), _jsx(TableCell, { align: "right", children: "Confidence" }), _jsx(TableCell, { align: "right", children: "Generated At" })] }) }), _jsx(TableBody, { children: predictions.map(prediction => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: prediction.playerName }), _jsxs(TableCell, { align: "right", children: [prediction.predictedWinProbability.toFixed(1), "%"] }), _jsx(TableCell, { align: "right", children: prediction.predictedScore.toFixed(1) }), _jsxs(TableCell, { align: "right", children: [prediction.confidence.toFixed(1), "%"] }), _jsx(TableCell, { align: "right", children: new Date(prediction.timestamp).toLocaleString() })] }, prediction.playerId))) })] }) })] }))] }) }));
};
