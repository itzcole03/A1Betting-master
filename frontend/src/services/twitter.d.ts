interface Tweet {
    id: string;
    text: string;
    author: {
        id: string;
        username: string;
        followers: number;
        verified: boolean;
    };
    metrics: {
        likes: number;
        retweets: number;
        replies: number;
    };
    sentiment: {
        score: number;
        confidence: number;
        aspects: {
            [key: string]: number;
        };
    };
    createdAt: string;
}
interface SentimentAnalysis {
    overall: {
        score: number;
        confidence: number;
        volume: number;
    };
    timeline: {
        timestamp: string;
        score: number;
        volume: number;
    }[];
    aspects: {
        [key: string]: {
            score: number;
            volume: number;
        };
    };
    influencers: {
        author: {
            id: string;
            username: string;
            followers: number;
        };
        impact: number;
        sentiment: number;
    }[];
}
declare class TwitterService {
    private config;
    constructor();
    searchTweets(query: string, options?: {
        startTime?: string;
        endTime?: string;
        maxResults?: number;
    }): Promise<Tweet[]>;
    getSentimentAnalysis(entity: string, options?: {
        startTime?: string;
        endTime?: string;
        aspects?: string[];
    }): Promise<SentimentAnalysis>;
    getTrendingTopics(sport: string): Promise<string[]>;
    getUserSentiment(username: string): Promise<{
        overall: number;
        recent: number;
        topics: {
            [key: string]: number;
        };
    }>;
}
export declare const twitterService: TwitterService;
export {};
