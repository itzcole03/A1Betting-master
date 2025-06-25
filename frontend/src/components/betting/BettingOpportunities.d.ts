import React from 'react';
import { BetRecommendation, BettingAlert, BettingOpportunity } from '../../types/betting';
interface BettingOpportunitiesProps {
    opportunities: (BetRecommendation | BettingOpportunity)[];
    onBetPlacement: (opportunity: BetRecommendation | BettingOpportunity) => void;
    alerts: BettingAlert[];
    isLoading: boolean;
}
export declare const BettingOpportunities: React.FC<BettingOpportunitiesProps>;
export {};
