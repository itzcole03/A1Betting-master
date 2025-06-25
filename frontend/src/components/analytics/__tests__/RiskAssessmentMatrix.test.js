import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import RiskAssessmentMatrix from '../RiskAssessmentMatrix';
import { usePredictionStore } from '../../../stores/predictionStore';
jest.mock('../../../stores/predictionStore');
usePredictionStore.mockReturnValue({
    getLatestPredictions: () => [
        { analytics: { risk: { riskCategory: 'high' } } },
        { analytics: { risk: { riskCategory: 'medium' } } },
        { analytics: { risk: { riskCategory: 'high' } } },
    ],
});
describe('RiskAssessmentMatrix', () => {
    it('renders risk categories and counts', () => {
        render(_jsx(RiskAssessmentMatrix, {}));
        expect(screen.getByText('high: 2')).toBeInTheDocument();
        expect(screen.getByText('medium: 1')).toBeInTheDocument();
    });
});
