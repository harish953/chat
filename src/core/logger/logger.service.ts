import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m',
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
};

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: WinstonLogger;

  constructor() {
    const consoleFormat = format.combine(
      format.timestamp(),
      format.printf(({ level, message, timestamp, context, ...meta }) => {
        const colorizeLevel = (lvl: string) => {
          switch (lvl) {
            case 'error':
              return `${colors.fg.red}${colors.bright}ERROR${colors.reset}`;
            case 'warn':
              return `${colors.fg.yellow}${colors.bright}WARN ${colors.reset}`;
            case 'info':
              return `${colors.fg.green}${colors.bright}INFO ${colors.reset}`;
            case 'debug':
              return `${colors.fg.blue}${colors.bright}DEBUG${colors.reset}`;
            default:
              return lvl.toUpperCase();
          }
        };
        const localTimestamp = new Date(timestamp).toLocaleString();
        const formattedTimestamp = `${colors.fg.cyan}${localTimestamp}${colors.reset}`;
        const formattedContext = context ? `${colors.fg.yellow}[${context}]${colors.reset}` : '';
        const formattedMessage = `${colors.bright}${message}${colors.reset}`;
        const formattedMeta = Object.keys(meta).length
          ? `\n${colors.dim}${JSON.stringify(meta, null, 2)}${colors.reset}`
          : '';

        return `${formattedTimestamp} ${colorizeLevel(level)} ${formattedContext} ${formattedMessage} ${formattedMeta}`;
      }),
    );

    const fileFormat = format.combine(
      format.timestamp(),
      format.printf(({ level, message, timestamp, context, ...meta }) => {
        const localTimestamp = new Date(timestamp).toLocaleString();
        const formattedContext = context ? `[${context}]` : '';
        const formattedMessage = message;
        const formattedMeta = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';

        return `${localTimestamp} ${level.toUpperCase()} ${formattedContext} ${formattedMessage} ${formattedMeta}`;
      }),
    );

    this.logger = createLogger({
      level: 'info',
      format: format.timestamp(),
      transports: [
        new transports.Console({
          format: consoleFormat,
        }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: fileFormat,
        }),
        new transports.File({
          filename: 'logs/combined.log',
          format: fileFormat,
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
