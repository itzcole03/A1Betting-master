import React from 'react';
export interface PredictionExplanationData {
    sentiment?: string;
    news?: string;
    playerProps?: string;
    marketMovement?: string;
}
export interface PredictionExplanationOverlayProps {
    open: boolean;
    onClose: () => void;
    data: PredictionExplanationData;
}
declare const PredictionExplanationOverlay: React.FC<PredictionExplanationOverlayProps>;
export default PredictionExplanationOverlay;
