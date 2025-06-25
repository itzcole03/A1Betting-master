import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { RiskProfileType, DEFAULT_RISK_PROFILES } from '@/types/betting';
export const useRiskProfileStore = create()(devtools((set, get) => ({
    currentProfile: DEFAULT_RISK_PROFILES[RiskProfileType.MODERATE],
    bankroll: 1000,
    updateRiskProfile: (updates) => {
        set(state => ({
            currentProfile: {
                ...state.currentProfile,
                ...updates,
            },
        }));
    },
    updateBankroll: (amount) => {
        set({ bankroll: amount });
    },
    getMaxStake: () => {
        const { currentProfile, bankroll } = get();
        return bankroll * currentProfile.max_stake_percentage;
    },
    getRiskAdjustedStake: (baseStake) => {
        const { currentProfile, bankroll } = get();
        const maxStake = bankroll * currentProfile.max_stake_percentage;
        return Math.min(baseStake, maxStake);
    },
    setProfileType: (type) => {
        set({ currentProfile: DEFAULT_RISK_PROFILES[type] });
    },
}), { name: 'risk-profile-store' }));
