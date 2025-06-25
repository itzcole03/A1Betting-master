import { UnifiedLogger } from '../../core/logging/types';
import { UnifiedMetrics } from '../../core/metrics/types';
import { UnifiedNotificationService } from '../unified/UnifiedNotificationService';
interface PerformanceMetrics {
    accuracy: number;
    profitLoss: number;
    precision: number;
    recall: number;
    timestamp: string;
}
interface RiskMetrics {
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    kellyCriterion: number;
    expectedValue: number;
    timestamp: string;
}
export declare class AnalyticsService {
    private logger;
    private metrics;
    private notificationService;
    private performanceHistory;
    private riskHistory;
    private updateInterval;
    private readonly config;
    constructor(logger: UnifiedLogger, metrics: UnifiedMetrics, notificationService: UnifiedNotificationService);
    trackPerformance(metrics: PerformanceMetrics): void;
    trackRisk(metrics: RiskMetrics): void;
    getPerformanceMetrics(): PerformanceMetrics[];
    getRiskMetrics(): RiskMetrics[];
    calculatePerformanceScore(): number;
    calculateRiskScore(): number;
    private validatePerformanceMetrics;
    private validateRiskMetrics;
    private checkPerformanceThresholds;
    private checkRiskThresholds;
    private normalizeProfitLoss;
    private normalizeSharpeRatio;
    private normalizeDrawdown;
    private normalizeProfitFactor;
    private normalizeKellyCriterion;
    private trimHistory;
    private startPeriodicUpdates;
    cleanup(): void;
}
export {};
