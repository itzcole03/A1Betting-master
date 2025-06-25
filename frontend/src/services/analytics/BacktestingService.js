import { dataIntegrationService } from '../data/dataIntegrationService';
import * as tf from '@tensorflow/tfjs';
import dayjs from 'dayjs';
export class BacktestingService {
    constructor(playerPropService, modelTraining, featureEngineering) {
        this.playerPropService = playerPropService;
        this.modelTraining = modelTraining;
        this.featureEngineering = featureEngineering;
    }
    async runBacktest(config) {
        try {
            // Load historical data
            const historicalData = await this.loadHistoricalData(config);
            // Initialize tracking variables
            let bankroll = config.initialBankroll;
            let maxBankroll = bankroll;
            let currentDrawdown = 0;
            let maxDrawdown = 0;
            const dailyPnL = {};
            const bets = [];
            // Run simulation
            for (const date of this.getDateRange(config.startDate, config.endDate)) {
                const dayData = historicalData[date];
                if (!dayData)
                    continue;
                // Get available props for the day
                const availableProps = await this.getAvailableProps(dayData);
                // Analyze props and generate predictions
                const propAnalyses = await Promise.all(availableProps.map(prop => this.analyzeProp(prop, config.modelIds)));
                // Filter qualified props
                const qualifiedProps = propAnalyses.filter(analysis => this.qualifiesProp(analysis, config));
                // Optimize lineup if needed
                const selectedProps = config.targetLegs > 1
                    ? await this.optimizeLineup(qualifiedProps, config)
                    : qualifiedProps;
                // Place simulated bets
                for (const prop of selectedProps) {
                    const bet = await this.simulateBet(prop, bankroll, config);
                    bets.push(bet);
                    // Update bankroll and metrics
                    bankroll += bet.result.pnl;
                    maxBankroll = Math.max(maxBankroll, bankroll);
                    currentDrawdown = (maxBankroll - bankroll) / maxBankroll;
                    maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
                    // Update daily P&L
                    const day = dayjs(bet.timestamp).format('YYYY-MM-DD');
                    dailyPnL[day] = (dailyPnL[day] || 0) + bet.result.pnl;
                }
                // Check stop loss and drawdown limits
                if (this.shouldStopTrading(bankroll, maxDrawdown, config)) {
                    break;
                }
            }
            // Calculate final metrics
            return this.calculateBacktestResults(bets, config, {
                finalBankroll: bankroll,
                maxDrawdown,
                dailyPnL,
            });
        }
        catch (error) {
            console.error('Backtest failed:', error);
            throw error;
        }
    }
    async loadHistoricalData(config) {
        // Load historical data from data integration service
        const data = await dataIntegrationService.fetchHistoricalData({
            startDate: config.startDate,
            endDate: config.endDate,
            propTypes: config.propTypes,
        });
        return this.organizeDataByDate(data);
    }
    organizeDataByDate(data) {
        // Organize raw data by date for efficient access
        const organized = {};
        for (const item of data) {
            const date = dayjs(item.timestamp).format('YYYY-MM-DD');
            organized[date] = organized[date] || [];
            organized[date].push(item);
        }
        return organized;
    }
    getDateRange(startDate, endDate) {
        const dates = [];
        let currentDate = dayjs(startDate);
        const end = dayjs(endDate);
        while (currentDate.isBefore(end) || currentDate.isSame(end)) {
            dates.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'day');
        }
        return dates;
    }
    async getAvailableProps(dayData) {
        // Extract available props from day's data
        return dayData.flatMap(item => item.marketData.map(market => ({
            id: market.propId,
            playerId: market.playerId,
            playerName: market.playerName || '',
            propType: market.propType,
            line: market.line,
            odds: market.odds,
            gameId: market.gameId || '',
            gameDate: item.date,
            metadata: market.metadata,
        })));
    }
    async analyzeProp(prop, modelIds) {
        // Get predictions from each model
        const predictions = await Promise.all(modelIds.map(async (modelId) => {
            const model = await this.modelTraining.loadModel(modelId);
            if (!model)
                throw new Error(`Model ${modelId} not found`);
            const features = await this.featureEngineering.engineerFeatures(prop.playerName, prop.propType, {
            /* raw data */
            });
            const prediction = await this.predict(model, features);
            return {
                modelId,
                prediction: prediction.value,
                confidence: prediction.confidence,
                features: features.numerical.reduce((acc, val, idx) => {
                    acc[`feature_${idx}`] = val;
                    return acc;
                }, {}),
                metadata: {},
            };
        }));
        // Combine predictions using ensemble weights
        return this.combineModelPredictions(predictions, prop);
    }
    async predict(model, features) {
        // Make prediction using model
        if (model.model instanceof tf.LayersModel) {
            const tensor = tf.tensor2d([features.numerical]);
            const prediction = model.model.predict(tensor);
            const value = (await prediction.data())[0];
            prediction.dispose();
            tensor.dispose();
            return { value, confidence: 0.8 }; // Default confidence
        }
        const prediction = model.model.predict([features.numerical])[0];
        return { value: prediction, confidence: 0.8 }; // Default confidence
    }
    combineModelPredictions(predictions, prop) {
        // Combine predictions using weighted ensemble
        const totalWeight = predictions.reduce((sum, p) => sum + p.confidence, 0);
        const weightedPrediction = predictions.reduce((sum, p) => {
            return sum + p.prediction * p.confidence;
        }, 0) / totalWeight;
        const combinedConfidence = Math.min(...predictions.map(p => p.confidence));
        const edge = this.calculateEdge(weightedPrediction, prop);
        return {
            prop,
            predictions,
            combinedPrediction: weightedPrediction,
            combinedConfidence,
            edge,
            riskScore: this.calculateRiskScore(prop),
            qualifies: false, // Will be set later
            metadata: {},
        };
    }
    calculateEdge(predictedValue, prop) {
        const impliedProbability = 1 / prop.odds; // Simplified
        return Math.abs(predictedValue - impliedProbability);
    }
    qualifiesProp(analysis, config) {
        return (analysis.combinedConfidence >= config.minConfidence &&
            analysis.edge >= config.minValue &&
            analysis.riskScore <= config.maxRisk);
    }
    calculateRiskScore(_analysis) {
        // Calculate risk score based on various factors
        return Math.random(); // Placeholder implementation
    }
    async optimizeLineup(props, config) {
        // Use player prop service to optimize lineup
        const optimization = await this.playerPropService.optimizeLineup(props.map(p => p.prop), config.targetLegs);
        return optimization.legs;
    }
    async simulateBet(prop, bankroll, config) {
        const stake = this.calculateStakeSize(prop, bankroll, config);
        const side = prop.combinedPrediction > prop.prop.line ? 'over' : 'under';
        const odds = prop.prop.odds;
        const actualValue = await this.getActualValue(prop.prop);
        const won = (side === 'over' && actualValue > prop.prop.line) ||
            (side === 'under' && actualValue < prop.prop.line);
        return {
            timestamp: prop.prop.gameDate,
            prop: prop.prop,
            prediction: {
                value: prop.combinedPrediction,
                confidence: prop.combinedConfidence,
                edge: prop.edge,
            },
            decision: {
                side,
                stake,
                odds,
            },
            result: {
                actualValue,
                won,
                pnl: won ? stake * (odds - 1) : -stake,
            },
        };
    }
    calculateStakeSize(prop, bankroll, config) {
        if (config.stakeSize === 'kelly') {
            return this.calculateKellyStake(prop, bankroll, config);
        }
        return typeof config.stakeSize === 'number'
            ? Math.min(config.stakeSize, bankroll * config.riskManagement.maxPositionSize)
            : 0;
    }
    calculateKellyStake(prop, bankroll, config) {
        const edge = prop.edge;
        const odds = prop.prop.odds;
        const probability = prop.combinedPrediction;
        const kellyFraction = (edge * probability) / (odds - 1);
        const adjustedKelly = kellyFraction * 0.5; // Half Kelly for safety
        return Math.min(bankroll * adjustedKelly, bankroll * config.riskManagement.maxPositionSize);
    }
    async getActualValue(prop) {
        // In real backtest, this would fetch the actual result
        // This is a placeholder implementation
        return prop.line + (Math.random() - 0.5) * 5;
    }
    shouldStopTrading(bankroll, drawdown, config) {
        return (bankroll <= config.initialBankroll * (1 - config.riskManagement.stopLoss) ||
            drawdown >= config.riskManagement.maxDrawdown);
    }
    calculateBacktestResults(bets, config, metrics) {
        const winningBets = bets.filter(bet => bet.result.won);
        const dailyReturns = Object.values(metrics.dailyPnL).map(pnl => pnl / config.initialBankroll);
        return {
            summary: {
                totalBets: bets.length,
                winningBets: winningBets.length,
                losingBets: bets.length - winningBets.length,
                winRate: winningBets.length / bets.length,
                roi: (metrics.finalBankroll - config.initialBankroll) / config.initialBankroll,
                profitLoss: metrics.finalBankroll - config.initialBankroll,
                maxDrawdown: metrics.maxDrawdown,
                sharpeRatio: this.calculateSharpeRatio(dailyReturns),
                kellyFraction: this.calculateOptimalKellyFraction(bets),
            },
            modelPerformance: this.calculateModelPerformance(bets),
            propTypePerformance: this.calculatePropTypePerformance(bets),
            timeSeriesMetrics: this.calculateTimeSeriesMetrics(bets, config),
            riskMetrics: this.calculateRiskMetrics(dailyReturns),
        };
    }
    calculateSharpeRatio(returns) {
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);
        const riskFreeRate = 0.02 / 252; // Assuming 2% annual risk-free rate
        return ((mean - riskFreeRate) / stdDev) * Math.sqrt(252); // Annualized
    }
    calculateOptimalKellyFraction(bets) {
        const winRate = bets.filter(bet => bet.result.won).length / bets.length;
        const avgWin = bets.filter(bet => bet.result.won).reduce((sum, bet) => sum + bet.result.pnl, 0) /
            bets.filter(bet => bet.result.won).length;
        const avgLoss = Math.abs(bets.filter(bet => !bet.result.won).reduce((sum, bet) => sum + bet.result.pnl, 0) /
            bets.filter(bet => !bet.result.won).length);
        return winRate / avgLoss - (1 - winRate) / avgWin;
    }
    calculateModelPerformance(_bets) {
        // Calculate performance metrics for each model
        // This is a placeholder implementation
        return {};
    }
    calculatePropTypePerformance(_bets) {
        // Calculate performance metrics for each prop type
        // This is a placeholder implementation
        return {};
    }
    calculateTimeSeriesMetrics(_bets, _config) {
        // Calculate time series metrics
        // This is a placeholder implementation
        return [];
    }
    calculateRiskMetrics(returns) {
        // Calculate risk metrics
        return {
            valueAtRisk: this.calculateVaR(returns, 0.95),
            expectedShortfall: this.calculateExpectedShortfall(returns, 0.95),
            betaSharpe: this.calculateBetaSharpe(returns),
            informationRatio: this.calculateInformationRatio(returns),
        };
    }
    calculateVaR(returns, confidence) {
        const sortedReturns = [...returns].sort((a, b) => a - b);
        const index = Math.floor(returns.length * (1 - confidence));
        return -sortedReturns[index];
    }
    calculateExpectedShortfall(returns, confidence) {
        const var95 = this.calculateVaR(returns, confidence);
        const tailReturns = returns.filter(r => r < -var95);
        return -(tailReturns.reduce((a, b) => a + b, 0) / tailReturns.length);
    }
    calculateBetaSharpe(_returns) {
        // Calculate beta-adjusted Sharpe ratio
        // This is a placeholder implementation
        return 0;
    }
    calculateInformationRatio(_returns) {
        // Calculate information ratio
        // This is a placeholder implementation
        return 0;
    }
}
export const backtestingService = new BacktestingService(playerPropService, modelTrainingService, featureEngineeringService);
