import { UnifiedBettingSystem } from '../core/UnifiedBettingSystem';
import { useState, useEffect, useCallback } from 'react';
export function useUnifiedBetting({ playerId, metric, autoRefresh = true, refreshInterval = 30000, onNewOpportunity } = {}) {
    const [decision, setDecision] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const bettingSystem = UnifiedBettingSystem.getInstance();
    const analyze = useCallback(async () => {
        if (!playerId || !metric)
            return;
        setIsAnalyzing(true);
        setError(null);
        try {
            const context = {
                playerId,
                metric,
                timestamp: Date.now(),
                marketState: 'active',
                correlationFactors: []
            };
            const newDecision = await bettingSystem.analyzeBettingOpportunity(context);
            setDecision(newDecision);
            if (onNewOpportunity && newDecision.confidence > 0.8) {
                onNewOpportunity(newDecision);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Analysis failed'));
        }
        finally {
            setIsAnalyzing(false);
        }
    }, [playerId, metric, bettingSystem, onNewOpportunity]);
    useEffect(() => {
        analyze();
        if (autoRefresh && playerId && metric) {
            const interval = setInterval(analyze, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [analyze, autoRefresh, playerId, metric, refreshInterval]);
    return {
        decision,
        isAnalyzing,
        error,
        analyze
    };
}
