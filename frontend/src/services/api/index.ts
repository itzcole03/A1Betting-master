export { get, post } from "./client.js";
export { apiService } from "./ApiService.js";
import { apiService } from "./ApiService.js";
import { productionApiService } from "./ProductionApiService.js";
export const api = apiService;

// Import types
export type { Player } from "../../types/api.js";

// Lineup API functions
export interface LineupSubmission {
  players: string[]; // player IDs
  totalSalary: number;
  sport: string;
  contestId?: string;
}

export async function getPlayers(): Promise<any[]> {
  try {
    const response = await api.get('/api/players') as any;
    if (response?.success && response?.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return [];
  }
}

export async function submitLineup(
  lineup: LineupSubmission,
): Promise<{ success: boolean; lineupId?: string }> {
  try {
    const response = await productionApiService.post('/api/lineups', lineup);
    if (response?.success) {
      return { success: true, lineupId: (response.data as any)?.lineupId };
    }
    return { success: false };
  } catch (error) {
    console.error('Failed to submit lineup:', error);
    return { success: false };
  }
}
