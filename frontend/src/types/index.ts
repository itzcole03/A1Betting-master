/**
 * Main types index file for A1Betting frontend
 * Consolidates all type definitions used across the application
 */

// Import types for use within this file
import type { Sport, PropType, AlertMetadata, AlertSeverity, AlertType, BetResult, BetType, EntryStatus, LineupType, MarketState } from "./common";

// Re-export common types
export type { AlertMetadata, AlertSeverity, AlertType, BetResult, BetType, EntryStatus, LineupType, MarketState, PropType, Sport } from "./common";

// Re-export betting types
export type { ArbitrageOpportunity, ArbitrageOpportunityItem, BackendArbitrageOpportunity, BettingOdds } from "./betting";

// Re-export core types
export type {
  BetResult as CoreBetResult, BetType as CoreBetType, GameContext, OddsUpdate,
  PlayerProp, PredictionUpdate, ShapVector, WeatherData
} from "./core";

/**
 * Represents the structure of data coming from a "Poe-like" source
 */
export interface PoeDataContext {
  userId?: string;
  sessionId?: string;
  appVersion?: string;
}

export interface PoeDataBlock {
  id: string;
  type: string;
  title?: string;
  content: unknown;
  metadata?: Record<string, unknown>;
  style?: Record<string, unknown>;
  timestamp?: number;
}

export interface PoePropCardContent {
  player: string;
  stat: string;
  line: number;
  odds: string;
  confidence?: number;
  playerId?: string;
  playerName?: string;
  playerImage?: string;
  statType?: string;
  overOdds?: number;
  underOdds?: number;
  winProbability?: number;
  sentimentScore?: number;
  newsSnippets?: Array<{ source: string; headline: string; url: string }>;
  lastUpdated?: string;
}

export interface PoeApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  timestamp: number;
  dataBlocks?: PoeDataBlock[];
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  roc_auc?: number;
  profit?: number;
  roi?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  winRate?: number;
  totalBets?: number;
  avgOdds?: number;
  timestamp: number;
}

export interface ModelPerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  roc_auc: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  kellyCriterion: number;
  expectedValue: number;
  calibrationScore: number;
  totalStake: number;
  totalPayout: number;
  totalProfit: number;
  winRate: number;
  avgOdds: number;
  totalBets: number;
  roi: number;
  history?: Array<{
    date: string;
    value: number;
    metric: string;
  }>;
  timeframe?: '7d' | '30d' | '90d' | '1y' | 'all';
  setTimeframe?: (timeframe: '7d' | '30d' | '90d' | '1y' | 'all') => void;
}

export interface AnalysisResult {
  type: string;
  confidence: number;
  value: number;
  metadata: Record<string, unknown>;
  timestamp: number;
}

export interface StrategyResult<T> {
  strategy: string;
  parameters: T;
  expectedValue: number;
  riskScore: number;
  recommendations: string[];
}

export interface PredictionResult {
  id: string;
  timestamp: number;
  data: Record<string, unknown>;
  confidence: number;
  analysis: AnalysisResult[];
  strategy: StrategyResult<Record<string, unknown>>;
  metadata: {
    duration: number;
    features: string[];
    dataSources: string[];
    analysisPlugins: string[];
    strategy: string;
  };
}

export interface BettingContext {
  gameId: string;
  propType: string;
  playerName?: string;
  odds: {
    over: number;
    under: number;
  };
  line: number;
  sport: string;
  gameTime: string;
  metadata?: Record<string, unknown>;
}

export interface BettingDecision {
  recommendation: 'over' | 'under' | 'pass';
  confidence: number;
  stake: number;
  expectedValue: number;
  reasoning: string[];
}

export interface PerformanceMetrics {
  winRate: number;
  roi: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalBets: number;
  totalProfit: number;
}

export interface UserStats {
  totalBets: number;
  winRate: number;
  roi: number;
  profitLoss: number;
  avgOdds: number;
  streak: {
    current: number;
    type: 'win' | 'loss';
    max: number;
  };
  lastBet?: string;
  lastWin?: string;
}

export interface PerformanceData {
  timestamp: string;
  metric: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
  benchmark?: number;
}

export interface Headline {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  relevantPlayers?: string[];
  sentiment?: number;
  importance?: number;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
  timestamp: number;
}

export interface Opportunity {
  id: string;
  sport: string;
  type: string;
  player?: string;
  team?: string;
  line: number;
  odds: {
    over: number;
    under: number;
  };
  recommendation: 'over' | 'under' | 'pass';
  confidence: number;
  expectedValue: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface BettingState {
  activeBets: BettingDecision[];
  placeBet: (bet: BettingDecision) => void;
  updateActiveBet: (betId: string, updates: Partial<BettingDecision>) => void;
  clearOpportunities: () => void;
  opportunities: Opportunity[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

export interface MLState {
  models: PredictionResult[];
  predictions: PredictionResult[];
  metrics: ModelMetrics;
  isLoading: boolean;
}

export interface DriftAlert {
  id: string;
  modelId: string;
  type: "data" | "concept" | "prediction";
  severity: "low" | "medium" | "high";
  message: string;
  timestamp: number;
}

export interface RootState {
  betting: BettingState;
  ml: MLState;
  ui: Record<string, unknown>;
  websocket: Record<string, unknown>;
}

export interface PoeNewsFeedContent {
  articles: Array<{
    id: string;
    title: string;
    source: string;
    snippet: string;
    url: string;
    imageUrl?: string;
    publishedAt: string;
  }>;
}

export interface PoeUserStatContent {
  statName: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  period?: string;
}

export interface Bet {
  id: string;
  userId: string;
  eventId: string;
  marketType: string;
  selection: string;
  odds: number;
  stake: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost' | 'void' | 'cancelled';
  placedAt: string;
  settledAt?: string;
  result?: 'win' | 'loss' | 'void' | 'cancelled';
  metadata?: Record<string, unknown>;
}

// User model interface
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;
  subscription?: {
    type: 'free' | 'premium' | 'pro';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: string;
  };
  bankroll?: {
    total: number;
    available: number;
    reserved: number;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  defaultSport: Sport;
  riskLevel: RiskLevel;
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface Prop {
  id: string;
  playerId: string;
  playerName: string;
  team: string;
  opponent: string;
  propType: PropType;
  line: number;
  overOdds: number;
  underOdds: number;
  gameDate: string;
  sport: Sport;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

// Enums
export enum RiskLevel {
  CONSERVATIVE = 'conservative',
  MODERATE = 'moderate',
  AGGRESSIVE = 'aggressive',
  EXTREME = 'extreme'
}

export enum BetStatus {
  PENDING = 'pending',
  WON = 'won',
  LOST = 'lost',
  VOID = 'void',
  CANCELLED = 'cancelled',
  PUSHED = 'pushed'
}
