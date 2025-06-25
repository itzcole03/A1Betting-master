// ============================================================================
// UNIVERSAL UTILITIES - Consolidated helper functions
// ============================================================================
// Format utilities
export const formatters = {
    currency: (amount, currency = "USD") => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(amount);
    },
    percentage: (value, decimals = 1) => {
        return `${(value * 100).toFixed(decimals)}%`;
    },
    number: (value, decimals = 0) => {
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    },
    date: (date, format = "short") => {
        const d = typeof date === "string" ? new Date(date) : date;
        return new Intl.DateTimeFormat("en-US", {
            dateStyle: format,
            timeStyle: format === "full" ? "short" : undefined,
        }).format(d);
    },
    time: (date) => {
        const d = typeof date === "string" ? new Date(date) : date;
        return new Intl.DateTimeFormat("en-US", {
            timeStyle: "short",
        }).format(d);
    },
    compact: (value) => {
        return new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
        }).format(value);
    },
};
// Analytics utilities
export const analytics = {
    calculateWinRate: (wins, total) => {
        return total > 0 ? wins / total : 0;
    },
    calculateProfit: (bets) => {
        return bets.reduce((total, bet) => {
            return total + (bet.outcome === "won" ? bet.amount : -bet.amount);
        }, 0);
    },
    calculateROI: (profit, investment) => {
        return investment > 0 ? profit / investment : 0;
    },
    calculateConfidenceInterval: (value, confidence = 0.95, sampleSize = 100) => {
        const zScore = confidence === 0.95 ? 1.96 : 2.58;
        const margin = zScore * Math.sqrt((value * (1 - value)) / sampleSize);
        return {
            lower: Math.max(0, value - margin),
            upper: Math.min(1, value + margin),
        };
    },
    calculateSharpeRatio: (returns, riskFreeRate = 0.02) => {
        if (returns.length === 0)
            return 0;
        const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) /
            returns.length;
        const stdDev = Math.sqrt(variance);
        return stdDev === 0 ? 0 : (meanReturn - riskFreeRate) / stdDev;
    },
    calculateKellyCriterion: (winRate, avgWin, avgLoss) => {
        if (avgLoss === 0)
            return 0;
        const b = avgWin / avgLoss;
        return (winRate * (b + 1) - 1) / b;
    },
};
// Validation utilities
export const validators = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    phone: (phone) => {
        const regex = /^\+?[\d\s\-\(\)]+$/;
        return regex.test(phone) && phone.replace(/\D/g, "").length >= 10;
    },
    password: (password) => {
        return {
            minLength: password.length >= 8,
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    },
    betAmount: (amount, balance, maxBet = 1000) => {
        return {
            isPositive: amount > 0,
            hasBalance: amount <= balance,
            withinLimit: amount <= maxBet,
            isValid: amount > 0 && amount <= balance && amount <= maxBet,
        };
    },
};
// Color utilities
export const colors = {
    getConfidenceColor: (confidence) => {
        if (confidence >= 80)
            return "#06ffa5";
        if (confidence >= 60)
            return "#fbbf24";
        return "#ff4757";
    },
    getProfitColor: (value) => {
        if (value > 0)
            return "#06ffa5";
        if (value < 0)
            return "#ff4757";
        return "#94a3b8";
    },
    getStatusColor: (status) => {
        switch (status.toLowerCase()) {
            case "won":
            case "success":
            case "active":
                return "#06ffa5";
            case "lost":
            case "error":
            case "failed":
                return "#ff4757";
            case "pending":
            case "waiting":
                return "#fbbf24";
            default:
                return "#94a3b8";
        }
    },
};
// Storage utilities
export const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        }
        catch (error) {
            console.warn("Failed to save to localStorage:", error);
            return false;
        }
    },
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        }
        catch (error) {
            console.warn("Failed to read from localStorage:", error);
            return defaultValue;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        }
        catch (error) {
            console.warn("Failed to remove from localStorage:", error);
            return false;
        }
    },
    clear: () => {
        try {
            localStorage.clear();
            return true;
        }
        catch (error) {
            console.warn("Failed to clear localStorage:", error);
            return false;
        }
    },
};
// Debounce utility
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
// Throttle utility
export const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};
// Array utilities
export const arrayUtils = {
    chunk: (array, size) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
    unique: (array) => {
        return [...new Set(array)];
    },
    groupBy: (array, key) => {
        return array.reduce((groups, item) => {
            const group = String(item[key]);
            return {
                ...groups,
                [group]: [...(groups[group] || []), item],
            };
        }, {});
    },
    sortBy: (array, key, direction = "asc") => {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            if (aVal < bVal)
                return direction === "asc" ? -1 : 1;
            if (aVal > bVal)
                return direction === "asc" ? 1 : -1;
            return 0;
        });
    },
};
// URL utilities
export const url = {
    getParams: () => {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        params.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    },
    setParam: (key, value) => {
        const url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.replaceState({}, "", url.toString());
    },
    removeParam: (key) => {
        const url = new URL(window.location.href);
        url.searchParams.delete(key);
        window.history.replaceState({}, "", url.toString());
    },
};
// Device utilities
export const device = {
    isMobile: () => window.innerWidth <= 768,
    isTablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: () => window.innerWidth > 1024,
    getBreakpoint: () => {
        const width = window.innerWidth;
        if (width <= 640)
            return "sm";
        if (width <= 768)
            return "md";
        if (width <= 1024)
            return "lg";
        if (width <= 1280)
            return "xl";
        return "2xl";
    },
};
// Export everything as default object for convenience
export default {
    formatters,
    analytics,
    validators,
    colors,
    storage,
    debounce,
    throttle,
    arrayUtils,
    url,
    device,
};
