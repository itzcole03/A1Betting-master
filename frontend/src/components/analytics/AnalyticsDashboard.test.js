import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import Analytics from '../../pages/Analytics';
describe('Analytics Dashboard', () => {
    it('renders analytics title and time period selector', () => {
        render(_jsx(Analytics, {}));
        expect(screen.getByText(/Analytics/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Time Period/i)).toBeInTheDocument();
    });
    it('renders loading indicators for stats and charts', () => {
        render(_jsx(Analytics, {}));
        expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
    });
    it('renders performance chart and prediction success chart', async () => {
        render(_jsx(Analytics, {}));
        expect(await screen.findByText(/Performance Over Time/i)).toBeInTheDocument();
        expect(await screen.findByText(/Prediction Success by Sport/i)).toBeInTheDocument();
    });
    it('matches snapshot', () => {
        const { asFragment } = render(_jsx(Analytics, {}));
        expect(asFragment()).toMatchSnapshot();
    });
});
