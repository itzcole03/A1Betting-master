import React from 'react';
import { MoneyMakerConfig as ConfigType } from '@/types';
interface Props {
    onConfigChange: (config: ConfigType) => void;
    onActivate: () => void;
    onDeactivate: () => void;
    isActive: boolean;
}
export declare const MoneyMakerConfig: React.FC<Props>;
export {};
