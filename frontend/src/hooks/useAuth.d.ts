interface User {
    id: string;
    username: string;
    email: string;
}
export declare const useAuth: () => {
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
};
export {};
