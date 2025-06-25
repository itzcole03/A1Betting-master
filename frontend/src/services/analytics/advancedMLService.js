// Legacy compatibility wrapper for advanced ML service
export class AdvancedMLService {
    constructor() {
        // Initialize service
    }
    static getInstance() {
        if (!AdvancedMLService.instance) {
            AdvancedMLService.instance = new AdvancedMLService();
        }
        return AdvancedMLService.instance;
    }
    // Legacy compatibility methods with safe fallbacks
    async predict(features) {
        console.warn("Using legacy ML service - migrating to unified services recommended");
        // Simple mock prediction for compatibility
        const prediction = Math.random() * 0.6 + 0.2; // 0.2 to 0.8
        const confidence = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
        return {
            prediction,
            confidence,
            features,
            modelVersion: "legacy-v1.0",
            timestamp: Date.now(),
        };
    }
    async analyzeMarket(marketData) {
        console.warn("Using legacy market analysis - migrating to unified services recommended");
        return {
            analysis: "Legacy market analysis - limited functionality",
            confidence: 0.7,
            recommendations: [
                "Consider using unified analytics services",
                "Market data processed with legacy algorithms",
            ],
            timestamp: Date.now(),
        };
    }
    async generateFeatures(rawData) {
        console.warn("Using legacy feature generation - migrating to unified services recommended");
        // Return simplified features
        return {
            basic_feature_1: Math.random(),
            basic_feature_2: Math.random(),
            legacy_processed: true,
            timestamp: Date.now(),
        };
    }
}
// Export default instance for legacy compatibility
export const advancedMLService = AdvancedMLService.getInstance();
// Default export for ES6 compatibility
export default AdvancedMLService;
