import { useStore } from '@/stores/useStore';
import { dailyFantasyService } from '../services/dailyFantasy';
import { oddsjamService } from '../services/oddsjam';
import { useState, useEffect, useCallback } from 'react';
import { webSocketManager } from '../services/unified/WebSocketManager';
export const useProps = ({ autoRefresh = true, refreshInterval = 30000, sport, propType } = {}) => {
    const [props, setProps] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToast } = useStore();
    const fetchProps = useCallback(async () => {
        try {
            const [propsData, arbitrageData] = await Promise.all([
                dailyFantasyService.getPlayers({ sport, position: propType }),
                oddsjamService.getArbitrageOpportunities(sport || 'NBA')
            ]);
            setProps(propsData);
            setOpportunities(arbitrageData.map((item) => ({
                ...item,
                propId: item.id,
                analysis: {
                    historicalTrends: [],
                    marketSignals: [],
                    riskFactors: []
                }
            })));
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch props'));
            addToast({
                id: 'props-error',
                type: 'error',
                title: 'Error',
                message: 'Failed to fetch props data'
            });
        }
        finally {
            setIsLoading(false);
        }
    }, [sport, propType, addToast]);
    useEffect(() => {
        fetchProps();
        if (autoRefresh) {
            const interval = setInterval(fetchProps, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchProps, autoRefresh, refreshInterval]);
    useEffect(() => {
        function handlePropUpdate(data) {
            setProps(prev => {
                const index = prev.findIndex(p => p.id === data.id);
                if (index === -1)
                    return [...prev, data];
                const updated = [...prev];
                updated[index] = data;
                return updated;
            });
        }
        function handleArbitrageAlert(data) {
            setOpportunities(prev => [...prev, data]);
            addToast({
                id: data.id,
                type: 'info',
                title: 'New Arbitrage Opportunity',
                message: `${data.potentialProfit ?? ''}% profit available on ${data.player?.name ?? ''}`
            });
        }
        webSocketManager.on('prop_update', handlePropUpdate);
        webSocketManager.on('arbitrage_alert', handleArbitrageAlert);
        return () => {
            webSocketManager.off('prop_update', handlePropUpdate);
            webSocketManager.off('arbitrage_alert', handleArbitrageAlert);
        };
    }, [addToast]);
    const refreshProps = () => {
        setIsLoading(true);
        fetchProps();
    };
    return {
        props,
        opportunities,
        isLoading,
        error,
        refreshProps
    };
};
