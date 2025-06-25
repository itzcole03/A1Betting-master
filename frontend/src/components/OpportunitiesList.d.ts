import React from 'react';
interface Opportunity {
    id: string;
    event: {
        homeTeam: string;
        awayTeam: string;
        startTime: string;
        sport: string;
    };
    market: string;
    selection: string;
    odds: number;
    probability: number;
    edge: number;
    confidence: number;
    volume: number;
    sentiment?: {
        score: number;
        volume: number;
    };
    stats?: {
        homeTeam: Record<string, unknown>;
        awayTeam: Record<string, unknown>;
    };
    arbitrage?: {
        roi: number;
        bookmakers: string[];
    };
}
interface OpportunitiesListProps {
    opportunities: Opportunity[];
    onPlaceBet: (opportunity: Opportunity) => void;
}
export declare const OpportunitiesList: React.FC<OpportunitiesListProps>;
export {};
