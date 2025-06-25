import type { BettingSettings } from '../services/bettingService';
export declare const useBettingSettings: () => {
    settings: any;
    isLoading: any;
    error: any;
    fetchSettings: any;
    handleRiskProfileChange: (profile: BettingSettings["riskProfile"]) => void;
    handleStakeChange: (stake: number) => void;
    handleModelChange: (modelId: string) => void;
    handleConfidenceThresholdChange: (threshold: number) => void;
    resetSettings: () => Promise<void>;
};
