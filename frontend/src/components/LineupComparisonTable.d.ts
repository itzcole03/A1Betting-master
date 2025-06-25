import React from 'react';
import { Lineup } from '@/types';
interface LineupComparisonTableProps {
    lineups: Lineup[];
    onSelect?: (lineup: Lineup) => void;
}
export declare const LineupComparisonTable: React.FC<LineupComparisonTableProps>;
export {};
