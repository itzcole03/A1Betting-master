import React, { memo, useMemo } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  getActiveSports,
  getSportEmoji,
  getSportColor,
  normalizeSportId,
  SportConfig,
  SportKey,
  UNIFIED_SPORTS,
} from "@/constants/unifiedSports";

interface UnifiedSportSelectorProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
  label?: string;
  placeholder?: string;
  includeAll?: boolean;
  className?: string;
  disabled?: boolean;
  showEmojis?: boolean;
  showColors?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "pill" | "minimal";
  filterCategory?: SportConfig["category"];
  inSeasonOnly?: boolean;
}

export const UnifiedSportSelector = memo<UnifiedSportSelectorProps>(
  ({
    selectedSport,
    onSportChange,
    label,
    placeholder = "Select a sport...",
    includeAll = true,
    className = "",
    disabled = false,
    showEmojis = true,
    showColors = false,
    size = "md",
    variant = "default",
    filterCategory,
    inSeasonOnly = false,
  }) => {
    const sports = useMemo(() => {
      let availableSports = getActiveSports(includeAll);

      if (filterCategory) {
        availableSports = availableSports.filter(
          (sport) =>
            sport.category === filterCategory ||
            sport.id === UNIFIED_SPORTS.ALL,
        );
      }

      if (inSeasonOnly) {
        // Would need to implement season checking logic
        // For now, return all sports
      }

      return availableSports;
    }, [includeAll, filterCategory, inSeasonOnly]);

    const selectedSportConfig = useMemo(() => {
      const normalizedId = normalizeSportId(selectedSport);
      return sports.find((sport) => sport.id === normalizedId) || sports[0];
    }, [selectedSport, sports]);

    const handleSportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSport = event.target.value;
      onSportChange(newSport);
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "px-3 py-1.5 text-sm";
        case "lg":
          return "px-5 py-3 text-lg";
        default:
          return "px-4 py-2 text-base";
      }
    };

    const getVariantClasses = () => {
      switch (variant) {
        case "pill":
          return "rounded-full border-2";
        case "minimal":
          return "border-0 border-b-2 rounded-none bg-transparent";
        default:
          return "rounded-lg border";
      }
    };

    const baseClasses = [
      "w-full appearance-none cursor-pointer transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      getSizeClasses(),
      getVariantClasses(),
    ].join(" ");

    const themeClasses =
      variant === "minimal"
        ? "text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:border-blue-500"
        : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-500";

    const finalClasses = `${baseClasses} ${themeClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            value={selectedSport}
            onChange={handleSportChange}
            disabled={disabled}
            className={finalClasses}
            style={
              showColors && selectedSportConfig
                ? {
                    borderColor: selectedSportConfig.color,
                    boxShadow: `0 0 0 1px ${selectedSportConfig.color}20`,
                  }
                : undefined
            }
          >
            {!includeAll && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {showEmojis ? `${sport.emoji} ` : ""}
                {sport.displayName}
              </option>
            ))}
          </select>

          {variant !== "minimal" && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDownIcon className="w-5 h-5 text-slate-400" />
            </div>
          )}
        </div>

        {selectedSportConfig &&
          selectedSportConfig.id !== UNIFIED_SPORTS.ALL && (
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>
                Season: {selectedSportConfig.season.start} -{" "}
                {selectedSportConfig.season.end}
              </span>
              {showColors && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedSportConfig.color }}
                />
              )}
            </div>
          )}
      </div>
    );
  },
);

UnifiedSportSelector.displayName = "UnifiedSportSelector";

export default UnifiedSportSelector;
