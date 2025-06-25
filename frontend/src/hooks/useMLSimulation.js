import { useState, useEffect, useCallback } from 'react';
import { MLSimulationService } from '../services/MLSimulationService';
export const useMLSimulation = () => {
    const [simulationService] = useState(() => new MLSimulationService());
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        try {
            simulationService.initializeSimulation();
            setIsInitialized(true);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to initialize simulation'));
        }
    }, [simulationService]);
    const generatePrediction = useCallback((gameId, playerId, metric) => {
        if (!isInitialized) {
            throw new Error('Simulation not initialized');
        }
        return simulationService.generatePrediction(gameId, playerId, metric);
    }, [simulationService, isInitialized]);
    const getTeamStats = useCallback((teamId) => {
        if (!isInitialized) {
            throw new Error('Simulation not initialized');
        }
        return simulationService.getTeamStats(teamId);
    }, [simulationService, isInitialized]);
    const getPlayerStats = useCallback((playerId) => {
        if (!isInitialized) {
            throw new Error('Simulation not initialized');
        }
        return simulationService.getPlayerStats(playerId);
    }, [simulationService, isInitialized]);
    const getGamePredictions = useCallback((gameId) => {
        if (!isInitialized) {
            throw new Error('Simulation not initialized');
        }
        return simulationService.getGamePredictions(gameId);
    }, [simulationService, isInitialized]);
    const updatePlayerForm = useCallback((playerId, form) => {
        if (!isInitialized) {
            throw new Error('Simulation not initialized');
        }
        simulationService.updatePlayerForm(playerId, form);
    }, [simulationService, isInitialized]);
    const updateInjuryStatus = useCallback((playerId, status) => {
        if (!isInitialized) {
            throw new Error('Simulation not initialized');
        }
        simulationService.updateInjuryStatus(playerId, status);
    }, [simulationService, isInitialized]);
    return {
        isInitialized,
        error,
        generatePrediction,
        getTeamStats,
        getPlayerStats,
        getGamePredictions,
        updatePlayerForm,
        updateInjuryStatus,
    };
};
