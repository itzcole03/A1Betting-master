import React from 'react';
import { BetRecommendation } from '@/types/betting';
interface UnifiedBettingInterfaceProps {
    initialBankroll: number;
    onBetPlaced: (bet: BetRecommendation) => void;
    darkMode?: boolean;
    onDarkModeChange?: (darkMode: boolean) => void;
}
export declare const UnifiedBettingInterface: React.FC<UnifiedBettingInterfaceProps>;
export {};
