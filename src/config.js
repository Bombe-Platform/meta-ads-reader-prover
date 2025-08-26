require('dotenv').config();

const config = {
  meta: {
    appId: process.env.META_APP_ID,
    appSecret: process.env.META_APP_SECRET,
    accessToken: process.env.META_ACCESS_TOKEN,
    adAccountId: process.env.META_AD_ACCOUNT_ID
  },
  scheduling: {
    cron: process.env.SCHEDULE_CRON || '0 */6 * * *',
    enabled: process.env.ENABLE_SCHEDULING === 'true'
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/meta-ads-prover.log'
  }
};

function validateConfig() {
  const required = [
    'META_APP_ID',
    'META_APP_SECRET', 
    'META_ACCESS_TOKEN',
    'META_AD_ACCOUNT_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (!config.meta.adAccountId.startsWith('act_')) {
    throw new Error('META_AD_ACCOUNT_ID must start with "act_"');
  }
}

module.exports = { config, validateConfig };