import React from 'react';
import { BetRecommendation } from '@/types';
interface BettingOpportunitiesProps {
    opportunities: BetRecommendation[];
    onBetPlacement: (recommendation: BetRecommendation) => void;
    alerts: Array<{
        type: string;
        severity: string;
        message: string;
        metadata: Record<string, unknown>;
    }>;
    isLoading: boolean;
}
export declare const BettingOpportunities: React.FC<BettingOpportunitiesProps>;
export {};
