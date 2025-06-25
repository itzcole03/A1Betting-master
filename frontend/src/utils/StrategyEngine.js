import { AdvancedAnalysisEngine } from './AdvancedAnalysisEngine.js';
import { DataIntegrationHub } from './DataIntegrationHub.js';
import { EventBus } from '../core/EventBus.ts';
import { PerformanceMonitor } from './PerformanceMonitor.js';
import FeatureFlags from './FeatureFlags.ts';
import { PredictionEngine } from './PredictionEngine.js';
function toRiskTolerance(level) {
    switch (level) {
        case 'LOW': return 'low';
        case 'MEDIUM': return 'medium';
        case 'HIGH': return 'high';
        default: return level;
    }
}
export class StrategyEngine {
    constructor() {
        this.PERFORMANCE_UPDATE_INTERVAL = 1000 * 60 * 60; // 1 hour
        // [ROADMAP] Wire up featureManager and predictionEngine for future extensibility/ensembling
        this.featureManager = FeatureFlags.getInstance();
        this.predictionEngine = PredictionEngine.getInstance();
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        // Removed unused: featureManager (see roadmap)
        this.analysisEngine = AdvancedAnalysisEngine.getInstance();
        this.dataHub = DataIntegrationHub.getInstance();
        this.config = this.getDefaultConfig();
        this.state = this.getDefaultState();
        this.compositeStrategies = new Map();
        this.strategyPerformance = new Map();
        // Removed unused: predictionEngine (see roadmap)
        this.setupPerformanceTracking();
    }
    static getInstance() {
        if (!StrategyEngine.instance) {
            StrategyEngine.instance = new StrategyEngine();
        }
        return StrategyEngine.instance;
    }
    getDefaultConfig() {
        return {
            maxExposure: 100,
            minStake: 10,
            maxStake: 100,
            kellyFraction: 0.5,
            volatilityThreshold: 0.5,
            liquidityThreshold: 0.5,
            depthThreshold: 0.5,
            momentumThreshold: 0.5,
            marginOfError: 0.05,
            stopLossPercentage: 0.1,
            takeProfitPercentage: 0.2,
            hedgingThreshold: 0.1,
            maxVolatility: 1.5,
            minLiquidity: 0.5,
            minValueGap: 0.1,
            sentimentThreshold: 0.6,
            minConfidence: 0.7,
            maxRiskLevel: 'medium',
            requiredDataQuality: 0.8,
            marketEfficiencyThreshold: 0.85
        };
    }
    getDefaultState() {
        return {
            bankroll: 1000,
            activeBets: new Map(),
            performance: {
                totalBets: 0,
                winRate: 0,
                roi: 0,
                profitLoss: 0,
                clvAverage: 0,
                edgeRetention: 0,
                kellyMultiplier: 0,
                marketEfficiencyScore: 0,
                averageOdds: 0,
                maxDrawdown: 0,
                sharpeRatio: 0,
                betterThanExpected: 0,
                timestamp: Date.now(),
                cpu: { usage: 0, cores: 0, temperature: 0 },
                memory: { total: 0, used: 0, free: 0, swap: 0 },
                network: { bytesIn: 0, bytesOut: 0, connections: 0, latency: 0 },
                disk: { total: 0, used: 0, free: 0, iops: 0 },
                responseTime: { avg: 0, p95: 0, p99: 0 },
                throughput: { requestsPerSecond: 0, transactionsPerSecond: 0 },
                errorRate: 0,
                uptime: 0,
                predictionId: '',
                confidence: 0,
                riskScore: 0
            },
        };
    }
    setupPerformanceTracking() {
        setInterval(() => this.updateStrategyPerformance(), this.PERFORMANCE_UPDATE_INTERVAL);
        this.eventBus.on('strategy:execution-completed', (event) => {
            const { strategyId, result } = event.payload;
            this.updateStrategyResult(strategyId, result);
        });
    }
    createCompositeStrategy(name, strategies, weights, conditions) {
        if (strategies.length !== weights.length) {
            throw new Error('Strategies and weights arrays must have the same length');
        }
        if (Math.abs(weights.reduce((a, b) => a + b, 0) - 1) > 0.0001) {
            throw new Error('Weights must sum to 1');
        }
        const id = `composite-${Date.now()}`;
        this.compositeStrategies.set(id, {
            id,
            name,
            strategies,
            weights,
            conditions,
            performance: {
                totalExecutions: 0,
                successRate: 0,
                averageReturn: 0,
                riskProfile: {
                    level: 'low',
                    factors: []
                },
                lastUpdated: Date.now()
            }
        });
        return id;
    }
    async analyzeOpportunity(playerId, metric) {
        const traceId = this.performanceMonitor.startTrace('strategy-analysis');
        try {
            const analysis = await this.analysisEngine.analyzePlayer(playerId);
            if (!this.meetsQualityThresholds(analysis)) {
                return null;
            }
            const data = this.dataHub.getIntegratedData();
            const baseRecommendation = await this.generateRecommendation(playerId, metric, analysis, data);
            if (!baseRecommendation) {
                return null;
            }
            // Apply composite strategies if available
            const enhancedRecommendation = await this.applyCompositeStrategies(baseRecommendation, analysis, data);
            this.performanceMonitor.endTrace(traceId);
            return enhancedRecommendation;
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            throw error;
        }
    }
    meetsQualityThresholds(analysis) {
        return (analysis.meta_analysis.data_quality >= this.config.requiredDataQuality &&
            analysis.meta_analysis.market_efficiency >= this.config.marketEfficiencyThreshold);
    }
    async generateRecommendation(playerId, metric, analysis, data) {
        const prediction = analysis.predictions[metric];
        if (!prediction || prediction.confidence < this.config.minConfidence) {
            return null;
        }
        const marketData = this.analyzeMarketData(playerId, metric, data);
        const sentiment = this.analyzeSentiment(playerId, data);
        const valueGap = this.calculateValueGap(marketData);
        if (Math.abs(valueGap) < this.config.minValueGap) {
            return null;
        }
        const position = valueGap > 0 ? 'over' : 'under';
        const riskAssessment = this.assessRisk(marketData, analysis);
        if (this.getRiskLevel(toRiskTolerance(String(riskAssessment.riskLevel))) > this.getRiskLevel(toRiskTolerance(this.config.maxRiskLevel))) {
            return null;
        }
        return {
            id: `strategy-${Date.now()}`,
            type: position.toUpperCase(),
            confidence: prediction.confidence,
            parameters: {
                stake: 0, // TODO: Calculate recommended stake
                expectedValue: this.calculateExpectedValue(valueGap, prediction.confidence),
            },
            riskAssessment,
            analysis: {
                historicalTrends: this.analyzeHistoricalTrends(playerId, metric, data),
                marketSignals: this.analyzeMarketSignals(playerId, metric, data),
                riskFactors: this.analyzeRiskFactors(playerId, metric, data),
            },
            propId: `${playerId}:${metric}`
        };
    }
    analyzeMarketData(playerId, metric, data) {
        const relevantMarkets = this.findRelevantMarkets(playerId, metric, data);
        let currentLine = 0;
        let movement = 'stable';
        let valueGap = 0;
        if (relevantMarkets && Object.keys(relevantMarkets).length > 0) {
            currentLine = this.calculateWeightedLine(relevantMarkets);
            movement = this.analyzeMarketMovement(relevantMarkets, data);
            valueGap = this.calculateMarketValueGap(currentLine, data.projections[playerId]?.stats[metric]);
        }
        return {
            playerId,
            metric,
            currentLine,
            movement,
            valueGap,
            volatility: 0,
            liquidity: 0,
            marketDepth: 0,
            momentum: 0
        };
    }
    findRelevantMarkets(playerId, metric, data) {
        const markets = {};
        Object.entries(data.odds).forEach(([eventId, odds]) => {
            Object.entries(odds.markets).forEach(([market, price]) => {
                if (this.isMarketRelevant(market, playerId, metric)) {
                    markets[market] = price;
                }
            });
        });
        return Object.keys(markets).length > 0 ? markets : null;
    }
    isMarketRelevant(market, playerId, metric) {
        const marketLower = market.toLowerCase();
        const metricLower = metric.toLowerCase();
        const playerLower = playerId.toLowerCase();
        return (marketLower.includes(playerLower) &&
            marketLower.includes(metricLower));
    }
    calculateWeightedLine(markets) {
        const prices = Object.values(markets);
        if (prices.length === 0)
            return 0;
        // Simple average for now, could be enhanced with volume-weighted average
        return prices.reduce((a, b) => a + b, 0) / prices.length;
    }
    analyzeMarketMovement(markets, data) {
        const movements = Object.keys(markets).map(market => {
            const eventId = this.findEventIdForMarket(market, data);
            if (!eventId)
                return 'stable';
            const odds = data.odds[eventId];
            return odds?.movement.direction ?? 'stable';
        });
        const upCount = movements.filter(m => m === 'up').length;
        const downCount = movements.filter(m => m === 'down').length;
        if (Math.abs(upCount - downCount) < 2)
            return 'stable';
        return upCount > downCount ? 'increasing' : 'decreasing';
    }
    findEventIdForMarket(market, data) {
        for (const [eventId, odds] of Object.entries(data.odds)) {
            if (market in odds.markets) {
                return eventId;
            }
        }
        return null;
    }
    calculateMarketValueGap(currentLine, projectedValue) {
        if (!projectedValue)
            return 0;
        return projectedValue - currentLine;
    }
    analyzeSentiment(playerId, data) {
        const sentiment = data.sentiment[playerId];
        if (!sentiment) {
            return `${playerId}:unknown:0:neutral:[]`;
        }
        return `${playerId}:${sentiment.sentiment.score}:${this.determineSentimentTrend(sentiment)}:${sentiment.keywords.join(',')}`;
    }
    calculateValueGap(marketData) {
        return marketData.valueGap;
    }
    assessRisk(marketData, analysis) {
        const riskLevel = this.calculateRiskLevel(marketData, analysis);
        const riskFactors = this.identifyRiskFactors(marketData, analysis);
        return {
            level: riskLevel,
            factors: riskFactors
        };
    }
    calculateRiskLevel(marketData, analysis) {
        const volatility = marketData.volatility;
        const liquidity = marketData.liquidity;
        const marketDepth = marketData.marketDepth;
        const riskScore = (volatility * 0.4) + ((1 - liquidity) * 0.3) + ((1 - marketDepth) * 0.3);
        if (riskScore < 0.3)
            return 'low';
        if (riskScore < 0.7)
            return 'medium';
        return 'high';
    }
    identifyRiskFactors(marketData, analysis) {
        const factors = [];
        if (marketData.volatility > this.config.volatilityThreshold) {
            factors.push('High market volatility');
        }
        if (marketData.liquidity < this.config.liquidityThreshold) {
            factors.push('Low market liquidity');
        }
        if (marketData.marketDepth < this.config.depthThreshold) {
            factors.push('Insufficient market depth');
        }
        if (marketData.momentum < this.config.momentumThreshold) {
            factors.push('Weak market momentum');
        }
        // Add risks from analysis
        Object.entries(analysis.risks).forEach(([type, risk]) => {
            if (toRiskTolerance(risk.level) !== 'low') {
                factors.push(...risk.factors);
            }
        });
        return factors;
    }
    calculateExpectedValue(valueGap, confidence) {
        return Math.abs(valueGap) * confidence * (1 - this.config.marginOfError);
    }
    determineSentimentTrend(sentiment) {
        const score = sentiment.sentiment.score;
        const volume = sentiment.sentiment.volume;
        if (volume < 100)
            return 'insufficient data';
        if (Math.abs(score) < 0.2)
            return 'neutral';
        if (Math.abs(score) < 0.5)
            return score > 0 ? 'slightly positive' : 'slightly negative';
        if (Math.abs(score) < 0.8)
            return score > 0 ? 'positive' : 'negative';
        return score > 0 ? 'strongly positive' : 'strongly negative';
    }
    getRiskLevel(level) {
        switch (level) {
            case 'low': return 1;
            case 'medium': return 2;
            case 'high': return 3;
        }
    }
    async applyCompositeStrategies(baseRecommendation, analysis, data) {
        const finalRecommendation = { ...baseRecommendation };
        const totalConfidence = 0;
        let totalWeight = 0;
        for (const [, composite] of this.compositeStrategies) {
            if (this.shouldApplyStrategy(composite, analysis, data)) {
                const strategyResults = await Promise.all(composite.strategies.map(async (strategyId, index) => {
                    const result = await this.executeStrategy(strategyId, baseRecommendation, analysis, data);
                    return {
                        result,
                        weight: composite.weights[index]
                    };
                }));
                // Combine strategy results
                strategyResults.forEach(({ result, weight }) => {
                    if (result) {
                        finalRecommendation.confidence =
                            (finalRecommendation.confidence * totalWeight + result.confidence * weight) /
                                (totalWeight + weight);
                        const resultEV = result.parameters?.expectedValue ?? 0;
                        const finalEV = finalRecommendation.parameters?.expectedValue ?? 0;
                        if (!finalRecommendation.parameters)
                            finalRecommendation.parameters = { stake: 0, expectedValue: 0 };
                        finalRecommendation.parameters.expectedValue =
                            (finalEV * totalWeight + resultEV * weight) /
                                (totalWeight + weight);
                        totalWeight += weight;
                    }
                });
            }
        }
        return finalRecommendation;
    }
    shouldApplyStrategy(strategy, analysis, data) {
        // Check confidence threshold
        if (analysis.meta_analysis.prediction_stability < strategy.conditions.minConfidence) {
            return false;
        }
        // Check risk level
        const maxRiskLevel = this.getRiskLevel(toRiskTolerance(strategy.conditions.maxRisk));
        const currentRisk = Object.values(analysis.risks).some(risk => this.getRiskLevel(toRiskTolerance(risk.level)) > maxRiskLevel);
        if (currentRisk) {
            return false;
        }
        // Check market state conditions
        const marketState = this.determineMarketState(data);
        if (!strategy.conditions.marketStates.includes(marketState)) {
            return false;
        }
        return true;
    }
    async executeStrategy(strategyId, baseRecommendation, analysis, data) {
        // Example: Adjust recommendation based on risk and market signals
        let rec = { ...baseRecommendation };
        // Type guard: only act if riskAssessment exists and has a 'level' property
        if (analysis.riskAssessment && analysis.riskAssessment.level === 'high') {
            rec.confidence *= 0.8;
            // rec.parameters = { ...rec.parameters, adjusted: true }; // 'adjusted' not in type, skip or document for roadmap
        }
        // Type guard: only act if analysis property exists and has marketSignals
        if (analysis.analysis && Array.isArray(analysis.analysis.marketSignals) && analysis.analysis.marketSignals.includes('sharp_move')) {
            rec.confidence *= 0.9;
        }
        // Add more logic as needed
        return rec;
    }
    determineMarketState(data) {
        // Simple example: use volatility and trend
        // volatility and trend not present on IntegratedData; skip or document for roadmap
        return 'stable';
    }
    analyzeHistoricalTrends(playerId, metric, data) {
        // Example: return trend signals based on data
        // trend property not present on IntegratedData; skip or document for roadmap
        return [];
        return ['flat'];
    }
    analyzeMarketSignals(playerId, metric, data) {
        // Example: detect sharp moves or volume spikes
        const signals = [];
        // volume and priceChange not present on IntegratedData; skip or document for roadmap
        return signals;
    }
    analyzeRiskFactors(playerId, metric, data) {
        // Example: flag high volatility or missing data
        const factors = [];
        if (!data /* || !data.history */)
            factors.push('missing_data');
        // volatility not present on IntegratedData; skip or document for roadmap
        return factors;
    }
    updateStrategyResult(strategyId, result) {
        const performance = this.strategyPerformance.get(strategyId) || {
            totalExecutions: 0,
            successRate: 0,
            averageReturn: 0,
            riskProfile: {
                level: 'low',
                factors: []
            },
            lastUpdated: Date.now()
        };
        // Update performance metrics
        performance.totalExecutions++;
        performance.lastUpdated = Date.now();
        this.strategyPerformance.set(strategyId, performance);
        // Adjust composite strategy weights based on performance
        this.adjustStrategyWeights();
    }
    adjustStrategyWeights() {
        for (const [id, composite] of this.compositeStrategies) {
            const performances = composite.strategies.map(strategyId => this.strategyPerformance.get(strategyId));
            if (performances.some(p => !p))
                continue;
            // Calculate new weights based on relative performance
            const totalPerformance = performances.reduce((sum, p) => sum + (p.averageReturn * p.successRate), 0);
            const newWeights = performances.map(p => (p.averageReturn * p.successRate) / totalPerformance);
            // Update weights
            this.compositeStrategies.set(id, {
                ...composite,
                weights: newWeights
            });
        }
    }
    updateStrategyPerformance() {
        for (const [strategyId, performance] of this.strategyPerformance) {
            if (Date.now() - performance.lastUpdated > this.PERFORMANCE_UPDATE_INTERVAL) {
                // Recalculate long-term performance metrics
                this.recalculatePerformanceMetrics(strategyId);
            }
        }
    }
    recalculatePerformanceMetrics(strategyId) {
        // Implementation for recalculating long-term performance metrics
        // This would typically involve fetching historical data and updating the metrics
    }
    validateRecommendation(recommendation) {
        if (!recommendation.id) {
            throw new Error('Strategy recommendation must have an ID');
        }
        if (!recommendation.type) {
            throw new Error('Strategy recommendation must have a type');
        }
        if (typeof recommendation.confidence !== 'number' || recommendation.confidence < 0 || recommendation.confidence > 1) {
            throw new Error('Invalid confidence value');
        }
        if (typeof recommendation.expectedValue !== 'number' || recommendation.expectedValue <= 0) {
            throw new Error('Invalid expected value');
        }
        if (!recommendation.riskAssessment || !recommendation.riskAssessment.level) {
            throw new Error('Invalid risk assessment');
        }
    }
    async generateStrategy(marketData) {
        const traceId = this.performanceMonitor.startTrace('strategy-generation');
        try {
            const analysis = await this.analysisEngine.analyzePlayer(marketData.playerId);
            const valueGap = this.calculateValueGap(marketData);
            if (Math.abs(valueGap) < this.config.minValueGap) {
                throw new Error('Value gap below minimum threshold');
            }
            if (!this.meetsQualityThresholds(analysis)) {
                throw new Error('Analysis quality below required threshold');
            }
            const position = this.determinePosition(valueGap);
            const riskAssessment = this.assessRisk(marketData, analysis);
            if (this.getRiskLevel(toRiskTolerance(riskAssessment.level)) > this.getRiskLevel(toRiskTolerance(this.config.maxRiskLevel))) {
                throw new Error('Risk level exceeds maximum threshold');
            }
            const prediction = analysis.predictions[marketData.metric];
            if (!prediction || prediction.confidence < this.config.minConfidence) {
                throw new Error('Prediction confidence below minimum threshold');
            }
            const historicalTrends = Object.entries(analysis.trends).map(([metric, trend]) => {
                const trendData = trend;
                return [
                    `${metric}: ${trendData.direction} (${trendData.strength})`,
                    ...(trendData.supporting_data || [])
                ];
            }).flat();
            const recommendation = {
                id: `strategy-${Date.now()}`,
                type: position.toUpperCase(),
                confidence: prediction.confidence,
                expectedValue: this.calculateExpectedValue(valueGap, prediction.confidence),
                riskAssessment,
                analysis: {
                    historicalTrends,
                    marketSignals: analysis.opportunities.map(opp => opp.rationale).flat(),
                    riskFactors: Object.entries(analysis.risks)
                        .map(([type, risk]) => [`${type}: ${risk.level}`, ...risk.factors])
                        .flat()
                },
                propId: `${marketData.playerId}:${marketData.metric}`
            };
            this.validateRecommendation(recommendation);
            this.performanceMonitor.endTrace(traceId);
            return recommendation;
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            throw error;
        }
    }
    calculateExposure(valueGap, confidence) {
        return Math.min(valueGap * confidence, this.config.maxExposure);
    }
    calculateStake(valueGap, confidence) {
        const kellyFraction = this.config.kellyFraction;
        const bankroll = this.state.bankroll;
        const odds = 1 + valueGap;
        const kellyStake = bankroll * ((odds * confidence - (1 - confidence)) / odds) * kellyFraction;
        return Math.min(Math.max(kellyStake, this.config.minStake), this.config.maxStake);
    }
    determineExecutionTiming(marketData, sentiment) {
        if (marketData.volatility > this.config.volatilityThreshold) {
            return 'monitor';
        }
        if (sentiment.score < this.config.sentimentThreshold) {
            return 'wait';
        }
        return 'immediate';
    }
    determineExecutionConditions(marketData) {
        const conditions = [];
        if (marketData.volatility > this.config.volatilityThreshold) {
            conditions.push(`Wait for volatility to drop below ${this.config.volatilityThreshold}`);
        }
        if (marketData.liquidity < this.config.liquidityThreshold) {
            conditions.push(`Wait for liquidity to increase above ${this.config.liquidityThreshold}`);
        }
        if (marketData.valueGap < this.config.minValueGap) {
            conditions.push(`Wait for value gap to increase above ${this.config.minValueGap}`);
        }
        return conditions;
    }
    determineExitCriteria(marketData) {
        return [
            `Stop loss at ${this.calculateStopLoss(marketData)}`,
            `Take profit at ${this.calculateTakeProfit(marketData)}`,
            `Exit if volatility exceeds ${this.config.maxVolatility}`,
            `Exit if liquidity drops below ${this.config.minLiquidity}`
        ];
    }
    findHedgingOpportunities(marketData) {
        return [
            `Consider opposite position if value gap reverses by ${this.config.hedgingThreshold}%`,
            `Look for correlated markets with inverse movement`,
            `Monitor alternative betting lines for arbitrage`
        ];
    }
    calculateStopLoss(marketData) {
        return marketData.currentLine * (1 - this.config.stopLossPercentage);
    }
    calculateTakeProfit(marketData) {
        return marketData.currentLine * (1 + this.config.takeProfitPercentage);
    }
    determinePosition(valueGap) {
        return valueGap > 0 ? 'over' : 'under';
    }
}
