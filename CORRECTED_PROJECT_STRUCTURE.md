# A1Betting 📊⚡️ - CORRECTED PROJECT STRUCTURE

## 🏗️ **Actual Project Structure**

```
frontend/src/
├── App.tsx                    # Main SPA with hash routing & navigation
├── main.tsx                   # React entry point
├── components/                # Reusable React UI components
│   ├── analytics/            # AdvancedAnalyticsHub, etc.
│   ├── betting/              # UltimateMoneyMaker, UnifiedBettingInterface
│   ├── ml/                   # MLModelCenter, MLPredictions
│   ├── dashboard/            # PremiumDashboard
│   └── ...                   # Other component categories
├── pages/                    # Page-level components (not Next.js pages)
│   ├── PrizePicksPageEnhanced.tsx
│   └── ...
├── services/                 # Data layer & business logic
│   ├── ml/                   # UnifiedMLEngine
│   ├── data/                 # UnifiedDataPipeline
│   ├── unified/              # Core services
│   └── ...
├── store/                    # State management
│   └── unified/              # UnifiedStoreManager (Zustand)
├── config/                   # Configuration
│   └── unifiedApiConfig.ts   # API endpoints & settings
├── types/                    # TypeScript type definitions
└── utils/                    # Utility functions
```

## 🔄 **Navigation Architecture**

**Current Implementation: Single Page Application (SPA)**

- **Framework**: React + Vite (not Next.js)
- **Routing**: Hash-based routing in App.tsx
- **Navigation**: 8 main feature groups with 25+ sub-sections
- **Loading**: Lazy loading for performance optimization

### **Route Structure:**

```
#/                           → Premium Dashboard (default)
#/prizepicks-enhanced        → PrizePicks Pro
#/money-maker               → Money Maker
#/money-maker-advanced      → Advanced Money Maker
#/money-maker-enhanced      → Enhanced Money Maker
#/advanced-ml               → Advanced ML Dashboard
#/hyper-ml                  → Hyper ML Insights
#/evolutionary              → Evolutionary Insights
#/ml-center                 → ML Model Center
#/analytics                 → Analytics Dashboard
#/analytics-hub             → Analytics Hub
#/performance               → Performance Analytics
#/real-time                 → Real-time Data Stream
#/market-analysis           → Market Analysis
#/mobile                    → Mobile Experience
#/unified-dashboard         → Unified Dashboard
#/unified-betting           → Unified Betting Interface
#/unified-predictions       → Unified Predictions
#/what-if                   → What-If Simulator
#/lineup-builder            → Lineup Builder
#/arbitrage                 → Arbitrage Opportunities
#/profile                   → User Profile
#/settings                  → Settings
#/ml-predictions            → ML Predictions
#/security                  → Security Dashboard
```

## 🚀 **Quick Start (Corrected)**

```bash
# Clone and setup
git clone https://github.com/itzcole03/A1betting.git
cd A1betting

# Install frontend dependencies
cd frontend
npm install

# Start development server (Vite, not Next.js)
npm run dev   # Runs on http://localhost:5173

# For backend ML services (optional)
cd ../backend
pip install -r requirements.txt
python services/predict_server.py
```

## 📊 **Architecture Pattern**

**Current**: React SPA with client-side routing

- ✅ Fast navigation (no page reloads)
- ✅ Rich state management
- ✅ Real-time updates
- ✅ Offline capabilities

**Alternative**: Next.js with file-based routing (if desired)

- Would require migration from hash routing to file-based pages
- Benefits: SSR, SEO optimization, API routes
