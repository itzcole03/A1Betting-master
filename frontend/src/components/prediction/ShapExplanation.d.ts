import React from 'react';
import { ModelExplanation } from '../../core/types/prediction';
interface ShapExplanationProps {
    explanation: ModelExplanation;
    className?: string;
}
export declare const ShapExplanation: React.FC<ShapExplanationProps>;
export {};
