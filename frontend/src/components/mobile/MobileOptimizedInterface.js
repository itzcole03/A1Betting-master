import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Card, CardContent, Typography, Button, IconButton, BottomNavigation, BottomNavigationAction, SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Chip, Avatar, Badge, SpeedDial, SpeedDialAction, SpeedDialIcon, Paper, Stack, Grid, useTheme, useMediaQuery, Alert, Snackbar, LinearProgress, CircularProgress, Dialog, DialogContent, AppBar, Toolbar, } from "@mui/material";
import { Home, Analytics, TrendingUp, AccountBalance, Settings, Notifications, SwapVert, Menu, Close, MonetizationOn, Psychology, Security, Help, Feedback, ExitToApp, } from "@mui/icons-material";
import { formatCurrency, formatPercentage, formatDateTime, } from "../../utils/formatters";
const SwipeableCardStack = ({ cards, onCardSwipe, onCardTap, }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const handleDragEnd = useCallback((info) => {
        const threshold = 100;
        const velocity = info.velocity.x;
        const offset = info.offset.x;
        if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
            const direction = offset > 0 ? "right" : "left";
            const currentCard = cards[currentIndex];
            if (currentCard) {
                onCardSwipe(currentCard.id, direction);
            }
            setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
        }
        setDragOffset(0);
    }, [cards, currentIndex, onCardSwipe]);
    if (cards.length === 0) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", height: 200, children: _jsx(Typography, { variant: "body2", color: "textSecondary", children: "No cards to display" }) }));
    }
    return (_jsxs(Box, { sx: {
            position: "relative",
            height: 280,
            width: "100%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }, children: [_jsx(AnimatePresence, { children: cards.slice(currentIndex, currentIndex + 3).map((card, index) => (_jsx(motion.div, { drag: "x", dragConstraints: { left: 0, right: 0 }, onDragEnd: (_, info) => index === 0 && handleDragEnd(info), onTap: () => onCardTap(card), initial: {
                        scale: 1 - index * 0.05,
                        y: index * 10,
                        zIndex: 10 - index,
                        opacity: 1,
                    }, animate: {
                        scale: 1 - index * 0.05,
                        y: index * 10,
                        zIndex: 10 - index,
                        opacity: 1 - index * 0.3,
                        x: index === 0 ? dragOffset : 0,
                    }, exit: {
                        x: dragOffset > 0 ? 300 : -300,
                        opacity: 0,
                        transition: { duration: 0.3 },
                    }, style: {
                        position: "absolute",
                        width: "90%",
                        cursor: "pointer",
                    }, children: _jsx(Card, { sx: {
                            height: 240,
                            background: index === 0
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                : "rgba(255,255,255,0.95)",
                            color: index === 0 ? "white" : "inherit",
                            backdropFilter: "blur(10px)",
                            border: index === 0 ? "none" : "1px solid rgba(255,255,255,0.2)",
                        }, children: _jsxs(CardContent, { sx: {
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }, children: [_jsxs(Box, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, children: [_jsx(Chip, { label: card.category, size: "small", sx: {
                                                        backgroundColor: index === 0
                                                            ? "rgba(255,255,255,0.2)"
                                                            : "primary.main",
                                                        color: index === 0 ? "white" : "white",
                                                    } }), _jsx(Chip, { label: card.priority, size: "small", color: card.priority === "high"
                                                        ? "error"
                                                        : card.priority === "medium"
                                                            ? "warning"
                                                            : "success" })] }), _jsx(Typography, { variant: "h6", gutterBottom: true, sx: { fontWeight: "bold" }, children: card.title }), card.subtitle && (_jsx(Typography, { variant: "body2", sx: { opacity: 0.8 }, gutterBottom: true, children: card.subtitle }))] }), _jsxs(Box, { children: [card.type === "metric" && card.value && (_jsxs(Box, { children: [_jsx(Typography, { variant: "h3", sx: { fontWeight: "bold", mb: 1 }, children: typeof card.value === "number"
                                                        ? formatCurrency(card.value)
                                                        : card.value }), card.change && (_jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [card.trend === "up" ? (_jsx(TrendingUp, {})) : (_jsx(TrendingUp, { style: { transform: "rotate(180deg)" } })), _jsx(Typography, { variant: "body2", children: formatPercentage(Math.abs(card.change)) })] }))] })), card.type === "opportunity" && (_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", color: "success.main", fontWeight: "bold", children: formatCurrency(card.data?.profit || 0) }), _jsxs(Typography, { variant: "body2", children: ["Guaranteed Profit \u2022", " ", formatPercentage(card.data?.margin || 0), " margin"] })] })), card.timestamp && (_jsx(Typography, { variant: "caption", sx: { opacity: 0.6, mt: 1, display: "block" }, children: formatDateTime(card.timestamp) }))] })] }) }) }, `${card.id}-${currentIndex + index}`))) }), _jsx(Box, { sx: {
                    position: "absolute",
                    bottom: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 1,
                }, children: cards.map((_, index) => (_jsx(Box, { sx: {
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: index === currentIndex ? "white" : "rgba(255,255,255,0.3)",
                        transition: "all 0.3s ease",
                    } }, index))) })] }));
};
export const MobileOptimizedInterface = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    // State Management
    const [activeTab, setActiveTab] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [quickActionsOpen, setQuickActionsOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    // Mock Data
    const mobileCards = [
        {
            id: "profit-today",
            type: "metric",
            title: "Today's Profit",
            value: 234.5,
            change: 0.15,
            trend: "up",
            priority: "high",
            category: "Performance",
            timestamp: new Date(),
        },
        {
            id: "arbitrage-opp",
            type: "opportunity",
            title: "Lakers vs Warriors",
            subtitle: "Arbitrage Opportunity",
            priority: "high",
            category: "Arbitrage",
            data: { profit: 43.2, margin: 0.043 },
            timestamp: new Date(Date.now() - 300000),
        },
        {
            id: "win-rate",
            type: "metric",
            title: "Win Rate (7 days)",
            value: "64.2%",
            change: 0.08,
            trend: "up",
            priority: "medium",
            category: "Analytics",
            timestamp: new Date(Date.now() - 600000),
        },
        {
            id: "ml-prediction",
            type: "action",
            title: "New ML Prediction",
            subtitle: "Chiefs vs Bills - 89% confidence",
            priority: "medium",
            category: "ML",
            action: () => console.log("View prediction"),
            timestamp: new Date(Date.now() - 900000),
        },
    ];
    const quickActions = [
        {
            id: "place-bet",
            label: "Place Bet",
            icon: _jsx(MonetizationOn, {}),
            color: "primary",
            action: () => handleQuickAction("place-bet"),
        },
        {
            id: "check-arbitrage",
            label: "Arbitrage",
            icon: _jsx(SwapVert, {}),
            color: "success",
            action: () => handleQuickAction("check-arbitrage"),
            badge: 3,
        },
        {
            id: "ml-insights",
            label: "ML Insights",
            icon: _jsx(Psychology, {}),
            color: "secondary",
            action: () => handleQuickAction("ml-insights"),
        },
        {
            id: "portfolio",
            label: "Portfolio",
            icon: _jsx(AccountBalance, {}),
            color: "warning",
            action: () => handleQuickAction("portfolio"),
        },
    ];
    // Event Handlers
    const handleCardSwipe = useCallback((cardId, direction) => {
        const action = direction === "right" ? "saved" : "dismissed";
        setSnackbarMessage(`Card ${action}`);
        setSnackbarOpen(true);
    }, []);
    const handleCardTap = useCallback((card) => {
        setSelectedCard(card);
        if (card.action) {
            card.action();
        }
    }, []);
    const handleQuickAction = useCallback((actionId) => {
        setIsLoading(true);
        setSnackbarMessage(`Executing ${actionId}...`);
        setSnackbarOpen(true);
        setTimeout(() => {
            setIsLoading(false);
            setQuickActionsOpen(false);
        }, 2000);
    }, []);
    const handleTabChange = useCallback((_, newValue) => {
        setActiveTab(newValue);
    }, []);
    // Load notifications
    useEffect(() => {
        const mockNotifications = [
            {
                id: "notif-1",
                title: "New Arbitrage Opportunity",
                message: "Lakers vs Warriors - 4.3% profit margin",
                type: "opportunity",
                timestamp: new Date(Date.now() - 300000),
            },
            {
                id: "notif-2",
                title: "ML Model Updated",
                message: "Ensemble model accuracy improved to 74.2%",
                type: "update",
                timestamp: new Date(Date.now() - 900000),
            },
        ];
        setNotifications(mockNotifications);
    }, []);
    if (!isMobile) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", height: 400, children: _jsx(Alert, { severity: "info", children: "This interface is optimized for mobile devices. Please resize your browser or use a mobile device." }) }));
    }
    return (_jsxs(Box, { sx: {
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.default",
            overflow: "hidden",
        }, children: [_jsx(AppBar, { position: "static", elevation: 0, sx: { backgroundColor: "background.paper" }, children: _jsxs(Toolbar, { children: [_jsx(IconButton, { edge: "start", color: "inherit", onClick: () => setDrawerOpen(true), sx: { mr: 2 }, children: _jsx(Menu, {}) }), _jsx(Typography, { variant: "h6", sx: { flexGrow: 1, color: "text.primary" }, children: "A1Betting Mobile" }), _jsx(IconButton, { color: "inherit", sx: { color: "text.primary" }, children: _jsx(Badge, { badgeContent: notifications.length, color: "error", children: _jsx(Notifications, {}) }) })] }) }), _jsx(Box, { sx: { flex: 1, overflow: "hidden" }, children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 0 && (_jsxs(motion.div, { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 }, transition: { duration: 0.3 }, style: { height: "100%", overflow: "auto", padding: "16px" }, children: [_jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 6, children: _jsxs(Card, { sx: { textAlign: "center", p: 2 }, children: [_jsx(Typography, { variant: "h4", color: "success.main", fontWeight: "bold", children: formatCurrency(1247.5) }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Total Profit" })] }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Card, { sx: { textAlign: "center", p: 2 }, children: [_jsx(Typography, { variant: "h4", color: "primary.main", fontWeight: "bold", children: "64.2%" }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Win Rate" })] }) })] }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Recent Updates" }), _jsx(SwipeableCardStack, { cards: mobileCards, onCardSwipe: handleCardSwipe, onCardTap: handleCardTap })] }), _jsx(Typography, { variant: "h6", gutterBottom: true, children: "Quick Actions" }), _jsx(Grid, { container: true, spacing: 2, children: quickActions.map((action) => (_jsx(Grid, { item: true, xs: 6, children: _jsxs(Card, { sx: {
                                                p: 2,
                                                textAlign: "center",
                                                cursor: "pointer",
                                                "&:hover": { transform: "scale(1.02)" },
                                                transition: "transform 0.2s ease",
                                            }, onClick: action.action, children: [_jsx(Badge, { badgeContent: action.badge, color: "error", children: _jsx(Box, { sx: {
                                                            width: 56,
                                                            height: 56,
                                                            borderRadius: "50%",
                                                            backgroundColor: `${action.color}.main`,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            mx: "auto",
                                                            mb: 1,
                                                            color: "white",
                                                        }, children: action.icon }) }), _jsx(Typography, { variant: "body2", fontWeight: "medium", children: action.label })] }) }, action.id))) })] }, "home")), activeTab === 1 && (_jsxs(motion.div, { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 }, transition: { duration: 0.3 }, style: { height: "100%", overflow: "auto", padding: "16px" }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, children: "Analytics" }), _jsxs(Stack, { spacing: 2, children: [_jsxs(Card, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Profit Trend (7 Days)" }), _jsx(Box, { sx: {
                                                        height: 200,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }, children: _jsx(Typography, { variant: "body2", color: "textSecondary", children: "\uD83D\uDCC8 Chart visualization would go here" }) })] }), _jsxs(Card, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Performance by Sport" }), _jsx(Stack, { spacing: 1, children: ["NBA", "NFL", "MLB", "Tennis"].map((sport) => (_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "body2", children: sport }), _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [_jsx(LinearProgress, { variant: "determinate", value: Math.random() * 100, sx: { width: 60 } }), _jsx(Typography, { variant: "caption", children: formatPercentage(Math.random()) })] })] }, sport))) })] })] })] }, "analytics")), activeTab === 2 && (_jsxs(motion.div, { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 }, transition: { duration: 0.3 }, style: { height: "100%", overflow: "auto", padding: "16px" }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, children: "Portfolio" }), _jsx(Stack, { spacing: 2, children: _jsxs(Card, { sx: { p: 2 }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsx(Typography, { variant: "h6", children: "Current Positions" }), _jsx(Chip, { label: "5 Active", color: "primary", size: "small" })] }), _jsx(Stack, { spacing: 2, children: ["Lakers ML", "Chiefs -3.5", "Over 2.5 Goals"].map((position, index) => (_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", sx: {
                                                        p: 2,
                                                        border: 1,
                                                        borderColor: "divider",
                                                        borderRadius: 1,
                                                    }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", fontWeight: "medium", children: position }), _jsxs(Typography, { variant: "caption", color: "textSecondary", children: ["Stake: ", formatCurrency(100 + index * 50)] })] }), _jsxs(Box, { textAlign: "right", children: [_jsx(Typography, { variant: "body2", color: Math.random() > 0.5
                                                                        ? "success.main"
                                                                        : "error.main", fontWeight: "bold", children: formatCurrency((Math.random() - 0.5) * 100) }), _jsx(Typography, { variant: "caption", children: formatPercentage((Math.random() - 0.5) * 0.2) })] })] }, position))) })] }) })] }, "portfolio"))] }) }), _jsx(Paper, { sx: { position: "fixed", bottom: 0, left: 0, right: 0 }, elevation: 3, children: _jsxs(BottomNavigation, { value: activeTab, onChange: handleTabChange, children: [_jsx(BottomNavigationAction, { label: "Home", icon: _jsx(Home, {}) }), _jsx(BottomNavigationAction, { label: "Analytics", icon: _jsx(Analytics, {}) }), _jsx(BottomNavigationAction, { label: "Portfolio", icon: _jsx(AccountBalance, {}) }), _jsx(BottomNavigationAction, { label: "Settings", icon: _jsx(Settings, {}) })] }) }), _jsx(SpeedDial, { ariaLabel: "Quick Actions", sx: { position: "fixed", bottom: 80, right: 16 }, icon: _jsx(SpeedDialIcon, {}), open: quickActionsOpen, onClose: () => setQuickActionsOpen(false), onOpen: () => setQuickActionsOpen(true), children: quickActions.map((action) => (_jsx(SpeedDialAction, { icon: action.icon, tooltipTitle: action.label, onClick: action.action }, action.id))) }), _jsx(SwipeableDrawer, { anchor: "left", open: drawerOpen, onClose: () => setDrawerOpen(false), onOpen: () => setDrawerOpen(true), sx: {
                    "& .MuiDrawer-paper": {
                        width: "80%",
                        maxWidth: 320,
                    },
                }, children: _jsxs(Box, { sx: { p: 2 }, children: [_jsxs(Box, { display: "flex", alignItems: "center", gap: 2, mb: 3, children: [_jsx(Avatar, { sx: { width: 56, height: 56 }, children: "U" }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", children: "John Doe" }), _jsx(Typography, { variant: "body2", color: "textSecondary", children: "Premium Member" })] })] }), _jsx(List, { children: [
                                {
                                    icon: _jsx(Home, {}),
                                    text: "Dashboard",
                                    action: () => setActiveTab(0),
                                },
                                {
                                    icon: _jsx(Analytics, {}),
                                    text: "Analytics",
                                    action: () => setActiveTab(1),
                                },
                                {
                                    icon: _jsx(AccountBalance, {}),
                                    text: "Portfolio",
                                    action: () => setActiveTab(2),
                                },
                                {
                                    icon: _jsx(Settings, {}),
                                    text: "Settings",
                                    action: () => setActiveTab(3),
                                },
                                { icon: _jsx(Security, {}), text: "Security" },
                                { icon: _jsx(Help, {}), text: "Help & Support" },
                                { icon: _jsx(Feedback, {}), text: "Feedback" },
                                { icon: _jsx(ExitToApp, {}), text: "Logout" },
                            ].map((item, index) => (_jsxs(ListItem, { onClick: () => {
                                    item.action?.();
                                    setDrawerOpen(false);
                                }, sx: { cursor: "pointer" }, children: [_jsx(ListItemIcon, { children: item.icon }), _jsx(ListItemText, { primary: item.text })] }, item.text))) })] }) }), _jsxs(Dialog, { fullScreen: true, open: !!selectedCard, onClose: () => setSelectedCard(null), children: [_jsx(AppBar, { sx: { position: "relative" }, children: _jsxs(Toolbar, { children: [_jsx(IconButton, { edge: "start", color: "inherit", onClick: () => setSelectedCard(null), children: _jsx(Close, {}) }), _jsx(Typography, { sx: { ml: 2, flex: 1 }, variant: "h6", children: selectedCard?.title }), _jsx(Button, { autoFocus: true, color: "inherit", children: "Save" })] }) }), _jsx(DialogContent, { children: selectedCard && (_jsxs(Box, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, children: selectedCard.title }), _jsx(Typography, { variant: "body1", color: "textSecondary", paragraph: true, children: selectedCard.subtitle }), selectedCard.type === "metric" && (_jsxs(Card, { sx: { p: 3, textAlign: "center", mb: 2 }, children: [_jsx(Typography, { variant: "h2", color: "primary.main", fontWeight: "bold", children: typeof selectedCard.value === "number"
                                                ? formatCurrency(selectedCard.value)
                                                : selectedCard.value }), selectedCard.change && (_jsxs(Box, { display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 1, children: [selectedCard.trend === "up" ? (_jsx(TrendingUp, { color: "success" })) : (_jsx(TrendingUp, { style: {
                                                        transform: "rotate(180deg)",
                                                        color: theme.palette.error.main,
                                                    } })), _jsx(Typography, { variant: "h6", color: selectedCard.trend === "up"
                                                        ? "success.main"
                                                        : "error.main", children: formatPercentage(Math.abs(selectedCard.change)) })] }))] })), _jsx(Button, { variant: "contained", fullWidth: true, size: "large", sx: { mt: 2 }, children: "Take Action" })] })) })] }), _jsx(AnimatePresence, { children: isLoading && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, style: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }, children: _jsxs(Box, { textAlign: "center", sx: { color: "white" }, children: [_jsx(CircularProgress, { color: "inherit", size: 60 }), _jsx(Typography, { variant: "h6", sx: { mt: 2 }, children: "Loading..." })] }) })) }), _jsx(Snackbar, { open: snackbarOpen, autoHideDuration: 3000, onClose: () => setSnackbarOpen(false), message: snackbarMessage, anchorOrigin: { vertical: "top", horizontal: "center" } })] }));
};
export default MobileOptimizedInterface;
