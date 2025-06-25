/**
 * Production Validation Service
 * Validates all API configurations and provider connectivity for production deployment
 */

interface ValidationResult {
  service: string;
  status: "pass" | "warning" | "fail";
  message: string;
  details?: any;
}

interface ProductionReadinessReport {
  overall_status: "ready" | "ready_with_warnings" | "not_ready";
  readiness_score: number;
  validations: ValidationResult[];
  recommendations: string[];
  api_keys_configured: string[];
  missing_api_keys: string[];
  environment_summary: {
    backend_url: string;
    node_env: string;
    feature_flags: Record<string, boolean>;
  };
}

export class ProductionValidationService {
  private validations: ValidationResult[] = [];

  /**
   * Run complete production readiness validation
   */
  async validateProductionReadiness(): Promise<ProductionReadinessReport> {
    console.log("🔍 Running production readiness validation...");

    this.validations = [];

    // Environment validation
    await this.validateEnvironmentConfiguration();

    // API key validation
    await this.validateAPIKeys();

    // Feature flags validation
    await this.validateFeatureFlags();

    // Service connectivity validation
    await this.validateServiceConnectivity();

    // Security validation
    await this.validateSecurityConfiguration();

    // Performance validation
    await this.validatePerformanceConfiguration();

    return this.generateReport();
  }

  /**
   * Validate environment configuration
   */
  private async validateEnvironmentConfiguration(): Promise<void> {
    const nodeEnv = import.meta.env.NODE_ENV || import.meta.env.VITE_ENV;
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;

    // Check NODE_ENV
    if (nodeEnv === "production") {
      this.addValidation("Environment", "pass", "NODE_ENV set to production");
    } else {
      this.addValidation(
        "Environment",
        "warning",
        `NODE_ENV is ${nodeEnv}, consider setting to 'production'`,
      );
    }

    // Check backend URL
    if (backendUrl) {
      if (backendUrl.includes("localhost")) {
        this.addValidation(
          "Backend URL",
          "warning",
          "Backend URL points to localhost - update for production deployment",
        );
      } else {
        this.addValidation(
          "Backend URL",
          "pass",
          `Backend URL configured: ${backendUrl}`,
        );
      }
    } else {
      this.addValidation("Backend URL", "fail", "Backend URL not configured");
    }

    // Check HTTPS configuration
    const enableSSL = import.meta.env.VITE_ENABLE_SSL;
    if (enableSSL === "true") {
      this.addValidation("SSL", "pass", "SSL enabled for production");
    } else {
      this.addValidation(
        "SSL",
        "warning",
        "SSL not enabled - ensure HTTPS is configured at deployment level",
      );
    }
  }

  /**
   * Validate API keys configuration
   */
  private async validateAPIKeys(): Promise<void> {
    const apiKeys = {
      "The-Odds-API": import.meta.env.VITE_THEODDS_API_KEY,
      SportsRadar: import.meta.env.VITE_SPORTRADAR_API_KEY,
      SportsDataIO: import.meta.env.VITE_SPORTSDATA_API_KEY,
      OddsJam: import.meta.env.VITE_ODDSJAM_API_KEY,
      FairPlay: import.meta.env.VITE_FAIRPLAY_API_KEY,
      PrizePicks: import.meta.env.VITE_PRIZEPICKS_API_KEY,
      "Weather API": import.meta.env.VITE_WEATHER_API_KEY,
      "News API": import.meta.env.VITE_NEWS_API_KEY,
    };

    const configuredKeys: string[] = [];
    const missingKeys: string[] = [];

    Object.entries(apiKeys).forEach(([service, key]) => {
      if (key && key.trim() !== "" && key !== "your_api_key_here") {
        configuredKeys.push(service);
        this.addValidation(
          `${service} API Key`,
          "pass",
          `✓ API key configured`,
        );
      } else {
        missingKeys.push(service);
        const priority = ["The-Odds-API", "SportsRadar"].includes(service)
          ? "warning"
          : "info";
        this.addValidation(
          `${service} API Key`,
          priority as "warning",
          `API key not configured - some features will use mock data`,
        );
      }
    });

    // Special validation for critical APIs
    if (apiKeys["The-Odds-API"]) {
      // Validate The-Odds-API key format (should be 32 character hex)
      const key = apiKeys["The-Odds-API"];
      if (key.length === 32 && /^[a-f0-9]+$/i.test(key)) {
        this.addValidation(
          "The-Odds-API Format",
          "pass",
          "API key format is valid",
        );
      } else {
        this.addValidation(
          "The-Odds-API Format",
          "warning",
          "API key format may be invalid",
        );
      }
    }
  }

  /**
   * Validate feature flags
   */
  private async validateFeatureFlags(): Promise<void> {
    const featureFlags = {
      "Real-time Odds": import.meta.env.VITE_ENABLE_REAL_TIME_ODDS,
      "Live Predictions": import.meta.env.VITE_ENABLE_LIVE_PREDICTIONS,
      "Advanced Analytics": import.meta.env.VITE_ENABLE_ADVANCED_ANALYTICS,
      "Enhanced Revolutionary": import.meta.env
        .VITE_ENABLE_ENHANCED_REVOLUTIONARY,
      WebSocket: import.meta.env.VITE_WEBSOCKET_ENABLED,
      "Cache Predictions": import.meta.env.VITE_CACHE_PREDICTIONS,
      "Auto Betting": import.meta.env.VITE_ENABLE_AUTO_BETTING,
    };

    const enabledFeatures = Object.entries(featureFlags)
      .filter(([_, enabled]) => enabled === "true")
      .map(([feature]) => feature);

    this.addValidation(
      "Feature Flags",
      "pass",
      `${enabledFeatures.length} production features enabled: ${enabledFeatures.join(", ")}`,
    );

    // Check for auto-betting (should be disabled in production)
    if (featureFlags["Auto Betting"] === "true") {
      this.addValidation(
        "Auto Betting",
        "warning",
        "Auto betting is enabled - ensure this is intentional for production",
      );
    }
  }

  /**
   * Validate service connectivity
   */
  private async validateServiceConnectivity(): Promise<void> {
    const services = [
      {
        name: "Backend Health",
        url: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/health`,
      },
      {
        name: "The-Odds-API",
        url: "https://api.the-odds-api.com/v4/sports",
        requiresKey: import.meta.env.VITE_THEODDS_API_KEY,
      },
    ];

    for (const service of services) {
      try {
        if (service.requiresKey && !service.requiresKey) {
          this.addValidation(
            `${service.name} Connectivity`,
            "warning",
            "Cannot test - API key not configured",
          );
          continue;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const url = service.requiresKey
          ? `${service.url}?apiKey=${service.requiresKey}`
          : service.url;

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent": "A1Betting-ProductionValidation/1.0",
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          this.addValidation(
            `${service.name} Connectivity`,
            "pass",
            `✓ Service responsive (${response.status})`,
          );
        } else {
          this.addValidation(
            `${service.name} Connectivity`,
            "warning",
            `Service returned ${response.status} - may need attention`,
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        this.addValidation(
          `${service.name} Connectivity`,
          "warning",
          `Connection failed: ${errorMessage}`,
        );
      }
    }
  }

  /**
   * Validate security configuration
   */
  private async validateSecurityConfiguration(): Promise<void> {
    // Check for debug mode
    const debugMode =
      import.meta.env.VITE_DEBUG_MODE || import.meta.env.VITE_DEBUG_APIS;
    if (debugMode === "true") {
      this.addValidation(
        "Debug Mode",
        "warning",
        "Debug mode is enabled - disable for production",
      );
    } else {
      this.addValidation(
        "Debug Mode",
        "pass",
        "Debug mode disabled for production",
      );
    }

    // Check error reporting
    const errorReporting = import.meta.env.VITE_ENABLE_ERROR_REPORTING;
    if (errorReporting === "true") {
      this.addValidation("Error Reporting", "pass", "Error reporting enabled");
    } else {
      this.addValidation(
        "Error Reporting",
        "warning",
        "Error reporting disabled - consider enabling for production monitoring",
      );
    }

    // Check CORS configuration
    const corsEnabled = import.meta.env.VITE_CORS_ENABLED;
    if (corsEnabled === "true") {
      this.addValidation("CORS", "pass", "CORS enabled for API access");
    }
  }

  /**
   * Validate performance configuration
   */
  private async validatePerformanceConfiguration(): Promise<void> {
    // Check cache configuration
    const cacheEnabled = import.meta.env.VITE_CACHE_PREDICTIONS;
    if (cacheEnabled === "true") {
      this.addValidation(
        "Caching",
        "pass",
        "Prediction caching enabled for performance",
      );
    } else {
      this.addValidation(
        "Caching",
        "warning",
        "Prediction caching disabled - may impact performance",
      );
    }

    // Check parallel processing
    const parallelProcessing = import.meta.env.VITE_PARALLEL_PROCESSING;
    if (parallelProcessing === "true") {
      this.addValidation(
        "Parallel Processing",
        "pass",
        "Parallel processing enabled",
      );
    }

    // Check WebSocket configuration
    const websocketEnabled = import.meta.env.VITE_WEBSOCKET_ENABLED;
    if (websocketEnabled === "true") {
      this.addValidation(
        "WebSocket",
        "pass",
        "Real-time updates via WebSocket enabled",
      );
    }
  }

  /**
   * Add validation result
   */
  private addValidation(
    service: string,
    status: "pass" | "warning" | "fail",
    message: string,
    details?: any,
  ): void {
    this.validations.push({ service, status, message, details });
  }

  /**
   * Generate comprehensive production readiness report
   */
  private generateReport(): ProductionReadinessReport {
    const passes = this.validations.filter((v) => v.status === "pass").length;
    const warnings = this.validations.filter(
      (v) => v.status === "warning",
    ).length;
    const failures = this.validations.filter((v) => v.status === "fail").length;

    const total = this.validations.length;
    const readinessScore = Math.round((passes / total) * 100);

    let overallStatus: "ready" | "ready_with_warnings" | "not_ready";
    if (failures > 0) {
      overallStatus = "not_ready";
    } else if (warnings > 0) {
      overallStatus = "ready_with_warnings";
    } else {
      overallStatus = "ready";
    }

    const recommendations: string[] = [];

    if (failures > 0) {
      recommendations.push(
        "🔴 Critical issues found - resolve before production deployment",
      );
    }
    if (warnings > 0) {
      recommendations.push(
        "🟡 Warnings detected - review and address for optimal production performance",
      );
    }
    if (readinessScore >= 90) {
      recommendations.push(
        "✅ System is production-ready with excellent configuration",
      );
    } else if (readinessScore >= 75) {
      recommendations.push(
        "✅ System is production-ready with good configuration",
      );
    }

    const configuredKeys = this.validations
      .filter((v) => v.service.includes("API Key") && v.status === "pass")
      .map((v) => v.service.replace(" API Key", ""));

    const missingKeys = this.validations
      .filter((v) => v.service.includes("API Key") && v.status !== "pass")
      .map((v) => v.service.replace(" API Key", ""));

    return {
      overall_status: overallStatus,
      readiness_score: readinessScore,
      validations: this.validations,
      recommendations,
      api_keys_configured: configuredKeys,
      missing_api_keys: missingKeys,
      environment_summary: {
        backend_url:
          import.meta.env.VITE_BACKEND_URL ||
          import.meta.env.VITE_API_URL ||
          "Not configured",
        node_env:
          import.meta.env.NODE_ENV || import.meta.env.VITE_ENV || "development",
        feature_flags: {
          real_time_odds: import.meta.env.VITE_ENABLE_REAL_TIME_ODDS === "true",
          live_predictions:
            import.meta.env.VITE_ENABLE_LIVE_PREDICTIONS === "true",
          advanced_analytics:
            import.meta.env.VITE_ENABLE_ADVANCED_ANALYTICS === "true",
          enhanced_revolutionary:
            import.meta.env.VITE_ENABLE_ENHANCED_REVOLUTIONARY === "true",
          websocket: import.meta.env.VITE_WEBSOCKET_ENABLED === "true",
          auto_betting: import.meta.env.VITE_ENABLE_AUTO_BETTING === "true",
        },
      },
    };
  }

  /**
   * Quick production readiness check
   */
  async quickValidation(): Promise<{
    ready: boolean;
    critical_issues: string[];
  }> {
    const criticalChecks = [
      {
        check: "Backend URL configured",
        valid: !!(
          import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL
        ),
      },
      {
        check: "At least one API key configured",
        valid: !!(
          import.meta.env.VITE_THEODDS_API_KEY ||
          import.meta.env.VITE_SPORTRADAR_API_KEY
        ),
      },
      {
        check: "Enhanced services enabled",
        valid: import.meta.env.VITE_ENABLE_ENHANCED_REVOLUTIONARY === "true",
      },
    ];

    const criticalIssues = criticalChecks
      .filter((check) => !check.valid)
      .map((check) => check.check);

    return {
      ready: criticalIssues.length === 0,
      critical_issues: criticalIssues,
    };
  }
}

// Export singleton instance
export const productionValidationService = new ProductionValidationService();
export default productionValidationService;
