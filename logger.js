import * as winston from 'winston'
import 'winston-daily-rotate-file';
import * as dotenv from 'dotenv';

dotenv.config();

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss Z'
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.DailyRotateFile({
            filename: 'combined-%DATE%.log',
            dirname: './logs',
            level: process.env.LOG_LEVEL || 'info',
            prepend: true,
            datePattern: 'DD-MM-YYYY',
        }),
        new winston.transports.DailyRotateFile({
            filename: 'error-%DATE%.log',
            dirname: './logs',
            level: 'error',
            // prepend: true,
            datePattern: 'DD-MM-YYYY',
        })
    ],
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: 'exception-%DATE%.log',
            dirname: './logs',
            // prepend: true,
            datePattern: 'DD-MM-YYYY',
        })
    ],
    rejectionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: 'rejection-%DATE%.log',
            dirname: './logs',
            // prepend: true,
            datePattern: 'DD-MM-YYYY',
        })
    ]
});

// log file rotations
logger.transports.forEach(transport => {
    transport.on('rotate', (oldFilename, newFilename) => {
        logger.info('switched log file', {
            oldFileName : oldFilename,
            newFileName : newFilename
        });
    });
});

export default logger;