import { Logger } from '@nestjs/common';
import { LoggerService } from './logger.service';

export class NestLogger extends Logger {
  private customLogger: LoggerService;

  constructor(context?: string) {
    super(context);
    this.customLogger = new LoggerService();
  }

  log(message: any, context?: string) {
    context = context || this.context;
    this.customLogger.log(message, context);
  }

  error(message: any, trace?: string, context?: string) {
    context = context || this.context;
    this.customLogger.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    context = context || this.context;
    this.customLogger.warn(message, context);
  }

  debug(message: any, context?: string) {
    context = context || this.context;
    this.customLogger.debug(message, context);
  }

  verbose(message: any, context?: string) {
    context = context || this.context;
    this.customLogger.verbose(message, context);
  }
}
