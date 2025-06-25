import { z } from 'zod';
import { HistoricalGameData, PlayerStats, TeamStats, VenueStats, OfficialStats } from '../../data/HistoricalDataService';
export declare const FeatureSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodNumber;
    importance: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    value: number;
    name: string;
    importance: number;
    metadata?: Record<string, unknown> | undefined;
}, {
    value: number;
    name: string;
    importance: number;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const FeatureSetSchema: z.ZodObject<{
    features: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodNumber;
        importance: z.ZodNumber;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        name: string;
        importance: number;
        metadata?: Record<string, unknown> | undefined;
    }, {
        value: number;
        name: string;
        importance: number;
        metadata?: Record<string, unknown> | undefined;
    }>, "many">;
    timestamp: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    features: {
        value: number;
        name: string;
        importance: number;
        metadata?: Record<string, unknown> | undefined;
    }[];
    timestamp: string;
    metadata?: Record<string, unknown> | undefined;
}, {
    features: {
        value: number;
        name: string;
        importance: number;
        metadata?: Record<string, unknown> | undefined;
    }[];
    timestamp: string;
    metadata?: Record<string, unknown> | undefined;
}>;
export type Feature = z.infer<typeof FeatureSchema>;
export type FeatureSet = z.infer<typeof FeatureSetSchema>;
export interface FeatureEngineeringConfig {
    windowSizes: number[];
    smoothingFactors: number[];
    featureGroups: string[];
    importanceThreshold: number;
    validationConfig: {
        strict: boolean;
        allowPartial: boolean;
    };
}
export declare class AdvancedFeatureEngineeringService {
    private logger;
    private errorHandler;
    private config;
    private featureCache;
    constructor(config: FeatureEngineeringConfig);
    initialize(): Promise<void>;
    generateFeatures(data: {
        gameData?: HistoricalGameData[];
        playerStats?: PlayerStats[];
        teamStats?: TeamStats[];
        venueStats?: VenueStats[];
        officialStats?: OfficialStats[];
    }, options?: {
        includeRolling?: boolean;
        includeExponential?: boolean;
        includeInteraction?: boolean;
        includeAdvanced?: boolean;
    }): Promise<FeatureSet>;
    private generateGameFeatures;
    private generatePlayerFeatures;
    private generateTeamFeatures;
    private generateVenueFeatures;
    private generateOfficialFeatures;
    private calculateBasicGameFeatures;
    private calculateRollingAverages;
    private calculateExponentialSmoothing;
    private calculateInteractionFeatures;
    private calculateAdvancedGameFeatures;
    private calculateBasicPlayerFeatures;
    private calculatePlayerRollingAverages;
    private calculatePlayerExponentialSmoothing;
    private calculatePlayerInteractionFeatures;
    private calculateAdvancedPlayerFeatures;
    private calculateBasicTeamFeatures;
    private calculateTeamRollingAverages;
    private calculateTeamExponentialSmoothing;
    private calculateTeamInteractionFeatures;
    private calculateAdvancedTeamFeatures;
    private calculateBasicVenueFeatures;
    private calculateWeatherImpactFeatures;
    private calculateSurfaceImpactFeatures;
    private calculateAltitudeImpactFeatures;
    private calculateBasicOfficialFeatures;
    private calculateOfficialTendencyFeatures;
    private calculateOfficialBiasFeatures;
    private calculateOfficialConsistencyFeatures;
    private validateData;
}
