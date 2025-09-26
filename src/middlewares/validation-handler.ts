import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((error) => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
      })),
    };

    res.status(400).json(response);
    return;
  }

  next();
};
