import { APIError, AppError } from "../core/UnifiedError";
import axios from "axios";
import { unifiedMonitor } from "../core/UnifiedMonitor";
const API_BASE_URL = import.meta.env.VITE_API_URL;
// Backend endpoint for sentiment is /api/sentiment/{topic}
const SENTIMENT_BACKEND_PREFIX = `${API_BASE_URL}/api/sentiment`;
/**
 * Fetches social sentiment data for a given topic (e.g., player name, team).
 * The backend /api/sentiment/{topic} endpoint is currently mocked.
 * Expected backend response structure (BackendSentimentResponse from backend routes/sentiment_route.py):
 * {
 *   "topic": "string",
 *   "sentiment_score": number, // e.g., -1 to 1
 *   "sentiment_label": "string", // e.g., "positive", "negative", "neutral"
 *   "confidence": number, // e.g., 0 to 1 (optional)
 *   "related_articles_count": number // (optional)
 * }
 *
 * NOTE: The current frontend mapping in this service approximates positive/negative/neutral mentions
 * based on sentiment_label and related_articles_count. A production backend should ideally provide these counts directly.
 */
export const fetchSocialSentiment = async (topic) => {
  const trace = unifiedMonitor.startTrace(
    "sentimentService.fetchSocialSentiment",
    "http.client",
  );
  try {
    if (!topic || topic.trim() === "") {
      throw new AppError(
        "Topic cannot be empty for sentiment analysis.",
        undefined,
        { operation: "fetchSocialSentiment" },
      );
    }
    const endpoint = `${SENTIMENT_BACKEND_PREFIX}/${encodeURIComponent(topic)}`;
    const response = await axios.get(endpoint);
    if (trace) {
      trace.setHttpStatus(response.status);
      unifiedMonitor.endTrace(trace);
    }
    // Map backend response to frontend SocialSentimentData type
    const backendData = response.data;
    const sentimentData = {
      topic: backendData.topic,
      sentimentScore: backendData.sentiment_score,
      // Positive/negative/neutral mentions are not directly provided by the mock backend endpoint.
      // The backend sentiment_label could be used, or these could be defaulted/omitted.
      // For now, let's use sentiment_label to guide a rough estimation or set to 0.
      positiveMentions:
        backendData.sentiment_label === "positive"
          ? backendData.related_articles_count || 1
          : 0,
      negativeMentions:
        backendData.sentiment_label === "negative"
          ? backendData.related_articles_count || 1
          : 0,
      neutralMentions:
        backendData.sentiment_label === "neutral"
          ? backendData.related_articles_count || 1
          : 0,
      source: "BackendSentimentModel", // Or derive from backend response if available
      lastUpdatedAt: new Date().toISOString(), // Backend doesn't provide this, use current time
    };
    return sentimentData;
  } catch (error) {
    const errContext = {
      service: "sentimentService",
      operation: "fetchSocialSentiment",
      topic,
    };
    unifiedMonitor.reportError(error, errContext);
    if (trace) {
      trace.setHttpStatus(error.response?.status || 500);
      unifiedMonitor.endTrace(trace);
    }
    if (error instanceof APIError || error instanceof AppError) throw error;
    throw new AppError(
      "Failed to fetch social sentiment from backend.",
      undefined,
      errContext,
      error,
    );
  }
};
export const sentimentService = {
  fetchSocialSentiment,
  // fetchHistoricalSentiment: async (topic: string, range: string): Promise<HistoricalSentimentData[]> => { ... }
};
