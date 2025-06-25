/**
 * Enhanced API Test Dashboard
 * Tests and displays data from all enhanced provider integrations
 */

import React, { useState, useEffect } from "react";
import { enhancedDailyFantasyService } from "../../services/enhanced/DailyFantasyService";
import { enhancedTheOddsService } from "../../services/enhanced/TheOddsService";
import { sportsbookDataService } from "../../services/enhanced/SportsbookDataService";
import { unifiedDataIntegrationService } from "../../services/enhanced/UnifiedDataIntegrationService";
import { productionValidationService } from "../../services/enhanced/ProductionValidationService";
import { prizePicksProjectionsService } from "../../services/enhanced/PrizePicksProjectionsService";

interface TestResult {
  service: string;
  status: "testing" | "success" | "error";
  data?: any;
  error?: string;
  responseTime?: number;
}

const EnhancedAPITestDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [productionReport, setProductionReport] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const updateTestResult = (service: string, result: Partial<TestResult>) => {
    setTestResults((prev) => {
      const existing = prev.find((r) => r.service === service);
      if (existing) {
        return prev.map((r) =>
          r.service === service ? { ...r, ...result } : r,
        );
      } else {
        return [...prev, { service, status: "testing", ...result }];
      }
    });
  };

  const runAPITests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests = [
      {
        service: "PrizePicks - Free Projections (NBA)",
        test: () => prizePicksProjectionsService.getNBAProjections(),
      },
      {
        service: "PrizePicks - All Projections",
        test: () => prizePicksProjectionsService.getProjections(),
      },
      {
        service: "PrizePicks - High Value Props",
        test: () => prizePicksProjectionsService.getHighValueProjections(0.7),
      },
      {
        service: "DailyFantasy - DraftKings Contests",
        test: () => enhancedDailyFantasyService.getDraftKingsContests("NBA"),
      },
      {
        service: "DailyFantasy - Comprehensive Data",
        test: () => enhancedDailyFantasyService.getComprehensiveDFSData("NBA"),
      },
      {
        service: "TheOdds - Sports List",
        test: () => enhancedTheOddsService.getSportsFromTheOddsAPI(),
      },
      {
        service: "TheOdds - Aggregated Odds",
        test: () => enhancedTheOddsService.getAggregatedOdds("basketball_nba"),
      },
      {
        service: "Sportsbook - Aggregated Odds",
        test: () => sportsbookDataService.getAggregatedOdds("basketball_nba"),
      },
      {
        service: "Sportsbook - Arbitrage Opportunities",
        test: () =>
          sportsbookDataService.getArbitrageOpportunities("basketball_nba"),
      },
      {
        service: "Unified - Complete Sports Data",
        test: () =>
          unifiedDataIntegrationService.getUnifiedSportsData("basketball_nba"),
      },
      {
        service: "Unified - Optimal DFS Lineup",
        test: () => unifiedDataIntegrationService.getOptimalDFSLineups("NBA"),
      },
    ];

    for (const { service, test } of tests) {
      updateTestResult(service, { status: "testing" });

      const startTime = Date.now();
      try {
        const data = await test();
        const responseTime = Date.now() - startTime;

        updateTestResult(service, {
          status: "success",
          data,
          responseTime,
        });
      } catch (error) {
        const responseTime = Date.now() - startTime;
        updateTestResult(service, {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          responseTime,
        });
      }
    }

    setIsRunning(false);
  };

  const checkHealthStatus = async () => {
    try {
      const health = unifiedDataIntegrationService.getHealthStatus();
      setHealthStatus(health);
    } catch (error) {
      console.error("Health check failed:", error);
    }
  };

  const runProductionValidation = async () => {
    setIsValidating(true);
    try {
      const report =
        await productionValidationService.validateProductionReadiness();
      setProductionReport(report);
      console.log("Production Validation Report:", report);
    } catch (error) {
      console.error("Production validation failed:", error);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    checkHealthStatus();
    runProductionValidation(); // Run initial production validation
    const interval = setInterval(checkHealthStatus, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "testing":
        return "bg-yellow-500";
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "testing":
        return "⏳";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "❓";
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Enhanced API Integration Dashboard
          </h1>
          <p className="text-gray-300 mb-4">
            Test and monitor real provider integrations: DraftKings,
            The-Odds-API, SportsDataIO, OddsJam, and more.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={runAPITests}
              disabled={isRunning}
              className={`px-6 py-2 rounded-lg font-semibold ${
                isRunning
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRunning ? "Running Tests..." : "Run API Tests"}
            </button>

            <button
              onClick={checkHealthStatus}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
            >
              Refresh Health Status
            </button>

            <button
              onClick={runProductionValidation}
              disabled={isValidating}
              className={`px-6 py-2 rounded-lg font-semibold ${
                isValidating
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isValidating ? "Validating..." : "Production Validation"}
            </button>
          </div>
        </div>

        {/* Production Validation Section */}
        {productionReport && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Production Readiness Validation
            </h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span
                    className={`px-4 py-2 rounded-lg font-bold text-lg ${
                      productionReport.overall_status === "ready"
                        ? "bg-green-600"
                        : productionReport.overall_status ===
                            "ready_with_warnings"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    }`}
                  >
                    {productionReport.overall_status
                      .replace("_", " ")
                      .toUpperCase()}
                  </span>
                  <div className="text-2xl font-bold">
                    {productionReport.readiness_score}% Ready
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <p>
                    {productionReport.api_keys_configured.length} API keys
                    configured
                  </p>
                  <p>
                    {
                      productionReport.validations.filter(
                        (v: any) => v.status === "pass",
                      ).length
                    }{" "}
                    validations passed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">
                    Configured APIs
                  </h3>
                  <div className="space-y-1">
                    {productionReport.api_keys_configured.map((api: string) => (
                      <div key={api} className="flex items-center text-sm">
                        <span className="text-green-400 mr-2">✓</span>
                        {api}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-400 mb-2">
                    Feature Flags
                  </h3>
                  <div className="space-y-1">
                    {Object.entries(
                      productionReport.environment_summary.feature_flags,
                    ).map(([flag, enabled]) => (
                      <div key={flag} className="flex items-center text-sm">
                        <span
                          className={`mr-2 ${enabled ? "text-green-400" : "text-gray-500"}`}
                        >
                          {enabled ? "✓" : "○"}
                        </span>
                        {flag.replace(/_/g, " ")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {productionReport.recommendations.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-400 mb-2">
                    Recommendations
                  </h3>
                  <div className="space-y-2">
                    {productionReport.recommendations.map(
                      (rec: string, index: number) => (
                        <div key={index} className="text-sm text-gray-300">
                          {rec}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              <details className="bg-gray-700 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold mb-2">
                  View Detailed Validation Results (
                  {productionReport.validations.length} checks)
                </summary>
                <div className="space-y-2 mt-2">
                  {productionReport.validations.map(
                    (validation: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-1 border-b border-gray-600"
                      >
                        <span className="text-sm">{validation.service}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              validation.status === "pass"
                                ? "bg-green-600"
                                : validation.status === "warning"
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                            }`}
                          >
                            {validation.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400 max-w-md text-right">
                            {validation.message}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Health Status Section */}
        {healthStatus && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Provider Health Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {healthStatus.providers.map((provider: any) => (
                <div
                  key={provider.provider}
                  className="bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{provider.provider}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        provider.status === "healthy"
                          ? "bg-green-600"
                          : provider.status === "degraded"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }`}
                    >
                      {provider.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <p>Response Time: {provider.response_time}ms</p>
                    <p>
                      Availability:{" "}
                      {provider.availability_percentage.toFixed(1)}%
                    </p>
                    <p>
                      Last Updated:{" "}
                      {new Date(provider.last_updated).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">System Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Total Requests</p>
                  <p className="font-bold text-lg">
                    {healthStatus.metrics.total_requests}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Success Rate</p>
                  <p className="font-bold text-lg">
                    {(
                      (healthStatus.metrics.successful_requests /
                        Math.max(1, healthStatus.metrics.total_requests)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Response Time</p>
                  <p className="font-bold text-lg">
                    {Math.round(healthStatus.metrics.average_response_time)}ms
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Cache Hit Rate</p>
                  <p className="font-bold text-lg">
                    {(healthStatus.metrics.cache_hit_rate * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {healthStatus.recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">
                    Recommendations:
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {healthStatus.recommendations.map(
                      (rec: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">💡</span>
                          {rec}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Results Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">API Test Results</h2>

          {testResults.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Click "Run API Tests" to test all enhanced provider integrations
            </p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {getStatusIcon(result.status)}
                      </span>
                      <h3 className="font-semibold">{result.service}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.responseTime && (
                        <span className="text-sm text-gray-400">
                          {result.responseTime}ms
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(result.status)}`}
                      >
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {result.error && (
                    <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded p-3 mb-2">
                      <p className="text-red-200 text-sm">
                        Error: {result.error}
                      </p>
                    </div>
                  )}

                  {result.data && result.status === "success" && (
                    <div className="bg-gray-600 rounded p-3">
                      <details>
                        <summary className="cursor-pointer text-sm font-semibold mb-2">
                          View Response Data (
                          {Array.isArray(result.data)
                            ? result.data.length
                            : "Object"}{" "}
                          items)
                        </summary>
                        <pre className="text-xs overflow-x-auto bg-gray-800 p-2 rounded mt-2">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Provider Information */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Integrated Providers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400 mb-2">
                DailyFantasy Providers
              </h3>
              <ul className="text-sm space-y-1">
                <li>
                  • <strong>PrizePicks API (FREE)</strong>
                </li>
                <li>• DraftKings (Unofficial API)</li>
                <li>• SportsDataIO Fantasy API</li>
                <li>• FairPlay Lineup Optimizer</li>
                <li>• Backend Aggregation Service</li>
              </ul>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-2">
                Odds Providers
              </h3>
              <ul className="text-sm space-y-1">
                <li>• The-Odds-API</li>
                <li>• OddsJam API</li>
                <li>• SportsDataIO Odds</li>
                <li>• Real-time aggregation</li>
              </ul>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-purple-400 mb-2">
                Sportsbooks
              </h3>
              <ul className="text-sm space-y-1">
                <li>• DraftKings Sportsbook</li>
                <li>• FanDuel Sportsbook</li>
                <li>• BetMGM</li>
                <li>• Caesars</li>
                <li>• Live line movements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAPITestDashboard;
