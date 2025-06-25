# SportsRadar API Integration Documentation

## Overview

This document outlines the complete SportsRadar API integration for the A1Betting application. The integration provides access to comprehensive sports data including live odds, player statistics, game schedules, and player props across multiple sports.

## API Access Summary

Based on your provided information, you have access to the following SportsRadar APIs:

### Odds Comparison APIs
- **Prematch Odds**: `/odds-comparison/prematch`
- **Player Props**: `/odds-comparison/player-props`  
- **Futures**: `/odds-comparison/futures`
- **Regular Odds**: `/odds-comparison/regular`

### Sports APIs
- **NBA**: `/nba/v7/en` - National Basketball Association
- **WNBA**: `/wnba/v7/en` - Women's National Basketball Association
- **NFL**: `/nfl/v7/en` - National Football League
- **NHL**: `/nhl/v7/en` - National Hockey League
- **MLB**: `/mlb/v7/en` - Major League Baseball
- **Soccer**: `/soccer/v4/en` - International Soccer
- **Tennis**: `/tennis/v3/en` - Professional Tennis
- **Golf**: `/golf/v3/en` - Professional Golf
- **MMA**: `/mma/v2/en` - Mixed Martial Arts

## Environment Configuration

The following environment variables are configured in `frontend/.env`:

```env
# SportsRadar API Configuration
VITE_SPORTRADAR_API_KEY=your_api_key_here
VITE_SPORTRADAR_API_ENDPOINT=https://api.sportradar.com
VITE_SPORTSRADAR_RATE_LIMIT=1
VITE_SPORTSRADAR_QUOTA_LIMIT=1000
VITE_SPORTSRADAR_CACHE_TTL=300000
```

## Architecture

### Core Components

1. **SportsRadarService** (`src/services/SportsRadarService.ts`)
   - Main service class for all SportsRadar API interactions
   - Handles rate limiting (1 request per second)
   - Implements caching with configurable TTL
   - Provides methods for all sports and odds APIs

2. **SportsRadarAdapter** (`src/adapters/SportsRadarAdapter.ts`)
   - Backward-compatible adapter for existing code
   - Integrates with unified data architecture
   - Uses enhanced service internally
   - Provides legacy interface support

3. **SportsRadarTestPage** (`src/pages/SportsRadarTestPage.tsx`)
   - Interactive test interface for all API endpoints
   - Real-time validation and monitoring
   - Performance metrics and error reporting
   - Accessible through the main navigation

### Key Features

#### Rate Limiting
- Enforces 1 request per second to respect API limits
- Queues requests when rate limit is exceeded
- Configurable rate limit through environment variables

#### Caching
- Intelligent caching with TTL support
- Reduces API calls and improves performance
- Cache statistics and management
- Configurable cache timeout (default: 5 minutes)

#### Error Handling
- Comprehensive error handling and logging
- Graceful fallbacks for failed requests
- User-friendly error messages
- Retry logic for transient failures

#### Multi-Sport Support
- Unified interface for all supported sports
- Sport-specific endpoint handling
- Consistent data format across sports
- Extensible for new sports

## API Methods

### Core Service Methods

```typescript
// Health check and status
await sportsRadarService.healthCheck()

// NBA Games
await sportsRadarService.getNBAGames(date?)

// Player Statistics
await sportsRadarService.getPlayerStats(sport, playerId, season?)

// Odds Comparison
await sportsRadarService.getOddsComparison(sport, eventId?)

// Player Props
await sportsRadarService.getPlayerPropsOdds(sport, eventId)

// Cache Management
sportsRadarService.clearCache()
sportsRadarService.getCacheStats()
```

### Legacy Adapter Methods

```typescript
// Existing interface (backward compatible)
await adapter.fetchData()
await adapter.getOdds(eventId)
await adapter.getEventDetails(eventId)

// Enhanced methods
await adapter.getPlayerStats(sport, playerId)
await adapter.getOddsComparison(sport)
```

## Data Types

### Game Data
```typescript
interface GameData {
  gameId: string;
  sport: string;
  status: 'scheduled' | 'live' | 'completed';
  scheduled: string;
  homeTeam: { id: string; name: string; abbreviation: string; };
  awayTeam: { id: string; name: string; abbreviation: string; };
  score?: { home: number; away: number; };
  period?: { current: number; timeRemaining?: string; };
}
```

### Odds Data
```typescript
interface OddsData {
  eventId: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  odds: {
    moneyline: { home: number; away: number; };
    spread: { line: number; home: number; away: number; };
    total: { line: number; over: number; under: number; };
  };
  playerProps?: Array<{
    playerId: string;
    playerName: string;
    propType: string;
    line: number;
    overOdds: number;
    underOdds: number;
  }>;
  timestamp: string;
}
```

### Player Statistics
```typescript
interface PlayerStatsData {
  playerId: string;
  playerName: string;
  team: string;
  position: string;
  season: string;
  stats: { games: number; points: number; rebounds: number; assists: number; [key: string]: number; };
  recentForm: Array<{ gameId: string; date: string; opponent: string; stats: Record<string, number>; }>;
}
```

## Usage Examples

### Basic Game Data Retrieval
```typescript
import { sportsRadarService } from '@/services/SportsRadarService';

// Get today's NBA games
const games = await sportsRadarService.getNBAGames();

// Get games for specific date
const tomorrowGames = await sportsRadarService.getNBAGames('2024-01-15');
```

### Odds Comparison
```typescript
// Get basketball odds
const basketballOdds = await sportsRadarService.getOddsComparison('basketball');

// Get odds for specific event
const eventOdds = await sportsRadarService.getOddsComparison('basketball', 'event-123');
```

### Player Props
```typescript
// Get player props for a game
const playerProps = await sportsRadarService.getPlayerPropsOdds('basketball', 'game-456');
```

### Health Monitoring
```typescript
// Check API health and available endpoints
const health = await sportsRadarService.healthCheck();
console.log('Status:', health.status);
console.log('Available APIs:', health.availableAPIs);
```

## Testing and Validation

### Interactive Test Page
Navigate to the "API Integration Test" section in the application to:
- Run comprehensive API tests
- Monitor real-time performance
- Validate all endpoints
- Check rate limiting compliance
- Review cache statistics

### Command Line Testing
```bash
# Run the test script
cd frontend
node test-sportsradar.js
```

### Test Coverage
- Environment configuration validation
- Basic API access verification
- Odds comparison API testing
- Rate limiting compliance
- Error handling validation
- Cache functionality testing

## Performance Optimization

### Caching Strategy
- 5-minute default TTL for most data
- Shorter TTL for live game data (1 minute)
- Longer TTL for static data (15 minutes)
- Memory-based caching for speed

### Rate Limiting
- 1 request per second enforcement
- Request queuing for burst scenarios
- Intelligent request spacing
- Quota monitoring and alerts

### Error Recovery
- Automatic retry with exponential backoff
- Graceful degradation for partial failures
- Fallback to cached data when available
- User notification for persistent issues

## Security Considerations

### API Key Management
- Environment variable storage
- No hardcoded keys in source code
- Separate keys for different environments
- Regular key rotation recommendations

### Data Protection
- No sensitive data logging
- Secure transmission (HTTPS only)
- Request sanitization
- Response validation

## Monitoring and Maintenance

### Health Checks
- Regular API availability monitoring
- Performance metric tracking
- Error rate monitoring
- Quota usage tracking

### Logging
- Structured logging for all API calls
- Performance metrics collection
- Error tracking and alerting
- Usage analytics

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Verify environment variable is set
   - Check key format and validity
   - Confirm API key permissions

2. **Rate Limit Exceeded**
   - Reduce request frequency
   - Implement request queuing
   - Monitor quota usage

3. **Endpoint Not Found**
   - Verify sport/endpoint combination
   - Check API documentation for changes
   - Validate URL construction

4. **Data Format Issues**
   - Check response structure
   - Validate data types
   - Handle missing fields gracefully

### Debug Mode
Enable debug logging by setting:
```env
VITE_DEBUG_SPORTSRADAR=true
```

## Future Enhancements

### Planned Features
- Real-time WebSocket integration
- Advanced caching strategies
- Machine learning data preprocessing
- Historical data analysis
- Multi-source data aggregation

### Scalability Improvements
- Redis-based distributed caching
- Request queue optimization
- Load balancing strategies
- Database integration for historical data

## Support and Resources

### Documentation
- [SportsRadar API Documentation](https://docs.sportradar.com)
- Internal API integration guide
- Troubleshooting resources

### Contact Information
- Development Team: dev@a1betting.com
- SportsRadar Support: support@sportradar.com
- Emergency Contact: emergency@a1betting.com

---

*Last Updated: January 2024*
*Version: 2.0.0*
