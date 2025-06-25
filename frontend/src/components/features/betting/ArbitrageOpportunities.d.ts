import React from 'react';
import type { ArbitrageOpportunity } from '@/types/betting';
interface ArbitrageOpportunitiesProps {
    opportunities: ArbitrageOpportunity[];
    onPlaceBet: (opportunity: ArbitrageOpportunity) => void;
}
declare const _default: React.NamedExoticComponent<ArbitrageOpportunitiesProps>;
export default _default;
