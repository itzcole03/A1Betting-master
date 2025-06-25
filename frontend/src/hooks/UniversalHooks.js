import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../providers/SafeThemeProvider";
import { UniversalServiceFactory, createQueryKeys, defaultQueryConfig, } from "../services/UniversalServiceLayer";
// ============================================================================
// DATA HOOKS
// ============================================================================
/**
 * Universal hook for fetching predictions with caching and real-time updates
 */
export const usePredictions = (options = {}) => {
    const { limit = 10, realtime = false } = options;
    const predictionService = UniversalServiceFactory.getPredictionService();

    const query = useQuery({
        queryKey: createQueryKeys.predictions.recent(limit),
        queryFn: () => predictionService.getRecent(limit),
        ...defaultQueryConfig,
        refetchInterval: realtime ? 30000 : false, // 30 seconds if realtime
    });

    return {
        predictions: query.data?.data || [],
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
};
/**
 * Universal hook for fetching engine metrics
 */
export const useEngineMetrics = () => {
    const predictionService = UniversalServiceFactory.getPredictionService();

    const query = useQuery({
        queryKey: createQueryKeys.predictions.metrics(),
        queryFn: () => predictionService.getMetrics(),
        ...defaultQueryConfig,
        refetchInterval: 60000, // Refresh every minute
    });

    return {
        metrics: query.data?.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
};
/**
 * Universal hook for betting opportunities
 */
export const useBettingOpportunities = (options = {}) => {
    const { limit = 5, sport } = options;
    const bettingService = UniversalServiceFactory.getBettingService();

    const query = useQuery({
        queryKey: createQueryKeys.betting.opportunities(sport, limit),
        queryFn: () => bettingService.getOpportunities({ sport, limit }),
        ...defaultQueryConfig,
        refetchInterval: 30000, // Refresh every 30 seconds for betting opportunities
    });

    return {
        opportunities: query.data?.data || [],
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
};
/**
 * Universal hook for user profile management
 */
export const useUserProfile = () => {
    const userService = UniversalServiceFactory.getUserService();
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: createQueryKeys.user.profile(),
        queryFn: () => userService.getProfile(),
        ...defaultQueryConfig,
    });
    const updateMutation = useMutation({
        mutationFn: (data) => userService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: createQueryKeys.user.profile(),
            });
        },
    });
    return {
        profile: query.data?.data,
        isLoading: query.isLoading,
        error: query.error,
        updateProfile: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        refetch: query.refetch,
    };
};
/**
 * Universal hook for mock user profile (for testing)
 */
export const useMockUserProfile = () => {
    const userService = UniversalServiceFactory.getUserService();
    const query = useQuery({
        queryKey: ["user", "mock", "profile"],
        queryFn: () => userService.getMockProfile(),
        ...defaultQueryConfig,
    });

    return {
        profile: query.data?.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
};
// ============================================================================
// UI HOOKS
// ============================================================================
/**
 * Universal theme hook with all theme functionality
 */
export const useUniversalTheme = () => {
    const themeContext = useTheme();
    return {
        ...themeContext,
        // Additional utility functions
        getCSSVariable: (name) => {
            if (typeof window === "undefined")
                return "";
            return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
        },
        applyTheme: (variant) => {
            themeContext.setVariant(variant);
        },
    };
};
/**
 * Universal form hook with validation and submission
 */
export const useUniversalForm = (initialValues, options = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = useCallback((name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    }, [errors]);
    const handleBlur = useCallback((name) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        // Validate on blur if validation function is provided
        if (options.validate) {
            const validationErrors = options.validate(values);
            if (validationErrors[name]) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: validationErrors[name],
                }));
            }
        }
    }, [values, options.validate]);
    const handleSubmit = useCallback(async (e) => {
        e?.preventDefault();
        setIsSubmitting(true);
        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);
        // Validate all fields
        if (options.validate) {
            const validationErrors = options.validate(values);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length > 0) {
                setIsSubmitting(false);
                return;
            }
        }
        try {
            await options.onSubmit?.(values);
        }
        catch (error) {
            console.error("Form submission error:", error);
        }
        finally {
            setIsSubmitting(false);
        }
    }, [values, options]);
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);
    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        isValid: Object.keys(errors).length === 0,
    };
};
/**
 * Universal modal hook
 */
export const useModal = (defaultOpen = false) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
    return {
        isOpen,
        open,
        close,
        toggle,
    };
};
/**
 * Universal toast/notification hook
 */
export const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = "info", duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast = { id, message, type, duration };
        setToasts((prev) => [...prev, toast]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
        return id;
    }, []);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);
    return {
        toasts,
        addToast,
        removeToast,
        clearAll,
        success: (message, duration) => addToast(message, "success", duration),
        error: (message, duration) => addToast(message, "error", duration),
        warning: (message, duration) => addToast(message, "warning", duration),
        info: (message, duration) => addToast(message, "info", duration),
    };
};
// ============================================================================
// UTILITY HOOKS
// ============================================================================
/**
 * Universal debounce hook
 */
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};
/**
 * Universal local storage hook
 */
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined")
            return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });
    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        }
        catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== "undefined") {
                window.localStorage.removeItem(key);
            }
        }
        catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);
    return [storedValue, setValue, removeValue];
};
/**
 * Universal window size hook
 */
export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(() => {
        if (typeof window === "undefined")
            return { width: 0, height: 0 };
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    });
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
};
/**
 * Universal media query hook
 */
export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => {
        if (typeof window === "undefined")
            return false;
        return window.matchMedia(query).matches;
    });
    useEffect(() => {
        if (typeof window === "undefined")
            return;
        const mediaQuery = window.matchMedia(query);
        const handleChange = () => setMatches(mediaQuery.matches);
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, [query]);
    return matches;
};
/**
 * Universal click outside hook
 */
export const useClickOutside = (handler) => {
    const ref = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handler]);
    return ref;
};
/**
 * Universal WebSocket hook
 */
export const useWebSocket = (url, options = {}) => {
    const { onMessage, onOpen, onClose, onError, enabled = true } = options;
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [lastMessage, setLastMessage] = useState(null);
    const wsRef = useRef(null);
    const sendMessage = useCallback((data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        }
    }, []);
    useEffect(() => {
        if (!enabled)
            return;
        setConnectionStatus("connecting");
        const ws = new WebSocket(url);
        wsRef.current = ws;
        ws.onopen = () => {
            setConnectionStatus("connected");
            onOpen?.();
        };
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLastMessage(data);
                onMessage?.(data);
            }
            catch (error) {
                console.warn("Failed to parse WebSocket message:", error);
            }
        };
        ws.onclose = () => {
            setConnectionStatus("disconnected");
            onClose?.();
        };
        ws.onerror = (error) => {
            setConnectionStatus("disconnected");
            onError?.(error);
        };
        return () => {
            ws.close();
        };
    }, [url, enabled, onMessage, onOpen, onClose, onError]);
    return {
        connectionStatus,
        lastMessage,
        sendMessage,
    };
};
// ============================================================================
// PERFORMANCE HOOKS
// ============================================================================
/**
 * Universal animation hook
 */
export const useAnimation = (initialValue, targetValue, duration = 1000, easing = (t) => t) => {
    const [value, setValue] = useState(initialValue);
    const [isAnimating, setIsAnimating] = useState(false);
    useEffect(() => {
        if (initialValue === targetValue)
            return;
        setIsAnimating(true);
        const startTime = Date.now();
        const startValue = value;
        const difference = targetValue - startValue;
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easing(progress);
            setValue(startValue + difference * easedProgress);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
            else {
                setIsAnimating(false);
            }
        };
        requestAnimationFrame(animate);
    }, [targetValue, duration, easing]);
    return { value, isAnimating };
};
/**
 * Universal performance monitor hook
 */
export const usePerformanceMonitor = () => {
    const [metrics, setMetrics] = useState({
        renderTime: 0,
        memoryUsage: 0,
        fps: 0,
    });
    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        const measurePerformance = () => {
            const currentTime = performance.now();
            frameCount++;
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                const memoryUsage = performance.memory?.usedJSHeapSize || 0;
                setMetrics({
                    renderTime: currentTime - lastTime,
                    memoryUsage: Math.round(memoryUsage / 1024 / 1024), // MB
                    fps,
                });
                frameCount = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(measurePerformance);
        };
        requestAnimationFrame(measurePerformance);
    }, []);
    return metrics;
};
// ============================================================================
// EXPORTS
// ============================================================================
export default {
    // Data hooks
    usePredictions,
    useEngineMetrics,
    useBettingOpportunities,
    useUserProfile,
    useMockUserProfile,
    // UI hooks
    useUniversalTheme,
    useUniversalForm,
    useModal,
    useToast,
    // Utility hooks
    useDebounce,
    useLocalStorage,
    useWindowSize,
    useMediaQuery,
    useClickOutside,
    useWebSocket,
    // Performance hooks
    useAnimation,
    usePerformanceMonitor,
};
