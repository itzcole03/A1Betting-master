export class BestBetSelector {
    constructor(logger, metrics, config, predictionEngine, eventBus, errorHandler, performanceMonitor) {
        this.logger = logger;
        this.metrics = metrics;
        this.modelPerformance = new Map();
        this.config = config;
        this.predictionEngine = predictionEngine;
        this.eventBus = eventBus;
        this.errorHandler = errorHandler;
        this.performanceMonitor = performanceMonitor;
    }
    async selectBestBets(opportunities, riskProfile) {
        const startTime = performance.now();
        try {
            // Filter and validate opportunities
            const validOpportunities = opportunities.filter(opportunity => {
                const validation = this.validateRiskProfile(opportunity, riskProfile);
                if (!validation.isValid) {
                    this.eventBus.emit('betting:validation_failed', {
                        opportunity,
                        reason: validation.reason,
                    });
                }
                return validation.isValid;
            });
            // Sort by expected value
            const sortedOpportunities = validOpportunities.sort((a, b) => {
                const evA = this.calculateExpectedValue(a);
                const evB = this.calculateExpectedValue(b);
                return evB - evA;
            });
            // Limit to max concurrent bets
            const selectedBets = sortedOpportunities.slice(0, riskProfile.max_concurrent_bets);
            // Monitor performance
            const endTime = performance.now();
            this.performanceMonitor.recordOperation('selectBestBets', endTime - startTime);
            return selectedBets;
        }
        catch (error) {
            this.errorHandler.handleError(error, 'BestBetSelector', 'selectBestBets');
            return [];
        }
    }
    validateRiskProfile(opportunity, riskProfile) {
        const startTime = performance.now();
        try {
            // Check confidence threshold
            if (opportunity.confidence < riskProfile.min_confidence_threshold) {
                return {
                    isValid: false,
                    reason: `Confidence (${opportunity.confidence.toFixed(2)}) below threshold (${riskProfile.min_confidence_threshold})`,
                };
            }
            // Check stake percentage
            const maxStake = opportunity.bankroll * riskProfile.max_stake_percentage;
            if (opportunity.stake > maxStake) {
                return {
                    isValid: false,
                    reason: `Stake (${opportunity.stake}) exceeds maximum (${maxStake})`,
                };
            }
            // Check volatility tolerance
            if (opportunity.volatility > riskProfile.volatility_tolerance) {
                return {
                    isValid: false,
                    reason: `Volatility (${opportunity.volatility.toFixed(2)}) exceeds tolerance (${riskProfile.volatility_tolerance})`,
                };
            }
            // Check risk score
            if (opportunity.riskScore > riskProfile.max_risk_score) {
                return {
                    isValid: false,
                    reason: `Risk score (${opportunity.riskScore.toFixed(2)}) exceeds maximum (${riskProfile.max_risk_score})`,
                };
            }
            // Check preferred sports
            if (!riskProfile.preferred_sports.includes(opportunity.sport)) {
                return {
                    isValid: false,
                    reason: `Sport (${opportunity.sport}) not in preferred sports`,
                };
            }
            // Check preferred markets
            if (!riskProfile.preferred_markets.includes(opportunity.market)) {
                return {
                    isValid: false,
                    reason: `Market (${opportunity.market}) not in preferred markets`,
                };
            }
            // Check excluded events
            if (riskProfile.excluded_events?.includes(opportunity.eventId)) {
                return {
                    isValid: false,
                    reason: `Event (${opportunity.eventId}) is in excluded events`,
                };
            }
            // Check Kelly Criterion
            const kellyStake = this.calculateKellyStake(opportunity.probability, opportunity.odds, riskProfile.kelly_fraction);
            if (opportunity.stake > kellyStake) {
                return {
                    isValid: false,
                    reason: `Stake (${opportunity.stake}) exceeds Kelly Criterion (${kellyStake.toFixed(2)})`,
                };
            }
            // Record performance
            this.performanceMonitor.recordOperation('validateRiskProfile', performance.now() - startTime);
            return { isValid: true };
        }
        catch (error) {
            this.errorHandler.handleError(error, 'BestBetSelector', 'validateRiskProfile');
            return {
                isValid: false,
                reason: 'Error validating risk profile',
            };
        }
    }
    calculateKellyStake(probability, odds, kellyFraction) {
        const q = 1 - probability;
        const b = odds - 1;
        const kelly = (probability * b - q) / b;
        return Math.max(0, kelly * kellyFraction);
    }
    calculateExpectedValue(opportunity) {
        const { odds, confidence, stake } = opportunity;
        const winAmount = stake * (odds - 1);
        const loseAmount = stake;
        return confidence * winAmount - (1 - confidence) * loseAmount;
    }
    updateModelPerformance(modelName, result) {
        const current = this.modelPerformance.get(modelName) || {
            wins: 0,
            losses: 0,
            roi: 0,
            lastUpdated: new Date(),
        };
        if (result.won) {
            current.wins++;
        }
        else {
            current.losses++;
        }
        const profit = result.won ? result.payout - result.stake : -result.stake;
        const totalStaked = (current.wins + current.losses) * result.stake;
        current.roi = totalStaked > 0 ? profit / totalStaked : 0;
        current.lastUpdated = new Date();
        this.modelPerformance.set(modelName, current);
    }
    getModelPerformance() {
        return new Map(this.modelPerformance);
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
