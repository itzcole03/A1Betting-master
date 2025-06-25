import React from 'react';
import { BettingStrategy, RiskProfile } from '../../types/betting';
import { Event, Market, Odds, Selection } from '../../types/sports';
interface BettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
    market: Market;
    selection: Selection;
    odds: Odds;
    confidenceScore: number;
    expectedValue: number;
    kellyFraction: number;
    riskProfile: RiskProfile;
    selectedStrategy: BettingStrategy;
    onStrategyChange: (strategy: BettingStrategy) => void;
    stake: number;
    onStakeChange: (stake: number) => void;
    onPlaceBet: () => void;
    isLoading: boolean;
    error: string | null;
}
export declare const BettingModal: React.FC<BettingModalProps>;
export {};
