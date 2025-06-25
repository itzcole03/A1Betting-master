export function validateLineup(selectedProps) {
    const errors = [];
    const warnings = [];
    const propsArray = Array.from(selectedProps.values());
    // Check minimum props
    if (propsArray.length < 2) {
        errors.push("Select at least 2 props to create a lineup");
    }
    // Check maximum props
    if (propsArray.length > 6) {
        errors.push("Maximum 6 props allowed in a lineup");
    }
    // Check for duplicate players
    const playerNames = propsArray.map((prop) => prop.prop?.playerName || "");
    const uniquePlayers = new Set(playerNames);
    if (uniquePlayers.size !== playerNames.length) {
        errors.push("Cannot select multiple props for the same player");
    }
    // Check team diversity (warning)
    const teams = propsArray.map((prop) => prop.prop?.team || "");
    const uniqueTeams = new Set(teams);
    if (uniqueTeams.size < Math.min(2, propsArray.length)) {
        warnings.push("Consider diversifying across multiple teams");
    }
    // Check sport diversity (warning)
    const sports = propsArray.map((prop) => prop.prop?.sport || "");
    const uniqueSports = new Set(sports);
    if (uniqueSports.size === 1 && propsArray.length > 3) {
        warnings.push("Consider diversifying across multiple sports");
    }
    // Check confidence levels
    const avgConfidence = propsArray.reduce((sum, prop) => sum + (prop.confidence || 0), 0) /
        propsArray.length;
    if (avgConfidence < 60) {
        warnings.push("Low average confidence - consider higher confidence props");
    }
    return {
        canSubmit: errors.length === 0 && propsArray.length >= 2 && propsArray.length <= 6,
        errors,
        warnings,
        isValid: errors.length === 0,
    };
}
export function calculateLineupPayout(selectedProps, entryAmount) {
    const propsCount = selectedProps.size;
    // PrizePicks payout structure
    const payoutMultipliers = {
        2: 3.0,
        3: 5.0,
        4: 10.0,
        5: 20.0,
        6: 50.0,
    };
    return entryAmount * (payoutMultipliers[propsCount] || 1);
}
export function calculateLineupProbability(selectedProps) {
    const propsArray = Array.from(selectedProps.values());
    // Calculate combined probability (assuming independence)
    return propsArray.reduce((prob, prop) => {
        const confidence = (prop.confidence || 80) / 100;
        return prob * confidence;
    }, 1);
}
export function calculateExpectedValue(selectedProps, entryAmount) {
    const payout = calculateLineupPayout(selectedProps, entryAmount);
    const probability = calculateLineupProbability(selectedProps);
    return payout * probability - entryAmount;
}
