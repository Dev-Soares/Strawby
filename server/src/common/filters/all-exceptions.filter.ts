import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
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
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

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

    if (
      isServerError &&
      req.body &&
      Object.keys(req.body as Record<string, unknown>).length > 0
    ) {
      logPayload.requestBody = redact(req.body as Record<string, unknown>);
    }

    if (exception instanceof HttpException) {
      logPayload.errorName = exception.name;
      logPayload.errorMessage = exception.message;
      if (isServerError) {
        logPayload.stack = exception.stack;
        if ('cause' in exception && exception.cause !== undefined) {
          const { cause } = exception;
          if (cause instanceof Error) {
            logPayload.cause = { message: cause.message, stack: cause.stack };
          } else {
            logPayload.cause = cause;
          }
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
