import { EventEmitter } from 'events';
interface PerformanceMetrics {
    totalBets: number;
    winningBets: number;
    losingBets: number;
    pushBets: number;
    totalProfit: number;
    roi: number;
    averageOdds: number;
    averageConfidence: number;
    averageStake: number;
    bestBet: {
        profit: number;
        odds: number;
        confidence: number;
        timestamp: number;
    };
    worstBet: {
        loss: number;
        odds: number;
        confidence: number;
        timestamp: number;
    };
    byBetType: Record<string, {
        count: number;
        profit: number;
        roi: number;
    }>;
    byMarket: Record<string, {
        count: number;
        profit: number;
        roi: number;
    }>;
    byTimeframe: Record<string, {
        count: number;
        profit: number;
        roi: number;
    }>;
}
interface ModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: {
        truePositives: number;
        falsePositives: number;
        trueNegatives: number;
        falseNegatives: number;
    };
    calibration: {
        expected: number[];
        actual: number[];
    };
    featureImportance: Record<string, number>;
    byConfidence: Record<string, {
        count: number;
        accuracy: number;
        profit: number;
    }>;
}
interface SystemMetrics {
    uptime: number;
    responseTime: {
        average: number;
        p95: number;
        p99: number;
    };
    errorRate: number;
    operationCounts: Record<string, number>;
    resourceUsage: {
        cpu: number;
        memory: number;
        network: {
            bytesIn: number;
            bytesOut: number;
        };
    };
}
export declare class MetricsService extends EventEmitter {
    private static instance;
    private performanceMetrics;
    private modelMetrics;
    private systemMetrics;
    private startTime;
    private constructor();
    static getInstance(): MetricsService;
    private initializeMetrics;
    trackBet(result: 'WIN' | 'LOSS' | 'PUSH', profit: number): void;
    trackPrediction(predictedValue: number, actualValue: number, confidence: number, features: Record<string, number>): void;
    trackOperation(operation: string, duration: number, success: boolean): void;
    getPerformanceMetrics(): PerformanceMetrics;
    getModelMetrics(): ModelMetrics;
    getSystemMetrics(): SystemMetrics;
    resetMetrics(): void;
}
export {};
