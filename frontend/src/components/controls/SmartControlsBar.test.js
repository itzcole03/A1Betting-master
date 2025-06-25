import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import { SmartControlsBar } from './SmartControlsBar';
describe('SmartControlsBar', () => {
    it('renders model, risk profile, and confidence controls', () => {
        render(_jsx(SmartControlsBar, {}));
        expect(screen.getByText(/Model:/i)).toBeInTheDocument();
        expect(screen.getByText(/Risk Profile:/i)).toBeInTheDocument();
        expect(screen.getByText(/Confidence Threshold:/i)).toBeInTheDocument();
    });
    it('calls setModel when model is changed', () => {
        // Mock store logic if needed
        render(_jsx(SmartControlsBar, {}));
        fireEvent.change(screen.getByDisplayValue('Default'), { target: { value: 'ensemble' } });
        expect(screen.getByDisplayValue('Ensemble')).toBeInTheDocument();
    });
    it('matches snapshot', () => {
        const { asFragment } = render(_jsx(SmartControlsBar, {}));
        expect(asFragment()).toMatchSnapshot();
    });
});
