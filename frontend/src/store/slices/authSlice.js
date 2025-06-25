// import type { User } from '@/types'; // Removed, does not exist
import { UnifiedMonitor } from '../../core/UnifiedMonitor';
const unifiedMonitor = UnifiedMonitor.getInstance();
const TOKEN_STORAGE_KEY = 'authToken';
// ADDED: Exportable initial state for AuthSlice
export const initialAuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    webSocketAuthStatus: null,
    webSocketClientId: null,
};
// Helper to get the authService (can be overridden in tests)
export async function getAuthService() {
    return (await import('../../services/authService')).authService;
}
export const createAuthSlice = (set, get) => ({
    // Uses the initial state properties directly
    ...initialAuthState,
    // Functions are defined below
    initializeAuth: async () => {
        set({ isLoading: true, error: null });
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
            set({ token }); // Set token in store immediately
            try {
                const authService = await getAuthService();
                const user = await authService.fetchCurrentUser();
                set({ user, isAuthenticated: true, isLoading: false });
                get().setWebSocketAuthStatus('required');
            }
            catch (error) {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: 'Session expired. Please log in again.',
                });
                get().setWebSocketAuthStatus(null);
            }
        }
        else {
            set({ isLoading: false }); // No token, not loading
        }
    },
    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const authService = await getAuthService();
            const result = await authService.login(credentials);
            if (!result || !result.user || !result.token) {
                throw new Error('Invalid login response from server.');
            }
            const { user, token } = result;
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            set({ user, token, isAuthenticated: true, isLoading: false, error: null });
            get().setWebSocketAuthStatus('required'); // WebSocket might need re-auth
        }
        catch (error) {
            const errorMessage = error.message || 'Login failed. Please try again.';
            set({
                isLoading: false,
                error: errorMessage,
                isAuthenticated: false,
                user: null,
                token: null,
            });
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        const currentToken = get().token;
        try {
            if (currentToken) {
                const authService = await getAuthService();
                await authService.logout(); // Call backend logout
            }
        }
        catch (logoutError) {
            get().setWebSocketAuthStatus(null);
        }
        finally {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                webSocketAuthStatus: null,
            });
            get().setWebSocketAuthStatus(null);
        }
    },
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    setWebSocketAuthStatus: (status) => set({ webSocketAuthStatus: status }),
    setWebSocketClientId: (clientId) => set({ webSocketClientId: clientId }), // Implement setter
});
