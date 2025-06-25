import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { predictionService } from '../../services/predictionService'; // If fetched directly, added GeneralInsight
// import { useAppStore } from '@/store/useAppStore'; // If insights come via general app state
// interface Insight { // Using GeneralInsight from service now
//     id: string;
//     text: string;
//     source: string;
//     // Add other relevant fields like type, confidence, relatedEntityId, etc.
// }
const MLInsights = () => {
    const [insights, setInsights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchInsights = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await predictionService.fetchGeneralInsights();
                setInsights(data);
            }
            catch (e) {
                console.error("Failed to fetch ML insights", e);
                setError(e.message || "An unknown error occurred while fetching insights.");
                setInsights([]); // Clear insights on error
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchInsights();
    }, []);
    // Placeholder content removed
    // const placeholderInsights = [
    //   { id: 'insight1', text: 'Based on recent trends, consider Player A for Over 25.5 Points.', source: 'Performance Analyzer' },
    //   { id: 'insight2', text: 'Social sentiment for Team B is highly positive for their upcoming match.', source: 'Sentiment Engine' },
    //   { id: 'insight3', text: 'Arbitrage opportunity detected: Prop X (Over) vs Prop Y (Under).', source: 'Arbitrage Scanner' },
    // ];
    if (isLoading)
        return (_jsxs("div", { className: "flex items-center justify-center p-6 glass rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse-soft", children: [_jsx(Loader2, { className: "w-6 h-6 animate-spin text-primary mr-2" }), _jsx("p", { className: "text-text-muted", children: "Loading AI insights..." })] }));
    if (error)
        return (_jsxs("div", { className: "p-6 glass rounded-xl bg-red-500/10 text-red-400 flex items-center animate-fade-in", children: [_jsx(AlertTriangle, { size: 20, className: "mr-2" }), " Error: ", error] }));
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "mb-2 flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: "\uD83E\uDD16" }), _jsx("h4", { className: "text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent", children: "Machine Learning Insights" })] }), Array.isArray(insights) && insights.length > 0 ? ((insights || []).map(insight => (_jsxs("div", { className: "p-4 glass rounded-xl shadow-md bg-gradient-to-r from-purple-400/10 to-blue-400/10 animate-fade-in", children: [_jsx("p", { className: "text-base text-text font-semibold mb-1", children: insight.text }), _jsxs("p", { className: "text-xs text-text-muted mt-1", children: ["Source: ", insight.source, insight.confidence && ` | Confidence: ${(insight.confidence * 100).toFixed(0)}%`, insight.type && ` | Type: ${insight.type}`] })] }, insight.id)))) : (_jsx("p", { className: "text-text-muted text-center p-4", children: "No AI insights available at the moment." }))] }));
};
export default MLInsights;
