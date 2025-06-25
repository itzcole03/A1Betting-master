import { EventBus } from '../core/EventBus.js';
import { PerformanceMonitor } from '../core/PerformanceMonitor.js';
export class SentimentEnhancedAnalyzer {
    constructor(sentimentWeight = 0.2, 
    // oddsWeight = 0.3, // Reserved for future use
    injuryWeight = 0.2) {
        this.id = 'sentiment-enhanced-analyzer';
        this.type = 'enhanced-analysis';
        this.name = 'Sentiment Enhanced Analyzer';
        this.description = 'Enhances projections with sentiment, odds, and injury data.';
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.sentimentWeight = sentimentWeight;
        // this._oddsWeight = oddsWeight; // Reserved for future use, suppress unused warning
        this.injuryWeight = injuryWeight;
    }
    validate(data) { return Array.isArray(data.projectionAnalysis); }
    getMetrics() { return { accuracy: 1, latency: 0, errorRate: 0 }; }
    async analyze(input) {
        const traceId = this.performanceMonitor.startTrace('enhanced-analysis');
        try {
            const enhancedAnalyses = input.projectionAnalysis.map(projection => {
                const sentiment = this.findPlayerSentiment(projection.player, input.sentimentData);
                const injuries = this.findPlayerInjuries(projection.player, input.sportsRadarData);
                // Extract odds for the player from oddsData if available
                const odds = this.findPlayerOdds(projection.player, input.oddsData);
                const enhancedConfidence = this.calculateEnhancedConfidence(projection.confidence, sentiment, odds, injuries);
                return {
                    ...projection,
                    confidence: enhancedConfidence,
                    sentiment: {
                        score: sentiment?.sentiment.score ?? 0,
                        volume: sentiment?.sentiment.volume ?? 0,
                        trending: sentiment?.trending ?? false,
                        keywords: sentiment?.keywords ?? []
                    },
                    marketData: {
                        odds: {
                            moneyline: odds?.moneyline,
                            spread: odds?.spread,
                            total: odds?.total
                        },
                        consensus: {
                            overPercentage: odds?.consensus?.over ?? 50,
                            underPercentage: odds?.consensus?.under ?? 50
                        }
                    },
                    injuries: injuries.map(injury => ({
                        player: injury.player,
                        status: injury.status,
                        impact: this.calculateInjuryImpact(injury)
                    }))
                };
            });
            // Use eventBus.emit instead of non-existent publish
            this.eventBus.emit('enhanced-analysis-completed', { data: enhancedAnalyses });
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
        sportsData.games.forEach((game) => {
            game.players.forEach((p) => {
                if (p.name === player) {
                    p.injuries.forEach((injury) => {
                        injuries.push({
                            player: p.name,
                            status: injury.status,
                            type: injury.type
                        });
                    });
                }
            });
        });
        return injuries;
    }
    /**
     * Attempts to find odds for a given player from the provided odds data.
     * Returns an OddsData object or null if not found.
     */
    findPlayerOdds(player, oddsData) {
        if (!oddsData || !oddsData.events)
            return null;
        for (const event of oddsData.events) {
            for (const bookmaker of event.bookmakers) {
                for (const market of bookmaker.markets) {
                    for (const outcome of market.outcomes) {
                        if (outcome.name === player) {
                            return {
                                moneyline: outcome.price,
                                spread: outcome.point,
                                total: undefined,
                                consensus: undefined
                            };
                        }
                    }
                }
            }
        }
        return null;
    }
    calculateEnhancedConfidence(baseConfidence, sentiment, 
    // TODO: Replace 'OddsData' with actual odds type when finalized
    // See roadmap for odds type finalization
    odds, injuries = []) {
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
