import { Opportunity } from '../types/core';
import { BettingDecision, PerformanceMetrics } from '@/types';
interface UseBettingCoreOptions {
    playerId?: string;
    metric?: string;
    minConfidence?: number;
    autoRefresh?: boolean;
    refreshInterval?: number;
    onNewDecision?: (decision: BettingDecision) => void;
    onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
}
export declare function useBettingCore({ playerId, metric, minConfidence, autoRefresh, refreshInterval, onNewDecision, onPerformanceUpdate }?: UseBettingCoreOptions): {
    analyze: () => Promise<void>;
    updatePerformanceMetrics: () => void;
    handleNewOpportunity: (opportunity: Opportunity) => void;
    decision: BettingDecision | null;
    performance: PerformanceMetrics;
    opportunities: Opportunity[];
    isAnalyzing: boolean;
    error: Error | null;
};
export {};
