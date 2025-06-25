import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../Dashboard';
import { getActiveBets, getTotalWinnings, getWinRate } from '@services/bettingService';
// Mock the betting service
jest.mock('@services/bettingService', () => ({
    getActiveBets: jest.fn(),
    getTotalWinnings: jest.fn(),
    getWinRate: jest.fn(),
}));
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const renderDashboard = () => {
    return render(_jsx(QueryClientProvider, { client: queryClient, children: _jsx(Dashboard, {}) }));
};
describe('Dashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('renders loading state initially', () => {
        renderDashboard();
        expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
    });
    it('renders error state when API calls fail', async () => {
        getActiveBets.mockRejectedValue(new Error('API Error'));
        getTotalWinnings.mockRejectedValue(new Error('API Error'));
        getWinRate.mockRejectedValue(new Error('API Error'));
        renderDashboard();
        await waitFor(() => {
            expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
        });
    });
    it('renders dashboard data when API calls succeed', async () => {
        getActiveBets.mockResolvedValue(5);
        getTotalWinnings.mockResolvedValue(1000);
        getWinRate.mockResolvedValue(75);
        renderDashboard();
        await waitFor(() => {
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('$1,000')).toBeInTheDocument();
            expect(screen.getByText('75%')).toBeInTheDocument();
        });
    });
});
