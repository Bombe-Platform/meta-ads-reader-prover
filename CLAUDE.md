# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Commands
- `pnpm test` - Test Meta Ads API connection
- `pnpm run` - Execute a single batch of API requests 
- `pnpm start` - Start scheduled runs in foreground (Ctrl+C to stop)
- `pnpm status` - Check application status

### PM2 Background Service Commands
- `pnpm run pm2:start` - Start as background service with PM2
- `pnpm run pm2:stop` - Stop the background service
- `pnpm run pm2:restart` - Restart the background service
- `pnpm run pm2:logs` - View real-time logs from PM2
- `pnpm run pm2:status` - Check PM2 service status

### Direct Node.js Usage
- `node src/index.js test` - Test API connection
- `node src/index.js run` - Run once
- `node src/index.js start` - Start scheduler
- `node src/index.js status` - Check status

## Architecture Overview

This is a Node.js application that performs read-only requests against the Meta Ads Marketing API on a scheduled basis to demonstrate ongoing integration activity for Ads Management Standard Access approval.

### Core Architecture Pattern

The application follows a modular architecture with clear separation of concerns:

1. **Main Application Controller** (`src/index.js`) - Central orchestrator that initializes all components and provides CLI interface
2. **Configuration Management** (`src/config.js`) - Centralizes environment variable handling and validation
3. **Authentication Layer** (`src/metaAuth.js`) - Handles Meta Ads API SDK initialization and connection testing
4. **API Client Layer** (`src/apiClient.js`) - Encapsulates all Meta Ads API operations
5. **Scheduling System** (`src/scheduler.js`) - Manages cron-based task execution
6. **Logging Infrastructure** (`src/logger.js`) - Winston-based structured logging to file and console

### Key Architectural Patterns

- **Dependency Injection**: The main `MetaAdsProver` class receives auth and client instances
- **Command Pattern**: CLI commands are handled through a switch statement in the main function
- **Strategy Pattern**: Different API request methods are organized as individual methods in `MetaApiClient`
- **Configuration-driven**: All behavior controlled through environment variables
- **Error Boundary**: Each component has comprehensive error handling and logging

### API Request Flow

1. **Initialization Phase**: Config validation → Auth initialization → Connection test → Client setup → Scheduler setup
2. **Execution Phase**: Scheduler triggers → `runApiRequests()` → Sequential API calls → Result aggregation → Logging
3. **API Requests Made**: Account info, campaigns, ad sets, ads, custom audiences, ad images, insights (last 7 days)

### Configuration Requirements

Environment variables must be set in `.env` file (copy from `.env.example`):
- `META_APP_ID`, `META_APP_SECRET`, `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` (required)
- `SCHEDULE_CRON`, `ENABLE_SCHEDULING`, `LOG_LEVEL`, `LOG_FILE` (optional with defaults)

### Key Dependencies

- `facebook-nodejs-business-sdk` - Meta Ads API client
- `node-cron` - Scheduling system  
- `winston` - Logging framework
- `dotenv` - Environment variable management

### Execution Modes

- **One-time execution**: Runs all API requests once and exits
- **Scheduled execution**: Runs continuously with cron-based scheduling
- **Connection testing**: Tests API connectivity without making full requests
- **Status checking**: Reports current application and scheduler state