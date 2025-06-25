export { get, post } from "./client.js";
export { apiService } from "./ApiService.js";
import { apiService } from "./ApiService.js";
export const api = apiService;
export async function getPlayers() {
    // TODO: Replace with actual API call when backend is ready
    // For now, return mock data to prevent build failures
    return [];
}
export async function submitLineup(lineup) {
    // TODO: Replace with actual API call when backend is ready
    // For now, return mock response to prevent build failures
    return { success: true, lineupId: "mock-lineup-id" };
}
