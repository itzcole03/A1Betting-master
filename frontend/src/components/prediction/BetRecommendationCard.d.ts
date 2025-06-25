import React from 'react';
import { BetRecommendation } from '../../core/types/prediction';
interface BetRecommendationCardProps {
    recommendation: BetRecommendation;
    onViewDetails?: () => void;
}
export declare const BetRecommendationCard: React.FC<BetRecommendationCardProps>;
export {};
