import React from 'react';
import { Bet } from '../../types/betting';
interface BetSlipProps {
    onPlaceBet: (bet: Omit<Bet, 'id' | 'status' | 'timestamp'>) => void;
}
declare const _default: React.NamedExoticComponent<BetSlipProps>;
export default _default;
