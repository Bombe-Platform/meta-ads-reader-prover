const bizSdk = require('facebook-nodejs-business-sdk');
const { config } = require('./config');
const logger = require('./logger');

class MetaApiClient {
  constructor(metaAuth) {
    this.auth = metaAuth;
    this.account = new bizSdk.AdAccount(config.meta.adAccountId);
  }

  async getAccountInfo() {
    try {
      logger.info('Fetching account information');
      const fields = [
        'id',
        'name', 
        'account_status',
        'age',
        'amount_spent',
        'balance',
        'business',
        'currency',
        'timezone_name'
      ];
      
      const accountData = await this.account.read(fields);
      
      logger.info('Account information retrieved successfully', {
        accountId: accountData.id,
        accountName: accountData.name,
        status: accountData.account_status
      });
      
      return accountData;
    } catch (error) {
      logger.error('Failed to fetch account information', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getCampaigns() {
    try {
      logger.info('Fetching campaigns');
      const fields = [
        'id',
        'name',
        'status',
        'objective',
        'created_time',
        'updated_time',
        'start_time',
        'stop_time'
      ];
      
      const campaigns = await this.account.getCampaigns(fields);
      
      logger.info('Campaigns retrieved successfully', {
        count: campaigns.length,
        campaigns: campaigns.map(c => ({ id: c.id, name: c.name, status: c.status }))
      });
      
      return campaigns;
    } catch (error) {
      logger.error('Failed to fetch campaigns', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getAdSets() {
    try {
      logger.info('Fetching ad sets');
      const fields = [
        'id',
        'name',
        'status',
        'campaign_id',
        'created_time',
        'updated_time',
        'start_time',
        'end_time'
      ];
      
      const adSets = await this.account.getAdSets(fields);
      
      logger.info('Ad sets retrieved successfully', {
        count: adSets.length,
        adSets: adSets.map(a => ({ id: a.id, name: a.name, status: a.status }))
      });
      
      return adSets;
    } catch (error) {
      logger.error('Failed to fetch ad sets', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getAds() {
    try {
      logger.info('Fetching ads');
      const fields = [
        'id',
        'name',
        'status',
        'adset_id',
        'campaign_id',
        'created_time',
        'updated_time'
      ];
      
      const ads = await this.account.getAds(fields);
      
      logger.info('Ads retrieved successfully', {
        count: ads.length,
        ads: ads.map(a => ({ id: a.id, name: a.name, status: a.status }))
      });
      
      return ads;
    } catch (error) {
      logger.error('Failed to fetch ads', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getCustomAudiences() {
    try {
      logger.info('Fetching custom audiences');
      const fields = [
        'id',
        'name',
        'description',
        'approximate_count_lower_bound',
        'approximate_count_upper_bound',
        'data_source',
        'subtype'
      ];
      
      const audiences = await this.account.getCustomAudiences(fields);
      
      logger.info('Custom audiences retrieved successfully', {
        count: audiences.length,
        audiences: audiences.map(a => ({ id: a.id, name: a.name, subtype: a.subtype }))
      });
      
      return audiences;
    } catch (error) {
      logger.error('Failed to fetch custom audiences', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getAdImages() {
    try {
      logger.info('Fetching ad images');
      const fields = [
        'id',
        'name',
        'status',
        'created_time',
        'updated_time',
        'width',
        'height'
      ];
      
      const images = await this.account.getAdImages(fields);
      
      logger.info('Ad images retrieved successfully', {
        count: images.length,
        images: images.map(i => ({ id: i.id, name: i.name, status: i.status }))
      });
      
      return images;
    } catch (error) {
      logger.error('Failed to fetch ad images', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getInsights(daysAgo = 7) {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      const since = startDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const until = endDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      logger.info('Fetching insights', { since, until });
      const fields = [
        'impressions',
        'clicks',
        'spend',
        'reach',
        'frequency',
        'ctr',
        'cpm',
        'cpp'
      ];
      
      const params = {
        time_range: { since, until },
        level: 'account'
      };
      
      const insights = await this.account.getInsights(fields, params);
      
      logger.info('Insights retrieved successfully', {
        count: insights.length,
        since,
        until
      });
      
      return insights;
    } catch (error) {
      logger.error('Failed to fetch insights', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async runAllRequests() {
    const results = {
      timestamp: new Date().toISOString(),
      requests: [],
      success: true,
      errors: []
    };

    const requests = [
      { name: 'account', method: () => this.getAccountInfo() },
      { name: 'campaigns', method: () => this.getCampaigns() },
      { name: 'adSets', method: () => this.getAdSets() },
      { name: 'ads', method: () => this.getAds() },
      { name: 'customAudiences', method: () => this.getCustomAudiences() },
      { name: 'adImages', method: () => this.getAdImages() },
      { name: 'insights', method: () => this.getInsights() }
    ];

    logger.info('Starting batch API requests', { totalRequests: requests.length });

    for (const request of requests) {
      try {
        const startTime = Date.now();
        const data = await request.method();
        const endTime = Date.now();
        
        results.requests.push({
          name: request.name,
          success: true,
          duration: endTime - startTime,
          dataCount: Array.isArray(data) ? data.length : 1,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        results.success = false;
        results.errors.push({
          request: request.name,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        results.requests.push({
          name: request.name,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    logger.info('Batch API requests completed', {
      totalRequests: results.requests.length,
      successful: results.requests.filter(r => r.success).length,
      failed: results.errors.length,
      overallSuccess: results.success
    });

    return results;
  }
}

module.exports = MetaApiClient;