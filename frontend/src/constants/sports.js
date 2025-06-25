export const SPORT_OPTIONS = [
    "All",
    "NBA",
    "NFL",
    "MLB",
    "NHL",
    "Soccer",
    "WNBA",
    "MMA",
    "PGA",
    "Tennis",
    "Boxing",
];
export const SPORT_DISPLAY_NAMES = {
    NBA: "NBA Basketball",
    NFL: "NFL Football",
    MLB: "MLB Baseball",
    NHL: "NHL Hockey",
    Soccer: "Soccer/Football",
    WNBA: "WNBA Basketball",
    MMA: "Mixed Martial Arts",
    PGA: "PGA Golf",
    Tennis: "Tennis",
    Boxing: "Boxing",
};
export const SPORT_EMOJIS = {
    NBA: "🏀",
    NFL: "🏈",
    MLB: "⚾",
    NHL: "🏒",
    Soccer: "⚽",
    WNBA: "🏀",
    MMA: "🥊",
    PGA: "⛳",
    Tennis: "🎾",
    Boxing: "🥊",
};
export const SPORT_SEASONS = {
    NBA: { start: "October", end: "June" },
    NFL: { start: "September", end: "February" },
    MLB: { start: "March", end: "October" },
    NHL: { start: "October", end: "June" },
    Soccer: { start: "August", end: "May" },
    WNBA: { start: "May", end: "October" },
    MMA: { start: "Year-round", end: "Year-round" },
    PGA: { start: "January", end: "November" },
    Tennis: { start: "January", end: "November" },
    Boxing: { start: "Year-round", end: "Year-round" },
};
export function getSportDisplayName(sport) {
    return SPORT_DISPLAY_NAMES[sport] || sport;
}
export function getSportEmoji(sport) {
    return SPORT_EMOJIS[sport] || "🏆";
}
export function getSportSeason(sport) {
    return SPORT_SEASONS[sport] || { start: "Unknown", end: "Unknown" };
}
export function isInSeason(sport) {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const seasonMap = {
        NBA: [9, 10, 11, 0, 1, 2, 3, 4, 5], // Oct-Jun
        NFL: [8, 9, 10, 11, 0, 1], // Sep-Feb
        MLB: [2, 3, 4, 5, 6, 7, 8, 9], // Mar-Oct
        NHL: [9, 10, 11, 0, 1, 2, 3, 4, 5], // Oct-Jun
        Soccer: [7, 8, 9, 10, 11, 0, 1, 2, 3, 4], // Aug-May
        WNBA: [4, 5, 6, 7, 8, 9], // May-Oct
        MMA: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Year-round
        PGA: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Jan-Nov
        Tennis: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Jan-Nov
        Boxing: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Year-round
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
    NHL: [
        "Goals",
        "Assists",
        "Shots",
        "Points",
        "Saves",
        "Penalty Minutes",
        "Hits",
        "Blocked Shots",
        "Faceoff Wins",
        "Time on Ice",
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
};
export function getStatTypesForSport(sport) {
    return STAT_TYPES_BY_SPORT[sport] || ["Points", "Assists", "Rebounds"];
}
export const POSITION_BY_SPORT = {
    NBA: ["PG", "SG", "SF", "PF", "C"],
    NFL: ["QB", "RB", "WR", "TE", "K", "DEF", "OL", "DL", "LB", "DB"],
    MLB: ["C", "1B", "2B", "3B", "SS", "OF", "P", "DH"],
    NHL: ["C", "LW", "RW", "D", "G"],
    Soccer: ["GK", "CB", "FB", "CM", "WM", "FW"],
};
export function getPositionsForSport(sport) {
    return POSITION_BY_SPORT[sport] || ["Player"];
}
