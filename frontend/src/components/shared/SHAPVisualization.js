import { jsx as _jsx } from "react/jsx-runtime";
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
const SHAPVisualization = ({ explanations }) => {
    return (_jsx(Box, { display: "flex", flexWrap: "wrap", gap: 1, children: explanations.map((feat, idx) => (_jsx(Tooltip, { title: `Impact: ${feat.impact.toFixed(2)}, Value: ${feat.value}`, children: _jsx(Chip, { color: feat.direction === 'positive' ? 'success' : 'error', label: `${feat.feature} (${feat.direction === 'positive' ? '+' : '−'}${feat.impact.toFixed(2)})`, size: "small", variant: "outlined" }) }, idx))) }));
};
export default SHAPVisualization;
