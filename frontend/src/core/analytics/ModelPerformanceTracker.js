export class ModelPerformanceTracker {
    constructor(logger, metrics, maxHistoryLength = 100) {
        this.logger = logger;
        this.metrics = metrics;
        this.maxHistoryLength = maxHistoryLength;
        this.performanceHistory = new Map();
        this.currentMetrics = new Map();
        this.calibrationData = new Map();
    }
    trackPrediction(modelName, prediction, recommendation) {
        const current = this.getOrCreateMetrics(modelName);
        current.totalPredictions++;
        current.totalStake += recommendation.stake;
        current.averageConfidence = this.updateAverage(current.averageConfidence, prediction.confidence, current.totalPredictions);
        // Update calibration data
        this.updateCalibrationData(modelName, prediction.confidence);
        this.currentMetrics.set(modelName, current);
        this.trackMetrics(modelName, current);
    }
    recordOutcome(modelName, stake, payout, odds) {
        const current = this.getOrCreateMetrics(modelName);
        const profit = payout - stake;
        current.totalPayout += payout;
        current.correctPredictions += profit > 0 ? 1 : 0;
        current.roi = (current.totalPayout - current.totalStake) / current.totalStake;
        current.winRate = current.correctPredictions / current.totalPredictions;
        current.averageOdds = this.updateAverage(current.averageOdds, odds, current.totalPredictions);
        // Calculate advanced metrics
        current.profitFactor = this.calculateProfitFactor(current);
        current.sharpeRatio = this.calculateSharpeRatio(modelName);
        current.maxDrawdown = this.calculateMaxDrawdown(modelName);
        current.kellyCriterion = this.calculateKellyCriterion(current);
        current.expectedValue = this.calculateExpectedValue(current, odds);
        current.calibrationScore = this.calculateCalibrationScore(modelName);
        current.lastUpdated = new Date();
        // Update history
        this.updateHistory(modelName, current);
        this.currentMetrics.set(modelName, current);
        this.trackMetrics(modelName, current);
    }
    getModelPerformance(modelName) {
        return this.currentMetrics.get(modelName);
    }
    getPerformanceHistory(modelName, timeframe = 'all') {
        const history = this.performanceHistory.get(modelName) || [];
        const now = new Date();
        const cutoff = this.getCutoffDate(timeframe);
        return history.filter(snapshot => snapshot.timestamp >= cutoff);
    }
    getTopPerformingModels(metric = 'roi', limit = 5) {
        return Array.from(this.currentMetrics.entries())
            .map(([modelName, metrics]) => ({ modelName, metrics }))
            .sort((a, b) => {
            const aValue = a.metrics[metric];
            const bValue = b.metrics[metric];
            return bValue - aValue;
        })
            .slice(0, limit);
    }
    getOrCreateMetrics(modelName) {
        return (this.currentMetrics.get(modelName) || {
            totalPredictions: 0,
            correctPredictions: 0,
            totalStake: 0,
            totalPayout: 0,
            roi: 0,
            winRate: 0,
            averageConfidence: 0,
            averageOdds: 0,
            profitFactor: 0,
            sharpeRatio: 0,
            maxDrawdown: 0,
            kellyCriterion: 0,
            expectedValue: 0,
            calibrationScore: 0,
            lastUpdated: new Date(),
        });
    }
    updateAverage(currentAverage, newValue, totalCount) {
        return (currentAverage * (totalCount - 1) + newValue) / totalCount;
    }
    calculateProfitFactor(metrics) {
        const grossProfit = metrics.totalPayout - metrics.totalStake;
        const grossLoss = metrics.totalStake;
        return grossLoss === 0 ? 0 : Number(grossProfit) / Number(grossLoss);
    }
    calculateSharpeRatio(modelName) {
        const history = this.performanceHistory.get(modelName) || [];
        if (history.length < 2)
            return 0;
        const returns = history.map((snapshot, i) => {
            if (i === 0)
                return 0;
            const prevRoi = history[i - 1].metrics.roi;
            return snapshot.metrics.roi - prevRoi;
        });
        const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const stdDev = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length);
        return stdDev === 0 ? 0 : avgReturn / stdDev;
    }
    calculateMaxDrawdown(modelName) {
        const history = this.performanceHistory.get(modelName) || [];
        if (history.length < 2)
            return 0;
        let maxDrawdown = 0;
        let peak = history[0].metrics.roi;
        for (const snapshot of history) {
            const roi = snapshot.metrics.roi;
            if (roi > peak) {
                peak = roi;
            }
            const drawdown = (peak - roi) / peak;
            maxDrawdown = Math.max(maxDrawdown, drawdown);
        }
        return maxDrawdown;
    }
    calculateKellyCriterion(metrics) {
        const winProb = metrics.winRate;
        const lossProb = 1 - winProb;
        const winAmount = metrics.averageOdds - 1;
        const lossAmount = 1;
        const kelly = (winProb * winAmount - lossProb * lossAmount) / winAmount;
        return Math.max(0, Math.min(kelly, 0.5)); // Cap at 50% of bankroll
    }
    calculateExpectedValue(metrics, odds) {
        const winProb = metrics.winRate;
        const stake = metrics.totalStake / metrics.totalPredictions;
        const winAmount = stake * (odds - 1);
        const lossAmount = stake;
        return winProb * winAmount - (1 - winProb) * lossAmount;
    }
    updateCalibrationData(modelName, predictedConfidence) {
        const data = this.calibrationData.get(modelName) || { predicted: [], actual: [] };
        data.predicted.push(predictedConfidence);
        this.calibrationData.set(modelName, data);
    }
    calculateCalibrationScore(modelName) {
        const data = this.calibrationData.get(modelName);
        if (!data || data.predicted.length < 10)
            return 0;
        // Group predictions into bins
        const bins = 10;
        const binSize = 1 / bins;
        const binCounts = new Array(bins).fill(0);
        const binCorrect = new Array(bins).fill(0);
        data.predicted.forEach((pred, i) => {
            const bin = Math.min(Math.floor(pred / binSize), bins - 1);
            binCounts[bin]++;
            if (data.actual[i])
                binCorrect[bin]++;
        });
        // Calculate calibration error
        let calibrationError = 0;
        for (let i = 0; i < bins; i++) {
            if (binCounts[i] > 0) {
                const expectedProb = (i + 0.5) * binSize;
                const actualProb = binCorrect[i] / binCounts[i];
                calibrationError += Math.pow(expectedProb - actualProb, 2);
            }
        }
        return 1 - Math.sqrt(calibrationError / bins);
    }
    updateHistory(modelName, metrics) {
        const history = this.performanceHistory.get(modelName) || [];
        history.push({
            timestamp: new Date(),
            metrics: { ...metrics },
        });
        // Maintain history length limit
        if (history.length > this.maxHistoryLength) {
            history.shift();
        }
        this.performanceHistory.set(modelName, history);
    }
    getCutoffDate(timeframe) {
        const now = new Date();
        switch (timeframe) {
            case 'day':
                return new Date(now.setDate(now.getDate() - 1));
            case 'week':
                return new Date(now.setDate(now.getDate() - 7));
            case 'month':
                return new Date(now.setMonth(now.getMonth() - 1));
            default:
                return new Date(0);
        }
    }
    trackMetrics(modelName, metrics) {
        this.metrics.gauge(`model.${modelName}.roi`, metrics.roi);
        this.metrics.gauge(`model.${modelName}.win_rate`, metrics.winRate);
        this.metrics.gauge(`model.${modelName}.profit_factor`, metrics.profitFactor);
        this.metrics.gauge(`model.${modelName}.sharpe_ratio`, metrics.sharpeRatio);
        this.metrics.gauge(`model.${modelName}.max_drawdown`, metrics.maxDrawdown);
        this.metrics.gauge(`model.${modelName}.kelly_criterion`, metrics.kellyCriterion);
        this.metrics.gauge(`model.${modelName}.expected_value`, metrics.expectedValue);
        this.metrics.gauge(`model.${modelName}.calibration_score`, metrics.calibrationScore);
        this.metrics.gauge(`model.${modelName}.average_confidence`, metrics.averageConfidence);
        this.metrics.gauge(`model.${modelName}.average_odds`, metrics.averageOdds);
    }
}
