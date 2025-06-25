import React from 'react';
import { ShapValue } from '../types/explainability';
interface ShapBreakdownModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: ShapValue;
}
export declare const ShapBreakdownModal: React.FC<ShapBreakdownModalProps>;
export {};
