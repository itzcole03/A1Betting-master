import React from 'react';
interface BettingCardProps {
    title?: string;
    odds?: string;
    team1?: string;
    team2?: string;
    sport?: string;
    time?: string;
    onClick?: () => void;
}
declare const BettingCard: React.FC<BettingCardProps>;
export default BettingCard;
