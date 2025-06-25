import React from 'react';
export interface EnhancedPropCardProps {
    playerName: string;
    team: string;
    position: string;
    statType: string;
    line: number;
    overOdds: number;
    underOdds: number;
    sentiment?: string;
    aiBoost?: number;
    patternStrength?: number;
    bonusPercent?: number;
    enhancementPercent?: number;
    pickType?: 'demon' | 'goblin' | 'normal';
    trendValue?: number;
    gameInfo?: {
        opponent: string;
        day: string;
        time: string;
    };
    playerImageUrl?: string;
    onSelect?: (pick: 'over' | 'under') => void;
    onViewDetails?: () => void;
    selected?: boolean;
    className?: string;
}
export declare const EnhancedPropCard: React.FC<EnhancedPropCardProps>;
export default EnhancedPropCard;
