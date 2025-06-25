import { User } from '@/types';
interface AuthServiceLoginResponse {
    user: User;
    token: string;
}
/**
 * Logs in a user.
 * Expected backend response (from /api/auth/login):
 * {
 *   "access_token": "string (jwt)",
 *   "token_type": "bearer",
 *   "user": { "id": "string", "username": "string", "email": "string", ... }
 * }
 */
export declare const login: (credentials: {
    email: string;
    password: string;
}) => Promise<AuthServiceLoginResponse>;
export declare const logout: () => Promise<void>;
/**
 * Fetches the current authenticated user's details.
 * Requires a valid JWT in the Authorization header (handled by apiClient interceptor).
 * Expected backend response (from /api/users/me, which should be a protected route):
 * {
 *   "id": "string",
 *   "username": "string",
 *   "email": "string",
 *   // ... other user fields as defined in the User type
 * }
 */
export declare const fetchCurrentUser: () => Promise<User>;
export declare const authService: {
    login: (credentials: {
        email: string;
        password: string;
    }) => Promise<AuthServiceLoginResponse>;
    logout: () => Promise<void>;
    fetchCurrentUser: () => Promise<User>;
};
export {};
