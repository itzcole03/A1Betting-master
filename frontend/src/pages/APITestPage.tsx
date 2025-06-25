/**
 * Comprehensive API Test Page
 * Tests SportsRadar, DailyFantasy, and TheOdds API integrations
 */

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { ExpandMore, CheckCircle, Error, Warning } from "@mui/icons-material";
import { sportsRadarService } from "../services/SportsRadarService";
import { dailyFantasyService } from "../services/dailyFantasyService";
import { theOddsService } from "../services/TheOddsService";

interface TestResult {
  name: string;
  service: "SportsRadar" | "DailyFantasy" | "TheOdds";
  status: "pending" | "success" | "error";
  data?: any;
  error?: string;
  duration?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-tabpanel-${index}`}
      aria-labelledby={`api-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const APITestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Debug: Validate imports
  React.useEffect(() => {
    console.log("APITestPage: Validating service imports...");
    console.log("sportsRadarService:", sportsRadarService);
    console.log("dailyFantasyService:", dailyFantasyService);
    console.log("theOddsService:", theOddsService);
  }, []);

  const updateTestResult = (name: string, result: Partial<TestResult>) => {
    setTestResults((prev) =>
      prev.map((test) => (test.name === name ? { ...test, ...result } : test)),
    );
  };

  const addTestResult = (test: TestResult) => {
    setTestResults((prev) => [...prev, test]);
  };

  const runTest = async (
    name: string,
    service: TestResult["service"],
    testFn: () => Promise<any>,
  ) => {
    const startTime = Date.now();
    addTestResult({ name, service, status: "pending" });

    try {
      const data = await testFn();
      const duration = Date.now() - startTime;
      updateTestResult(name, {
        status: "success",
        data,
        duration,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestResult(name, {
        status: "error",
        error:
          error && typeof error === "object" && "message" in error
            ? (error as any).message
            : String(error),
        duration,
      });
    }
  };

  const runSportsRadarTests = async () => {
    // SportsRadar Health Check
    await runTest("SportsRadar Health Check", "SportsRadar", async () => {
      if (!sportsRadarService?.healthCheck) {
        throw new Error("SportsRadar service not available");
      }
      return await sportsRadarService.healthCheck();
    });

    // NBA Games
    await runTest("NBA Games Today", "SportsRadar", async () => {
      if (!sportsRadarService?.getNBAGames) {
        throw new Error("SportsRadar getNBAGames not available");
      }
      return await sportsRadarService.getNBAGames();
    });

    // Odds Comparison
    await runTest("Basketball Odds", "SportsRadar", async () => {
      if (!sportsRadarService?.getOddsComparison) {
        throw new Error("SportsRadar getOddsComparison not available");
      }
      return await sportsRadarService.getOddsComparison("basketball");
    });
  };

  const runDailyFantasyTests = async () => {
    // DailyFantasy Health Check
    await runTest("DailyFantasy Health Check", "DailyFantasy", async () => {
      if (!dailyFantasyService?.healthCheck) {
        throw new Error("DailyFantasy service not available");
      }
      return await dailyFantasyService.healthCheck();
    });

    // NBA Contests
    await runTest("NBA Contests", "DailyFantasy", async () => {
      if (!dailyFantasyService?.getContests) {
        throw new Error("DailyFantasy getContests not available");
      }
      return await dailyFantasyService.getContests("nba");
    });

    // Player Projections (example)
    await runTest("Player Projections", "DailyFantasy", async () => {
      if (!dailyFantasyService?.getPlayerProjections) {
        throw new Error("DailyFantasy getPlayerProjections not available");
      }
      return await dailyFantasyService.getPlayerProjections(
        "example-player-id",
      );
    });
  };

  const runTheOddsTests = async () => {
    // TheOdds Health Check
    await runTest("TheOdds Health Check", "TheOdds", async () => {
      if (!theOddsService?.healthCheck) {
        throw new Error("TheOdds service not available");
      }
      return await theOddsService.healthCheck();
    });

    // Available Sports
    await runTest("Available Sports", "TheOdds", async () => {
      if (!theOddsService?.getSports) {
        throw new Error("TheOdds getSports not available");
      }
      return await theOddsService.getSports();
    });

    // NBA Odds
    await runTest("NBA Odds", "TheOdds", async () => {
      if (!theOddsService?.getOdds) {
        throw new Error("TheOdds getOdds not available");
      }
      return await theOddsService.getOdds("basketball_nba");
    });

    // Best Odds Analysis
    await runTest("Best Odds Analysis", "TheOdds", async () => {
      if (!theOddsService?.getBestOdds) {
        throw new Error("TheOdds getBestOdds not available");
      }
      return await theOddsService.getBestOdds("basketball_nba");
    });
  };

  const runAllTests = async () => {
    try {
      setIsRunning(true);
      setTestResults([]);

      await runSportsRadarTests();
      await runDailyFantasyTests();
      await runTheOddsTests();
    } catch (error) {
      console.error("Error running tests:", error);
      addTestResult({
        name: "Test Runner Error",
        service: "SportsRadar",
        status: "error",
        error:
          error && typeof error === "object" && "message" in error
            ? (error as any).message
            : String(error),
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearTests = () => {
    setTestResults([]);
    try {
      sportsRadarService?.clearCache?.();
      dailyFantasyService?.clearCache?.();
      theOddsService?.clearCache?.();
    } catch (error) {
      console.warn("Error clearing caches:", error);
    }
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle color="success" />;
      case "error":
        return <Error color="error" />;
      case "pending":
        return <CircularProgress size={20} />;
      default:
        return <Warning color="warning" />;
    }
  };

  const getServiceColor = (service: TestResult["service"]) => {
    switch (service) {
      case "SportsRadar":
        return "primary";
      case "DailyFantasy":
        return "secondary";
      case "TheOdds":
        return "success";
      default:
        return "default";
    }
  };

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const serviceResults = {
    SportsRadar: testResults.filter((r) => r.service === "SportsRadar"),
    DailyFantasy: testResults.filter((r) => r.service === "DailyFantasy"),
    TheOdds: testResults.filter((r) => r.service === "TheOdds"),
  };

  const getServiceStats = (service: TestResult["service"]) => {
    const results = serviceResults[service];
    const total = results.length;
    const success = results.filter((r) => r.status === "success").length;
    const errors = results.filter((r) => r.status === "error").length;
    const pending = results.filter((r) => r.status === "pending").length;

    return { total, success, errors, pending };
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        🧪 API Integration Test Suite
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Comprehensive testing of SportsRadar, DailyFantasy, and TheOdds API
        integrations. Ensure your backend server is running on port 8000.
      </Alert>

      <Box mb={3}>
        <Button
          variant="contained"
          onClick={() => runAllTests()}
          disabled={isRunning}
          sx={{ mr: 2 }}
        >
          {isRunning ? <CircularProgress size={20} /> : "🚀 Run All Tests"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => clearTests()}
          disabled={isRunning}
        >
          🧹 Clear Results
        </Button>
      </Box>

      {testResults.length > 0 && (
        <>
          {/* Service Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {(["SportsRadar", "DailyFantasy", "TheOdds"] as const).map(
              (service) => {
                const stats = getServiceStats(service);
                return (
                  <Grid item xs={12} md={4} key={service}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {service}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Chip
                            label={`${stats.success}/${stats.total} Passed`}
                            color={
                              stats.success === stats.total
                                ? "success"
                                : "default"
                            }
                            size="small"
                          />
                          {stats.errors > 0 && (
                            <Chip
                              label={`${stats.errors} Failed`}
                              color="error"
                              size="small"
                            />
                          )}
                          {stats.pending > 0 && (
                            <Chip
                              label={`${stats.pending} Running`}
                              color="warning"
                              size="small"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              },
            )}
          </Grid>

          {/* Detailed Results */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={(event, newValue) => {
                if (typeof newValue === "number") {
                  setTabValue(newValue);
                }
              }}
            >
              <Tab label="All Results" />
              <Tab label="SportsRadar" />
              <Tab label="DailyFantasy" />
              <Tab label="TheOdds" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {testResults.map((test, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    {getStatusIcon(test.status)}
                    <Typography variant="h6">{test.name}</Typography>
                    <Chip
                      size="small"
                      label={test.service}
                      color={getServiceColor(test.service)}
                    />
                    {test.duration && (
                      <Typography variant="caption" color="textSecondary">
                        {test.duration}ms
                      </Typography>
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {test.status === "pending" && (
                    <Box display="flex" alignItems="center" gap={2}>
                      <CircularProgress size={20} />
                      <Typography>Running test...</Typography>
                    </Box>
                  )}

                  {test.status === "error" && (
                    <Alert severity="error">
                      <Typography variant="subtitle2">Error:</Typography>
                      <Typography variant="body2">{test.error}</Typography>
                    </Alert>
                  )}

                  {test.status === "success" && test.data && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Success! Data received:
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          fontSize: "12px",
                          overflow: "auto",
                          maxHeight: "300px",
                          background: "#f5f5f5",
                          padding: "16px",
                          borderRadius: "4px",
                          fontFamily: "monospace",
                        }}
                      >
                        {formatJson(test.data)}
                      </Box>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </TabPanel>

          {(["SportsRadar", "DailyFantasy", "TheOdds"] as const).map(
            (service, index) => (
              <TabPanel value={tabValue} index={index + 1} key={service}>
                {serviceResults[service].map((test, testIndex) => (
                  <Accordion key={testIndex}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        width="100%"
                      >
                        {getStatusIcon(test.status)}
                        <Typography variant="h6">{test.name}</Typography>
                        {test.duration && (
                          <Typography variant="caption" color="textSecondary">
                            {test.duration}ms
                          </Typography>
                        )}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {test.status === "pending" && (
                        <Box display="flex" alignItems="center" gap={2}>
                          <CircularProgress size={20} />
                          <Typography>Running test...</Typography>
                        </Box>
                      )}

                      {test.status === "error" && (
                        <Alert severity="error">
                          <Typography variant="subtitle2">Error:</Typography>
                          <Typography variant="body2">{test.error}</Typography>
                        </Alert>
                      )}

                      {test.status === "success" && test.data && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Success! Data received:
                          </Typography>
                          <Box
                            component="pre"
                            sx={{
                              fontSize: "12px",
                              overflow: "auto",
                              maxHeight: "300px",
                              background: "#f5f5f5",
                              padding: "16px",
                              borderRadius: "4px",
                              fontFamily: "monospace",
                            }}
                          >
                            {formatJson(test.data)}
                          </Box>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </TabPanel>
            ),
          )}
        </>
      )}
    </Box>
  );
};
