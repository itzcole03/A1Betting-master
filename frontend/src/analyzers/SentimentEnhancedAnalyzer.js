import { EventBus } from '../unified/EventBus.ts';
import { PerformanceMonitor } from '../unified/PerformanceMonitor.ts';
export class SentimentEnhancedAnalyzer {
    constructor(sentimentWeight = 0.2, oddsWeight = 0.3, injuryWeight = 0.2) {
        this.id = 'sentiment-enhanced-analyzer';
        this.type = 'enhanced-analysis';
        this.name = 'Sentiment Enhanced Analyzer';
        this.description = 'Enhances projections with sentiment, odds, and injury data.';
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.sentimentWeight = sentimentWeight;
        this.oddsWeight = oddsWeight;
        this.injuryWeight = injuryWeight;
    }
    validate(data) {
        return Array.isArray(data.projectionAnalysis);
    }
    getMetrics() {
        return { accuracy: 1, latency: 0, errorRate: 0 };
    }
    async analyze(input) {
        const traceId = this.performanceMonitor.startTrace('enhanced-analysis');
        try {
            const enhancedAnalyses = input.projectionAnalysis.map(projection => {
                const sentiment = this.findPlayerSentiment(projection.player, input.sentimentData);
                const injuries = this.findPlayerInjuries(projection.player, input.sportsRadarData);
                const odds = this.findPlayerOdds(projection.player, input.oddsData);
                const enhancedConfidence = this.calculateEnhancedConfidence(projection.confidence, sentiment, odds, injuries);
                return {
                    ...projection,
                    confidence: enhancedConfidence,
                    sentiment: {
                        score: sentiment?.sentiment.score ?? 0,
                        volume: sentiment?.sentiment.volume ?? 0,
                        trending: sentiment?.trending ?? false,
                        keywords: sentiment?.keywords ?? [],
                    },
                    marketData: {
                        odds: {
                            moneyline: odds?.moneyline,
                            spread: odds?.spread,
                            total: odds?.total,
                        },
                        consensus: {
                            overPercentage: odds?.consensus?.over ?? 50,
                            underPercentage: odds?.consensus?.under ?? 50,
                        },
                    },
                    injuries: injuries.map(injury => ({
                        player: injury.player,
                        status: injury.status,
                        impact: this.calculateInjuryImpact(injury),
                    })),
                };
            });
            this.eventBus.publish({
                type: 'enhanced-analysis-completed',
                payload: { data: enhancedAnalyses },
            });
            this.performanceMonitor.endTrace(traceId);
            return enhancedAnalyses;
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            throw error;
        }
    }
    async confidence(input) {
        const analyses = await this.analyze(input);
        return analyses.reduce((acc, analysis) => acc + analysis.confidence, 0) / analyses.length;
    }
    findPlayerSentiment(player, sentimentData) {
        return sentimentData.find(data => data.player === player);
    }
    findPlayerInjuries(player, sportsData) {
        const injuries = [];
        sportsData.games.forEach(game => {
            game.players.forEach(p => {
                if (p.name === player) {
                    p.injuries.forEach(injury => {
                        injuries.push({
                            player: p.name,
                            status: injury.status,
                            type: injury.type,
                        });
                    });
                }
            });
        });
        return injuries;
    }
    findPlayerOdds(player, oddsData) {
        // Find odds for the specific player from the odds data
        const playerOdds = oddsData.odds?.find((odd) => odd.player === player || odd.description?.includes(player));
        if (!playerOdds) {
            return null;
        }
        return {
            moneyline: playerOdds.moneyline,
            spread: playerOdds.spread,
            total: playerOdds.total,
            consensus: playerOdds.consensus ? {
                over: playerOdds.consensus.over,
                under: playerOdds.consensus.under,
            } : undefined,
        };
    }
    calculateEnhancedConfidence(baseConfidence, sentiment, odds, injuries = []) {
        let confidence = baseConfidence;
        // Apply sentiment adjustment
        if (sentiment) {
            confidence += this.sentimentWeight * sentiment.sentiment.score;
        }
        // Apply odds adjustment
        if (odds) {
            // Implement odds-based confidence adjustment
        }
        // Apply injury adjustment
        if (injuries.length > 0) {
            const injuryImpact = injuries.reduce((acc, injury) => acc + this.calculateInjuryImpact(injury), 0);
            confidence -= this.injuryWeight * injuryImpact;
        }
        // Ensure confidence stays within 0-1 range
        return Math.max(0, Math.min(1, confidence));
    }
    calculateInjuryImpact(injury) {
        // Implement injury impact calculation
        switch (injury.status.toLowerCase()) {
            case 'out':
                return 1;
            case 'doubtful':
                return 0.75;
            case 'questionable':
                return 0.5;
            case 'probable':
                return 0.25;
            default:
                return 0;
        }
    }
}
