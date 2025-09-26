import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = `Unique constraint violation on field(s): ${err.meta?.target}`;
        break;
      case 'P2025':
        statusCode = 404;
        message = `Record not found: ${err.meta?.cause || ''}`;
        break;
      default:
        statusCode = 400;
        message = `Database error: ${err.message}`;
        break;
    }
  } else if (err instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = 'Validation error: invalid data sent to database';
  }

  logger.error('Request failed', {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    error: {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack,
    },
  });

  res.status(statusCode).json({
    success: false,
    message,
  });
};
