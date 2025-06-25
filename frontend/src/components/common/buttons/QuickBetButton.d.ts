import React from 'react';
import { ButtonProps } from './Button';
export interface QuickBetButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
    amount: number;
    odds: number;
    isActive?: boolean;
    isQuickBetEnabled?: boolean;
    onQuickBet?: (amount: number) => void;
}
export declare const QuickBetButton: React.FC<QuickBetButtonProps>;
