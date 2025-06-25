import React from 'react';
import { EntryStatus } from '@/types';
interface ProgressBarProps {
    current: number;
    target: number;
    status: EntryStatus;
    showPercentage?: boolean;
    className?: string;
    showGlow?: boolean;
    animated?: boolean;
}
export declare const ProgressBar: React.FC<ProgressBarProps>;
export {};
