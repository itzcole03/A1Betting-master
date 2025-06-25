import axios from 'axios';
import { toast } from 'react-toastify';
class UnifiedPredictionService {
    constructor() {
        this.modelWeights = {
            xgboost: 0.3,
            lightgbm: 0.25,
            catboost: 0.2,
            neuralNetwork: 0.15,
            randomForest: 0.1,
        };
        this.config = {
            minConfidence: 0.7,
            maxStakePercentage: 0.1,
            riskProfile: 'moderate',
            autoRefresh: true,
            refreshInterval: 30000,
        };
        this.weatherCache = new Map();
        this.injuryCache = new Map();
        this.sentimentCache = new Map();
        this.apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        this.wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000';
    }
    static getInstance() {
        if (!UnifiedPredictionService.instance) {
            UnifiedPredictionService.instance = new UnifiedPredictionService();
        }
        return UnifiedPredictionService.instance;
    }
    async analyzePredictionFactors(opportunity) {
        const factors = [];
        // Parallel execution of factor analysis
        const [injuryFactors, weatherFactor, sentimentFactor, patternFactors] = await Promise.all([
            this.analyzeInjuryImpact(opportunity),
            this.analyzeWeatherImpact(opportunity),
            this.analyzeSentiment(opportunity),
            this.findHistoricalPatterns(opportunity),
        ]);
        factors.push(...injuryFactors);
        if (weatherFactor)
            factors.push(weatherFactor);
        factors.push(sentimentFactor);
        factors.push(...patternFactors);
        return this.normalizePredictionFactors(factors);
    }
    async analyzeInjuryImpact(opportunity) {
        const injuries = this.injuryCache.get(opportunity.event_name) || [];
        return injuries
            .filter(injury => injury.impactScore > 0.3)
            .map(injury => ({
            name: 'Injury Impact',
            impact: -injury.impactScore,
            confidence: this.calculateInjuryConfidence(injury),
            description: `${injury.playerName} (${injury.position}) - ${injury.status}`,
            metadata: {
                playerId: injury.playerId,
                status: injury.status,
                position: injury.position,
            },
        }));
    }
    calculateInjuryConfidence(injury) {
        const statusConfidence = {
            OUT: 1,
            DOUBTFUL: 0.75,
            QUESTIONABLE: 0.5,
            PROBABLE: 0.25,
        };
        return statusConfidence[injury.status] * injury.impactScore;
    }
    async analyzeWeatherImpact(opportunity) {
        const weather = this.weatherCache.get(opportunity.event_name);
        if (!weather)
            return null;
        const impact = this.calculateWeatherImpact(weather);
        if (Math.abs(impact) < 0.2)
            return null;
        return {
            name: 'Weather Conditions',
            impact,
            confidence: 0.8,
            description: `${weather.conditions} - ${weather.temperature}°F, Wind: ${weather.windSpeed}mph`,
            metadata: { ...weather },
        };
    }
    calculateWeatherImpact(weather) {
        let impact = 0;
        if (weather.windSpeed > 15) {
            impact -= (weather.windSpeed - 15) / 30;
        }
        if (weather.precipitation > 0) {
            impact -= weather.precipitation / 10;
        }
        const optimalTemp = 70;
        const tempDiff = Math.abs(weather.temperature - optimalTemp);
        if (tempDiff > 30) {
            impact -= (tempDiff - 30) / 50;
        }
        return Math.max(-1, Math.min(1, impact));
    }
    async analyzeSentiment(opportunity) {
        const sentimentData = this.sentimentCache.get(opportunity.event_name) || [];
        if (sentimentData.length === 0) {
            return {
                name: 'Market Sentiment',
                impact: 0,
                confidence: 0,
                description: 'No sentiment data available',
                metadata: { dataPoints: 0 },
            };
        }
        const recentSentiment = sentimentData
            .filter(data => Date.now() - data.timestamp < 24 * 60 * 60 * 1000)
            .reduce((acc, data) => acc + data.sentiment * data.volume, 0);
        const totalVolume = sentimentData.reduce((acc, data) => acc + data.volume, 0);
        const averageSentiment = totalVolume > 0 ? recentSentiment / totalVolume : 0;
        return {
            name: 'Market Sentiment',
            impact: averageSentiment,
            confidence: Math.min(1, totalVolume / 1000),
            description: `Average sentiment: ${averageSentiment.toFixed(2)}`,
            metadata: {
                dataPoints: sentimentData.length,
                keywords: this.aggregateKeywords(sentimentData),
            },
        };
    }
    aggregateKeywords(sentimentData) {
        const keywordCounts = new Map();
        sentimentData.forEach(data => {
            data.keywords.forEach(keyword => {
                keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
            });
        });
        return Array.from(keywordCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([keyword]) => keyword);
    }
    async findHistoricalPatterns(opportunity) {
        const patterns = await this.findSimilarHistoricalScenarios(opportunity);
        return patterns.map(pattern => ({
            name: 'Historical Pattern',
            impact: this.calculatePatternImpact(pattern),
            confidence: pattern.confidence,
            description: `Pattern: ${pattern.pattern} (${(pattern.similarity * 100).toFixed(1)}% similar)`,
            metadata: pattern.metadata,
        }));
    }
    async findSimilarHistoricalScenarios(opportunity) {
        try {
            const response = await axios.post(`${this.apiUrl}/api/predictions/historical-patterns`, {
                market: opportunity.event_name,
                odds: opportunity.odds,
                timestamp: opportunity.start_time,
            });
            return response.data.patterns;
        }
        catch (error) {
            console.error('Error finding historical patterns:', error);
            return [];
        }
    }
    calculatePatternImpact(pattern) {
        return pattern.similarity * (pattern.metadata.winRate - 0.5) * 2;
    }
    normalizePredictionFactors(factors) {
        const totalConfidence = factors.reduce((sum, factor) => sum + factor.confidence, 0);
        return factors.map(factor => ({
            ...factor,
            impact: factor.impact * (factor.confidence / totalConfidence),
        }));
    }
    async getPredictions(eventId) {
        try {
            const response = await axios.get(`${this.apiUrl}/api/predictions/${eventId}`);
            return this.processPredictions(response.data);
        }
        catch (error) {
            console.error('Error fetching predictions:', error);
            toast.error('Failed to fetch predictions');
            return [];
        }
    }
    processPredictions(rawPredictions) {
        return rawPredictions.map(prediction => ({
            ...prediction,
            confidence: this.calculateConfidence(prediction),
            timeDecay: this.calculateTimeDecay(prediction.timestamp),
            performanceFactor: this.calculatePerformanceFactor(prediction.performance),
        }));
    }
    calculateConfidence(prediction) {
        const baseConfidence = prediction.confidence || 0.5;
        const modelWeight = this.modelWeights[prediction.modelType] || 0.2;
        return baseConfidence * modelWeight;
    }
    calculateTimeDecay(timestamp) {
        const age = Date.now() - new Date(timestamp).getTime();
        return Math.exp(-age / (24 * 60 * 60 * 1000)); // 24-hour decay
    }
    calculatePerformanceFactor(performance) {
        return performance?.accuracy || 0.5;
    }
    async updateModelWeights(performance) {
        const totalPerformance = Object.values(performance).reduce((sum, val) => sum + val, 0);
        Object.keys(performance).forEach(model => {
            this.modelWeights[model] = performance[model] / totalPerformance;
        });
    }
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    getConfig() {
        return { ...this.config };
    }
    async getRecentPredictions() {
        try {
            const response = await axios.get(`${this.apiUrl}/api/predictions/recent`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching recent predictions:', error);
            return [];
        }
    }
    async generatePrediction(modelOutputs) {
        try {
            const response = await axios.post(`${this.apiUrl}/api/predictions/generate`, {
                modelOutputs,
                config: this.config,
            });
            return response.data;
        }
        catch (error) {
            console.error('Error generating prediction:', error);
            return null;
        }
    }
    async getEngineMetrics() {
        try {
            const response = await axios.get(`${this.apiUrl}/api/predictions/metrics`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching engine metrics:', error);
            return null;
        }
    }
    async getModelPerformance(modelType) {
        try {
            const response = await axios.get(`${this.apiUrl}/api/predictions/model-performance/${modelType}`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching model performance:', error);
            return null;
        }
    }
    async getFeatureImportance(modelType) {
        try {
            const response = await axios.get(`${this.apiUrl}/api/predictions/feature-importance/${modelType}`);
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch feature importance:', error);
            return {};
        }
    }
    async getShapValues(eventId) {
        try {
            const response = await axios.get(`${this.apiUrl}/api/predictions/shap-values/${eventId}`);
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch SHAP values:', error);
            return {};
        }
    }
    // Cache management methods
    updateWeatherData(market, data) {
        this.weatherCache.set(market, data);
    }
    updateInjuryData(market, data) {
        this.injuryCache.set(market, data);
    }
    updateSentimentData(market, data) {
        const existingData = this.sentimentCache.get(market) || [];
        this.sentimentCache.set(market, [...existingData, data]);
    }
    clearCaches() {
        this.weatherCache.clear();
        this.injuryCache.clear();
        this.sentimentCache.clear();
    }
}
UnifiedPredictionService.instance = null;
export default UnifiedPredictionService;
