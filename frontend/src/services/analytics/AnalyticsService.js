export class AnalyticsService {
    constructor(logger, metrics, notificationService) {
        this.logger = logger;
        this.metrics = metrics;
        this.notificationService = notificationService;
        this.performanceHistory = [];
        this.riskHistory = [];
        this.updateInterval = null;
        this.config = {
            updateInterval: 60000, // 1 minute
            maxHistoryLength: 1000,
            performanceThresholds: {
                minAccuracy: 0.55,
                minProfitFactor: 1.5,
                maxDrawdown: 0.2,
            },
        };
        this.startPeriodicUpdates();
    }
    trackPerformance(metrics) {
        try {
            this.validatePerformanceMetrics(metrics);
            this.performanceHistory.push(metrics);
            this.trimHistory();
            // Track metrics
            this.metrics.gauge('analytics.accuracy', metrics.accuracy);
            this.metrics.gauge('analytics.profit_loss', metrics.profitLoss);
            this.metrics.gauge('analytics.precision', metrics.precision);
            this.metrics.gauge('analytics.recall', metrics.recall);
            // Check thresholds
            this.checkPerformanceThresholds(metrics);
        }
        catch (error) {
            this.logger.error('Failed to track performance metrics', { error, metrics });
        }
    }
    trackRisk(metrics) {
        try {
            this.validateRiskMetrics(metrics);
            this.riskHistory.push(metrics);
            this.trimHistory();
            // Track metrics
            this.metrics.gauge('analytics.sharpe_ratio', metrics.sharpeRatio);
            this.metrics.gauge('analytics.max_drawdown', metrics.maxDrawdown);
            this.metrics.gauge('analytics.win_rate', metrics.winRate);
            this.metrics.gauge('analytics.profit_factor', metrics.profitFactor);
            this.metrics.gauge('analytics.kelly_criterion', metrics.kellyCriterion);
            this.metrics.gauge('analytics.expected_value', metrics.expectedValue);
            // Check thresholds
            this.checkRiskThresholds(metrics);
        }
        catch (error) {
            this.logger.error('Failed to track risk metrics', { error, metrics });
        }
    }
    getPerformanceMetrics() {
        return [...this.performanceHistory];
    }
    getRiskMetrics() {
        return [...this.riskHistory];
    }
    calculatePerformanceScore() {
        if (this.performanceHistory.length === 0) {
            return 0;
        }
        const recentMetrics = this.performanceHistory.slice(-10);
        const weights = {
            accuracy: 0.4,
            profitLoss: 0.3,
            precision: 0.15,
            recall: 0.15,
        };
        const score = recentMetrics.reduce((acc, metric) => {
            return (acc +
                metric.accuracy * weights.accuracy +
                this.normalizeProfitLoss(metric.profitLoss) * weights.profitLoss +
                metric.precision * weights.precision +
                metric.recall * weights.recall);
        }, 0);
        return Math.min(100, Math.max(0, score / recentMetrics.length));
    }
    calculateRiskScore() {
        if (this.riskHistory.length === 0) {
            return 0;
        }
        const recentMetrics = this.riskHistory.slice(-10);
        const weights = {
            sharpeRatio: 0.3,
            maxDrawdown: 0.2,
            winRate: 0.2,
            profitFactor: 0.15,
            kellyCriterion: 0.15,
        };
        const score = recentMetrics.reduce((acc, metric) => {
            return (acc +
                this.normalizeSharpeRatio(metric.sharpeRatio) * weights.sharpeRatio +
                this.normalizeDrawdown(metric.maxDrawdown) * weights.maxDrawdown +
                metric.winRate * weights.winRate +
                this.normalizeProfitFactor(metric.profitFactor) * weights.profitFactor +
                this.normalizeKellyCriterion(metric.kellyCriterion) * weights.kellyCriterion);
        }, 0);
        return Math.min(100, Math.max(0, score / recentMetrics.length));
    }
    validatePerformanceMetrics(metrics) {
        if (metrics.accuracy < 0 || metrics.accuracy > 1) {
            throw new Error('Invalid accuracy value');
        }
        if (metrics.precision < 0 || metrics.precision > 1) {
            throw new Error('Invalid precision value');
        }
        if (metrics.recall < 0 || metrics.recall > 1) {
            throw new Error('Invalid recall value');
        }
    }
    validateRiskMetrics(metrics) {
        if (metrics.winRate < 0 || metrics.winRate > 1) {
            throw new Error('Invalid win rate value');
        }
        if (metrics.maxDrawdown < 0 || metrics.maxDrawdown > 1) {
            throw new Error('Invalid max drawdown value');
        }
        if (metrics.profitFactor < 0) {
            throw new Error('Invalid profit factor value');
        }
    }
    checkPerformanceThresholds(metrics) {
        if (metrics.accuracy < this.config.performanceThresholds.minAccuracy) {
            this.notificationService.notify('warning', 'Low Accuracy Alert');
        }
    }
    checkRiskThresholds(metrics) {
        if (metrics.profitFactor < this.config.performanceThresholds.minProfitFactor) {
            this.notificationService.notify('warning', 'Low Profit Factor Alert');
        }
        if (metrics.maxDrawdown > this.config.performanceThresholds.maxDrawdown) {
            this.notificationService.notify('warning', 'High Drawdown Alert');
        }
    }
    normalizeProfitLoss(value) {
        return Math.min(1, Math.max(0, (value + 1) / 2));
    }
    normalizeSharpeRatio(value) {
        return Math.min(1, Math.max(0, (value + 2) / 4));
    }
    normalizeDrawdown(value) {
        return 1 - value;
    }
    normalizeProfitFactor(value) {
        return Math.min(1, value / 3);
    }
    normalizeKellyCriterion(value) {
        return Math.min(1, Math.max(0, (value + 0.5) / 1));
    }
    trimHistory() {
        if (this.performanceHistory.length > this.config.maxHistoryLength) {
            this.performanceHistory = this.performanceHistory.slice(-this.config.maxHistoryLength);
        }
        if (this.riskHistory.length > this.config.maxHistoryLength) {
            this.riskHistory = this.riskHistory.slice(-this.config.maxHistoryLength);
        }
    }
    startPeriodicUpdates() {
        this.updateInterval = setInterval(() => {
            const performanceScore = this.calculatePerformanceScore();
            const riskScore = this.calculateRiskScore();
            this.metrics.gauge('analytics.performance_score', performanceScore);
            this.metrics.gauge('analytics.risk_score', riskScore);
        }, this.config.updateInterval);
    }
    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}
