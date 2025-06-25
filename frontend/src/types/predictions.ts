// Definitions for lineup builder types used throughout the app

export interface MoneyMakerLeg {
  id: string;
  eventId: string;
  market: string;
  selection: string;
  odds: number;
  prediction: {
    probability: number;
    confidence: number;
    edge: number;
  };
}

export interface MoneyMakerOpportunity {
  id: string;
  legs: MoneyMakerLeg[];
  totalOdds: number;
  expectedValue: number;
  confidence: number;
  timestamp: number;
}

export interface LineupBuilderStrategy {
  name: string;
  description: string;
  // Add more fields as needed based on future usage
}

export interface LineupBuilderOutput {
  id: string;
  strategy: LineupBuilderStrategy;
  legs: Array<{
    eventId: string;
    market: string;
    selection: string;
    odds: number;
    prediction: {
      probability: number;
      confidence: number;
      edge: number;
    };
  }>;
  metrics: {
    confidence: number;
    expectedValue: number;
    risk: number;
    correlation: number;
  };
  createdAt: string;
}
