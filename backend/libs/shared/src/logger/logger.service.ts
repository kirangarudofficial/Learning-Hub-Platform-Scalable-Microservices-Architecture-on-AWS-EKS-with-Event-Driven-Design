import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    const environment = this.configService.get('NODE_ENV') || 'development';
    
    this.logger = winston.createLogger({
      level: environment === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      defaultMeta: { service: 'learning-hub' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              return `[${timestamp}] ${level}: ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta) : ''
              }`;
            }),
          ),
        }),
      ],
    });
  }

  log(message: string, context?: string, ...meta: any[]) {
    this.logger.info(message, { context, ...this.formatMeta(meta) });
  }

  error(message: string, trace?: string, context?: string, ...meta: any[]) {
    this.logger.error(message, { trace, context, ...this.formatMeta(meta) });
  }

  warn(message: string, context?: string, ...meta: any[]) {
    this.logger.warn(message, { context, ...this.formatMeta(meta) });
  }

  debug(message: string, context?: string, ...meta: any[]) {
    this.logger.debug(message, { context, ...this.formatMeta(meta) });
  }

  verbose(message: string, context?: string, ...meta: any[]) {
    this.logger.verbose(message, { context, ...this.formatMeta(meta) });
  }

  private formatMeta(meta: any[]): object {
    if (meta?.length === 1 && typeof meta[0] === 'object') {
      return meta[0];
    }
    return { meta };
  }
}