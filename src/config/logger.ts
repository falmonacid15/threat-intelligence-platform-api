import winston from 'winston';
import env from './env';

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length
      ? ` ${JSON.stringify(meta)}`
      : '';
    return `${timestamp} ${level}: ${message}${metaString}`;
  }),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'Threat Intelligence Platform' },
  transports: [
    new winston.transports.File({
      filename: '/logs/error.log',
      level: 'error',
      format: fileFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});
