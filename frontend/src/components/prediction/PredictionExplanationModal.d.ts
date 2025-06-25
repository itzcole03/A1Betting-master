import React from 'react';
import { PredictionWithExplanation } from '../../core/types/prediction';
interface PredictionExplanationModalProps {
    open: boolean;
    onClose: () => void;
    prediction: PredictionWithExplanation;
}
export declare const PredictionExplanationModal: React.FC<PredictionExplanationModalProps>;
export {};
