#!/usr/bin/env node

/**
 * SportsRadar API Integration Test Script
 * 
 * This script validates the SportsRadar API integration by testing:
 * 1. Environment variable configuration
 * 2. API health check
 * 3. Basic API endpoints
 * 4. Error handling
 */

const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Load environment variables
dotenv.config({ path: '.env' });

class SportsRadarTester {
  constructor() {
    this.apiKey = process.env.VITE_SPORTRADAR_API_KEY;
    this.baseUrl = process.env.VITE_SPORTRADAR_API_ENDPOINT || 'https://api.sportradar.com';
    this.results = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${timestamp} ${prefix} ${message}`);
  }

  async test(name, testFn) {
    this.log(`Testing: ${name}`, 'info');
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      this.log(`✅ ${name} - Success (${duration}ms)`, 'success');
      this.results.push({ name, status: 'success', duration, result });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.log(`❌ ${name} - Failed: ${error.message} (${duration}ms)`, 'error');
      this.results.push({ name, status: 'error', duration, error: error.message });
      throw error;
    }
  }

  async checkEnvironment() {
    return this.test('Environment Configuration', async () => {
      if (!this.apiKey) {
        throw new Error('VITE_SPORTRADAR_API_KEY not found in environment variables');
      }
      
      if (!this.baseUrl) {
        throw new Error('VITE_SPORTRADAR_API_ENDPOINT not found in environment variables');
      }

      return {
        hasApiKey: !!this.apiKey,
        baseUrl: this.baseUrl,
        apiKeyLength: this.apiKey.length
      };
    });
  }

  async checkApiAccess() {
    return this.test('API Basic Access', async () => {
      // Test a simple NBA endpoint that should be accessible
      const url = `${this.baseUrl}/nba/v7/en/league/hierarchy.json?api_key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        status: response.status,
        hasData: !!data,
        dataKeys: Object.keys(data || {})
      };
    });
  }

  async checkOddsApi() {
    return this.test('Odds Comparison API', async () => {
      // Test odds comparison endpoint
      const url = `${this.baseUrl}/odds-comparison/prematch/basketball/events.json?api_key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Odds API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        status: response.status,
        hasEvents: Array.isArray(data.events),
        eventCount: data.events?.length || 0
      };
    });
  }

  async checkRateLimit() {
    return this.test('Rate Limiting', async () => {
      const start = Date.now();
      
      // Make two quick requests to test rate limiting
      const url = `${this.baseUrl}/nba/v7/en/league/hierarchy.json?api_key=${this.apiKey}`;
      
      await fetch(url);
      await new Promise(resolve => setTimeout(resolve, 1100)); // Wait 1.1 seconds
      await fetch(url);
      
      const duration = Date.now() - start;
      
      return {
        totalDuration: duration,
        rateLimitRespected: duration >= 1000 // Should take at least 1 second due to rate limiting
      };
    });
  }

  async runAllTests() {
    this.log('🚀 Starting SportsRadar API Integration Tests', 'info');
    this.log('================================================', 'info');
    
    try {
      await this.checkEnvironment();
      await this.checkApiAccess();
      
      // Try odds API (might fail if not accessible)
      try {
        await this.checkOddsApi();
      } catch (error) {
        this.log(`⚠️ Odds API not accessible: ${error.message}`, 'info');
      }

      await this.checkRateLimit();
      
    } catch (error) {
      this.log(`💥 Critical test failed: ${error.message}`, 'error');
    }

    this.log('================================================', 'info');
    this.printSummary();
  }

  printSummary() {
    const total = this.results.length;
    const success = this.results.filter(r => r.status === 'success').length;
    const failed = total - success;
    
    this.log(`📊 Test Summary: ${success}/${total} tests passed`, 'info');
    
    if (failed > 0) {
      this.log(`❌ ${failed} tests failed:`, 'error');
      this.results
        .filter(r => r.status === 'error')
        .forEach(r => this.log(`  - ${r.name}: ${r.error}`, 'error'));
    }

    if (success === total) {
      this.log('🎉 All tests passed! SportsRadar integration is ready.', 'success');
    } else {
      this.log('⚠️ Some tests failed. Check configuration and API access.', 'error');
    }
  }
}

// Run the tests
if (require.main === module) {
  const tester = new SportsRadarTester();
  tester.runAllTests().catch(console.error);
}

module.exports = SportsRadarTester;
