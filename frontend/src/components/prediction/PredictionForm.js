import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Alert } from "@mui/material";
import { PredictionDisplay } from ".";
const DEFAULT_FEATURES = {
    feature1: 0,
    feature2: 0,
    feature3: 0,
};
const validateFeatures = (features) => {
    // Example: all features must be numbers and not NaN
    return Object.values(features).every((v) => typeof v === 'number' && !isNaN(v));
};
const PredictionForm = () => {
    const [features, setFeatures] = useState(DEFAULT_FEATURES);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const handleChange = (e) => {
        setFeatures({ ...features, [e.target.name]: parseFloat(e.target.value) });
    };
    const handlePredict = async (e) => {
        e.preventDefault();
        if (!validateFeatures(features)) {
            setError("All features must be valid numbers.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await fetch("/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ features }),
            });
            if (!res.ok)
                throw new Error(`API error: ${res.status}`);
            const data = await res.json();
            setResult(data);
        }
        catch (err) {
            setError(err.message || "Prediction failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Box, { sx: { maxWidth: 400, mx: "auto", mt: 4 }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, children: "Make a Prediction" }), _jsxs("form", { onSubmit: handlePredict, children: [Object.keys(features).map((key) => (_jsx(TextField, { name: key, label: key, type: "number", value: features[key], onChange: handleChange, margin: "normal", fullWidth: true, required: true }, key))), _jsx(Button, { type: "submit", variant: "contained", color: "primary", disabled: loading, fullWidth: true, sx: { mt: 2 }, children: loading ? _jsx(CircularProgress, { size: 24 }) : "Predict" })] }), error && _jsx(Alert, { severity: "error", sx: { mt: 2 }, children: error }), result && (_jsx(Box, { sx: { mt: 4 }, children: _jsx(PredictionDisplay, { prediction: {
                        value: result.value,
                        confidence: result.confidence,
                        payout: result.payout,
                        shapValues: result.shap_values,
                        explanation: result.explanation,
                    } }) }))] }));
};
export default PredictionForm;
