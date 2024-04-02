import { logger } from '../utils/logger';
import Koa, { Context } from 'koa';
import {
  ValidationError,
  AuthError,
  InternalError,
  BusinessError,
  ObjectNotFoundError,
  errorHandler,
} from '../utils/error';

const log = logger.extend('middlewares:error');

export const errorMiddleware: Koa.Middleware = async (ctx: Context, next) => {
  try {
    await next();
  } catch (error) {
    errorHandler(error, { type: 'request', request: ctx.request });
    if (error instanceof AuthError) {
      log('AuthError', error);
      ctx.status = 401;
      ctx.body = {
        ok: false,
        error: error.message || 'Invalid authorization',
      };
      return;
    }
    if (error instanceof InternalError) {
      log('InternalError', error);
      ctx.status = 500;
      ctx.body = {
        ok: false,
        error:
                    error.message ||
                    'Something went wrong, you should retry later.',
      };
      return;
    }
    if (error instanceof ValidationError) {
      log('ValidationError:', error.message);
      ctx.status = 400;
      ctx.body = { ok: false, error: error.message };
      return;
    }
    if (error instanceof BusinessError) {
      log('BusinessError:', error.message);
      ctx.status = 403;
      ctx.body = { ok: false, error: error.message };
      return;
    }
    if (error instanceof ObjectNotFoundError) {
      log('ObjectNotFoundError:', error.message);
      ctx.status = 404;
      ctx.body = { ok: false, error: error.message };
      return;
    }
  }
};
