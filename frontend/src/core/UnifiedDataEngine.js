import { dataScrapingService } from '../services/dataScrapingService';
import { newsService } from '../services/newsService';
import { PoeToApiAdapter } from '../adapters/poe/PoeToApiAdapter';
import { prizePicksService } from '../services/prizePicksService';
import { sentimentService } from '../services/sentimentService';
import { unifiedMonitor } from './UnifiedMonitor';
export class UnifiedDataEngineSingleton {
    constructor() {
        // const config = await getUnifiedConfig(); // Load config if needed
    }
    /**
     * Fetches a comprehensive profile for a player by aggregating data from various services.
     * Note: This is a conceptual example. Actual implementation depends heavily on available service methods.
     */
    async getComprehensivePlayerProfile(playerNameOrId, leagueFilter) {
        const traceAttributes = { playerNameOrId };
        if (leagueFilter) {
            traceAttributes.leagueFilter = leagueFilter;
        }
        const trace = unifiedMonitor.startTrace('getComprehensivePlayerProfile', 'data.aggregation', traceAttributes); // Cast to any to satisfy monitor if it's from different project
        try {
            // Fetch general data that might contain the player
            const allPropsPromise = prizePicksService.fetchPrizePicksProps(leagueFilter); // Fetch props, potentially for a league
            // For projections, we'd ideally have a way to filter by player or fetch for relevant games/dates
            // This might require a known date or a broader fetch. For now, let's assume a common scenario.
            const projectionsPromise = dataScrapingService.fetchDailyFantasyProjections(new Date().toISOString().split('T')[0], leagueFilter);
            const sentimentPromise = sentimentService.fetchSocialSentiment(playerNameOrId);
            const newsPromise = newsService.fetchHeadlines('espn'); // General headlines, then filter or use a player-specific endpoint if available
            // For player-specific details like team, position, image.
            // This is tricky without a canonical player ID. PrizePicks props contain player_name.
            // If playerNameOrId IS a PrizePicks player_id, fetchPrizePicksPlayer could be used.
            // For now, we'll rely on data from props.
            const results = await Promise.allSettled([
                allPropsPromise,
                projectionsPromise,
                sentimentPromise,
                newsPromise,
            ]);
            const [allPropsResult, projectionsResult, sentimentResult, newsResult] = results;
            let playerProps = [];
            if (allPropsResult.status === 'fulfilled' && allPropsResult.value) {
                // Assuming playerNameOrId could be a name. If it can also be an ID, logic needs to handle that.
                playerProps = allPropsResult.value.filter(p => p.player_name.toLowerCase() === playerNameOrId.toLowerCase());
            }
            else if (allPropsResult.status === 'rejected') {
                console.warn(`Failed to fetch props for player ${playerNameOrId}`, allPropsResult.reason);
            }
            // let playerProjections: DailyFantasyProjection[] = [];
            if (projectionsResult.status === 'fulfilled' && projectionsResult.value) {
                playerProjections = projectionsResult.value.filter(p => p.playerName.toLowerCase() === playerNameOrId.toLowerCase());
            }
            else if (projectionsResult.status === 'rejected') {
                console.warn(`Failed to fetch projections for player ${playerNameOrId}`, projectionsResult.reason);
            }
            // let playerNews: ESPNHeadline[] = [];
            if (newsResult.status === 'fulfilled' && newsResult.value) {
                // Basic filter, a more robust solution might involve NLP or specific tags
                playerNews = newsResult.value.filter(headline => headline.title.toLowerCase().includes(playerNameOrId.toLowerCase()) ||
                    headline.summary.toLowerCase().includes(playerNameOrId.toLowerCase()));
            }
            else if (newsResult.status === 'rejected') {
                console.warn(`Failed to fetch news for player ${playerNameOrId}`, newsResult.reason);
            }
            const profile = {
                playerId: playerProps.length > 0 ? playerProps[0].playerId : playerNameOrId, // Use playerId from prop if available
                name: playerProps.length > 0 ? playerProps[0].player_name : playerNameOrId,
                team: playerProps.length > 0 ? playerProps[0].player?.team : undefined,
                position: playerProps.length > 0 ? playerProps[0].player?.position : undefined,
                imageUrl: playerProps.length > 0 ? playerProps[0].image_url || playerProps[0].player?.image_url : undefined,
                recentProps: playerProps,
                projections: playerProjections,
                sentiments: sentimentResult.status === 'fulfilled' && sentimentResult.value ? [sentimentResult.value] : [],
                news: playerNews,
                // marketOdds: oddsResult.status === 'fulfilled' ? oddsResult.value : [], // Odds would be another call
            };
            // If we had a reliable fetchPrizePicksPlayer by name or ID, we could populate name, team, position, imageUrl more reliably.
            // For example, if playerProps has a canonical playerId:
            // if (playerProps.length > 0 && playerProps[0].playerId) {
            //   const playerDetails = await prizePicksService.fetchPrizePicksPlayer(playerProps[0].playerId);
            //   profile.name = playerDetails.name;
            //   profile.team = playerDetails.team;
            //   // ... etc.
            // }
            unifiedMonitor.endTrace(trace);
            return profile;
        }
        catch (error) {
            unifiedMonitor.reportError(error, { operation: 'getComprehensivePlayerProfile', playerNameOrId });
            unifiedMonitor.endTrace(trace);
            return null;
        }
    }
    /**
     * Fetches and normalizes data for a specific market or prop ID.
     * This would involve fetching odds, lines, relevant stats, predictions etc.
     */
    async getMarketDetails(propId) {
        const trace = unifiedMonitor.startTrace('getMarketDetails', 'data.market_aggregation');
        try {
            // Calls to services like prizePicksService.fetchPrizePicksLines(propId)
            // dataScrapingService.fetchOddsForProp(propId)
            // predictionService.getPredictionDetails(propId) // if predictions are part of this
            // ...and then aggregate them.
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate work
            unifiedMonitor.endTrace(trace);
            return { propId, message: "Market details would be aggregated here from multiple sources via backend services." };
        }
        catch (error) {
            unifiedMonitor.reportError(error, { operation: 'getMarketDetails', propId });
            unifiedMonitor.endTrace(trace);
            return null;
        }
    }
    /**
     * Fetches props from the Poe-like data source using the PoeToApiAdapter.
     */
    async fetchPropsFromPoeSource() {
        const trace = unifiedMonitor.startTrace('fetchPropsFromPoeSource', 'data.fetch.poe');
        try {
            const poeAdapter = new PoeToApiAdapter();
            const props = await poeAdapter.fetchAndTransformPoeData?.() ?? [];
            unifiedMonitor.endTrace(trace);
            return props;
        }
        catch (error) {
            unifiedMonitor.reportError(error, { operation: 'fetchPropsFromPoeSource' });
            unifiedMonitor.endTrace(trace);
            return []; // Return empty array on error or rethrow
        }
    }
}
// Export a singleton instance
export const unifiedDataEngine = new UnifiedDataEngineSingleton();
// Example Usage (conceptual):
// unifiedDataEngine.getComprehensivePlayerProfile('LeBron James').then(profile => {
//   if (profile) {
//     // Use the aggregated profile data
//   }
// }); 
