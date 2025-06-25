import { FeatureFlags } from "../types";
import { UnifiedApplicationConfig } from "../core/UnifiedConfig";
/**
 * Fetches the main application configuration from the backend.
 * This includes feature flags, API endpoints, versioning info, etc.
 * Expected backend response (from /api/config/app defined in backend routes/settings.py)
 * should match the structure of UnifiedApplicationConfig.
 * Example:
 * {
 *   "version": "0.1.0",
 *   "appName": "AI Sports Betting Analytics API",
 *   "environment": "development",
 *   "featureFlags": { "newDashboardLayout": true, "advancedAnalytics": false },
 *   "experiments": [],
 *   "apiEndpoints": { "users": "/api/users", "prizepicks": "/api/prizepicks" },
 *   "sentryDsn": "your_backend_sentry_dsn_if_any"
 * }
 */
export declare const fetchAppConfig: () => Promise<UnifiedApplicationConfig>;
/**
 * Checks if a specific feature flag is enabled.
 * This function now relies on the UnifiedConfig which should be initialized with backend data.
 */
export declare const isFeatureEnabled: (flagName: keyof FeatureFlags) => Promise<boolean>;
/**
 * Fetches all feature flags.
 */
export declare const fetchAllFeatureFlags: () => Promise<FeatureFlags>;
export declare const configService: {
    fetchAppConfig: () => Promise<UnifiedApplicationConfig>;
    isFeatureEnabled: (flagName: keyof FeatureFlags) => Promise<boolean>;
    fetchAllFeatureFlags: () => Promise<FeatureFlags>;
};
