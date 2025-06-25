import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography } from "@mui/material";
const PayoutPreview = ({ payout }) => (_jsxs(Box, { mt: 1, mb: 1, children: [_jsx(Typography, { variant: "subtitle2", children: "Payout Preview" }), _jsxs(Typography, { variant: "h5", color: "primary", children: ["$", payout.toFixed(2)] })] }));
export default PayoutPreview;
