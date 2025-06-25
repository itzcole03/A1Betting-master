import { useState, useCallback, useEffect } from 'react';
import { EventBus } from '../unified/EventBus';
import { ErrorHandler } from '../unified/ErrorHandler';
import { PerformanceMonitor } from '../unified/PerformanceMonitor';
import { RiskProfileService } from '../services/risk/RiskProfileService';
export function useRiskProfile() {
    // const [riskProfile, setRiskProfile] = useState<RiskProfile>(); // This state is derived from activeProfile from the service
    const [activeProfile, setActiveProfile] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const validateBet = useCallback((bet) => {
        const errors = [];
        if (!activeProfile) {
            errors.push('No active risk profile found. Cannot validate bet.');
            return { isValid: false, errors };
        }
        // Assuming RiskProfile has maxStake and confidenceThreshold from core.ts
        // These might be optional, so handle potential undefined values
        const { maxStake, confidenceThreshold } = activeProfile;
        if (typeof maxStake === 'number' && bet.stake > maxStake) {
            errors.push(`Bet stake (${bet.stake}) exceeds the maximum allowed stake (${maxStake}).`);
        }
        if (typeof confidenceThreshold === 'number' && bet.confidence < confidenceThreshold) {
            errors.push(`Bet confidence (${bet.confidence}) is below the minimum required threshold (${confidenceThreshold}).`);
        }
        // TODO: Add more validation rules based on other RiskProfile properties like:
        // - activeProfile.allowedSports
        // - activeProfile.allowedMarkets
        // - activeProfile.betLimits (e.g., maxDailyLoss, maxExposure)
        // - activeProfile.kellyMultiplierSettings (related to bet.kellyFraction)
        return { isValid: errors.length === 0, errors };
    }, [activeProfile]);
    const riskProfileService = RiskProfileService.getInstance();
    const eventBus = EventBus.getInstance();
    const errorHandler = ErrorHandler.getInstance();
    const performanceMonitor = PerformanceMonitor.getInstance();
    // Load initial profiles
    useEffect(() => {
        const loadProfiles = async () => {
            try {
                setIsLoading(true);
                const allProfiles = riskProfileService.getAllProfiles();
                const currentProfile = riskProfileService.getActiveProfile();
                setProfiles(allProfiles);
                setActiveProfile(currentProfile);
                setError(null);
            }
            catch (err) {
                const error = err;
                setError(error);
                errorHandler.handleError(error, 'load_risk_profiles');
            }
            finally {
                setIsLoading(false);
            }
        };
        loadProfiles();
    }, []);
    // Subscribe to profile updates
    useEffect(() => {
        const handleProfileUpdate = (data) => {
            const updatedProfile = riskProfileService.getProfile(data.profileId);
            if (updatedProfile) {
                setProfiles(prev => prev.map(p => (p.id === updatedProfile.id ? updatedProfile : p)));
                if (activeProfile?.id === updatedProfile.id) {
                    setActiveProfile(updatedProfile);
                }
            }
        };
        const handleProfileActivation = (data) => {
            const newActiveProfile = riskProfileService.getProfile(data.profileId);
            if (newActiveProfile) {
                setActiveProfile(newActiveProfile);
            }
        };
        eventBus.on('risk:profile:updated', handleProfileUpdate);
        eventBus.on('risk:profile:activated', handleProfileActivation);
        return () => {
            eventBus.off('risk:profile:updated', handleProfileUpdate);
            eventBus.off('risk:profile:activated', handleProfileActivation);
        };
    }, [activeProfile?.id]);
    const updateProfile = useCallback(async (profile) => {
        try {
            const startTime = Date.now();
            riskProfileService.updateProfile(profile);
            performanceMonitor.trackMetric('profile_update_duration', Date.now() - startTime);
            return true;
        }
        catch (err) {
            const error = err;
            setError(error);
            errorHandler.handleError(error, 'update_risk_profile');
            return false;
        }
    }, []);
    const setActiveProfileById = useCallback(async (profileId) => {
        try {
            const startTime = Date.now();
            riskProfileService.setActiveProfile(profileId);
            performanceMonitor.trackMetric('profile_activation_duration', Date.now() - startTime);
            return true;
        }
        catch (err) {
            const error = err;
            setError(error);
            errorHandler.handleError(error, 'activate_risk_profile');
            return false;
        }
    }, []);
    return {
        activeProfile,
        profiles,
        isLoading,
        error,
        updateProfile,
        setActiveProfile: setActiveProfileById,
    };
}
