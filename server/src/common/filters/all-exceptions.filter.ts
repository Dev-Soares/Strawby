import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { PinoLogger } from 'nestjs-pino';

const SENSITIVE_KEYS = new Set([
  'password',
  'pass',
  'pwd',
  'secret',
  'token',
  'access_token',
  'refresh_token',
  'authorization',
  'cookie',
  'jwt',
  'apikey',
  'api_key',
]);

function redact(value: unknown, depth = 0): unknown {
  if (depth > 4 || value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  if (typeof value !== 'object') return value;

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      out[k] = '[REDACTED]';
    } else {
      out[k] = redact(v, depth + 1);
    }
  }
  return out;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isServerError = status >= 500;

    const logPayload: Record<string, unknown> = {
      method: req.method,
      url: req.url,
      statusCode: status,
    };

    if (isServerError && req.body && Object.keys(req.body).length > 0) {
      logPayload.requestBody = redact(req.body);
    }

    if (exception instanceof HttpException) {
      logPayload.errorName = exception.name;
      logPayload.errorMessage = exception.message;
      if (isServerError) {
        logPayload.stack = exception.stack;
        const cause = (exception as any).cause;
        if (cause instanceof Error) {
          logPayload.cause = { message: cause.message, stack: cause.stack };
        } else if (cause !== undefined) {
          logPayload.cause = cause;
        }
      }
    } else if (exception instanceof Error) {
      logPayload.errorName = exception.name;
      logPayload.errorMessage = exception.message;
      logPayload.stack = exception.stack;
    } else {
      logPayload.error = redact(exception);
    }

    if (isServerError) {
      this.logger.error(logPayload);
    } else {
      this.logger.warn(logPayload);
    }

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Erro interno do servidor';

    res.status(status).json({
      statusCode: status,
      message,
    });
  }
}
