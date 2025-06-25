import React from 'react';
interface BettingOpportunity {
    id: string;
    description: string;
    odds: number;
    confidence: number;
    expectedValue: number;
    kellySize: number;
    models: string[];
}
interface UltimateMoneyMakerProps {
    opportunities: BettingOpportunity[];
    onPlaceBet: (opportunity: BettingOpportunity) => Promise<void>;
}
export declare const UltimateMoneyMaker: React.FC<Omit<UltimateMoneyMakerProps, 'predictions'>>;
export {};
