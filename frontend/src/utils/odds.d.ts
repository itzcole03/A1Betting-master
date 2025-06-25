import type { LineupType } from './common';
import type { PlayerProp, Entry } from '@/core';
/**
 * Convert American odds to decimal format
 */
export declare const oddsToDecimal: (odds: string) => number;
/**
 * Calculate potential payout for a parlay bet
 */
export declare const calculatePotentialPayout: (entry: number, odds: string[]) => number;
/**
 * Calculate win probability based on historical percentages
 */
export declare const calculateWinProbability: (percentages: number[]) => number;
/**
 * Generate a random odds change for simulation
 */
export declare const generateRandomOddsChange: (currentOdds: string) => string;
/**
 * Format currency values
 */
export declare const formatCurrency: (amount: number) => string;
/**
 * Calculate progress percentage
 */
export declare const calculateProgressPercentage: (current: number, target: number) => number;
/**
 * Calculate implied probability from odds
 */
export declare const calculateImpliedProbability: (odds: string) => number;
/**
 * Calculate Kelly Criterion bet size
 */
export declare const calculateKellyBet: (bankroll: number, probability: number, odds: string) => number;
export declare const americanToDecimal: (americanOdds: number) => number;
export declare const decimalToAmerican: (decimalOdds: number) => number;
export declare const calculateImpliedProbabilityDecimal: (decimalOdds: number) => number;
interface WinFactors {
    form?: number;
    weather?: number;
    rest?: number;
}
export declare const calculateWinProbabilityFactors: (prop: PlayerProp, factors: WinFactors) => number;
export declare const calculateKellyCriterion: (probability: number, decimalOdds: number, bankroll: number, fraction?: number) => number;
export declare const calculateParlayOdds: (decimalOdds: number[]) => number;
export declare const calculatePotentialPayoutDecimal: (stake: number, odds: number, type?: "american" | "decimal") => number;
export declare const formatCurrencyDecimal: (amount: number) => string;
export declare const formatPercentage: (value: number) => string;
export declare const getRiskMultiplier: (type: LineupType) => number;
export declare const calculateEntryProgress: (entry: Entry) => number;
export declare const formatOdds: (odds: number, format?: "american" | "decimal") => string;
export declare const calculateArbitrage: (odds1: number, odds2: number, stake: number) => {
    profit: number;
    split: [number, number];
} | null;
export declare const calculateValueRating: (impliedProbability: number, modelProbability: number) => number;
export {};
