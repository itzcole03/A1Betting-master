/**
 * 🚀 A1BETTING QUANTUM PLATFORM - ULTIMATE HOOKS CONSOLIDATION
 *
 * Consolidates 180+ scattered hooks into 12 intelligent mega-hooks
 * Preserves cyber theme integration and advanced functionality
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
} from "rxjs/operators";
import { QuantumServices } from "../services/UltimateServices";

// 🎯 1. ULTIMATE DATA HOOK - Consolidates 25+ data hooks
export const useQuantumData = (options?: {
  autoRefresh?: boolean;
  refreshInterval?: number;
  sources?: string[];
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    connectedSources: 0,
    dataQuality: 0,
    latency: 0,
    isOnline: false,
  });

  const {
    autoRefresh = true,
    refreshInterval = 30000,
    sources = ["prizepicks", "espn"],
  } = options || {};

  // Real-time data subscription
  useEffect(() => {
    const subscription = QuantumServices.data.getLiveData().subscribe({
      next: (newData) => {
        setData(newData);
        setLoading(false);
        setError(null);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  // System metrics subscription
  useEffect(() => {
    const subscription = QuantumServices.data
      .getSystemMetrics()
      .subscribe(setMetrics);
    return () => subscription.unsubscribe();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      try {
        setLoading(true);
        if (sources.includes("prizepicks")) {
          const prizePicksData =
            await QuantumServices.data.fetchPrizePicksData();
          setData((prev) => [...prev, ...prizePicksData]);
        }
        if (sources.includes("espn")) {
          const espnData = await QuantumServices.data.fetchESPNData();
          setData((prev) => [...prev, ...espnData]);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, sources]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const allData = [];
      if (sources.includes("prizepicks")) {
        allData.push(...(await QuantumServices.data.fetchPrizePicksData()));
      }
      if (sources.includes("espn")) {
        allData.push(...(await QuantumServices.data.fetchESPNData()));
      }
      setData(allData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sources]);

  return {
    data,
    loading,
    error,
    metrics,
    refreshData,
    isOnline: metrics.isOnline,
    quality: metrics.dataQuality,
  };
};

// 🧠 2. QUANTUM ML HOOK - Consolidates 30+ ML hooks
export const useQuantumML = (options?: {
  autoPredict?: boolean;
  modelType?: string;
  confidence?: number;
}) => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [accuracy, setAccuracy] = useState(97.3);
  const [shap, setShap] = useState<any>(null);
  const [ensemble, setEnsemble] = useState<any>(null);

  const {
    autoPredict = true,
    modelType = "ensemble",
    confidence = 80,
  } = options || {};

  // Model accuracy subscription
  useEffect(() => {
    const subscription = QuantumServices.ml
      .getModelAccuracy()
      .subscribe(setAccuracy);
    return () => subscription.unsubscribe();
  }, []);

  const generatePredictions = useCallback(
    async (data: any[]) => {
      setLoading(true);
      try {
        const results = await QuantumServices.ml.generatePredictions(data);
        const filtered = results.filter((p) => p.confidence >= confidence);
        setPredictions(filtered);

        // Get ensemble analysis
        const ensembleResults =
          await QuantumServices.ml.getEnsemblePredictions();
        setEnsemble(ensembleResults);

        return filtered;
      } catch (error) {
        console.error("Prediction generation failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [confidence],
  );

  const getSHAPAnalysis = useCallback(async (predictionId: string) => {
    try {
      const analysis = await QuantumServices.ml.getSHAPAnalysis(predictionId);
      setShap(analysis);
      return analysis;
    } catch (error) {
      console.error("SHAP analysis failed:", error);
    }
  }, []);

  // Auto-predict based on data updates
  const { data } = useQuantumData();
  useEffect(() => {
    if (autoPredict && data.length > 0) {
      generatePredictions(data);
    }
  }, [data, autoPredict, generatePredictions]);

  return {
    predictions,
    loading,
    accuracy,
    shap,
    ensemble,
    generatePredictions,
    getSHAPAnalysis,
    modelType,
    highConfidencePredictions: predictions.filter((p) => p.confidence >= 90),
  };
};

// 💰 3. ULTIMATE BETTING HOOK - Consolidates 20+ betting hooks
export const useQuantumBetting = (options?: {
  autoArbitrage?: boolean;
  maxExposure?: number;
  riskLevel?: "low" | "moderate" | "high";
}) => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [betHistory, setBetHistory] = useState<any[]>([]);
  const [bankroll, setBankroll] = useState(127430.5);
  const [loading, setLoading] = useState(false);

  const {
    autoArbitrage = true,
    maxExposure = 5000,
    riskLevel = "moderate",
  } = options || {};

  // Opportunities subscription
  useEffect(() => {
    const subscription = QuantumServices.betting
      .getOpportunities()
      .subscribe(setOpportunities);
    return () => subscription.unsubscribe();
  }, []);

  // Bet history subscription
  useEffect(() => {
    const subscription = QuantumServices.betting
      .getBetHistory()
      .subscribe(setBetHistory);
    return () => subscription.unsubscribe();
  }, []);

  // Auto-arbitrage scanner
  useEffect(() => {
    if (!autoArbitrage) return;

    const interval = setInterval(async () => {
      try {
        const arbs = await QuantumServices.betting.findArbitrageOpportunities();
        if (arbs.length > 0) {
          QuantumServices.notifications.createArbitrageAlert(arbs[0]);
        }
      } catch (error) {
        console.error("Arbitrage scanning failed:", error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [autoArbitrage]);

  const calculateKellyStake = useCallback(
    (odds: number, winProbability: number) => {
      return QuantumServices.betting.calculateKellyStake(
        bankroll,
        odds,
        winProbability,
      );
    },
    [bankroll],
  );

  const placeBet = useCallback(async (bet: any) => {
    setLoading(true);
    try {
      const result = await QuantumServices.betting.placeBet(bet);
      setBankroll((prev) => prev - bet.stake);
      QuantumServices.notifications.createAlert(
        "success",
        `Bet placed: ${bet.description}`,
      );
      return result;
    } catch (error) {
      QuantumServices.notifications.createAlert(
        "error",
        "Bet placement failed",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const findArbitrage = useCallback(async () => {
    setLoading(true);
    try {
      return await QuantumServices.betting.findArbitrageOpportunities();
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    opportunities,
    betHistory,
    bankroll,
    loading,
    calculateKellyStake,
    placeBet,
    findArbitrage,
    profitableOpportunities: opportunities.filter((o) => o.profitMargin > 2),
    totalProfit: betHistory.reduce((sum, bet) => sum + (bet.profit || 0), 0),
    winRate:
      betHistory.length > 0
        ? (betHistory.filter((bet) => bet.status === "won").length /
            betHistory.length) *
          100
        : 0,
  };
};

// 📊 4. QUANTUM ANALYTICS HOOK - Consolidates 25+ analytics hooks
export const useQuantumAnalytics = (userId?: string) => {
  const [analytics, setAnalytics] = useState<any>({});
  const [performance, setPerformance] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Performance metrics subscription
  useEffect(() => {
    const subscription = QuantumServices.analytics
      .getPerformanceMetrics()
      .subscribe({
        next: (data) => {
          setPerformance(data);
          setLoading(false);
        },
      });
    return () => subscription.unsubscribe();
  }, []);

  // Generate analytics
  useEffect(() => {
    if (userId) {
      QuantumServices.analytics.generateAnalytics(userId).then(setAnalytics);
    }
  }, [userId]);

  const getRiskAnalysis = useCallback(async () => {
    return await QuantumServices.analytics.getRiskAnalysis();
  }, []);

  const exportAnalytics = useCallback(() => {
    return JSON.stringify({ analytics, performance }, null, 2);
  }, [analytics, performance]);

  return {
    analytics,
    performance,
    loading,
    getRiskAnalysis,
    exportAnalytics,
    roi: performance.roi || 0,
    winRate: performance.winRate || 0,
    totalProfit: performance.profitLoss || 0,
    accuracy: performance.accuracy || 0,
  };
};

// 🔐 5. QUANTUM AUTH HOOK - Consolidates 8+ auth hooks
export const useQuantumAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // User subscription
  useEffect(() => {
    const userSub = QuantumServices.auth.getCurrentUser().subscribe(setUser);
    const authSub = QuantumServices.auth
      .getAuthStatus()
      .subscribe(setIsAuthenticated);

    return () => {
      userSub.unsubscribe();
      authSub.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await QuantumServices.auth.login(email, password);
      QuantumServices.notifications.createAlert(
        "success",
        `Welcome back, ${userData.name}!`,
      );
      return userData;
    } catch (error) {
      QuantumServices.notifications.createAlert("error", "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    QuantumServices.auth.logout();
    QuantumServices.notifications.createAlert(
      "info",
      "Logged out successfully",
    );
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    tier: user?.tier || "Basic",
    balance: user?.balance || 0,
  };
};

// 🚨 6. QUANTUM NOTIFICATIONS HOOK - Consolidates 12+ notification hooks
export const useQuantumNotifications = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Alerts subscription
  useEffect(() => {
    const alertSub = QuantumServices.notifications
      .getAlerts()
      .subscribe((alert) => {
        setAlerts((prev) => [alert, ...prev.slice(0, 4)]); // Keep last 5 alerts

        // Auto-remove alert after 5 seconds
        setTimeout(() => {
          setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
        }, 5000);
      });

    const notifSub = QuantumServices.notifications
      .getNotifications()
      .subscribe(setNotifications);

    return () => {
      alertSub.unsubscribe();
      notifSub.unsubscribe();
    };
  }, []);

  const createAlert = useCallback(
    (type: string, message: string, data?: any) => {
      QuantumServices.notifications.createAlert(type as any, message, data);
    },
    [],
  );

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    alerts,
    notifications,
    createAlert,
    dismissAlert,
    unreadCount: notifications.length,
  };
};

// 🎛️ 7. QUANTUM SETTINGS HOOK - Consolidates 15+ settings hooks
export const useQuantumSettings = () => {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const subscription = QuantumServices.settings
      .getSettings()
      .subscribe(setSettings);
    return () => subscription.unsubscribe();
  }, []);

  const updateSetting = useCallback((key: string, value: any) => {
    QuantumServices.settings.updateSetting(key, value);
  }, []);

  const updateSettings = useCallback((newSettings: any) => {
    QuantumServices.settings.updateSettings(newSettings);
  }, []);

  const exportSettings = useCallback(() => {
    return QuantumServices.settings.exportSettings();
  }, []);

  const importSettings = useCallback((json: string) => {
    QuantumServices.settings.importSettings(json);
  }, []);

  return {
    settings,
    updateSetting,
    updateSettings,
    exportSettings,
    importSettings,
    theme: settings.theme || "cyber-dark",
    autoRefresh: settings.autoRefresh || true,
    soundEnabled: settings.soundEnabled || true,
  };
};

// 🌐 8. QUANTUM WEBSOCKET HOOK - Consolidates 10+ real-time hooks
export const useQuantumWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [liveData, setLiveData] = useState<any[]>([]);

  useEffect(() => {
    const connectionSub = QuantumServices.websocket
      .getConnectionStatus()
      .subscribe(setConnected);
    const dataSub = QuantumServices.websocket
      .getLiveUpdates()
      .subscribe((update) => {
        setLiveData((prev) => [update, ...prev.slice(0, 99)]); // Keep last 100 updates
      });

    return () => {
      connectionSub.unsubscribe();
      dataSub.unsubscribe();
    };
  }, []);

  const connect = useCallback(() => {
    QuantumServices.websocket.connect();
  }, []);

  const disconnect = useCallback(() => {
    QuantumServices.websocket.disconnect();
  }, []);

  return {
    connected,
    liveData,
    connect,
    disconnect,
    latestUpdate: liveData[0] || null,
  };
};

// 🎯 9. QUANTUM FORM HOOK - Consolidates 15+ form hooks
export const useQuantumForm = <T>(initialValues: T, validationRules?: any) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [touched, setTouched] = useState<Partial<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const setTouchedField = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: Partial<T> = {};

    if (validationRules) {
      Object.keys(validationRules).forEach((field) => {
        const rule = validationRules[field];
        const value = values[field as keyof T];

        if (rule.required && (!value || value === "")) {
          newErrors[field as keyof T] = "This field is required" as any;
        }

        if (rule.minLength && String(value).length < rule.minLength) {
          newErrors[field as keyof T] =
            `Minimum ${rule.minLength} characters required` as any;
        }

        if (rule.pattern && !rule.pattern.test(String(value))) {
          newErrors[field as keyof T] =
            rule.message || ("Invalid format" as any);
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const submit = useCallback(
    async (onSubmit: (values: T) => Promise<void>) => {
      setIsSubmitting(true);

      if (validate()) {
        try {
          await onSubmit(values);
          QuantumServices.notifications.createAlert(
            "success",
            "Form submitted successfully",
          );
        } catch (error) {
          QuantumServices.notifications.createAlert(
            "error",
            "Submission failed",
          );
        }
      }

      setIsSubmitting(false);
    },
    [values, validate],
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setTouchedField,
    validate,
    reset,
    submit,
    isValid: Object.keys(errors).length === 0,
  };
};

// 🎨 10. QUANTUM UI HOOK - Consolidates 20+ UI hooks
export const useQuantumUI = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  // Theme management
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
    QuantumServices.settings.updateSetting(
      "theme",
      !darkMode ? "cyber-dark" : "cyber-light",
    );
  }, [darkMode]);

  // Modal management
  const openModal = useCallback((modalId: string) => {
    setModalOpen(modalId);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(null);
  }, []);

  // Loading states
  const setLoadingState = useCallback((key: string, isLoading: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: isLoading }));
  }, []);

  // Clipboard functionality
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      QuantumServices.notifications.createAlert(
        "success",
        "Copied to clipboard",
      );
    } catch (error) {
      QuantumServices.notifications.createAlert("error", "Copy failed");
    }
  }, []);

  // Local storage
  const localStorage = useMemo(
    () => ({
      get: (key: string) => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch {
          return null;
        }
      },
      set: (key: string, value: any) => {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error("localStorage set failed:", error);
        }
      },
      remove: (key: string) => {
        window.localStorage.removeItem(key);
      },
    }),
    [],
  );

  return {
    darkMode,
    sidebarOpen,
    modalOpen,
    loading,
    toggleDarkMode,
    setSidebarOpen,
    openModal,
    closeModal,
    setLoadingState,
    copyToClipboard,
    localStorage,
    isLoading: (key: string) => loading[key] || false,
  };
};

// 🚀 ULTIMATE MASTER HOOK - Combines all functionality
export const useQuantumPlatform = (options?: {
  userId?: string;
  autoStart?: boolean;
  features?: string[];
}) => {
  const { userId, autoStart = true, features = ["all"] } = options || {};

  // Initialize all hooks
  const data = useQuantumData({ autoRefresh: autoStart });
  const ml = useQuantumML({ autoPredict: autoStart });
  const betting = useQuantumBetting({ autoArbitrage: autoStart });
  const analytics = useQuantumAnalytics(userId);
  const auth = useQuantumAuth();
  const notifications = useQuantumNotifications();
  const settings = useQuantumSettings();
  const websocket = useQuantumWebSocket();
  const ui = useQuantumUI();

  // Health check
  const [systemHealth, setSystemHealth] = useState<any>({});

  useEffect(() => {
    if (autoStart) {
      QuantumServices.healthCheck().then(setSystemHealth);
    }
  }, [autoStart]);

  // Auto-connect WebSocket
  useEffect(() => {
    if (autoStart) {
      websocket.connect();
    }
  }, [autoStart, websocket]);

  return {
    // Core data
    data,
    ml,
    betting,
    analytics,

    // User management
    auth,
    notifications,
    settings,

    // Real-time
    websocket,

    // UI utilities
    ui,

    // System status
    systemHealth,
    isOnline: data.isOnline && websocket.connected,
    overallAccuracy: ml.accuracy,
    totalProfit: betting.totalProfit,

    // Quick actions
    quickActions: {
      refreshAll: () => {
        data.refreshData();
        betting.findArbitrage();
      },
      emergencyStop: () => {
        websocket.disconnect();
        notifications.createAlert("warning", "Emergency stop activated");
      },
      exportData: () => {
        const exportData = {
          analytics: analytics.exportAnalytics(),
          settings: settings.exportSettings(),
          timestamp: new Date(),
        };
        return JSON.stringify(exportData, null, 2);
      },
    },
  };
};

// Default export - the master hook
export default useQuantumPlatform;
