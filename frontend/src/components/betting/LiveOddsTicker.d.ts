import React from 'react';
import { BettingEvent } from '../../types/betting';
interface LiveOddsTickerProps {
    events: BettingEvent[];
    onEventSelect: (event: BettingEvent) => void;
    loading: boolean;
    error: Error | null;
}
export declare const LiveOddsTicker: React.FC<LiveOddsTickerProps>;
export {};
