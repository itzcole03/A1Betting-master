# ALPHA1 Service Architecture Reference

## Service Pattern Summary

- **Singleton Pattern:** All services are exported as singletons (no class exports).
- **Strict Type Safety:** All services use TypeScript with explicit types for all interfaces, methods, and event payloads.
- **ESM-Only Imports:** All imports use ESM syntax and explicit `.js` extensions for local files.
- **UnifiedConfig:** All configuration (API keys, base URLs, feature flags) is accessed via `UnifiedConfig.getInstance().get('<key>')`.
- **EventBus:** All inter-service communication and UI notifications use `EventBus.getInstance().emit('<event>', payload)`.
- **No Fallbacks/Simulations:** Only real API logic—no mock, simulated, or fallback data.

---

## Config Reference Table

| Config Key                 | Type    | Used By                | Effect                                      |
|---------------------------|---------|------------------------|----------------------------------------------|
| enableNews                | boolean | NewsService            | Enables/disables news feature                |
| enableWeather             | boolean | WeatherService         | Enables/disables weather feature             |
| enableInjuries            | boolean | InjuryService          | Enables/disables injury feature              |
| enableAnalytics           | boolean | AnalyticsService       | Enables/disables analytics feature           |
| enableSocialSentiment     | boolean | SocialSentimentService | Enables/disables social sentiment feature    |
| enableSportradar          | boolean | SportradarService      | Enables/disables Sportradar integration      |
| ...                       | ...     | ...                    | ...                                          |

---

## EventBus Event Reference

| Event Name         | Payload Type/Shape                                 | Emitted By            | When Emitted                        | Consumed By         |
|--------------------|---------------------------------------------------|-----------------------|--------------------------------------|---------------------|
| news:update        | { headlines: News[], timestamp: number }           | NewsService           | On news fetch/update                 | UI, Analytics       |
| weather:update     | { weather: WeatherData, timestamp: number }        | WeatherService        | On weather fetch/update              | UI, Analytics       |
| weather:alerts     | { alerts: Alert[], timestamp: number }             | WeatherService        | On weather alerts fetch              | UI                  |
| injury:update      | { injuries: InjuryData[], timestamp: number }      | InjuryService, SportradarService | On injury fetch/update | UI, Analytics       |
| sentiment:update   | { sentiment: any[], timestamp: number }            | SocialSentimentService| On sentiment fetch/update            | UI, Analytics       |
| metric:recorded    | { name: string, value: any, timestamp: number, labels?: Record<string,string|number> } | AnalyticsService, SocialSentimentService | On metric update | UI, Analytics |
| match:update       | { match: MatchupData, timestamp: number }          | SportradarService     | On matchup fetch/update              | UI, Analytics       |
| config:update      | { key: string, value: any, timestamp: number }     | UnifiedConfig         | On config/flag change                | UI, All Services    |
| ...                | ...                                               | ...                   | ...                                  | ...                 |

---

## Example Usage

```typescript
// Accessing a feature flag
const enabled = UnifiedConfig.getInstance().get('enableWeather');

// Emitting an event
EventBus.getInstance().emit('weather:update', { weather, timestamp: Date.now() });

// Subscribing to an event
EventBus.getInstance().on('weather:update', (payload) => {
  // handle update
});
```

---

## Extending
- Add new config keys to UnifiedConfig and document them above.
- Emit new events via EventBus and document them above.
- Always use strict typing for new event payloads and config values.
