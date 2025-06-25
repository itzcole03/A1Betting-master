import React from 'react';
import { PrizePicksProps, SocialSentimentData } from '@/types';
interface PropCardProps {
    prop: PrizePicksProps;
    sentiment?: SocialSentimentData;
    onViewDetails: (propId: string) => void;
    className?: string;
}
declare const _default: React.NamedExoticComponent<PropCardProps>;
export default _default;
