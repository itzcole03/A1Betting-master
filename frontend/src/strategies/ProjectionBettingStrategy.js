import { EventBus } from "../core/EventBus";
import { FeatureFlags } from "../core/FeatureFlags";
import { PerformanceMonitor } from "../core/PerformanceMonitor";
export class ProjectionBettingStrategy {
    constructor(config) {
        this.id = "projection-betting";
        this.name = "Projection-Based Betting Strategy";
        this.description = "Analyzes player projections to identify betting opportunities";
        this.confidence = 0;
        this.metrics = {
            totalBets: 0,
            winRate: 0,
            averageOdds: 0,
            roi: 0,
            maxDrawdown: 0,
            sharpeRatio: 0,
            betterThanExpected: 0,
            profitLoss: 0,
        };
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.featureManager = FeatureFlags.getInstance();
        this.config = config;
    }
    async analyze(data) {
        const traceId = this.performanceMonitor.startTrace("betting-strategy", {
            strategy: this.id,
            timestamp: (data.timestamp ?? Date.now()).toFixed(0),
        });
        try {
            const recommendations = [];
            let overallConfidence = 0;
            // Process projections
            const projections = this.processProjections(data.projections ?? {});
            for (const projection of projections) {
                const spanId = this.performanceMonitor.startSpan(traceId, "projection-evaluation", {
                    player: projection.player,
                    confidence: String(projection.confidence),
                });
                try {
                    const playerRecommendations = this.evaluateProjection(projection);
                    recommendations.push(...playerRecommendations);
                    this.performanceMonitor.endSpan(spanId);
                }
                catch (error) {
                    this.performanceMonitor.endSpan(spanId, error);
                    console.error(`Error evaluating projection for ${projection.player}:`, error);
                }
            }
            // Calculate overall confidence based on recommendation quality
            if (recommendations.length > 0) {
                overallConfidence =
                    recommendations.reduce((sum, rec) => sum + rec.confidence, 0) /
                        recommendations.length;
            }
            // Filter recommendations based on confidence and edge
            const filteredRecommendations = recommendations.filter((rec) => rec.confidence >= this.config.minConfidence &&
                this.calculateEdge(rec) >= this.config.minEdge);
            // Sort recommendations by confidence
            filteredRecommendations.sort((a, b) => b.confidence - a.confidence);
            const decision = {
                id: `decision-${Date.now()}`,
                timestamp: Date.now(),
                confidence: overallConfidence,
                recommendations: filteredRecommendations,
                analysis: {
                    meta_analysis: {
                        data_quality: this.calculateDataQuality(data),
                        prediction_stability: this.calculatePredictionStability(recommendations),
                        market_efficiency: this.calculateMarketEfficiency(data.odds ?? {}),
                        playerId: Object.keys(data.projections ?? {})[0] || "",
                        metric: "combined",
                    },
                    confidence_factors: this.calculateConfidenceFactors(data),
                    risk_factors: this.calculateRiskFactors(data),
                },
            };
            this.performanceMonitor.endTrace(traceId);
            return decision;
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            throw error;
        }
    }
    validate(data) {
        const dataRecord = data;
        return (dataRecord.projections !== undefined &&
            dataRecord.sentiment !== undefined &&
            dataRecord.odds !== undefined &&
            dataRecord.timestamp !== undefined);
    }
    getMetrics() {
        return this.metrics;
    }
    processProjections(projections) {
        return Object.entries(projections).map(([playerId, data]) => {
            const d = data;
            // Ensure all stats are strings
            const stats = {
                team: String(d.stats?.team || ""),
                position: String(d.stats?.position || ""),
                opponent: String(d.stats?.opponent || ""),
                isHome: Boolean(d.stats?.isHome || false),
                points: Number(d.stats?.points || 0),
                rebounds: Number(d.stats?.rebounds || 0),
                assists: Number(d.stats?.assists || 0),
                steals: Number(d.stats?.steals || 0),
                blocks: Number(d.stats?.blocks || 0),
                threes: Number(d.stats?.threes || 0),
                minutes: Number(d.stats?.minutes || 0),
            };
            return {
                player: playerId,
                confidence: d.confidence,
                predictions: {
                    points: {
                        predicted: stats.points,
                        confidence: d.confidence,
                        range: { min: 0, max: 0 },
                    },
                    rebounds: {
                        predicted: stats.rebounds,
                        confidence: d.confidence,
                        range: { min: 0, max: 0 },
                    },
                    assists: {
                        predicted: stats.assists,
                        confidence: d.confidence,
                        range: { min: 0, max: 0 },
                    },
                    steals: {
                        predicted: stats.steals,
                        confidence: d.confidence,
                        range: { min: 0, max: 0 },
                    },
                    blocks: {
                        predicted: stats.blocks,
                        confidence: d.confidence,
                        range: { min: 0, max: 0 },
                    },
                    threes: {
                        predicted: stats.threes,
                        confidence: d.confidence,
                        range: { min: 0, max: 0 },
                    },
                    minutes: {
                        predicted: stats.minutes,
                        confidence: d.confidence,
                        range: { min: 0, max: 0 },
                    },
                },
                metadata: {
                    team: stats.team,
                    position: stats.position,
                    opponent: stats.opponent,
                    isHome: stats.isHome,
                },
            };
        });
    }
    calculateDataQuality(data) {
        // Calculate data quality based on completeness and recency
        const completeness = this.calculateDataCompleteness(data);
        const recency = this.calculateDataRecency(data);
        return (completeness + recency) / 2;
    }
    calculateDataCompleteness(data) {
        const requiredFields = [
            "projections",
            "sentiment",
            "odds",
            "injuries",
            "trends",
        ];
        const presentFields = requiredFields.filter((field) => data[field] !== undefined &&
            Object.keys(data[field]).length > 0);
        return presentFields.length / requiredFields.length;
    }
    calculateDataRecency(data) {
        const now = Date.now();
        const age = now - data.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        return Math.max(0, 1 - age / maxAge);
    }
    calculatePredictionStability(recommendations) {
        if (recommendations.length === 0)
            return 0;
        const confidences = recommendations.map((r) => r.confidence);
        const mean = confidences.reduce((a, b) => a + b, 0) / confidences.length;
        const variance = confidences.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
            confidences.length;
        return 1 - Math.min(1, Math.sqrt(variance));
    }
    calculateMarketEfficiency(odds) {
        const markets = Object.values(odds);
        if (markets.length === 0)
            return 0;
        const movements = markets.map((m) => m.movement?.magnitude || 0);
        const volatility = this.calculateVolatility(movements);
        const liquidity = markets.length / 100; // Normalize by expected max markets
        return (volatility + liquidity) / 2;
    }
    calculateVolatility(values) {
        if (values.length === 0)
            return 0;
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        return Math.min(1, Math.sqrt(variance));
    }
    calculateConfidenceFactors(data) {
        const dataRecord = data;
        return {
            projection_confidence: this.calculateProjectionConfidence(dataRecord.projections),
            sentiment_confidence: this.calculateSentimentConfidence(dataRecord.sentiment),
            market_confidence: this.calculateMarketConfidence(dataRecord.odds),
        };
    }
    calculateProjectionConfidence(projections) {
        const projectionsRecord = projections;
        const confidences = Object.values(projectionsRecord).map((p) => p.confidence || 0);
        return confidences.length > 0
            ? confidences.reduce((a, b) => a + b, 0) / confidences.length
            : 0;
    }
    calculateSentimentConfidence(sentiment) {
        return Object.keys(sentiment).length > 0 ? 0.7 : 0; // Simplified for now
    }
    calculateMarketConfidence(odds) {
        return Object.values(odds).length > 0 ? 0.8 : 0; // Simplified for now
    }
    calculateRiskFactors(data) {
        return {
            data_sparsity: 1 - this.calculateDataCompleteness(data),
            market_volatility: this.calculateMarketVolatility(data.odds),
            injury_risk: this.calculateInjuryRisk(data.injuries),
        };
    }
    calculateMarketVolatility(odds) {
        const oddsRecord = odds;
        return (Object.values(oddsRecord)
            .map((m) => m.movement?.magnitude || 0)
            .reduce((acc, mag) => acc + mag, 0) / Object.keys(oddsRecord).length ||
            0);
    }
    calculateInjuryRisk(injuries) {
        const injuriesRecord = injuries;
        return (Object.values(injuriesRecord)
            .map((i) => i.impact || 0)
            .reduce((acc, impact) => acc + impact, 0) /
            Object.keys(injuriesRecord).length || 0);
    }
    evaluateProjection(projection) {
        const recommendations = [];
        // Check if advanced stats feature is enabled
        const useAdvancedStats = this.featureManager.isEnabled("advanced-stats", {
            id: "system",
            groups: ["betting-strategy"],
            attributes: {},
        });
        // Process each stat type
        const statTypes = [
            "points",
            "rebounds",
            "assists",
            "steals",
            "blocks",
            "threes",
        ];
        for (const stat of statTypes) {
            const metrics = projection.predictions[stat];
            if (metrics.confidence >= this.config.minConfidence) {
                const predictedValue = metrics.predicted;
                const targetValue = metrics.range.min; // Use min range as target
                const type = predictedValue > targetValue ? "OVER" : "UNDER";
                const edge = this.calculateEdge({
                    id: `rec-${Date.now()}`,
                    type,
                    confidence: metrics.confidence,
                    reasoning: this.generateReasoning(projection, stat, metrics, useAdvancedStats),
                    supporting_data: {
                        historical_data: [],
                        market_data: [],
                        correlation_data: [],
                    },
                });
                if (edge >= this.config.minEdge) {
                    recommendations.push({
                        id: `rec-${Date.now()}`,
                        type,
                        confidence: metrics.confidence,
                        reasoning: this.generateReasoning(projection, stat, metrics, useAdvancedStats),
                        supporting_data: {
                            historical_data: [],
                            market_data: [],
                            correlation_data: [],
                        },
                    });
                }
            }
        }
        return recommendations;
    }
    calculateEdge(recommendation) {
        // Calculate edge based on confidence and type
        const baseEdge = recommendation.confidence - 0.5;
        return Math.max(0, baseEdge * (1 - this.config.maxRisk));
    }
    generateReasoning(projection, stat, metrics, useAdvancedStats) {
        const reasoning = [];
        // Base projection confidence
        reasoning.push(`${projection.player} has a ${(metrics.confidence * 100).toFixed(1)}% confidence projection for ${stat}`);
        // Minutes-based reasoning
        const minutes = projection.predictions.minutes;
        if (minutes.predicted >= 30) {
            reasoning.push(`Expected to play significant minutes (${minutes.predicted.toFixed(1)})`);
        }
        // Matchup-based reasoning
        reasoning.push(`${projection.metadata.isHome ? "Home" : "Away"} game against ${projection.metadata.opponent}`);
        // Advanced stats reasoning if enabled
        if (useAdvancedStats) {
            reasoning.push(`Projection range: ${metrics.range.min.toFixed(1)} - ${metrics.range.max.toFixed(1)}`);
        }
        return reasoning;
    }
}
