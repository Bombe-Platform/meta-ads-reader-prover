const cron = require('node-cron');
const { config } = require('./config');
const logger = require('./logger');

class Scheduler {
  constructor(taskFunction) {
    this.taskFunction = taskFunction;
    this.task = null;
    this.isRunning = false;
  }

  start() {
    if (!config.scheduling.enabled) {
      logger.info('Scheduling is disabled');
      return false;
    }

    if (this.isRunning) {
      logger.warn('Scheduler is already running');
      return false;
    }

    if (!cron.validate(config.scheduling.cron)) {
      logger.error('Invalid cron expression', { cron: config.scheduling.cron });
      throw new Error(`Invalid cron expression: ${config.scheduling.cron}`);
    }

    logger.info('Starting scheduler', { 
      cron: config.scheduling.cron,
      enabled: config.scheduling.enabled
    });

    this.task = cron.schedule(config.scheduling.cron, async () => {
      logger.info('Scheduled task starting');
      try {
        await this.taskFunction();
        logger.info('Scheduled task completed successfully');
      } catch (error) {
        logger.error('Scheduled task failed', {
          error: error.message,
          stack: error.stack
        });
      }
    }, {
      scheduled: false,
      timezone: "UTC"
    });

    this.task.start();
    this.isRunning = true;
    
    logger.info('Scheduler started successfully');
    return true;
  }

  stop() {
    if (!this.isRunning || !this.task) {
      logger.info('Scheduler is not running');
      return false;
    }

    this.task.stop();
    this.isRunning = false;
    
    logger.info('Scheduler stopped');
    return true;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      cronExpression: config.scheduling.cron,
      enabled: config.scheduling.enabled,
      nextRun: this.isRunning && this.task ? this.getNextRunTime() : null
    };
  }

  getNextRunTime() {
    if (!this.task) return null;
    
    try {
      const nextDates = cron.getTasks().get(this.task);
      return nextDates ? nextDates.options?.timezone : null;
    } catch (error) {
      logger.error('Failed to get next run time', { error: error.message });
      return null;
    }
  }
}

module.exports = Scheduler;