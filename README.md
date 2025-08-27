# Meta Ads Reader Prover

A Node.js application that regularly connects to the Meta Ads Marketing API and performs safe, read-only requests against a real ad account. This application demonstrates ongoing integration activity to help Meta approve applications for Ads Management Standard Access.

## Purpose

This application is designed to:
- Authenticate correctly with Meta Ads API using verified business credentials
- Connect to a real business ad account (not sandbox)
- Perform repeatable, safe read-only API calls
- Log all requests and results for audit purposes
- Run automatically on a configurable schedule
- Handle accounts with no active campaigns gracefully

## Features

- ✅ **Read-Only Operations**: Only queries data, never creates or modifies ads
- ✅ **Comprehensive API Coverage**: Fetches account metadata, campaigns, ad sets, ads, custom audiences, images, and insights
- ✅ **Robust Logging**: Detailed logs with timestamps for audit and Meta review
- ✅ **Flexible Scheduling**: Configurable cron-based scheduling via environment variables
- ✅ **Error Handling**: Graceful error handling with detailed logging
- ✅ **Connection Testing**: Built-in API connection testing
- ✅ **On-Demand Execution**: Can be run manually or scheduled

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meta-ads-reader-prover
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:
```env
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here
META_ACCESS_TOKEN=your_system_user_token_here
META_AD_ACCOUNT_ID=act_your_account_id_here
SCHEDULE_CRON=0 */6 * * *
ENABLE_SCHEDULING=true
LOG_LEVEL=info
LOG_FILE=logs/meta-ads-prover.log
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `META_APP_ID` | Your Meta App ID | - | ✅ |
| `META_APP_SECRET` | Your Meta App Secret | - | ✅ |
| `META_ACCESS_TOKEN` | System User Token with ads permissions | - | ✅ |
| `META_AD_ACCOUNT_ID` | Target ad account ID (must start with 'act_') | - | ✅ |
| `SCHEDULE_CRON` | Cron expression for scheduling | `0 */6 * * *` | ❌ |
| `ENABLE_SCHEDULING` | Enable/disable automatic scheduling | `true` | ❌ |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | `info` | ❌ |
| `LOG_FILE` | Log file path | `logs/meta-ads-prover.log` | ❌ |

### Scheduling Examples

- Every 6 hours: `0 */6 * * *`
- Every 4 hours: `0 */4 * * *`
- Twice daily (9 AM and 3 PM): `0 9,15 * * *`
- Every hour: `0 * * * *`
- Every 30 minutes: `*/30 * * * *`

## Usage

### Command Line Interface

The application provides several commands:

```bash
# Test API connection
pnpm test

# Run a single batch of API requests
pnpm run

# Start scheduled runs (use Ctrl+C to stop)
pnpm start

# Check application status
pnpm status
```

### Direct Node.js Usage

```bash
# Test connection
node src/index.js test

# Run once
node src/index.js run

# Start scheduler
node src/index.js start

# Check status
node src/index.js status
```

### Running as Background Service with PM2

PM2 is a production-ready process manager for Node.js applications that allows you to run applications in the background, automatically restart them if they crash, and manage multiple processes efficiently.

#### Prerequisites

Before using PM2, you need to install it globally:

```bash
# Install PM2 globally
npm install -g pm2

# Or with pnpm
pnpm add -g pm2
```

#### PM2 Commands

Once PM2 is installed, you can use these commands to manage the application as a background service:

```bash
# Start the application in background
pnpm run pm2:start

# Stop the background service
pnpm run pm2:stop

# Restart the background service
pnpm run pm2:restart

# View real-time logs from the background service
pnpm run pm2:logs

# Check the status of the background service
pnpm run pm2:status

# View all PM2 processes
pm2 list

# Save PM2 configuration (to auto-restart on system reboot)
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

#### Benefits of Using PM2

- **Background Execution**: Runs without blocking your terminal
- **Auto-Restart**: Automatically restarts if the application crashes
- **Log Management**: Centralized logging with built-in log rotation
- **Zero-Downtime Restarts**: Update your application without service interruption
- **System Boot Integration**: Can automatically start when your server reboots
- **Resource Monitoring**: Built-in monitoring of CPU and memory usage

#### Choosing Between Foreground and Background Execution

**Use foreground execution (`pnpm start`) when:**
- Testing or debugging the application
- Running the application temporarily
- You want to see real-time output in your terminal
- You're developing or making changes

**Use background execution (`pnpm run pm2:start`) when:**
- Running in production environments
- You want the service to continue running after closing your terminal
- You need the service to automatically restart on crashes or system reboots
- Managing multiple services on the same server

## API Requests

The application performs the following read-only requests:

1. **Account Information**: Basic account metadata, status, and settings
2. **Campaigns**: Campaign details, status, objectives, and dates
3. **Ad Sets**: Ad set information, status, and campaign relationships  
4. **Ads**: Individual ad details, status, and relationships
5. **Custom Audiences**: Audience information and approximate sizes
6. **Ad Images**: Image metadata and specifications
7. **Insights**: Account-level performance metrics (last 7 days)

## Logging

All requests and responses are logged with detailed information:

- **Console Output**: Real-time logging with color coding
- **File Logging**: Persistent logs saved to `logs/meta-ads-prover.log`
- **Rotation**: Log files are rotated when they exceed 5MB (keeps 5 files)
- **Structured Logging**: JSON format for easy parsing and analysis

### Log Levels

- `error`: Only errors and critical issues
- `warn`: Warnings and errors  
- `info`: General information, warnings, and errors (recommended)
- `debug`: Detailed debugging information

## Error Handling

The application handles various error scenarios:

- **Invalid Credentials**: Clear error messages for authentication issues
- **Network Issues**: Retry logic and detailed error logging
- **Empty Accounts**: Graceful handling of accounts with no campaigns
- **Rate Limiting**: Respects Meta's API rate limits
- **Invalid Configuration**: Validates all required settings on startup

## Monitoring

### Viewing Logs

```bash
# View real-time logs
tail -f logs/meta-ads-prover.log

# View recent logs
cat logs/meta-ads-prover.log

# Search for errors
grep "error" logs/meta-ads-prover.log
```

### Health Checking

Use the status command to check if the application is running:

```bash
pnpm status
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your App ID, App Secret, and Access Token
   - Ensure the System User Token has ads_read permissions
   - Check that your app is associated with the correct Business Manager

2. **Account Access Issues**
   - Verify the Ad Account ID format (must start with 'act_')
   - Ensure your System User has access to the target account
   - Confirm the account is not a sandbox account

3. **Scheduling Issues**
   - Validate your cron expression using online cron validators
   - Check that `ENABLE_SCHEDULING` is set to 'true'
   - Verify the application stays running (use process managers for production)

4. **Logging Issues**
   - Ensure the logs directory exists and is writable
   - Check disk space for log file storage
   - Verify log file permissions

### Getting Help

If you encounter issues:

1. Check the logs for detailed error messages
2. Run the connection test: `pnpm test`
3. Verify your environment configuration
4. Ensure all dependencies are installed correctly

## Security Considerations

- **Credential Storage**: Never commit `.env` files to version control
- **Access Tokens**: Use System User tokens with minimal required permissions
- **Log Security**: Logs may contain sensitive IDs - secure accordingly
- **Network Security**: Use HTTPS and secure network connections
- **Token Rotation**: Regularly rotate access tokens as per Meta's recommendations

## Development

### Project Structure

```
src/
├── config.js          # Configuration management
├── logger.js          # Winston logging setup
├── metaAuth.js        # Meta API authentication
├── apiClient.js       # API request handling
├── scheduler.js       # Cron scheduling
└── index.js           # Main application entry point
```

### Adding New API Requests

To add new API endpoints:

1. Add the method to `src/apiClient.js`
2. Include it in the `runAllRequests()` method
3. Update logging and error handling
4. Test thoroughly with your account

### Running in Production

For production deployment:

1. Use a process manager like PM2 or systemd
2. Set up proper log rotation
3. Monitor disk space and system resources
4. Implement health checking and alerting
5. Secure credential management

## License

ISC License - see package.json for details