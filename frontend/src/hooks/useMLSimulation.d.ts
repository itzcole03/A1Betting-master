import { Prediction, PlayerStats, PlayerForm, InjuryStatus } from '@/types/betting';
export declare const useMLSimulation: () => {
    isInitialized: boolean;
    error: Error | null;
    generatePrediction: (gameId: string, playerId: string, metric: keyof PlayerStats) => Prediction;
    getTeamStats: (teamId: string) => import("../types/betting").TeamStats | undefined;
    getPlayerStats: (playerId: string) => PlayerStats | undefined;
    getGamePredictions: (gameId: string) => Prediction[];
    updatePlayerForm: (playerId: string, form: PlayerForm) => void;
    updateInjuryStatus: (playerId: string, status: InjuryStatus) => void;
};
