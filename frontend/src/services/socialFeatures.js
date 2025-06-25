class SocialFeaturesService {
    constructor() {
        this.users = new Map();
        this.posts = new Map();
        this.comments = new Map();
        this.followers = new Map();
        this.CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
        this.cache = new Map();
    }
    static getInstance() {
        if (!SocialFeaturesService.instance) {
            SocialFeaturesService.instance = new SocialFeaturesService();
        }
        return SocialFeaturesService.instance;
    }
    // User Management
    async createUser(username, avatar, bio) {
        const user = {
            id: `user_${Date.now()}`,
            username,
            avatar,
            bio,
            stats: {
                followers: 0,
                following: 0,
                totalBets: 0,
                winningBets: 0,
                roi: 0,
                winStreak: 0,
                largestWin: 0,
                reputation: 0,
            },
            preferences: {
                favoriteSports: [],
                notifications: true,
                privateProfile: false,
            },
        };
        this.users.set(user.id, user);
        this.followers.set(user.id, new Set());
        return user;
    }
    async getUser(userId) {
        return this.users.get(userId) || null;
    }
    async updateUser(userId, updates) {
        const user = this.users.get(userId);
        if (!user)
            return null;
        const updatedUser = { ...user, ...updates };
        this.users.set(userId, updatedUser);
        return updatedUser;
    }
    // Following System
    async followUser(followerId, followingId) {
        if (!this.users.has(followerId) || !this.users.has(followingId)) {
            return false;
        }
        const followers = this.followers.get(followingId);
        if (!followers)
            return false;
        followers.add(followerId);
        const user = this.users.get(followingId);
        if (user) {
            user.stats.followers++;
            this.users.set(followingId, user);
        }
        const follower = this.users.get(followerId);
        if (follower) {
            follower.stats.following++;
            this.users.set(followerId, follower);
        }
        return true;
    }
    async unfollowUser(followerId, followingId) {
        const followers = this.followers.get(followingId);
        if (!followers)
            return false;
        const success = followers.delete(followerId);
        if (success) {
            const user = this.users.get(followingId);
            if (user) {
                user.stats.followers--;
                this.users.set(followingId, user);
            }
            const follower = this.users.get(followerId);
            if (follower) {
                follower.stats.following--;
                this.users.set(followerId, follower);
            }
        }
        return success;
    }
    // Posts and Comments
    async createPost(userId, content, prediction, visibility = 'public', tags = []) {
        if (!this.users.has(userId))
            return null;
        const post = {
            id: `post_${Date.now()}`,
            userId,
            content,
            prediction,
            timestamp: Date.now(),
            likes: 0,
            comments: 0,
            shares: 0,
            tags,
            visibility,
        };
        this.posts.set(post.id, post);
        return post;
    }
    async addComment(postId, userId, content) {
        if (!this.posts.has(postId) || !this.users.has(userId))
            return null;
        const comment = {
            id: `comment_${Date.now()}`,
            postId,
            userId,
            content,
            timestamp: Date.now(),
            likes: 0,
            replies: 0,
        };
        this.comments.set(comment.id, comment);
        const post = this.posts.get(postId);
        if (post) {
            post.comments++;
            this.posts.set(postId, post);
        }
        return comment;
    }
    // Engagement
    async likePost(postId, _userId) {
        const post = this.posts.get(postId);
        if (!post)
            return false;
        post.likes++;
        this.posts.set(postId, post);
        return true;
    }
    async sharePost(postId, _userId) {
        const post = this.posts.get(postId);
        if (!post)
            return false;
        post.shares++;
        this.posts.set(postId, post);
        return true;
    }
    // Leaderboards
    async getLeaderboard(timeframe) {
        const cacheKey = `leaderboard_${timeframe}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        const entries = Array.from(this.users.values())
            .map(user => ({
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            roi: user.stats.roi,
            totalBets: user.stats.totalBets,
            winRate: user.stats.winningBets / user.stats.totalBets,
            streak: user.stats.winStreak,
            rank: 0,
        }))
            .sort((a, b) => b.roi - a.roi);
        entries.forEach((entry, index) => {
            entry.rank = index + 1;
        });
        this.setCache(cacheKey, entries);
        return entries;
    }
    // Feed
    async getFeed(userId, page = 1, pageSize = 10) {
        const user = this.users.get(userId);
        if (!user)
            return [];
        const followers = this.followers.get(userId);
        if (!followers)
            return [];
        const allPosts = Array.from(this.posts.values())
            .filter(post => {
            if (post.visibility === 'public')
                return true;
            if (post.visibility === 'followers')
                return followers.has(post.userId);
            return post.userId === userId;
        })
            .sort((a, b) => b.timestamp - a.timestamp);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return allPosts.slice(start, end);
    }
    // Cache Management
    /**
     * Get a value from the cache, typed.
     */
    /**
     * Get a value from the cache, type-safe.
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return null;
        if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }
    /**
     * Set a value in the cache, typed.
     */
    /**
     * Set a value in the cache, type-safe.
     */
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }
}
export const socialFeatures = SocialFeaturesService.getInstance();
