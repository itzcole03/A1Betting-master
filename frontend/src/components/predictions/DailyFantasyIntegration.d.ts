import React from 'react';
interface DailyFantasyData {
    playerId: string;
    playerName: string;
    team: string;
    position: string;
    salary: number;
    projectedPoints: number;
    actualPoints?: number;
    ownershipPercentage?: number;
    valueScore?: number;
}
interface DailyFantasyIntegrationProps {
    onDataUpdate: (data: DailyFantasyData[]) => void;
    sport: string;
    date: string;
}
export declare const DailyFantasyIntegration: React.FC<DailyFantasyIntegrationProps>;
export {};
