import React from 'react';
import { BetRecommendation } from '../../core/types/prediction';
interface BetRecommendationListProps {
    recommendations: BetRecommendation[];
    loading?: boolean;
    error?: string;
}
export declare const BetRecommendationList: React.FC<BetRecommendationListProps>;
export {};
