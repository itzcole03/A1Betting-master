export declare const API_BASE_URL: any;
export declare const FEATURE_FLAGS: {
    ENABLE_ML_PREDICTIONS: boolean;
    ENABLE_REAL_TIME_UPDATES: boolean;
    ENABLE_ADVANCED_METRICS: boolean;
};
export declare const WS_CONFIG: {
    RECONNECT_INTERVAL: number;
    MAX_RECONNECT_ATTEMPTS: number;
    getWebSocketUrl: () => string;
};
export declare const ML_CONFIG: {
    CONFIDENCE_THRESHOLD: number;
    MAX_FEATURES: number;
    UPDATE_INTERVAL: number;
};
export declare const UI_CONFIG: {
    ANIMATION_DURATION: number;
    TOAST_DURATION: number;
    MAX_INSIGHTS_DISPLAY: number;
};
