import React, { createContext, useContext, useReducer, useEffect } from "react";

// State interface
interface AppState {
  darkMode: boolean;
  connectedSources: number;
  dataQuality: number;
  totalSources: number;
  isLoading: boolean;
  lastUpdate: Date | null;
  connectionStatus: "connected" | "connecting" | "disconnected";
  notifications: Notification[];
}

interface Notification {
  id: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  timestamp: Date;
}

// Action types
type AppAction =
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "SET_CONNECTED_SOURCES"; payload: number }
  | { type: "SET_DATA_QUALITY"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "UPDATE_CONNECTION_STATUS";
      payload: "connected" | "connecting" | "disconnected";
    }
  | {
      type: "ADD_NOTIFICATION";
      payload: Omit<Notification, "id" | "timestamp">;
    }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "REFRESH_DATA" };

// Initial state
const initialState: AppState = {
  darkMode: false,
  connectedSources: 12,
  dataQuality: 0.87,
  totalSources: 15,
  isLoading: false,
  lastUpdate: new Date(),
  connectionStatus: "connected",
  notifications: [],
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode };
    case "SET_CONNECTED_SOURCES":
      return { ...state, connectedSources: action.payload };
    case "SET_DATA_QUALITY":
      return { ...state, dataQuality: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "UPDATE_CONNECTION_STATUS":
      return { ...state, connectionStatus: action.payload };
    case "ADD_NOTIFICATION":
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload,
        ),
      };
    case "REFRESH_DATA":
      return {
        ...state,
        lastUpdate: new Date(),
        isLoading: true,
      };
    default:
      return state;
  }
}

// Context
interface AppContextValue {
  state: AppState;
  toggleDarkMode: () => void;
  setConnectedSources: (count: number) => void;
  setDataQuality: (quality: number) => void;
  setLoading: (loading: boolean) => void;
  updateConnectionStatus: (
    status: "connected" | "connecting" | "disconnected",
  ) => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => void;
  removeNotification: (id: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply dark mode to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.darkMode]);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    state.notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        dispatch({ type: "REMOVE_NOTIFICATION", payload: notification.id });
      }, 5000);
      return () => clearTimeout(timer);
    });
  }, [state.notifications]);

  const toggleDarkMode = () => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  };

  const setConnectedSources = (count: number) => {
    dispatch({ type: "SET_CONNECTED_SOURCES", payload: count });
  };

  const setDataQuality = (quality: number) => {
    dispatch({ type: "SET_DATA_QUALITY", payload: quality });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const updateConnectionStatus = (
    status: "connected" | "connecting" | "disconnected",
  ) => {
    dispatch({ type: "UPDATE_CONNECTION_STATUS", payload: status });
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  const refreshData = async (): Promise<void> => {
    dispatch({ type: "REFRESH_DATA" });

    try {
      // Simulate data refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update data quality and connection status
      dispatch({
        type: "SET_DATA_QUALITY",
        payload: Math.random() * 0.3 + 0.7,
      });
      dispatch({ type: "UPDATE_CONNECTION_STATUS", payload: "connected" });

      addNotification({
        message: "Data refreshed successfully",
        type: "success",
      });
    } catch (error) {
      dispatch({ type: "UPDATE_CONNECTION_STATUS", payload: "disconnected" });
      addNotification({
        message: "Failed to refresh data",
        type: "error",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value: AppContextValue = {
    state,
    toggleDarkMode,
    setConnectedSources,
    setDataQuality,
    setLoading,
    updateConnectionStatus,
    addNotification,
    removeNotification,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
