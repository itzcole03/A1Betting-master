import { PlayerProp, Entry } from '../types/core';
export declare const MIN_WIN_RATE = 0.84;
export declare function isTeamDiversified(props: PlayerProp[], maxPerTeam?: number): boolean;
/**
 * Returns the multiplier for a given entry type.
 * Extend this logic as new types or business rules are added.
 */
export declare function getMultiplier(type: 'goblin' | 'normal' | 'demon'): number;
export declare function validateEntry(entry: Entry): string[];
