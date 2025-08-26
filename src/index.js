#!/usr/bin/env node

const { validateConfig } = require('./config');
const logger = require('./logger');
const MetaAuth = require('./metaAuth');
const MetaApiClient = require('./apiClient');
const Scheduler = require('./scheduler');

class MetaAdsProver {
  constructor() {
    this.auth = null;
    this.client = null;
    this.scheduler = null;
  }

  async initialize() {
    try {
      logger.info('Initializing Meta Ads Reader Prover');
      
      // Validate configuration
      validateConfig();
      logger.info('Configuration validated successfully');
      
      // Initialize authentication
      this.auth = new MetaAuth();
      this.auth.initialize();
      
      // Test connection
      const connectionTest = await this.auth.testConnection();
      if (!connectionTest.success) {
        throw new Error(`Connection test failed: ${connectionTest.error}`);
      }
      
      // Initialize API client
      this.client = new MetaApiClient(this.auth);
      
      // Initialize scheduler
      this.scheduler = new Scheduler(() => this.runApiRequests());
      
      logger.info('Meta Ads Reader Prover initialized successfully');
      
      return true;
    } catch (error) {
      logger.error('Failed to initialize Meta Ads Reader Prover', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async runApiRequests() {
    try {
      logger.info('Starting API request run');
      
      if (!this.client) {
        throw new Error('API client not initialized');
      }
      
      const results = await this.client.runAllRequests();
      
      logger.info('API request run completed', {
        success: results.success,
        totalRequests: results.requests.length,
        successfulRequests: results.requests.filter(r => r.success).length,
        errors: results.errors.length
      });
      
      return results;
    } catch (error) {
      logger.error('API request run failed', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  startScheduler() {
    if (!this.scheduler) {
      throw new Error('Scheduler not initialized');
    }
    
    return this.scheduler.start();
  }

  stopScheduler() {
    if (!this.scheduler) {
      throw new Error('Scheduler not initialized');
    }
    
    return this.scheduler.stop();
  }

  getStatus() {
    return {
      initialized: this.client !== null,
      scheduler: this.scheduler ? this.scheduler.getStatus() : null
    };
  }
}

// CLI functionality
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const prover = new MetaAdsProver();
  
  try {
    await prover.initialize();
    
    switch (command) {
      case 'run':
        logger.info('Running single API request batch');
        const results = await prover.runApiRequests();
        console.log('Results:', JSON.stringify(results, null, 2));
        break;
        
      case 'start':
        logger.info('Starting scheduled runs');
        const started = prover.startScheduler();
        if (started) {
          console.log('Scheduler started successfully');
          console.log('Status:', JSON.stringify(prover.getStatus(), null, 2));
          
          // Keep process alive
          process.on('SIGINT', () => {
            logger.info('Received SIGINT, stopping scheduler');
            prover.stopScheduler();
            process.exit(0);
          });
          
          process.on('SIGTERM', () => {
            logger.info('Received SIGTERM, stopping scheduler');
            prover.stopScheduler();
            process.exit(0);
          });
          
          logger.info('Press Ctrl+C to stop the scheduler');
        } else {
          console.log('Failed to start scheduler');
          process.exit(1);
        }
        break;
        
      case 'status':
        const status = prover.getStatus();
        console.log('Status:', JSON.stringify(status, null, 2));
        break;
        
      case 'test':
        logger.info('Testing Meta Ads API connection');
        const testResult = await prover.auth.testConnection();
        console.log('Connection test:', JSON.stringify(testResult, null, 2));
        break;
        
      default:
        console.log(`
Meta Ads Reader Prover

Usage:
  node src/index.js <command>

Commands:
  run     - Run a single batch of API requests
  start   - Start scheduled runs (use Ctrl+C to stop)
  status  - Show current status
  test    - Test API connection
  
Examples:
  node src/index.js run      # Run once
  node src/index.js start    # Start scheduler
  node src/index.js test     # Test connection
`);
        break;
    }
  } catch (error) {
    logger.error('Application error', {
      error: error.message,
      stack: error.stack
    });
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = MetaAdsProver;