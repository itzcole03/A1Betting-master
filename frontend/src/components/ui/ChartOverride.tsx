import React from "react";
import {
  Line as OriginalLine,
  Bar as OriginalBar,
  Doughnut as OriginalDoughnut,
  Radar as OriginalRadar,
  Scatter as OriginalScatter,
} from "react-chartjs-2";
import { Activity, BarChart3, PieChart, Zap } from "lucide-react";

// Create fallback components that mirror Chart.js API but use SafeChart internally
const createSafeChartComponent = (
  chartType: "line" | "bar" | "doughnut" | "radar" | "scatter",
) => {
  return React.forwardRef<any, any>((props, ref) => {
    try {
      // Extract data and options from props
      const { data, options, ...restProps } = props;

      // Enhanced validation
      const isValidData = React.useMemo(() => {
        if (!data || typeof data !== "object") return false;
        if (!data.labels || !Array.isArray(data.labels)) return false;
        if (!data.datasets || !Array.isArray(data.datasets)) return false;
        if (data.labels.length === 0) return false;
        if (data.datasets.length === 0) return false;

        // Check if datasets have data property
        return data.datasets.every(
          (dataset: any) =>
            dataset &&
            typeof dataset === "object" &&
            (Array.isArray(dataset.data) || typeof dataset.data === "object"),
        );
      }, [data]);

      // If no data or data is invalid, show loading state
      if (!isValidData) {
        const icons = {
          line: (
            <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse text-cyan-400" />
          ),
          bar: (
            <BarChart3 className="w-8 h-8 mx-auto mb-2 animate-pulse text-cyan-400" />
          ),
          doughnut: (
            <PieChart className="w-8 h-8 mx-auto mb-2 animate-pulse text-cyan-400" />
          ),
          radar: (
            <Zap className="w-8 h-8 mx-auto mb-2 animate-pulse text-cyan-400" />
          ),
          scatter: (
            <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse text-cyan-400" />
          ),
        };

        return (
          <div className="flex items-center justify-center h-full text-gray-400 p-8 min-h-[200px]">
            <div className="text-center">
              {icons[chartType]}
              <p className="text-sm text-gray-400">
                Loading {chartType} chart data...
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Waiting for data to load
              </p>
            </div>
          </div>
        );
      }

      // Default safe options
      const safeOptions = React.useMemo(
        () => ({
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top" as const,
              labels: { color: "#e5e7eb" },
            },
          },
          scales:
            chartType !== "doughnut"
              ? {
                  x: {
                    ticks: { color: "#9ca3af" },
                    grid: { color: "rgba(156, 163, 175, 0.2)" },
                  },
                  y: {
                    ticks: { color: "#9ca3af" },
                    grid: { color: "rgba(156, 163, 175, 0.2)" },
                  },
                }
              : undefined,
          ...options,
        }),
        [options, chartType],
      );

      // Render the appropriate original Chart.js component
      const ChartComponent = (() => {
        switch (chartType) {
          case "line":
            return OriginalLine;
          case "bar":
            return OriginalBar;
          case "doughnut":
            return OriginalDoughnut;
          case "radar":
            return OriginalRadar;
          case "scatter":
            return OriginalScatter;
          default:
            return null;
        }
      })();

      if (!ChartComponent) {
        return (
          <div className="flex items-center justify-center h-full text-red-400 p-8 min-h-[200px]">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <p className="text-sm text-red-400">Unsupported Chart Type</p>
              <p className="text-xs text-gray-500 mt-1">
                {chartType} charts not available
              </p>
            </div>
          </div>
        );
      }

      return (
        <ChartComponent
          data={data}
          options={safeOptions}
          {...restProps}
          ref={ref}
        />
      );
    } catch (error) {
      console.warn(`SafeChart ${chartType} error:`, error);
      return (
        <div className="flex items-center justify-center h-full text-red-400 p-8 min-h-[200px]">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <p className="text-sm text-red-400">Chart Error</p>
            <p className="text-xs text-gray-500 mt-1">
              Unable to render {chartType} chart
            </p>
          </div>
        </div>
      );
    }
  });
};

// Create safe versions of all Chart.js components
export const Line = createSafeChartComponent("line");
export const Bar = createSafeChartComponent("bar");
export const Doughnut = createSafeChartComponent("doughnut");
export const Radar = createSafeChartComponent("radar");
export const Scatter = createSafeChartComponent("scatter");

// Also create a generic Chart component
export const Chart = React.forwardRef<any, any>((props, ref) => {
  try {
    const { type, data, options, ...restProps } = props;

    // Validate type parameter
    if (!type || typeof type !== "string") {
      return (
        <div className="flex items-center justify-center h-full text-orange-400 p-8 min-h-[200px]">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-400" />
            <p className="text-sm text-orange-400">Invalid Chart Type</p>
            <p className="text-xs text-gray-500 mt-1">
              Chart type "{type}" not supported
            </p>
          </div>
        </div>
      );
    }

    // Enhanced data validation
    const isValidData = React.useMemo(() => {
      if (!data || typeof data !== "object") return false;
      if (!data.labels || !Array.isArray(data.labels)) return false;
      if (!data.datasets || !Array.isArray(data.datasets)) return false;
      if (data.labels.length === 0) return false;
      if (data.datasets.length === 0) return false;

      return data.datasets.every(
        (dataset: any) =>
          dataset &&
          typeof dataset === "object" &&
          (Array.isArray(dataset.data) || typeof dataset.data === "object"),
      );
    }, [data]);

    if (!isValidData) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400 p-8 min-h-[200px]">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 animate-pulse text-cyan-400" />
            <p className="text-sm text-gray-400">Loading chart data...</p>
            <p className="text-xs text-gray-500 mt-1">Preparing {type} chart</p>
          </div>
        </div>
      );
    }

    // Default safe options
    const safeOptions = React.useMemo(
      () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top" as const,
            labels: { color: "#e5e7eb" },
          },
        },
        scales:
          type !== "doughnut" && type !== "pie"
            ? {
                x: {
                  ticks: { color: "#9ca3af" },
                  grid: { color: "rgba(156, 163, 175, 0.2)" },
                },
                y: {
                  ticks: { color: "#9ca3af" },
                  grid: { color: "rgba(156, 163, 175, 0.2)" },
                },
              }
            : undefined,
        ...options,
      }),
      [options, type],
    );

    // Render the appropriate original Chart.js component
    const ChartComponent = (() => {
      switch (type) {
        case "line":
          return OriginalLine;
        case "bar":
          return OriginalBar;
        case "doughnut":
        case "pie":
          return OriginalDoughnut;
        case "radar":
          return OriginalRadar;
        case "scatter":
        case "bubble":
          return OriginalScatter;
        default:
          return null;
      }
    })();

    if (!ChartComponent) {
      return (
        <div className="flex items-center justify-center h-full text-red-400 p-8 min-h-[200px]">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <p className="text-sm text-red-400">Unsupported Chart Type</p>
            <p className="text-xs text-gray-500 mt-1">
              "{type}" charts not available
            </p>
          </div>
        </div>
      );
    }

    return (
      <ChartComponent
        data={data}
        options={safeOptions}
        {...restProps}
        ref={ref}
      />
    );
  } catch (error) {
    console.error("Chart component error:", error);
    return (
      <div className="flex items-center justify-center h-full text-red-400 p-8 min-h-[200px]">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="text-sm text-red-400">Chart Error</p>
          <p className="text-xs text-gray-500 mt-1">Unable to render chart</p>
        </div>
      </div>
    );
  }
});

// Set display names for debugging
Line.displayName = "SafeLine";
Bar.displayName = "SafeBar";
Doughnut.displayName = "SafeDoughnut";
Radar.displayName = "SafeRadar";
Scatter.displayName = "SafeScatter";
Chart.displayName = "SafeChart";
