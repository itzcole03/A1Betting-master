import { BettingDecision } from '../core/UnifiedBettingSystem';
interface UseUnifiedBettingOptions {
    playerId?: string;
    metric?: string;
    autoRefresh?: boolean;
    refreshInterval?: number;
    onNewOpportunity?: (decision: BettingDecision) => void;
}
export declare function useUnifiedBetting({ playerId, metric, autoRefresh, refreshInterval, onNewOpportunity }?: UseUnifiedBettingOptions): {
    decision: any;
    isAnalyzing: boolean;
    error: Error | null;
    analyze: () => Promise<void>;
};
export {};
