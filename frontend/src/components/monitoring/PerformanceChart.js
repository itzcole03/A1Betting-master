import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const PerformanceChart = ({ metrics, title, yAxisLabel = 'Value', showLegend = true, height = 300, width = 600, color = 'rgb(75, 192, 192)', tension = 0.1, fill = false, }) => {
    const data = {
        labels: metrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: title,
                data: metrics.map(m => m.value),
                borderColor: color,
                backgroundColor: fill ? `${color}33` : undefined,
                tension,
                fill,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: showLegend,
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
            tooltip: {
                callbacks: {
                    label: context => {
                        const value = context.parsed.y;
                        return `${yAxisLabel}: ${value.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: yAxisLabel,
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Time',
                },
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        elements: {
            point: {
                radius: 2,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
    };
    return (_jsx("div", { style: { height, width }, children: _jsx(Line, { data: data, options: options }) }));
};
export default React.memo(PerformanceChart);
