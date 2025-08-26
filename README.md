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