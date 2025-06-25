import { useState, useEffect } from 'react';
import { bookmakerAnalysisService } from '../services/analytics/BookmakerAnalysisService';
export const useBookmakerAnalysis = (propData) => {
    const [state, setState] = useState({
        isLoading: false,
        error: null,
        analysis: null,
    });
    useEffect(() => {
        if (!propData) {
            setState((prev) => ({ ...prev, analysis: null }));
            return;
        }
        const fetchAnalysis = async () => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));
            try {
                const analysis = await bookmakerAnalysisService.analyzeProp(propData);
                setState({
                    isLoading: false,
                    error: null,
                    analysis: {
                        suspiciousLevel: analysis.bookmakerIntent.suspiciousLevel,
                        warning: analysis.warnings.join(' '),
                        adjustedProbability: analysis.adjustedProbability,
                        riskScore: analysis.riskScore,
                    },
                });
            }
            catch (error) {
                setState({
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Failed to analyze prop',
                    analysis: null,
                });
            }
        };
        fetchAnalysis();
    }, [propData]);
    const refreshAnalysis = async () => {
        if (!propData)
            return;
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const analysis = await bookmakerAnalysisService.analyzeProp(propData);
            setState({
                isLoading: false,
                error: null,
                analysis: {
                    suspiciousLevel: analysis.bookmakerIntent.suspiciousLevel,
                    warning: analysis.warnings.join(' '),
                    adjustedProbability: analysis.adjustedProbability,
                    riskScore: analysis.riskScore,
                },
            });
        }
        catch (error) {
            setState({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to analyze prop',
                analysis: null,
            });
        }
    };
    return {
        ...state,
        refreshAnalysis,
    };
};
export default useBookmakerAnalysis;
