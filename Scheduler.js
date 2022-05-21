import fs from 'fs';
import CronJobManager from 'cron-job-manager';
import logger from './logger.js'

class Scheduler {

    constructor() {}

    /* attach CronJobManager to Scheduler. Use it to manage scheduled jobs. */
    static manager = new CronJobManager();

    /* add cron job */
    static async addJob(jobName, cronTime) {

        const scheduleFiles = fs.readdirSync('./jobs').filter(file => file.startsWith(jobName) && file.endsWith('.js'));
        for (const file of scheduleFiles) {
            try {
                const { default: job } = await import(`./jobs/${file}`);
                logger.info(`Scheduling job...`, {
                    job: {
                        name: job.name,
                        description: job.description
                    }
                });
                this.manager.add(`${job.name}`, cronTime ? cronTime : job.defaultCronTime, () => {
                    job.execute();
                });
                this.manager.start(`${job.name}`);
                logger.info(`Job successfully scheduled`, {
                    job: {
                        name: job.name,
                        description: job.description,
                        cronTime: cronTime ? cronTime : job.defaultCronTime
                    },
                });
            } catch (e) {
                logger.error(e, {
                    message: e.message
                });
            }
        }
    }

    /* return a cron job  */
    static getJob(jobName) {
        return this.manager.jobs[jobName];
    }

    /* delete cron job */
    static deleteJob(jobName) {
        const job = this.getJob(jobName);
        if (job !== undefined) {
            try {
                this.manager.deleteJob(jobName);
            } catch (e) {
                logger.error(e, {
                    message: e.message
                });
            }
        } else  {
            logger.info(`tried to delete a job but couldn't find it`, {
                job: jobName
            });
        }
    }

    // get a job's timeout
    static getJobTimeout(job) {
        return Math.abs(new Date(job.nextDates()) - new Date());
    }

    /* return formatted string of time left before job executes */
    static getJobFormattedTimeout(job) {
        const timeout = this.getJobTimeout(job);
        const days = Math.floor(timeout / 1000 / 3600 / 24);
        const hours = Math.floor(timeout / 1000 / 3600);
        const minutes = Math.floor((timeout / 1000 - (hours * 3600)) / 60);
        const seconds = Math.floor(timeout / 1000 - (hours * 3600) - (minutes * 60));
        return (
            (days > 0 ? days + 'j ': '') +
            (hours > 0 ? (hours < 10 ? '0' : '') + hours + 'h ': '') +
            (minutes > 0 ? (minutes < 10 ? '0' : '') + minutes + 'min ' : '') +
            (seconds < 10 ? '0' : '') + seconds + 's'
        );
    }
}

export default Scheduler;
