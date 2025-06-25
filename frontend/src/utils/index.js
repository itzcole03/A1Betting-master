// ============================================================================
// UNIVERSAL UTILITIES SYSTEM EXPORTS
// ============================================================================
export { formatters, validators, collections, performance, UniversalCache, errorHandling, betting, analytics, } from "./UniversalUtils";
// Default export
export { default } from "./UniversalUtils";
// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================
// Pre-configured instances for common use cases
export const cache = new UniversalCache({ ttl: 300000, maxSize: 1000 });
export const logger = errorHandling.createLogger("App");
// ============================================================================
// LEGACY COMPATIBILITY EXPORTS (Deprecated - Use Universal equivalents)
// ============================================================================
/**
 * @deprecated Use formatters from UniversalUtils instead
 */
export const formatCurrency = formatters.currency;
/**
 * @deprecated Use validators from UniversalUtils instead
 */
export const validateEmail = validators.email;
/**
 * @deprecated Use performance.debounce from UniversalUtils instead
 */
export const debounce = performance.debounce;
/**
 * @deprecated Use collections.deepClone from UniversalUtils instead
 */
export const deepClone = collections.deepClone;
// Re-export for compatibility
export const { formatters: format, validators: validate, collections: array, performance: perf, betting: bettingUtils, analytics: analyticsUtils, } = UniversalUtils;
