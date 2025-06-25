import React from 'react';
interface BettingOpportunityProps {
    opportunity: {
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
            homeTeam: any;
            awayTeam: any;
        };
        arbitrage?: {
            roi: number;
            bookmakers: string[];
        };
    };
    onPlaceBet: (opportunity: any) => void;
}
export declare const BettingOpportunity: React.FC<BettingOpportunityProps>;
export {};
