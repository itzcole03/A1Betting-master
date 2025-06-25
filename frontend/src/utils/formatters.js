// betaTest4/src/utils/formatters.ts
export const formatDate = (date, format = "yyyy-MM-dd HH:mm") => {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime()))
        return "Invalid Date";
    // Basic ISO-like format, can be expanded with a library like date-fns for complex needs
    if (format === "yyyy-MM-dd HH:mm") {
        const pad = (num) => num.toString().padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    // Fallback to locale string for other/unspecified formats for now
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
export const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
};
export const formatPercentage = (value, decimals = 2) => {
    return `${(value * 100).toFixed(decimals)}%`;
};
export const formatOdds = (odds) => {
    if (odds >= 2) {
        return `+${Math.round((odds - 1) * 100)}`;
    }
    else {
        return `-${Math.round(100 / (odds - 1))}`;
    }
};
export const formatDateTime = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime()))
        return "Invalid Date";
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
