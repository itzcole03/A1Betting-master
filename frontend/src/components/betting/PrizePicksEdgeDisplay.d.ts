import React from 'react';
export interface PrizePicksEdgeDisplayProps {
    id: string;
    playerName: string;
    statType: string;
    line: number;
    overOdds: number;
    underOdds: number;
    confidence: number;
    expectedValue: number;
    kellyFraction: number;
    modelBreakdown?: Record<string, number>;
    riskReasoning?: string[];
    traceId?: string;
    showDebug?: boolean;
}
export declare const PrizePicksEdgeDisplay: React.FC<PrizePicksEdgeDisplayProps>;
