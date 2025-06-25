// Simple test file to check basic TypeScript compilation
import React from 'react';
import { analyticsService } from '@/services/AnalyticsService';
import { predictionService } from '@/services/predictionService';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { usePredictionStore } from '@/store/predictionStore';

// Test basic type imports
import type { Sport, PropType, BetResult } from '@/types/common';
import type { LineupLeg, Lineup } from '@/types/lineup';
import type { LineupBuilderStrategy, LineupBuilderOutput } from '@/types/predictions';

const TestComponent: React.FC = () => {
  // Test that services are accessible
  const analytics = analyticsService;
  const predictions = predictionService;
  
  // Test that utilities work
  const formattedCurrency = formatCurrency(100);
  const formattedPercentage = formatPercentage(0.75);
  
  // Test that store hooks work
  const store = usePredictionStore();
  
  // Test that types are available
  const sport: Sport = "NBA";
  const propType: PropType = "POINTS";
  const betResult: BetResult = "WIN";
  
  return (
    <div>
      <h1>TypeScript Test</h1>
      <p>Analytics: {analytics ? "✓" : "✗"}</p>
      <p>Predictions: {predictions ? "✓" : "✗"}</p>
      <p>Currency: {formattedCurrency}</p>
      <p>Percentage: {formattedPercentage}</p>
      <p>Store: {store ? "✓" : "✗"}</p>
      <p>Types: {sport} - {propType} - {betResult}</p>
    </div>
  );
};

export default TestComponent;
