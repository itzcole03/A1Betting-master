export interface AutomationConfig {
    updateInterval: number;
    riskManagement: {
        maxActiveBets: number;
        minConfidence: number;
        maxStakePercentage: number;
        stopLossPercentage: number;
        takeProfitPercentage: number;
    };
    prediction: {
        minSampleSize: number;
        maxTrials: number;
        explorationRate: number;
        recalibrationThreshold: number;
    };
    userPersonalization: {
        minClusterSize: number;
        maxClusters: number;
        confidenceThreshold: number;
    };
    notification: {
        enabled: boolean;
        channels: {
            email: boolean;
            push: boolean;
            sms: boolean;
        };
        priorityLevels: {
            info: boolean;
            warning: boolean;
            error: boolean;
            success: boolean;
        };
    };
}
export declare const defaultConfig: AutomationConfig;
