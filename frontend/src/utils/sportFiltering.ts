/**
 * Unified Sport Filtering Utilities
 * Centralizes all sport filtering logic to ensure consistency across components
 */

import {
  getSportConfig,
  normalizeSportId,
  UNIFIED_SPORTS,
  SportKey,
} from "@/constants/unifiedSports";

// Generic interface for items that can be filtered by sport
export interface SportFilterable {
  sport: string;
  [key: string]: any;
}

// Enhanced filtering options
export interface SportFilterOptions {
  sport: string;
  includeAll?: boolean;
  caseSensitive?: boolean;
  allowPartialMatch?: boolean;
  mapSportNames?: Record<string, string>; // Maps alternative sport names to standard ones
}

/**
 * Filters an array of items by sport with intelligent matching
 */
export function filterBySport<T extends SportFilterable>(
  items: T[],
  options: SportFilterOptions,
): T[] {
  const {
    sport,
    includeAll = true,
    caseSensitive = false,
    allowPartialMatch = true,
    mapSportNames = {},
  } = options;

  // If "all" is selected and we include all, return everything
  if (
    includeAll &&
    (sport === UNIFIED_SPORTS.ALL || sport === "all" || !sport)
  ) {
    return items;
  }

  const normalizedTargetSport = caseSensitive ? sport : sport.toLowerCase();

  return items.filter((item) => {
    if (!item.sport) return false;

    let itemSport = item.sport;

    // Apply sport name mapping if provided
    if (mapSportNames[itemSport]) {
      itemSport = mapSportNames[itemSport];
    }

    const normalizedItemSport = caseSensitive
      ? itemSport
      : itemSport.toLowerCase();

    // Exact match
    if (normalizedItemSport === normalizedTargetSport) {
      return true;
    }

    // Partial match if enabled
    if (allowPartialMatch) {
      return (
        normalizedItemSport.includes(normalizedTargetSport) ||
        normalizedTargetSport.includes(normalizedItemSport)
      );
    }

    return false;
  });
}

/**
 * Extracts unique sports from an array of items
 */
export function extractUniqueSports<T extends SportFilterable>(
  items: T[],
  options: {
    includeAll?: boolean;
    normalize?: boolean;
    sort?: boolean;
  } = {},
): string[] {
  const { includeAll = true, normalize = true, sort = true } = options;

  const sportsSet = new Set<string>();

  items.forEach((item) => {
    if (item.sport) {
      const sport = normalize ? normalizeSportId(item.sport) : item.sport;
      sportsSet.add(sport);
    }
  });

  let sports = Array.from(sportsSet);

  if (includeAll) {
    sports.unshift(UNIFIED_SPORTS.ALL);
  }

  if (sort) {
    sports.sort((a, b) => {
      if (a === UNIFIED_SPORTS.ALL) return -1;
      if (b === UNIFIED_SPORTS.ALL) return 1;
      return a.localeCompare(b);
    });
  }

  return sports;
}

/**
 * Validates if a sport filter is valid
 */
export function isValidSportFilter(sport: string): boolean {
  if (!sport) return false;
  if (sport === UNIFIED_SPORTS.ALL || sport === "all") return true;
  return getSportConfig(sport) !== null;
}

/**
 * Normalizes sport filters for consistent handling
 */
export function normalizeSportFilter(sport: string): SportKey {
  if (!sport || sport === "all") return UNIFIED_SPORTS.ALL;
  return normalizeSportId(sport);
}

/**
 * Creates a sport filter function for use with Array.filter()
 */
export function createSportFilter<T extends SportFilterable>(
  targetSport: string,
  options: Omit<SportFilterOptions, "sport"> = {},
) {
  return (item: T): boolean => {
    return filterBySport([item], { sport: targetSport, ...options }).length > 0;
  };
}

/**
 * Groups items by sport
 */
export function groupBySport<T extends SportFilterable>(
  items: T[],
  options: {
    normalize?: boolean;
    includeEmptySports?: boolean;
  } = {},
): Record<string, T[]> {
  const { normalize = true } = options;

  const groups: Record<string, T[]> = {};

  items.forEach((item) => {
    if (!item.sport) return;

    const sport = normalize ? normalizeSportId(item.sport) : item.sport;

    if (!groups[sport]) {
      groups[sport] = [];
    }

    groups[sport].push(item);
  });

  return groups;
}

/**
 * Counts items by sport
 */
export function countBySport<T extends SportFilterable>(
  items: T[],
  normalize: boolean = true,
): Record<string, number> {
  const groups = groupBySport(items, { normalize });
  const counts: Record<string, number> = {};

  Object.keys(groups).forEach((sport) => {
    counts[sport] = groups[sport].length;
  });

  return counts;
}

/**
 * Common sport name mappings for backward compatibility
 */
export const COMMON_SPORT_MAPPINGS: Record<string, string> = {
  // Handle various naming conventions
  basketball: UNIFIED_SPORTS.NBA,
  football: UNIFIED_SPORTS.NFL,
  baseball: UNIFIED_SPORTS.MLB,
  hockey: UNIFIED_SPORTS.NHL,
  golf: UNIFIED_SPORTS.PGA,
  mma: UNIFIED_SPORTS.MMA,
  ufc: UNIFIED_SPORTS.MMA,
  esport: UNIFIED_SPORTS.ESPORTS,
  gaming: UNIFIED_SPORTS.ESPORTS,

  // Handle case variations
  NBA: UNIFIED_SPORTS.NBA,
  NFL: UNIFIED_SPORTS.NFL,
  MLB: UNIFIED_SPORTS.MLB,
  NHL: UNIFIED_SPORTS.NHL,
  WNBA: UNIFIED_SPORTS.WNBA,
  PGA: UNIFIED_SPORTS.PGA,
  MMA: UNIFIED_SPORTS.MMA,
  Soccer: UNIFIED_SPORTS.SOCCER,
  Tennis: UNIFIED_SPORTS.TENNIS,
  Esports: UNIFIED_SPORTS.ESPORTS,

  // Handle alternative names
  futbol: UNIFIED_SPORTS.SOCCER,
  football_eu: UNIFIED_SPORTS.SOCCER,
  american_football: UNIFIED_SPORTS.NFL,
};

/**
 * High-level filtering function that handles common use cases
 */
export function filterSportData<T extends SportFilterable>(
  items: T[],
  selectedSport: string,
  options: {
    useCommonMappings?: boolean;
    allowPartialMatch?: boolean;
    caseSensitive?: boolean;
  } = {},
): T[] {
  const {
    useCommonMappings = true,
    allowPartialMatch = true,
    caseSensitive = false,
  } = options;

  return filterBySport(items, {
    sport: selectedSport,
    includeAll: true,
    caseSensitive,
    allowPartialMatch,
    mapSportNames: useCommonMappings ? COMMON_SPORT_MAPPINGS : {},
  });
}
