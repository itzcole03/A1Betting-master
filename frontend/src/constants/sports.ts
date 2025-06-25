export const SPORT_OPTIONS = [
  "All",
  "NBA",
  "WNBA",
  "MLB",
  "NFL",
  "Soccer",
  "PGA",
  "Tennis",
  "Esports",
  "MMA",
];

export const SPORT_DISPLAY_NAMES = {
  NBA: "NBA Basketball",
  WNBA: "WNBA Basketball",
  MLB: "MLB Baseball",
  NFL: "NFL Football",
  Soccer: "Soccer/Football",
  PGA: "PGA Golf",
  Tennis: "Tennis",
  Esports: "Esports",
  MMA: "Mixed Martial Arts",
};

export const SPORT_EMOJIS = {
  NBA: "🏀",
  WNBA: "🏀",
  MLB: "⚾",
  NFL: "🏈",
  Soccer: "⚽",
  PGA: "⛳",
  Tennis: "🎾",
  Esports: "🎮",
  MMA: "🥊",
};

export const SPORT_SEASONS = {
  NBA: { start: "October", end: "June" },
  WNBA: { start: "May", end: "October" },
  MLB: { start: "March", end: "October" },
  NFL: { start: "September", end: "February" },
  Soccer: { start: "August", end: "May" },
  PGA: { start: "January", end: "November" },
  Tennis: { start: "January", end: "November" },
  Esports: { start: "Year-round", end: "Year-round" },
  MMA: { start: "Year-round", end: "Year-round" },
};

export function getSportDisplayName(sport: string): string {
  return SPORT_DISPLAY_NAMES[sport] || sport;
}

export function getSportEmoji(sport: string): string {
  return SPORT_EMOJIS[sport] || "🏆";
}

export function getSportSeason(sport: string): { start: string; end: string } {
  return SPORT_SEASONS[sport] || { start: "Unknown", end: "Unknown" };
}

export function isInSeason(sport: string): boolean {
  const now = new Date();
  const month = now.getMonth(); // 0-11

  const seasonMap = {
    NBA: [9, 10, 11, 0, 1, 2, 3, 4, 5], // Oct-Jun
    WNBA: [4, 5, 6, 7, 8, 9], // May-Oct
    MLB: [2, 3, 4, 5, 6, 7, 8, 9], // Mar-Oct
    NFL: [8, 9, 10, 11, 0, 1], // Sep-Feb
    Soccer: [7, 8, 9, 10, 11, 0, 1, 2, 3, 4], // Aug-May
    PGA: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Jan-Nov
    Tennis: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Jan-Nov
    Esports: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Year-round
    MMA: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Year-round
  };

  const sportMonths = seasonMap[sport];
  return sportMonths ? sportMonths.includes(month) : true;
}

export const STAT_TYPES_BY_SPORT = {
  NBA: [
    "Points",
    "Rebounds",
    "Assists",
    "3-Pointers Made",
    "Steals",
    "Blocks",
    "Field Goals Made",
    "Free Throws Made",
    "Turnovers",
    "Minutes",
  ],
  WNBA: [
    "Points",
    "Rebounds",
    "Assists",
    "3-Pointers Made",
    "Steals",
    "Blocks",
    "Field Goals Made",
    "Free Throws Made",
    "Turnovers",
    "Minutes",
  ],
  MLB: [
    "Hits",
    "RBIs",
    "Runs",
    "Home Runs",
    "Strikeouts",
    "Walks",
    "Stolen Bases",
    "Total Bases",
    "Doubles",
    "Triples",
  ],
  NFL: [
    "Passing Yards",
    "Rushing Yards",
    "Receptions",
    "Receiving Yards",
    "Touchdowns",
    "Interceptions",
    "Completions",
    "Attempts",
    "Sacks",
    "Tackles",
  ],
  Soccer: [
    "Goals",
    "Assists",
    "Shots",
    "Shots on Target",
    "Passes",
    "Tackles",
    "Cards",
    "Saves",
    "Corners",
    "Fouls",
  ],
  PGA: [
    "Strokes",
    "Putts",
    "Fairways Hit",
    "Greens in Regulation",
    "Eagles",
    "Birdies",
    "Pars",
    "Bogeys",
    "Driving Distance",
    "Sand Saves",
  ],
  Tennis: [
    "Aces",
    "Double Faults",
    "First Serve %",
    "Winners",
    "Unforced Errors",
    "Break Points Won",
    "Games Won",
    "Sets Won",
    "Service Games Won",
    "Return Games Won",
  ],
  Esports: [
    "Kills",
    "Deaths",
    "Assists",
    "Damage Dealt",
    "Damage Taken",
    "Healing Done",
    "Objectives",
    "Time Played",
    "Win Rate",
    "Score",
  ],
  MMA: [
    "Significant Strikes",
    "Total Strikes",
    "Takedowns",
    "Submission Attempts",
    "Knockdowns",
    "Control Time",
    "Distance Strikes",
    "Clinch Strikes",
    "Ground Strikes",
    "Fight Time",
  ],
};

export function getStatTypesForSport(sport: string): string[] {
  return STAT_TYPES_BY_SPORT[sport] || ["Points", "Assists", "Rebounds"];
}

export const POSITION_BY_SPORT = {
  NBA: ["PG", "SG", "SF", "PF", "C"],
  WNBA: ["PG", "SG", "SF", "PF", "C"],
  MLB: ["C", "1B", "2B", "3B", "SS", "OF", "P", "DH"],
  NFL: ["QB", "RB", "WR", "TE", "K", "DEF", "OL", "DL", "LB", "DB"],
  Soccer: ["GK", "CB", "FB", "CM", "WM", "FW"],
  PGA: ["Golfer"],
  Tennis: ["Player"],
  Esports: ["Player", "Support", "Tank", "DPS", "Flex"],
  MMA: ["Fighter"],
};

export function getPositionsForSport(sport: string): string[] {
  return POSITION_BY_SPORT[sport] || ["Player"];
}
