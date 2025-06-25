import type { ModelPrediction as MLPrediction } from './ml/types.js';
interface User {
    id: string;
    username: string;
    avatar?: string;
    bio?: string;
    stats: {
        followers: number;
        following: number;
        totalBets: number;
        winningBets: number;
        roi: number;
        winStreak: number;
        largestWin: number;
        reputation: number;
    };
    preferences: {
        favoriteSports: string[];
        notifications: boolean;
        privateProfile: boolean;
    };
}
interface Post {
    id: string;
    userId: string;
    content: string;
    prediction?: MLPrediction;
    timestamp: number;
    likes: number;
    comments: number;
    shares: number;
    tags: string[];
    visibility: 'public' | 'followers' | 'private';
}
interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    timestamp: number;
    likes: number;
    replies: number;
}
interface LeaderboardEntry {
    userId: string;
    username: string;
    avatar?: string;
    roi: number;
    totalBets: number;
    winRate: number;
    streak: number;
    rank: number;
}
declare class SocialFeaturesService {
    private static instance;
    private users;
    private posts;
    private comments;
    private followers;
    private readonly CACHE_DURATION;
    private cache;
    private constructor();
    static getInstance(): SocialFeaturesService;
    createUser(username: string, avatar?: string, bio?: string): Promise<User>;
    getUser(userId: string): Promise<User | null>;
    updateUser(userId: string, updates: Partial<User>): Promise<User | null>;
    followUser(followerId: string, followingId: string): Promise<boolean>;
    unfollowUser(followerId: string, followingId: string): Promise<boolean>;
    createPost(userId: string, content: string, prediction?: MLPrediction, visibility?: 'public' | 'followers' | 'private', tags?: string[]): Promise<Post | null>;
    addComment(postId: string, userId: string, content: string): Promise<Comment | null>;
    likePost(postId: string, _userId: string): Promise<boolean>;
    sharePost(postId: string, _userId: string): Promise<boolean>;
    getLeaderboard(timeframe: 'day' | 'week' | 'month' | 'all'): Promise<LeaderboardEntry[]>;
    getFeed(userId: string, page?: number, pageSize?: number): Promise<Post[]>;
    /**
     * Get a value from the cache, typed.
     */
    /**
     * Get a value from the cache, type-safe.
     */
    private getFromCache;
    /**
     * Set a value in the cache, typed.
     */
    /**
     * Set a value in the cache, type-safe.
     */
    private setCache;
}
export declare const socialFeatures: SocialFeaturesService;
export {};
