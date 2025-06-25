import { BaseService } from './BaseService';
export class UnifiedAnalyticsService extends BaseService {
    constructor(registry) {
        super('analytics', registry);
        this.stateService = registry.getService('state');
        this.bettingService = registry.getService('betting');
        this.predictionService = registry.getService('prediction');
        this.errorService = registry.getService('error');
    }
    // Renamed to avoid duplicate member error
    async getPerformanceMetricsApi(eventId, marketId, selectionId) {
        const response = await this.api.get(`/analytics/performance`, {
            params: { eventId, marketId, selectionId },
        });
        return response.data;
    }
    async getTrendDelta(eventId, marketId, selectionId, period) {
        const response = await this.api.get(`/analytics/trend`, {
            params: { eventId, marketId, selectionId, period },
        });
        return response.data;
    }
    async getRiskProfile(eventId, marketId, selectionId) {
        const response = await this.api.get(`/analytics/risk`, {
            params: { eventId, marketId, selectionId },
        });
        return response.data;
    }
    async getExplainabilityMap(eventId, marketId, selectionId) {
        const response = await this.api.get(`/analytics/explainability`, {
            params: { eventId, marketId, selectionId },
        });
        return response.data;
    }
    async getModelMetadata(eventId, marketId, selectionId) {
        const response = await this.api.get(`/analytics/model`, {
            params: { eventId, marketId, selectionId },
        });
        return response.data;
    }
    // Renamed to avoid duplicate member error
    async getRecentActivityApi(eventId, marketId, selectionId, limit = 10) {
        const response = await this.api.get(`/analytics/activity`, {
            params: { eventId, marketId, selectionId, limit },
        });
        return response.data;
    }
    async getFeatureImportance(eventId, marketId, selectionId) {
        const response = await this.api.get(`/analytics/features`, {
            params: { eventId, marketId, selectionId },
        });
        return response.data;
    }
    async getConfidenceInterval(eventId, marketId, selectionId) {
        const response = await this.api.get(`/analytics/confidence`, {
            params: { eventId, marketId, selectionId },
        });
        return response.data;
    }
    async getModelPerformance(eventId, marketId, selectionId) {
        const response = await this.api.get(`/analytics/model-performance`, {
            params: { eventId, marketId, selectionId },
        });
        return response.data;
    }
    async getBettingStats(eventId, marketId, selectionId) {
        const response = await this.api.get(`/analytics/betting-stats`, {
            params: { eventId, marketId, selectionId },
        });
        return response.data;
    }
    async getMarketEfficiency(eventId, marketId, selectionId) {
        const response = await this.api.get(`/analytics/market-efficiency`, {
            params: { eventId, marketId, selectionId },
        });
        return response.data;
    }
    async getPerformanceMetrics(timeRange = 'week') {
        try {
            const [bets, predictions] = await Promise.all([
                this.bettingService.getBets(timeRange),
                this.predictionService.getPredictions(timeRange),
            ]);
            const totalBets = bets.length;
            const activeBets = bets.filter(bet => bet.status === 'active').length;
            const winRate = this.calculateWinRate(bets);
            const profitLoss = this.calculateProfitLoss(bets);
            const roi = this.calculateROI(bets);
            const { bestStreak, currentStreak } = this.calculateStreaks(bets);
            const averageOdds = this.calculateAverageOdds(bets);
            const averageStake = this.calculateAverageStake(bets);
            const totalPredictions = predictions.length;
            const predictionAccuracy = this.calculatePredictionAccuracy(predictions);
            const opportunities = this.calculateOpportunities(predictions);
            return {
                totalBets,
                activeBets,
                winRate,
                profitLoss,
                roi,
                bestStreak,
                currentStreak,
                averageOdds,
                averageStake,
                totalPredictions,
                predictionAccuracy,
                opportunities,
                timestamp: Date.now(),
            };
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'ANALYTICS_ERROR',
                source: 'UnifiedAnalyticsService',
                details: { method: 'getPerformanceMetrics', timeRange },
            });
            throw error;
        }
    }
    async getRecentActivity(limit = 10) {
        try {
            const [bets, predictions, opportunities] = await Promise.all([
                this.bettingService.getRecentBets(limit),
                this.predictionService.getRecentPredictions(limit),
                this.predictionService.getRecentOpportunities(limit),
            ]);
            const activities = [
                ...bets.map(bet => ({
                    id: bet.id,
                    type: 'bet',
                    description: `Bet placed on ${bet.event}`,
                    amount: bet.amount,
                    odds: bet.odds,
                    timestamp: bet.timestamp,
                    status: bet.status,
                })),
                ...predictions.map(pred => ({
                    id: pred.id,
                    type: 'prediction',
                    description: `Prediction for ${pred.event}`,
                    timestamp: pred.timestamp,
                    status: pred.status,
                })),
                ...opportunities.map(opp => ({
                    id: opp.id,
                    type: 'opportunity',
                    description: `Opportunity detected for ${opp.event}`,
                    timestamp: opp.timestamp,
                    status: opp.status,
                })),
            ];
            return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
        }
        catch (error) {
            this.errorService.handleError(error, {
                code: 'ANALYTICS_ERROR',
                source: 'UnifiedAnalyticsService',
                details: { method: 'getRecentActivity', limit },
            });
            throw error;
        }
    }
    calculateWinRate(bets) {
        if (bets.length === 0)
            return 0;
        const wonBets = bets.filter(bet => bet.status === 'won').length;
        return (wonBets / bets.length) * 100;
    }
    calculateProfitLoss(bets) {
        return bets.reduce((total, bet) => {
            if (bet.status === 'won') {
                return total + (bet.amount * bet.odds - bet.amount);
            }
            else if (bet.status === 'lost') {
                return total - bet.amount;
            }
            return total;
        }, 0);
    }
    calculateROI(bets) {
        if (bets.length === 0)
            return 0;
        const totalStaked = bets.reduce((sum, bet) => sum + bet.amount, 0);
        const profitLoss = this.calculateProfitLoss(bets);
        return (profitLoss / totalStaked) * 100;
    }
    calculateStreaks(bets) {
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;
        bets.forEach(bet => {
            if (bet.status === 'won') {
                tempStreak++;
                currentStreak = tempStreak;
                bestStreak = Math.max(bestStreak, tempStreak);
            }
            else if (bet.status === 'lost') {
                tempStreak = 0;
                currentStreak = 0;
            }
        });
        return { bestStreak, currentStreak };
    }
    calculateAverageOdds(bets) {
        if (bets.length === 0)
            return 0;
        const totalOdds = bets.reduce((sum, bet) => sum + bet.odds, 0);
        return totalOdds / bets.length;
    }
    calculateAverageStake(bets) {
        if (bets.length === 0)
            return 0;
        const totalStaked = bets.reduce((sum, bet) => sum + bet.amount, 0);
        return totalStaked / bets.length;
    }
    calculatePredictionAccuracy(predictions) {
        if (predictions.length === 0)
            return 0;
        const correctPredictions = predictions.filter(pred => pred.status === 'correct').length;
        return (correctPredictions / predictions.length) * 100;
    }
    calculateOpportunities(predictions) {
        return predictions.filter(pred => pred.status === 'opportunity').length;
    }
}
