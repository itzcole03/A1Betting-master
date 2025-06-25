import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Import the user-friendly main interface
import UserFriendlyApp from "./components/user-friendly/UserFriendlyApp";

// Import styling
import "./App.css";

// Create query client for API state management
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});

/**
 * Main App Component - Now using UserFriendlyApp as primary interface
 *
 * This provides:
 * - Simple user-friendly interface by default
 * - Advanced/admin mode toggle (🔄 emoji button)
 * - All ML/AI features working autonomously in background
 * - Real-time stats and updates
 * - Beautiful, sleek, modern design
 * - Responsive mobile support
 */
const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <UserFriendlyApp />
        </QueryClientProvider>
    );
};

export default App;
