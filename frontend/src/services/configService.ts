import axios from "axios";
import { FeatureFlags } from "../types";
import {
  UnifiedApplicationConfig,
  getInitializedUnifiedConfig,
} from "../core/UnifiedConfig";
import { unifiedMonitor } from "../core/UnifiedMonitor";

// import { get } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
export const fetchAppConfig = async (): Promise<UnifiedApplicationConfig> => {
  const trace = unifiedMonitor.startTrace(
    "configService.fetchAppConfig",
    "http.client",
  );
  try {
    // Use plain Axios for the initial config fetch to avoid UnifiedConfig dependency
    const response = await axios.get<UnifiedApplicationConfig>(
      `${API_BASE_URL}/api/config/app`,
    );
    if (trace) {
      trace.setHttpStatus(response.status);
      unifiedMonitor.endTrace(trace);
    }
    return response.data;
  } catch (error: any) {
    unifiedMonitor.reportError(error, {
      service: "configService",
      operation: "fetchAppConfig",
    });
    if (trace) {
      trace.setHttpStatus(error.response?.status || 500);
      unifiedMonitor.endTrace(trace);
    }
    throw error;
  }
};

/**
 * Checks if a specific feature flag is enabled.
 * This function now relies on the UnifiedConfig which should be initialized with backend data.
 */
export const isFeatureEnabled = async (
  flagName: keyof FeatureFlags,
): Promise<boolean> => {
  try {
    const config = getInitializedUnifiedConfig();

    // Get feature flags from the config
    const features = config.get<any>("features");
    if (!features) {
      // Default feature flags if not configured
      const defaultFlags: Record<string, boolean> = {
        INJURIES: true,
        NEWS: true,
        WEATHER: true,
        REALTIME: true,
        ESPN: true,
        ODDS: true,
        ANALYTICS: true,
        enableNews: true,
        enableWeather: true,
        enableInjuries: true,
        enableAnalytics: true,
        enableSocialSentiment: true,
      };
      return defaultFlags[flagName as string] || false;
    }

    // Check if the feature is enabled
    const feature = features[flagName] || features[`enable${flagName}`];
    if (typeof feature === "boolean") {
      return feature;
    }
    if (typeof feature === "object" && feature.enabled !== undefined) {
      return feature.enabled;
    }

    // Default to false if not found
    return false;
  } catch (error) {
    console.warn(`Feature flag check failed for ${flagName}:`, error);
    // Default fallback for common features
    const commonFeatures: Record<string, boolean> = {
      INJURIES: true,
      NEWS: true,
      WEATHER: true,
      REALTIME: true,
      ESPN: true,
      ODDS: true,
      ANALYTICS: true,
    };
    return commonFeatures[flagName as string] || false;
  }
};

/**
 * Fetches all feature flags.
 */
export const fetchAllFeatureFlags = async (): Promise<FeatureFlags> => {
  try {
    const config = getInitializedUnifiedConfig();

    // Get feature flags from the config
    const features = config.get<any>("features");
    if (!features) {
      // Return default feature flags
      return {
        INJURIES: true,
        NEWS: true,
        WEATHER: true,
        REALTIME: true,
        ESPN: true,
        ODDS: true,
        ANALYTICS: true,
        enableNews: true,
        enableWeather: true,
        enableInjuries: true,
        enableAnalytics: true,
        enableSocialSentiment: true,
      } as FeatureFlags;
    }

    // Convert feature object to flat flags
    const flags: any = {};
    Object.entries(features).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        flags[key] = value;
      } else if (
        typeof value === "object" &&
        value !== null &&
        "enabled" in value
      ) {
        flags[key] = value.enabled;
      }
    });

    return flags as FeatureFlags;
  } catch (error) {
    console.warn("Failed to fetch feature flags:", error);
    // Return safe defaults
    return {
      INJURIES: true,
      NEWS: true,
      WEATHER: true,
      REALTIME: true,
      ESPN: true,
      ODDS: true,
      ANALYTICS: true,
    } as FeatureFlags;
  }
};

export const configService = {
  fetchAppConfig,
  isFeatureEnabled,
  fetchAllFeatureFlags,
};
