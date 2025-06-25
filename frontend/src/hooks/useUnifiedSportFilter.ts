/**
 * Unified Sport Filter Hook
 * Provides consistent sport filtering functionality across all components
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getActiveSports,
  UNIFIED_SPORTS,
  SportConfig,
  getSportConfig,
} from "@/constants/unifiedSports";
import {
  filterSportData,
  extractUniqueSports,
  normalizeSportFilter,
} from "@/utils/sportFiltering";
import { unifiedDataService } from "@/services/unified/UnifiedDataService";
import { logger } from "@/utils/logger";

export interface SportFilterState {
  selectedSport: string;
  availableSports: SportConfig[];
  isLoading: boolean;
  error: string | null;
}

export interface SportFilterActions {
  setSport: (sport: string) => void;
  refreshSports: () => Promise<void>;
  resetToAll: () => void;
  getFilteredData: <T extends { sport: string }>(data: T[]) => T[];
  isCurrentSportValid: () => boolean;
}

export interface UseUnifiedSportFilterOptions {
  initialSport?: string;
  includeAll?: boolean;
  autoRefresh?: boolean;
  onSportChange?: (sport: string) => void;
}

/**
 * Hook for managing unified sport filtering
 */
export function useUnifiedSportFilter(
  options: UseUnifiedSportFilterOptions = {},
): SportFilterState & SportFilterActions {
  const {
    initialSport = UNIFIED_SPORTS.ALL,
    includeAll = true,
    autoRefresh = true,
    onSportChange,
  } = options;

  const [selectedSport, setSelectedSport] = useState<string>(
    normalizeSportFilter(initialSport),
  );
  const [availableSports, setAvailableSports] = useState<SportConfig[]>(
    getActiveSports(includeAll),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available sports from API
  const refreshSports = useCallback(async () => {
    if (!autoRefresh) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiSports = await unifiedDataService.getAvailableSports();

      // Convert API sport IDs to SportConfig objects
      const sportConfigs = apiSports
        .map((sportId) => getSportConfig(sportId))
        .filter((config): config is SportConfig => config !== null);

      // Add "All" option if requested and not present
      const finalSports =
        includeAll && !sportConfigs.some((s) => s.id === UNIFIED_SPORTS.ALL)
          ? [getSportConfig(UNIFIED_SPORTS.ALL)!, ...sportConfigs]
          : sportConfigs;

      setAvailableSports(finalSports);

      logger.info("Updated available sports from API", {
        count: finalSports.length,
        sports: finalSports.map((s) => s.id),
      });

      // If current sport is no longer available, reset to "all"
      if (!finalSports.some((sport) => sport.id === selectedSport)) {
        setSelectedSport(UNIFIED_SPORTS.ALL);
      }
    } catch (err) {
      setError("Failed to load available sports");
      logger.error("Failed to refresh available sports", err);

      // Fallback to default sports on error
      setAvailableSports(getActiveSports(includeAll));
    } finally {
      setIsLoading(false);
    }
  }, [autoRefresh, includeAll, selectedSport]);

  // Set sport with validation and callback
  const setSport = useCallback(
    (sport: string) => {
      const normalizedSport = normalizeSportFilter(sport);
      const isValid = availableSports.some((s) => s.id === normalizedSport);

      if (!isValid && normalizedSport !== UNIFIED_SPORTS.ALL) {
        logger.warn('Invalid sport selected, falling back to "all"', {
          sport,
          normalizedSport,
        });
        setSelectedSport(UNIFIED_SPORTS.ALL);
        onSportChange?.(UNIFIED_SPORTS.ALL);
        return;
      }

      setSelectedSport(normalizedSport);
      onSportChange?.(normalizedSport);

      logger.info("Sport filter changed", {
        previousSport: selectedSport,
        newSport: normalizedSport,
      });
    },
    [availableSports, selectedSport, onSportChange],
  );

  // Reset to "all" sports
  const resetToAll = useCallback(() => {
    setSport(UNIFIED_SPORTS.ALL);
  }, [setSport]);

  // Check if current sport is valid
  const isCurrentSportValid = useCallback(() => {
    return availableSports.some((sport) => sport.id === selectedSport);
  }, [availableSports, selectedSport]);

  // Filter data by current sport selection
  const getFilteredData = useCallback(
    <T extends { sport: string }>(data: T[]): T[] => {
      if (!data || data.length === 0) return data;

      return filterSportData(data, selectedSport, {
        useCommonMappings: true,
        allowPartialMatch: true,
        caseSensitive: false,
      });
    },
    [selectedSport],
  );

  // Memoized values
  const currentSportConfig = useMemo(() => {
    return availableSports.find((sport) => sport.id === selectedSport) || null;
  }, [availableSports, selectedSport]);

  const sportOptions = useMemo(() => {
    return availableSports.map((sport) => ({
      value: sport.id,
      label: sport.displayName,
      emoji: sport.emoji,
      color: sport.color,
    }));
  }, [availableSports]);

  // Initialize and refresh sports on mount
  useEffect(() => {
    if (autoRefresh) {
      refreshSports();
    }
  }, [refreshSports, autoRefresh]);

  // Validate selected sport when available sports change
  useEffect(() => {
    if (availableSports.length > 0 && !isCurrentSportValid()) {
      logger.warn('Selected sport is no longer available, resetting to "all"', {
        selectedSport,
        availableSports: availableSports.map((s) => s.id),
      });
      setSport(UNIFIED_SPORTS.ALL);
    }
  }, [availableSports, selectedSport, isCurrentSportValid, setSport]);

  return {
    // State
    selectedSport,
    availableSports,
    isLoading,
    error,

    // Actions
    setSport,
    refreshSports,
    resetToAll,
    getFilteredData,
    isCurrentSportValid,

    // Additional computed values (not in interface but useful)
    currentSportConfig,
    sportOptions,
  } as SportFilterState &
    SportFilterActions & {
      currentSportConfig: SportConfig | null;
      sportOptions: Array<{
        value: string;
        label: string;
        emoji: string;
        color: string;
      }>;
    };
}

/**
 * Hook specifically for components that need to sync with global sport filter
 */
export function useGlobalSportFilter() {
  // This could be connected to a global state management solution
  // For now, it's a simple wrapper around the base hook
  return useUnifiedSportFilter({
    autoRefresh: true,
    includeAll: true,
  });
}

/**
 * Hook for components that want local sport filtering
 */
export function useLocalSportFilter(initialSport?: string) {
  return useUnifiedSportFilter({
    initialSport,
    autoRefresh: false,
    includeAll: true,
  });
}

export default useUnifiedSportFilter;
