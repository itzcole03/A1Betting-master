import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardContent, Typography, Grid, Chip, Avatar, Tooltip, LinearProgress, } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, LocalFireDepartment as FireIcon, ThumbUp as ThumbUpIcon, Comment as CommentIcon, Share as ShareIcon, } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
const TrendingCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));
const ConfidenceBar = styled(LinearProgress)(({ theme }) => ({
    height: 4,
    borderRadius: 2,
    marginTop: theme.spacing(0.5),
}));
export const TrendingProps = ({ props, onPropSelect }) => {
    const getConfidenceColor = (confidence) => {
        if (confidence >= 80)
            return 'success.main';
        if (confidence >= 60)
            return 'primary.main';
        if (confidence >= 40)
            return 'warning.main';
        return 'error.main';
    };
    return (_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Trending Props" }), _jsx(Grid, { container: true, spacing: 2, children: props.map(prop => (_jsx(Grid, { item: true, xs: 12, children: _jsx(TrendingCard, { children: _jsx(CardContent, { children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "h6", children: prop.playerName }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [_jsx(FireIcon, { color: "error" }), _jsx(Typography, { color: "error", variant: "h6", children: prop.fireCount })] })] }), _jsxs(Typography, { color: "textSecondary", variant: "body2", children: [prop.team, " \u2022 ", prop.propType] })] }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Box, { sx: {
                                                p: 2,
                                                bgcolor: 'action.hover',
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                            }, children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { color: "textSecondary", variant: "body2", children: "Line" }), _jsx(Typography, { variant: "h6", children: prop.value })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { color: "textSecondary", variant: "body2", children: "Direction" }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 1, children: [prop.direction === 'over' ? (_jsx(TrendingUpIcon, { color: "success" })) : (_jsx(TrendingDownIcon, { color: "error" })), _jsx(Typography, { color: prop.direction === 'over' ? 'success.main' : 'error.main', variant: "h6", children: prop.direction.toUpperCase() }), prop.modifier && (_jsx(Chip, { color: prop.modifier === 'goblin' ? 'success' : 'error', label: prop.modifier, size: "small" }))] })] })] }) }) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Box, { alignItems: "center", display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { color: "textSecondary", variant: "body2", children: "Community Confidence" }), _jsxs(Typography, { color: getConfidenceColor(prop.confidence), variant: "body1", children: [prop.confidence, "%"] })] }), _jsx(ConfidenceBar, { sx: {
                                                    bgcolor: 'grey.200',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: getConfidenceColor(prop.confidence),
                                                    },
                                                }, value: prop.confidence, variant: "determinate" })] }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { display: "flex", gap: 2, children: [_jsx(Tooltip, { title: "Likes", children: _jsxs(Box, { alignItems: "center", display: "flex", gap: 0.5, children: [_jsx(ThumbUpIcon, { fontSize: "small" }), _jsx(Typography, { variant: "body2", children: prop.communityStats.likes })] }) }), _jsx(Tooltip, { title: "Comments", children: _jsxs(Box, { alignItems: "center", display: "flex", gap: 0.5, children: [_jsx(CommentIcon, { fontSize: "small" }), _jsx(Typography, { variant: "body2", children: prop.communityStats.comments })] }) }), _jsx(Tooltip, { title: "Shares", children: _jsxs(Box, { alignItems: "center", display: "flex", gap: 0.5, children: [_jsx(ShareIcon, { fontSize: "small" }), _jsx(Typography, { variant: "body2", children: prop.communityStats.shares })] }) })] }) }), prop.topComment && (_jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { sx: {
                                                p: 1,
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                            }, children: [_jsxs(Box, { alignItems: "center", display: "flex", gap: 1, mb: 1, children: [_jsx(Avatar, { alt: prop.topComment.user, src: prop.topComment.avatar, sx: { width: 24, height: 24 } }), _jsx(Typography, { fontWeight: "bold", variant: "body2", children: prop.topComment.user })] }), _jsx(Typography, { variant: "body2", children: prop.topComment.text }), _jsxs(Box, { alignItems: "center", display: "flex", gap: 0.5, mt: 1, children: [_jsx(ThumbUpIcon, { color: "action", fontSize: "small" }), _jsx(Typography, { color: "textSecondary", variant: "caption", children: prop.topComment.likes })] })] }) }))] }) }) }) }, prop.id))) })] }));
};
