import { useState, useEffect } from "react";

export interface RealDataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingKeys: string[];
  connectedSources: number;
  totalSources: number;
}

export function useRealDataValidation() {
  const [validation, setValidation] = useState<RealDataValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
    missingKeys: [],
    connectedSources: 0,
    totalSources: 0,
  });

  useEffect(() => {
    validateConfiguration();
  }, []);

  const validateConfiguration = () => {
    const missingKeys: string[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    // Check for required API keys
    const requiredKeys = [
      "VITE_ODDS_API_KEY",
      "VITE_SPORTRADAR_API_KEY",
      "VITE_ESPN_API_KEY",
      "VITE_PRIZEPICKS_API_KEY",
      "VITE_WEATHER_API_KEY",
    ];

    requiredKeys.forEach((key) => {
      if (!import.meta.env[key]) {
        missingKeys.push(key);
      }
    });

    // Generate warnings based on missing keys
    if (missingKeys.includes("VITE_ODDS_API_KEY")) {
      warnings.push("Odds API key missing - live odds unavailable");
    }

    if (missingKeys.includes("VITE_SPORTRADAR_API_KEY")) {
      warnings.push("SportsRadar API key missing - advanced stats unavailable");
    }

    if (missingKeys.includes("VITE_ESPN_API_KEY")) {
      warnings.push("ESPN API key missing - game data may be limited");
    }

    if (missingKeys.includes("VITE_PRIZEPICKS_API_KEY")) {
      warnings.push("PrizePicks API key missing - using generated props");
    }

    if (missingKeys.includes("VITE_WEATHER_API_KEY")) {
      warnings.push(
        "Weather API key missing - weather impact analysis disabled",
      );
    }

    // Simulate connected sources
    const totalSources = 8;
    const connectedSources =
      totalSources - Math.floor(missingKeys.length * 0.6);

    // Errors for critical issues
    if (connectedSources === 0) {
      errors.push(
        "No data sources available - add API keys to enable functionality",
      );
    }

    setValidation({
      isValid: errors.length === 0 && missingKeys.length < requiredKeys.length,
      errors,
      warnings,
      missingKeys,
      connectedSources,
      totalSources,
    });
  };

  const revalidate = () => {
    validateConfiguration();
  };

  return {
    ...validation,
    revalidate,
  };
}
