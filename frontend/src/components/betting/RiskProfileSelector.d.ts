import React from 'react';
import type { BettingSettings } from '../../services/bettingService';
type RiskProfile = BettingSettings['riskProfile'];
interface RiskProfileSelectorProps {
    currentProfile: RiskProfile;
    onProfileChange: (profile: RiskProfile) => void;
}
export declare const RiskProfileSelector: React.FC<RiskProfileSelectorProps>;
export {};
