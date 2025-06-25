/**
 * Sport Selection Testing Utilities
 * Helps identify and prevent sport dropdown/selection regressions
 */

import {
  UNIFIED_SPORTS,
  getActiveSports,
  getSportConfig,
  SportConfig,
} from "@/constants/unifiedSports";
import {
  filterSportData,
  isValidSportFilter,
  normalizeSportFilter,
} from "@/utils/sportFiltering";

// Test data interfaces
export interface TestBettingOpportunity {
  id: string;
  sport: string;
  game: string;
  confidence: number;
}

export interface TestPlayerProp {
  id: string;
  sport: string;
  player: string;
  confidence: number;
}

// Generate test data for various sports
export const generateTestData = () => {
  const sports = ["nba", "nfl", "mlb", "soccer", "tennis"];

  const bettingOpportunities: TestBettingOpportunity[] = sports.flatMap(
    (sport) =>
      Array.from({ length: 3 }, (_, i) => ({
        id: `bet_${sport}_${i}`,
        sport,
        game: `Test Game ${sport.toUpperCase()} ${i + 1}`,
        confidence: 70 + Math.random() * 25,
      })),
  );

  const playerProps: TestPlayerProp[] = sports.flatMap((sport) =>
    Array.from({ length: 5 }, (_, i) => ({
      id: `prop_${sport}_${i}`,
      sport,
      player: `Test Player ${sport.toUpperCase()} ${i + 1}`,
      confidence: 60 + Math.random() * 35,
    })),
  );

  return { bettingOpportunities, playerProps };
};

// Sport filtering regression tests
export const runSportFilteringTests = () => {
  const testResults: Array<{
    test: string;
    passed: boolean;
    details?: string;
  }> = [];
  const { bettingOpportunities, playerProps } = generateTestData();

  // Test 1: All sports filter should return all data
  try {
    const filteredBets = filterSportData(
      bettingOpportunities,
      UNIFIED_SPORTS.ALL,
    );
    const filteredProps = filterSportData(playerProps, UNIFIED_SPORTS.ALL);

    const passed =
      filteredBets.length === bettingOpportunities.length &&
      filteredProps.length === playerProps.length;

    testResults.push({
      test: "All sports filter",
      passed,
      details: passed
        ? undefined
        : `Expected ${bettingOpportunities.length} bets and ${playerProps.length} props, got ${filteredBets.length} and ${filteredProps.length}`,
    });
  } catch (error) {
    testResults.push({
      test: "All sports filter",
      passed: false,
      details: `Error: ${(error as Error).message}`,
    });
  }

  // Test 2: Specific sport filters should work
  const testSports = ["nba", "nfl", "mlb"];

  testSports.forEach((sport) => {
    try {
      const filteredBets = filterSportData(bettingOpportunities, sport);
      const filteredProps = filterSportData(playerProps, sport);

      const expectedBets = bettingOpportunities.filter(
        (bet) => bet.sport === sport,
      ).length;
      const expectedProps = playerProps.filter(
        (prop) => prop.sport === sport,
      ).length;

      const passed =
        filteredBets.length === expectedBets &&
        filteredProps.length === expectedProps;

      testResults.push({
        test: `${sport.toUpperCase()} sport filter`,
        passed,
        details: passed
          ? undefined
          : `Expected ${expectedBets} bets and ${expectedProps} props, got ${filteredBets.length} and ${filteredProps.length}`,
      });
    } catch (error) {
      testResults.push({
        test: `${sport.toUpperCase()} sport filter`,
        passed: false,
        details: `Error: ${(error as Error).message}`,
      });
    }
  });

  // Test 3: Case insensitive filtering
  try {
    const filteredBetsLower = filterSportData(bettingOpportunities, "nba");
    const filteredBetsUpper = filterSportData(bettingOpportunities, "NBA");

    const passed =
      filteredBetsLower.length === filteredBetsUpper.length &&
      filteredBetsLower.length > 0;

    testResults.push({
      test: "Case insensitive filtering",
      passed,
      details: passed
        ? undefined
        : `Case sensitivity issue: lowercase gave ${filteredBetsLower.length}, uppercase gave ${filteredBetsUpper.length}`,
    });
  } catch (error) {
    testResults.push({
      test: "Case insensitive filtering",
      passed: false,
      details: `Error: ${(error as Error).message}`,
    });
  }

  // Test 4: Sport normalization
  try {
    const testCases = [
      { input: "nba", expected: "nba" },
      { input: "NBA", expected: "nba" },
      { input: "all", expected: "all" },
      { input: "invalid-sport", expected: "all" },
    ];

    let passed = true;
    let details = "";

    testCases.forEach((testCase) => {
      const result = normalizeSportFilter(testCase.input);
      if (result !== testCase.expected) {
        passed = false;
        details += `Input "${testCase.input}" returned "${result}", expected "${testCase.expected}". `;
      }
    });

    testResults.push({
      test: "Sport normalization",
      passed,
      details: passed ? undefined : details.trim(),
    });
  } catch (error) {
    testResults.push({
      test: "Sport normalization",
      passed: false,
      details: `Error: ${(error as Error).message}`,
    });
  }

  // Test 5: Sport validation
  try {
    const validSports = ["all", "nba", "nfl", "mlb"];
    const invalidSports = ["invalid", "", "basketball"];

    let passed = true;
    let details = "";

    validSports.forEach((sport) => {
      if (!isValidSportFilter(sport)) {
        passed = false;
        details += `Valid sport "${sport}" failed validation. `;
      }
    });

    invalidSports.forEach((sport) => {
      if (sport && isValidSportFilter(sport)) {
        passed = false;
        details += `Invalid sport "${sport}" passed validation. `;
      }
    });

    testResults.push({
      test: "Sport validation",
      passed,
      details: passed ? undefined : details.trim(),
    });
  } catch (error) {
    testResults.push({
      test: "Sport validation",
      passed: false,
      details: `Error: ${(error as Error).message}`,
    });
  }

  // Test 6: Available sports consistency
  try {
    const activeSports = getActiveSports(true);
    const passed =
      activeSports.length > 0 &&
      activeSports.some((sport) => sport.id === UNIFIED_SPORTS.ALL) &&
      activeSports.every((sport) => getSportConfig(sport.id) !== null);

    testResults.push({
      test: "Available sports consistency",
      passed,
      details: passed
        ? undefined
        : `Found ${activeSports.length} sports, issues with sport config consistency`,
    });
  } catch (error) {
    testResults.push({
      test: "Available sports consistency",
      passed: false,
      details: `Error: ${(error as Error).message}`,
    });
  }

  return testResults;
};

// Component integration test helpers
export const validateSportDropdownIntegration = (
  componentName: string,
  selectedSport: string,
  availableSports: string[],
  onSportChange: (sport: string) => void,
) => {
  const issues: string[] = [];

  // Check if selected sport is valid
  if (!isValidSportFilter(selectedSport)) {
    issues.push(`Invalid selected sport: "${selectedSport}"`);
  }

  // Check if selected sport is in available options
  if (
    !availableSports.includes(selectedSport) &&
    selectedSport !== UNIFIED_SPORTS.ALL
  ) {
    issues.push(`Selected sport "${selectedSport}" not in available options`);
  }

  // Check if "All" option is available when it should be
  if (
    !availableSports.includes(UNIFIED_SPORTS.ALL) &&
    !availableSports.includes("all")
  ) {
    issues.push('Missing "All Sports" option');
  }

  // Check for empty options
  if (availableSports.length === 0) {
    issues.push("No sport options available");
  }

  // Check for duplicate options
  const uniqueSports = new Set(availableSports);
  if (uniqueSports.size !== availableSports.length) {
    issues.push("Duplicate sport options detected");
  }

  // Test the onChange function
  try {
    onSportChange(UNIFIED_SPORTS.NBA);
    // Function should not throw an error
  } catch (error) {
    issues.push(`onSportChange function error: ${(error as Error).message}`);
  }

  return {
    componentName,
    isValid: issues.length === 0,
    issues,
    recommendations:
      issues.length > 0
        ? [
            "Use UnifiedSportSelector component",
            "Implement useUnifiedSportFilter hook",
            "Validate sport filters using isValidSportFilter",
            "Use normalizeSportFilter for consistent sport handling",
          ]
        : [],
  };
};

// Performance test for sport filtering
export const testSportFilteringPerformance = (dataSize: number = 1000) => {
  const sports = ["nba", "nfl", "mlb", "soccer", "tennis"];

  // Generate large test dataset
  const largeDataset = Array.from({ length: dataSize }, (_, i) => ({
    id: `item_${i}`,
    sport: sports[i % sports.length],
    data: `Test data ${i}`,
  }));

  const performanceResults: Array<{ operation: string; timeMs: number }> = [];

  // Test filtering performance
  sports.forEach((sport) => {
    const startTime = performance.now();
    filterSportData(largeDataset, sport);
    const endTime = performance.now();

    performanceResults.push({
      operation: `Filter ${dataSize} items by ${sport}`,
      timeMs: endTime - startTime,
    });
  });

  // Test "all" filter performance
  const startTime = performance.now();
  filterSportData(largeDataset, UNIFIED_SPORTS.ALL);
  const endTime = performance.now();

  performanceResults.push({
    operation: `Filter ${dataSize} items by "all"`,
    timeMs: endTime - startTime,
  });

  return performanceResults;
};

// Export test runner for automated testing
export const runAllSportTests = () => {
  const filteringTests = runSportFilteringTests();
  const performanceTests = testSportFilteringPerformance();

  const summary = {
    filteringTests: {
      total: filteringTests.length,
      passed: filteringTests.filter((t) => t.passed).length,
      failed: filteringTests.filter((t) => !t.passed).length,
      details: filteringTests,
    },
    performanceTests: {
      results: performanceTests,
      avgTimeMs:
        performanceTests.reduce((sum, test) => sum + test.timeMs, 0) /
        performanceTests.length,
    },
    overallHealth: filteringTests.every((t) => t.passed)
      ? "HEALTHY"
      : "ISSUES_DETECTED",
  };

  return summary;
};
