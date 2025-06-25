// ============================================================================
// UNIVERSAL SERVICE LAYER EXPORTS
// ============================================================================

export {
  UniversalServiceFactory,
  UniversalPredictionService,
  UniversalBettingService,
  UniversalUserService,
  UniversalAnalyticsService,
  createQueryKeys,
  defaultQueryConfig,
} from "./UniversalServiceLayer";

export type {
  APIResponse,
  ServiceConfig,
  CacheConfig,
  Prediction,
  EngineMetrics,
  BetOpportunity,
  UserProfile,
} from "./UniversalServiceLayer";

// Default export
export { default } from "./UniversalServiceLayer";

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

// Pre-configured service instances
export const predictionService = UniversalServiceFactory.getPredictionService();
export const bettingService = UniversalServiceFactory.getBettingService();
export const userService = UniversalServiceFactory.getUserService();
export const analyticsService = UniversalServiceFactory.getAnalyticsService();

// ============================================================================
// LEGACY COMPATIBILITY EXPORTS (Deprecated - Use Universal equivalents)
// ============================================================================

/**
 * @deprecated Use UniversalServiceFactory.getPredictionService() instead
 */
export const predictionServiceLegacy = predictionService;

/**
 * @deprecated Use UniversalServiceFactory.getBettingService() instead
 */
export const ApiService = bettingService;

/**
 * @deprecated Use UniversalServiceFactory.getUserService() instead
 */
export const authService = userService;
