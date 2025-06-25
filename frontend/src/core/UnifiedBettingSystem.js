import { AnalysisRegistry } from './AnalysisFramework';
import { EventBus } from '@/core/EventBus';
import { PerformanceMonitor } from './PerformanceMonitor';
import { UnifiedPredictionEngine } from './UnifiedPredictionEngine';
import { UnifiedStrategyEngine } from './UnifiedStrategyEngine';
import { unifiedDataEngine } from './UnifiedDataEngine';
import { unifiedState } from './UnifiedState';
export class UnifiedBettingSystem {
    constructor() {
        this.dataEngine = unifiedDataEngine;
        this.predictionEngine = UnifiedPredictionEngine.getInstance();
        this.strategyEngine = UnifiedStrategyEngine.getInstance();
        this.MIN_CONFIDENCE = 0.7;
        this.MAX_ACTIVE_BETS = 10;
        this.RISK_THRESHOLD = 0.8;
        this.bankrollConfig = {
            initialAmount: 10000,
            maxRiskPerBet: 0.05,
            maxDailyLoss: 0.2,
            maxExposure: 0.1,
            kellyFraction: 0.5,
        };
        this.bankrollState = {
            currentAmount: 10000,
            totalWagered: 0,
            totalWon: 0,
            totalLost: 0,
            openPositions: 0,
            maxDrawdown: 0,
            lastUpdate: Date.now(),
        };
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.analysisRegistry = AnalysisRegistry.getInstance();
        this.strategies = new Map();
        this.activeBets = new Map();
        this.transactions = [];
        this.positions = new Map();
        this.metrics = this.initializeMetrics();
        this.riskProfile = this.initializeRiskProfile();
        this.setupEventListeners();
    }
    static getInstance() {
        if (!UnifiedBettingSystem.instance) {
            UnifiedBettingSystem.instance = new UnifiedBettingSystem();
        }
        return UnifiedBettingSystem.instance;
    }
    async initialize() {
        const traceId = this.performanceMonitor.startTrace('betting-system-init');
        await this.predictionEngine.initialize();
        await this.strategyEngine.initialize();
        this.performanceMonitor.endTrace(traceId);
    }
    async analyzeBettingOpportunity(context) {
        const historicalTrends = await this.analyzeHistoricalTrends(context);
        const marketSignals = await this.analyzeMarketSignals(context);
        const riskFactors = await this.analyzeRiskFactors(context);
        const { confidence, expectedValue } = this.calculateMetrics(historicalTrends, marketSignals, riskFactors);
        const type = (expectedValue > 0 ? 'over' : 'under');
        // Fix: stake is not defined in this scope, use a calculated value
        const stake = this.calculateOptimalStake(expectedValue, confidence);
        const decision = {
            id: `decision_${Date.now()}`,
            type,
            odds: 1,
            confidence,
            shouldBet: true,
            stake,
            metadata: {
                strategy: '',
                factors: [],
                riskScore: 0,
            },
        };
        // this.eventBus.emit('bettingDecision', decision); // Commented out unavailable eventBus usage
        return decision;
    }
    calculatePerformanceMetrics(bets) {
        const completedBets = bets.filter(bet => bet.result && bet.result !== 'pending');
        const wins = completedBets.filter(bet => bet.result === 'win');
        const totalStake = completedBets.reduce((sum, bet) => sum + bet.stake, 0);
        const totalReturn = completedBets.reduce((sum, bet) => {
            if (bet.result === 'win') {
                return sum + (bet.profitLoss ?? 0);
            }
            return sum - bet.stake;
        }, 0);
        const winRate = completedBets.length ? wins.length / completedBets.length : 0;
        const roi = totalStake ? totalReturn / totalStake : 0;
        const profitLoss = totalReturn;
        const returns = completedBets.map(bet => bet.result === 'win' && bet.stake
            ? ((bet.profitLoss ?? 0) - bet.stake) / bet.stake
            : -1);
        const sharpeRatio = this.calculateSharpeRatio(returns);
        const clvAnalysis = this.calculateAverageClv(completedBets);
        return {
            totalBets: completedBets.length,
            winRate: winRate * 100,
            roi: roi * 100,
            profitLoss,
            clvAverage: clvAnalysis.clvValue,
            edgeRetention: clvAnalysis.edgeRetention,
            kellyMultiplier: this.calculateKellyMultiplier(roi, winRate),
            marketEfficiencyScore: clvAnalysis.marketEfficiency,
            averageOdds: this.calculateAverageOdds(completedBets),
            maxDrawdown: this.calculateMaxDrawdown(completedBets),
            sharpeRatio,
            betterThanExpected: this.calculateEdgeRetention(completedBets),
            timestamp: Date.now(),
            cpu: { usage: 0, cores: 0, temperature: 0 },
            memory: { total: 0, used: 0, free: 0, swap: 0 },
            network: { bytesIn: 0, bytesOut: 0, connections: 0, latency: 0 },
        };
    }
    analyzeClv(bet) {
        const clvValue = this.calculateClvValue(bet);
        const edgeRetention = this.calculateEdgeRetention([bet]);
        const marketEfficiency = this.calculateMarketEfficiency(bet);
        const timeValue = this.calculateTimingImpact(bet); // Restored timeValue calculation
        return {
            clvValue,
            edgeRetention,
            marketEfficiency,
            timeValue,
            factors: [
                {
                    name: 'Market Timing',
                    impact: this.calculateTimingImpact(bet),
                    description: 'Impact of bet timing relative to market close',
                },
                {
                    name: 'Price Movement',
                    impact: this.calculatePriceMovement(bet),
                    description: 'Magnitude and direction of line movement',
                },
                {
                    name: 'Market Efficiency',
                    impact: marketEfficiency,
                    description: 'Overall market pricing efficiency',
                },
            ],
        };
    }
    async analyzeHistoricalTrends(context) {
        // Implement historical analysis
        return [];
    }
    async analyzeMarketSignals(context) {
        // Implement market signal analysis
        return [];
    }
    async analyzeRiskFactors(context) {
        // Implement risk factor analysis
        return [];
    }
    calculateMetrics(historicalTrends, marketSignals, riskFactors) {
        // Implement metric calculation
        return { confidence: 0.7, expectedValue: 0.05 };
    }
    calculateOptimalStake(expectedValue, confidence) {
        // TODO: Replace with actual strategyConfig if/when available
        const kellyFraction = 0.5;
        const minStake = 10;
        const maxStakeLimit = 1000;
        const kellyStake = (expectedValue * confidence) / kellyFraction;
        return Math.min(Math.max(kellyStake, minStake), maxStakeLimit);
    }
    calculateVariance(returns) {
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        return returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    }
    calculateSharpeRatio(returns) {
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const stdDev = Math.sqrt(this.calculateVariance(returns));
        const riskFreeRate = 0.02 / 365; // Daily risk-free rate
        return (mean - riskFreeRate) / stdDev;
    }
    calculateAverageOdds(bets) {
        return bets.length ? bets.reduce((sum, bet) => sum + (bet.odds ?? 0), 0) / bets.length : 0;
    }
    calculateMaxDrawdown(bets) {
        let maxDrawdown = 0;
        let peak = 0;
        let balance = 0;
        bets.forEach(bet => {
            if (bet.result && bet.result.toLowerCase() === 'win') {
                balance += (bet.payout ?? 0) - (bet.stake ?? 0);
            }
            else {
                balance -= bet.stake ?? 0;
            }
            if (balance > peak) {
                peak = balance;
            }
            const drawdown = peak ? (peak - balance) / peak : 0;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        });
        return maxDrawdown * 100;
    }
    calculateClvValue(bet) {
        if (!bet.metadata || typeof bet.metadata.closingOdds !== 'number')
            return 0;
        return ((bet.metadata.closingOdds - (bet.odds ?? 0)) / (bet.odds ?? 1)) * 100;
    }
    calculateEdgeRetention(bets) {
        const expectedWinRate = bets.length
            ? bets.reduce((sum, bet) => sum + (bet.metadata?.confidence ?? 0), 0) / bets.length
            : 0;
        const actualWinRate = bets.length
            ? bets.filter(bet => bet.result && bet.result.toUpperCase() === 'WIN').length / bets.length
            : 0;
        return expectedWinRate ? (actualWinRate / expectedWinRate) * 100 : 0;
    }
    calculateMarketEfficiency(bet) {
        if (!bet.metadata || typeof bet.metadata.closingOdds !== 'number')
            return 1;
        const movement = Math.abs(bet.metadata.closingOdds - (bet.odds ?? 0));
        return bet.odds ? 1 - movement / bet.odds : 1;
    }
    calculateTimingImpact(bet) {
        if (!bet.metadata || typeof bet.metadata.closingLine !== 'number')
            return 0;
        const timeToClose = (bet.metadata.closingLine - (bet.timestamp ?? 0)) / 3600000;
        return 1 - timeToClose / 24;
    }
    calculatePriceMovement(bet) {
        if (!bet.metadata || typeof bet.metadata.closingOdds !== 'number')
            return 0;
        return bet.odds ? (bet.metadata.closingOdds - bet.odds) / bet.odds : 0;
    }
    calculateKellyMultiplier(roi, winRate) {
        return roi !== 0 ? (roi * winRate - (1 - winRate)) / roi : 0;
    }
    calculateProfitByStrategy(bets) {
        return bets.reduce((acc, bet) => {
            const strategy = bet.metadata?.predictionFactors?.[0] || 'unknown';
            const profit = bet.result && bet.result.toUpperCase() === 'WIN'
                ? (bet.payout ?? 0) - (bet.stake ?? 0)
                : -(bet.stake ?? 0);
            acc[strategy] = (acc[strategy] || 0) + profit;
            return acc;
        }, {});
    }
    calculateSharpnessScore(bets) {
        const clvScore = this.calculateAverageClv(bets).clvValue;
        const winRate = bets.length
            ? bets.filter(bet => bet.result && bet.result.toUpperCase() === 'WIN')
                .length / bets.length
            : 0;
        return clvScore * 0.6 + winRate * 100 * 0.4;
    }
    calculateAverageClv(bets) {
        const betsWithClv = bets.filter(bet => bet.metadata && typeof bet.metadata.closingOdds === 'number');
        if (betsWithClv.length === 0) {
            return {
                clvValue: 0,
                edgeRetention: 0,
                marketEfficiency: 1,
            };
        }
        const clvValues = betsWithClv.map(bet => this.calculateClvValue(bet));
        const avgClv = clvValues.reduce((sum, clv) => sum + clv, 0) / clvValues.length;
        return {
            clvValue: avgClv,
            edgeRetention: this.calculateEdgeRetention(betsWithClv),
            marketEfficiency: betsWithClv.reduce((sum, bet) => sum + this.calculateMarketEfficiency(bet), 0) /
                betsWithClv.length,
        };
    }
    setupEventListeners() {
        // TODO: Refactor or re-implement event listeners to match available EventBus API
        // Commenting out broken event bus usage for now
        /*
        this.eventBus.on('market:update', async event => { ... });
        this.eventBus.on('prediction:feedback', async event => { ... });
        this.eventBus.on('strategy:result', async event => { ... });
        this.eventBus.on('monitor:alert', event => { ... });
        this.eventBus.on('metric:recorded', async data => { ... });
        this.eventBus.on('prediction:update', this.handleOpportunity.bind(this));
        */
    }
    async handleMarketUpdate(update) {
        // Commented out: this.dataEngine.handleMarketUpdate(update);
        // Commented out: this.eventBus.publish({ ... });
        // TODO: Implement with available APIs
    }
    async handlePredictionFeedback(feedback) {
        // Commented out: this.eventBus.publish({ ... });
        // TODO: Implement with available APIs
        // Commented out: unifiedState.getState();
        // Commented out: unifiedState.updateState({ ... });
    }
    async handleStrategyResult(result) {
        // Commented out: this.eventBus.publish({ ... });
        // TODO: Implement with available APIs
        // Commented out: unifiedState.getState();
        // Commented out: unifiedState.updateState({ ... });
    }
    async handleCriticalAlert(alert) {
        // Commented out: const config = this.configManager.getConfig();
        // Commented out: const state = unifiedState.getState();
        try {
            // Commented out: this.monitor.logError(...)
            // TODO: Implement error logging if/when monitor is available
            // Commented out: circuit breaker logic
            // Commented out: eventBus.publish
            // Commented out: switch(alert.type) { ... }
        }
        catch (error) {
            // Commented out: this.monitor.logError(...)
            // Commented out: config.system.emergencyMode = true;
            // Commented out: await this.configManager.updateConfig({ system: config.system });
        }
    }
    shouldActivateCircuitBreaker(alert) {
        // Commented out: configManager, unifiedState, monitor usage
        return false;
    }
    async stopActiveBettingOperations() {
        // Commented out: unifiedState.getState();
        // Commented out: cancelBet logic
        // Commented out: this.predictionEngine.stopAllPredictions();
        // Commented out: unifiedState.updateState({ ... });
    }
    async cancelBet(betId) {
        // Commented out: unifiedState.getState();
        // Commented out: bet lookup and update
        // Commented out: this.eventBus.publish({ ... });
    }
    async mitigateOddsRisk(alert) {
        // Commented out: configManager, monitor usage
    }
    async mitigateInjuryRisk(alert) {
        // Commented out: configManager, monitor usage
    }
    async mitigateWeatherRisk(alert) {
        // Commented out: configManager, monitor usage
    }
    async mitigateLineMovementRisk(alert) {
        // Commented out: configManager, monitor usage
    }
    async mitigateSystemRisk(alert) {
        // Commented out: configManager, monitor usage
    }
    registerStrategy(strategy) {
        if (this.strategies.has(strategy.id)) {
            throw new Error(`Strategy ${strategy.id} already registered`);
        }
        this.strategies.set(strategy.id, strategy);
        // Commented out: this.eventBus.emit('metric:recorded', ...)
    }
    async evaluateBet(prediction, odds, context) {
        // Commented out: unifiedState.getState();
        // Commented out: unifiedState.updateBettingState({ ... });
        // Commented out: this.eventBus.emit('metric:recorded', ...)
        // Return a dummy BettingDecision for now
        return {
            id: `decision_${Date.now()}`,
            odds,
            shouldBet: false,
            stake: 0,
            confidence: 0,
            type: 'single',
            metadata: {
                strategy: 'none',
                factors: ['no_positive_decisions'],
                riskScore: 0,
            },
        };
    }
    async settleBet(betId, result) {
        // Commented out: unifiedState.getState();
        // Commented out: unifiedState.updateBettingState({ ... });
        // Commented out: this.eventBus.emit('betting:result', ...)
    }
    createBettingContext(odds, context) {
        // Commented out: unifiedState.getState();
        const defaultContext = {
            bankroll: 10000,
            maxRiskPerBet: 0.02,
            minOdds: 1.5,
            maxOdds: 10,
            odds,
            metrics: {
                totalBets: 0,
                winRate: 0,
                roi: 0,
                profitLoss: 0,
                clvAverage: 0,
                edgeRetention: 0,
                kellyMultiplier: 1,
                marketEfficiencyScore: 0,
                averageOdds: 0,
                maxDrawdown: 0,
                sharpeRatio: 0,
                betterThanExpected: 0,
                timestamp: Date.now(),
                cpu: { usage: 0, cores: 0, temperature: 0 },
                memory: { total: 0, used: 0, free: 0, swap: 0 },
                network: { bytesIn: 0, bytesOut: 0, connections: 0, latency: 0 },
            },
            recentBets: [],
            timestamp: Date.now(),
        };
        return { ...defaultContext, ...context };
    }
    validateSystemConstraints(state, context) {
        // Check number of active bets
        if (state.betting.activeBets.size >= this.MAX_ACTIVE_BETS) {
            return false;
        }
        // Check odds range
        if (context.odds < context.minOdds || context.odds > context.maxOdds) {
            return false;
        }
        // Check system status
        if (state.status !== 'ready') {
            return false;
        }
        return true;
    }
    getApplicableStrategies(prediction, context) {
        return Array.from(this.strategies.values()).filter(strategy => {
            // Commented out: strategy.metadata.minConfidence, riskLevel checks
            return true;
        });
    }
    aggregateDecisions(decisions, prediction) {
        const positiveBets = decisions.filter(d => d.shouldBet);
        if (positiveBets.length === 0) {
            return {
                id: `decision_${Date.now()}`,
                odds: 1,
                shouldBet: false,
                stake: 0,
                confidence: 0,
                type: 'single',
                metadata: {
                    strategy: 'none',
                    factors: ['no_positive_decisions'],
                    riskScore: 0,
                },
            };
        }
        // Calculate weighted stake and confidence
        const totalConfidence = positiveBets.reduce((sum, d) => sum + d.confidence, 0);
        const weightedStake = positiveBets.reduce((sum, d) => sum + d.stake * (d.confidence / totalConfidence), 0);
        const averageConfidence = totalConfidence / positiveBets.length;
        // Combine factors and calculate risk
        const allFactors = Array.from(new Set(positiveBets.flatMap(d => d.metadata.factors)));
        const averageRisk = positiveBets.reduce((sum, d) => sum + d.metadata.riskScore, 0) / positiveBets.length;
        return {
            id: `decision_${Date.now()}`,
            odds: 1,
            shouldBet: true,
            stake: weightedStake,
            confidence: averageConfidence,
            type: this.determineBetType(positiveBets),
            metadata: {
                strategy: positiveBets.map(d => d.metadata.strategy).join(','),
                factors: allFactors,
                riskScore: averageRisk,
            },
        };
    }
    createNoBetDecision(reason) {
        return {
            shouldBet: false,
            stake: 0,
            confidence: 0,
            type: 'single',
            metadata: {
                strategy: 'none',
                factors: [reason],
                riskScore: 0,
            },
        };
    }
    calculateRiskScore(prediction, context) {
        const weights = {
            confidence: 0.3,
            recentPerformance: 0.2,
            marketEfficiency: 0.2,
            exposure: 0.3,
        };
        const confidenceRisk = 1 - prediction.confidence;
        const recentPerformanceRisk = 1 - (context.metrics.winRate || 0);
        const marketEfficiencyRisk = 1 - (context.metrics.marketEfficiencyScore || 0);
        const exposureRisk = this.calculateExposureRisk(context);
        return (confidenceRisk * weights.confidence +
            recentPerformanceRisk * weights.recentPerformance +
            marketEfficiencyRisk * weights.marketEfficiency +
            exposureRisk * weights.exposure);
    }
    calculateExposureRisk(context) {
        const totalExposure = context.recentBets.reduce((sum, bet) => sum + bet.stake, 0);
        return Math.min(1, totalExposure / (context.bankroll * context.maxRiskPerBet));
    }
    determineBetType(decisions) {
        const types = decisions.map(d => d.type);
        return types.includes('parlay') ? 'parlay' : 'single';
    }
    calculatePayout(bet, result) {
        if (result.toLowerCase() === 'win') {
            return bet.stake * bet.odds;
        }
        if (result.toLowerCase() === 'push') {
            return bet.stake;
        }
        return 0;
    }
    updatePerformanceMetrics(payout) {
        const state = unifiedState.getState();
        const currentMetrics = state.betting.performance || {
            totalBets: 0,
            winRate: 0,
            roi: 0,
            profitLoss: 0,
            clvAverage: 0,
            edgeRetention: 0,
            kellyMultiplier: 1,
            marketEfficiencyScore: 0,
            averageOdds: 0,
            maxDrawdown: 0,
            sharpeRatio: 0,
            betterThanExpected: 0,
        };
        const totalBets = currentMetrics.totalBets + 1;
        const profitLoss = currentMetrics.profitLoss + payout;
        const roi = profitLoss / (totalBets * 100); // Assuming average stake of 100
        return {
            ...currentMetrics,
            totalBets,
            profitLoss,
            roi,
            winRate: (currentMetrics.winRate * (totalBets - 1) + (payout > 0 ? 1 : 0)) / totalBets,
        };
    }
    initializeMetrics() {
        return {
            totalBets: 0,
            winningBets: 0,
            losingBets: 0,
            totalStake: 0,
            totalPnl: 0,
            roi: 0,
            winRate: 0,
            averageStake: 0,
            averagePnl: 0,
            lastUpdate: Date.now(),
        };
    }
    initializeRiskProfile() {
        return {
            maxExposure: 1000,
            maxPositions: 10,
            stopLoss: 0.1,
            profitTarget: 0.2,
            riskPerTrade: 0.02,
            maxDrawdown: 0.15,
        };
    }
    async handleOpportunity(opportunity) {
        const traceId = this.performanceMonitor.startTrace('handle-opportunity');
        try {
            // Check if we should take this opportunity
            if (!this.shouldTakeOpportunity(opportunity)) {
                this.performanceMonitor.endTrace(traceId);
                return;
            }
            // Calculate optimal stake
            const stake = this.calculateOptimalStake(opportunity.expectedValue, opportunity.confidence);
            // Create betting position
            const position = await this.createPosition(opportunity, stake);
            // Update metrics
            this.updateMetrics(position);
            this.performanceMonitor.endTrace(traceId);
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            this.monitor.logError('betting', error);
        }
    }
    shouldTakeOpportunity(opportunity) {
        // Check confidence threshold
        if (opportunity.confidence < 0.7)
            return false;
        // Check current exposure
        const currentExposure = this.calculateCurrentExposure();
        if (currentExposure >= this.riskProfile.maxExposure)
            return false;
        // Check number of open positions
        if (this.getOpenPositions().length >= this.riskProfile.maxPositions)
            return false;
        // Check risk factors
        const riskFactors = opportunity.analysis.riskFactors;
        if (riskFactors.includes('high_volatility') || riskFactors.includes('low_liquidity')) {
            return false;
        }
        return true;
    }
    async createPosition(opportunity, stake) {
        const position = {
            id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            propId: opportunity.propId,
            type: opportunity.type,
            stake,
            entryPrice: opportunity.marketState.line,
            timestamp: Date.now(),
            status: 'open',
        };
        this.positions.set(position.id, position);
        return position;
    }
    updateMetrics(position) {
        this.metrics.totalBets++;
        this.metrics.totalStake += position.stake;
        this.metrics.averageStake = this.metrics.totalStake / this.metrics.totalBets;
        if (position.status === 'closed' && position.pnl !== undefined) {
            this.metrics.totalPnl += position.pnl;
            this.metrics.averagePnl = this.metrics.totalPnl / this.metrics.totalBets;
            this.metrics.roi = this.metrics.totalPnl / this.metrics.totalStake;
            if (position.pnl > 0) {
                this.metrics.winningBets++;
            }
            else {
                this.metrics.losingBets++;
            }
            this.metrics.winRate = this.metrics.winningBets / this.metrics.totalBets;
        }
        this.metrics.lastUpdate = Date.now();
    }
    calculateCurrentExposure() {
        return Array.from(this.positions.values())
            .filter(p => p.status === 'open')
            .reduce((sum, p) => sum + p.stake, 0);
    }
    getOpenPositions() {
        return Array.from(this.positions.values()).filter(p => p.status === 'open');
    }
    async closePosition(positionId, closePrice) {
        const position = this.positions.get(positionId);
        if (!position || position.status !== 'open') {
            throw new Error(`Cannot close position ${positionId}`);
        }
        const pnl = this.calculatePnl(position, closePrice);
        position.status = 'closed';
        position.closePrice = closePrice;
        position.closeTimestamp = Date.now();
        position.pnl = pnl;
        this.updateMetrics(position);
    }
    calculatePnl(position, closePrice) {
        const priceChange = closePrice - position.entryPrice;
        const multiplier = position.type === 'over' ? 1 : -1;
        return position.stake * priceChange * multiplier;
    }
    getMetrics() {
        return { ...this.metrics };
    }
    getRiskProfile() {
        return { ...this.riskProfile };
    }
    getPosition(positionId) {
        return this.positions.get(positionId);
    }
    getAllPositions() {
        return Array.from(this.positions.values());
    }
    async evaluatePosition(positionId, closePrice) {
        const position = this.positions.get(positionId);
        if (!position || position.status !== 'open') {
            throw new Error(`Invalid position ${positionId}`);
        }
        // Use uppercase for BetType if needed
        // Commented out: this.dataEngine.getMarketData(position.propId);
        const currentPnl = this.calculatePnl(position, closePrice);
        const pnlPercent = currentPnl / position.stake;
        // Determine risk level
        let riskLevel = 'low';
        if (pnlPercent <= -this.riskProfile.stopLoss) {
            riskLevel = 'high';
        }
        else if (pnlPercent < 0) {
            riskLevel = 'medium';
        }
        // Generate recommendation
        let recommendation = 'hold';
        if (pnlPercent <= -this.riskProfile.stopLoss || pnlPercent >= this.riskProfile.profitTarget) {
            recommendation = 'close';
        }
        return {
            currentPnl,
            riskLevel,
            recommendation,
        };
    }
    async evaluateBettingOpportunity(prediction, context) {
        try {
            const opportunity = {
                id: prediction.id,
                propId: prediction.id,
                type: 'OVER', // Use uppercase for BetType
                confidence: prediction.confidence,
                expectedValue: 0,
                timestamp: Date.now(),
                marketState: {
                    line: 0,
                    volume: 0,
                    movement: 'stable',
                },
                analysis: {
                    historicalTrends: prediction.data.historicalTrends,
                    marketSignals: prediction.data.marketSignals,
                    riskFactors: prediction.risk_factors,
                },
            };
            // Commented out: strategyEngine.evaluateOpportunity, generateRecommendation (private)
            return {
                id: `strategy-${Date.now()}`,
                opportunityId: opportunity.id,
                riskAssessment: {}, // Use any for missing fields
                recommendedStake: 0,
                entryPoints: [],
                exitPoints: [],
                hedgingRecommendations: [],
                timestamp: Date.now(),
                status: 'active',
                metadata: {
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    version: '1.0.0',
                },
            };
        }
        catch (error) {
            // Commented out: this.eventBus.emit('error', ...)
            throw error;
        }
    }
    async updateBankrollState(betType, stake, odds, result) {
        const profitLoss = this.calculateProfitLoss(stake, odds, result);
        this.bankrollState = {
            ...this.bankrollState,
            currentAmount: this.bankrollState.currentAmount + profitLoss,
            totalWagered: this.bankrollState.totalWagered + stake,
            totalWon: result.toLowerCase() === 'win'
                ? this.bankrollState.totalWon + profitLoss
                : this.bankrollState.totalWon,
            totalLost: result.toLowerCase() === 'loss'
                ? this.bankrollState.totalLost + stake
                : this.bankrollState.totalLost,
            openPositions: result.toLowerCase() === 'pending'
                ? this.bankrollState.openPositions + 1
                : this.bankrollState.openPositions,
            maxDrawdown: Math.min(this.bankrollState.maxDrawdown, profitLoss),
            lastUpdate: Date.now(),
        };
        // TODO: Add event emit if/when eventBus is available
    }
    calculateProfitLoss(stake, odds, result) {
        if (result.toLowerCase() === 'win') {
            return stake * (odds - 1);
        }
        else if (result.toLowerCase() === 'loss') {
            return -stake;
        }
        return 0;
    }
}
export function toRiskTolerance(level) {
    switch (level) {
        case 'LOW':
            return 'low';
        case 'MEDIUM':
            return 'medium';
        case 'HIGH':
            return 'high';
        default:
            return level;
    }
}
