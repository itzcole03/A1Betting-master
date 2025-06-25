import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import GlassCard from '../components/ui/GlassCard';
import EnhancedPropCard from '../components/ui/EnhancedPropCard';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { "aria-labelledby": `predictions-tab-${index}`, hidden: value !== index, id: `predictions-tabpanel-${index}`, role: "tabpanel", ...other, children: value === index && _jsx(Box, { sx: { p: 3 }, children: children }) }));
}
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ||
    "ws://localhost:8000/ws/model-predictions/client-frontend";
const riskProfiles = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
];
const Predictions = () => {
    const [value, setValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [search, setSearch] = useState("");
    const [riskProfile, setRiskProfile] = useState("medium");
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);
    useEffect(() => {
        setLoading(true);
        setError(null);
        // Safety checks to prevent invalid WebSocket connections
        if (!WS_URL ||
            WS_URL === "" ||
            WS_URL === "wss://api.betproai.com/ws" ||
            WS_URL.includes("api.betproai.com") ||
            WS_URL.includes("localhost:8000") ||
            import.meta.env.VITE_ENABLE_WEBSOCKET === "false") {
            console.log("WebSocket connection disabled for Predictions page:", WS_URL);
            setLoading(false);
            setError("WebSocket connections are currently disabled");
            return;
        }
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;
        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "prediction_request",
                features: {},
                riskProfile: { type: riskProfile },
            }));
        };
        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === "prediction_result") {
                    setPredictions(Array.isArray(msg.data.prediction)
                        ? msg.data.prediction
                        : [msg.data.prediction]);
                    setLoading(false);
                }
                else if (msg.type === "error") {
                    setError(msg.data?.message || "Error fetching predictions");
                    setLoading(false);
                }
                else {
                    // Handle other message types if needed
                }
            }
            catch (e) {
                setError("Malformed message from server");
                setLoading(false);
            }
        };
        ws.onerror = () => {
            setError("WebSocket error");
            setLoading(false);
        };
        ws.onclose = () => {
            // Optionally: try to reconnect
        };
        return () => {
            ws.close();
        };
    }, [riskProfile]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleMenuClick = (event, predictionId) => {
        setAnchorEl(event.currentTarget);
        setSelectedPrediction(predictionId);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPrediction(null);
    };
    const handleAction = (action) => {
        // TODO: Implement bet actions
        handleMenuClose();
    };
    const filteredPredictions = predictions.filter((p) => (!search ||
        p.match?.toLowerCase().includes(search.toLowerCase()) ||
        p.sport?.toLowerCase().includes(search.toLowerCase())) &&
        (value === 0
            ? p.status === "active"
            : value === 1
                ? p.status === "completed"
                : true));
    return (_jsx("div", { className: "p-6 space-y-8 min-h-screen bg-gradient-to-br from-purple-900/80 to-purple-700/80 dark:from-gray-900 dark:to-gray-800 transition-colors", children: _jsxs(GlassCard, { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4", children: "Model Predictions" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: [filteredPredictions.length === 0 && !loading && (_jsx(Grid, { item: true, xs: 12, children: _jsx(Typography, { children: "No predictions found." }) })), filteredPredictions.map((prediction) => (_jsx(Grid, { item: true, xs: 12, children: _jsx(EnhancedPropCard, { playerName: prediction.match, team: prediction.sport, position: prediction.prediction, statType: "Confidence", line: Math.round(prediction.confidence * 100), overOdds: prediction.odds, underOdds: prediction.odds, pickType: "normal", trendValue: prediction.trend === "up" ? 1 : -1, gameInfo: { opponent: 'BOS', day: 'Fri', time: '7:30pm' }, playerImageUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png", onSelect: () => { }, onViewDetails: () => { } }) }, prediction.id)))] })] }) }));
};
export default Predictions;
