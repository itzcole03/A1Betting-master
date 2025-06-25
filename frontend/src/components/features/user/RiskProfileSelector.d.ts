import React from 'react';
import { RiskProfileType } from '@/types/betting';
interface RiskProfileSelectorProps {
    currentProfile: RiskProfileType;
    onProfileChange: (profile: RiskProfileType) => void;
}
export declare const RiskProfileSelector: React.FC<RiskProfileSelectorProps>;
export {};
