export interface ApiEndpoint {
    name: string;
    baseUrl: string;
    apiKey?: string;
    version?: string;
    timeout?: number;
    rateLimit?: {
        requests: number;
        period: number;
    };
    retryConfig?: {
        maxRetries: number;
        backoffMultiplier: number;
        initialDelay: number;
    };
}
export interface ApiResponse<T = any> {
    data: T;
    status: number;
    message?: string;
    timestamp: number;
    error?: string;
}
export interface CacheConfig {
    enabled: boolean;
    ttl: number;
    maxSize: number;
}
export declare const API_ENDPOINTS: Record<string, ApiEndpoint>;
export declare const CACHE_CONFIG: Record<string, CacheConfig>;
export declare const SPORTS_CONFIG: {
    NBA: {
        id: string;
        name: string;
        season: string;
        active: boolean;
        sportradarId: string;
        oddsApiKey: string;
    };
    WNBA: {
        id: string;
        name: string;
        season: string;
        active: boolean;
        sportradarId: string;
        oddsApiKey: string;
    };
    MLB: {
        id: string;
        name: string;
        season: string;
        active: boolean;
        sportradarId: string;
        oddsApiKey: string;
    };
    EPL: {
        id: string;
        name: string;
        season: string;
        active: boolean;
        sportradarId: string;
        oddsApiKey: string;
    };
    NFL: {
        id: string;
        name: string;
        season: string;
        active: boolean;
        sportradarId: string;
        oddsApiKey: string;
    };
    NCAAB: {
        id: string;
        name: string;
        season: string;
        active: boolean;
        sportradarId: string;
        oddsApiKey: string;
    };
};
export declare const MARKET_TYPES: {
    SPREAD: string;
    TOTALS: string;
    MONEYLINE: string;
    PLAYER_PROPS: string;
    TEAM_PROPS: string;
    ALTERNATE_SPREADS: string;
    ALTERNATE_TOTALS: string;
};
export declare const BOOKMAKERS: {
    DRAFTKINGS: {
        id: string;
        name: string;
        active: boolean;
        priority: number;
    };
    FANDUEL: {
        id: string;
        name: string;
        active: boolean;
        priority: number;
    };
    MGMBET: {
        id: string;
        name: string;
        active: boolean;
        priority: number;
    };
    CAESARS: {
        id: string;
        name: string;
        active: boolean;
        priority: number;
    };
    BETMGM: {
        id: string;
        name: string;
        active: boolean;
        priority: number;
    };
};
export declare const API_STATUS: {
    readonly SUCCESS: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly RATE_LIMITED: 429;
    readonly SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const REQUEST_PRIORITIES: {
    readonly CRITICAL: 1;
    readonly HIGH: 2;
    readonly MEDIUM: 3;
    readonly LOW: 4;
};
export declare const FEATURE_FLAGS: {
    REAL_TIME_ODDS: boolean;
    LIVE_PREDICTIONS: boolean;
    SENTIMENT_ANALYSIS: boolean;
    WEATHER_INTEGRATION: boolean;
    INJURY_TRACKING: boolean;
    AUTOMATED_BETTING: boolean;
    ADVANCED_ANALYTICS: boolean;
    DEBUG_MODE: boolean;
};
export declare const VALIDATION_RULES: {
    MAX_RESPONSE_SIZE: number;
    MIN_CONFIDENCE_THRESHOLD: number;
    MAX_ODDS_VALUE: number;
    MIN_ODDS_VALUE: number;
    MAX_PREDICTION_AGE: number;
    REQUIRED_FIELDS: {
        ODDS: string[];
        PREDICTION: string[];
        PLAYER_STATS: string[];
    };
};
export declare const getApiEndpoint: (name: keyof typeof API_ENDPOINTS) => ApiEndpoint;
export declare const isApiAvailable: (name: keyof typeof API_ENDPOINTS) => boolean;
export declare const buildApiUrl: (endpointName: keyof typeof API_ENDPOINTS, path: string, params?: Record<string, string | number>) => string;
declare const _default: {
    API_ENDPOINTS: Record<string, ApiEndpoint>;
    CACHE_CONFIG: Record<string, CacheConfig>;
    SPORTS_CONFIG: {
        NBA: {
            id: string;
            name: string;
            season: string;
            active: boolean;
            sportradarId: string;
            oddsApiKey: string;
        };
        WNBA: {
            id: string;
            name: string;
            season: string;
            active: boolean;
            sportradarId: string;
            oddsApiKey: string;
        };
        MLB: {
            id: string;
            name: string;
            season: string;
            active: boolean;
            sportradarId: string;
            oddsApiKey: string;
        };
        EPL: {
            id: string;
            name: string;
            season: string;
            active: boolean;
            sportradarId: string;
            oddsApiKey: string;
        };
        NFL: {
            id: string;
            name: string;
            season: string;
            active: boolean;
            sportradarId: string;
            oddsApiKey: string;
        };
        NCAAB: {
            id: string;
            name: string;
            season: string;
            active: boolean;
            sportradarId: string;
            oddsApiKey: string;
        };
    };
    MARKET_TYPES: {
        SPREAD: string;
        TOTALS: string;
        MONEYLINE: string;
        PLAYER_PROPS: string;
        TEAM_PROPS: string;
        ALTERNATE_SPREADS: string;
        ALTERNATE_TOTALS: string;
    };
    BOOKMAKERS: {
        DRAFTKINGS: {
            id: string;
            name: string;
            active: boolean;
            priority: number;
        };
        FANDUEL: {
            id: string;
            name: string;
            active: boolean;
            priority: number;
        };
        MGMBET: {
            id: string;
            name: string;
            active: boolean;
            priority: number;
        };
        CAESARS: {
            id: string;
            name: string;
            active: boolean;
            priority: number;
        };
        BETMGM: {
            id: string;
            name: string;
            active: boolean;
            priority: number;
        };
    };
    API_STATUS: {
        readonly SUCCESS: 200;
        readonly CREATED: 201;
        readonly BAD_REQUEST: 400;
        readonly UNAUTHORIZED: 401;
        readonly FORBIDDEN: 403;
        readonly NOT_FOUND: 404;
        readonly RATE_LIMITED: 429;
        readonly SERVER_ERROR: 500;
        readonly SERVICE_UNAVAILABLE: 503;
    };
    REQUEST_PRIORITIES: {
        readonly CRITICAL: 1;
        readonly HIGH: 2;
        readonly MEDIUM: 3;
        readonly LOW: 4;
    };
    FEATURE_FLAGS: {
        REAL_TIME_ODDS: boolean;
        LIVE_PREDICTIONS: boolean;
        SENTIMENT_ANALYSIS: boolean;
        WEATHER_INTEGRATION: boolean;
        INJURY_TRACKING: boolean;
        AUTOMATED_BETTING: boolean;
        ADVANCED_ANALYTICS: boolean;
        DEBUG_MODE: boolean;
    };
    VALIDATION_RULES: {
        MAX_RESPONSE_SIZE: number;
        MIN_CONFIDENCE_THRESHOLD: number;
        MAX_ODDS_VALUE: number;
        MIN_ODDS_VALUE: number;
        MAX_PREDICTION_AGE: number;
        REQUIRED_FIELDS: {
            ODDS: string[];
            PREDICTION: string[];
            PLAYER_STATS: string[];
        };
    };
    getApiEndpoint: (name: keyof typeof API_ENDPOINTS) => ApiEndpoint;
    isApiAvailable: (name: keyof typeof API_ENDPOINTS) => boolean;
    buildApiUrl: (endpointName: keyof typeof API_ENDPOINTS, path: string, params?: Record<string, string | number>) => string;
};
export default _default;
