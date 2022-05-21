import { exec } from 'child_process';
import logger from './logger.js';

exec('speedtest --json', (err, stdout, stderr) => {
    if (err) {
        logger.error(`node couldn't execute the command`, {
            err: err
        });
        return;
    }
    // logs the *entire* stdout and stderr (buffered)
    logger.info(`node executed speedtest`, {
        stdout: JSON.parse(stdout),
        stderr: stderr
    });
});