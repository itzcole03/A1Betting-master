import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, useCallback } from 'react';
import { AdvancedMLDashboard } from './AdvancedMLDashboard';
import { UltimateMoneyMaker } from './UltimateMoneyMaker';
import { GlobalErrorBoundary as ErrorBoundary } from '../common/ErrorBoundary.js';
import { LoadingSkeleton } from '../common/LoadingSkeleton.js';
import { ToastProvider } from '../common/ToastProvider.js';
import axios from 'axios';
const MoneyMakerAdvanced = () => {
    const [models, setModels] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [modelsRes, oppsRes] = await Promise.all([
                    axios.get('/api/ml-models'),
                    axios.get('/api/betting-opportunities'),
                ]);
                setModels(modelsRes.data);
                setOpportunities(oppsRes.data);
            }
            catch (_err) {
                setError('Failed to load dashboard data');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const handlePlaceBet = useCallback(async (opportunity) => {
        try {
            await axios.post('/api/place-bet', { opportunityId: opportunity.id });
            // Optionally refresh opportunities or show toast
        }
        catch (err) {
            // Optionally show error toast
            console.error('Error placing bet:', err);
        }
    }, []);
    if (loading) {
        return _jsx(LoadingSkeleton, {});
    }
    if (error) {
        return _jsx("div", { className: "text-red-600 text-center p-8", children: error });
    }
    return (_jsx(ToastProvider, { children: _jsx(ErrorBoundary, { children: _jsx("div", { className: "p-4 md:p-6 lg:p-8 bg-gradient-to-br from-yellow-900/80 to-yellow-700/80 min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 transition-colors", children: _jsx(React.Suspense, { fallback: _jsx(LoadingSkeleton, {}), children: _jsxs("main", { "aria-label": "Advanced Money Maker ML Dashboard", className: "glass-card rounded-2xl shadow-xl p-6 mb-8 animate-fade-in animate-scale-in", children: [_jsx(AdvancedMLDashboard, { models: models }), _jsx(UltimateMoneyMaker, { opportunities: opportunities, onPlaceBet: handlePlaceBet })] }) }) }) }) }));
};
export default MoneyMakerAdvanced;
