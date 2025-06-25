import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRiskProfile } from '@/hooks/useRiskProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
export function RiskProfileManager() {
    const { riskProfile, updateRiskProfile, setRiskLevel } = useRiskProfile();
    const handleRiskLevelChange = (value) => {
        setRiskLevel(value);
    };
    const handleSliderChange = (key, value) => {
        updateRiskProfile({ [key]: value[0] });
    };
    return (_jsxs(Card, { className: "w-full max-w-2xl mx-auto", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Risk Profile Settings" }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Risk Level" }), _jsxs(Select, { value: riskProfile.level, onValueChange: handleRiskLevelChange, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select risk level" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "low", children: "Low Risk" }), _jsx(SelectItem, { value: "medium", children: "Medium Risk" }), _jsx(SelectItem, { value: "high", children: "High Risk" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Maximum Stake Percentage" }), _jsx(Slider, { max: 10, min: 0.1, step: 0.1, value: [riskProfile.maxStakePercentage], onValueChange: value => handleSliderChange('maxStakePercentage', value) }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [riskProfile.maxStakePercentage, "% of bankroll"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Minimum Confidence" }), _jsx(Slider, { max: 95, min: 50, step: 1, value: [riskProfile.minConfidence * 100], onValueChange: value => handleSliderChange('minConfidence', [value[0] / 100]) }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [Math.round(riskProfile.minConfidence * 100), "%"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Maximum Kelly Fraction" }), _jsx(Slider, { max: 50, min: 5, step: 1, value: [riskProfile.maxKellyFraction * 100], onValueChange: value => handleSliderChange('maxKellyFraction', [value[0] / 100]) }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [Math.round(riskProfile.maxKellyFraction * 100), "%"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Stop Loss" }), _jsx(Slider, { max: 20, min: 1, step: 1, value: [riskProfile.stopLossPercentage], onValueChange: value => handleSliderChange('stopLossPercentage', value) }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [riskProfile.stopLossPercentage, "% of bankroll"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Take Profit" }), _jsx(Slider, { max: 50, min: 5, step: 1, value: [riskProfile.takeProfitPercentage], onValueChange: value => handleSliderChange('takeProfitPercentage', value) }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [riskProfile.takeProfitPercentage, "% of bankroll"] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium", children: "Diversification Rules" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Maximum Bets per Sport" }), _jsx(Slider, { max: 5, min: 1, step: 1, value: [riskProfile.diversificationRules.maxBetsPerSport], onValueChange: value => updateRiskProfile({
                                            diversificationRules: {
                                                ...riskProfile.diversificationRules,
                                                maxBetsPerSport: value[0],
                                            },
                                        }) }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [riskProfile.diversificationRules.maxBetsPerSport, " bets"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Maximum Bets per Market" }), _jsx(Slider, { max: 3, min: 1, step: 1, value: [riskProfile.diversificationRules.maxBetsPerMarket], onValueChange: value => updateRiskProfile({
                                            diversificationRules: {
                                                ...riskProfile.diversificationRules,
                                                maxBetsPerMarket: value[0],
                                            },
                                        }) }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [riskProfile.diversificationRules.maxBetsPerMarket, " bets"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Maximum Exposure per Event" }), _jsx(Slider, { max: 15, min: 1, step: 1, value: [riskProfile.diversificationRules.maxExposurePerEvent], onValueChange: value => updateRiskProfile({
                                            diversificationRules: {
                                                ...riskProfile.diversificationRules,
                                                maxExposurePerEvent: value[0],
                                            },
                                        }) }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [riskProfile.diversificationRules.maxExposurePerEvent, "% of bankroll"] })] })] })] })] }));
}
