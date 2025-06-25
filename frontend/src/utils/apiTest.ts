/**
 * API Test Utility
 * Quick utility to test API endpoints and verify they're working correctly
 */

import { api } from "@/services/api/ProductionApiService";
import { unifiedDataService } from "@/services/unified/UnifiedDataService";
import { logger } from "@/utils/logger";

export async function testApiEndpoints(): Promise<{
  success: boolean;
  results: Array<{
    endpoint: string;
    success: boolean;
    error?: string;
    duration: number;
  }>;
}> {
  const results: Array<{
    endpoint: string;
    success: boolean;
    error?: string;
    duration: number;
  }> = [];

  // Test health check
  try {
    const startTime = Date.now();
    const healthResponse = await api.healthCheck();
    results.push({
      endpoint: "/health",
      success: healthResponse,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    results.push({
      endpoint: "/health",
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: 0,
    });
  }

  // Test betting opportunities
  try {
    const startTime = Date.now();
    const bettingResponse = await api.getBettingOpportunities({
      sport: "all",
      minEdge: 1,
    });
    results.push({
      endpoint: "/api/betting-opportunities",
      success: bettingResponse.success,
      error: bettingResponse.success ? undefined : bettingResponse.error,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    results.push({
      endpoint: "/api/betting-opportunities",
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: 0,
    });
  }

  // Test PrizePicks props
  try {
    const startTime = Date.now();
    const prizePicksResponse = await api.getPrizePicksProps({ sport: "all" });
    results.push({
      endpoint: "/api/prizepicks/projections",
      success: prizePicksResponse.success,
      error: prizePicksResponse.success ? undefined : prizePicksResponse.error,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    results.push({
      endpoint: "/api/prizepicks/projections",
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: 0,
    });
  }

  // Test unified data service
  try {
    const startTime = Date.now();
    const unifiedResponse = await unifiedDataService.getPlayerProps({
      sport: "all",
      maxResults: 5,
    });
    results.push({
      endpoint: "UnifiedDataService.getPlayerProps",
      success: unifiedResponse.success,
      error: unifiedResponse.success ? undefined : unifiedResponse.error,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    results.push({
      endpoint: "UnifiedDataService.getPlayerProps",
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: 0,
    });
  }

  // Test unified betting opportunities
  try {
    const startTime = Date.now();
    const unifiedBettingResponse =
      await unifiedDataService.getBettingOpportunities({
        sport: "all",
        maxResults: 5,
      });
    results.push({
      endpoint: "UnifiedDataService.getBettingOpportunities",
      success: unifiedBettingResponse.success,
      error: unifiedBettingResponse.success
        ? undefined
        : unifiedBettingResponse.error,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    results.push({
      endpoint: "UnifiedDataService.getBettingOpportunities",
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: 0,
    });
  }

  const allSuccessful = results.every((result) => result.success);

  // Log results
  logger.info(
    "API Test Results",
    {
      allSuccessful,
      totalTests: results.length,
      successfulTests: results.filter((r) => r.success).length,
      failedTests: results.filter((r) => !r.success).length,
      results,
    },
    "APITest",
  );

  return {
    success: allSuccessful,
    results,
  };
}

export async function logApiTest(): Promise<void> {
  console.log("🧪 Running API tests...");
  const testResults = await testApiEndpoints();

  console.log(
    `📊 API Test Results: ${testResults.success ? "✅ All tests passed" : "❌ Some tests failed"}`,
  );

  testResults.results.forEach((result) => {
    const status = result.success ? "✅" : "❌";
    const duration = `(${result.duration}ms)`;
    const error = result.error ? ` - ${result.error}` : "";
    console.log(`  ${status} ${result.endpoint} ${duration}${error}`);
  });
}

// Export for global access in development
if (typeof window !== "undefined") {
  (window as any).testApi = logApiTest;
}
