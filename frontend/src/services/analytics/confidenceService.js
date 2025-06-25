// confidenceService.ts
// Singleton service for prediction confidence bands and win probability analytics
class ConfidenceService {
    constructor() {
        this.cache = new Map();
    }
    static getInstance() {
        if (!ConfidenceService._instance) {
            ConfidenceService._instance = new ConfidenceService();
        }
        return ConfidenceService._instance;
    }
    // Simulate or fetch prediction with confidence
    getPredictionWithConfidence(eventId, player, market) {
        const cacheKey = `${eventId}:${player}:${market}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        // Simulate (replace with real logic or API call)
        const now = new Date().toISOString();
        const confidenceBand = {
            lower: Math.random() * 10 + 10,
            upper: Math.random() * 10 + 20,
            mean: Math.random() * 5 + 15,
            confidenceLevel: 0.95,
        };
        const winProbability = {
            probability: Math.random() * 0.5 + 0.25,
            impliedOdds: 1 / (Math.random() * 0.5 + 0.25),
            modelOdds: 1 / (Math.random() * 0.5 + 0.25),
            updatedAt: now,
        };
        const prediction = {
            predictionId: cacheKey,
            eventId,
            predictedValue: confidenceBand.mean,
            confidenceBand,
            winProbability,
            model: 'Alpha1-ML',
            market,
            player,
            team: 'TBD',
            context: 'Simulated',
        };
        this.cache.set(cacheKey, prediction);
        return prediction;
    }
    clearCache() {
        this.cache.clear();
    }
}
export const confidenceService = ConfidenceService.getInstance();
