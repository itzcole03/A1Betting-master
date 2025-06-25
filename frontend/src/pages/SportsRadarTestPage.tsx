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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ExpandMore } from "@mui/icons-material";
import { sportsRadarService } from "@/services/SportsRadarService";
import type {
  OddsData,
  GameData,
  PlayerStatsData,
} from "@/services/SportsRadarService";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error";
  data?: any;
  error?: string;
  duration?: number;
}

export const SportsRadarTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTestResult = (name: string, result: Partial<TestResult>) => {
    setTestResults((prev) =>
      prev.map((test) => (test.name === name ? { ...test, ...result } : test)),
    );
  };

  const addTestResult = (test: TestResult) => {
    setTestResults((prev) => [...prev, test]);
  };

  const runTest = async (name: string, testFn: () => Promise<any>) => {
    const startTime = Date.now();
    addTestResult({ name, status: "pending" });

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
        error: error instanceof Error ? error.message : String(error),
        duration,
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Health Check
    await runTest("Health Check", async () => {
      return await sportsRadarService.healthCheck();
    });

    // Test 2: NBA Games
    await runTest("NBA Games Today", async () => {
      return await sportsRadarService.getNBAGames();
    });

    // Test 3: NBA Games Tomorrow
    await runTest("NBA Games Tomorrow", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split("T")[0];
      return await sportsRadarService.getNBAGames(dateStr);
    });

    // Test 4: Odds Comparison - Basketball
    await runTest("Basketball Odds Comparison", async () => {
      return await sportsRadarService.getOddsComparison("basketball");
    });

    // Test 5: Odds Comparison - Football
    await runTest("Football Odds Comparison", async () => {
      return await sportsRadarService.getOddsComparison("football");
    });

    // Test 6: Player Stats (Example player)
    await runTest("Player Stats (LeBron James)", async () => {
      // This is an example - you'd need actual player IDs
      return await sportsRadarService.getPlayerStats(
        "nba",
        "player-lebron-james-id",
      );
    });

    // Test 7: Cache Statistics
    await runTest("Cache Statistics", async () => {
      return sportsRadarService.getCacheStats();
    });

    setIsRunning(false);
  };

  const clearTests = () => {
    setTestResults([]);
    sportsRadarService.clearCache();
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "pending":
        return "warning";
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        SportsRadar API Integration Test
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This page tests all SportsRadar API endpoints to ensure proper
        integration. Make sure your API key is configured in the environment
        variables.
      </Alert>

      <Box mb={3}>
        <Button
          variant="contained"
          onClick={runAllTests}
          disabled={isRunning}
          sx={{ mr: 2 }}
        >
          {isRunning ? <CircularProgress size={20} /> : "Run All Tests"}
        </Button>
        <Button variant="outlined" onClick={clearTests} disabled={isRunning}>
          Clear Results
        </Button>
      </Box>

      {testResults.length > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test Summary
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {testResults.map((test, index) => (
                    <Chip
                      key={index}
                      label={`${test.name} ${test.duration ? `(${test.duration}ms)` : ""}`}
                      color={getStatusColor(test.status)}
                      variant={
                        test.status === "pending" ? "outlined" : "filled"
                      }
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {testResults.map((test, index) => (
            <Grid item xs={12} key={index}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <Typography variant="h6">{test.name}</Typography>
                    <Chip
                      size="small"
                      label={test.status}
                      color={getStatusColor(test.status)}
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
                      {test.name === "Health Check" && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            API Status: {test.data.status}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Available APIs:
                          </Typography>
                          <List dense>
                            {test.data.availableAPIs?.map(
                              (api: string, i: number) => (
                                <ListItem key={i}>
                                  <ListItemText primary={api} />
                                </ListItem>
                              ),
                            )}
                          </List>
                        </Box>
                      )}

                      {(test.name.includes("NBA Games") ||
                        test.name.includes("Odds")) && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Found{" "}
                            {Array.isArray(test.data)
                              ? test.data.length
                              : "N/A"}{" "}
                            items
                          </Typography>
                          {Array.isArray(test.data) &&
                            test.data
                              .slice(0, 3)
                              .map((item: any, i: number) => (
                                <Card key={i} variant="outlined" sx={{ mb: 1 }}>
                                  <CardContent>
                                    <Typography variant="caption">
                                      Item {i + 1}:
                                    </Typography>
                                    <Box
                                      component="pre"
                                      sx={{
                                        fontSize: "12px",
                                        overflow: "auto",
                                        fontFamily: "monospace",
                                      }}
                                    >
                                      {formatJson(item)}
                                    </Box>
                                  </CardContent>
                                </Card>
                              ))}
                        </Box>
                      )}

                      <Accordion sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="caption">
                            Raw Response Data
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box
                            component="pre"
                            sx={{
                              fontSize: "12px",
                              overflow: "auto",
                              maxHeight: "400px",
                              background: "#f5f5f5",
                              padding: "16px",
                              borderRadius: "4px",
                              fontFamily: "monospace",
                            }}
                          >
                            {formatJson(test.data)}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
