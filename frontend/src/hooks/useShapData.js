import { useState, useEffect } from 'react';
export function useShapData({ eventId, modelType = 'default', }) {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchShapData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/shap/${eventId}?model=${modelType}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch SHAP data');
                }
                const data = await response.json();
                // Transform the raw data into ShapValue objects
                const shapValues = Object.entries(data).map(([feature, value]) => ({
                    feature,
                    value: value,
                    impact: value,
                    weight: Math.abs(value) * 100, // Normalize to percentage
                }));
                setFeatures(shapValues);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
            finally {
                setLoading(false);
            }
        };
        if (eventId) {
            fetchShapData();
        }
    }, [eventId, modelType]);
    return { features, loading, error };
}
