import { SocialSentimentData } from '@/types';
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
export declare const fetchSocialSentiment: (topic: string) => Promise<SocialSentimentData>;
export declare const sentimentService: {
    fetchSocialSentiment: (topic: string) => Promise<SocialSentimentData>;
};
