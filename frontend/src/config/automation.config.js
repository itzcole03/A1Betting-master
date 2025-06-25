export const defaultConfig = {
    updateInterval: 5 * 60 * 1000, // 5 minutes
    riskManagement: {
        maxActiveBets: 5,
        minConfidence: 0.7,
        maxStakePercentage: 0.05, // 5% of bankroll
        stopLossPercentage: 0.1, // 10% of bankroll
        takeProfitPercentage: 0.2, // 20% of bankroll
    },
    prediction: {
        minSampleSize: 1000,
        maxTrials: 100,
        explorationRate: 0.1,
        recalibrationThreshold: 0.1,
    },
    userPersonalization: {
        minClusterSize: 10,
        maxClusters: 5,
        confidenceThreshold: 0.7,
    },
    notification: {
        enabled: true,
        channels: {
            email: true,
            push: true,
            sms: false,
        },
        priorityLevels: {
            info: true,
            warning: true,
            error: true,
            success: true,
        },
    },
};
