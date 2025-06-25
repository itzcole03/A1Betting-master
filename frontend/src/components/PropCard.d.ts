import React from 'react';
import { PrizePicksProjection } from '../api/PrizePicksAPI';
interface PropCardProps {
    projection: PrizePicksProjection;
    onClick: () => void;
    isSelected: boolean;
}
declare const PropCard: React.FC<PropCardProps>;
export default PropCard;
