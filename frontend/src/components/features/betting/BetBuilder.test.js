import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { BetBuilder } from './BetBuilder';
describe('BetBuilder', () => {
    it('renders SmartControlsBar and PayoutPreview', () => {
        render(_jsx(BetBuilder, {}));
        expect(screen.getByText(/Model:/i)).toBeInTheDocument();
        expect(screen.getByText(/Payout Preview/i)).toBeInTheDocument();
    });
    it('matches snapshot', () => {
        const { asFragment } = render(_jsx(BetBuilder, {}));
        expect(asFragment()).toMatchSnapshot();
    });
});
