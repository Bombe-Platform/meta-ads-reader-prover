# Troubleshooting Guide

## Permission Errors

### Error: "Ad account owner has NOT grant ads_management or ads_read permission"

This error occurs when the System User token doesn't have the required permissions to access the ad account.

**Solution:**

1. **Check System User Permissions** in Meta Business Manager:
   - Go to Business Settings > Users > System Users
   - Find your System User
   - Ensure it has `ads_read` permission assigned

2. **Grant Ad Account Access**:
   - Go to Business Settings > Accounts > Ad Accounts
   - Select your ad account
   - Click "Assign Partners" 
   - Add your System User with appropriate permissions

3. **Regenerate Token** if needed:
   - Generate a new System User token
   - Ensure the token scope includes `ads_read`
   - Update your `.env` file with the new token

4. **Verify Business Verification**:
   - Ensure your Meta Business account is verified
   - Check that the app is associated with the correct Business Manager

### Required Permissions for System User

The System User must have at least these permissions:
- `ads_read` - Required for reading ad data
- Account access to the target ad account

### Token Verification Steps

To verify your token has the right permissions:

1. Use Facebook's Access Token Debugger: https://developers.facebook.com/tools/debug/accesstoken/
2. Paste your System User token
3. Check that the token includes `ads_read` in the scopes
4. Verify the token is associated with the correct app and business

## Common Configuration Issues

### Invalid Account ID Format

**Error:** "META_AD_ACCOUNT_ID must start with 'act_'"

**Solution:** 
- Ad Account ID must be prefixed with "act_"
- Example: `act_1234567890123456`
- Find your account ID in Meta Ads Manager URL or Business Settings

### Authentication Failures

**Error:** Various authentication-related errors

**Solution:**
1. Verify App ID and App Secret are correct
2. Ensure the app is in "Live" mode (not Development)
3. Check that the app has Marketing API permissions
4. Confirm the System User belongs to the same Business Manager as the app

### Environment Variable Issues

**Error:** "Missing required environment variables"

**Solution:**
1. Ensure `.env` file exists in the project root
2. Verify all required variables are set:
   - `META_APP_ID`
   - `META_APP_SECRET` 
   - `META_ACCESS_TOKEN`
   - `META_AD_ACCOUNT_ID`

## Getting Help

If these solutions don't resolve your issue:

1. **Check Meta's Documentation**: https://developers.facebook.com/docs/marketing-api/
2. **Verify Business Settings**: Ensure all components (app, system user, ad account) belong to the same Business Manager
3. **Contact Meta Support**: For permission and verification issues
4. **Check Rate Limits**: Meta has strict rate limiting for API access

## Testing Your Setup

Use this step-by-step process to verify everything is working:

1. **Test Token**: Use Facebook's Access Token Debugger
2. **Test Connection**: Run `pnpm test` 
3. **Test Single Run**: Run `pnpm run` once working
4. **Test Scheduling**: Run `pnpm start` for automated execution

## Meta Business Manager Checklist

Ensure these are properly configured in Meta Business Manager:

- ✅ Business is verified
- ✅ App is created and associated with the business  
- ✅ App has Marketing API access approved
- ✅ System User is created
- ✅ System User has `ads_read` permission
- ✅ System User has access to target ad account
- ✅ Ad account is real (not sandbox)
- ✅ Generated token includes required scopes