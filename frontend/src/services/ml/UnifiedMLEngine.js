import { EventEmitter } from "eventemitter3";
import { storeEventBus } from "../../store/unified/UnifiedStoreManager";
import { FEATURE_FLAGS, VALIDATION_RULES, } from "../../config/unifiedApiConfig";
// Feature Engineering Classes
class FeatureEngineer {
    static engineerFeatures(rawData) {
        const features = {};
        // Player features
        if (rawData.playerStats) {
            features.player_recent_form = this.calculateRecentForm(rawData.playerStats);
            features.player_vs_opponent = this.calculateHeadToHead(rawData.playerStats, rawData.opponent);
            features.player_rest_impact = this.calculateRestImpact(rawData.playerStats, rawData.restDays);
        }
        // Team features
        if (rawData.teamStats) {
            features.team_offensive_rating = rawData.teamStats.offensiveRating || 0;
            features.team_defensive_rating = rawData.teamStats.defensiveRating || 0;
            features.team_pace = rawData.teamStats.pace || 0;
            features.home_court_advantage = rawData.isHome
                ? rawData.teamStats.homeAdvantage || 2.5
                : 0;
        }
        // Game context features
        features.rest_days = Math.min(rawData.restDays || 0, 7);
        features.back_to_back = rawData.backToBack ? 1 : 0;
        features.travel_distance =
            Math.min(rawData.travelDistance || 0, 3000) / 3000;
        // Market features
        if (rawData.market) {
            features.line_movement = this.calculateLineMovement(rawData.market.history);
            features.betting_volume = this.normalizeVolume(rawData.market.volume);
            features.sharp_money_indicator = rawData.market.sharpMoney || 0;
        }
        // Environmental features
        if (rawData.environmental) {
            features.weather_impact = this.calculateWeatherImpact(rawData.environmental.weather);
            features.venue_advantage = rawData.environmental.venue?.advantage || 0;
        }
        // ELO ratings
        features.elo_rating_home = rawData.eloRatings?.home || 1500;
        features.elo_rating_away = rawData.eloRatings?.away || 1500;
        features.elo_difference =
            features.elo_rating_home - features.elo_rating_away;
        // Injury impact
        features.injury_impact = this.calculateInjuryImpact(rawData.injuries);
        return features;
    }
    static calculateRecentForm(playerStats) {
        if (!playerStats?.length)
            return 0;
        const recentGames = playerStats.slice(-5);
        const weights = [0.4, 0.3, 0.2, 0.1, 0.05]; // More weight on recent games
        let weightedPerformance = 0;
        let totalWeight = 0;
        recentGames.forEach((game, index) => {
            const weight = weights[index] || 0.05;
            const performance = (game.points + game.rebounds + game.assists) / 30; // Normalized
            weightedPerformance += performance * weight;
            totalWeight += weight;
        });
        return totalWeight > 0 ? weightedPerformance / totalWeight : 0;
    }
    static calculateHeadToHead(playerStats, opponent) {
        const h2hGames = playerStats.filter((game) => game.opponent === opponent);
        if (!h2hGames.length)
            return 0;
        return (h2hGames.reduce((acc, game) => {
            return acc + (game.points + game.rebounds + game.assists) / 30;
        }, 0) / h2hGames.length);
    }
    static calculateRestImpact(playerStats, restDays) {
        if (restDays <= 1)
            return -0.1; // Back-to-back penalty
        if (restDays >= 4)
            return -0.05; // Rust factor
        return Math.min(restDays * 0.02, 0.1); // Optimal rest boost
    }
    static calculateLineMovement(marketHistory) {
        if (!marketHistory?.length)
            return 0;
        const initial = marketHistory[0]?.line || 0;
        const current = marketHistory[marketHistory.length - 1]?.line || 0;
        return (current - initial) / (initial || 1);
    }
    static normalizeVolume(volume) {
        return Math.min(volume / 1000000, 1); // Normalize to 0-1 scale
    }
    static calculateWeatherImpact(weather) {
        if (!weather)
            return 0;
        let impact = 0;
        if (weather.temperature) {
            const tempImpact = Math.abs(weather.temperature - 70) / 100; // Ideal temp ~70F
            impact += tempImpact;
        }
        if (weather.windSpeed) {
            impact += Math.min(weather.windSpeed / 30, 0.2);
        }
        if (weather.precipitation) {
            impact += weather.precipitation * 0.3;
        }
        return Math.min(impact, 1);
    }
    static calculateInjuryImpact(injuries) {
        if (!injuries?.length)
            return 0;
        return injuries.reduce((impact, injury) => {
            const severity = injury.severity || "minor";
            const playerImportance = injury.playerValue || 0.1;
            let injuryMultiplier = 0.1;
            if (severity === "major")
                injuryMultiplier = 0.5;
            else if (severity === "moderate")
                injuryMultiplier = 0.3;
            return impact + playerImportance * injuryMultiplier;
        }, 0);
    }
}
FeatureEngineer.FEATURE_CATEGORIES = {
    PLAYER: [
        "points",
        "rebounds",
        "assists",
        "shooting_pct",
        "usage_rate",
        "per",
        "form",
    ],
    TEAM: [
        "offensive_rating",
        "defensive_rating",
        "pace",
        "net_rating",
        "home_advantage",
    ],
    GAME: ["rest_days", "back_to_back", "travel_distance", "altitude"],
    MARKET: ["line_movement", "volume", "sharp_money", "public_betting"],
    ENVIRONMENTAL: ["weather", "venue", "referees", "motivation"],
};
// SHAP (SHapley Additive exPlanations) Implementation
class SHAPExplainer {
    static calculateShapValues(model, features, prediction) {
        const shapValues = {};
        const baseValue = 0.5; // Baseline prediction
        // Calculate feature contributions using approximate SHAP
        const totalContribution = prediction - baseValue;
        let remainingContribution = totalContribution;
        // Get feature importance weights for this model
        const featureImportances = this.getFeatureImportances(model);
        Object.entries(features).forEach(([feature, value]) => {
            const importance = featureImportances[feature] || 0.01;
            const normalizedValue = this.normalizeFeatureValue(feature, value);
            // Calculate SHAP value as importance * normalized_value * total_contribution
            const shapValue = importance * normalizedValue * totalContribution;
            shapValues[feature] = shapValue;
            remainingContribution -= shapValue;
        });
        // Distribute remaining contribution to top features
        if (Math.abs(remainingContribution) > 0.001) {
            const topFeatures = Object.entries(shapValues)
                .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
                .slice(0, 3);
            topFeatures.forEach(([feature], index) => {
                const adjustment = remainingContribution / topFeatures.length;
                shapValues[feature] += adjustment;
            });
        }
        return shapValues;
    }
    static getFeatureImportances(model) {
        // Mock feature importances - in real implementation, these would come from trained models
        const importances = {
            player_recent_form: 0.25,
            elo_difference: 0.2,
            team_offensive_rating: 0.15,
            rest_days: 0.1,
            home_court_advantage: 0.08,
            injury_impact: 0.07,
            line_movement: 0.05,
            player_vs_opponent: 0.05,
            weather_impact: 0.03,
            betting_volume: 0.02,
        };
        return importances;
    }
    static normalizeFeatureValue(feature, value) {
        // Normalize feature values to [-1, 1] range for SHAP calculation
        const ranges = {
            player_recent_form: [0, 2],
            elo_difference: [-400, 400],
            team_offensive_rating: [90, 120],
            rest_days: [0, 7],
            home_court_advantage: [0, 5],
            injury_impact: [0, 1],
            line_movement: [-0.5, 0.5],
        };
        const [min, max] = ranges[feature] || [0, 1];
        return Math.max(-1, Math.min(1, ((value - min) / (max - min)) * 2 - 1));
    }
}
// Main ML Engine
export class UnifiedMLEngine extends EventEmitter {
    constructor() {
        super();
        this.isTraining = false;
        this.models = new Map();
        this.cache = new Map();
        this.performanceMetrics = new Map();
        this.featureImportances = new Map();
        this.initializeModels();
    }
    static getInstance() {
        if (!UnifiedMLEngine.instance) {
            UnifiedMLEngine.instance = new UnifiedMLEngine();
        }
        return UnifiedMLEngine.instance;
    }
    initializeModels() {
        // Initialize ensemble models with realistic configurations
        const models = [
            {
                name: "XGBoost_Primary",
                type: "xgboost",
                version: "1.0.0",
                weight: 0.35,
                features: [
                    "player_recent_form",
                    "elo_difference",
                    "team_offensive_rating",
                    "rest_days",
                    "home_court_advantage",
                ],
                hyperparameters: {
                    max_depth: 6,
                    learning_rate: 0.1,
                    n_estimators: 100,
                    subsample: 0.8,
                },
                performance: {
                    accuracy: 0.687,
                    precision: 0.692,
                    recall: 0.681,
                    f1Score: 0.686,
                    roc_auc: 0.751,
                    logLoss: 0.635,
                },
                lastTrained: Date.now() - 86400000, // 24 hours ago
                isActive: true,
            },
            {
                name: "LightGBM_Secondary",
                type: "lightgbm",
                version: "1.0.0",
                weight: 0.3,
                features: [
                    "player_vs_opponent",
                    "line_movement",
                    "betting_volume",
                    "injury_impact",
                    "weather_impact",
                ],
                hyperparameters: {
                    num_leaves: 31,
                    learning_rate: 0.05,
                    feature_fraction: 0.9,
                    bagging_fraction: 0.8,
                },
                performance: {
                    accuracy: 0.673,
                    precision: 0.678,
                    recall: 0.668,
                    f1Score: 0.673,
                    roc_auc: 0.742,
                    logLoss: 0.648,
                },
                lastTrained: Date.now() - 86400000,
                isActive: true,
            },
            {
                name: "RandomForest_Tertiary",
                type: "randomforest",
                version: "1.0.0",
                weight: 0.25,
                features: [
                    "team_defensive_rating",
                    "pace",
                    "back_to_back",
                    "travel_distance",
                    "venue_advantage",
                ],
                hyperparameters: {
                    n_estimators: 200,
                    max_depth: 10,
                    min_samples_split: 5,
                    min_samples_leaf: 2,
                },
                performance: {
                    accuracy: 0.659,
                    precision: 0.664,
                    recall: 0.654,
                    f1Score: 0.659,
                    roc_auc: 0.728,
                    logLoss: 0.661,
                },
                lastTrained: Date.now() - 86400000,
                isActive: true,
            },
            {
                name: "Neural_Network_Advanced",
                type: "neural_network",
                version: "1.0.0",
                weight: 0.1,
                features: ["all"], // Uses all available features
                hyperparameters: {
                    hidden_layers: [128, 64, 32],
                    dropout_rate: 0.3,
                    learning_rate: 0.001,
                    batch_size: 32,
                },
                performance: {
                    accuracy: 0.695,
                    precision: 0.701,
                    recall: 0.689,
                    f1Score: 0.695,
                    roc_auc: 0.763,
                    logLoss: 0.621,
                },
                lastTrained: Date.now() - 86400000,
                isActive: FEATURE_FLAGS.ADVANCED_ANALYTICS,
            },
        ];
        models.forEach((model) => {
            this.models.set(model.name, model);
        });
    }
    async generatePrediction(input) {
        const startTime = performance.now();
        try {
            // Engineer features from raw input
            const features = FeatureEngineer.engineerFeatures(input);
            // Validate input
            this.validateInput(input, features);
            // Generate predictions from each active model
            const modelPredictions = [];
            const activeModels = Array.from(this.models.values()).filter((m) => m.isActive);
            for (const model of activeModels) {
                const prediction = await this.generateModelPrediction(model, features, input);
                modelPredictions.push(prediction);
            }
            // Combine predictions using weighted ensemble
            const ensemblePrediction = this.combineModelPredictions(modelPredictions, features);
            // Calculate additional metrics
            ensemblePrediction.metadata.processingTime =
                performance.now() - startTime;
            ensemblePrediction.metadata.dataFreshness =
                this.calculateDataFreshness(input);
            ensemblePrediction.metadata.signalQuality =
                this.calculateSignalQuality(modelPredictions);
            ensemblePrediction.metadata.modelAgreement =
                this.calculateModelAgreement(modelPredictions);
            // Cache the prediction
            this.cache.set(`prediction:${input.eventId}:${input.market}`, ensemblePrediction);
            // Emit prediction event
            this.emit("prediction:generated", {
                eventId: input.eventId,
                prediction: ensemblePrediction,
            });
            // Update store
            storeEventBus.emit("prediction:updated", {
                eventId: input.eventId,
                prediction: {
                    id: `${input.eventId}:${input.market}`,
                    confidence: ensemblePrediction.confidence,
                    predictedValue: ensemblePrediction.finalPrediction,
                    factors: ensemblePrediction.factors,
                    timestamp: Date.now(),
                    metadata: {
                        modelVersion: "ensemble_v1.0",
                        features,
                        shapValues: this.aggregateShapValues(modelPredictions),
                        performanceMetrics: ensemblePrediction.metadata,
                    },
                },
            });
            return ensemblePrediction;
        }
        catch (error) {
            this.emit("prediction:error", { eventId: input.eventId, error });
            throw new Error(`Prediction generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async generateModelPrediction(model, features, input) {
        const startTime = performance.now();
        // In a real implementation, this would call the actual ML model
        // For now, we'll simulate model predictions with realistic logic
        const prediction = this.simulateModelPrediction(model, features);
        const confidence = this.calculateModelConfidence(model, features, prediction);
        const shapValues = SHAPExplainer.calculateShapValues(model, features, prediction);
        return {
            modelName: model.name,
            prediction,
            confidence,
            features,
            shapValues,
            processingTime: performance.now() - startTime,
            modelVersion: model.version,
        };
    }
    simulateModelPrediction(model, features) {
        // Simulate realistic model prediction based on features
        let prediction = 0.5; // Base probability
        // Apply feature influences based on model type
        if (model.type === "xgboost") {
            prediction += (features.elo_difference || 0) * 0.0005;
            prediction += (features.player_recent_form || 0) * 0.1;
            prediction += (features.home_court_advantage || 0) * 0.02;
        }
        else if (model.type === "lightgbm") {
            prediction += (features.line_movement || 0) * 0.2;
            prediction += (features.injury_impact || 0) * -0.1;
            prediction += (features.player_vs_opponent || 0) * 0.05;
        }
        else if (model.type === "randomforest") {
            prediction += (features.rest_days || 0) * 0.01;
            prediction += (features.team_offensive_rating || 0) * 0.005;
            prediction += (features.back_to_back || 0) * -0.05;
        }
        // Add some model-specific noise and ensure bounds
        const noise = (Math.random() - 0.5) * 0.1;
        prediction = Math.max(0.05, Math.min(0.95, prediction + noise));
        return prediction;
    }
    calculateModelConfidence(model, features, prediction) {
        // Base confidence on model performance and prediction characteristics
        let confidence = model.performance.accuracy;
        // Adjust based on prediction extremity (more confident at extremes)
        const extremity = Math.abs(prediction - 0.5) * 2;
        confidence += extremity * 0.1;
        // Adjust based on feature completeness
        const expectedFeatures = model.features.length;
        const availableFeatures = Object.keys(features).length;
        const featureCompleteness = availableFeatures / expectedFeatures;
        confidence *= featureCompleteness;
        return Math.max(0.1, Math.min(1.0, confidence));
    }
    combineModelPredictions(predictions, features) {
        // Weighted ensemble prediction
        let weightedSum = 0;
        let totalWeight = 0;
        let confidenceSum = 0;
        predictions.forEach((pred) => {
            const model = this.models.get(pred.modelName);
            if (!model)
                return;
            const weight = model.weight * pred.confidence;
            weightedSum += pred.prediction * weight;
            totalWeight += weight;
            confidenceSum += pred.confidence;
        });
        const finalPrediction = totalWeight > 0 ? weightedSum / totalWeight : 0.5;
        const avgConfidence = predictions.length > 0 ? confidenceSum / predictions.length : 0;
        // Calculate consensus score (how much models agree)
        const consensusScore = this.calculateConsensusScore(predictions);
        // Calculate value edge and Kelly fraction
        const valueEdge = this.calculateValueEdge(finalPrediction, features);
        const kellyFraction = this.calculateKellyFraction(finalPrediction, valueEdge);
        // Determine risk level
        const riskLevel = this.determineRiskLevel(avgConfidence, consensusScore, valueEdge);
        // Calculate recommended stake
        const recommendedStake = this.calculateRecommendedStake(kellyFraction, riskLevel);
        // Extract key factors
        const factors = this.extractKeyFactors(predictions, features);
        return {
            finalPrediction,
            confidence: avgConfidence,
            models: predictions,
            consensusScore,
            valueEdge,
            kellyFraction,
            recommendedStake,
            riskLevel,
            factors,
            metadata: {
                processingTime: 0, // Will be set by caller
                dataFreshness: 0, // Will be set by caller
                signalQuality: 0, // Will be set by caller
                modelAgreement: consensusScore,
            },
        };
    }
    calculateConsensusScore(predictions) {
        if (predictions.length < 2)
            return 1;
        const avgPrediction = predictions.reduce((sum, p) => sum + p.prediction, 0) /
            predictions.length;
        const variance = predictions.reduce((sum, p) => sum + Math.pow(p.prediction - avgPrediction, 2), 0) / predictions.length;
        // Convert variance to consensus score (lower variance = higher consensus)
        return Math.max(0, 1 - variance * 10);
    }
    calculateValueEdge(prediction, features) {
        // Simplified value edge calculation
        // In real implementation, this would compare against actual market odds
        const impliedMarketProb = 0.5; // Mock market probability
        return prediction - impliedMarketProb;
    }
    calculateKellyFraction(prediction, valueEdge) {
        // Kelly Criterion: f = (bp - q) / b
        // Where b = odds, p = probability, q = 1-p
        const odds = 2.0; // Mock odds
        const p = prediction;
        const q = 1 - p;
        const b = odds - 1;
        return Math.max(0, (b * p - q) / b);
    }
    determineRiskLevel(confidence, consensus, valueEdge) {
        const riskScore = 1 - confidence + (1 - consensus) + Math.abs(valueEdge);
        if (riskScore < 0.5)
            return "low";
        if (riskScore < 1.0)
            return "medium";
        return "high";
    }
    calculateRecommendedStake(kelly, riskLevel) {
        const maxStake = 0.05; // Maximum 5% of bankroll
        let kellyMultiplier = 0.25; // Conservative Kelly
        if (riskLevel === "low")
            kellyMultiplier = 0.5;
        else if (riskLevel === "high")
            kellyMultiplier = 0.1;
        return Math.min(kelly * kellyMultiplier, maxStake);
    }
    extractKeyFactors(predictions, features) {
        const factorImpacts = {};
        // Aggregate SHAP values across models
        predictions.forEach((pred) => {
            const model = this.models.get(pred.modelName);
            if (!model)
                return;
            Object.entries(pred.shapValues).forEach(([feature, shap]) => {
                if (!factorImpacts[feature]) {
                    factorImpacts[feature] = { impact: 0, weight: 0 };
                }
                factorImpacts[feature].impact += shap * model.weight;
                factorImpacts[feature].weight += model.weight;
            });
        });
        // Normalize and sort factors
        return Object.entries(factorImpacts)
            .map(([name, data]) => ({
            name,
            impact: data.weight > 0 ? data.impact / data.weight : 0,
            weight: data.weight,
            direction: data.impact > 0 ? "positive" : "negative",
        }))
            .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
            .slice(0, 10); // Top 10 factors
    }
    calculateDataFreshness(input) {
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        const age = Date.now() - input.timestamp;
        return Math.max(0, 1 - age / maxAge);
    }
    calculateSignalQuality(predictions) {
        return predictions.reduce((quality, pred) => {
            return quality * pred.confidence;
        }, 1);
    }
    calculateModelAgreement(predictions) {
        return this.calculateConsensusScore(predictions);
    }
    aggregateShapValues(predictions) {
        const aggregated = {};
        let totalWeight = 0;
        predictions.forEach((pred) => {
            const model = this.models.get(pred.modelName);
            if (!model)
                return;
            Object.entries(pred.shapValues).forEach(([feature, value]) => {
                if (!aggregated[feature])
                    aggregated[feature] = 0;
                aggregated[feature] += value * model.weight;
            });
            totalWeight += model.weight;
        });
        // Normalize by total weight
        Object.keys(aggregated).forEach((feature) => {
            aggregated[feature] /= totalWeight;
        });
        return aggregated;
    }
    validateInput(input, features) {
        if (!input.eventId || !input.sport) {
            throw new Error("Missing required input fields");
        }
        if (Object.keys(features).length < 5) {
            throw new Error("Insufficient features for prediction");
        }
        const dataAge = Date.now() - input.timestamp;
        if (dataAge > VALIDATION_RULES.MAX_PREDICTION_AGE) {
            throw new Error("Input data is too old");
        }
    }
    // Public API methods
    getActiveModels() {
        return Array.from(this.models.values()).filter((m) => m.isActive);
    }
    getModelPerformance(modelName) {
        return this.performanceMetrics.get(modelName);
    }
    updateModelPerformance(modelName, metrics) {
        const existing = this.performanceMetrics.get(modelName) || {};
        this.performanceMetrics.set(modelName, {
            ...existing,
            ...metrics,
            lastUpdated: Date.now(),
        });
    }
    async retrain(modelName) {
        if (this.isTraining) {
            throw new Error("Training already in progress");
        }
        this.isTraining = true;
        this.emit("training:started", { modelName });
        try {
            // In real implementation, this would trigger actual model retraining
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate training
            this.emit("training:completed", { modelName });
        }
        catch (error) {
            this.emit("training:failed", { modelName, error });
            throw error;
        }
        finally {
            this.isTraining = false;
        }
    }
    getCachedPrediction(eventId, market) {
        return this.cache.get(`prediction:${eventId}:${market}`);
    }
    clearCache() {
        this.cache.clear();
    }
}
// Export singleton instance
export const mlEngine = UnifiedMLEngine.getInstance();
