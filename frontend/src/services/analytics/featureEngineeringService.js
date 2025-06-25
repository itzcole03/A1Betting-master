import { FeatureSelector } from './featureSelection';
import { FeatureTransformer } from './featureTransformation';
import { FeatureValidator } from './featureValidation';
import { FeatureStore } from './featureStore';
import { FeatureRegistry } from './featureRegistry';
import { FeatureCache } from './featureCache';
import { FeatureMonitor } from './featureMonitoring';
import { FeatureLogger } from './featureLogging';
export class FeatureEngineeringService {
    constructor() {
        this.config = {
            rollingWindows: [3, 5, 10, 20],
            trendPeriods: [5, 10],
            seasonalityPeriods: [82], // NBA season length
            interactionDepth: 2,
            minSamplesForFeature: 100,
            featureSelectionThreshold: 0.01,
            maxFeatures: 50,
            validationThreshold: 0.95,
            cacheEnabled: true,
            cacheTTL: 3600,
            monitoringEnabled: true,
        };
        this.featureCache = new Map();
        this.scalingParams = new Map();
        this.encodingMaps = new Map();
        this.initializeService();
    }
    async initializeService() {
        this.featureSelector = new FeatureSelector(this.config);
        this.featureTransformer = new FeatureTransformer(this.config);
        this.featureValidator = new FeatureValidator(this.config);
        this.featureStore = new FeatureStore();
        this.featureRegistry = new FeatureRegistry();
        this.featureCache = new FeatureCache(this.config);
        this.featureMonitor = new FeatureMonitor(this.config);
        this.featureLogger = new FeatureLogger();
        await this.loadFeatureMetadata();
        await this.initializeFeatureMonitoring();
    }
    async loadFeatureMetadata() {
        try {
            const metadata = await this.featureStore.loadFeatureMetadata();
            this.scalingParams = new Map(Object.entries(metadata.scalingParams));
            this.encodingMaps = new Map(Object.entries(metadata.encodingMaps));
        }
        catch (error) {
            this.featureLogger.error('Failed to load feature metadata', error);
            throw error;
        }
    }
    async initializeFeatureMonitoring() {
        if (this.config.monitoringEnabled) {
            await this.featureMonitor.initialize();
            this.featureMonitor.startMonitoring();
        }
    }
    async generateFeatures(playerId, propType, rawData) {
        const cacheKey = `${playerId}_${propType}`;
        // Check cache
        if (this.config.cacheEnabled) {
            const cachedFeatures = await this.featureCache.get(cacheKey);
            if (cachedFeatures) {
                return cachedFeatures;
            }
        }
        const features = {
            numerical: {},
            categorical: {},
            temporal: {},
            derived: {},
            metadata: {
                featureNames: [],
                featureTypes: {},
                scalingParams: {},
                encodingMaps: {},
            },
        };
        try {
            // Generate base features
            await this.generateBaseFeatures(features, rawData);
            // Generate temporal features
            await this.generateTemporalFeatures(features, rawData);
            // Generate interaction features
            await this.generateInteractionFeatures(features);
            // Generate contextual features
            await this.generateContextualFeatures(features, rawData);
            // Select most important features
            await this.selectFeatures(features);
            // Transform features
            await this.transformFeatures(features);
            // Validate features
            await this.validateFeatures(features);
            // Cache features
            if (this.config.cacheEnabled) {
                await this.featureCache.set(cacheKey, features);
            }
            // Monitor feature quality
            if (this.config.monitoringEnabled) {
                await this.featureMonitor.recordFeatureQuality(features);
            }
            return features;
        }
        catch (error) {
            this.featureLogger.error('Error generating features', error);
            throw error;
        }
    }
    async generateBaseFeatures(features, rawData) {
        // Player performance metrics
        features.numerical['avgPoints'] = this.calculateAverage(rawData.gameLog, 'points');
        features.numerical['avgAssists'] = this.calculateAverage(rawData.gameLog, 'assists');
        features.numerical['avgRebounds'] = this.calculateAverage(rawData.gameLog, 'rebounds');
        features.numerical['avgMinutes'] = this.calculateAverage(rawData.gameLog, 'minutes');
        features.numerical['usageRate'] = this.calculateUsageRate(rawData.gameLog);
        // Efficiency metrics
        features.numerical['trueShootingPct'] = this.calculateTrueShooting(rawData.gameLog);
        features.numerical['effectiveFgPct'] = this.calculateEffectiveFgPct(rawData.gameLog);
        // Team context
        features.numerical['teamPace'] = this.calculateTeamPace(rawData.teamStats);
        features.numerical['teamOffRtg'] = this.calculateOffensiveRating(rawData.teamStats);
        // Opponent metrics
        features.numerical['oppDefRtg'] = this.calculateDefensiveRating(rawData.opponentStats);
        features.numerical['oppPace'] = this.calculateTeamPace(rawData.opponentStats);
        // Categorical features
        features.categorical['homeAway'] = this.extractHomeAway(rawData.gameLog);
        features.categorical['dayOfWeek'] = this.extractDayOfWeek(rawData.gameLog);
        features.categorical['opponent'] = this.extractOpponents(rawData.gameLog);
    }
    async generateTemporalFeatures(features, rawData) {
        for (const window of this.config.rollingWindows) {
            // Rolling averages
            features.temporal[`rollingAvgPoints_${window}`] = this.calculateRollingAverage(rawData.gameLog, 'points', window);
            features.temporal[`rollingAvgAssists_${window}`] = this.calculateRollingAverage(rawData.gameLog, 'assists', window);
            features.temporal[`rollingAvgRebounds_${window}`] = this.calculateRollingAverage(rawData.gameLog, 'rebounds', window);
            // Rolling standard deviations
            features.temporal[`rollingStdPoints_${window}`] = this.calculateRollingStd(rawData.gameLog, 'points', window);
            features.temporal[`rollingStdAssists_${window}`] = this.calculateRollingStd(rawData.gameLog, 'assists', window);
            features.temporal[`rollingStdRebounds_${window}`] = this.calculateRollingStd(rawData.gameLog, 'rebounds', window);
            // Rolling trends
            features.temporal[`rollingTrendPoints_${window}`] = this.calculateRollingTrend(rawData.gameLog, 'points', window);
            features.temporal[`rollingTrendAssists_${window}`] = this.calculateRollingTrend(rawData.gameLog, 'assists', window);
            features.temporal[`rollingTrendRebounds_${window}`] = this.calculateRollingTrend(rawData.gameLog, 'rebounds', window);
        }
    }
    async generateInteractionFeatures(features) {
        const numericalFeatures = Object.entries(features.numerical);
        // Generate pairwise interactions up to specified depth
        for (let depth = 2; depth <= this.config.interactionDepth; depth++) {
            this.generateInteractionsAtDepth(features, numericalFeatures, depth);
        }
    }
    async generateContextualFeatures(features, rawData) {
        // Injury impact
        features.numerical['teamInjuryImpact'] = this.calculateInjuryImpact(rawData.injuries);
        // Schedule factors
        features.numerical['restDays'] = this.calculateRestDays(rawData.gameLog);
        features.numerical['travelDistance'] = this.calculateTravelDistance(rawData.gameLog);
        // Team composition
        features.numerical['lineupCoherence'] = this.calculateLineupCoherence(rawData.teamStats);
        // Market sentiment
        features.numerical['marketSentiment'] = await this.calculateMarketSentiment(rawData.news);
    }
    async selectFeatures(features) {
        const selectedFeatures = await this.featureSelector.selectFeatures(features);
        // Update features with selected subset
        features.numerical = this.filterFeatures(features.numerical, selectedFeatures.numerical);
        features.categorical = this.filterFeatures(features.categorical, selectedFeatures.categorical);
        features.temporal = this.filterFeatures(features.temporal, selectedFeatures.temporal);
        features.derived = this.filterFeatures(features.derived, selectedFeatures.derived);
    }
    async transformFeatures(features) {
        // Transform numerical features
        features.numerical = await this.featureTransformer.transformNumerical(features.numerical);
        // Transform categorical features
        features.categorical = await this.featureTransformer.transformCategorical(features.categorical);
        // Transform temporal features
        features.temporal = await this.featureTransformer.transformTemporal(features.temporal);
        // Transform derived features
        features.derived = await this.featureTransformer.transformDerived(features.derived);
    }
    async validateFeatures(features) {
        const validationResults = await this.featureValidator.validate(features);
        if (!validationResults.isValid) {
            throw new Error(`Feature validation failed: ${validationResults.errors.join(', ')}`);
        }
    }
    filterFeatures(features, selectedFeatures) {
        return Object.fromEntries(Object.entries(features).filter(([key]) => selectedFeatures.includes(key)));
    }
    // Utility methods for feature calculation
    calculateAverage(data, field) {
        return data.reduce((sum, item) => sum + item[field], 0) / data.length;
    }
    calculateRollingAverage(data, field, window) {
        return data.map((_, i) => {
            const windowData = data.slice(Math.max(0, i - window + 1), i + 1);
            return this.calculateAverage(windowData, field);
        });
    }
    calculateRollingStd(data, field, window) {
        return data.map((_, i) => {
            const windowData = data.slice(Math.max(0, i - window + 1), i + 1);
            const values = windowData.map(item => item[field]);
            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
            return Math.sqrt(variance);
        });
    }
    calculateRollingTrend(data, field, window) {
        return data.map((_, i) => {
            const windowData = data.slice(Math.max(0, i - window + 1), i + 1);
            const values = windowData.map(item => item[field]);
            const x = Array.from({ length: values.length }, (_, i) => i);
            const slope = this.calculateLinearRegressionSlope(x, values);
            return slope;
        });
    }
    calculateLinearRegressionSlope(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }
    calculateUsageRate(gameLog) {
        const totalMinutes = gameLog.reduce((sum, game) => sum + game.minutes, 0);
        const totalShots = gameLog.reduce((sum, game) => sum + game.fga + 0.44 * game.fta, 0);
        return totalShots / totalMinutes;
    }
    calculateTrueShooting(gameLog) {
        const totalPoints = gameLog.reduce((sum, game) => sum + game.points, 0);
        const totalShots = gameLog.reduce((sum, game) => sum + game.fga + 0.44 * game.fta, 0);
        return totalPoints / (2 * totalShots);
    }
    calculateEffectiveFgPct(gameLog) {
        const totalFGM = gameLog.reduce((sum, game) => sum + game.fgm, 0);
        const total3PM = gameLog.reduce((sum, game) => sum + game.threePM, 0);
        const totalFGA = gameLog.reduce((sum, game) => sum + game.fga, 0);
        return (totalFGM + 0.5 * total3PM) / totalFGA;
    }
    calculateTeamPace(teamStats) {
        return teamStats.possessions / teamStats.games;
    }
    calculateOffensiveRating(teamStats) {
        return (teamStats.points / teamStats.possessions) * 100;
    }
    calculateDefensiveRating(teamStats) {
        return (teamStats.pointsAllowed / teamStats.possessions) * 100;
    }
    extractHomeAway(gameLog) {
        return gameLog.map(game => (game.isHome ? 'home' : 'away'));
    }
    extractDayOfWeek(gameLog) {
        return gameLog.map(game => new Date(game.date).toLocaleDateString('en-US', { weekday: 'long' }));
    }
    extractOpponents(gameLog) {
        return gameLog.map(game => game.opponent);
    }
    calculateInjuryImpact(injuries) {
        return injuries.reduce((impact, injury) => {
            const severity = injury.severity === 'high' ? 1 : injury.severity === 'medium' ? 0.7 : 0.3;
            return impact + severity;
        }, 0);
    }
    calculateRestDays(gameLog) {
        return gameLog.map((game, i) => {
            if (i === 0)
                return 0;
            const prevGame = gameLog[i - 1];
            const days = (new Date(game.date).getTime() - new Date(prevGame.date).getTime()) / (1000 * 60 * 60 * 24);
            return Math.floor(days);
        });
    }
    calculateTravelDistance(gameLog) {
        return gameLog.map((game, i) => {
            if (i === 0)
                return 0;
            const prevGame = gameLog[i - 1];
            return this.calculateDistance(prevGame.venue, game.venue);
        });
    }
    calculateDistance(venue1, venue2) {
        // Implement distance calculation between venues
        return 0; // Placeholder
    }
    calculateLineupCoherence(teamStats) {
        return teamStats.lineupMinutes / teamStats.totalMinutes;
    }
    async calculateMarketSentiment(news) {
        // Implement market sentiment analysis
        return 0; // Placeholder
    }
}
export const featureEngineeringService = new FeatureEngineeringService();
