/**
 * Unified Sports Constants - Consolidated from multiple sources to ensure consistency
 * This replaces fragmented sport constants across the application
 */

export const UNIFIED_SPORTS = {
  // Core sport identifiers with consistent naming
  ALL: "all",
  NBA: "nba",
  WNBA: "wnba",
  NFL: "nfl",
  MLB: "mlb",
  NHL: "nhl",
  SOCCER: "soccer",
  PGA: "pga",
  TENNIS: "tennis",
  ESPORTS: "esports",
  MMA: "mma",
  COLLEGE_FOOTBALL: "college-football",
  COLLEGE_BASKETBALL: "college-basketball",
} as const;

// Type-safe sport union
export type SportKey = (typeof UNIFIED_SPORTS)[keyof typeof UNIFIED_SPORTS];

// Comprehensive sport configuration
export interface SportConfig {
  id: SportKey;
  name: string;
  displayName: string;
  abbreviation: string;
  emoji: string;
  color: string;
  isActive: boolean;
  category: "professional" | "college" | "international" | "esports" | "other";
  season: {
    start: string;
    end: string;
    isYearRound: boolean;
  };
  popularStats: string[];
  positions: string[];
  markets: string[];
}

export const SPORT_CONFIGS: Record<SportKey, SportConfig> = {
  [UNIFIED_SPORTS.ALL]: {
    id: UNIFIED_SPORTS.ALL,
    name: "all",
    displayName: "All Sports",
    abbreviation: "ALL",
    emoji: "🏆",
    color: "#6366f1",
    isActive: true,
    category: "other",
    season: { start: "January", end: "December", isYearRound: true },
    popularStats: [],
    positions: [],
    markets: [],
  },
  [UNIFIED_SPORTS.NBA]: {
    id: UNIFIED_SPORTS.NBA,
    name: "nba",
    displayName: "NBA Basketball",
    abbreviation: "NBA",
    emoji: "🏀",
    color: "#FF6B35",
    isActive: true,
    category: "professional",
    season: { start: "October", end: "June", isYearRound: false },
    popularStats: [
      "Points",
      "Rebounds",
      "Assists",
      "3-Pointers Made",
      "Steals",
      "Blocks",
    ],
    positions: ["PG", "SG", "SF", "PF", "C"],
    markets: ["Moneyline", "Spread", "Total", "Player Props"],
  },
  [UNIFIED_SPORTS.WNBA]: {
    id: UNIFIED_SPORTS.WNBA,
    name: "wnba",
    displayName: "WNBA Basketball",
    abbreviation: "WNBA",
    emoji: "🏀",
    color: "#FF6B35",
    isActive: true,
    category: "professional",
    season: { start: "May", end: "October", isYearRound: false },
    popularStats: [
      "Points",
      "Rebounds",
      "Assists",
      "3-Pointers Made",
      "Steals",
      "Blocks",
    ],
    positions: ["PG", "SG", "SF", "PF", "C"],
    markets: ["Moneyline", "Spread", "Total", "Player Props"],
  },
  [UNIFIED_SPORTS.NFL]: {
    id: UNIFIED_SPORTS.NFL,
    name: "nfl",
    displayName: "NFL Football",
    abbreviation: "NFL",
    emoji: "🏈",
    color: "#2563eb",
    isActive: true,
    category: "professional",
    season: { start: "September", end: "February", isYearRound: false },
    popularStats: [
      "Passing Yards",
      "Rushing Yards",
      "Receiving Yards",
      "Touchdowns",
      "Receptions",
    ],
    positions: ["QB", "RB", "WR", "TE", "K", "DEF"],
    markets: ["Moneyline", "Spread", "Total", "Player Props"],
  },
  [UNIFIED_SPORTS.MLB]: {
    id: UNIFIED_SPORTS.MLB,
    name: "mlb",
    displayName: "MLB Baseball",
    abbreviation: "MLB",
    emoji: "⚾",
    color: "#059669",
    isActive: true,
    category: "professional",
    season: { start: "March", end: "October", isYearRound: false },
    popularStats: ["Hits", "RBIs", "Runs", "Home Runs", "Strikeouts", "Walks"],
    positions: ["C", "1B", "2B", "3B", "SS", "OF", "P", "DH"],
    markets: ["Moneyline", "Spread", "Total", "Player Props"],
  },
  [UNIFIED_SPORTS.NHL]: {
    id: UNIFIED_SPORTS.NHL,
    name: "nhl",
    displayName: "NHL Hockey",
    abbreviation: "NHL",
    emoji: "🏒",
    color: "#0891b2",
    isActive: true,
    category: "professional",
    season: { start: "October", end: "June", isYearRound: false },
    popularStats: [
      "Goals",
      "Assists",
      "Points",
      "Shots",
      "Saves",
      "Power Play Goals",
    ],
    positions: ["C", "LW", "RW", "D", "G"],
    markets: ["Moneyline", "Spread", "Total", "Player Props"],
  },
  [UNIFIED_SPORTS.SOCCER]: {
    id: UNIFIED_SPORTS.SOCCER,
    name: "soccer",
    displayName: "Soccer/Football",
    abbreviation: "SOC",
    emoji: "⚽",
    color: "#16a34a",
    isActive: true,
    category: "international",
    season: { start: "August", end: "May", isYearRound: true },
    popularStats: ["Goals", "Assists", "Shots", "Passes", "Tackles", "Cards"],
    positions: ["GK", "CB", "FB", "CM", "WM", "FW"],
    markets: ["Moneyline", "Draw", "Total Goals", "Player Props"],
  },
  [UNIFIED_SPORTS.PGA]: {
    id: UNIFIED_SPORTS.PGA,
    name: "pga",
    displayName: "PGA Golf",
    abbreviation: "PGA",
    emoji: "⛳",
    color: "#ca8a04",
    isActive: true,
    category: "professional",
    season: { start: "January", end: "November", isYearRound: false },
    popularStats: [
      "Strokes",
      "Putts",
      "Fairways Hit",
      "Greens in Regulation",
      "Birdies",
    ],
    positions: ["Golfer"],
    markets: ["Outright", "Top 5", "Top 10", "Player Props"],
  },
  [UNIFIED_SPORTS.TENNIS]: {
    id: UNIFIED_SPORTS.TENNIS,
    name: "tennis",
    displayName: "Tennis",
    abbreviation: "TEN",
    emoji: "🎾",
    color: "#7c3aed",
    isActive: true,
    category: "professional",
    season: { start: "January", end: "November", isYearRound: false },
    popularStats: [
      "Aces",
      "Double Faults",
      "Winners",
      "Unforced Errors",
      "Break Points",
    ],
    positions: ["Player"],
    markets: ["Moneyline", "Set Winner", "Game Totals", "Player Props"],
  },
  [UNIFIED_SPORTS.ESPORTS]: {
    id: UNIFIED_SPORTS.ESPORTS,
    name: "esports",
    displayName: "Esports",
    abbreviation: "ESP",
    emoji: "🎮",
    color: "#8b5cf6",
    isActive: true,
    category: "esports",
    season: { start: "January", end: "December", isYearRound: true },
    popularStats: ["Kills", "Deaths", "Assists", "Damage", "Score"],
    positions: ["Player", "Support", "Tank", "DPS"],
    markets: ["Moneyline", "Map Winner", "Total Maps", "Player Props"],
  },
  [UNIFIED_SPORTS.MMA]: {
    id: UNIFIED_SPORTS.MMA,
    name: "mma",
    displayName: "Mixed Martial Arts",
    abbreviation: "MMA",
    emoji: "🥊",
    color: "#dc2626",
    isActive: true,
    category: "professional",
    season: { start: "January", end: "December", isYearRound: true },
    popularStats: [
      "Significant Strikes",
      "Takedowns",
      "Submission Attempts",
      "Control Time",
    ],
    positions: ["Fighter"],
    markets: [
      "Moneyline",
      "Method of Victory",
      "Round Winner",
      "Fighter Props",
    ],
  },
  [UNIFIED_SPORTS.COLLEGE_FOOTBALL]: {
    id: UNIFIED_SPORTS.COLLEGE_FOOTBALL,
    name: "college-football",
    displayName: "College Football",
    abbreviation: "CFB",
    emoji: "🏈",
    color: "#ea580c",
    isActive: true,
    category: "college",
    season: { start: "August", end: "January", isYearRound: false },
    popularStats: [
      "Passing Yards",
      "Rushing Yards",
      "Receiving Yards",
      "Touchdowns",
    ],
    positions: ["QB", "RB", "WR", "TE", "K", "DEF"],
    markets: ["Moneyline", "Spread", "Total", "Player Props"],
  },
  [UNIFIED_SPORTS.COLLEGE_BASKETBALL]: {
    id: UNIFIED_SPORTS.COLLEGE_BASKETBALL,
    name: "college-basketball",
    displayName: "College Basketball",
    abbreviation: "CBB",
    emoji: "🏀",
    color: "#f59e0b",
    isActive: true,
    category: "college",
    season: { start: "November", end: "April", isYearRound: false },
    popularStats: [
      "Points",
      "Rebounds",
      "Assists",
      "3-Pointers Made",
      "Steals",
    ],
    positions: ["PG", "SG", "SF", "PF", "C"],
    markets: ["Moneyline", "Spread", "Total", "Player Props"],
  },
};

// Utility functions for consistent sport handling
export const getSportConfig = (sportId: string): SportConfig | null => {
  const normalizedId = sportId.toLowerCase() as SportKey;
  return SPORT_CONFIGS[normalizedId] || null;
};

export const getSportDisplayName = (sportId: string): string => {
  const config = getSportConfig(sportId);
  return config?.displayName || sportId;
};

export const getSportEmoji = (sportId: string): string => {
  const config = getSportConfig(sportId);
  return config?.emoji || "🏆";
};

export const getSportColor = (sportId: string): string => {
  const config = getSportConfig(sportId);
  return config?.color || "#6366f1";
};

export const getActiveSports = (includeAll: boolean = true): SportConfig[] => {
  const sports = Object.values(SPORT_CONFIGS).filter(
    (sport) =>
      sport.isActive && (includeAll || sport.id !== UNIFIED_SPORTS.ALL),
  );
  return sports.sort((a, b) => {
    if (a.id === UNIFIED_SPORTS.ALL) return -1;
    if (b.id === UNIFIED_SPORTS.ALL) return 1;
    return a.displayName.localeCompare(b.displayName);
  });
};

export const getSportsForCategory = (
  category: SportConfig["category"],
): SportConfig[] => {
  return Object.values(SPORT_CONFIGS).filter(
    (sport) => sport.isActive && sport.category === category,
  );
};

export const isInSeason = (sportId: string): boolean => {
  const config = getSportConfig(sportId);
  if (!config || config.season.isYearRound) return true;

  const now = new Date();
  const month = now.getMonth(); // 0-11

  const seasonMap: Record<string, number[]> = {
    NBA: [9, 10, 11, 0, 1, 2, 3, 4, 5], // Oct-Jun
    WNBA: [4, 5, 6, 7, 8, 9], // May-Oct
    NFL: [8, 9, 10, 11, 0, 1], // Sep-Feb
    MLB: [2, 3, 4, 5, 6, 7, 8, 9], // Mar-Oct
    NHL: [9, 10, 11, 0, 1, 2, 3, 4, 5], // Oct-Jun
    Soccer: [7, 8, 9, 10, 11, 0, 1, 2, 3, 4], // Aug-May
    PGA: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Jan-Nov
    Tennis: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Jan-Nov
    "College Football": [7, 8, 9, 10, 11, 0], // Aug-Jan
    "College Basketball": [10, 11, 0, 1, 2, 3], // Nov-Apr
  };

  const sportMonths = seasonMap[config.displayName];
  return sportMonths ? sportMonths.includes(month) : true;
};

// Legacy compatibility exports (to avoid breaking existing imports)
export const SPORT_OPTIONS = getActiveSports().map((sport) => sport.id);
export const SPORT_DISPLAY_NAMES = Object.fromEntries(
  Object.values(SPORT_CONFIGS).map((sport) => [sport.id, sport.displayName]),
);
export const SPORT_EMOJIS = Object.fromEntries(
  Object.values(SPORT_CONFIGS).map((sport) => [sport.id, sport.emoji]),
);

// Enhanced sport validation
export const isValidSport = (sportId: string): boolean => {
  return getSportConfig(sportId) !== null;
};

export const normalizeSportId = (sportId: string): SportKey => {
  const normalized = sportId.toLowerCase().replace(/[-_\s]/g, "-") as SportKey;
  return isValidSport(normalized) ? normalized : UNIFIED_SPORTS.ALL;
};
