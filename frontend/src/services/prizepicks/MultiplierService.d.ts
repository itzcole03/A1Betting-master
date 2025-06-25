import { z } from 'zod';
import { UnifiedLogger } from '../../core/logging/types';
import { UnifiedMetrics } from '../../core/metrics/types';
declare const propSchema: z.ZodObject<{
    playerId: z.ZodString;
    playerName: z.ZodString;
    statType: z.ZodString;
    line: z.ZodNumber;
    type: z.ZodEnum<["goblin", "normal", "demon"]>;
    multiplier: z.ZodNumber;
    confidence: z.ZodNumber;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    line: number;
    type: "normal" | "goblin" | "demon";
    playerName: string;
    statType: string;
    playerId: string;
    multiplier: number;
    timestamp: Date;
}, {
    confidence: number;
    line: number;
    type: "normal" | "goblin" | "demon";
    playerName: string;
    statType: string;
    playerId: string;
    multiplier: number;
    timestamp: Date;
}>;
declare const lineupSchema: z.ZodObject<{
    id: z.ZodString;
    props: z.ZodArray<z.ZodObject<{
        playerId: z.ZodString;
        playerName: z.ZodString;
        statType: z.ZodString;
        line: z.ZodNumber;
        type: z.ZodEnum<["goblin", "normal", "demon"]>;
        multiplier: z.ZodNumber;
        confidence: z.ZodNumber;
        timestamp: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        confidence: number;
        line: number;
        type: "normal" | "goblin" | "demon";
        playerName: string;
        statType: string;
        playerId: string;
        multiplier: number;
        timestamp: Date;
    }, {
        confidence: number;
        line: number;
        type: "normal" | "goblin" | "demon";
        playerName: string;
        statType: string;
        playerId: string;
        multiplier: number;
        timestamp: Date;
    }>, "many">;
    totalMultiplier: z.ZodNumber;
    totalStake: z.ZodNumber;
    potentialPayout: z.ZodNumber;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    props: {
        confidence: number;
        line: number;
        type: "normal" | "goblin" | "demon";
        playerName: string;
        statType: string;
        playerId: string;
        multiplier: number;
        timestamp: Date;
    }[];
    id: string;
    potentialPayout: number;
    totalStake: number;
    timestamp: Date;
    totalMultiplier: number;
}, {
    props: {
        confidence: number;
        line: number;
        type: "normal" | "goblin" | "demon";
        playerName: string;
        statType: string;
        playerId: string;
        multiplier: number;
        timestamp: Date;
    }[];
    id: string;
    potentialPayout: number;
    totalStake: number;
    timestamp: Date;
    totalMultiplier: number;
}>;
type Prop = z.infer<typeof propSchema>;
type Lineup = z.infer<typeof lineupSchema>;
export declare class PrizePicksMultiplierService {
    private logger;
    private metrics;
    private readonly BASE_MULTIPLIERS;
    private readonly MAX_PROPS;
    private readonly MIN_PROPS;
    private readonly MAX_TOTAL_MULTIPLIER;
    constructor(logger: UnifiedLogger, metrics: UnifiedMetrics);
    calculatePropMultiplier(prop: Prop): number;
    calculateLineupMultiplier(lineup: Lineup): number;
    validateLineup(lineup: Lineup): {
        isValid: boolean;
        errors: string[];
    };
}
export {};
