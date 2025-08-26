const bizSdk = require('facebook-nodejs-business-sdk');
const { config } = require('./config');
const logger = require('./logger');

class MetaAuth {
  constructor() {
    this.api = null;
    this.initialized = false;
  }

  initialize() {
    try {
      bizSdk.FacebookAdsApi.init(
        config.meta.accessToken,
        config.meta.appSecret,
        config.meta.appId
      );
      
      this.api = bizSdk.FacebookAdsApi.getDefaultApi();
      this.initialized = true;
      
      logger.info('Meta Ads API initialized successfully', {
        appId: config.meta.appId,
        accountId: config.meta.adAccountId
      });
      
      return this.api;
    } catch (error) {
      logger.error('Failed to initialize Meta Ads API', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  getApi() {
    if (!this.initialized) {
      throw new Error('Meta Ads API not initialized. Call initialize() first.');
    }
    return this.api;
  }

  async testConnection() {
    try {
      const account = new bizSdk.AdAccount(config.meta.adAccountId);
      const accountData = await account.read(['id', 'name', 'account_status']);
      
      logger.info('Meta Ads API connection test successful', {
        accountId: accountData.id,
        accountName: accountData.name,
        accountStatus: accountData.account_status
      });
      
      return {
        success: true,
        account: accountData
      };
    } catch (error) {
      logger.error('Meta Ads API connection test failed', {
        error: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = MetaAuth;