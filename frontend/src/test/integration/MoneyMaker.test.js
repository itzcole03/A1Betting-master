import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MoneyMaker from '../../components/MoneyMaker';
import { useFilteredPredictions } from '../../hooks/useFilteredPredictions';
import { useAppStore } from '@/store/useAppStore';
// Mock the hooks and store
jest.mock('../../hooks/useFilteredPredictions');
jest.mock('../../store/useAppStore');
const mockPredictions = [
    {
        id: '1',
        player: 'John Doe',
        team: 'LAL',
        stat: 'POINTS',
        line: 20.5,
        prediction: 0.85,
        timestamp: new Date().toISOString(),
    },
    {
        id: '2',
        player: 'Jane Smith',
        team: 'BOS',
        stat: 'REBOUNDS',
        line: 8.5,
        prediction: 0.75,
        timestamp: new Date().toISOString(),
    },
];
describe('MoneyMaker Integration Tests', () => {
    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        // Mock useFilteredPredictions
        useFilteredPredictions.mockReturnValue({
            predictions: mockPredictions,
            loading: false,
            error: null,
            hasResults: true,
            totalPredictions: mockPredictions.length,
            filteredCount: mockPredictions.length,
        });
        // Mock useAppStore
        useAppStore.mockImplementation(selector => selector({
            props: mockPredictions,
            legs: [],
            entries: [],
            isLoadingProps: false,
            error: null,
            fetchProps: jest.fn(),
            addLeg: jest.fn(),
            removeLeg: jest.fn(),
            addToast: jest.fn(),
            fetchAppProps: jest.fn(),
            isLoadingAppProps: false,
            errorAppProps: null,
            betSlipLegs: [],
        }));
    });
    it('renders predictions and handles filtering', async () => {
        render(_jsx(BrowserRouter, { children: _jsx(MoneyMaker, {}) }));
        // Check if predictions are rendered
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        // Test filter interaction
        const filterInput = screen.getByPlaceholderText(/search/i);
        fireEvent.change(filterInput, { target: { value: 'John' } });
        // Wait for filtered results
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        });
    });
    it('handles loading state', () => {
        useFilteredPredictions.mockReturnValue({
            predictions: [],
            loading: true,
            error: null,
            hasResults: false,
            totalPredictions: 0,
            filteredCount: 0,
        });
        render(_jsx(BrowserRouter, { children: _jsx(MoneyMaker, {}) }));
        expect(screen.getByText(/loading predictions/i)).toBeInTheDocument();
    });
    it('handles error state', () => {
        const errorMessage = 'Failed to load predictions';
        useFilteredPredictions.mockReturnValue({
            predictions: [],
            loading: false,
            error: new Error(errorMessage),
            hasResults: false,
            totalPredictions: 0,
            filteredCount: 0,
        });
        render(_jsx(BrowserRouter, { children: _jsx(MoneyMaker, {}) }));
        expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
    });
    it('handles no results state', () => {
        useFilteredPredictions.mockReturnValue({
            predictions: [],
            loading: false,
            error: null,
            hasResults: false,
            totalPredictions: 0,
            filteredCount: 0,
        });
        render(_jsx(BrowserRouter, { children: _jsx(MoneyMaker, {}) }));
        expect(screen.getByTestId('no-results-fallback')).toBeInTheDocument();
    });
});
