import { useCallback } from 'react';
import { useBettingStore } from '../stores/bettingStore';
export const useBettingSettings = () => {
    const { settings, isLoading, error, fetchSettings, updateSettings, setError } = useBettingStore();
    const handleRiskProfileChange = useCallback((profile) => {
        updateSettings({ riskProfile: profile });
    }, [updateSettings]);
    const handleStakeChange = useCallback((stake) => {
        updateSettings({ stakeSize: stake });
    }, [updateSettings]);
    const handleModelChange = useCallback((modelId) => {
        updateSettings({ modelId });
    }, [updateSettings]);
    const handleConfidenceThresholdChange = useCallback((threshold) => {
        updateSettings({ confidenceThreshold: threshold });
    }, [updateSettings]);
    const resetSettings = useCallback(async () => {
        try {
            await fetchSettings();
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to reset settings');
        }
    }, [fetchSettings, setError]);
    return {
        settings,
        isLoading,
        error,
        fetchSettings,
        handleRiskProfileChange,
        handleStakeChange,
        handleModelChange,
        handleConfidenceThresholdChange,
        resetSettings,
    };
};
