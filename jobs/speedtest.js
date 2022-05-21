import logger from '../logger.js';
import { exec } from "child_process";

const job = {
    // defaultCronTime: '*/15 * * * *',
    defaultCronTime: '*/30 * * * * *', // only for testing (every 30 seconds)
    name: 'speedtest',
    description: 'runs a speedtest on the internet connection',
    execute () {
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
            console.log('download', `${ (JSON.parse(stdout).download / 1048576).toFixed(2) } Mbits/s`)
            console.log('upload', `${ (JSON.parse(stdout).upload / 1048576).toFixed(2) } Mbits/s`)
        });
    }
};

export default job;