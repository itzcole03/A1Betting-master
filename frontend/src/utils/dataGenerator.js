export class DataGenerator {
    static generateConfidence(context) {
        const baseConfidence = 75;
        let adjustment = 0;
        // Adjust based on player/game context
        if (context.recentForm) {
            const avgForm = context.recentForm
                .slice(-5)
                .reduce((sum, val) => sum + val, 0) / 5;
            adjustment += (avgForm - 0.5) * 20; // ±10 points based on form
        }
        if (context.choice === "over" && context.statType) {
            // Slightly favor over for offensive stats
            if (["Points", "Passing Yards", "Receiving Yards"].includes(context.statType)) {
                adjustment += 2;
            }
        }
        if (context.choice === "under" && context.statType) {
            // Slightly favor under for defensive stats
            if (["Turnovers", "Fouls", "Strikeouts"].includes(context.statType)) {
                adjustment += 2;
            }
        }
        // Add some randomness
        adjustment += (Math.random() - 0.5) * 15;
        return Math.max(55, Math.min(95, baseConfidence + adjustment));
    }
    static generateExpectedValue(context) {
        const baseEV = 0;
        let adjustment = 0;
        // Adjust based on context
        if (context.recentForm) {
            const avgForm = context.recentForm
                .slice(-3)
                .reduce((sum, val) => sum + val, 0) / 3;
            adjustment += (avgForm - 0.5) * 8; // ±4 EV based on recent form
        }
        if (context.confidence) {
            // Higher confidence = higher potential EV
            adjustment += (context.confidence - 75) * 0.1;
        }
        // Add randomness
        adjustment += (Math.random() - 0.5) * 10;
        return baseEV + adjustment;
    }
    static generateStatLine(sport, statType, playerName) {
        const baseLines = {
            NBA: {
                Points: { min: 12, max: 35, avg: 20 },
                Rebounds: { min: 3, max: 15, avg: 7 },
                Assists: { min: 2, max: 12, avg: 5 },
                "3-Pointers Made": { min: 1, max: 6, avg: 2.5 },
                Steals: { min: 0.5, max: 3, avg: 1.2 },
                Blocks: { min: 0.5, max: 3, avg: 1.0 },
            },
            NFL: {
                "Passing Yards": { min: 180, max: 350, avg: 240 },
                "Rushing Yards": { min: 40, max: 150, avg: 75 },
                Receptions: { min: 3, max: 12, avg: 6 },
                "Receiving Yards": { min: 40, max: 120, avg: 70 },
                Touchdowns: { min: 0.5, max: 3, avg: 1.2 },
            },
            MLB: {
                Hits: { min: 0.5, max: 3, avg: 1.2 },
                RBIs: { min: 0.5, max: 4, avg: 1.5 },
                Runs: { min: 0.5, max: 3, avg: 1.0 },
                "Home Runs": { min: 0.5, max: 2, avg: 0.8 },
                Strikeouts: { min: 0.5, max: 12, avg: 6 },
            },
            NHL: {
                Goals: { min: 0.5, max: 2, avg: 0.8 },
                Assists: { min: 0.5, max: 3, avg: 1.2 },
                Shots: { min: 2, max: 8, avg: 4 },
                Points: { min: 0.5, max: 4, avg: 2 },
            },
        };
        const sportLines = baseLines[sport];
        if (!sportLines || !sportLines[statType]) {
            return 10 + Math.random() * 10; // Fallback
        }
        const { min, max, avg } = sportLines[statType];
        // Generate line around average with some variation
        const variation = (max - min) * 0.3;
        const line = avg + (Math.random() - 0.5) * variation;
        // Ensure within bounds
        return Math.max(min, Math.min(max, line));
    }
    static generateRecentForm(games = 10) {
        const form = [];
        let trend = (Math.random() - 0.5) * 0.4; // Overall trend
        let currentLevel = 0.5;
        for (let i = 0; i < games; i++) {
            // Add trend and some noise
            const noise = (Math.random() - 0.5) * 0.3;
            currentLevel = Math.max(0.1, Math.min(0.9, currentLevel + trend * 0.1 + noise));
            form.push(currentLevel);
        }
        return form;
    }
    static generateGameData(sport) {
        const teams = this.getTeamsForSport(sport);
        const homeTeam = teams[Math.floor(Math.random() * teams.length)];
        let awayTeam = teams[Math.floor(Math.random() * teams.length)];
        // Ensure different teams
        while (awayTeam === homeTeam) {
            awayTeam = teams[Math.floor(Math.random() * teams.length)];
        }
        return {
            id: `${sport.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sport,
            homeTeam,
            awayTeam,
            gameTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "Scheduled",
            venue: `${homeTeam} Stadium`,
            spread: (Math.random() - 0.5) * 14, // ±7 point spread
            total: this.generateGameTotal(sport),
            moneyline: {
                home: -110 + Math.random() * 60,
                away: -110 + Math.random() * 60,
            },
        };
    }
    static generateGameTotal(sport) {
        const totals = {
            NBA: { min: 210, max: 240, avg: 225 },
            NFL: { min: 42, max: 58, avg: 47 },
            MLB: { min: 7, max: 12, avg: 9 },
            NHL: { min: 5.5, max: 7.5, avg: 6.5 },
        };
        const sportTotal = totals[sport];
        if (!sportTotal)
            return 100;
        const { min, max, avg } = sportTotal;
        const variation = (max - min) * 0.3;
        return avg + (Math.random() - 0.5) * variation;
    }
    static getTeamsForSport(sport) {
        const teams = {
            NBA: [
                "LAL",
                "BOS",
                "GSW",
                "MIL",
                "PHI",
                "DAL",
                "PHX",
                "DEN",
                "MIA",
                "ATL",
                "CHI",
                "NYK",
            ],
            NFL: [
                "BUF",
                "KC",
                "SF",
                "LAR",
                "NE",
                "MIA",
                "NYJ",
                "PIT",
                "DAL",
                "PHI",
                "SEA",
                "GB",
            ],
            MLB: [
                "LAD",
                "NYY",
                "HOU",
                "ATL",
                "NYM",
                "PHI",
                "SD",
                "TOR",
                "BOS",
                "STL",
                "SF",
                "CLE",
            ],
            NHL: [
                "EDM",
                "COL",
                "TOR",
                "BOS",
                "NYR",
                "TB",
                "CAR",
                "VGK",
                "FLA",
                "NJ",
                "DAL",
                "SEA",
            ],
        };
        return teams[sport] || ["TEAM1", "TEAM2", "TEAM3", "TEAM4"];
    }
    static generatePlayerData(sport, name) {
        const teams = this.getTeamsForSport(sport);
        const team = teams[Math.floor(Math.random() * teams.length)];
        const positions = this.getPositionsForSport(sport);
        const position = positions[Math.floor(Math.random() * positions.length)];
        return {
            id: `${sport.toLowerCase()}_${(name || "player").replace(/\s+/g, "_").toLowerCase()}_${Date.now()}`,
            name: name || this.generatePlayerName(),
            team,
            position,
            sport,
            stats: this.generatePlayerStats(sport),
            recentForm: this.generateRecentForm(),
            injuryStatus: Math.random() > 0.9 ? "Questionable" : "Healthy",
            age: 21 + Math.floor(Math.random() * 15),
            experience: Math.floor(Math.random() * 15),
            salary: this.generateSalary(sport),
        };
    }
    static generatePlayerStats(sport) {
        const stats = {};
        switch (sport) {
            case "NBA":
                stats.points = 10 + Math.random() * 25;
                stats.rebounds = 2 + Math.random() * 10;
                stats.assists = 1 + Math.random() * 8;
                stats.steals = 0.5 + Math.random() * 2;
                stats.blocks = 0.3 + Math.random() * 2;
                stats.threePointersMade = 0.5 + Math.random() * 4;
                stats.fieldGoalPercentage = 0.35 + Math.random() * 0.25;
                break;
            case "NFL":
                stats.passingYards = 150 + Math.random() * 200;
                stats.rushingYards = 30 + Math.random() * 100;
                stats.receptions = 2 + Math.random() * 8;
                stats.receivingYards = 30 + Math.random() * 80;
                stats.touchdowns = 0.3 + Math.random() * 2;
                stats.interceptions = Math.random() * 1.5;
                break;
            case "MLB":
                stats.hits = 0.8 + Math.random() * 1.5;
                stats.rbis = 0.5 + Math.random() * 1.5;
                stats.runs = 0.4 + Math.random() * 1.2;
                stats.homeRuns = 0.1 + Math.random() * 0.8;
                stats.strikeouts = 0.5 + Math.random() * 2;
                stats.battingAverage = 0.2 + Math.random() * 0.15;
                break;
            case "NHL":
                stats.goals = 0.2 + Math.random() * 1.5;
                stats.assists = 0.3 + Math.random() * 2;
                stats.shots = 2 + Math.random() * 4;
                stats.points = stats.goals + stats.assists;
                stats.plusMinus = (Math.random() - 0.5) * 20;
                break;
        }
        return stats;
    }
    static generatePlayerName() {
        const firstNames = [
            "Michael",
            "James",
            "John",
            "Robert",
            "David",
            "Chris",
            "Alex",
            "Ryan",
            "Tyler",
            "Kevin",
            "Anthony",
            "Daniel",
            "Marcus",
            "Jordan",
            "Brandon",
            "Jason",
            "Justin",
            "Andrew",
            "Josh",
            "Nick",
        ];
        const lastNames = [
            "Johnson",
            "Williams",
            "Brown",
            "Jones",
            "Garcia",
            "Miller",
            "Davis",
            "Rodriguez",
            "Martinez",
            "Hernandez",
            "Smith",
            "Wilson",
            "Anderson",
            "Taylor",
            "Thomas",
            "Jackson",
            "White",
            "Harris",
            "Martin",
            "Thompson",
        ];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${firstName} ${lastName}`;
    }
    static getPositionsForSport(sport) {
        const positions = {
            NBA: ["PG", "SG", "SF", "PF", "C"],
            NFL: ["QB", "RB", "WR", "TE", "K", "DEF"],
            MLB: ["C", "1B", "2B", "3B", "SS", "OF", "P"],
            NHL: ["C", "LW", "RW", "D", "G"],
        };
        return positions[sport] || ["P"];
    }
    static generateSalary(sport) {
        const salaryRanges = {
            NBA: { min: 500000, max: 50000000 },
            NFL: { min: 400000, max: 45000000 },
            MLB: { min: 600000, max: 43000000 },
            NHL: { min: 700000, max: 12500000 },
        };
        const range = salaryRanges[sport] || { min: 50000, max: 5000000 };
        const logMin = Math.log(range.min);
        const logMax = Math.log(range.max);
        return Math.exp(logMin + Math.random() * (logMax - logMin));
    }
}
