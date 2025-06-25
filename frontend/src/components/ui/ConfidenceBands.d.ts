import React from 'react';
export interface ConfidenceBandsProps {
    lower: number;
    upper: number;
    mean: number;
}
declare const ConfidenceBands: React.FC<ConfidenceBandsProps>;
export default ConfidenceBands;
