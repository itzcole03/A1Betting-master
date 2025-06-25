export class UnifiedConfig {
    constructor() {
        this.extraConfig = {};
        this.config = {
            enablePvPModel: { enabled: true },
            enablePlayerFormModel: { enabled: true },
            enableVenueEffectModel: { enabled: true },
            enableRefereeImpactModel: { enabled: true },
            enableLineupSynergyModel: { enabled: true },
            enableNews: { enabled: true },
            enableWeather: { enabled: true },
            enableInjuries: { enabled: true },
            enableAnalytics: { enabled: true },
            enableSocialSentiment: { enabled: true },
            socialSentiment: {
                provider: "default",
                enabled: true,
            },
        };
        // Set default for api.baseUrl if not present
        if (!this.extraConfig["api.baseUrl"]) {
            this.extraConfig["api.baseUrl"] =
                typeof import.meta !== "undefined" &&
                    import.meta.env &&
                    import.meta.env.VITE_API_BASE_URL
                    ? import.meta.env.VITE_API_BASE_URL
                    : "https://api.betproai.com";
        }
        // Set default for news config if not present
        if (!this.extraConfig["news"]) {
            this.extraConfig["news"] = {
                apiBaseUrl: typeof import.meta !== "undefined" &&
                    import.meta.env &&
                    import.meta.env.VITE_NEWS_API_BASE_URL
                    ? import.meta.env.VITE_NEWS_API_BASE_URL
                    : "https://api.betproai.com",
                backendPrefix: "/api/news",
                timeout: 10000,
                enableFeatureFlag: true,
            };
        }
    }
    static getInstance() {
        if (!UnifiedConfig.instance) {
            UnifiedConfig.instance = new UnifiedConfig();
        }
        return UnifiedConfig.instance;
    }
    get(key) {
        if (this.config[key] !== undefined) {
            return this.config[key];
        }
        if (this.extraConfig[key] !== undefined) {
            return this.extraConfig[key];
        }
        // Provide default for api.baseUrl
        if (key === "api.baseUrl") {
            return (typeof import.meta !== "undefined" &&
                import.meta.env &&
                import.meta.env.VITE_API_BASE_URL
                ? import.meta.env.VITE_API_BASE_URL
                : "https://api.betproai.com");
        }
        throw new Error(`Configuration key "${key}" not found`);
    }
    set(key, value) {
        if (this.config[key] !== undefined) {
            this.config[key] = value;
        }
        else {
            this.extraConfig[key] = value;
        }
    }
    getNested(section, key) {
        return this.config[section][key];
    }
    setNested(section, key, value) {
        this.config[section][key] = value;
    }
    getAll() {
        return { ...this.config };
    }
    reset() {
        this.config = {
            enablePvPModel: { enabled: true },
            enablePlayerFormModel: { enabled: true },
            enableVenueEffectModel: { enabled: true },
            enableRefereeImpactModel: { enabled: true },
            enableLineupSynergyModel: { enabled: true },
            enableNews: { enabled: true },
            enableWeather: { enabled: true },
            enableInjuries: { enabled: true },
            enableAnalytics: { enabled: true },
            enableSocialSentiment: { enabled: true },
            socialSentiment: {
                provider: "default",
                enabled: true,
            },
        };
    }
    getAuthToken() {
        // Check for token in localStorage, sessionStorage, or environment
        if (typeof window !== "undefined") {
            return (localStorage.getItem("auth_token") ||
                sessionStorage.getItem("auth_token"));
        }
        return null;
    }
    getApiUrl() {
        return this.get("api.baseUrl") || "https://api.betproai.com";
    }
}
