import { EventEmitter } from 'events';
import BackendIntegrationService from './BackendIntegrationService';
import { UnifiedWebSocketService } from './unified/UnifiedWebSocketService';
import { UnifiedLogger } from './unified/UnifiedLogger';
import { ArbitrageService } from './ArbitrageService';
import { PrizePicksAPI } from './PrizePicksAPI';
class RealTimeMoneyMakingService extends EventEmitter {
    constructor() {
        super();
        this.opportunities = new Map();
        this.isActive = false;
        this.scanInterval = null;
        this.performanceMetrics = {
            totalOpportunitiesFound: 0,
            totalBetsPlaced: 0,
            totalProfit: 0,
            winRate: 0,
            avgKellyFraction: 0,
            lastScanTime: 0,
        };
        this.logger = UnifiedLogger.getInstance();
        this.backendService = BackendIntegrationService.getInstance();
        this.wsService = UnifiedWebSocketService.getInstance();
        this.arbitrageService = ArbitrageService.getInstance();
        this.prizePicksService = PrizePicksAPI.getInstance();
        this.setupEventListeners();
    }
    static getInstance() {
        if (!RealTimeMoneyMakingService.instance) {
            RealTimeMoneyMakingService.instance = new RealTimeMoneyMakingService();
        }
        return RealTimeMoneyMakingService.instance;
    }
    setupEventListeners() {
        // Real-time opportunity detection
        this.wsService.subscribe('market:odds_change', this.handleOddsChange.bind(this));
        this.wsService.subscribe('arbitrage:opportunity', this.handleArbitrageOpportunity.bind(this));
        this.wsService.subscribe('prediction:update', this.handlePredictionUpdate.bind(this));
        this.wsService.subscribe('prizepicks:new_prop', this.handleNewProp.bind(this));
    }
    async startRealTimeScanning(config) {
        if (this.isActive) {
            this.logger.warn('Real-time scanning already active');
            return;
        }
        this.isActive = true;
        this.logger.info('Starting real-time money-making scanner', config);
        // Initial scan
        await this.performFullScan(config);
        // Set up periodic scanning
        this.scanInterval = setInterval(async () => {
            await this.performFullScan(config);
        }, config.scanIntervalMs);
        this.emit('scanning:started', config);
    }
    async stopRealTimeScanning() {
        if (!this.isActive)
            return;
        this.isActive = false;
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
        this.logger.info('Stopped real-time money-making scanner');
        this.emit('scanning:stopped');
    }
    async performFullScan(config) {
        const startTime = Date.now();
        try {
            // Parallel scanning across different opportunity types
            const scanPromises = [
                this.scanPrizePicksOpportunities(config),
                this.scanArbitrageOpportunities(config),
                this.scanValueBetOpportunities(config),
            ];
            const results = await Promise.allSettled(scanPromises);
            // Process successful scans
            const allOpportunities = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    allOpportunities.push(...result.value);
                }
                else {
                    this.logger.error(`Scan ${index} failed`, { error: result.reason });
                }
            });
            // Update opportunities cache
            this.updateOpportunities(allOpportunities);
            // Optimize portfolio
            const portfolio = await this.optimizePortfolio(allOpportunities, config);
            this.performanceMetrics.lastScanTime = Date.now();
            this.performanceMetrics.totalOpportunitiesFound += allOpportunities.length;
            this.emit('scan:completed', {
                opportunities: allOpportunities,
                portfolio,
                scanTime: Date.now() - startTime,
                metrics: this.performanceMetrics,
            });
        }
        catch (error) {
            this.logger.error('Full scan failed', { error: error.message });
            this.emit('scan:error', error);
        }
    }
    async scanPrizePicksOpportunities(config) {
        try {
            const props = await this.prizePicksService.getAvailableProps({
                sports: config.sports,
                timeWindow: 'today',
            });
            const opportunities = [];
            for (const prop of props.slice(0, 50)) { // Limit for performance
                const prediction = await this.backendService.getPrediction({
                    player_id: prop.playerId,
                    metric: prop.statType,
                    timeframe: 'today',
                    include_shap: true,
                });
                if (prediction.prediction.confidence >= config.minConfidence) {
                    const kellyFraction = this.calculateKellyFraction(prediction.prediction.confidence, prop.overOdds);
                    opportunities.push({
                        id: `prizepicks-${prop.playerId}-${prop.statType}`,
                        type: 'prizepicks',
                        source: 'PrizePicks',
                        playerName: prop.playerName,
                        statType: prop.statType,
                        line: prop.line,
                        odds: prop.overOdds,
                        confidence: prediction.prediction.confidence,
                        expectedValue: this.calculateExpectedValue(prediction.prediction.confidence, prop.overOdds),
                        kellyFraction,
                        projectedReturn: prediction.prediction.value,
                        riskLevel: this.calculateRiskLevel(prediction.prediction.confidence, kellyFraction),
                        timeRemaining: this.calculateTimeRemaining(prop.gameTime),
                        analysis: {
                            historicalTrends: prediction.analysis.historical_trends,
                            marketSignals: prediction.analysis.market_signals,
                            riskFactors: prediction.analysis.risk_factors,
                            modelBreakdown: prediction.analysis.model_breakdown,
                            shapValues: prediction.shap_values,
                        },
                        metadata: {
                            createdAt: Date.now(),
                            expiresAt: Date.now() + (4 * 60 * 60 * 1000), // 4 hours
                            modelVersion: prediction.meta.model_version,
                            predictionId: prediction.meta.prediction_id,
                        },
                    });
                }
            }
            return opportunities;
        }
        catch (error) {
            this.logger.error('PrizePicks scan failed', { error: error.message });
            return [];
        }
    }
    async scanArbitrageOpportunities(config) {
        try {
            const arbOpportunities = await this.backendService.getArbitrageOpportunities({
                sports: config.sports,
                min_profit: 0.02, // 2% minimum profit
                time_window: 'today',
            });
            return arbOpportunities.map(arb => ({
                id: `arbitrage-${arb.id}`,
                type: 'arbitrage',
                source: `${arb.bookmaker1.name} vs ${arb.bookmaker2.name}`,
                playerName: arb.event,
                statType: arb.market,
                line: 0, // Arbitrage doesn't have a line
                odds: arb.bookmaker1.odds,
                confidence: 0.99, // Arbitrage is near-certain profit
                expectedValue: arb.profit_percentage,
                kellyFraction: 0.05, // Conservative for arbitrage
                projectedReturn: arb.profit,
                riskLevel: 'low',
                timeRemaining: this.calculateTimeRemainingFromString(arb.expires_at),
                analysis: {
                    historicalTrends: ['Risk-free arbitrage opportunity'],
                    marketSignals: ['Price discrepancy detected'],
                    riskFactors: ['Timing risk', 'Liquidity risk'],
                    modelBreakdown: { 'Arbitrage Scanner': 1.0 },
                },
                metadata: {
                    createdAt: Date.now(),
                    expiresAt: new Date(arb.expires_at).getTime(),
                    modelVersion: 'arbitrage-v1.0',
                    predictionId: arb.id,
                },
            }));
        }
        catch (error) {
            this.logger.error('Arbitrage scan failed', { error: error.message });
            return [];
        }
    }
    async scanValueBetOpportunities(config) {
        try {
            const valueBets = await this.backendService.getBettingOpportunities({
                sports: config.sports,
                confidence_threshold: config.minConfidence,
                time_window: 'today',
                strategy_mode: 'value_maximizer',
            });
            return valueBets.map(bet => ({
                id: `value-${bet.id}`,
                type: 'value_bet',
                source: 'ML Value Scanner',
                playerName: bet.player_name,
                statType: bet.stat_type,
                line: bet.line,
                odds: bet.over_odds,
                confidence: bet.confidence,
                expectedValue: bet.expected_value,
                kellyFraction: bet.kelly_fraction,
                projectedReturn: bet.line + (bet.expected_value / 100),
                riskLevel: bet.risk_level,
                timeRemaining: this.calculateTimeRemainingFromString(bet.time_remaining),
                analysis: {
                    historicalTrends: bet.analysis.historical_trends,
                    marketSignals: bet.analysis.market_signals,
                    riskFactors: bet.analysis.risk_factors,
                    modelBreakdown: { 'Value Scanner': 1.0 },
                },
                metadata: {
                    createdAt: Date.now(),
                    expiresAt: Date.now() + (6 * 60 * 60 * 1000), // 6 hours
                    modelVersion: 'value-v1.0',
                    predictionId: bet.id,
                },
            }));
        }
        catch (error) {
            this.logger.error('Value bet scan failed', { error: error.message });
            return [];
        }
    }
    async optimizePortfolio(opportunities, config) {
        // Sort by Kelly-adjusted expected value
        const sorted = opportunities.sort((a, b) => {
            const aScore = a.expectedValue * a.kellyFraction * a.confidence;
            const bScore = b.expectedValue * b.kellyFraction * b.confidence;
            return bScore - aScore;
        });
        // Apply portfolio constraints
        const selected = [];
        let totalKellyFraction = 0;
        const allocation = {};
        for (const opp of sorted) {
            if (selected.length >= 10)
                break; // Max 10 positions
            if (totalKellyFraction + opp.kellyFraction > config.maxExposure)
                break;
            if (opp.confidence < config.minConfidence)
                continue;
            selected.push(opp);
            totalKellyFraction += opp.kellyFraction;
            allocation[opp.id] = Math.round(1000 * opp.kellyFraction); // $1000 base bankroll
        }
        const totalExpectedValue = selected.reduce((sum, opp) => sum + opp.expectedValue, 0);
        const riskScore = this.calculatePortfolioRisk(selected);
        const diversificationScore = this.calculateDiversification(selected);
        return {
            opportunities: selected,
            totalExpectedValue,
            totalKellyFraction,
            riskScore,
            diversificationScore,
            allocation,
            constraints: {
                maxSingleBet: Math.max(...Object.values(allocation)),
                maxTotalExposure: config.maxExposure,
                minConfidence: config.minConfidence,
            },
        };
    }
    calculateKellyFraction(confidence, odds) {
        const b = odds - 1; // net odds
        const p = confidence; // probability of winning
        const q = 1 - p; // probability of losing
        const kelly = (b * p - q) / b;
        return Math.max(0, Math.min(kelly * 0.25, 0.1)); // Conservative Kelly with 25% multiplier, max 10%
    }
    calculateExpectedValue(confidence, odds) {
        const impliedProbability = 1 / odds;
        return (confidence * odds - 1) * 100; // Return as percentage
    }
    calculateRiskLevel(confidence, kellyFraction) {
        if (confidence > 0.8 && kellyFraction < 0.03)
            return 'low';
        if (confidence > 0.7 && kellyFraction < 0.06)
            return 'medium';
        return 'high';
    }
    calculateTimeRemaining(gameTime) {
        const gameDate = new Date(gameTime);
        const now = new Date();
        return Math.max(0, Math.floor((gameDate.getTime() - now.getTime()) / (1000 * 60))); // minutes
    }
    calculateTimeRemainingFromString(timeStr) {
        if (timeStr.includes('hour')) {
            const hours = parseInt(timeStr.match(/\d+/)?.[0] || '0');
            return hours * 60;
        }
        if (timeStr.includes('minute')) {
            return parseInt(timeStr.match(/\d+/)?.[0] || '0');
        }
        return 60; // Default 1 hour
    }
    calculatePortfolioRisk(opportunities) {
        const avgConfidence = opportunities.reduce((sum, opp) => sum + opp.confidence, 0) / opportunities.length;
        const avgKelly = opportunities.reduce((sum, opp) => sum + opp.kellyFraction, 0) / opportunities.length;
        // Risk score: lower is better (0-100)
        return Math.max(0, 100 - (avgConfidence * 50 + (1 - avgKelly * 10) * 50));
    }
    calculateDiversification(opportunities) {
        const sports = new Set(opportunities.map(opp => opp.statType));
        const types = new Set(opportunities.map(opp => opp.type));
        const sources = new Set(opportunities.map(opp => opp.source));
        // Diversification score: higher is better (0-100)
        const sportDiv = Math.min(sports.size / 4, 1) * 40; // Max 40 points for sports diversity
        const typeDiv = Math.min(types.size / 3, 1) * 30; // Max 30 points for type diversity
        const sourceDiv = Math.min(sources.size / 3, 1) * 30; // Max 30 points for source diversity
        return sportDiv + typeDiv + sourceDiv;
    }
    updateOpportunities(newOpportunities) {
        // Remove expired opportunities
        const now = Date.now();
        for (const [id, opp] of this.opportunities) {
            if (opp.metadata.expiresAt < now) {
                this.opportunities.delete(id);
            }
        }
        // Add new opportunities
        newOpportunities.forEach(opp => {
            this.opportunities.set(opp.id, opp);
        });
        this.emit('opportunities:updated', Array.from(this.opportunities.values()));
    }
    // Event handlers for real-time updates
    async handleOddsChange(data) {
        // Handle real-time odds changes
        this.logger.info('Odds change detected', data);
        this.emit('odds:changed', data);
    }
    async handleArbitrageOpportunity(data) {
        // Handle new arbitrage opportunities
        this.logger.info('Arbitrage opportunity detected', data);
        this.emit('arbitrage:found', data);
    }
    async handlePredictionUpdate(data) {
        // Handle prediction updates
        this.logger.info('Prediction update received', data);
        this.emit('prediction:updated', data);
    }
    async handleNewProp(data) {
        // Handle new PrizePicks props
        this.logger.info('New prop detected', data);
        this.emit('prop:new', data);
    }
    // Public interface methods
    getActiveOpportunities() {
        return Array.from(this.opportunities.values());
    }
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }
    async placeBet(opportunityId, amount) {
        const opportunity = this.opportunities.get(opportunityId);
        if (!opportunity) {
            return { success: false, error: 'Opportunity not found' };
        }
        try {
            const result = await this.backendService.placeBet({
                opportunity_id: opportunityId,
                amount,
                bet_type: opportunity.type,
                selection: opportunity.projectedReturn > opportunity.line ? 'over' : 'under',
            });
            if (result.success) {
                this.performanceMetrics.totalBetsPlaced++;
                this.opportunities.delete(opportunityId); // Remove placed opportunity
                this.emit('bet:placed', { opportunityId, amount, betId: result.bet_id });
            }
            return result;
        }
        catch (error) {
            this.logger.error('Failed to place bet', { error: error.message, opportunityId });
            return { success: false, error: error.message };
        }
    }
}
export default RealTimeMoneyMakingService;
