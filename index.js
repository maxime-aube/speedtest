import Scheduler from "./Scheduler.js";
import logger from './logger.js';

logger.info('Started speedtest server');

// add cronjob to run speedtest periodically
Scheduler.addJob('speedtest');
