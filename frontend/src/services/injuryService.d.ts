import type { InjuryData } from '../types/core.js';
/**
 * Strictly typed injury data interface.
 */
export interface InjuryData {
    playerId: string;
    playerName: string;
    team: string;
    position: string;
    status: string;
    injuryType: string;
    description: string;
    expectedReturn: string;
    updated: string;
}
declare class InjuryService {
    private readonly config;
    private readonly client;
    private readonly eventBus;
    constructor();
    /**
     * Fetches strictly typed injury data from real API only. Emits 'injury:update' event.
     * @param params Optional filter params (strictly typed)
     * @returns InjuryData[]
     */
    getInjuries(params?: Partial<InjuryData>): Promise<InjuryData[]>;
    /**
     * Type guard for InjuryData
     * @param data unknown
     * @returns data is InjuryData
     */
    private isInjuryData;
}
export declare const injuryService: InjuryService;
export {};
