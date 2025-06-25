import { useState, useEffect } from 'react';
export const useAnalytics = (event, market, selection) => {
    const [metrics, setMetrics] = useState(null);
    const [trendDelta, setTrendDelta] = useState(null);
    const [riskProfile, setRiskProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setIsLoading(true);
                // Fetch analytics data from your API
                const response = await fetch(`/api/analytics/${event}/${market}/${selection}`);
                const data = await response.json();
                setMetrics(data.metrics);
                setTrendDelta(data.trendDelta);
                setRiskProfile(data.riskProfile);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, [event, market, selection]);
    return {
        metrics: metrics || {
            accuracy: 0,
            profitLoss: 0,
            precision: 0,
            recall: 0,
            timestamp: new Date().toISOString(),
        },
        trendDelta: trendDelta || {
            accuracyDelta: 0,
            precisionDelta: 0,
            recallDelta: 0,
            profitLossDelta: 0,
            period: 'day',
            timestamp: new Date().toISOString(),
        },
        riskProfile: riskProfile || {
            riskLevel: 'medium',
            recommendation: 'Proceed with caution',
            factors: [],
            timestamp: new Date().toISOString(),
        },
        isLoading,
        error,
    };
};
