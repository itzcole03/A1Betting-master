import React from 'react';
interface BetFormProps {
    eventId: string;
    marketType: string;
    selection: string;
    odds: number;
    metadata: {
        sport: string;
        league: string;
        homeTeam: string;
        awayTeam: string;
        startTime: Date;
    };
}
export declare const BetForm: React.FC<BetFormProps>;
export {};
