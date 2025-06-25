export interface FeatureFlag {
    enabled: boolean;
    id?: string;
    name?: string;
    description?: string;
}
export interface Config {
    enablePvPModel: FeatureFlag;
    enablePlayerFormModel: FeatureFlag;
    enableVenueEffectModel: FeatureFlag;
    enableRefereeImpactModel: FeatureFlag;
    enableLineupSynergyModel: FeatureFlag;
    enableNews: FeatureFlag;
    enableWeather: FeatureFlag;
    enableInjuries: FeatureFlag;
    enableAnalytics: FeatureFlag;
    enableSocialSentiment: FeatureFlag;
    socialSentiment: {
        provider: string;
        enabled: boolean;
    };
}
export declare class UnifiedConfig {
    private static instance;
    private config;
    private extraConfig;
    private constructor();
    static getInstance(): UnifiedConfig;
    get<T = any>(key: string): T;
    set<T = any>(key: string, value: T): void;
    getNested<T extends keyof Config, K extends keyof Config[T]>(section: T, key: K): Config[T][K];
    setNested<T extends keyof Config, K extends keyof Config[T]>(section: T, key: K, value: Config[T][K]): void;
    getAll(): Config;
    reset(): void;
    getAuthToken(): string | null;
    getApiUrl(): string;
}
