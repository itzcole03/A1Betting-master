export const createMLSlice = (set, get) => ({
    predictions: [],
    modelMetrics: {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        lastUpdated: new Date(),
    },
    driftAlerts: [],
    updatePredictions: (predictions) => {
        set(state => ({
            predictions: [...state.predictions, ...predictions],
        }));
    },
    updateModelMetrics: (metrics) => {
        set(state => ({
            modelMetrics: {
                ...state.modelMetrics,
                ...metrics,
                lastUpdated: new Date(),
            },
        }));
    },
    addDriftAlert: (alert) => {
        set(state => ({
            driftAlerts: [...state.driftAlerts, alert],
        }));
    },
    clearDriftAlerts: () => {
        set(state => ({
            driftAlerts: [],
        }));
    },
});
