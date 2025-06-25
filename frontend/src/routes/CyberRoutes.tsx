import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CyberLayout from "../components/layout/CyberLayout";
import CyberDashboard from "../pages/CyberDashboard";
import CyberPremiumDashboard from "../pages/CyberPremiumDashboard";
import CyberMoneyMaker from "../pages/CyberMoneyMaker";
import CyberPrizePicksPage from "../pages/CyberPrizePicksPage";
import CyberAnalyticsPage from "../pages/CyberAnalyticsPage";
import CyberDefaultPage from "../pages/CyberDefaultPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CyberLayout />,
    children: [
      {
        index: true,
        element: <CyberDashboard />,
      },
      {
        path: "premium-dashboard",
        element: <CyberPremiumDashboard />,
      },
      {
        path: "money-maker",
        element: <CyberMoneyMaker />,
      },
      {
        path: "prizepicks",
        element: <CyberPrizePicksPage />,
      },
      {
        path: "ml-center",
        element: (
          <CyberDefaultPage
            title="ML Center"
            description="Machine learning command center with 47 neural networks and deep learning models"
            icon="fa-brain"
          />
        ),
      },
      {
        path: "quantum",
        element: (
          <CyberDefaultPage
            title="Quantum Predictions"
            description="Quantum-enhanced prediction engine with 1024 qubits and superposition algorithms"
            icon="fa-atom"
          />
        ),
      },
      {
        path: "analytics",
        element: <CyberAnalyticsPage />,
      },
      {
        path: "realtime",
        element: (
          <CyberDefaultPage
            title="Real-time Monitor"
            description="Live data monitoring with instant processing and intelligent alerts"
            icon="fa-eye"
          />
        ),
      },
      {
        path: "settings",
        element: (
          <CyberDefaultPage
            title="Settings"
            description="Platform configuration and account management options"
            icon="fa-cog"
          />
        ),
      },
    ],
  },
]);

const CyberRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default CyberRoutes;
