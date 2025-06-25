import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Bet, Event, Odds, Sport } from "../types/betting";

// Types for API requests
interface PlaceBetRequest {
  eventId: string;
  marketType: string;
  selectionId: string;
  odds: number;
  stake: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const bettingApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API endpoints
const endpoints = {
  sports: "/sports",
  events: "/events",
  odds: "/odds",
  bets: "/bets",
};

// Queries
export const useSports = () => {
  return useQuery({
    queryKey: ["sports"],
    queryFn: async () => {
      const { data } = await bettingApi.get<Sport[]>(endpoints.sports);
      return data;
    },
  });
};

export const useEvents = (sportId: string) => {
  return useQuery({
    queryKey: ["events", sportId],
    queryFn: async () => {
      const { data } = await bettingApi.get<Event[]>(
        `${endpoints.events}?sportId=${sportId}`,
      );
      return data;
    },
    enabled: !!sportId,
  });
};

export const useOdds = (eventId: string) => {
  return useQuery({
    queryKey: ["odds", eventId],
    queryFn: async () => {
      const { data } = await bettingApi.get<Odds>(
        `${endpoints.odds}/${eventId}`,
      );
      return data;
    },
    enabled: !!eventId,
    refetchInterval: false, // Disable auto-refresh to prevent errors
  });
};

export const useActiveBets = () => {
  return useQuery({
    queryKey: ["bets", "active"],
    queryFn: async () => {
      const { data } = await bettingApi.get<Bet[]>(`${endpoints.bets}/active`);
      return data;
    },
  });
};

// Mutations
export const usePlaceBet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bet: Omit<Bet, "id" | "status" | "timestamp">) => {
      const { data } = await bettingApi.post<Bet>(endpoints.bets, bet);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bets", "active"] });
    },
  });
};

export const useCancelBet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (betId: string) => {
      const { data } = await bettingApi.post<Bet>(
        `${endpoints.bets}/${betId}/cancel`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bets", "active"] });
    },
  });
};

// WebSocket connection for real-time updates
export const connectToOddsWebSocket = (
  eventId: string,
  onUpdate: (odds: Odds) => void,
) => {
  const wsUrl = `${import.meta.env.VITE_WS_URL}/odds/${eventId}`;

  // Safety checks to prevent invalid WebSocket connections
  if (
    !wsUrl ||
    wsUrl === "" ||
    wsUrl === "wss://api.betproai.com/ws" ||
    wsUrl.includes("api.betproai.com") ||
    wsUrl.includes("localhost:8000") ||
    wsUrl.includes("localhost:3001") ||
    wsUrl.includes("undefined") ||
    import.meta.env.VITE_ENABLE_WEBSOCKET === "false"
  ) {
    console.log("WebSocket connection disabled for odds updates:", wsUrl);
    return () => { }; // Return empty cleanup function
  }

  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    const odds: Odds = JSON.parse(event.data);
    onUpdate(odds);
  };

  return () => {
    ws.close();
  };
};

// Raw API functions for use with React Query
export const getActiveBets = async (): Promise<number> => {
  try {
    const { data } = await bettingApi.get<Bet[]>(endpoints.bets + "?status=active");
    return data.length;
  } catch (error) {
    console.error("Error fetching active bets:", error);
    throw error;
  }
};

export const getTotalWinnings = async (): Promise<number> => {
  try {
    const { data } = await bettingApi.get<Bet[]>(endpoints.bets + "?status=won");
    return data.reduce((total, bet) => total + (bet.potentialWinnings || 0), 0);
  } catch (error) {
    console.error("Error fetching total winnings:", error);
    throw error;
  }
};

export const getWinRate = async (): Promise<number> => {
  try {
    const { data } = await bettingApi.get<Bet[]>(endpoints.bets + "?status=closed");
    if (data.length === 0) return 0;
    const wonBets = data.filter(bet => bet.status === 'won').length;
    return (wonBets / data.length) * 100;
  } catch (error) {
    console.error("Error fetching win rate:", error);
    throw error;
  }
};

// Main betting service object
const bettingService = {
  placeBet: async (betData: PlaceBetRequest) => {
    try {
      const response = await bettingApi.post(endpoints.bets, betData);
      return { success: true, bet: response.data };
    } catch (error) {
      console.error("Failed to place bet:", error);
      return { success: false, error: "Failed to place bet" };
    }
  },

  cancelBet: async (betId: string) => {
    try {
      const response = await bettingApi.post(
        `${endpoints.bets}/${betId}/cancel`,
      );
      return { success: true, bet: response.data };
    } catch (error) {
      console.error("Failed to cancel bet:", error);
      return { success: false, error: "Failed to cancel bet" };
    }
  },

  getActiveBets: async () => {
    try {
      const response = await bettingApi.get(`${endpoints.bets}/active`);
      return response.data;
    } catch (error) {
      console.error("Failed to get active bets:", error);
      return [];
    }
  },

  getSports: async () => {
    try {
      const response = await bettingApi.get(endpoints.sports);
      return response.data;
    } catch (error) {
      console.error("Failed to get sports:", error);
      return [];
    }
  },

  getEvents: async (sportId: string) => {
    try {
      const response = await bettingApi.get(
        `${endpoints.events}?sportId=${sportId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get events:", error);
      return [];
    }
  },

  getOdds: async (eventId: string) => {
    try {
      const response = await bettingApi.get(`${endpoints.odds}/${eventId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get odds:", error);
      return null;
    }
  },
};

// Export both ways for maximum compatibility
export { bettingService };
export default bettingService;
