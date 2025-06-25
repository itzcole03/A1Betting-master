import { useState, useEffect, useCallback } from "react";

export function useEnhancedRealDataSources() {
  const [dataSources, setDataSources] = useState(new Map());
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [dataQuality, setDataQuality] = useState(0);
  const [dataReliability, setDataReliability] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  const connectToSources = useCallback(async () => {
    setLoading(true);
    setConnectionStatus("Connecting to enhanced data sources...");

    try {
      console.log("🚀 Initializing Enhanced Data Sources...");

      // Check for API keys
      const hasApiKeys = import.meta.env.VITE_ODDS_API_KEY ||
        import.meta.env.VITE_SPORTRADAR_API_KEY ||
        import.meta.env.VITE_ESPN_API_KEY;

      if (!hasApiKeys) {
        throw new Error("No API keys configured for data sources");
      }

      const sources = await enhancedDataSourceManager.initializeAllSources();
      setDataSources(sources);

      const connectedSources = enhancedDataSourceManager.getConnectedSources();
      const quality = enhancedDataSourceManager.getOverallDataQuality();
      const reliability = enhancedDataSourceManager.getSourceReliability();

      setDataQuality(quality);
      setDataReliability(reliability);
      setConnectionStatus(`Connected to ${connectedSources.length} enhanced data sources`);
      setLastUpdate(new Date());

      // Process the enhanced data
      const processedGames = dataProcessor.processGames(convertToRealDataSources(sources));
      const processedPlayers = dataProcessor.processPlayers(convertToRealDataSources(sources));

      setGames(processedGames);
      setPlayers(processedPlayers);

      console.log("Enhanced data connection results:", {
        connectedSources: connectedSources.length,
        totalSources: sources.size,
        games: processedGames.length,
        players: processedPlayers.length,
        quality: quality,
        reliability: reliability,
      });
    } catch (error) {
      console.error("Error connecting to enhanced data sources:", error);
      setConnectionStatus("Connection failed - no data available");
      
      // Production error handling - no fallback data
      setGames([]);
      setPlayers([]);
      setDataQuality(0);
      setDataReliability(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    console.log("🔄 Refreshing enhanced data sources...");

    try {
      await enhancedDataSourceManager.refreshAllSources();
      setDataSources(enhancedDataSourceManager.getAllSources());

      const quality = enhancedDataSourceManager.getOverallDataQuality();
      const reliability = enhancedDataSourceManager.getSourceReliability();
      setDataQuality(quality);
      setDataReliability(reliability);
      setLastUpdate(new Date());

      // Reprocess data
      const sources = enhancedDataSourceManager.getAllSources();
      const processedGames = dataProcessor.processGames(convertToRealDataSources(sources));
      const processedPlayers = dataProcessor.processPlayers(convertToRealDataSources(sources));

      setGames(processedGames);
      setPlayers(processedPlayers);
      console.log("✅ Enhanced data refresh completed");
    } catch (error) {
      console.error("❌ Failed to refresh enhanced data:", error);
      // Clear data on refresh failure
      setGames([]);
      setPlayers([]);
      setDataQuality(0);
      setDataReliability(0);
    }
  }, []);

  const getSourcesByCategory = useCallback((category) => {
    return enhancedDataSourceManager.getSourcesByCategory(category);
  }, []);

  const getDataSourceMetrics = useCallback(() => {
    return enhancedDataSourceManager.getDataSourceMetrics();
  }, []);

  // Convert EnhancedDataSource to RealDataSource for compatibility
  const convertToRealDataSources = (sources) => {
    const converted = new Map();
    sources.forEach((source, key) => {
      converted.set(key, {
        connected: source.connected,
        quality: source.quality,
        lastUpdate: source.lastUpdate,
        data: source.data,
        error: source.error,
        source: source.name,
      });
    });
    return converted;
  };

  useEffect(() => {
    connectToSources();

    // Set up periodic refresh
    const interval = setInterval(() => {
      refreshData();
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [connectToSources, refreshData]);

  return {
    dataSources,
    games,
    players,
    loading,
    connectionStatus,
    dataQuality,
    dataReliability,
    lastUpdate,
    refreshData,
    getSourcesByCategory,
    getDataSourceMetrics,
    connectedSourcesCount: enhancedDataSourceManager.getConnectedSources().length,
    totalSourcesCount: dataSources.size,
  };
}

// Mock implementations for missing services
const enhancedDataSourceManager = {
  initializeAllSources: async () => {
    const mockSources = new Map();
    mockSources.set("espn", {
      id: "espn",
      name: "ESPN API",
      connected: true,
      quality: 0.95,
      lastUpdate: new Date(),
      data: { games: [], players: [] },
      error: null,
    });
    return mockSources;
  },
  getConnectedSources: () => [{ id: "espn", name: "ESPN API" }],
  getOverallDataQuality: () => 0.95,
  getSourceReliability: () => 0.9,
  getAllSources: () => new Map(),
  refreshAllSources: async () => {},
  getSourcesByCategory: (category) => [
    { id: "test", connected: true, data: { projections: [] } },
  ],
  getDataSourceMetrics: () => ({ quality: 0.95, reliability: 0.9 }),
};

const dataProcessor = {
  processGames: (sources) => [],
  processPlayers: (sources) => [],
};
