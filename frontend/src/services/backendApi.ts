/**
 * Unified Backend API Service
 * Handles all communication with the A1Betting backend
 */

import axios from "axios";

// Types
export interface BettingOpportunity {
  id: string;
  sport: string;
  event: string;
  market: string;
  odds: number;
  probability: number;
  expected_value: number;
  kelly_fraction: number;
  confidence: number;
  risk_level: string;
  recommendation: string;
}

export interface ArbitrageOpportunity {
  id: string;
  sport: string;
  event: string;
  bookmaker_a: string;
  bookmaker_b: string;
  odds_a: number;
  odds_b: number;
  profit_margin: number;
  required_stake: number;
}

export interface Transaction {
  id: string;
  type: "bet" | "win" | "loss" | "deposit" | "withdrawal";
  amount: number;
  description: string;
  timestamp: string;
  status: "pending" | "completed" | "failed";
}

export interface ActiveBet {
  id: string;
  event: string;
  market: string;
  selection: string;
  stake: number;
  potential_payout: number;
  status: "active" | "settled" | "voided";
  placed_at: string;
}

export interface RiskProfile {
  name: string;
  description: string;
  max_bet_percentage: number;
  max_exposure: number;
  risk_tolerance: number;
}

class BackendApi {
  private api: any;
  private baseURL: string;

  constructor() {
    // Determine backend URL
    this.baseURL = this.determineBackendURL();

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 8000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response interceptor for production error handling
    this.api.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        console.error("Backend API Error:", error.message);
        throw error;
      },
    );
  }

  private determineBackendURL(): string {
    // Environment variables for backend URL
    if (import.meta.env.VITE_BACKEND_URL) {
      return import.meta.env.VITE_BACKEND_URL;
    }
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }

    // Local development
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8000";
    }

    // Production - use current origin with /api prefix
    return window.location.origin + "/api";
  }

  // Health check
  public async getHealth() {
    try {
      const response = await this.api.get("/health");
      return response.data;
    } catch (error: any) {
      console.error("Health check failed:", error.message);
      throw new Error("Backend service is unavailable. Please try again later.");
    }
  }

  // Value bets
  public async getValueBets() {
    try {
      const response = await this.api.get("/api/v4/betting/value-bets");
      return Array.isArray(response.data)
        ? response.data
        : response.data?.value_bets || [];
    } catch (error: any) {
      console.error("Failed to fetch value bets:", error.message);
      return [];
    }
  }

  // Betting opportunities
  public async getBettingOpportunities(): Promise<BettingOpportunity[]> {
    try {
      const response = await this.api.get("/api/betting-opportunities");
      return Array.isArray(response.data)
        ? response.data
        : response.data?.opportunities || [];
    } catch (error: any) {
      console.error("Failed to fetch betting opportunities:", error.message);
      return [];
    }
  }

  // Arbitrage opportunities
  public async getArbitrageOpportunities(): Promise<ArbitrageOpportunity[]> {
    try {
      const response = await this.api.get("/api/arbitrage-opportunities");
      return Array.isArray(response.data)
        ? response.data
        : response.data?.opportunities || [];
    } catch (error: any) {
      console.error("Failed to fetch arbitrage opportunities:", error.message);
      return [];
    }
  }

  // Predictions
  public async getPredictions(params?: any) {
    try {
      const response = await this.api.get("/api/predictions", { params });
      return Array.isArray(response.data)
        ? response.data
        : response.data?.predictions || [];
    } catch (error: any) {
      console.error("Failed to fetch predictions:", error.message);
      return [];
    }
  }

  // Transactions
  public async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await this.api.get("/api/transactions");
      return Array.isArray(response.data)
        ? response.data
        : response.data?.transactions || [];
    } catch (error: any) {
      console.error("Failed to fetch transactions:", error.message);
      return [];
    }
  }

  // Active bets
  public async getActiveBets(): Promise<ActiveBet[]> {
    try {
      const response = await this.api.get("/api/active-bets");
      return Array.isArray(response.data)
        ? response.data
        : response.data?.active_bets || [];
    } catch (error: any) {
      console.error("Failed to fetch active bets:", error.message);
      return [];
    }
  }

  // Advanced analytics
  public async getAdvancedAnalytics() {
    try {
      const response = await this.api.get("/api/analytics/advanced");
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch analytics:", error.message);
      return {
        summary: {
          accuracy: 0,
          totalBets: 0,
          winningBets: 0,
        },
        recentPerformance: [],
        topPerformingSports: [],
        monthlyTrends: [],
      };
    }
  }

  // Generic HTTP methods for extensibility
  public async get(endpoint: string, params?: any) {
    try {
      const response = await this.api.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      console.error(`GET ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  public async post(endpoint: string, data?: any) {
    try {
      const response = await this.api.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      console.error(`POST ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  public async put(endpoint: string, data?: any) {
    try {
      const response = await this.api.put(endpoint, data);
      return response.data;
    } catch (error: any) {
      console.error(`PUT ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  public async delete(endpoint: string) {
    try {
      const response = await this.api.delete(endpoint);
      return response.data;
    } catch (error: any) {
      console.error(`DELETE ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  // Risk profiles
  public async getRiskProfiles(): Promise<RiskProfile[]> {
    try {
      const response = await this.api.get("/api/risk-profiles");
      return Array.isArray(response.data)
        ? response.data
        : response.data?.profiles || [];
    } catch (error: any) {
      console.error("Failed to fetch risk profiles:", error.message);
      return [];
    }
  }
}

// Create singleton instance
export const backendApi = new BackendApi();
export default backendApi;
