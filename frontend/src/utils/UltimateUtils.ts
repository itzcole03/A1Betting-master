/**
 * 🚀 A1BETTING QUANTUM PLATFORM - ULTIMATE UTILITIES CONSOLIDATION
 *
 * Consolidates 200+ scattered utilities into organized categories
 * Preserves all functionality while maintaining cyber theme integration
 */

// ===============================
// 🎯 CORE UTILITIES
// ===============================

export const CoreUtils = {
  // Unique ID generation
  generateId: (prefix = "id"): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number,
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Deep clone object
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array)
      return obj.map((item) => CoreUtils.deepClone(item)) as unknown as T;
    if (typeof obj === "object") {
      const cloned = {} as T;
      Object.keys(obj).forEach((key) => {
        (cloned as any)[key] = CoreUtils.deepClone((obj as any)[key]);
      });
      return cloned;
    }
    return obj;
  },

  // Safe JSON parse
  safeJsonParse: <T = any>(json: string, fallback: T): T => {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  },

  // Format currency
  formatCurrency: (amount: number, currency = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  // Format percentage
  formatPercentage: (value: number, decimals = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  // Clamp number between min and max
  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  },

  // Generate random number in range
  // WARNING: This should NOT be used for generating mock/fake data in production
  // Only for legitimate randomization needs (e.g., noise reduction, UI animations)
  randomInRange: (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  },
};

// ===============================
// 🎲 ODDS & BETTING UTILITIES
// ===============================

export const OddsUtils = {
  // Convert American odds to decimal
  americanToDecimal: (odds: number): number => {
    if (odds > 0) {
      return odds / 100 + 1;
    } else {
      return 100 / Math.abs(odds) + 1;
    }
  },

  // Convert decimal odds to American
  decimalToAmerican: (decimal: number): number => {
    if (decimal >= 2) {
      return Math.round((decimal - 1) * 100);
    } else {
      return Math.round(-100 / (decimal - 1));
    }
  },

  // Convert odds to implied probability
  oddsToImpliedProbability: (odds: number): number => {
    const decimal =
      typeof odds === "number" && odds > 0
        ? OddsUtils.americanToDecimal(odds)
        : odds;
    return (1 / decimal) * 100;
  },

  // Calculate potential payout
  calculatePayout: (stake: number, odds: number): number => {
    const decimal = OddsUtils.americanToDecimal(odds);
    return stake * decimal;
  },

  // Calculate profit
  calculateProfit: (stake: number, odds: number): number => {
    return OddsUtils.calculatePayout(stake, odds) - stake;
  },

  // Calculate parlay odds
  calculateParlayOdds: (odds: number[]): number => {
    const decimals = odds.map(OddsUtils.americanToDecimal);
    const combinedDecimal = decimals.reduce((acc, decimal) => acc * decimal, 1);
    return OddsUtils.decimalToAmerican(combinedDecimal);
  },

  // Kelly Criterion calculator
  kellyStake: (
    bankroll: number,
    odds: number,
    winProbability: number,
  ): number => {
    const decimal = OddsUtils.americanToDecimal(odds);
    const kellyFraction = (winProbability * decimal - 1) / (decimal - 1);
    return Math.max(0, kellyFraction * bankroll);
  },

  // Calculate arbitrage opportunity
  calculateArbitrage: (
    odds1: number,
    odds2: number,
  ): {
    isArbitrage: boolean;
    profit: number;
    stakes: { bet1: number; bet2: number };
  } => {
    const decimal1 = OddsUtils.americanToDecimal(odds1);
    const decimal2 = OddsUtils.americanToDecimal(odds2);

    const totalImplied = 1 / decimal1 + 1 / decimal2;
    const isArbitrage = totalImplied < 1;
    const profit = isArbitrage ? (1 - totalImplied) * 100 : 0;

    const totalStake = 100; // Example $100 total
    const stake1 = totalStake / decimal1 / totalImplied;
    const stake2 = totalStake / decimal2 / totalImplied;

    return {
      isArbitrage,
      profit,
      stakes: { bet1: stake1, bet2: stake2 },
    };
  },
};

// ===============================
// 📊 ANALYTICS UTILITIES
// ===============================

export const AnalyticsUtils = {
  // Calculate win rate
  calculateWinRate: (wins: number, total: number): number => {
    return total > 0 ? (wins / total) * 100 : 0;
  },

  // Calculate ROI
  calculateROI: (profit: number, investment: number): number => {
    return investment > 0 ? (profit / investment) * 100 : 0;
  },

  // Calculate Sharpe ratio
  calculateSharpeRatio: (returns: number[], riskFreeRate = 0.02): number => {
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance =
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) /
      returns.length;
    const standardDeviation = Math.sqrt(variance);

    return standardDeviation > 0
      ? (avgReturn - riskFreeRate) / standardDeviation
      : 0;
  },

  // Calculate maximum drawdown
  calculateMaxDrawdown: (values: number[]): number => {
    let maxDrawdown = 0;
    let peak = values[0];

    for (const value of values) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = (peak - value) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown * 100;
  },

  // Calculate streak (winning or losing)
  calculateStreak: (
    results: boolean[],
  ): { current: number; max: number; type: "win" | "loss" } => {
    if (results.length === 0) return { current: 0, max: 0, type: "win" };

    let currentStreak = 1;
    let maxStreak = 1;
    let currentType = results[results.length - 1] ? "win" : "loss";

    for (let i = results.length - 2; i >= 0; i--) {
      if (results[i] === results[i + 1]) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        break;
      }
    }

    return { current: currentStreak, max: maxStreak, type: currentType };
  },

  // Calculate confidence interval
  calculateConfidenceInterval: (
    data: number[],
    confidence = 0.95,
  ): { lower: number; upper: number; mean: number } => {
    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const alpha = 1 - confidence;
    const lowerIndex = Math.floor((alpha / 2) * data.length);
    const upperIndex = Math.ceil((1 - alpha / 2) * data.length) - 1;

    return {
      lower: sorted[lowerIndex],
      upper: sorted[upperIndex],
      mean,
    };
  },
};

// ===============================
// 🕒 DATE & TIME UTILITIES
// ===============================

export const DateUtils = {
  // Format date for display
  formatDate: (date: Date | string, format = "MMM dd, yyyy"): string => {
    const d = new Date(date);

    const formats: { [key: string]: string } = {
      "MMM dd, yyyy": d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      "dd/MM/yyyy": d.toLocaleDateString("en-GB"),
      "yyyy-MM-dd": d.toISOString().split("T")[0],
      full: d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    return formats[format] || d.toLocaleDateString();
  },

  // Format time
  formatTime: (date: Date | string, includeSeconds = false): string => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      ...(includeSeconds && { second: "2-digit" }),
    };
    return d.toLocaleTimeString("en-US", options);
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date: Date | string): string => {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return DateUtils.formatDate(target);
  },

  // Check if date is today
  isToday: (date: Date | string): boolean => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  // Get business days between dates
  getBusinessDays: (startDate: Date, endDate: Date): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let businessDays = 0;

    while (start <= end) {
      const dayOfWeek = start.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Not Sunday or Saturday
        businessDays++;
      }
      start.setDate(start.getDate() + 1);
    }

    return businessDays;
  },
};

// ===============================
// 🔒 VALIDATION UTILITIES
// ===============================

export const ValidationUtils = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Password strength validation
  getPasswordStrength: (
    password: string,
  ): {
    score: number;
    feedback: string[];
    isStrong: boolean;
  } => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Include lowercase letters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Include uppercase letters");

    if (/\d/.test(password)) score += 1;
    else feedback.push("Include numbers");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push("Include special characters");

    return {
      score,
      feedback,
      isStrong: score >= 4,
    };
  },

  // URL validation
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Credit card validation (Luhn algorithm)
  isValidCreditCard: (cardNumber: string): boolean => {
    const clean = cardNumber.replace(/\D/g, "");
    if (clean.length < 13 || clean.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = clean.length - 1; i >= 0; i--) {
      let digit = parseInt(clean[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },
};

// ===============================
// 🎨 UI & STYLING UTILITIES
// ===============================

export const UIUtils = {
  // Class name combiner
  cn: (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(" ");
  },

  // Generate cyber theme colors
  getCyberColor: (
    type: "primary" | "secondary" | "accent" | "danger" | "warning" | "success",
  ): string => {
    const colors = {
      primary: "#06ffa5",
      secondary: "#00ff88",
      accent: "#00d4ff",
      danger: "#ff4757",
      warning: "#ffc107",
      success: "#06ffa5",
    };
    return colors[type];
  },

  // Generate gradient backgrounds
  getCyberGradient: (type: "background" | "button" | "card"): string => {
    const gradients = {
      background:
        "linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(124, 58, 237) 50%, rgb(15, 23, 42) 100%)",
      button:
        "linear-gradient(135deg, rgba(6, 255, 165, 0.8), rgba(0, 255, 136, 0.6))",
      card: "linear-gradient(45deg, #00ff88, #00d4ff)",
    };
    return gradients[type];
  },

  // Generate glass morphism styles
  getGlassStyles: (
    intensity: "light" | "medium" | "heavy" = "medium",
  ): React.CSSProperties => {
    const styles = {
      light: {
        backdropFilter: "blur(10px) saturate(150%)",
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      },
      medium: {
        backdropFilter: "blur(20px) saturate(180%)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      },
      heavy: {
        backdropFilter: "blur(40px) saturate(200%)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      },
    };
    return styles[intensity];
  },

  // Animate element entrance
  animateEntrance: (
    element: HTMLElement,
    type: "fade" | "slide" | "scale" = "fade",
  ): void => {
    const animations = {
      fade: [{ opacity: 0 }, { opacity: 1 }],
      slide: [
        { transform: "translateY(20px)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      scale: [
        { transform: "scale(0.9)", opacity: 0 },
        { transform: "scale(1)", opacity: 1 },
      ],
    };

    element.animate(animations[type], {
      duration: 300,
      easing: "ease-out",
      fill: "forwards",
    });
  },

  // Generate responsive breakpoint styles
  getBreakpointStyles: (breakpoint: "sm" | "md" | "lg" | "xl"): string => {
    const breakpoints = {
      sm: "@media (min-width: 640px)",
      md: "@media (min-width: 768px)",
      lg: "@media (min-width: 1024px)",
      xl: "@media (min-width: 1280px)",
    };
    return breakpoints[breakpoint];
  },
};

// ===============================
// 🚀 PERFORMANCE UTILITIES
// ===============================

export const PerformanceUtils = {
  // Measure function execution time
  measureTime: async <T>(
    fn: () => Promise<T> | T,
    label?: string,
  ): Promise<{ result: T; time: number }> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const time = end - start;

    if (label) {
      console.log(`${label}: ${time.toFixed(2)}ms`);
    }

    return { result, time };
  },

  // Memory usage tracking
  getMemoryUsage: (): {
    used: number;
    total: number;
    percentage: number;
  } | null => {
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      };
    }
    return null;
  },

  // Lazy loading utility
  lazyLoad: <T>(factory: () => Promise<T>): (() => Promise<T>) => {
    let promise: Promise<T> | null = null;
    return () => {
      if (!promise) {
        promise = factory();
      }
      return promise;
    };
  },

  // Batch operations
  batch: <T, R>(
    items: T[],
    batchSize: number,
    processor: (batch: T[]) => Promise<R[]>,
  ): Promise<R[]> => {
    return new Promise(async (resolve) => {
      const results: R[] = [];

      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await processor(batch);
        results.push(...batchResults);
      }

      resolve(results);
    });
  },
};

// ===============================
// 🔧 ERROR HANDLING UTILITIES
// ===============================

export const ErrorUtils = {
  // Safe function execution
  safeExecute: <T>(
    fn: () => T,
    fallback: T,
    onError?: (error: Error) => void,
  ): T => {
    try {
      return fn();
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
      return fallback;
    }
  },

  // Async safe execution
  safeExecuteAsync: async <T>(
    fn: () => Promise<T>,
    fallback: T,
    onError?: (error: Error) => void,
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
      return fallback;
    }
  },

  // Error message extraction
  getErrorMessage: (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    if (error && typeof error === "object" && "message" in error) {
      return String(error.message);
    }
    return "An unknown error occurred";
  },

  // Retry mechanism
  retry: async <T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    delay = 1000,
  ): Promise<T> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
    throw new Error("Retry failed");
  },
};

// ===============================
// 📦 EXPORT ALL UTILITIES
// ===============================

export const UltimateUtils = {
  Core: CoreUtils,
  Odds: OddsUtils,
  Analytics: AnalyticsUtils,
  Date: DateUtils,
  Validation: ValidationUtils,
  UI: UIUtils,
  Performance: PerformanceUtils,
  Error: ErrorUtils,
};

export default UltimateUtils;
