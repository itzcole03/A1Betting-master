import React from 'react';
import type { BettingStats as BettingStatsType, ModelPerformance } from '@/types/betting';
interface BettingStatsProps {
    stats: BettingStatsType;
    modelPerformance: ModelPerformance[];
}
declare const _default: React.NamedExoticComponent<BettingStatsProps>;
export default _default;
