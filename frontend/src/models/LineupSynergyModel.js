import { UnifiedConfig } from '../unified/UnifiedConfig.js';
export async function getLineupSynergyFeatures(lineupIds, sport, context) {
    const config = UnifiedConfig.getInstance();
    if (!config.get('enableLineupSynergyModel')) {
        throw new Error('LineupSynergyModel is disabled by config.');
    }
    // Example feature extraction (replace with real logic)
    const features = {
        avgSynergy: Math.random(),
        experienceTogether: Math.random(),
        diversity: Math.random(),
    };
    // Generate SHAP insights
    const { calculateShap } = await import('../utils/shap.js');
    const shap = calculateShap(features, 'lineup');
    return {
        features,
        shapInsights: [shap],
        synergyScore: features.avgSynergy * 0.5 + features.experienceTogether * 0.3 + features.diversity * 0.2,
    };
}
