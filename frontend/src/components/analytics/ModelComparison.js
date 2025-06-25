import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useModelPerformance } from "../../hooks/useModelPerformance";

const ModelComparison = ({ modelNames }) => {
  const [selectedMetric, setSelectedMetric] = useState("roi");
  const [timeframe, setTimeframe] = useState("week");
  const [viewMode, setViewMode] = useState("table");
  const modelPerformances = modelNames.map((modelName) => {
    const { performance, isLoading, error } = useModelPerformance(
      modelName,
      timeframe,
    );
    return { modelName, performance, isLoading, error };
  });
  const formatMetric = (value, type = "number") => {
    if (type === "percentage") {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (type === "currency") {
      return `$${value.toFixed(2)}`;
    }
    return value.toFixed(2);
  };
  const getMetricType = (metric) => {
    switch (metric) {
      case "roi":
      case "winRate":
      case "maxDrawdown":
      case "kellyCriterion":
        return "percentage";
      case "expectedValue":
        return "currency";
      default:
        return "number";
    }
  };
  const getMetricColor = (value, metric) => {
    if (metric === "maxDrawdown") {
      return value > 0.2
        ? "error.main"
        : value > 0.1
          ? "warning.main"
          : "success.main";
    }
    if (metric === "calibrationScore") {
      return value > 0.8
        ? "success.main"
        : value > 0.6
          ? "warning.main"
          : "error.main";
    }
    if (metric === "kellyCriterion") {
      return value > 0.1
        ? "success.main"
        : value > 0.05
          ? "warning.main"
          : "error.main";
    }
    if (value > 0) return "success.main";
    if (value < 0) return "error.main";
    return "text.primary";
  };
  const metrics = [
    { value: "roi", label: "ROI" },
    { value: "winRate", label: "Win Rate" },
    { value: "profitFactor", label: "Profit Factor" },
    { value: "sharpeRatio", label: "Sharpe Ratio" },
    { value: "maxDrawdown", label: "Max Drawdown" },
    { value: "kellyCriterion", label: "Kelly Criterion" },
    { value: "expectedValue", label: "Expected Value" },
    { value: "calibrationScore", label: "Calibration Score" },
  ];
  const radarData = modelPerformances
    .map(({ modelName, performance }) => {
      if (!performance) return null;
      return {
        model: modelName,
        ROI: performance.roi * 100,
        "Win Rate": performance.winRate * 100,
        "Profit Factor": performance.profitFactor,
        "Sharpe Ratio": performance.sharpeRatio,
        Calibration: performance.calibrationScore * 100,
      };
    })
    .filter((data) => data !== null);
  const barData = modelPerformances
    .map(({ modelName, performance }) => {
      if (!performance) return null;
      return {
        model: modelName,
        value: performance[selectedMetric],
        formattedValue: formatMetric(
          performance[selectedMetric],
          getMetricType(selectedMetric),
        ),
      };
    })
    .filter(Boolean);
  return _jsx(Card, {
    children: _jsxs(CardContent, {
      children: [
        _jsxs(Box, {
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          children: [
            _jsx(Typography, { variant: "h6", children: "Model Comparison" }),
            _jsxs(Box, {
              display: "flex",
              gap: 2,
              children: [
                _jsxs(ToggleButtonGroup, {
                  exclusive: true,
                  size: "small",
                  value: viewMode,
                  onChange: (_, newMode) => newMode && setViewMode(newMode),
                  children: [
                    _jsx(ToggleButton, { value: "table", children: "Table" }),
                    _jsx(ToggleButton, { value: "radar", children: "Radar" }),
                    _jsx(ToggleButton, { value: "bar", children: "Bar" }),
                  ],
                }),
                _jsxs(FormControl, {
                  sx: { minWidth: 120 },
                  children: [
                    _jsx(InputLabel, { children: "Metric" }),
                    _jsx(Select, {
                      label: "Metric",
                      value: selectedMetric,
                      onChange: (e) => setSelectedMetric(e.target.value),
                      children: metrics.map((metric) =>
                        _jsx(
                          MenuItem,
                          { value: metric.value, children: metric.label },
                          metric.value,
                        ),
                      ),
                    }),
                  ],
                }),
                _jsxs(FormControl, {
                  sx: { minWidth: 120 },
                  children: [
                    _jsx(InputLabel, { children: "Timeframe" }),
                    _jsxs(Select, {
                      label: "Timeframe",
                      value: timeframe,
                      onChange: (e) => setTimeframe(e.target.value),
                      children: [
                        _jsx(MenuItem, {
                          value: "day",
                          children: "Last 24 Hours",
                        }),
                        _jsx(MenuItem, {
                          value: "week",
                          children: "Last Week",
                        }),
                        _jsx(MenuItem, {
                          value: "month",
                          children: "Last Month",
                        }),
                        _jsx(MenuItem, { value: "all", children: "All Time" }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        viewMode === "table"
          ? _jsx(TableContainer, {
              component: Paper,
              children: _jsxs(Table, {
                children: [
                  _jsx(TableHead, {
                    children: _jsxs(TableRow, {
                      children: [
                        _jsx(TableCell, { children: "Model" }),
                        metrics.map((metric) =>
                          _jsx(
                            TableCell,
                            {
                              sx: {
                                backgroundColor:
                                  selectedMetric === metric.value
                                    ? "action.selected"
                                    : "inherit",
                              },
                              children: metric.label,
                            },
                            metric.value,
                          ),
                        ),
                      ],
                    }),
                  }),
                  _jsx(TableBody, {
                    children: modelPerformances.map(
                      ({ modelName, performance, isLoading, error }) =>
                        _jsxs(
                          TableRow,
                          {
                            children: [
                              _jsx(TableCell, { children: modelName }),
                              metrics.map((metric) =>
                                _jsx(
                                  TableCell,
                                  {
                                    sx: {
                                      color: performance
                                        ? getMetricColor(
                                            performance[metric.value],
                                            metric.value,
                                          )
                                        : "inherit",
                                    },
                                    children: isLoading
                                      ? "Loading..."
                                      : error
                                        ? "Error"
                                        : performance
                                          ? formatMetric(
                                              performance[metric.value],
                                              getMetricType(metric.value),
                                            )
                                          : "N/A",
                                  },
                                  metric.value,
                                ),
                              ),
                            ],
                          },
                          modelName,
                        ),
                    ),
                  }),
                ],
              }),
            })
          : viewMode === "radar"
            ? _jsx(Box, {
                height: 500,
                children: _jsx(ResponsiveContainer, {
                  height: "100%",
                  width: "100%",
                  children: _jsxs(RadarChart, {
                    data: radarData,
                    children: [
                      _jsx(PolarGrid, {}),
                      _jsx(PolarAngleAxis, { dataKey: "model" }),
                      _jsx(PolarRadiusAxis, { angle: 30, domain: [0, 100] }),
                      radarData.map((data, index) =>
                        _jsx(
                          Radar,
                          {
                            dataKey: Object.keys(data).filter(
                              (key) => key !== "model",
                            )[0],
                            fill: `hsla(${(index * 360) / radarData.length}, 70%, 50%, 0.2)`,
                            name: data.model,
                            stroke: `hsl(${(index * 360) / radarData.length}, 70%, 50%)`,
                          },
                          data.model,
                        ),
                      ),
                      _jsx(Legend, {}),
                    ],
                  }),
                }),
              })
            : _jsx(Box, {
                height: 500,
                children: _jsx(ResponsiveContainer, {
                  height: "100%",
                  width: "100%",
                  children: _jsxs(BarChart, {
                    data: barData,
                    children: [
                      _jsx(CartesianGrid, { strokeDasharray: "3 3" }),
                      _jsx(XAxis, { dataKey: "model" }),
                      _jsx(YAxis, {}),
                      _jsx(Tooltip, {
                        formatter: (value) =>
                          formatMetric(value, getMetricType(selectedMetric)),
                        labelFormatter: (label) =>
                          `${label} - ${metrics.find((m) => m.value === selectedMetric)?.label}`,
                      }),
                      _jsx(Bar, {
                        dataKey: "value",
                        fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
                        name: metrics.find((m) => m.value === selectedMetric)
                          ?.label,
                      }),
                    ],
                  }),
                }),
              }),
      ],
    }),
  });
};

// Export both named and default exports to support different import styles
export { ModelComparison };
export default ModelComparison;
