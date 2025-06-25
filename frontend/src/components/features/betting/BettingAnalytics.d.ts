import React from 'react';
import { BettingOpportunity } from '../services/bettingStrategy';
interface BettingAnalyticsProps {
    onOpportunitySelect?: (opportunity: BettingOpportunity) => void;
}
export declare const BettingAnalytics: React.FC<BettingAnalyticsProps>;
export {};
