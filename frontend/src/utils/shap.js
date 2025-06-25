/**
 * Calculate SHAP values for given features
 * This is a simplified implementation for demonstration
 */
export function calculateShap(features, modelType = 'default') {
    const shapValues = {};
    // Simple SHAP calculation based on feature importance
    const totalFeatureValue = Object.values(features).reduce((sum, val) => sum + Math.abs(val), 0);
    for (const [key, value] of Object.entries(features)) {
        // Normalize by total feature importance
        // Production: Should use real SHAP calculation, not randomized values
        const baseImportance = totalFeatureValue > 0 ? Math.abs(value) / totalFeatureValue : 0;
        shapValues[key] = baseImportance; // No noise in production
    }
    return shapValues;
}
/**
 * Aggregate multiple SHAP vectors into a single vector
 */
export function aggregateShapValues(shapVectors) {
    if (shapVectors.length === 0)
        return {};
    const aggregated = {};
    const allKeys = new Set();
    // Collect all unique keys
    shapVectors.forEach(shap => {
        Object.keys(shap).forEach(key => allKeys.add(key));
    });
    // Calculate average for each key
    allKeys.forEach(key => {
        const values = shapVectors.map(shap => shap[key] || 0);
        aggregated[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });
    return aggregated;
}
/**
 * Get top N most important features from SHAP values
 */
export function getTopShapFeatures(shapValues, n = 5) {
    return Object.entries(shapValues)
        .map(([feature, importance]) => ({ feature, importance: Math.abs(importance) }))
        .sort((a, b) => b.importance - a.importance)
        .slice(0, n);
}
